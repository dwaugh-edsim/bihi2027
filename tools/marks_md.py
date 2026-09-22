"""Build + sync the HL9 Sleep Clinic marks markdown (Class 901).

The .md file is the human-in-the-loop source of truth: one block per student
with an editable **Band** (4 Stellar / 3 Satisfactory / 2 Needs work) and an
editable **Comment** paragraph. Everything under **Evidence** is machine
generated and is never shown to students.

  python tools/marks_md.py            # build/refresh the .md (PRESERVES your edits)
  python tools/marks_md.py --sync     # .md -> Student_System/hl9_sleep_feedback.js
  python tools/marks_md.py --sync --push   # ...and write to the GAS Feedback sheet
                                          #    (needs --pin=YOUR_CLASS_LOG_PIN)

Build never overwrites an existing Band or Comment: it only refreshes the
Evidence line and fills in blocks that are missing. Delete a Comment to have
the machine re-draft it.
"""

import json
import os
import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUBS_PATH = os.path.join(ROOT, "scratch", "901_sleep_submissions.json")
MD_PATH = os.path.join(ROOT, "HealthyLiving9", "Unit 1 - Sleep", "HL9_SleepClinic_901_Marks.md")
JS_PATH = os.path.join(ROOT, "Student_System", "hl9_sleep_feedback.js")

TASK = "HL9 Sleep Clinic 10-Station Audit"
SECTION = "901"
GAS = ("https://script.google.com/macros/s/"
       "AKfycby8XaHRRj07UUQ-4NTK7AH4s2qVp3GKe6XRyMA_tGLap52ZUWYg2faJbVhIB7Ea7_VJ/exec")

BAND_NAME = {4: "Stellar", 3: "Satisfactory", 2: "Needs work"}

# Only mark SUBMITTED work. Students are still filling these in — a partial
# sheet is in progress, not missing, and gets no mark until all 10 rows are in.
MIN_STATIONS = 10

sys.path.insert(0, os.path.join(ROOT, "tools"))
from mark_sleep_clinic import (  # noqa: E402
    KEY, STATION_LABELS, RISK_WORD, num, match_risk, found_codes,
    score_accuracy, score_story, flag_swaps, pick_band, fmt,
)

SHORT = {sid: st.split(" - ")[0] for sid, st in STATION_LABELS.items()}
TRAP_NAME = {
    "1": "Devon's catch-up myth", "2": "Priya (the healthy control)", "3": "Marcus's broken clock",
    "4": "Jenna's in-bed vs asleep", "5": "Isaiah's athlete load", "6": "Lily's 5:45 bus",
    "7": "Tyrell's caffeine loop", "8": "Grace's rumination", "9": "Owen's weekend",
    "10": "Amara's family obligation",
}


def evaluate(sub):
    stations = sub.get("stations") or {}
    accs, storys, detail = [], [], {}
    for sid in [str(i) for i in range(1, 11)]:
        st = stations.get(sid) or {}
        touched = any(str(st.get(f, "")).strip() for f in ("hrs", "debt", "risk", "order", "notes"))
        if not touched:
            detail[sid] = None
            continue
        a, aev = score_accuracy(sid, st)
        s, sev = score_story(sid, st)
        accs.append(a)
        storys.append(s)
        detail[sid] = dict(acc=a, story=s, aev=aev, sev=sev, given=st, key=KEY[sid])
    done = len(accs)
    acc = (sum(accs) / done) if done else 0.0
    story = (sum(storys) / done) if done else 0.0
    band, why = pick_band(acc, story, done)
    return dict(detail=detail, done=done, acc=acc, story=story, band=band,
                why=why, flags=flag_swaps(sub))


