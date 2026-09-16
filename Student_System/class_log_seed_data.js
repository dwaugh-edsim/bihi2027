// class_log_seed_data.js — offline seed for Class_Log_Tracker.html.
// The tracker overwrites this with a live GET (?action=get_class_log) as soon as
// the Apps Script backend answers, so these samples only show until then.
// Regenerate after a batch of logging: open <script-url>?action=get_class_log
// in a browser and paste the entries + plans here (any LLM can do it — see
// CLASS_LOG_README.md). The entries below are SAMPLES — delete once live.
window.CLASS_LOG_SEED = {
    generated: "2026-09-16",
    note: "Snapshot of the Class_Log + Class_Plan tabs. Live sync replaces it at view time.",
    entries: [
        {
            date: "2026-09-14",
            section: "902-CIT",
            course: "CIT9",
            classNo: "4",
            did: "Introduced three levels of government; started the levels organizer.",
            next: "Finish organizer for Thu — bring to next class.",
            timestamp: "2026-09-14T15:10:00Z"
        },
        {
            date: "2026-09-15",
            section: "902-HL",
            course: "HL9",
            classNo: "2",
            did: "Hook Machine deck — phones by design discussion; handed out Quiz 1 study sheet.",
            next: "Quiz 1 next class — study sheet due.",
            timestamp: "2026-09-15T15:05:00Z"
        }
    ],
    plans: {}
};
