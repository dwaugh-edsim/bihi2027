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
 *        TEACHER_EMAILS  = <staff addresses, e.g. dwaugh@gnspes.ca>   (teacher sign-in)
 *        CLASS_LOG_PIN   = <teacher PIN>                              (fallback only)
 *   4. Run setup() once (creates the tabs). Authorize when prompted.
 *   5. Deploy -> New deployment -> Web app:
 *        Execute as: Me        Who has access: Anyone
 *      (Trust comes from the signature, not from who calls. "Anyone" is correct.)
 *
 * REDEPLOY REMINDER: bump CONFIG_VERSION, then Deploy -> Manage deployments ->
 * edit -> Version: New version -> Deploy (same URL).
 * ============================================================================
 */

var CONFIG_VERSION = 'R8-BE-0.7.0-2026-09-24';
var CONFIG_DEPLOYED = '2026-09-24T19:45:00Z';

var ALLOWED_DOMAIN = 'gnspes.ca';
var FRESH_MS       = 4 * 60 * 60 * 1000;   // identity signatures valid 4 hours (a class)
var MAX_FULL_TASKS = 5;                     // keep full data for the newest N tasks; stub older

var TAB_ROSTER   = 'Roster';
var TAB_STUDENTS = 'Students';
var TAB_LOG      = 'Submissions_Log';
var TAB_CLASSLOG     = 'Class_Log';
var TAB_PLAN     = 'Class_Plan';
var TAB_SLIDE    = 'Class_Slide';
var TAB_FEEDBACK = 'Feedback';

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
  var fb = ensureTab_(ss, TAB_FEEDBACK, ['Timestamp', 'Email', 'Name', 'Section', 'Task', 'Feedback']);
  fb.setColumnWidth(6, 380);
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

