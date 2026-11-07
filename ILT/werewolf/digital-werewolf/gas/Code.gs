/**
 * ============================================================================
 * Room 8 Digital Werewolf - Server Backend (Code.gs)        R8-WEREWOLF-2.1.2
 * ============================================================================
 * Private repository file: bihipri-27/Student_System-priv/digital-werewolf-gas/Code.gs
 *
 * v2.0.0 hardening (2026-11-06 improvement plan, Workstream D):
 *  D1  no full-state ScriptProperties mirror (9KB cap) - cache-only hot state
 *  D2  per-game epoch in every action key + purge of consumed keys
 *  D3  stale-submit guard: re-read round/phase/epoch after the action write
 *  D4  top-level try/catch -> JSON errors; serverNowMs on every response
 *  D5  teacher PIN throttle + lockout (CacheService); fallbacks removed;
 *      domain check uses endsWith('@gnspes.ca')
 *  D6  join burst: cache-only writes, JSON {status:'busy'} on lock timeout
 *  D7  engine bundled between markers by tools-priv/bundle_werewolf_gas.py
 *  D8  new moderator actions: night_decision, reveal_control, kick_player,
 *      remove_empty_seats, moderator_override, lcd_heartbeat
 *  D9  SERVER_VERSION and ENGINE_VERSION bumped together
 *
 * LIVE DEPLOYED URL:
 *  https://script.google.com/macros/s/AKfycbwBwSXL5Ma8koQ0JHgXrx01Avp3zvpjaDdSqG_RTFE9E19iqNETYdXru8ecXr7zkNlX/exec
 *
 * SINGLE-FILE DEPLOYMENT:
 *  - Run tools-priv/bundle_werewolf_gas.py, then paste the whole Code.gs into
 *    Apps Script -> Deploy -> New version.
 *  - Script Properties: R8_IDENTITY_KEY, TEACHER_PIN
 *  - Web app: Execute as Me | Anyone
 * ============================================================================
 */

var SERVER_VERSION = 'R8-WEREWOLF-2.1.2';
var WerewolfEngine;
var StoryEngine;
var StoryContent;
var ALLOWED_DOMAIN = 'gnspes.ca';
var FRESH_MS = 4 * 60 * 60 * 1000; // 4-hour signature window matching R8-VAULT
var CACHE_TTL_SEC = 21600;         // 6 hours in CacheService
var PIN_FAIL_KEY = 'ww_pin_fail';
var PIN_LOCK_KEY = 'ww_pin_lock';
var PIN_MAX_FAILS = 8;
var PIN_LOCK_SEC = 300;            // 5-minute lockout after 8 bad PINs (Dave testing preference, 2026-11-06)

function props_() {
  return PropertiesService.getScriptProperties();
}

function cache_() {
  return CacheService.getScriptCache();
}

// Soft moderator mutex on CacheService: replaces LockService, whose script-wide
// lock state wedged twice (2026-11-06/07) and instantly refused every waitLock on
// two separate projects. The moderator path is single-teacher and join bursts are
// rare, so a best-effort 15s marker is the right trade - worst case under a
// genuine collision is one duplicate click, which the UI already tolerates.
var MOD_LOCK_KEY = 'ww_modlock';
function acquireModLock_() {
  if (cache_().get(MOD_LOCK_KEY)) return false;
  cache_().put(MOD_LOCK_KEY, String(Date.now()), 15);
  return true;
}
function releaseModLock_() {
  cache_().remove(MOD_LOCK_KEY);
}

function identityKey_() {
  return props_().getProperty('R8_IDENTITY_KEY') || '';
}

// D5: throttle + lockout; only the TEACHER_PIN property is accepted (no fallbacks).
function verifyTeacherPin_(candidate) {
  var lockUntil = Number(cache_().get(PIN_LOCK_KEY) || 0);
  if (lockUntil > Date.now()) return false;
  var pin = props_().getProperty('TEACHER_PIN') || '';
  if (!pin) return false;
  if (String(candidate || '').trim() === String(pin).trim()) {
    cache_().remove(PIN_FAIL_KEY);
    return true;
  }
  var fails = Number(cache_().get(PIN_FAIL_KEY) || 0) + 1;
  if (fails >= PIN_MAX_FAILS) {
    cache_().put(PIN_LOCK_KEY, String(Date.now() + PIN_LOCK_SEC * 1000), PIN_LOCK_SEC);
    cache_().remove(PIN_FAIL_KEY);
  } else {
    cache_().put(PIN_FAIL_KEY, String(fails), 3600);
  }
  return false;
}

