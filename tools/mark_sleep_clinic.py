"""Semi-automated marker for HL9 Sleep Clinic 10-Station Audit (Class 901).

PHASE 1 (this script) — machine pre-mark against the official answer key
  HealthyLiving9/HL9_Class1_Teacher_Facilitation_and_Answer_Key.md section 4.
  Emits Student_System/hl9_sleep_feedback_drafts.js: one editable draft per
  student, with a written justification for every audited station.

PHASE 2 (human) — Student_System/HL9_Sleep_Clinic_Feedback.html
  Review each draft, edit any line, set the band, then Save / Approve to the
  GAS Feedback sheet. Nothing reaches a student until you Approve.

The two marking criteria the teacher asked for are scored SEPARATELY:
  acc   — are the numbers / risk verdicts right vs the key? (criterion 1)
  story — did they read the case file and catch the real root cause? (criterion 2)

Band: 4 Stellar · 3 Satisfactory · 2 Needs work.

Usage:  python tools/mark_sleep_clinic.py
"""

import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUBS_PATH = os.path.join(ROOT, "scratch", "901_sleep_submissions.json")
OUT_PATH = os.path.join(ROOT, "Student_System", "hl9_sleep_feedback_drafts.js")

RISK_WORD = {"G": "STABLE (GREEN)", "M": "MODERATE (AMBER)", "R": "CRITICAL (RED)"}