def draft_comment(sub, ev):
    """Compose a 2-4 sentence teacher-voice comment from the machine evidence."""
    name = (sub.get("name") or "This student").split()[0]
    det, done = ev["detail"], ev["done"]

    if done == 0:
        return (f"{name} has not submitted any stations yet, so there is nothing to mark. "
                f"Get at least 6 of the 10 clinic files onto the response sheet and I will "
                f"re-mark it straight away.")

    strong, weak, trap_ok, trap_bad = [], [], [], []
    for sid, d in det.items():
        if not d:
            continue
        order = str((d["given"] or {}).get("order", "") or "").lower()
        k = d["key"]
        if d["acc"] >= 0.9 and d["story"] >= 0.55:
            strong.append(sid)
        if d["acc"] < 0.6:
            weak.append((sid, d))
        bad = [w for w in k["bad"] if order and w in order]
        good = [w for w in k["good"] if order and w in order]
        if bad:
            trap_bad.append((sid, bad))
        elif good and sid in ("2", "6", "8", "10"):
            trap_ok.append(sid)

    parts = []

    # 1. the maths
    acc = ev["acc"]
    if acc >= 0.85:
        parts.append(f"Good telemetry — figures and risk levels land on the key {acc * 100:.0f}% of the time.")
    elif acc >= 0.6:
        parts.append(f"The figures are close but not clean ({acc * 100:.0f}% against the key). "
                     f"Weekly debt is (9 − hours) × 5, so recompute any row that drifted.")
    else:
        parts.append(f"The maths is the weak spot ({acc * 100:.0f}% against the key). "
                     f"Weekly debt is (9 − hours) × 5 school nights — that formula is most of what went wrong.")

    # 2. the story
    if trap_ok:
        names = ", ".join(TRAP_NAME[s] for s in trap_ok)
        parts.append(f"The case reading is the good part — {names} came through correctly, "
                     f"which is exactly what the clinic was testing.")
    elif strong:
        names = ", ".join(TRAP_NAME[s] for s in strong[:3])
        parts.append(f"Solid on {names}.")
    elif ev["story"] >= 0.55:
        parts.append("The cases were read, though a few orders stay generic instead of naming "
                     "the actual cause in the file.")
    else:
        parts.append("The orders read generically — each file names one specific root cause "
                     "(the feed, the clock, the brain or the family) and the fix has to answer that one.")

    # 3. concrete fixes
    if trap_bad:
        sids = ", ".join(f"{SHORT[s]} ({', '.join(b)})" for s, b in trap_bad[:2])
        parts.append(f"Watch {sids} — that walks into the trap the file is built around.")
    if weak:
        sids = " and ".join(SHORT[s] for s, _ in weak[:2])
        parts.append(f"Recheck {sids} against the key.")
    if ev["flags"]:
        parts.append("Also look at the 09/10 rows — Amara's figures appear on Owen's line.")
    if done < 8:
        parts.append(f"Coverage note: {done}/10 is short of the 6–8 the clinic floor asked for.")

    return " ".join(parts)


# ---------------------------------------------------------------------------
# build
# ---------------------------------------------------------------------------
HEADER = """# HL9 — Sleep Clinic 10-Station Audit · Class 901 Marks

Outcome 1 · Room 8 · Mr. Waugh

**How to use this file**

1. Edit the **Band** line per student — `4` Stellar · `3` Satisfactory · `2` Needs work.
2. Rewrite the **Comment** paragraph (this is what the student will read).
3. Run `python tools/marks_md.py --sync` to publish it to the assignment's feedback field.
   Add `--push --pin=YOUR_PIN` to also write it to the Google Sheet.

Notes

- **Only fully complete submissions (10/10 stations) are in this file.** Students still filling in their sheet are not marked and are deliberately left out — re-run the build once they finish.
- The machine drafts the Band and the Comment. Both are yours to change — they are only a starting point.
- The **Evidence** line is machine-generated and never shown to students. Delete a whole block to have it re-drafted.
- `Accuracy` = criterion 1, your figures vs the answer key. `Story` = criterion 2, whether the order answers the case file's real cause.

---
"""


def build():
    with open(SUBS_PATH, encoding="utf-8") as f:
        subs = json.load(f)

    existing = {}
    if os.path.exists(MD_PATH):
        existing = parse_md(open(MD_PATH, encoding="utf-8").read())

    out = [HEADER]
    drafts_js = {}
    order = sorted(subs, key=lambda s: (str(s.get("name") or "")))

    skipped = []
    for sub in order:
        pin = str(sub.get("pin") or "").strip().upper()
        if not pin:
            continue
        name = str(sub.get("name") or "").strip()
        ev = evaluate(sub)
        if ev["done"] < MIN_STATIONS:
            skipped.append((name or pin, ev["done"]))
            continue
        prev = existing.get(pin, {})

        band = prev.get("band") or ev["band"]
        comment = prev.get("comment") or draft_comment(sub, ev)

        flag_txt = ", ".join(ev["flags"]) if ev["flags"] else "—"
        out.append(f"\n## {pin} · {name}\n\n")
        out.append(f"**Band:** {band}\n\n")
        out.append(f"**Evidence:** accuracy {ev['acc'] * 100:.0f}% · story {ev['story'] * 100:.0f}% · "
                   f"{ev['done']}/10 stations · flagged: {flag_txt}\n\n")
        out.append("**Comment:**\n")
        out.append(comment + "\n")

        drafts_js[pin] = {
            "name": name,
            "band": int(band),
            "bandName": BAND_NAME.get(int(band), ""),
            "accuracy": round(ev["acc"] * 100),
            "story": round(ev["story"] * 100),
            "stationsDone": ev["done"],
            "comment": comment,
        }

    with open(MD_PATH, "w", encoding="utf-8") as f:
        f.write("".join(out))

    kept = sum(1 for p in existing if p in drafts_js and existing[p].get("comment"))
    print("MARKS  ->", MD_PATH, f"({len(drafts_js)} complete submissions, {kept} teacher comments kept)")
    if skipped:
        print("In progress - NOT marked (leave them to finish):")
        for nm, n in sorted(skipped, key=lambda x: -x[1]):
            print(f"   {nm:<16} {n}/10")
    return drafts_js


