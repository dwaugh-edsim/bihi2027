# AGENTS.md — Room 8 repo notes for LLM/agent sessions

## Two-machine reality (home ↔ school harnesses)

Sessions run on BOTH Mr. Waugh's home computer and a school machine — **the git repo is
the only channel between them.** Anything that matters (edits, decisions, queued work,
diagnoses) must land in tracked files and be **pushed before the session ends**; a fact
that lives only in one session's conversation does not exist for the next harness.
Start of session: `git pull` / check `git status` — the other machine may have moved
since you last looked.

What does and doesn't travel:

- **Travels:** tracked files + push (GitHub Pages deploys `main` in ~1–2 min), and the
  **Room 8 Master Google Sheet** — the class-log webhook + teacher PIN works from any
  machine, so log writes and slide extras can be done from home; verify with a GET.
- **Does NOT travel (machine-local):** the projector browser's localStorage — the
  per-course Task Progress pick (`room8_prog_task_<course>`), the cached teacher PIN
  (`room8_class_log_pin`), and seating-doc storage (`sp_*` / `sp2_*`). To change
  defaults from home, edit tracked files (e.g. `assignments_data.js` `active`) and
  push; the projector picks it up on reload.

## Two repositories (public vs private)

- **`bihi2027` (this repo — public, GitHub Pages)** — student-facing only: assignments,
  slide decks, dashboards, projector tools, and the runtime client assets they load.
- **`bihipri-27` (private — cloned as a sibling at `../bihipri-27`)** — everything
  non-student-facing: curriculum planning + outcome maps, teacher facilitation/answer
  keys, test banks, system audits and hardening proposals, maintenance logs, marking and
  data tools, private roster data. Its folders mirror this repo's structure with a
  `-priv` suffix (`curriculum-planning-priv/`, `tools-priv/`, `audit-priv/`, …).

Rules:

- **Planning docs, answer keys, audits, and tooling go in the private repo** — never here.
- Need a file that has moved (outcome maps, answer keys, `tools/*.py`, roster JSON,
  audits)? Read it from `../bihipri-27/<dir>-priv/…`, and `git pull` there too.
- **This repo's `.gitignore` ignores `tools/`, `inbox/`, `curriculum-planning/`,
  `system-maintenance/`, `audit/`, and `data/sheets/`** — a file written to those paths
  here is invisible to git. Author them in the private repo instead.
- Both repos must be **cloned and pushed on both machines**; a fact that lives only in
  one clone does not exist for the other harness.
- **Coordination log:** append to `../bihipri-27/Student_System-priv/piiiharden.md`
  (append-only, newest at the bottom) — it moved out of this repo.

### Student adaptations (confidential — read the profile BEFORE designing a task)

`Dave` maintains an **`Adaptations`** tab in the Room 8 v2 sheet by hand (per student: email,
codes, short note). Consult it as **step 0 of creating any assignment**:

```
POST <BACKEND_URL> { action:'get_adaptations', teacherPin|identity, section:'802-HE', aggregateOnly:true }
-> { count, codeTotals:{code:n}, bySection:{section:{students,codes:{}}}, students?:[...] }
```

- **Bring it up unprompted.** When Dave asks for a new assignment, say what the section's
  documented adaptations are and how the task supports them (writing volume, chunking,
  read-aloud friendliness, whether extra time changes the shape). That is an expected part of
  the answer, not an optional extra.
- **`aggregateOnly:true` by default.** Names and notes are confidential: never write them into
  this public repo, and never print an adaptation label on a student's own screen — adapt the
  page silently, don't announce why.
- **Adaptation vs IPP.** Adaptations keep the same outcomes with different supports (a UI/design
  problem). Modified/IPP programs change the outcomes (a rubric problem). Don't blend them.

### The sync contract (home → school)

A file is at the other machine **only if all three** hold: it lives in a repo that is
cloned on both machines, it is **not** ignored by that repo's `.gitignore`, and it is
**committed and pushed**. Any one failure means the file silently stays home.

