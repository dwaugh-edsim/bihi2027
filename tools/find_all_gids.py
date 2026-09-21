import re

with open(r'Z:\simroom\Github Repos\bihi2027\sheet_dump.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find occurrences of \"(\d+)\",\[\{\"1\"
matches = re.findall(r'\[\d+,\d+,\"(\d+)\",.*?\"([A-Za-z0-9_-]+)\"', text)
print(f"Matches count: {len(matches)}")
for gid, name in matches:
    if name in ['Sheet1', 'DEMO', 'Class_Slide', 'Class_Log', 'Class_Plan', 'Submissions_Log', 'Submissions', 'HealthyLiving8', 'HL8', 'General', 'Lockers_902', 'CIT9', '804', '803', '802', '801', '902', '901', '903']:
        print(f"  {name:20} -> gid={gid}")

# Let's inspect 500 chars around Class_Plan in that JSON block
pos = text.find('Class_Plan')
pos2 = text.find('Class_Plan', pos+1)
print("Block around 2nd Class_Plan:\n", text[pos2-150:pos2+150])
