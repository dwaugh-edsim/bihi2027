# Template Hardening Proposal — Room 8 Student System

**Author:** MiniMax (review)
**Date:** 2026-09-20
**Scope:** `templates/_TEMPLATE_GAS_Assignment.html` and `templates/_TEMPLATE_Display_Dashboard.html`
**Goal:** Eliminate data-loss risks before the next class session. Push fixes into the *template* so every assignment cloned from it inherits the protection.

---

## TL;DR — The Critical Bug

Students can type into a fresh assignment page **without logging in**, and every keystroke silently saves to `localStorage` under a `_draft` key. On a Chromebook, that `localStorage` is wiped when the tab closes, when the lid closes, or when the device signs out. **Work typed anonymously is lost — full stop.** The "Local Saved" pill in the corner actively misleads students into thinking their work is safe.

The fix is a hard login wall that locks the workspace until a real PIN is authenticated. Details and exact code changes are below.

---

## Risk Inventory

### 🔴 P0 — Fix before next student session

#### P0-1. Anonymous editing is allowed (silent local-only data loss)

**Where:** `_TEMPLATE_GAS_Assignment.html`, lines 916–924 (form render), 1060–1083 (`handleInput`), 881 (`draftKey`), 1457–1461 (init restore), 1464–1478 (lifecycle flush).

**The chain of failure:**

1. Student opens an assignment URL. The toolbar shows `👤 Not Logged In ---` but the workspace renders fully editable (line 916–924).
2. Student clicks into any field. `oninput="handleInput()"` fires (line 930, 945, etc.).
3. `handleInput()` builds a payload via `collectData()` (line 986). For an unlogged user, `pin` is `''` so the payload includes `pin: ''`.
4. `localStorage.setItem(draftKey(''), JSON.stringify(data))` runs (line 1064). Because `draftKey('')` resolves to `gas_draft_${SLUG}_draft` (line 881), the save goes through.
5. The sync pill flips to `Local Saved (HH:MM:SS)` (line 1070). Student believes the work is captured.
6. The 4-second debounced cloud autosave (line 1080–1082) silently no-ops because `pin === ''`. No warning.
7. The `visibilitychange` and `pagehide` lifecycle flushes (line 1464–1478) also silently no-op for the same reason.
8. Student closes the lid / switches devices / tab is killed by the OS. `localStorage` evaporates.
9. **No recovery banner.** The recovery scan (line 1412–1437) explicitly skips drafts whose key ends in `_draft` (line 1418: `if (draftPin && draftPin !== 'draft')`).
10. **No cloud recovery.** Cloud save was never attempted because there was no PIN.

**Net result:** Every anonymous keystroke is *guaranteed* to be lost the next time the Chromebook session ends. The "Local Saved" pill is a lie for this code path.

**Fix — auth gate overlay + remove anonymous draft branch:**

1. Add a full-viewport `auth-gate` overlay (CSS + a `<div id="authGate">` shell) that covers the workspace.
2. Show the gate on `DOMContentLoaded` whenever there is no valid `savedPin`.
3. After successful `performLogin()` (line 1141), hide the gate and remove a `body.locked` class.
4. **Delete lines 1457–1461 entirely** — the anonymous draft restore is the trap that makes the bug invisible. Anonymous drafts must not be loadable from `localStorage` ever again.
5. On any input event before login, the gate blocks the click anyway, so `handleInput()` cannot fire.

#### P0-2. `beforeunload` warning fires for *all* anonymous close paths

**Where:** `_TEMPLATE_GAS_Assignment.html`, no existing handler (gap).

**Risk:** A student closing the tab or the laptop mid-typing gets no warning. On a Chromebook the close-tab gesture is two clicks; this happens daily.

**Fix:** Add a `beforeunload` handler that fires only when the form has been edited AND `pin === ''`:

```javascript
let dirty = false;
document.addEventListener('input', () => { dirty = true; }, { capture: true });
window.addEventListener('beforeunload', (e) => {
    const pin = (document.getElementById('authStudentPin')?.innerText || '').trim().toUpperCase();
    if (dirty && (!pin || pin === '---')) {
        e.preventDefault();
        e.returnValue = 'You have unsaved work. Log in or save a JSON backup before leaving.';
        return e.returnValue;
    }
});
```

