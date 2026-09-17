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

- Section keys: `902-CIT 902-HL 901-CIT 901-HL 903-CIT 903-HL 801-HE 802-HE 803-HE 804-HE`
  (course = `CIT9` / `HL9` / `HL8`).
- Dates are `YYYY-MM-DD`. When the teacher says "log that … for <section>", resolve the
  date to the class's actual meeting date (see `Student_System/class_log_meetings_data.js`
  for every section's meeting dates/periods — the tracker's schedule engine).
- Reliability notes: the POST's `302` response is **normal** — the script executes on the
  first hop even though curl shows a redirect (or a cosmetic 411/HTML page with `-L`);
  trust the follow-up GET, not the POST body. Google intermittently serves an HTML error
  page on GETs — retry 2–3 times. Verify writes with `get_class_log`, never assume.
- Optional gate: if a `CLASS_LOG_PIN` Script Property is set, writes need `teacherPin`.
- UI: `Student_System/Class_Log_Tracker.html` · docs: `Student_System/CLASS_LOG_README.md`

## Repo conventions

- Everything is standalone zero-dependency HTML/JS (GitHub Pages site). No build step.
- Projector displays follow `.agents/rules/classroom_displays_strongly_typed.md`.
- Never commit real student data (`students_roster.*`, pins, cache snapshots are gitignored).
- The schedule data file is generated: edit `tools/build_class_log_meetings.py`
  (holidays/timetable), run `python tools/build_class_log_meetings.py`; it verifies
  against 586 hand-checked class dates before writing.
