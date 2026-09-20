# Plan of Action — Candidate 1 (GLM)

**Date:** 2026-09-20 · **Basis:** my full code review (`audit/GAS-audit-glm.md`) + the minimax and gemini audits + live sheet verification + git history
**Posture:** fixes are additive first, structural second; assignment HTMLs untouched except api.js; every phase ends with a **redeploy + health check** so the drift class of failure can never silently recur.

---

## 1. How the three audits compare

All three agree on the big three: **the 50k-char cell ceiling**, **stop top-level field mirroring**, and **a health/version endpoint**. Beyond that they diverge, and two contain factual errors worth correcting before you spend time on them:

| Finding | GLM | minimax | gemini | My determination |
|---|---|---|---|---|
| 50k-cell crash | ✔ B1 | ✖ missed | ✔ #1 | **Confirmed in code + math.** The top plan driver. |
| Deployment drift (902 root cause) | ✔ A1 | ✖ missed | ✖ missed | **Confirmed live** (slice shape impossible under current code; fixed only by accident on Sep 17). The only *demonstrated* data-loss event any audit found. |
| Silent-success fallback (no confirm/retry) | ✔ A2 | partial (#1 idempotency) | ✖ missed | **Confirmed in code.** minimax's requestId fixes *double-writes*, not *false success*. Both are needed; they are different bugs. |
| Corrupt-cell merge wipe | ✔ A3 | ✖ missed | ✖ missed | Confirmed in code (`catch → {}` then overwrite). |
| Top-level field collisions | ✔ A4 | ✖ missed | ✔ #2 | **Confirmed live** — `issues`, `people`, `mechanics`… collide across CIT9/HL9 tasks in current rows. gemini is right that dashboards read root fields; I verified **~10 files** (list in §3, Phase 2). |
| Exemplar contamination ("Tess" bug) | ✖ missed | ✖ missed | ✔ #3 | **Accept — real bug, real incident.** But the *primary* fix belongs in the client (never autosave exemplar content under a student session); the server signature check is a backstop, not the cure. |
| `get_class_progress` scaling | ✔ B2-adjacent | partial | ✔ #4 | Accept direction (task-filtered queries); gemini's 3.5 MB/6-min numbers are worst-case but the design change is cheap and helps every grading dashboard. |
| Lock contention | ✔ B3 | ✔ #11 | ✔ #5 | **Partially wrong in gemini:** `doGet` login takes **no lock** — bell-ringer *logins* don't queue; it's the POST autosave path that serializes. The fix (read outside lock) is still right. minimax's "auto-pause after inactivity" claim about web apps is also dubious — deployments don't self-pause. |
| Idempotency keys | ✖ | ✔ #1 | ✖ | Accept — cheap, prevents double ✅ rows when retries fire. |
| Schema `_v` stamp + migration | ✖ | ✔ #2 | ✖ | Accept — cheap insurance; the `where_personal`→`cat1_personal` rename already orphaned fields once. |
| Submissions_Log unbounded growth | ✔ B2 | partial (#4 open question) | ✖ | Accept — compaction/archive trigger. minimax's ~5k-rows-by-June estimate is low (current pace already produced hundreds of rows per class-hour); plan for 10×. |
| Task registry | ✔ | ✔ #4 | ✖ | Accept — but **server-side first** (validate + quarantine); HTML migration to a shared `TASKS` constant can follow gradually. |
| File split / Logs sheet / header cache | partial C1–C5 | ✔ #3,#5,#6 | ✖ | Defer to Phase 3 — hygiene, not survival. Don't let refactoring delay the guard rails. |

**Bottom line:** minimax's list is strong on hygiene but missed all three data-loss bugs; gemini found the two big ceilings and the exemplar bug but missed the demonstrated failure (drift) and the client-side silent-success hole. My plan below merges everything that survived verification, sequenced by risk-to-student-data first.

---

## 2. Guiding rules for every change

1. **Additive before structural.** No schema/data migration until the guard rails are live.
2. **One paste-deploy per phase, version-stamped.** `CONFIG.VERSION` bumps every deploy; `?action=get_health` is checked immediately after. **No deploy without a green health read. This runbook rule alone retires the 902 bug class.**
3. **The assignment HTMLs don't change** (except loading the updated api.js — same filename, drop-in).
4. **Submissions_Log is sacred** — nothing ever rewrites or deletes it; compaction only trims *older duplicate rows per (pin, task)*.

---

## 3. The plan

### Phase 0 — Recover 902 + baseline (30 min, do before anything else)

- Export the 902 10-Station Audit payloads from `Submissions_Log` column H (last row per student) to a local file; reconstruct into a grading sheet. Either paste column H to me, or apply the one-line `get_student_history` payload fix in Phase 1 and pull programmatically.
- Capture a baseline `get_all_progress` JSON snapshot locally for regression-checking each phase.
- **Decision needed:** none. Pure data safety.

### Phase 1 — Guard rails (one coding session; deploy before the next GAS-using class)

Every item is additive; existing sheets and submissions stay valid.

| # | Change | Fixes | Files |
|---|---|---|---|
| 1.1 | `CONFIG.VERSION = 'V6.0'` + `get_health` action: version, deploy date, sheet inventory, row counts, integrity checks (all roster JSONs parse; every `_tasks` slice has `data` or is a deliberate stub; headers intact) | Drift detection (A1) | Code.gs |
| 1.2 | Confirm-after-write + retry outbox: server returns hash/length of stored JSON; api.js keeps saves *pending* until confirmed (POST response or one follow-up `verifyCloudSave` GET); unsynced saves replay on next page load | Silent success (A2) | Code.gs + api.js |
| 1.3 | Merge abort: non-empty cell + failed `JSON.parse` → refuse overwrite, stash raw text as `__corrupt_backup` row in the log, return explicit error | Corrupt-cell wipe (A3) | Code.gs |
| 1.4 | `requestId` (client UUID) on every submit; server checks recent log rows, returns the original response on match | Double-writes / double ✅ (minimax #1) | Code.gs + api.js |
| 1.5 | Task registry: canonical `TASKS` constant in Code.gs (and mirrored in api.js); unknown `taskName` → `_QUARANTINE` filing + warning in response. HTML migration to the shared constant is **gradual, later** | Ghost tasks (A4a) | Code.gs + api.js |
| 1.6 | Exemplar canary: server rejects/flags a real-PIN submission containing known exemplar signatures ("Smith Point Road", "Gwangju", the cottage YouTube id); **plus the real fix** — assignment pages load exemplars under a demo session so the debounce never pushes them | Tess bug (gemini #3) | Code.gs + api.js + the exemplar-loading pages (small, targeted edits) |
| 1.7 | Demo PINs (`TST/WAU/DEV/MRW`) route to a `DEMO` tab; `get_student_history` also returns the payload column (H) | A5 + 902-style recovery | Code.gs |

**Verification:** hit `get_health` (green + version), submit a test row from one assignment (test PIN → DEMO tab), confirm hash, confirm replay by killing the network mid-save. Log row counts unchanged for real students.

### Phase 2 — Scale & correctness (a weekend, within 2–3 weeks; server-side except one audit step)

| # | Change | Fixes | Notes |
|---|---|---|---|
| 2.1 | **Inline cap:** roster rows keep full `data` for the last 5 tasks per student; older tasks collapse to `{updated, summary}` stubs. Full payloads always remain in `Submissions_Log`. Caps column G at ~15–20 KB/student *forever* | 50k crash (B1) — the guaranteed failure | No new tabs; markers/dashboards read recent tasks inline, old ones from the log. Preferred over gemini's column-per-task (keeps one row per student — every existing dashboard and the gradebook ✅ logic assumes it) and over per-task sub-tabs (breaks the row-per-student read model everywhere). |
| 2.2 | **Stop top-level mirroring:** keep only identity fields top-level (`name, pin, className, email, pronouns, task, summary, lastUpdated`); all work lives only in `_tasks[taskName]` | Collisions (A4b); halves cell size | **Blast radius, verified: ~10 readers of top-level fields** — `WHERE_Grade9_Progress_Dashboard`, `CIT9_Current_Issues_Progress_Dashboard`, `HL8_Grade8_Master_Submission_Dashboard`, `HL8_Class801_Audit_Display`, `HL8_Class_Progress_LCD_Dashboard`, `HL9_Human_Skills_Advisor`, `Places_Of_Significance_Studio` (×2 copies), plus the HL8 dashboard copies in `HealthyLiving8/`. Each gets a small "read `_tasks` slice with root fallback" patch — 1–2 lines each. |
| 2.3 | Task-filtered `get_class_progress?taskName=…` (also `className` + `pin` scoping) | Bulk-query scaling (gemini #4) | Marker dashboards and Antigravity get tiny fast payloads; unfiltered mode stays for the LCD displays. |
| 2.4 | Monthly log-compaction trigger: per (pin, task) keep latest full payload; trim older duplicates to summary-only (or roll to `Log_2026-09` tabs) | Log growth (B2) | Append-only in spirit — trimming duplicate *history* rows only, never the latest. |
| 2.5 | Move read-lookups outside the write lock; one shared `login` implementation for GET/POST; batch the roster write into a single `setValues` | Lock latency (B3); C1/C2 | |
| 2.6 | Schema stamp `_v` on writes + `migrateData()` helper readers can call | minimax #2 | One line now, saves an afternoon in April. |

**Verification:** `get_health` integrity checks green; compare a fresh `get_all_progress` against the Phase 0 baseline (same logical data); submit → confirm stub behavior on a student with >5 tasks (use DEMO pin); load each patched dashboard once.

### Phase 3 — Hygiene & resilience (schedule anytime; nothing here blocks the year)

| # | Change | Source |
|---|---|---|
| 3.1 | `?action=selftest` = `get_health` integrity suite on demand; bookmark weekly | GLM |
| 3.2 | Monthly snapshot trigger (archive copy of the spreadsheet) | GLM |
| 3.3 | `Logs` sheet + `logEvent()` from every catch; surface `warnings[]` in responses instead of silent catches (incl. gradebook-column fallback) | minimax #6, #10 |
| 3.4 | Split Code.gs into Constants / Routing / Actions / Sheets / Validators files | minimax #3 |
| 3.5 | Constants for class lists & sheet names; extract `requireTeacherPin()`; distinct lock-timeout response; CacheService for gradebook headers | minimax #5, #8, #9, #11; GLM C3–C4 |
| 3.6 | Optional: sandbox deployment (second script bound to a copy sheet) for testing schema changes | minimax open-q #3 |

---

## 4. Calendar fit

| When | What |
|---|---|
| This week | Phase 0 (recover 902) + Phase 1 build & deploy |
| Before your next GAS-using class | Phase 1 live + health check green |
| By mid-October | Phase 2 deployed (before submission volume makes 2.1 urgent) |
| Before Nov 23 report cards | Phase 2 verified against dashboards; Phase 3 items as appetite allows |
| Ongoing, 30 seconds | Any future Code.gs edit: bump `VERSION` → paste → **Deploy → New version** → open `get_health` bookmark |

## 5. Decisions I need from you

1. **Partition style for 2.1** — I recommend the 5-task inline cap + stubs (reasons in the table). gemini prefers dedicated columns or sub-tabs; both work, but they break the row-per-student model every dashboard and your own gradebook-reading habits rely on. Overrule me if you disagree.
2. **Task registry strictness** — quarantine unknown task names (recommended) vs. hard-reject them.
3. **Is `CLASS_LOG_PIN` set?** If not, class-log writes are currently open; setting the Script Property is a 1-minute hardening step.
4. **Sandbox deployment** — yes/no; it pairs naturally with the Phase 1 deploy.
5. **Who implements** — I can build Phase 1 in this repo (Code.gs + api.js ready to paste into the Apps Script editor), or you can hand the plan to Antigravity and I'll review its output against this document.

---

*Companion documents: `GAS-audit-glm.md` (full findings + evidence), `GAS-audit-minimax.md`, `GAS_ARCHITECTURE_REVIEW- gemini.md`.*
