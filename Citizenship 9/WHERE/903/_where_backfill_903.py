import json, re, urllib.request, urllib.parse, os, sys

GO = '--go' in sys.argv
FOLDER = r'F:\Antigravity\simroom\Github Repos\bihi2027\Citizenship 9\WHERE\903'
GAS = 'https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec'
TASK = 'The WHERE Project — Places Portfolio'

src = open(r'F:\Antigravity\simroom\Github Repos\bihi2027\Student_System\students_roster_data.js', encoding='utf-8').read()
roster = json.loads(src[src.index('['):src.rindex(']') + 1])
g9 = {s['first_name'].lower(): s for s in roster if str(s.get('homeroom')) == '903'}

STUDENTS = [
    ('Copy of Cit 9  WHERE - My Personal Location History - Template.pptx', 'evan'),
    ('WHERE - Misha C,.docx', 'misha'),
]

data = json.load(open(os.path.join(FOLDER, '_extracted.json'), encoding='utf-8'))

def clean(t):
    t = re.sub(r'MAP SCREENSHOT\s*\(from Bing Maps\)', '', t)
    t = re.sub(r'Reflection: Write (about|a story)[^:]*:? *(Guiding Questions:[^A-Z]*)?', '', t)
    t = re.sub(r'\| Cit 9  WHERE', '', t)
    t = re.sub(r'IMAGE', '', t)
    t = re.sub(r'\s*\|\s*', ' ', t)
    return re.sub(r'\s+', ' ', t).strip(' |').strip()

for fname, first in STUDENTS:
    student = g9[first]
    pin = student['pin']
    slides = data[fname]
    if isinstance(slides, list) and slides and 'slide' in slides[0]:  # pptx
        def stxt(i): return ' \n'.join(next(s for s in slides if s['slide'] == i)['texts'])
        p1, p2, p3, p4 = (clean(stxt(i)) for i in (3, 4, 5, 6))
        raw7 = stxt(7)
        yt = re.search(r'https?://\S+', raw7)
        song = clean(re.sub(r'https?://\S+', '', raw7).replace('Soundtrack of your life', ''))
        docx_note = ''
    else:  # docx: paragraphs are personal, community, global, aspirational in order
        paras = [p for p in slides if not p.lower().startswith('a location') or True]
        paras = slides[:]
        p1 = paras[0] if len(paras) > 0 else ''
        p2 = paras[1] if len(paras) > 1 else ''
        p3 = paras[2] if len(paras) > 2 else ''
        p4 = paras[3] if len(paras) > 3 else ''
        song, yt = '', ''
        docx_note = ' (from Word doc)'

    payload = {
        'pin': pin, 'name': student['first_name'], 'class': '903', 'className': '903',
        'updated_at': '2026-09-16T13:30:00.000Z',
        'where_personal': p1, 'where_community': p2, 'where_global': p3, 'where_aspirational': p4,
        'cat1_personal': p1, 'cat2_community': p2, 'cat3_global': p3, 'cat4_aspirational': p4,
        'cat5_music': song, 'youtube_url': yt,
        'p1': {'title': 'Personal Place', 'desc': p1, 'img': '', 'coords': None},
        'p2': {'title': 'Community Place', 'desc': p2, 'img': '', 'coords': None},
        'p3': {'title': 'Global Place', 'desc': p3, 'img': '', 'coords': None},
        'p4': {'title': 'Aspirational Place', 'desc': p4, 'img': '', 'coords': None},
        'submission_note': 'Submitted in Google Classroom — entered to WHERE GAS by Mr. Waugh 2026-09-16' + docx_note,
    }
    summary = f"WHERE Places Portfolio for {student['first_name']} (903): submitted in Google Classroom — entered by Mr. Waugh 2026-09-16"
    body = json.dumps({
        'action': 'submit_profile', 'taskName': TASK, 'className': '903',
        'name': student['first_name'], 'pin': pin, 'email': '', 'pronouns': '',
        'data': payload, 'summary': summary,
    })

    url = f"{GAS}?action=login&className=903&pin={pin}&name={urllib.parse.quote(student['first_name'])}&cb={time.time() if (time := __import__('time')) else ''}"
    with urllib.request.urlopen(url, timeout=30) as r:
        resp = json.loads(r.read().decode())
    sd = resp.get('savedData') or {}
    if isinstance(sd, str):
        try: sd = json.loads(sd)
        except Exception: sd = {}
    tasks = sd.get('_tasks') or {}
    already = TASK in tasks if isinstance(tasks, dict) else False

    print(f"{student['first_name']} {student['last_name']} ({pin}): already={already}, payload={len(body)}B, "
          f"p1[:60]={p1[:60]!r}")
    if GO and (not already or first == 'evan'):  # evan: sheet has empty autosave, force real content
        req = urllib.request.Request(GAS, data=body.encode('utf-8'), headers={'Content-Type': 'text/plain;charset=utf-8'})
        with urllib.request.urlopen(req, timeout=30) as r:
            print('   POST ->', r.read().decode()[:120])
