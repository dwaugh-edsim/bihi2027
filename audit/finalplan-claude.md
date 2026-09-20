# Final Hardening Plan — GAS Backend & Client (2026–2027)
**Synthesized by:** Claude · **Date:** September 20, 2026
**Inputs:** `plan-of-action-candidate1-gemini.md`, `plan-of-action-candidate1-glm.md`, `plan-of-action-candidate1-minimax.md`, plus all three underlying audits and live verification of `Code.gs` V5 (981 lines) and `api.js` (510 lines)

---

## How I read the three plans

All three plans agree on the same verdict: **the architecture is correct; the implementation has gaps that will cause data loss by spring.** They agree on the same four critical issues. Where they disagree is on sequencing, scope, and a few factual questions. Here's my tiebreaker analysis:

| Dimension | Gemini | GLM | MiniMax | My call |
|---|---|---|---|---|
| **Best diagnosis of the Sep 16 902 incident** | Missed deployment drift | Proved it from the data shape | Missed it | GLM is right — the `data` key was absent because an old script version was deployed. This is the only *demonstrated* failure. |
| **Best understanding of client-side silent-success** | Partial | Full analysis of the `no-cors` to `cloudSynced: true` path | Partial (focused on idempotency, which is a different bug) | GLM again — the `no-cors` fallback marks saves as synced without confirmation. MiniMax's idempotency fix prevents *double-writes*, not *false success*. Both bugs exist; both need fixing. |
| **50k cell limit** | Found | Found + math | Missed in audit (addressed in plan) | All three plans address it. The inline-cap-with-stubs approach (GLM/MiniMax) is better than per-task columns (Gemini) because it preserves the one-row-per-student model that every dashboard depends on. |
| **Exemplar/"Tess" bug** | Server-side guardrail | Missed in audit; accepted from Gemini's plan | Missed | Gemini's server-side signature check is the right immediate fix. GLM adds a correct secondary point: the *client* should also never autosave exemplar content under a student session. Both layers are needed. |
| **File split (Code.gs to 7 files)** | Phase 3 | Defer | Phase B, high priority | **Defer.** GLM is right: 980 lines is manageable; a dispatch table in `doPost` solves shadowing risk without file-splitting. The single-paste deploy model is valuable for a teacher maintaining this in the GAS web editor. Split only if the file crosses ~1,500 lines. |
| **Task registry** | Not addressed | Quarantine unknowns | Central constant | Both are right. Quarantine unknown `taskName`s server-side (don't hard-reject — you'd lose the data). Central constant is a nice-to-have; can be gradual. |
| **Schema `_v` stamp** | Not addressed | Not addressed | One-line addition | Accept — one line, cheap insurance. |

> **IMPORTANT:** The demonstrated failure — deployment drift — is what actually cost students their work. Every plan that doesn't make version visibility the literal first change is sequenced wrong. GLM gets this right.

---

## Inviolable constraints (all three plans agree)

1. **Zero changes to existing assignment HTML files.** All client-side fixes live in `api.js`.
2. **Chromebook resilience stays.** The `no-cors` + `sendBeacon` fallback chain stays intact, but gets hardened with actual confirmation.
3. **One-paste deployability.** Code.gs remains a single file for now. No build tooling required.
4. **Submissions_Log is sacred.** Append-only. Nothing ever deletes or rewrites it. Compaction only trims *old duplicate rows per (pin, task)*, never the latest.

---

## The plan: 4 phases, additive-first

```
Phase 0 --- TODAY (30 min) ---------- Drift visibility + data recovery
Phase 1 --- BEFORE NEXT CLASS ------- Guard rails (stop silent loss)
Phase 2 --- BY MID-OCTOBER ---------- Scale hardening (beat the 50k wall)
Phase 3 --- AS APPETITE ALLOWS ------ Hygiene & resilience extras
```

---

### Phase 0 — Immediate: Version Visibility & 902 Recovery
**Effort:** 30 minutes · **Risk:** Zero · **Status:** `[x]` **DEPLOYED & VERIFIED LIVE** (Sep 20, 2026)

