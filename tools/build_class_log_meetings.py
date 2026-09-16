#!/usr/bin/env python3
"""
build_class_log_meetings.py — generates Student_System/class_log_meetings_data.js

Derives every meeting date for Mr. Waugh's 10 teaching sections for 2026-27
from (a) the weekday-anchored 10-day cycle and (b) the master timetable grid.

CYCLE MODEL (verified against CIT9-CALENDAR-2026-27.md, all 270 fixture dates):
  The 10-day cycle is anchored to CALENDAR WEEKS, not sequential school days.
  Week 1 (Mon-Fri) = Days 1-5, Week 2 = Days 6-10, alternating every calendar
  week all year (holidays/breaks simply land on a day and its classes are lost:
  "Labour Day = Lost W1 Monday"). Anchor: week of Mon Sep 14, 2026 = Week 1
  (per 902_Today_Schedule_Deck.html). Cross-checks: Sep 3 (2026-09-03, first
  student day, week of Aug 31 = W1) = D4; Sep 9 (W2) = D8 - both consistent
  with the verified CIT9 calendar.

VERIFICATION:
  The script reproduces the full hand-verified CIT9 date tables (901/902/903,
  90 classes each) from CIT9-CALENDAR-2026-27.md. If any fixture mismatches,
  it aborts rather than emitting a wrong data file. HL9 / HE8 meeting dates
  use the identical engine and grid, so they inherit that confidence.

Sources:
  - SUB_FOLDER_SCHEDULES.md / MrWaugh_Teaching_Schedule_10Day_Cycle_A4.html (grid)
  - LAUNCH-PLAN-2026-09-01.md section 7 (verified 2026-27 NSRCE calendar)
  - Citizenship 9/CIT9-CALENDAR-2026-27.md (fixtures)

Re-run any time the timetable or HRCE calendar changes:
    python tools/build_class_log_meetings.py
"""

import json
import sys
from datetime import date, timedelta

# ============================================================
# 1. Calendar: no-class days for 2026-27 (LAUNCH-PLAN-2026-09-01.md section 7,
#    "VERIFIED against the official 2026-27 NSRCE year-at-a-glance").
#    EDIT THIS LIST when HRCE announces weather/PD changes, then re-run.
# ============================================================
FIRST_STUDENT_DAY = date(2026, 9, 3)
LAST_STUDENT_DAY = date(2027, 6, 30)
EXPECTED_STUDENT_DAYS = 184  # per launch plan

def _d(s):
    y, m, dd = map(int, s.split("-"))
    return date(y, m, dd)

NO_CLASS_DAYS = set(map(_d, [
    "2026-09-01",  # org day
    "2026-09-02",  # PD
    "2026-09-07",  # Labour Day (Lost W1 Monday)
    "2026-09-25",  # PD
    "2026-09-30",  # Truth & Reconciliation Day
    "2026-10-12",  # Thanksgiving
    "2026-10-23",  # NSTU Conference
    "2026-11-11",  # Remembrance Day
    "2026-11-20",  # Term 1 ends - assess/eval day (no student classes)
    "2026-12-04",  # PD
    "2026-12-21", "2026-12-22", "2026-12-23", "2026-12-24", "2026-12-25",
    "2026-12-28", "2026-12-29", "2026-12-30", "2026-12-31",  # December break + Dec 21 PD
    "2027-01-01",  # break
    "2027-02-15",  # NS Heritage Day
    "2027-03-05",  # Term 2 ends - eval day
    "2027-03-08", "2027-03-09", "2027-03-10", "2027-03-11", "2027-03-12",  # Spring Break
    "2027-03-26",  # Good Friday
    "2027-03-29",  # Easter Monday
    "2027-04-02",  # PD
    "2027-04-30",  # PD
    "2027-05-24",  # Victoria Day
    "2027-06-29",  # eval day
]))

WEEK1_ANCHOR_MONDAY = date(2026, 9, 14)  # 902_Today_Schedule_Deck.html: Mon Sep 14 = Day 1

