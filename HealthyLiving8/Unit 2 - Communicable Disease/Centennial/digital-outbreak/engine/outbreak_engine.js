/**
 * Case 55: Outbreak at Centennial - Core Deterministic Game Engine (v1.0)
 * Room 8 / Bicentennial Junior High ILT Class Game
 *
 * Pure JS state machine: zero DOM, zero network, PII-free.
 * Runs identically in Browser (<script>), Node self-tests, and Google Apps Script.
 */
(function (root) {
  'use strict';

  var ENGINE_VERSION = '1.0.0';

  var ROLES = {
    CARRIER: 'CARRIER',
    NURSE: 'NURSE',
    INVESTIGATOR: 'INVESTIGATOR',
    STUDENT: 'STUDENT'
  };

  var PHASES = {
    LOBBY: 'LOBBY',
    ROLE_REVEAL: 'ROLE_REVEAL',
    NIGHT: 'NIGHT',
    DAWN: 'DAWN',
    DAY_DISCUSSION: 'DAY_DISCUSSION',
    DAY_VOTE: 'DAY_VOTE',
    DAY_REVOTE: 'DAY_REVOTE',
    DUSK: 'DUSK',
    GAME_OVER: 'GAME_OVER'
  };

  var DEFAULT_RULES = {
    classSize: 28,
    preset: 'classic',          // 'classic' | 'student_pitch' | 'custom'
    carriersCount: 3,
    nursesCount: 1,
    investigatorsCount: 1,
    peacefulNight1: false,      // Live spread right from Night 1! Carriers are contagious immediately
    nurseSelfSave: false,      // Can a nurse protect themselves?
    nurseRepeatSave: false,    // Can nurses protect the exact same player two nights running?
    revealRoleOnDeath: false,   // Reveal eliminated player's true role to the school?
    claimRule: 'quiet',         // 'quiet' (no role claiming out loud) | 'open' (classic claiming allowed)
    tieRule: 'revote_then_none',// 'revote_then_none' | 'no_elimination'
    spectatorReveal: true,      // Dead players become full-reveal silent spectators on their device
    packDecision: 'majority_then_teacher', // 'majority_then_teacher' | 'unanimous' | 'plurality' (never random)
    nameSavedPlayer: false,     // Naming the Nurse's save target leaks info; default OFF
    lastWordsSec: 20,           // Last-words moment after a night case / before an isolation (0 = off)
    storyTone: 'spooky',        // 'spooky' | 'campfire' (neither includes gore)
    carrierConfirmStrike: false,   // Carriers must tap Confirm inside the peek before the spread locks
    testMode: false,            // Cloud: allows simulateBotActions only when explicitly ON
    nightTimerSec: 45,
    discussionTimerSec: 150,
    voteTimerSec: 45,
    revoteTimerSec: 30
  };

  // Safe fictional demo names formatted as First + 2-letter initial (no real student PII)
  var DEMO_NAMES = [
    'Maya Ki.', 'Liam Tr.', 'Zoe Ch.', 'Noah Be.', 'Priya Ra.',
    'Owen Mc.', 'Aaliyah Do.', 'Lucas Va.', 'Chloe St.', 'Mateo Go.',
    'Hannah Le.', 'Elijah Br.', 'Nora Pa.', 'Caleb Wi.', 'Sofia Mo.',
    'Isaac Ha.', 'Layla Al.', 'gabriel Fo.', 'Aria Sa.', 'julian Co.',
    'Sienna Ke.', 'Leo Du.', 'Hazel Ro.', 'Miles Pe.', 'Elena Kr.',
    'Declan Mu.', 'claire Yu.', 'Theo Na.', 'ava Gr.', 'Rowan Fi.',
    'Tessa Hw.', 'Finn Os.', 'Nina Ba.', 'Ezra Vo.', 'Iris De.', 'Jude Ca.'
  ].map(function (n) {
    return n.charAt(0).toUpperCase() + n.slice(1);
  });

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashSeed(input) {
    var s = String(input == null ? Date.now() : input);
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function shuffleWithRng(arr, rng) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function clamp(n, lo, hi) {
    n = Number(n);
    if (isNaN(n)) return lo;
    return Math.max(lo, Math.min(hi, Math.round(n)));
  }

  /**
   * Recommend role counts for a given class size (supports 6..36, tuned for 20..30).
   */
  function recommendRoles(classSize, preset) {
    var n = clamp(classSize || 28, 6, 36);
    var mode = preset || 'classic';
    var carriers, nurses, investigators;

    if (mode === 'student_pitch') {
      // Student pitch allows multiple nurses and multiple investigators acting unanimously
      carriers = n >= 25 ? 3 : (n >= 15 ? 2 : 1);
      nurses = n >= 20 ? 2 : 1;
      investigators = n >= 20 ? 2 : 1;
    } else {
      // Classic classroom balance: 1 carrier per ~10 players (2 at 20-24, 3 at 25-30), 1 doc, 1 investigator
      carriers = n >= 25 ? 3 : (n >= 16 ? 2 : 1);
      nurses = 1;
      investigators = 1;
    }

    // Ensure carriers never start at parity and at least 1 student exists
    var maxCarriers = Math.max(1, Math.floor((n - 1) / 2));
    carriers = Math.min(carriers, maxCarriers);
    while (carriers + nurses + investigators >= n && (nurses > 0 || investigators > 0)) {
      if (investigators > 1) investigators--;
      else if (nurses > 1) nurses--;
      else if (investigators > 0) investigators--;
      else nurses--;
    }

    return {
      classSize: n,
      carriersCount: carriers,
      nursesCount: nurses,
      investigatorsCount: investigators,
      studentsCount: Math.max(0, n - carriers - nurses - investigators)
    };
  }

  function sanitizeRules(partial) {
    var merged = {};
    var k;
    for (k in DEFAULT_RULES) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_RULES, k)) {
        merged[k] = DEFAULT_RULES[k];
      }
    }
    if (partial && typeof partial === 'object') {
      for (k in partial) {
        if (Object.prototype.hasOwnProperty.call(DEFAULT_RULES, k) && partial[k] !== undefined) {
          merged[k] = partial[k];
        }
      }
    }

    merged.classSize = clamp(merged.classSize, 6, 36);

    if (merged.preset === 'classic' || merged.preset === 'student_pitch') {
      if (!partial || (partial.carriersCount === undefined && partial.nursesCount === undefined && partial.investigatorsCount === undefined)) {
        var rec = recommendRoles(merged.classSize, merged.preset);
        merged.carriersCount = rec.carriersCount;
        merged.nursesCount = rec.nursesCount;
        merged.investigatorsCount = rec.investigatorsCount;
      }
    }

    var maxCarriers = Math.max(1, Math.floor((merged.classSize - 1) / 2));
    merged.carriersCount = clamp(merged.carriersCount, 1, Math.min(8, maxCarriers));
    merged.nursesCount = clamp(merged.nursesCount, 0, Math.min(5, merged.classSize - merged.carriersCount - 1));
    merged.investigatorsCount = clamp(
      merged.investigatorsCount,
      0,
      Math.min(5, merged.classSize - merged.carriersCount - merged.nursesCount - 1)
    );

    merged.peacefulNight1 = Boolean(merged.peacefulNight1);
    merged.nurseSelfSave = Boolean(merged.nurseSelfSave);
    merged.nurseRepeatSave = Boolean(merged.nurseRepeatSave);
    merged.revealRoleOnDeath = Boolean(merged.revealRoleOnDeath);
    merged.spectatorReveal = Boolean(merged.spectatorReveal);
    merged.claimRule = merged.claimRule === 'open' ? 'open' : 'quiet';
    merged.tieRule = merged.tieRule === 'no_elimination' ? 'no_elimination' : 'revote_then_none';
    merged.packDecision = ['majority_then_teacher', 'unanimous', 'plurality'].indexOf(merged.packDecision) !== -1
      ? merged.packDecision : 'majority_then_teacher';
    merged.storyTone = merged.storyTone === 'campfire' ? 'campfire' : 'spooky';
    merged.nameSavedPlayer = Boolean(merged.nameSavedPlayer);
    merged.carrierConfirmStrike = Boolean(merged.carrierConfirmStrike);
    merged.testMode = Boolean(merged.testMode);
    merged.lastWordsSec = clamp(merged.lastWordsSec, 0, 60);
    merged.nightTimerSec = clamp(merged.nightTimerSec, 15, 300);
    merged.discussionTimerSec = clamp(merged.discussionTimerSec, 30, 600);
    merged.voteTimerSec = clamp(merged.voteTimerSec, 15, 300);
    merged.revoteTimerSec = clamp(merged.revoteTimerSec, 15, 180);

    return merged;
  }

  function makeRoomCode(seed) {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var rng = mulberry32(hashSeed(seed));
    var out = 'OUT-';
    for (var i = 0; i < 4; i++) {
      out += chars.charAt(Math.floor(rng() * chars.length));
    }
    return out;
  }

  /**
   * Create a fresh game state in LOBBY.
   */
  function createGame(options) {
    options = options || {};
    var seedNum = hashSeed(options.seed != null ? options.seed : (Date.now() + ':' + Math.random()));
    var rules = sanitizeRules(options.rules || {});
    var now = options.now || Date.now();
    var gameId = options.gameId || makeRoomCode(seedNum);

    var players = [];
    if (options.populateDemo) {
      for (var i = 0; i < rules.classSize; i++) {
        players.push({
          id: 'P' + (i + 1),
          seat: i + 1,
          name: DEMO_NAMES[i % DEMO_NAMES.length],
          isBot: i > 0, // Seat 1 defaults to human demo tester unless overridden
          joinedAt: now,
          alive: true,
          eliminatedRound: null,
          eliminatedHow: null,
          role: null,
          readyConfirmed: false
        });
      }
    }

    return {
      version: ENGINE_VERSION,
      gameId: gameId,
      epoch: options.epoch || hashSeed(gameId + ':epoch:' + now + ':' + seedNum),
      seed: seedNum,
      rngStep: 0,
      createdAt: now,
      updatedAt: now,
      phase: PHASES.LOBBY,
      nightSubStep: 'ALL', // 'ALL' | 'CARRIERS' | 'NURSE' | 'INVESTIGATOR' (for narrator projector cue)
      round: 0,
      phaseStartedAt: now,
      phaseDurationSec: 0,
      paused: false,
      pauseRemainingSec: null,
      rules: rules,
      players: players,
      // Current round buffers (cleared at phase transitions)
      currentNight: {
        carrierPicks: {},       // actorId -> targetId
        nursePicks: {},     // actorId -> targetId
        investigatorPicks: {},  // actorId -> targetId
        studentNotes: {},   // actorId -> suspectId (classroom decoy tap so everyone taps once at night)
        carrierConfirms: {},    // actorId -> true (Pack Lock confirmations)
        teacherDecisions: {} // roleKey -> { targetId|null, noKill, at }
      },
      currentVote: {
        ballots: {},         // voterId -> targetId | 'SKIP'
        tiedCandidates: [],  // candidateIds when in DAY_REVOTE
        nominations: []      // optional day discussion suspect pins
      },
      secret: {
        lastNurseSavedId: null,
        investigatorFindings: [], // [{ round, targetId, targetName, role }]
        nurseSavesCount: 0,
        nightReports: [],      // one entry per resolved night (teacher cockpit night report)
        usedFragments: {},     // story fragment ids already used this game (no repeats)
        auditLog: []           // God-view full event trace
      },
      reveal: null,
      publicFeed: [
        {
          id: 'evt_0',
          round: 0,
          phase: PHASES.LOBBY,
          kind: 'info',
          headline: 'Welcome to Centennial Junior High',
          detail: 'Waiting for the class (' + rules.classSize + ' seats) to join Case 55.'
        }
      ],
      lastAnnouncement: {
        kind: 'lobby',
        headline: 'Class Lobby Open',
        subline: 'Target class size: ' + rules.classSize + ' players.',
        eliminatedId: null,
        savedByNurse: false
      },
      lastVoteSummary: null,
      winner: null, // null | 'SCHOOL' | 'CARRIERS'
      winReason: ''
    };
  }

  function nextRandom(game) {
    game.rngStep = (game.rngStep || 0) + 1;
    var rng = mulberry32(hashSeed(game.seed + ':' + game.rngStep));
    return rng();
  }

  function getPlayer(game, playerId) {
    for (var i = 0; i < game.players.length; i++) {
      if (game.players[i].id === playerId) return game.players[i];
    }
    return null;
  }

  function livingPlayers(game, roleFilter) {
    return game.players.filter(function (p) {
      if (!p.alive) return false;
      if (roleFilter && p.role !== roleFilter) return false;
      return true;
    });
  }

  /**
   * Update game rules/class size while in LOBBY.
   */
  function updateRules(game, partialRules, now) {
    if (game.phase !== PHASES.LOBBY) {
      return { ok: false, error: 'Settings can only be changed in the Lobby before roles are dealt.' };
    }
    var prevSize = game.rules.classSize;
    game.rules = sanitizeRules(mergeObj(game.rules, partialRules || {}));
    game.updatedAt = now || Date.now();

    // If demo/seat placeholders are loaded, resize cleanly to match classSize
    var allSeatsOrBots = game.players.length > 0 && game.players.every(function (p) {
      return p.isBot || /^Seat \d+$/.test(p.name) || DEMO_NAMES.indexOf(p.name) !== -1;
    });
    if (allSeatsOrBots && prevSize !== game.rules.classSize) {
      if (game.players.length > game.rules.classSize) {
        game.players = game.players.slice(0, game.rules.classSize);
      } else {
        for (var i = game.players.length; i < game.rules.classSize; i++) {
          game.players.push({
            id: 'P' + (i + 1),
            seat: i + 1,
            name: DEMO_NAMES[i % DEMO_NAMES.length],
            isBot: true,
            joinedAt: game.updatedAt,
            alive: true,
            eliminatedRound: null,
            eliminatedHow: null,
            role: null,
            readyConfirmed: false
          });
        }
      }
    }
    game.lastAnnouncement.subline = 'Target class size: ' + game.rules.classSize + ' players.';
    return { ok: true, rules: game.rules };
  }

  function mergeObj(a, b) {
    var out = {};
    var k;
    for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) out[k] = a[k];
    for (k in b) if (Object.prototype.hasOwnProperty.call(b, k)) out[k] = b[k];
    return out;
  }

  /**
   * Join or claim a seat in LOBBY.
   */
  function addOrUpdatePlayer(game, playerSpec, now) {
    now = now || Date.now();
    var cleanName = String((playerSpec && playerSpec.name) || '').trim().slice(0, 28);
    if (!cleanName) return { ok: false, error: 'Display name is required.' };

    var pid = playerSpec.id ? String(playerSpec.id) : ('P' + (game.players.length + 1));
    var existing = getPlayer(game, pid);
    if (existing) {
      existing.name = cleanName;
      if (playerSpec.isBot !== undefined) existing.isBot = Boolean(playerSpec.isBot);
      game.updatedAt = now;
      return { ok: true, player: existing, rejoined: true };
    }

    if (game.phase !== PHASES.LOBBY) {
      return { ok: false, error: 'Game has already started. Ask the teacher to join as a spectator.' };
    }

    // Replace first bot placeholder if lobby is full of demo bots
    if (game.players.length >= game.rules.classSize) {
      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].isBot) {
          game.players[i].id = pid;
          game.players[i].name = cleanName;
          game.players[i].isBot = false;
          game.players[i].joinedAt = now;
          game.updatedAt = now;
          return { ok: true, player: game.players[i], replacedBot: true };
        }
      }
      return { ok: false, error: 'Lobby is full (' + game.rules.classSize + ' seats). Teacher can raise class size.' };
    }

    var seat = game.players.length + 1;
    var p = {
      id: pid,
      seat: seat,
      name: cleanName,
      isBot: Boolean(playerSpec.isBot),
      joinedAt: now,
      alive: true,
      eliminatedRound: null,
      eliminatedHow: null,
      role: null,
      readyConfirmed: false
    };
    game.players.push(p);
    game.updatedAt = now;
    return { ok: true, player: p };
  }

  /**
   * Populate unnamed seats up to rules.classSize (either 'demo' names or 'seats' Seat 1..N).
   */
  function fillSeats(game, mode, now) {
    if (game.phase !== PHASES.LOBBY) {
      return { ok: false, error: 'Can only fill seats in Lobby.' };
    }
    now = now || Date.now();
    var target = game.rules.classSize;
    if (mode === 'clear') {
      game.players = [];
      game.updatedAt = now;
      return { ok: true, count: 0 };
    }
    // Keep existing non-bot players and fill remaining slots
    var kept = game.players.filter(function (p) { return !p.isBot; }).slice(0, target);
    var out = [];
    for (var i = 0; i < kept.length; i++) {
      kept[i].seat = i + 1;
      out.push(kept[i]);
    }
    for (var s = out.length; s < target; s++) {
      var label = mode === 'numbered'
        ? ('Seat ' + (s + 1))
        : DEMO_NAMES[s % DEMO_NAMES.length];
      out.push({
        id: 'P' + (s + 1),
        seat: s + 1,
        name: label,
        isBot: mode !== 'numbered',
        joinedAt: now,
        alive: true,
        eliminatedRound: null,
        eliminatedHow: null,
        role: null,
        readyConfirmed: false
      });
    }
    game.players = out;
    game.updatedAt = now;
    return { ok: true, count: out.length };
  }

  /**
   * Deal roles and transition LOBBY -> ROLE_REVEAL.
   */
  function playerFairKey(p) {
    return String((p && (p.email || p.name || p.id)) || '').trim().toLowerCase();
  }

  function startGame(game, now, opts) {
    now = now || Date.now();
    if (game.players.length < 6) {
      return { ok: false, error: 'Need at least 6 players in seats to start Outbreak.' };
    }

    // Sync classSize to actual seated players if teacher starts with fewer/more than slider
    game.rules = sanitizeRules(mergeObj(game.rules, { classSize: game.players.length, preset: 'custom' }));

    var n = game.players.length;
    game.rngStep = (game.rngStep || 0) + 1;
    var rng = mulberry32(hashSeed(game.seed + ':deal:' + game.rngStep));

    // Carrier fairness rotation: prefer human players who haven't been Outbreak yet in priorCarrierKeys
    var priorSet = {};
    var priorList = (opts && Array.isArray(opts.priorCarrierKeys)) ? opts.priorCarrierKeys : [];
    for (var pk = 0; pk < priorList.length; pk++) {
      var normK = String(priorList[pk] || '').trim().toLowerCase();
      if (normK) priorSet[normK] = true;
    }

    var humans = [];
    var bots = [];
    var i;
    for (i = 0; i < n; i++) {
      game.players[i].seat = i + 1;
      game.players[i].alive = true;
      game.players[i].eliminatedRound = null;
      game.players[i].eliminatedHow = null;
      game.players[i].readyConfirmed = Boolean(game.players[i].isBot);
      if (game.players[i].isBot) bots.push(game.players[i]);
      else humans.push(game.players[i]);
    }

    var freshHumans = shuffleWithRng(humans.filter(function (p) { return !priorSet[playerFairKey(p)]; }), rng);
    var repeatHumans = shuffleWithRng(humans.filter(function (p) { return Boolean(priorSet[playerFairKey(p)]); }), rng);
    var carrierPoolReset = freshHumans.length < game.rules.carriersCount;
    var carrierCandidates = freshHumans.concat(repeatHumans).concat(shuffleWithRng(bots, rng));

    var carriersNeeded = Math.min(game.rules.carriersCount, n);
    var dealtCarriers = carrierCandidates.slice(0, carriersNeeded);
    var carrierIds = {};
    for (i = 0; i < dealtCarriers.length; i++) {
      dealtCarriers[i].role = ROLES.CARRIER;
      carrierIds[dealtCarriers[i].id] = true;
    }
    game.lastDealtCarrierKeys = dealtCarriers.filter(function (p) { return !p.isBot; }).map(playerFairKey);
    game.carrierPoolReset = carrierPoolReset;

    var otherDeck = [];
    for (i = 0; i < game.rules.nursesCount; i++) otherDeck.push(ROLES.NURSE);
    for (i = 0; i < game.rules.investigatorsCount; i++) otherDeck.push(ROLES.INVESTIGATOR);
    var remainingSeats = game.players.filter(function (p) { return !carrierIds[p.id]; });
    while (otherDeck.length < remainingSeats.length) otherDeck.push(ROLES.STUDENT);
    var shuffledOthers = shuffleWithRng(otherDeck.slice(0, remainingSeats.length), rng);
    for (i = 0; i < remainingSeats.length; i++) {
      remainingSeats[i].role = shuffledOthers[i];
    }

    // Bots never hold power roles in live play: swap any bot-held Outbreak/Nurse/Investigator
    // with a human-held Student whenever enough humans are seated (A2).
    var isPower = function (r) { return r === ROLES.CARRIER || r === ROLES.NURSE || r === ROLES.INVESTIGATOR; };
    for (i = 0; i < game.players.length; i++) {
      var bp = game.players[i];
      if (!bp.isBot || !isPower(bp.role)) continue;
      for (var j = 0; j < game.players.length; j++) {
        var hp = game.players[j];
        if (!hp.isBot && hp.role === ROLES.STUDENT) {
          var tmp = bp.role;
          bp.role = hp.role;
          hp.role = tmp;
          break;
        }
      }
    }
    game.lastWordsChoice = null;
    game.lastWordsActorId = null;

    // Personas (visible to everyone, never linked to roles) for the story theatre (B2).
    var SC = root.StoryContent;
    if (SC && SC.JOBS && SC.JOBS.length) {
      var jobs = shuffleWithRng(SC.JOBS, function () { return nextRandom(game); });
      for (i = 0; i < game.players.length; i++) {
        var home = SC.PLACES[Math.floor(nextRandom(game) * SC.PLACES.length)];
        game.players[i].persona = { job: jobs[i % jobs.length], home: home };
      }
    } else {
      for (i = 0; i < game.players.length; i++) {
        game.players[i].persona = { job: 'student', home: 'Market Square' };
      }
    }

    game.round = 1;
    game.phase = PHASES.ROLE_REVEAL;
    game.phaseStartedAt = now;
    game.phaseDurationSec = 35;
    game.paused = false;
    game.pauseRemainingSec = null;
    game.winner = null;
    game.winReason = '';
    game.lastVoteSummary = null;
    game.secret = {
      lastNurseSavedId: null,
      investigatorFindings: [],
      nurseSavesCount: 0,
      nightReports: [],
      usedFragments: {},
      auditLog: [
        {
          round: 1,
          phase: PHASES.ROLE_REVEAL,
          text: 'Roles dealt to ' + n + ' players (' +
            game.rules.carriersCount + ' Carriers, ' +
            game.rules.nursesCount + ' Nurse(s), ' +
            game.rules.investigatorsCount + ' Investigator(s), ' +
            (n - game.rules.carriersCount - game.rules.nursesCount - game.rules.investigatorsCount) + ' Students).'
        }
      ]
    };

    game.publicFeed = [
      {
        id: 'evt_deal',
        round: 1,
        phase: PHASES.ROLE_REVEAL,
        kind: 'phase',
        headline: 'Secret Status Dealt (' + n + ' Players)',
        detail: 'Check your private screen quietly. Keep your Chromebook angled toward yourself!'
      }
    ];
    game.lastAnnouncement = {
      kind: 'reveal',
      headline: 'Peek at Your Secret Status',
      subline: 'Tap and hold your status card privately, then press "I Know My Status". Never show your neighbour!',
      eliminatedId: null,
      savedByNurse: false
    };
    game.updatedAt = now;
    return { ok: true };
  }

  /**
   * Compute unanimity & breakdown for a multi-member role group (Carriers, Nurses, Investigators).
   */
  function computeGroupConsensus(picksMap, livingActors) {
    var actorIds = livingActors.map(function (p) { return p.id; });
    var counts = {};
    var submitted = 0;
    for (var i = 0; i < actorIds.length; i++) {
      var aid = actorIds[i];
      var pick = picksMap[aid];
      if (pick) {
        submitted++;
        counts[pick] = (counts[pick] || 0) + 1;
      }
    }
    var uniqueTargets = Object.keys(counts);
    var isUnanimous = actorIds.length > 0 && submitted === actorIds.length && uniqueTargets.length === 1;
    return {
      totalActors: actorIds.length,
      submittedCount: submitted,
      counts: counts,
      isUnanimous: isUnanimous,
      unanimousTarget: isUnanimous ? uniqueTargets[0] : null
    };
  }

  /**
   * Resolve a multi-member role group's target under the packDecision rule.
   * NEVER random: an unresolved split returns mode 'split' with the candidate
   * seats, and the teacher decides via submitNightDecision (Pack Split).
   */
  function resolveGroupTarget(game, picksMap, livingActors, rule) {
    var con = computeGroupConsensus(picksMap, livingActors);
    if (con.submittedCount === 0) return { targetId: null, mode: 'none', consensus: con, tied: [] };
    if (con.isUnanimous) return { targetId: con.unanimousTarget, mode: 'unanimous', consensus: con, tied: [] };
    var keys = Object.keys(con.counts).sort(function (a, b) { return con.counts[b] - con.counts[a]; });
    var topCount = con.counts[keys[0]];
    var topTied = keys.filter(function (k) { return con.counts[k] === topCount; });
    var r = rule || (game.rules && game.rules.packDecision) || 'majority_then_teacher';
    if (r === 'unanimous') {
      return { targetId: null, mode: 'split', consensus: con, tied: keys };
    }
    if (r === 'majority_then_teacher') {
      if (topCount > con.totalActors / 2) {
        return { targetId: keys[0], mode: 'majority', consensus: con, tied: [] };
      }
      return { targetId: null, mode: 'split', consensus: con, tied: keys };
    }
    // legacy plurality: single top wins; a tie becomes a teacher decision, never random
    if (topTied.length === 1) return { targetId: topTied[0], mode: 'plurality', consensus: con, tied: [] };
    return { targetId: null, mode: 'split', consensus: con, tied: topTied };
  }

  // Legacy shim: kept for API compatibility. Never calls nextRandom for resolution.
  function chooseFallbackTarget(game, consensus) {
    if (consensus.unanimousTarget) return { targetId: consensus.unanimousTarget, mode: 'unanimous' };
    var keys = Object.keys(consensus.counts);
    if (keys.length === 0) return { targetId: null, mode: 'none' };
    keys.sort(function (a, b) { return consensus.counts[b] - consensus.counts[a]; });
    var topScore = consensus.counts[keys[0]];
    var tied = keys.filter(function (k) { return consensus.counts[k] === topScore; });
    if (tied.length === 1) return { targetId: tied[0], mode: 'plurality' };
    return { targetId: null, mode: 'split', tied: tied };
  }

  /**
   * Teacher Pack Split decision during NIGHT (A1): pick one of the tied seats or no kill.
   * roleKey: ROLES.CARRIER | ROLES.NURSE | ROLES.INVESTIGATOR.
   */
  function submitNightDecision(game, roleKey, choice, now) {
    if (game.phase !== PHASES.NIGHT) {
      return { ok: false, error: 'Night decisions only apply during NIGHT.' };
    }
    now = now || Date.now();
    choice = choice || {};
    var targetId = choice.targetId ? String(choice.targetId) : null;
    if (targetId) {
      var t = getPlayer(game, targetId);
      if (!t || !t.alive) return { ok: false, error: 'Chosen seat is not a living player.' };
    }
    game.currentNight.teacherDecisions[String(roleKey)] = {
      targetId: targetId,
      noKill: Boolean(choice.noKill),
      at: now
    };
    game.updatedAt = now;
    return { ok: true };
  }

  /**
   * Pack Lock state for a carrier's private peek (A3): coordinating | locked | split.
   */
  function computePackLock(game, carrier) {
    var carriers = livingPlayers(game, ROLES.CARRIER);
    var res = resolveGroupTarget(game, game.currentNight.carrierPicks, carriers, game.rules.packDecision);
    var state = 'coordinating';
    var targetId = null;
    if (res.mode === 'split') {
      state = 'split';
    } else if (res.targetId) {
      state = 'locked';
      targetId = res.targetId;
      if (game.rules.carrierConfirmStrike) {
        var confirmed = carriers.every(function (w) { return game.currentNight.carrierConfirms[w.id]; });
        if (!confirmed) state = 'coordinating';
      }
    }
    var target = targetId ? getPlayer(game, targetId) : null;
    return {
      state: state,
      targetId: targetId,
      targetSeat: target ? target.seat : null,
      confirms: carriers.filter(function (w) { return game.currentNight.carrierConfirms[w.id]; }).length,
      totalCarriers: carriers.length,
      decisionMode: res.mode,
      tied: res.tied || []
    };
  }

  /**
   * Submit a player action (ready check, night pick, student decoy note, or day ballot).
   */
  function submitPlayerAction(game, actorId, actionPayload, now) {
    now = now || Date.now();
    var actor = getPlayer(game, actorId);
    if (!actor) return { ok: false, error: 'Player not found in this game.' };

    var type = actionPayload && actionPayload.type;

    if (type === 'confirm_role' && game.phase === PHASES.ROLE_REVEAL) {
      actor.readyConfirmed = true;
      game.updatedAt = now;
      return { ok: true };
    }

    if (!actor.alive) {
      if (type === 'last_words_choice' && (game.phase === PHASES.DAWN || game.phase === PHASES.DUSK) && actor.id === game.lastWordsActorId) {
        var choice = String((actionPayload && actionPayload.targetId) || '');
        if (choice === 'take') {
          game.lastWordsChoice = 'take';
          game.phaseStartedAt = now;
          game.phaseDurationSec = 20;
          game.paused = false;
          game.pauseRemainingSec = null;
          game.updatedAt = now;
          return { ok: true, roleAction: 'last_words_take' };
        }
        if (choice === 'skip') {
          game.lastWordsChoice = 'skip';
          game.updatedAt = now;
          advancePhase(game, now);
          return { ok: true, roleAction: 'last_words_skip', autoAdvanced: true };
        }
      }
      // Dead players may only submit a preset epitaph during a reveal (B4); nothing else.
      if (type === 'epitaph' && (game.phase === PHASES.DAWN || game.phase === PHASES.DUSK || game.phase === PHASES.GAME_OVER)) {
        var line = String((actionPayload && actionPayload.line) || '');
        var SC0 = root.StoryContent;
        var allowed = SC0 && SC0.EPITAPHS ? SC0.EPITAPHS : [];
        if (allowed.indexOf(line) === -1) return { ok: false, error: 'Choose one of the preset epitaph lines.' };
        actor.epitaph = line;
        game.updatedAt = now;
        return { ok: true, roleAction: 'epitaph' };
      }
      return { ok: false, error: 'Eliminated players are silent ghosts and cannot submit actions.' };
    }

    if (type === 'carrier_confirm' && game.phase === PHASES.NIGHT && actor.role === ROLES.CARRIER) {
      game.currentNight.carrierConfirms[actor.id] = true;
      game.updatedAt = now;
      return { ok: true, roleAction: 'carrier_confirm' };
    }

    if (game.phase === PHASES.NIGHT) {
      var targetId = String((actionPayload && actionPayload.targetId) || '');
      var target = getPlayer(game, targetId);
      if (!target || !target.alive) {
        return { ok: false, error: 'Choose a living player.' };
      }

      if (actor.role === ROLES.CARRIER) {
        if (target.role === ROLES.CARRIER && livingPlayers(game).length > livingPlayers(game, ROLES.CARRIER).length) {
          return { ok: false, error: 'Carriers must target a student who is not a Carrier.' };
        }
        game.currentNight.carrierPicks[actor.id] = target.id;
        game.updatedAt = now;
        return { ok: true, roleAction: 'carrier_pick', targetId: target.id };
      }

      if (actor.role === ROLES.NURSE) {
        if (!game.rules.nurseSelfSave && target.id === actor.id) {
          return { ok: false, error: 'Rule active: the Nurse cannot shield themselves.' };
        }
        if (!game.rules.nurseRepeatSave && game.secret.lastNurseSavedId && target.id === game.secret.lastNurseSavedId) {
          return { ok: false, error: 'Rule active: Cannot protect the same player two nights in a row.' };
        }
        game.currentNight.nursePicks[actor.id] = target.id;
        game.updatedAt = now;
        return { ok: true, roleAction: 'nurse_pick', targetId: target.id };
      }

      if (actor.role === ROLES.INVESTIGATOR) {
        if (target.id === actor.id) {
          return { ok: false, error: 'Choose another player to investigate.' };
        }
        game.currentNight.investigatorPicks[actor.id] = target.id;
        game.updatedAt = now;
        return { ok: true, roleAction: 'investigator_pick', targetId: target.id };
      }

      // Student decoy action: records personal suspicion note so every student taps their screen at night
      game.currentNight.studentNotes[actor.id] = target.id;
      game.updatedAt = now;
      return { ok: true, roleAction: 'student_watch', targetId: target.id };
    }

    if (game.phase === PHASES.DAY_VOTE || game.phase === PHASES.DAY_REVOTE) {
      var choice = String((actionPayload && actionPayload.targetId) || '');
      if (choice !== 'SKIP') {
        var votedPlayer = getPlayer(game, choice);
        if (!votedPlayer || !votedPlayer.alive) {
          return { ok: false, error: 'Invalid ballot target.' };
        }
        if (game.phase === PHASES.DAY_REVOTE && game.currentVote.tiedCandidates.indexOf(choice) === -1) {
          return { ok: false, error: 'Runoff vote: choose one of the tied suspects.' };
        }
      } else if (game.phase === PHASES.DAY_REVOTE) {
        return { ok: false, error: 'Runoff vote: pick one of the tied suspects.' };
      }
      game.currentVote.ballots[actor.id] = choice;
      game.updatedAt = now;
      return { ok: true, votedFor: choice };
    }

    return { ok: false, error: 'No player action is open during ' + game.phase + '.' };
  }

  /**
   * Teacher/God-view direct night override (for Projector-Only / Zero-Device classroom play!).
   * Lets teacher tap the Carriers' target, Nurse's save, and Investigator's check directly.
   */
  function submitModeratorNightOverride(game, roleKey, targetId, now) {
    if (game.phase !== PHASES.NIGHT) {
      return { ok: false, error: 'Moderator night input only applies during NIGHT.' };
    }
    now = now || Date.now();
    var target = targetId ? getPlayer(game, targetId) : null;
    if (targetId && (!target || !target.alive)) {
      return { ok: false, error: 'Selected player is not alive.' };
    }

    if (roleKey === ROLES.CARRIER) {
      var carriers = livingPlayers(game, ROLES.CARRIER);
      for (var w = 0; w < carriers.length; w++) {
        if (targetId) game.currentNight.carrierPicks[carriers[w].id] = targetId;
        else delete game.currentNight.carrierPicks[carriers[w].id];
      }
    } else if (roleKey === ROLES.NURSE) {
      var docs = livingPlayers(game, ROLES.NURSE);
      for (var d = 0; d < docs.length; d++) {
        if (targetId) game.currentNight.nursePicks[docs[d].id] = targetId;
        else delete game.currentNight.nursePicks[docs[d].id];
      }
    } else if (roleKey === ROLES.INVESTIGATOR) {
      var dets = livingPlayers(game, ROLES.INVESTIGATOR);
      for (var c = 0; c < dets.length; c++) {
        if (targetId) game.currentNight.investigatorPicks[dets[c].id] = targetId;
        else delete game.currentNight.investigatorPicks[dets[c].id];
      }
    }
    game.updatedAt = now;
    return { ok: true };
  }

  function buildStoryNarration(kind, data) {
    data = data || {};
    var round = data.round || 1;
    var name = data.name || 'a student';
    var seat = data.seat ? ('Seat #' + (data.seat < 10 ? '0' + data.seat : data.seat)) : '';

    if (kind === 'night_start') {
      var nightStories = [
        'Late at night, Centennial Junior High goes quiet after the last bus leaves. Somewhere in the dark, a quiet cough echoes down an empty corridor...',
        'The school is dark and still after hours. In the cafeteria, a locker door creaks open on its own. Someone is moving through the building in the dark.',
        'Moonlight cuts through the gymnasium windows. Every classroom door is locked... except one, standing slightly ajar at the end of the West Wing hallway.'
      ];
      return nightStories[(round - 1) % nightStories.length];
    }

    if (kind === 'dawn_kill') {
      var killStories = [
        'Morning announcements are hushed. When first period rolls around in the West Wing, ' + seat + ' (' + name + ') is missing from their desk. A half-finished breakfast sits in the cafeteria - ' + name + ' was infected overnight.',
        'Students gather nervously outside the nurse\'s office. ' + seat + ' (' + name + ') never showed up today. Rumours spread fast through the halls: the sickness struck again in the night.',
        'First period starts without ' + seat + ' (' + name + '). A note on the teacher\'s desk says only: "stay home if you feel sick." Too late for one of us.'
      ];
      return killStories[(round - 1) % killStories.length];
    }

    if (kind === 'dawn_save') {
      var saveStories = [
        'Overnight, a carrier crept toward the desk of ' + seat + ' (' + name + ') with a shared water bottle - but the Nurse was already there with a thermometer and an isolation kit. ' + name + ' was protected until morning!',
        'In the dark, someone tried to share a snack with ' + seat + ' (' + name + '). The Nurse caught it in time! ' + name + ' was shielded until morning, and nobody got sick tonight!'
      ];
      return saveStories[(round - 1) % saveStories.length];
    }

    if (kind === 'dawn_peaceful') {
      return 'The night passed quietly at Centennial. No new cases were logged by morning - but the hallway camera caught a shadow moving past the gym doors at 2 AM...';
    }

    if (kind === 'dusk_exile') {
      var exileStories = [
        'Heated debate fills the cafeteria at lunch. By secret ballot, the class votes to send ' + seat + ' (' + name + ') home for a 48-hour isolation. The decision is final.',
        'Accusations fly during the afternoon classes. In the final ballot, the class delivers its verdict against ' + seat + ' (' + name + '), who leaves with a printed isolation notice from the main office.'
      ];
      return exileStories[(round - 1) % exileStories.length];
    }

    if (kind === 'dusk_no_exile') {
      return 'Voices clash in the classroom until the final bell! With the vote locked in a dead heat, no isolation order could be passed. The accused walks free, but suspicion runs deeper than ever as the next night approaches.';
    }

    return '';
  }

  function enterNight(game, now) {
    game.phase = PHASES.NIGHT;
    game.nightSubStep = 'ALL';
    game.phaseStartedAt = now;
    game.phaseDurationSec = game.rules.nightTimerSec;
    game.paused = false;
    game.pauseRemainingSec = null;
    game.currentNight = {
      carrierPicks: {},
      nursePicks: {},
      investigatorPicks: {},
      studentNotes: {},
      carrierConfirms: {},
      teacherDecisions: {}
    };
    var nightNote = (game.round === 1 && game.rules.peacefulNight1)
      ? 'Night 1 (Arrival Night): Carriers coordinate silently, Investigators test 1 student, Students log a Night Watch hunch. No new cases tonight!'
      : 'Night ' + game.round + ': Everyone tap 1 choice quietly on your Chromebook so no clicks give away your role.';
    var nightStory = buildStoryNarration('night_start', { round: game.round });
    game.lastAnnouncement = {
      kind: 'night',
      headline: 'Night ' + game.round + ' Falls Over Centennial',
      subline: nightNote,
      story: nightStory,
      eliminatedId: null,
      savedByNurse: false
    };
    game.lastStory = nightStory;
    pushFeed(game, 'night', 'Night ' + game.round + ' Begins', nightNote);
  }

  function resolveNightToDawn(game, now) {
    var carriers = livingPlayers(game, ROLES.CARRIER);
    var nurses = livingPlayers(game, ROLES.NURSE);
    var investigators = livingPlayers(game, ROLES.INVESTIGATOR);

    var isPeaceful = (game.round === 1 && game.rules.peacefulNight1);

    // Group targets under the packDecision rule - never random (A1).
    var carrierRes = resolveGroupTarget(game, game.currentNight.carrierPicks, carriers, game.rules.packDecision);
    var docRes = resolveGroupTarget(game, game.currentNight.nursePicks, nurses, game.rules.packDecision);
    var detRes = resolveGroupTarget(game, game.currentNight.investigatorPicks, investigators, game.rules.packDecision);
    var td = game.currentNight.teacherDecisions || {};

    // Teacher Pack Split decisions override a split group (decidedBy: 'teacher').
    var carrierTeacher = td[ROLES.CARRIER];
    var docTeacher = td[ROLES.NURSE];
    var detTeacher = td[ROLES.INVESTIGATOR];

    var carrierVictimId = null;
    var carrierDecisionMode = 'none';
    if (carrierRes.mode === 'split') {
      if (carrierTeacher && !carrierTeacher.noKill && carrierTeacher.targetId) {
        carrierVictimId = carrierTeacher.targetId;
        carrierDecisionMode = 'teacher';
      } else {
        carrierDecisionMode = carrierTeacher ? 'teacher' : 'none';
      }
    } else if (carrierRes.targetId) {
      carrierVictimId = carrierRes.targetId;
      carrierDecisionMode = carrierRes.mode;
    }

    var protectedId = null;
    if (!isPeaceful && nurses.length > 0) {
      if (docRes.mode === 'split') {
        if (docTeacher && !docTeacher.noKill && docTeacher.targetId) protectedId = docTeacher.targetId;
      } else {
        protectedId = docRes.targetId;
      }
    }
    if (protectedId) {
      game.secret.lastNurseSavedId = protectedId;
    }

    // Investigator investigation (always active, including Night 1!)
    var finding = null;
    if (investigators.length > 0) {
      var detTargetId = null;
      if (detRes.mode === 'split') {
        if (detTeacher && detTeacher.targetId) detTargetId = detTeacher.targetId;
      } else {
        detTargetId = detRes.targetId;
      }
      if (detTargetId) {
        var checked = getPlayer(game, detTargetId);
        if (checked) {
          finding = {
            round: game.round,
            targetId: checked.id,
            seat: checked.seat,
            targetName: checked.name,
            role: checked.role,
            consensusMode: detRes.mode
          };
          game.secret.investigatorFindings.push(finding);
          game.secret.auditLog.push({
            round: game.round,
            phase: PHASES.NIGHT,
            text: 'Investigator(s) investigated ' + checked.name + ' -> ' + checked.role + ' (' + detRes.mode + ').'
          });
        }
      }
    }

    // Carrier attack vs Nurse save
    var eliminatedPlayer = null;
    var savedByNurse = false;

    if (isPeaceful) {
      game.secret.auditLog.push({
        round: game.round,
        phase: PHASES.NIGHT,
        text: 'Arrival Night 1 (carrier dry-run target: ' + (carrierRes.targetId || 'none') + ').'
      });
    } else if (carrierVictimId) {
      var victim = getPlayer(game, carrierVictimId);
      if (victim && victim.alive) {
        if (protectedId && protectedId === victim.id) {
          savedByNurse = true;
          game.secret.nurseSavesCount = (game.secret.nurseSavesCount || 0) + 1;
          game.secret.auditLog.push({
            round: game.round,
            phase: PHASES.NIGHT,
            text: 'Carriers attacked ' + victim.name + ', SAVED by Nurse!'
          });
        } else {
          victim.alive = false;
          victim.eliminatedRound = game.round;
          victim.eliminatedHow = 'night';
          eliminatedPlayer = victim;
          game.secret.auditLog.push({
            round: game.round,
            phase: PHASES.NIGHT,
            text: 'Carriers eliminated ' + victim.name + ' (' + victim.role + ') [' + carrierDecisionMode + '].'
          });
        }
      }
    } else {
      game.secret.auditLog.push({
        round: game.round,
        phase: PHASES.NIGHT,
        text: carrierRes.mode === 'split'
          ? 'Carriers split with no teacher decision; no new case.'
          : 'Carriers submitted no target; nobody died.'
      });
    }

    // Night report for the teacher cockpit (A4) - written every night.
    var allCarriersBots = carriers.length > 0 && carriers.every(function (w) { return w.isBot; });
    game.secret.nightReports.push({
      round: game.round,
      carrierPicksByActor: mergeObj({}, game.currentNight.carrierPicks),
      decisionMode: carrierDecisionMode,
      decidedBy: carrierDecisionMode === 'teacher' ? 'teacher' : (allCarriersBots ? 'bot-test' : 'pack'),
      victimId: eliminatedPlayer ? eliminatedPlayer.id : null,
      nursePicksByActor: mergeObj({}, game.currentNight.nursePicks),
      protectedId: protectedId,
      saved: savedByNurse,
      investigatorPickByActor: mergeObj({}, game.currentNight.investigatorPicks),
      finding: finding ? { targetId: finding.targetId, targetName: finding.targetName, seat: finding.seat, role: finding.role } : null,
      peaceful: isPeaceful
    });

    game.phase = PHASES.DAWN;
    game.phaseStartedAt = now;
    game.phaseDurationSec = eliminatedPlayer ? 25 : 15;
    game.paused = false;
    game.pauseRemainingSec = null;
    game.lastWordsChoice = eliminatedPlayer ? 'pending' : null;
    game.lastWordsActorId = eliminatedPlayer ? eliminatedPlayer.id : null;

    var headline, subline;
    var dawnStory = '';
    if (isPeaceful) {
      headline = 'Dawn of Day 1: No New Cases After the Arrival Night!';
      subline = 'Investigators gathered their first clue. Talk out loud in the room to spot subtle bluffs!';
      dawnStory = buildStoryNarration('dawn_peaceful', { round: game.round });
    } else if (savedByNurse) {
      var savedP = getPlayer(game, carrierVictimId);
      headline = 'Dawn of Day ' + game.round + ': NURSE SHIELD! No New Case!';
      // Naming the saved player leaks the Nurse's target; name them only if the rule toggle is on.
      subline = game.rules.nameSavedPlayer && savedP
        ? 'The Carriers moved in the dark on ' + savedP.name + ', but the Nurse arrived right on time!'
        : 'The Carriers moved in the dark, but the Nurse arrived right on time!';
      dawnStory = buildStoryNarration('dawn_save', {
        round: game.round,
        name: game.rules.nameSavedPlayer && savedP ? savedP.name : '',
        seat: game.rules.nameSavedPlayer && savedP ? savedP.seat : 0
      });
    } else if (eliminatedPlayer) {
      var roleTag = game.rules.revealRoleOnDeath ? (' (' + eliminatedPlayer.role + ')') : '';
      headline = 'Dawn of Day ' + game.round + ': A New Case Overnight! ' + eliminatedPlayer.name + ' Is Home Sick!';
      subline = 'Seat #' + eliminatedPlayer.seat + roleTag + ' was infected overnight and is now home learning as a Silent Ghost Spectator.';
      dawnStory = buildStoryNarration('dawn_kill', {
        round: game.round,
        name: eliminatedPlayer.name,
        seat: eliminatedPlayer.seat
      });
    } else {
      headline = 'Dawn of Day ' + game.round + ': Quiet Night in Centennial';
      subline = 'All students woke safely this morning.';
      dawnStory = buildStoryNarration('dawn_peaceful', { round: game.round });
    }

    game.lastAnnouncement = {
      kind: 'dawn',
      headline: headline,
      subline: subline,
      story: dawnStory,
      eliminatedId: eliminatedPlayer ? eliminatedPlayer.id : null,
      savedByNurse: savedByNurse
    };
    game.lastStory = dawnStory;
    pushFeed(game, savedByNurse ? 'save' : (eliminatedPlayer ? 'death' : 'dawn'), headline, subline);

    // Story Theatre reveal for the LCD + student mirror (B1). Sanitized on projection.
    if (root.StoryEngine) {
      var kind = isPeaceful || (!eliminatedPlayer && !savedByNurse) ? 'night_quiet'
        : savedByNurse ? 'night_save' : 'night_kill';
      game.reveal = root.StoryEngine.buildReveal(game, kind, { player: eliminatedPlayer || null });
    }

    checkAndApplyWinner(game, now);
  }

  function enterDiscussion(game, now) {
    game.phase = PHASES.DAY_DISCUSSION;
    game.phaseStartedAt = now;
    game.phaseDurationSec = game.rules.discussionTimerSec;
    game.paused = false;
    game.pauseRemainingSec = null;
    game.currentVote = { ballots: {}, tiedCandidates: [], nominations: [] };

    var ruleBanner = game.rules.claimRule === 'quiet'
      ? 'Quiet Inference Rule: Persuade using logic and evidence - nobody may claim a power role out loud!'
      : 'Open Discussion: Debate suspects out loud in the room before the secret ballot opens.';

    game.lastAnnouncement = {
      kind: 'discussion',
      headline: 'Day ' + game.round + ' Class Debate',
      subline: ruleBanner,
      eliminatedId: null,
      savedByNurse: false
    };
    pushFeed(game, 'day', 'Day ' + game.round + ' Class Debate Open', ruleBanner);
  }

  function enterDayVote(game, now) {
    game.phase = PHASES.DAY_VOTE;
    game.phaseStartedAt = now;
    game.phaseDurationSec = game.rules.voteTimerSec;
    game.paused = false;
    game.pauseRemainingSec = null;
    game.currentVote.ballots = {};
    game.currentVote.tiedCandidates = [];

    game.lastAnnouncement = {
      kind: 'vote',
      headline: 'Day ' + game.round + ' Secret Ballot Open',
      subline: 'Every student in class casts 1 secret vote on their Chromebook (or votes Skip / No Isolation).',
      eliminatedId: null,
      savedByNurse: false
    };
  }

  function tallyDayVotes(game, now) {
    var alive = livingPlayers(game);
    var counts = {};
    var skipVotes = 0;
    var totalCast = 0;

    for (var i = 0; i < alive.length; i++) {
      var v = game.currentVote.ballots[alive[i].id];
      if (!v) continue;
      totalCast++;
      if (v === 'SKIP') skipVotes++;
      else counts[v] = (counts[v] || 0) + 1;
    }

    var candidateIds = Object.keys(counts);
    candidateIds.sort(function (a, b) { return counts[b] - counts[a]; });

    var topCount = candidateIds.length > 0 ? counts[candidateIds[0]] : 0;
    var topTied = candidateIds.filter(function (cid) { return counts[cid] === topCount; });

    var breakdown = candidateIds.map(function (cid) {
      var p = getPlayer(game, cid);
      return {
        targetId: cid,
        seat: p ? p.seat : 0,
        name: p ? p.name : cid,
        votes: counts[cid]
      };
    });

    // Case 1: Nobody voted for a player, or SKIP beat/matched the highest suspect
    if (topCount === 0 || skipVotes > topCount) {
      finalizeDuskNoExile(game, now, 'Class Voted to Hold (No Isolation)',
        skipVotes + ' Skip votes vs highest suspect (' + topCount + '). Nobody was isolated today.',
        breakdown, skipVotes, totalCast);
      return;
    }

    // Case 2: Tie at the top (either two suspects tied, or top suspect tied with SKIP)
    if (topTied.length > 1 || (skipVotes === topCount && game.phase === PHASES.DAY_VOTE)) {
      if (topTied.length > 1 && game.phase === PHASES.DAY_VOTE && game.rules.tieRule === 'revote_then_none') {
        game.phase = PHASES.DAY_REVOTE;
        game.phaseStartedAt = now;
        game.phaseDurationSec = game.rules.revoteTimerSec;
        game.paused = false;
        game.pauseRemainingSec = null;
        game.currentVote.ballots = {};
        game.currentVote.tiedCandidates = topTied;

        var tiedNames = topTied.map(function (id) {
          var p = getPlayer(game, id);
          return p ? p.name : id;
        }).join(' vs. ');

        game.lastVoteSummary = {
          round: game.round,
          isRunoffTrigger: true,
          breakdown: breakdown,
          skipVotes: skipVotes,
          totalCast: totalCast
        };
        game.lastAnnouncement = {
          kind: 'revote',
          headline: 'TIE VOTE! Instant Runoff Ballot!',
          subline: 'Deadlock at ' + topCount + ' votes (' + tiedNames + '). Make 15-second statements, then revote!',
          eliminatedId: null,
          savedByNurse: false
        };
        pushFeed(game, 'tie', 'Tie-Breaker Runoff Triggered', tiedNames + ' tied with ' + topCount + ' votes each.');
        return;
      }

      finalizeDuskNoExile(game, now, 'Deadlocked Vote: Nobody Isolated',
        'The ballot ended in a tie (' + topCount + ' votes). With no clear majority, nobody is isolated today.',
        breakdown, skipVotes, totalCast);
      return;
    }

    // Case 3: Clear plurality exile!
    var exiled = getPlayer(game, topTied[0]);
    exiled.alive = false;
    exiled.eliminatedRound = game.round;
    exiled.eliminatedHow = 'vote';

    var roleRevealTxt = game.rules.revealRoleOnDeath
      ? ('Revealed Role: ' + exiled.role + '!')
      : 'Role remains hidden until the end of the game.';

    game.secret.auditLog.push({
      round: game.round,
      phase: game.phase,
      text: 'Class isolated ' + exiled.name + ' (' + exiled.role + ') with ' + topCount + '/' + totalCast + ' votes.'
    });

    game.phase = PHASES.DUSK;
    game.phaseStartedAt = now;
    game.phaseDurationSec = 20;
    game.paused = false;
    game.pauseRemainingSec = null;

    game.lastVoteSummary = {
      round: game.round,
      exiledId: exiled.id,
      exiledName: exiled.name,
      exiledSeat: exiled.seat,
      exiledRole: game.rules.revealRoleOnDeath ? exiled.role : null,
      breakdown: breakdown,
      skipVotes: skipVotes,
      totalCast: totalCast
    };

    var duskHeadline = exiled.name + ' Was Sent Home to Isolate (' + topCount + ' Votes)';
    var duskStory = buildStoryNarration('dusk_exile', {
      round: game.round,
      name: exiled.name,
      seat: exiled.seat
    });
    game.lastAnnouncement = {
      kind: 'dusk',
      headline: duskHeadline,
      subline: roleRevealTxt + ' The next night approaches...',
      story: duskStory,
      eliminatedId: exiled.id,
      savedByNurse: false
    };
    game.lastWordsChoice = 'pending';
    game.lastWordsActorId = exiled.id;
    game.lastStory = duskStory;
    pushFeed(game, 'exile', duskHeadline, roleRevealTxt);

    if (root.StoryEngine) {
      game.reveal = root.StoryEngine.buildReveal(game, 'exile', {
        player: exiled,
        breakdown: breakdown,
        skipVotes: skipVotes,
        totalCast: totalCast
      });
    }

    checkAndApplyWinner(game, now);
  }

  function finalizeDuskNoExile(game, now, headline, subline, breakdown, skipVotes, totalCast) {
    game.phase = PHASES.DUSK;
    game.phaseStartedAt = now;
    game.phaseDurationSec = 18;
    game.paused = false;
    game.pauseRemainingSec = null;
    game.lastVoteSummary = {
      round: game.round,
      exiledId: null,
      breakdown: breakdown,
      skipVotes: skipVotes,
      totalCast: totalCast
    };
    var noExileStory = buildStoryNarration('dusk_no_exile', { round: game.round });
    game.lastAnnouncement = {
      kind: 'dusk',
      headline: headline,
      subline: subline,
      story: noExileStory,
      eliminatedId: null,
      savedByNurse: false
    };
    game.lastStory = noExileStory;
    pushFeed(game, 'dusk', headline, subline);

    if (root.StoryEngine) {
      game.reveal = root.StoryEngine.buildReveal(game, 'no_exile', {
        breakdown: breakdown,
        skipVotes: skipVotes,
        totalCast: totalCast
      });
    }

    checkAndApplyWinner(game, now);
  }

  function checkAndApplyWinner(game, now) {
    var carriers = livingPlayers(game, ROLES.CARRIER).length;
    var aliveTotal = livingPlayers(game).length;
    var town = aliveTotal - carriers;

    if (carriers === 0) {
      game.winner = 'SCHOOL';
      game.winReason = 'Every Carrier has been uncovered and isolated! The outbreak is contained - Centennial Junior High is safe!';
      game.phase = PHASES.GAME_OVER;
      game.phaseStartedAt = now;
      game.phaseDurationSec = 0;
      game.lastAnnouncement = {
        kind: 'victory_school',
        headline: 'OUTBREAK CONTAINED!',
        subline: game.winReason,
        eliminatedId: game.lastAnnouncement.eliminatedId,
        savedByNurse: false
      };
      pushFeed(game, 'win', 'SCHOOL WINS - OUTBREAK CONTAINED!', game.winReason);
      if (root.StoryEngine) game.reveal = root.StoryEngine.buildReveal(game, 'victory_school', {});
      return 'SCHOOL';
    }

    if (carriers >= town) {
      game.winner = 'CARRIERS';
      game.winReason = 'Carriers reached parity (' + carriers + ' Carriers vs ' + town + ' Others) and the school closes for deep cleaning!';
      game.phase = PHASES.GAME_OVER;
      game.phaseStartedAt = now;
      game.phaseDurationSec = 0;
      game.lastAnnouncement = {
        kind: 'victory_carriers',
        headline: 'SCHOOL CLOSED - OUTBREAK WINS!',
        subline: game.winReason,
        eliminatedId: game.lastAnnouncement.eliminatedId,
        savedByNurse: false
      };
      pushFeed(game, 'win', 'CARRIERS WIN - SCHOOL CLOSED!', game.winReason);
      if (root.StoryEngine) game.reveal = root.StoryEngine.buildReveal(game, 'victory_carriers', {});
      return 'CARRIERS';
    }

    return null;
  }

  function pushFeed(game, kind, headline, detail) {
    game.publicFeed.unshift({
      id: 'evt_' + game.round + '_' + game.publicFeed.length + '_' + Math.floor(nextRandom(game) * 1000),
      round: game.round,
      phase: game.phase,
      kind: kind,
      headline: headline,
      detail: detail
    });
    if (game.publicFeed.length > 30) {
      game.publicFeed = game.publicFeed.slice(0, 30);
    }
  }

  /**
   * Advance the game state machine to the next logical phase (moderator trigger or timer expiry).
   */
  function advancePhase(game, now) {
    now = now || Date.now();
    game.updatedAt = now;
    game.lastWordsChoice = null;
    game.lastWordsActorId = null;

    if (game.phase === PHASES.LOBBY) {
      return startGame(game, now);
    }
    if (game.phase === PHASES.ROLE_REVEAL) {
      enterNight(game, now);
      return { ok: true, phase: game.phase };
    }
    if (game.phase === PHASES.NIGHT) {
      resolveNightToDawn(game, now);
      return { ok: true, phase: game.phase };
    }
    if (game.phase === PHASES.DAWN) {
      enterDiscussion(game, now);
      return { ok: true, phase: game.phase };
    }
    if (game.phase === PHASES.DAY_DISCUSSION) {
      enterDayVote(game, now);
      return { ok: true, phase: game.phase };
    }
    if (game.phase === PHASES.DAY_VOTE || game.phase === PHASES.DAY_REVOTE) {
      tallyDayVotes(game, now);
      return { ok: true, phase: game.phase };
    }
    if (game.phase === PHASES.DUSK) {
      game.round += 1;
      enterNight(game, now);
      return { ok: true, phase: game.phase };
    }
    return { ok: false, error: 'Game is already over. Reset to Lobby or Play Again.' };
  }

  function maybeAutoAdvance(game, now) {
    now = now || Date.now();
    if (!game) return false;
    var expected = game.phase === PHASES.ROLE_REVEAL
      ? game.players.length
      : livingPlayers(game).length;
    if (expected <= 0) return false;
    var acted = 0;
    for (var i = 0; i < game.players.length; i++) {
      if (hasPlayerActedInCurrentPhase(game, game.players[i])) acted++;
    }
    if (acted < expected) return false;

    if (game.phase === PHASES.ROLE_REVEAL || game.phase === PHASES.DAY_VOTE || game.phase === PHASES.DAY_REVOTE) {
      advancePhase(game, now);
      return true;
    }
    if (game.phase === PHASES.NIGHT) {
      var carriers = livingPlayers(game, ROLES.CARRIER);
      if (carriers.length >= 2 && computePackLock(game, carriers[0]).state === 'split') {
        return false;
      }
      advancePhase(game, now);
      return true;
    }
    return false;
  }

  /**
   * Reset back to Lobby keeping the seated roster intact for instant Round 2!
   */
  function resetToLobby(game, keepPlayers, now) {    now = now || Date.now();
    var kept = keepPlayers !== false ? game.players.map(function (p, i) {
      return {
        id: p.id,
        seat: i + 1,
        name: p.name,
        isBot: Boolean(p.isBot),
        joinedAt: p.joinedAt || now,
        alive: true,
        eliminatedRound: null,
        eliminatedHow: null,
        role: null,
        readyConfirmed: false
      };
    }) : [];

    var fresh = createGame({
      gameId: game.gameId,
      rules: game.rules,
      now: now
    });
    // New epoch per game so stale action keys from the previous game never fold in (F5/D2).
    fresh.epoch = hashSeed(game.gameId + ':epoch:' + now + ':' + Math.random());
    fresh.players = kept;
    return fresh;
  }

  /**
   * Bring a game created by an older engine up to the current state shape (idempotent).
   * Needed when a v1.0.0 room survives a server redeploy in cache/props: the v2 engine
   * reads fields v1 never wrote (currentNight.carrierConfirms / teacherDecisions,
   * secret.nightReports, rules.testMode, ...), and the god-view projection would throw
   * "Cannot read properties of undefined" on every teacher poll until this runs.
   */
  function migrateGame(game) {
    if (!game || typeof game !== 'object') return game;
    var fresh = createGame({
      gameId: game.gameId || 'MIGRATE',
      rules: game.rules && typeof game.rules === 'object' ? game.rules : {},
      now: game.updatedAt || Date.now(),
      seed: game.seed != null ? game.seed : undefined
    });
    game.rules = fresh.rules; // sanitized merge of DEFAULT_RULES + the game's own rules
    game.currentNight = mergeObj(fresh.currentNight, game.currentNight || {});
    game.currentVote = mergeObj(fresh.currentVote, game.currentVote || {});
    game.secret = mergeObj(fresh.secret, game.secret || {});
    if (!game.epoch) game.epoch = hashSeed(String(game.gameId) + ':epoch:' + (game.updatedAt || Date.now()));
    game.version = ENGINE_VERSION;
    return game;
  }

  /**
   * Remove bot / placeholder seats in LOBBY (cloud preflight: every seat must be human).
   */
  function removeEmptySeats(game, now) {
    if (game.phase !== PHASES.LOBBY) return { ok: false, error: 'Can only remove empty seats in the Lobby.' };
    now = now || Date.now();
    var before = game.players.length;
    // Empty = bot OR unclaimed numbered placeholder ("Seat 12"); real joined students stay.
    game.players = game.players.filter(function (p) { return !p.isBot && !/^Seat \d+$/.test(p.name); });
    game.players.forEach(function (p, i) { p.seat = i + 1; });
    game.updatedAt = now;
    return { ok: true, removed: before - game.players.length };
  }

  /** Teacher kick: remove a seated player in LOBBY (cloud mode, wrong seat etc.). */
  function kickPlayer(game, playerId, now) {
    if (game.phase !== PHASES.LOBBY) return { ok: false, error: 'Players can only be kicked in the Lobby.' };
    now = now || Date.now();
    var idx = -1;
    for (var i = 0; i < game.players.length; i++) {
      if (game.players[i].id === playerId) { idx = i; break; }
    }
    if (idx === -1) return { ok: false, error: 'Player not found.' };
    game.players.splice(idx, 1);
    game.players.forEach(function (p, i) { p.seat = i + 1; });
    game.updatedAt = now;
    return { ok: true };
  }

  /** Fresh unique S<n> id for a teacher-added seat (never collides with live ids). */
  function nextPlayerId_(game) {
    var max = 0;
    game.players.forEach(function (p) {
      var m = /^S(\d+)$/.exec(String(p.id || ''));
      if (m) max = Math.max(max, Number(m[1]));
    });
    return 'S' + (max + 1);
  }

  /**
   * Teacher adds a named seat in the Lobby (maximum-flexibility roster tool):
   * claims the first unclaimed 'Seat N' placeholder if one exists, else takes
   * an open slot, else replaces a demo bot. Renaming a placeholder is the
   * normal path for a class that loaded Seats 1..N before students join.
   */
  function addPlayer(game, name, now) {
    if (game.phase !== PHASES.LOBBY) return { ok: false, error: 'Students can only be added in the Lobby.' };
    now = now || Date.now();
    var cleanName = String(name || '').trim().slice(0, 28);
    if (!cleanName) return { ok: false, error: 'Display name is required.' };
    var placeholder = null;
    for (var i = 0; i < game.players.length; i++) {
      if (/^Seat \d+$/.test(String(game.players[i].name || ''))) { placeholder = game.players[i]; break; }
    }
    if (placeholder) {
      placeholder.name = cleanName;
      placeholder.isBot = false;
      game.updatedAt = now;
      return { ok: true, player: placeholder, claimedPlaceholder: true };
    }
    return addOrUpdatePlayer(game, { id: nextPlayerId_(game), name: cleanName, isBot: false }, now);
  }

  /**
   * Teacher renames any seated player, any phase (names are never secret).
   * Never changes isBot - use Remove empty seats / Fill demo bots for that.
   */
  function renamePlayer(game, playerId, name, now) {
    now = now || Date.now();
    var p = getPlayer(game, playerId);
    if (!p) return { ok: false, error: 'Player not found.' };
    var cleanName = String(name || '').trim().slice(0, 28);
    if (!cleanName) return { ok: false, error: 'Display name is required.' };
    p.name = cleanName;
    game.updatedAt = now;
    return { ok: true };
  }

  /** Moderator override: eliminate or revive a player (confirmation handled client-side). */
  function setPlayerAlive(game, playerId, alive, now) {
    now = now || Date.now();
    var p = getPlayer(game, playerId);
    if (!p) return { ok: false, error: 'Player not found.' };
    p.alive = Boolean(alive);
    if (alive) {
      p.eliminatedRound = null;
      p.eliminatedHow = null;
    } else if (p.alive === false) {
      p.eliminatedRound = p.eliminatedRound || game.round;
      p.eliminatedHow = p.eliminatedHow || 'moderator';
    }
    game.updatedAt = now;
    return { ok: true };
  }

  function togglePause(game, now) {
    now = now || Date.now();
    if (!game.phaseDurationSec) return { ok: true, paused: false };
    if (!game.paused) {
      var elapsed = Math.floor((now - game.phaseStartedAt) / 1000);
      game.pauseRemainingSec = Math.max(0, game.phaseDurationSec - elapsed);
      game.paused = true;
    } else {
      var rem = game.pauseRemainingSec != null ? game.pauseRemainingSec : game.phaseDurationSec;
      game.phaseStartedAt = now - ((game.phaseDurationSec - rem) * 1000);
      game.pauseRemainingSec = null;
      game.paused = false;
    }
    game.updatedAt = now;
    return { ok: true, paused: game.paused };
  }

  function addTime(game, deltaSec, now) {
    now = now || Date.now();
    if (!game.phaseDurationSec) return { ok: false };
    if (game.paused && game.pauseRemainingSec != null) {
      game.pauseRemainingSec = Math.max(5, game.pauseRemainingSec + deltaSec);
    } else {
      game.phaseDurationSec = Math.max(10, game.phaseDurationSec + deltaSec);
    }
    game.updatedAt = now;
    return { ok: true };
  }

  function hasPlayerActedInCurrentPhase(game, p) {
    if (game.phase === PHASES.ROLE_REVEAL) return Boolean(p.readyConfirmed);
    if (!p.alive) return false;
    if (game.phase === PHASES.NIGHT) {
      if (p.role === ROLES.CARRIER) return Boolean(game.currentNight.carrierPicks[p.id]);
      if (p.role === ROLES.NURSE) return Boolean(game.currentNight.nursePicks[p.id]);
      if (p.role === ROLES.INVESTIGATOR) return Boolean(game.currentNight.investigatorPicks[p.id]);
      return Boolean(game.currentNight.studentNotes[p.id]);
    }
    if (game.phase === PHASES.DAY_VOTE || game.phase === PHASES.DAY_REVOTE) {
      return Boolean(game.currentVote.ballots[p.id]);
    }
    return false;
  }

  /**
   * In Test Mode, unclaimed 'Seat N' placeholder seats act as bots too, so a
   * 100% bot demo class is ONE toggle (Test Mode on, then Deal Roles) instead
   * of remove-empty-then-fill seat surgery. Real joined students are never
   * driven by this - their names cannot match the placeholder pattern.
   */
  function isBotLike(game, p) {
    return Boolean(p.isBot) ||
      (Boolean(game.rules && game.rules.testMode) && /^Seat \d+$/.test(String(p.name || '')));
  }

  /**
   * Smart AI bot actions for Demo / Partial-Bot Classroom Testing!
   */
  function simulateBotActions(game, now) {
    now = now || Date.now();
    var alive = livingPlayers(game);
    if (game.phase === PHASES.ROLE_REVEAL) {
      game.players.forEach(function (p) {
        if (isBotLike(game, p)) p.readyConfirmed = true;
      });
      game.updatedAt = now;
      return { ok: true };
    }

    if (game.phase === PHASES.NIGHT) {
      // Carriers converge on 1 non-carrier target (respecting any human carrier's pick first!)
      var carriers = livingPlayers(game, ROLES.CARRIER);
      var nonCarriers = alive.filter(function (p) { return p.role !== ROLES.CARRIER; });
      var humanCarrierPick = null;
      carriers.forEach(function (w) {
        if (!isBotLike(game, w) && game.currentNight.carrierPicks[w.id]) {
          humanCarrierPick = game.currentNight.carrierPicks[w.id];
        }
      });
      var sharedCarrierTarget = humanCarrierPick || (nonCarriers.length
        ? nonCarriers[Math.floor(nextRandom(game) * nonCarriers.length)].id
        : null);

      carriers.forEach(function (w) {
        if (isBotLike(game, w) && sharedCarrierTarget) {
          game.currentNight.carrierPicks[w.id] = sharedCarrierTarget;
        }
      });

      // Nurses converge on a valid save target
      var nurses = livingPlayers(game, ROLES.NURSE);
      var humanDocPick = null;
      nurses.forEach(function (d) {
        if (!isBotLike(game, d) && game.currentNight.nursePicks[d.id]) humanDocPick = game.currentNight.nursePicks[d.id];
      });
      var validDocTargets = alive.filter(function (p) {
        if (!game.rules.nurseRepeatSave && game.secret.lastNurseSavedId === p.id) return false;
        if (!game.rules.nurseSelfSave && nurses.some(function (d) { return d.id === p.id; })) return false;
        return true;
      });
      var sharedDocTarget = humanDocPick || (validDocTargets.length
        ? validDocTargets[Math.floor(nextRandom(game) * validDocTargets.length)].id
        : null);
      nurses.forEach(function (d) {
        if (isBotLike(game, d) && sharedDocTarget) {
          game.currentNight.nursePicks[d.id] = sharedDocTarget;
        }
      });

      // Investigators check an un-checked suspect
      var investigators = livingPlayers(game, ROLES.INVESTIGATOR);
      var checkedIds = {};
      game.secret.investigatorFindings.forEach(function (f) { checkedIds[f.targetId] = true; });
      var humanDetPick = null;
      investigators.forEach(function (c) {
        if (!isBotLike(game, c) && game.currentNight.investigatorPicks[c.id]) humanDetPick = game.currentNight.investigatorPicks[c.id];
      });
      var detCandidates = alive.filter(function (p) {
        return p.role !== ROLES.INVESTIGATOR && !checkedIds[p.id];
      });
      if (!detCandidates.length) {
        detCandidates = alive.filter(function (p) { return !investigators.some(function (d) { return d.id === p.id; }); });
      }
      var sharedDetTarget = humanDetPick || (detCandidates.length
        ? detCandidates[Math.floor(nextRandom(game) * detCandidates.length)].id
        : null);
      investigators.forEach(function (c) {
        if (isBotLike(game, c) && sharedDetTarget) {
          game.currentNight.investigatorPicks[c.id] = sharedDetTarget;
        }
      });

      // Bot students tap a decoy suspect
      alive.forEach(function (p) {
        if (isBotLike(game, p) && p.role === ROLES.STUDENT) {
          var others = alive.filter(function (x) { return x.id !== p.id; });
          if (others.length) {
            game.currentNight.studentNotes[p.id] = others[Math.floor(nextRandom(game) * others.length)].id;
          }
        }
      });
      game.updatedAt = now;
      return { ok: true };
    }

    if (game.phase === PHASES.DAY_VOTE || game.phase === PHASES.DAY_REVOTE) {
      var pool = game.phase === PHASES.DAY_REVOTE
        ? alive.filter(function (p) { return game.currentVote.tiedCandidates.indexOf(p.id) !== -1; })
        : alive;

      // Pick 2-3 focal suspects so classroom votes cluster realistically instead of 28-way scatter!
      var shuffledPool = shuffleWithRng(pool, function () { return nextRandom(game); });
      var focal = shuffledPool.slice(0, Math.min(3, shuffledPool.length));

      // Known carriers discovered by investigators attract investigator votes
      var knownCarriers = game.secret.investigatorFindings
        .filter(function (f) { return f.role === ROLES.CARRIER; })
        .map(function (f) { return f.targetId; })
        .filter(function (id) { return pool.some(function (p) { return p.id === id; }); });

      alive.forEach(function (voter) {
        if (!isBotLike(game, voter)) return;
        if (voter.role === ROLES.INVESTIGATOR && knownCarriers.length > 0) {
          game.currentVote.ballots[voter.id] = knownCarriers[0];
          return;
        }
        if (voter.role === ROLES.CARRIER) {
          var nonCarrierFocal = focal.filter(function (t) { return t.role !== ROLES.CARRIER; });
          if (nonCarrierFocal.length > 0) {
            game.currentVote.ballots[voter.id] = nonCarrierFocal[0].id;
            return;
          }
        }
        if (game.phase === PHASES.DAY_VOTE && nextRandom(game) < 0.08) {
          game.currentVote.ballots[voter.id] = 'SKIP';
          return;
        }
        var choices = focal.filter(function (t) { return t.id !== voter.id; });
        if (!choices.length) choices = pool.filter(function (t) { return t.id !== voter.id; });
        if (choices.length) {
          // Weight slightly toward focal[0] and focal[1] for dramatic races
          var pickIdx = (choices.length > 1 && nextRandom(game) < 0.55) ? 0 : Math.floor(nextRandom(game) * choices.length);
          game.currentVote.ballots[voter.id] = choices[pickIdx].id;
        }
      });

      game.updatedAt = now;
      return { ok: true };
    }

    return { ok: true };
  }

  /**
   * Project a safe, role-filtered view so secrets NEVER leak to unauthorized clients or the front LCD!
   * viewer: { kind: 'lcd' | 'god' | 'player', playerId?: string }
   */
  function projectViewForViewer(game, viewer) {
    viewer = viewer || { kind: 'lcd' };
    var isGod = viewer.kind === 'god';
    var isGameOver = game.phase === PHASES.GAME_OVER;
    var me = viewer.kind === 'player' && viewer.playerId ? getPlayer(game, viewer.playerId) : null;

    var aliveCount = 0;
    var actedCount = 0;
    game.players.forEach(function (p) {
      if (p.alive) aliveCount++;
      if (hasPlayerActedInCurrentPhase(game, p)) actedCount++;
    });

    var publicPlayers = game.players.map(function (p) {
      var showRole = isGod || isGameOver || (!p.alive && game.rules.revealRoleOnDeath);
      if (me && me.id === p.id) showRole = true;
      if (me && me.role === ROLES.CARRIER && p.role === ROLES.CARRIER) showRole = true;
      if (me && me.role === ROLES.NURSE && p.role === ROLES.NURSE) showRole = true;
      if (me && me.role === ROLES.INVESTIGATOR && p.role === ROLES.INVESTIGATOR) showRole = true;
      if (me && !me.alive && game.rules.spectatorReveal) showRole = true;

      // Show per-seat acted checkmarks on LCD during ROLE_REVEAL, DAY_VOTE, DAY_REVOTE.
      // NIGHT is excluded on purpose (anti-tell): everyone taps 1 seat at night, so
      // individual checkmarks would leak power-role timing - the LCD shows only the
      // aggregate counts.acted during NIGHT.
      var showIndividualActed = isGod ||
        game.phase === PHASES.ROLE_REVEAL ||
        game.phase === PHASES.DAY_VOTE ||
        game.phase === PHASES.DAY_REVOTE;

      return {
        id: p.id,
        seat: p.seat,
        name: p.name,
        isBot: p.isBot,
        alive: p.alive,
        eliminatedRound: p.eliminatedRound,
        eliminatedHow: p.eliminatedHow,
        persona: p.persona ? ('the ' + p.persona.job + ' of ' + p.persona.home) : null,
        epitaph: p.epitaph || null,
        hasActed: showIndividualActed ? hasPlayerActedInCurrentPhase(game, p) : false,
        role: showRole ? p.role : null
      };
    });

    var totalExpectedActors = game.phase === PHASES.ROLE_REVEAL ? game.players.length : aliveCount;

    var out = {
      version: game.version,
      gameId: game.gameId,
      epoch: game.epoch || null,
      updatedAt: game.updatedAt,
      phase: game.phase,
      nightSubStep: game.nightSubStep || 'ALL',
      round: game.round,
      phaseStartedAt: game.phaseStartedAt,
      lastWordsChoice: game.lastWordsChoice || null,
      lastWordsActorId: game.lastWordsActorId || null,
      phaseDurationSec: game.phaseDurationSec,
      paused: game.paused,
      pauseRemainingSec: game.pauseRemainingSec,
      rules: game.rules,
      counts: {
        seated: game.players.length,
        alive: aliveCount,
        eliminated: game.players.length - aliveCount,
        acted: actedCount,
        expectedActors: totalExpectedActors
      },
      players: publicPlayers,
      tiedCandidates: game.currentVote.tiedCandidates || [],
      lastAnnouncement: game.lastAnnouncement,
      lastStory: game.lastStory || (game.lastAnnouncement && game.lastAnnouncement.story) || '',
      lastVoteSummary: game.lastVoteSummary,
      publicFeed: game.publicFeed,
      winner: game.winner,
      winReason: game.winReason,
      reveal: game.reveal ? sanitizeRevealForRules(game.reveal, game) : null
    };

    function sanitizeRevealForRules(rev, g) {
      var copy = JSON.parse(JSON.stringify(rev));
      var hideRole = !g.rules.revealRoleOnDeath && g.phase !== PHASES.GAME_OVER;
      if (hideRole && copy.subject && copy.subject.role &&
          (copy.kind === 'night_kill' || copy.kind === 'exile')) {
        copy.subject.role = null;
      }
      return copy;
    }

    if (me) {
      var priv = {
        id: me.id,
        seat: me.seat,
        name: me.name,
        alive: me.alive,
        role: me.role,
        hasActed: hasPlayerActedInCurrentPhase(game, me),
        myCurrentVote: game.currentVote.ballots[me.id] || null
      };

      if (me.role === ROLES.CARRIER) {
        var carriers = livingPlayers(game, ROLES.CARRIER);
        priv.packmates = game.players
          .filter(function (x) { return x.role === ROLES.CARRIER; })
          .map(function (x) {
            return {
              id: x.id, seat: x.seat, name: x.name, alive: x.alive,
              pick: game.currentNight.carrierPicks[x.id] || null,
              confirmed: Boolean(game.currentNight.carrierConfirms[x.id])
            };
          });
        priv.consensus = computeGroupConsensus(game.currentNight.carrierPicks, carriers);
        priv.packLock = computePackLock(game, me);
        priv.myNightPick = game.currentNight.carrierPicks[me.id] || null;
        // A6: private dawn confirmation of what the pack's strike did
        if (game.phase === PHASES.DAWN && game.secret.nightReports.length) {
          var rep = game.secret.nightReports[game.secret.nightReports.length - 1];
          if (rep.round === game.round) {
            if (rep.victimId) {
              priv.dawnStrikeResult = rep.saved ? 'protected' : 'success';
              priv.dawnStrikeSeat = (getPlayer(game, rep.victimId) || {}).seat || null;
            } else if (rep.decisionMode === 'teacher' || rep.decisionMode === 'none') {
              priv.dawnStrikeResult = 'teacher_decided';
            } else {
              priv.dawnStrikeResult = 'none';
            }
          }
        }
      } else if (me.role === ROLES.NURSE) {
        var docs = livingPlayers(game, ROLES.NURSE);
        priv.colleagues = game.players
          .filter(function (x) { return x.role === ROLES.NURSE; })
          .map(function (x) { return { id: x.id, seat: x.seat, name: x.name, alive: x.alive, pick: game.currentNight.nursePicks[x.id] || null }; });
        priv.consensus = computeGroupConsensus(game.currentNight.nursePicks, docs);
        priv.myNightPick = game.currentNight.nursePicks[me.id] || null;
        priv.lastNurseSavedId = game.secret.lastNurseSavedId;
      } else if (me.role === ROLES.INVESTIGATOR) {
        var dets = livingPlayers(game, ROLES.INVESTIGATOR);
        priv.colleagues = game.players
          .filter(function (x) { return x.role === ROLES.INVESTIGATOR; })
          .map(function (x) { return { id: x.id, seat: x.seat, name: x.name, alive: x.alive, pick: game.currentNight.investigatorPicks[x.id] || null }; });
        priv.consensus = computeGroupConsensus(game.currentNight.investigatorPicks, dets);
        priv.myNightPick = game.currentNight.investigatorPicks[me.id] || null;
        priv.findings = game.secret.investigatorFindings || [];
        if (priv.myNightPick) {
          var curTarget = getPlayer(game, priv.myNightPick);
          if (curTarget) {
            priv.currentNightTargetRole = curTarget.role;
            priv.currentNightTargetName = curTarget.name;
            priv.currentNightTargetSeat = curTarget.seat;
          }
        }
      } else {
        priv.myNightPick = game.currentNight.studentNotes[me.id] || null;
      }

      if (!me.alive && game.rules.spectatorReveal) {
        priv.isSpectatorTruthUnlocked = true;
        priv.spectatorAudit = game.secret.auditLog.slice(-8);
      }

      out.me = priv;
    }

    if (isGod) {
      var carriersG = livingPlayers(game, ROLES.CARRIER);
      out.god = {
        carrierConsensus: computeGroupConsensus(game.currentNight.carrierPicks, carriersG),
        nurseConsensus: computeGroupConsensus(game.currentNight.nursePicks, livingPlayers(game, ROLES.NURSE)),
        investigatorConsensus: computeGroupConsensus(game.currentNight.investigatorPicks, livingPlayers(game, ROLES.INVESTIGATOR)),
        carrierResolution: resolveGroupTarget(game, game.currentNight.carrierPicks, carriersG, game.rules.packDecision),
        packLock: carriersG.length ? computePackLock(game, carriersG[0]) : null,
        currentNight: game.currentNight,
        currentBallots: game.currentVote.ballots,
        secret: game.secret,
        nightReports: game.secret.nightReports || [],
        livingCarriers: carriersG.length,
        livingTown: aliveCount - carriersG.length
      };
    }

    return out;
  }

  /**
   * Built-in deterministic self-test suite (verifies 28-player deal, unanimity, peaceful Night 1,
   * Nurse save, Investigator check, runoff tie revote, anti-leak view projection, and win parity).
   */
  function runSelfTest() {
    var results = [];
    function check(cond, label) {
      results.push({ ok: Boolean(cond), label: label });
      if (!cond) throw new Error('SelfTest failed: ' + label);
    }

    // 1. 28-student setup & role deal
    var g = createGame({ seed: 20261106, populateDemo: true, rules: { classSize: 28, preset: 'classic' } });
    check(g.players.length === 28, '28 demo players created');
    check(g.rules.carriersCount === 3 && g.rules.nursesCount === 1 && g.rules.investigatorsCount === 1, 'Classic 28-player counts = 3W/1Doc/1Det');

    startGame(g, 1000);
    check(g.phase === PHASES.ROLE_REVEAL, 'Transitions to ROLE_REVEAL');

    // Verify LCD projection hides roles completely
    var lcdView = projectViewForViewer(g, { kind: 'lcd' });
    check(lcdView.players.every(function (p) { return p.role === null; }), 'LCD hides all roles during game');

    // 2. Peaceful Night 1 + Investigator investigation
    advancePhase(g, 2000);
    check(g.phase === PHASES.NIGHT && g.round === 1, 'Enters Night 1');
    simulateBotActions(g, 2500);
    // Human P1 also acts
    var p1 = g.players[0];
    var otherTarget = g.players.find(function (x) { return x.id !== p1.id && x.role !== ROLES.CARRIER; });
    submitPlayerAction(g, p1.id, { type: 'night', targetId: otherTarget.id }, 2600);

    var lcdNight = projectViewForViewer(g, { kind: 'lcd' });
    check(lcdNight.players.every(function (p) { return p.hasActed === false; }), 'LCD hides individual night checkmarks (anti-tell)');
    check(lcdNight.counts.acted >= 27, 'Aggregate night counter increments');

    advancePhase(g, 3000);
    check(g.phase === PHASES.DAWN, 'Resolves to DAWN');
    check(livingPlayers(g).length === 27, 'Live Night 1 kill eliminates 1 victim');
    check(Boolean(g.lastStory), 'Story narration is generated for Dawn');
    check(g.secret.investigatorFindings.length === 1, 'Investigator records Night 1 finding');

    // 3. Day 1 Discussion -> Vote -> Tie Runoff test
    advancePhase(g, 4000);
    check(g.phase === PHASES.DAY_DISCUSSION, 'Enters DAY_DISCUSSION');
    advancePhase(g, 5000);
    check(g.phase === PHASES.DAY_VOTE, 'Enters DAY_VOTE');

    // Force a 2-way tie between two students
    var vils = livingPlayers(g, ROLES.STUDENT);
    submitPlayerAction(g, g.players[0].id, { type: 'vote', targetId: vils[0].id }, 5100);
    submitPlayerAction(g, g.players[1].id, { type: 'vote', targetId: vils[1].id }, 5100);
    advancePhase(g, 6000);
    check(g.phase === PHASES.DAY_REVOTE, 'Tie triggers DAY_REVOTE runoff');
    check(g.currentVote.tiedCandidates.length === 2, 'Runoff restricts to 2 tied suspects');

    // Break tie in runoff
    submitPlayerAction(g, g.players[0].id, { type: 'vote', targetId: vils[0].id }, 6100);
    submitPlayerAction(g, g.players[1].id, { type: 'vote', targetId: vils[0].id }, 6100);
    submitPlayerAction(g, g.players[2].id, { type: 'vote', targetId: vils[1].id }, 6100);
    advancePhase(g, 7000);
    check(g.phase === PHASES.DUSK, 'Runoff resolves to DUSK');
    check(!vils[0].alive, 'Plurality runoff suspect exiled');

    // 4. Night 2 Nurse Save test
    advancePhase(g, 8000);
    check(g.phase === PHASES.NIGHT && g.round === 2, 'Enters Night 2');
    var targetN2 = livingPlayers(g, ROLES.STUDENT)[0];
    submitModeratorNightOverride(g, ROLES.CARRIER, targetN2.id, 8100);
    submitModeratorNightOverride(g, ROLES.NURSE, targetN2.id, 8200);
    advancePhase(g, 9000);
    check(g.lastAnnouncement.savedByNurse === true && targetN2.alive === true, 'Nurse save prevents Night 2 carrier kill');

    // Verify repeat save is blocked on Night 3
    advancePhase(g, 9100); // Discussion
    advancePhase(g, 9200); // Vote
    advancePhase(g, 9300); // Dusk (0 votes -> no exile)
    advancePhase(g, 9400); // Night 3
    var doc = livingPlayers(g, ROLES.NURSE)[0];
    var repeatAttempt = submitPlayerAction(g, doc.id, { type: 'night', targetId: targetN2.id }, 9500);
    check(repeatAttempt.ok === false, 'Nurse repeat save on consecutive nights blocked by default rule');

    // 5. Full bot playthrough to completion
    var guard = 0;
    while (g.phase !== PHASES.GAME_OVER && guard < 300) {
      simulateBotActions(g, 10000 + guard * 100);
      if (g.players[0].alive && (g.phase === PHASES.NIGHT || g.phase === PHASES.DAY_VOTE || g.phase === PHASES.DAY_REVOTE)) {
        var validPool = g.phase === PHASES.DAY_REVOTE
          ? g.currentVote.tiedCandidates.map(function (id) { return getPlayer(g, id); })
          : livingPlayers(g).filter(function (x) { return x.id !== g.players[0].id && x.role !== g.players[0].role; });
        if (validPool.length) {
          submitPlayerAction(g, g.players[0].id, { type: 'auto', targetId: validPool[0].id }, 10050 + guard * 100);
        }
      }
      advancePhase(g, 10090 + guard * 100);
      guard++;
    }
    check(g.phase === PHASES.GAME_OVER && (g.winner === 'SCHOOL' || g.winner === 'CARRIERS'), 'Full 28-player game reaches valid victory (' + g.winner + ')');

    // 6. A8: split pack picks never produce a random victim
    var g2 = createGame({ seed: 424242, populateDemo: true, rules: { classSize: 10, preset: 'custom', carriersCount: 3, nursesCount: 1, investigatorsCount: 1 } });
    startGame(g2, 100);
    g2.players[0].role = ROLES.CARRIER;
    g2.players[1].role = ROLES.CARRIER;
    g2.players[2].role = ROLES.CARRIER;
    g2.players[3].role = ROLES.NURSE;
    g2.players[4].role = ROLES.INVESTIGATOR;
    for (var pi = 5; pi < g2.players.length; pi++) g2.players[pi].role = ROLES.STUDENT;
    advancePhase(g2, 200); // ROLE_REVEAL -> NIGHT
    check(g2.phase === PHASES.NIGHT, 'g2 enters Night 1');
    var vils2 = livingPlayers(g2, ROLES.STUDENT);
    submitPlayerAction(g2, 'P1', { type: 'night', targetId: vils2[0].id }, 300);
    submitPlayerAction(g2, 'P2', { type: 'night', targetId: vils2[1].id }, 300);
    submitPlayerAction(g2, 'P3', { type: 'night', targetId: vils2[2].id }, 300);
    advancePhase(g2, 400); // -> DAWN
    check(g2.phase === PHASES.DAWN, 'split night resolves to DAWN');
    check(livingPlayers(g2).length === 10, 'split pack with no teacher decision kills nobody (never random)');
    var rep2 = g2.secret.nightReports[g2.secret.nightReports.length - 1];
    check(rep2 && rep2.decisionMode === 'none' && rep2.victimId === null, 'night report records split -> none with no victim');
    check(g2.reveal && g2.reveal.kind === 'night_quiet', 'split night builds a night_quiet reveal');

    // teacher Pack Split decision picks the victim explicitly
    advancePhase(g2, 500); // DAWN -> DAY_DISCUSSION
    advancePhase(g2, 600); // -> DAY_VOTE
    advancePhase(g2, 700); // -> DUSK (no votes)
    advancePhase(g2, 800); // -> NIGHT round 2
    check(g2.phase === PHASES.NIGHT && g2.round === 2, 'g2 enters Night 2');
    var vils3 = livingPlayers(g2, ROLES.STUDENT);
    submitPlayerAction(g2, 'P1', { type: 'night', targetId: vils3[0].id }, 900);
    submitPlayerAction(g2, 'P2', { type: 'night', targetId: vils3[1].id }, 900);
    var decRes = submitNightDecision(g2, ROLES.CARRIER, { targetId: vils3[0].id }, 950);
    check(decRes.ok === true, 'teacher Pack Split decision accepted');
    advancePhase(g2, 1000);
    check(!vils3[0].alive && vils3[0].eliminatedHow === 'night', 'teacher-decided seat is the only victim');
    var rep3 = g2.secret.nightReports[g2.secret.nightReports.length - 1];
    check(rep3.decisionMode === 'teacher' && rep3.decidedBy === 'teacher' && rep3.victimId === vils3[0].id, 'night report records teacher decision + victim');
    check(g2.reveal && g2.reveal.kind === 'night_kill', 'night kill builds a night_kill reveal');

    // majority mode: 2 of 3 carriers agree -> majority kill without teacher
    advancePhase(g2, 1100); advancePhase(g2, 1200); advancePhase(g2, 1300); advancePhase(g2, 1400); // to Night 3
    check(g2.phase === PHASES.NIGHT && g2.round === 3, 'g2 enters Night 3');
    var vils4 = livingPlayers(g2, ROLES.STUDENT);
    submitPlayerAction(g2, 'P1', { type: 'night', targetId: vils4[0].id }, 1500);
    submitPlayerAction(g2, 'P2', { type: 'night', targetId: vils4[0].id }, 1500);
    submitPlayerAction(g2, 'P3', { type: 'night', targetId: vils4[1].id }, 1500);
    advancePhase(g2, 1600);
    check(!vils4[0].alive, 'majority (2 of 3) pack pick is the kill');
    var rep4 = g2.secret.nightReports[g2.secret.nightReports.length - 1];
    check(rep4.decisionMode === 'majority' && rep4.victimId === vils4[0].id, 'night report decisionMode = majority');

    // unanimous rule blocks a 2-of-3 majority
    var g2b = createGame({ seed: 777, populateDemo: true, rules: { classSize: 8, preset: 'custom', carriersCount: 3, nursesCount: 0, investigatorsCount: 0, packDecision: 'unanimous' } });
    startGame(g2b, 100);
    g2b.players[0].role = ROLES.CARRIER; g2b.players[1].role = ROLES.CARRIER; g2b.players[2].role = ROLES.CARRIER;
    for (var qi = 3; qi < g2b.players.length; qi++) g2b.players[qi].role = ROLES.STUDENT;
    advancePhase(g2b, 200);
    var vb = livingPlayers(g2b, ROLES.STUDENT);
    submitPlayerAction(g2b, 'P1', { type: 'night', targetId: vb[0].id }, 300);
    submitPlayerAction(g2b, 'P2', { type: 'night', targetId: vb[0].id }, 300);
    submitPlayerAction(g2b, 'P3', { type: 'night', targetId: vb[1].id }, 300);
    advancePhase(g2b, 400);
    check(livingPlayers(g2b).length === 8, 'unanimous rule: 2-of-3 majority is NOT a kill');

    // 7. A8: bots never hold power roles when enough humans are seated
    var g3 = createGame({ seed: 9001, rules: { classSize: 10, preset: 'custom', carriersCount: 2, nursesCount: 1, investigatorsCount: 1 } });
    for (var hi = 1; hi <= 6; hi++) addOrUpdatePlayer(g3, { id: 'H' + hi, name: 'Human ' + hi, isBot: false }, 100 + hi);
    fillSeats(g3, 'demo', 200); // pads to 10 with 4 bots
    startGame(g3, 300);
    var botsWithPower = g3.players.filter(function (p) { return p.isBot && p.role && p.role !== ROLES.STUDENT; });
    check(botsWithPower.length === 0, 'bots are never dealt Outbreak/Nurse/Investigator when humans cover power roles');
    var humansWithStudent = g3.players.filter(function (p) { return !p.isBot && p.role === ROLES.STUDENT; }).length;
    check(humansWithStudent >= 0 && g3.players.every(function (p) { return p.persona && p.persona.job; }), 'personas assigned to every seat at deal time');

    // 8. A8: epoch changes on reset (cloud replay guard D2 mirror)
    var eBefore = g3.epoch;
    var g3r = resetToLobby(g3, true, 400);
    check(g3r.epoch && g3r.epoch !== eBefore, 'resetToLobby mints a fresh epoch (Play Again cannot replay old picks)');

    // 9. Story engine: every reveal kind builds valid beats; no fragment repeats; no role leak
    var kindsSeen = {};
    var leakFree = true;
    var g4 = createGame({ seed: 31337, populateDemo: true, rules: { classSize: 12, preset: 'custom', carriersCount: 2, nursesCount: 1, investigatorsCount: 1, revealRoleOnDeath: false } });
    startGame(g4, 1000);
    var sguard = 0;
    while (g4.phase !== PHASES.GAME_OVER && sguard < 60) {
      simulateBotActions(g4, 2000 + sguard * 100);
      advancePhase(g4, 2050 + sguard * 100);
      sguard++;
      if (g4.reveal) {
        var rv = g4.reveal;
        kindsSeen[rv.kind] = true;
        check(rv.beats && rv.beats.length > 0, 'reveal ' + rv.kind + ' has beats');
        check(rv.id && rv.control && rv.control.status === 'ready', 'reveal ' + rv.kind + ' has id + ready control');
        if ((rv.kind === 'night_kill' || rv.kind === 'exile') && rv.subject) {
          if (rv.subject.role !== null && rv.subject.role !== undefined) leakFree = false;
        }
      }
    }
    check(leakFree, 'no role leak in reveal subject when revealRoleOnDeath is off');
    check(kindsSeen.night_kill || kindsSeen.night_save || kindsSeen.night_quiet, 'story: night outcomes produced reveals');
    check((g4.secret.nightReports || []).length >= 1, 'a night report is written every night');
    if (root.StoryEngine) {
      ['night_kill', 'night_save', 'night_quiet', 'exile', 'no_exile', 'victory_school', 'victory_carriers'].forEach(function (k) {
        var probe = root.StoryEngine.buildReveal(g4, k, { player: g4.players[0], breakdown: [{ seat: 1, name: 'A', votes: 2 }], skipVotes: 0, totalCast: 5 });
        check(probe.beats.length > 0 && probe.id && probe.control, 'story: every reveal kind builds valid beats (' + k + ')');
      });
      // Reveal beat vocabulary: each elimination reveal carries the full drama arc
      // (blackout -> narration -> suspense -> card_reveal -> verdict -> last_words -> ghost_rules).
      var killProbe = root.StoryEngine.buildReveal(g4, 'night_kill', { player: g4.players[0] });
      var killTypes = killProbe.beats.map(function (b) { return b.type; });
      ['blackout', 'narration', 'suspense', 'card_reveal', 'verdict', 'last_words', 'ghost_rules'].forEach(function (bt) {
        check(killTypes.indexOf(bt) !== -1, 'story: night_kill includes beat ' + bt);
      });
      check(killProbe.beats.some(function (b) { return b.type === 'card_reveal' && b.subject && b.subject.id; }),
        'story: night_kill card_reveal carries a subject');
      var exileProbe = root.StoryEngine.buildReveal(g4, 'exile', { player: g4.players[0], breakdown: [], skipVotes: 0, totalCast: 5 });
      var exileTypes = exileProbe.beats.map(function (b) { return b.type; });
      ['narration', 'verdict', 'card_reveal', 'last_words', 'ghost_rules'].forEach(function (bt) {
        check(exileTypes.indexOf(bt) !== -1, 'story: exile includes beat ' + bt);
      });
      var saveProbe = root.StoryEngine.buildReveal(g4, 'night_save', {});
      check(saveProbe.beats.some(function (b) { return b.type === 'blackout'; }) &&
        saveProbe.beats.some(function (b) { return b.type === 'narration'; }),
        'story: night_save has blackout + narration beats');
      // no story fragment repeats within a game (8-night synthetic run, pools hold 8+ entries)
      var g5 = createGame({ seed: 555111, populateDemo: true, rules: { classSize: 10, preset: 'classic' } });
      startGame(g5, 1000);
      var fragSeen = {};
      var fragDup = null;
      for (var ni = 1; ni <= 8 && !fragDup; ni++) {
        g5.round = ni;
        var kinds8 = ['night_kill', 'night_save', 'night_quiet', 'exile', 'no_exile'];
        var r8 = root.StoryEngine.buildReveal(g5, kinds8[ni % kinds8.length], { player: g5.players[1], breakdown: [], skipVotes: 0, totalCast: 0 });
        r8.beats.forEach(function (b) {
          (b.frags || []).forEach(function (fid) {
            if (fragSeen[fid]) fragDup = fid;
            fragSeen[fid] = true;
          });
        });
      }
      check(!fragDup, 'story: no fragment repeats within a game (dup=' + fragDup + ')');
    }

    // 10. reveal_control state machine (B6)
    var SE = root.StoryEngine;
    if (SE && g4.reveal) {
      var rv2 = g4.reveal;
      check(SE.applyControl(rv2, 'start', 123) === true && rv2.control.status === 'playing', 'reveal control: start');
      SE.applyControl(rv2, 'next', 124);
      check(rv2.control.beatIndex === 1, 'reveal control: next advances beatIndex');
      SE.applyControl(rv2, 'back', 125);
      check(rv2.control.beatIndex === 0, 'reveal control: back');
      SE.applyControl(rv2, 'skip', 126);
      check(rv2.control.status === 'done' && rv2.control.beatIndex === rv2.beats.length - 1, 'reveal control: skip jumps to done');
    }

    // 11. Test Mode: unclaimed 'Seat N' placeholders act as bots, so a
    // placeholder-only class plays to completion with no bot seats at all
    // (one-toggle demo class; regression guard for the stale-deploy incident).
    var g6 = createGame({ seed: 606060, rules: { classSize: 9, preset: 'custom', carriersCount: 2, nursesCount: 1, investigatorsCount: 1, testMode: true } });
    fillSeats(g6, 'numbered', 100); // 9 'Seat N' placeholders, zero isBot seats
    startGame(g6, 200);
    var phGuard = 0;
    while (g6.phase !== PHASES.GAME_OVER && phGuard < 80) {
      simulateBotActions(g6, 300 + phGuard * 100);
      advancePhase(g6, 350 + phGuard * 100);
      phGuard++;
    }
    check(g6.phase === PHASES.GAME_OVER && (g6.winner === 'SCHOOL' || g6.winner === 'CARRIERS'),
      'Test Mode: placeholder-only class reaches a valid victory (' + g6.winner + ')');
    check((g6.secret.nightReports || []).length >= 2, 'Test Mode placeholder game produced night reports');
    check(g6.secret.nightReports.some(function (r) { return r.victimId; }), 'Test Mode placeholder carriers actually killed at night');

    // ...and with Test Mode OFF those same placeholders must never be driven
    var g7 = createGame({ seed: 707070, rules: { classSize: 9, preset: 'custom', carriersCount: 2, nursesCount: 1, investigatorsCount: 1, testMode: false } });
    fillSeats(g7, 'numbered', 100);
    startGame(g7, 200);
    simulateBotActions(g7, 300);
    check(g7.players.every(function (p) { return !p.readyConfirmed; }), 'Test Mode OFF: placeholders stay un-driven (humans only)');
    advancePhase(g7, 400); // ROLE_REVEAL -> NIGHT
    simulateBotActions(g7, 500);
    check(Object.keys(g7.currentNight.carrierPicks).length === 0, 'Test Mode OFF: placeholder carriers pick nothing');

    // 12. Teacher seat management: add claims placeholders first, rename works any phase
    var g8 = createGame({ seed: 808080, rules: { classSize: 10, preset: 'custom', carriersCount: 2, nursesCount: 1, investigatorsCount: 1 } });
    fillSeats(g8, 'numbered', 100); // 10 placeholders
    var added = addPlayer(g8, 'Jordan He.', 150);
    check(added.ok && added.claimedPlaceholder && g8.players[0].name === 'Jordan He.' && g8.players[0].isBot === false,
      'addPlayer claims the first unclaimed placeholder seat');
    var added2 = addPlayer(g8, 'Sofia Ku.', 160);
    check(added2.ok && added2.claimedPlaceholder && g8.players[1].name === 'Sofia Ku.',
      'addPlayer claims the next placeholder seat');
    var idA = g8.players[0].id, idB = g8.players[1].id;
    check(idA !== idB, 'teacher-added seats keep unique ids');
    var added3 = addPlayer(g8, '', 170);
    check(added3.ok === false, 'addPlayer rejects an empty name');
    startGame(g8, 200);
    var ren = renamePlayer(g8, idA, 'Jordan He. (moved)', 250);
    check(ren.ok && g8.players[0].name === 'Jordan He. (moved)', 'renamePlayer works mid-game');
    var renPh = renamePlayer(g8, idB, 'Seat 2', 260);
    check(renPh.ok && /^Seat \d+$/.test(g8.players[1].name), 'renamePlayer can re-placeholder a seat');

    // 13. Legacy v1.0.0 state migration - god view must not throw on old rooms
    // (reproduces the exact "Cannot read properties of undefined (reading 'P2')"
    // cockpit crash from the OUT-E8SQ room that predated the v2 engine fields)
    var g9 = createGame({ seed: 909090, populateDemo: true, rules: { classSize: 12, preset: 'custom', carriersCount: 3, nursesCount: 1, investigatorsCount: 1 } });
    startGame(g9, 100);
    advancePhase(g9, 200); // NIGHT
    delete g9.currentNight.carrierConfirms;
    delete g9.currentNight.teacherDecisions;
    delete g9.currentVote.nominations;
    delete g9.secret.nightReports;
    delete g9.secret.usedFragments;
    delete g9.reveal;
    delete g9.rules.testMode;
    g9.version = '1.0.0';
    g9.epoch = undefined;
    var preThrew = null;
    try { projectViewForViewer(g9, { kind: 'god' }); } catch (e) { preThrew = e; }
    check(Boolean(preThrew), 'pre-migration god view on v1-shaped state throws (crash reproduced)');
    var mig = migrateGame(g9);
    check(mig.version === ENGINE_VERSION && Boolean(mig.epoch), 'migrateGame stamps current version + epoch');
    check(mig.currentNight.carrierConfirms && mig.currentNight.teacherDecisions && mig.currentVote.nominations && mig.rules.testMode === false,
      'migration restores v2 night/vote/secret fields and rules');
    var postThrew = null;
    var godViewMig = null;
    try { godViewMig = projectViewForViewer(mig, { kind: 'god' }); } catch (e) { postThrew = e; }
    check(!postThrew && godViewMig && godViewMig.god && godViewMig.god.packLock !== undefined, 'post-migration god view renders without throwing');
    var plThrew = null;
    try { projectViewForViewer(mig, { kind: 'player', playerId: mig.players[0].id }); } catch (e) { plThrew = e; }
    check(!plThrew, 'post-migration player view renders without throwing');

    return { ok: true, passed: results.length, winner: g.winner, rounds: g.round, results: results };
  }

  var api = {
    ENGINE_VERSION: ENGINE_VERSION,
    ROLES: ROLES,
    PHASES: PHASES,
    DEFAULT_RULES: DEFAULT_RULES,
    DEMO_NAMES: DEMO_NAMES,
    recommendRoles: recommendRoles,
    sanitizeRules: sanitizeRules,
    createGame: createGame,
    updateRules: updateRules,
    addOrUpdatePlayer: addOrUpdatePlayer,
    fillSeats: fillSeats,
    startGame: startGame,
    computeGroupConsensus: computeGroupConsensus,
    resolveGroupTarget: resolveGroupTarget,
    chooseFallbackTarget: chooseFallbackTarget,
    submitNightDecision: submitNightDecision,
    computePackLock: computePackLock,
    submitPlayerAction: submitPlayerAction,
    submitModeratorNightOverride: submitModeratorNightOverride,
    removeEmptySeats: removeEmptySeats,
    kickPlayer: kickPlayer,
    addPlayer: addPlayer,
    renamePlayer: renamePlayer,
    migrateGame: migrateGame,
    setPlayerAlive: setPlayerAlive,
    advancePhase: advancePhase,
    maybeAutoAdvance: maybeAutoAdvance,
    resetToLobby: resetToLobby,
    togglePause: togglePause,
    addTime: addTime,
    simulateBotActions: simulateBotActions,
    projectViewForViewer: projectViewForViewer,
    runSelfTest: runSelfTest
  };

  root.OutbreakEngine = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);

