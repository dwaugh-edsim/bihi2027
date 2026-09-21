import re

with open(r'Z:\simroom\Github Repos\bihi2027\sheet_dump.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern: [index, 0, "GID", [{"1":[[0, 0, "TAB_NAME"]
matches = re.findall(r'\[\d+,\d+,\"(\d+)\",\[\{\"1\":\[\[0,0,\"([^\"]+)\"\]', text)
print("Found tabs with GIDs:")
for gid, name in matches:
    print(f"  {name:20} -> gid={gid}")
