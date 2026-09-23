# Room 8 v2 vs. Legacy Templates: Comprehensive Architectural Evaluation & Hardening Roadmap

**Author:** DeepMind Pair Programmer / Antigravity Engine  
**Date:** September 23, 2026  
**Target Repositories & Paths:**
- **Legacy System:** [templates](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/templates) (`_TEMPLATE_GAS_Assignment.html`, `_TEMPLATE_Display_Dashboard.html`, `strongly_typed_display_template.html`, backed by [api.js](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/api.js) and [Code.gs](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/Code.gs))
- **New System (Room 8 v2):** [Room8v2](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/Room8v2) (`backend.gs`, `pipe.js`, `assignment_engine.js`, `template_assignment.html`, `DESIGN.md`, `PIPE.md`, `TEMPLATES.md`, `DEPLOY.md`)
- **Evaluation Target:** `audit/Room8v2eval.md`

---

## 1. Executive Summary

Room 8 v2 represents a major generational upgrade over the legacy V6.x Google Apps Script (GAS) assignment ecosystem. By replacing the fragile, multi-tab PIN era with an HMAC-signed Google Workspace identity pipe, v2 eradicates entire classes of historical bugs: PIN collisions, peer impersonation, misrouted homeroom saves, cross-sheet data searches, and 1,700-line monolithic assignment templates.

However, the legacy system contains battle-tested resilience mechanisms and telemetry layers that were developed directly in response to middle school classroom failures (the September 16 incident, Chromebook cart profile wipes, flaky Wi-Fi drops, and end-of-class submission storms). 

While Room 8 v2 is architecturally superior in its trust boundary, data model, and code modularity, **it currently lacks key client-side telemetry, network state observability, and emergency fallback layers present in the legacy system**. 

This document provides a systematic evaluation of both architectures, identifies legacy features that should be integrated into v2, and provides concrete technical specifications to harden v2 for production deployment.

---

## 2. Architecture Comparison Matrix

| Architectural Dimension | Legacy System (`templates/` + `api.js` + `Code.gs`) | Room 8 v2 (`Room8v2/`) | Assessment & Verdict |
|---|---|---|---|
| **Identity & Authentication** | 3-letter PIN + typed Name lookup against client-side `MASTER_ROSTER_DATA` and server `validateStudent`. | Cryptographic Google Workspace session: Identity App mints HMAC-SHA256 token `{email, ts, sig}`; Backend verifies before executing. | **Room 8 v2 is significantly superior.** Deletes PIN guessing, impersonation, and manual roster synchronization. |
| **Google Sheet Schema** | Fragmented per-class tabs (`901`, `902`, `903`, `801`, `802`, etc.) + `DEMO` tab + `Submissions_Log`. | Unified `Students` tab keyed by verified email + separate `Roster` tab + `Submissions_Log` + `Class_Log`/`Plan`/`Slide`. | **Room 8 v2 is significantly superior.** Eliminates misfiled class tabs, cross-sheet searches, and section realignment scripts. |
| **Cell Size Limit Protection** | Uncapped JSON ledgers in student rows; vulnerable to the 50,000-character cell limit over a school year. | Built-in `applyArchivalCap_` capping full JSON data to the newest 5 tasks; older tasks are stubbed with `_archived: true`. | **Room 8 v2 is superior.** Proactively prevents the sheet truncation catastrophe flagged in prior audits. |
| **Assignment Authoring** | Monolithic HTML files (~1,704 lines, 75 KB) mixing styling, DOM, modals, auth logic, and field declarations. | Engine-driven: 82-line HTML file declaring a declarative `ASSIGNMENT` config object; `assignment_engine.js` renders the UI. | **Room 8 v2 is significantly superior.** High maintainability; "Content is data, not code"; zero copy-paste code drift. |
| **Effort Telemetry** | Active client telemetry (`EffortTelemetry` in `api.js`): tracks keystrokes, paste events, and active duration. Stamped into `_telemetry`. | Server hooks exist (`backend.gs` strips `_telemetry`), but client (`pipe.js` / `assignment_engine.js`) does not collect it. | **Legacy system is superior.** Telemetry is missing in v2 client-side runtime. |
| **Client Storage Model** | Heavy reliance on `localStorage` (`gas_draft_<slug>_<pin>`) + Chromebook recovery banner + dual-layer cache. | Zero `localStorage`. Transient `sessionStorage` for auth token only. Server autosave and server restore are the sole persistence. | **Room 8 v2 is cleaner, but lacks in-tab crash safety.** Shared Chromebooks wipe `localStorage`, but in-memory reloads need protection. |
| **Network Resilience & Outbox** | Triple-tier transport: CORS POST -> `no-cors` keepalive -> `sendBeacon` -> 3s background `verifyCloudSave` GET + Outbox counter badge. | Dual-tier transport: CORS POST -> `no-cors` keepalive + `sendBeacon` -> 2.5s `verify` polling GET. | **Legacy system has better visual feedback.** Legacy outbox badge warns students when multiple saves are queued. |
| **Offline Awareness & UI Honesty** | Dedicated `sync-pill` states: `synced` (confirmed), `saving`, `offline`, `error`, `locked`. Explicit warning on Wi-Fi drop. | Minimal status indicator (`r8-status`: `Not saved yet`, `Saved [check]`, `Backend unreachable`). No online/offline window listeners. | **Legacy system is superior.** Flaky school Wi-Fi requires high-contrast, persistent visual state indicators. |
| **Emergency Hand-in / Export** | Built-in buttons for JSON Export, "Copy for Google Docs" (Markdown formatted), and Print PDF. | No export utilities. If network fails during end-of-class bell, work cannot be extracted offline. | **Legacy system is superior.** Essential safety net for middle school grading emergencies. |
| **Classroom Display Dashboard** | Turnkey 1080p projector dashboard (`_TEMPLATE_Display_Dashboard.html`): dual-column grid, search, dark mode, dossier view. | Server endpoints implemented (`getClassProgress_`, `getTaskProgress_`), but no projector dashboard UI built yet. | **Legacy system is ahead in phase completion.** v2 needs its display dashboard frontend. |

