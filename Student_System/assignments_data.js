// assignments_data.js — per-course assignment registry + ASSIGNMENT → OUTCOME map.
// Used by Class_Startup.html: the Task Progress picker lists these (so the
// teacher chooses what the live view shows), and the LEARNING OUTCOME strip at the
// bottom shows the outcome matched to whichever assignment is on screen.
//
// MAINTENANCE (LLM-curated — the "dig into the outcomes doc and pick" loop):
//  1. When Mr. Waugh launches a new assignment, add one item here:
//       id        short slug
//       taskName  EXACT TASK_NAME the assignment page writes to the GAS ledger
//                 (grep the page for TASK_NAME — must match character for character)
//       short     projector-friendly label for the picker dropdown
//       match     RegExp that recognises this assignment's ledger/task text
//       outcome   the VERBATIM curriculum statement chosen from ../2026-27outcomes.md
//                 (repo root) — follow that doc's "How an agent chooses" steps
//       ref       the outcome's code from that doc (e.g. "CIT9 U5C", "HL9 CO1")
//                 plus a one-line why when the pick was close
//  2. Set `active` to the id the course is working on right now — new sections see it
//     at 0% until students save, and it is the outcome fallback when nothing is pinned.
//  3. Add the pick to the mapping table at the bottom of 2026-27outcomes.md.
//  Outcome resolution on the slide: teacher's ⚙ override → matched assignment
//  (this file) → lesson-map unit by next class # → course default.
window.COURSE_ASSIGNMENTS = {
    CIT9: {
        label: "Citizenship 9",
        active: "cit9-rent-case-file",
        items: [
            {
                id: "cit9-rent-case-file",
                taskName: "Citizenship 9 — Real Issues Case File #1: The Rent We Pay",
                short: "Real Issues Case File #1 · The Rent We Pay",
                match: /rent|real.?issues|case.?file|numbeo|cost.?of.?living/i,
                outcome: "Learners will evaluate strategies to meaningfully engage as citizens within a democratic process.",
                ref: "CIT9 U5C — facilitation key: engaged citizenship via the citizen loop (evidence → position → power → speech); U3A is the close alternate when the work period is data-heavy"
            },
            {
                id: "cit9-where-places",
                taskName: "The WHERE Project — Places Portfolio",
                short: "WHERE · Places Portfolio",
                match: /where|places|portfolio/i,
                outcome: "Learners will evaluate the consequences of action and inaction as twenty-first century global citizens.",
                ref: "CIT9 U6A — personal/community/global places"
            },
            {
                id: "cit9-current-issues-diagnostic",
                taskName: "Citizenship 9 Current Issues Diagnostic",
                short: "Current Issues Diagnostic",
                match: /diagnostic|intake|current.?events|civic.?profile/i,
                outcome: "Learners will evaluate how perceptions of current issues are influenced by various media, and how this shapes actions, choices, and reactions.",
                ref: "CIT9 U4A — issue-ranking diagnostic that seeded the Real Issues slate"
            }
        ]
    },
    HL9: {
        label: "Healthy Living 9",
        active: "hl9-operation-addictive",
        items: [
            {
                id: "hl9-operation-addictive",
                taskName: "HL9 Operation Addictive by Design (Class 2)",
                short: "Operation Addictive · by Design",
                match: /addictive|hook.?machine|phone.?apps/i,
                outcome: "Learners will evaluate health behaviours that promote short-term and long-term health",
                ref: "HL9 CO1 — Hook Machine/attention economy sits in the health-behaviours unit; CO10 is the close alternate"
            },
            {
                id: "hl9-sleep-clinic",
                taskName: "HL9 Sleep Clinic 10-Station Audit",
                short: "Sleep Clinic · 10-Station Audit",
                match: /sleep|clinic|station/i,
                outcome: "Learners will evaluate health behaviours that promote short-term and long-term health",
                ref: "HL9 CO1 — sleep/technology behaviours"
            },
            {
                id: "hl9-human-skills",
                taskName: "Dartmouth High Human Skills Blueprint",
                short: "Human Skills Blueprint",
                match: /human.?skills|blueprint|transition/i,
                outcome: "Learners will evaluate healthy ways to navigate change and/or challenging life circumstances",
                ref: "HL9 CO9 — human skills for the high-school transition"
            },
            {
                id: "hl9-grade8-audit",
                taskName: "Healthy Living 9: Grade 8 Learning Audit",
                short: "Grade 8 Learning Audit",
                match: /grade.?8|learning.?audit/i,
                outcome: "Learners will evaluate health behaviours that promote short-term and long-term health",
                ref: "HL9 CO1 — diagnostic reviewing prior health-behaviour learning"
            }
        ]
    },
    HL8: {
        label: "Healthy Living 8",
        active: "hl8-junction-smoke-detector",
        items: [
            {
                id: "hl8-junction-smoke-detector",
                taskName: "HL8 Junction Exhibit 1: Smoke Detector vs Strategist",
                short: "Smoke Detector vs. Strategist · Junction",
                match: /junction|smoke.?detector|strategist|amygdala|sam.?s.?world/i,
                outcome: "Learners will analyse how life skills influence physical, mental, emotional, social, and spiritual health",
                ref: "HL8 CO1 — outcomes doc tags CO1 'junction': life-skills decision-making + coping (grounding pause, boundary text, trusted adult) inside the Sam's World peer-conflict story. CO3 (brain function/stress) is the close alternate for the amygdala science."
            },
            {
                id: "hl8-5dimension-audit",
                taskName: "HL8 5-Dimension Systems Audit",
                short: "5-Dimension Systems Audit",
                match: /dimension|systems.?audit|5-?d/i,
                outcome: "Learners will analyse the relationships between health behaviours and physical, mental, emotional, social, and spiritual health",
                ref: "HL8 CO2 — sleep/screens/activity/eating dimensions vs health"
            },
            {
                id: "hl8-grade7-audit",
                taskName: "Healthy Living 8: Grade 7 Learning Audit",
                short: "Grade 7 Learning Audit",
                match: /grade.?7|learning.?audit/i,
                totalFields: 24,
                outcome: "Learners will analyse the relationships between health behaviours and physical, mental, emotional, social, and spiritual health",
                ref: "HL8 CO2 — diagnostic reviewing prior health-behaviour learning"
            }
        ]
    }
};