def cycle_day(d):
    """Cycle day 1-10 for any date, or None if not a student day."""
    if d.weekday() >= 5:  # Sat/Sun
        return None
    if d < FIRST_STUDENT_DAY or d > LAST_STUDENT_DAY or d in NO_CLASS_DAYS:
        return None
    week_delta = (d - WEEK1_ANCHOR_MONDAY).days // 7
    week_parity_is_w1 = (week_delta % 2 == 0)
    day_in_week = d.weekday() + 1  # Mon=1..Fri=5
    return day_in_week if week_parity_is_w1 else day_in_week + 5

# ============================================================
# 2. Master timetable grid (SUB_FOLDER_SCHEDULES.md section 1,
#    incl. the "Wed Week 2 P3 = 802 HE" key correction).
#    section key -> {cycle day: period}
# ============================================================
SECTIONS = {
    "902-CIT": {"label": "Citizenship 9", "section": "902", "course": "CIT9",
                "grade": 9, "room": "Rm 8", "slots": {1: "P3", 4: "P2", 6: "P5", 8: "P5", 10: "P4"}},
    "902-HL":  {"label": "Healthy Living 9", "section": "902", "course": "HL9",
                "grade": 9, "room": "Rm 8", "slots": {2: "P1", 3: "P5", 9: "P5"}},
    "901-CIT": {"label": "Citizenship 9", "section": "901", "course": "CIT9",
                "grade": 9, "room": "Rm 8", "slots": {1: "P4", 3: "P4", 4: "P5", 8: "P4", 9: "P1"}},
    "901-HL":  {"label": "Healthy Living 9", "section": "901", "course": "HL9",
                "grade": 9, "room": "Rm 8", "slots": {4: "P1", 6: "P4", 7: "P3"}},
    "903-CIT": {"label": "Citizenship 9", "section": "903", "course": "CIT9",
                "grade": 9, "room": "Rm 8", "slots": {1: "P5", 2: "P4", 4: "P4", 8: "P1", 10: "P3"}},
    "903-HL":  {"label": "Healthy Living 9", "section": "903", "course": "HL9",
                "grade": 9, "room": "Rm 8", "slots": {4: "P3", 6: "P1", 7: "P5"}},
    "801-HE":  {"label": "Healthy Living 8", "section": "801", "course": "HL8",
                "grade": 8, "room": "Rm 8", "slots": {1: "P2", 5: "P1", 9: "P4"}},
    "802-HE":  {"label": "Healthy Living 8", "section": "802", "course": "HL8",
                "grade": 8, "room": "Rm 8", "slots": {3: "P2", 7: "P4", 8: "P3"}},
    "803-HE":  {"label": "Healthy Living 8", "section": "803", "course": "HL8",
                "grade": 8, "room": "Rm 8", "slots": {1: "P1", 2: "P5", 7: "P1", 8: "P2"}},
    "804-HE":  {"label": "Healthy Living 8", "section": "804", "course": "HL8",
                "grade": 8, "room": "Rm 8", "slots": {3: "P1", 9: "P2", 10: "P1"}},
}

SECTION_ORDER = ["902-CIT", "902-HL", "901-CIT", "901-HL", "903-CIT", "903-HL",
                 "801-HE", "802-HE", "803-HE", "804-HE"]

