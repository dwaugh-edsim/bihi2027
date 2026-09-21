import re
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dump_file = os.path.join(BASE_DIR, 'data', 'sheets', 'sheet_dump.html')

with open(dump_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Look for text inside string literals
strings = re.findall(r'"([^"\\]{3,120})"', text)
schedule_words = [
    'period', 'class', 'sept', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 
    'day 1', 'day 2', 'day 3', 'day 4', 'day 5', 'day 6', 'day 7', 'day 8', 
    '901', '902', '903', '801', '802', '803', '804', 'waugh', 'room', 'lunch', 
    'recess', 'homeroom', 'duty', 'ilt', 'prep', 'schedule', 'timetable'
]

hits = [s for s in strings if any(w in s.lower() for w in schedule_words)]
print(f'Total hits: {len(hits)}')
for h in set(hits):
    print('  ', h)
