// class_log_lesson_maps.js — per-course lesson maps + OUTCOME statements
// Used by Class_Log_Tracker.html (suggested-next hint) and
// Class_Startup.html (agenda titles + the outcome strip administrators see).
//
// MAINTENANCE (LLM-friendly):
//  - classes:  { "classNumber": "Short title" }       — exact lesson names
//  - units:    { from, to, title, outcome }           — unit spans + the course
//                outcome that span addresses (shown on the opening slide)
//  - defaultOutcome — course-level outcome shown when no class # is known
window.CLASS_LOG_LESSON_MAPS = {
    CIT9: {
        label: "Citizenship 9",
        total: 90,
        // COURSE DIRECTION (teacher, Sep 17): pivoted away from the Head-to-Toe
        // Citizen opener. Stated sequence: current events / cost-of-living
        // assignment → checkpoint quiz (NS/Canada map · 3 levels of government ·
        // cost-of-living basics) → new lesson on taking a moral stand at a cost
        // (inspired by the Ed Sheeran × Macklemore moment). In progress with
        // Antigravity — numbering below is provisional until he logs real classes.
        upcoming: [
            "Current events: cost of living (Real Issues dossier)",
            "Checkpoint quiz — NS/Canada map · 3 levels of government · cost-of-living basics",
            "Moral stand lesson — taking a stand, often at a cost (Ed Sheeran × Macklemore)"
        ],
        defaultOutcome: "Students analyse and exercise the rights and responsibilities of Canadian citizenship — locally and globally — through inquiry, service learning, and civic action.",
        units: [
            { from: 1, to: 8, title: "U1 · Engaged Citizenship (SL Launch)",
              outcome: "Students engage as active citizens by identifying community needs and designing a service learning project." },
            { from: 9, to: 22, title: "U2 · Who Am I as a Citizen?",
              outcome: "Students analyse identity, worldviews, rights, and responsibilities — including treaties and reconciliation in Mi'kma'ki." },
            { from: 23, to: 31, title: "U2 wrap · Check-ins & Quiz 1",
              outcome: "Students demonstrate understanding of identity, rights, and responsibilities of citizenship in Canada." },
            { from: 32, to: 42, title: "U3 · Financial Citizenship",
              outcome: "Students apply financial literacy to real-life citizenship decisions — budgeting, earning, and spending wisely." },
            { from: 43, to: 52, title: "U4 · Digital Citizenship",
              outcome: "Students evaluate digital footprints, media messages, and their rights and responsibilities online." },
            { from: 53, to: 71, title: "U5 · Governance + Mock Election",
              outcome: "Students analyse how governments work at all levels and participate in the electoral process." },
            { from: 72, to: 82, title: "U6 · Global Citizenship",
              outcome: "Students investigate global issues and take informed action as global citizens." },
            { from: 83, to: 90, title: "SL Showcase + Capstone",
              outcome: "Students present their service learning and reflect on their growth as citizens." }
        ],
        classes: {
            1: "Course launch",
            5: "Three Levels of Government",
            6: "Cost-of-living / Numbeo (Real Issues)",
            7: "SL Proposal summative",
            8: "SL Implementation launch",
            9: "TRC / Orange Shirt (U2 open)"
        }
    },
    HL9: {
        label: "Healthy Living 9",
        total: 55,
        defaultOutcome: "Students demonstrate health literacy, decision-making, and communication skills for lifelong healthy living.",
        units: [
            { from: 1, to: 3, title: "O1 · Health Behaviours & Cognitive Performance (24-Hour Reckoning)",
              outcome: "Students analyse how sleep, screen, and activity habits affect cognitive performance and wellbeing." },
            { from: 4, to: 4, title: "High School Transition & Academic Agency",
              outcome: "Students develop strategies to manage their health and learning through the high school transition." },
            { from: 5, to: 8, title: "O2-A · Sexual & Reproductive Health (Decision Fork)",
              outcome: "Students demonstrate knowledge of sexual and reproductive health and practise informed decision-making." },
            { from: 9, to: 13, title: "O3 · Health Literacy (Clinic Navigator)",
              outcome: "Students access and evaluate valid health information and health services in their community." },
            { from: 14, to: 18, title: "O4 · Communication Skills (Words That Heal/Hurt)",
              outcome: "Students demonstrate respectful communication and refusal skills in real-life scenarios." },
            { from: 19, to: 21, title: "O2-B · Sexual & Reproductive Health: Applied Depth",
              outcome: "Students apply sexual and reproductive health knowledge to complex, real-world situations." },
            { from: 22, to: 25, title: "O5 · Gender Norms & Biases (Norm Machine)",
              outcome: "Students analyse gender norms, stereotypes, and biases and their impact on health and relationships." },
            { from: 26, to: 29, title: "O6 · Gender-Based Violence (Recognition First)",
              outcome: "Students recognize unhealthy relationship patterns and gender-based violence, and know how to respond." },
            { from: 30, to: 34, title: "O7 · Personal Safety & Injury Prevention (Digital Footprint Defender)",
              outcome: "Students apply personal-safety strategies and manage their digital footprint to prevent harm." },
            { from: 35, to: 38, title: "O8 · Bystander Intervention (Intervention Playbook)",
              outcome: "Students practise safe and effective bystander intervention strategies." },
            { from: 39, to: 42, title: "O9 · Navigating Change (Rest & Reset Lab)",
              outcome: "Students apply coping strategies to navigate change, loss, and transition in healthy ways." },
            { from: 43, to: 47, title: "O10 · Impact of Addiction (Addiction Continuum)",
              outcome: "Students analyse the impact of addiction on individuals, families, and communities." },
            { from: 48, to: 51, title: "O11 · Help-Seeking Efficacy (The Hard Conversation)",
              outcome: "Students identify when and how to seek help for themselves and others." },
            { from: 52, to: 55, title: "Capstone Portfolio",
              outcome: "Students synthesize their learning into a personal health portfolio with goals for life beyond Grade 9." }
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
        defaultOutcome: "Students build life skills, health literacy, and healthy relationship skills for wellbeing.",
        units: [
            { from: 1, to: 7, title: "O1 · Life Skills & Health (Junction sim)",
              outcome: "Students apply decision-making and life skills to everyday health situations." },
            { from: 8, to: 15, title: "O2 · Health Behaviours (24-Hour Audit)",
              outcome: "Students analyse their health behaviours (sleep, screens, activity) and set improvement goals." },
            { from: 16, to: 23, title: "O3 · Mental Health Literacy (Behind the Feed)",
              outcome: "Students demonstrate mental health literacy — recognizing stress, seeking support, and supporting others." },
            { from: 24, to: 31, title: "O4 · Sexual & Reproductive Health (The Clinic)",
              outcome: "Students demonstrate age-appropriate knowledge of sexual and reproductive health." },
            { from: 32, to: 40, title: "O5 · Healthy Relationships & Violence Prevention (Relationship Radar)",
              outcome: "Students recognize healthy and unhealthy relationship behaviours and practise violence prevention." },
            { from: 41, to: 47, title: "O6 · Substance Misuse Prevention (Pressure Point)",
              outcome: "Students analyse influences on substance use and practise refusal and help-seeking strategies." },
            { from: 48, to: 50, title: "Capstone",
              outcome: "Students synthesize their Healthy Living learning into personal wellbeing goals." }
        ],
        classes: {
            1: "5 Dimensions Systems Audit"
        }
    }
};
