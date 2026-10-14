// homeroom_902_notices.js — seeded notices for the before-P1 homeroom view on
// Class_Startup.html (the "902s who meet in the room" screen shown ahead of Period 1).
//
// PRECEDENCE — read this before editing:
//   1. If a row for section `902-HOMEROOM` exists in the GAS `Class_Slide` tab
//      (with any announcement text), THAT wins. Mr. Waugh types it on the projector
//      with ⚙ while the homeroom view is up, or adds the row from the Sheet app on
//      his phone — live, no PIN needed for a Sheet edit, no redeploy.
//   2. Only when that row is missing or empty does this file supply the text.
//
// So this file is the SEED / fallback: it guarantees the morning screen has
// something on it, and it is what an agent session edits when Mr. Waugh dictates
// notices. The moment he types his own, this file is ignored — so if he later
// clears the Class_Slide row, the old seed comes back. Delete the matching entry
// here when that happens (or ask an agent to).
//
// Keep it short: these are read from the back of the room before first period.
window.HOMEROOM_902_NOTICES = {
    announcements: [
        "Bring in your Take Your Kid to Work form.",
        "Be in Room 8 by 8:55 — before O Canada."
    ]
};
