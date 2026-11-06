/**
 * Digital Werewolf - Core Deterministic Game Engine (v1.0)
 * Room 8 / Bicentennial Junior High ILT Class Game
 *
 * Pure JS state machine: zero DOM, zero network, PII-free.
 * Runs identically in Browser (<script>), Node self-tests, and Google Apps Script.
 */
(function (root) {
  'use strict';

  var ENGINE_VERSION = '1.0.0';

  var ROLES = {
    WEREWOLF: 'WEREWOLF',
    DOCTOR: 'DOCTOR',
    DETECTIVE: 'DETECTIVE',
    VILLAGER: 'VILLAGER'
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
    wolvesCount: 3,
    doctorsCount: 1,
    detectivesCount: 1,
    peacefulNight1: false,      // Live kill right from Night 1! Werewolves hunt immediately
    doctorSelfSave: false,      // Can a doctor protect themselves?
    doctorRepeatSave: false,    // Can doctors protect the exact same player two nights running?
    revealRoleOnDeath: false,   // Reveal eliminated player's true role to the village?
    claimRule: 'quiet',         // 'quiet' (no role claiming out loud) | 'open' (classic claiming allowed)
    tieRule: 'revote_then_none',// 'revote_then_none' | 'no_elimination'
    spectatorReveal: true,      // Dead players become full-reveal silent spectators on their device
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
    var wolves, doctors, detectives;

    if (mode === 'student_pitch') {
      // Student pitch allows multiple doctors and multiple detectives acting unanimously
      wolves = n >= 25 ? 3 : (n >= 15 ? 2 : 1);
      doctors = n >= 20 ? 2 : 1;
      detectives = n >= 20 ? 2 : 1;
    } else {
      // Classic classroom balance: 1 wolf per ~10 players (2 at 20-24, 3 at 25-30), 1 doc, 1 detective
      wolves = n >= 25 ? 3 : (n >= 16 ? 2 : 1);
      doctors = 1;
      detectives = 1;
    }

    // Ensure wolves never start at parity and at least 1 villager exists
    var maxWolves = Math.max(1, Math.floor((n - 1) / 2));
    wolves = Math.min(wolves, maxWolves);
    while (wolves + doctors + detectives >= n && (doctors > 0 || detectives > 0)) {
      if (detectives > 1) detectives--;
      else if (doctors > 1) doctors--;
      else if (detectives > 0) detectives--;
      else doctors--;
    }

    return {
      classSize: n,
      wolvesCount: wolves,
      doctorsCount: doctors,
      detectivesCount: detectives,
      villagersCount: Math.max(0, n - wolves - doctors - detectives)
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
      if (!partial || (partial.wolvesCount === undefined && partial.doctorsCount === undefined && partial.detectivesCount === undefined)) {
        var rec = recommendRoles(merged.classSize, merged.preset);
        merged.wolvesCount = rec.wolvesCount;
        merged.doctorsCount = rec.doctorsCount;
        merged.detectivesCount = rec.detectivesCount;
      }
    }

    var maxWolves = Math.max(1, Math.floor((merged.classSize - 1) / 2));
    merged.wolvesCount = clamp(merged.wolvesCount, 1, Math.min(8, maxWolves));
    merged.doctorsCount = clamp(merged.doctorsCount, 0, Math.min(5, merged.classSize - merged.wolvesCount - 1));
    merged.detectivesCount = clamp(
      merged.detectivesCount,
      0,
      Math.min(5, merged.classSize - merged.wolvesCount - merged.doctorsCount - 1)
    );

    merged.peacefulNight1 = Boolean(merged.peacefulNight1);
    merged.doctorSelfSave = Boolean(merged.doctorSelfSave);
    merged.doctorRepeatSave = Boolean(merged.doctorRepeatSave);
    merged.revealRoleOnDeath = Boolean(merged.revealRoleOnDeath);
    merged.spectatorReveal = Boolean(merged.spectatorReveal);
    merged.claimRule = merged.claimRule === 'open' ? 'open' : 'quiet';
    merged.tieRule = merged.tieRule === 'no_elimination' ? 'no_elimination' : 'revote_then_none';
    merged.nightTimerSec = clamp(merged.nightTimerSec, 15, 300);
    merged.discussionTimerSec = clamp(merged.discussionTimerSec, 30, 600);
    merged.voteTimerSec = clamp(merged.voteTimerSec, 15, 300);
    merged.revoteTimerSec = clamp(merged.revoteTimerSec, 15, 180);

    return merged;
  }

  function makeRoomCode(seed) {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var rng = mulberry32(hashSeed(seed));
    var out = 'WOLF-';
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
      seed: seedNum,
      rngStep: 0,
      createdAt: now,
      updatedAt: now,
      phase: PHASES.LOBBY,
      nightSubStep: 'ALL', // 'ALL' | 'WOLVES' | 'DOCTOR' | 'DETECTIVE' (for narrator projector cue)
      round: 0,
      phaseStartedAt: now,
      phaseDurationSec: 0,
      paused: false,
      pauseRemainingSec: null,
      rules: rules,
      players: players,
      // Current round buffers (cleared at phase transitions)
      currentNight: {
        wolfPicks: {},       // actorId -> targetId
        doctorPicks: {},     // actorId -> targetId
        detectivePicks: {},  // actorId -> targetId
        villagerNotes: {}    // actorId -> suspectId (classroom decoy tap so everyone taps once at night)
      },
      currentVote: {
        ballots: {},         // voterId -> targetId | 'SKIP'
        tiedCandidates: [],  // candidateIds when in DAY_REVOTE
        nominations: []      // optional day discussion suspect pins
      },
      secret: {
        lastDoctorSavedId: null,
        detectiveFindings: [], // [{ round, targetId, targetName, role }]
        doctorSavesCount: 0,
        auditLog: []           // God-view full event trace
      },
      publicFeed: [
        {
          id: 'evt_0',
          round: 0,
          phase: PHASES.LOBBY,
          kind: 'info',
          headline: 'Welcome to Moonhollow Harbour',
          detail: 'Waiting for the class (' + rules.classSize + ' seats) to join the town council.'
        }
      ],
      lastAnnouncement: {
        kind: 'lobby',
        headline: 'Town Council Lobby Open',
        subline: 'Target class size: ' + rules.classSize + ' players.',
        eliminatedId: null,
        savedByDoctor: false
      },
      lastVoteSummary: null,
      winner: null, // null | 'VILLAGE' | 'WEREWOLVES'
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
  function startGame(game, now) {
    now = now || Date.now();
    if (game.players.length < 6) {
      return { ok: false, error: 'Need at least 6 players in seats to start Werewolf.' };
    }

    // Sync classSize to actual seated players if teacher starts with fewer/more than slider
    game.rules = sanitizeRules(mergeObj(game.rules, { classSize: game.players.length, preset: 'custom' }));

    var n = game.players.length;
    var deck = [];
    var i;
    for (i = 0; i < game.rules.wolvesCount; i++) deck.push(ROLES.WEREWOLF);
    for (i = 0; i < game.rules.doctorsCount; i++) deck.push(ROLES.DOCTOR);
    for (i = 0; i < game.rules.detectivesCount; i++) deck.push(ROLES.DETECTIVE);
    while (deck.length < n) deck.push(ROLES.VILLAGER);

    game.rngStep = (game.rngStep || 0) + 1;
    var rng = mulberry32(hashSeed(game.seed + ':deal:' + game.rngStep));
    var shuffled = shuffleWithRng(deck, rng);

    for (i = 0; i < n; i++) {
      game.players[i].seat = i + 1;
      game.players[i].alive = true;
      game.players[i].eliminatedRound = null;
      game.players[i].eliminatedHow = null;
      game.players[i].role = shuffled[i];
      game.players[i].readyConfirmed = Boolean(game.players[i].isBot);
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
      lastDoctorSavedId: null,
      detectiveFindings: [],
      doctorSavesCount: 0,
      auditLog: [
        {
          round: 1,
          phase: PHASES.ROLE_REVEAL,
          text: 'Roles dealt to ' + n + ' players (' +
            game.rules.wolvesCount + ' Wolves, ' +
            game.rules.doctorsCount + ' Doctor(s), ' +
            game.rules.detectivesCount + ' Detective(s), ' +
            (n - game.rules.wolvesCount - game.rules.doctorsCount - game.rules.detectivesCount) + ' Villagers).'
        }
      ]
    };

    game.publicFeed = [
      {
        id: 'evt_deal',
        round: 1,
        phase: PHASES.ROLE_REVEAL,
        kind: 'phase',
        headline: 'Secret Identities Dealt (' + n + ' Players)',
        detail: 'Check your private screen quietly. Keep your Chromebook angled toward yourself!'
      }
    ];
    game.lastAnnouncement = {
      kind: 'reveal',
      headline: 'Peek at Your Secret Role',
      subline: 'Tap and hold your role card privately, then press "I Know My Role". Never show your neighbour!',
      eliminatedId: null,
      savedByDoctor: false
    };
    game.updatedAt = now;
    return { ok: true };
  }

  /**
   * Compute unanimity & breakdown for a multi-member role group (Wolves, Doctors, Detectives).
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

  function chooseFallbackTarget(game, consensus) {
    if (consensus.unanimousTarget) return { targetId: consensus.unanimousTarget, mode: 'unanimous' };
    var keys = Object.keys(consensus.counts);
    if (keys.length === 0) return { targetId: null, mode: 'none' };
    keys.sort(function (a, b) { return consensus.counts[b] - consensus.counts[a]; });
    var topScore = consensus.counts[keys[0]];
    var tied = keys.filter(function (k) { return consensus.counts[k] === topScore; });
    if (tied.length === 1) return { targetId: tied[0], mode: 'plurality' };
    var idx = Math.floor(nextRandom(game) * tied.length);
    return { targetId: tied[idx], mode: 'tiebreak' };
  }

  /**
   * Submit a player action (ready check, night pick, villager decoy note, or day ballot).
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
      return { ok: false, error: 'Eliminated players are silent ghosts and cannot submit actions.' };
    }

    if (game.phase === PHASES.NIGHT) {
      var targetId = String((actionPayload && actionPayload.targetId) || '');
      var target = getPlayer(game, targetId);
      if (!target || !target.alive) {
        return { ok: false, error: 'Choose a living player.' };
      }

      if (actor.role === ROLES.WEREWOLF) {
        if (target.role === ROLES.WEREWOLF && livingPlayers(game).length > livingPlayers(game, ROLES.WEREWOLF).length) {
          return { ok: false, error: 'Werewolves must target a non-werewolf villager.' };
        }
        game.currentNight.wolfPicks[actor.id] = target.id;
        game.updatedAt = now;
        return { ok: true, roleAction: 'wolf_pick', targetId: target.id };
      }

      if (actor.role === ROLES.DOCTOR) {
        if (!game.rules.doctorSelfSave && target.id === actor.id) {
          return { ok: false, error: 'Rule active: Doctors cannot self-save.' };
        }
        if (!game.rules.doctorRepeatSave && game.secret.lastDoctorSavedId && target.id === game.secret.lastDoctorSavedId) {
          return { ok: false, error: 'Rule active: Cannot protect the same player two nights in a row.' };
        }
        game.currentNight.doctorPicks[actor.id] = target.id;
        game.updatedAt = now;
        return { ok: true, roleAction: 'doctor_pick', targetId: target.id };
      }

      if (actor.role === ROLES.DETECTIVE) {
        if (target.id === actor.id) {
          return { ok: false, error: 'Choose another player to investigate.' };
        }
        game.currentNight.detectivePicks[actor.id] = target.id;
        game.updatedAt = now;
        return { ok: true, roleAction: 'detective_pick', targetId: target.id };
      }

      // Villager decoy action: records personal suspicion note so every student taps their screen at night
      game.currentNight.villagerNotes[actor.id] = target.id;
      game.updatedAt = now;
      return { ok: true, roleAction: 'villager_watch', targetId: target.id };
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
   * Lets teacher tap the Wolves' target, Doctor's save, and Detective's check directly.
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

    if (roleKey === ROLES.WEREWOLF) {
      var wolves = livingPlayers(game, ROLES.WEREWOLF);
      for (var w = 0; w < wolves.length; w++) {
        if (targetId) game.currentNight.wolfPicks[wolves[w].id] = targetId;
        else delete game.currentNight.wolfPicks[wolves[w].id];
      }
    } else if (roleKey === ROLES.DOCTOR) {
      var docs = livingPlayers(game, ROLES.DOCTOR);
      for (var d = 0; d < docs.length; d++) {
        if (targetId) game.currentNight.doctorPicks[docs[d].id] = targetId;
        else delete game.currentNight.doctorPicks[docs[d].id];
      }
    } else if (roleKey === ROLES.DETECTIVE) {
      var dets = livingPlayers(game, ROLES.DETECTIVE);
      for (var c = 0; c < dets.length; c++) {
        if (targetId) game.currentNight.detectivePicks[dets[c].id] = targetId;
        else delete game.currentNight.detectivePicks[dets[c].id];
      }
    }
    game.updatedAt = now;
    return { ok: true };
  }

  function buildStoryNarration(kind, data) {
    data = data || {};
    var round = data.round || 1;
    var name = data.name || 'a villager';
    var seat = data.seat ? ('Seat #' + (data.seat < 10 ? '0' + data.seat : data.seat)) : '';

    if (kind === 'night_start') {
      var nightStories = [
        'A thick November fog rolls in off the harbour as the midnight bells toll. The villagers bar their doors and draw their shutters, hoping to survive until morning while silent footsteps stalk the cobblestone alleys.',
        'Cold sea winds sweep across the docks. The lantern on the village tavern flickers and dies out. Somewhere in the shadows, yellow eyes gleam in the dark as the hunt begins.',
        'Moonlight filters through the clouds over Moonhollow Harbour. The town falls dead quiet. Behind closed curtains, heartbeats quicken as the pack prowls the village paths.'
      ];
      return nightStories[(round - 1) % nightStories.length];
    }

    if (kind === 'dawn_kill') {
      var killStories = [
        'Dawn breaks cold and grey over the harbour. As the church bell tolls for morning roll call, the villagers find ' + seat + ' (' + name + ') tragically missing. Down near the water, shredded coats and deep claw marks tell the grim tale: ' + name + ' was taken by the werewolves in the dead of night.',
        'The morning rooster crows through the sea mist, but one home remains dark. Villagers rush to ' + seat + ' and find the door unlatched and the room ransacked. ' + name + ' has fallen victim to the ravenous wolves.',
        'A chilling silence hangs over the town square this morning. When the council gathers at the docks, ' + seat + ' (' + name + ') is absent. The werewolves struck under the shadow of high tide, leaving only footprints in the mud.'
      ];
      return killStories[(round - 1) % killStories.length];
    }

    if (kind === 'dawn_save') {
      var saveStories = [
        'Under the cover of pitch darkness, the beasts clawed at the window of ' + seat + ' (' + name + '). But just as the shadows closed in, the Town Doctor rushed through the fog with a blazing lantern and protective herbs, driving the wolves back into the sea! ' + name + ' was saved in the nick of time!',
        'Savage snarls echoed outside the door of ' + seat + ' (' + name + ') in the midnight hours. Before the pack could strike, the Doctor intervened with steel and courage! ' + name + ' was shielded until morning, and nobody died tonight!'
      ];
      return saveStories[(round - 1) % saveStories.length];
    }

    if (kind === 'dawn_peaceful') {
      return 'The harbour was eerily quiet through the long hours of the dark. Strange shadows danced in the trees, but the dawn bell chimed with good news: every villager woke safely in their bed this morning.';
    }

    if (kind === 'dusk_exile') {
      var exileStories = [
        'Heated debate raged across the town hall as the sun dipped toward the harbour. Suspicious glances turned to pointed fingers. By council vote, ' + seat + ' (' + name + ') was condemned and marched to the town gates, exiled into the deep mist.',
        'Accusations flew back and forth through the afternoon. In the final ballot, the town council delivered their verdict against ' + seat + ' (' + name + '). Protesting their innocence, ' + name + ' was cast out beyond the harbour walls as the iron gates locked shut.'
      ];
      return exileStories[(round - 1) % exileStories.length];
    }

    if (kind === 'dusk_no_exile') {
      return 'Voices clashed and fists slammed on the council tables until twilight fell! With the vote locked in a dead heat, no verdict could be reached. The accused walked free, but paranoia runs deeper than ever as night approaches.';
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
      wolfPicks: {},
      doctorPicks: {},
      detectivePicks: {},
      villagerNotes: {}
    };
    var nightNote = (game.round === 1 && game.rules.peacefulNight1)
      ? 'Night 1 (Starter Night): Wolves coordinate silently, Detectives investigate 1 suspect, Villagers log a Night Watch hunch. Nobody dies tonight!'
      : 'Night ' + game.round + ': Everyone tap 1 choice quietly on your Chromebook so no clicks give away your role.';
    var nightStory = buildStoryNarration('night_start', { round: game.round });
    game.lastAnnouncement = {
      kind: 'night',
      headline: 'Night ' + game.round + ' Falls Over Moonhollow',
      subline: nightNote,
      story: nightStory,
      eliminatedId: null,
      savedByDoctor: false
    };
    game.lastStory = nightStory;
    pushFeed(game, 'night', 'Night ' + game.round + ' Begins', nightNote);
  }

  function resolveNightToDawn(game, now) {
    var wolves = livingPlayers(game, ROLES.WEREWOLF);
    var doctors = livingPlayers(game, ROLES.DOCTOR);
    var detectives = livingPlayers(game, ROLES.DETECTIVE);

    var wolfCon = computeGroupConsensus(game.currentNight.wolfPicks, wolves);
    var docCon = computeGroupConsensus(game.currentNight.doctorPicks, doctors);
    var detCon = computeGroupConsensus(game.currentNight.detectivePicks, detectives);

    var wolfChoice = chooseFallbackTarget(game, wolfCon);
    var docChoice = chooseFallbackTarget(game, docCon);
    var detChoice = chooseFallbackTarget(game, detCon);

    var isPeaceful = (game.round === 1 && game.rules.peacefulNight1);

    // 1. Doctor protection record (applies on real kill nights)
    var protectedId = (!isPeaceful && doctors.length > 0) ? docChoice.targetId : null;
    if (protectedId) {
      game.secret.lastDoctorSavedId = protectedId;
    }

    // 2. Detective investigation (always active, including Night 1!)
    if (detectives.length > 0 && detChoice.targetId) {
      var checked = getPlayer(game, detChoice.targetId);
      if (checked) {
        game.secret.detectiveFindings.push({
          round: game.round,
          targetId: checked.id,
          seat: checked.seat,
          targetName: checked.name,
          role: checked.role,
          consensusMode: detChoice.mode
        });
        game.secret.auditLog.push({
          round: game.round,
          phase: PHASES.NIGHT,
          text: 'Detective(s) investigated ' + checked.name + ' -> ' + checked.role + ' (' + detChoice.mode + ').'
        });
      }
    }

    // 3. Wolf attack vs Doctor save
    var eliminatedPlayer = null;
    var savedByDoctor = false;

    if (isPeaceful) {
      game.secret.auditLog.push({
        round: game.round,
        phase: PHASES.NIGHT,
        text: 'Peaceful Starter Night 1 (wolf dry-run target: ' + (wolfChoice.targetId || 'none') + ').'
      });
    } else if (wolfChoice.targetId) {
      var victim = getPlayer(game, wolfChoice.targetId);
      if (victim && victim.alive) {
        if (protectedId && protectedId === victim.id) {
          savedByDoctor = true;
          game.secret.doctorSavesCount = (game.secret.doctorSavesCount || 0) + 1;
          game.secret.auditLog.push({
            round: game.round,
            phase: PHASES.NIGHT,
            text: 'Wolves attacked ' + victim.name + ', SAVED by Doctor!'
          });
        } else {
          victim.alive = false;
          victim.eliminatedRound = game.round;
          victim.eliminatedHow = 'night';
          eliminatedPlayer = victim;
          game.secret.auditLog.push({
            round: game.round,
            phase: PHASES.NIGHT,
            text: 'Wolves eliminated ' + victim.name + ' (' + victim.role + ') [' + wolfChoice.mode + '].'
          });
        }
      }
    } else {
      game.secret.auditLog.push({
        round: game.round,
        phase: PHASES.NIGHT,
        text: 'Wolves submitted no target; nobody died.'
      });
    }

    game.phase = PHASES.DAWN;
    game.phaseStartedAt = now;
    game.phaseDurationSec = 20;
    game.paused = false;
    game.pauseRemainingSec = null;

    var headline, subline;
    var dawnStory = '';
    if (isPeaceful) {
      headline = 'Dawn of Day 1: Everyone Survived the Arrival Night!';
      subline = 'Detectives gathered their first clue. Talk out loud in the room to spot subtle bluffs!';
      dawnStory = buildStoryNarration('dawn_peaceful', { round: game.round });
    } else if (savedByDoctor) {
      var savedP = getPlayer(game, wolfChoice.targetId);
      headline = 'Dawn of Day ' + game.round + ': MIRACLE SAVE! Nobody Died!';
      subline = 'The Werewolves struck in the dark, but the Town Doctor arrived right on time!';
      dawnStory = buildStoryNarration('dawn_save', {
        round: game.round,
        name: savedP ? savedP.name : 'a villager',
        seat: savedP ? savedP.seat : 0
      });
    } else if (eliminatedPlayer) {
      var roleTag = game.rules.revealRoleOnDeath ? (' (' + eliminatedPlayer.role + ')') : '';
      headline = 'Dawn of Day ' + game.round + ': ' + eliminatedPlayer.name + ' Was Eliminated!';
      subline = 'Seat #' + eliminatedPlayer.seat + roleTag + ' is now a Silent Ghost Spectator.';
      dawnStory = buildStoryNarration('dawn_kill', {
        round: game.round,
        name: eliminatedPlayer.name,
        seat: eliminatedPlayer.seat
      });
    } else {
      headline = 'Dawn of Day ' + game.round + ': Quiet Night in Moonhollow';
      subline = 'All villagers woke safely this morning.';
      dawnStory = buildStoryNarration('dawn_peaceful', { round: game.round });
    }

    game.lastAnnouncement = {
      kind: 'dawn',
      headline: headline,
      subline: subline,
      story: dawnStory,
      eliminatedId: eliminatedPlayer ? eliminatedPlayer.id : null,
      savedByDoctor: savedByDoctor
    };
    game.lastStory = dawnStory;
    pushFeed(game, savedByDoctor ? 'save' : (eliminatedPlayer ? 'death' : 'dawn'), headline, subline);

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
      ? 'Quiet Inference Rule: Persuade using logic and behaviour - nobody may claim a power role out loud!'
      : 'Open Discussion: Debate suspects out loud in the room before the secret ballot opens.';

    game.lastAnnouncement = {
      kind: 'discussion',
      headline: 'Day ' + game.round + ' Town Council Debate',
      subline: ruleBanner,
      eliminatedId: null,
      savedByDoctor: false
    };
    pushFeed(game, 'day', 'Day ' + game.round + ' Town Debate Open', ruleBanner);
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
      subline: 'Every living villager casts 1 secret vote on their Chromebook (or votes Skip / No Exile).',
      eliminatedId: null,
      savedByDoctor: false
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
      finalizeDuskNoExile(game, now, 'Town Council Voted to Hold (No Exile)',
        skipVotes + ' Skip votes vs highest suspect (' + topCount + '). Nobody was exiled today.',
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
          subline: 'Deadlock at ' + topCount + ' votes (' + tiedNames + '). Make 15-second defences, then revote!',
          eliminatedId: null,
          savedByDoctor: false
        };
        pushFeed(game, 'tie', 'Tie-Breaker Runoff Triggered', tiedNames + ' tied with ' + topCount + ' votes each.');
        return;
      }

      finalizeDuskNoExile(game, now, 'Deadlocked Council: Nobody Exiled',
        'The ballot ended in a tie (' + topCount + ' votes). Under town law, nobody is exiled tonight.',
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
      text: 'Village exiled ' + exiled.name + ' (' + exiled.role + ') with ' + topCount + '/' + totalCast + ' votes.'
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

    var duskHeadline = exiled.name + ' Was Exiled by the Town (' + topCount + ' Votes)';
    var duskStory = buildStoryNarration('dusk_exile', {
      round: game.round,
      name: exiled.name,
      seat: exiled.seat
    });
    game.lastAnnouncement = {
      kind: 'dusk',
      headline: duskHeadline,
      subline: roleRevealTxt + ' Night approaches...',
      story: duskStory,
      eliminatedId: exiled.id,
      savedByDoctor: false
    };
    game.lastStory = duskStory;
    pushFeed(game, 'exile', duskHeadline, roleRevealTxt);

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
      savedByDoctor: false
    };
    game.lastStory = noExileStory;
    pushFeed(game, 'dusk', headline, subline);
    checkAndApplyWinner(game, now);
  }

  function checkAndApplyWinner(game, now) {
    var wolves = livingPlayers(game, ROLES.WEREWOLF).length;
    var aliveTotal = livingPlayers(game).length;
    var town = aliveTotal - wolves;

    if (wolves === 0) {
      game.winner = 'VILLAGE';
      game.winReason = 'Every Werewolf has been uncovered and exiled! Moonhollow Harbour is safe!';
      game.phase = PHASES.GAME_OVER;
      game.phaseStartedAt = now;
      game.phaseDurationSec = 0;
      game.lastAnnouncement = {
        kind: 'victory_village',
        headline: 'VILLAGE VICTORY!',
        subline: game.winReason,
        eliminatedId: game.lastAnnouncement.eliminatedId,
        savedByDoctor: false
      };
      pushFeed(game, 'win', 'VILLAGE WINS!', game.winReason);
      return 'VILLAGE';
    }

    if (wolves >= town) {
      game.winner = 'WEREWOLVES';
      game.winReason = 'Werewolves reached parity (' + wolves + ' Wolves vs ' + town + ' Villagers) and seized Moonhollow!';
      game.phase = PHASES.GAME_OVER;
      game.phaseStartedAt = now;
      game.phaseDurationSec = 0;
      game.lastAnnouncement = {
        kind: 'victory_wolves',
        headline: 'WEREWOLVES WIN!',
        subline: game.winReason,
        eliminatedId: game.lastAnnouncement.eliminatedId,
        savedByDoctor: false
      };
      pushFeed(game, 'win', 'WEREWOLVES WIN!', game.winReason);
      return 'WEREWOLVES';
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

  /**
   * Reset back to Lobby keeping the seated roster intact for instant Round 2!
   */
  function resetToLobby(game, keepPlayers, now) {
    now = now || Date.now();
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
    fresh.players = kept;
    return fresh;
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
      if (p.role === ROLES.WEREWOLF) return Boolean(game.currentNight.wolfPicks[p.id]);
      if (p.role === ROLES.DOCTOR) return Boolean(game.currentNight.doctorPicks[p.id]);
      if (p.role === ROLES.DETECTIVE) return Boolean(game.currentNight.detectivePicks[p.id]);
      return Boolean(game.currentNight.villagerNotes[p.id]);
    }
    if (game.phase === PHASES.DAY_VOTE || game.phase === PHASES.DAY_REVOTE) {
      return Boolean(game.currentVote.ballots[p.id]);
    }
    return false;
  }

  /**
   * Smart AI bot actions for Demo / Partial-Bot Classroom Testing!
   */
  function simulateBotActions(game, now) {
    now = now || Date.now();
    var alive = livingPlayers(game);
    if (game.phase === PHASES.ROLE_REVEAL) {
      game.players.forEach(function (p) {
        if (p.isBot) p.readyConfirmed = true;
      });
      game.updatedAt = now;
      return { ok: true };
    }

    if (game.phase === PHASES.NIGHT) {
      // Wolves converge on 1 non-wolf target (respecting any human wolf's pick first!)
      var wolves = livingPlayers(game, ROLES.WEREWOLF);
      var nonWolves = alive.filter(function (p) { return p.role !== ROLES.WEREWOLF; });
      var humanWolfPick = null;
      wolves.forEach(function (w) {
        if (!w.isBot && game.currentNight.wolfPicks[w.id]) {
          humanWolfPick = game.currentNight.wolfPicks[w.id];
        }
      });
      var sharedWolfTarget = humanWolfPick || (nonWolves.length
        ? nonWolves[Math.floor(nextRandom(game) * nonWolves.length)].id
        : null);

      wolves.forEach(function (w) {
        if (w.isBot && sharedWolfTarget) {
          game.currentNight.wolfPicks[w.id] = sharedWolfTarget;
        }
      });

      // Doctors converge on a valid save target
      var doctors = livingPlayers(game, ROLES.DOCTOR);
      var humanDocPick = null;
      doctors.forEach(function (d) {
        if (!d.isBot && game.currentNight.doctorPicks[d.id]) humanDocPick = game.currentNight.doctorPicks[d.id];
      });
      var validDocTargets = alive.filter(function (p) {
        if (!game.rules.doctorRepeatSave && game.secret.lastDoctorSavedId === p.id) return false;
        if (!game.rules.doctorSelfSave && doctors.some(function (d) { return d.id === p.id; })) return false;
        return true;
      });
      var sharedDocTarget = humanDocPick || (validDocTargets.length
        ? validDocTargets[Math.floor(nextRandom(game) * validDocTargets.length)].id
        : null);
      doctors.forEach(function (d) {
        if (d.isBot && sharedDocTarget) {
          game.currentNight.doctorPicks[d.id] = sharedDocTarget;
        }
      });

      // Detectives check an un-checked suspect
      var detectives = livingPlayers(game, ROLES.DETECTIVE);
      var checkedIds = {};
      game.secret.detectiveFindings.forEach(function (f) { checkedIds[f.targetId] = true; });
      var humanDetPick = null;
      detectives.forEach(function (c) {
        if (!c.isBot && game.currentNight.detectivePicks[c.id]) humanDetPick = game.currentNight.detectivePicks[c.id];
      });
      var detCandidates = alive.filter(function (p) {
        return p.role !== ROLES.DETECTIVE && !checkedIds[p.id];
      });
      if (!detCandidates.length) {
        detCandidates = alive.filter(function (p) { return !detectives.some(function (d) { return d.id === p.id; }); });
      }
      var sharedDetTarget = humanDetPick || (detCandidates.length
        ? detCandidates[Math.floor(nextRandom(game) * detCandidates.length)].id
        : null);
      detectives.forEach(function (c) {
        if (c.isBot && sharedDetTarget) {
          game.currentNight.detectivePicks[c.id] = sharedDetTarget;
        }
      });

      // Bot villagers tap a decoy suspect
      alive.forEach(function (p) {
        if (p.isBot && p.role === ROLES.VILLAGER) {
          var others = alive.filter(function (x) { return x.id !== p.id; });
          if (others.length) {
            game.currentNight.villagerNotes[p.id] = others[Math.floor(nextRandom(game) * others.length)].id;
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

      // Known wolves discovered by detectives attract detective votes
      var knownWolves = game.secret.detectiveFindings
        .filter(function (f) { return f.role === ROLES.WEREWOLF; })
        .map(function (f) { return f.targetId; })
        .filter(function (id) { return pool.some(function (p) { return p.id === id; }); });

      alive.forEach(function (voter) {
        if (!voter.isBot) return;
        if (voter.role === ROLES.DETECTIVE && knownWolves.length > 0) {
          game.currentVote.ballots[voter.id] = knownWolves[0];
          return;
        }
        if (voter.role === ROLES.WEREWOLF) {
          var nonWolfFocal = focal.filter(function (t) { return t.role !== ROLES.WEREWOLF; });
          if (nonWolfFocal.length > 0) {
            game.currentVote.ballots[voter.id] = nonWolfFocal[0].id;
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
      if (me && me.role === ROLES.WEREWOLF && p.role === ROLES.WEREWOLF) showRole = true;
      if (me && me.role === ROLES.DOCTOR && p.role === ROLES.DOCTOR) showRole = true;
      if (me && me.role === ROLES.DETECTIVE && p.role === ROLES.DETECTIVE) showRole = true;
      if (me && !me.alive && game.rules.spectatorReveal) showRole = true;

      // CRITICAL ANTI-TELL: On the front LCD during NIGHT, do NOT reveal per-seat checkmarks!
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
        hasActed: showIndividualActed ? hasPlayerActedInCurrentPhase(game, p) : false,
        role: showRole ? p.role : null
      };
    });

    var totalExpectedActors = game.phase === PHASES.ROLE_REVEAL ? game.players.length : aliveCount;

    var out = {
      version: game.version,
      gameId: game.gameId,
      updatedAt: game.updatedAt,
      phase: game.phase,
      nightSubStep: game.nightSubStep || 'ALL',
      round: game.round,
      phaseStartedAt: game.phaseStartedAt,
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
      winReason: game.winReason
    };

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

      if (me.role === ROLES.WEREWOLF) {
        var wolves = livingPlayers(game, ROLES.WEREWOLF);
        priv.packmates = game.players
          .filter(function (x) { return x.role === ROLES.WEREWOLF; })
          .map(function (x) { return { id: x.id, seat: x.seat, name: x.name, alive: x.alive, pick: game.currentNight.wolfPicks[x.id] || null }; });
        priv.consensus = computeGroupConsensus(game.currentNight.wolfPicks, wolves);
        priv.myNightPick = game.currentNight.wolfPicks[me.id] || null;
      } else if (me.role === ROLES.DOCTOR) {
        var docs = livingPlayers(game, ROLES.DOCTOR);
        priv.colleagues = game.players
          .filter(function (x) { return x.role === ROLES.DOCTOR; })
          .map(function (x) { return { id: x.id, seat: x.seat, name: x.name, alive: x.alive, pick: game.currentNight.doctorPicks[x.id] || null }; });
        priv.consensus = computeGroupConsensus(game.currentNight.doctorPicks, docs);
        priv.myNightPick = game.currentNight.doctorPicks[me.id] || null;
        priv.lastDoctorSavedId = game.secret.lastDoctorSavedId;
      } else if (me.role === ROLES.DETECTIVE) {
        var dets = livingPlayers(game, ROLES.DETECTIVE);
        priv.colleagues = game.players
          .filter(function (x) { return x.role === ROLES.DETECTIVE; })
          .map(function (x) { return { id: x.id, seat: x.seat, name: x.name, alive: x.alive, pick: game.currentNight.detectivePicks[x.id] || null }; });
        priv.consensus = computeGroupConsensus(game.currentNight.detectivePicks, dets);
        priv.myNightPick = game.currentNight.detectivePicks[me.id] || null;
        priv.findings = game.secret.detectiveFindings || [];
        if (priv.myNightPick) {
          var curTarget = getPlayer(game, priv.myNightPick);
          if (curTarget) {
            priv.currentNightTargetRole = curTarget.role;
            priv.currentNightTargetName = curTarget.name;
            priv.currentNightTargetSeat = curTarget.seat;
          }
        }
      } else {
        priv.myNightPick = game.currentNight.villagerNotes[me.id] || null;
      }

      if (!me.alive && game.rules.spectatorReveal) {
        priv.isSpectatorTruthUnlocked = true;
        priv.spectatorAudit = game.secret.auditLog.slice(-8);
      }

      out.me = priv;
    }

    if (isGod) {
      out.god = {
        wolfConsensus: computeGroupConsensus(game.currentNight.wolfPicks, livingPlayers(game, ROLES.WEREWOLF)),
        doctorConsensus: computeGroupConsensus(game.currentNight.doctorPicks, livingPlayers(game, ROLES.DOCTOR)),
        detectiveConsensus: computeGroupConsensus(game.currentNight.detectivePicks, livingPlayers(game, ROLES.DETECTIVE)),
        currentNight: game.currentNight,
        currentBallots: game.currentVote.ballots,
        secret: game.secret,
        livingWolves: livingPlayers(game, ROLES.WEREWOLF).length,
        livingTown: aliveCount - livingPlayers(game, ROLES.WEREWOLF).length
      };
    }

    return out;
  }

  /**
   * Built-in deterministic self-test suite (verifies 28-player deal, unanimity, peaceful Night 1,
   * Doctor save, Detective check, runoff tie revote, anti-leak view projection, and win parity).
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
    check(g.rules.wolvesCount === 3 && g.rules.doctorsCount === 1 && g.rules.detectivesCount === 1, 'Classic 28-player counts = 3W/1Doc/1Det');

    startGame(g, 1000);
    check(g.phase === PHASES.ROLE_REVEAL, 'Transitions to ROLE_REVEAL');

    // Verify LCD projection hides roles completely
    var lcdView = projectViewForViewer(g, { kind: 'lcd' });
    check(lcdView.players.every(function (p) { return p.role === null; }), 'LCD hides all roles during game');

    // 2. Peaceful Night 1 + Detective investigation
    advancePhase(g, 2000);
    check(g.phase === PHASES.NIGHT && g.round === 1, 'Enters Night 1');
    simulateBotActions(g, 2500);
    // Human P1 also acts
    var p1 = g.players[0];
    var otherTarget = g.players.find(function (x) { return x.id !== p1.id && x.role !== ROLES.WEREWOLF; });
    submitPlayerAction(g, p1.id, { type: 'night', targetId: otherTarget.id }, 2600);

    var lcdNight = projectViewForViewer(g, { kind: 'lcd' });
    check(lcdNight.players.every(function (p) { return p.hasActed === false; }), 'LCD hides individual night checkmarks (anti-tell)');
    check(lcdNight.counts.acted >= 27, 'Aggregate night counter increments');

    advancePhase(g, 3000);
    check(g.phase === PHASES.DAWN, 'Resolves to DAWN');
    check(livingPlayers(g).length === 27, 'Live Night 1 kill eliminates 1 victim');
    check(Boolean(g.lastStory), 'Story narration is generated for Dawn');
    check(g.secret.detectiveFindings.length === 1, 'Detective records Night 1 finding');

    // 3. Day 1 Discussion -> Vote -> Tie Runoff test
    advancePhase(g, 4000);
    check(g.phase === PHASES.DAY_DISCUSSION, 'Enters DAY_DISCUSSION');
    advancePhase(g, 5000);
    check(g.phase === PHASES.DAY_VOTE, 'Enters DAY_VOTE');

    // Force a 2-way tie between two villagers
    var vils = livingPlayers(g, ROLES.VILLAGER);
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

    // 4. Night 2 Doctor Save test
    advancePhase(g, 8000);
    check(g.phase === PHASES.NIGHT && g.round === 2, 'Enters Night 2');
    var targetN2 = livingPlayers(g, ROLES.VILLAGER)[0];
    submitModeratorNightOverride(g, ROLES.WEREWOLF, targetN2.id, 8100);
    submitModeratorNightOverride(g, ROLES.DOCTOR, targetN2.id, 8200);
    advancePhase(g, 9000);
    check(g.lastAnnouncement.savedByDoctor === true && targetN2.alive === true, 'Doctor save prevents Night 2 wolf kill');

    // Verify repeat save is blocked on Night 3
    advancePhase(g, 9100); // Discussion
    advancePhase(g, 9200); // Vote
    advancePhase(g, 9300); // Dusk (0 votes -> no exile)
    advancePhase(g, 9400); // Night 3
    var doc = livingPlayers(g, ROLES.DOCTOR)[0];
    var repeatAttempt = submitPlayerAction(g, doc.id, { type: 'night', targetId: targetN2.id }, 9500);
    check(repeatAttempt.ok === false, 'Doctor repeat save on consecutive nights blocked by default rule');

    // 5. Full bot playthrough to completion
    var guard = 0;
    while (g.phase !== PHASES.GAME_OVER && guard < 80) {
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
    check(g.phase === PHASES.GAME_OVER && (g.winner === 'VILLAGE' || g.winner === 'WEREWOLVES'), 'Full 28-player game reaches valid victory (' + g.winner + ')');

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
    submitPlayerAction: submitPlayerAction,
    submitModeratorNightOverride: submitModeratorNightOverride,
    advancePhase: advancePhase,
    resetToLobby: resetToLobby,
    togglePause: togglePause,
    addTime: addTime,
    simulateBotActions: simulateBotActions,
    projectViewForViewer: projectViewForViewer,
    runSelfTest: runSelfTest
  };

  root.WerewolfEngine = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);