---

## 3. Deep-Dive Comparative Evaluation

### 3.1. Identity, Security, and Trust Boundaries

#### The Legacy PIN Problem
The legacy system relied on 3-letter uppercase PINs (e.g. `JAD`, `KLE`). In practice, this created multiple failure modes:
1. **Peer Collision & Impersonation:** Students sitting next to each other on Chromebook carts could easily type a peer's PIN, either maliciously or accidentally, clobbering their classmate's ledger.
2. **The "Select Your Class" Trap:** In early V6 iterations, students selected their homeroom from a dropdown. If a student from 803 selected 801, their save wrote to 801's tab, corrupting cross-class statistics. Even after hiding the dropdown for non-demo PINs, the system required a complex client-side alias and resolution engine (`StudentAPI.resolveStudent`).
3. **The Unauthenticated State Trap:** As identified in the September 20 hardening proposals, students could begin typing while unauthenticated (`PIN: ---`). Because cloud saving was gated behind a valid PIN, local storage gave a false sense of security (`⚪ Local Saved`), which was wiped the moment the Chromebook lid was closed and the student logged out.

#### The Room 8 v2 Solution
Room 8 v2 establishes a zero-trust cryptographic pipeline:
- **School Domain Enforced:** The Identity web app (`no_gcp/identity.gs`) executes under the context of the accessing user and calls `Session.getActiveUser().getEmail()`. It strictly validates `ALLOWED_DOMAIN = 'gnspes.ca'`.
- **HMAC Signatures:** The identity payload is signed using a server-side shared secret (`R8_IDENTITY_KEY`):
  ```
  sig = HMAC-SHA256("email|ts", R8_IDENTITY_KEY)
  ```
- **Replay Protection:** Signatures expire after 4 hours (`FRESH_MS = 4 * 60 * 60 * 1000`), perfectly matching a standard school session while preventing token reuse.
- **Sandboxed Popup Handoff:** Because Apps Script HTML runs inside a sandboxed iframe on `*.googleusercontent.com`, standard top-level redirects fail. Room 8 v2 circumvents this constraint by opening a popup window, performing authentication in a first-party context, transmitting the signed token via `window.top.opener.postMessage()`, and closing the popup.

