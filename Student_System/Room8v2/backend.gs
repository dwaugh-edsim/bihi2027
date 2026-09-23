/**
 * ============================================================================
 * Room 8 — BACKEND (v2)                                        R8-BE-0.1.0
 * ============================================================================
 * A clean rebuild of the old Student_System/Code.gs on the Google-auth pipe.
 * Identity is a VERIFIED @gnspes.ca email (HMAC-signed by the Identity app),
 * never a PIN. One Students tab keyed by email — no per-class tabs, no
 * cross-sheet finder, no misfiled-row repairs.
 *
 * See Student_System/Room8v2/DESIGN.md for the full spec.
 *
 * ONE-TIME SETUP
 *   1. Create a NEW Google Sheet ("Room 8 v2 — Master"). Extensions -> Apps Script.
 *   2. Paste this file over Code.gs.
 *   3. Project Settings -> Script Properties:
 *        R8_IDENTITY_KEY = <the SAME value as the Identity project>   (HMAC secret)
 *        CLASS_LOG_PIN   = <teacher PIN>                              (teacher writes)
 *   4. Run setup() once (creates the tabs). Authorize when prompted.
 *   5. Deploy -> New deployment -> Web app:
 *        Execute as: Me        Who has access: Anyone
 *      (Trust comes from the signature, not from who calls. "Anyone" is correct.)
 *
 * REDEPLOY REMINDER: bump CONFIG_VERSION, then Deploy -> Manage deployments ->
 * edit -> Version: New version -> Deploy (same URL).
 * ============================================================================
 */

var CONFIG_VERSION = 'R8-BE-0.1.0-2026-09-23';
var CONFIG_DEPLOYED = '2026-09-23T00:00:00Z';

var ALLOWED_DOMAIN = 'gnspes.ca';
var FRESH_MS       = 4 * 60 * 60 * 1000;   // identity signatures valid 4 hours (a class)
var MAX_FULL_TASKS = 5;                     // keep full data for the newest N tasks; stub older

var TAB_ROSTER   = 'Roster';
var TAB_STUDENTS = 'Students';
var TAB_LOG      = 'Submissions_Log';
var TAB_CLASSLOG     = 'Class_Log';
var TAB_PLAN     = 'Class_Plan';
var TAB_SLIDE    = 'Class_Slide';

// Students tab columns
var S_EMAIL=1, S_NAME=2, S_SECTION=3, S_GRADE=4, S_TASK=5, S_LEDGER=6, S_SUMMARY=7, S_UPDATED=8, S_FIRST_TASK_COL=9;

// ============================================================================
// Identity (identical scheme to the Identity app — do not diverge)
// ============================================================================
function identityKey_() {
  return PropertiesService.getScriptProperties().getProperty('R8_IDENTITY_KEY') || '';
}
function signIdentity_(email, ts) {
  var key = identityKey_();
  if (!key) return '';
  var bytes = Utilities.computeHmacSha256Signature(String(email) + '|' + String(ts), key);
  return bytes.map(function (b) { var v = (b < 0 ? b + 256 : b).toString(16); return v.length === 1 ? '0' + v : v; }).join('');
}
function verifyIdentity_(email, ts, sig) {
  email = String(email || '').toLowerCase(); ts = Number(ts || 0); sig = String(sig || '');
  if (!email || !ts || !sig) return { ok: false, reason: 'missing' };
  if (Math.abs(Date.now() - ts) > FRESH_MS) return { ok: false, reason: 'stale_or_future' };
  if (ALLOWED_DOMAIN && email.indexOf('@' + ALLOWED_DOMAIN) === -1) return { ok: false, reason: 'domain_not_allowed' };
  var expected = signIdentity_(email, ts);
  if (!expected || expected.length !== sig.length) return { ok: false, reason: 'bad_sig' };
  var diff = 0;
  for (var i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return { ok: false, reason: 'bad_sig' };
  return { ok: true, email: email };
}

function jsonOut_(obj) {
  obj = obj || {};
  obj.version = CONFIG_VERSION;
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function authFailed_(v) { return jsonOut_({ status: 'auth_failed', reason: v.reason }); }
function md5_(s) { return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, s, Utilities.Charset.UTF_8)
  .map(function (b) { var v = (b < 0 ? b + 256 : b).toString(16); return v.length === 1 ? '0' + v : v; }).join(''); }

// ============================================================================
// Sheets
// ============================================================================
function setup() {
  ensureSheets_(SpreadsheetApp.getActiveSpreadsheet());
  return 'Room 8 v2 backend ready. Version ' + CONFIG_VERSION;
}

function ensureSheets_(ss) {
  ensureTab_(ss, TAB_ROSTER, ['Email', 'First', 'Last', 'Section', 'Grade', 'Courses', 'Updated']);
  ensureTab_(ss, TAB_STUDENTS, ['Email', 'Name', 'Section', 'Grade', 'Task/Stage', 'Ledger (JSON)', 'Summary', 'Last Updated']);
  ensureTab_(ss, TAB_LOG, ['Timestamp', 'Email', 'Section', 'Task', 'Status', 'Summary', 'Data (JSON)', 'requestId']);
  ensureTab_(ss, TAB_CLASSLOG, ['Date', 'Section', 'Course', 'Class #', 'What We Did', 'Next Class', 'Timestamp']);
  ensureTab_(ss, TAB_PLAN, ['Section', 'Next Note', 'Next Class #', 'Updated']);
  ensureTab_(ss, TAB_SLIDE, ['Section', 'Title', 'Announcements', 'Outcome', 'Updated']);
}

function ensureTab_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

function toIsoDate_(v) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Date]') return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(v).trim().slice(0, 10);
}

