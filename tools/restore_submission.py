"""Restore a wiped HL9 Sleep Clinic 10-Station Audit submission.

The assignment engine blindly upserts on (pin + taskName), so a student who
reopens the form on a fresh Chromebook can auto-save an empty form straight
over finished work. Submissions_Log keeps the payload, and scratch/ holds the
morning pull. This posts that content back.

It restores ONLY what was lost (the station rows). Metadata currently on the
record - auditors, partner, date - is preserved, because the student set that
today and wiping it would be a second destructive act.

  python tools/restore_submission.py --pin=NAC
  python tools/restore_submission.py --pin=NAC --date="Sep 21, 2026" --partner=""
  python tools/restore_submission.py --pin=NAC --post-only   # skip the live GETs, just push
  python tools/restore_submission.py --pin=NAC --dry-run     # build + save the payload only

The built payload is always written to scratch/restore_<PIN>_payload.json so the
push can be replayed the moment the Apps Script deployment is reachable again.
"""

import argparse
import json
import os
import sys
import urllib.request
import uuid

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SNAPSHOT = os.path.join(ROOT, "scratch", "901_sleep_submissions.json")

GAS = ("https://script.google.com/macros/s/"
       "AKfycby8XaHRRj07UUQ-4NTK7AH4s2qVp3GKe6XRyMA_tGLap52ZUWYg2faJbVhIB7Ea7_VJ/exec")
TASK = "HL9 Sleep Clinic 10-Station Audit"
SIDES = [str(i) for i in range(1, 11)]
FIELDS = ("hrs", "debt", "shift", "risk", "tags", "order", "notes")


def fetch_json(url, tries=4):
    import time
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 Room8-Restore"})
            return json.loads(urllib.request.urlopen(req, timeout=90).read().decode("utf-8"))
        except Exception as e:
            last = e
            print(f"   fetch attempt {i + 1}/{tries} failed: {type(e).__name__} {e}")
            time.sleep(2 * (i + 1))
    raise last


def live_record(pin):
    d = fetch_json(f"{GAS}?action=get_class_progress&className=901&slim=1")
    subs = d.get("students") or d
    return next((s for s in subs if str(s.get("pin")).upper() == pin), None)


def station_count(stations):
    n = 0
    for sid in SIDES:
        s = stations.get(sid) or {}
        if any(str(s.get(f, "")).strip() not in ("", "[]", "{}") for f in FIELDS):
            n += 1
    return n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pin", required=True, help="3-letter PIN, e.g. NAC")
    ap.add_argument("--class", dest="cls", default="901")
    ap.add_argument("--date", default=None, help="override the Date field")
    ap.add_argument("--partner", default=None, help="override the Partner field")
    ap.add_argument("--dry-run", action="store_true", help="show the payload, do not POST")
    ap.add_argument("--post-only", action="store_true",
                    help="skip the live pre-check/verify GETs and just POST the payload")
    args = ap.parse_args()

    pin = args.pin.strip().upper()
    snap = json.load(open(SNAPSHOT, encoding="utf-8"))
    src = next((s for s in snap if str(s.get("pin")).upper() == pin), None)
    if not src:
        print(f"{pin} not found in {SNAPSHOT}")
        return

    src_stations = src.get("stations") or {}
    have = station_count(src_stations)
    if have == 0:
        print(f"{pin} has no station rows in the snapshot - nothing to restore.")
        return

    print(f"RESTORE {pin} ({src.get('name')}, class {src.get('className')})")
    print(f"  source  : {SNAPSHOT}")
    print(f"  captured: {src.get('updated')}  ({src.get('summary')})")
    print(f"  rows    : {have}/10")

    live = None
    if not args.post_only:
        try:
            live = live_record(pin)
        except Exception as e:
            print(f"  live now: UNREACHABLE ({type(e).__name__}) - continuing to build the payload")
        else:
            lv = ((live or {}).get("savedData") or {}).get("_tasks", {}).get(TASK) or {}
            lvd = lv.get("data") or {}
            lst = lvd.get("stations") or {}
            print(f"  live now: {lv.get('updated')}  {lv.get('summary')}")
            print(f"  live rows: {station_count(lst)}/10")
            if station_count(lst) >= have:
                print("\nLive copy is already complete - no restore needed.")
                return
    lvd = (((live or {}).get("savedData") or {}).get("_tasks", {}).get(TASK) or {}).get("data") or {}

    # Restore ONLY the stations; keep today's metadata off the live record.
    data = {
        "name": lvd.get("name") or src.get("name") or "",
        "auditors": lvd.get("auditors") or src.get("auditors") or "",
        "partner": args.partner if args.partner is not None
                   else (lvd.get("partner") if lvd.get("partner") is not None else (src.get("partner") or "")),
        "section": args.cls,
        "className": args.cls,
        "date": args.date if args.date is not None
                else (lvd.get("date") or "Sep 21, 2026"),
        "pin": pin,
        "stations": {},
    }
    for sid in SIDES:
        s = src_stations.get(sid) or {}
        data["stations"][sid] = {f: (s.get(f) if f != "tags" else (s.get(f) or [])) for f in FIELDS}

    done = station_count(data["stations"])
    summary = f"HL9 10-Station Sleep Audit | Lead: {data['auditors'] or data['name']} | Section: {args.cls} | Stations: {done}/10"

    payload = {
        "action": "submit_profile",
        "taskName": TASK,
        "className": args.cls,
        "name": data["name"],
        "pin": pin,
        "email": (live or {}).get("email") or "",
        "pronouns": (live or {}).get("pronouns") or "",
        "data": data,
        "summary": summary,
        "requestId": str(uuid.uuid4()),
    }

    out_json = os.path.join(ROOT, "scratch", f"restore_{pin}_payload.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=1)
    print(f"\n  payload saved -> {out_json}")

    print("\n  -> posting:")
    print(f"     name     : {data['name']}")
    print(f"     auditors : {data['auditors']}")
    print(f"     partner  : {data['partner']!r}")
    print(f"     date     : {data['date']!r}")
    print(f"     stations : {done}/10")
    print(f"     summary  : {summary}")

    if args.dry_run:
        print("\n[dry-run] payload not sent.")
        print(json.dumps(payload["data"]["stations"], ensure_ascii=False, indent=1))
        return

    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(GAS, data=body, method="POST",
                                 headers={"Content-Type": "text/plain;charset=utf-8"})
    try:
        res = json.loads(urllib.request.urlopen(req, timeout=120).read().decode("utf-8"))
    except Exception as e:
        print(f"\nPOST FAILED: {type(e).__name__} {e}")
        print(f"Payload is safe at {out_json}. Replay with:")
        print(f"  python -u tools/restore_submission.py --pin={pin} --post-only")
        return
    print("\n  response:", res.get("status"), "-", res.get("message", ""))

    if args.post_only:
        print(f"\nposted. Verify once the deployment is healthy:")
        print(f"  python -u tools/restore_submission.py --pin={pin}")
        return

    # verify
    chk = live_record(pin)
    cv = ((chk or {}).get("savedData") or {}).get("_tasks", {}).get(TASK) or {}
    cvd = cv.get("data") or {}
    n = station_count(cvd.get("stations") or {})
    print(f"  verified: {cv.get('summary')}")
    print(f"  verified rows: {n}/10")
    if n >= have:
        print("\nRESTORED ✓  Reload the marking file if it was open:  python tools/marks_md.py")
    else:
        print("\nRestore did not land as expected - check the sheet before marking.")


if __name__ == "__main__":
    main()
