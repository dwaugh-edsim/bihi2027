import json, urllib.request, urllib.parse, time
GAS = 'https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec'

def fetch(url, tries=4):
    for a in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            time.sleep(2 + 2 * a)
    return None

for first, pin in [('Evan', 'EVS'), ('Chelsea', 'CHR')]:
    url = GAS + f"?action=login&className={'903' if first=='Evan' else '902'}&pin={pin}&name={urllib.parse.quote(first)}&cb={time.time()}"
    resp = fetch(url)
    if not resp:
        print(first, ': fetch failed'); continue
    sd = resp.get('savedData') or {}
    if isinstance(sd, str):
        try: sd = json.loads(sd)
        except Exception: sd = {}
    print(f"\n=== {first} ({pin}) savedData keys:", list(sd.keys()))
    tasks = sd.get('_tasks')
    if isinstance(tasks, str):
        try: tasks = json.loads(tasks)
        except Exception: tasks = {}
    if not isinstance(tasks, dict):
        print('  no _tasks'); continue
    for tname, w in tasks.items():
        print(f"  TASK: {tname[:50]} | keys: {list(w.keys()) if isinstance(w, dict) else type(w)}")
        if isinstance(w, dict):
            d = w.get('data')
            if isinstance(d, str):
                try: d = json.loads(d)
                except Exception: d = {}
            if isinstance(d, dict):
                wp = d.get('where_personal', '')
                print(f"    data.where_personal ({len(str(wp))} chars): {str(wp)[:100]}")
                print(f"    data.where_community ({len(str(d.get('where_community','')))} chars)")
            else:
                print('    data:', str(d)[:100])
    time.sleep(0.5)