function taskDataUnchanged_(ss, email, task, incoming) {
  var sheet = ss.getSheetByName(TAB_STUDENTS);
  var row = findStudentRow_(sheet, email);
  if (row === -1) return false;
  var raw = String(sheet.getRange(row, S_LEDGER).getValue() || '');
  if (!raw.trim()) return false;
  var ledger = null; try { ledger = JSON.parse(raw); } catch (e) { return false; }
  var t = ledger && ledger._tasks && ledger._tasks[task];
  if (!t || !t.data) return false;
  function strip(o) { var c = JSON.parse(JSON.stringify(o || {})); delete c._requestId; delete c._telemetry; return c; }
  return md5_(JSON.stringify(strip(t.data))) === md5_(JSON.stringify(strip(incoming)));
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
// Teacher gate — two accepted proofs, in order:
//   1. VERIFIED identity: an HMAC-signed @gnspes.ca email (from the Identity
//      app, same token students get) whose address is listed in the
//      TEACHER_EMAILS Script Property. No secret travels through the URL.
//   2. LEGACY PIN (fallback, e.g. a personal account that can't sign in):
//      teacherPin must match CLASS_LOG_PIN. Fail-closed: if neither the
//      allowlist nor the PIN is configured, teacher actions refuse to run.
// ============================================================================
function teacherIdentityOk_(payload) {
  var v = verifyIdentity_(payload.email, payload.ts, payload.sig);
  if (!v.ok) return false;
  var allow = String(PropertiesService.getScriptProperties().getProperty('TEACHER_EMAILS') || '')
    .toLowerCase().split(/[\s,;]+/).filter(function (x) { return !!x; });
  return allow.indexOf(v.email) !== -1;
}
function requireTeacher_(payload) {
  if (payload.email && payload.ts && payload.sig) {
    if (teacherIdentityOk_(payload)) return;                       // signed staff identity
    // identity present but not on staff list — fall through to the PIN check,
    // so a teacher on the wrong account still gets an explicit gate, never access.
  }
  var pin = PropertiesService.getScriptProperties().getProperty('CLASS_LOG_PIN');
  if (!pin) throw new Error('Teacher access disabled: set TEACHER_EMAILS (preferred) or CLASS_LOG_PIN (fail-closed).');
  if (String(payload.teacherPin || '') !== String(pin)) throw new Error('Teacher sign-in or PIN required.');
}

// ============================================================================
// doGet
// ============================================================================
function doOptions(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
}

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
  [TAB_ROSTER, TAB_STUDENTS, TAB_LOG, TAB_CLASSLOG, TAB_PLAN, TAB_SLIDE, TAB_FEEDBACK].forEach(function (t) {
    var sh = ss.getSheetByName(t); counts[t] = sh ? Math.max(0, sh.getLastRow() - 1) : 0;
  });
  var props = PropertiesService.getScriptProperties();
  var staffList = String(props.getProperty('TEACHER_EMAILS') || '').split(/[\s,;]+/).filter(function (x) { return !!x; });
  return { status: 'healthy', service: 'Room 8 v2 backend', allowedDomain: ALLOWED_DOMAIN,
           keyConfigured: !!identityKey_(), teacherGateConfigured: !!(props.getProperty('CLASS_LOG_PIN') || staffList.length),
           teacherSignInReady: staffList.length > 0, staffCount: staffList.length,
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
    if (action === 'get_task_progress') { requireTeacher_(payload); return getTaskProgress_(ss, payload); }
    if (action === 'get_student_history'){ requireTeacher_(payload); return getStudentHistory_(ss, payload); }
    if (action === 'submit_class_log')  { requireTeacher_(payload); return submitClassLog_(ss, payload); }
    if (action === 'set_class_plan')    { requireTeacher_(payload); return setClassPlan_(ss, payload); }
    if (action === 'set_class_slide')   { requireTeacher_(payload); return setClassSlide_(ss, payload); }
    if (action === 'delete_class_log')  { requireTeacher_(payload); return deleteClassLog_(ss, payload); }
    if (action === 'bootstrap_roster_from_legacy') { requireTeacher_(payload); return bootstrapRoster_(ss, payload); }
    if (action === 'migrate_legacy_submissions')  { requireTeacher_(payload); return migrateLegacySubmissions_(ss, payload); }
    if (action === 'import_submissions')          { requireTeacher_(payload); return importSubmissions_(ss, payload); }
    if (action === 'get_class_log')     { requireTeacher_(payload); return jsonOut_(readClassLog_(ss)); }
    if (action === 'selftest')          { requireTeacher_(payload); return selftest_(ss); }
    if (action === 'set_feedback')      { requireTeacher_(payload); return setFeedback_(ss, payload); }
    if (action === 'get_feedback')      { requireTeacher_(payload); return getFeedback_(ss, payload); }
    if (action === 'get_overview')      { requireTeacher_(payload); return getOverview_(ss); }
    if (action === 'export_class')      { requireTeacher_(payload); return exportClass_(ss, payload); }

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
  var sec = r.section;
  if (r.known && sec && payload.course) {
    sec = sectionForCourse_(sec, payload.course);
  }
  return jsonOut_({ status: 'ok', known: r.known, email: id.email, first: r.first, last: r.last,
                    name: r.name, homeroom: r.section, section: sec, grade: r.grade, courses: r.courses });
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

  // Autosave spam guard: if the incoming data is identical to what's already stored
  // for this (email, task), skip the log append and ledger merge entirely.
  if (taskDataUnchanged_(ss, id.email, task, payload.data || {})) {
    return jsonOut_({ status: 'submitted_successfully', unchanged: true, task: task, email: id.email });
  }

  var who = rosterFor_(ss, id.email);
  var section = String(payload.section || '');
  if (!section && who.known && who.section) {
    section = sectionForCourse_(who.section, payload.course || task);
  }
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
        var fb = feedbackMap_(ss)[id.email + '||' + task];
        return jsonOut_({ status: 'ok', found: true, data: t.data, summary: t.summary || '',
                          section: ledger.section || '', savedAt: t.updated || null,
                          feedback: fb ? fb.text : '', feedbackAt: fb ? fb.ts : null });
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
        var fb2 = feedbackMap_(ss)[id.email + '||' + task];
        return jsonOut_({ status: 'ok', found: true, data: d, summary: String(rows[i][5] || ''),
                          section: String(rows[i][2] || ''), savedAt: rows[i][0],
                          feedback: fb2 ? fb2.text : '', feedbackAt: fb2 ? fb2.ts : null });
      }
    }
  }
  var fb3 = feedbackMap_(ss)[id.email + '||' + task];
  return jsonOut_({ status: 'ok', found: false, feedback: fb3 ? fb3.text : '', feedbackAt: fb3 ? fb3.ts : null });
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
        var fbMap = feedbackMap_(ss);
        Object.keys(ledger._tasks).forEach(function (k) {
          var t = ledger._tasks[k];
          out[k] = { updated: t.updated || null, summary: t.summary || '', status: t.status || '',
                     written: countCompleted_(t.data) > 0 || !!t._archived };
          var fb = fbMap[id.email + '||' + k];
          if (fb) out[k].feedback = fb.text;
        });
      }
    }
  }
  return jsonOut_({ status: 'ok', email: id.email, tasks: out });
}

