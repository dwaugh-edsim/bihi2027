# GAS Audit & Restructuring Proposal — Student Webhook Backend & Client (GLM)

**Audited:** 2026-09-20 · **Model:** GLM (ZCode session)
**Files reviewed in full:** `Student_System/Code.gs` (980 lines, "V5"), `Student_System/api.js` (507 lines)
**Live evidence:** submission data pulled from the Master Sheet via the webhook (`get_all_progress`, `get_class_log`, `get_student_history`), plus git history of both files
**Trigger:** The HL9 Class 902 lost its 10-Station Audit answers on Sep 16 while the teacher was watching the sheet update live.

## Verdict up front

**The architecture is right; the implementation is not yet foolproof.** The core design — one spreadsheet, per-task isolation under `_tasks`, an append-only audit log, PIN login, debounced autosave — is sound and worth keeping for the 9-month school year. But this review found **four data-loss/data-falsification bug classes (two of them demonstrated in the wild)** and **two scale ceilings that will reliably break the system by spring**. All are fixable without changing how assignments are built, via a phased restructure (Section 3).

---

## 1. What is already good (do not change)

- **One spreadsheet, per-task isolation** (`_tasks[taskName]`) — assignments never clobber each other. Correct core design.
- **Append-only `Submissions_Log`** — every autosave kept forever with full payload JSON. This is what makes the 902 data recoverable. Keep.
- **LockService on all writes**, debounced client autosave, `no-cors` + `sendBeacon` dispatch chain for CORS-hostile environments. Keep.
- **Zero-dependency constraint** (vanilla GAS + vanilla JS) — right for school Chromebooks/network. All proposals respect it.
- PIN + first-name model, cross-sheet homeroom resolution, auto gradebook ✅ columns, Class Log actions. Fine.

---

## 2. Findings

### A. Data-loss / data-falsification bug classes

#### A1. Repo ↔ deployment drift — the confirmed root cause of the 902 loss
`Code.gs`'s merge (line ~738) writes every task as `{updated, summary, status, data}`. The 902 task slices saved on Sep 16 contain **only** `{updated, summary, status}` — no `data` key at all, not even empty. That object shape cannot be produced by the current repo code (which always writes `data: payload.data || {}`). Conclusion: **the deployed script on Sep 16 was an older version than the repo.** The Sep 17 redeploy (made for the Class Log, for unrelated reasons) silently fixed it — 901's Sep 17 runs saved with `data` intact.

Nothing detects this drift. `CLASS_LOG_README.md` already warns "saving alone is not enough if the deployment is pinned to an old version," but there is no way to *see* the live version. **This bug class recurs on every Code.gs edit that isn't followed by a redeploy** — which, with weekly bug-fix cadence in September, is the single most likely way to lose class work again.

*Timeline evidence for the 902 incident is in the Appendix.*

#### A2. Silent-success fallback in `api.js submitProfile` (lines ~294–328)
When the normal CORS POST fails (routine with GAS 302 redirects on GitHub Pages), the client fires a `no-cors` request and then — **without any confirmation the server processed it** — returns `status: 'submitted_successfully'` and writes `cloudSynced: true` into localStorage. `no-cors` responses are opaque, so network drops, GAS errors, quota limits, and oversized-cell failures are all invisible. Result: student sees a green checkmark; work never lands; and because the local backup is already marked `cloudSynced: true`, it **never replays**. `verifyCloudSave()` exists in api.js but is **never called automatically**.

This is the client-side twin of A1: *both ends can report success without the data existing.*

#### A3. Corrupt-cell merge wipe (`Code.gs` ~lines 713–722)
On submit, the server parses the student's existing JSON with `catch → existingData = {}`. If that cell ever acquires one bad character (manual edit, paste, sync artifact), the next autosave merges from an **empty baseline** and overwrites the cell — silently wiping every prior task from the roster row. The log survives; the roster row doesn't. A parse failure on a non-empty cell should abort the merge, not proceed from zero.

