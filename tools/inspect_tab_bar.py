import re

with open(r'Z:\simroom\Github Repos\bihi2027\sheet_dump.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect the entire outer HTML of the tab bar
pos = text.find('docs-sheet-tab-caption')
print(text[max(0, pos-400):min(len(text), pos+1500)])
