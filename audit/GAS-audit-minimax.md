# Student Webhook GAS Audit — September 2026

**Scope:** `Student_System/Code.gs` (980 lines) + `Student_System/api.js` (510 lines)
**Author:** Mavis (ZCode) · review pass for 9-month reliability
**Verdict:** **Solid core, but several sharp edges that will bite by Term 2.** Recommend a focused hardening pass before Term 1 report cards (Nov 23).

This is a **proposal only** — no other docs have been touched.

---

## TL;DR

The architecture is right: LockService for concurrency, `_tasks[taskName]` isolation for multi-assignment, no-cors fallback on the client, cross-sheet finder, upsert-by-key on Class_Log, visual gradebook columns. None of that needs to change.

What needs to change are things that **fail silently, grow linearly with usage, or break the moment a teacher renames an assignment**:

| # | Severity | Issue | One-line fix |
|---|---|---|---|
| 1 | 🔴 High | No idempotency key on submit → double-clicks double-write | Add `requestId` to payload, dedupe in `Submissions_Log` |
| 2 | 🔴 High | No schema versioning in `savedData` → field renames orphan old student work | Add `_v: 1` to mergedData + migration helper |
| 3 | 🔴 High | All 980 lines in one file → edit risk grows with every new assignment | Split into 4–5 logical `.gs` files (Apps Script supports this) |
| 4 | 🟡 Med | No central task-name registry → rename an assignment = silent dashboard breakage | Create `TaskRegistry.gs` + `tasks.json` |
| 5 | 🟡 Med | Visual gradebook column is O(n) header scan on every save | Cache header map per (sheet, session) |
| 6 | 🟡 Med | No structured logging → "did it save?" answer is a manual Sheet dive | Add `Logs` sheet + `logEvent(level, action, ctx)` |
| 7 | 🟡 Med | No health-check / `ping` endpoint → dashboards can't tell if GAS is alive | Add `action=ping` |
| 8 | 🟢 Low | Magic strings for sheet names + section keys throughout | Move to a `Constants.gs` |
| 9 | 🟢 Low | `submit_class_log`/`set_class_plan`/`set_class_slide` repeat the PIN gate inline | Extract `requireTeacherPin(payload)` |
| 10 | 🟢 Low | Silent `catch (colErr) {}` on visual gradebook write | Log + return warning in response |
| 11 | 🟢 Low | Lock timeout is hardcoded 30s, no backoff hint in error | Surface "lock contention — retry" in the response |

There are roughly **30 small issues** I'd touch in a 2-day pass. The 11 above are the ones I'd refuse to ship September 2027 without.

---

## What's solid (don't touch)

- **`LockService.getScriptLock()`** wrapping `doPost` + released in `finally` — textbook concurrency control.
- **`_tasks[taskName]` isolation** — each assignment's payload is namespaced, so 17 simultaneous assignments can't trample each other.
- **Cross-sheet `findStudentAcrossSheets`** — prevents the "orphaned empty login row" failure mode that bit you last year.
- **`get_class_progress` real-work-trumps-placeholder dedup** — heuristics are subtle but correct in the cases that have come up.
- **`no-cors` + `sendBeacon` fallback in api.js** — zero student work lost to CORS or page-unload since deployed.
- **Class_Log upsert by (date + section)** — re-logging the same class is idempotent; mistakes are fixable.
- **Date normalization (`toIsoDate`/`toIsoStamp`)** — handles Sheets auto-converting `'2026-09-17'` strings to real Dates invisibly.
- **PIN/name validation layers** in api.js — local fuzzy match + cloud authoritative + roster gate. Correct ordering.
- **Visual gradebook auto-column** — saves the teacher from manual tab maintenance; teachers actually use this.

---

## Deficiency catalog

### 🔴 High severity

#### 1. No idempotency key on submit — silent double-writes
**Where:** `doPost` → `submit_profile` branch (lines 686–786) + api.js `submitProfile` (lines 241–330).
**Failure:** A Chromebook that fires the no-cors fallback gets a generic `{status: 'submitted_no_cors'}`. The client doesn't know if the server actually persisted. A retry produces a second `Submissions_Log` row, a second visual gradebook ✅, and a second JSON merge. By November you'll have students with **two ✅ checkmarks on the same assignment**.
**Fix:** Add an optional `requestId` (UUID v4) to every `submit_profile` payload. In the server, before merging, scan the last N rows of `Submissions_Log` for `requestId` match; if found, return the original response. Two-line client change, six-line server change.