# ============================================================
# 3. Fixtures: hand-verified class dates.
#    - CIT9: Citizenship 9/CIT9-CALENDAR-2026-27.md appendix (classes 1-90 x3)
#    - HL9:  HealthyLiving9/HL9-COMPRESSED-OUTLINE-2026-27.md appendix (55 x3)
#    - HL8:  HealthyLiving8/HL8-COMPRESSED-OUTLINE-2026-27.md appendix (50 x3;
#            802 lists only its 37-class adaptation and predates the
#            "Wed W2 P3 = 802 HE" grid key-correction -> subset check)
# ============================================================
CIT9_FIXTURES = {
    "901": "Sep03 Sep09 Sep10 Sep14 Sep16 Sep17 Sep23 Sep24 Sep28 Oct01 Oct07 Oct08 Oct14 Oct15 "
           "Oct21 Oct22 Oct26 Oct28 Oct29 Nov04 Nov05 Nov09 Nov12 Nov18 Nov19 Nov23 Nov25 Nov26 "
           "Dec02 Dec03 Dec07 Dec09 Dec10 Dec16 Dec17 Jan04 Jan06 Jan07 Jan13 Jan14 Jan18 Jan20 "
           "Jan21 Jan27 Jan28 Feb01 Feb03 Feb04 Feb10 Feb11 Feb17 Feb18 Feb24 Feb25 Mar01 Mar03 "
           "Mar04 Mar15 Mar17 Mar18 Mar24 Mar25 Mar31 Apr01 Apr07 Apr08 Apr12 Apr14 Apr15 Apr21 "
           "Apr22 Apr26 Apr28 Apr29 May05 May06 May10 May12 May13 May19 May20 May26 May27 Jun02 "
           "Jun03 Jun07 Jun09 Jun10 Jun16 Jun17",
    "902": "Sep03 Sep09 Sep11 Sep14 Sep17 Sep21 Sep23 Sep28 Oct01 Oct05 Oct07 Oct09 Oct15 Oct19 "
           "Oct21 Oct26 Oct29 Nov02 Nov04 Nov06 Nov09 Nov12 Nov16 Nov18 Nov23 Nov26 Nov30 Dec02 "
           "Dec07 Dec10 Dec14 Dec16 Dec18 Jan04 Jan07 Jan11 Jan13 Jan15 Jan18 Jan21 Jan25 Jan27 "
           "Jan29 Feb01 Feb04 Feb08 Feb10 Feb12 Feb18 Feb22 Feb24 Feb26 Mar01 Mar04 Mar15 Mar18 "
           "Mar22 Mar24 Apr01 Apr05 Apr07 Apr09 Apr12 Apr15 Apr19 Apr21 Apr23 Apr26 Apr29 May03 "
           "May05 May07 May10 May13 May17 May19 May21 May27 May31 Jun02 Jun04 Jun07 Jun10 Jun14 "
           "Jun16 Jun18 Jun21 Jun24 Jun28 Jun30",
    "903": "Sep03 Sep09 Sep11 Sep14 Sep15 Sep17 Sep23 Sep28 Sep29 Oct01 Oct07 Oct09 Oct13 Oct15 "
           "Oct21 Oct26 Oct27 Oct29 Nov04 Nov06 Nov09 Nov10 Nov12 Nov18 Nov23 Nov24 Nov26 Dec02 "
           "Dec07 Dec08 Dec10 Dec16 Dec18 Jan04 Jan05 Jan07 Jan13 Jan15 Jan18 Jan19 Jan21 Jan27 "
           "Jan29 Feb01 Feb02 Feb04 Feb10 Feb12 Feb16 Feb18 Feb24 Feb26 Mar01 Mar02 Mar04 Mar15 "
           "Mar16 Mar18 Mar24 Mar30 Apr01 Apr07 Apr09 Apr12 Apr13 Apr15 Apr21 Apr23 Apr26 Apr27 "
           "Apr29 May05 May07 May10 May11 May13 May19 May21 May25 May27 Jun02 Jun04 Jun07 Jun08 "
           "Jun10 Jun16 Jun18 Jun21 Jun22 Jun24",
}