# ---------------------------------------------------------------------------
# Official answer key — answer key S4.  hrs/debt are the KEY's weekly figures.
# accept_hrs / accept_debt widen the "correct" window where the case file
# legitimately supports more than one reading (flagged for the human).
# ---------------------------------------------------------------------------
KEY = {
    "1": dict(subject="C., Devon", hrs=6.0, debt=15.0, risk="R",
              codes=["DEBT", "SJ"],
              trap="Catch-up sleep does not erase debt, and his 10:30 AM weekend wakes re-shift the clock.",
              good=["debt", "weekend", "clock", "wake", "consistent", "anchor", "bed", "schedule", "routine", "sleep", "earlier", "catch"],
              bad=["fine", "nothing", "no change", "no problem", "healthy"],
              story_need="must reject the 'weekends fix it' myth and name BOTH debt and the clock shift"),
    "2": dict(subject="S., Priya", hrs=9.0, debt=0.0, risk="G",
              codes=[],
              trap="She is HEALTHY. Correct order = maintain and protect. Inventing a problem IS the error.",
              good=["maintain", "protect", "keep", "continue", "same", "nothing", "healthy", "good", "fine", "no change", "no problem", "already"],
              bad=["stop", "quit", "less", "reduce", "cut", "fix", "problem", "should", "need"],
              story_need="must recognise she is the healthy control and NOT invent a treatment"),
    "3": dict(subject="O., Marcus", hrs=8.0, debt=5.0, risk="M",
              codes=["SJ", "INERTIA"],
              trap="Hours are FINE — the clock is broken (+4.25 h). His Monday is biologically 3:00 AM.",
              good=["weekend", "wake", "clock", "shift", "schedule", "consistent", "jetlag", "anchor", "same", "monday", "earlier"],
              bad=["debt", "sleep more", "more sleep", "phone"],
              story_need="must see the problem is the clock, not the hours"),
    "4": dict(subject="R., Jenna", hrs=6.0, debt=15.0, risk="R",
              codes=["MEL", "STIM", "DEBT"],
              trap="Time-in-bed is NOT time-asleep (TIB != TST). 9 h in bed, ~6 h asleep. She audits the wrong variable.",
              good=["phone", "screen", "blue", "light", "bed", "stim", "melatonin", "scroll", "asleep", "effective", "actually", "wake"],
              bad=[],
              story_need="must separate time-in-bed from time-asleep"),
    "5": dict(subject="T., Isaiah", hrs=6.0, debt=15.0, risk="R",
              codes=["SWS", "RT300", "DEBT"],
              trap="Athletes need the TOP of the range (9-10 h) for HGH / muscle repair. Reaction penalty is severe.",
              good=["sleep", "earlier", "more", "hour", "athlete", "training", "recover", "hgh", "muscle", "growth", "bed"],
              bad=[],
              story_need="must connect training load to needing MORE sleep, not normal sleep"),
    "6": dict(subject="N., Lily", hrs=6.5, debt=12.5, risk="R",
              codes=["CPD", "INERTIA", "DEBT"],
              trap="REFLEX-BREAKER. Her hygiene is already clean — 'get off your phone' is malpractice. Cause is structural (5:45 bus).",
              good=["nap", "weekend", "wake", "anchor", "earlier", "bus", "alarm", "schedule", "bedtime", "wind", "routine", "counsellor", "counselor", "adult"],
              bad=["phone", "screen", "tiktok", "scroll", "video game", "gaming", "xbox", "playstation", "social media"],
              story_need="must NOT prescribe a phone rule — the bus route is the cause"),
    "7": dict(subject="K., Tyrell", hrs=6.0, debt=15.0, risk="R",
              codes=["DEBT", "HYG", "INERTIA"],
              trap="The caffeine loop. The order must break the loop at a NAMED HOUR (no caffeine after noon), not 'drink less'.",
              good=["caffeine", "coffee", "energy", "drink", "noon", "afternoon", "am", "pm", "hour", "water", "cut"],
              bad=[],
              story_need="must name caffeine and a cutoff time"),
    "8": dict(subject="W., Grace", hrs=7.5, debt=7.5, risk="M",
              codes=["5D", "DEBT"],
              trap="Second honesty check. ZERO hygiene violations. Rumination is the driver — orders = wind-down / talk to someone, NOT more rules.",
              good=["rumination", "wind", "talk", "counsellor", "counselor", "parent", "adult", "calm", "journal", "breathe", "breathing", "anxiety", "stress", "worry", "thought", "relax"],
              bad=["phone", "screen", "tiktok", "scroll", "video game", "gaming", "caffeine"],
              story_need="must treat the anxiety/rumination, not add device rules"),
    "9": dict(subject="D., Owen", hrs=8.0, debt=5.0, risk="M",
              codes=["SJ", "REM", "DEBT"],
              trap="Biggest shift in the clinic (+5.5 h). Order must KEEP his weekend — midnight cutoff + consistent 10:30 AM weekend wake.",
              good=["weekend", "wake", "cutoff", "consistent", "clock", "shift", "schedule", "midnight", "gaming", "game", "anchor", "same"],
              bad=[],
              story_need="must keep the weekend and fix the Sunday-night onset"),
    "10": dict(subject="P., Amara", hrs=7.2, debt=9.0, risk="M",
               codes=["DEBT", "5D", "RT300"],
               trap="EQUITY case. Family obligation, not a choice. Lowest screen time in the clinic — phone orders are irrelevant and insulting.",
               good=["nap", "homework", "restaurant", "shift", "swap", "sunday", "protect", "family", "job", "work", "before", "schedule", "rest"],
               bad=["phone", "screen", "tiktok", "scroll", "video game", "gaming", "quit", "leave", "drop", "fire"],
               story_need="must recognise this is an obligation, not a habit, and never blame a phone"),
}

STATION_LABELS = {
    "1": "01 Devon - debt & catch-up myth",
    "2": "02 Priya - healthy baseline",
    "3": "03 Marcus - weekend freefall",
    "4": "04 Jenna - in-bed vs asleep",
    "5": "05 Isaiah - athlete / HGH",
    "6": "06 Lily - 5:45 commuter",
    "7": "07 Tyrell - caffeine loop",
    "8": "08 Grace - 4 AM rumination",
    "9": "09 Owen - Fri/Sat gamer",
    "10": "10 Amara - family obligation",
}

RISK_WORDS = {
    "G": ["stable", "green"],
    "M": ["moderate", "amber", "yellow"],
    "R": ["critical", "red"],
}

