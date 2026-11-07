/**
 * Digital Werewolf - shared config: action names, asset paths, copy, timers.
 * Single source for the browser clients. Code.gs mirrors ACTIONS by hand
 * (verified by tools-priv/bundle_werewolf_gas.py's marker check).
 */
(function (root) {
  'use strict';

  var ACTIONS = {
    POLL: 'poll_state',
    SUBMIT: 'submit_action',
    JOIN: 'join_game',
    CREATE: 'create_game',
    UPDATE_RULES: 'update_rules',
    FILL_SEATS: 'fill_seats',
    ADVANCE: 'advance_phase',
    SIMULATE_BOTS: 'simulate_bots',
    PAUSE_TIMER: 'pause_timer',
    ADD_TIME: 'add_time',
    GOD_OVERRIDE_NIGHT: 'god_override_night',
    RESET_LOBBY: 'reset_lobby',
    NIGHT_DECISION: 'night_decision',
    REVEAL_CONTROL: 'reveal_control',
    KICK_PLAYER: 'kick_player',
    REMOVE_EMPTY_SEATS: 'remove_empty_seats',
    MODERATOR_OVERRIDE: 'moderator_override',
    LCD_HEARTBEAT: 'lcd_heartbeat',
    HEALTH: 'get_health',
    POLL_LCD: 'poll_lcd'
  };

  // Asset keys -> preferred file. The B5 scene illustrations slot in here;
  // until those files exist in assets/, resolve() falls back to the
  // generated v1 art set (the 9 existing illustrations).
  var ASSET_FILES = {
    bg_day_village: 'assets/bg_day_village.jpg',
    bg_night_village: 'assets/bg_night_village.jpg',
    banner_victory_village: 'assets/banner_victory_village.jpg',
    banner_victory_wolves: 'assets/banner_victory_wolves.jpg',
    card_back: 'assets/card_back.jpg',
    role_werewolf: 'assets/role_werewolf.jpg',
    role_doctor: 'assets/role_doctor.jpg',
    role_detective: 'assets/role_detective.jpg',
    role_villager: 'assets/role_villager.jpg'
  };

  var SCENE_FILES = {
    scene_night_ends: 'assets/scene_night_ends.jpg',
    scene_dawn_empty_house: 'assets/scene_dawn_empty_house.jpg',
    scene_wolf_silhouettes: 'assets/scene_wolf_silhouettes.jpg',
    scene_doctor_lantern: 'assets/scene_doctor_lantern.jpg',
    scene_council_trial: 'assets/scene_council_trial.jpg',
    scene_town_gate: 'assets/scene_town_gate.jpg',
    scene_deadlock: 'assets/scene_deadlock.jpg',
    card_sealed: 'assets/card_sealed.jpg'
  };

  // Fallback mapping when a B5 scene file is not present yet.
  var SCENE_FALLBACK = {
    scene_night_ends: 'bg_night_village',
    scene_dawn_empty_house: 'bg_day_village',
    scene_wolf_silhouettes: 'bg_night_village',
    scene_doctor_lantern: 'bg_day_village',
    scene_council_trial: 'bg_day_village',
    scene_town_gate: 'bg_day_village',
    scene_deadlock: 'bg_night_village',
    card_sealed: 'card_back'
  };

  var ASSETS = {
    files: ASSET_FILES,
    scenes: SCENE_FILES,
    resolve: function (key) {
      if (ASSET_FILES[key]) return ASSET_FILES[key];
      if (SCENE_FILES[key]) {
        return { src: SCENE_FILES[key], fallback: ASSET_FILES[SCENE_FALLBACK[key]] || ASSET_FILES.bg_day_village };
      }
      return ASSET_FILES.bg_day_village;
    }
  };

  var TIMERS = {
    pollStudentMs: 3600,
    pollLcdMs: 3000,
    pollLcdFastMs: 1200,
    pollCockpitMs: 3500,
    sliderDebounceMs: 400,
    peekMaxMs: 3200,
    revealAutoAdvanceGraceMs: 1500
  };

  var COPY = {
    connLive: 'Live',
    connReconnecting: 'Reconnecting',
    connOfflineDemo: 'Offline (demo)',
    connOffline: 'Offline',
    nightGateReady: 'End Night: pack locked on Seat #{seat}',
    nightGateSplit: 'End Night: pack NOT agreed ({picked} of {total} picked)',
    nightGateNone: 'End Night: no wolf picks yet',
    docSet: 'Doctor set',
    detSet: 'Detective set',
    wolvesLocked: 'Wolves {done}/{total} locked',
    packSplitTitle: 'Pack Split - decide the night',
    packSplitMore: 'Give 20 more seconds',
    packSplitChoose: 'Choose between the tied seats',
    packSplitNoKill: 'No kill tonight',
    nightReportTitle: 'What happened tonight',
    revealDawn: 'Reveal Dawn',
    theatreNext: 'Next',
    theatreBack: 'Back',
    theatreSkip: 'Skip',
    theatrePause: 'Pause',
    theatreResume: 'Resume',
    theatreReadAloud: 'Read-aloud',
    eyesUp: 'The night is ending. Eyes up.',
    beatLabel: 'Beat {i}/{n} - {type}'
  };

  var REVEAL_PLAYED_KEY = 'ww_played_reveals';

  root.WWConfig = {
    ACTIONS: ACTIONS,
    ASSETS: ASSETS,
    TIMERS: TIMERS,
    COPY: COPY,
    REVEAL_PLAYED_KEY: REVEAL_PLAYED_KEY
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.WWConfig;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