HL9_FIXTURES = {
    "901": "Sep03 Sep08 Sep17 Sep21 Sep22 Oct01 Oct05 Oct06 Oct15 Oct19 Oct20 Oct29 Nov02 Nov03 "
           "Nov12 Nov16 Nov17 Nov26 Nov30 Dec01 Dec10 Dec14 Dec15 Jan07 Jan11 Jan12 Jan21 Jan25 "
           "Jan26 Feb04 Feb08 Feb09 Feb18 Feb22 Feb23 Mar04 Mar18 Mar22 Mar23 Apr01 Apr05 Apr06 "
           "Apr15 Apr19 Apr20 Apr29 May03 May04 May13 May17 May18 May27 May31 Jun01 Jun10",
    "902": "Sep10 Sep15 Sep16 Sep24 Sep29 Oct08 Oct13 Oct14 Oct22 Oct27 Oct28 Nov05 Nov10 Nov19 "
           "Nov24 Nov25 Dec03 Dec08 Dec09 Dec17 Jan05 Jan06 Jan14 Jan19 Jan20 Jan28 Feb02 Feb03 "
           "Feb11 Feb16 Feb17 Feb25 Mar02 Mar03 Mar16 Mar17 Mar25 Mar30 Mar31 Apr08 Apr13 Apr14 "
           "Apr22 Apr27 Apr28 May06 May11 May12 May20 May25 May26 Jun03 Jun08 Jun09 Jun17",
    "903": "Sep03 Sep08 Sep17 Sep21 Sep22 Oct01 Oct05 Oct06 Oct15 Oct19 Oct20 Oct29 Nov02 Nov03 "
           "Nov12 Nov16 Nov17 Nov26 Nov30 Dec01 Dec10 Dec14 Dec15 Jan07 Jan11 Jan12 Jan21 Jan25 "
           "Jan26 Feb04 Feb08 Feb09 Feb18 Feb22 Feb23 Mar04 Mar18 Mar22 Mar23 Apr01 Apr05 Apr06 "
           "Apr15 Apr19 Apr20 Apr29 May03 May04 May13 May17 May18 May27 May31 Jun01 Jun10",
}

HL8_FIXTURES = {
    "801": "Sep04 Sep10 Sep14 Sep18 Sep24 Sep28 Oct02 Oct08 Oct16 Oct22 Oct26 Oct30 Nov05 Nov09 "
           "Nov13 Nov19 Nov23 Nov27 Dec03 Dec07 Dec11 Dec17 Jan04 Jan08 Jan14 Jan18 Jan22 Jan28 "
           "Feb01 Feb05 Feb11 Feb19 Feb25 Mar01 Mar15 Mar19 Mar25 Apr08 Apr12 Apr16 Apr22 Apr26 "
           "May06 May10 May14 May20 May28 Jun03 Jun07 Jun11",
    "802": "Sep08 Sep16 Sep22 Oct06 Oct14 Oct20 Oct28 Nov03 Nov17 Nov25 Dec01 Dec09 Dec15 Jan06 "
           "Jan12 Jan20 Jan26 Feb03 Feb09 Feb17 Feb23 Mar03 Mar17 Mar23 Mar31 Apr06 Apr14 Apr20 "
           "Apr28 May04 May12 May18 May26 Jun01 Jun09 Jun15 Jun23",
    "803": "Sep09 Sep14 Sep15 Sep23 Sep28 Sep29 Oct07 Oct13 Oct21 Oct26 Oct27 Nov04 Nov09 Nov10 "
           "Nov18 Nov23 Nov24 Dec02 Dec07 Dec08 Dec16 Jan04 Jan05 Jan13 Jan18 Jan19 Jan27 Feb01 "
           "Feb02 Feb10 Feb16 Feb24 Mar01 Mar02 Mar15 Mar16 Mar24 Mar30 Apr07 Apr12 Apr13 Apr21 "
           "Apr26 Apr27 May05 May10 May11 May19 May25 Jun02",
    "804": "Sep10 Sep11 Sep16 Sep24 Oct08 Oct09 Oct14 Oct22 Oct28 Nov05 Nov06 Nov19 Nov25 Dec03 "
           "Dec09 Dec17 Dec18 Jan06 Jan14 Jan15 Jan20 Jan28 Jan29 Feb03 Feb11 Feb12 Feb17 Feb25 "
           "Feb26 Mar03 Mar17 Mar25 Mar31 Apr08 Apr09 Apr14 Apr22 Apr23 Apr28 May06 May07 May12 "
           "May20 May21 May26 Jun03 Jun04 Jun09 Jun17 Jun18",
}

MONTHS = {"Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12, "Jan": 1, "Feb": 2,
          "Mar": 3, "Apr": 4, "May": 5, "Jun": 6}

def fixture_to_dates(blob):
    out = []
    for tok in blob.split():
        m = MONTHS[tok[:3]]
        dd = int(tok[3:])
        y = 2027 if m <= 6 else 2026  # school year: Jan-Jun = 2027, Sep-Dec = 2026
        out.append(date(y, m, dd))
    return out