// ============================================================================
// Roster (email-keyed)
// ============================================================================
function readRoster_(ss) {
  var sh = ss.getSheetByName(TAB_ROSTER);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 7).getValues().map(function (r) {
    return { email: String(r[0] || '').trim().toLowerCase(), first: String(r[1] || ''), last: String(r[2] || ''),
             section: String(r[3] || ''), grade: r[4], courses: String(r[5] || '') };
  }).filter(function (r) { return r.email; });
}

function rosterFor_(ss, email) {
  var list = readRoster_(ss);
  for (var i = 0; i < list.length; i++) {
    if (list[i].email === String(email || '').toLowerCase()) {
      var r = list[i];
      var nm = (r.first + ' ' + (r.last ? r.last.charAt(0).toUpperCase() + '.' : '')).trim();
      return { known: true, first: r.first, last: r.last, name: nm, section: r.section, grade: r.grade, courses: r.courses };
    }
  }
  return { known: false, name: '', section: '', grade: '', courses: '' };
}

// ============================================================================
// Students (one row per verified email; _tasks ledger)
// ============================================================================
function findStudentRow_(sheet, email) {
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var col = sheet.getRange(2, S_EMAIL, last - 1, 1).getValues();
  var needle = String(email).toLowerCase();
  for (var i = 0; i < col.length; i++) if (String(col[i][0]).toLowerCase() === needle) return i + 2;
  return -1;
}

function countCompleted_(data) {
  if (!data || typeof data !== 'object') return 0;
  var n = 0;
  for (var k in data) {
    if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
    if (k.charAt(0) === '_') continue;                       // metadata (_requestId, _telemetry, _v…)
    var v = data[k];
    if (typeof v === 'string') { if (v.trim()) n++; }
    else if (typeof v === 'number' || typeof v === 'boolean') n++;
    else if (Array.isArray(v)) { if (v.some(function (x) { return x !== '' && x != null; })) n++; }
    else if (v && typeof v === 'object') { if (countCompleted_(v) > 0) n++; }
  }
  return n;
}

function applyArchivalCap_(ledger) {
  var keys = Object.keys(ledger._tasks);
  if (keys.length <= MAX_FULL_TASKS) return;
  keys.sort(function (a, b) {
    var ta = ledger._tasks[a].updated || '', tb = ledger._tasks[b].updated || '';
    return String(tb).localeCompare(String(ta));             // newest first
  });
  for (var i = MAX_FULL_TASKS; i < keys.length; i++) {
    var t = ledger._tasks[keys[i]];
    if (t && t.data && Object.keys(t.data).length) { t.data = {}; t._archived = true; }
  }
}

function getOrCreateTaskColumn_(sheet, task) {
  var lastCol = Math.max(sheet.getLastColumn(), S_FIRST_TASK_COL - 1);
  if (lastCol >= S_FIRST_TASK_COL) {
    var heads = sheet.getRange(1, S_FIRST_TASK_COL, 1, lastCol - S_FIRST_TASK_COL + 1).getValues()[0];
    for (var i = 0; i < heads.length; i++) if (String(heads[i]) === task) return S_FIRST_TASK_COL + i;
  }
  var col = lastCol + 1;
  sheet.getRange(1, col).setValue(task).setFontWeight('bold');
  return col;
}

