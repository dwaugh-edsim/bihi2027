# Room 8 Assignment & Backend Architecture Fixes (Sept 21, 2026)
**Target Audience:** Any LLM agent or developer maintaining the Bicentennial Junior High School (Mr. Waugh / Room 8) student assignments and Google Apps Script ledger.

---

## 1. Executive Summary & Context

This document captures the root causes, architectural fixes, and exact drop-in code patches established on September 21, 2026 across the **Room 8 Student Webhook System** and its standalone HTML assignment suite.

### Key Constraints & Realities:
1. **School Chromebooks Have NO Persistent Local Storage:**
   HRCE school-managed Chromebooks run under student accounts with ephemeral storage policies (local storage and cookies are wiped on logout or reboot). **Work saved to `localStorage` only is effectively lost once the lid closes.** Every assignment MUST enforce mandatory authentication so all keystrokes save directly to the Google Sheet backend.
2. **Zero-Dependency Architecture:**
   All student assignment files are standalone single-file HTML/JS pages hosted on GitHub Pages (`bihi2027` repo). There is no npm build step. All logic relies on `Student_System/api.js` and `Student_System/students_roster_data.js`.
3. **Multi-Assignment Isolation in Google Sheets:**
   The Google Apps Script backend (`Student_System/Code.gs`) stores student data in class tabs (`901`, `902`, `903`, `801`, etc.) with JSON payloads stored in Column 7. Each assignment is isolated under `_tasks[taskName].data` so different assignments never overwrite each other.

---

## 2. Google Apps Script Backend Fix (`Student_System/Code.gs`)

### The Bug: Class-Wide Sync Crash (`targetSheet is not defined`)
- **Symptom:** When any student on the roster saved their profile or submitted work, the server logged the entry in `Submissions_Log` but then crashed with:
  `ReferenceError: targetSheet is not defined at submit_profile (Code:897)`
  This sent an error response back to the Chromebook, turning the sync pill red (`🔴 Offline — Work saved on device ONLY. DO NOT close lid!`).
- **Location:** `submit_profile` function, line ~897.
- **The Fix:**
  ```javascript
  // BEFORE (BUG):
  targetSheet.getRange(rowIndex, 1, 1, Math.max(targetSheet.getLastColumn(), 9)).setValues([studentRow]);

  // AFTER (FIXED):
  sheet.getRange(rowIndex, 1, 1, Math.max(sheet.getLastColumn(), 9)).setValues([studentRow]);
  ```
- **Deployment Requirement:**
  After updating `Code.gs`, you must bump `CONFIG_VERSION` (e.g. `V6.1.1-2026-09-21`) and redeploy via:
  **Deploy** $\rightarrow$ **Manage Deployments** $\rightarrow$ **Edit (pencil icon)** $\rightarrow$ **Version: New version** $\rightarrow$ **Deploy**.
  Verify health via plain GET:
  `curl -sL "<SCRIPT_URL>?action=get_health"`

---

## 3. Client-Side Assignment Suite Fixes

Any assignment page based on `_TEMPLATE_GAS_Assignment.html` or built standalone (e.g., `HealthyLiving9/24_HL9_Class2_Operation_Addictive_By_Design.html`, `HealthyLiving9/HL9_Class1_10_Station_Audit_Template.html`, `HealthyLiving8/HL8_5_Dimensions_System_Audit_Interactive.html`, etc.) must apply the following 5 critical patterns.

---

### Fix 1: Mandatory PIN Gate (Prevent Anonymous Typing Void)

**Problem:** If students can type into input fields before authenticating, their keystrokes only land in unauthenticated `localStorage`. Because Chromebooks wipe local storage on logout, if the student closes the laptop without logging in with their PIN, **their work vanishes permanently.**