```
+-----------------------------+               +------------------------------+
| Assignment (GitHub Pages)   |               | Identity App (Apps Script)   |
| Origin: *.github.io         |               | Runs as: Visiting Student    |
+--------------+--------------+               +--------------+---------------+
               |                                             |
               | 1. window.open(IDENTITY_URL + '?return=...')|
               +-------------------------------------------->+
               |                                             | 2. Google Workspace Auth
               |                                             |    Session.getActiveUser()
               |                                             | 3. Mint HMAC token:
               |                                             |    {email, ts, sig}
               | 4. window.top.opener.postMessage(id, origin)|
               +<--------------------------------------------+
               | 5. Store in sessionStorage; close popup.    |
               |                                             +------------------------------+
               |
               | 6. POST {action, email, ts, sig, task, data}
               v
+------------------------------------------------------------+
| Backend App (Apps Script)                                  |
| Runs as: Teacher (Master Sheet Owner)                      |
| Enforces: HMAC verification & |now - ts| <= 4h             |
| Appends: Submissions_Log -> Merges: Students Tab           |
+------------------------------------------------------------+
```

**Evaluation Verdict:** Room 8 v2 completely eliminates identity fraud, impersonation, and roster sync friction. It is a massive architectural improvement.

---

### 3.2. Data Model & Storage Scalability

#### The Legacy Multi-Tab Architecture
`Code.gs` V6.x maintained separate tabs for each homeroom (`901`, `902`, `903`, `801`, `802`, `803`, `804`), plus `DEMO`. This created substantial operational friction:
- Changing homerooms required administrative ledger transfers.
- Server-side read actions (`get_class_progress`) had to iterate over multiple tabs or perform cross-sheet scans.
- Teacher demo PINs (`TST`, `WAU`) risked polluting student tabs until routed to an explicit `DEMO` tab.

#### Room 8 v2 Unified Architecture
Room 8 v2 simplifies the database into clean, normalized tabs:
1. `Roster`: Authoritative student registry (`Email, First, Last, Section, Grade, Courses, Updated`).
2. `Students`: Single row per verified email containing metadata, last task, summary, and a consolidated `Ledger (JSON)` cell.
3. `Submissions_Log`: Append-only audit trail (`Timestamp, Email, Section, Task, Status, Summary, Data (JSON), requestId`).
4. `Class_Log`, `Class_Plan`, `Class_Slide`: Teacher logs and daily agendas.

#### The 50,000-Character Cell Limit Defense
A known risk of storing JSON ledgers in Google Sheets is the hard limit of 50,000 characters per cell. Over an entire school year across 15+ assignments, a student's ledger cell will exceed this threshold and throw an uncatchable exception on `setValue()`.