// ============================================================================
// Teacher feedback  (Feedback tab, append-only; latest row per email+task wins)
// ============================================================================
/** Map of "email||task" -> { text, ts, name, section } — newest occurrence wins. */
function feedbackMap_(ss) {
  var sh = ss.getSheetByName(TAB_FEEDBACK);
  var map = {};
  if (!sh || sh.getLastRow() < 2) return map;
  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, 6).getValues();
  for (var i = 0; i < rows.length; i++) {
    var email = String(rows[i][1] || '').trim().toLowerCase();
    var task = String(rows[i][4] || '');
    if (!email || !task) continue;
    map[email + '||' + task] = { text: String(rows[i][5] || ''), ts: rows[i][0],
                                  name: String(rows[i][2] || ''), section: String(rows[i][3] || '') };
  }
  return map;
}

function setFeedback_(ss, payload) {
  var email = String(payload.email || '').trim().toLowerCase();
  var task = String(payload.task || '').trim();
  var text = String(payload.feedback || '').trim();
  if (!email || !task) return jsonOut_({ status: 'error', message: 'email and task are required.' });
  if (!/@gnspes\.ca$/i.test(email)) return jsonOut_({ status: 'error', message: 'email must be @gnspes.ca' });
  var who = rosterFor_(ss, email);
  var sh = ss.getSheetByName(TAB_FEEDBACK);
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try { sh.appendRow([new Date(), email, who.known ? who.name : String(payload.name || ''),
                      String(payload.section || who.section || ''), task, text]); }
  finally { lock.releaseLock(); }
  return jsonOut_({ status: 'feedback_saved', email: email, task: task, empty: !text });
}

function getFeedback_(ss, payload) {
  var wantSection = String(payload.section || '').trim();
  var wantTask = String(payload.task || '').trim();
  var map = feedbackMap_(ss), out = [];
  Object.keys(map).forEach(function (k) {
    var f = map[k];
    if (wantSection && f.section !== wantSection) return;
    if (wantTask && k.split('||').slice(1).join('||') !== wantTask) return;
    out.push({ email: k.split('||')[0], task: k.split('||').slice(1).join('||'),
               name: f.name, section: f.section, feedback: f.text, ts: f.ts });
  });
  return jsonOut_({ status: 'ok', count: out.length, feedback: out });
}