CODE_WORDS = {
    "DEBT": ["debt", "deficit", "cumulative", "behind", "catch up", "catch-up", "short"],
    "SJ": ["social jetlag", "jetlag", "jet lag", "weekend shift", "circadian", "shift", "clock"],
    "INERTIA": ["inertia", "groggy", "grogginess", "monday", "fog", "slow to wake"],
    "MEL": ["melatonin", "blue light", "blue-light"],
    "STIM": ["stim", "stimulus", "wind down", "wind-down", "power down", "before bed"],
    "SWS": ["sws", "slow-wave", "deep sleep", "hgh", "growth hormone", "muscle", "repair"],
    "REM": ["rem", "memory", "consolidation", "emotional processing", "dream"],
    "RT300": ["reaction", "300", "microsleep", "attention lapse", "reflex", "reflexes"],
    "CPD": ["cpd", "circadian phase", "phase delay", "teen brain", "biological"],
    "5D": ["5d", "dimension", "emotional", "social", "mental", "irritab"],
    "HYG": ["hygiene", "caffeine", "coffee", "energy drink", "routine", "environment"],
    "TIB": ["in bed", "time-in-bed", "time in bed", "asleep", "effective", "tib"],
}


# ---------------------------------------------------------------------------
# number parsing — students write '5:45', '5.45', '5 hours 30 mins',
# '5hrs 45mins', '6-8 hours', '5. 1/2 hours', '1:15-6:45', 'none'
# ---------------------------------------------------------------------------
def num(v):
    if v is None:
        return None
    s = str(v).strip().lower()
    if not s or s in ("none", "n/a", "na", "-", "no", "no debt", "zero", "0 debt"):
        return 0.0 if s.startswith("no") or s == "zero" else None

    # 'X hours Y mins' / 'Xh Ym' / 'X hrs Y minutes' / 'X and Y mins'
    m = re.search(r"(\d+)\s*(?:hours?|hrs?|h)?\s*(?:and\s*)?(\d+)\s*(?:minutes?|mins?|m)\b", s)
    if m:
        return float(m.group(1)) + float(m.group(2)) / 60.0

    # 'X 1/2 hours' / 'X. 1/2'
    m = re.search(r"(\d+)\s*\.\s*1/2", s)
    if m:
        return float(m.group(1)) + 0.5

    # clock 'H:MM'  (5:45 -> 5.75) — before the decimal branch
    m = re.search(r"\b(\d{1,2}):([0-5]\d)\b", s)
    if m:
        return float(m.group(1)) + float(m.group(2)) / 60.0

    # bare decimal that is really h.MM minutes ('5.45' -> 5h45m, '7.30' -> 7h30m)
    m = re.match(r"^(\d{1,2})\.([0-5]\d)\b", s)
    if m:
        return float(m.group(1)) + float(m.group(2)) / 60.0

    # range '6-8 hours' -> midpoint
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)", s)
    if m:
        return (float(m.group(1)) + float(m.group(2))) / 2.0

    m = re.match(r"(\d+(?:\.\d+)?)", s)
    return float(m.group(1)) if m else None


def match_risk(text):
    t = (text or "").strip().lower()
    if not t:
        return None
    for code in ("G", "M", "R"):
        for w in RISK_WORDS[code]:
            if w in t:
                return code
    return None


def found_codes(text):
    t = (text or "").lower()
    hits = set()
    for code, words in CODE_WORDS.items():
        for w in words:
            if w in t:
                hits.add(code)
                break
    return hits


def fmt(x):
    return "-" if x is None else f"{x:g}"