For authenticated users this handler is a no-op (cloud is up to date), so it does not become annoying.

---

### 🟠 P1 — Fix this week

#### P1-1. Reset button wipes work without a strong confirmation

**Where:** `_TEMPLATE_GAS_Assignment.html`, lines 671 (button), 1336–1341 (`resetForm`).

**Risk:** The button is always enabled. A sleepy or panicked student can confirm "OK" through the native `confirm()` dialog and lose everything. If clicked while `pin === '---'`, it removes `gas_draft_${SLUG}_draft` — i.e., an anonymous draft from a different student on the same Chromebook.

**Fix:**

1. Render the Reset button as `<button class="btn btn-danger" id="btnReset" onclick="resetForm()" disabled>↺ Reset</button>` (line 671).
2. Enable it inside `updateAuthDisplay()` once `sPin` is a real PIN.
3. Replace the trivial `confirm()` with a typed-confirmation: student must type their PIN to enable the destructive action.

```javascript
function resetForm() {
    const pin = (document.getElementById('authStudentPin')?.innerText || '').trim().toUpperCase();
    if (!pin || pin === '---') return; // belt + suspenders
    const typed = prompt(
        `This will erase every answer saved locally for PIN ${pin}.\n\n` +
        `Type your 3-letter PIN to confirm (or click Cancel):`
    );
    if (!typed || typed.trim().toUpperCase() !== pin) {
        showToast('Reset cancelled — PIN did not match.', true);
        return;
    }
    localStorage.removeItem(draftKey(pin));
    sessionStorage.removeItem(`gas_${SLUG}_pin`);
    sessionStorage.removeItem(`gas_${SLUG}_name`);
    sessionStorage.removeItem(`gas_${SLUG}_class`);
    location.reload();
}
```

#### P1-2. Lock form fields while the login modal is open

**Where:** `_TEMPLATE_GAS_Assignment.html`, lines 725–757 (`loginModal`), 1118–1121 (`openLoginModal`).

**Risk:** Student clicks "Cloud Submit" without being logged in. `submitWork()` opens the login modal and shows a toast (line 1259–1262). Toast fades after 2.8 s. Student keeps typing into the still-editable form — same data-loss trap as P0-1.

**Fix:** When the login modal opens, add `body.locked` (CSS class, see P0-1). All workspace inputs/textarea/select/buttons go non-interactive until login succeeds or the modal is closed without logging in (in which case we *re-show the auth gate*, not just hide the modal — see P1-3).

#### P1-3. Modal-closed-without-login must not return to an editable form

**Where:** `_TEMPLATE_GAS_Assignment.html`, line 1122 (`closeLoginModal`).

**Risk:** If a student closes the login modal with the X button (line 733) without logging in, the workspace is fully editable again. They can re-trigger the data-loss loop.

**Fix:** `closeLoginModal()` should only hide the modal if `authStudentPin` is now a real PIN; otherwise re-show `authGate` and re-add `body.locked`. The X button must never leave the student in an editable-but-anonymous state.

#### P1-4. Persistent outbox indicator for failed cloud syncs

**Where:** `_TEMPLATE_GAS_Assignment.html`, lines 1269–1308 (`submitWork` failure branches).

**Risk:** Debounced autosaves that hit a network error are silent. Student logs out / closes device believing everything is fine. `localStorage` has the draft but cloud does not — and `localStorage` is gone tomorrow.

**Fix:** Add a `pendingSaves` counter on `window` (or in `sessionStorage`). On every failed sync, increment it. Render a persistent, non-toast pill:

```html
<span class="sync-pill outbox" id="outboxPill" style="display:none;">
    ⚠ <span id="outboxCount">0</span> unsynced — will retry
</span>
```

On successful sync, decrement and re-render. On `online` event (line 1480), force a flush.

---

### 🟡 P2 — Fix when convenient

#### P2-1. Recovery banner for anonymous drafts (offer JSON download)

**Where:** `_TEMPLATE_GAS_Assignment.html`, lines 1412–1438.

After P0-1, anonymous drafts should not be silently restored. But if a student *did* manage to type something anonymous before the gate was in place (existing in-the-wild assignments), the recovery banner could still offer a JSON download rather than silently discarding.

