// class_seating_data.js — room layout + seat-assignment snapshots for
// Class_Startup.html's seating popup.
//
// SOURCE ORDER on the slide (best first):
//   1. seating doc browser storage ("sp2_<homeroom>") — live edits in browser
//   2. legacy browser storage ("sp_<homeroom>")
//   3. snapshots here — { "<homeroom>": { updated, seats: {seatNumber: "Name"} } }
//   4. alphabetical roster fallback (students_roster_data.js)
//      (a stored copy that exactly equals the matching `legacy` map is treated
//       as a stale pre-reshuffle copy and ignored)
//
// Room 8 physical blueprint (v3, Sept 2026 reshuffle — 29 desks in 3 cluster rows):
//   - Front row:  5 clusters, 2-2-2-3-2 = 11 desks (seats 1..11)
//   - Middle row: 4 clusters, 2-2-2-3  =  9 desks (seats 12..20)
//   - Back row:   4 clusters, 2-2-2-3  =  9 desks (seats 21..29)
//   - Teacher desk: back-right corner
//   Seats are numbered front-to-back, left-to-right within each row.
//
// `legacy` keeps the pre-reshuffle (old wall-layout) seat maps — reference only,
// the slide uses it solely to detect stale browser-storage copies.

window.CLASS_SEATING = {
    version: 3,
    totalDesks: 29,
    homeroomOf: {
        "902-CIT": "902", "902-HL": "902",
        "901-CIT": "901", "901-HL": "901",
        "903-CIT": "903", "903-HL": "903",
        "801-HE": "801", "802-HE": "802", "803-HE": "803", "804-HE": "804"
    },
    snapshots: {
        "901": {
            updated: "2026-09-29-roomv3",
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
            updated: "2026-09-29-roomv3",
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
            updated: "2026-09-29-roomv3",
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
            updated: "2026-09-29-roomv3",
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
            updated: "2026-09-29-roomv3",
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
            updated: "2026-09-29-roomv3",
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
            updated: "2026-09-29-roomv3",
            seats: {
                "1": "Timi A.", "2": "Taneil T.", "3": "Vasylyna B.", "4": "Arielle S.",
                "5": "Habib B.", "7": "Rosie M.", "8": "Heavenly D.", "9": "Cameron M.",
                "10": "Hasan S.", "11": "Khovin Y.", "12": "Cora A.", "13": "Sophie R.",
                "14": "Margot D.", "15": "Charles T.", "16": "Kate D.", "17": "Elizabeth L.",
                "18": "Theo D.", "20": "Jeremiah S.", "21": "Max P.", "22": "Caspian D.",
                "23": "Demetrius S.", "24": "Marielle H.", "25": "Jack A.", "26": "Ronn M.",
                "27": "Ezra O.", "28": "Molly G.", "29": "Charlotte M."
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
