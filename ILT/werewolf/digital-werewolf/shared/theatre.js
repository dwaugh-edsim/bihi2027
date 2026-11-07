/**
 * Digital Werewolf - shared Story Theatre renderer.
 * Renders reveal beats full-screen (LCD) or as a compact mirror (student device).
 * Teacher-paced: auto-advance after holdMs, but Space/Right next, Left back,
 * S skip, P pause, T read-aloud. Cloud mode syncs via reveal.control
 * (reveal_control moderator action); demo mode drives the control object locally.
 */
(function (root) {
  'use strict';

  var CFG = function () { return root.WWConfig || { ASSETS: { resolve: function () { return ''; } }, COPY: {}, TIMERS: {}, REVEAL_PLAYED_KEY: 'ww_played_reveals' }; };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function playedIds(storage) {
    try { return JSON.parse((storage || sessionStorage).getItem(CFG().REVEAL_PLAYED_KEY) || '[]'); } catch (e) { return []; }
  }

  function markPlayed(storage, id) {
    try {
      var arr = playedIds(storage);
      if (arr.indexOf(id) === -1) { arr.push(id); if (arr.length > 40) arr = arr.slice(-40); }
      (storage || sessionStorage).setItem(CFG().REVEAL_PLAYED_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  function assetEl(key, cls) {
    var res = CFG().ASSETS.resolve(key || 'bg_day_village');
    var src = typeof res === 'string' ? res : res.src;
    var fb = typeof res === 'string' ? null : res.fallback;
    var img = document.createElement('img');
    img.className = cls || 'th-art';
    img.alt = '';
    img.src = src;
    if (fb) img.onerror = function () { img.onerror = null; img.src = fb; };
    return img;
  }

  function create(opts) {
    // opts: { overlay, getReveal, onControl, onToggleTts, keys, controls, autoStartReady, mirror, storage, onDone }
    var overlay = opts.overlay;
    var state = {
      revealId: null,
      beatIndex: 0,
      timer: null,
      typeTimer: null,
      lastCmdAt: 0,
      started: false
    };
    var reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    function reveal() { return opts.getReveal ? opts.getReveal() : null; }

    function clearTimers() {
      if (state.timer) { clearTimeout(state.timer); state.timer = null; }
      if (state.typeTimer) { clearInterval(state.typeTimer); state.typeTimer = null; }
    }

    function beat() {
      var r = reveal();
      if (!r || !r.beats || !r.beats.length) return null;
      return r.beats[Math.min(state.beatIndex, r.beats.length - 1)];
    }

    function send(cmd) {
      state.lastCmdAt = Date.now();
      if (opts.onControl) opts.onControl(cmd, reveal());
    }

    function renderControls(r) {
      if (!opts.controls) return '';
      var C = CFG().COPY;
      var paused = r.control && r.control.paused;
      return '<div class="th-controls">'
        + '<button class="btn" data-cmd="back">' + esc(C.theatreBack) + '</button>'
        + '<button class="btn" data-cmd="next">' + esc(C.theatreNext) + '</button>'
        + '<button class="btn" data-cmd="pause">' + esc(paused ? C.theatreResume : C.theatrePause) + '</button>'
        + '<button class="btn" data-cmd="skip">' + esc(C.theatreSkip) + '</button>'
        + '<button class="btn" data-cmd="tts">' + esc(C.theatreReadAloud) + '</button>'
        + '<span class="th-beat-label">' + esc((C.beatLabel || '').replace('{i}', state.beatIndex + 1).replace('{n}', r.beats.length).replace('{type}', (beat() || {}).type || '')) + '</span>'
        + '</div>';
    }

    function renderBeat() {
      var r = reveal();
      if (!r) return;
      var b = beat();
      if (!b) return;
      overlay.classList.add('open');
      overlay.classList.toggle('blackout', b.type === 'blackout');
      overlay.classList.toggle('dim', opts.mirror);

      var stage = overlay.querySelector('.th-stage');
      if (stage) {
        stage.innerHTML = '';
        if (b.art) stage.appendChild(assetEl(b.art));
        var vig = document.createElement('div');
        vig.className = 'th-vignette';
        stage.appendChild(vig);

        if (b.type === 'card_reveal' && b.subject) {
          var card = document.createElement('div');
          card.className = 'th-card';
          card.appendChild(assetEl(b.art || 'card_sealed'));
          var body = document.createElement('div');
          body.className = 'th-card-body';
          body.innerHTML = '<div class="th-card-seat">Seat ' + esc(b.subject.seat != null ? (b.subject.seat < 10 ? '0' + b.subject.seat : b.subject.seat) : '?') + '</div>'
            + '<div class="th-card-name">' + esc(b.subject.name || '') + '</div>'
            + (b.subject.persona ? '<div class="th-card-persona">' + esc(b.subject.persona) + '</div>' : '')
            + (b.subject.role ? '<div class="th-card-role">' + esc(b.subject.role) + '</div>' : '<div class="th-card-sealed">' + esc(CFG().COPY ? '' : '') + 'Sealed</div>');
          card.appendChild(body);
          stage.appendChild(card);
        } else if (b.type === 'tally' && b.tally) {
          var tr = document.createElement('div');
          tr.className = 'th-tally';
          var row = document.createElement('div');
          row.className = 'th-tally-row';
          row.innerHTML = '<span>Seat #' + esc(b.tally.seat != null ? (b.tally.seat < 10 ? '0' + b.tally.seat : b.tally.seat) : '?') + ' ' + esc(b.tally.name || '') + '</span><span class="votes">' + esc(b.tally.votes) + '</span>';
          tr.appendChild(row);
          stage.appendChild(tr);
        } else if (b.type === 'last_words') {
          var cd = document.createElement('div');
          cd.className = 'th-countdown';
          cd.innerHTML = '<span class="th-countdown-num">' + Math.ceil((b.holdMs || 0) / 1000) + '</span><span class="th-countdown-label">' + esc(b.text) + '</span>';
          stage.appendChild(cd);
          var numEl = cd.querySelector('.th-countdown-num');
          var remain = (b.holdMs || 0) / 1000;
          if (state.typeTimer) clearInterval(state.typeTimer);
          state.typeTimer = setInterval(function () {
            remain -= 1;
            if (numEl) numEl.textContent = Math.max(0, Math.ceil(remain));
            if (remain <= 0) { clearInterval(state.typeTimer); state.typeTimer = null; }
          }, 1000);
        } else if (b.type === 'roster_flip') {
          var grid = document.createElement('div');
          grid.className = 'th-roster-flip';
          var mc = document.createElement('div');
          mc.className = 'th-mini-card';
          mc.appendChild(assetEl(b.art || 'role_villager'));
          mc.insertAdjacentHTML('beforeend', '<div class="nm">' + esc(b.text) + '</div>');
          grid.appendChild(mc);
          stage.appendChild(grid);
        }
      }

      var cap = overlay.querySelector('.th-caption');
      if (cap) {
        var kicker = b.type === 'blackout' ? 'MOONHOLLOW HARBOUR - NIGHT ' + (r.round || '') : (r.act ? 'ACT ' + r.act : '');
        cap.innerHTML = '<span class="th-kicker">' + esc(kicker) + '</span><span class="th-text"></span>';
        var textEl = cap.querySelector('.th-text');
        if (reduced) {
          textEl.textContent = b.text || '';
        } else {
          var words = String(b.text || '').split(/(\s+)/);
          var wi = 0;
          if (state.typeTimer) clearInterval(state.typeTimer);
          state.typeTimer = setInterval(function () {
            if (wi >= words.length) { clearInterval(state.typeTimer); state.typeTimer = null; return; }
            textEl.textContent += words[wi++];
          }, 55);
        }
      }

      var ctrl = overlay.querySelector('.th-controls-wrap');
      if (ctrl) ctrl.innerHTML = renderControls(r);

      if (root.WWSfx && b.sfx) root.WWSfx.play(b.sfx);
      if (root.WWTts && root.WWTts.isEnabled() && b.text) root.WWTts.speak(b.text);

      scheduleAuto(r, b);
    }

    function scheduleAuto(r, b) {
      if (state.timer) { clearTimeout(state.timer); state.timer = null; }
      if (!opts.autoAdvance) return;
      var c = r.control || {};
      if (c.paused || c.status === 'done') return;
      var hold = b.holdMs || 0;
      if (hold <= 0) return;
      state.timer = setTimeout(function () {
        if (state.beatIndex < r.beats.length - 1) send('next');
        else send('skip');
      }, hold + CFG().TIMERS.revealAutoAdvanceGraceMs);
    }

    function syncFromReveal() {
      var r = reveal();
      if (!r) {
        if (state.revealId) { close(); }
        return;
      }
      if (r.id !== state.revealId) {
        state.revealId = r.id;
        state.beatIndex = (r.control && r.control.beatIndex) || 0;
        state.started = (r.control && r.control.status) === 'playing' || (r.control && r.control.status) === 'done';
        var already = playedIds(opts.storage).indexOf(r.id) !== -1;
        if (already && (r.control.status === 'done' || !opts.autoStartReady)) {
          close();
          return;
        }
        if (opts.autoStartReady && r.control.status === 'ready') {
          state.started = true;
          send('start');
        }
        renderBeat();
        return;
      }
      // same reveal: follow remote control changes
      var c = r.control || { beatIndex: 0, status: 'ready' };
      if (c.status === 'playing' || c.status === 'done') state.started = true;
      if (typeof c.beatIndex === 'number' && c.beatIndex !== state.beatIndex) {
        state.beatIndex = c.beatIndex;
        renderBeat();
      } else if (c.status === 'done' && state.beatIndex >= r.beats.length - 1) {
        markPlayed(opts.storage, r.id);
        if (opts.onDone) opts.onDone(r);
        close();
        return;
      }
      if (c.status === 'playing' && !state.started) { state.started = true; renderBeat(); }
    }

    function close() {
      clearTimers();
      state.revealId = null;
      state.started = false;
      if (overlay) {
        overlay.classList.remove('open');
        overlay.classList.remove('blackout');
        var stage = overlay.querySelector('.th-stage');
        if (stage) stage.innerHTML = '';
      }
    }

    function goto(idx) {
      var r = reveal();
      if (!r) return;
      state.beatIndex = Math.max(0, Math.min(r.beats.length - 1, idx));
      renderBeat();
    }

    if (opts.keys) {
      document.addEventListener('keydown', function (ev) {
        if (!state.revealId) return;
        if (ev.target && (ev.target.tagName === 'INPUT' || ev.target.tagName === 'SELECT' || ev.target.tagName === 'TEXTAREA')) return;
        if (ev.key === ' ' || ev.key === 'ArrowRight') { ev.preventDefault(); send('next'); }
        else if (ev.key === 'ArrowLeft') { ev.preventDefault(); send('back'); }
        else if (ev.key === 's' || ev.key === 'S') { send('skip'); }
        else if (ev.key === 'p' || ev.key === 'P') { send('pause'); }
        else if (ev.key === 't' || ev.key === 'T') { if (opts.onToggleTts) opts.onToggleTts(); }
      });
    }

    if (overlay && opts.controls) {
      var wrap = document.createElement('div');
      wrap.className = 'th-controls-wrap';
      overlay.appendChild(wrap);
      wrap.addEventListener('click', function (ev) {
        var btn = ev.target && ev.target.closest ? ev.target.closest('[data-cmd]') : null;
        if (!btn) return;
        var cmd = btn.getAttribute('data-cmd');
        if (cmd === 'tts') { if (opts.onToggleTts) opts.onToggleTts(); return; }
        send(cmd);
      });
    }

    return {
      update: syncFromReveal,
      next: function () { send('next'); },
      back: function () { send('back'); },
      skip: function () { send('skip'); },
      pause: function () { send('pause'); },
      close: close,
      isOpen: function () { return Boolean(state.revealId); }
    };
  }

  root.WWTheatre = { create: create, markPlayed: markPlayed, playedIds: playedIds };
})(typeof globalThis !== 'undefined' ? globalThis : this);
