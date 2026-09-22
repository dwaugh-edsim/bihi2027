"""Add a read-only 'Teacher feedback' field to the HL9 10-Station Audit assignment.

The field is populated from hl9_sleep_feedback.js, which is generated from the
teacher-edited marks markdown:

    HL9_SleepClinic_901_Marks.md  ->  tools/marks_md.py --sync  ->  hl9_sleep_feedback.js

Applies the same three insertions to every copy of the template in the repo.
Re-runnable: reports SKIP when an anchor is already patched.
"""

import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

COPIES = [
    os.path.join(ROOT, "HealthyLiving9", "HL9_Class1_10_Station_Audit_Template.html"),
    os.path.join(ROOT, "HealthyLiving9", "Unit 1 - Sleep", "HL9_Class1_10_Station_Audit_Template.html"),
    os.path.join(ROOT, "Day1_Deliverables", "HL9_Class1_10_Station_Audit_Template.html"),
]

ANCHOR_SCRIPT = '    <script src="../Student_System/api.js"></script>'
NEW_SCRIPT = (
    '    <script src="../Student_System/api.js"></script>\n'
    '    <!-- Teacher feedback store, generated from HL9_SleepClinic_901_Marks.md\n'
    '         by tools/marks_md.py --sync -->\n'
    '    <script src="../Student_System/hl9_sleep_feedback.js"></script>'
)

ANCHOR_PANEL = "        <!-- REAL FIELDSET: Disables all inputs/chips when not logged in -->"
NEW_PANEL = '''        <!-- TEACHER FEEDBACK (read-only). Built from HL9_SleepClinic_901_Marks.md
             via tools/marks_md.py --sync -> ../Student_System/hl9_sleep_feedback.js -->
        <div id="teacherFeedback" style="display:none; background:#eff6ff; border:1.5px solid #2563eb; border-radius:10px; padding:14px 18px; margin:0 0 18px 0;">
            <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px; flex-wrap:wrap;">
                <span style="font-family:'JetBrains Mono',monospace; font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.8px; color:#1e40af;">Teacher feedback</span>
                <span id="tfBand" style="font-family:'JetBrains Mono',monospace; font-size:0.7rem; font-weight:800; padding:2px 10px; border-radius:20px; background:#1e40af; color:#ffffff;"></span>
            </div>
            <div id="tfBody" style="font-size:0.95rem; line-height:1.55; color:#1e293b; white-space:pre-wrap;"></div>
        </div>

''' + ANCHOR_PANEL

ANCHOR_HOOK = "            if (gateBanner) gateBanner.style.display = student ? 'none' : 'block';"
NEW_HOOK = (
    "            if (gateBanner) gateBanner.style.display = student ? 'none' : 'block';\n"
    "\n"
    "            renderTeacherFeedback(student ? sPin : null);"
)

ANCHOR_TASK = '        const TASK_NAME = "HL9 Sleep Clinic 10-Station Audit";'
NEW_TASK = ANCHOR_TASK + '''

        // ---- Teacher feedback (read-only) ---------------------------------
        // Populated from hl9_sleep_feedback.js, which tools/marks_md.py --sync
        // generates from the teacher-edited HL9_SleepClinic_901_Marks.md.
        // Band: 4 Stellar | 3 Satisfactory | 2 Needs work.
        function renderTeacherFeedback(pin) {
            const box = document.getElementById('teacherFeedback');
            if (!box) return;
            const store = window.HL9_SLEEP_FEEDBACK || {};
            const row = pin ? store[String(pin).trim().toUpperCase()] : null;
            if (!row || (!row.comment && !row.band)) { box.style.display = 'none'; return; }
            const bandEl = document.getElementById('tfBand');
            if (bandEl) bandEl.textContent = row.band ? (row.band + ' ' + (row.bandName || '')) : '';
            const bodyEl = document.getElementById('tfBody');
            if (bodyEl) bodyEl.textContent = row.comment || '';
            box.style.display = 'block';
        }
        // -------------------------------------------------------------------
'''

STEPS = [
    ("script tag", ANCHOR_SCRIPT, NEW_SCRIPT),
    ("feedback panel", ANCHOR_PANEL, NEW_PANEL),
    ("login hook", ANCHOR_HOOK, NEW_HOOK),
    ("render fn", ANCHOR_TASK, NEW_TASK),
]


def patch(path):
    rel = os.path.relpath(path, ROOT)
    if not os.path.exists(path):
        print(f"MISSING  {rel}")
        return
    src = open(path, encoding="utf-8").read()
    changed = 0
    for name, old, new in STEPS:
        if new in src:
            print(f"  SKIP     {name} (already patched)")
            continue
        if old not in src:
            print(f"  !ANCHOR  {name} - not found, skipped")
            continue
        src = src.replace(old, new, 1)
        changed += 1
        print(f"  +        {name}")
    if changed:
        open(path, "w", encoding="utf-8").write(src)
    print(f"{'PATCHED' if changed else 'NO CHANGE'}  {rel}")


print("Adding the Teacher feedback field to the HL9 10-Station Audit assignment.")
for c in COPIES:
    patch(c)
print()
print("Field reads: Student_System/hl9_sleep_feedback.js")
print("Regenerate it after editing the marks file:  python tools/marks_md.py --sync")
