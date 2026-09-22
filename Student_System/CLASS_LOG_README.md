# Class Log — "What did we do last class?" Tracker

**Page:** `Student_System/Class_Log_Tracker.html` (on the hub: `…/Student_System/Class_Log_Tracker.html`)
**Opening slide:** `Student_System/Class_Opening_Slide.html` — the projector "do-now" for when students enter
**Data:** `Class_Log`, `Class_Plan`, and `Class_Slide` tabs in the **Room 8 Master Google Sheet** (same spreadsheet as the student system)
**Backend:** the existing Student Webhook Apps Script (actions `get_class_log`, `submit_class_log`, `set_class_plan`, `set_class_slide`, `delete_class_log`)

One log row per class meeting. The tracker reads it live, works out **when each section meets
next** from the verified 10-day rotation, and shows per-section *Last class → Next class*
cards with countdowns and a suggested-next-lesson hint. The **opening slide** auto-detects
which class is in session from the clock (bell schedule + rotation), then shows course name
+ date, today's agenda (from that section's plan — so "what's next" in the tracker *is* the
slide), announcements, and a course outcome strip at the bottom for administrators.

## The opening slide (projector)

- **Zero setup per class**: open `Class_Opening_Slide.html` on the projector — it picks the
  right class from the time of day. Wrong pick? Click a chip or press ← / →. `F` = fullscreen.
- **Agenda**: comes from the section's plan in the tracker. In the plan, one line = one
  agenda item on the slide. If there's no plan, it falls back to the suggested next lesson.
  "Last class (date · #n)" shows above it as continuing context — it is the section's
  newest Class_Log entry, so logging a class (tracker, Sheet app, or curl) is what keeps
  it current. A course with no entries shows a quiet "No log yet" nudge instead.
- **Which assignment the live view shows**: the Task Progress panel has a dropdown
  listing the course's curated assignments (`assignments_data.js`) plus anything found
  in the ledger. Pick one and it sticks (per course, in that browser) — including a
  brand-new assignment before anyone has saved (it renders at 0 / "Not started").
- **Announcements / title / outcome**: press `⚙` (or `e`) on the slide, type, Save — stored
  per section in the `Class_Slide` tab via the webhook.
- **Learning outcome strip** (the administrator view — always on screen), resolved in
  this order:
  1. the ⚙ outcome override, when the teacher typed one;
  2. the outcome curated for the assignment on screen (`assignments_data.js` matches
     the ledger task name → the verbatim curriculum statement chosen from
     `../2026-27outcomes.md`, the compiled outcome pool an agent digs into whenever a
     new assignment launches);
  3. the lesson-map unit outcome for the next class # (`class_log_lesson_maps.js`);
  4. the course's default outcome.
- **🪑 Seats popup** (`s` key): the Room 8 desk chart (11 · 11 · 7) for the class on screen.
  Names come from, best first: the seating doc's own browser storage (`sp_<homeroom>` —
  your live edits in `seating-plan.html` when both pages run in the same browser),
  a synced snapshot in `class_seating_data.js`, then the alphabetical roster.
  Ask ZCode to "sync 902's seating snapshot" after reshuffling in the seating doc.


---

## Morning preset — "bang today's screen into shape" (agent runbook)

The slide doesn't need to be fully automated — Mr. Waugh is fine with an agent session
(ZCode, Antigravity, anything that reads this repo) presetting the day. Trigger phrases:
*"get today's screens ready"*, *"bang the day's screen into shape"*, *"set up today's
slide"* — even a raw brain-dump like *"902s finished the Numbeo research, quiz Thursday,
announce Terry Fox forms"* is enough; the agent formats and files it.

**First: ask for `CLASS_LOG_PIN` if anything will be written. It is never stored in the
repo.** Reads are open. POST bodies are the ones in the class-log section of AGENTS.md /
section C above. Live changes land on the projector within ~3 minutes (the slide
re-pulls the log on its own); a registry flip needs an F5 on the projector tab.

1. **Orient (no PIN).** `curl "?action=get_class_log"` + `class_log_meetings_data.js`
   → which sections meet today, which of yesterday's classes went un-logged, what the
   plans/slides currently say.
2. **Log yesterday's stragglers.** Ask for a one-line "what we did / what's next" per
   missing section, then `submit_class_log`. Re-logging a date+section overwrites, so
   mistakes are safe to fix.
