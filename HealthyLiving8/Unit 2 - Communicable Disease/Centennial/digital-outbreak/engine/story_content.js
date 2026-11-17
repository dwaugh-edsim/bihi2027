/**
 * Case 55: Outbreak at Centennial - Story Content (data only, no logic)
 * Centennial Junior High setting. Grade 7-9, tense but never gory:
 * illness spreads quietly; no injury or horror detail. Fictional school only.
 * Runs in Browser (<script>), Node, and Google Apps Script (bundled into Code.gs).
 */
(function (root) {

  'use strict';

  var PLACES = [
    'the West Wing', 'the East Wing', 'the Cafeteria', 'the Gymnasium',
    'the Library', 'the Science Lab', 'the Nurse\'s Office', 'the Main Office',
    'the Courtyard', 'Lockers Row', 'the Auditorium', 'the Bus Loop'
  ];

  var JOBS = [
    'hall monitor', 'cafeteria helper', 'library prefect', 'team captain',
    'yearbook photographer', 'debate team member', 'robotics club member', 'art club painter',
    'student council rep', 'safety patrol member', 'peer tutor', 'lunch monitor',
    'choir member', 'basketball guard', 'skateboarder', 'baker\'s kid',
    'grade 8 classmate', 'the principal\'s helper', 'the tech crew member', 'the plant waterer',
    'the lost-and-found keeper', 'the bus rider', 'the detention helper', 'the poster hanger',
    'the scorekeeper', 'the snack sharer', 'the door holder', 'the pencil sharpener',
    'the whiteboard eraser', 'the fire-drill leader', 'the supply closet organizer', 'the bell ringer',
    'the map table helper', 'the microscope cleaner', 'the fish-tank feeder', 'the lost mitten finder'
  ];

  // Fragment pools. Each entry: { id, s: tense line, c: calm line }.
  var POOLS = {

    weather: [
      { id: 'w1', s: 'Rain streaks the gymnasium windows all night, drumming like fingertips on glass.', c: 'Rain taps quietly on the school roof.' },
      { id: 'w2', s: 'A cold November wind rattles the portable classroom doors.', c: 'A cold wind blows through the courtyard.' },
      { id: 'w3', s: 'Fog rolls in from the field behind the school and hides the parking lot.', c: 'Fog drifts over the back field.' },
      { id: 'w4', s: 'The hallway lights flicker once, twice, then hold steady.', c: 'The hallway lights stay on all night.' },
      { id: 'w5', s: 'Thunder rolls over Centennial as the storm hits the bus loop.', c: 'Thunder rolls in the distance.' },
      { id: 'w6', s: 'The heating vents hiss all night, pushing warm air down the empty West Wing.', c: 'The vents hum softly overnight.' },
      { id: 'w7', s: 'Snow flurries swirl past the library windows at midnight.', c: 'Light snow falls after midnight.' },
      { id: 'w8', s: 'The air in the corridor hangs heavy and still, like nobody has breathed in it for hours.', c: 'The corridor is quiet and still.' }
    ],
    setting: [
      { id: 's1', s: 'Down in the West Wing, one locker door hangs open on a broken latch.', c: 'The West Wing is dark and quiet.' },
      { id: 's2', s: 'The cafeteria tables are stacked, but one chair is pulled out and left facing the door.', c: 'The cafeteria is empty at night.' },
      { id: 's3', s: 'In the science lab, a microscope light is still on over an empty bench.', c: 'The science lab sits untouched.' },
      { id: 's4', s: 'The gymnasium curtain is half-drawn, hiding the far end of the court.', c: 'The gym is dark.' },
      { id: 's5', s: 'A single backpack sits on the front steps of the main office.', c: 'The front steps are empty.' },
      { id: 's6', s: 'Somewhere near the bus loop, a bike lock rattles though there is no wind.', c: 'The bus loop is silent.' },
      { id: 's7', s: 'The nurse\'s office door is unlocked; the light inside is off.', c: 'The nurse\'s office is dark.' },
      { id: 's8', s: 'A projector in the library hums to life by itself, casting a rectangle on the wall.', c: 'The library projector is off.' }
    ],
    discovery: [
      { id: 'd1', s: 'In the morning, one desk in the West Wing is untouched - books open, chair pushed in, nobody there.', c: 'A desk in the West Wing is still made up in the morning.' },
      { id: 'd2', s: 'The class attendance sheet has one name with no checkmark beside it.', c: 'One name on the sheet is unmarked.' },
      { id: 'd3', s: 'A lunch tray is left on the cafeteria table, food half-eaten and cold.', c: 'A lunch tray waits on a cafeteria table.' },
      { id: 'd4', s: 'The nurse\'s office log shows a new entry, timestamped 2:14 AM.', c: 'The nurse\'s log has a new morning entry.' },
      { id: 'd5', s: 'A water bottle sits abandoned on the gym floor, cap off.', c: 'A water bottle lies by the gym door.' },
      { id: 'd6', s: 'Someone\'s Chromebook is still open at the library table, screen glowing.', c: 'A Chromebook sleeps at the library table.' },
      { id: 'd7', s: 'A note is taped to the main office door: a single word, written in a hurry.', c: 'A note is taped to the main office door.' },
      { id: 'd8', s: 'The lost-and-found box has a new item nobody claims: a hoodie, still warm.', c: 'A hoodie sits in the lost-and-found box.' }
    ],
    clue: [
      { id: 'c1', s: 'A crumpled tissue lies next to the pencil sharpener.', c: 'A used tissue is in the bin.' },
      { id: 'c2', s: 'Two students\' water bottles were swapped - the labels are crossed out and rewritten.', c: 'Two water bottles sit side by side.' },
      { id: 'c3', s: 'A shared pair of headphones passed around a desk cluster yesterday.', c: 'Headphones rest on a desk.' },
      { id: 'c4', s: 'The classroom duck plush changed hands at the swap table at lunch.', c: 'The class plush sits on the shelf.' },
      { id: 'c5', s: 'Someone used the library keyboard right before the bell, then left early.', c: 'The library keyboard was used today.' },
      { id: 'c6', s: 'A cough echoes from the back row of the East Wing - and three heads turn at once.', c: 'Someone coughs in the back row.' },
      { id: 'c7', s: 'The hand-sanitizer bottle by the door is nearly empty already.', c: 'The sanitizer bottle is half full.' },
      { id: 'c8', s: 'A desk drawer in the West Wing is open, and the snack stash inside is gone.', c: 'A desk drawer stands open.' }
    ],
    aftermath: [
      { id: 'a1', s: 'Nobody slept well. Every bedroom window along the street shows a light still on.', c: 'Nobody slept well last night.' },
      { id: 'a2', s: 'The class holds its breath at the door, counting heads before anyone goes in.', c: 'The class counts heads at the door.' },
      { id: 'a3', s: 'Whispers run down the hallway like a shiver - who sat next to whom at lunch.', c: 'Whispers pass down the hallway.' },
      { id: 'a4', s: 'The empty desk in the corner of the room casts a long shadow across the floor.', c: 'The empty desk casts a long shadow.' },
      { id: 'a5', s: 'A second empty desk joins the first.', c: 'Another desk stands empty.' },
      { id: 'a6', s: 'Students sit farther apart than usual, backpacks zipped, hands in pockets.', c: 'Students sit quietly at their desks.' },
      { id: 'a7', s: 'Somebody keeps checking their throat and temperature at the back of the room.', c: 'Somebody checks how they feel.' },
      { id: 'a8', s: 'Nobody wants to say the missing name out loud before first period.', c: 'Nobody says the missing name out loud.' }
    ],
    closing: [
      { id: 'x1', s: 'Daylight is the only shield left. Use it well.', c: 'Daylight is all we have. Use it well.' },
      { id: 'x2', s: 'The class must decide who to trust before the next night.', c: 'Trust must be decided by morning.' },
      { id: 'x3', s: 'Somewhere in this school, a carrier is wearing a healthy face.', c: 'Someone here is not what they seem.' },
      { id: 'x4', s: 'Wash your hands early tonight. Then wash them again.', c: 'Wash your hands tonight.' },
      { id: 'x5', s: 'Talk carefully. Someone contagious is listening.', c: 'Speak carefully. Someone is listening.' },
      { id: 'x6', s: 'The outbreak is not over yet.', c: 'This is not over.' },
      { id: 'x7', s: 'Count your classmates. Then count them again.', c: 'Count your classmates. Twice.' },
      { id: 'x8', s: 'Morning came, but the sickness did not leave with the dark.', c: 'Morning came, but the sickness stayed.' }
    ]

  };

  var EPITAPHS = [
    'I knew the duck trading at lunch was a bad idea.',
    'Tell my plants I\'m sorry I missed watering them.',
    'Vote for the quiet one. The quiet one is suspicious.',
    'I was patient zero and I regret nothing.',
    'Next time we wash hands BEFORE the swap table.',
    'Someone in this room is patient zero right now. Check them.'
  ];

  var GHOST_RULES = 'You are now home learning in silence. Keep a poker face, stay quiet, and do not signal to the class. Hold [ID] in the corner only to peek at the truth board.';

  var BEAT_COPY = {
    nightEnds: 'Night falls over Centennial Junior High...',
    nightEndsRound: 'Night {round} ends at Centennial Junior High...',
    eyesUp: 'Morning announcements are starting. Eyes up.',
    nobodyTaken: 'No new cases overnight.',
    quietDawn: 'A quiet morning at Centennial. Everyone is at their desk.',
    councilVoted: 'The class has voted.',
    chosen: 'The class has chosen Seat #{seat}.',
    noVerdict: 'No isolation order. Suspicion deepens.',
    lastWords: '{name} may speak for {sec} seconds.',
    lastWordsExile: '{name} may speak for {sec} seconds before going home to isolate.',
    sealed: 'Their secret goes with them.',
    takenInNight: 'You woke up feeling sick. You are a case.',
    exiledByCouncil: 'The class has sent you home to isolate.',
    packStrikeSuccess: 'Your infection spread to Seat #{seat}.',
    packStrikeProtected: 'Your target was protected by the Nurse.',
    packTeacherDecided: 'The carriers could not agree, so the teacher decided the night.',
    victorySchool: 'The school wins! The outbreak is contained - Centennial Junior High is safe!',
    victoryCarriers: 'The carriers win. The school closes for deep cleaning!',
    epitaphPrompt: 'Choose one line to leave behind (no free text):',
    // Hallway whispers: student night-watch hunches aggregated into the dawn script.
    whisperSome: 'Hallway whispers: the class seems to suspect {seat} ({name}) - {count} of {total} hunches.',
    whisperNone: 'The class hunches are scattered - nobody agrees on anyone.'
  };

  var api = {
    PLACES: PLACES,
    JOBS: JOBS,
    POOLS: POOLS,
    EPITAPHS: EPITAPHS,
    GHOST_RULES: GHOST_RULES,
    BEAT_COPY: BEAT_COPY
  };

  root.StoryContent = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
