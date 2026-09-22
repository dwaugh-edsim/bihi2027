# AGENTS.md — Room 8 repo notes for LLM/agent sessions

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

**Opening slide daily system:** `Student_System/Class_Opening_Slide.html` is the
projector do-now. Its Task Progress picker and LEARNING OUTCOME strip are driven by
`Student_System/assignments_data.js` — the curated registry mapping each course's
ledger `TASK_NAME`s to a short label + best-fit outcome, with `active` per course.
When the teacher launches a new assignment, ADD IT THERE: exact `TASK_NAME` from the
assignment page, and the outcome **chosen by digging into `2026-27outcomes.md` (repo
root)** — the compiled verbatim outcome pool for CIT9/HL9/HL8 with codes, match tags,
and the choosing steps; cite the code in the item's `ref` and add the pick to the
doc's mapping table. Outcome resolution on the slide: ⚙ override → matched assignment
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
- **Student privacy split (never publish PII):** anything publicly served may carry
  **names + class only** (`first_name`, `last_name`, `homeroom`, `grade`, courses).
  PINs, student IDs, usernames and full legal first names must never appear in tracked
  files, in git history of current files, or rendered on any public screen. Private
  roster data lives in `Private_Student_Data/` (gitignored: `roster_full.json`,
  `roster_gas_payload.json`, `generate_roster.py`) and server-side in the GAS Script
  Property `ROSTER_PRIVATE` (push via the gated `set_roster` action, verify with a
  follow-up GET). Public roster file: `Student_System/students_roster_data.js`
  (names-only, generated by `python tools/roster_privacy.py --emit`; add `--drop-pin`
  once no page needs client-side pins). Student login is validated by the GAS
  `resolve_student` action — pages fall back to the client roster only when the GAS
  is unreachable/old.
- Never commit real student data (`students_roster.*`, pins, cache snapshots are gitignored).
- The schedule data file is generated: edit `tools/build_class_log_meetings.py`
  (holidays/timetable), run `python tools/build_class_log_meetings.py`; it verifies
  against 586 hand-checked class dates before writing.

## Course direction (teacher-confirmed, updating as he pivots)

- **Citizenship 9**: teacher pivoted away from the "Head-to-Toe Citizen" opener (Sep 17).
  Stated sequence: current events / cost-of-living assignment → checkpoint quiz
  (NS/Canada map · 3 levels of government · cost-of-living basics) → a new lesson on
  **taking a moral stand at a cost** (Ed Sheeran × Macklemore-inspired; being drafted in
  Antigravity). The class-by-class numbering in the outlines/CALENDAR files is drifting
  from classroom reality — trust the Class Log's actual entries and the teacher's word
  over the planning docs, and don't reintroduce dropped lessons.
