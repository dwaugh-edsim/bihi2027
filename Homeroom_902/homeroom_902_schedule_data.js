// homeroom_902_schedule_data.js - the 10-day cycle rotation for Homeroom 902.
//
// ONE SOURCE OF TRUTH. This block used to live inline in
// 902_Today_Schedule_Deck.html; it was extracted so the deck and the projector
// display (Student_System/Class_Startup.html) can never disagree about what
// 902's day looks like. If the rotation changes, change it HERE - not in the
// deck. The deck loads this file and aliases SUBJECTS / PERIOD_TIMES /
// SCHEDULE_902 to the three exports below.
//
// Consumers:
//   902_Today_Schedule_Deck.html   - the full master/spotlight deck
//   Student_System/Class_Startup.html - the before-P1 homeroom view
//
// SHAPE
//   cycleAnchor / cycleLength  where the rotation starts (2026-09-14, a Monday
//                              = Day 1) and how many days it runs. To re-anchor
//                              after a schedule change, edit cycleAnchor.
//   periodTimes   1..5 -> '9:05 - 10:05 AM' etc. Must match the bell schedule
//                 in Class_Startup.html.
//   subjects      per-subject profile (label, materials, body) used by the
//                 deck's spotlight slides.
//   schedule      cycle day 1..10 -> dayName + p1..p5, each period carrying
//                 key/code/name/loc/notes and a type:
//                   room8   = meets in Room 8 with Mr. Waugh
//                   core    = core subject, elsewhere in the school
//                   special = specialist, elsewhere in the school

