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

var VAULT_VERSION   = 'R8-VAULT-0.1.0';
var ALLOWED_DOMAIN   = 'gnspes.ca';
var FRESH_MS         = 10 * 60 * 1000;   // signatures valid for 10 minutes
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

  if (action === 'get_submissions') {
    var pin = PropertiesService.getScriptProperties().getProperty('GA_TEACHER_PIN');
    if (!pin || String(payload.teacherPin || '') !== String(pin)) {
      return jsonOut_({ status: 'error', message: 'Teacher PIN required.' });
    }
    var sh2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS_TAB);
    var rows = (sh2 && sh2.getLastRow() > 1) ? sh2.getRange(2, 1, sh2.getLastRow() - 1, 7).getValues() : [];
    return jsonOut_({ status: 'ok', count: rows.length, rows: rows });
  }

  return jsonOut_({ status: 'error', message: 'Unknown action: ' + action });
}