// ============================================================================
// GAS Station overview: sections + tasks with submitted/started counts
// ============================================================================
function getOverview_(ss) {
  var sheet = ss.getSheetByName(TAB_STUDENTS);
  var rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues() : [];
  var sections = {}, tasks = {}, nStudents = 0;
  rows.forEach(function (r) {
    if (!String(r[0] || '').trim()) return;
    nStudents++;
    var section = String(r[2] || '') || '(none)';
    sections[section] = (sections[section] || 0) + 1;
    var ledger = null; try { ledger = JSON.parse(String(r[5] || '{}')); } catch (e) {}
    if (!ledger || !ledger._tasks) return;
    Object.keys(ledger._tasks).forEach(function (tName) {
      var t = ledger._tasks[tName];
      if (t._archived) return;
      var written = countCompleted_(t.data) > 0;
      if (!tasks[tName]) tasks[tName] = { name: tName, submitted: 0, started: 0, bySection: {} };
      var bs = tasks[tName].bySection[section] || { submitted: 0, started: 0 };
      if (written) { tasks[tName].submitted++; bs.submitted++; } else { tasks[tName].started++; bs.started++; }
      tasks[tName].bySection[section] = bs;
    });
  });
  var taskList = Object.keys(tasks).map(function (k) { return tasks[k]; })
    .sort(function (a, b) { return b.submitted + b.started - (a.submitted + a.started); });
  var fbCount = 0;
  var fbMap = feedbackMap_(ss); Object.keys(fbMap).forEach(function (k) { if (fbMap[k].text) fbCount++; });
  return jsonOut_({ status: 'ok', students: nStudents, sections: sections, tasks: taskList, feedbackGiven: fbCount });
}

// ============================================================================
// Class-set export (teacher): a self-contained .json of a whole class.
// Log-backed recovery: the Students ledger caps full data at MAX_FULL_TASKS and
// stubs older tasks (_archived). The Submissions_Log is the durable stream, so we
// rebuild any archived task's answers from its newest log row — exports stay
// complete all year regardless of the archival cap.
// ============================================================================
function logIndexForRecovery_(ss) {
  // email||task -> newest { data, summary, ts, section } from the append-only log
  var log = ss.getSheetByName(TAB_LOG);
  var idx = {};
  if (!log || log.getLastRow() < 2) return idx;
  var rows = log.getRange(2, 1, log.getLastRow() - 1, 8).getValues();
  for (var i = 0; i < rows.length; i++) {          // ascending; later rows overwrite -> newest wins
    var email = String(rows[i][1] || '').toLowerCase();
    var task = String(rows[i][3] || '');
    if (!email || !task) continue;
    var data = null;
    try { data = JSON.parse(String(rows[i][6] || '') || 'null'); } catch (e) { data = null; }
    if (!data) continue;                            // skip empty/corrupt log cells
    idx[email + '||' + task] = { data: data, summary: String(rows[i][5] || ''),
                                  ts: rows[i][0], section: String(rows[i][2] || '') };
  }
  return idx;
}

