// class_seating_data.js — room layout + seat-assignment snapshots for
// Class_Startup.html's seating popup.
//
// SOURCE ORDER on the slide (best first):
//   1. seating doc browser storage ("sp2_<homeroom>") — live edits in browser
//   2. legacy browser storage ("sp_<homeroom>")
//   3. snapshots here — { "<homeroom>": { updated, seats: {seatNumber: "Name"} } }
//   4. alphabetical roster fallback (students_roster_data.js)
//      (a stored copy that exactly equals the matching `legacy` or `superseded`
//       map is treated as a stale copy and ignored)
//
// Room 8 physical blueprint (v4, Oct 2026 reshuffle — 29 desks in 3 cluster rows):
//   - Front row:  5 clusters, 2-2-2-3-3 = 12 desks (seats 1..12) — both 3-clusters same gender
//   - Middle row: 4 clusters, 2-2-2-3   =  9 desks (seats 13..21)
//   - Back row:   4 clusters, 2-2-2-2   =  8 desks (seats 22..29)
//   - Teacher desk: back-right corner
//   Seats are numbered front-to-back, left-to-right within each row.
//   Placement guideline (DW): trustworthy students in the back row (nearest
//   the teacher desk); cluster pairs follow "who I sit well with" where known.
//
// `superseded` keeps the v3 (Sept 2026) seat maps these snapshots replace — the
// slide uses them to auto-drop stale browser-storage copies of the old plan.
// `legacy` keeps the pre-reshuffle (old wall-layout) seat maps — same drop rule.
//
// `adaptationSeats` — per homeroom, seat numbers whose placement is
// adaptation-constrained: the occupant has a documented adaptation this
// placement satisfies, or sits beside an adaptation-paired peer. DATA ONLY:
// never render, print, or project it on any student-facing surface, and never
// write the reason here — per-seat reasons live only in the private repo
// (../bihipri-27/curriculum-planning-priv/ADAPTATIONS-REFERENCE-2026-09-30.md).
// Tools may read it to avoid breaking compliance when reshuffling seats.
// NOTE (2026-10-03): no homeroom carries adaptationSeats yet on the v3 maps —
// the Sept-30 tags were written against the PRE-v3 layout (preserved in
// Student_System-priv/class_seating_data_PRE-v3-adapt-2026-09-30.js.bak) and
// must be re-derived against v3 before re-tagging.
// UPDATE (2026-10-05): layout is now v4 (Oct 2026 reshuffle) — re-derivation
// still pending; re-tag against v4 when done.