# ---------------------------------------------------------------------------
# parse the (possibly teacher-edited) markdown back
# ---------------------------------------------------------------------------
def parse_md(text):
    out = {}
    chunks = re.split(r"^##\s+(\S+)\s+·\s+(.+?)\s*$", text, flags=re.M)
    it = range(1, len(chunks) - 2, 3)
    for i in it:
        pin = chunks[i].strip().upper()
        name = chunks[i + 1].strip()
        body = chunks[i + 2]
        m = re.search(r"\*\*Band:\s*\**\s*(\d)", body)
        band = int(m.group(1)) if m else None
        m = re.search(r"\*\*Comment:\s*\**\s*\n+(.+?)(?=\n##\s|\Z)", body, flags=re.S)
        comment = m.group(1).strip() if m else ""
        out[pin] = dict(name=name, band=band, comment=comment)
    return out


# ---------------------------------------------------------------------------
# sync
# ---------------------------------------------------------------------------
def sync(push=False, pin_code=""):
    if not os.path.exists(MD_PATH):
        print("No marks file at", MD_PATH, "- run without --sync first.")
        return
    rows = parse_md(open(MD_PATH, encoding="utf-8").read())
    if not rows:
        print("No student blocks found in", MD_PATH)
        return

    for r in rows.values():
        try:
            r["band"] = int(r.get("band") or 0)
        except (TypeError, ValueError):
            r["band"] = 0
        r["bandName"] = BAND_NAME.get(r["band"], "")

    js = (
        "// hl9_sleep_feedback.js - GENERATED by tools/marks_md.py --sync\n"
        "// Source of truth: HealthyLiving9/Unit 1 - Sleep/HL9_SleepClinic_901_Marks.md\n"
        "// Edit the .md, re-run the sync. This file feeds the 'Teacher feedback'\n"
        "// field on HL9_Class1_10_Station_Audit_Template.html.\n"
        "// Band: 4 Stellar | 3 Satisfactory | 2 Needs work\n\n"
        "window.HL9_SLEEP_FEEDBACK = "
        + json.dumps(rows, ensure_ascii=False, indent=1, sort_keys=True)
        + ";\n"
    )
    with open(JS_PATH, "w", encoding="utf-8") as f:
        f.write(js)
    print("FEEDBACK JS ->", JS_PATH, f"({len(rows)} students)")

    bands = {4: 0, 3: 0, 2: 0}
    for r in rows.values():
        bands[r.get("band") or 0] = bands.get(r.get("band") or 0, 0) + 1
    print(f"  spread:  4 Stellar {bands.get(4, 0)}   3 Satisfactory {bands.get(3, 0)}   "
          f"2 Needs work {bands.get(2, 0)}   ungraded {bands.get(0, 0)}")

    if not push:
        print("  (skipped GAS push - add --push --pin=YOUR_PIN to write the Feedback sheet)")
        return

    print("  pushing to the GAS Feedback sheet...")
    ok = 0
    for pin, r in sorted(rows.items()):
        band = int(r.get("band") or 0)
        payload = {
            "action": "save_feedback",
            "pin": pin,
            "name": r.get("name") or "",
            "section": SECTION,
            "task": TASK,
            "status": "approved",
            "teacherPin": pin_code,
            "feedback": {
                "band": band,
                "bandName": BAND_NAME.get(band, ""),
                "overall": r.get("comment") or "",
                "questions": {},
            },
        }
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(GAS, data=body, method="POST",
                                     headers={"Content-Type": "text/plain;charset=utf-8"})
        try:
            res = json.loads(urllib.request.urlopen(req, timeout=60).read().decode("utf-8"))
            if res.get("status") in ("feedback_saved", "submitted_no_cors", "success"):
                ok += 1
            else:
                print("   ", pin, "->", res.get("status"), res.get("message", ""))
        except Exception as e:
            print("   ", pin, "-> ERROR", type(e).__name__, e)
    print(f"  pushed {ok}/{len(rows)} to the Feedback sheet.")


def main():
    args = sys.argv[1:]
    if "--sync" in args:
        push = "--push" in args
        pin_code = ""
        for a in args:
            if a.startswith("--pin="):
                pin_code = a.split("=", 1)[1]
        if push and not pin_code:
            print("--push needs --pin=YOUR_CLASS_LOG_PIN")
            return
        sync(push=push, pin_code=pin_code)
    else:
        build()
        print("Next: edit the Band / Comment lines, then run  python tools/marks_md.py --sync")


if __name__ == "__main__":
    main()
