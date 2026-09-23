# Room 8 v2 — the Google-auth student system

The rebuild of the old Apps Script backend (`Student_System/Code.gs`, "V6.x") on the
Google-auth pipe: **a verified `@gnspes.ca` email is the student's identity** — no PINs,
nothing typed, nothing stored on the device.

**Status:** phase 1 proven end-to-end on the teacher account. Parallel to the live V6.x
system — nothing here touches the old Master Sheet.

## Start here

| File | What it is |
|---|---|
| [DESIGN.md](DESIGN.md) | The architecture, data model, action surface, keep/drop/improve decisions |
| [DEPLOY.md](DEPLOY.md) | How to deploy the backend + every Google error we've hit and what it means |
| [PIPE.md](PIPE.md) | How the identity pipe actually works (popup, HMAC, autosave/restore) |
| [TEMPLATES.md](TEMPLATES.md) | How to author a new assignment on the pipe (config, not code) |
| [backend.gs](backend.gs) | The Apps Script backend (paste into the v2 project) |
| [pipe.js](pipe.js) | The page-side client (`Room8.*`) |
| [template_assignment.html](template_assignment.html) | Minimal assignment template — copy me |
| [test_connection.html](test_connection.html) | Connection harness (identity → resolve → autosave → restore) |

## The 60-second version

1. A student opens an assignment on **GitHub Pages** (clean URL, Classroom-friendly).
2. They click **Sign in** → a popup opens the *Identity* app → Google confirms who they
   are → the popup **postMessages** a signed identity `{email, ts, sig}` to the page and
   closes. The page never leaves its own origin.
3. Every action the page takes carries that signature. The **Backend** (running *as the
   teacher*) verifies the HMAC before trusting the email, so identity can't be forged.
4. Work **autosaves to the server** (~2.5s after typing stops) and **restores from the
   server** on load. **No `localStorage`** — Chromebooks wipe on close, so nothing durable
   lives on the device.
5. Everything lands in the teacher's private **"Room 8 v2 — Master"** sheet.

## Script properties (the only secrets)

| Property | Where | Purpose |
|---|---|---|
| `R8_IDENTITY_KEY` | Identity app **and** Backend (same value) | The HMAC secret that signs identities |
| `CLASS_LOG_PIN` | Backend | Gates every teacher write/read |

Neither value is recorded anywhere in this repository.

## Hard constraints we built around

- **Google Cloud is disabled** for `@gnspes.ca` — no OAuth client, no GIS. Identity comes
  from Apps Script's own `Session.getActiveUser()` instead.
- **Apps Script HTML runs in a sandboxed, cross-origin iframe** — it cannot navigate the
  top window. Hence the popup + `postMessage` return (a redirect is impossible).
- **`ContentService` cannot serve HTML** — only `HtmlService` can.
- **Deploy drift is real** — saving a file changes nothing; only
  *Manage deployments → New version → Deploy* does.
