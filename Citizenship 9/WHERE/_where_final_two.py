import json, re, urllib.request, urllib.parse, time, os

GAS = 'https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec'
TASK = 'The WHERE Project — Places Portfolio'
GO = '--go' in sys.argv if (sys := __import__('sys')) else False

def fetch(url, tries=4):
    for a in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            print(f'   fetch attempt {a+1} failed: {e}')
            time.sleep(2 + 2 * a)
    return None

def check(cls, pin, name):
    url = GAS + f'?action=login&className={cls}&pin={pin}&name={urllib.parse.quote(name)}&cb={time.time()}'
    resp = fetch(url)
    sd = (resp or {}).get('savedData') or {}
    if isinstance(sd, str):
        try: sd = json.loads(sd)
        except Exception: sd = {}
    tasks = sd.get('_tasks') or {}
    return (TASK in tasks) if isinstance(tasks, dict) else False

def submit(cls, pin, name, payload, summary):
    body = json.dumps({
        'action': 'submit_profile', 'taskName': TASK, 'className': cls,
        'name': name, 'pin': pin, 'email': '', 'pronouns': '',
        'data': payload, 'summary': summary,
    })
    req = urllib.request.Request(GAS, data=body.encode('utf-8'),
                                 headers={'Content-Type': 'text/plain;charset=utf-8'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode()[:120]

def state_check(label, cls, pin, name):
    has = check(cls, pin, name)
    print(f'{label}: WHERE task already in sheet = {has}')
    return has

# ═══ 1. MONA ALASADI (902, MNA) — from Studio PDF printout ═══
print('--- MONA ALASADI (902, MNA) ---')
if not state_check('Mona', '902', 'MNA', 'Mona'):
    payload = {
        'pin': 'MNA', 'name': 'Mona', 'class': '902', 'className': '902',
        'updated_at': '2026-09-16T14:00:00.000Z',
        'where_personal': "Its my comfort place i love so much. I grew up here. Ive been here for 7 years now. I never want to move out from there.",
        'where_community': "me and my friends always hang out there. It has a special place in my heart. It reminds me of my friend that moved out. Theres so much memories there and I love so much.",
        'where_global': "I grew up there and my family lives there too. its so fun and very special to me. I love it so much and I want to go there again. I love it because the buildings are beautiful.",
        'where_aspirational': "i really wanna go there ive been wanting to go forever. Its my dream vacation. Ive seen it a lot in shows and its so cool. Its a lovely place.",
        'cat1_personal': "my house on portland street — Its my comfort place i love so much. I grew up here. Ive been here for 7 years now. I never want to move out from there.",
        'cat2_community': "lake banook — me and my friends always hang out there. It has a special place in my heart. It reminds me of my friend that moved out. Theres so much memories there and I love so much.",
        'cat3_global': "syria — I grew up there and my family lives there too. its so fun and very special to me. I love it so much and I want to go there again. I love it because the buildings are beautiful.",
        'cat4_aspirational': "japan tokyo — i really wanna go there ive been wanting to go forever. Its my dream vacation. Ive seen it a lot in shows and its so cool. Its a lovely place.",
        'cat5_music': 'Say so - Doja Cat',
        'youtube_url': '',
        'p1': {'title': 'my house on portland street', 'desc': 'Its my comfort place i love so much. I grew up here. Ive been here for 7 years now. I never want to move out from there.', 'img': '', 'coords': {'lat': 44.6703, 'lng': -63.5404}},
        'p2': {'title': 'lake banook', 'desc': 'me and my friends always hang out there. It has a special place in my heart. It reminds me of my friend that moved out. Theres so much memories there and I love so much.', 'img': '', 'coords': {'lat': 44.6854, 'lng': -63.5480}},
        'p3': {'title': 'syria', 'desc': 'I grew up there and my family lives there too. its so fun and very special to me. I love it so much and I want to go there again. I love it because the buildings are beautiful.', 'img': '', 'coords': {'lat': 33.4177, 'lng': 36.0346}},
        'p4': {'title': 'japan tokyo', 'desc': 'i really wanna go there ive been wanting to go forever. Its my dream vacation. Ive seen it a lot in shows and its so cool. Its a lovely place.', 'img': '', 'coords': {'lat': 35.2243, 'lng': 136.0323}},
        'submission_note': 'Submitted in Google Classroom (PDF printout of Studio) — entered to WHERE GAS by Mr. Waugh 2026-09-16',
    }
    summary = 'WHERE Places Portfolio for Mona (902): submitted in Google Classroom (PDF) — entered by Mr. Waugh 2026-09-16'
    if GO:
        print('  POST ->', submit('902', 'MNA', 'Mona', payload, summary))
    else:
        print('  (dry run — payload ready)')
else:
    print('  already in sheet — skipped')

# ═══ 2. BLESSING UMEOKAFOR (903, BEU) — from "Kossy" deck ═══
print('--- BLESSING UMEOKAFOR (903, BEU) ---')
if not state_check('Blessing', '903', 'BEU', 'Blessing'):
    d903 = json.load(open(r'F:\Antigravity\simroom\Github Repos\bihi2027\Citizenship 9\WHERE\903\_extracted.json', encoding='utf-8'))
    fname = 'Copy of [Template] Cit 9  WHERE - My Personal Location History - Template.pptx'
    def stxt(i): return ' \n'.join(next(s for s in d903[fname] if s['slide'] == i)['texts'])
    def strip_prompt(t):
        for p in (
            'Reflection: Write about a personal place that holds significance for you. Tell the story of the place! ',
            'Reflection: Write about a significant place in our local community. Tell the story of the place! Who owns it? Why do you like it? Describe something that happened there that you remember. ',
            "Reflection: Write a story about a place in the world that is part of your family's story. ",
            'Reflection: Write about a place you have never been to but dream of visiting. ',
            'Reflection: Write a story about a place you have never been to but dream of visiting. ',
        ):
            t = t.replace(p, '')
        for token in ('The Personal Place', 'The Community Place', 'The Global Place', 'The Aspirational Place',
                      'Cit 9 WHERE', 'Cit 9  WHERE', '[TABLE]', 'MAP SCREENSHOT', 'IMAGE', '/ '):
            t = t.replace(token, '')
        gi = t.find('Guiding Questions:')
        if gi != -1:
            t = t[:gi]
        return re.sub(r'\s+', ' ', t).strip(' |').strip()
    p1, p2, p3, p4 = (strip_prompt(stxt(i)) for i in (3, 4, 5, 6))
    payload = {
        'pin': 'BEU', 'name': 'Blessing', 'class': '903', 'className': '903',
        'updated_at': '2026-09-16T14:30:00.000Z',
        'where_personal': p1, 'where_community': p2, 'where_global': p3, 'where_aspirational': p4,
        'cat1_personal': p1, 'cat2_community': p2, 'cat3_global': p3, 'cat4_aspirational': p4,
        'cat5_music': '', 'youtube_url': '',
        'p1': {'title': 'Nigeria', 'desc': p1, 'img': '', 'coords': None},
        'p2': {'title': "My grandma's house", 'desc': p2, 'img': '', 'coords': None},
        'p3': {'title': "My grandparent's house (dad's side)", 'desc': p3, 'img': '', 'coords': None},
        'p4': {'title': 'The UK', 'desc': p4, 'img': '', 'coords': None},
        'submission_note': 'Submitted in Google Classroom (PowerPoint) — entered to WHERE GAS by Mr. Waugh 2026-09-16',
    }
    summary = 'WHERE Places Portfolio for Blessing (903): submitted in Google Classroom (PowerPoint) — entered by Mr. Waugh 2026-09-16'
    if GO:
        print('  POST ->', submit('903', 'BEU', 'Blessing', payload, summary))
    else:
        print('  (dry run) p1:', p1[:80])
        print('           p2:', p2[:80])
        print('           p3:', p3[:80])
        print('           p4:', p4[:80])
else:
    print('  already in sheet — skipped')
