/**
 * ============================================================================
 * Room 8 — NEW Assignments Backend (Google-auth edition)   version GA-0.1.0
 * ============================================================================
 * A SEPARATE Apps Script project for NEW assignments. It does NOT touch the live
 * V6.x student system or the Room 8 Master Sheet.
 *
 * Identity model: the page signs the student in with Google Identity Services,
 * which returns a signed ID token. Every authenticated call re-sends that token
 * and THIS script verifies it against Google before trusting the identity.
 * The verified @gnspes.ca email IS the login — no PIN, no self-reported email.
 *
 * ONE-TIME SETUP (full walkthrough in SETUP_OAUTH.md):
 *   1. Create a NEW Google Sheet (separate from the Master sheet).
 *   2. Extensions -> Apps Script -> replace the default file with this code.
 *   3. Project Settings -> Script Properties:
 *        GOOGLE_CLIENT_ID = <your OAuth Web Client ID>
 *        GA_TEACHER_PIN   = <a PIN you choose>
 *   4. Run setup() once (creates the Submissions tab).
 *   5. Deploy -> New deployment -> Web app:
 *        Execute as: Me        Who has access: Anyone
 *      "Execute as: Me" + "Anyone" is deliberate: it keeps results in YOUR
 *      private sheet. (Do NOT use "Execute as: the user" — the script would
 *      then run as the student and could not write your private sheet.)
 *      Copy the /exec URL into the test page.
 *
 * REDEPLOY REMINDER (the drift rule the live system taught us): bump
 * CONFIG_VERSION on every edit, then Deploy -> Manage deployments -> edit ->
 * Version: New version -> Deploy (keeps the same URL).
 * ============================================================================
 */

var CONFIG_VERSION  = 'GA-0.1.0-2026-09-22';
var CONFIG_DEPLOYED = '2026-09-22T18:00:00Z';

// Require the school Google Workspace domain. Set to '' to allow any Google account.
var ALLOWED_DOMAIN = 'gnspes.ca';

var SUBMISSIONS_TAB = 'Submissions';
// Optional: paste the Client ID here instead of setting the Script Property.
var CLIENT_ID_FALLBACK = '';

function successJSON(obj) {
  obj = obj || {};
  obj.version = CONFIG_VERSION;
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getClientId_() {
  var p = PropertiesService.getScriptProperties().getProperty('GOOGLE_CLIENT_ID');
  return (p && p.trim()) ? p.trim() : CLIENT_ID_FALLBACK;
}

/** Run once from the editor: creates the Submissions tab. */
function setup() {
  ensureSubmissionsSheet_(SpreadsheetApp.getActiveSpreadsheet());
  return 'Setup complete — tab "' + SUBMISSIONS_TAB + '" ready. Version ' + CONFIG_VERSION;
}

function ensureSubmissionsSheet_(ss) {
  var sh = ss.getSheetByName(SUBMISSIONS_TAB);
  if (!sh) {
    sh = ss.insertSheet(SUBMISSIONS_TAB);
    sh.appendRow(['Timestamp', 'Verified Email', 'Google Sub', 'Name',
                  'Section', 'Task', 'Summary', 'Data (JSON)', 'requestId']);
    sh.getRange('A1:I1').setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    sh.setColumnWidth(2, 220);
    sh.setColumnWidth(8, 320);
  }
  return sh;
}

/**
 * Verify a Google ID token via Google's tokeninfo endpoint, then check the
 * claims that matter (issuer, audience, expiry, email_verified, domain).
 * Returns {ok:true, email, name, sub, hd} or {ok:false, reason, ...}.
 */
function verifyGoogleIdToken_(idToken) {
  if (!idToken) return { ok: false, reason: 'missing_token' };
  var clientId = getClientId_();
  if (!clientId) return { ok: false, reason: 'server_missing_client_id' };
  try {
    var res = UrlFetchApp.fetch(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
      { muteHttpExceptions: true }
    );
    if (res.getResponseCode() !== 200) {
      return { ok: false, reason: 'token_rejected', http: res.getResponseCode() };
    }
    var info = JSON.parse(res.getContentText());
    var iss = String(info.iss || '');
    if (iss !== 'accounts.google.com' && iss !== 'https://accounts.google.com') {
      return { ok: false, reason: 'bad_issuer', iss: iss };
    }
    if (String(info.aud || '') !== String(clientId)) {
      return { ok: false, reason: 'bad_audience' };
    }
    if (!(Number(info.exp || 0) * 1000 > Date.now())) {
      return { ok: false, reason: 'expired' };
    }
    var emailVerified = (info.email_verified === true || info.email_verified === 'true');
    if (!emailVerified) return { ok: false, reason: 'email_not_verified' };
    var email = String(info.email || '').toLowerCase();
    var hd = String(info.hd || '').toLowerCase();
    if (!email) return { ok: false, reason: 'no_email' };
    if (ALLOWED_DOMAIN && hd !== ALLOWED_DOMAIN && email.indexOf('@' + ALLOWED_DOMAIN) === -1) {
      return { ok: false, reason: 'domain_not_allowed', hd: hd, email: email };
    }
    return {
      ok: true,
      email: email,
      name: String(info.name || ''),
      sub: String(info.sub || ''),
      hd: hd
    };
  } catch (err) {
    return { ok: false, reason: 'verify_error', message: String(err && err.message || err) };
  }
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';
  if (action === 'get_health') {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS_TAB);
    return successJSON({
      status: 'healthy',
      service: 'Room 8 New Assignments (Google auth)',
      clientIdConfigured: !!getClientId_(),
      allowedDomain: ALLOWED_DOMAIN,
      submissionRows: sh ? Math.max(0, sh.getLastRow() - 1) : 0,
      deployedAt: CONFIG_DEPLOYED
    });
  }
  return successJSON({
    status: 'ok',
    message: 'Room 8 New Assignments backend',
    hint: 'POST {action:"verify_test", idToken} or GET ?action=get_health'
  });
}