function mergeTaskIntoStudent_(ss, email, p) {
  var sheet = ss.getSheetByName(TAB_STUDENTS);
  var row = findStudentRow_(sheet, email);
  var now = new Date();
  var ledger;
  if (row === -1) {
    ledger = { _v: 1, email: email, name: p.name, section: p.section, grade: p.grade, _tasks: {} };
  } else {
    var raw = String(sheet.getRange(row, S_LEDGER).getValue() || '');
    if (raw.trim()) {
      try { ledger = JSON.parse(raw); } catch (e) {
        ss.getSheetByName(TAB_LOG).appendRow([now, email, '', '__corrupt_backup', 'CORRUPT_CELL', '', raw, '']);
        return { ok: false, message: 'Existing ledger is corrupt; refused to overwrite (backed up to Submissions_Log).' };
      }
    } else { ledger = { _v: 1, email: email, _tasks: {} }; }
    if (!ledger._tasks) ledger._tasks = {};
  }
  ledger._v = 1; ledger.email = email; ledger.name = p.name; ledger.section = p.section; ledger.grade = p.grade;

  var prev = ledger._tasks[p.task];
  if (prev && prev.data && countCompleted_(prev.data) > 0 && countCompleted_(p.data) === 0 && !p.data._forceOverwrite) {
    ledger._tasks[p.task] = { updated: now, summary: p.summary || prev.summary || '', status: 'preserved', data: prev.data };
  } else {
    ledger._tasks[p.task] = { updated: now, summary: p.summary, status: 'submitted', data: p.data };
  }
  applyArchivalCap_(ledger);

  var json = JSON.stringify(ledger);
  if (row === -1) {
    sheet.appendRow([email, p.name, p.section, p.grade, p.task, json, p.summary, now]);
    row = sheet.getLastRow();
  } else {
    sheet.getRange(row, S_NAME).setValue(p.name);
    sheet.getRange(row, S_SECTION).setValue(p.section);
    sheet.getRange(row, S_GRADE).setValue(p.grade);
    sheet.getRange(row, S_TASK).setValue(p.task);
    sheet.getRange(row, S_LEDGER).setValue(json);
    sheet.getRange(row, S_SUMMARY).setValue(p.summary);
    sheet.getRange(row, S_UPDATED).setValue(now);
  }
  var taskCol = getOrCreateTaskColumn_(sheet, p.task);
  sheet.getRange(row, taskCol).setValue('✅ ' + Utilities.formatDate(now, Session.getScriptTimeZone(), 'MMM d'));
  return { ok: true, hash: md5_(json), byteLength: json.length };
}

// ============================================================================
// Teacher gate
// ============================================================================
function requireTeacher_(payload) {
  var pin = PropertiesService.getScriptProperties().getProperty('CLASS_LOG_PIN');
  if (!pin) throw new Error('Teacher writes disabled: set the CLASS_LOG_PIN Script Property (fail-closed).');
  if (String(payload.teacherPin || '') !== String(pin)) throw new Error('Teacher PIN required.');
}

// ============================================================================
// doGet
// ============================================================================
function doGet(e) {
  var p = (e && e.parameter) || {};
  var action = p.action || '';
  try {
    if (action === 'get_health' || !action) return jsonOut_(health_());
    if (action === 'get_class_log') { return jsonOut_(readClassLog_(SpreadsheetApp.getActiveSpreadsheet())); }
    return jsonOut_({ status: 'ok', service: 'Room 8 v2 backend', hint: 'POST an action, or GET ?action=get_health' });
  } catch (err) {
    return jsonOut_({ status: 'error', message: String(err && err.message || err) });
  }
}

function health_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheets_(ss);
  var counts = {};
  [TAB_ROSTER, TAB_STUDENTS, TAB_LOG, TAB_CLASSLOG, TAB_PLAN, TAB_SLIDE].forEach(function (t) {
    var sh = ss.getSheetByName(t); counts[t] = sh ? Math.max(0, sh.getLastRow() - 1) : 0;
  });
  return { status: 'healthy', service: 'Room 8 v2 backend', allowedDomain: ALLOWED_DOMAIN,
           keyConfigured: !!identityKey_(), teacherGateConfigured: !!PropertiesService.getScriptProperties().getProperty('CLASS_LOG_PIN'),
           tabs: counts, deployedAt: CONFIG_DEPLOYED };
}

