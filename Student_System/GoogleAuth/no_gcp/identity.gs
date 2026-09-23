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

var IDENTITY_VERSION = 'R8-ID-0.3.3';
var ALLOWED_DOMAIN   = 'gnspes.ca';

// Path-B handoff: only bounce back to these origins (open-redirect guard).
var RETURN_ALLOWLIST = ['https://dwaugh-edsim.github.io'];

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

// ---- HTTP entry ------------------------------------------------------------
// ?action=probe (or get_health) -> identity JSON (the Step-1 test).
// ?return=<page-url>            -> sign in, then bounce BACK to that page with a
//                                  signed identity in the URL fragment (#r8id=).
//                                  This is the Path-B handoff: the page itself
//                                  stays hosted on GitHub Pages.
// anything else                 -> JSON help.
function doGet(e) {
  var p = (e && e.parameter) || {};

  if (p.action === 'probe' || p.action === 'get_health') {
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

  var ret = p['return'] || '';
  if (ret) {
    if (!isAllowedReturn_(ret)) {
      return jsonOut_({ status: 'bad_return', message: 'return URL is not allowlisted', allowed: RETURN_ALLOWLIST });
    }
    var who = callerEmail_();
    // One-click account switcher that returns to this same handoff. Needed because
    // a browser signed into a personal account will otherwise dead-end here.
    var execUrl = ScriptApp.getService().getUrl();
    var switchUrl = execUrl
      ? 'https://accounts.google.com/AccountChooser?continue=' +
        encodeURIComponent(execUrl + '?return=' + encodeURIComponent(ret))
      : '';
    if (!who) {
      return noticeHtml_('Sign in required',
        'No Google account is currently signed in. Sign in with your <b>@' + ALLOWED_DOMAIN +
        '</b> school account, then try again.', switchUrl);
    }
    if (ALLOWED_DOMAIN && who.indexOf('@' + ALLOWED_DOMAIN) === -1) {
      return noticeHtml_('Wrong account',
        'You are signed in as <b>' + escapeHtml_(who) + '</b>, which is not a <b>@' + ALLOWED_DOMAIN +
        '</b> account. This assignment needs your school account.', switchUrl);
    }
    var ts = Date.now();
    var sig = signIdentity_(who, ts);
    var blob = Utilities.base64EncodeWebSafe(JSON.stringify({ email: who, ts: ts, sig: sig }));
    return bounceOut_(ret + '#r8id=' + blob);
  }

  return jsonOut_({
    status: 'ok',
    service: 'Room 8 Identity',
    hint: 'Add ?return=<your-page-url> to sign in, or ?action=probe to test identity.'
  });
}

// HtmlService (NOT ContentService): ContentService has no HTML mime type, so its
// output is served as plain text and the browser shows raw markup instead of
// rendering it (and the redirect never runs).
function htmlOut_(html) {
  return HtmlService.createHtmlOutput(html).setTitle('Room 8');
}

function escapeHtml_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Friendly in-app message (instead of Google's opaque "unable to open the file").
function noticeHtml_(title, body, switchUrl) {
  var link = switchUrl
    ? '<p style="margin-top:18px"><a href="' + switchUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;') +
      '" style="display:inline-block;padding:10px 18px;background:#1e293b;color:#fff;border-radius:8px;text-decoration:none">Switch account</a></p>'
    : '';
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + escapeHtml_(title) + '</title></head>'
    + '<body style="font-family:system-ui,sans-serif;max-width:520px;margin:60px auto;padding:0 20px;color:#0f172a">'
    + '<h1 style="font-size:1.2rem">' + escapeHtml_(title) + '</h1>'
    + '<p style="line-height:1.5">' + body + '</p>' + link + '</body></html>';
  return htmlOut_(html);
}

// Bounce back to the calling page. HtmlService runs inside Google's SANDBOXED frame
// on a googleusercontent.com origin, so it is CROSS-ORIGIN to the top window and
// JavaScript cannot navigate the top (window.top.location throws). Only a real
// navigation — a link with target="_top" — can move the top window, and the sandbox
// allows that on a user gesture. So: a prominent link, plus a best-effort auto-click.
function bounceOut_(target) {
  var esc = target.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Signing you in…</title></head>'
    + '<body style="font-family:system-ui,sans-serif;padding:40px;text-align:center;color:#0f172a">'
    + '<p>Signing you in…</p>'
    + '<p><a id="go" href="' + esc + '" target="_top" style="display:inline-block;padding:12px 22px;'
    + 'background:#1e293b;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">'
    + 'Continue to your assignment</a></p>'
    + '<p style="color:#64748b;font-size:.85rem">If it does not continue on its own, tap the button.</p>'
    + '<script>setTimeout(function(){try{document.getElementById("go").click();}catch(e){}},200);</script>'
    + '</body></html>';
  return htmlOut_(html);
}

function isAllowedReturn_(url) {
  for (var i = 0; i < RETURN_ALLOWLIST.length; i++) {
    if (url.indexOf(RETURN_ALLOWLIST[i]) === 0) return true;
  }
  return false;
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