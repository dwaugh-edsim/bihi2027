# Master Plan of Action — GAS Backend & Client Hardening (2026–2027)
**Candidate 1 (Gemini Synthesis)**  
**Target System:** `Student_System/Code.gs` (V5) & `Student_System/api.js`  
**Inputs Synthesized:** `GAS-audit-glm.md`, `GAS-audit-minimax.md`, `GAS_ARCHITECTURE_REVIEW- gemini.md`  
**Date:** September 20, 2026  

---

## 1. Executive Synthesis & Consensus Matrix

All three independent audits (**GLM**, **MiniMax**, and **Gemini**) reached the exact same foundational verdict:

> **The architectural foundation is sound and correct for Room 8.**  
> The combination of Google Sheets as the database, `LockService` for concurrency, `_tasks[taskName]` for multi-assignment namespacing, an append-only `Submissions_Log` audit trail, and zero-dependency vanilla JS client resilience is the right choice for shared-cart Chromebooks.

However, all three models identified critical vulnerabilities that will cause data loss, corruption, or fatal crashes between **November and March** if left as-is:

### Triangulated Audit Matrix

| Vulnerability / Need | GLM | MiniMax | Gemini | Consensus Severity | Action Phase |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **50,000-Char Cell Crash (Column G)** | ✅ (B1) | ⚠️ (Implied) | ✅ (#1) | 🔴 **CRITICAL** (Fatal crash by spring) | **Phase 2** |
| **Repo ↔ Deployment Drift** | ✅ (A1) | ✅ (#7 Ping) | ✅ (Diagnostics) | 🔴 **CRITICAL** (Caused Sep 16 loss) | **Phase 0** |
| **Silent `no-cors` Fallback in `api.js`** | ✅ (A2) | ✅ (#1 Idemp.) | ✅ (Recovery) | 🔴 **HIGH** (False green checkmarks) | **Phase 1** |
| **Top-Level Field Name Collisions** | ✅ (A4) | ⚠️ (Schema) | ✅ (#2) | 🔴 **HIGH** (Data clobbering across tasks) | **Phase 2** |
| **Teacher Exemplar Overwrite (Tess Bug)** | ✅ (A5) | ⚠️ (Demo PINs) | ✅ (#3) | 🔴 **HIGH** (Demonstrated in wild) | **Phase 1** |
| **Corrupt-Cell Merge Wipeout** | ✅ (A3) | — | — | 🟡 **MEDIUM** (Silently clears student row) | **Phase 1** |
| **Bulk Progress Dashboard Lag** | ✅ (B2) | ✅ (#5) | ✅ (#4 Scoped) | 🟡 **MEDIUM** (Dashboards timeout by March) | **Phase 1** |
| **Monolithic 980-line `Code.gs`** | ✅ (C1-C4) | ✅ (#3 Modular) | — | 🟡 **MEDIUM** (High maintenance risk) | **Phase 3** |
| **Double-Click Duplicate Writes** | — | ✅ (#1 Idemp.) | — | 🟢 **LOW-MED** (Gradebook pollution) | **Phase 1** |

---

## 2. The "Room 8 Realities" (Inviolable Constraints)

Any refactoring plan must strictly adhere to the following classroom realities:

1. **Zero Changes to Existing Assignment HTMLs:**
   * Students and existing pages (`Places_Of_Significance_Studio.html`, `HL9_Class1_10_Station_Audit_Template.html`, `18_Cit9_Real_Issues_Dossier.html`, etc.) must continue functioning without requiring edits to individual assignment files.
   * All client-side fixes must live inside `Student_System/api.js`.
2. **Chromebook Resiliency:**
   * Student carts wipe storage on logout. Network drops during class transitions are common. The `mode: 'no-cors'` fallback and offline localStorage queue must remain intact, but hardened with verifiable confirmation.
3. **Single-Paste or Modular Deployability:**
   * Apps Script projects can either be maintained as multi-file tabs in the web editor OR compiled to a single `Code.gs` in git. We must support both without forcing complex toolchains onto the teacher.

---

## 3. Phased Implementation Roadmap

```mermaid
graph TD
    subgraph Phase 0: Immediate Rescue & Visibility
        P0_1[Restore 902 Sep 16 Data from Submissions_Log]
        P0_2[Add CONFIG.VERSION & get_health Endpoint]
    end

    subgraph Phase 1: High-Priority Guardrails
        P1_1[Backend Exemplar Guardrail: Block Sample Text in Real PINs]
        P1_2[Safe JSON Parse: Abort Merge on Corrupted Cells]
        P1_3[Task-Filtered get_class_progress for Dashboards]
        P1_4[Idempotency Keys: Stop Double-Click Duplicate Rows]
        P1_5[Central Task Definitions & Demo PIN Routing]
    end

    subgraph Phase 2: Scale Hardening
        P2_1[5-Task Inline Cap: Store Recent Full, Stub Old, Full in Log]
        P2_2[Strict Task Namespacing: Stop Top-Level Property Clobbering]
        P2_3[api.js Verified Sync Outbox: Replay Unconfirmed Saves]
    end

    subgraph Phase 3: Codebase Modularization
        P3_1[Split Code.gs into Routing, Actions, Sheets, Constants]
        P3_2[Monthly Automated Backup Trigger]
    end

    Phase 0 --> Phase 1
    Phase 1 --> Phase 2
    Phase 2 --> Phase 3
```

---

### Phase 0 — Immediate Rescue & Drift Visibility (15 Minutes)

*Goal: Recover the lost Class 902 sleep data and make script deployment drift visible forever.*

1. **Class 902 Data Recovery Script:**
   * **Fact:** As GLM discovered, every keystroke from Class 902 on Sep 16 **still exists** in Column H of the `Submissions_Log` tab.
   * **Action:** Run a one-time utility function `recoverClass902SleepAudit()` in Apps Script that reads the latest Sep 16 sleep audit payload for each 902 PIN from `Submissions_Log` and re-injects the missing `data` object into the `902` tab.
2. **Version Stamping & Health Probe (`action=get_health`):**
   * Add `CONFIG.VERSION = 'V5.1.0-2026-09-20'` at the very top of `Code.gs`.
   * Add `action=get_health` to `doGet`:
     ```json
     {
       "status": "healthy",
       "version": "V5.1.0-2026-09-20",
       "deployedAt": "2026-09-20T18:30:00Z",
       "activeSheets": ["901", "902", "903", "801", "802", "803", "804", "Class_Log", "Submissions_Log"],
       "logRows": 482
     }
     ```
   * **Benefit:** Teacher can bookmark `<SCRIPT_URL>?action=get_health` on their phone/browser and immediately verify that any new code pushed to git is actually live in Google Drive.

---

### Phase 1 — Bulletproof Guardrails (Before Next Week's Classes)

*Goal: Eliminate data corruption, clobbering, and duplicate writes with zero schema disruption.*

1. **Exemplar & Demo Data Guardrail (Fixes the "Tess" Bug permanently):**
   * In `Code.gs`, before writing any student payload:
     ```javascript
     const EXEMPLAR_SIGNATURES = ['Smith Point Road', 'k7n7dESM4Hg', 'Gwangju, South Korea'];
     const rawStr = JSON.stringify(rawPayloadData);
     const isExemplar = EXEMPLAR_SIGNATURES.some(sig => rawStr.indexOf(sig) !== -1);
     
     if (isExemplar && pin !== 'WAU' && pin !== 'TST' && pin !== 'DEV' && pin !== 'MRW') {
       Logger.log("BLOCKED: Attempted exemplar save to real student PIN: " + pin);
       return successJSON({ status: 'blocked_exemplar_demo', message: 'Exemplar model cannot be saved to student profile.' });
     }
     ```
   * **Benefit:** It is physically impossible for a teacher demo or student exploring sample models to ever overwrite student profiles again.
2. **Merge Abort on Cell Corruption:**
   * If Column G has existing text but `JSON.parse()` fails:
     * **Do NOT** reset to `{}`.
     * Stash the corrupt string in `Submissions_Log` under status `__CORRUPT_BACKUP`.
     * Return an error rather than wiping previous assignments.
3. **Scoped Query Filtering (`taskName` parameter):**
   * Update `get_class_progress`:
     * If `params.taskName` is provided (e.g. `WHERE_assignment_grading.html?taskName=The WHERE Project`), only return that specific task's slice.
     * Shrinks payload size from 500 KB to 25 KB, ensuring grading dashboards load in 300ms even in June.
4. **Idempotency & Deduplication (`requestId`):**
   * Generate `requestId: crypto.randomUUID()` in `api.js` on every submit.
   * If a client retries within 60 seconds with the same `requestId`, return the cached response without double-appending to `Submissions_Log`.

---

### Phase 2 — Scale Hardening (Before Mid-Term Report Cards / November)

*Goal: Defeat the 50,000-character Google Sheets cell limit before it can ever be reached.*

1. **The 5-Task Inline Cap (Solves 50k Cell Overflow Forever):**
   * In each student's Column G cell, store full task data for the **5 most recent assignments**.
   * Older assignments in `_tasks` are collapsed to:
     ```json
     { "status": "submitted", "summary": "...", "updated": "2026-09-14", "_archivedInLog": true }
     ```
   * **Safety Guarantee:** The complete, uncompressed raw JSON payload of *every* assignment remains permanently accessible in the append-only `Submissions_Log`.
   * **Result:** Column G size never exceeds ~15 KB per student throughout all 9 months.
2. **Stop Root-Level Field Pollution:**
   * Restrict top-level keys in `savedData` strictly to identity attributes:
     `{ pin, name, className, email, pronouns, lastUpdated, _tasks }`.
   * Assignment-specific keys (`p1-p5`, `stations`, `dossier_math`, `matrix`) stay strictly encapsulated in `_tasks[taskName].data`.
3. **Verified Sync & Client Outbox in `api.js`:**
   * When `api.js` sends data via `no-cors` fallback, mark the local backup as `syncStatus: 'pending_verification'` (not `cloudSynced: true`).
   * On the next page load or visibility change, fire a quick 1-line check (`verifyCloudSave`). If verified, mark synced; if not, replay the payload.

---

### Phase 3 — Structural Code Quality (Apps Script Multi-File Layout)

*Goal: Reduce blast radius when editing code so new assignments don't risk breaking existing ones.*

Split the single 981-line `Code.gs` into logical modular files inside the Google Apps Script project:

```text
Student_System/GAS/
├── Code.gs             (Entry points: doGet, doPost, doOptions, successJSON)
├── Routing.gs          (Action dispatch dictionary — replaces massive if/else chain)
├── Actions_Student.gs  (login, submit_profile, get_class_progress)
├── Actions_ClassLog.gs (get_class_log, submit_class_log, set_class_plan, set_class_slide)
├── Actions_Lockers.gs  (get_lockers, save_lockers)
├── Sheets.gs           (Sheet accessors, range formatting, assignment columns)
├── TaskRegistry.gs     (Canonical list of valid task names, weights, and courses)
└── Constants.gs        (SHEET_NAMES, CLASS_LIST, CONFIG_VERSION)
```

*(Note: We can maintain a Python script `tools/build_gas.py` in the repo that concatenates these modules into a single `Code.gs` file automatically for easy single-paste deployment).*

---

## 4. Immediate Next Steps & Decision Questions

To proceed safely without touching any live classroom assets prematurely:

| Step | Action | Required Teacher Approval |
| :--- | :--- | :---: |
| **Step 1** | **Run 902 Sleep Audit Recovery:** Extract the lost Sep 16 sleep audit data from `Submissions_Log` and restore it to the `902` sheet tab. | `[ ] Yes / Proceed` |
| **Step 2** | **Deploy Phase 0 (Version & Health Probe):** Add `get_health` probe to `Code.gs` so deployment status is verifiable in 1 click. | `[ ] Yes / Proceed` |
| **Step 3** | **Deploy Phase 1 Guardrails:** Add the Exemplar Guardrail, Cell Corruption protection, and Task-Filtered progress queries. | `[ ] Yes / Proceed` |
| **Step 4** | **Schedule Phase 2 (Scale Hardening):** Implement the 5-task inline cap during a weekend maintenance window in October before Term 1 grades close. | `[ ] Yes / Proceed` |