Room 8 v2 natively implements an archival cap in [backend.gs](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/Room8v2/backend.gs#L164-L175):
```javascript
function applyArchivalCap_(ledger) {
  var keys = Object.keys(ledger._tasks);
  if (keys.length <= MAX_FULL_TASKS) return; // MAX_FULL_TASKS = 5
  keys.sort(function (a, b) {
    var ta = ledger._tasks[a].updated || '', tb = ledger._tasks[b].updated || '';
    return String(tb).localeCompare(String(ta)); // newest first
  });
  for (var i = MAX_FULL_TASKS; i < keys.length; i++) {
    var t = ledger._tasks[keys[i]];
    if (t && t.data && Object.keys(t.data).length) { t.data = {}; t._archived = true; }
  }
}
```
Because `Submissions_Log` retains every historical save, pruning full question data from the summary ledger cell after 5 tasks guarantees that `Students` rows never exceed cell limits while keeping active assignments instantly restorable.

---

### 3.3. Authoring Ergonomics: Monolith vs. Engine

#### Legacy: 1,704 Lines of Copy-Paste Vulnerability
In the legacy system, creating a new assignment required duplicating `_TEMPLATE_GAS_Assignment.html`. Each file contained:
- Over 600 lines of CSS styling and theme definitions.
- Modal markup for PIN login, claims, confirmation dialogs, and verification certificates.
- 700+ lines of client JavaScript managing auth state, outbox counts, DOM rendering, and event listeners.

This monolithic pattern led directly to the critical bug documented on September 21 (`F1` in [glm-testingresult-Sept21.md](file:///Z:/simroom/Github%20Repos/bihi2027/audit/glm-testingresult-Sept21.md)): an unhandled reference to `claimClassSelect` crashed `renderPage()`, causing assignments across multiple grades to render as completely blank pages.

#### Room 8 v2: Declarative Configuration
Room 8 v2 cleanly separates engine mechanics from assignment content. Authoring an assignment in `template_assignment.html` requires only defining the data structure:

```javascript
const ASSIGNMENT = {
  taskName: 'HL9 Operation Addictive by Design (Class 2)',
  course: 'HL9',
  title: 'Operation: Addictive by Design',
  badge: 'HL9 - CLASS 2 - 30 MARKS',
  classList: ['902-CIT', '901-CIT', '903-CIT'],
  introHtml: '<p>Analyze the dark patterns in mobile design.</p>',
  sections: [
    {
      title: 'Step 1 - Choose your app',
      hint: 'Pick the app you will rebuild.',
      fields: [
        { id: 's1_base', type: 'select', label: 'Which app?', options: ['TikTok', 'Instagram', 'Snapchat'] },
        { id: 's1_name', type: 'text', label: 'Your project codename:' },
        { id: 's1_notes', type: 'textarea', label: 'Deconstruction analysis:', rows: 4 },
        { id: 's2_features', type: 'checks', label: 'Tricks detected:', options: ['Variable Rewards', 'Infinite Scroll'] }
      ]
    }
  ]
};

Room8.init({ identityUrl: IDENTITY_URL, backendUrl: BACKEND_URL });
R8Assignment.mount({ mount: document.getElementById('r8'), pipe: Room8, assignment: ASSIGNMENT });
```

The underlying renderer ([assignment_engine.js](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/Room8v2/assignment_engine.js)) dynamically constructs the DOM, handles change observation, maps input controls, manages the debounce timer, formats the payload, and orchestrates restoration. Bug fixes to the engine immediately benefit all assignments without touching content files.

---

## 4. Legacy Strengths & Missing Robustness in Room 8 v2

Despite the substantial architectural advantages of Room 8 v2, the legacy system contains critical operational safeguards developed over multiple classroom iterations. These must be migrated to make v2 production-ready.

### 4.1. Effort Telemetry (`_telemetry`)
In a digital classroom, students frequently copy and paste responses from generative AI tools, shared Google Docs, or peers. The legacy system implemented a lightweight, non-invasive effort tracking module in [api.js:26-45](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/api.js#L26-L45):

```javascript
const EffortTelemetry = {
  start: Date.now(),
  keystrokes: 0,
  pastes: 0,
  wired: false,
  wire() {
    if (this.wired || typeof document === 'undefined') return;
    this.wired = true;
    document.addEventListener('keydown', () => { this.keystrokes++; });
    document.addEventListener('paste', () => { this.pastes++; });
  },
  snapshot() {
    this.wire();
    return {
      keystrokes: this.keystrokes,
      pastes: this.pastes,
      duration_sec: Math.round((Date.now() - this.start) / 1000)
    };
  }
};
```

This data is stamped into `payload.data._telemetry`. It records **counts and duration only, never content**, complying fully with student privacy guidelines. 

**The Missing Link in v2:**
In [backend.gs:154](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/Room8v2/backend.gs#L154) and [backend.gs:197](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/Room8v2/backend.gs#L197), the v2 backend explicitly strips `_telemetry` during field counting and hash generation:
```javascript
function strip(o) { var c = JSON.parse(JSON.stringify(o || {})); delete c._requestId; delete c._telemetry; return c; }
```
This demonstrates that the server-side author designed v2 to receive `_telemetry`, but [pipe.js](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/Room8v2/pipe.js) and [assignment_engine.js](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/Room8v2/assignment_engine.js) currently do not collect or dispatch it.

### 4.2. Network Observability & Outbox Telemetry
Middle school wireless networks suffer from intermittent packet drops, AP handoff delays, and proxy latency. The legacy UI communicated network states with complete transparency:
- **Outbox Pending Counter:** Tracked consecutive unconfirmed network dispatches. If $\ge 2$ saves failed, a high-visibility badge alerted the student: `Saving when online - 2 pending`.
- **Honest Verification States:** The UI did not show green until an actual 200 OK with server-computed hash was received. In `no-cors` fallback mode, it remained in an amber `Saving (Verifying cloud save...)` state until confirmed by a background check.
- **Network Reconnect Auto-Flush:** The legacy template listened to `window.addEventListener('online', ...)` to trigger an immediate save when connectivity returned.

**Room 8 v2 Current State:**
`pipe.js` attempts a CORS `fetch`, falls back to `no-cors` + `sendBeacon`, and sets `pending_verify`. However, the visual feedback in `assignment_engine.js` is minimal. If the network drops completely, students see a static status text and may close the Chromebook before verification occurs.

### 4.3. Transient In-Session Crash Recovery (Safe `sessionStorage`)
Room 8 v2 establishes an absolute rule: **No `localStorage` anywhere**. This rule correctly prevents cross-student data contamination on shared Chromebook carts where ChromeOS profiles are wiped on logout.

However, v2 currently stores **nothing** about the student's typed answers on the client. If:
1. A student accidentally presses `Cmd+R` / `F5` while typing,
2. The browser tab crashes due to low RAM,
3. The Chromebook lid is briefly closed before the 2.5-second autosave debounce completes,

all uncommitted work is destroyed. 

**Recommended Hybrid Solution:**
Use `sessionStorage` (scoped strictly to the active browser tab, wiped automatically on tab/window close or Chromebook logout) to cache form drafts on every keystroke. On page load, if a `sessionStorage` draft exists and is newer than the server payload, restore it immediately. This provides instant crash protection without leaving persistent files on shared disk storage.

### 4.4. Emergency Hand-in Utilities (Exporting Under Outages)
In the final 5 minutes of a class period, if the school building loses internet connectivity, 28 students cannot save to Google Sheets. The legacy system included client-side emergency export buttons:
- **Download JSON:** Emits a `.json` backup file locally to the Chromebook's `Downloads` folder.
- **Copy for Google Docs:** Generates clean, human-readable Markdown containing all questions and answers, copied directly to the system clipboard for immediate pasting into Google Classroom or Docs.

Room 8 v2 lacks any client-side export utility. If the backend is unreachable at the bell, students have no way to preserve their work.

---

## 5. Actionable Roadmap & Code Improvements for Room 8 v2

To bring Room 8 v2 to full production readiness, the following enhancements should be implemented across `pipe.js`, `assignment_engine.js`, and `backend.gs`.

### 5.1. Implement Effort Telemetry in `pipe.js`

Add keystroke, paste, and session timing tracking directly into `pipe.js`:

```javascript
// Inside pipe.js: Add telemetry collector
var telemetry = (function () {
  var start = Date.now();
  var keystrokes = 0;
  var pastes = 0;
  var wired = false;

  function wire() {
    if (wired || typeof document === 'undefined') return;
    wired = true;
    document.addEventListener('keydown', function () { keystrokes++; }, { passive: true });
    document.addEventListener('paste', function () { pastes++; }, { passive: true });
  }

  function snapshot() {
    wire();
    return {
      keystrokes: keystrokes,
      pastes: pastes,
      durationSec: Math.round((Date.now() - start) / 1000)
    };
  }

  return { wire: wire, snapshot: snapshot };
})();

telemetry.wire();
```

Attach `telemetry.snapshot()` into `autosave`:
```javascript
// In autosave snapshot collection:
function snapshot() {
  return {
    task: opts.task,
    section: opts.section || '',
    summary: opts.summary || '',
    data: getData(),
    _telemetry: telemetry.snapshot()
  };
}
```

### 5.2. Add Network State & Outbox Telemetry in `pipe.js`

Enhance `autosave` with explicit connectivity tracking and network listeners:

```javascript
var pendingOutboxCount = 0;

function updateOutbox(delta) {
  if (delta === 0) pendingOutboxCount = 0;
  else pendingOutboxCount = Math.max(0, pendingOutboxCount + delta);
  if (opts.onOutboxChange) opts.onOutboxChange(pendingOutboxCount);
}

window.addEventListener('online', function () {
  if (ctl && ctl.isDirty()) {
    ctl.saveNow();
  }
});
```

Expose visual states in `assignment_engine.js`:
- `synced`: Confirmed cloud save with timestamp.
- `saving`: Active network dispatch in progress.
- `pending_verify`: Sent via `no-cors` fallback; polling for server confirmation.
- `offline`: Wi-Fi dropped; display sticky warning: `Offline - Do not close Chromebook`.

### 5.3. Safe In-Tab Draft Recovery (`sessionStorage`)

Add crash recovery to `assignment_engine.js` using `sessionStorage`:

```javascript
var DRAFT_PREFIX = 'r8_tab_draft_';

function saveTabDraft(task, answers) {
  try {
    sessionStorage.setItem(DRAFT_PREFIX + task, JSON.stringify({
      answers: answers,
      timestamp: Date.now()
    }));
  } catch (e) {}
}

function getTabDraft(task) {
  try {
    var raw = sessionStorage.getItem(DRAFT_PREFIX + task);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearTabDraft(task) {
  try { sessionStorage.removeItem(DRAFT_PREFIX + task); } catch (e) {}
}
```

During initialization in `mount`:
1. Check `getTabDraft(task)`.
2. Compare with `pipe.load(task)`.
3. If local in-tab draft has more completed fields or is newer than server save (e.g. from an accidental browser refresh), restore the tab draft and trigger an immediate cloud save.

### 5.4. Emergency Hand-in Utilities

Add export utilities to `assignment_engine.js` below the save bar:

```javascript
function copyForDocs(cfg, answers, who) {
  var md = '# ' + (cfg.title || 'Assignment') + '\n';
  md += '**Student:** ' + (who ? who.name : 'Unknown') + ' (' + (who ? who.email : '') + ')\n';
  md += '**Section:** ' + (who ? who.section : '') + '\n';
  md += '**Exported:** ' + new Date().toLocaleString() + '\n\n';

  (cfg.sections || []).forEach(function (sec) {
    md += '## ' + sec.title + '\n\n';
    (sec.fields || []).forEach(function (f) {
      if (f.type === 'static') return;
      var val = answers[f.id];
      var displayVal = Array.isArray(val) ? val.join(', ') : (val || '—');
      md += '- **' + (f.label || f.id) + ':** ' + displayVal + '\n';
    });
    md += '\n';
  });

  navigator.clipboard.writeText(md).then(function () {
    alert('Copied assignment to clipboard! You can paste this directly into Google Classroom or Google Docs.');
  }).catch(function () {
    prompt('Copy your work manually below:', md);
  });
}
```

### 5.5. The Google OAuth Consent Gate (Operational Risk)

As documented in [PIPE.md:106](file:///Z:/simroom/Github%20Repos/bihi2027/Student_System/Room8v2/PIPE.md#L106):
> "Session.getActiveUser() was proven for the teacher account. A real student account consenting to the 'Room 8 Identity (Unverified)' screen is still untested — it is the last gate before live use."

In Google Workspace for Education domains, unverified Apps Script applications trigger a warning screen:
1. `Google hasn't verified this app`
2. `Advanced` -> `Go to Room 8 Identity (unsafe)`
3. Requesting access to view Google account email.

**Critical Action Item for Production:**
1. Test with a real `@gnspes.ca` student account before class.
2. If the domain restricts unverified scripts for students under 18, request that the school Google Workspace domain administrator add the script project ID to the domain's **Trusted Apps** whitelist (Google Admin Console -> Security -> Access and data control -> API controls).

---

## 6. Conclusion & Recommendation

Room 8 v2 represents a major architectural leap forward for the Bicentennial Junior High classroom system. The transition to cryptographic email-based identity and a declarative, engine-driven template architecture resolves the fundamental flaws of the PIN era:

1. **Identity Integrity:** Impersonation and misrouted saves are eliminated by HMAC-SHA256 tokens and domain filtering.
2. **Database Cleanliness:** The single `Students` tab and automated archival capping permanently resolve cross-tab search overhead and the 50,000-character cell ceiling.
3. **Maintainability:** Refactoring assignments into 80-line declarative configs eliminates copy-paste runtime bugs and accelerates content creation.

To achieve full classroom robustness, Room 8 v2 should adopt the proven telemetry and edge-case protections from the legacy system:
- **Client-side Effort Telemetry** (`keystrokes`, `pastes`, `durationSec`).
- **Network Observability** (outbox counters, reconnect listeners, sticky offline alerts).
- **In-Tab Session Draft Caching** (`sessionStorage`) to eliminate accidental refresh loss.
- **Emergency Clipboard & JSON Exports** to safeguard against building-wide network outages.

With these hardening additions, Room 8 v2 will be a resilient, scalable, and secure classroom platform ready for multi-grade production deployment.
