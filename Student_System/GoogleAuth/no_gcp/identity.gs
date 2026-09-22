/**
 * ============================================================================
 * Room 8 — IDENTITY app  (no Google Cloud, no OAuth client)   R8-ID-0.1.0
 * ============================================================================
 * Reports the Google-authenticated identity of whoever opens this web app.
 * Because it is deployed "Execute as: User accessing the web app", Apps Script
 * authenticates the visitor against the school Workspace domain and
 * Session.getActiveUser().getEmail() returns their real @gnspes.ca address.
 *
 * WHY A SEPARATE APP: an app that can SEE the visitor runs as the visitor and
 * therefore cannot write your private spreadsheet. So this app only *identifies*;
 * the Vault app does the writing. This app signs the email with an HMAC key; the
 * Vault verifies that signature before trusting it.
 *
 * ---------------------------------------------------------------------------
 * STEP 1 — THE MAKE-OR-BREAK TEST (do this first, it takes 2 minutes)
 * ---------------------------------------------------------------------------
 *   1. script.google.com -> New project -> name it "Room 8 Identity" -> paste
 *      this file over Code.gs.
 *   2. Project Settings -> Script Properties -> add:
 *        R8_IDENTITY_KEY = <a long random string>     (you'll reuse it in Vault)
 *        R8_VAULT_URL    = <leave blank for now; add later when the Vault exists>
 *   3. Deploy -> New deployment -> Web app:
 *        Execute as:  User accessing the web app      <-- REQUIRED
 *        Who has access:  Anyone within <your domain>  <-- e.g. "Anyone within gnspes.ca"
 *      Copy the /exec URL.
 *   4. Open that /exec URL in a browser signed in as a @gnspes.ca account
 *      (do it on a school Chromebook, or your own @gnspes.ca login).
 *
 *   EXPECTED on success:  { "status": "identified", "email": "you@gnspes.ca", ... }
 *   If "email" is empty but "effectiveUser" shows your address, the deployment is
 *   still set to "Execute as: Me" -> change it. If both are empty, the account
 *   isn't signed in or isn't in the domain.
 * ============================================================================
 */

var IDENTITY_VERSION = 'R8-ID-0.1.0';
var ALLOWED_DOMAIN   = 'gnspes.ca';

function identityKey_() {
  return PropertiesService.getScriptProperties().getProperty('R8_IDENTITY_KEY') || '';
}

/** Hex HMAC-SHA256 of "email|ts" — identical implementation in the Vault app. */
function signIdentity_(email, ts) {
  var key = identityKey_();
  if (!key) return '';
  var bytes = Utilities.computeHmacSha256Signature(String(email) + '|' + String(ts), key);
  return bytes.map(function (b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function callerEmail_() {
  var active = '';
  try { active = String(Session.getActiveUser().getEmail() || ''); } catch (e) { active = ''; }
  return active.toLowerCase();
}

function jsonOut_(obj) {
  obj.version = IDENTITY_VERSION;
  return ContentService.createTextOutput(JSON.stringify(obj, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- STEP 1: the probe. Open the /exec URL, read the JSON. ------------------
function doGet(e) {
  var email = callerEmail_();
  var effective = '';
  try { effective = String(Session.getEffectiveUser().getEmail() || '').toLowerCase(); } catch (err) {}
  return jsonOut_({
    status: email ? 'identified' : 'no_identity',
    email: email,
    effectiveUser: effective,
    allowedDomain: ALLOWED_DOMAIN,
    note: email
      ? 'SUCCESS — this is the Google-authenticated caller identity.'
      : 'No identity returned. Confirm "Execute as: User accessing the web app" and sign in with a same-domain account.'
  });
}

// ---- Used by the assignment page (hosted by THIS app) -----------------------
// A page served by this app can call google.script.run.getIdentitySigned() to
// receive the caller's verified email plus a signature the Vault will accept.
function getIdentitySigned() {
  var email = callerEmail_();
  if (!email) return { ok: false, reason: 'no_identity' };
  if (ALLOWED_DOMAIN && email.indexOf('@' + ALLOWED_DOMAIN) === -1) {
    return { ok: false, reason: 'domain_not_allowed', email: email };
  }
  var ts = Date.now();
  return { ok: true, email: email, ts: ts, sig: signIdentity_(email, ts) };
}

// ---- Server-side proxy to the Vault -----------------------------------------
// The page calls this; it runs as the student (so it knows who they are), then
// forwards the signed identity to the Vault (which runs as you and can write).
function saveSubmission(payload) {
  var ident = getIdentitySigned();
  if (!ident.ok) return { ok: false, reason: ident.reason };
  var vaultUrl = PropertiesService.getScriptProperties().getProperty('R8_VAULT_URL') || '';
  if (!vaultUrl) return { ok: false, reason: 'missing_vault_url' };
  payload = payload || {};
  var res = UrlFetchApp.fetch(vaultUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      action: 'submit_assignment',
      email: ident.email, ts: ident.ts, sig: ident.sig,
      task: payload.task, section: payload.section,
      summary: payload.summary, data: payload.data || {},
      requestId: payload.requestId
    }),
    muteHttpExceptions: true
  });
  try {
    return JSON.parse(res.getContentText());
  } catch (err) {
    return { ok: false, reason: 'vault_bad_response', http: res.getResponseCode() };
  }
}