def all_student_days():
    days, cur = [], FIRST_STUDENT_DAY
    while cur <= LAST_STUDENT_DAY:
        if cycle_day(cur) is not None:
            days.append(cur)
        cur += timedelta(days=1)
    return days

def meetings_for(key):
    sec = SECTIONS[key]
    out = []
    for d in all_student_days():
        cd = cycle_day(d)
        if cd in sec["slots"]:
            out.append({"d": d.isoformat(), "p": sec["slots"][cd], "c": cd})
    return out

def main():
    student_days = all_student_days()
    print(f"Student days generated: {len(student_days)} (launch plan says {EXPECTED_STUDENT_DAYS})")
    if len(student_days) != EXPECTED_STUDENT_DAYS:
        print("FATAL: student-day count mismatch - holiday list needs fixing.")
        sys.exit(1)

    # --- Verify against hand-verified class-date appendices -----------------
    # Correctness rule: every hand-verified date MUST appear in the generated
    # schedule (missing = real error: wrong slot/period/anchor). Extras are fine
    # and expected: CIT9 spare slots (901: classes 91-94, Jun 21-30), HL/HE June
    # buffer periods after the curriculum plan ends, and slots the curriculum
    # appendices predate (802-HE Wed-W2-P3 key correction; 803-HE D7-P1).
    FIXTURE_GROUPS = [
        (CIT9_FIXTURES, "-CIT"),
        (HL9_FIXTURES, "-HL"),
        (HL8_FIXTURES, "-HE"),
    ]
    failures = 0
    for fixtures, suffix in FIXTURE_GROUPS:
        for sect_num, blob in fixtures.items():
            key = f"{sect_num}{suffix}"
            expected = [d.isoformat() for d in fixture_to_dates(blob)]
            got = [m["d"] for m in meetings_for(key)]
            extras = sorted(set(got) - set(expected))
            missing = sorted(set(expected) - set(got))
            if not missing:
                note = f" (+{len(extras)} timetable-only periods)" if extras else ""
                print(f"  {key}: OK - all {len(expected)} verified dates reproduced{note}")
                continue
            failures += 1
            print(f"  {key}: MISMATCH - missing verified dates:")
            for d in missing:
                print(f"      missing: {d} (cycle day {cycle_day(_d(d))})")
            for d in extras:
                print(f"      generated-only: {d} (cycle day {cycle_day(_d(d))})")
    if failures:
        print(f"FATAL: {failures} section(s) failed fixture verification - aborting, no file written.")
        sys.exit(1)

    # --- Emit data file -----------------------------------------------------
    data = {
        "generated": date.today().isoformat(),
        "model": "weekday-anchored 10-day cycle; week of 2026-09-14 = Week 1; "
                 "holidays per LAUNCH-PLAN-2026-09-01.md section 7",
        "sections": {},
    }
    for key in SECTION_ORDER:
        sec = SECTIONS[key]
        meets = meetings_for(key)
        data["sections"][key] = {
            "label": sec["label"],
            "section": sec["section"],
            "course": sec["course"],
            "grade": sec["grade"],
            "room": sec["room"],
            "slots": {str(k): v for k, v in sorted(sec["slots"].items())},
            "meetings": meets,
        }

    js = (
        "// class_log_meetings_data.js - AUTO-GENERATED by tools/build_class_log_meetings.py\n"
        f"// Generated {data['generated']}. {data['model']}.\n"
        "// Regenerate: python tools/build_class_log_meetings.py (edit NO_CLASS_DAYS there first).\n"
        "// Verified against all 270 hand-checked CIT9 calendar dates before emission.\n"
        "window.CLASS_LOG_MEETINGS = " + json.dumps(data, indent=1) + ";\n"
    )
    out_path = __file__.rsplit("\\tools", 1)[0] + "/Student_System/class_log_meetings_data.js"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(js)
    counts = ", ".join(f"{k}={len(data['sections'][k]['meetings'])}" for k in SECTION_ORDER)
    print(f"Wrote {out_path}")
    print(f"Meeting counts per cycle: {counts}")

if __name__ == "__main__":
    main()
