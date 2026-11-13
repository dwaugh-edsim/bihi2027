/**
 * ============================================================================
 * Room 8 — VAULT app  (private writer for the no-Google-Cloud path)  R8-VAULT-0.1.0
 * ============================================================================
 * Runs "Execute as: Me", so it can write YOUR private results spreadsheet.
 * It does NOT trust anything the browser claims: it accepts an identity only
 * when the Identity app's HMAC signature checks out and is fresh.
 *
 * SETUP
 *   1. Create a NEW Google Sheet ("Room 8 — New Assignment Results"), separate
 *      from the Master Sheet.
 *   2. In that sheet: Extensions -> Apps Script -> paste this file.
 *   3. Project Settings -> Script Properties:
 *        R8_IDENTITY_KEY = <the SAME value you set in the Identity project>
 *        GA_TEACHER_PIN  = <a PIN you choose, for reading data back>
 *        TEACHER_EMAILS  = <comma-separated teacher emails, e.g. dwaugh@gnspes.ca>
 *                          (gates teacher_list / teacher_delete_user / teacher_reset_all;
 *                           the client-side email check only reveals UI, the server
 *                           re-verifies the signed identity against this allowlist)
 *   4. Run setup() once (authorize; creates the Submissions tab).
 *   5. Deploy -> New deployment -> Web app:
 *        Execute as:  Me
 *        Who has access:  Anyone              <-- required; the server-to-server
 *                                                 call is anonymous, and trust
 *                                                 comes from the signature, not
 *                                                 from who is calling.
 *      Copy the /exec URL into the IDENTITY project's R8_VAULT_URL property.
 * ============================================================================
 */

var VAULT_VERSION   = 'R8-VAULT-0.4.0';
var ALLOWED_DOMAIN   = 'gnspes.ca';
// Path B mints the identity at the page's sign-in handoff and keeps it for the
// session, so the window must outlast a class period (not 10 minutes).
var FRESH_MS         = 4 * 60 * 60 * 1000;   // signatures valid for 4 hours
var SUBMISSIONS_TAB  = 'Submissions';

function identityKey_() {
  return PropertiesService.getScriptProperties().getProperty('R8_IDENTITY_KEY') || '';
}

