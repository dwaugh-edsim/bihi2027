/**
 * Room 8 v2 — assignment engine
 * Renders a fillable assignment from a CONFIG object, wired to the Google-auth pipe
 * (identity popup, server autosave, server restore, zero device storage).
 *
 * Page usage:
 *   <div id="r8"></div>
 *   <script src=".../Room8v2/pipe.js"></script>
 *   <script src=".../Room8v2/assignment_engine.js"></script>
 *   <script>
 *     Room8.init({ identityUrl:'…', backendUrl:'…' });
 *     R8Assignment.mount({ mount: document.getElementById('r8'),
 *                          pipe: Room8,
 *                          assignment: ASSIGNMENT,        // taskName, title, kicker, badge,
 *                          classList: ['902-CIT', …],      // introHtml, sections[]
 *                          custom: { collect: fn(data), populate: fn(data) }  // optional
 *                        });
 *   </script>
 */
window.R8Assignment = (function () {
  'use strict';

  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function fieldControl(f) {
    var id = 'r8f_' + f.id;
    switch (f.type) {
      case 'textarea': {
        var t = h('textarea'); t.id = id; t.rows = f.rows || 3;
        if (f.placeholder) t.placeholder = f.placeholder;
        return t;
      }
      case 'number': {
        var n = h('input'); n.type = 'number'; n.id = id;
        if (f.step) n.step = f.step; if (f.placeholder) n.placeholder = f.placeholder;
        return n;
      }
      case 'select': {
        var s = h('select'); s.id = id;
        s.appendChild(h('option', '', f.placeholder || '— choose —'));
        (f.options || []).forEach(function (o) {
          var opt = h('option', '', o); opt.value = o; s.appendChild(opt);
        });
        return s;
      }
      case 'radios': {
        var wrap = h('div', 'r8-radios');
        (f.options || []).forEach(function (o) {
          var lab = h('label');
          var r = h('input'); r.type = 'radio'; r.name = id; r.value = o;
          lab.appendChild(r); lab.appendChild(document.createTextNode(' ' + o));
          wrap.appendChild(lab);
        });
        return wrap;
      }
      case 'checks': {
        var box = h('div', 'r8-checks');
        (f.options || []).forEach(function (o) {
          var lab = h('label', 'r8-chip');
          var c = h('input'); c.type = 'checkbox'; c.dataset.field = f.id; c.value = o;
          lab.appendChild(c); lab.appendChild(document.createTextNode(' ' + o));
          box.appendChild(lab);
        });
        return box;
      }
      case 'static':
        return h('div', 'r8-static', f.html || '');
      default: { // text
        var i = h('input'); i.type = 'text'; i.id = id;
        if (f.placeholder) i.placeholder = f.placeholder;
        return i;
      }
    }
  }

  function fieldValue(f, root) {
    var id = 'r8f_' + f.id;
    if (f.type === 'checks') {
      return Array.prototype.slice.call(root.querySelectorAll('input[type=checkbox][data-field="' + f.id + '"]:checked'))
        .map(function (c) { return c.value; });
    }
    if (f.type === 'radios') {
      var r = root.querySelector('input[type=radio][name="' + id + '"]:checked');
      return r ? r.value : '';
    }
    var e = root.querySelector('#' + CSS.escape(id));
    return e ? e.value : '';
  }

  function setFieldValue(f, root, v) {
    var id = 'r8f_' + f.id;
    if (f.type === 'checks') {
      var arr = Array.isArray(v) ? v : (v ? [v] : []);
      root.querySelectorAll('input[type=checkbox][data-field="' + f.id + '"]').forEach(function (c) {
        c.checked = arr.indexOf(c.value) !== -1;
      });
      return;
    }
    if (f.type === 'radios') {
      var r = root.querySelector('input[type=radio][name="' + id + '"][value="' + String(v).split('"').join('\\"') + '"]');
      if (r) r.checked = true;
      return;
    }
    var e = root.querySelector('#' + CSS.escape(id));
    if (e && typeof v === 'string') e.value = v;
  }

  function mount(opts) {
    var mountEl = opts.mount;
    var cfg = opts.assignment;
    var pipe = opts.pipe;
    var custom = opts.custom || {};
    var task = cfg.taskName;

    // ---- chrome ----
    var gate = h('div', 'r8-gate');
    gate.appendChild(h('p', 'r8-kicker', cfg.kicker || ''));
    gate.appendChild(h('h1', '', cfg.title || 'Assignment'));
    gate.appendChild(h('p', 'r8-sub', 'Sign in with your school Google account — no PIN, nothing to type.'));
    var signInBtn = h('button', '', 'Sign in with your school account');
    signInBtn.type = 'button'; signInBtn.onclick = function () {
      if (!pipe.signIn()) gateMsg.textContent = 'Pop-up blocked — allow pop-ups for this site, then try again.';
    };
    gate.appendChild(signInBtn);
    var gateMsg = h('div', 'r8-sub'); gate.appendChild(gateMsg);

    var app = h('div'); app.hidden = true;
    app.appendChild(h('div', 'r8-kicker', cfg.kicker || ''));
    app.appendChild(h('h1', '', cfg.title || ''));
    if (cfg.badge) app.appendChild(h('div', 'r8-badge', cfg.badge));
    var who = h('div', 'r8-who');
    app.appendChild(who);
    if (cfg.introHtml) app.appendChild(h('div', 'r8-intro', cfg.introHtml));

    var restored = h('div', 'r8-restored', 'Restored your last saved work.');
    restored.style.display = 'none'; app.appendChild(restored);

    var sectionWrap = h('div', 'r8-section-line');
    app.appendChild(sectionWrap);

    // ---- sections & fields ----
    var idx = 0;
    (cfg.sections || []).forEach(function (sec) {
      idx++;
      app.appendChild(h('h2', '', '<span class="r8-num">' + (sec.num || idx) + '</span> ' + (sec.title || '')));
      if (sec.hint) app.appendChild(h('p', 'r8-hint', sec.hint));
      (sec.fields || []).forEach(function (f) {
        if (f.type === 'static') { app.appendChild(h('div', 'r8-static', f.html || '')); return; }
        var lab = h('label', 'r8-label', f.label || f.id);
        if (f.hint) lab.appendChild(h('span', 'r8-hint', ' — ' + f.hint));
        app.appendChild(lab);
        app.appendChild(fieldControl(f));
      });
    });

    var bar = h('div', 'r8-bar');
    var saveBtn = h('button', '', 'Save'); saveBtn.type = 'button';
    bar.appendChild(saveBtn);
    var status = h('span', 'r8-status', 'Not saved yet.');
    bar.appendChild(status);
    app.appendChild(bar);

    mountEl.appendChild(gate);
    mountEl.appendChild(app);

    // ---- data ----
    function collect() {
      var answers = {};
      (cfg.sections || []).forEach(function (sec) {
        (sec.fields || []).forEach(function (f) {
          if (f.type === 'static') return;
          answers[f.id] = fieldValue(f, app);
        });
      });
      if (custom.collect) custom.collect(answers);
      return answers;
    }
    function populate(data) {
      var answers = (data && data.answers) ? data.answers : (data || {});
      (cfg.sections || []).forEach(function (sec) {
        (sec.fields || []).forEach(function (f) {
          if (f.type === 'static') return;
          if (Object.prototype.hasOwnProperty.call(answers, f.id)) setFieldValue(f, app, answers[f.id]);
        });
      });
      if (custom.populate) try { custom.populate(answers); } catch (_) {}
    }

    function setStatus(msg, kind) { status.textContent = msg; status.className = 'r8-status ' + (kind || ''); }

    // ---- identity ----
    function showApp() {
      gate.hidden = true; app.hidden = false;
    }
    var resolvedSection = '';
    var ctl = null;
    pipe.onIdentity(function (id, who) {
      showApp();
      var known = !!(who && who.known);
      var name = (who && who.name) || '';
      resolvedSection = (who && who.section) || '';
      who.textContent = '';
      who.appendChild(document.createTextNode('Signed in as '));
      who.appendChild(h('b', '', id.email));
      who.appendChild(document.createTextNode(known ? ' · ' + name + ' · ' + resolvedSection : ' · not on the roster yet — a real page would ask'));
      if (!known && (cfg.classList || []).length) {
        sectionWrap.textContent = 'Section (not on the roster — choose): ';
        var sel = h('select'); sel.id = 'r8section';
        sel.appendChild(h('option', '', '—'));
        cfg.classList.forEach(function (s) { var o = h('option', '', s); o.value = s; sel.appendChild(o); });
        sectionWrap.appendChild(sel);
        sel.addEventListener('change', function () { if (ctl) ctl.touch(); });
      } else {
        sectionWrap.textContent = known ? 'Section: ' + resolvedSection : '';
      }
      // ---- restore ----
      setStatus('Loading your saved work…', '');
      pipe.load(task).then(function (j) {
        if (j && j.status === 'ok' && j.found) {
          populate(j.data || {});
          restored.style.display = 'block';
          setStatus('Restored your last save' + (j.savedAt ? ' (' + new Date(j.savedAt).toLocaleString() + ')' : '') + '.', 'ok');
        } else if (j && j.status === 'auth_failed') {
          setStatus('Sign-in rejected: ' + j.reason, 'bad');
        } else {
          setStatus('Fresh start — autosaves as you type.', '');
        }
        if (ctl) ctl.markClean();
      }).catch(function () {
        setStatus('Backend unreachable — you can still type, but saving needs the network.', 'bad');
      });
    });

    // ---- autosave ----
    var ctl = pipe.autosave(function () {
      var s = collect();
      return { data: { answers: s, _v: 2, _pipe: true } };
    }, {
      task: task,
      get section() { var s = document.getElementById('r8section'); return s ? s.value : resolvedSection; },
      summary: cfg.badge || '',
      ms: 2500,
      el: app,
      onSaved: function (res) {
        if (res && res.status === 'auth_failed') return;
        setStatus('Saved ✓', 'ok');
      },
      onAuthFailed: function (reason) {
        setStatus('Sign-in expired — save again after re-signing in (' + reason + ')', 'warn');
      }
    });
    saveBtn.onclick = function () { ctl.saveNow(); };
    return { collect: collect, populate: populate, autosave: function () { return ctl; } };
  }

  return { mount: mount };
})();