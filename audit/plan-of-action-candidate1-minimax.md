# Plan of Action — Candidate 1 (MiniMax / Mavis)

**Synthesizes:** `GAS-audit-minimax.md` (mine) · `GAS_ARCHITECTURE_REVIEW- gemini.md` · `GAS-audit-glm.md`
**Date:** 2026-09-20
**Status:** Candidate — Dave to accept, amend, or replace before any code edits

---

## What the three audits agree on (this is the real plan)

All three reviewers independently identified the same **four highest-priority failure modes**. They are the spine of this plan:

| # | Issue | Source(s) |
|---|---|---|
| 1 | **You cannot tell which version of Code.gs is deployed.** No version constant, no health endpoint. GLM proved this is the root cause of the actual 902 HL9 data loss on Sep 16. | GLM-A1 (proven), all three in spirit |
| 2 | **No write confirmation.** `no-cors` fallback returns success without knowing the server persisted. Combined with #1, students get green checkmarks for data that never landed. | GLM-A2, mine #1 (idempotency) |
| 3 | **50,000-character Google Sheets cell limit is a guaranteed failure** as `mergedData` grows over the year. Will hit by ~March. | Gemini #1, GLM-B1 |
| 4 | **Top-level field collisions** + **exemplar data accepted from real PINs**. Either alone causes silent data falsification; together they mask each other. | Gemini #2/#3, GLM-A4 |

These are the **non-negotiable fixes**. Everything else is sequencing.

---

## Where the audits disagree (and what I'd pick)

| Question | Gemini | GLM | Mine | My pick |
|---|---|---|---|---|
| Should we partition storage into per-task columns or sub-tabs? | "Dedicated columns OR sub-tabs" (vague) | n/a | n/a | **Neither.** A storage cap on the existing column G is simpler and achieves the same goal. (See Stage 3.) |
| Should we split Code.gs into multiple `.gs` files? | n/a | n/a | Yes (7 files) | **Not yet.** A single dispatch table in `doPost` solves the silent-shadowing risk without file-splitting. Single file is portable across GAS projects; a 1,000-line file is fine. Split if it crosses 1,500 lines. |
| Should the server trust the client's `taskName`? | Implicit yes | **No** — quarantine unknown taskNames (A4) | Implicit yes | **Quarantine.** Cheap, additive, contains the typo ghost-task class. |
| Should demo PINs (`TST/WAU/DEV/MRW`) be server-routed to a `DEMO` tab? | n/a | **Yes** (A5) | n/a | **Yes.** Trivial change, eliminates impersonation footgun. |
| Should exemplar signatures be rejected at the server? | **Yes** (the Tess bug) | n/a | n/a | **Yes** — this is the cleanest immediate defensive add. Matches the demo script you ran today (`scratch/check_exemplar.py`). |
| What's the scale ceiling? | Cell size + bulk-query size | Cell size + log growth | Cache O(n) header scan | Cell size first, then log growth, then cache. |

---

## Recommended sequence (4 stages, additive only)

**Design rule:** every stage ships alone without breaking anything that already works. No stage renames fields or removes columns.

### Stage 0 — Today, before next class (~30 min)

**Goal:** make the deployment visible to you.

- Add `CONFIG.VERSION = 'v6.0-driftfix'` constant near the top of Code.gs.
- Add `?action=get_health` GET endpoint. Returns `{version, deployDate, sheetInventory, rowCounts, sampleRosterHash, lastFiveSubmissions}`.
- Bookmark `https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec?action=get_health` and hit it before each class.

**Risk:** zero. Pure additive. Would have caught GLM's A1 immediately.

---

### Stage 1 — Before next assignment ships (~2–3 hours)

**Goal:** stop silent data loss.

