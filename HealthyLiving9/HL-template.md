# Room 8 Sleep Clinic: 10-Station Audit Template — Functional Completion Plan

**Target File:** [`HL9_Class1_10_Station_Audit_Template.html`](file:///F:/Antigravity/simroom/Github%20Repos/bihi2027/HealthyLiving9/HL9_Class1_10_Station_Audit_Template.html)  
**Target Unit:** Healthy Living 9 &bull; Class 1 Outcome 1 Summative Performance Task  
**Author / Educator Context:** Mr. Dave Waugh &bull; Room 8 &bull; Bicentennial Junior High  

---

## 1. Executive Summary & Objective

The goal is to complete the end-to-end interactive and data-persistence functionality of the **10-Station Sleep Clinic Audit Template** so that students (in pairs or individually) can:
1. Authenticate or look up their official 3-letter PIN against the school roster (`students_roster_data.js`).
2. Input diagnostic telemetry for all 10 clinical subject files (Hours, Debt, Shift, Risk Level, Mechanism tags, Orders, Notes).
3. Automatically save locally to `localStorage` as they type, with recovery protection across Chromebook sessions.
4. Seamlessly dispatch and persist student submissions to Google Apps Script / Google Sheets (`StudentAPI.submitProfile` and `StudentAPI.login`).
5. Export data to JSON, copy clean Markdown for Google Docs reporting, and view verification certificates.

---

## 2. Issues Diagnosed in the Current File

During forensic inspection of [`HL9_Class1_10_Station_Audit_Template.html`](file:///F:/Antigravity/simroom/Github%20Repos/bihi2027/HealthyLiving9/HL9_Class1_10_Station_Audit_Template.html), we identified four concrete bugs causing browser failures / sync issues:

### 1. Duplicate Dependency Scripts (Double Loading & Execution Race)
* **Lines 1451–1452:** 
  ```html
  <script src="../Student_System/students_roster_data.js"></script>
  <script src="../Student_System/api.js"></script>
  ```
* **Lines 2113–2114:**
  ```html
  <script src="../Student_System/students_roster_data.js"></script>
  <script src="../Student_System/api.js"></script>
  ```
* **Impact:** `StudentAPI` and `Session` get re-instantiated and reset when the bottom script loads, wiping or overriding session state and bindings created in the first pass.

### 2. Missing `name` Property in `collectData()` Payload
* When `StudentAPI.submitProfile(taskName, profileData, summaryText, 'HL9')` executes, `api.js` expects:
  ```javascript
  const pin = (profileData.pin || Session.getPin() || '').trim().toUpperCase();
  const name = (profileData.name || Session.getName() || '').trim();
  ```
* Currently, `collectData()` stores `auditors: document.getElementById('metaAuditors').value`, but **omits `data.name`**. If `Session` is unprimed or reset by the duplicate script, `api.js` sends an empty name or fails validation (`❌ Access Denied` / mismatch).
* **Fix:** Ensure `data.name` is explicitly set to the authenticated student's first/full name or `metaAuditors`.

### 3. Un-debounced `handleInput()` / Missing Auto-Save Debounce
* `handleInput()` runs synchronously on every keystroke (`oninput="handleInput()"`).
* While local `localStorage` writes succeed, `autoSaveTimer` was defined (`let autoSaveTimer = null;`) but **never wired** to debounced cloud syncing.
* **Fix:** Add a 3–4 second debounce timer so students logged in with valid PINs have their progress periodically auto-saved to Google Sheets without hammering the GAS endpoint.

### 4. Cloud Data Payload Parsing in `loadCloudWorkForStudent()`
* Google Apps Script sometimes returns `res.savedData` as a JSON string rather than a parsed object, or wraps it as `{ data: "..." }` or `{ data: { stations: ... } }`.
* **Fix:** Robust multi-layer un-parsing (`JSON.parse` fallback) to guarantee student data restores reliably regardless of GAS response shape.

### 5. Script Placement Cleanup
* Move `<script src="../Student_System/students_roster_data.js"></script>` and `<script src="../Student_System/api.js"></script>` so they load cleanly before the main application logic, and remove redundant duplicate tags at the bottom.

---

## 3. What We Are Accomplishing (Action Item Checklist)

- [ ] **Clean Script Tag Structure:** Remove redundant bottom script imports; ensure `students_roster_data.js` and `api.js` load cleanly once before application scripts.
- [ ] **Fix Data Model & Payload:** Include `name`, `pin`, `className`, `section`, `partner`, `bidSubject`, `bidReason`, and `stations[1..10]` in `collectData()`.
- [ ] **Wire Debounced Cloud Autosave:** Trigger background cloud sync 4 seconds after the student stops typing, preventing data loss on sudden Chromebook lid closes.
- [ ] **Harden Cloud Recovery:** Support nested/stringified data schemas returned by the Google Apps Script Webhook.
- [ ] **Synchronize Identity:** Ensure `authStudentName`, `authStudentPin`, `authStudentClass`, and `metaAuditors` stay 100% in sync upon login or PIN claim.
- [ ] **Validate Export & Verification:** Verify JSON export, Google Docs Markdown clipboard generator, and the Official Cloud Verification Certificate Modal.

---

## 4. Status

* Plan documented here in `bihi2027/HealthyLiving9/HL-template.md`.
* Ready to execute cleanly on `HL9_Class1_10_Station_Audit_Template.html`.