**Run this before ending a session:**

```bash
python scripts/sync_check.py      # from the public repo root; works from either repo
```

It reports unpushed commits, unpulled remote work, and every file that exists locally
but would never travel — for both repos — then prints a verdict (exit 0 = everything
will be at school).

- The private repo has a **cache-only** `.gitignore` on purpose — nothing
  content-related can be swallowed there. Don't add content patterns to it.
- `Private_Student_Data/*` here is ignored **by design**; its traveling copy is
  `../bihipri-27/Private_Student_Data-priv/` (tracked). The checker verifies that pairing.
- The public repo's ignored paths (`tools/ inbox/ audit/ curriculum-planning/
  system-maintenance/ data/sheets/`) are the **leak net**: a file dropped there is never
  published — but it also never travels, so author those in the private repo.

## Class Log live API (the teacher's "what did we do last class" tracker)

The teacher's per-section class log lives in the **Room 8 Master Google Sheet**
(tabs `Class_Log` and `Class_Plan`), exposed through the deployed Apps Script webhook
URL hard-coded in `Student_System/api.js` (`CONFIG.DEFAULT_SCRIPT_URL`).
Any agent session can read/update it with plain HTTP — no Google login, no repo edit:

```bash
# Read everything (entries + per-section forward plans)
curl -sL "<SCRIPT_URL>?action=get_class_log"

# Log a class (upsert on date+section). "next" also advances the section's plan,
# auto-incrementing the class number. Entry must be real — never write test rows
# without saying so; to remove one use delete_class_log below.
curl -sL -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"action":"submit_class_log","entry":{"date":"YYYY-MM-DD","section":"902-CIT","course":"CIT9","classNo":"7","did":"...","next":"..."}}' \
  "<SCRIPT_URL>"

# Change direction (edit the forward plan WITHOUT logging a class)
curl -sL -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"action":"set_class_plan","section":"902-CIT","note":"Quiz pushed to Monday","classNo":"6"}' \
  "<SCRIPT_URL>"     # empty note clears the plan

# Remove a bad/test row
curl -sL -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"action":"delete_class_log","date":"YYYY-MM-DD","section":"902-CIT"}' \
  "<SCRIPT_URL>"

# Opening-slide extras (projector do-now slide; multi-line values use \n). All-blank clears.
# Agenda for the slide comes from set_class_plan's note (one line = one agenda item).
curl -sL -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"action":"set_class_slide","section":"902-CIT","title":"","announcements":"Picture day Thursday","outcome":""}' \
  "<SCRIPT_URL>"
