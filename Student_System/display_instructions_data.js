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
//   owed     optional block for work a student still has to make up. Deliberately
//           styled as a warning so it reads as "these are the ones", and it holds
//            FIRST NAMES ONLY — a short accountability nudge, never a grade or a
//            reason. Keep it alphabetical; keep it current or delete it.
//           { label: "Missing Citizenship Quiz", names: ["First", "First"] }
//
// A section with no entry here (and no course entry) simply shows no panel — the slide
// falls back to agenda + announcements only.
//
// NOTE: the agenda (from the section's plan in the class log) is separate and still
// live. Any agenda line that reads the same as an instruction here is dropped from the
// agenda automatically, so the same step is never printed twice on the display.
window.DISPLAY_INSTRUCTIONS = {
    "903-HL": {
        steps: [
            "Submit the paper version of the 10 Station Sleep Audit."
        ]
    }
};
