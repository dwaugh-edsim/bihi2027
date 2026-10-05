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
    // ── Mon Oct 5, afternoon ────────────────────────────────────────────────
    "901-HL": {
        steps: [
            "Sleep app slideshows — submit in Google Classroom."
        ],
        owed: [
            { label: "Still owe the Citizenship quiz", names: ["Anastasia", "Cameo", "Oliva"] }
        ]
    },
    "902-CIT": {
        steps: [
            "10 Station Sleep Audit — if your sheet is not in yet, get a paper version from me.",
            "60-second case to the government — drafting today. Already handed in: Jax, Oscar, Sofie.",
            "Numbeo Part 2 sheet — career math AND the reflection box. Hand it in before you leave."
        ],
        owed: [
            { label: "Still owe the Citizenship quiz", names: ["Anna", "Noah", "Sofia", "Thomas"] },
            { label: "Sleep Audit not handed in yet", names: [
                "Anna T.", "Arlo", "Berlin", "Chelsea", "Jordan H.", "Nolan",
                "Sofie", "Thomas", "Tristan"
            ] },
            { label: "Numbeo — done, feedback waiting in the assignment", names: [
                "Anna", "Chelsea", "Douglas", "Gemma", "Jax", "Lyla", "Mona",
                "Noah", "Nolan", "Nova T.", "Oscar", "Thomas"
            ] },
            { label: "Numbeo — not submitted / not started", names: [
                "Arlo", "Berlin", "Hannah", "Jordan", "Marla L.", "Sofia", "Sofie", "Zackory"
            ] }
        ]
    },
    "903-HL": {
        steps: [
            "Submit the paper version of the 10 Station Sleep Audit."
        ]
    }
};
