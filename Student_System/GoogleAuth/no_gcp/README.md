# Google identity with no Google Cloud (Room 8, NEW assignments)

**Why this exists:** `console.cloud.google.com` is disabled for `@gnspes.ca` accounts
(org policy), so we cannot create an OAuth Client ID. This path uses **Apps Script's own
sign-in** instead — no Google Cloud project, no OAuth client, no admin involvement.

**The one assumption everything rests on:** an Apps Script web app deployed
*"Execute as: User accessing the web app"* can read the visitor's real `@gnspes.ca`
email via `Session.getActiveUser().getEmail()`. **Test that first (Step 1).** If it
returns an empty email, this whole path is out and we go to board IT for an Internal
OAuth app instead.

> **STATUS — Step 1 PASSED (2026-09-22).** Probe returned
> `{"status":"identified","email":"dwaugh@gnspes.ca"}`. The org lets Apps Script
> authenticate the caller. **Remaining unknown:** a real *student* account (they see
> the same "Room 8 Identity (Unverified)" consent screen the owner saw — the only
> question is whether board policy lets a student click through it). Test one student
> login before rolling anything out.

---

## Step 1 — The make-or-break probe (2 minutes)

You only need `identity.gs` for this; ignore the Vault for now.

1. <https://script.google.com> → **New project** → name it **"Room 8 Identity"** →
   paste `identity.gs` over the default `Code.gs`.
2. **Project Settings → Script Properties →** add `R8_IDENTITY_KEY` = a long random
   string (you'll reuse it in the Vault).
3. **Deploy → New deployment → Web app:**
   - **Execute as: User accessing the web app**  ← required
   - **Who has access: Anyone within `<your domain>`** (e.g. "Anyone within gnspes.ca")
   Copy the `/exec` URL.
4. Open that `/exec` URL **while signed in to a `@gnspes.ca` account** (a school
   Chromebook is ideal).

**Pass looks like:**
```json
{ "status": "identified", "email": "you@gnspes.ca", "effectiveUser": "you@gnspes.ca", ... }
```
Diagnosis if it fails:
- `email` empty but `effectiveUser` shows your address → the deployment is still
  **"Execute as: Me"**; change it to "User accessing the web app".
- both empty → not signed in, or the account isn't in the domain.

## Step 2 — The Vault (only after Step 1 passes)

`vault.gs` is the piece that can write your private sheet. It runs *as you* and only
trusts an identity whose HMAC signature it can verify.

1. New Google Sheet **"Room 8 — New Assignment Results"** (separate from the Master).
2. In it: **Extensions → Apps Script** → paste `vault.gs`.
3. **Script Properties:** `R8_IDENTITY_KEY` = *the same string as Step 1*;
   `GA_TEACHER_PIN` = a PIN you choose.
4. Run **`setup()`** once → **Deploy → New deployment → Web app:**
   **Execute as: Me**, **Who has access: Anyone**. Copy the `/exec` URL.
5. Back in the **Identity** project, set Script Property `R8_VAULT_URL` = that URL.

## Step 3 — The assignment page (built: `assignment.html`)

The page is hosted **inside the Identity app** (`HtmlService`), so identity is
first-party — no cross-origin cookies, no redirects. The flow:

- Page loads → `google.script.run.getIdentitySigned()` → `{email, ts, sig}`.
- Student works → on save, `google.script.run.saveSubmission(payload)` → the Identity
  app (as the student) forwards the signed payload to the Vault (as you) → row written.
- No PIN, no self-reported email, nothing for the student to type.

To deploy it:

1. In the **Identity** project: **File → New → HTML file**, name it exactly
   **`assignment`** (Apps Script adds `.html`), and paste `assignment.html`.
2. Edit the `TASK_NAME` and `SECTIONS` constants at the top of the page's script.
3. Put the Vault's `/exec` URL into the Identity project's `R8_VAULT_URL` Script Property
   (from Step 2).
4. **Deploy → Manage deployments → pencil → Version: New version → Deploy.**
5. Open the `/exec` URL → the page signs you in and shows your `@gnspes.ca` address.
   (`?action=probe` still returns the raw identity JSON.)

> A Pages-hosted page is possible via a redirect round-trip, but modern browsers block
> the third-party cookies it depends on, so hosting the page in Apps Script is the
> reliable choice.

## What is deliberately NOT built yet

No page, no roster mapping, no dashboard. Those come after Step 1 passes — built on
these two apps without touching the live V6.x system or the Master Sheet.

## Redeploy reminder

Bump the version constant on every edit, then **Manage deployments → edit → New
version → Deploy** (same URL).