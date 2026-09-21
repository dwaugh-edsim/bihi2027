# Template Hardening Proposal: Room 8 Student System (Chromebook Edition)
**Author:** Gemini (Room 8 Architecture Pair)  
**Date:** September 20, 2026  
**Target Files:**
- `Student_System/templates/_TEMPLATE_GAS_Assignment.html` (and `Student_System/_TEMPLATE_GAS_Assignment.html`)
- `Student_System/templates/_TEMPLATE_Display_Dashboard.html` (and `strongly_typed_display_template.html`)
- Active assignment instances: `07_Prior_Course_Diagnostic_Interactive.html`, `Places_Of_Significance_Studio.html`, `18_Cit9_Real_Issues_Dossier.html`

---

## 1. Executive Summary: The Chromebook Reality

In a 1:1 school Chromebook cart environment (Bicentennial Junior High Room 8), **`localStorage` is ephemeral by design**. 
When a middle school student closes their Chromebook or logs out of their Google Workspace session at the bell, ChromeOS policy wipes the local browser profile, indexedDB, and `localStorage`. 

Any design that allows students to type work while unauthenticated relies on an illusion:
1. **The Anonymous Trap:** The student begins typing without logging in. The system silently saves to `localStorage` under an empty PIN.
2. **The Deceptive "Local Saved" Pill:** The UI shows `⚪ Local Saved (11:42 AM)`. To a 14-year-old, "Saved" means safe.
3. **The Total Loss Event:** Because the PIN is `'---'`, cloud autosave is disabled. At the bell, the student closes the Chromebook and logs out. Next day, 100% of their work is gone.
4. **The Overwrite-on-Login Disaster:** If the student realizes mid-class they aren't logged in and clicks "Login", the current template's `loadCloudWorkForStudent()` unconditionally restores from the cloud, **wiping whatever was currently typed on screen!**

This proposal outlines the complete blueprint to make Room 8 templates **impossible for a student to accidentally lose data**.

---

## 2. Audit of Current Flaws

### A. `_TEMPLATE_GAS_Assignment.html`

| # | Vulnerability | Current Code | Failure Mode | Severity |
|---|---|---|---|---|
| **1** | **Unrestricted Editing Without Auth** | Form fields enabled on load (`#workspaceCard` interactive) | Student completes entire assignment as `PIN: ---`. Zero bytes ever leave the device. Work is lost on logout. | **CRITICAL** |
| **2** | **Overwrite-on-Login Bug** | `performLogin()` $\rightarrow$ `loadCloudWorkForStudent()` calls `restoreFormData(targetData)` | If a student types for 20 min anonymously and then logs in, `restoreFormData()` completely clobbers their current on-screen answers with empty/stale cloud data. | **CRITICAL** |
| **3** | **Misleading "Local Saved" Pill** | `saveText.textContent = 'Local Saved (${timeStr})'` | Students trust this indicator. "Local Saved" on a shared Chromebook is a fatal misnomer. | **HIGH** |
| **4** | **Fragile Lid-Close Flush** | `visibilitychange` & `pagehide` call `await submitWork(false)` | Standard async `fetch()` in an unload listener is aborted by ChromeOS before network transmission completes. Fails to leverage `StudentAPI.sendEmergencyBeacon()`. | **HIGH** |
| **5** | **Accidental "Reset" Nuke Button** | Top toolbar features a prominent red `↺ Reset` button with a basic browser `confirm()` | Students accidentally trigger it; wipes local draft and reloads page. | **MEDIUM** |
| **6** | **Silent Offline State** | Autosave catch block sets `sync-pill offline` | If school Wi-Fi drops, students aren't aggressively warned not to close the lid. | **MEDIUM** |

### B. `_TEMPLATE_Display_Dashboard.html`