/** Hex HMAC-SHA256 of "email|ts" — must match the Identity app exactly. */
function signIdentity_(email, ts) {
  var key = identityKey_();
  if (!key) return '';
  var bytes = Utilities.computeHmacSha256Signature(String(email) + '|' + String(ts), key);
  return bytes.map(function (b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

/** Verify a signed identity. Freshness + domain + constant-time signature check. */
function verifyIdentity_(email, ts, sig) {
  email = String(email || '').toLowerCase();
  ts = Number(ts || 0);
  sig = String(sig || '');
  if (!email || !ts || !sig) return { ok: false, reason: 'missing' };
  if (Math.abs(Date.now() - ts) > FRESH_MS) return { ok: false, reason: 'stale_or_future' };
  if (ALLOWED_DOMAIN && email.indexOf('@' + ALLOWED_DOMAIN) === -1) {
    return { ok: false, reason: 'domain_not_allowed', email: email };
  }
  var expected = signIdentity_(email, ts);
  if (!expected || expected.length !== sig.length) return { ok: false, reason: 'bad_sig' };
  var diff = 0;
  for (var i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return { ok: false, reason: 'bad_sig' };
  return { ok: true, email: email };
}

/** Display label from an email local-part: 'alex.macdonald@x' -> 'Alex Ma.' (First + last-two-initials). */
function labelFromEmail_(email) {
  var s = String(email || '').split('@')[0];
  s = s.replace(/[0-9_]+/g, ' ').replace(/[.\-]+/g, ' ').trim();
  if (!s) return 'Explorer';
  var parts = s.split(/\s+/).filter(Boolean);
  var cap = function (w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); };
  var first = cap(parts[0]);
  if (parts.length === 1) return first;
  var last = parts[parts.length - 1].replace(/[^a-zA-Z]/g, '');
  if (!last) return first;
  var two = last.slice(0, 2);
  two = two.charAt(0).toUpperCase() + (two.charAt(1) ? two.charAt(1).toLowerCase() : '');
  return first + ' ' + two + '.';
}

function jsonOut_(obj) {
  obj.version = VAULT_VERSION;
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureSubmissionsSheet_(ss) {
  var sh = ss.getSheetByName(SUBMISSIONS_TAB);
  if (!sh) {
    sh = ss.insertSheet(SUBMISSIONS_TAB);
    sh.appendRow(['Timestamp', 'Verified Email', 'Section', 'Task', 'Summary', 'Data (JSON)', 'requestId']);
    sh.getRange('A1:G1').setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    sh.setColumnWidth(2, 220);
    sh.setColumnWidth(6, 320);
  }
  return sh;
}

function setup() {
  ensureSubmissionsSheet_(SpreadsheetApp.getActiveSpreadsheet());
  return 'Setup complete — "' + SUBMISSIONS_TAB + '" ready. Version ' + VAULT_VERSION;
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';
  if (action === 'get_health') {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS_TAB);
    return jsonOut_({
      status: 'healthy',
      service: 'Room 8 Vault (no-GCP)',
      keyConfigured: !!identityKey_(),
      allowedDomain: ALLOWED_DOMAIN,
      submissionRows: sh ? Math.max(0, sh.getLastRow() - 1) : 0
    });
  }
  // Confirmation for the page's no-cors fallback: did this requestId land?
  if (action === 'verify') {
    var rid = (e.parameter.requestId || '');
    var found = false;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS_TAB);
    if (rid && sheet && sheet.getLastRow() > 1) {
      var col = sheet.getRange(2, 7, sheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < col.length; i++) {
        if (String(col[i][0]) === rid) { found = true; break; }
      }
    }
    return jsonOut_({ status: 'ok', found: found, requestId: rid });
  }
  return jsonOut_({ status: 'ok', message: 'Room 8 Vault', hint: 'POST submit_assignment or GET ?action=get_health' });
}

function doPost(e) {
  var payload;
  try { payload = JSON.parse(e.postData.contents); }
  catch (err) { return jsonOut_({ status: 'error', message: 'Invalid JSON body.' }); }

  var action = payload.action;

  if (action === 'submit_assignment') {
    var v = verifyIdentity_(payload.email, payload.ts, payload.sig);
    if (!v.ok) return jsonOut_({ status: 'auth_failed', reason: v.reason });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ensureSubmissionsSheet_(ss);
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      var requestId = String(payload.requestId || '');
      if (requestId) {
        var last = sheet.getLastRow();
        if (last > 1) {
          var col = sheet.getRange(2, 7, last - 1, 1).getValues();
          for (var i = col.length - 1; i >= 0; i--) {
            if (String(col[i][0]) === requestId) {
              return jsonOut_({ status: 'submitted_successfully', deduplicated: true, task: payload.task });
            }
          }
        }
      }
      var data = payload.data || {};
      if (requestId) data._requestId = requestId;
      sheet.appendRow([
        new Date(), v.email, String(payload.section || ''),
        String(payload.task || 'Untitled Task'), String(payload.summary || ''),
        JSON.stringify(data), requestId
      ]);
      return jsonOut_({ status: 'submitted_successfully', email: v.email, task: String(payload.task || '') });
    } finally {
      lock.releaseLock();
    }
  }

  // ---- Restore: return the caller's most recent save for a task (server-side,
  //      keyed by verified email; no on-device storage anywhere in this system).
  if (action === 'load_assignment') {
    var v3 = verifyIdentity_(payload.email, payload.ts, payload.sig);
    if (!v3.ok) return jsonOut_({ status: 'auth_failed', reason: v3.reason });
    var task = String(payload.task || '');
    var sh3 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS_TAB);
    if (!sh3 || sh3.getLastRow() < 2) return jsonOut_({ status: 'ok', found: false });

    var lock3 = LockService.getScriptLock();
    lock3.waitLock(30000);
    var rows;
    try {
      rows = sh3.getRange(2, 1, sh3.getLastRow() - 1, 7).getValues();
    } finally {
      lock3.releaseLock();
    }
    for (var r = rows.length - 1; r >= 0; r--) {
      if (String(rows[r][1]).toLowerCase() === v3.email && String(rows[r][3]) === task) {
        var data = {};
        try { data = JSON.parse(rows[r][5] || '{}'); } catch (e) { data = {}; }
        return jsonOut_({
          status: 'ok', found: true,
          data: data, summary: String(rows[r][4] || ''),
          section: String(rows[r][2] || ''), savedAt: rows[r][0]
        });
      }
    }
    return jsonOut_({ status: 'ok', found: false });
  }

  if (action === 'get_submissions') {
    var pin = PropertiesService.getScriptProperties().getProperty('GA_TEACHER_PIN');
    if (!pin || String(payload.teacherPin || '') !== String(pin)) {
      return jsonOut_({ status: 'error', message: 'Teacher PIN required.' });
    }
    var sh2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS_TAB);
    var rows = (sh2 && sh2.getLastRow() > 1) ? sh2.getRange(2, 1, sh2.getLastRow() - 1, 7).getValues() : [];
    return jsonOut_({ status: 'ok', count: rows.length, rows: rows });
  }

  // ---- Class leaderboard: any signed-in student may read it. The response
  //      carries display labels + a `me` flag and NEVER raw emails.
  if (action === 'get_leaderboard') {
    var vL = verifyIdentity_(payload.email, payload.ts, payload.sig);
    if (!vL.ok) return jsonOut_({ status: 'auth_failed', reason: vL.reason });
    var taskL = String(payload.task || '');
    var sectionL = String(payload.section || '');
    var shL = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS_TAB);
    if (!shL || shL.getLastRow() < 2) return jsonOut_({ status: 'ok', entries: [] });
    var rowsL = shL.getRange(2, 1, shL.getLastRow() - 1, 7).getValues();
    var best = {};
    for (var i = 0; i < rowsL.length; i++) {
      if (String(rowsL[i][3]) !== taskL) continue;
      var em = String(rowsL[i][1]).toLowerCase();
      var dataL = {};
      try { dataL = JSON.parse(rowsL[i][5] || '{}'); } catch (e) {}
      var score = Number(dataL.xp || 0);
      if (!best[em] || score >= best[em].score) {
        best[em] = {
          score: score,
          best: Number((dataL.best && dataL.best.overall) || 0),
          section: String(rowsL[i][2] || ''),
          savedAt: rowsL[i][0]
        };
      }
    }
    var entries = Object.keys(best).map(function (em) {
      return {
        label: labelFromEmail_(em),
        me: em === vL.email,
        section: best[em].section,
        score: best[em].score,
        best: best[em].best,
        savedAt: best[em].savedAt
      };
    });
    if (sectionL) entries = entries.filter(function (e) { return e.section === sectionL; });
    entries.sort(function (a, b) { return b.score - a.score; });
    return jsonOut_({ status: 'ok', entries: entries.slice(0, 50) });
  }

  // ---- Teacher controls -----------------------------------------------------
  // Client pages reveal teacher UI when the signed-in email matches a teacher
  // address, but EVERY mutation here re-verifies the HMAC identity AND checks the
  // server-side TEACHER_EMAILS allowlist (script property, never in any repo).
  if (action === 'teacher_list' || action === 'teacher_delete_user' || action === 'teacher_reset_all') {
    var vT = verifyIdentity_(payload.email, payload.ts, payload.sig);
    if (!vT.ok) return jsonOut_({ status: 'auth_failed', reason: vT.reason });
    var allowRaw = String(PropertiesService.getScriptProperties().getProperty('TEACHER_EMAILS') || '').toLowerCase();
    var allowList = allowRaw.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    if (allowList.indexOf(vT.email) === -1) {
      return jsonOut_({ status: 'error', message: 'Teacher account required.' });
    }
    var taskT = String(payload.task || '');
    var shT = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS_TAB);
    if (!shT || shT.getLastRow() < 2) {
      return jsonOut_({ status: 'ok', count: 0, entries: [], deleted: 0 });
    }
    var lockT = LockService.getScriptLock();
    lockT.waitLock(30000);
    try {
      var all = shT.getRange(2, 1, shT.getLastRow() - 1, 7).getValues();
      var entries = [];
      var rowsToDelete = [];
      var target = String(payload.targetEmail || '').toLowerCase();
      for (var i = 0; i < all.length; i++) {
        if (String(all[i][3]) !== taskT) continue;
        if (action === 'teacher_list') {
          entries.push({
            email: String(all[i][1]), section: String(all[i][2] || ''),
            summary: String(all[i][4] || ''), savedAt: all[i][0],
            requestId: String(all[i][6] || '')
          });
        } else if (action === 'teacher_delete_user') {
          if (target && String(all[i][1]).toLowerCase() === target) rowsToDelete.push(i + 2);
        } else { // teacher_reset_all
          rowsToDelete.push(i + 2);
        }
      }
      if (action === 'teacher_list') {
        return jsonOut_({ status: 'ok', count: entries.length, entries: entries });
      }
      for (var d = rowsToDelete.length - 1; d >= 0; d--) shT.deleteRow(rowsToDelete[d]);
      return jsonOut_({ status: 'ok', deleted: rowsToDelete.length, action: action, task: taskT });
    } finally {
      lockT.releaseLock();
    }
  }

  return jsonOut_({ status: 'error', message: 'Unknown action: ' + action });
}