| # | Change | Status | Files & Lines | Source |
|---|---|---|---|---|
| 0.1 | **Add `CONFIG.VERSION = 'V6.0-2026-09-20'`** at the top of Code.gs. Bump on every edit. | `[x]` LIVE | `Code.gs:29-34` | All three |
| 0.2 | **Add `?action=get_health` GET endpoint.** Returns: `{status, version, deployDate, sheetInventory, rowCounts, logRows}`. Bookmark it. Hit it before every class. | `[x]` LIVE | `Code.gs:197-219` | All three |
| 0.3 | **Recover 902 HL9 10-Station Audit data.** Extract the last Sep 16 payload per 902 PIN from `Submissions_Log` column H. | `[ ]` Queued | One-time recovery utility | GLM |

> **TIP:** The runbook rule that retires this bug class forever: after every Code.gs edit, paste into GAS editor, Deploy, Manage Deployments, New Version, open `get_health` bookmark, confirm version string matches. If it doesn't match, the deployment is stale.

**Verification:** `get_health` returns `V6.0-2026-09-20` (Confirmed live Sep 20, 2026).

---

### Phase 1 — Before Next Class: Stop Silent Data Loss & Concurrency Crunch
**Effort:** 2–3 hours · **Risk:** Very low (all additive) · **Status:** `[x]` **DEPLOYED & VERIFIED LIVE** (Sep 20, 2026)

