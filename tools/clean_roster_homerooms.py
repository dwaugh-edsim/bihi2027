"""
Update Room 8 v2 Roster so Column D contains clean homerooms (901, 902, 903, 801, 802, etc.)
instead of course-specific suffixes like 901-CIT.
"""

import csv
import json
import os
import urllib.request
import urllib.error

BACKEND_URL = "https://script.google.com/macros/s/AKfycbz73P9FG2HLIJMl9NY9iex9y1TIm1E8cRglvgrsNVAtrrtUJGXgtP3hwKanl_aWJHuMcw/exec"
TEACHER_PIN = "Dartmouth"

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
    files = ['801', '802', '803', '804', '901', '902', '903']
    students = []
    seen = set()

    for hr in files:
        path = f'data/sheets/sheet_{hr}.csv'
        if not os.path.exists(path):
            continue
        with open(path, encoding='utf-8', errors='ignore') as fp:
            r = csv.reader(fp)
            for row in r:
                if len(row) > 3:
                    pin = row[0].strip()
                    name = row[1].strip()
                    email = row[3].strip().lower()
                    if pin and name and email and '@' in email:
                        if email in seen:
                            continue
                        seen.add(email)
                        parts = name.split()
                        first = parts[0] if parts else name
                        last = ' '.join(parts[1:]) if len(parts) > 1 else ''
                        grade = 8 if hr.startswith('8') else 9
                        courses = 'HL 8' if grade == 8 else 'CIT 9, HL 9'
                        students.append({
                            'email': email,
                            'first': first,
                            'last': last,
                            'section': hr,  # CLEAN HOMEROOM NUMBER!
                            'grade': grade,
                            'courses': courses
                        })

    print(f"Collected {len(students)} unique students.")
    by_hr = {}
    for s in students:
        by_hr[s['section']] = by_hr.get(s['section'], 0) + 1
    print("Breakdown by Homeroom:", by_hr)

    payload = {
        'action': 'set_roster',
        'teacherPin': TEACHER_PIN,
        'mode': 'replace',
        'roster': {
            'students': students,
            'updated': '2026-09-23 Clean Homerooms'
        }
    }

    print("Posting clean roster to Google Sheet...")
    status, body = post_json(payload)
    print("set_roster response:", body)

    # Verify with get_roster_meta
    print("\nVerifying with get_roster_meta...")
    meta_payload = {
        'action': 'get_roster_meta',
        'teacherPin': TEACHER_PIN
    }
    status, meta_body = post_json(meta_payload)
    print("get_roster_meta response:", meta_body)

if __name__ == '__main__':
    main()