#### P2-2. Dashboard has no auth — anyone with the URL sees student data

**Where:** `_TEMPLATE_Display_Dashboard.html` — entire template.

**Risk:** Lower stakes (read-only display, no destructive action), but a student with the URL can see every classmate's submission status and dossier. Privacy issue, not data-loss.

**Fix:** Add a teacher-only auth gate at the top of `init()`. Use a `TEACHER_PINS` constant (separate from `MASTER_ROSTER_DATA`) with values like `TST`, `WAU`, `DEV`, `MRW`. Cache the validated PIN in `sessionStorage`. Show a small lock icon + logout button in the sidebar once unlocked.

This is a low-priority fix because dashboards are typically opened from a teacher bookmark, but for any future public-ish deployment (e.g., a parent-facing view), the gate is required.

#### P2-3. `sendBeacon` for the final flush

**Where:** `_TEMPLATE_GAS_Assignment.html`, line 1473 (`pagehide`).

**Risk:** `pagehide` triggers an async `submitWork(false)`, but `async` work may not complete before the page is killed. `navigator.sendBeacon(url, data)` is purpose-built for this. Refactor `submitWork(false)` to use a beacon path on `pagehide` / `visibilitychange === 'hidden'`.

#### P2-4. Dossier modal currently uses `event` global (line 898)

**Where:** `_TEMPLATE_Display_Dashboard.html`, line 895–900 (`switchModalTab`).

**Risk:** Trivial — `event.target` works but is fragile (any inline handler that fires it from a delegated context breaks). Replace with `e.currentTarget` passed via the inline call: `onclick="switchModalTab('${it.id}', event)"`.

---

## Code Changes — Drop-In Diffs

### `_TEMPLATE_GAS_Assignment.html`

**1. Add CSS (insert near line 635, before `@media (max-width: 720px)`):**

```css
/* ── Auth Gate Overlay ──────────────────────────────────── */
.auth-gate {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.94);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
.auth-gate.show { display: flex; }
.auth-gate-card {
    background: #ffffff;
    border: 2.5px solid #000000;
    border-radius: 10px;
    max-width: 420px;
    width: 100%;
    padding: 28px;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}
.auth-gate-card .lock-icon { font-size: 2.4rem; margin-bottom: 8px; }
.auth-gate-card h2 {
    font-family: 'Roboto Slab', serif;
    font-size: 1.3rem;
    margin-bottom: 8px;
}
.auth-gate-card p { font-size: 0.9rem; margin-bottom: 14px; color: var(--text-muted); }
.auth-gate-card .help {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 14px;
    border-top: 1px solid #e2e8f0;
    padding-top: 12px;
}

/* ── Locked Workspace State ────────────────────────────── */
body.locked .workspace-card .form-field,
body.locked .workspace-card .meta-field,
body.locked .workspace-card .section-card,
body.locked .workspace-card .reference-drawer,
body.locked .toolbar-actions .btn:not(.btn-primary) {
    pointer-events: none;
    opacity: 0.45;
    filter: blur(0.6px);
}
body.locked .workspace-card .intro-block { opacity: 0.55; }
```

**2. Add HTML shell (insert after line 673, before `<div class="workspace-card">`):**

```html
<!-- AUTH GATE — must clear before any field is interactive -->
<div class="auth-gate show" id="authGate">
    <div class="auth-gate-card">
        <div class="lock-icon">🔒</div>
        <h2>Login Required to Save</h2>
        <p>To save your work safely on this Chromebook, log in with your
            <strong>First Name</strong> and <strong>3-Letter PIN</strong>.</p>
        <p style="font-size:0.8rem;">Work typed without logging in will be lost
            when this tab closes.</p>
        <button class="btn btn-primary" onclick="openLoginModal()"
            style="margin-top: 6px;">🔑 Login Now</button>
        <div class="help">
            Forgot your PIN? Use <a href="javascript:void(0)"
                onclick="closeLoginModal(true); openClaimModal();"
                style="color:var(--accent); font-weight:700;">PIN Lookup</a>.
        </div>
    </div>
</div>
```

> Note: `closeLoginModal(true)` here is a hint — see P1-3 — that the gate should be re-shown.