window.HOMEROOM_902 = {
    cycleAnchor: '2026-09-14',   // a Monday = Day 1
    cycleLength: 10,

    periodTimes: {
    1: '9:05 – 10:05 AM',
    2: '10:05 – 11:05 AM',
    3: '11:05 – 12:05 PM',
    4: '1:05 – 2:05 PM',
    5: '2:05 – 3:05 PM'
    },

    subjects: {
    PE: {
        icon: 'dumbbell', label: 'Physical Education',
        materials: ['Clean indoor running shoes (non-marking soles)', 'Water bottle', 'Chromebooks stay in Room 8'],
        body: 'Head straight to the gymnasium after morning homeroom announcements. Remember that Chromebooks stay in Room 8.'
    },
    SCI: {
        icon: 'flask', label: 'Science',
        materials: ['Science binder / notebook', 'Pencils and pens', 'Safety goggles when directed'],
        body: 'Arrive promptly with your science binder and pencils. Lab work starts on the bell.'
    },
    CIT: {
        icon: 'shield', label: 'Citizenship 9',
        materials: ['Both diagnostic sheets (Sheet 1 &amp; Sheet 2)', 'A pen', 'Chromebooks stay in Room 8 for the cart buffer'],
        body: 'Unit 1 diagnostic: the head-to-toe citizen and the three levels of civic engagement. Chromebooks stay in Room 8.'
    },
    MATH: {
        icon: 'calc', label: 'Mathematics',
        materials: ['Math binder', 'Pencils (graphite)', 'Calculator if issued'],
        body: 'Report with your math binder and pencils. Be in your seat when the bell rings.'
    },
    ELA: {
        icon: 'book', label: 'English Language Arts',
        materials: ['ELA notebook / binder', 'A writing implement', 'Reading log if issued'],
        body: 'Bring your ELA materials and be seated before the bell.'
    },
    HL: {
        icon: 'heart', label: 'Healthy Living 9',
        materials: ['Health journal', 'A pen or pencil'],
        body: 'Healthy Living runs in Room 8 with Mr. Waugh. Journals stay with you.'
    },
    ART: {
        icon: 'droplet', label: 'Visual Arts',
        materials: ['Sketchbook', 'Pencil and eraser', 'Art smock if issued'],
        body: 'Visual Arts in the Art Studio. Expect to be working on your hands.'
    },
    CS: {
        icon: 'laptop', label: 'Computer Science',
        materials: ['Notebook', 'Closed-toe shoes'],
        body: 'Computer Science in the Computer Lab. Log on with your student account.'
    },
    FR: {
        icon: 'globe', label: 'Core French',
        materials: ['French binder / vocab book', 'A writing implement'],
        body: 'Core French in the French Classroom. Bring your binder.'
    },
    ILT: {
        icon: 'clipboard', label: 'Independent Learning Time',
        materials: ['Your ILT task sheet', 'All materials for that task', 'Headphones if your task needs audio'],
        body: 'ILT is independent work time. Start your task in the first five minutes and ask for help early.'
    }
    },

    schedule: {
    1: {
        dayName: 'Monday',
        p1: { key: 'PE',     code: 'PE',    name: 'Physical Education',     loc: 'Gymnasium',          notes: 'Gymnasium. Indoor sneakers required.',                              type: 'special' },
        p2: { key: 'SCI',    code: 'SCI',   name: 'Science',                loc: 'Science Lab',        notes: 'Science Lab. Bring binder and pen/pencil.',                          type: 'core' },
        p3: { key: 'CIT',    code: 'CIT',   name: 'Citizenship 9',          loc: 'Room 8 (Mr. Waugh)', notes: 'Back in Room 8! Chromebooks stay in Room 8.',                        type: 'room8' },
        p4: { key: 'MATH',   code: 'MATH',  name: 'Mathematics',            loc: 'Math Room',          notes: 'Math Room. Bring binder and pencil.',                                type: 'core' },
        p5: { key: 'ELA',    code: 'ELA',   name: 'English Language Arts',  loc: 'ELA Classroom',      notes: 'ELA Classroom. 3:05 PM dismissal.',                                 type: 'core' }
    },
    2: {
        dayName: 'Tuesday',
        p1: { key: 'HL',     code: 'HL',    name: 'Healthy Living 9',       loc: 'Room 8 (Mr. Waugh)', notes: 'Start the day in Room 8 with Mr. Waugh!',                           type: 'room8' },
        p2: { key: 'CS',     code: 'CS',    name: 'Computer Science',       loc: 'Computer Lab',       notes: 'Computer Lab.',                                                        type: 'special' },
        p3: { key: 'ART',    code: 'ART',   name: 'Visual Arts',            loc: 'Art Studio',         notes: 'Art Studio.',                                                          type: 'special' },
        p4: { key: 'MATH',   code: 'MATH',  name: 'Mathematics',            loc: 'Math Room',          notes: 'Math Room. Bring binder and pencil.',                                type: 'core' },
        p5: { key: 'ELA',    code: 'ELA',   name: 'English Language Arts',  loc: 'ELA Classroom',      notes: 'ELA Classroom. 3:05 PM dismissal.',                                 type: 'core' }
    },
    3: {
        dayName: 'Wednesday',
        p1: { key: 'FR',     code: 'FRENCH', name: 'Core French',           loc: 'French Classroom',   notes: 'French Classroom. Bring French binder.',                            type: 'special' },
        p2: { key: 'MATH',   code: 'MATH',   name: 'Mathematics',           loc: 'Math Room',          notes: 'Math Room. Bring binder and pencil.',                                type: 'core' },
        p3: { key: 'PE',     code: 'PE',     name: 'Physical Education',    loc: 'Gymnasium',          notes: 'Gymnasium. Indoor sneakers required.',                              type: 'special' },
        p4: { key: 'ELA',    code: 'ELA',    name: 'English Language Arts', loc: 'ELA Classroom',      notes: 'ELA Classroom. Bring ELA binder.',                                 type: 'core' },
        p5: { key: 'HL',     code: 'HL',     name: 'Healthy Living 9',      loc: 'Room 8 (Mr. Waugh)', notes: 'Close the day in Room 8 with Mr. Waugh!',                           type: 'room8' }
    },
    4: {
        dayName: 'Thursday',
        p1: { key: 'ART',    code: 'ART',    name: 'Visual Arts',           loc: 'Art Studio',         notes: 'Art Studio.',                                                          type: 'special' },
        p2: { key: 'CIT',    code: 'CIT',    name: 'Citizenship 9',         loc: 'Room 8 (Mr. Waugh)', notes: 'In Room 8 with Mr. Waugh! Chromebooks in room.',                     type: 'room8' },
        p3: { key: 'SCI',    code: 'SCI',    name: 'Science',               loc: 'Science Lab',        notes: 'Science Lab. Bring binder and pencil.',                              type: 'core' },
        p4: { key: 'MATH',   code: 'MATH',   name: 'Mathematics',           loc: 'Math Room',          notes: 'Math Room. Bring binder and pencil.',                                type: 'core' },
        p5: { key: 'ELA',    code: 'ELA',    name: 'English Language Arts', loc: 'ELA Classroom',      notes: 'ELA Classroom. 3:05 PM dismissal.',                                 type: 'core' }
    },
    5: {
        dayName: 'Friday',
        p1: { key: 'PE',     code: 'PE',     name: 'Physical Education',    loc: 'Gymnasium',          notes: 'Gymnasium. Indoor sneakers required.',                              type: 'special' },
        p2: { key: 'ILT',    code: '9 ILT',  name: 'Grade 9 ILT',           loc: 'Room 8 (Mr. Waugh)', notes: 'Independent Learning Time in Room 8!',                            type: 'room8' },
        p3: { key: 'ELA',    code: 'ELA',    name: 'English Language Arts', loc: 'ELA Classroom',      notes: 'ELA Classroom. Bring ELA binder.',                                 type: 'core' },
        p4: { key: 'MATH',   code: 'MATH',   name: 'Mathematics',           loc: 'Math Room',          notes: 'Math Room. Bring binder and pencil.',                                type: 'core' },
        p5: { key: 'FR',     code: 'FRENCH', name: 'Core French',           loc: 'French Classroom',   notes: 'French Classroom. 3:05 PM dismissal.',                              type: 'special' }
    },
    6: {
        dayName: 'Monday',
        p1: { key: 'SCI',    code: 'SCI',   name: 'Science',               loc: 'Science Lab',        notes: 'Science Lab. Bring binder and pencil.',                              type: 'core' },
        p2: { key: 'ELA',    code: 'ELA',   name: 'English Language Arts', loc: 'ELA Classroom',      notes: 'ELA Classroom. Bring ELA binder.',                                 type: 'core' },
        p3: { key: 'FR',     code: 'FRENCH', name: 'Core French',           loc: 'French Classroom',   notes: 'French Classroom. Bring French binder.',                            type: 'special' },
        p4: { key: 'MATH',   code: 'MATH',  name: 'Mathematics',           loc: 'Math Room',          notes: 'Math Room. Bring binder and pencil.',                                type: 'core' },
        p5: { key: 'CIT',    code: 'CIT',   name: 'Citizenship 9',         loc: 'Room 8 (Mr. Waugh)', notes: 'Finish Monday in Room 8 with Mr. Waugh!',                          type: 'room8' }
    },
    7: {
        dayName: 'Tuesday',
        p1: { key: 'PE',     code: 'PE',     name: 'Physical Education',    loc: 'Gymnasium',          notes: 'Gymnasium. Indoor sneakers required.',                              type: 'special' },
        p2: { key: 'MATH',   code: 'MATH',   name: 'Mathematics',           loc: 'Math Room',          notes: 'Math Room. Bring binder and pencil.',                                type: 'core' },
        p3: { key: 'CS',     code: 'CS',     name: 'Computer Science',      loc: 'Computer Lab',       notes: 'Computer Lab.',                                                        type: 'special' },
        p4: { key: 'SCI',    code: 'SCI',    name: 'Science',               loc: 'Science Lab',        notes: 'Science Lab. Bring binder and pencil.',                              type: 'core' },
        p5: { key: 'ELA',    code: 'ELA',    name: 'English Language Arts', loc: 'ELA Classroom',      notes: 'ELA Classroom. 3:05 PM dismissal.',                                 type: 'core' }
    },
    8: {
        dayName: 'Wednesday',
        p1: { key: 'ART',    code: 'ART',    name: 'Visual Arts',           loc: 'Art Studio',         notes: 'Art Studio.',                                                          type: 'special' },
        p2: { key: 'FR',     code: 'FRENCH', name: 'Core French',           loc: 'French Classroom',   notes: 'French Classroom. Bring French binder.',                            type: 'special' },
        p3: { key: 'ELA',    code: 'ELA',    name: 'English Language Arts', loc: 'ELA Classroom',      notes: 'ELA Classroom. Bring ELA binder.',                                 type: 'core' },
        p4: { key: 'MATH',   code: 'MATH',   name: 'Mathematics',           loc: 'Math Room',          notes: 'Math Room. Bring binder and pencil.',                                type: 'core' },
        p5: { key: 'CIT',    code: 'CIT',    name: 'Citizenship 9',         loc: 'Room 8 (Mr. Waugh)', notes: 'Citizenship in Room 8 with Mr. Waugh!',                             type: 'room8' }
    },
    9: {
        dayName: 'Thursday',
        p1: { key: 'PE',     code: 'PE',     name: 'Physical Education',    loc: 'Gymnasium',          notes: 'Gymnasium. Indoor sneakers required.',                              type: 'special' },
        p2: { key: 'ELA',    code: 'ELA',    name: 'English Language Arts', loc: 'ELA Classroom',      notes: 'ELA Classroom. Bring ELA binder.',                                 type: 'core' },
        p3: { key: 'FR',     code: 'FRENCH', name: 'Core French',           loc: 'French Classroom',   notes: 'French Classroom. Bring French binder.',                            type: 'special' },
        p4: { key: 'MATH',   code: 'MATH',   name: 'Mathematics',           loc: 'Math Room',          notes: 'Math Room. Bring binder and pencil.',                                type: 'core' },
        p5: { key: 'HL',     code: 'HL',     name: 'Healthy Living 9',      loc: 'Room 8 (Mr. Waugh)', notes: 'In Room 8 with Mr. Waugh! 3:05 PM dismissal.',                     type: 'room8' }
    },
    10: {
        dayName: 'Friday',
        p1: { key: 'SCI',    code: 'SCI',   name: 'Science',               loc: 'Science Lab',        notes: 'Science Lab. Bring binder and pencil.',                              type: 'core' },
        p2: { key: 'ILT',    code: 'ILT',   name: 'ILT (Ms. Traille)',     loc: 'Assigned ILT Room',  notes: 'Assigned ILT Room with Ms. Traille.',                               type: 'special' },
        p3: { key: 'ELA',    code: 'ELA',   name: 'English Language Arts', loc: 'ELA Classroom',      notes: 'ELA Classroom. Bring ELA binder.',                                 type: 'core' },
        p4: { key: 'CIT',    code: 'CIT',   name: 'Citizenship 9',         loc: 'Room 8 (Mr. Waugh)', notes: 'In Room 8 with Mr. Waugh! Chromebooks in room.',                     type: 'room8' },
        p5: { key: 'MATH',   code: 'MATH',  name: 'Mathematics',           loc: 'Math Room',          notes: 'Math Room. 3:05 PM dismissal.',                                     type: 'core' }
    }
    }
};
