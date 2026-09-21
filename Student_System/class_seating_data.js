// class_seating_data.js — room layout + seat-assignment snapshots for
// Class_Opening_Slide.html's seating popup (matching seating-plan-v2.html).
//
// SOURCE ORDER on the slide (best first):
//   1. seating-plan-v2.html browser storage ("sp2_<homeroom>") — live edits in browser
//   2. legacy browser storage ("sp_<homeroom>")
//   3. snapshots here — { "<homeroom>": { updated, seats: {seatNumber: "Name"} } }
//   4. alphabetical roster fallback (students_roster_data.js)
//
// Room 8 physical blueprint (29 desks total):
//   - Front row: 4 pairs of 2 = 8 desks (1..8)
//   - Second row: 3 pairs of 2 = 6 desks (9..14)
//   - Left wall: Doorway aisle top, cluster of 4 desks below (15..18)
//   - Right wall: Cupboards top, cluster of 3 desks below (19..21)
//   - Back wall (windows): 8 desks (22..29)
//   - Back right corner: Teacher desk

window.CLASS_SEATING = {
    version: 2,
    totalDesks: 29,
    homeroomOf: {
        "902-CIT": "902", "902-HL": "902",
        "901-CIT": "901", "901-HL": "901",
        "903-CIT": "903", "903-HL": "903",
        "801-HE": "801", "802-HE": "802", "803-HE": "803", "804-HE": "804"
    },
    snapshots: {
        "901": {
            updated: "2026-09-21-v2",
            seats: {
                "1": "Johnny C.", "2": "Drew J.", "3": "Justin A.", "4": "Benjamin L.",
                "5": "Clara B.", "6": "Tess B.", "7": "Finn G.", "8": "Trenton J.",
                "9": "Nova B.", "10": "Madeleine T.", "11": "Avery P.", "12": "Marty P.",
                "13": "Isaac N.", "14": "Nolan C.", "15": "Danielle P.", "16": "Lauren L.",
                "17": "Cameo S.", "18": "Aurelia M.", "19": "Abby E.", "20": "Brielle F.",
                "21": "Adie R.", "22": "Olivia D.", "23": "Anastasia S.", "24": "Roselyn B.",
                "25": "Aiden H.", "26": "Duncan M.", "27": "Doun K."
            }
        },
        "902": {
            updated: "2026-09-21-v4",
            seats: {
                "1": "Seb H.", "2": "Jax M.", "3": "Sofia K.", "4": "Sofie S.",
                "5": "Berlin C.", "6": "Mona A.", "7": "Anna T.", "8": "Nova T.",
                "9": "Gemma B.", "10": "Marla L.", "11": "John B.", "12": "Tristan H.",
                "13": "Noah B.", "14": "Arlo J.", "15": "Zackory N.", "16": "Thomas O.",
                "17": "Jordan H.", "18": "Lyla F.", "19": "Chelsea R.", "20": "Jordan S.",
                "21": "Hannah S.", "22": "Douglas L.", "23": "Simon M.", "24": "Oscar P.",
                "25": "Nolan C.", "26": "Mhareon O.", "27": "Morgan P."
            }
        },
        "903": {
            updated: "2026-09-21-v3",
            seats: {
                "1": "Evan S.", "2": "Tommy M.", "3": "Gwenna W.", "4": "Maia R.",
                "5": "Milo H.", "6": "Jacob M.", "7": "Michelle N.", "8": "Chie M.",
                "9": "Zeiden S.", "10": "Kossy U.", "11": "Patience S.", "12": "Pauline S.",
                "13": "Zoe M.", "14": "Kenzie L.", "15": "Avery F.", "16": "Oscar D.",
                "17": "Misha C.", "18": "Daphne M.", "19": "April F.", "20": "Ava G.",
                "21": "Bella K.", "22": "Addy C.", "23": "Zana S.", "24": "Andrew M.",
                "25": "Callum M.", "26": "Walter D.", "27": "Liam M.", "28": "Ben F.",
                "29": "Oliver S."
            }
        },
        "801": {
            updated: "2026-09-21-v2",
            seats: {
                "1": "Jaela L.", "2": "Sydney S.", "3": "Kenzie K.", "4": "Ruby C.",
                "5": "Julia T.", "6": "Alex W.", "7": "Ainslie M.", "8": "Juliet M.",
                "9": "Fiona S.", "10": "Marieke M.", "11": "Mae'ijah D.", "12": "Talia D.",
                "13": "Ruby M.", "14": "Shaviah O.", "15": "Zephyr G.", "16": "Jason D.",
                "17": "Steven E.", "18": "Samuel Mac", "19": "Trey L.", "20": "James T.",
                "21": "Nikolas S.", "22": "Nehemiah S.", "23": "Jayden L.", "24": "Alex R.",
                "25": "Martin V.", "26": "Samuel H.", "27": "Samuel Mil", "28": "Samuel S."
            }
        },
        "802": {
            updated: "2026-09-21-v2",
            seats: {
                "1": "Miles G.", "2": "Drew B.", "3": "Jada R.", "4": "Katie G.",
                "5": "Mikaela V.", "6": "Lillian W.", "7": "Hadley D.", "8": "Bella F.",
                "9": "Sophie H.", "10": "Mairi L.", "11": "Myah H.", "12": "Michaela M.",
                "13": "David C.", "14": "William E.", "15": "Caleb C.", "16": "Misha K.",
                "17": "Marcus G.", "18": "Alice M.", "19": "Loughlan C.", "20": "Amit K.",
                "21": "Sam H.", "22": "Emmet M.", "23": "Lena R.", "24": "Scarlett T.",
                "25": "Aliiza B.", "26": "Aria S.", "27": "Gianna W.", "28": "Hendy B."
            }
        },
        "803": {
            updated: "2026-09-21-v2",
            seats: {
                "1": "La'Monte B.", "2": "Alex J.", "3": "Theron H.", "4": "Dorian G.",
                "5": "Stella G.", "6": "Amelia M.", "7": "Elijah T.", "8": "Muhammad N.",
                "9": "Nev C.", "10": "Enid B.", "11": "Chandrika L.", "12": "Tiyasha B.",
                "13": "Sarah A.", "14": "Isla K.", "15": "JL B.", "16": "Evabel C.",
                "17": "Santaya M.", "18": "Ziegfried A.", "19": "Feng L.", "20": "Marley W.",
                "21": "Yohan B.", "22": "Jason B.", "23": "Emmanuel V.", "24": "Haruki T.",
                "25": "Beau B.", "26": "Ben V.", "27": "Jon M.", "28": "Drew M."
            }
        },
        "804": {
            updated: "2026-09-21-v2",
            seats: {
                "1": "Max P.", "2": "Charles T.", "3": "Cora A.", "4": "Vasylyna B.",
                "5": "Arielle S.", "6": "Heavenly D.", "7": "Kate D.", "8": "Margot D.",
                "9": "Marielle H.", "10": "Rosie M.", "11": "Caspian D.", "12": "Molly G.",
                "13": "Charlotte M.", "14": "Theo D.", "15": "Ronn M.", "16": "Cameron M.",
                "17": "Artem P.", "18": "Jack A.", "19": "Jeremiah S.", "20": "Hasan S.",
                "21": "Khovin Y.", "22": "Oritshetimehin A.", "23": "Habib B.", "24": "Demetrius S.",
                "25": "Taneil T.", "26": "Oceanne O.", "27": "Sophie R."
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
    }
};