# ---------------------------------------------------------------------------
# criterion 1: accuracy vs the key
# ---------------------------------------------------------------------------
def score_accuracy(sid, st):
    k = KEY[sid]
    ev = []
    earned = 0.0
    total = 3.0

    hrs = num(st.get("hrs"))
    if hrs is None:
        ev.append(f"  hrs    blank        | key {fmt(k['hrs'])} h")
    else:
        d = abs(hrs - k["hrs"])
        if d <= 0.5:
            earned += 1.0
            ev.append(f"  hrs    {fmt(hrs):<10} | key {fmt(k['hrs'])} h   RIGHT")
        elif d <= 1.25:
            earned += 0.5
            ev.append(f"  hrs    {fmt(hrs):<10} | key {fmt(k['hrs'])} h   close ({hrs - k['hrs']:+g})")
        else:
            ev.append(f"  hrs    {fmt(hrs):<10} | key {fmt(k['hrs'])} h   WRONG ({hrs - k['hrs']:+g})")

    debt = num(st.get("debt"))
    if debt is None:
        ev.append(f"  debt   blank        | key {fmt(k['debt'])} h/wk")
    else:
        d = abs(debt - k["debt"])
        if d <= 2.0:
            earned += 1.0
            ev.append(f"  debt   {fmt(debt):<10} | key {fmt(k['debt'])} h/wk  RIGHT")
        elif d <= 5.0:
            earned += 0.5
            ev.append(f"  debt   {fmt(debt):<10} | key {fmt(k['debt'])} h/wk  close ({debt - k['debt']:+g}) - check daily debt x 5")
        else:
            ratio = (debt / k["debt"]) if k["debt"] else None
            hint = f" (looks like ~{ratio:g}x the key)" if ratio and 0.2 < ratio < 20 else ""
            ev.append(f"  debt   {fmt(debt):<10} | key {fmt(k['debt'])} h/wk  WRONG ({debt - k['debt']:+g}){hint} - daily debt x 5")

    got = match_risk(st.get("risk"))
    if got is None:
        ev.append(f"  risk   blank        | key {RISK_WORD[k['risk']]}")
    elif got == k["risk"]:
        earned += 1.0
        ev.append(f"  risk   {RISK_WORD[got]:<12} | RIGHT")
    else:
        ev.append(f"  risk   {RISK_WORD[got]:<12} | key {RISK_WORD[k['risk']]}   WRONG")

    return earned / total, ev


# ---------------------------------------------------------------------------
# criterion 2: story comprehension (codes + order + notes + trap respect)
# ---------------------------------------------------------------------------
def score_story(sid, st):
    k = KEY[sid]
    ev = []
    earned = 0.0
    total = 0.0

    blob = " ".join(str(st.get(f, "")) for f in ("tags", "notes", "order"))
    if isinstance(st.get("tags"), list):
        blob = " ".join(str(x) for x in st.get("tags")) + " " + blob
    got = found_codes(blob)
    want = set(k["codes"])

    total += 1.0
    if not want:
        if got - {"TIB", "HYG"}:
            ev.append(f"  codes   invented {sorted(got)} - she has NO mechanism (this is the honesty trap)")
        else:
            earned += 1.0
            ev.append("  codes   none - RIGHT (honest: the control patient has no mechanism)")
    elif not got:
        ev.append(f"  codes   none tagged | expected {sorted(want)}")
    else:
        overlap = got & want
        frac = len(overlap) / len(want)
        earned += frac
        extra = got - want - {"TIB", "HYG"}
        note = f"  codes   {sorted(overlap) or 'none'} of {sorted(want)}"
        if frac >= 0.5:
            note += "  GOOD"
        if extra:
            note += f"  (extra {sorted(extra)})"
        ev.append(note)

    total += 1.5
    order = str(st.get("order", "") or "").strip().lower()
    if not order:
        ev.append(f"  order   blank - case needs: {k['story_need']}")
    else:
        hit_good = [w for w in k["good"] if w in order]
        hit_bad = [w for w in k["bad"] if w in order]
        if hit_bad:
            ev.append(f"  order   WALKS INTO THE TRAP on {hit_bad} - {k['trap']}")
        elif hit_good:
            earned += 1.5
            ev.append(f"  order   reads the case ({', '.join(hit_good[:3])}) - {k['story_need']}")
        else:
            earned += 0.6
            ev.append(f"  order   generic - case needs: {k['story_need']}")

    total += 0.5
    notes = str(st.get("notes", "") or "").strip()
    if len(notes) >= 20:
        earned += 0.5
        ev.append(f"  notes   {len(notes)} chars - cites evidence")
    elif len(notes) >= 8:
        earned += 0.25
        ev.append(f"  notes   thin ({len(notes)} chars)")
    else:
        ev.append("  notes   blank/thin")

    return earned / total if total else 0.0, ev