#### A4. Unchecked `taskName` + cross-task field collisions at top level
- `taskName` is an arbitrary client string: a typo silently creates a ghost task bucket. The live sheet already contains `"Test diagnostic submission via Antigravity"` filed among real work.
- Worse: the merge copies **all** payload fields to the top level of the student record (lines 730–734) *in addition to* the `_tasks` slice. Unrelated assignments reuse field names — `issues`, `news_sources`, `people`, `mechanics` appear in both the CIT9 Real Issues and HL9 Addictive payloads — so the top level is last-writer-wins across different assignments. It's misleading for any marker/dashboard reading top-level fields (it confused even this audit's grading analysis), and it roughly **doubles every cell's JSON size**, accelerating B1.

#### A5. Server trusts the client completely
`validateStudent` runs only in the browser; the GAS accepts any PIN/name/class combination. Teacher demo PINs (`TST/WAU/DEV/MRW`) are documented in the repo and are not special-cased server-side — a student who finds them can write rows into real class tabs as "Teacher Demo." For a classroom this is an acceptable tradeoff, but it should be a *decision*: at minimum, route demo PINs to a `DEMO` tab server-side.

### B. Scale ceilings (will hit within the school year at current growth)

#### B1. The 50,000-character Google Sheets cell limit — the guaranteed failure
Every submit merges **all tasks ever submitted** into one JSON blob written to column G of the class tab (line ~753). `_tasks` only ever grows: WHERE portfolio (~2–4 KB) + 10-Station Audit (~3 KB) + Real Issues + Addictive + Quiz + … By spring, a heavy student's blob approaches or exceeds 50,000 chars; `setValue` then throws and **every subsequent save for that student fails** — silently, courtesy of A2. The log's column H hits the same wall for a single large assignment. This is the most probable way the system breaks in March, and it degrades gradually before it breaks outright.

#### B2. Unbounded `Submissions_Log` growth
Every autosave appends a full row including the entire payload. One class-hour generates hundreds of rows; 10 sections × many assignments × 9 months → hundreds of thousands of rows, with `get_student_history` scanning the **entire sheet per call**. Latency and quota pressure grow all year.

#### B3. Lock contention at peak moments
One global script lock with a 30 s wait. Fine today; the risk window is end-of-class "submit now" bursts (28 Chromebooks autosaving + explicit submits). Queued/failed saves combine with A2 into silent loss exactly when volume peaks.

### C. Structural debt (each future change is riskier than it should be)

| # | Issue | Location |
|---|---|---|
| C1 | Login logic implemented twice (doGet `login` ≈ duplicate of doPost `login`) — hand-synced | Code.gs 180–423 / 639–683 |
| C2 | Roster row written as 6 separate `setValue` calls (slow; mid-sequence failure leaves a half-written row) | Code.gs 749–755 |
| C3 | Class list hard-coded in 3+ places (`findStudentAcrossSheets`, `get_class_progress`, `api.js CONFIG.COURSES`) | both files |
| C4 | `submitProfile` defaults to `CIT9`, `submitAssignment` to `HL8`; `CONFIG.COURSES` maps every course to the same URL — indirection with no function | api.js |
| C5 | No version constant, no health/self-test action, no scheduled snapshot | Code.gs |
| C6 | Client sends the whole merged profile object (including stale fields from other tasks) on every save — feeds B1 and A4 | templates + api.js |

---

## 3. Proposed restructure — V6

Design rule: **zero changes to how assignments are built** (assignment HTMLs untouched beyond loading an updated api.js), one-paste deploy, every phase independently valuable.

### Phase 1 — Guard rails (small diff; deploy before the next class)

1. **`CONFIG.VERSION` + `GET ?action=get_health`** — returns version, deploy date, sheet inventory, row counts, and live integrity checks. Bookmark it; hit it before every class. Makes A1 instantly visible; alone it would have caught the 902 bug.
2. **Confirm-after-write.** Server returns a hash/byte-length of the stored JSON; `api.js` keeps the save **pending** until the POST response (or one follow-up GET via the existing `verifyCloudSave`) confirms it. Failed saves stay flagged unsynced and **replay on next page load** (a ~20-line outbox). Kills A2.
3. **Merge abort on corrupt cell.** Non-empty cell + failed `JSON.parse` → refuse to overwrite, stash the raw text into `Submissions_Log` as a `__corrupt_backup` row, return an explicit error. Kills A3.
4. **Canonical task registry.** One constant listing legal `taskName`s in both Code.gs and api.js; unknown names get quarantined (e.g., filed under `_QUARANTINE`) instead of silently filed. Contains A4's typo class.
5. **Demo PIN routing.** `TST/WAU/DEV/MRW` writes land in a `DEMO` tab, never a real class tab. Addresses A5 pragmatically.

