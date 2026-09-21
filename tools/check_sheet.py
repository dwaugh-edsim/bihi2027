import urllib.request
import re

url = 'https://docs.google.com/spreadsheets/d/1s9ohJsnx6dv9Qhqo0djUF_EKnYEKzpm32PFtgXiOgnA/edit?usp=sharing'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print('Status:', resp.status)
        title = re.search(r'<title>(.*?)</title>', html)
        if title:
            print('Title:', title.group(1))
        
        # Look for sheet names and gids in bootstrap data
        # Often in format: [gid, "SheetName", ...]
        matches = re.findall(r'\[(\d+),\"([^\"]+)\"', html)
        print('Possible sheet tabs (gid, name):')
        for gid, name in matches[:20]:
            print(f'  gid={gid}: {name}')

        with open(r'Z:\simroom\Github Repos\bihi2027\sheet_dump.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Saved sheet_dump.html")
except Exception as e:
    print('Error:', e)