def flag_swaps(sub):
    """Detect the 09/10 row shift: Amara's key numbers landing on Owen's row."""
    st = sub.get("stations") or {}
    s9 = st.get("9") or {}
    s10 = st.get("10") or {}
    h9, d9 = num(s9.get("hrs")), num(s9.get("debt"))
    flags = []
    if h9 is not None and d9 is not None and abs(h9 - 7.2) <= 0.35 and abs(d9 - 9.0) <= 1.5:
        flags.append("Row 09 carries AMARA's key figures (7.2 h / 9 h) - Owen is 8.0 h / 5 h. Check for a 09/10 row shift.")
    h10 = num(s10.get("hrs"))
    if h10 is not None and abs(h10 - 7.2) <= 0.35:
        d10 = num(s10.get("debt"))
        if d10 is not None and abs(d10 - 9.0) > 1.5:
            flags.append("Row 10 has Amara's hours but not her debt - recheck the calculation.")
    return flags


BAND_NAME = {4: "Stellar", 3: "Satisfactory", 2: "Needs work"}

# Only mark fully complete submissions. Students are still working — a partial
# sheet is in progress, not missing, so it gets no draft until all 10 rows land.
MIN_STATIONS = 10


def pick_band(acc, story, done):
    """4 Stellar / 3 Satisfactory / 2 Needs work.

    Stellar needs the maths AND the case read: either accuracy is clearly right
    (>=85%), or it is very good (>=80%) AND the story read is strong (>=65%).
    Either way Stellar needs >=55% on the story and >=8 stations covered.
    """
    if done == 0:
        return 2, "no stations submitted"
    if done >= 8 and story >= 0.55 and (acc >= 0.85 or (acc >= 0.80 and story >= 0.65)):
        return 4, "figures right and the cases read for their real cause"
    if acc >= 0.55 and story >= 0.35:
        return 3, "maths mostly there, some orders read generically"
    return 2, "key figures or the case cause still off - see rows below"


def build_draft(sub):
    stations = sub.get("stations") or {}
    questions = {}
    accs, storys = [], []

    for sid in [str(i) for i in range(1, 11)]:
        st = stations.get(sid) or {}
        touched = any(str(st.get(f, "")).strip() for f in ("hrs", "debt", "risk", "order", "notes"))
        label = STATION_LABELS[sid]
        if not touched:
            questions[label] = {
                "text": "NOT AUDITED - station skipped (the clinic asked for 6-8 of 10).",
                "status": "seed",
            }
            continue

        k = KEY[sid]
        a, aev = score_accuracy(sid, st)
        s, sev = score_story(sid, st)
        accs.append(a)
        storys.append(s)

        head = (f"{k['subject']}   [key: {fmt(k['hrs'])} h/wknight, {fmt(k['debt'])} h/wk debt, "
                f"{RISK_WORD[k['risk']]}, codes {k['codes'] or 'none'}]")
        body = "CRITERION 1 - accuracy vs key\n" + "\n".join(aev)
        body += "\nCRITERION 2 - understanding of the case\n" + "\n".join(sev)
        body += f"\n  case    {k['trap']}"
        questions[label] = {"text": f"{head}\n{body}", "status": "seed"}

    done = len(accs)
    acc = (sum(accs) / done) if done else 0.0
    story = (sum(storys) / done) if done else 0.0
    band, why = pick_band(acc, story, done)
    flags = flag_swaps(sub)

    if done == 0:
        overall = (
            f"BAND:{band}|{BAND_NAME[band]}\n"
            "Nothing submitted - no stations to mark yet.\n"
            "Open the clinic response sheet and audit at least 6 patients."
        )
    else:
        lines = [
            f"BAND:{band}|{BAND_NAME[band]}",
            f"{done}/10 stations audited.",
            f"Criterion 1 - accuracy vs the key: {acc * 100:.0f}%.",
            f"Criterion 2 - understanding of the story: {story * 100:.0f}%.",
            f"Why this band: {why}.",
        ]
        if flags:
            lines.append("CHECK: " + " ".join(flags))
        if done < 8:
            lines.append(f"Coverage note: {done}/10 is below the 6-8 the clinic floor asked for.")
        lines.append(
            "Per-station justification is above - each line puts your number beside the key. "
            "Re-try the rows marked WRONG or TRAP before Quiz 1."
        )
        overall = "\n".join(lines)

    return {
        "band": band,
        "bandName": BAND_NAME[band],
        "acc": round(acc * 100),
        "story": round(story * 100),
        "stationsDone": done,
        "flags": flags,
        "overall": overall,
        "questions": questions,
        "status": "seed",
    }