function exportClass_(ss, payload) {
  var wantSection = String(payload.section || '').trim();
  var wantTask = String(payload.task || '').trim();       // '' = every task for the class
  var sheet = ss.getSheetByName(TAB_STUDENTS);
  var rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues() : [];
  var fbMap = feedbackMap_(ss);
  var logIdx = logIndexForRecovery_(ss);

  var students = [], recovered = 0, taskSet = {};
  rows.forEach(function (r) {
    var email = String(r[0] || '').trim().toLowerCase();
    if (!email) return;
    var section = String(r[2] || '');
    if (wantSection && section !== wantSection) return;
    var ledger = null; try { ledger = JSON.parse(String(r[5] || '{}')); } catch (e) { ledger = null; }

    var tasksOut = {};
    var seenTasks = {};
    if (ledger && ledger._tasks) {
      Object.keys(ledger._tasks).forEach(function (tName) {
        if (wantTask && tName !== wantTask) return;
        var t = ledger._tasks[tName] || {};
        var data = t.data;
        var status = t._archived ? 'archived' : (countCompleted_(data) > 0 ? 'submitted' : 'started');
        // recover archived (or empty-but-logged) answers from the durable log
        if ((t._archived || !data || !Object.keys(data).length)) {
          var rec = logIdx[email + '||' + tName];
          if (rec && countCompleted_(rec.data) > 0) { data = rec.data; status = 'submitted'; recovered++; }
        }
        var fb = fbMap[email + '||' + tName];
        tasksOut[tName] = {
          status: status, updated: t.updated || null, summary: t.summary || '',
          answers: data || {}, telemetry: (data && data._telemetry) || null,
          feedback: fb ? fb.text : '', feedbackAt: fb ? fb.ts : null
        };
        seenTasks[tName] = 1; taskSet[tName] = 1;
      });
    }
    // a task present ONLY in the log (never merged, or merged then archived away) —
    // include it so the export is a true superset when no task filter is set.
    if (!wantTask) {
      Object.keys(logIdx).forEach(function (key) {
        var parts = key.split('||');
        if (parts[0] !== email || seenTasks[parts[1]]) return;
        var rec = logIdx[key];
        if (countCompleted_(rec.data) === 0) return;
        var fb2 = fbMap[key];
        tasksOut[parts[1]] = { status: 'submitted', updated: rec.ts, summary: rec.summary,
                                answers: rec.data, telemetry: (rec.data && rec.data._telemetry) || null,
                                feedback: fb2 ? fb2.text : '', feedbackAt: fb2 ? fb2.ts : null, fromLog: true };
        taskSet[parts[1]] = 1; recovered++;
      });
    }

    students.push({ email: email, name: String(r[1] || ''), section: section, grade: r[3],
                    lastUpdated: r[7] || null, tasks: tasksOut });
  });

  students.sort(function (a, b) { return String(a.name).localeCompare(String(b.name)); });
  return jsonOut_({
    status: 'ok', exportedAt: new Date(), backendVersion: CONFIG_VERSION,
    class: wantSection || '(all classes)', task: wantTask || '(all tasks)',
    studentCount: students.length, recoveredFromLog: recovered,
    tasks: Object.keys(taskSet).sort(), students: students
  });
}

// ============================================================================
// Teacher actions
// ============================================================================
function setRoster_(ss, payload) {
  var roster = payload.roster || {};
  var mode = String(payload.mode || 'replace');   // 'replace' clears the tab; 'merge' upserts and never deletes
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
  var count = rows.length;
  try {
    if (mode === 'merge') {
      var last = sh.getLastRow();
      var existing = last > 1 ? sh.getRange(2, 1, last - 1, 7).getValues() : [];
      var byEmail = {};
      rows.forEach(function (r) { byEmail[r[0]] = r; });
      var out = [];
      existing.forEach(function (er) {
        var em = String(er[0] || '').trim().toLowerCase();
        if (!em) return;
        if (byEmail[em]) { out.push(byEmail[em]); delete byEmail[em]; } else { out.push(er); }
      });
      Object.keys(byEmail).forEach(function (em) { out.push(byEmail[em]); });
      if (last > 1) sh.getRange(2, 1, last - 1, 7).clearContent();
      if (out.length) sh.getRange(2, 1, out.length, 7).setValues(out);
      count = out.length;
    } else {
      if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 7).clearContent();
      if (rows.length) sh.getRange(2, 1, rows.length, 7).setValues(rows);
    }
  } finally { lock.releaseLock(); }
  return jsonOut_({ status: 'roster_saved', mode: mode, count: count, duplicatesSkipped: dupes, updated: roster.updated || '' });
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

