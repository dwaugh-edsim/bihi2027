import re

with open(r'Z:\simroom\Github Repos\bihi2027\sheet_dump.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Look for patterns like [0,"Sheet1",...], [123456,"Class_Plan",...]
matches = re.findall(r'\[(\d+),\"([A-Za-z0-9_-]+)\"', text)
for gid, name in matches:
    if name in ['Sheet1', 'DEMO', 'Class_Slide', 'Class_Log', 'Class_Plan', 'Submissions_Log', 'Submissions', 'HealthyLiving8', 'HL8', 'General', 'Lockers_902', 'CIT9', '804', '803', '802', '801', '902', '901', '903']:
        print(f"Tab: {name:15} -> gid={gid}")

# Also search for 'Class_Plan' in the entire file and see where it appears in javascript blocks
for m in re.finditer(r'Class_Plan', text):
    start = max(0, m.start() - 100)
    end = min(len(text), m.end() + 100)
    print("Class_Plan occurrence:", text[start:end])