// ============================================================================
// doPost
// ============================================================================
function doPost(e) {
  var payload;
  try { payload = JSON.parse(e.postData.contents); }
  catch (err) { return jsonOut_({ status: 'error', message: 'Invalid JSON body.' }); }

  var action = payload.action;
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheets_(ss);

    // ---- student (HMAC-verified) ----
    if (action === 'resolve_student')   return studentResolve_(ss, payload);
    if (action === 'submit_assignment') return studentSubmit_(ss, payload);
    if (action === 'load_assignment')   return studentLoad_(ss, payload);
    if (action === 'get_my_tasks')      return studentTasks_(ss, payload);

    // ---- teacher (PIN-gated) ----
    if (action === 'set_roster')        { requireTeacher_(payload); return setRoster_(ss, payload); }
    if (action === 'get_roster_meta')   { requireTeacher_(payload); return getRosterMeta_(ss); }
    if (action === 'get_class_progress'){ requireTeacher_(payload); return getClassProgress_(ss, payload); }
    if (action === 'get_student_history'){ requireTeacher_(payload); return getStudentHistory_(ss, payload); }
    if (action === 'submit_class_log')  { requireTeacher_(payload); return submitClassLog_(ss, payload); }
    if (action === 'set_class_plan')    { requireTeacher_(payload); return setClassPlan_(ss, payload); }
    if (action === 'set_class_slide')   { requireTeacher_(payload); return setClassSlide_(ss, payload); }
    if (action === 'delete_class_log')  { requireTeacher_(payload); return deleteClassLog_(ss, payload); }
    if (action === 'get_class_log')     { requireTeacher_(payload); return jsonOut_(readClassLog_(ss)); }
    if (action === 'selftest')          { requireTeacher_(payload); return selftest_(ss); }

    return jsonOut_({ status: 'error', message: 'Unknown action: ' + action });
  } catch (err) {
    return jsonOut_({ status: 'error', message: String(err && err.message || err) });
  }
}

// ============================================================================
// Student actions
// ============================================================================
function studentResolve_(ss, payload) {
  var id = verifyIdentity_(payload.email, payload.ts, payload.sig);
  if (!id.ok) return authFailed_(id);
  var r = rosterFor_(ss, id.email);
  return jsonOut_({ status: 'ok', known: r.known, email: id.email, first: r.first, last: r.last,
                    name: r.name, section: r.section, grade: r.grade, courses: r.courses });
}

function studentSubmit_(ss, payload) {
  var id = verifyIdentity_(payload.email, payload.ts, payload.sig);
  if (!id.ok) return authFailed_(id);
  var task = String(payload.task || '').trim();
  if (!task) return jsonOut_({ status: 'error', message: 'task is required' });
  var requestId = String(payload.requestId || '');

  var log = ss.getSheetByName(TAB_LOG);
  if (requestId && logHasRequest_(log, requestId)) {
    return jsonOut_({ status: 'submitted_successfully', deduplicated: true, task: task, email: id.email });
  }

  var who = rosterFor_(ss, id.email);
  var section = who.known ? who.section : String(payload.section || '');
  var name = who.known ? who.name : String(payload.name || '');
  var data = payload.data || {};
  if (requestId) data._requestId = requestId;

  // 1) append to the ledger OUTSIDE the lock — durable even if the merge times out
  log.appendRow([new Date(), id.email, section, task, 'Submitted', String(payload.summary || ''), JSON.stringify(data), requestId]);

  // 2) merge into the student row INSIDE the lock
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  var res;
  try { res = mergeTaskIntoStudent_(ss, id.email, { name: name, section: section, grade: who.grade, task: task, summary: String(payload.summary || ''), data: data }); }
  finally { lock.releaseLock(); }

  if (!res.ok) return jsonOut_({ status: 'error', message: res.message });
  return jsonOut_({ status: 'submitted_successfully', task: task, email: id.email, section: section,
                    known: who.known, timestamp: new Date(), hash: res.hash, byteLength: res.byteLength });
}