3. **Set today's agenda** per section with `set_class_plan` (one line = one agenda item
   on the slide). Empty note clears.
4. **Announcements / title** with `set_class_slide`. ⚠ All-blank **clears** the
   section's extras — deliberately clear stale ones (announcements persist forever
   otherwise). Leave the outcome override alone except special days: the strip
   auto-matches the assignment.
5. **Assignment pick.** Check `assignments_data.js` — each course's `active` id must be
   what today's classes are working on. If the course moved on, flip `active` (and the
   item's `taskName` must equal the assignment page's `TASK_NAME` exactly), then
   commit + push; the projector picks it up on next page load. Manual per-browser
   overrides (the dropdown) beat `active`, so tell Mr. Waugh if a projector was
   re-pinned by hand.
6. **Refresh the offline seed.** Re-bake `class_log_seed_data.js` from the GET
   (entries + plans + slides) so a dead-network morning still shows last class.
7. **Verify and print.** Re-read the GET and print one line per today's section:
   *last class → agenda → announcements → assignment ★ → outcome*. That printout is
   the day's screen, confirmed. Missing logs or stale announcements are called out
   right there.

Steps 1, 6, 7 are read-only — safe to run any time, PIN or not.

---

## Daily use (outside Antigravity — pick whichever is easier)

### A. Google Sheet app on your phone (most reliable)
Open the Room 8 Master Sheet → **Class_Log** tab → add/fix a row:

| A Date | B Section | C Course | D Class # | E What We Did | F Next Class | G Timestamp |
|---|---|---|---|---|---|---|
| 2026-09-23 | 902-CIT | CIT9 | 7 | Finished SL proposal work period | Proposal due next class — submit on Classroom | *(auto)* |

- **Date** must be `YYYY-MM-DD` · **Section** is one of the 10 keys:
  `902-CIT, 902-HL, 901-CIT, 901-HL, 903-CIT, 903-HL, 801-HE, 802-HE, 803-HE, 804-HE`
- Re-logging the same **Date + Section** *overwrites* the row (fixing mistakes is safe).
- The dashboard picks it up on refresh / within 5 minutes.