**3. Disable Reset button until login (line 671):**

```html
<button class="btn btn-danger" id="btnReset" onclick="resetForm()" disabled>↺ Reset</button>
```

**4. Inside `updateAuthDisplay()` (after line 1116), add:**

```javascript
const gate = document.getElementById('authGate');
if (gate) gate.classList.remove('show');
document.body.classList.remove('locked');
const resetBtn = document.getElementById('btnReset');
if (resetBtn) resetBtn.disabled = false;
```

**5. Replace `closeLoginModal()` (line 1122) with:**

```javascript
function closeLoginModal(reopenGateIfStillAnonymous = false) {
    document.getElementById('loginModal').style.display = 'none';
    const pin = (document.getElementById('authStudentPin')?.innerText || '').trim().toUpperCase();
    if (reopenGateIfStillAnonymous && (!pin || pin === '---')) {
        document.getElementById('authGate')?.classList.add('show');
        document.body.classList.add('locked');
    }
}
```

**6. Replace `resetForm()` (line 1336) with the typed-PIN version above.**

**7. In the init handler (line 1403), replace the `else` branch (line 1456–1461) with:**

```javascript
} else {
    // Anonymous: NO draft restore. Show gate. Lock workspace.
    document.getElementById('authGate')?.classList.add('show');
    document.body.classList.add('locked');
    const resetBtn = document.getElementById('btnReset');
    if (resetBtn) resetBtn.disabled = true;
}

// beforeunload guard — anonymous unsaved work warning
let __dirty = false;
document.addEventListener('input', () => { __dirty = true; }, { capture: true });
window.addEventListener('beforeunload', (e) => {
    const pin = (document.getElementById('authStudentPin')?.innerText || '').trim().toUpperCase();
    if (__dirty && (!pin || pin === '---')) {
        e.preventDefault();
        e.returnValue = 'You have unsaved work and are not logged in. Close anyway?';
        return e.returnValue;
    }
});
```

**8. Lifecycle flush (lines 1464–1478) — the existing guard is fine, but add a fallback beacon path inside `submitWork` for `pagehide`:**

```javascript
async function submitWork(isManualClick = false, opts = {}) {
    const pin = (document.getElementById('authStudentPin')?.innerText || '').trim().toUpperCase();
    if (!pin || pin === '---') {
        if (isManualClick) {
            openLoginModal();
            showToast('Please log in with your Name and 3-Letter PIN first.', true);
        }
        return;
    }
    const data = collectData();

    // Use sendBeacon on unload paths to survive tab close
    if (opts.beacon && navigator.sendBeacon) {
        try {
            const blob = new Blob([JSON.stringify({
                action: 'submitProfile',
                taskName: ASSIGNMENT.taskName,
                course: ASSIGNMENT.course,
                data
            })], { type: 'application/json' });
            navigator.sendBeacon(StudentAPI.endpoint, blob);
            return;
        } catch (e) { /* fall through to normal submit */ }
    }
    // ... rest of existing submitWork unchanged ...
}
```

And update the `pagehide` listener:

```javascript
window.addEventListener('pagehide', () => {
    submitWork(false, { beacon: true });
});
```

---

### `_TEMPLATE_Display_Dashboard.html`

**Add teacher-PIN gate at the top of `init()` (line 676):**

