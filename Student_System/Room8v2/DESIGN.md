# Room 8 v2 — design spec

A clean rebuild of the old Apps Script backend (`Student_System/Code.gs`, "V6.x") on the
Google-auth pipe. Written down *before* the code, on purpose: the old system grew
organically and that is exactly what this replaces.

## Why v2 exists

The old backend works but carries a PIN era: 3-letter PINs, per-class PIN-keyed tabs, a
cross-sheet finder, "clean mismatched classes" repairs, a private PIN roster, and demo
PINs. The new pipe knows **who a student is** (a verified `@gnspes.ca` email) before any
data is touched. v2 rebuilds the useful parts on that fact and drops the rest.

## Scope (approved)

- **In:** student core (identity → resolve → submit → restore) + class log / plan / slide.
- **Later phases:** progress reads/dashboards, feedback, lockers, teacher utilities.
- **Relationship to live:** *parallel*. The old system and old sheet stay live for current
  classes. v2 serves new work only, until it has parity.
- **Data:** teacher data carries over (roster, class log/plan/slide). **Student work starts
  fresh**; the old sheet remains the archive.

## Architecture

| Piece | What | Deploy |
|---|---|---|
| **Identity app** | unchanged; mints `{email, ts, sig}` | Execute as: *User accessing*, Anyone |
| **Backend app (v2)** | all data ops; successor to the pilot `vault.gs` | Execute as: *Me*, Anyone |
| **Room 8 v2 — Master** | a NEW Google Sheet, separate from the old Master | — |
| **Pages** | GitHub Pages, calling the Backend via `pipe.js` | — |

Trust boundary: the Vault/Backend verifies `sig = HMAC-SHA256("email|ts", R8_IDENTITY_KEY)`
and `|now − ts| ≤ 4h` before doing anything. The Identity app is the only minter.

## Data model (Room 8 v2 — Master)

```
Roster           Email | First | Last | Section | Grade | Courses | Updated
Students         Email | Name | Section | Grade | Task/Stage | Ledger(JSON) | Summary | Last Updated | <one gradebook column per task>
Submissions_Log  Timestamp | Email | Section | Task | Status | Summary | Data(JSON) | requestId
Class_Log        Date | Section | Course | Class # | What We Did | Next Class | Timestamp
Class_Plan       Section | Next Note | Next Class # | Updated
Class_Slide      Section | Title | Announcements | Outcome | Updated
```

`Students.Ledger` JSON:

```json
{ "_v": 1, "email": "...", "name": "...", "section": "902-CIT", "grade": 9,
  "_tasks": { "<taskName>": { "updated": "...", "summary": "...", "status": "submitted",
                              "data": { ...arbitrary assignment payload... } } } }
```

**One `Students` tab keyed by verified email** — not per-class PIN tabs. This deletes the
entire misfiled-row / cross-sheet bug class.

## Action surface

**Student (HMAC-verified):**
- `resolve_student` → `{known, email, name, first, last, section, grade, courses}` — drives
  **auto-section** (no self-selected class).
- `submit_assignment` → append to `Submissions_Log` (outside the lock) then merge
  `_tasks[task]` into the `Students` row (inside the lock).
- `load_assignment` → latest `_tasks[task]` for the verified email.
- `get_my_tasks` → the student's own task index.

**Teacher (PIN-gated, fail-closed on Script Property `CLASS_LOG_PIN`):**
`get_health` · `get_roster_meta` · `set_roster` · `get_class_progress` · `get_student_history`
· `get_class_log` · `submit_class_log` · `set_class_plan` · `set_class_slide` ·
`delete_class_log` · `selftest`

## Keep / drop / improve

**Keep (proven in V6.x):** append-log-outside-lock + merge-inside-lock; `requestId`
idempotency; `_tasks[taskName]` isolation; the anti-wipe guard (never blank out real work);
corrupt-cell abort; version + `get_health`.

**Drop (PIN era):** PIN login, PIN `resolve_student`, demo PINs, `Roster_Private` PIN keys,
the cross-sheet student finder, `MASTER_PIN_HOMEROOM_MAP`, per-class PIN tabs,
`clean_mismatched_classes`.

**Improve:** email identity; roster-driven auto-section; a single student tab; **version
stamped on every response** (V6.x omitted it in several); a `selftest` integrity action; a
**per-task archival cap** (full data for the last N tasks, older ones stubbed) to dodge the
50k-cell limit the audit flagged.

## Phases

0. This spec.
1. Backend core + `pipe.js` + a thin connection test page.
2. Roster bootstrap (email → section/name) from the old class tabs' self-reported emails,
   teacher-verified.
3. Template assignment ("content is data, not code"); port the HL8 Junction page.
4. Class log/plan/slide port + re-point `Class_Log_Tracker` / `Class_Startup`.
5. `get_class_progress` / `get_student_history` + re-point dashboards.
6. Feedback, lockers, teacher utilities.

## Gates & risks

- **Student consent is unverified.** Phases 3+ are moot if a real student can't sign in via
  the popup consent. Confirm before building on it.
- **Deploy drift.** One app keeps the surface small; still bump the version constant, then
  Manage deployments → New version → Deploy.
- **Roster emails are self-reported.** Auto-section misassigns if they're wrong; so
  `resolve_student` returns `known:false` and the page asks rather than guesses.