#### 2. No schema version in `savedData` — future field renames orphan old work
**Where:** `mergedData` construction in `submit_profile` (lines 722–743).
**Failure:** If you rename `where_personal` → `cat1_personal` (which already happened — both keys exist in the data, see Aurelia's row), old students keep the old key and dashboards silently miss them. Worse: if you ever add a **required** field to a new task, old savedData without that field will render broken pages with no warning.
**Fix:** Stamp `_v: 1` on mergedData on write. Add `migrateData(data)` helper that any reader can call to upgrade. Cheap insurance for September 2027 when you've forgotten what the current schema looks like.

#### 3. Single 980-line `Code.gs` — edit risk grows monotonically
**Where:** The whole file.
**Failure:** Every new assignment requires editing the giant `doPost` if/else chain, plus sheet helpers, plus the cross-sheet finder, plus the validation path. By November you'll have copy-pasted a `submit_*` action 12 times. By February, one of them will silently shadow another because the action strings are typo-prone.
**Fix:** Apps Script **supports multiple `.gs` files in one project** (the standalone editor groups them; the new IDE shows them as tabs). Split into:

```
Code.gs          — entry points: doGet, doPost, doOptions, successJSON
Routing.gs       — action dispatch table; doPost is 8 lines
Actions.gs       — one file per action: login(), submitProfile(), deleteClassLog(), ...
Sheets.gs        — getSheetForClass, getSubmissionsLogSheet, getClassLogSheet, ...
Validators.gs    — requireTeacherPin, normalizePin, parseIsoDate
Constants.gs     — SHEET_NAMES, CLASS_KEYS, ACTION versions
TaskRegistry.gs  — TASK_DEFINITIONS, validation, label→taskName map
Logger.gs        — logEvent(level, action, ctx) → Logs sheet
```

The `doPost` body shrinks to a lookup. Adding a new action becomes "drop a file in Actions.gs and add one line to the dispatch table." Edit blast radius is now local.

---

### 🟡 Medium severity

#### 4. No central task-name registry
**Where:** Every HTML file with a hard-coded `TASK_NAME` constant. Search hits at minimum: `Places_Of_Significance_Studio.html`, `18_Cit9_Real_Issues_Dossier.html`, `07_Prior_Course_Diagnostic_Interactive.html`, `15_Cit9_Student_Diagnostic_Audit_Report.html`, the three HL9 audit templates, and presumably every future assignment.
**Failure:** You rename *Real Issues Case File #1: The Rent We Pay* to *The Rent We Pay: HRM Cost-of-Living Audit* (because Sept 23 you decide the framing should change). The HTML file updates its constant. The dossier still works for new submissions. But the cloud keeps storing under the **old** taskName, so the progress dashboard's "submitted" check returns false for every student, and the visual gradebook column for the old name sits there with ✅ checkmarks forever. **You'll only notice when report-card season arrives and nothing matches.**
**Fix:** Centralize in a `tasks.json` data file (loaded via `UrlFetchApp` or embedded as a `TASKS` constant in `TaskRegistry.gs`):

```js
const TASKS = {
  CIT9_WHERE: { taskName: "The WHERE Project — Places Portfolio", course: "CIT9", active: true },
  CIT9_RENT:  { taskName: "Citizenship 9 — Real Issues Case File #1: The Rent We Pay", course: "CIT9", active: true, weight: 0.05 },
  // ...
};
```

HTML files reference `window.TASKS.CIT9_RENT.taskName`. Server-side validates `payload.taskName in TASKS` on submit. Renames are one-line edits with audit trail.

#### 5. Visual gradebook column scan is O(n) per save
**Where:** `getOrCreateAssignmentColumn` (lines 106–126) called on every `submit_profile`.
**Failure:** After ~30 tasks have been written to a class sheet, every save scans all 30+ header cells + does a case-insensitive string compare. Not catastrophic (Apps Script is slow anyway) but it's needless work. With 110 students × 5 saves/class × 5 classes = 2,750 saves/year, that's 2,750 × 30-cell scans.
**Fix:** Cache the header map per (sheet name) in a `CacheService` script cache with a 6-hour TTL. Reset on column insertion.

#### 6. No structured logging
**Where:** Everywhere. The only "log" is the `Submissions_Log` sheet.
**Failure:** When something goes wrong at 11pm on a Sunday (and it will — AGENTS.md already documents intermittent Google HTML errors on GETs), your only diagnostic is to read every line of every submission. You have no way to ask "show me every error from the last 24h" or "did the lock time out for anyone today?"
**Fix:** Add a `Logs` sheet (append-only, auto-trim to last 10k rows). New `logEvent(level, action, ctx)` helper called from every catch block. Cheap to add incrementally.

#### 7. No health-check endpoint
**Where:** N/A — doesn't exist.
**Failure:** `Class_Opening_Slide.html` can't tell if the GAS is alive before it tries to fetch the class log. If the deployment is paused (Apps Script auto-pauses after inactivity), the slide silently goes blank.
**Fix:** One-liner `action=ping` returns `{status: 'pong', version: 'GAS_v1.2.3', uptime_check: '...'}`.

---

### 🟢 Low severity (worth doing, won't break anything if skipped)

#### 8. Magic strings for sheet names + class keys
**Where:** 'Class_Log', 'Class_Plan', 'Class_Slide', 'Submissions_Log', '901', '902', '903', '801', '802', '803', '804' — all hard-coded throughout.
**Fix:** Move to `Constants.gs`:
```js
const SHEETS = { CLASS_LOG: 'Class_Log', CLASS_PLAN: 'Class_Plan', CLASS_SLIDE: 'Class_Slide', SUBMISSIONS_LOG: 'Submissions_Log' };
const CLASS_KEYS = ['901','902','903','801','802','803','804'];
```
Single source of truth. Renames are trivial.

#### 9. Teacher PIN gate duplicated four times
**Where:** Lines 478–481, 537–540, 557–560, 579–582 in Code.gs.
**Fix:** Extract `function requireTeacherPin(payload)` that throws if `CLASS_LOG_PIN` is set and doesn't match. Each action calls it once. Less risk of forgetting to add it to a new action.

#### 10. Silent catch on visual gradebook write
**Where:** Lines 772–779.
**Fix:** Log the error to the Logs sheet and include a `warnings: ['gradebook_column_update_failed']` field in the success response. Teacher sees a non-blocking warning instead of a silent partial write.

#### 11. Hardcoded 30s lock timeout
**Where:** Line 428.
**Fix:** Catch the lock-timeout specifically (it's a known `LockService` exception) and return a distinct response so the client can retry intelligently instead of falling into the no-cors path.

---

## What I'd skip (already fine)

- **The `_tasks[taskName].data` design** — correct. Don't touch.
- **The cross-sheet merge in `get_class_progress`** — heuristic but reliable for your data volume. Don't replace with a relational refactor unless you're moving to Cloud SQL, which is overkill.
- **The api.js PIN/name validation chain** — `validateStudent` is correct and well-tested in practice.
- **The `Session` helper using sessionStorage** — correct for shared Chromebook carts. Switching to localStorage would actually break the design intent.
- **The whole Class_Log + Class_Plan + Class_Slide trio** — symmetric, well-tested. Don't refactor.

---

## Concrete recommendation: phased rollout

If you greenlight this, here's how I'd sequence it so nothing breaks mid-term:

### Phase A — Cheap insurance (1 afternoon, before any student sees it break)
- Add `_v: 1` to mergedData + `migrateData()` helper.
- Add `requestId` idempotency check in `submit_profile`.
- Add `action=ping` endpoint.
- Add `logEvent()` helper + Logs sheet.

**Risk:** Zero — these are additive. Existing submissions keep working.

### Phase B — Structural split (1 day, optional but high-leverage)
- Split `Code.gs` into the 7-file layout above.
- Add `Constants.gs` + `TaskRegistry.gs`.
- Move teacher PIN gate to `requireTeacherPin()`.

**Risk:** Low. Same external behavior; just better-organized code. Apps Script hot-reloads on save.

### Phase C — Caching + observability (half-day)
- CacheService for gradebook header map.
- Lock-timeout catch path with distinct retry response.

**Risk:** Zero — pure performance + DX.

### Phase D — Test fixtures (only if you want to sleep well)
- `Tests.gs` with `runTests()` you can invoke manually: canned PINs, canned payloads, asserts on response shape.
- Plus a `_TEST` script property that puts the GAS in "dry run" mode for the next call (writes to a `_TEST_Logs` sheet instead of real ones).

**Risk:** Zero; pure addition.

I'd ship Phases A + C before the November report cards, and Phase B whenever you have a free half-day. Phase D is luxury.

---

## Open questions for you

1. **Are you OK with a one-line per-HTML-file edit to switch to `window.TASKS.CIT9_WHERE.taskName`?** Or do you want to keep `TASK_NAME` constants for assignment-local clarity? (I'd centralize.)
2. **Is the teacher PIN (`CLASS_LOG_PIN` script property) actually set today?** I didn't see it in the docs. If not, every class-log write is currently unguarded — fine for the log itself (no student data), but worth knowing.
3. **Do you ever want a sandbox deployment for testing schema changes?** Right now there's one prod URL for all courses. If yes, the `TASK_REGISTRY` refactor is a natural time to add a `ENV = 'prod' | 'sandbox'` switch.
4. **Is the Submissions_Log sheet being maintained/archived?** At current write rate it'll hit ~5,000 rows by June. Sheets handles it, but query times on `get_class_progress` will start to hurt at ~20k rows.
5. **Do you want Antigravity to take a first pass at Phase A** (the four additive items) as a starting draft for you to review, or would you rather drive that yourself?

---

## Files referenced

- `Student_System/Code.gs` (980 lines, 37 KB) — primary backend
- `Student_System/api.js` (510 lines, 25 KB) — primary client
- `Student_System/_TEMPLATE_GAS_Assignment.html` — pattern reference for new assignments
- `Student_System/WHERE_Grade9_Progress_Dashboard.html` — primary reader of this data
- `AGENTS.md` — class log + webhook section (read-only reference)
- `Student_System/CLASS_LOG_README.md` — class log API contract