// Marking view for ONE task: who has submitted, who started, with their answers.
function getTaskProgress_(ss, payload) {
  var task = String(payload.task || '');
  if (!task) throw new Error('task is required.');
  var wantSection = String(payload.section || '').trim();
  var sheet = ss.getSheetByName(TAB_STUDENTS);
  var rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues() : [];
  var students = [], submitted = 0, started = 0;
  var fbMap = feedbackMap_(ss);
  rows.forEach(function (r) {
    if (!String(r[0] || '').trim()) return;
    if (wantSection && String(r[2] || '') !== wantSection) return;
    var ledger = null; try { ledger = JSON.parse(String(r[5] || '{}')); } catch (e) { return; }
    var t = ledger && ledger._tasks && ledger._tasks[task];
    if (!t) return;
    var written = countCompleted_(t.data) > 0 || !!t._archived;
    if (written) submitted++; else started++;
    var fb = fbMap[String(r[0]).toLowerCase() + '||' + task];
    students.push({ email: String(r[0]), name: String(r[1]), section: String(r[2] || ''),
                    updated: t.updated || null, summary: t.summary || '', written: written,
                    feedback: fb ? fb.text : '',
                    data: payload.includeData ? t.data : undefined });
  });
  return jsonOut_({ status: 'ok', task: task, section: wantSection,
                    submitted: submitted, started: started, count: students.length, students: students });
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

// ============================================================================
// LEGACY MIGRATION (old V6.x Master Sheet -> v2)
// Matching rule: the old system keys students by PIN; v2 keys by verified email.
// The bridge is the EMAIL COLUMN of the old class tabs (~80% coverage). Students
// without an email are reported, not guessed — when they later sign in with Google
// their verified email enters the roster and the teacher can attach their old row.
// Both actions are DRY-RUN BY DEFAULT: nothing writes until dryRun:false.
// Requires Script Property LEGACY_SHEET_ID = the old Master Sheet's spreadsheet ID.
// ============================================================================
function legacySheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('LEGACY_SHEET_ID');
  if (!id) throw new Error('Set the LEGACY_SHEET_ID Script Property (the old Master Sheet spreadsheet ID, from its URL).');
  return SpreadsheetApp.openById(id);
}
var LEGACY_CLASS_TABS = ['901', '902', '903', '801', '802', '803', '804'];

function homeroomGrade_(hr) { return String(hr).charAt(0) === '8' ? 8 : 9; }
function sectionForCourse_(hr, course) {
  if (!hr) return '';
  var s = String(hr).trim();
  if (s.indexOf('-') !== -1) return s;
  var c = String(course || '').toUpperCase();
  var suffix = '';
  if (c.indexOf('CIT') !== -1) suffix = 'CIT';
  else if (c.indexOf('HL9') !== -1 || (c.indexOf('HL') !== -1 && s.charAt(0) === '9')) suffix = 'HL';
  else if (c.indexOf('HL8') !== -1 || c.indexOf('HE') !== -1 || (c.indexOf('HL') !== -1 && s.charAt(0) === '8')) suffix = 'HE';
  else suffix = { CIT9: 'CIT', HL9: 'HL', HL8: 'HE' }[c] || c;
  return suffix ? (s + '-' + suffix) : s;
}

// Seed the Roster tab from the old class tabs: email -> name/homeroom/grade/courses.
function bootstrapRoster_(ss, payload) {
  var dry = payload.dryRun !== false;
  var legacy = legacySheet_();
  var rows = [], noEmail = [], seen = {};
  LEGACY_CLASS_TABS.forEach(function (hr) {
    var sh = legacy.getSheetByName(hr);
    if (!sh || sh.getLastRow() < 2) return;
    var grade = homeroomGrade_(hr);
    var courses = (grade === 9) ? 'CIT 9, HL 9' : 'HL 8';
    var data = sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues();
    data.forEach(function (r) {
      var pin = String(r[0] || '').trim(), name = String(r[1] || '').trim();
      var email = String(r[3] || '').trim().toLowerCase();
      if (!pin || !name) return;
      var parts = name.split(' ').filter(function (x) { return x; });
      var first = parts.shift() || name, last = parts.join(' ');
      if (!email) { noEmail.push({ name: name, homeroom: hr }); return; }
      if (seen[email]) return; seen[email] = 1;
      rows.push([email, first, last, hr, grade, courses, new Date()]);
    });
  });
  if (!dry) {
    var lock = LockService.getScriptLock(); lock.waitLock(30000);
    try {
      var sh = ss.getSheetByName(TAB_ROSTER);
      if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 7).clearContent();
      if (rows.length) sh.getRange(2, 1, rows.length, 7).setValues(rows);
    } finally { lock.releaseLock(); }
  }
  return jsonOut_({ status: 'ok', dryRun: dry, rosterCount: rows.length,
                    studentsWithoutEmail: noEmail.length, missingEmail: noEmail,
                    preview: dry ? rows.slice(0, 10) : undefined });
}

