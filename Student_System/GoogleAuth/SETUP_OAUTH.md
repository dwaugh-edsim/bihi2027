# Google Sign-in — one-time setup (Room 8, NEW assignments)

> **BLOCKED (2026-09-22):** `console.cloud.google.com` is disabled for `@gnspes.ca`
> accounts (org policy) — you cannot create the OAuth Client ID below with your school
> account. This OAuth/GIS path is superseded by the no-Google-Cloud approach in
> [`no_gcp/README.md`](no_gcp/README.md) (Apps Script's own sign-in). Kept for reference
> in case the board ever grants Google Cloud access or issues an Internal OAuth app.

**Goal of the simple test:** prove that a real `@gnspes.ca` account can sign in with
Google on a page served from GitHub Pages, and that a brand-new Apps Script verifies
the token. **Nothing here touches the live student system or the Master Sheet.**

The one hard dependency is the OAuth Client ID (Part A) plus the school domain's
policy (Part B). Those are the make-or-break; the code (Part C) is already written.

---

## Part A — Create the OAuth Web Client ID (Google Cloud Console)

1. Go to <https://console.cloud.google.com> and sign in. Use your `@gnspes.ca`
   account if the board lets you create projects; otherwise a personal Google
   account is fine (the OAuth client and the Apps Script don't have to share an owner).
2. **Create a project** — e.g. "Room 8 Google Auth".
3. **APIs & Services → OAuth consent screen**
   - **User type: External** (Internal only exists if the project sits inside the
     school's Workspace organization — see Part B for why that's actually the clean
     long-term option).
   - App name "Room 8 Assignments"; support email + developer contact = you.
   - **Authorized domains:** add `github.io`.
   - **Scopes:** add `openid`, `email`, `profile` (the non-sensitive basics).
   - **Publishing status:** leave in **Testing** for the pilot, then add **test users**
     — the `@gnspes.ca` accounts that will try it (yourself + a student or two; up to
     100). To open a whole class, add all their emails; to open to everyone, **Publish**
     (allowed without verification for these basic scopes, though users may see a
     warning).
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**.
   - Name: "Room 8 Web (Pages)".
   - **Authorized JavaScript origins:** `https://dwaugh-edsim.github.io`
     (exact origin — no trailing slash, no path; the `/bihi2027/` path is irrelevant
     to OAuth). Add a second entry later if you move to a custom domain.
   - **Authorized redirect URIs:** leave empty (not needed for the sign-in button).
   - **Create** → copy the **Client ID** (ends in `…apps.googleusercontent.com`).
     *It is not a secret* — it's fine for it to sit in the public page.

## Part B — Check the school domain's policy (the make-or-break)

- `@gnspes.ca` is a managed Google Workspace domain; its **admin** controls third-party
  sign-in (Admin console → Security → Access and data control → API controls →
  third-party app access). If third-party OAuth is blocked, the button fails no matter
  how correct the Client ID is.
- You're probably not the admin, so the reliable check is **empirical**: run the test
  page with one real `@gnspes.ca` account.
  - Success ⇒ the domain allows it; we're good to build on this.
  - "App blocked / not allowed" ⇒ the board IT admin must allowlist this Client ID — or,
    cleaner long-term, **create an Internal app under the school org** (no test-user
    limits, no warnings, policy satisfied by design). Worth asking them directly.

## Part C — Create the new Apps Script + run the test

1. Create a **new Google Sheet** — "Room 8 — New Assignments (Google Auth)" — separate
   from the Master sheet.
2. **Extensions → Apps Script**, and replace the default file with
   `Student_System/GoogleAuth/Code.gs`.
3. **Project Settings → Script Properties:**
   - `GOOGLE_CLIENT_ID` = your Client ID from Part A
   - `GA_TEACHER_PIN` = a PIN you choose (for reading data back later)
4. Run **`setup()`** once (authorize it when prompted) — creates the `Submissions` tab.
5. **Deploy → New deployment → Web app.** Settings:
   - **Execute as: Me**  ← deliberate; keeps results in *your* private sheet
   - **Who has access: Anyone**
   Copy the `/exec` URL.

   > Do **not** use "Execute as: the user accessing the web app" — the script would then
   > run as the student and could not write your private sheet (it would have to be shared
   > with the whole domain, exposing everyone's work).

6. **Push `signin_test.html` to the repo** so it lives on the Pages origin:
   `https://dwaugh-edsim.github.io/bihi2027/Student_System/GoogleAuth/signin_test.html`
   Open it with the two values passed in the URL (no re-push needed):
   `…signin_test.html?client_id=YOUR_ID.apps.googleusercontent.com&gas=YOUR_EXEC_URL`
7. **Click "Sign in with Google."**
   - Green **"✅ BACKEND VERIFIED: you@gnspes.ca"** = both halves work.
   - Then click **"Send test submission"** to prove the write path landed a row.

## Redeploy reminder

Bump `CONFIG_VERSION` in `Code.gs` on every edit, then
**Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy**
(keeps the same URL). This is the drift rule the live system taught us the hard way.

## What this deliberately does NOT do yet

- No new assignment page template, no roster email→student mapping, no teacher
  dashboard. Those come *after* the test passes — and they'd be built on this same
  new GAS without touching the live system.