function studentLoad_(ss, payload) {
  var id = verifyIdentity_(payload.email, payload.ts, payload.sig);
  if (!id.ok) return authFailed_(id);
  var task = String(payload.task || '');
  var sheet = ss.getSheetByName(TAB_STUDENTS);
  var row = findStudentRow_(sheet, id.email);
  if (row !== -1) {
    var raw = String(sheet.getRange(row, S_LEDGER).getValue() || '');
    if (raw.trim()) {
      var ledger = null;
      try { ledger = JSON.parse(raw); } catch (e) { ledger = null; }
      var t = ledger && ledger._tasks && ledger._tasks[task];
      if (t && t.data !== undefined && !t._archived) {
        return jsonOut_({ status: 'ok', found: true, data: t.data, summary: t.summary || '',
                          section: ledger.section || '', savedAt: t.updated || null });
      }
    }
  }
  // fallback: newest log row for (email, task)
  var log = ss.getSheetByName(TAB_LOG);
  var last = log.getLastRow();
  if (last > 1) {
    var rows = log.getRange(2, 1, last - 1, 8).getValues();
    for (var i = rows.length - 1; i >= 0; i--) {
      if (String(rows[i][1]).toLowerCase() === id.email && String(rows[i][3]) === task) {
        var d = {};
        try { d = JSON.parse(rows[i][6] || '{}'); } catch (e) {}
        return jsonOut_({ status: 'ok', found: true, data: d, summary: String(rows[i][5] || ''),
                          section: String(rows[i][2] || ''), savedAt: rows[i][0] });
      }
    }
  }
  return jsonOut_({ status: 'ok', found: false });
}

function studentTasks_(ss, payload) {
  var id = verifyIdentity_(payload.email, payload.ts, payload.sig);
  if (!id.ok) return authFailed_(id);
  var sheet = ss.getSheetByName(TAB_STUDENTS);
  var row = findStudentRow_(sheet, id.email);
  var out = {};
  if (row !== -1) {
    var raw = String(sheet.getRange(row, S_LEDGER).getValue() || '');
    if (raw.trim()) {
      var ledger = null; try { ledger = JSON.parse(raw); } catch (e) {}
      if (ledger && ledger._tasks) {
        Object.keys(ledger._tasks).forEach(function (k) {
          var t = ledger._tasks[k];
          out[k] = { updated: t.updated || null, summary: t.summary || '', status: t.status || '',
                     written: countCompleted_(t.data) > 0 || !!t._archived };
        });
      }
    }
  }
  return jsonOut_({ status: 'ok', email: id.email, tasks: out });
}

// ============================================================================
// Teacher actions
// ============================================================================
function setRoster_(ss, payload) {
  var roster = payload.roster || {};
  var students = Array.isArray(roster.students) ? roster.students : [];
  var seen = {}, rows = [], dupes = 0;
  students.forEach(function (s) {
    var email = String(s.email || '').trim().toLowerCase();
    if (!email || seen[email]) { if (email) dupes++; return; }
    seen[email] = 1;
    rows.push([email, String(s.first || ''), String(s.last || ''), String(s.section || ''), s.grade || '', String(s.courses || ''), new Date()]);
  });
  var sh = ss.getSheetByName(TAB_ROSTER);
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 7).clearContent();
    if (rows.length) sh.getRange(2, 1, rows.length, 7).setValues(rows);
  } finally { lock.releaseLock(); }
  return jsonOut_({ status: 'roster_saved', count: rows.length, duplicatesSkipped: dupes, updated: roster.updated || '' });
}

function getRosterMeta_(ss) {
  var list = readRoster_(ss);
  var perSection = {};
  list.forEach(function (r) { perSection[r.section || '(none)'] = (perSection[r.section || '(none)'] || 0) + 1; });
  return jsonOut_({ status: 'ok', count: list.length, perSection: perSection });
}

function getClassProgress_(ss, payload) {
  var slim = payload.slim === true || payload.slim === '1';
  var wantSection = String(payload.section || '').trim();
  var sheet = ss.getSheetByName(TAB_STUDENTS);
  var rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues() : [];
  var out = [];
  rows.forEach(function (r) {
    if (!String(r[0] || '').trim()) return;
    var section = String(r[2] || '');
    if (wantSection && section !== wantSection) return;
    var rec = { email: String(r[0]), name: String(r[1]), section: section, grade: r[3],
                task: String(r[4] || ''), summary: String(r[6] || ''), lastUpdated: r[7] };
    var ledger = null; try { ledger = JSON.parse(String(r[5] || '{}')); } catch (e) {}
    var tasks = {};
    if (ledger && ledger._tasks) Object.keys(ledger._tasks).forEach(function (k) {
      tasks[k] = { summary: ledger._tasks[k].summary || '', written: countCompleted_(ledger._tasks[k].data) > 0 || !!ledger._tasks[k]._archived };
    });
    rec.tasks = tasks;
    if (!slim) rec.ledger = ledger;
    out.push(rec);
  });
  return jsonOut_({ status: 'ok', count: out.length, students: out });
}