1. **Idempotency key.** Add `requestId` (UUID v4 generated client-side) to every `submitProfile` payload. Server scans last 100 `Submissions_Log` rows for `requestId` match; if found, returns cached original response. Cheap dedupe.
2. **Confirm-after-write.** Server's `submit_profile` success response now includes `{hash, byteLength, version}` of the stored JSON. `api.js submitProfile` keeps the save in a `pendingSaves` outbox until the POST response confirms; if no-cors was used, schedules a `verifyCloudSave()` retry on next page load. **Never mark `cloudSynced: true` without a confirmed server response.**
3. **Exemplar guardrail.** In `submit_profile`, after parsing payload, check payload string for known exemplar signatures: `"Smith Point"`, `"Gwangju"`, `"Mauritius"`, `"Yeah Yeah No No"`, plus a hash of the WHERE exemplar data. If matched AND `pin` is a non-demo PIN → return `403 {error: 'exemplar_data_blocked', matched_signature: '...'}` and write incident to a new `Logs` sheet. Do not write to the class tab.
4. **Structured logging.** Add a `Logs` sheet (auto-create on first write) and `logEvent(level, action, ctx)` helper. Wire into every existing catch block plus the new guardrail.
5. **Demo PIN routing.** Server detects `pin ∈ {TST, WAU, DEV, MRW}` and writes to a `DEMO` tab (auto-create) instead of the student's class tab.

**Risk:** low. All additive. The exemplar guardrail will likely flag one or two real-but-suspicious student submissions; review them in the Logs sheet, not silently. Use this to discover real teaching moments.

---

### Stage 2 — Within 1 week, before report-card prep (~3–4 hours)

**Goal:** stop data shape drift.