**Pattern to replicate:**
1. Wrap the entire form or input cards inside a `<fieldset id="workFieldset" disabled>`:
   ```html
   <!-- Gate Banner placed directly above form -->
   <div id="loginGateBanner" class="login-gate-banner" style="background:#fef2f2; border:2px solid #b91c1c; border-radius:8px; padding:16px 20px; margin-bottom:20px; text-align:center;">
       <h3 style="color:#991b1b; margin-bottom:6px; font-size:1.1rem; font-weight:800;">🔒 Sign-In Required to Save</h3>
       <p style="color:#7f1d1d; font-size:0.9rem; margin-bottom:12px;">You must sign in with your Name and 3-Letter Student PIN before typing. Unsigned work cannot be saved to the cloud.</p>
       <button type="button" class="btn-primary" onclick="openLoginModal()" style="font-size:1rem; padding:10px 22px;">👉 Click Here to Sign In</button>
   </div>

   <fieldset id="workFieldset" disabled style="border:none; padding:0; margin:0;">
       <form id="assignmentForm">
           <!-- assignment content / cards -->
       </form>
   </fieldset>
   ```

2. In `setAuthState(student)`:
   ```javascript
   function setAuthState(student) {
       currentUser = student;
       const fieldset = document.getElementById('workFieldset');
       if (fieldset) fieldset.disabled = !student;

       const gateBanner = document.getElementById('loginGateBanner');
       if (gateBanner) gateBanner.style.display = student ? 'none' : 'block';
       ...
   }
   ```

---

### Fix 2: Conflict Resolution Rule — Real Work ALWAYS Trumps Empty Placeholders

**Problem:**
Previously, the code compared timestamps (`localAt > cloudAt + 30000`). If a student had real work saved locally from last week, but opened the page today and an empty autosave fired, `cloudAt` became newer than `localAt`. The old logic executed:
`// Cloud newer: server wins -> restoreFormData(targetData);`
This **overwrote completed local student work with a 0-answer blank cloud form!**

**Drop-in Replacement for `loadCloudWorkForStudent`:**
```javascript
if (targetData && (targetData.answers || targetData.auditors)) {
    const cloudCount = countCompleted(targetData);
    const localCount = countCompleted(localObj);
    const cloudAt = Date.parse(tObj && tObj.updated) || 0;
    const localAt = draftSavedAt(localObj);

    // RULE 1: Real work ALWAYS trumps empty placeholders!
    // If local has answers but cloud is empty/blank (e.g. from an empty initial autosave today), local wins!
    if (localObj && localCount > 0 && cloudCount === 0) {
        restoreFormData(localObj);
        if (key) {
            localStorage.setItem(key, JSON.stringify({ ...localObj, savedAt: new Date().toISOString() }));
        }
        showToast(`Restored your saved work from this device, ${name}!`);
        updateSyncPill('synced', 'Device draft saved');
        submitWork(false); // Push real work to cloud immediately
        return;
    }

    // RULE 2: Local has more completed answers and is newer
    if (localObj && localAt > cloudAt + 30000 && localCount > cloudCount) {
        restoreFormData(localObj);
        showToast('Restored newer draft saved on this device.');
        updateSyncPill('synced', 'Local newer');
        submitWork(false);
        return;
    }

    // RULE 3: Cloud has equal or more work (or is valid)
    if (cloudCount >= localCount || cloudCount > 0) {
        restoreFormData(targetData);
        if (key) {
            localStorage.setItem(key, JSON.stringify({ ...targetData, savedAt: new Date().toISOString() }));
        }
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        updateSyncPill('synced', timeStr);
        showToast(`Restored your cloud work, ${name}!`);
        return;
    }
}
```

---

### Fix 3: Smart Local Draft Scanner (Legacy / Anonymous Draft Adoption)

**Problem:** If a student typed before logging in, or if an assignment was started prior to the mandatory PIN gate, the browser stored it under `gas_draft_${SLUG}_draft` or an unauthenticated key.

