/**
 * Digital Werewolf - Story Content (data only, no logic)
 * Moonhollow Harbour setting. Grade 7-9, spooky but never gory:
 * people are taken / vanish / are found missing. No blood, no injury detail.
 * Runs in Browser (<script>), Node, and Google Apps Script (bundled into Code.gs).
 */
(function (root) {
  'use strict';

  var PLACES = [
    'Lantern Docks', 'Old Mill', 'Chapel Hill', 'Market Square',
    'Fisher\'s Row', 'the Lighthouse', 'North Path', 'Council Hall'
  ];

  var JOBS = [
    'baker', 'blacksmith', 'harbour keeper', 'rope maker', 'chandler', 'miller',
    'lamplighter', 'ferryman', 'net mender', 'carpenter', 'beekeeper', 'bell ringer',
    'watchman', 'tinker', 'cooper', 'weaver', 'fishmonger', 'carter',
    'scribe', 'midwife', 'ostler', 'pie seller', 'schoolteacher', 'locksmith',
    'grave digger', 'sailmaker', 'tanner', 'potter', 'archer', 'herbalist',
    'clock winder', 'bridge toll keeper', 'cobbler', 'falconer', 'mummer',
    'chandler\'s apprentice', 'night soil collector', 'organ grinder', 'spice trader', 'wheelwright'
  ];

  // Fragment pools. Each entry: { id, s: spooky line, c: campfire line }.
  var POOLS = {
    weather: [
      { id: 'w1', s: 'A thick sea fog rolls in off the harbour and swallows the street lamps one by one.', c: 'Fog drifts over the harbour like a grey blanket.' },
      { id: 'w2', s: 'Cold wind sweeps down from Chapel Hill and rattles every shutter in town.', c: 'A cold wind blows down the hill.' },
      { id: 'w3', s: 'Low clouds drag across the moon, and the whole town goes quiet and still.', c: 'Clouds cross the moon.' },
      { id: 'w4', s: 'A drizzle starts just after midnight, drumming soft on the rooftops.', c: 'Light rain taps the roofs.' },
      { id: 'w5', s: 'The harbour water goes glassy and black, mirroring a sky full of stars.', c: 'The harbour lies still under the stars.' },
      { id: 'w6', s: 'Sleet scratches at the windows like tiny fingernails.', c: 'Sleet taps the windows.' },
      { id: 'w7', s: 'The wind changes direction at midnight, carrying the smell of salt and smoke.', c: 'The wind shifts, carrying salt air.' },
      { id: 'w8', s: 'Not a leaf moves on Fisher\'s Row; the air hangs heavy and cold.', c: 'The street lies quiet and cold.' }
    ],
    setting: [
      { id: 's1', s: 'Down at the Lantern Docks, the last lantern gutters out.', c: 'The last lantern at the docks goes out.' },
      { id: 's2', s: 'Somewhere near the Old Mill, a floorboard creaks in an empty house.', c: 'A board creaks in the old mill.' },
      { id: 's3', s: 'The Chapel Hill bell tolls twelve, and every door in Moonhollow is bolted.', c: 'The chapel bell tolls twelve.' },
      { id: 's4', s: 'Market Square is deserted; the stalls stand with their canvas flapping.', c: 'Market Square stands empty.' },
      { id: 's5', s: 'At the Lighthouse, the great lamp turns its slow circle over empty water.', c: 'The lighthouse beam turns over the sea.' },
      { id: 's6', s: 'On North Path, hoof prints appear in the mud and then stop.', c: 'Footprints in the mud on North Path just stop.' },
      { id: 's7', s: 'Council Hall\'s windows are dark except for one candle that will not stay lit.', c: 'One candle flickers in Council Hall.' },
      { id: 's8', s: 'Fisher\'s Row smells of woodsmoke and low tide.', c: 'Fisher\'s Row smells of smoke and the sea.' }
    ],
    discovery: [
      { id: 'd1', s: 'In the morning, one cottage door stands ajar and nobody answers the knock.', c: 'In the morning, a door stands open and nobody answers.' },
      { id: 'd2', s: 'The council table has one chair pulled out and left empty.', c: 'A chair at the council table is left empty.' },
      { id: 'd3', s: 'Wet prints lead to a doorstep, and then simply stop.', c: 'Wet prints lead to a door and stop.' },
      { id: 'd4', s: 'A window latch is scratched and splintered from the outside.', c: 'A window latch is scratched.' },
      { id: 'd5', s: 'Someone\'s kettle is still warm on the stove, untouched.', c: 'A kettle is still warm on the stove.' },
      { id: 'd6', s: 'The village well rope hangs slack, swaying though there is no wind.', c: 'The well rope sways in still air.' },
      { id: 'd7', s: 'A trail of scattered belongings marks the cobblestones toward the town gate.', c: 'Scattered belongings trail toward the town gate.' },
      { id: 'd8', s: 'The morning bread cart is parked, but its driver is gone.', c: 'The bread cart waits, but the driver is gone.' }
    ],
    clue: [
      { id: 'c1', s: 'A shredded coat sleeve is caught on the dock nails.', c: 'A torn sleeve hangs on the dock nails.' },
      { id: 'c2', s: 'Deep claw marks score the wooden gatepost.', c: 'Deep claw marks score the gatepost.' },
      { id: 'c3', s: 'A single muddy boot print, too large for any villager.', c: 'One huge muddy boot print.' },
      { id: 'c4', s: 'Strands of coarse dark fur snag on a fence splinter.', c: 'Dark fur snags on a fence splinter.' },
      { id: 'c5', s: 'The hearth is cold, though the fire was banked for the night.', c: 'The hearth is cold.' },
      { id: 'c6', s: 'A dropped lantern lies on its side, still faintly warm.', c: 'A lantern lies on its side, still warm.' },
      { id: 'c7', s: 'The flour bin is open and scattered across the floor.', c: 'Flour is scattered across the floor.' },
      { id: 'c8', s: 'A child\'s wooden toy lies in the middle of the road, unbroken.', c: 'A wooden toy lies in the road.' }
    ],
    aftermath: [
      { id: 'a1', s: 'Nobody slept. Every window in the street shows a face in the dark.', c: 'Nobody slept well.' },
      { id: 'a2', s: 'The town holds its breath, listening for the sound to come again.', c: 'The town listens.' },
      { id: 'a3', s: 'Whispers run from porch to porch like a shiver.', c: 'Whispers pass from porch to porch.' },
      { id: 'a4', s: 'The empty chair at the council table casts a long shadow.', c: 'The empty chair casts a long shadow.' },
      { id: 'a5', s: 'A second empty chair joins the first at the council table.', c: 'Another chair at the table stands empty.' },
      { id: 'a6', s: 'The remaining villagers gather close, counting heads again and again.', c: 'The villagers gather close and count heads.' },
      { id: 'a7', s: 'Somewhere beyond the town gate, the mist swallows the path.', c: 'Beyond the gate, the mist hides the path.' },
      { id: 'a8', s: 'Nobody dares speak the missing name out loud before breakfast.', c: 'Nobody says the missing name out loud.' }
    ],
    closing: [
      { id: 'x1', s: 'Daylight is the only shield left. Use it well.', c: 'Daylight is all we have. Use it well.' },
      { id: 'x2', s: 'The council must decide who to trust before nightfall.', c: 'Trust must be decided before dark.' },
      { id: 'x3', s: 'Somewhere in Moonhollow, a wolf is wearing a villager\'s face.', c: 'Someone in town is not what they seem.' },
      { id: 'x4', s: 'Lock your doors early tonight.', c: 'Lock the doors early tonight.' },
      { id: 'x5', s: 'Talk carefully. The pack is listening.', c: 'Speak carefully. Someone is listening.' },
      { id: 'x6', s: 'The hunt is not over yet.', c: 'This is not over.' },
      { id: 'x7', s: 'Count your neighbours. Then count them again.', c: 'Count your neighbours. Twice.' },
      { id: 'x8', s: 'Morning came, but the danger did not leave with the dark.', c: 'Morning came, but the danger stayed.' }
    ]
  };

  var EPITAPHS = [
    'I always knew the fog hid something.',
    'Tell my cat I forgive her for the hairballs.',
    'Vote for the quiet one. The quiet one is suspicious.',
    'I was innocent, but you will never believe me now.',
    'The harbour was beautiful at midnight.',
    'Someone in this room is smiling right now. Check them.'
  ];

  var GHOST_RULES = 'You are now a silent ghost. Keep your poker face, stay quiet, and do not signal to the living. Hold [ID] in the corner only to peek at the truth board.';

  var BEAT_COPY = {
    nightEnds: 'Night falls over Moonhollow Harbour...',
    nightEndsRound: 'Night {round} ends over Moonhollow Harbour...',
    eyesUp: 'The night is ending. Eyes up.',
    nobodyTaken: 'Nobody was taken tonight.',
    quietDawn: 'A quiet dawn over Moonhollow. Everybody woke in their own bed.',
    councilVoted: 'The council has voted.',
    chosen: 'The council has chosen Seat #{seat}.',
    noVerdict: 'No verdict. Paranoia deepens.',
    lastWords: '{name} may speak for {sec} seconds.',
    lastWordsExile: '{name} may speak for {sec} seconds before the gate.',
    sealed: 'Their secret goes with them.',
    takenInNight: 'You were taken in the night.',
    exiledByCouncil: 'The council has exiled you.',
    packStrikeSuccess: 'Your strike on Seat #{seat} succeeded.',
    packStrikeProtected: 'Your target was protected.',
    packTeacherDecided: 'The pack could not agree, so the night was decided for you.',
    victoryVillage: 'The village wins! Moonhollow Harbour is safe!',
    victoryWolves: 'The werewolves win. The harbour belongs to the pack!',
    epitaphPrompt: 'Choose one line to leave behind (no free text):'
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
