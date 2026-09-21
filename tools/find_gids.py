import re

with open(r'Z:\simroom\Github Repos\bihi2027\sheet_dump.html', 'r', encoding='utf-8') as f:
    text = f.read()

tabs = re.findall(r'docs-sheet-tab-caption">([^<]+)<', text)
print('Tabs found in sheet bar:', tabs)

# Look for tab ID in the enclosing element
# e.g. id="sheet-button-..."
tab_elements = re.findall(r'id="sheet-button-([0-9a-zA-Z_-]+)"[^>]*>.*?docs-sheet-tab-caption">([^<]+)<', text, re.DOTALL)
print('Tab elements (id, name):', tab_elements)
