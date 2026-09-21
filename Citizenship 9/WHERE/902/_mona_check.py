import json, re, urllib.request, urllib.parse, time
GAS = 'https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec'

# 1. Mona in 902 roster
src = open(r'F:\Antigravity\simroom\Github Repos\bihi2027\Student_System\students_roster_data.js', encoding='utf-8').read()
roster = json.loads(src[src.index('['):src.rindex(']') + 1])
mona = [s for s in roster if str(s.get('homeroom')) == '902' and s['first_name'].lower().startswith('mona')]
print('roster match:', [(m['first_name'], m['last_name'], m['pin']) for m in mona])
student = mona[0]
pin = student['pin']

# 2. Full PDF text
from pypdf import PdfReader
r = PdfReader(r'F:\Antigravity\simroom\Github Repos\bihi2027\Citizenship 9\WHERE\902\The WHERE Project — Places of Significance Studio _ Room 8.pdf')
full = '\n'.join((p.extract_text() or '') for p in r.pages)
print('\n--- FULL PDF TEXT ---')
print(full)

# 3. Current sheet state
def fetch(url, tries=4):
    for a in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=30) as resp:
                return json.loads(resp.read().decode())
        except Exception:
            time.sleep(2 + 2 * a)
    return None

url = GAS + f"?action=login&className=902&pin={pin}&name={urllib.parse.quote(student['first_name'])}&cb={time.time()}"
resp = fetch(url)
sd = (resp or {}).get('savedData') or {}
if isinstance(sd, str):
    try: sd = json.loads(sd)
    except Exception: sd = {}
tasks = sd.get('_tasks') or {}
has_where = 'The WHERE Project — Places Portfolio' in tasks if isinstance(tasks, dict) else False
print('\n--- MONA CURRENT STATE ---')
print('name:', resp.get('name'), '| has WHERE task:', has_where)
print('top-level where_personal:', (sd.get('where_personal') or '(empty)')[:80])