```

**Assignment-probe gotcha:** demo PINs (`TST`/`WAU`/`DEV`/`MRW`) always write to
the hidden `DEMO` tab regardless of the posted class — so
`action=get_class_progress&className=803` will NEVER show them. To check a
teacher-demo save landed, read `className=DEMO`. This was once misread as
"get_class_progress is cached" (F3, Sept 21) — it isn't; class-tab reads are live.

**Diagnosis norm:** when a live system contradicts the repo model, suspect a
hidden branch first (demo-pin routing, exemplar guardrails, fail-closed gates,
demo early-returns) — NOT that the human pasted or deployed wrong. Sept 21's F3
misdiagnosis stacked an invented "the teacher's redeploy didn't take" story on
top of a probe that was measuring the wrong tab; the redeploy had been fine all
along. Humans break things less often than models miss hidden branches.

**Class Startup daily system (the projector opening slide):**
`Student_System/Class_Startup.html` is the projector do-now. Its Task Progress picker
and LEARNING OUTCOME strip are driven by
`Student_System/assignments_data.js` — the curated registry mapping each course's
ledger `TASK_NAME`s to a short label + best-fit outcome, with `active` per course.
When the teacher launches a new assignment, ADD IT THERE: exact `TASK_NAME` from the
assignment page, and the outcome **chosen by digging into
`../bihipri-27/curriculum-planning-priv/2026-27outcomes.md`** — the compiled verbatim
outcome pool for CIT9/HL9/HL8 with codes, match tags, and the choosing steps; cite the
code in the item's `ref` and add the pick to the doc's mapping table. Outcome resolution on the slide: ⚙ override → matched assignment
→ lesson-map unit by next class # → course default. The "Last class (date · #n)" line
is the section's newest Class_Log entry; it only appears once the course has been
logged at least once. `class_log_seed_data.js` is the offline snapshot
(entries+plans+slides) — regenerate it from `get_class_log` after a batch of logging.

**Morning preset:** when Mr. Waugh says *"get today's screens ready"*, *"bang the
day's screen into shape"*, or pastes a raw day note, follow the **Morning preset
runbook** in `Student_System/CLASS_LOG_README.md`: orient (read-only) → log
yesterday's stragglers → set today's plans/agenda → set/clear slide extras →
confirm `assignments_data.js` `active` per course → refresh the seed → print a
per-section verification line. Ask for `CLASS_LOG_PIN` up front if writes are
needed; read-only steps need no PIN.

> **PENDING SCREEN ITEMS — from the principal's Monday Memo (Sept 21), awaiting Mr.
> Waugh's go + PIN. Push via `set_class_slide`, then DELETE this block.**
> 1. Every section meeting Sept 22–24: append "PD Day Friday (Sept 25) — no classes."
>    Clear after Sept 25.
> 2. Every section meeting Sept 22–24: append "Hold & Secure drill this week — we'll
>    review expectations first." Clear once the drill has happened.
> 3. Sections meeting Sept 28–29 (P1 HL9 · P4 CIT9 · P5 HL8 on the 29th): set on or
>    after Sept 28 — "Orange Shirt Day Tuesday (Sept 29) — wear orange." Clear after
>    Sept 29.
> Mechanics: `set_class_slide` overwrites the whole announcements field — read current
> slides with `get_class_log` first and merge (they were all empty as of Sept 21).

## Seating plans

`seating-plan.html` (repo root) is the editable seating doc; its saved layouts live in
that page's **browser storage** (`sp_<homeroom>`, JSON seatNumber→name). The opening
slide's 🪑 popup reads, best first: that storage → snapshot in
`Student_System/class_seating_data.js` (`snapshots.<homeroom>`) → alphabetical roster
from `Student_System/students_roster_data.js`. To sync a class for projectors on a
different browser/origin, mirror its saved layout into `class_seating_data.js`
snapshots and push. Names only — never PINs/IDs/notes on projector screens.

- Section keys: `902-CIT 902-HL 901-CIT 901-HL 903-CIT 903-HL 801-HE 802-HE 803-HE 804-HE`
  (course = `CIT9` / `HL9` / `HL8`).
- Dates are `YYYY-MM-DD`. When the teacher says "log that … for <section>", resolve the
  date to the class's actual meeting date (see `Student_System/class_log_meetings_data.js`
  for every section's meeting dates/periods — the tracker's schedule engine).
- Reliability notes: the POST's `302` response is **normal** — the script executes on the
  first hop even though curl shows a redirect (or a cosmetic 411/HTML page with `-L`);
  trust the follow-up GET, not the POST body. Google intermittently serves an HTML error
  page on GETs — retry 2–3 times. Verify writes with `get_class_log`, never assume.
- GATE IS ACTIVE (since Sept 21): `CLASS_LOG_PIN` is set on the deployed project,
  so every class-log WRITE (`submit_class_log`, `set_class_plan`,
  `set_class_slide`, `delete_class_log`) and `set_roster` now requires
  `"teacherPin":"<ask the teacher>"` in the POST body — GETs are unaffected.
  The PIN value is deliberately NOT recorded in this repo; ask the teacher for
  it at the start of any session that needs writes.
- UI: `Student_System/Class_Log_Tracker.html` · docs: `Student_System/CLASS_LOG_README.md`

## Repo conventions

- Everything is standalone zero-dependency HTML/JS (GitHub Pages site). No build step.
- Projector displays follow `.agents/rules/classroom_displays_strongly_typed.md`.
- **Student names in anything an LLM or a screenshot sees → first name + last TWO initials**
  (`Jordan Th.`, `Doun Kw.`). This is the agreed standard for: agent/tool output, probe
  script printing, Station display, and anything pasted into a chat or captured in a
  screenshot. Full names + `@gnspes.ca` emails stay server-side (auth/storage, HMAC-signed)
  and in the private repo — they are what the backend keys on, and that never changes.
  Convention is *presentation-layer only*: it does not alter login, dedupe, or storage.
  Rule of thumb: real email for auth, `First Ls.` for eyes, counts/codes for written records.
- **Student privacy split (never publish PII):** anything publicly served may carry
  **names + class only** (`first_name`, `last_name`, `homeroom`, `grade`, courses).
  PINs, student IDs, usernames and full legal first names must never appear in tracked
  files, in git history of current files, or rendered on any public screen. Private
  roster data lives **in the private repo** (`../bihipri-27/Private_Student_Data-priv/`:
  `roster_full.json`, `roster_gas_payload.json`) and server-side in the GAS Script
  Property `ROSTER_PRIVATE` (push via the gated `set_roster` action, verify with a
  follow-up GET). Public roster file: `Student_System/students_roster_data.js`
  (names-only, generated by `python ../bihipri-27/tools-priv/roster_privacy.py --emit`;
  add `--drop-pin` once no page needs client-side pins). Student login is validated by
  the GAS `resolve_student` action — pages fall back to the client roster only when the
  GAS is unreachable/old.
- Never commit real student data (`students_roster.*`, pins, cache snapshots are gitignored).
- The schedule data file is generated: edit
  `../bihipri-27/tools-priv/build_class_log_meetings.py` (holidays/timetable), run
  `python ../bihipri-27/tools-priv/build_class_log_meetings.py` to rewrite
  `Student_System/class_log_meetings_data.js` here; it verifies against 586 hand-checked
  class dates before writing.
- **Room 8 v2 Assignment Conventions:**
  - **Course-Level Naming Only:** Never hardcode class/homeroom numbers in filenames
    or queries (e.g. `HL8_5_Dimensions_System_Audit.html`, NEVER `HL8_Class804_...`).
    Course assignments serve the whole course (`HL8` serves 801/802/803/804; `CIT9` & `HL9`
    serve 901/902/903). Section mapping is resolved automatically per student via Google SSO.
  - **No Ad-Hoc Legacy Fetches:** Never inject manual `fetch()` calls to defunct script URLs.
    Loading and saving is handled exclusively by the Room 8 v2 engine via `pipe.load(task)`
    and `pipe.autosave()` against `BACKEND_URL`.
  - **Chromebook Reality — Zero Client `localStorage` for Students:** Chromebooks wipe local
    browser storage on session close. All student state must be saved to the server. Off-roster
    section choices are bundled directly into the cloud payload (`payload.section`).
  - **Wording Standard:** Always say **"Server"**, never "GAS" in student-facing labels,
    badges, alerts, or buttons.

## Course direction (teacher-confirmed, updating as he pivots)

- **Citizenship 9**: teacher pivoted away from the "Head-to-Toe Citizen" opener (Sep 17).
  Stated sequence: current events / cost-of-living assignment → checkpoint quiz
  (NS/Canada map · 3 levels of government · cost-of-living basics) → a new lesson on
  **taking a moral stand at a cost** (Ed Sheeran × Macklemore-inspired; being drafted in
  Antigravity). The class-by-class numbering in the outlines/CALENDAR files is drifting
  from classroom reality — trust the Class Log's actual entries and the teacher's word
  over the planning docs, and don't reintroduce dropped lessons.