def main():
    with open(SUBS_PATH, encoding="utf-8") as f:
        subs = json.load(f)

    drafts = {}
    summary = []
    for sub in subs:
        pin = str(sub.get("pin") or "").strip().upper()
        if not pin:
            continue
        d = build_draft(sub)
        if d["stationsDone"] < MIN_STATIONS:
            continue
        drafts[pin] = d
        summary.append(dict(
            pin=pin, name=sub.get("name"), partner=sub.get("partner"),
            band=d["band"], bandName=d["bandName"], acc=d["acc"], story=d["story"],
            done=d["stationsDone"], flags=len(d["flags"]),
            updated=str(sub.get("updated") or "")[:16].replace("T", " "),
        ))

    js = (
        "// hl9_sleep_feedback_drafts.js - AUTO-DRAFTED by tools/mark_sleep_clinic.py\n"
        "// Phase 1 of the human-in-the-loop marking pass. Scored against\n"
        "//   HealthyLiving9/HL9_Class1_Teacher_Facilitation_and_Answer_Key.md S4\n"
        "//\n"
        "// Phase 2: open HL9_Sleep_Clinic_Feedback.html -> edit any line -> set the\n"
        "// band (4 Stellar / 3 Satisfactory / 2 Needs work) -> Save / Approve.\n"
        "// Nothing reaches a student until you Approve. Re-run the marker any time.\n"
        "//\n"
        "// acc   = criterion 1, accuracy vs the key (%)\n"
        "// story = criterion 2, understanding of the case file (%)\n\n"
        "window.HL9_SLEEP_FEEDBACK_DRAFTS = "
        + json.dumps(drafts, ensure_ascii=False, indent=1)
        + ";\n"
    )
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(js)

    print("DRAFTS ->", OUT_PATH, f"({len(drafts)} students)")
    print()
    hdr = f"{'PIN':<6}{'BAND':<16}{'acc':<6}{'story':<7}{'done':<7}{'flag':<6}{'name':<15}{'partner':<16}{'updated':<17}"
    print(hdr)
    print("-" * len(hdr))
    for s in sorted(summary, key=lambda x: (-x["band"], -x["acc"])):
        print(f"{s['pin']:<6}{str(s['band']) + ' ' + s['bandName']:<16}{str(s['acc']) + '%':<6}"
              f"{str(s['story']) + '%':<7}{str(s['done']) + '/10':<7}{s['flags'] or '':<6}"
              f"{str(s['name'] or '')[:14]:<15}{str(s['partner'] or '-')[:15]:<16}{str(s['updated'] or ''):<17}")

    counts = {4: 0, 3: 0, 2: 0}
    for s in summary:
        counts[s["band"]] += 1
    print()
    print(f"Draft spread:   4 Stellar {counts[4]}   3 Satisfactory {counts[3]}   2 Needs work {counts[2]}")
    flagged = [s for s in summary if s["flags"]]
    if flagged:
        print("Row-shift flags:", ", ".join(s["pin"] for s in flagged))
    print("Next: open Student_System/HL9_Sleep_Clinic_Feedback.html and review each draft.")


if __name__ == "__main__":
    main()
