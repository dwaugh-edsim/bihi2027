// display_instructions_data.js — the INSTRUCTIONS panel on Class_Startup.html
// (the projector "do-now" slide). This file is the panel's only data source.
//
// WHY A STATIC FILE: the slide used to read per-student assignment progress from the
// GAS ledger. That is off "for now" — the display no longer polls the ledger at all.
// Instructions are therefore curated here, in the repo, and the projector picks them up
// on page load. Mr. Waugh dictates the wording; an agent session formats and files it
// (same workflow as the class-log runbook in CLASS_LOG_README.md — no PIN, no sheet edit).
//
// SHAPE
//   keys    either a section key ("903-HL") or a course key ("CIT9" | "HL9" | "HL8").
//           Section wins over course, so a course-wide instruction can be overridden
//           for one class. The ten section keys are:
//             902-CIT 902-HL 901-CIT 901-HL 903-CIT 903-HL 801-HE 802-HE 803-HE 804-HE
//   heading  panel title. Defaults to "Do This Now" when omitted.
//   steps    array of instruction lines, shown as a big numbered list (projector-legible).
//   note     optional closing line, set apart under the steps.
//   owed     optional block — or an ARRAY of blocks — for work students still have to
//            make up. Deliberately styled as a warning so it reads as "these are the
//            ones", and it holds FIRST NAMES ONLY: a short accountability nudge, never
//            a grade and never a reason.
//              owed:   { label: "…", names: ["First", "First"] }
//              owed: [ { label, names }, { label, names } ]
//            Keep it alphabetical; keep it current or delete it. Anything a student has
//            since handed in should be removed, not left to look like they're missing.
//
// A section with no entry here (and no course entry) simply shows no panel — the slide
// falls back to agenda + announcements only.
//
// NOTE: the agenda (from the section's plan in the class log) is separate and still
// live. Any agenda line that reads the same as an instruction here is dropped from the
// agenda automatically, so the same step is never printed twice on the display.
window.DISPLAY_INSTRUCTIONS = {
    // ── Thu Oct 8 ──────────────────────────────────────────────────────────
    // P1 901-CIT · P2 804-HE · P4 801-HE · P5 902-HL.
    // The Oct-7 CIT9 course entry (HL9 Class 3 questions + National + Speech
    // tutorial) came out after that class ran — 901-CIT falls back to the agenda
    // until today's steps are dictated. 804-HE falls through to the HL8 course
    // entry below. 902-CIT (next meets Oct 9) keeps its Oct-7 entry with the
    // owed lists, now without Berlin C.
    "801-HE": {
        steps: [
            "Sam III — video + written story."
        ]
    },

    // ── Wed Oct 7 ──────────────────────────────────────────────────────────
    "HL8": {
        steps: [
            "Junction Part 2 (The Tipping Point) — paper versions.",
            "Finish today."
        ]
    },
    "902-CIT": {
        steps: [
            "The Speech — a quick tutorial on what the assignment is all about.",
            "Quick 2-minute item from The National (Monday's broadcast) — https://www.youtube.com/watch?v=yhQ8elK08ek&t=1085s",
            "If finished: start on the HL9 Class 1 items around the room (Sleep Clinic)."
        ],
        // Carried verbatim from Mon Oct 5 (this section's last meeting) — prune at
        // P5 once there's fresh hand-in info; don't let stale names linger past it.
        owed: [
            { label: "Still owe the Citizenship quiz", names: ["Anna", "Noah", "Sofia", "Thomas"] },
            { label: "Sleep Audit not handed in yet", names: [
                "Anna T.", "Arlo", "Chelsea", "Jordan H.", "Nolan",
                "Sofie", "Thomas", "Tristan"
            ] },
            { label: "Numbeo — done, feedback waiting in the assignment", names: [
                "Anna", "Chelsea", "Douglas", "Gemma", "Jax", "Lyla", "Mona",
                "Noah", "Nolan", "Nova T.", "Oscar", "Thomas"
            ] },
            { label: "Numbeo — not submitted / not started", names: [
                "Arlo", "Hannah", "Jordan", "Marla L.", "Sofia", "Sofie", "Zackory"
            ] }
        ]
    },

    // ── Mon Oct 5, afternoon (carried — these sections don't meet Oct 7) ───
    "901-HL": {
        steps: [
            "Sleep app slideshows — submit in Google Classroom."
        ],
        owed: [
            { label: "Still owe the Citizenship quiz", names: ["Anastasia", "Cameo", "Oliva"] }
        ]
    },
    "903-HL": {
        steps: [
            "Submit the paper version of the 10 Station Sleep Audit."
        ]
    }
};
