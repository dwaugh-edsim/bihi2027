/**
 * Room 8 v2 — assignment engine                        R8-ENGINE-0.2.0
 * Renders a fillable assignment from a CONFIG object, wired to the Google-auth pipe
 * (identity popup, server autosave, server restore, zero device storage).
 *
 * Hardened per the private audit (../bihipri-27/audit-priv/Room8v2eval.md): effort
 * telemetry (via pipe), outbox badge + offline/reconnect states, in-tab crash recovery
 * (sessionStorage — never durable), and emergency exports (Copy for Google Docs /
 * Download JSON).
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
    if (e && (typeof v === 'string' || typeof v === 'number')) e.value = v;
  }

  function mount(opts) {
    var mountEl = opts.mount;
    var cfg = opts.assignment;
    var pipe = opts.pipe;
    var custom = opts.custom || {};
    var task = cfg.taskName;

    // ---- inject styles ----
    (function injectStyles() {
      if (typeof document === 'undefined' || document.getElementById('r8-engine-styles')) return;
      var st = document.createElement('style');
      st.id = 'r8-engine-styles';
      st.textContent = [
        '.r8-top-bar { position: sticky; top: 0; z-index: 999; background: #232323; color: #f8fafc;',
        '  border-bottom: 3px solid #c94663; padding: 8px 14px; border-radius: 6px; margin: 0 0 16px;',
        '  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;',
        '  font-size: 0.88rem; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }',
        '.r8-top-bar strong { color: #38bdf8; font-family: ui-monospace, monospace; }',
        '.r8-top-bar .r8-top-meta { color: #a3a3a3; font-size: 0.82rem; }',
        '.r8-top-bar .r8-top-sync { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }',
        '.r8-sync-badge { background: #171717; border: 1px solid #404040; padding: 3px 9px; border-radius: 5px;',
        '  font-size: 0.78rem; font-weight: 600; color: #e5e5e5; display: inline-flex; align-items: center; gap: 5px; }',
        '.r8-sync-badge.ok { border-color: #15803d; color: #4ade80; background: #052e16; }',
        '.r8-sync-badge.warn { border-color: #b45309; color: #fde047; background: #451a03; }',
        '.r8-sync-badge.bad { border-color: #b91c1c; color: #fca5a5; background: #450a0a; }',
        '.r8-top-bar button.mini-top { font: inherit; font-size: 0.75rem; font-weight: 700; padding: 3px 8px;',
        '  border-radius: 4px; border: 1px solid #525252; background: #262626; color: #f8fafc; cursor: pointer; }',
        '.r8-top-bar button.mini-top:hover { background: #404040; }',
        '.r8-top-bar button.mini-verify { background: #c94663; border-color: #c94663; color: #fff; }',
        '.r8-top-bar button.mini-verify:hover { background: #d85773; }'
      ].join('\n');
      document.head.appendChild(st);
    })();

    // ---- top identity & sync bar ----
    var topBar = h('div', 'r8-top-bar');
    var topUser = h('div', 'r8-top-user');
    topUser.innerHTML = '👤 <span>Not signed in yet</span>';
    var topSync = h('div', 'r8-top-sync');
    var topSyncBadge = h('span', 'r8-sync-badge', '☁️ GAS: Waiting for sign-in');
    var topVerifyBtn = h('button', 'mini-top mini-verify', '⚡ Verify GAS Write');
    topVerifyBtn.type = 'button';
    topVerifyBtn.style.display = 'none';
    topVerifyBtn.title = 'Check Google Apps Script to confirm your data is saved in the Google Sheet';
    topSync.appendChild(topSyncBadge);
    topSync.appendChild(topVerifyBtn);
    topBar.appendChild(topUser);
    topBar.appendChild(topSync);

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
    var whoEl = h('div', 'r8-who');
    app.appendChild(whoEl);
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
    var barVerifyBtn = h('button', 'mini-top mini-verify', '⚡ Verify Write with Server');
    barVerifyBtn.type = 'button';
    bar.appendChild(barVerifyBtn);
    var status = h('span', 'r8-status', 'Not saved yet.');
    bar.appendChild(status);
    var outboxBadge = h('span', 'r8-outbox', ''); outboxBadge.style.display = 'none';
    outboxBadge.style.cssText += ';background:#b45309;color:#fff;padding:3px 10px;border-radius:999px;font-size:.78rem;font-weight:700';
    bar.appendChild(outboxBadge);
    var copyBtn = h('button', '', 'Copy for Google Docs'); copyBtn.type = 'button';
    copyBtn.style.background = '#e2e8f0'; copyBtn.style.color = '#0f172a';
    copyBtn.onclick = function () { exportForDocs(); };
    bar.appendChild(copyBtn);
    var dlBtn = h('button', '', 'Download JSON'); dlBtn.type = 'button';
    dlBtn.style.background = '#e2e8f0'; dlBtn.style.color = '#0f172a';
    dlBtn.onclick = function () { exportJson(); };
    bar.appendChild(dlBtn);
    app.appendChild(bar);

    mountEl.appendChild(topBar);
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

    var idEmail = '';
    var resolvedSection = '';
    // In-tab crash recovery: sessionStorage (per-tab, wiped on close — never durable,
    // never localStorage). Covers the gap between a keystroke and the 2.5s autosave.
    var DRAFT_PREFIX = 'r8_tab_draft_';
    function saveTabDraft() {
      try { sessionStorage.setItem(DRAFT_PREFIX + task, JSON.stringify({ answers: collect(), at: Date.now() })); } catch (_) {}
    }
    function getTabDraft() {
      try { var raw = sessionStorage.getItem(DRAFT_PREFIX + task); return raw ? JSON.parse(raw) : null; } catch (_) { return null; }
    }
    function clearTabDraft() { try { sessionStorage.removeItem(DRAFT_PREFIX + task); } catch (_) {} }
    function countAnswers(a) {
      if (!a) return 0; var n = 0;
      Object.keys(a).forEach(function (k) {
        var v = a[k];
        if (Array.isArray(v)) { if (v.length) n++; }
        else if (typeof v === 'string') { if (v.trim()) n++; }
        else if (v) n++;
      });
      return n;
    }

    // Emergency hand-in: clipboard Markdown + local JSON download, for total outages.
    function exportMarkdown() {
      var answers = collect();
      var md = '# ' + (cfg.title || 'Assignment') + '\n';
      md += '**Student:** ' + (idEmail || 'unknown') + '\n';
      md += '**Section:** ' + (resolvedSection || '') + '\n';
      md += '**Exported:** ' + new Date().toLocaleString() + '\n\n';
      (cfg.sections || []).forEach(function (sec) {
        md += '## ' + (sec.num ? sec.num + ' · ' : '') + (sec.title || '') + '\n\n';
        (sec.fields || []).forEach(function (f) {
          if (f.type === 'static') return;
          var v = answers[f.id];
          md += '- **' + (f.label || f.id) + ':** ' + (Array.isArray(v) ? v.join(', ') : (v || '—')) + '\n';
        });
        md += '\n';
      });
      if (custom.exportExtra) md += (custom.exportExtra(answers) || '');
      return md;
    }
    function exportForDocs() {
      var md = exportMarkdown();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(md).then(function () {
          setStatus('Copied to the clipboard — paste it into Google Classroom or Docs.', 'ok');
        }, function () { setStatus('Copy failed — use Download JSON instead.', 'bad'); });
      } else {
        window.prompt('Copy your work manually:', md);
      }
    }
    function exportJson() {
      var blob = new Blob([JSON.stringify({ task: task, email: idEmail, section: resolvedSection,
        exported: new Date().toISOString(), answers: collect() }, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = String(task || 'assignment').replace(/[^a-z0-9]+/gi, '_').slice(0, 40) + '_export.json';
      document.body.appendChild(a); a.click(); a.remove();
      setStatus('Downloaded a JSON backup of your work.', 'ok');
    }
    function showOutbox(n) {
      if (n > 0) { outboxBadge.textContent = 'Saving when online — ' + n + ' pending'; outboxBadge.style.display = 'inline-block'; }
      else { outboxBadge.style.display = 'none'; }
    }

    // ---- identity ----
    function showApp() {
      gate.hidden = true; app.hidden = false;
    }
    function resolveSectionKey(raw, course, classList) {
      if (!raw) return '';
      var s = String(raw).trim();
      if (s.indexOf('-') !== -1) return s;
      var c = String(course || '').toUpperCase();
      var suffix = '';
      if (c.indexOf('CIT') !== -1) suffix = 'CIT';
      else if (c.indexOf('HL9') !== -1 || (c.indexOf('HL') !== -1 && s.charAt(0) === '9')) suffix = 'HL';
      else if (c.indexOf('HL8') !== -1 || c.indexOf('HE') !== -1 || (c.indexOf('HL') !== -1 && s.charAt(0) === '8')) suffix = 'HE';
      else suffix = { CIT9: 'CIT', HL9: 'HL', HL8: 'HE' }[c] || '';
      var candidate = suffix ? (s + '-' + suffix) : s;
      if (Array.isArray(classList) && classList.length) {
        for (var i = 0; i < classList.length; i++) {
          if (classList[i] === candidate || classList[i].indexOf(s + '-') === 0) return classList[i];
        }
      }
      return candidate;
    }

    function escapeHtml(s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function verifyServerWrite(isManual) {
      if (!idEmail) {
        if (isManual) alert('Please sign in first before checking server writes.');
        return Promise.resolve(false);
      }
      topSyncBadge.textContent = '⏳ Checking GAS record…';
      topSyncBadge.className = 'r8-sync-badge warn';
      if (isManual) setStatus('Querying Google Apps Script backend to verify saved data…', 'warn');

      return pipe.load(task).then(function (res) {
        if (res && res.status === 'ok' && res.found) {
          var tStr = res.savedAt ? new Date(res.savedAt).toLocaleTimeString() : new Date().toLocaleTimeString();
          var data = res.data || {};
          var ans = data.answers || data;
          var ansCount = countAnswers(ans);
          var numbeoCount = Array.isArray(data.global_numbeo)
            ? data.global_numbeo.filter(function (r) { return r.halifax_price || r.city_price || r.halifax || r.price; }).length
            : 0;
          var extra = numbeoCount ? (' + ' + numbeoCount + ' Numbeo items') : '';
          var summaryMsg = '✓ GAS Confirmed: ' + ansCount + ' answers' + extra + ' saved (' + tStr + ')';
          topSyncBadge.textContent = '☁️ ' + summaryMsg;
          topSyncBadge.className = 'r8-sync-badge ok';
          setStatus(summaryMsg, 'ok');
          if (isManual) {
            alert('✅ Google Apps Script Write Confirmed!\n\nYour work is sitting safely on the server in the Room 8 Google Sheet.\n\n• Task: ' + task + '\n• Student: ' + idEmail + '\n• Server Time: ' + tStr + '\n• Verified answers: ' + ansCount + ' fields' + extra);
          }
          return true;
        } else if (res && res.status === 'auth_failed') {
          topSyncBadge.textContent = '⚠️ Auth expired (' + res.reason + ')';
          topSyncBadge.className = 'r8-sync-badge bad';
          setStatus('Sign-in expired: ' + res.reason, 'bad');
          return false;
        } else {
          topSyncBadge.textContent = '⚠️ Not in GAS yet — saving now…';
          topSyncBadge.className = 'r8-sync-badge warn';
          setStatus('No record found in GAS yet — saving now…', 'warn');
          if (ctl) ctl.saveNow();
          return false;
        }
      }).catch(function () {
        topSyncBadge.textContent = '⚠️ GAS connection error';
        topSyncBadge.className = 'r8-sync-badge bad';
        setStatus('Could not reach GAS backend to verify.', 'bad');
        return false;
      });
    }

    pipe.onIdentity(function (id, who) {
      showApp();
      idEmail = id.email;
      var known = !!(who && who.known);
      var name = (who && who.name) || '';
      resolvedSection = resolveSectionKey((who && who.section) || '', cfg.course, cfg.classList);

      // Top bar identity update
      topUser.innerHTML = '👤 Signed in as: <strong>' + escapeHtml(id.email) + '</strong>' +
        '<span class="r8-top-meta">' + (known ? ' · ' + escapeHtml(name) + ' · ' + escapeHtml(resolvedSection) : ' · not on roster') + '</span> ';
      var switchBtn = h('button', 'mini-top', 'Switch');
      switchBtn.type = 'button';
      switchBtn.onclick = function () { pipe.switchAccount(); };
      topUser.appendChild(switchBtn);

      topVerifyBtn.style.display = 'inline-block';
      topVerifyBtn.onclick = function () { verifyServerWrite(true); };
      barVerifyBtn.style.display = 'inline-block';
      barVerifyBtn.onclick = function () { verifyServerWrite(true); };

      topSyncBadge.textContent = '☁️ GAS: Connected';
      topSyncBadge.className = 'r8-sync-badge ok';

      whoEl.textContent = '';
      whoEl.appendChild(document.createTextNode('Signed in as '));
      whoEl.appendChild(h('b', '', id.email));
      whoEl.appendChild(document.createTextNode(known ? ' · ' + name + ' · ' + resolvedSection : ' · not on the roster yet — choose below:'));
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
      // ---- restore: server first, then a newer in-tab draft if one survived (crash recovery) ----
      setStatus('Loading your saved work…', '');
      topSyncBadge.textContent = '⏳ Loading saved work…';
      pipe.load(task).then(function (j) {
        var found = j && j.status === 'ok' && j.found;
        if (found) {
          populate(j.data || {});
          restored.style.display = 'block';
          var tStr = j.savedAt ? new Date(j.savedAt).toLocaleTimeString() : '';
          setStatus('Restored your last save' + (tStr ? ' (' + tStr + ')' : '') + '.', 'ok');
          topSyncBadge.textContent = '☁️ GAS: Verified save (' + (tStr || 'on server') + ') ✓';
          topSyncBadge.className = 'r8-sync-badge ok';
        } else if (j && j.status === 'auth_failed') {
          setStatus('Sign-in rejected: ' + j.reason, 'bad');
          topSyncBadge.textContent = '⚠️ Sign-in rejected: ' + j.reason;
          topSyncBadge.className = 'r8-sync-badge bad';
        } else {
          setStatus('Fresh start — autosaves as you type.', '');
          topSyncBadge.textContent = '☁️ GAS: Ready (autosaves as you type)';
          topSyncBadge.className = 'r8-sync-badge';
        }
        var draft = getTabDraft();
        if (draft && draft.answers) {
          var serverCount = countAnswers(found ? ((j.data || {}).answers) || j.data : null);
          if (countAnswers(draft.answers) > serverCount) {
            populate(draft.answers);
            setStatus('Restored unsaved changes from this tab — saving them now…', 'warn');
            if (ctl) ctl.saveNow();
          }
        }
        if (ctl) ctl.markClean();
      }).catch(function () {
        setStatus('Backend unreachable — you can still type; use Copy/Download to keep your work.', 'bad');
        topSyncBadge.textContent = '⚠️ GAS: Offline';
        topSyncBadge.className = 'r8-sync-badge bad';
      });
    });

    // ---- autosave ----
    var ctl = pipe.autosave(function () {
      var s = collect();
      return { answers: s, _v: 2, _pipe: true };
    }, {
      task: task,
      get section() { var s = document.getElementById('r8section'); return s ? s.value : resolvedSection; },
      summary: cfg.badge || '',
      ms: 2500,
      el: app,
      onOutboxChange: showOutbox,
      onSaved: function (res) {
        if (res && res.status === 'auth_failed') return;
        clearTabDraft();
        var t = new Date().toLocaleTimeString();
        setStatus('Saved ✓ ' + t, 'ok');
        topSyncBadge.textContent = '☁️ GAS: Write Confirmed (' + t + ') ✓';
        topSyncBadge.className = 'r8-sync-badge ok';
      },
      onAuthFailed: function (reason) {
        setStatus('Sign-in expired — save again after re-signing in (' + reason + ')', 'warn');
        topSyncBadge.textContent = '⚠️ Auth expired (' + reason + ')';
        topSyncBadge.className = 'r8-sync-badge bad';
      }
    });
    saveBtn.onclick = function () { ctl.saveNow(); };
    barVerifyBtn.onclick = function () { verifyServerWrite(true); };
    app.addEventListener('input', saveTabDraft);
    app.addEventListener('change', saveTabDraft);
    window.addEventListener('offline', function () {
      setStatus('OFFLINE — keep typing, but do not close your Chromebook. Work saves when the network returns.', 'warn');
      topSyncBadge.textContent = '⚠️ Network offline';
      topSyncBadge.className = 'r8-sync-badge warn';
    });
    window.addEventListener('online', function () {
      setStatus('Back online — saving…', '');
      topSyncBadge.textContent = '☁️ Reconnecting to GAS…';
      topSyncBadge.className = 'r8-sync-badge warn';
    });
    return { collect: collect, populate: populate, autosave: function () { return ctl; }, verify: verifyServerWrite };
  }

  return { mount: mount };
})();