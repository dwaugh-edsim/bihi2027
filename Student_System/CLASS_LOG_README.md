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
  "Last class" shows above it as continuing context.
- **Announcements / title / outcome**: press `⚙` (or `e`) on the slide, type, Save — stored
  per section in the `Class_Slide` tab via the webhook. Leave the outcome blank to use the
  course outcome for today's lesson (from `class_log_lesson_maps.js`).
- The outcome strip stays on screen for the whole period — that's the administrator view.


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
- The tracker page never needs editing for day-to-day use.

## Files

| File | Role |
|---|---|
| `Class_Log_Tracker.html` | the dashboard + quick-log panel (teacher-only) |
| `Class_Opening_Slide.html` | projector do-now slide: auto class detect, agenda, announcements, outcome strip |
| `class_log_meetings_data.js` | generated: all 10 sections' meeting dates/periods, 2026–27 |
| `class_log_lesson_maps.js` | class # → lesson titles + per-unit course outcomes (slide outcome bar) |
| `class_log_seed_data.js` | offline snapshot (entries + plans; regenerated from the GET endpoint) |
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