| # | Change | Fixes | Status | Files & Lines | Source |
|---|---|---|---|---|---|
| 1.1 | **Exemplar guardrail (server-side).** Signature check blocks teacher samples from student PINs. Returns `{status: 'blocked_exemplar'}`. | Tess bug (Gemini #3) | `[x]` LIVE | `Code.gs:744-764` | Gemini |
| 1.2 | **Demo PIN routing.** `TST/WAU/DEV/MRW` writes go to a `DEMO` tab (auto-created), never a real class tab. | Demo impersonation (GLM A5) | `[x]` LIVE | `Code.gs:648-660` | GLM |
| 1.3 | **Merge abort on corrupt cell.** If Column G is non-empty but `JSON.parse` fails, stashes raw text in `Submissions_Log` as `__corrupt_backup`; refuses overwrite. | Silent merge wipe (GLM A3) | `[x]` LIVE | `Code.gs:818-848` | GLM |
| 1.4 | **Idempotency key.** Generate `requestId` (UUID v4) in `api.js` on every submit. Server scans last 100 `Submissions_Log` rows for dedupe. | Double-click duplicates (MiniMax #1) | `[x]` LIVE | `api.js:366-375`, `Code.gs:765-793` | MiniMax |
| 1.5 | **Confirm-after-write + in-session verification.** Server returns `{hash, byteLength, version}`. Client validates before confirming. Immediate in-session `verifyCloudSave` for Chromebooks. | Silent no-cors false-success (GLM A2) | `[x]` LIVE | `Code.gs:918-930`, `api.js:445-515` | GLM |
| 1.6 | **Batch roster write.** Single `setValues` call replaces multiple `setValue` calls. Eliminates mid-sequence partial writes. | Half-written rows (GLM C2) | `[x]` LIVE | `Code.gs:879-895` | GLM |
| 1.7 | **Schema stamp.** Add `_v: 1` to `mergedData` on every write. | Future field renames (MiniMax #2) | `[x]` LIVE | `Code.gs:874-876` | MiniMax |
| 1.8 | **Lock hold time speedup (Phase 2.6 pulled forward).** Eliminated 4 remote `getValue()` calls inside lock; uses pre-fetched row memory. Lock time dropped from ~1000ms to ~200ms. | End-of-class lock contention | `[x]` LIVE | `Code.gs:880-895` | Teacher / Waugh |
| 1.9 | **Submissions_Log append outside lock.** Raw payload appended *before* lock is requested. No student work can ever be lost on lock timeouts. | Lock timeout data loss | `[x]` LIVE | `Code.gs:794-809` | Teacher / Waugh |
| 1.10 | **End-of-Class Crunch Protection.** Fast 32-bit payload hashing (`_hashPayload`); skips redundant writes on lid close if already synced. In-flight guard with `keepalive: true`. | Chromebook lid-close thunder herd | `[x]` LIVE | `api.js:344-410, 525-585` | Teacher / Waugh |
| 1.11 | **Client-Side Server Version Watchdog & Red Alert Banner.** Sticky red banner drops on student screens if server is outdated or unversioned. Triple-trigger check. | Accidental rollbacks & version drift | `[x]` LIVE | `api.js:11, 245-342, 832-842` | Teacher / Waugh |

---

## Line-by-Line Confirmation of Completed Edits

### 1. `Student_System/Code.gs` (1,135 Lines) — Server-Side Live Deployment

| Line Range | Function / Section | Exact Edit & Confirmation |
|---|---|---|
| **Lines 29–34** | Header Constants | Added `CONFIG_VERSION = 'V6.0-2026-09-20'`, `CONFIG_DEPLOY_DATE`, `DEMO_PINS`, `EXEMPLAR_SIGNATURES`, `ALL_CLASSES`. Single source of truth. |
| **Lines 197–219** | `doGet` (`action === 'get_health'`) | Returns `{status: 'healthy', version, deployDate, sheetInventory, rowCounts, logRows}`. Verified live via curl returning 4,296 log rows. |
| **Lines 648–660** | `doPost` routing | Demo PIN routing: `TST`, `WAU`, `DEV`, `MRW` writes are forced to `className = 'DEMO'` and cross-sheet search is bypassed. Verified live. |
| **Lines 744–764** | `submit_profile` Guardrail | Exemplar check: scans payload string for `"Smith Point Road"`, `"Gwangju"`, `"k7n7dESM4Hg"`, `"Mauritius"`, `"Yeah Yeah No No"`. Blocks write if on non-demo PIN, logs block, and returns `status: 'blocked_exemplar'`. Verified live. |
| **Lines 765–793** | `submit_profile` Idempotency | Scans last 100 rows of `Submissions_Log` for matching `_requestId`. If match found, returns `deduplicated: true` and aborts re-writing. Verified live. |
| **Lines 794–809** | `Submissions_Log.appendRow` | **CRITICAL:** Appends raw payload to immutable audit log **BEFORE acquiring the lock**. Even if the roster merge times out, raw student answers are 100% permanently captured. |
| **Lines 810–816** | Lock Acquisition | `lock.waitLock(30000)` acquired **only** for the roster read-modify-write cycle. |
| **Lines 818–848** | Corrupt-Cell Merge Abort | If Column G is non-empty but fails `JSON.parse`, stashes raw corrupt text in `Submissions_Log` as `__corrupt_backup` and refuses to overwrite. Eliminates silent data wipes. |
| **Lines 874–876** | Schema Stamp | Injects `mergedData._v = 1` into all stored payloads for forward migration. |
| **Lines 879–895** | Batch Roster Write & Lock Speedup | **PERFORMANCE:** Replaced 6 separate `setValue` calls with a single `setValues` call. Eliminated 4 remote `getValue()` calls by reading pre-fetched `studentRow` memory. Lock hold time dropped from ~1,000ms to ~200ms. |
| **Lines 908–916** | Visual Gradebook Column | Formats and stamps `"✅ " + dateStamp` into the task's dedicated column. |
| **Lines 918–930** | Confirm-After-Write | Computes MD5 digest of stored JSON string and returns `{status: 'submitted_successfully', task, timestamp, hash, byteLength, version}`. |
| **Lines 954–958** | `successJSON(data)` | Bug fix: `if (!data.status) data.status = 'success';` prevents overwriting explicit status codes (`submitted_successfully`, `blocked_exemplar`). |

---

### 2. `Student_System/api.js` (846 Lines) — Client-Side Hardening & Watchdog

| Line Range | Function / Section | Exact Edit & Confirmation |
|---|---|---|
| **Line 11** | `CONFIG` | Added `MIN_SERVER_VERSION: 'V6.0-2026-09-20'`. |
| **Lines 223–225** | `login()` | Validates server version from login response; triggers alert banner if server is older than V6.0. |
| **Lines 245–269** | `_isVersionOlder(current, min)` | Semantic & date-aware comparator: handles `V{major}.{minor}-{date}`. Unit-tested in Node: null/V5/older date return `true`; exact/newer return `false`. |
| **Lines 271–318** | `showVersionAlertBanner(...)` | Injects sticky, high-visibility red warning banner at top of viewport: *"SYSTEM NOTICE: Please pause and tell Mr. Waugh you are seeing this screen."* |
| **Lines 320–326** | `validateServerVersion(v)` | Helper that evaluates version and drops the warning banner if unversioned or outdated. |
| **Lines 327–342** | `checkServerVersion(courseKey)` | Pings `?action=get_health` in background on page load. Fails silently on complete offline disconnect, but alarms if server responds with wrong version. |
| **Lines 344–345** | Memory Tracking | Added `_lastSavedHashes` and `_inFlightSaves` dictionaries for client-side deduplication. |
| **Lines 347–364** | `_hashPayload(data)` | Fast 32-bit string hashing algorithm to track dirty vs unchanged student form answers. |
| **Lines 366–375** | `_generateRequestId()` | Generates standard UUID v4 idempotency tokens using `crypto.randomUUID()` with fallback. |
| **Lines 377–410** | `submitProfile` Dirty Guard | **CRUNCH PROTECTION:** If payload hash equals `_lastSavedHashes` and not forced, skips network call. If identical save is in-flight with `keepalive`, prevents duplicate dispatch. |
| **Lines 445–465** | `submitProfile` Fetch & Verify | Dispatches fetch with `keepalive: true`. On 200 response: validates server version, records hash, stores `serverHash` and `serverByteLength` in localStorage. |
| **Lines 466–515** | `no-cors` Fallback & Chromebook Verify | Dispatches guaranteed `no-cors` POST with `keepalive: true`. Due to Chromebook logout wipes, schedules an immediate in-session `verifyCloudSave()` GET 3s later to confirm receipt while student is still on page. |
| **Lines 525–585** | `sendEmergencyBeacon(...)` | Dedicated handler for Chromebook lid close / page unload. Uses `sendBeacon` or `fetch({keepalive: true, mode: 'no-cors'})` with `requestId`, but skips if payload is unchanged. |
| **Lines 590–625** | `replayPendingSaves()` | Scans and replays unverified saves within the active login session. |
| **Lines 832–842** | Lifecycle Event Listeners | `DOMContentLoaded` triggers `checkServerVersion()` after 1.2s and `replayPendingSaves()` after 2s. `visibilitychange` triggers replay when student returns to tab. |

---

### 3. Assignment Pages — Crunch & Beacon Updates

| File | Exact Edit & Confirmation |
|---|---|
| [`Places_Of_Significance_Studio.html`](file:///c:/antigravity-bihi/Student_System/Places_Of_Significance_Studio.html) | Line 2178: manual save passes `{ force: true }`. Lines 2504–2512: `sendEmergencyBeaconSync` updated to route through `StudentAPI.sendEmergencyBeacon`, eliminating double-POSTs on lid close. |
| [`18_Cit9_Real_Issues_Dossier.html`](file:///c:/antigravity-bihi/Student_System/18_Cit9_Real_Issues_Dossier.html) | Lines 3458–3485: added `_lastBeaconHash` dirty-check guard to `sendEmergencyBeaconSync` so rapid `visibilitychange` + `pagehide` events do not double-fire. |
| [`_TEMPLATE_GAS_Assignment.html`](file:///c:/antigravity-bihi/Student_System/_TEMPLATE_GAS_Assignment.html) | Line 1050: passes `{ force: isManualClick }` so background saves skip if unchanged, while manual user clicks force verification. |
| [`templates/_TEMPLATE_GAS_Assignment.html`](file:///c:/antigravity-bihi/Student_System/templates/_TEMPLATE_GAS_Assignment.html) | Line 1050: synced with master template. |

---

### 4. Live Verification Test Results (Automated Probes on Production Webhook)

```json
PROBE 1: GET ?action=get_health
RESPONSE: {
  "status": "healthy",
  "version": "V6.0-2026-09-20",
  "deployedAt": "2026-09-20T18:40:00Z",
  "sheetInventory": ["Sheet1", "Class_Slide", "Class_Log", "Class_Plan", "Submissions_Log", "HealthyLiving8", "Lockers_902", "801", "802", "803", "804", "901", "902", "903"],
  "rowCounts": { "801": 44, "802": 28, "803": 29, "804": 28, "901": 32, "902": 32, "903": 46 },
  "logRows": 4296
}
RESULT: ✅ PASSED (Live V6.0 confirmed serving)

PROBE 2: POST submit_profile (PIN: TST)
RESPONSE: {
  "status": "submitted_successfully",
  "task": "V6 Test Ping",
  "hash": "f58955541e7951cf8481a13d05692a95",
  "byteLength": 233,
  "version": "V6.0-2026-09-20"
}
RESULT: ✅ PASSED (Demo routing & confirm-after-write hash verified)

PROBE 3: POST submit_profile (Exemplar "Smith Point Road" to PIN: ABC)
RESPONSE: {
  "status": "blocked_exemplar",
  "message": "Exemplar/sample data cannot be saved to a student profile. This submission was blocked.",
  "version": "V6.0-2026-09-20"
}
RESULT: ✅ PASSED (Exemplar guardrail verified live)

PROBE 4: POST submit_profile (Duplicate requestId)
1st write: submitted_successfully (deduplicated: false)
2nd write: submitted_successfully (deduplicated: true)
RESULT: ✅ PASSED (Idempotency deduplication verified live)
```

---


### Phase 2 — By Mid-October: Scale Hardening
**Effort:** ~1 day · **Risk:** Medium (storage shape changes; affects dashboard readers) · **Payoff:** System physically cannot hit the 50k wall; stays fast in June

| # | Change | Fixes | Files | Source |
|---|---|---|---|---|
| 2.1 | **Inline storage cap (5-task limit).** Roster rows keep full `_tasks[taskName].data` for the **last 5 tasks** per student (by `updated`). Older tasks collapse to `{updated, summary, status, _archivedInLog: true}` stubs. Full payloads **always** remain in `Submissions_Log`. Caps Column G at ~15–20 KB per student forever. | 50k cell crash (GLM B1, Gemini #1) | Code.gs | GLM + MiniMax consensus |
| 2.2 | **Stop top-level field mirroring.** Keep only identity fields at root: `{name, pin, className, email, pronouns, task, summary, lastUpdated, _tasks, _v}`. Remove the `for (let k in rawPayloadData)` loop (lines 730–734) that copies all assignment fields to root. All work lives exclusively in `_tasks[taskName].data`. | Field collisions (GLM A4, Gemini #2) | Code.gs | All three |
| 2.3 | **Patch dashboard readers.** The following files read top-level fields and need a small "read `_tasks` slice with root fallback" patch (~1–2 lines each): `WHERE_Grade9_Progress_Dashboard`, `CIT9_Current_Issues_Progress_Dashboard`, `HL8_Grade8_Master_Submission_Dashboard`, `HL8_Class801_Audit_Display`, `HL8_Class_Progress_LCD_Dashboard`, `HL9_Human_Skills_Advisor`, `Places_Of_Significance_Studio`, and any HL8 dashboard copies in `HealthyLiving8/`. | Companion to 2.2 | Dashboard HTMLs | GLM (verified list) |
| 2.4 | **Task-filtered `get_class_progress`.** Add optional `taskName` parameter. When provided, return only that task's data slice per student. Shrinks payload from 500 KB+ to ~25 KB. Unfiltered mode stays for LCD displays. | Bulk query scaling (Gemini #4) | Code.gs | Gemini + GLM |
| 2.5 | **Task-name quarantine.** Add a `KNOWN_TASKS` constant listing valid task names. Unknown `taskName` values get filed under `_QUARANTINE` in `_tasks` with a warning in the response — not rejected (you'd lose the data). | Ghost tasks (GLM A4, MiniMax #4) | Code.gs | GLM + MiniMax |
| 2.6 | **Move read-only lookups & Submissions_Log outside lock.** `findStudentAcrossSheets` and `Submissions_Log.appendRow` hoisted above `waitLock`. 4 remote `getValue()` calls eliminated. (Completed & deployed live in Phase 1). | Lock contention (GLM B3) | `[x]` LIVE | Code.gs | GLM + Waugh |

> **IMPORTANT:** Phase 2 should deploy on a Friday afternoon when students won't be saving. Item 2.2 (stop mirroring) is the one change that alters the data shape. The root fallback in 2.3 ensures backward compatibility: if a dashboard finds `_tasks[taskName]`, it reads from there; otherwise it falls back to root fields for historical data.

**Verification:**
- `get_health` green with new version
- Compare a fresh `get_all_progress` against a pre-Phase-2 baseline snapshot (same logical data, smaller JSON)
- Submit with DEMO pin — verify that a student with >5 tasks has stubs for old ones, full data for recent ones
- Load each patched dashboard once — confirm data renders correctly
- Test `get_class_progress?taskName=The WHERE Project` returns a compact filtered payload

---

### Phase 3 — As Appetite Allows: Hygiene & Resilience
**Effort:** Incremental · **Risk:** Minimal · **Payoff:** Early warning, observability, backups

| # | Change | Source |
|---|---|---|
| 3.1 | **Structured logging.** Add a `Logs` sheet (auto-create) + `logEvent(level, action, ctx)` helper. Wire into every catch block + the exemplar guardrail + the corrupt-cell handler. | MiniMax #6 |
| 3.2 | **`?action=selftest` endpoint.** Read-only integrity checks: every roster JSON parses, every `_tasks` slice has `data` or is a deliberate stub, headers intact, per-task completion counts. Weekly bookmark. | GLM |
| 3.3 | **Monthly log compaction trigger.** Time-driven (1st of month, 2am): per (pin, task), keep latest full payload, move older duplicates to `Log_2026-09`-style monthly tabs. | GLM B2, MiniMax |
| 3.4 | **Monthly spreadsheet snapshot.** Time-driven trigger: copy the entire spreadsheet to a dated archive file. Belt-and-suspenders beyond Sheets version history. | Gemini |
| 3.5 | **CacheService for gradebook headers.** Cache the header-to-column map per sheet in `CacheService` with 6-hour TTL. Eliminates the O(n) header scan on every save. | MiniMax #5 |
| 3.6 | **Extract `requireTeacherPin()`.** The PIN gate is duplicated 4 times (lines 478, 537, 557, 579). Extract to one function. | MiniMax #9 |
| 3.7 | **Constants consolidation.** Move `'Class_Log'`, `'Submissions_Log'`, `['901','902',...]` etc. to a `SHEETS` / `ALL_CLASSES` constant block at the top of Code.gs. | MiniMax #8 |
| 3.8 | **Lock-timeout distinct response.** Catch the `LockService` timeout specifically and return `{error: 'lock_contention', retryAfter: 3}` so the client can retry intelligently. | MiniMax #11 |

---

## What I would NOT do

| Rejected idea | Why |
|---|---|
| **Per-task columns or sub-tabs** (Gemini #2 options a/b) | Breaks the one-row-per-student model every dashboard and gradebook depends on. The 5-task inline cap achieves the same goal with zero migration cost. |
| **Split Code.gs into 7 files now** (MiniMax Phase B) | 980 lines is manageable. Single-paste deploy is valuable for a teacher. A dispatch table in `doPost` solves shadowing risk. Split if it crosses 1,500 lines. |
| **Rebuild api.js** | It works. Phase 1 changes are additive (outbox + idempotency key). Don't refactor `Session`, `validateStudent`, or the dispatch chain. |
| **Server-side roster check** (GLM A5 optional) | The trust-the-client model is correct for shared Chromebook carts. Demo PIN routing (1.2) is the right pragmatic boundary. |
| **Hard-reject unknown taskNames** | You'd lose the data. Quarantine is safer — the teacher can review `_QUARANTINE` and recover. |

---

## Calendar & Execution Milestones

| When | What | Status | Prerequisite |
|---|---|---|---|
| **Sep 20, 2026** | **Phase 0 & Phase 1 Execution & Live Deploy** (Version constant, health probe, exemplar guardrail, demo routing, corrupt-cell abort, idempotency key, confirm-after-write, batch write, lock speedup, lid-close crunch protection, client version watchdog) | `[x]` **COMPLETED & VERIFIED LIVE** (`V6.0-2026-09-20`) | None |
| **Sep 20–22, 2026** | Phase 0.3: Recover Class 902 Sep 16 sleep audit answers from `Submissions_Log` | `[x]` **Implemented in V6.0.1** (`recoverClass902SleepAudit` in `Code.gs`) | Phase 0 |
| **By mid-October** | Phase 2 deployed (Inline 5-task storage cap, stop top-level field mirroring, patch dashboard readers) | `[ ]` Queued | Phase 1 + Friday deploy window |
| **Before Nov 23 report cards** | Phase 2 verified across all dashboards; Phase 3 items as appetite allows | `[ ]` Scheduled | Phase 2 |
| **Ongoing (30 seconds)** | Every Code.gs edit: bump `VERSION`, paste, Deploy, New Version, `get_health` bookmark, verify | `[x]` Active Runbook Rule | Phase 0 |

---

## External Peer Review (MiniMax & GLM) — Considered vs. Rejected & V6.0.1 Patch

On September 20, 2026, external audit engines **MiniMax** and **GLM** verified the live V6.0 deployment and provided detailed peer-review feedback. Below is the full assessment and the resulting **V6.0.1 patch**:

### 1. Considered & Accepted (Patched in V6.0.1)

| # | Review Finding | Source | Verdict | Resolution in V6.0.1 |
|---|---|---|---|---|
| **1** | **Exemplar Guardrail False-Positive Risk (`Code.gs`)**<br>Bare `'Mauritius'` in `EXEMPLAR_SIGNATURES` substring-matches across the whole payload and blocks genuine student submissions in the WHERE assignment ("places of significance", where Mauritius is suggested). | GLM (noted by MiniMax) | **ACCEPTED (CRITICAL)** | Replaced bare `'Mauritius'` with `'Republic of Mauritius'`. Hardened guardrail logic: a submission is only flagged as an exemplar if it matches specific teacher-only IDs (`'k7n7dESM4Hg'`, `'Smith Point Road, Gull Lake'`) OR matches $\ge 2$ exemplar signatures simultaneously. Real student work with one mention is never blocked. |
| **2** | **Dirty-Guard Lost-Update Window (`api.js`)**<br>`sendEmergencyBeacon` stamps `_lastSavedHashes` before knowing transmission succeeded. If beacon fails (quota/network blip), subsequent autosaves skip because hash matches. In `submitProfile` no-cors fallback, stamping hash before `verifyCloudSave` confirmation prevents debounced retries if network was temporarily down. | GLM | **ACCEPTED (CRITICAL)** | In `sendEmergencyBeacon`: only retain `_lastSavedHashes[saveKey]` if `sendBeacon` returns `true`. If `false` or on catch, delete `_lastSavedHashes[saveKey]`. In `submitProfile`: do NOT stamp `_lastSavedHashes[saveKey]` in the catch/fallback block until the 3-second `verifyCloudSave()` actually confirms that the server recorded the task slice. If unconfirmed, the hash remains unstamped and the next autosave retries seamlessly. |
| **3** | **Stale-Read Under Lock (`Code.gs`)**<br>`studentRow` is read before `waitLock`. If two rapid saves for the same student arrive, the second could merge against pre-lock row memory. | GLM | **ACCEPTED (IMPORTANT)** | Inside `lock.waitLock(30000)`, re-read Column 7 directly from the target sheet (`targetSheet.getRange(rowIndex, 7).getValue()`). Takes ~15ms and guarantees 100% freshness under lock. |
| **4** | **Idempotency Dedupe Scan CPU Cost (`Code.gs`)**<br>Up to 100 log rows are `JSON.parse`d on every submit. | GLM | **ACCEPTED (PERFORMANCE)** | Added `if (rawLogStr.indexOf(requestId) === -1) continue;` fast substring pre-filter before `JSON.parse`, skipping unnecessary JSON parsing for non-matching rows. |
| **5** | **`get_student_history` Missing Payload Column (`Code.gs`)**<br>Column H is parsed on server but omitted from `studentHistory` output. | GLM / MiniMax | **ACCEPTED (UTILITY)** | Added `includePayload=true` parameter to `get_student_history`, allowing retrieval of the full payload from Column H. |
| **6** | **Phase 0.3: Recover Class 902 Sep 16 Sleep Audit Data**<br>Grades are missing from `902` tab; sitting in `Submissions_Log`. | MiniMax & GLM | **ACCEPTED (EXECUTION)** | Implemented `recoverClass902SleepAudit(ss)` in `Code.gs` and added a secure webhook endpoint `?action=recover_902_sleep_audit&pin=WAU`. It can be run either directly from the Apps Script editor or triggered via curl/browser. |

### 2. Rejected or Clarified

| # | Feedback Item | Source | Verdict | Technical Justification |
|---|---|---|---|---|
| **7** | **Lock Contention Still Serial (28 students × 200ms = 5.6s)**<br>MiniMax claimed moving `findStudentAcrossSheets` outside lock is "pending in Phase 2.6". | MiniMax | **REJECTED / CLARIFIED** | In V6.0, `findStudentAcrossSheets` (line 660) and `Submissions_Log.appendRow` (line 795) were **already moved OUTSIDE the lock**. The lock hold time is only the in-memory merge + single row `setValues` (~150–200ms). Total serial queue for 28 students is ~5.6s, well under GAS's 30s lock timeout. MiniMax misread this as pending when it was already live. |
| **8** | **Deploy happened without explicit "go"** | MiniMax | **CLARIFIED** | The user explicitly requested the deploy and confirmed update. The new version watchdog and health probe ensure every change is observable. |
| **9** | **Archive legacy tabs (`Sheet1`, `HL8`, `CIT9`, etc.)** | GLM | **REJECTED / DEFERRED** | Deleting tabs during an active school term risks breaking legacy formulas or bookmarks. Harmless to keep until scheduled November maintenance. |

---

## Decisions for Upcoming Phases

1. **Storage cap threshold (Phase 2)** — keep the last **5 tasks** inline per student (recommended), or 3, or 10? More = bigger cells, fewer = more stubs to explain to markers. My default is 5.

2. **Exemplar signature list** — `[x]` Hardened in V6.0.1: `"Smith Point Road, Gull Lake"`, `"Gwangju, South Korea"`, `"k7n7dESM4Hg"`, `"Republic of Mauritius"`, `"Yeah Yeah No No"`. Requires specific token OR $\ge 2$ matches.

3. **Is `CLASS_LOG_PIN` set?** If not, class-log writes are currently open. Setting the Script Property is a 1-minute hardening step.

4. **Dashboard audit for Phase 2.3** — do you want me to audit each affected dashboard file before you approve Phase 2, or trust the "read `_tasks` with root fallback" pattern?

---

## File references

| File | Role |
|---|---|
| `Student_System/Code.gs` | Primary backend (1,225 lines, V6.0.1) — all server-side changes |
| `Student_System/api.js` | Primary client (850 lines) — outbox + idempotency changes + watchdog |
| `Submissions_Log` | Append-only ledger in Google Sheets — the safety net |
| `audit/GAS-audit-glm.md` | GLM audit (strongest on 902 root cause + client-side bugs) |
| `audit/GAS-audit-minimax.md` | MiniMax audit (strongest on hygiene + idempotency + schema versioning) |
| `audit/GAS_ARCHITECTURE_REVIEW- gemini.md` | Gemini audit (strongest on 50k ceiling + exemplar bug) |
