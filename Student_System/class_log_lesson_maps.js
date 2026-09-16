// class_log_lesson_maps.js — per-course lesson maps for Class_Log_Tracker.html
// Powers the "Suggested next" hint: when you log a class number, the tracker
// suggests class (n+1) and names it via `classes[n]` or the unit it falls in.
//
// MAINTENANCE (LLM-friendly): to add or rename a lesson, edit the `classes`
// map — { "classNumber": "Short title" }. Unit spans come from the course
// outlines (cit9-outline.md, HL9/HL8-COMPRESSED-OUTLINE-2026-27.md).
window.CLASS_LOG_LESSON_MAPS = {
    CIT9: {
        label: "Citizenship 9",
        total: 90,
        units: [
            { from: 1, to: 8, title: "U1 · Engaged Citizenship (SL Launch)" },
            { from: 9, to: 22, title: "U2 · Who Am I as a Citizen?" },
            { from: 23, to: 31, title: "U2 wrap · Check-ins & Quiz 1" },
            { from: 32, to: 42, title: "U3 · Financial Citizenship" },
            { from: 43, to: 52, title: "U4 · Digital Citizenship" },
            { from: 53, to: 71, title: "U5 · Governance + Mock Election" },
            { from: 72, to: 82, title: "U6 · Global Citizenship" },
            { from: 83, to: 90, title: "SL Showcase + Capstone" }
        ],
        classes: {
            1: "Head-to-Toe Citizen intro",
            5: "Three Levels of Government",
            7: "SL Proposal summative",
            8: "SL Implementation launch",
            9: "TRC / Orange Shirt (U2 open)"
        }
    },
    HL9: {
        label: "Healthy Living 9",
        total: 55,
        units: [
            { from: 1, to: 3, title: "O1 · Health Behaviours & Cognitive Performance (24-Hour Reckoning)" },
            { from: 4, to: 4, title: "High School Transition & Academic Agency" },
            { from: 5, to: 8, title: "O2-A · Sexual & Reproductive Health (Decision Fork)" },
            { from: 9, to: 13, title: "O3 · Health Literacy (Clinic Navigator)" },
            { from: 14, to: 18, title: "O4 · Communication Skills (Words That Heal/Hurt)" },
            { from: 19, to: 21, title: "O2-B · Sexual & Reproductive Health: Applied Depth" },
            { from: 22, to: 25, title: "O5 · Gender Norms & Biases (Norm Machine)" },
            { from: 26, to: 29, title: "O6 · Gender-Based Violence (Recognition First)" },
            { from: 30, to: 34, title: "O7 · Personal Safety & Injury Prevention (Digital Footprint Defender)" },
            { from: 35, to: 38, title: "O8 · Bystander Intervention (Intervention Playbook)" },
            { from: 39, to: 42, title: "O9 · Navigating Change (Rest & Reset Lab)" },
            { from: 43, to: 47, title: "O10 · Impact of Addiction (Addiction Continuum)" },
            { from: 48, to: 51, title: "O11 · Help-Seeking Efficacy (The Hard Conversation)" },
            { from: 52, to: 55, title: "Capstone Portfolio" }
        ],
        classes: {
            1: "Sleep Telemetry Sprint",
            2: "Hook Machine · Operation Addictive by Design (Quiz 1 follows)",
            3: "Sleep Clinic debrief"
        }
    },
    HL8: {
        label: "Healthy Living 8",
        total: 50,
        note: "802-HE runs a 37-class adaptation of this map (prep-slot resolution pending).",
        units: [
            { from: 1, to: 7, title: "O1 · Life Skills & Health (Junction sim)" },
            { from: 8, to: 15, title: "O2 · Health Behaviours (24-Hour Audit)" },
            { from: 16, to: 23, title: "O3 · Mental Health Literacy (Behind the Feed)" },
            { from: 24, to: 31, title: "O4 · Sexual & Reproductive Health (The Clinic)" },
            { from: 32, to: 40, title: "O5 · Healthy Relationships & Violence Prevention (Relationship Radar)" },
            { from: 41, to: 47, title: "O6 · Substance Misuse Prevention (Pressure Point)" },
            { from: 48, to: 50, title: "Capstone" }
        ],
        classes: {
            1: "5 Dimensions Systems Audit"
        }
    }
};