function doPost(e) {
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return successJSON({ status: 'error', message: 'Invalid JSON body.' });
  }
  var action = payload.action;

  // ---- Sign-in probe: verify the token, echo back the trusted identity ----
  if (action === 'verify_test' || action === 'login_google') {
    var v = verifyGoogleIdToken_(payload.idToken);
    if (!v.ok) return successJSON({ status: 'auth_failed', reason: v.reason, detail: v });
    return successJSON({ status: 'authenticated', email: v.email, name: v.name, sub: v.sub, hd: v.hd });
  }

  // ---- Save an authenticated submission (token re-verified server-side) ----
  if (action === 'submit_assignment') {
    var v2 = verifyGoogleIdToken_(payload.idToken);
    if (!v2.ok) return successJSON({ status: 'auth_failed', reason: v2.reason, detail: v2 });
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ensureSubmissionsSheet_(ss);
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      var requestId = String(payload.requestId || '');
      if (requestId) {
        var last = sheet.getLastRow();
        if (last > 1) {
          var col = sheet.getRange(2, 9, last - 1, 1).getValues();
          for (var i = col.length - 1; i >= 0; i--) {
            if (String(col[i][0]) === requestId) {
              return successJSON({ status: 'submitted_successfully', deduplicated: true, task: payload.taskName });
            }
          }
        }
      }
      var data = payload.data || {};
      if (requestId) data._requestId = requestId;
      sheet.appendRow([
        new Date(), v2.email, v2.sub, v2.name,
        String(payload.section || ''), String(payload.taskName || 'Untitled Task'),
        String(payload.summary || ''), JSON.stringify(data), requestId
      ]);
      return successJSON({ status: 'submitted_successfully', task: String(payload.taskName || ''), email: v2.email });
    } finally {
      lock.releaseLock();
    }
  }

  // ---- Teacher-only: read submissions back ----
  if (action === 'get_submissions') {
    var pin = PropertiesService.getScriptProperties().getProperty('GA_TEACHER_PIN');
    if (!pin || String(payload.teacherPin || '') !== String(pin)) {
      return successJSON({ status: 'error', message: 'Teacher PIN required.' });
    }
    var sh2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS_TAB);
    var rows = (sh2 && sh2.getLastRow() > 1)
      ? sh2.getRange(2, 1, sh2.getLastRow() - 1, 9).getValues() : [];
    return successJSON({ status: 'ok', count: rows.length, rows: rows });
  }

  return successJSON({ status: 'error', message: 'Unknown action: ' + action });
}