window.CLASS_SEATING = {
    version: 4,
    totalDesks: 29,
    homeroomOf: {
        "902-CIT": "902", "902-HL": "902", "902-HOMEROOM": "902",
        "901-CIT": "901", "901-HL": "901",
        "903-CIT": "903", "903-HL": "903",
        "801-HE": "801", "802-HE": "802", "803-HE": "803", "804-HE": "804"
    },
    snapshots: {
        "901": {
            updated: "2026-10-02-roomv4",
            seats: {
                "1": "Trenton J.", "2": "Benjamin L.", "3": "Adie R.", "4": "Abby E.",
                "5": "Nolan C.", "6": "Johnny C.", "7": "Anastasia S.", "8": "Aurelia M.",
                "9": "Roselyn B.", "10": "Lauren L.", "11": "Cameo S.", "12": "Madeleine T.",
                "13": "Tess B.", "14": "Clara B.", "15": "Drew J.", "16": "Duncan M.",
                "17": "Olivia D.", "18": "Danielle P.", "19": "Isaac N.", "20": "Finn G.",
                "21": "Justin A.", "22": "Avery P.", "23": "Marty P.", "24": "Brielle F.",
                "25": "Nova B.", "26": "Aiden H.", "27": "Doun K."
            }
        },
        "902": {
            updated: "2026-10-02-roomv4",
            seats: {
                "1": "Noah B.", "2": "Arlo J.", "3": "Sofie S.", "4": "Nova T.",
                "5": "Nolan C.", "6": "Douglas L.", "7": "Hannah S.", "8": "Jordan S.",
                "9": "Marla L.", "10": "Lyla F.", "11": "Thomas O.",
                "13": "Gemma B.", "14": "Sofia K.", "15": "Mhareon O.", "16": "Oscar P.",
                "17": "Berlin C.", "18": "Chelsea R.", "19": "Jax M.", "20": "Jordan H.",
                "21": "Tristan H.", "22": "Zackory N.", "23": "John B.", "24": "Mona A.",
                "25": "Anna T.", "26": "Simon M.", "27": "Seb H."
            }
        },
        "903": {
            updated: "2026-10-02-roomv4",
            seats: {
                "1": "Evan S.", "2": "Zeiden S.", "3": "Gwenna W.", "4": "Maia R.",
                "5": "Jacob M.", "6": "Walter D.", "7": "Kossy U.", "8": "Tommy M.",
                "9": "Liam M.", "10": "Andrew M.", "11": "Zana S.", "12": "Addy C.",
                "13": "Daphne M.", "14": "Chie M.", "15": "Misha C.", "16": "Avery F.",
                "17": "Kenzie L.", "18": "Oliver S.", "19": "Callum M.", "20": "Zoe M.",
                "21": "Milo H.", "22": "Oscar D.", "23": "Ben F.", "24": "Pauline S.",
                "25": "Patience S.", "26": "Ava G.", "27": "April F.", "28": "Michelle N.",
                "29": "Bella K."
            }
        },
        "801": {
            updated: "2026-10-02-roomv4",
            seats: {
                "1": "Samuel Mil", "2": "Martin V.", "3": "Alex R.", "4": "Julia T.",
                "5": "Zephyr G.", "6": "Samuel Mac", "7": "Ainslie M.", "8": "Ruby C.",
                "9": "Kenzie K.", "10": "Juliet M.", "11": "Ruby M.", "12": "Talia D.",
                "13": "Samuel S.", "14": "Jaela L.", "15": "Nehemiah S.", "16": "Jason D.",
                "17": "Fiona S.", "18": "Marieke M.", "19": "Steven E.", "20": "Shaviah O.",
                "21": "James T.", "22": "Samuel H.", "23": "Jayden L.", "24": "Sydney S.",
                "25": "Alex W.", "26": "Nikolas S.", "27": "Trey L.", "28": "Artem P.",
                "29": "Mae'ijah D."
            }
        },
        "802": {
            updated: "2026-10-02-roomv4",
            seats: {
                "1": "David C.", "2": "Amit K.", "3": "Mikaela V.", "4": "Katie G.",
                "5": "Caleb C.", "6": "Loughlan C.", "7": "Bella F.", "8": "Sophie H.",
                "9": "Hadley D.", "10": "Aria S.", "11": "Mairi L.", "12": "Gianna W.",
                "13": "Alice M.", "14": "Lillian W.", "15": "Drew B.", "16": "Miles G.",
                "17": "Michaela M.", "19": "Aliiza B.", "20": "Scarlett T.", "21": "Lena R.",
                "22": "Hendy B.", "23": "William E.", "24": "Jada R.", "25": "Myah H.",
                "26": "Marcus G.", "27": "Sam H.", "28": "Emmet M.", "29": "Misha K."
            }
        },
        "803": {
            updated: "2026-10-02-roomv4",
            seats: {
                "1": "Yohan B.", "2": "Emmanuel V.", "3": "Dorian G.", "4": "Stella G.",
                "5": "La'Monte B.", "6": "Drew M.", "7": "Nev C.", "8": "JL B.",
                "9": "Isla K.", "10": "Marley W.", "11": "Sarah A.", "12": "Feng L.",
                "13": "Beau B.", "14": "Haruki T.", "15": "Elijah T.", "16": "Theron H.",
                "17": "Enid B.", "18": "Jon M.", "19": "Evabel C.", "20": "Ziegfried A.",
                "21": "Amelia M.", "22": "Alex J.", "23": "Jason B.", "24": "Chandrika L.",
                "25": "Tiyasha B.", "26": "Muhammad N.", "27": "Santaya M.", "28": "Ben V."
            }
        },
        "804": {
            updated: "2026-10-02-roomv4",
            seats: {
                "1": "Timi A.", "2": "Taneil T.", "3": "Vasylyna B.", "4": "Arielle S.",
                "5": "Habib B.", "7": "Rosie M.", "8": "Heavenly D.", "9": "Cameron M.",
                "10": "Ezra O.", "11": "Molly G.", "12": "Charlotte M.",
                "13": "Cora A.", "14": "Sophie R.", "15": "Margot D.", "16": "Charles T.",
                "17": "Kate D.", "18": "Elizabeth L.", "19": "Theo D.", "21": "Jeremiah S.",
                "22": "Max P.", "23": "Caspian D.", "24": "Demetrius S.", "25": "Marielle H.",
                "26": "Hasan S.", "27": "Khovin Y.", "28": "Jack A.", "29": "Ronn M."
            }
        },
        "7 ILT": {
            updated: "2026-09-21-v2",
            seats: {
                "1": "Eolann B.", "2": "Tyrese B.", "3": "Ahmed B.", "4": "Veronika Bo.",
                "5": "Tate B.", "6": "Oliver B.", "7": "Sofiia B.", "8": "Gabriel B.",
                "9": "Ainsley C.", "10": "Carson D.", "11": "Lyla G.", "12": "Malikee G.",
                "13": "Oscar H.", "14": "Sadie H.", "15": "Mykyta M.", "16": "Taonga M.",
                "17": "Ruby N.", "18": "Ava N.", "19": "Elle R.", "20": "Madison R.",
                "21": "Zacharia S.", "22": "Briem S.", "23": "Carson T.", "24": "Oliver W.",
                "25": "Veronika Z."
            }
        }
    },
    // superseded — the v3 (Sept 2026) maps that the roomv4 snapshots above replace.
    // A browser-stored copy exactly equal to one of these is a stale copy of the
    // old plan and is dropped (same rule as `legacy`).
    superseded: {
        "901": {
            seats: {
                "1": "Trenton J.", "2": "Benjamin L.", "3": "Adie R.", "4": "Abby E.",
                "5": "Nolan C.", "6": "Johnny C.", "7": "Anastasia S.", "8": "Aurelia M.",
                "9": "Roselyn B.", "10": "Avery P.", "11": "Marty P.", "12": "Tess B.",
                "13": "Clara B.", "14": "Drew J.", "15": "Duncan M.", "16": "Olivia D.",
                "17": "Danielle P.", "18": "Isaac N.", "19": "Finn G.", "20": "Justin A.",
                "23": "Brielle F.", "24": "Nova B.", "25": "Aiden H.", "26": "Doun K.",
                "27": "Lauren L.", "28": "Cameo S.", "29": "Madeleine T."
            }
        },
        "902": {
            seats: {
                "1": "Noah B.", "2": "Arlo J.", "3": "Sofie S.", "4": "Nova T.",
                "5": "Nolan C.", "6": "Douglas L.", "7": "Hannah S.", "8": "Jordan S.",
                "9": "Marla L.", "10": "Zackory N.", "11": "John B.", "12": "Gemma B.",
                "13": "Sofia K.", "14": "Mhareon O.", "15": "Oscar P.", "16": "Berlin C.",
                "17": "Chelsea R.", "18": "Jax M.", "19": "Jordan H.", "20": "Tristan H.",
                "23": "Mona A.", "24": "Anna T.", "25": "Simon M.", "26": "Seb H.",
                "27": "Lyla F.", "28": "Thomas O."
            }
        },
        "903": {
            seats: {
                "1": "Evan S.", "2": "Ben F.", "3": "Gwenna W.", "4": "Maia R.",
                "5": "Misha C.", "6": "Avery F.", "7": "Bella K.", "8": "Liam M.",
                "9": "Michelle N.", "10": "Jacob M.", "11": "Walter D.", "12": "Pauline S.",
                "13": "Patience S.", "14": "Oscar D.", "15": "Ava G.", "16": "Daphne M.",
                "17": "Chie M.", "18": "Callum M.", "19": "Zoe M.", "20": "Milo H.",
                "21": "Kenzie L.", "22": "Zeiden S.", "23": "Kossy U.", "24": "Tommy M.",
                "25": "April F.", "26": "Oliver S.", "27": "Andrew M.", "28": "Zana S.",
                "29": "Addy C."
            }
        },
        "801": {
            seats: {
                "1": "Samuel Mil", "2": "Martin V.", "3": "Alex R.", "4": "Julia T.",
                "5": "Zephyr G.", "6": "Samuel Mac", "7": "Ainslie M.", "8": "Ruby C.",
                "9": "Kenzie K.", "10": "Nikolas S.", "11": "Trey L.", "12": "Samuel S.",
                "13": "Jaela L.", "14": "Nehemiah S.", "15": "Jason D.", "16": "Fiona S.",
                "17": "Marieke M.", "18": "Steven E.", "19": "Shaviah O.", "20": "James T.",
                "21": "Samuel H.", "22": "Jayden L.", "23": "Sydney S.", "24": "Alex W.",
                "25": "Artem P.", "26": "Mae'ijah D.", "27": "Juliet M.", "28": "Ruby M.",
                "29": "Talia D."
            }
        },
        "802": {
            seats: {
                "1": "David C.", "2": "Amit K.", "3": "Mikaela V.", "4": "Katie G.",
                "5": "Caleb C.", "6": "Loughlan C.", "7": "Bella F.", "8": "Sophie H.",
                "9": "Hadley D.", "10": "Emmet M.", "11": "Misha K.", "12": "Alice M.",
                "13": "Lillian W.", "14": "Drew B.", "15": "Miles G.", "16": "Michaela M.",
                "18": "Aliiza B.", "19": "Scarlett T.", "20": "Lena R.", "21": "Hendy B.",
                "22": "William E.", "23": "Jada R.", "24": "Myah H.", "25": "Marcus G.",
                "26": "Sam H.", "27": "Aria S.", "28": "Mairi L.", "29": "Gianna W."
            }
        },
        "803": {
            seats: {
                "1": "Yohan B.", "2": "Emmanuel V.", "3": "Dorian G.", "4": "Stella G.",
                "5": "La'Monte B.", "6": "Drew M.", "7": "Nev C.", "8": "JL B.",
                "9": "Isla K.", "10": "Muhammad N.", "11": "Santaya M.", "12": "Beau B.",
                "13": "Haruki T.", "14": "Elijah T.", "15": "Theron H.", "16": "Enid B.",
                "17": "Jon M.", "18": "Evabel C.", "19": "Ziegfried A.", "20": "Amelia M.",
                "21": "Alex J.", "22": "Jason B.", "23": "Chandrika L.", "24": "Tiyasha B.",
                "25": "Ben V.", "27": "Marley W.", "28": "Sarah A.", "29": "Feng L."
            }
        },
        "804": {
            seats: {
                "1": "Timi A.", "2": "Taneil T.", "3": "Vasylyna B.", "4": "Arielle S.",
                "5": "Habib B.", "7": "Rosie M.", "8": "Heavenly D.", "9": "Cameron M.",
                "10": "Hasan S.", "11": "Khovin Y.", "12": "Cora A.", "13": "Sophie R.",
                "14": "Margot D.", "15": "Charles T.", "16": "Kate D.", "17": "Elizabeth L.",
                "18": "Theo D.", "20": "Jeremiah S.", "21": "Max P.", "22": "Caspian D.",
                "23": "Demetrius S.", "24": "Marielle H.", "25": "Jack A.", "26": "Ronn M.",
                "27": "Ezra O.", "28": "Molly G.", "29": "Charlotte M."
            }
        }
    },
    legacy: {
        "901": {
            seats: {
                "1": "Trenton J.", "2": "Benjamin L.", "3": "Adie R.", "4": "Abby E.",
                "5": "Nolan C.", "6": "Johnny C.", "7": "Anastasia S.", "8": "Aurelia M.",
                "9": "Roselyn B.", "10": "Avery P.", "11": "Marty P.", "12": "Tess B.",
                "13": "Clara B.", "14": "Drew J.", "15": "Duncan M.", "16": "Olivia D.",
                "17": "Danielle P.", "18": "Isaac N.", "19": "Finn G.", "20": "Justin A.",
                "23": "Brielle F.", "24": "Nova B.", "25": "Aiden H.", "26": "Doun K.",
                "27": "Lauren L.", "28": "Cameo S.", "29": "Madeleine T."
            }
        },
        "902": {
            seats: {
                "1": "Noah B.", "2": "Arlo J.", "3": "Sofie S.", "4": "Nova T.",
                "5": "Nolan C.", "6": "Douglas L.", "7": "Hannah S.", "8": "Jordan S.",
                "9": "Marla L.", "10": "Zackory N.", "11": "John B.", "12": "Gemma B.",
                "13": "Sofia K.", "14": "Mhareon O.", "15": "Oscar P.", "16": "Berlin C.",
                "17": "Chelsea R.", "18": "Jax M.", "19": "Jordan H.", "20": "Tristan H.",
                "23": "Mona A.", "24": "Anna T.", "25": "Simon M.", "26": "Seb H.",
                "27": "Lyla F.", "28": "Thomas O."
            }
        },
        "903": {
            seats: {
                "1": "Evan S.", "2": "Ben F.", "3": "Gwenna W.", "4": "Maia R.",
                "5": "Misha C.", "6": "Avery F.", "7": "Bella K.", "8": "Liam M.",
                "9": "Michelle N.", "10": "Jacob M.", "11": "Walter D.", "12": "Pauline S.",
                "13": "Patience S.", "14": "Oscar D.", "15": "Ava G.", "16": "Daphne M.",
                "17": "Chie M.", "18": "Callum M.", "19": "Zoe M.", "20": "Milo H.",
                "21": "Kenzie L.", "22": "Zeiden S.", "23": "Kossy U.", "24": "Tommy M.",
                "25": "April F.", "26": "Oliver S.", "27": "Andrew M.", "28": "Zana S.",
                "29": "Addy C."
            }
        },
        "801": {
            seats: {
                "1": "Samuel Mil", "2": "Martin V.", "3": "Alex R.", "4": "Julia T.",
                "5": "Zephyr G.", "6": "Samuel Mac", "7": "Ainslie M.", "8": "Ruby C.",
                "9": "Kenzie K.", "10": "Nikolas S.", "11": "Trey L.", "12": "Samuel S.",
                "13": "Jaela L.", "14": "Nehemiah S.", "15": "Jason D.", "16": "Fiona S.",
                "17": "Marieke M.", "18": "Steven E.", "19": "Shaviah O.", "20": "James T.",
                "21": "Samuel H.", "22": "Jayden L.", "23": "Sydney S.", "24": "Alex W.",
                "26": "Mae'ijah D.", "27": "Juliet M.", "28": "Ruby M.", "29": "Talia D.",
            }
        },
        "802": {
            seats: {
                "1": "David C.", "2": "Amit K.", "3": "Mikaela V.", "4": "Katie G.",
                "5": "Caleb C.", "6": "Loughlan C.", "7": "Bella F.", "8": "Sophie H.",
                "9": "Hadley D.", "10": "Emmet M.", "11": "Misha K.", "12": "Alice M.",
                "13": "Lillian W.", "14": "Drew B.", "15": "Miles G.", "16": "Michaela M.",
                "18": "Aliiza B.", "19": "Scarlett T.", "20": "Lena R.", "21": "Hendy B.",
                "22": "William E.", "23": "Jada R.", "24": "Myah H.", "25": "Marcus G.",
                "26": "Sam H.", "27": "Aria S.", "28": "Mairi L.", "29": "Gianna W.",
            }
        },
        "803": {
            seats: {
                "1": "Yohan B.", "2": "Emmanuel V.", "3": "Dorian G.", "4": "Stella G.",
                "5": "La'Monte B.", "6": "Drew M.", "7": "Nev C.", "8": "JL B.",
                "9": "Isla K.", "10": "Muhammad N.", "11": "Santaya M.", "12": "Beau B.",
                "13": "Haruki T.", "14": "Elijah T.", "15": "Theron H.", "16": "Enid B.",
                "17": "Jon M.", "18": "Evabel C.", "19": "Ziegfried A.", "20": "Amelia M.",
                "21": "Alex J.", "22": "Jason B.", "23": "Chandrika L.", "24": "Tiyasha B.",
                "25": "Ben V.", "27": "Marley W.", "28": "Sarah A.", "29": "Feng L.",
            }
        },
        "804": {
            seats: {
                "1": "Oritshetimehin A.", "2": "Taneil T.", "3": "Vasylyna B.", "4": "Arielle S.",
                "5": "Habib B.", "7": "Rosie M.", "8": "Heavenly D.", "9": "Cameron M.",
                "10": "Hasan S.", "11": "Khovin Y.", "12": "Cora A.", "13": "Sophie R.",
                "14": "Margot D.", "15": "Charles T.", "16": "Kate D.", "18": "Theo D.",
                "19": "Artem P.", "20": "Jeremiah S.", "21": "Max P.", "22": "Caspian D.",
                "23": "Demetrius S.", "24": "Marielle H.", "25": "Jack A.", "26": "Ronn M.",
                "27": "Ezra O.", "28": "Molly G.", "29": "Charlotte M."
            }
        }
    }
};