function signIdentity_(email, ts) {
  var key = identityKey_();
  if (!key) return '';
  var bytes = Utilities.computeHmacSha256Signature(String(email) + '|' + String(ts), key);
  return bytes.map(function (b) {
    var v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function verifyIdentity_(email, ts, sig) {
  email = String(email || '').toLowerCase().trim();
  ts = Number(ts || 0);
  sig = String(sig || '');
  if (!email || !ts || !sig) return { ok: false, reason: 'missing' };
  if (Math.abs(Date.now() - ts) > FRESH_MS) return { ok: false, reason: 'stale_or_future' };
  // D5: strict domain suffix check (was indexOf, spoofable via subdomains)
  if (ALLOWED_DOMAIN && email.slice(-('@' + ALLOWED_DOMAIN).length) !== '@' + ALLOWED_DOMAIN) {
    return { ok: false, reason: 'domain_not_allowed' };
  }
  var expected = signIdentity_(email, ts);
  if (!expected || expected.length !== sig.length) return { ok: false, reason: 'bad_sig' };
  var diff = 0;
  for (var i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  if (diff !== 0) return { ok: false, reason: 'bad_sig' };
  return { ok: true, email: email };
}

function jsonOut_(obj) {
  obj.serverVersion = SERVER_VERSION;
  obj.engineVersion = (typeof WerewolfEngine !== 'undefined' && WerewolfEngine) ? WerewolfEngine.ENGINE_VERSION : 'missing';
  obj.serverNowMs = Date.now(); // D8: clients estimate clock offset from this
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Format safe display name (First + 2 letters of surname, e.g. "Jordan Th."). */
function safeDisplayName_(rawName, email) {
  var cleaned = String(rawName || '').replace(/[^a-zA-Z0-9 '\-.]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned && email) {
    var local = String(email).split('@')[0].replace(/[0-9]+$/g, '').replace(/[._-]+/g, ' ').trim();
    cleaned = local;
  }
  if (!cleaned) return 'Villager';
  var parts = cleaned.split(' ').filter(Boolean);
  var first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  if (parts.length === 1) return first.slice(0, 18);
  var last = parts[parts.length - 1].replace(/[^a-zA-Z]/g, '');
  if (!last) return first.slice(0, 18);
  var init2 = last.charAt(0).toUpperCase() + (last.length > 1 ? last.charAt(1).toLowerCase() : '');
  return (first + ' ' + init2 + '.').slice(0, 22);
}

function gameKey_(gameId) {
  return 'ww_state_' + String(gameId || '').toUpperCase();
}

function emailMapKey_(gameId) {
  return 'ww_emap_' + String(gameId || '').toUpperCase();
}

function lcdHeartbeatKey_(gameId) {
  return 'ww_lcd_hb_' + String(gameId || '').toUpperCase();
}

// D2: action keys carry the per-game epoch, so a reset/Play-Again can never fold
// the previous game's picks into the new one (fixes ghost kills, F5).
function actionKey_(gameId, epoch, round, phase, playerId) {
  return 'ww_act_' + String(gameId).toUpperCase() + '_' + epoch + '_' + round + '_' + phase + '_' + playerId;
}

function loadGame_(gameId) {
  if (!gameId) gameId = props_().getProperty('WW_ACTIVE_GAME_ID') || '';
  if (!gameId) return null;
  var key = gameKey_(gameId);
  var raw = cache_().get(key) || props_().getProperty(key);
  if (!raw) return null;
  var game;
  try { game = JSON.parse(raw); } catch (e) { return null; }
  // Legacy-game migration: rooms created by older engines (e.g. WOLF-E8SQ stuck
  // at ROLE_REVEAL since the v1.0.0 era) lack the v2 state fields, and the
  // god-view projection throws on them every teacher poll. Migrate once, then
  // persist, so the very next load is a clean current-shape game.
  if (game.version !== WerewolfEngine.ENGINE_VERSION && typeof WerewolfEngine.migrateGame === 'function') {
    WerewolfEngine.migrateGame(game);
    saveGame_(game);
  }
  // Legacy-game bridge: games created before v2.0.0 carry no epoch (e.g. the
  // WOLF-E8SQ test room stuck at ROLE_REVEAL after a redeploy). Mint one and
  // persist so action keys, the stale-submit guard and reset purges are all
  // well-defined from the first post-redeploy touch.
  if (!game.epoch) {
    game.epoch = 'E' + Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36);
    saveGame_(game);
  }
  foldAtomicActionsIntoGame_(game);
  return game;
}

// D1: hot state lives in CacheService only; ScriptProperties keeps just the
// active game id pointer (the full-state props mirror exceeded 9KB by round 2-3).
function saveGame_(game) {
  var key = gameKey_(game.gameId);
  cache_().put(key, JSON.stringify(game), CACHE_TTL_SEC);
  props_().setProperty('WW_ACTIVE_GAME_ID', game.gameId);
}

// D6: join path must not touch ScriptProperties at all (burst-join serialization).
function saveGameCacheOnly_(game) {
  cache_().put(gameKey_(game.gameId), JSON.stringify(game), CACHE_TTL_SEC);
}

function loadEmailMap_(gameId) {
  var raw = cache_().get(emailMapKey_(gameId)) || props_().getProperty(emailMapKey_(gameId));
  if (!raw) return {};
  try { return JSON.parse(raw); } catch (e) { return {}; }
}

function saveEmailMap_(gameId, emap) {
  cache_().put(emailMapKey_(gameId), JSON.stringify(emap), CACHE_TTL_SEC);
}

// D2: remove the consumed action keys for one (epoch, round, phase) cell.
function purgeActionKeys_(game, epoch, round, phase) {
  var keys = (game.players || []).map(function (p) {
    return actionKey_(game.gameId, epoch, round, phase, p.id);
  });
  if (keys.length) cache_().removeAll(keys);
}

/**
 * Merge isolated per-player action keys from CacheService into the in-memory game object.
 * Runs lock-free on polls and under the CacheService soft lock right before phase transitions.
 */
function foldAtomicActionsIntoGame_(game) {
  if (!game || !game.players || !game.players.length) return;
  var activePhase = game.phase;
  if (
    activePhase !== 'ROLE_REVEAL' &&
    activePhase !== 'NIGHT' &&
    activePhase !== 'DAY_VOTE' &&
    activePhase !== 'DAY_REVOTE'
  ) {
    return;
  }

  var keys = game.players.map(function (p) {
    return actionKey_(game.gameId, game.epoch, game.round, activePhase, p.id);
  });
  var hitMap = cache_().getAll(keys) || {};

  for (var i = 0; i < game.players.length; i++) {
    var p = game.players[i];
    var k = actionKey_(game.gameId, game.epoch, game.round, activePhase, p.id);
    if (!hitMap[k]) continue;
    var act;
    try { act = JSON.parse(hitMap[k]); } catch (e) { continue; }
    WerewolfEngine.submitPlayerAction(game, p.id, act, act.ts || game.updatedAt);
  }
}

function doGet(e) {
  // D4: always answer JSON, never an HTML error page
  try {
    var action = (e && e.parameter && e.parameter.action) || '';
    if (action === 'get_health') {
      return jsonOut_({
        status: 'healthy',
        service: 'Room 8 Digital Werewolf Server',
        activeGameId: props_().getProperty('WW_ACTIVE_GAME_ID') || null
      });
    }
    if (action === 'poll_lcd') {
      var gid = (e && e.parameter && e.parameter.gameId) || '';
      var g = loadGame_(gid);
      if (!g) return jsonOut_({ status: 'no_game' });
      return jsonOut_({
        status: 'ok',
        view: WerewolfEngine.projectViewForViewer(g, { kind: 'lcd' })
      });
    }
    return jsonOut_({
      status: 'ok',
      service: 'Room 8 Digital Werewolf Server',
      hint: 'Use ?action=get_health or POST game commands.'
    });
  } catch (err) {
    return jsonOut_({ status: 'error', message: String(err && err.message || err) });
  }
}

function doPost(e) {
  // D4: top-level guard - every response is JSON
  try {
    var body;
    try {
      body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    } catch (err) {
      return jsonOut_({ status: 'error', message: 'Invalid JSON body.' });
    }

    var action = String(body.action || '');

    // ------------------------------------------------------------------
    // 1. LOCK-FREE POLLING (28 Chromebooks + LCD every 1.2-5s with jitter)
    // ------------------------------------------------------------------
    if (action === 'poll_state') {
      var game = loadGame_(body.gameId);
      if (!game) return jsonOut_({ status: 'no_game' });

      if (body.viewerKind === 'god') {
        if (!verifyTeacherPin_(body.teacherPin)) {
          return jsonOut_({ status: 'auth_failed', message: 'Teacher PIN required for God View.' });
        }
        return jsonOut_({ status: 'ok', view: WerewolfEngine.projectViewForViewer(game, { kind: 'god' }) });
      }

      if (body.viewerKind === 'player') {
        var v = verifyIdentity_(body.email, body.ts, body.sig);
        if (!v.ok) return jsonOut_({ status: 'auth_failed', reason: v.reason });
        var emap = loadEmailMap_(game.gameId);
        var pid = emap[v.email] || null;
        return jsonOut_({
          status: 'ok',
          joined: Boolean(pid),
          playerId: pid,
          view: WerewolfEngine.projectViewForViewer(game, pid ? { kind: 'player', playerId: pid } : { kind: 'lcd' })
        });
      }

      return jsonOut_({ status: 'ok', view: WerewolfEngine.projectViewForViewer(game, { kind: 'lcd' }) });
    }

    // ------------------------------------------------------------------
    // 2. LOCK-FREE ATOMIC PLAYER ACTION (zero write contention!)
    // ------------------------------------------------------------------
    if (action === 'submit_action') {
      var auth = verifyIdentity_(body.email, body.ts, body.sig);
      if (!auth.ok) return jsonOut_({ status: 'auth_failed', reason: auth.reason });

      var gAct = loadGame_(body.gameId);
      if (!gAct) return jsonOut_({ status: 'error', message: 'No active game found.' });

      var mapAct = loadEmailMap_(gAct.gameId);
      var actorId = mapAct[auth.email];
      if (!actorId) return jsonOut_({ status: 'error', message: 'Join a seat in the Lobby first.' });

      var payloadObj = {
        type: String(body.type || ''),
        targetId: String(body.targetId || ''),
        line: String(body.line || ''),
        requestId: String(body.requestId || ''),
        ts: Date.now()
      };

      // Validate against engine rules before writing the player's isolated cache slot
      var checkRes = WerewolfEngine.submitPlayerAction(gAct, actorId, payloadObj, payloadObj.ts);
      if (!checkRes.ok) {
        return jsonOut_({ status: 'rejected', message: checkRes.error });
      }

      var aKey = actionKey_(gAct.gameId, gAct.epoch, gAct.round, gAct.phase, actorId);
      cache_().put(aKey, JSON.stringify(payloadObj), CACHE_TTL_SEC);

      // D3: stale-submit guard - re-read the authoritative cell; if the teacher
      // advanced the phase between our load and our write, tell the client to re-submit.
      var reRaw = cache_().get(gameKey_(gAct.gameId));
      if (reRaw) {
        try {
          var reGame = JSON.parse(reRaw);
          if (reGame.epoch !== gAct.epoch || reGame.round !== gAct.round || reGame.phase !== gAct.phase) {
            return jsonOut_({ status: 'stale', message: 'Round or phase changed - re-submit.' });
          }
        } catch (e2) {}
      }

      var confirmedRaw = cache_().get(aKey);
      return jsonOut_({
        status: 'ok',
        confirmed: Boolean(confirmedRaw),
        requestId: payloadObj.requestId,
        view: WerewolfEngine.projectViewForViewer(gAct, { kind: 'player', playerId: actorId })
      });
    }

    // ------------------------------------------------------------------
    // 3. STUDENT JOIN SEAT (soft lock, LOBBY only, cache-only writes - D6)
    // ------------------------------------------------------------------
    if (action === 'join_game') {
      var vJoin = verifyIdentity_(body.email, body.ts, body.sig);
      if (!vJoin.ok) return jsonOut_({ status: 'auth_failed', reason: vJoin.reason });

      if (!acquireModLock_()) {
        return jsonOut_({ status: 'busy', message: 'Server busy - retry in a moment.' });
      }
      try {
        var gJoin = loadGame_(body.gameId);
        if (!gJoin) return jsonOut_({ status: 'error', message: 'Waiting for teacher to open Lobby.' });

        var emapJ = loadEmailMap_(gJoin.gameId);
        var existingPid = emapJ[vJoin.email];
        var dispName = safeDisplayName_(body.displayName, vJoin.email);
        var assignedId = existingPid || ('S' + (Object.keys(emapJ).length + 1));

        var joinRes = WerewolfEngine.addOrUpdatePlayer(gJoin, {
          id: assignedId,
          name: dispName,
          isBot: false
        }, Date.now());

        if (!joinRes.ok) {
          return jsonOut_({ status: 'error', message: joinRes.error });
        }

        emapJ[vJoin.email] = joinRes.player.id;
        saveEmailMap_(gJoin.gameId, emapJ);
        saveGameCacheOnly_(gJoin);

        return jsonOut_({
          status: 'ok',
          joined: true,
          playerId: joinRes.player.id,
          seat: joinRes.player.seat,
          view: WerewolfEngine.projectViewForViewer(gJoin, { kind: 'player', playerId: joinRes.player.id })
        });
      } finally {
        releaseModLock_();
      }
    }

    // ------------------------------------------------------------------
    // 4. TEACHER / MODERATOR COMMANDS (PIN-gated + soft lock)
    // ------------------------------------------------------------------
    if (!verifyTeacherPin_(body.teacherPin)) {
      return jsonOut_({ status: 'auth_failed', message: 'Invalid or missing Teacher PIN.' });
    }

    if (!acquireModLock_()) {
      return jsonOut_({ status: 'busy', message: 'Server busy - retry in a moment.' });
    }
    try {
      var now = Date.now();

      if (action === 'create_game') {
        // Teacher may pin the room code (Class 703 -> WOLF-E8SQ etc.); otherwise
        // the engine mints one. Without this the cockpit polls a code the room
        // it just opened does not use.
        var pinnedGid = String(body.gameId || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 16);
        var created = WerewolfEngine.createGame({
          rules: body.rules || {},
          populateDemo: Boolean(body.populateDemo),
          now: now,
          gameId: pinnedGid || undefined
        });
        saveEmailMap_(created.gameId, {});
        saveGame_(created);
        return jsonOut_({
          status: 'ok',
          gameId: created.gameId,
          view: WerewolfEngine.projectViewForViewer(created, { kind: body.god ? 'god' : 'lcd' })
        });
      }

      var gMod = loadGame_(body.gameId);
      if (!gMod) return jsonOut_({ status: 'error', message: 'Game not found.' });

      if (action === 'update_rules') {
        var uRes = WerewolfEngine.updateRules(gMod, body.rules || {}, now);
        if (!uRes.ok) return jsonOut_({ status: 'error', message: uRes.error });
        saveGame_(gMod);

      } else if (action === 'fill_seats') {
        var fRes = WerewolfEngine.fillSeats(gMod, body.mode || 'demo', now);
        if (!fRes.ok) return jsonOut_({ status: 'error', message: fRes.error });
        saveGame_(gMod);

      } else if (action === 'add_player') {
        // Teacher roster tool: claims a 'Seat N' placeholder first, else an open slot.
        var aRes = WerewolfEngine.addPlayer(gMod, String(body.displayName || ''), now);
        if (!aRes.ok) return jsonOut_({ status: 'error', message: aRes.error });
        saveGame_(gMod);

      } else if (action === 'rename_player') {
        // Teacher roster tool: rename any seated player, any phase (names are never secret).
        var rnRes = WerewolfEngine.renamePlayer(gMod, String(body.playerId || ''), String(body.displayName || ''), now);
        if (!rnRes.ok) return jsonOut_({ status: 'error', message: rnRes.error });
        saveGame_(gMod);

      } else if (action === 'advance_phase') {
        // A2/D: in cloud mode bots act only in explicit Test Mode (demo class that
        // plays the whole game); in Test Mode every advance simulates bot actions.
        if (gMod.rules && gMod.rules.testMode) {
          WerewolfEngine.simulateBotActions(gMod, now);
        }
        // D2: purge consumed action keys for the cell we are leaving
        purgeActionKeys_(gMod, gMod.epoch, gMod.round, gMod.phase);
        var advRes = WerewolfEngine.advancePhase(gMod, now);
        if (!advRes.ok) return jsonOut_({ status: 'error', message: advRes.error });
        saveGame_(gMod);

      } else if (action === 'simulate_bots') {
        if (!(gMod.rules && gMod.rules.testMode)) {
          return jsonOut_({ status: 'error', message: 'Bot simulation is off in live mode (Test Mode only).' });
        }
        WerewolfEngine.simulateBotActions(gMod, now);
        saveGame_(gMod);

      } else if (action === 'pause_timer') {
        WerewolfEngine.togglePause(gMod, now);
        saveGame_(gMod);

      } else if (action === 'add_time') {
        WerewolfEngine.addTime(gMod, Number(body.deltaSec || 30), now);
        saveGame_(gMod);

      } else if (action === 'god_override_night') {
        var oRes = WerewolfEngine.submitModeratorNightOverride(gMod, String(body.roleKey || ''), String(body.targetId || ''), now);
        if (!oRes.ok) return jsonOut_({ status: 'error', message: oRes.error });
        saveGame_(gMod);

      } else if (action === 'night_decision') {
        // D8/A1: teacher Pack Split resolution (choose a tied seat or no kill)
        var nRes = WerewolfEngine.submitNightDecision(gMod, String(body.roleKey || ''), body.choice || {}, now);
        if (!nRes.ok) return jsonOut_({ status: 'error', message: nRes.error });
        saveGame_(gMod);

      } else if (action === 'reveal_control') {
        // D8/B6: drive the LCD Story Theatre (start/next/back/skip/pause)
        if (!gMod.reveal || String(body.revealId || '') !== gMod.reveal.id) {
          return jsonOut_({ status: 'error', message: 'No matching reveal is pending.' });
        }
        StoryEngine.applyControl(gMod.reveal, String(body.cmd || ''), now);
        saveGame_(gMod);

      } else if (action === 'kick_player') {
        var kRes = WerewolfEngine.kickPlayer(gMod, String(body.playerId || ''), now);
        if (!kRes.ok) return jsonOut_({ status: 'error', message: kRes.error });
        var emapK = loadEmailMap_(gMod.gameId);
        Object.keys(emapK).forEach(function (em) {
          if (emapK[em] === body.playerId) delete emapK[em];
        });
        saveEmailMap_(gMod.gameId, emapK);
        saveGame_(gMod);

      } else if (action === 'remove_empty_seats') {
        var rRes = WerewolfEngine.removeEmptySeats(gMod, now);
        if (!rRes.ok) return jsonOut_({ status: 'error', message: rRes.error });
        saveGame_(gMod);

      } else if (action === 'moderator_override') {
        if (String(body.field || '') !== 'alive') {
          return jsonOut_({ status: 'error', message: 'Unsupported override field.' });
        }
        var mRes = WerewolfEngine.setPlayerAlive(gMod, String(body.playerId || ''), body.value === true || body.value === 'true', now);
        if (!mRes.ok) return jsonOut_({ status: 'error', message: mRes.error });
        saveGame_(gMod);

      } else if (action === 'lcd_heartbeat') {
        cache_().put(lcdHeartbeatKey_(gMod.gameId), String(now), 120);

      } else if (action === 'reset_lobby') {
        // D2: purge the old epoch's consumed keys, then mint a fresh epoch
        purgeActionKeys_(gMod, gMod.epoch, gMod.round, gMod.phase);
        gMod = WerewolfEngine.resetToLobby(gMod, body.keepPlayers !== false, now);
        saveGame_(gMod);

      } else {
        return jsonOut_({ status: 'error', message: 'Unknown moderator action: ' + action });
      }

      return jsonOut_({
        status: 'ok',
        view: WerewolfEngine.projectViewForViewer(gMod, { kind: body.god ? 'god' : 'lcd' })
      });
    } finally {
      releaseModLock_();
    }
  } catch (err) {
    return jsonOut_({ status: 'error', message: String(err && err.message || err) });
  }
}

// ============================================================================
// BUNDLED MODULES (generated by tools-priv/bundle_werewolf_gas.py - do not edit
// by hand; edit the public files under bihi2027/ILT/werewolf/digital-werewolf/)
// ============================================================================
// @@WEREWOLF_BUNDLE_BEGIN@@
// ---- bundled file: engine/story_content.js (byte-identical, do not edit here) ----
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

// ---- bundled file: engine/story_engine.js (byte-identical, do not edit here) ----
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

// ---- bundled file: engine/werewolf_engine.js (byte-identical, do not edit here) ----
/**
 * Digital Werewolf - Core Deterministic Game Engine (v1.0)
 * Room 8 / Bicentennial Junior High ILT Class Game
 *
 * Pure JS state machine: zero DOM, zero network, PII-free.
 * Runs identically in Browser (<script>), Node self-tests, and Google Apps Script.
 */
(function (root) {
  'use strict';

  var ENGINE_VERSION = '2.1.0';

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
    packDecision: 'majority_then_teacher', // 'majority_then_teacher' | 'unanimous' | 'plurality' (never random)
    nameSavedPlayer: false,     // Naming the Doctor's save target leaks info; default OFF
    lastWordsSec: 20,           // Last-words moment after a night kill / before an exile (0 = off)
    storyTone: 'spooky',        // 'spooky' | 'campfire' (neither includes gore)
    wolfConfirmStrike: false,   // Pack must tap Confirm inside the peek before the kill locks
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
    merged.packDecision = ['majority_then_teacher', 'unanimous', 'plurality'].indexOf(merged.packDecision) !== -1
      ? merged.packDecision : 'majority_then_teacher';
    merged.storyTone = merged.storyTone === 'campfire' ? 'campfire' : 'spooky';
    merged.nameSavedPlayer = Boolean(merged.nameSavedPlayer);
    merged.wolfConfirmStrike = Boolean(merged.wolfConfirmStrike);
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
      epoch: options.epoch || hashSeed(gameId + ':epoch:' + now + ':' + seedNum),
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
        villagerNotes: {},   // actorId -> suspectId (classroom decoy tap so everyone taps once at night)
        wolfConfirms: {},    // actorId -> true (Pack Lock confirmations)
        teacherDecisions: {} // roleKey -> { targetId|null, noKill, at }
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

    // Bots never hold power roles in live play: swap any bot-held Werewolf/Doctor/Detective
    // with a human-held Villager whenever enough humans are seated (A2).
    var isPower = function (r) { return r === ROLES.WEREWOLF || r === ROLES.DOCTOR || r === ROLES.DETECTIVE; };
    for (i = 0; i < game.players.length; i++) {
      var bp = game.players[i];
      if (!bp.isBot || !isPower(bp.role)) continue;
      for (var j = 0; j < game.players.length; j++) {
        var hp = game.players[j];
        if (!hp.isBot && hp.role === ROLES.VILLAGER) {
          var tmp = bp.role;
          bp.role = hp.role;
          hp.role = tmp;
          break;
        }
      }
    }

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
        game.players[i].persona = { job: 'villager', home: 'Market Square' };
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
      lastDoctorSavedId: null,
      detectiveFindings: [],
      doctorSavesCount: 0,
      nightReports: [],
      usedFragments: {},
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
   * roleKey: ROLES.WEREWOLF | ROLES.DOCTOR | ROLES.DETECTIVE.
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
   * Pack Lock state for a wolf's private peek (A3): coordinating | locked | split.
   */
  function computePackLock(game, wolf) {
    var wolves = livingPlayers(game, ROLES.WEREWOLF);
    var res = resolveGroupTarget(game, game.currentNight.wolfPicks, wolves, game.rules.packDecision);
    var state = 'coordinating';
    var targetId = null;
    if (res.mode === 'split') {
      state = 'split';
    } else if (res.targetId) {
      state = 'locked';
      targetId = res.targetId;
      if (game.rules.wolfConfirmStrike) {
        var confirmed = wolves.every(function (w) { return game.currentNight.wolfConfirms[w.id]; });
        if (!confirmed) state = 'coordinating';
      }
    }
    var target = targetId ? getPlayer(game, targetId) : null;
    return {
      state: state,
      targetId: targetId,
      targetSeat: target ? target.seat : null,
      confirms: wolves.filter(function (w) { return game.currentNight.wolfConfirms[w.id]; }).length,
      totalWolves: wolves.length,
      decisionMode: res.mode,
      tied: res.tied || []
    };
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

    if (type === 'wolf_confirm' && game.phase === PHASES.NIGHT && actor.role === ROLES.WEREWOLF) {
      game.currentNight.wolfConfirms[actor.id] = true;
      game.updatedAt = now;
      return { ok: true, roleAction: 'wolf_confirm' };
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
      villagerNotes: {},
      wolfConfirms: {},
      teacherDecisions: {}
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

    var isPeaceful = (game.round === 1 && game.rules.peacefulNight1);

    // Group targets under the packDecision rule - never random (A1).
    var wolfRes = resolveGroupTarget(game, game.currentNight.wolfPicks, wolves, game.rules.packDecision);
    var docRes = resolveGroupTarget(game, game.currentNight.doctorPicks, doctors, game.rules.packDecision);
    var detRes = resolveGroupTarget(game, game.currentNight.detectivePicks, detectives, game.rules.packDecision);
    var td = game.currentNight.teacherDecisions || {};

    // Teacher Pack Split decisions override a split group (decidedBy: 'teacher').
    var wolfTeacher = td[ROLES.WEREWOLF];
    var docTeacher = td[ROLES.DOCTOR];
    var detTeacher = td[ROLES.DETECTIVE];

    var wolfVictimId = null;
    var wolfDecisionMode = 'none';
    if (wolfRes.mode === 'split') {
      if (wolfTeacher && !wolfTeacher.noKill && wolfTeacher.targetId) {
        wolfVictimId = wolfTeacher.targetId;
        wolfDecisionMode = 'teacher';
      } else {
        wolfDecisionMode = wolfTeacher ? 'teacher' : 'none';
      }
    } else if (wolfRes.targetId) {
      wolfVictimId = wolfRes.targetId;
      wolfDecisionMode = wolfRes.mode;
    }

    var protectedId = null;
    if (!isPeaceful && doctors.length > 0) {
      if (docRes.mode === 'split') {
        if (docTeacher && !docTeacher.noKill && docTeacher.targetId) protectedId = docTeacher.targetId;
      } else {
        protectedId = docRes.targetId;
      }
    }
    if (protectedId) {
      game.secret.lastDoctorSavedId = protectedId;
    }

    // Detective investigation (always active, including Night 1!)
    var finding = null;
    if (detectives.length > 0) {
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
          game.secret.detectiveFindings.push(finding);
          game.secret.auditLog.push({
            round: game.round,
            phase: PHASES.NIGHT,
            text: 'Detective(s) investigated ' + checked.name + ' -> ' + checked.role + ' (' + detRes.mode + ').'
          });
        }
      }
    }

    // Wolf attack vs Doctor save
    var eliminatedPlayer = null;
    var savedByDoctor = false;

    if (isPeaceful) {
      game.secret.auditLog.push({
        round: game.round,
        phase: PHASES.NIGHT,
        text: 'Peaceful Starter Night 1 (wolf dry-run target: ' + (wolfRes.targetId || 'none') + ').'
      });
    } else if (wolfVictimId) {
      var victim = getPlayer(game, wolfVictimId);
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
            text: 'Wolves eliminated ' + victim.name + ' (' + victim.role + ') [' + wolfDecisionMode + '].'
          });
        }
      }
    } else {
      game.secret.auditLog.push({
        round: game.round,
        phase: PHASES.NIGHT,
        text: wolfRes.mode === 'split'
          ? 'Pack split with no teacher decision; nobody died.'
          : 'Wolves submitted no target; nobody died.'
      });
    }

    // Night report for the teacher cockpit (A4) - written every night.
    var allWolvesBots = wolves.length > 0 && wolves.every(function (w) { return w.isBot; });
    game.secret.nightReports.push({
      round: game.round,
      wolfPicksByActor: mergeObj({}, game.currentNight.wolfPicks),
      decisionMode: wolfDecisionMode,
      decidedBy: wolfDecisionMode === 'teacher' ? 'teacher' : (allWolvesBots ? 'bot-test' : 'pack'),
      victimId: eliminatedPlayer ? eliminatedPlayer.id : null,
      doctorPicksByActor: mergeObj({}, game.currentNight.doctorPicks),
      protectedId: protectedId,
      saved: savedByDoctor,
      detectivePickByActor: mergeObj({}, game.currentNight.detectivePicks),
      finding: finding ? { targetId: finding.targetId, targetName: finding.targetName, seat: finding.seat, role: finding.role } : null,
      peaceful: isPeaceful
    });

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
      var savedP = getPlayer(game, wolfVictimId);
      headline = 'Dawn of Day ' + game.round + ': MIRACLE SAVE! Nobody Died!';
      // Naming the saved player leaks the Doctor's target; name them only if the rule toggle is on.
      subline = game.rules.nameSavedPlayer && savedP
        ? 'The Werewolves struck at ' + savedP.name + ', but the Town Doctor arrived right on time!'
        : 'The Werewolves struck in the dark, but the Town Doctor arrived right on time!';
      dawnStory = buildStoryNarration('dawn_save', {
        round: game.round,
        name: game.rules.nameSavedPlayer && savedP ? savedP.name : '',
        seat: game.rules.nameSavedPlayer && savedP ? savedP.seat : 0
      });
    } else if (eliminatedPlayer) {
      var roleTag = game.rules.revealRoleOnDeath ? (' (' + eliminatedPlayer.role + ')') : '';
      headline = 'Dawn of Day ' + game.round + ': The Werewolves Struck! ' + eliminatedPlayer.name + ' Was Eliminated!';
      subline = 'Seat #' + eliminatedPlayer.seat + roleTag + ' was taken in the night and is now a Silent Ghost Spectator.';
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

    // Story Theatre reveal for the LCD + student mirror (B1). Sanitized on projection.
    if (root.StoryEngine) {
      var kind = isPeaceful || (!eliminatedPlayer && !savedByDoctor) ? 'night_quiet'
        : savedByDoctor ? 'night_save' : 'night_kill';
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
      savedByDoctor: false
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
      if (root.StoryEngine) game.reveal = root.StoryEngine.buildReveal(game, 'victory_village', {});
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
      if (root.StoryEngine) game.reveal = root.StoryEngine.buildReveal(game, 'victory_wolves', {});
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
   * reads fields v1 never wrote (currentNight.wolfConfirms / teacherDecisions,
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
      // Wolves converge on 1 non-wolf target (respecting any human wolf's pick first!)
      var wolves = livingPlayers(game, ROLES.WEREWOLF);
      var nonWolves = alive.filter(function (p) { return p.role !== ROLES.WEREWOLF; });
      var humanWolfPick = null;
      wolves.forEach(function (w) {
        if (!isBotLike(game, w) && game.currentNight.wolfPicks[w.id]) {
          humanWolfPick = game.currentNight.wolfPicks[w.id];
        }
      });
      var sharedWolfTarget = humanWolfPick || (nonWolves.length
        ? nonWolves[Math.floor(nextRandom(game) * nonWolves.length)].id
        : null);

      wolves.forEach(function (w) {
        if (isBotLike(game, w) && sharedWolfTarget) {
          game.currentNight.wolfPicks[w.id] = sharedWolfTarget;
        }
      });

      // Doctors converge on a valid save target
      var doctors = livingPlayers(game, ROLES.DOCTOR);
      var humanDocPick = null;
      doctors.forEach(function (d) {
        if (!isBotLike(game, d) && game.currentNight.doctorPicks[d.id]) humanDocPick = game.currentNight.doctorPicks[d.id];
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
        if (isBotLike(game, d) && sharedDocTarget) {
          game.currentNight.doctorPicks[d.id] = sharedDocTarget;
        }
      });

      // Detectives check an un-checked suspect
      var detectives = livingPlayers(game, ROLES.DETECTIVE);
      var checkedIds = {};
      game.secret.detectiveFindings.forEach(function (f) { checkedIds[f.targetId] = true; });
      var humanDetPick = null;
      detectives.forEach(function (c) {
        if (!isBotLike(game, c) && game.currentNight.detectivePicks[c.id]) humanDetPick = game.currentNight.detectivePicks[c.id];
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
        if (isBotLike(game, c) && sharedDetTarget) {
          game.currentNight.detectivePicks[c.id] = sharedDetTarget;
        }
      });

      // Bot villagers tap a decoy suspect
      alive.forEach(function (p) {
        if (isBotLike(game, p) && p.role === ROLES.VILLAGER) {
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
        if (!isBotLike(game, voter)) return;
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

      if (me.role === ROLES.WEREWOLF) {
        var wolves = livingPlayers(game, ROLES.WEREWOLF);
        priv.packmates = game.players
          .filter(function (x) { return x.role === ROLES.WEREWOLF; })
          .map(function (x) {
            return {
              id: x.id, seat: x.seat, name: x.name, alive: x.alive,
              pick: game.currentNight.wolfPicks[x.id] || null,
              confirmed: Boolean(game.currentNight.wolfConfirms[x.id])
            };
          });
        priv.consensus = computeGroupConsensus(game.currentNight.wolfPicks, wolves);
        priv.packLock = computePackLock(game, me);
        priv.myNightPick = game.currentNight.wolfPicks[me.id] || null;
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
      var wolvesG = livingPlayers(game, ROLES.WEREWOLF);
      out.god = {
        wolfConsensus: computeGroupConsensus(game.currentNight.wolfPicks, wolvesG),
        doctorConsensus: computeGroupConsensus(game.currentNight.doctorPicks, livingPlayers(game, ROLES.DOCTOR)),
        detectiveConsensus: computeGroupConsensus(game.currentNight.detectivePicks, livingPlayers(game, ROLES.DETECTIVE)),
        wolfResolution: resolveGroupTarget(game, game.currentNight.wolfPicks, wolvesG, game.rules.packDecision),
        packLock: wolvesG.length ? computePackLock(game, wolvesG[0]) : null,
        currentNight: game.currentNight,
        currentBallots: game.currentVote.ballots,
        secret: game.secret,
        nightReports: game.secret.nightReports || [],
        livingWolves: wolvesG.length,
        livingTown: aliveCount - wolvesG.length
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

    // 6. A8: split pack picks never produce a random victim
    var g2 = createGame({ seed: 424242, populateDemo: true, rules: { classSize: 10, preset: 'custom', wolvesCount: 3, doctorsCount: 1, detectivesCount: 1 } });
    startGame(g2, 100);
    g2.players[0].role = ROLES.WEREWOLF;
    g2.players[1].role = ROLES.WEREWOLF;
    g2.players[2].role = ROLES.WEREWOLF;
    g2.players[3].role = ROLES.DOCTOR;
    g2.players[4].role = ROLES.DETECTIVE;
    for (var pi = 5; pi < g2.players.length; pi++) g2.players[pi].role = ROLES.VILLAGER;
    advancePhase(g2, 200); // ROLE_REVEAL -> NIGHT
    check(g2.phase === PHASES.NIGHT, 'g2 enters Night 1');
    var vils2 = livingPlayers(g2, ROLES.VILLAGER);
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
    var vils3 = livingPlayers(g2, ROLES.VILLAGER);
    submitPlayerAction(g2, 'P1', { type: 'night', targetId: vils3[0].id }, 900);
    submitPlayerAction(g2, 'P2', { type: 'night', targetId: vils3[1].id }, 900);
    var decRes = submitNightDecision(g2, ROLES.WEREWOLF, { targetId: vils3[0].id }, 950);
    check(decRes.ok === true, 'teacher Pack Split decision accepted');
    advancePhase(g2, 1000);
    check(!vils3[0].alive && vils3[0].eliminatedHow === 'night', 'teacher-decided seat is the only victim');
    var rep3 = g2.secret.nightReports[g2.secret.nightReports.length - 1];
    check(rep3.decisionMode === 'teacher' && rep3.decidedBy === 'teacher' && rep3.victimId === vils3[0].id, 'night report records teacher decision + victim');
    check(g2.reveal && g2.reveal.kind === 'night_kill', 'night kill builds a night_kill reveal');

    // majority mode: 2 of 3 wolves agree -> majority kill without teacher
    advancePhase(g2, 1100); advancePhase(g2, 1200); advancePhase(g2, 1300); advancePhase(g2, 1400); // to Night 3
    check(g2.phase === PHASES.NIGHT && g2.round === 3, 'g2 enters Night 3');
    var vils4 = livingPlayers(g2, ROLES.VILLAGER);
    submitPlayerAction(g2, 'P1', { type: 'night', targetId: vils4[0].id }, 1500);
    submitPlayerAction(g2, 'P2', { type: 'night', targetId: vils4[0].id }, 1500);
    submitPlayerAction(g2, 'P3', { type: 'night', targetId: vils4[1].id }, 1500);
    advancePhase(g2, 1600);
    check(!vils4[0].alive, 'majority (2 of 3) pack pick is the kill');
    var rep4 = g2.secret.nightReports[g2.secret.nightReports.length - 1];
    check(rep4.decisionMode === 'majority' && rep4.victimId === vils4[0].id, 'night report decisionMode = majority');

    // unanimous rule blocks a 2-of-3 majority
    var g2b = createGame({ seed: 777, populateDemo: true, rules: { classSize: 8, preset: 'custom', wolvesCount: 3, doctorsCount: 0, detectivesCount: 0, packDecision: 'unanimous' } });
    startGame(g2b, 100);
    g2b.players[0].role = ROLES.WEREWOLF; g2b.players[1].role = ROLES.WEREWOLF; g2b.players[2].role = ROLES.WEREWOLF;
    for (var qi = 3; qi < g2b.players.length; qi++) g2b.players[qi].role = ROLES.VILLAGER;
    advancePhase(g2b, 200);
    var vb = livingPlayers(g2b, ROLES.VILLAGER);
    submitPlayerAction(g2b, 'P1', { type: 'night', targetId: vb[0].id }, 300);
    submitPlayerAction(g2b, 'P2', { type: 'night', targetId: vb[0].id }, 300);
    submitPlayerAction(g2b, 'P3', { type: 'night', targetId: vb[1].id }, 300);
    advancePhase(g2b, 400);
    check(livingPlayers(g2b).length === 8, 'unanimous rule: 2-of-3 majority is NOT a kill');

    // 7. A8: bots never hold power roles when enough humans are seated
    var g3 = createGame({ seed: 9001, rules: { classSize: 10, preset: 'custom', wolvesCount: 2, doctorsCount: 1, detectivesCount: 1 } });
    for (var hi = 1; hi <= 6; hi++) addOrUpdatePlayer(g3, { id: 'H' + hi, name: 'Human ' + hi, isBot: false }, 100 + hi);
    fillSeats(g3, 'demo', 200); // pads to 10 with 4 bots
    startGame(g3, 300);
    var botsWithPower = g3.players.filter(function (p) { return p.isBot && p.role && p.role !== ROLES.VILLAGER; });
    check(botsWithPower.length === 0, 'bots are never dealt Werewolf/Doctor/Detective when humans cover power roles');
    var humansWithVillager = g3.players.filter(function (p) { return !p.isBot && p.role === ROLES.VILLAGER; }).length;
    check(humansWithVillager >= 0 && g3.players.every(function (p) { return p.persona && p.persona.job; }), 'personas assigned to every seat at deal time');

    // 8. A8: epoch changes on reset (cloud replay guard D2 mirror)
    var eBefore = g3.epoch;
    var g3r = resetToLobby(g3, true, 400);
    check(g3r.epoch && g3r.epoch !== eBefore, 'resetToLobby mints a fresh epoch (Play Again cannot replay old picks)');

    // 9. Story engine: every reveal kind builds valid beats; no fragment repeats; no role leak
    var kindsSeen = {};
    var leakFree = true;
    var g4 = createGame({ seed: 31337, populateDemo: true, rules: { classSize: 12, preset: 'custom', wolvesCount: 2, doctorsCount: 1, detectivesCount: 1, revealRoleOnDeath: false } });
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
      ['night_kill', 'night_save', 'night_quiet', 'exile', 'no_exile', 'victory_village', 'victory_wolves'].forEach(function (k) {
        var probe = root.StoryEngine.buildReveal(g4, k, { player: g4.players[0], breakdown: [{ seat: 1, name: 'A', votes: 2 }], skipVotes: 0, totalCast: 5 });
        check(probe.beats.length > 0 && probe.id && probe.control, 'story: every reveal kind builds valid beats (' + k + ')');
      });
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
    var g6 = createGame({ seed: 606060, rules: { classSize: 9, preset: 'custom', wolvesCount: 2, doctorsCount: 1, detectivesCount: 1, testMode: true } });
    fillSeats(g6, 'numbered', 100); // 9 'Seat N' placeholders, zero isBot seats
    startGame(g6, 200);
    var phGuard = 0;
    while (g6.phase !== PHASES.GAME_OVER && phGuard < 80) {
      simulateBotActions(g6, 300 + phGuard * 100);
      advancePhase(g6, 350 + phGuard * 100);
      phGuard++;
    }
    check(g6.phase === PHASES.GAME_OVER && (g6.winner === 'VILLAGE' || g6.winner === 'WEREWOLVES'),
      'Test Mode: placeholder-only class reaches a valid victory (' + g6.winner + ')');
    check((g6.secret.nightReports || []).length >= 2, 'Test Mode placeholder game produced night reports');
    check(g6.secret.nightReports.some(function (r) { return r.victimId; }), 'Test Mode placeholder wolves actually killed at night');

    // ...and with Test Mode OFF those same placeholders must never be driven
    var g7 = createGame({ seed: 707070, rules: { classSize: 9, preset: 'custom', wolvesCount: 2, doctorsCount: 1, detectivesCount: 1, testMode: false } });
    fillSeats(g7, 'numbered', 100);
    startGame(g7, 200);
    simulateBotActions(g7, 300);
    check(g7.players.every(function (p) { return !p.readyConfirmed; }), 'Test Mode OFF: placeholders stay un-driven (humans only)');
    advancePhase(g7, 400); // ROLE_REVEAL -> NIGHT
    simulateBotActions(g7, 500);
    check(Object.keys(g7.currentNight.wolfPicks).length === 0, 'Test Mode OFF: placeholder wolves pick nothing');

    // 12. Teacher seat management: add claims placeholders first, rename works any phase
    var g8 = createGame({ seed: 808080, rules: { classSize: 10, preset: 'custom', wolvesCount: 2, doctorsCount: 1, detectivesCount: 1 } });
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
    // cockpit crash from the WOLF-E8SQ room that predated the v2 engine fields)
    var g9 = createGame({ seed: 909090, populateDemo: true, rules: { classSize: 12, preset: 'custom', wolvesCount: 3, doctorsCount: 1, detectivesCount: 1 } });
    startGame(g9, 100);
    advancePhase(g9, 200); // NIGHT
    delete g9.currentNight.wolfConfirms;
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
    check(mig.currentNight.wolfConfirms && mig.currentNight.teacherDecisions && mig.currentVote.nominations && mig.rules.testMode === false,
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
// @@WEREWOLF_BUNDLE_END@@