```javascript
const TEACHER_PINS = ['TST', 'WAU', 'DEV', 'MRW'];

function init() {
    if (!ensureTeacherAuth()) return; // shows gate and stops init
    // ... existing init body ...
}

function ensureTeacherAuth() {
    const saved = sessionStorage.getItem('r8_teacher_pin');
    if (saved && TEACHER_PINS.includes(saved)) return true;
    showTeacherGate();
    return false;
}

function showTeacherGate() {
    let gate = document.getElementById('teacherGate');
    if (!gate) {
        gate = document.createElement('div');
        gate.id = 'teacherGate';
        gate.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.95);z-index:9999;display:flex;align-items:center;justify-content:center;';
        gate.innerHTML = `
            <div style="background:#fff;padding:28px;border-radius:10px;max-width:380px;text-align:center;border:2px solid #000;">
                <div style="font-size:2rem;">🔒</div>
                <h2 style="font-family:var(--font-heading);margin:8px 0;">Teacher Login</h2>
                <p style="color:var(--text-muted);font-size:0.88rem;">Enter your teacher PIN to view the dashboard.</p>
                <input id="teacherPinInput" type="password" maxlength="3"
                    style="margin-top:12px;padding:8px;font-family:var(--font-mono);font-size:1.2rem;letter-spacing:0.1em;text-transform:uppercase;width:120px;text-align:center;border:1.5px solid #000;border-radius:4px;">
                <br><button onclick="submitTeacherGate()"
                    style="margin-top:12px;padding:8px 16px;background:var(--coral);color:#fff;border:none;border-radius:4px;font-weight:700;cursor:pointer;">Unlock</button>
            </div>`;
        document.body.appendChild(gate);
        gate.querySelector('#teacherPinInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitTeacherGate();
        });
    }
    gate.style.display = 'flex';
}

function submitTeacherGate() {
    const pin = document.getElementById('teacherPinInput').value.trim().toUpperCase();
    if (!TEACHER_PINS.includes(pin)) {
        alert('Invalid teacher PIN.');
        return;
    }
    sessionStorage.setItem('r8_teacher_pin', pin);
    document.getElementById('teacherGate').style.display = 'none';
    init();
}
```

---

## Validation Plan

Run these in a clean Chrome profile (no cached session) before pushing the change:

| # | Step | Expected |
|---|------|----------|
| 1 | Open assignment URL, do not log in | Auth gate overlay is visible. All form fields are non-interactive. Reset button is disabled. |
| 2 | Try to type | No input registers. |
| 3 | Click "Login Now", enter wrong PIN | Toast: invalid PIN. Gate stays up. |
| 4 | Click "Login Now", enter valid PIN | Form unlocks. Reset button enables. Cloud work loads. |
| 5 | Type, then close tab while logged in | No browser prompt (cloud was up to date). Reopen tab → work still present from cloud. |
| 6 | Log out, type into a textarea (impossible after fix; verify gate stays up if you bypass it) | If you can bypass the gate, `beforeunload` fires a warning. |
| 7 | Click Reset while logged in | Prompts for PIN. Wrong PIN → cancels. Right PIN → reloads with cleared form. |
| 8 | Open dashboard URL | Teacher gate appears. Enter wrong PIN → rejected. Enter teacher PIN → grid loads. |
| 9 | Open dashboard URL, then refresh | Grid loads directly (sessionStorage PIN). |
| 10 | Kill network (DevTools → Offline), log in, type for 10 s | Outbox pill increments. Re-enable network → flushes to zero. |

If any row fails, do not ship.

---

## Migration Notes for Existing Assignments

- All assignments cloned from the **current** template still ship the bug. Either:
  - Re-clone from the hardened template, or
  - Send a one-time JS patch via the existing `api.js` injection point — a small script that injects the auth-gate DOM and overrides `handleInput` to no-op when `pin === ''`.
- A "Chromebook Recovery Wednesday" sweep of `localStorage` is not necessary — clearing the anonymous drafts on the existing machines is sufficient, and the new template will simply not produce new ones.

---

## Priority Summary

| ID | Severity | Effort | Notes |
|----|----------|--------|-------|
| P0-1 | 🔴 Critical | 30 min | Add `auth-gate`, remove lines 1457–1461, add unlock lines in `updateAuthDisplay` |
| P0-2 | 🔴 Critical | 10 min | Add `beforeunload` guard |
| P1-1 | 🟠 High | 15 min | Reset button disable + typed-PIN confirm |
| P1-2 | 🟠 High | 10 min | `body.locked` CSS, toggle on modal open |
| P1-3 | 🟠 High | 10 min | `closeLoginModal(true)` re-shows gate |
| P1-4 | 🟠 High | 20 min | Outbox pill, increment/decrement on submit |
| P2-1 | 🟡 Med | 15 min | Optional JSON-download recovery |
| P2-2 | 🟡 Med | 20 min | Teacher gate on dashboard |
| P2-3 | 🟡 Med | 15 min | `sendBeacon` flush path |
| P2-4 | 🟢 Low | 5 min | Replace `event` global in modal tab |

**Total P0 work: ~40 minutes. Ships today, before the next class session.**
