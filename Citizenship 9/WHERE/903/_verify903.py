import json, urllib.request, urllib.parse, time
GAS = 'https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec'

def fetch(url, tries=4):
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            print(f'  attempt {attempt+1} failed ({e}); retrying...')
            time.sleep(2.5 * (attempt + 1))
    return None

for first, pin in [('Evan', 'EVS'), ('Misha', 'MSC')]:
    url = GAS + f'?action=login&className=903&pin={pin}&name={urllib.parse.quote(first)}&cb={time.time()}'
    resp = fetch(url)
    if not resp:
        print(first, ': FAILED to fetch'); continue
    sd = resp.get('savedData') or {}
    if isinstance(sd, str):
        try: sd = json.loads(sd)
        except Exception: sd = {}
    tasks = sd.get('_tasks') or {}
    w = tasks.get('The WHERE Project — Places Portfolio') or {}
    d = w.get('data') or {}
    if isinstance(d, str):
        try: d = json.loads(d)
        except Exception: d = {}
    print(f"{first} ({pin}) | updated: {w.get('updated','?')}")
    print('   personal :', (d.get('where_personal') or '(empty)')[:90])
    print('   community:', (d.get('where_community') or '(empty)')[:90])
    print('   global   :', (d.get('where_global') or '(empty)')[:90])
    print('   aspirat. :', (d.get('where_aspirational') or '(empty)')[:90])
    time.sleep(1)
