/**
 * Digital Werewolf - Story Engine (pure: zero DOM, zero network)
 * Builds `game.reveal` event objects with typed beats for the LCD Theatre
 * and the light student-device mirror. All randomness comes from the game
 * seed via game.rngStep, so a game is fully reproducible from its seed.
 * Tone: spooky, never gory. No information the rules hide is ever emitted.
 */
(function (root) {
  'use strict';

  var STORY_ENGINE_VERSION = '1.0.0';

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
    var s = String(input == null ? 'story' : input);
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rngDraw(game) {
    game.rngStep = (game.rngStep || 0) + 1;
    var rng = mulberry32(hashSeed(game.seed + ':story:' + game.rngStep));
    return rng();
  }

  function pickIndex(game, n) {
    return Math.floor(rngDraw(game) * n) % n;
  }

  function content() {
    return root.StoryContent || (typeof module !== 'undefined' ? require('./story_content.js') : null);
  }

  function tone(game) {
    return (game.rules && game.rules.storyTone === 'campfire') ? 'campfire' : 'spooky';
  }

  function usedSet(game, poolName) {
    game.secret = game.secret || {};
    game.secret.usedFragments = game.secret.usedFragments || {};
    var used = game.secret.usedFragments[poolName] || (game.secret.usedFragments[poolName] = []);
    return used;
  }

  function pickFragment(game, poolName) {
    var C = content();
    if (!C || !C.POOLS[poolName]) return { id: null, text: '' };
    var pool = C.POOLS[poolName];
    var used = usedSet(game, poolName);
    var available = pool.filter(function (e) { return used.indexOf(e.id) === -1; });
    if (!available.length) {
      used.length = 0;
      available = pool.slice();
    }
    var entry = available[pickIndex(game, available.length)];
    used.push(entry.id);
    var t = tone(game);
    return { id: poolName + ':' + entry.id, text: (t === 'campfire' && entry.c) ? entry.c : entry.s };
  }

  function fragText(game, poolName, acc) {
    var f = pickFragment(game, poolName);
    if (f.id && acc) acc.push(f.id);
    return f.text;
  }

  function fill(tpl, vars) {
    return String(tpl).replace(/\{(\w+)\}/g, function (m, k) {
      return vars && vars[k] != null ? String(vars[k]) : m;
    });
  }

  function seatStr(p) {
    return p && p.seat ? ('#' + (p.seat < 10 ? '0' + p.seat : p.seat)) : '?';
  }

  function personaLine(p) {
    if (!p || !p.persona) return '';
    return 'the ' + p.persona.job + ' of ' + p.persona.home;
  }

  function holdFor(text, baseMs) {
    var words = String(text || '').split(/\s+/).filter(Boolean).length;
    return Math.min(22000, Math.max(4000, (baseMs || 5000) + words * 380));
  }

  function livingCount(game) {
    return game.players.filter(function (p) { return p.alive; }).length;
  }

  function actOf(game) {
    var ratio = game.players.length ? livingCount(game) / game.players.length : 1;
    if (game.round <= 1) return 'I';
    if (ratio > 0.66) return 'I';
    if (ratio > 0.33) return 'II';
    return 'III';
  }

  function priorVictims(game) {
    var n = 0;
    (game.players || []).forEach(function (p) { if (!p.alive) n++; });
    return n;
  }

  function subjectOf(game, player, opts) {
    opts = opts || {};
    var subj = {
      id: player ? player.id : null,
      seat: player ? player.seat : null,
      name: player ? player.name : '',
      persona: player && player.persona ? (personaLine(player)) : '',
      role: null
    };
    var revealRole = game.phase === 'GAME_OVER' || Boolean(game.rules && game.rules.revealRoleOnDeath);
    if (player && revealRole && !opts.hideRole) subj.role = player.role;
    return subj;
  }

  function newControl() {
    return { status: 'ready', beatIndex: 0, startedAtServerMs: null, paused: false };
  }

  function revealId(game, kind) {
    return (game.epoch || game.gameId) + '-' + game.round + '-' + kind;
  }

  /**
   * Build a reveal. kind: night_kill|night_save|night_quiet|exile|no_exile|victory_village|victory_wolves
   * ctx carries outcome data from the werewolf engine (victim, saved, breakdown...).
   */
  function buildReveal(game, kind, ctx) {
    ctx = ctx || {};
    var C = content();
    var copy = (C && C.BEAT_COPY) || {};
    var beats = [];
    var subject = null;

    if (kind === 'night_kill' || kind === 'exile') {
      subject = subjectOf(game, ctx.player || null);
    }

    if (kind === 'night_kill') {
      beats.push({ type: 'blackout', text: fill(copy.nightEndsRound || 'Night ends...', { round: game.round }), art: 'scene_night_ends', sfx: 'howl', holdMs: 2200 });
      var f1 = [];
      var narration = [
        fragText(game, 'weather', f1),
        fragText(game, 'setting', f1),
        fragText(game, 'discovery', f1),
        fragText(game, 'clue', f1)
      ].join(' ');
      beats.push({ type: 'narration', text: narration, frags: f1, art: 'scene_dawn_empty_house', sfx: 'bell', holdMs: holdFor(narration, 7000) });
      beats.push({ type: 'suspense', text: 'Listen...', art: 'scene_wolf_silhouettes', sfx: 'heartbeat', holdMs: 2600 });
      var takenText = 'Seat ' + seatStr(ctx.player) + ' ' + (ctx.player ? ctx.player.name : '') +
        (subject && subject.persona ? ', ' + subject.persona : '') + ' was taken in the night.';
      var revealRole = Boolean(game.rules && game.rules.revealRoleOnDeath);
      beats.push({
        type: 'card_reveal',
        text: takenText,
        subject: subject,
        art: revealRole && ctx.player ? ('role_' + ctx.player.role) : 'card_sealed',
        sfx: 'gavel',
        holdMs: 6000
      });
      if (revealRole && ctx.player) {
        beats.push({ type: 'role_flip', text: 'Their role was ' + ctx.player.role + '.', subject: subject, art: 'role_' + ctx.player.role, sfx: 'sting', holdMs: 4500 });
      } else {
        beats.push({ type: 'verdict', text: copy.sealed || 'Their secret goes with them.', art: 'card_sealed', sfx: 'bell', holdMs: 3500 });
      }
      if ((game.rules.lastWordsSec || 0) > 0 && ctx.player) {
        beats.push({ type: 'last_words', text: fill(copy.lastWords || '{name} may speak.', { name: ctx.player.name, sec: game.rules.lastWordsSec }), subject: subject, holdMs: game.rules.lastWordsSec * 1000 });
      }
      beats.push({ type: 'ghost_rules', text: (C && C.GHOST_RULES) || '', art: 'scene_night_ends', sfx: 'night', holdMs: 5000 });
      var f2 = [];
      var closing = fragText(game, 'aftermath', f2) + ' ' + fragText(game, 'closing', f2);
      beats.push({ type: 'narration', text: closing, frags: f2, art: 'scene_dawn_empty_house', sfx: 'bell', holdMs: holdFor(closing, 5000) });
    } else if (kind === 'night_save') {
      beats.push({ type: 'blackout', text: fill(copy.nightEndsRound || 'Night ends...', { round: game.round }), art: 'scene_night_ends', sfx: 'howl', holdMs: 2200 });
      var f3 = [];
      var saveText = [
        fragText(game, 'weather', f3),
        fragText(game, 'setting', f3),
        copy.nobodyTaken || 'Nobody was taken tonight.'
      ].join(' ');
      beats.push({ type: 'narration', text: saveText, frags: f3, art: 'scene_doctor_lantern', sfx: 'bell', holdMs: holdFor(saveText, 6000) });
      var f4 = [];
      var saveClose = fragText(game, 'aftermath', f4) + ' ' + fragText(game, 'closing', f4);
      beats.push({ type: 'narration', text: saveClose, frags: f4, art: 'scene_dawn_empty_house', sfx: 'bell', holdMs: holdFor(saveClose, 5000) });
    } else if (kind === 'night_quiet') {
      beats.push({ type: 'blackout', text: fill(copy.nightEndsRound || 'Night ends...', { round: game.round }), art: 'scene_night_ends', sfx: 'night', holdMs: 2000 });
      var f5 = [];
      var quietText = [fragText(game, 'weather', f5), fragText(game, 'setting', f5), copy.quietDawn || 'A quiet dawn.'].join(' ');
      beats.push({ type: 'narration', text: quietText, frags: f5, art: 'scene_dawn_empty_house', sfx: 'bell', holdMs: holdFor(quietText, 6000) });
    } else if (kind === 'exile') {
      beats.push({ type: 'narration', text: copy.councilVoted || 'The council has voted.', art: 'scene_council_trial', sfx: 'bell', holdMs: 4000 });
      var breakdown = (ctx.breakdown || []).slice(0, 6);
      breakdown.forEach(function (item) {
        beats.push({
          type: 'tally',
          text: 'Seat ' + seatStr(item) + ' ' + (item.name || '') + ' - ' + item.votes + (item.votes === 1 ? ' vote' : ' votes'),
          tally: item,
          sfx: 'tick',
          holdMs: 1400
        });
      });
      if ((ctx.skipVotes || 0) > 0) {
        beats.push({ type: 'tally', text: 'Skip / Hold - ' + ctx.skipVotes + ' votes', sfx: 'tick', holdMs: 1200 });
      }
      beats.push({
        type: 'verdict',
        text: fill(copy.chosen || 'The council has chosen Seat #{seat}.', { seat: ctx.player ? seatStr(ctx.player) : '?' }) + ' ' + (ctx.player ? ctx.player.name : ''),
        subject: subject,
        art: 'scene_town_gate',
        sfx: 'gavel',
        holdMs: 4500
      });
      if ((game.rules.lastWordsSec || 0) > 0 && ctx.player) {
        beats.push({ type: 'last_words', text: fill(copy.lastWordsExile || copy.lastWords, { name: ctx.player.name, sec: game.rules.lastWordsSec }), subject: subject, holdMs: game.rules.lastWordsSec * 1000 });
      }
      var revealRole2 = Boolean(game.rules && game.rules.revealRoleOnDeath);
      beats.push({
        type: 'card_reveal',
        text: 'Seat ' + seatStr(ctx.player) + ' ' + (ctx.player ? ctx.player.name : '') + (subject && subject.persona ? ', ' + subject.persona : '') + ' is exiled beyond the town gate.',
        subject: subject,
        art: revealRole2 && ctx.player ? ('role_' + ctx.player.role) : 'card_sealed',
        sfx: 'clang',
        holdMs: 6000
      });
      if (revealRole2 && ctx.player) {
        beats.push({ type: 'role_flip', text: 'Their role was ' + ctx.player.role + '.', subject: subject, art: 'role_' + ctx.player.role, sfx: 'sting', holdMs: 4500 });
      }
      beats.push({ type: 'ghost_rules', text: (C && C.GHOST_RULES) || '', art: 'scene_town_gate', sfx: 'night', holdMs: 5000 });
    } else if (kind === 'no_exile') {
      beats.push({ type: 'narration', text: copy.noVerdict || 'No verdict. Paranoia deepens.', art: 'scene_deadlock', sfx: 'sting', holdMs: 5000 });
      var f6 = [];
      var deadText = fragText(game, 'aftermath', f6) + ' ' + fragText(game, 'closing', f6);
      beats.push({ type: 'narration', text: deadText, frags: f6, art: 'scene_deadlock', sfx: 'night', holdMs: holdFor(deadText, 5000) });
    } else if (kind === 'victory_village' || kind === 'victory_wolves') {
      var wolvesWin = kind === 'victory_wolves';
      beats.push({
        type: 'verdict',
        text: wolvesWin ? (copy.victoryWolves || 'The werewolves win.') : (copy.victoryVillage || 'The village wins!'),
        art: wolvesWin ? 'banner_victory_wolves' : 'banner_victory_village',
        sfx: wolvesWin ? 'howl' : 'bell',
        holdMs: 7000
      });
      var ordered = (game.players || []).slice().sort(function (a, b) {
        var rank = function (p) {
          if (p.role === 'WEREWOLF') return 0;
          if (p.role === 'DOCTOR') return 1;
          if (p.role === 'DETECTIVE') return 2;
          return 3;
        };
        return rank(a) - rank(b) || a.seat - b.seat;
      });
      ordered.forEach(function (p) {
        beats.push({
          type: 'roster_flip',
          text: 'Seat ' + seatStr(p) + ' ' + p.name + ' - ' + (p.role || 'VILLAGER') + (p.alive ? '' : ' (out)'),
          subject: subjectOf(game, p, { hideRole: false }),
          art: p.role ? ('role_' + p.role) : 'role_villager',
          sfx: p.role === 'WEREWOLF' ? 'howl' : 'tick',
          holdMs: 1100
        });
      });
    }

    return {
      id: revealId(game, kind),
      kind: kind,
      round: game.round,
      act: actOf(game),
      priorVictims: priorVictims(game),
      subject: subject,
      beats: beats,
      control: newControl()
    };
  }

  /** Apply a moderator control command to a reveal's control object. Returns true if changed. */
  function applyControl(reveal, cmd, serverNowMs) {
    if (!reveal || !reveal.control) return false;
    var c = reveal.control;
    var max = reveal.beats.length - 1;
    if (cmd === 'start') {
      c.status = 'playing';
      c.beatIndex = 0;
      c.startedAtServerMs = serverNowMs || null;
      c.paused = false;
      return true;
    }
    if (c.status === 'ready' && cmd !== 'start') return false;
    if (cmd === 'next') { c.beatIndex = Math.min(max, c.beatIndex + 1); if (c.beatIndex === max) c.status = 'done'; return true; }
    if (cmd === 'back') { c.beatIndex = Math.max(0, c.beatIndex - 1); c.status = 'playing'; return true; }
    if (cmd === 'skip') { c.beatIndex = max; c.status = 'done'; return true; }
    if (cmd === 'pause') { c.paused = !c.paused; return true; }
    return false;
  }

  var api = {
    STORY_ENGINE_VERSION: STORY_ENGINE_VERSION,
    buildReveal: buildReveal,
    applyControl: applyControl
  };

  root.StoryEngine = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
