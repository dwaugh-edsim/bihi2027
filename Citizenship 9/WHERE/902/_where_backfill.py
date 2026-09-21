import json, re, urllib.request, glob, os, sys

GO = '--go' in sys.argv
FOLDER = r'F:\Antigravity\simroom\Github Repos\bihi2027\Citizenship 9\WHERE\902'
GAS = 'https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec'
TASK = 'The WHERE Project — Places Portfolio'
NOTE = 'Submitted in Google Classroom (PowerPoint) — entered to WHERE GAS by Mr. Waugh 2026-09-16'

# ── roster (902 only) ──
src = open(r'F:\Antigravity\simroom\Github Repos\bihi2027\Student_System\students_roster_data.js', encoding='utf-8').read()
roster = json.loads(src[src.index('['):src.rindex(']') + 1])
g9 = [s for s in roster if str(s.get('homeroom')) == '902']

def find(first, last_prefix=''):
    for s in g9:
        if s['first_name'].lower().startswith(first.lower()) and (not last_prefix or s['last_name'].lower().startswith(last_prefix.lower())):
            return s
    return None

# ── identified students ──
STUDENTS = [
    ('Chelsea RendellCit 9  WHERE - My Personal Location History - Template.pptx', find('Chelsea', 'R')),
    ('Copy of [Template] Cit 9  WHERE - My Personal Location History - Template(1).pptx', find('Oscar', 'P')),
    ('Copy of [Template] Cit 9  WHERE - My Personal Location History - Template(2).pptx', find('Anna', 'T')),
    ('Copy of [Template] Cit 9  WHERE - My Personal Location History - Template(3).pptx', find('Noah', 'B')),
    ('Copy of [Template] Cit 9  WHERE - My Personal Location History - Template(4).pptx', find('Lyla', 'F')),
    ('Mhareon personal location history.pptx', find('Mhareon', 'O')),
    ('Tristan_s copy [Template] Cit 9  WHERE - My Personal Location History - Template.pptx', find('Tristan', 'H')),
]

data = json.load(open(os.path.join(FOLDER, '_extracted.json'), encoding='utf-8'))

def slide_texts(fname, idx):
    for s in data[fname]:
        if s['slide'] == idx:
            return ' \n'.join(s['texts'])
    return ''

PROMPT = re.compile(r'Reflection:\s*Write[^A-Za-z]*(?:[A-Z][^A-Z]*?)?(?=My |This |The |It |I |For |There |A place|One |Downstairs|Sam)', re.I)
def clean(t):
    t = re.sub(r'MAP SCREENSHOT \(from Bing Maps\)', '', t)
    t = re.sub(r'Reflection: Write (about|a story)[^:]*:? *(Guiding Questions:[^A-Z]*)?', '', t)
    t = re.sub(r'\| Cit 9  WHERE', '', t)
    t = re.sub(r'IMAGE', '', t)
    t = re.sub(r'\s*\|\s*', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip(' |')
    return t.strip()

def cat_text(fname, slide_idx):
    raw = slide_texts(fname, slide_idx)
    return clean(raw)

def music(fname):
    raw = slide_texts(fname, 7)
    t = re.sub(r'Soundtrack of your life', '', raw)
    t = re.sub(r'Post the youtube link here', '', t)
    t = re.sub(r'What.s the story on the song\? Write here!', '', t)
    yt = re.search(r'https?://\S+', t)
    link = yt.group(0) if yt else ''
    t = t.replace(link, '').strip(' |')
    return t.strip(' |'), link

results = []
for fname, student in STUDENTS:
    if not student:
        results.append((fname, None, 'NO ROSTER MATCH'))
        continue
    pin = student['pin']
    # check current cloud state
    url = f"{GAS}?action=login&className=902&pin={pin}&name={urllib.parse.quote(student['first_name'])}"
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            resp = json.loads(r.read().decode())
        saved = resp.get('savedData') or {}
        if isinstance(saved, str):
            try: saved = json.loads(saved)
            except Exception: saved = {}
        if isinstance(saved, dict) and saved.get('data'):
            d = saved['data']
            if isinstance(d, str):
                try: d = json.loads(d)
                except Exception: d = {}
        else:
            d = {}
        has_where = bool((d.get('_tasks') or {}).get(TASK)) if isinstance(d, dict) else False
    except Exception as e:
        has_where = None
        resp = {'err': str(e)}

    slides_data = data[fname]
    def stxt(i): return ' \n'.join(next(s for s in slides_data if s['slide'] == i)['texts'])
    p1, p2, p3, p4 = (cat_text(fname, i) for i in (3, 4, 5, 6))
    song, yt = music(fname)

    payload = {
        'pin': pin, 'name': student['first_name'], 'class': '902', 'className': '902',
        'updated_at': '2026-09-16T12:00:00.000Z',
        'where_personal': p1, 'where_community': p2, 'where_global': p3, 'where_aspirational': p4,
        'cat1_personal': p1, 'cat2_community': p2, 'cat3_global': p3, 'cat4_aspirational': p4,
        'cat5_music': song, 'youtube_url': yt,
        'p1': {'title': 'Personal Place', 'desc': p1, 'img': '', 'coords': None},
        'p2': {'title': 'Community Place', 'desc': p2, 'img': '', 'coords': None},
        'p3': {'title': 'Global Place', 'desc': p3, 'img': '', 'coords': None},
        'p4': {'title': 'Aspirational Place', 'desc': p4, 'img': '', 'coords': None},
        'submission_note': 'Submitted in Google Classroom (PowerPoint) — entered to WHERE GAS by Mr. Waugh 2026-09-16',
    }
    summary = f"WHERE Places Portfolio for {student['first_name']} (902): submitted in Google Classroom (PowerPoint) — entered by Mr. Waugh 2026-09-16"
    body = json.dumps({
        'action': 'submit_profile', 'taskName': TASK, 'className': '902',
        'name': student['first_name'], 'pin': pin, 'email': '', 'pronouns': '',
        'data': payload, 'summary': summary,
    })
    results.append((fname[:45], f"{student['first_name']} {student['last_name'][0]} ({pin})", f"already in sheet: {has_where}", len(body)))

    if GO and not has_where:
        req = urllib.request.Request(GAS, data=body.encode('utf-8'),
                                     headers={'Content-Type': 'text/plain;charset=utf-8'})
        with urllib.request.urlopen(req, timeout=30) as r:
            out = r.read().decode()[:120]
        print(f"  POST {student['first_name']} ({pin}) -> {out}")

print()
for r in results:
    print(r)
if not GO:
    print('\nDRY RUN — rerun with --go to submit students not already in the sheet.')