1. **Canonical task registry.** Add a `TASK_REGISTRY` constant in Code.gs and a mirror in api.js. Unknown `taskName` values get filed under `_QUARANTINE` in `_tasks` with a warning header row, not silently dropped. Audit existing HTML files for hard-coded task names; recommend (but don't require) they read from `window.TASKS`.
2. **Schema versioning.** Stamp `_v: 1` on every `mergedData` write. Add `migrateData(d)` helper that any reader can call. Cheap insurance for September 2027.
3. **Stop mirroring task fields at top level.** Today, line 730–734 of Code.gs copies every payload field to root `savedData`. Change so only `name, pin, className, email, pronouns, task, summary, lastUpdated` live at root. Audit `WHERE_Grade9_Progress_Dashboard.html`, `Cit9_Real_Issues_Dossier.html`, and any other consumer; point them at `savedData._tasks[taskName].data` instead. Halves JSON size; kills the field-collision class.
4. **Corrupt-cell merge abort** (GLM-A3). Today, if `JSON.parse(existingCell)` fails, the server silently substitutes `{}` and overwrites the cell with the empty baseline. Change: if `existingCell` is non-empty AND parse fails, refuse to write, log to Logs as `__corrupt_backup`, and return `503 {error: 'corrupt_cell_hold', row: N}`. The teacher (you) is the only one who can resolve.

**Risk:** medium. The shape change in #3 requires touching dashboard readers. Do this on a Friday afternoon when students won't be saving.

---

### Stage 3 — Before November report cards, before Spring (~1 day)

**Goal:** prevent the 50k wall and log bloat.

1. **Inline-storage cap for roster rows.** Keep full `data` inline for the **last 5 tasks** per student (by `updated`). Older tasks collapse to `{updated, summary}` stubs in `_tasks`. Full payload **always** remains in `Submissions_Log`. Caps Column G at ~15–20 KB per student forever. Eliminates the 50k wall. Markers need to understand: a stub means "see Submissions_Log for full payload."
2. **Log compaction trigger.** Add a time-driven monthly trigger (1st of month, 2am) that copies `Submissions_Log` rows older than 60 days to `Log_2026-09`-style monthly tabs and trims the live sheet to last 60 days.
3. **Move read-only lookups outside the lock.** `findStudentAcrossSheets` for logins is read-only and currently runs inside the write lock. Hoist it. Reduces the bell-ringer queue. Also: lower `waitLock(30000)` to `waitLock(10000)` since #1 + Stage 1's confirm-after-write + outbox mean a slow write is recoverable rather than fatal.
4. **CacheService for gradebook header map.** `getOrCreateAssignmentColumn` scans all headers per save. Cache per sheet name in `CacheService` with 6-hour TTL.

**Risk:** medium-low. The storage cap is a one-time migration that's hard to undo cleanly. Run it once, verify Submissions_Log still has the full payloads, then commit.

---

### Stage 4 — Optional, only if appetite allows

1. `?action=selftest` endpoint. Returns read-only invariants: roster JSON parses for every row, every `_tasks[taskName]` has `data` or is a deliberate stub, headers intact, per-task completion counts. Weekly bookmark.
2. `?action=get_progress?taskName=X` filtered bulk query (Gemini's #4). Optional — only needed if dashboards get slow.
3. Monthly snapshot trigger that copies the spreadsheet to an archive file (structural backup beyond Sheets version history).
4. Server-side roster check (GLM-A5 optional variant). Tradeoff: stricter data hygiene vs. less flexibility. Decide consciously.

---

## What I would NOT do (and why)

- **Do not** switch to per-task columns (Gemini #2 option a). The schema change is large, the dashboard migration is huge, and the storage cap in Stage 3 #1 achieves the same end-state with no migration cost.
- **Do not** switch to per-task sub-tabs (Gemini #2 option b). Same reason. Plus, cross-class queries (e.g., "all 901 students' WHERE portfolios") get harder.
- **Do not** split `Code.gs` into 7 `.gs` files (mine #3). The single-file constraint is fine through ~1,500 lines and is portable across GAS projects. If the action-dispatch becomes a real maintenance burden, replace the `if/else` chain with a one-level `switch` and a dispatch table. File-splitting can wait until you actually need it.
- **Do not** add a server-side roster check as a default. The current "trust the client + localStorage" model is correct for shared Chromebook carts. The teacher PIN gate (`CLASS_LOG_PIN`) on Class_Log actions is the right place for server-side authority.
- **Do not** rebuild the api.js client. It's working. The Stage 1 changes are additive (`pendingSaves` outbox + idempotency key). Resist the temptation to refactor `Session`, `validateStudent`, or the dispatch chain.

---

## Effort / risk rollup

| Stage | Effort | Risk to live data | Risk to live system | Payoff |
|---|---|---|---|---|
| 0 | 30 min | None | None | Drift visibility forever |
| 1 | 2–3 h | None (additive) | None (additive) | Closes silent-loss class; rejects exemplar pollution |
| 2 | 3–4 h | Medium (shape change; dashboard audit needed) | Low | No more field collisions; quarantines typo taskNames |
| 3 | ~1 day | Medium-low (one-time storage migration) | Low | Cannot hit 50k wall; bell-ringer queue eliminated; logs stay fast |
| 4 | Ongoing | None | None | Nice-to-haves |

---

## What's still unresolved for Dave

1. **Demo PIN routing** — okay to write `TST/WAU/DEV/MRW` to a separate `DEMO` tab? (GLM's A5, Stage 1 #5.) If you want them to land somewhere else, say where.
2. **Storage cap policy** — keep the **last 5 tasks per student** inline, or **last 3**, or **last 10**? More = bigger cells, less = more stubs to explain to markers. My default is 5.
3. **Exemplar signature list** — the four names I have are `Smith Point`, `Gwangju`, `Mauritius`, `Yeah Yeah No No`. Should there be more? (E.g., `k7n7dESM4Hg` from Gemini's note.) Confirm or supply the full set.
4. **Dashboard readers affected by Stage 2 #3** — do you want me to audit `WHERE_Grade9_Progress_Dashboard.html` + `Cit9_Real_Issues_Dossier.html` + any others that read top-level fields before you sign off on Stage 2?
5. **Backup posture** — what's your current backup for the Master Sheet? If the answer is "Sheets version history + the append-only Submissions_Log", that's actually quite robust. If it's "version history only", Stage 4's monthly snapshot trigger becomes Stage 3.
6. **Acceptance criterion** — what does "foolproof" mean to you? My read: **(a) zero silent data loss, (b) zero silent data corruption, (c) always know which version is running, (d) graceful recovery from a wrong version going out.** Stages 0–1 hit (c) and (d). Stages 2–3 hit (a) and (b).

---

## File references

- `audit/GAS-audit-minimax.md` — this repo, this agent
- `audit/GAS_ARCHITECTURE_REVIEW- gemini.md` — Gemini review
- `audit/GAS-audit-glm.md` — GLM review (strongest on the Sep 16 902 incident)
- `Student_System/Code.gs` — primary backend, no edits yet
- `Student_System/api.js` — primary client, no edits yet
- `Student_System/Submissions_Log` (Google Sheet) — the append-only ledger; this is what makes everything recoverable today
