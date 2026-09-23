"""
Migrate legacy Rent We Pay submissions from data/sheets/sheet_90*.csv
to the Room 8 v2 backend using HMAC-signed student submit_assignment requests.
"""

import csv
import json
import time
import hmac
import hashlib
import urllib.request
import urllib.error

BACKEND_URL = "https://script.google.com/macros/s/AKfycbz73P9FG2HLIJMl9NY9iex9y1TIm1E8cRglvgrsNVAtrrtUJGXgtP3hwKanl_aWJHuMcw/exec"
IDENTITY_KEY = b"THISISARANDOMSTRING"
TASK_NAME = "Citizenship 9 — Real Issues Case File #1: The Rent We Pay"

FILES = [
    ("data/sheets/sheet_901.csv", "901-CIT"),
    ("data/sheets/sheet_902.csv", "902-CIT"),
    ("data/sheets/sheet_903.csv", "903-CIT")
]

POS_MAP = {
    'A': 'A — Build everywhere',
    'B': 'B — Protect & plan',
    'C': 'C — Public land, non-market',
    'U': 'Still undecided'
}

TOPIC_MAP = {
    'phone': 'Phone bans in schools (2.71/4)',
    'treaty': "Mi'kmaw treaty rights (2.71/4)",
    'power': 'Power rates & offshore wind (2.43/4)',
    'ai': 'AI & future jobs (2.29/4)'
}

LVL_MAP = {
    'C': 'City / HRM Council',
    'P': 'Province',
    'F': 'Federal'
}

def transform_legacy_data(name, legacy_data):
    rm = legacy_data.get('rent_math', {})
    ev = legacy_data.get('evidence', {})
    di = legacy_data.get('dilemma', {})
    p = legacy_data.get('ppp', {})
    pm = legacy_data.get('power_map', {})
    dp = legacy_data.get('deputation', {})
    ff = legacy_data.get('fast_finisher', {})

    pos = (di.get('position') or '')[:1].upper()
    topic_key = str(ff.get('topic') or '').lower()
    topic = TOPIC_MAP.get(topic_key, ff.get('topic') or '')
    lvl_key = str(pm.get('target_level') or '')[:1].upper()
    lvl = LVL_MAP.get(lvl_key, pm.get('target_level') or '')

    answers = {
        'math_hours_rent': rm.get('hours_for_rent') or '',
        'math_pct_rent': rm.get('pct_of_pay') or '',
        'math_wage_needed': rm.get('wage_needed') or '',
        'math_gap_hourly': rm.get('gap_hourly') or '',
        'math_gap_compromises': rm.get('gap_compromises') or '',
        'math_gap_structural': rm.get('gap_structural') or '',
        'evidence_most_shocking': ev.get('most_shocking') or '',
        'evidence_system_link': ev.get('system_link') or '',
        'dilemma_position': POS_MAP.get(pos, di.get('position') or ''),
        'dilemma_justification': di.get('justification') or '',
        'dilemma_counter_tradeoff': di.get('counter_tradeoff') or '',
        'ppp_career_name': p.get('career') or '',
        'ppp_hfx_annual_salary': p.get('annual_salary') or '',
        'ppp_hfx_hours': p.get('hfx_hours') or '',
        'ppp_delhi_hours': p.get('delhi_hours') or '',
        'ppp_analysis_reflection': p.get('analysis') or '',
        'power_city_ask': pm.get('city_ask') or '',
        'power_prov_ask': pm.get('prov_ask') or '',
        'power_fed_ask': pm.get('fed_ask') or '',
        'power_target_level': lvl,
        'power_one_question': pm.get('one_question') or '',
        'dep_starter_1': dp.get('starter_1') or '',
        'dep_starter_2': dp.get('starter_2') or '',
        'dep_starter_3': dp.get('starter_3') or '',
        'dep_starter_4': dp.get('starter_4') or '',
        'dep_starter_5': dp.get('starter_5') or '',
        'ff_selected_topic': topic,
        'ff_response': ff.get('response') or '',
        'docSignature': legacy_data.get('signature') or ''
    }

    return {
        'answers': answers,
        'global_numbeo': legacy_data.get('global_numbeo') or [],
        '_v': 2,
        '_pipe': True,
        'name': name
    }

def sign_identity(email, ts):
    msg = f"{email}|{ts}".encode("utf-8")
    return hmac.new(IDENTITY_KEY, msg, hashlib.sha256).hexdigest()

def post_json(payload):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        BACKEND_URL,
        data=data,
        headers={"Content-Type": "text/plain;charset=utf-8"}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        loc = e.headers.get("Location")
        if loc:
            with urllib.request.urlopen(loc) as r2:
                return 200, r2.read().decode("utf-8")
        raise

def main():
    records = []
    for filepath, default_sec in FILES:
        with open(filepath, encoding="utf-8", errors="ignore") as fp:
            r = csv.reader(fp)
            for row in r:
                if len(row) <= 6:
                    continue
                name = row[1].strip()
                email = row[3].strip().lower() if len(row) > 3 else ""
                try:
                    ledger = json.loads(row[6])
                except Exception:
                    continue
                tasks = ledger.get("_tasks", {})
                for t, tval in tasks.items():
                    if "Rent We Pay" in t or "Case File #1" in t:
                        records.append({
                            "name": name,
                            "email": email,
                            "section": default_sec,
                            "summary": tval.get("summary", "Migrated legacy submission"),
                            "data": tval.get("data", {})
                        })

    print(f"Total matched records: {len(records)}")
    with_email = [rec for rec in records if rec["email"]]
    without_email = [rec for rec in records if not rec["email"]]
    print(f"With email: {len(with_email)}, Without email: {len(without_email)}")

    success_count = 0
    for idx, rec in enumerate(with_email):
        v2_data = transform_legacy_data(rec["name"], rec["data"])
        ts = int(time.time() * 1000)
        sig = sign_identity(rec["email"], ts)
        payload = {
            "action": "submit_assignment",
            "email": rec["email"],
            "ts": ts,
            "sig": sig,
            "task": TASK_NAME,
            "section": rec["section"],
            "name": rec["name"],
            "summary": rec["summary"],
            "data": v2_data
        }
        try:
            status, body = post_json(payload)
            resp_obj = json.loads(body)
            if resp_obj.get("status") == "submitted_successfully":
                success_count += 1
                print(f"[{idx+1}/{len(with_email)}] OK: {rec['name']} ({rec['email']}) -> {rec['section']}")
            else:
                print(f"[{idx+1}/{len(with_email)}] FAILED: {rec['name']} -> {body}")
        except Exception as e:
            print(f"[{idx+1}/{len(with_email)}] ERROR: {rec['name']} ({rec['email']}) -> {e}")
        time.sleep(0.3)

    print(f"\nMigration complete! {success_count}/{len(with_email)} submissions posted.")

if __name__ == "__main__":
    main()
