import re
import urllib.request
import csv
import io

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHEETS_DIR = os.path.join(BASE_DIR, 'data', 'sheets')

dump_file = os.path.join(SHEETS_DIR, 'sheet_dump.html')
with open(dump_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern: [index, 0, \"GID\", [{\\"1\\":[[0, 0, \\"TAB_NAME\\"]
pattern = r'\[\d+,\d+,\\\"(\d+)\\\",\[\{\\\"1\\\":\[\[0,0,\\\"([^\\\"]+)\\\"'
matches = re.findall(pattern, text)
print("Found tabs with GIDs:")
gids = {}
for gid, name in matches:
    print(f"  {name:20} -> gid={gid}")
    gids[name] = gid

sheet_id = '1s9ohJsnx6dv9Qhqo0djUF_EKnYEKzpm32PFtgXiOgnA'

# Let's download CSV for each key sheet!
targets = ['Class_Plan', 'Class_Log', 'Class_Slide', 'General', 'CIT9', 'HL8', 'HealthyLiving8', '901', '902', '903', '801', '802', '803', '804']

for name in targets:
    if name in gids:
        gid = gids[name]
        url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}'
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp:
                content = resp.read().decode('utf-8', errors='ignore')
                filename = os.path.join(SHEETS_DIR, f'sheet_{name}.csv')
                with open(filename, 'w', encoding='utf-8') as out:
                    out.write(content)
                print(f"Saved sheet_{name}.csv ({len(content)} bytes)")
        except Exception as e:
            print(f"Failed to fetch {name} (gid={gid}): {e}")