// Copy a student's old task payloads into v2, transforming to the pipe page shapes.
function transformLegacyData_(taskName, data) {
  if (String(taskName).indexOf('Addictive') !== -1) {
    // HL9 old shape already saves { answers: {fieldId: value} } — pass through.
    return { answers: data.answers || {}, _v: 2, _pipe: true, name: data.name || '', auditors: data.auditors || '' };
  }
  if (data.rent_math) {
    // CIT9 old shape is nested; flatten to the pipe page's field ids.
    var rm = data.rent_math || {}, ev = data.evidence || {}, di = data.dilemma || {};
    var p = data.ppp || {}, pm = data.power_map || {}, dp = data.deputation || {};
    var ff = data.fast_finisher || {};
    var pos = String(di.position || '').charAt(0).toUpperCase();
    var posMap = { A: 'A — Build everywhere', B: 'B — Protect & plan', C: 'C — Public land, non-market', U: 'Still undecided' };
    var topicMap = { phone: 'Phone bans in schools (2.71/4)', treaty: 'Mi\'kmaw treaty rights (2.71/4)',
                     power: 'Power rates & offshore wind (2.43/4)', ai: 'AI & future jobs (2.29/4)' };
    var topic = topicMap[String(ff.topic || '').toLowerCase()] || ff.topic || '';
    var lvl = String(pm.target_level || '');
    var lvlMap = { C: 'City / HRM Council', P: 'Province', F: 'Federal' };
    var lvlSel = lvlMap[lvl.charAt(0).toUpperCase()] || pm.target_level || '';
    return { answers: {
      math_hours_rent: rm.hours_for_rent || '', math_pct_rent: rm.pct_of_pay || '',
      math_wage_needed: rm.wage_needed || '', math_gap_hourly: rm.gap_hourly || '',
      math_gap_compromises: rm.gap_compromises || '', math_gap_structural: rm.gap_structural || '',
      evidence_most_shocking: ev.most_shocking || '', evidence_system_link: ev.system_link || '',
      dilemma_position: posMap[pos] || di.position || '',
      dilemma_justification: di.justification || '', dilemma_counter_tradeoff: di.counter_tradeoff || '',
      ppp_career_name: p.career || '', ppp_hfx_annual_salary: p.annual_salary || '',
      ppp_hfx_hours: p.hfx_hours || '', ppp_delhi_hours: p.delhi_hours || '',
      ppp_analysis_reflection: p.analysis || '',
      power_city_ask: pm.city_ask || '', power_prov_ask: pm.prov_ask || '', power_fed_ask: pm.fed_ask || '',
      power_target_level: lvlSel, power_one_question: pm.one_question || '',
      dep_starter_1: dp.starter_1 || '', dep_starter_2: dp.starter_2 || '', dep_starter_3: dp.starter_3 || '',
      dep_starter_4: dp.starter_4 || '', dep_starter_5: dp.starter_5 || '',
      ff_selected_topic: topic, ff_response: ff.response || '',
      docSignature: data.signature || ''
    }, global_numbeo: data.global_numbeo || [], _v: 2, _pipe: true, name: data.name || '' };
  }
  return data;   // unknown shape: copy as-is rather than lose it
}