### B. Quick-log panel + ✎ plan editor on the tracker page
Pick the class (pre-selected to today's un-logged class), type what you did / what's next,
optional Class #, press **Log it**. Works from the projector or your phone browser.

**Change direction without logging a class:** every card's "Next class" block has a
**✎ plan** link. It opens a mini-editor: rewrite the next-class note (push the quiz,
swap the lesson), override the suggested Class #, or Clear the plan. Logging a class
with a "next" note also updates the plan automatically and advances the Class # by one.

### C. Let ZCode / an LLM manage it (no interface at all)
The tracker is a plain JSON API — any agent session with a shell can run it. Say
*"log that 902 CIT finished the organizer, quiz moved to Monday"* and ZCode does:

```bash
# read everything (entries + forward plans)
curl -sL "<SCRIPT_URL>?action=get_class_log"
# log a class ("next" auto-advances the plan)
curl -sL -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"action":"submit_class_log","entry":{"date":"2026-09-17","section":"902-CIT","course":"CIT9","classNo":"5","did":"Finished organizer","next":"Quiz 1 moved to Monday"}}' \
  "<SCRIPT_URL>"
# change direction only (no class logged; empty note clears the plan)
curl -sL -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"action":"set_class_plan","section":"902-CIT","note":"Quiz pushed to Monday","classNo":"6"}' \
  "<SCRIPT_URL>"
# remove a bad row
curl -sL -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"action":"delete_class_log","date":"2026-09-17","section":"902-CIT"}' \
  "<SCRIPT_URL>"
```

`<SCRIPT_URL>` is the webhook in `api.js` (`CONFIG.DEFAULT_SCRIPT_URL`) — also written in
the repo's `AGENTS.md` so any future ZCode session finds it automatically.

**Curl reliability notes:** the `302` on a POST is normal — the script runs on the first
hop even if curl shows a redirect or a cosmetic 411/HTML page; confirm writes with
`get_class_log` rather than trusting the POST response. Google also intermittently serves
an HTML error page on GETs — retry 2–3×. Dates are always `YYYY-MM-DD` in the API; if you
type them straight into the Sheet, Google may display them as local dates, which is fine —
the backend normalizes on read and on upsert/delete matching.

### D. With any LLM (hands-free)
Paste your messy note into any LLM along with:

> Format this as one row for my Class_Log sheet. Columns: Date (YYYY-MM-DD),
> Section (one of 902-CIT, 902-HL, 901-CIT, 901-HL, 903-CIT, 903-HL, 801-HE, 802-HE, 803-HE, 804-HE),
> Course (CIT9/HL9/HL8), Class # (integer if you can tell), What We Did, Next Class.
> Today is <date>. My note: "<your note>"

Copy the row into the Sheet (or into the quick-log panel). Done.

---

## One-time setup (already-coded, just paste)

1. Open **script.google.com** → your *Student Webhook Backend* project (the one behind `api.js`).
2. `Code.gs` in this repo has four class-log actions — `get_class_log` (in `doGet`),
   `submit_class_log`, `set_class_plan`, `delete_class_log` (in `doPost`) — plus sheet
   helpers (`getClassLogSheet`, `getClassPlanSheet`, `readClassPlans`, `writeClassPlan`,
   `clearClassPlan`). Paste the updated file over the old one and save.
3. **Redeploy:** Deploy → Manage deployments → ✏ edit → Version: **New version** → Deploy.
   (Saving alone is not enough if the deployment is pinned to an old version — the webhook
   will keep answering with the old code.) Hard-refresh the tracker; the pill should read **LIVE ✓**.
4. Optional: File → Project properties → Script properties → add `CLASS_LOG_PIN` = anything you
   like to require a PIN for quick-log writes. Skip it to leave the log open (it contains only
   lesson summaries — no student data).

## Maintaining it with an LLM

- **Fix the schedule (snow day, new PD day, timetable change):** edit `NO_CLASS_DAYS` /
  `SECTIONS` in `tools/build_class_log_meetings.py`, then run
  `python tools/build_class_log_meetings.py`. It refuses to write anything unless it still
  reproduces all 586 hand-verified class dates from your three course calendars.
- **Refresh the offline seed:** open
  `<script-url>?action=get_class_log` in a browser, copy the JSON `entries` array into
  `class_log_seed_data.js`. Any LLM can format that for you.
- **Lesson hint titles:** edit `class_log_lesson_maps.js` (`classes: { n: "title" }`).
- **New assignment launched:** add it to `assignments_data.js` — `taskName` must equal
  the page's `TASK_NAME` exactly (grep the assignment page), then choose the outcome by
  digging into `../2026-27outcomes.md` (verbatim pool, codes, match tags, choosing
  steps) and set `active` to its id. That alone wires up the progress picker, the
  0%-until-first-save view, and the outcome strip.
- The tracker page never needs editing for day-to-day use.

## Files

| File | Role |
|---|---|
| `Class_Log_Tracker.html` | the dashboard + quick-log panel (teacher-only) |
| `Class_Opening_Slide.html` | projector do-now slide: auto class detect, agenda, announcements, outcome strip |
| `class_log_meetings_data.js` | generated: all 10 sections' meeting dates/periods, 2026–27 |
| `class_log_lesson_maps.js` | class # → lesson titles + per-unit course outcomes (outcome fallback) |
| `assignments_data.js` | curated assignment registry: ledger TASK_NAME → projector label + matched outcome; `active` per course |
| `class_log_seed_data.js` | offline snapshot (entries + plans + slides; regenerated from the GET endpoint) |
| `../tools/build_class_log_meetings.py` | schedule engine generator + fixture verification |
| `Code.gs` | `get_class_log` / `submit_class_log` / `set_class_plan` / `delete_class_log` + sheet helpers |
| `api.js` | `StudentAPI.getClassLog` / `submitClassLog` / `setClassPlan` / `deleteClassLog` |

## Design notes / assumptions

- The 10-day cycle is **weekday-anchored** (Mon = Day 1/6 … Fri = Day 5/10; the week of
  Mon Sep 14, 2026 = Week 1). Holidays/PD days simply land on a day and its classes are lost
  ("Labour Day = Lost W1 Monday"). This model reproduces every date in the CIT9, HL9 and HL8
  verified calendars exactly.
- The tracker keys on **timetable periods**, not the curriculum plans — so June buffer periods
  (after a course's last planned class) still appear as meetings. Log them or ignore them.
- 802-HE includes the "Wed Week 2 P3" period from the sub-folder key correction; the HL8
  outline's 37-class adaptation predates it.
- If reality drifts (assembly swaps the period, snow day), just log what actually happened on
  the real date — the Sheet is the truth, the schedule only suggests *when next*.