function getStudentHistory_(ss, payload) {
  var email = String(payload.email || '').toLowerCase();
  var log = ss.getSheetByName(TAB_LOG);
  var rows = log.getLastRow() > 1 ? log.getRange(2, 1, log.getLastRow() - 1, 8).getValues() : [];
  var hist = [];
  rows.forEach(function (r) {
    if (String(r[1]).toLowerCase() !== email) return;
    hist.push({ timestamp: r[0], section: String(r[2] || ''), task: String(r[3] || ''),
                status: String(r[4] || ''), summary: String(r[5] || '') });
  });
  return jsonOut_({ status: 'ok', email: email, count: hist.length, history: hist });
}

function selftest_(ss) {
  var problems = [];
  var roster = readRoster_(ss);
  var dupes = {};
  roster.forEach(function (r) { dupes[r.email] = (dupes[r.email] || 0) + 1; });
  Object.keys(dupes).forEach(function (e) { if (dupes[e] > 1) problems.push('Duplicate roster email: ' + e); });
  var noSection = roster.filter(function (r) { return !r.section; }).length;
  if (noSection) problems.push(noSection + ' roster entries have no section (auto-section will fall back).');

  var students = ss.getSheetByName(TAB_STUDENTS);
  var sRows = students.getLastRow() > 1 ? students.getRange(2, 1, students.getLastRow() - 1, 6).getValues() : [];
  var rosterEmails = {}; roster.forEach(function (r) { rosterEmails[r.email] = 1; });
  var notInRoster = 0, badLedger = 0;
  sRows.forEach(function (r) {
    var e = String(r[0] || '').toLowerCase();
    if (!e) return;
    if (!rosterEmails[e]) notInRoster++;
    if (String(r[5] || '').trim()) { try { JSON.parse(String(r[5])); } catch (err) { badLedger++; } }
  });
  if (notInRoster) problems.push(notInRoster + ' Students rows are not in the Roster (unknown email).');
  if (badLedger) problems.push(badLedger + ' Students rows have unparseable ledger JSON.');

  return jsonOut_({ status: problems.length ? 'warnings' : 'clean', problems: problems,
                    roster: roster.length, students: sRows.length,
                    log: Math.max(0, ss.getSheetByName(TAB_LOG).getLastRow() - 1) });
}

// ============================================================================
// Class Log / Plan / Slide  (ported from V6.x; same schemas)
// ============================================================================
function readClassLog_(ss) {
  var log = ss.getSheetByName(TAB_CLASSLOG), plan = ss.getSheetByName(TAB_PLAN), slide = ss.getSheetByName(TAB_SLIDE);
  var entries = [], plans = {}, slides = {};
  if (log && log.getLastRow() > 1) log.getRange(2, 1, log.getLastRow() - 1, 7).getValues().forEach(function (r) {
    if (!String(r[0] || '').trim() && !String(r[1] || '').trim()) return;
    entries.push({ date: toIsoDate_(r[0]), section: String(r[1] || ''), course: String(r[2] || ''),
                   classNo: String(r[3] || ''), did: String(r[4] || ''), next: String(r[5] || ''), timestamp: r[6] });
  });
  if (plan && plan.getLastRow() > 1) plan.getRange(2, 1, plan.getLastRow() - 1, 4).getValues().forEach(function (r) {
    if (String(r[0] || '').trim()) plans[String(r[0])] = { note: String(r[1] || ''), classNo: String(r[2] || ''), updated: r[3] };
  });
  if (slide && slide.getLastRow() > 1) slide.getRange(2, 1, slide.getLastRow() - 1, 5).getValues().forEach(function (r) {
    if (String(r[0] || '').trim()) slides[String(r[0])] = { title: String(r[1] || ''), announcements: String(r[2] || ''), outcome: String(r[3] || ''), updated: r[4] };
  });
  return { status: 'success', entries: entries, plans: plans, slides: slides };
}