// Copy old submissions for the given tasks into v2 (one-time; dry-run first).
// payload.tasks = [{ name: '<exact TASK_NAME>', course: 'HL9'|'CIT9'|'HL8' }]
function migrateLegacySubmissions_(ss, payload) {
  var tasks = Array.isArray(payload.tasks) ? payload.tasks : [];
  if (!tasks.length) throw new Error('tasks: [{name, course}] is required.');
  var dry = payload.dryRun !== false;
  var legacy = legacySheet_();
  var perTask = {}, studentsMigrated = 0, noEmailRows = 0;
  var migratedEmails = {};

  tasks.forEach(function (t) {
    var taskName = String(t.name || '').trim();
    var per = { migrated: 0, noEmail: 0, notFound: 0 };
    if (!taskName) return;
    LEGACY_CLASS_TABS.forEach(function (hr) {
      var sh = legacy.getSheetByName(hr);
      if (!sh || sh.getLastRow() < 2) return;
      var section = sectionForCourse_(hr, t.course);
      var grade = homeroomGrade_(hr);
      var rows = sh.getRange(2, 1, sh.getLastRow() - 1, 9).getValues();
      rows.forEach(function (r) {
        var ledger = null;
        try { ledger = JSON.parse(String(r[6] || r[5] || '{}')); } catch (e) { return; }
        var tsk = (ledger && ledger._tasks && ledger._tasks[taskName]) || (ledger && ledger.rent_math ? { data: ledger, summary: '' } : null);
        var tskData = tsk && (tsk.data || tsk.answers);
        if (!tskData) return;
        var email = String(r[3] || '').trim().toLowerCase();
        var name = String(r[1] || '').trim();
        if (!email) { per.noEmail++; noEmailRows++; return; }
        per.migrated++;
        migratedEmails[email] = 1;
        if (dry) return;
        var data = transformLegacyData_(taskName, tskData);
        var lock = LockService.getScriptLock(); lock.waitLock(30000);
        try {
          mergeTaskIntoStudent_(ss, email, { name: name, section: section, grade: grade,
                                             task: taskName, summary: (tsk && tsk.summary) || '', data: data });
        } finally { lock.releaseLock(); }
      });
    });
    perTask[taskName] = per;
  });

  studentsMigrated = Object.keys(migratedEmails).length;
  return jsonOut_({ status: 'ok', dryRun: dry, perTask: perTask,
                    studentsMigrated: studentsMigrated, noEmailRows: noEmailRows,
                    next: dry ? 'Review, then POST the same action with dryRun:false.' : 'Done. Students will see this work on sign-in.' });
}

// Direct batch import of student submissions (teacher-only).
// Allows migration or bulk-push of student work without requiring HMAC student signatures.
// payload.submissions = [{ email, name, section, grade, task, summary, data }, ...]
function importSubmissions_(ss, payload) {
  var list = Array.isArray(payload.submissions) ? payload.submissions : [];
  if (!list.length) throw new Error('submissions: [{email, name, section, grade, task, summary, data}] is required.');
  var imported = 0, errors = [];
  var log = ss.getSheetByName(TAB_LOG);
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    list.forEach(function (sub) {
      var email = String(sub.email || '').trim().toLowerCase();
      if (!email) { errors.push('Missing email for ' + (sub.name || 'unnamed')); return; }
      var task = String(sub.task || '').trim();
      if (!task) { errors.push('Missing task for ' + email); return; }
      var now = new Date();
      var data = sub.data || {};
      var reqId = 'import_' + Utilities.getUuid();
      
      // 1) Audit log entry
      if (log) {
        log.appendRow([now, email, sub.section || '', task, 'Imported', String(sub.summary || ''), JSON.stringify(data), reqId]);
      }
      
      // 2) Merge into student ledger
      var res = mergeTaskIntoStudent_(ss, email, {
        name: String(sub.name || ''),
        section: String(sub.section || ''),
        grade: sub.grade || 8,
        task: task,
        summary: String(sub.summary || ''),
        data: data
      });
      if (res.ok) {
        imported++;
      } else {
        errors.push(email + ': ' + res.message);
      }
    });
  } finally {
    lock.releaseLock();
  }
  return jsonOut_({ status: 'ok', imported: imported, total: list.length, errors: errors });
}