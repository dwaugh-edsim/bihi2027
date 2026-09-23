# The identity pipe — how it works

How a static page on GitHub Pages learns **which student** is looking at it, without
PINs, without Google Cloud, and without storing anything on the device.

## The moving parts

1. **Identity app** (`../GoogleAuth/no_gcp/identity.gs`) — deployed
   *Execute as: User accessing the web app*. Because it runs as the visitor, Apps Script
   authenticates them against the school Workspace domain and
   `Session.getActiveUser().getEmail()` returns their real address. It can *see* who you
   are, but (running as you) it can't write anything.
2. **Backend** (`backend.gs`) — deployed *Execute as: Me*, so it writes the teacher's
   private sheet. It can't see who's calling — so it refuses to trust any identity that
   isn't **signed**.
3. The bridge between them is a shared HMAC secret
   (`R8_IDENTITY_KEY` Script Property, identical in both projects, never in the browser).

## Sign-in flow (popup + postMessage)

```
assignment page (github.io)
  │ window.open(IDENTITY_URL + '?return=' + origin)
  ▼
Identity app ── Session.getActiveUser() ──► {email, ts, sig}
  │  sig = HMAC-SHA256("email|ts", R8_IDENTITY_KEY)
  │  (HtmlService page, inside Google's sandboxed frame)
  │  window.top.opener.postMessage({type:'r8id', id}, origin)
  ▼
assignment page receives it, stores it in sessionStorage, popup closes
```

### Why a popup and not a redirect

Apps Script HTML renders inside a **sandboxed iframe on a `googleusercontent.com`
origin** — cross-origin to the top window. From there:

- `window.top.location` **throws** (cross-origin),
- `target="_top"` links are **blocked by the sandbox**,
- meta-refresh only moves the iframe (leaving the student on a `script.google.com`
  address bar).

A **popup is a top-level window**, and browsers allow `window.top.opener` cross-origin
(`opener` is on the allow-list, unlike `location`). So the app can `postMessage` the
identity to the page, and the page closes the popup itself.

### Why the page can't just fetch its identity

A cross-site `fetch` from `github.io` to `script.google.com` carries no Google session
(third-party cookies are blocked), so Apps Script would see an anonymous visitor. Only a
**top-level** load of a Google URL is first-party — that's what the popup is for.

## The signed identity

```
{ "email": "…@gnspes.ca", "ts": 1790122438149, "sig": "<64 hex chars>" }
```

- Minted server-side by the Identity app; the secret never touches the browser.
- **Valid 4 hours** (`FRESH_MS` in the Backend) — long enough to outlast a class, short
  enough to matter. On expiry the page offers a one-click re-sign-in; work already saved
  is on the server, so nothing is lost.
- **`sig` is the trust boundary.** A page can *display* a fake email (nothing stops a
  script from lying in `postMessage`), but the Backend recomputes the HMAC on every
  call and rejects forgeries with `auth_failed: bad_sig`. Forgery is impossible without
  the secret.
- The Backend also enforces `ALLOWED_DOMAIN = 'gnspes.ca'` — a personal Google account
  gets a "Wrong account" page with a switch-account link, never a valid identity.

## Save / restore

- **Autosave:** the page collects its fields and POSTs
  `{action:'submit_assignment', email, ts, sig, task, section, summary, data, requestId}`
  (~2.5s after typing stops, plus a flush on tab-hide/close). `Content-Type` is
  `text/plain` to avoid a CORS preflight.
- **Resilience:** normal CORS POST (response is readable) → on failure `no-cors` +
  `navigator.sendBeacon` → then confirm via `?action=verify&requestId=…`. `requestId`
  makes retries idempotent server-side.
- **Restore:** on load the page POSTs `load_assignment` (signed) and gets its own newest
  work back, keyed by verified email + task.
- **`requestId` dedupe + append-only log:** the Backend appends every save to
  `Submissions_Log` (audit trail, written outside the lock so data survives even if the
  merge times out), then merges into the student's row under the lock. `v2` also skips
  the write entirely when the incoming data hash matches what's stored, so autosave
  doesn't grow the log.

## What lives on the device

| Storage | Contents | Why it's OK |
|---|---|---|
| `sessionStorage['r8id']` | the signed identity token | transient, per-tab, cleared when the Chromebook closes; re-obtainable by signing in again |
| `sessionStorage['r8_tab_draft_<task>']` | the current tab's unsaved answers (crash recovery) | same lifetime as the tab — wiped on close/logout, so nothing durable on the device; superseded by the server the moment a save confirms |
| *nothing else* | — | **no `localStorage` anywhere** — work is on the server |

## Security model, summarised

| Threat | Defence |
|---|---|
| Student impersonates another student | Impossible: signatures are minted only for the caller's own verified email |
| Forged identity posted to the page | Page may *display* it, but the Backend rejects invalid HMACs |
| Personal (non-school) account | Identity app refuses to mint (domain check) and shows a switch-account page |
| Stranger calls the Backend | Student actions need a signature; teacher actions need `CLASS_LOG_PIN` |
| Open-redirect through the handoff | `RETURN_ALLOWLIST` locks the return origin to the Pages site |
| Effort/telemetry privacy | Telemetry is **counts and duration only** (keystrokes, pastes, seconds) — never content |

## Operational gate: the consent screen

A signed-in `gnspes` owner sails through; a **student** account will hit Google's
*"Google hasn't verified this app"* screen and must choose **Advanced → Go to Room 8
Identity (unsafe)**. Test one real student account before any live use. If the domain
blocks unverified apps for under-18s, the fix is administrative: have the Google
Workspace admin add the Identity project's **script ID** to the domain's trusted apps
(Admin console → Security → Access and data control → API controls). Alternatively — and
cleaner long-term — have the admin publish the Identity app as **Internal** under the
domain, which removes the warning entirely.

## Known open item

`Session.getActiveUser()` was proven for the teacher account. A **real student account**
consenting to the "Room 8 Identity (Unverified)" screen is still untested — it is the last
gate before live use.