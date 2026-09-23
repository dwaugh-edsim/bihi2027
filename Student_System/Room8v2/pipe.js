/**
 * Room 8 v2 — pipe.js                                              R8-PIPE-0.3.0
 * The client for the Google-auth pipe. One place that knows how to: hand off to
 * the Identity app (popup), hold the signed identity for the session, and talk to
 * the Backend. Assignment pages should use this rather than re-implementing the
 * handoff/autosave/restore dance.
 *
 * Hardened per audit/Room8v2eval.md: effort telemetry (counts only, never content),
 * outbox counter + reconnect auto-flush, and honest pending-verify states.
 *
 * Usage:
 *   <script src="pipe.js"></script>
 *   <script>
 *     Room8.init({ identityUrl: '...', backendUrl: '...' });
 *     if (!Room8.identity()) { showGate(); }        // else:
 *     Room8.onIdentity(function (id, resolved) { ... });
 *     Room8.autosave(function () { return { answer: ... }; }, { task: 'My Task' });
 *   </script>
 *
 * NOTE: nothing durable is ever stored on the device. Only the transient sign-in
 * token lives in sessionStorage (cleared when the tab/Chromebook closes).
 */
window.Room8 = (function () {
  'use strict';

  var cfg = { identityUrl: '', backendUrl: '' };
  var ID_KEY = 'r8id';
  var identity = null;
  var popupRef = null;
  var listeners = [];

  // Effort telemetry: counts and duration only — never content (privacy rule).
  // Stamped into every save as data._telemetry so effort can be compared to output.
  var telemetry = (function () {
    var start = Date.now(), keystrokes = 0, pastes = 0, wired = false;
    function wire() {
      if (wired || typeof document === 'undefined') return;
      wired = true;
      document.addEventListener('keydown', function () { keystrokes++; }, { passive: true });
      document.addEventListener('paste', function () { pastes++; }, { passive: true });
    }
    function snapshot() {
      wire();
      return { keystrokes: keystrokes, pastes: pastes, durationSec: Math.round((Date.now() - start) / 1000) };
    }
    return { wire: wire, snapshot: snapshot };
  })();

  // ---- boot: parse a return fragment, else the session token ----
  function init(config) {
    if (config) {
      if (config.identityUrl) cfg.identityUrl = config.identityUrl;
      if (config.backendUrl) cfg.backendUrl = config.backendUrl;
    }
    telemetry.wire();
    window.addEventListener('message', onMessage);

    var m = (location.hash || '').match(/[#&]r8id=([^&]+)/);
    if (m) {
      try { identity = JSON.parse(atobUrl(m[1])); sessionStorage.setItem(ID_KEY, JSON.stringify(identity)); } catch (e) {}
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (!identity) { try { var s = sessionStorage.getItem(ID_KEY); if (s) identity = JSON.parse(s); } catch (e) {} }
    if (identity && (!identity.email || !identity.sig)) identity = null;
    return identity;
  }

  function notify(who) {
    listeners.forEach(function (fn) { try { fn(identity, who); } catch (_) {} });
  }

  function onMessage(e) {
    if (!e.data || e.data.type !== 'r8id' || !e.data.id || !e.data.id.sig || !e.data.id.email) return;
    identity = e.data.id;
    try { sessionStorage.setItem(ID_KEY, JSON.stringify(identity)); } catch (_) {}
    if (popupRef) {
      try { popupRef.close(); } catch (_) {}
      popupRef = null;
    }
    // ALWAYS notify — even when the backend is unreachable — so the page can react
    // (previously a failed resolve() silently swallowed the identity).
    resolve().then(function (who) { notify(who); }, function () { notify(null); });
  }

  function onIdentity(fn) {
    listeners.push(fn);
    if (identity) resolve().then(function (who) { notify(who); }, function () { notify(null); });
  }

  function signIn() {
    popupRef = window.open(cfg.identityUrl + '?return=' + encodeURIComponent(location.origin), 'r8signin', 'width=520,height=700');
    return !!popupRef;
  }

  function switchAccount() { try { sessionStorage.removeItem(ID_KEY); } catch (_) {} identity = null; location.reload(); }

  // ---- backend calls ----
  function post(url, obj) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify(obj), keepalive: true }).then(function (r) { return r.json(); });
  }
  function authed(action, extra) {
    var p = { action: action, email: identity.email, ts: identity.ts, sig: identity.sig };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) p[k] = extra[k];
    return p;
  }

  function resolve(extra) { return post(cfg.backendUrl, authed('resolve_student', extra || {})); }
  function load(task) { return post(cfg.backendUrl, authed('load_assignment', { task: task })); }
  function myTasks() { return post(cfg.backendUrl, authed('get_my_tasks', {})); }
  function teacher(action, payload, teacherPin) {
    var p = payload || {}; p.action = action; p.teacherPin = teacherPin;
    return post(cfg.backendUrl, p);
  }

  // Save with the proven resilience: CORS POST → no-cors + beacon → verify.
  function submit(payload) {
    var body = authed('submit_assignment', payload);
    var requestId = body.requestId;
    return post(cfg.backendUrl, body).catch(function () {
      try { fetch(cfg.backendUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                                   body: JSON.stringify(body), keepalive: true }); } catch (_) {}
      try { if (navigator.sendBeacon) navigator.sendBeacon(cfg.backendUrl, new Blob([JSON.stringify(body)], { type: 'text/plain;charset=utf-8' })); } catch (_) {}
      return { status: 'pending_verify', requestId: requestId };
    });
  }

  function verify(requestId) {
    return fetch(cfg.backendUrl + '?action=verify&requestId=' + encodeURIComponent(requestId) + '&t=' + Date.now())
      .then(function (r) { return r.json(); }).catch(function () { return { status: 'error', found: false }; });
  }

  // ---- autosave: debounced submit, outbox tracking, flush on hide/close/online ----
  function autosave(getData, opts) {
    opts = opts || {};
    var ms = opts.ms || 2500;
    var timer = null, lastHash = null, outbox = 0;
    function snapshot() {
      return { task: opts.task, section: opts.section || '', summary: opts.summary || '',
               data: getData(), telemetry: telemetry.snapshot() };
    }
    function hash(s) { return JSON.stringify(s.data); }   // excludes telemetry (counts change constantly)
    function isDirty() { return hash(snapshot()) !== lastHash; }
    function outboxDelta(n) {
      outbox = n === 0 ? 0 : Math.max(0, outbox + n);
      if (opts.onOutboxChange) { try { opts.onOutboxChange(outbox); } catch (_) {} }
    }
    function doSave(force) {
      var s = snapshot();
      var h = hash(s);
      if (!force && h === lastHash) return Promise.resolve({ status: 'unchanged' });
      var requestId = 'r-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      s.requestId = requestId;
      s.data._telemetry = s.telemetry;   // counts + duration only, never content
      var body = authed('submit_assignment', s);
      outboxDelta(+1);
      return post(cfg.backendUrl, body).then(function (res) {
        if (res && (res.status === 'submitted_successfully' || res.deduplicated)) {
          if (!res.deduplicated) outboxDelta(0);
          lastHash = h;
          if (opts.onSaved) opts.onSaved(res);
        } else if (res && res.status === 'auth_failed') {
          outboxDelta(0);
          if (opts.onAuthFailed) opts.onAuthFailed(res.reason);
        } else if (opts.onSaved) { opts.onSaved(res); }
        return res;
      }).catch(function () {
        // CORS-blocked / network drop: guaranteed dispatch, then confirm by requestId.
        try { fetch(cfg.backendUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                                     body: JSON.stringify(body), keepalive: true }); } catch (_) {}
        try { if (navigator.sendBeacon) navigator.sendBeacon(cfg.backendUrl, new Blob([JSON.stringify(body)], { type: 'text/plain;charset=utf-8' })); } catch (_) {}
        setTimeout(function () {
          verify(requestId).then(function (v) {
            if (v && v.found) { outboxDelta(0); lastHash = h; if (opts.onSaved) opts.onSaved({ status: 'submitted_successfully' }); }
            else if (opts.onSaved) opts.onSaved({ status: 'pending_verify', requestId: requestId });
          });
        }, 2500);
        return { status: 'pending_verify', requestId: requestId };
      });
    }
    var ctl = {
      markClean: function () { lastHash = hash(snapshot()); },
      isDirty: isDirty,
      saveNow: function () { clearTimeout(timer); return doSave(true); },
      flush: function () { clearTimeout(timer); if (isDirty()) doSave(true); },
      touch: function () { clearTimeout(timer); timer = setTimeout(doSave, ms); }
    };
    document.addEventListener('visibilitychange', function () { if (document.hidden) ctl.flush(); });
    window.addEventListener('pagehide', ctl.flush);
    window.addEventListener('online', function () { if (isDirty()) ctl.saveNow(); });
    if (opts.el) { opts.el.addEventListener('input', ctl.touch); opts.el.addEventListener('change', ctl.touch); }
    lastHash = hash(snapshot());   // baseline so an untouched form isn't re-saved
    return ctl;
  }

  function atobUrl(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return atob(s); }

  return {
    init: init, identity: function () { return identity; }, signIn: signIn, switchAccount: switchAccount,
    onIdentity: onIdentity, resolve: resolve, submit: submit, load: load, myTasks: myTasks, teacher: teacher,
    verify: verify, autosave: autosave, post: post
  };
})();