function findRowByKey_(sheet, key) {
  if (sheet.getLastRow() < 2) return -1;
  var col = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < col.length; i++) if (String(col[i][0]).trim() === key) return i + 2;
  return -1;
}

function submitClassLog_(ss, payload) {
  var e = payload.entry || {};
  var date = toIsoDate_(e.date), section = String(e.section || '').trim();
  if (!date || !section) throw new Error('entry.date and entry.section are required.');
  var sh = ss.getSheetByName(TAB_CLASSLOG);
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  var status;
  try {
    var key = date + '||' + section, row = findRowByKey2_(sh, key);
    var vals = [date, section, String(e.course || ''), String(e.classNo || ''), String(e.did || ''), String(e.next || ''), new Date()];
    if (row === -1) { sh.appendRow(vals); status = 'class_log_saved'; } else { sh.getRange(row, 1, 1, 7).setValues([vals]); status = 'class_log_updated'; }
    if (String(e.next || '').trim()) writeClassPlan_(ss, section, String(e.next), e.classNo ? String(Number(e.classNo) + 1) : '');
  } finally { lock.releaseLock(); }
  return jsonOut_({ status: status, date: date, section: section });
}

// Class_Log upsert key is date+section → "date||section" stored in a hidden pairing
function findRowByKey2_(sheet, key) {
  if (sheet.getLastRow() < 2) return -1;
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  for (var i = 0; i < rows.length; i++) if (toIsoDate_(rows[i][0]) + '||' + String(rows[i][1]).trim() === key) return i + 2;
  return -1;
}

function writeClassPlan_(ss, section, note, classNo) {
  var sh = ss.getSheetByName(TAB_PLAN);
  var row = findRowByKey_(sh, section);
  var vals = [section, note, classNo || '', new Date()];
  if (row === -1) sh.appendRow(vals); else sh.getRange(row, 1, 1, 4).setValues([vals]);
}

function setClassPlan_(ss, payload) {
  var section = String(payload.section || '').trim();
  if (!section) throw new Error('section is required.');
  var note = String(payload.note || '');
  var sh = ss.getSheetByName(TAB_PLAN);
  var row = findRowByKey_(sh, section);
  if (!note.trim() && !String(payload.classNo || '').trim()) {
    if (row !== -1) sh.deleteRow(row);
    return jsonOut_({ status: 'class_plan_cleared', section: section });
  }
  var vals = [section, note, String(payload.classNo || ''), new Date()];
  if (row === -1) sh.appendRow(vals); else sh.getRange(row, 1, 1, 4).setValues([vals]);
  return jsonOut_({ status: 'class_plan_set', section: section });
}

function setClassSlide_(ss, payload) {
  var section = String(payload.section || '').trim();
  if (!section) throw new Error('section is required.');
  var title = String(payload.title || ''), ann = String(payload.announcements || ''), outcome = String(payload.outcome || '');
  var sh = ss.getSheetByName(TAB_SLIDE);
  var row = findRowByKey_(sh, section);
  if (!title.trim() && !ann.trim() && !outcome.trim()) {
    if (row !== -1) sh.deleteRow(row);
    return jsonOut_({ status: 'class_slide_cleared', section: section });
  }
  var vals = [section, title, ann, outcome, new Date()];
  if (row === -1) sh.appendRow(vals); else sh.getRange(row, 1, 1, 5).setValues([vals]);
  return jsonOut_({ status: 'class_slide_set', section: section });
}

function deleteClassLog_(ss, payload) {
  var date = toIsoDate_(payload.date), section = String(payload.section || '').trim();
  var sh = ss.getSheetByName(TAB_CLASSLOG);
  var removed = 0;
  for (var r = sh.getLastRow(); r >= 2; r--) {
    if (toIsoDate_(sh.getRange(r, 1).getValue()) === date && String(sh.getRange(r, 2).getValue()).trim() === section) {
      sh.deleteRow(r); removed++;
    }
  }
  return jsonOut_({ status: 'class_log_deleted', date: date, section: section, removed: removed });
}

function logHasRequest_(log, requestId) {
  var last = log.getLastRow();
  if (last < 2) return false;
  var start = Math.max(2, last - 99);
  var col = log.getRange(start, 8, last - start + 1, 1).getValues();
  for (var i = col.length - 1; i >= 0; i--) if (String(col[i][0]) === requestId) return true;
  return false;
}