**Implementation in `loadCloudWorkForStudent`:**
```javascript
const key = draftKey(pin);

// SMART LOCAL DRAFT RECOVERY:
// Check student PIN draft, anonymous legacy draft, and any local key matching this assignment
const candidateKeys = [key, `gas_draft_${SLUG}_draft`];
for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(`gas_draft_${SLUG}_`) && !candidateKeys.includes(k)) {
        candidateKeys.push(k);
    }
}

let localObj = null;
let bestLocalCount = -1;

candidateKeys.forEach(k => {
    if (!k) return;
    try {
        const raw = localStorage.getItem(k);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const cnt = countCompleted(parsed);
        if (cnt > bestLocalCount) {
            bestLocalCount = cnt;
            localObj = parsed;
        }
    } catch (e) { }
});

if (localObj && bestLocalCount > 0) {
    restoreFormData(localObj);
}
```

---

### Fix 4: Dropdown Dash / Character Encoding Normalization

**Problem:** Dropdown option values containing en-dashes (`–`, `\u2013`), em-dashes (`—`, `\u2014`), or non-breaking spaces often fail strict equality (`el.value = v`) when restored from Google Sheets JSON payloads. As a result, dropdowns reset to blank.

**Implementation in `restoreFormData`:**
```javascript
const norm = s => String(s || '').replace(/[\u2013\u2014\ufffd\-]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();

// Inside restore loop:
if (el.tagName === 'SELECT') {
    el.value = v;
    if (el.value !== v && v) {
        const vNorm = norm(v);
        for (const opt of el.options) {
            if (norm(opt.value) === vNorm || (vNorm.length > 5 && norm(opt.value).startsWith(vNorm.slice(0, 15)))) {
                el.value = opt.value;
                break;
            }
        }
    }
} else {
    el.value = v;
}
```

---

### Fix 5: Cloud Hiccup Guard Against Blank Overwrites

**Problem:** If the Google Apps Script endpoint is temporarily throttled or unreachable on initial load, a student's screen might load empty. If autosave triggers on an empty form, it pushes a blank payload to the cloud and overwrites valid history.

**Implementation:**
1. Track `let cloudFetchFailed = false;` in page scope.
2. In `loadCloudWorkForStudent`:
   ```javascript
   if (!res || res.status === 'offline' || res.error || !res.savedData) {
       cloudFetchFailed = true;
       updateSyncPill('error', 'Cloud busy / offline');
       showToast(`⚠️ Cloud busy or network hiccup for ${name}. Click "Switch Student / Login" to retry.`, true);
       return;
   }
   ```
3. In `submitWork(isManualClick = false)`:
   ```javascript
   // Guard against blank overwrite if cloud fetch failed
   if (!isManualClick && cloudFetchFailed && done === 0) {
       console.warn('[submitWork] Autosave skipped: cloud fetch failed previously and form is blank.');
       return;
   }
   ```

---

## 4. Checklist for Applying Fixes to Other Assignments

When migrating an assignment to this resilient standard, verify each of the following:

- [ ] **1. Mandatory Login Gate:** Form has `<fieldset id="workFieldset" disabled>` and `#loginGateBanner`. Typing is impossible before PIN verification.
- [ ] **2. Roster Cross-Class Resolution:** Uses `StudentAPI.validateStudent(cls, name, pin)` which automatically falls back across all homerooms if a student selected the wrong class dropdown.
- [ ] **3. Smart Draft Scanner:** Scans candidate keys in `localStorage` including `gas_draft_${SLUG}_draft`.
- [ ] **4. Real Work Trumps Blank Cloud:** `localCount > 0 && cloudCount === 0` restores local and syncs to cloud immediately.
- [ ] **5. Cloud Hiccup Guard:** `cloudFetchFailed && done === 0` aborts autosaves to protect the student's cloud ledger.
- [ ] **6. Dropdown Tolerant Matching:** `norm()` replaces en-dashes/em-dashes so restored select menus don't wipe.
- [ ] **7. Verified Against GAS V6.1.1:** Tested save results in `{"status": "submitted_successfully"}` with green pill.