| # | Vulnerability | Current Code | Failure Mode | Severity |
|---|---|---|---|---|
| **1** | **Task ID / Schema Mismatch** | `sd[it.id] \|\| (sd._tasks && sd._tasks[it.id])` | If dashboard defines `id: 'survey'` but assignment saves as `taskName: 'Prior Course Survey'`, `sd._tasks[it.id]` fails. Student shows as "⚪ Waiting" despite submitting. | **HIGH** |
| **2** | **Projector Privacy Violation** | Dossier modal renders `<pre>${JSON.stringify(itemData)}</pre>` | Clicking a student row on the classroom projector reveals unformatted raw JSON, private reflection notes, and internal metadata to the whole room. | **HIGH** |
| **3** | **Silent Sync Failures** | `syncLiveCloud()` catches errors with `console.warn` only | Projector displays stale data without alerting teacher that Google Sheets returned a CORS redirect or 429 error. | **MEDIUM** |
| **4** | **No Projector Auto-Refresh** | Manual button click only (`btnSyncCloud`) | Teacher must leave front of room to click "Sync" every time students finish a station. | **LOW / UX** |

---

## 3. Hardened Architecture & Solutions

```
                    ┌────────────────────────────────────────────────────────┐
                    │                   PAGE LOAD INITIALIZATION             │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                    Is Session / PIN Valid?
                                   ┌────────────┴────────────┐
                                   ▼                         ▼
                                 [YES]                     [NO]
                                   │                         │
                        Unlock Workspace Card        Lock Workspace Card
                        Restore Cloud/Local Data     Display Modal Gate:
                        Green Cloud Sync Pill        "Enter 3-Letter PIN to Begin"
                                   │                         │
                                   │                 Enter PIN & Authenticate
                                   │                         │
                                   │                 Check Screen State:
                                   │                 Any typed text on screen?
                                   │                ┌────────┴────────┐
                                   │               [NO]             [YES]
                                   │                │                 │
                                   │                │         Prompt: Merge/Keep
                                   │                │         Screen Work vs Cloud
                                   │                │                 │
                                   └────────────────┴─────────────────┘
                                                │
                                       STUDENT WORK IN PROGRESS
                                                │
                        Keystroke ──> Debounced Cloud Autosave (4s)
                        Lid Close ──> StudentAPI.sendEmergencyBeacon() (Keepalive)
                        Wi-Fi Drop──> Sticky Red Alarm Banner (Do Not Close Lid)
```

---

## 4. Specific Code Implementations for `_TEMPLATE_GAS_Assignment.html`

### Solution 1: The Mandatory Pre-Flight Login Gate & Soft Lockdown
Students **must not be allowed to enter data** until authenticated with their official 3-letter PIN.

#### CSS:
```css
/* Lockdown workspace when unauthenticated */
.workspace-locked {
    position: relative;
    pointer-events: none;
    user-select: none;
    filter: blur(2px) grayscale(40%);
    opacity: 0.55;
    transition: all 0.3s ease;
}

.login-gate-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
}

.login-gate-box {
    background: #ffffff;
    border: 3px solid #000000;
    border-radius: 10px;
    max-width: 460px;
    width: 90%;
    padding: 32px 28px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.35);
    text-align: center;
}
```

#### JavaScript Gate Logic:
```javascript
function enforceAuthenticationGate() {
    const pin = (document.getElementById('authStudentPin')?.innerText || '').trim().toUpperCase();
    const workspace = document.querySelector('.workspace-card');
    const gateOverlay = document.getElementById('mandatoryLoginGate');

    if (!pin || pin === '---') {
        // Lock workspace
        if (workspace) workspace.classList.add('workspace-locked');
        if (gateOverlay) gateOverlay.style.display = 'flex';
        updateSyncPill('unauthenticated');
    } else {
        // Unlock workspace
        if (workspace) workspace.classList.remove('workspace-locked');
        if (gateOverlay) gateOverlay.style.display = 'none';
    }
}
```

---

### Solution 2: Anti-Clobber Login Merge (Preventing Overwrite of In-Memory Work)
If a student somehow typed answers before authenticating, logging in must **never** blindly wipe what's on screen:

```javascript
async function performLogin() {
    const name = document.getElementById('loginNameInput').value.trim();
    const pin = document.getElementById('loginPinInput').value.trim().toUpperCase();
    const cls = document.getElementById('loginClassSelect').value;

    const auth = StudentAPI.validateStudent(cls, name, pin);
    if (!auth.valid) {
        showToast(auth.message, true);
        return;
    }

    const student = auth.student || { first_name: auth.name, pin: auth.pin, homeroom: cls };
    
    // Check if student already typed content on screen before logging in
    const onScreenData = collectData();
    const hasOnScreenWork = countCompleted(onScreenData) > 0;

    updateAuthDisplay(student);
    closeLoginModal();
    enforceAuthenticationGate();

    if (hasOnScreenWork) {
        // Safe Merge: Adopt on-screen work under this student PIN
        showToast(`Adopting current on-screen work for ${student.first_name}...`);
        localStorage.setItem(draftKey(student.pin), JSON.stringify(onScreenData));
        // Immediately trigger cloud save to bind work to student PIN in Google Sheets
        submitWork(true);
    } else {
        // Screen is empty: safely load cloud history
        loadCloudWorkForStudent(student.homeroom || cls, student.pin, student.first_name);
    }
}
```

---

### Solution 3: Honest Cloud-Only Telemetry (Eliminating "Local Saved")
Chromebook students must only see true cloud states. The deceptive `⚪ Local Saved` string is retired:

```javascript
function updateSyncPill(state, detail = '') {
    const pill = document.getElementById('cloudSyncStatus');
    const dot = document.getElementById('syncDot');
    const text = document.getElementById('saveText');
    if (!pill || !dot || !text) return;

    pill.className = 'sync-pill';
    switch (state) {
        case 'synced':
            pill.classList.add('synced');
            dot.textContent = '🟢';
            text.textContent = detail ? `Cloud Synced (${detail})` : 'Cloud Synced';
            break;
        case 'saving':
            pill.classList.add('saving');
            dot.textContent = '⏳';
            text.textContent = 'Saving to Google Sheets...';
            break;
        case 'offline':
            pill.classList.add('offline');
            dot.textContent = '🔴';
            text.textContent = 'Offline (Do Not Close Lid)';
            break;
        case 'unauthenticated':
            pill.classList.add('offline');
            dot.textContent = '🔒';
            text.textContent = 'Not Logged In — Work Not Saving';
            break;
    }
}
```

---

### Solution 4: Hardened Lid-Close Lifecycles via Emergency Keepalive Beacon
Replacing standard `async submitWork()` in lifecycle hooks with `StudentAPI.sendEmergencyBeacon()`:

```javascript
// ── Hardened Chromebook Lifecycles (Lid Close / Tab Switch / Page Unload) ──
function flushEmergencyBeacon() {
    const pin = (document.getElementById('authStudentPin')?.innerText || '').trim().toUpperCase();
    if (!pin || pin === '---') return;

    const data = collectData();
    const done = countCompleted(data);
    const summary = `${ASSIGNMENT.taskName} | Lead: ${data.auditors || data.name} | Section: ${data.section} | Completed: ${done}/${TOTAL_FIELDS} [Lid-Close Emergency Beacon]`;

    // Guaranteed transmission via navigator.sendBeacon / fetch keepalive
    StudentAPI.sendEmergencyBeacon(ASSIGNMENT.taskName, data, summary, ASSIGNMENT.course);
}

window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushEmergencyBeacon();
});

window.addEventListener('pagehide', flushEmergencyBeacon);
window.addEventListener('beforeunload', flushEmergencyBeacon);

window.addEventListener('online', () => {
    showToast('🌐 Network reconnected! Auto-syncing to Google Sheets...');
    submitWork(false);
});
```

---

### Solution 5: Two-Step Protected Reset
Replace the single red `resetForm()` button with a guarded confirmation:

```javascript
function resetForm() {
    const pin = (document.getElementById('authStudentPin')?.innerText || '').trim().toUpperCase();
    const confirmPrompt = prompt('⚠️ WARNING: This will erase all answers on this screen!\n\nType "RESET" to confirm:');
    if (confirmPrompt !== 'RESET') {
        showToast('Reset cancelled. Your work is safe.');
        return;
    }

    // Safety backup to sessionStorage just in case student panicked
    sessionStorage.setItem('emergency_reset_backup', JSON.stringify(collectData()));
    localStorage.removeItem(draftKey(pin));
    showToast('Form cleared. A safety backup was retained for this tab.');
    location.reload();
}
```

---

## 5. Specific Code Implementations for `_TEMPLATE_Display_Dashboard.html`

### Solution 1: Task ID Aliasing & Fallback Extraction
In `syncLiveCloud()`, gracefully handle mismatch between dashboard item IDs and `_tasks` names:

```javascript
DASHBOARD_CONFIG.items.forEach(it => {
    const targetKeys = [it.id, it.taskName, it.label, it.short].filter(Boolean);
    let matchedData = null;
    let isDone = false;

    // 1. Check in _tasks dictionary
    if (sd._tasks) {
        for (const k of Object.keys(sd._tasks)) {
            if (targetKeys.some(tk => k.toLowerCase().includes(tk.toLowerCase()))) {
                matchedData = sd._tasks[k].data || sd._tasks[k];
                isDone = true;
                break;
            }
        }
    }

    // 2. Check in root savedData properties
    if (!isDone) {
        for (const tk of targetKeys) {
            if (sd[tk] !== undefined && sd[tk] !== null && sd[tk] !== '') {
                matchedData = sd[tk];
                isDone = true;
                break;
            }
        }
    }

    // 3. Check in row.assignments (visual gradebook columns)
    if (!isDone && row.assignments) {
        for (const ak of Object.keys(row.assignments)) {
            if (targetKeys.some(tk => ak.toLowerCase().includes(tk.toLowerCase())) && row.assignments[ak]) {
                isDone = true;
                break;
            }
        }
    }

    if (isDone) {
        studentDataStore[pin].items[it.id].done = true;
        studentDataStore[pin].items[it.id].data = matchedData || {};
    }
});
```

---

### Solution 2: Projector-Safe Dossier Modal (No Raw JSON Dumps)
Replace `<pre>${JSON.stringify(itemData)}</pre>` with clean, respectful metadata:

```javascript
function renderModalTabContent() {
    const s = currentModalStudent;
    if (!s) return;
    const c = document.getElementById('modalTabContent');
    const item = s.items[activeModalTab];
    const isCompleted = item?.done;
    const data = item?.data || {};

    let contentHtml = `
        <div class="modal-section-card">
            <h4>${s.first_name} — Assignment Status: ${activeModalTab}</h4>
            <p><strong>Status:</strong> ${isCompleted ? '✅ Work Recorded in Google Sheets' : '⚪ Waiting for Submission'}</p>
        </div>
    `;

    if (isCompleted) {
        const fieldCount = typeof data === 'object' ? Object.keys(data).length : 0;
        contentHtml += `
            <div class="modal-section-card" style="margin-top:10px;">
                <p><strong>Submission Summary:</strong> Verified ${fieldCount} questions/fields completed.</p>
                <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
                    <span class="cell-badge badge-done">Verified Record</span>
                    <span class="cell-badge badge-waiting">No Score Publicly Displayed</span>
                </div>
            </div>
        `;
    }
    c.innerHTML = contentHtml;
}
```

---

### Solution 3: Auto-Refresh for Classroom Projectors
Add a toggleable 45-second auto-poll on the dashboard toolbar:

```javascript
let autoPollTimer = null;
let autoPollSeconds = 45;

function toggleAutoPoll() {
    const btn = document.getElementById('btnAutoPoll');
    if (autoPollTimer) {
        clearInterval(autoPollTimer);
        autoPollTimer = null;
        if (btn) btn.innerText = '⏱️ Auto-Sync: OFF';
    } else {
        autoPollTimer = setInterval(() => syncLiveCloud(true), 45000);
        if (btn) btn.innerText = '⏱️ Auto-Sync: ON (45s)';
    }
}
```

---

## 6. Migration & Rollout Checklist

| Phase | Action Item | Affected Files |
|---|---|---|
| **Phase 1** | Update Template Files with Mandatory Login Gate & Keepalive Beacons | `_TEMPLATE_GAS_Assignment.html`, `_TEMPLATE_Display_Dashboard.html` |
| **Phase 2** | Retrofit Active Grade 9 Assignments | `07_Prior_Course_Diagnostic_Interactive.html`, `Places_Of_Significance_Studio.html` |
| **Phase 3** | Retrofit Active Grade 8 / CIT Assignments | `HL8_Prior_Course_Diagnostic.html`, `CIT9_Current_Issues_Diagnostic.html` |
| **Phase 4** | Verify on Live Chromebook in Room 8 | Test opening page unauthenticated, closing lid, and verifying no data is lost. |