*Effort: ~100–150 changed lines, Code.gs + api.js only. No schema change. Existing sheet data stays valid.*

### Phase 2 — Scale fixes (a weekend; server-side only)

6. **Inline-storage cap for roster rows.** Keep full `data` inline for the **last 5 tasks per student**; older tasks collapse to `{updated, summary}` stubs — the full payload always remains in `Submissions_Log` (the permanent archive). Caps column G at ~15–20 KB per student *forever*, no new tabs. Kills B1.
7. **Stop mirroring task fields at top level.** Keep only identity fields (`name, pin, className, email, pronouns, task, summary, lastUpdated`) top-level; everything else lives only in its `_tasks` slice. Halves JSON size; removes the collision illusion. *Dependency: audit dashboards that read top-level fields (`where_*`, `matrix`, …) and point them at the `_tasks` slice — the one Phase 2 item that isn't purely server-side.*
8. **Log compaction trigger.** Monthly time-driven trigger: per (PIN, task), keep the full payload of the latest save and trim older duplicates to summary-only rows (or move to `Log_2026-09` monthly tabs). Audit trail preserved in aggregate; reads stay fast. Contains B2.
9. **Housekeeping.** Single shared login implementation; batch the roster write into one `setValues`; one `ALL_CLASSES` constant; align api.js defaults. Clears C1–C4, C6. (B3 is mitigated by Phase 2's smaller writes; if still needed, drop the waitLock to ~10 s and rely on the confirm/outbox loop to retry.)

### Phase 3 — Resilience extras (optional)

10. **`GET ?action=selftest`** — read-only invariants: every roster JSON parses; every task slice has `data` or is a deliberate stub; headers intact; per-task counts. A weekly bookmark that tells you about problems before class does.
11. **Monthly snapshot trigger** — copy the spreadsheet to an archive file (Sheets version history covers content; this covers structure).
12. **Server-side roster check (optional)** — reject PINs absent from a Script-Property roster, at some cost to offline-first flexibility. Decide consciously.

---

## 4. Effort / risk summary

| Phase | Effort | Risk | Payoff |
|---|---|---|---|
| 1 Guard rails | ~1 session; 1 paste-deploy | Very low (additive) | Closes all data-loss classes; drift visible forever |
| 2 Scale | ~1 weekend + small dashboard audit | Low–medium (storage shape changes; markers must understand stubs) | Cannot hit the 50k wall; stays fast in June |
| 3 Extras | Incremental | Minimal | Early warning + backups |

## 5. Recommendation

**Phase 1 now** — it is small and targets exactly the bug class already experienced once (without the log, 902's grades would be gone). **Phase 2 within a few weeks**, before submission volume ramps: B1 is a certainty, not a maybe. Phase 3 as appetite allows.

The 9-month pitch: after Phases 1–2, every save is confirmed or visibly pending and retries itself, storage physically cannot overflow, drift is one URL away from detection, and every byte ever submitted remains in the append-only log. That is what "foolproof" can mean inside a zero-dependency GAS.

---

## Appendix: exact 902 timeline (for the record)

| Time (Sep 16, ADT) | Event |
|---|---|
| ~14:16–15:00 | 902 students autosave repeatedly; each save appends a full-payload row to `Submissions_Log` (verified live via `get_student_history`: Noah NAB 1/10 → 7/10 stations; Gemma GEB 0/10 → 8/10 in four-minute intervals) |
| same window | Roster rows in the `902` tab visibly update — the teacher confirms watching writes land |
| end of class | Final session save was written by the **old deployed script version**: task slice stored `{updated, summary, status}` with **no `data` key**, replacing the data-bearing slice. Summaries still claim "Stations: 7/10, 8/10, 9/10". |
| Sep 17, 07:36 | Class Log work triggers a redeploy; the new deployment includes the V5 merge (`data:` present). 901's Sep 17 run saves correctly. |
| Sep 20 | Verified live: 901 slices have `data`; 902 slices do not; `Submissions_Log` column H retains every payload — recovery is a filter away, no Sheets version history needed. |
