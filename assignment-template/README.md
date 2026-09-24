# Room 8 v2 Assignment Developer Guide & LLM Blueprint

> **Notice for AI Assistants & LLMs:**
> This document specifies the architectural rules, mechanics, and design standards required to build or modify interactive student assignments for Bicentennial Junior High (Room 8, Mr. Waugh).
> Follow these instructions strictly. Every pattern described here exists to eliminate recurring bugs in classroom Chromebook environments.

---

## 1. System Architecture & The Room 8 v2 Pipe

Every student assignment in Room 8 is a standalone zero-dependency web page served via **GitHub Pages**. It connects to Google Workspace infrastructure via the **Room 8 v2 Pipe** (`pipe.js` + `assignment_engine.js` + `backend.gs`).

```
┌─────────────────────────────────┐
│     Interactive Assignment      │
│  (GitHub Pages / Zero-Build)    │
└───────┬─────────────────▲───────┘
        │                 │
   pipe.autosave()   pipe.load()
   (HMAC Signed)     (HMAC Signed)
        │                 │
        ▼                 │
┌─────────────────────────────────┐
│    Room 8 v2 Unified Backend    │
│       (Google Apps Script)      │
└───────────────┬─────────────────┘
                ▼
┌─────────────────────────────────┐
│      Room 8 Master Sheet        │
│   (Students & Submissions_Log)  │
└─────────────────────────────────┘
```

### Core Authentication & Identity Mechanics
1. **Google SSO Only (Zero PINs):**
   - Students authenticate exclusively with their official `@gnspes.ca` Google account.
   - Never implement 3-letter PIN prompts, student ID prompts, or client passwords.
   - Authentication is initiated via `Room8.signIn()` and handled by an HMAC-signed token returned by the Identity provider.
2. **Server-Authoritative Roster Mapping:**
   - Once signed in, `pipe.js` calls `resolve_student`.
   - The backend looks up the student's email in the master `Roster` tab and resolves their legal name, homeroom, and course-specific section (e.g., `902-CIT`, `804-HE`).
3. **Off-Roster & Teacher Fallback:**
   - If a student is new or a teacher logs in with a test account, the engine reveals an interactive section dropdown (`#r8section`).
   - The chosen section is bundled directly into the cloud payload (`payload.section`) so it travels with the submission.

---

## 2. Hard Invariants & Classroom Rules

### 🚫 Rule 1: Say "Server", NEVER "GAS"
- In all student-facing UI (buttons, labels, badges, alerts, status toasts, tooltips), **always use the word "Server"**.
- Examples:
  - ✅ `"☁️ Server: Verified save"`
  - ✅ `"⚡ Verify Server Write"`
  - ✅ `"Reconnecting to Server..."`
  - ❌ `"GAS Autosaved"`
  - ❌ `"Google Apps Script connected"`

### 🚫 Rule 2: Course-Level Naming Only (Never Homeroom Numbers in Filenames)
- Assignments serve an entire course, **not** an individual homeroom class.
- **Never** put homeroom numbers in filenames, function names, IDs, or query parameters.
  - ✅ `HL8_5_Dimensions_System_Audit.html`
  - ✅ `HL8_5_Dimensions_System_Audit_Interactive.html`
  - ❌ `HL8_Class804_5_Dimensions_System_Audit.html`
  - ❌ `HL8_801_Audit.html`
- **Course to Section Mapping:**
  - **CIT9** serves: `901-CIT`, `902-CIT`, `903-CIT`
  - **HL9** serves: `901-HL`, `902-HL`, `903-HL`
  - **HL8** serves: `801-HE`, `802-HE`, `803-HE`, `804-HE`

### 🚫 Rule 3: Chromebook Reality — Zero Student `localStorage`
- **Chromebooks wipe local browser storage upon logout or device restart.**
- **Never rely on `localStorage` for student answers, progress, or state.**
- All persistent data must be saved to the server via `pipe.autosave()`.
- The engine uses `sessionStorage` strictly as a transient typing buffer for in-tab crash recovery (`r8_tab_draft_*`) between keystrokes and the 2.5-second debounced server autosave.

### 🚫 Rule 4: No Ad-Hoc Defunct API Fetches
- Never add manual `fetch()` calls to legacy Google Apps Script URLs (e.g. `action=get_class_progress&className=804`).
- Legacy script URLs cause CORS block errors and HTTP 404 errors in the console.
- All loading and saving is handled exclusively by `pipe.load(taskName)` and `pipe.autosave()` against the canonical `BACKEND_URL`.

### 🚫 Rule 5: Inline SVG Favicon (Prevent 404 Console Errors)
- Always include an inline SVG favicon in the `<head>`:
  ```html
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>">
  ```

---

## 3. Standard Endpoints & Dependencies

Every assignment page loads two scripts:
```html
<script src="../Student_System/Room8v2/pipe.js"></script>
<script src="../Student_System/Room8v2/assignment_engine.js"></script>
```
*(Or use `./pipe.js` and `./assignment_engine.js` if located in the same directory).*

### Canonical Script URLs
```javascript
const IDENTITY_URL = 'https://script.google.com/a/macros/gnspes.ca/s/AKfycbxzrLHgG2_vq8lh3VFB7SfPvbqXnn1atuz5S61oGlLul_l_jmlhrRc7Nwww__k9f5L0Rw/exec';
const BACKEND_URL  = 'https://script.google.com/macros/s/AKfycbz73P9FG2HLIJMl9NY9iex9y1TIm1E8cRglvgrsNVAtrrtUJGXgtP3hwKanl_aWJHuMcw/exec';

Room8.init({
  identityUrl: IDENTITY_URL,
  backendUrl:  BACKEND_URL
});
```

---

## 4. The `ASSIGNMENT` Configuration Schema

Assignments are declared declaratively via the `ASSIGNMENT` object passed to `R8Assignment.mount()`.

```javascript
const ASSIGNMENT = {
  taskName: 'HL8 5-Dimension Systems Audit',  // Must match the exact TASK_NAME in assignments_data.js
  course: 'HL8',                              // 'CIT9' | 'HL9' | 'HL8'
  title: 'The 5-Dimension Systems Audit & Domino Interception Lab',
  kicker: 'HL8 · UNIT 1 · SYSTEMS THINKING · GRADE 8',
  timeEstimate: '45 mins',                    // Optional label

  sections: [
    {
      num: 1,
      title: 'Baseline Diagnostic',
      hint: 'Complete each scale from 1 (severe friction) to 5 (optimal).',
      fields: [
        {
          id: 'radar_phys',
          type: 'select',
          label: 'Physical Baseline [PHYS]:',
          options: ['', '1 — Chronic sleep debt', '2 — Frequent exhaustion', '3 — Fair balance', '4 — Consistent sleep', '5 — Optimal athletic vitality']
        },
        {
          id: 'anchor_why',
          type: 'textarea',
          label: 'Explain why this dimension is your strongest anchor:',
          rows: 3,
          placeholder: 'Provide concrete evidence from your daily routine...'
        }
      ]
    },
    {
      num: 2,
      title: 'Interactive Forensic Matrix',
      fields: [
        // Static table pre-rendering pattern (see Section 5)
        { type: 'static', html: generateStationsTableHtml() }
      ]
    },
    {
      num: 3,
      title: 'Review & Sign Off',
      fields: [
        {
          id: 'docSignature',
          type: 'text',
          label: 'Student digital signature — type your full legal or preferred name:'
        }
      ]
    }
  ]
};
```

### Supported Field Types
| Type | Description | Key Configuration Properties |
| :--- | :--- | :--- |
| `'text'` | Single-line text input | `id`, `label`, `placeholder`, `hint` |
| `'textarea'` | Multi-line expandable text area | `id`, `label`, `rows`, `placeholder`, `hint` |
| `'select'` | Dropdown menu selection | `id`, `label`, `options` (Array of strings) |
| `'static'` | Pre-rendered HTML block (tables, diagrams, charts) | `html` (raw HTML string) |

### ⚠️ Critical Rule for Dropdown Menus (`'select'`)
**Placeholder options MUST have an empty string value (`value=""` or `''` in options array).**
```javascript
// ✅ CORRECT: Empty string ensures the field is NOT counted as answered when untouched
options: ['', 'Option A', 'Option B']
// Or in raw HTML:
'<option value="">— Select an Option —</option>'

// ❌ INCORRECT: Text value causes empty dropdowns to be counted as completed
options: ['— Select an Option —', 'Option A', 'Option B']
```
If an unselected dropdown lacks `value=""`, the completion counter will register it as answered!

---

## 5. Custom Tables & Forensic Matrices (Static Pre-Rendering Pattern)

Many assignments require dense tabular layouts (Numbeo comparison tables, multi-patient forensic case audits, strategy matrices).

### The Pattern:
1. **Pre-render the HTML table** in JavaScript before mounting the engine.
2. Embed the rendered string as a `{ type: 'static', html: generateTableHtml() }` field.
3. **NEVER** dynamically inject or append custom tables after mount; pre-rendering prevents DOM race conditions, visual glitches, and blank-table bugs.
4. Hook custom table inputs into the autosave pipeline using `custom.collect` and `custom.populate`.

### Implementation Example:
```javascript
function generateTableHtml() {
  let rows = '';
  PATIENTS.forEach(p => {
    rows += `
      <tr>
        <td><strong>${p.num}</strong></td>
        <td><strong>${p.name}</strong> <span class="patient-tag">${p.tag}</span></td>
        <td>
          <select id="s${p.num}_dim">
            <option value="">— Select Dimension —</option>
            <option value="[PHYS] Physical">[PHYS] Physical</option>
            <option value="[MENT] Mental">[MENT] Mental</option>
          </select>
        </td>
        <td>
          <input type="text" id="s${p.num}_d1" placeholder="Trigger habit...">
        </td>
        <td>
          <textarea id="s${p.num}_advice" placeholder="Circuit breaker advice..."></textarea>
        </td>
      </tr>`;
  });

  return `<div style="overflow-x:auto;"><table class="audit-matrix">...${rows}</table></div>`;
}

// Mounting with Custom Table Hooks:
const api = R8Assignment.mount({
  mount: document.getElementById('r8'),
  pipe: Room8,
  assignment: ASSIGNMENT,
  custom: {
    // Collect: Called by pipe before every autosave to gather table values
    collect: function (answers) {
      PATIENTS.forEach(p => {
        const dimEl = document.getElementById('s' + p.num + '_dim');
        const d1El  = document.getElementById('s' + p.num + '_d1');
        const advEl = document.getElementById('s' + p.num + '_advice');

        answers['s' + p.num + '_dim']    = dimEl ? dimEl.value : '';
        answers['s' + p.num + '_d1']     = d1El  ? d1El.value  : '';
        answers['s' + p.num + '_advice'] = advEl ? advEl.value : '';
      });
    },

    // Populate: Called by pipe when student data loads from server
    populate: function (data) {
      const answers = (data && data.answers) ? data.answers : (data || {});
      PATIENTS.forEach(p => {
        const dimEl = document.getElementById('s' + p.num + '_dim');
        const d1El  = document.getElementById('s' + p.num + '_d1');
        const advEl = document.getElementById('s' + p.num + '_advice');

        if (dimEl && answers['s' + p.num + '_dim'])    dimEl.value = answers['s' + p.num + '_dim'];
        if (d1El  && answers['s' + p.num + '_d1'])     d1El.value  = answers['s' + p.num + '_d1'];
        if (advEl && answers['s' + p.num + '_advice']) advEl.value = answers['s' + p.num + '_advice'];
      });
    }
  }
});
```

---

## 6. Interactive Calculators & Sentence Generation Pattern

When building math or comparison tools (such as cost-of-living differences between Halifax and other cities):

1. **Generate Full, Natural English Sentences:**
   - Compute the percentage difference and produce an explanatory sentence rather than raw numbers or truncated shorthand.
   - Example output:
     - ✅ `"Halifax price is 233% higher"`
     - ✅ `"Halifax price is 25% lower"`
     - ❌ `"+233%"`
     - ❌ `"-25% (Hali)"`
2. **Column Sizing:**
   - Allot at least `28%–32%` width to the calculated result column so sentences do not wrap into narrow, unreadable blocks.
3. **Dual Trigger (Auto + Manual Button):**
   - Recalculate live on `input` and `blur` events.
   - Also wire the manual `[Calc %]` button with tactile visual feedback:
     - On successful calculation: Flash the button text to `"✓ Done"` with a green background (`#15803d`) for 900ms.
     - On missing/invalid input: Flash the empty input with a 2px red border (`#ef4444`) to direct the student's attention.

---

## 7. Curriculum Alignment & Projector Integration

When creating a new assignment:

1. **Outcome Selection:**
   - Check `curriculum-planning-priv/2026-27outcomes.md` (in the private repo) for verbatim outcome codes and match tags (e.g. `HL8-OUT-01`, `CIT9-OUT-03`).
2. **Registry Entry:**
   - Add the assignment to `Student_System/assignments_data.js` so it automatically appears in the teacher's Class Startup projector slide picker:
   ```javascript
   {
     taskName: 'HL8 5-Dimension Systems Audit',
     label: '5-Dimension Systems Audit',
     course: 'HL8',
     ref: 'HL8-OUT-01',
     outcome: 'Analyze personal habits across the 5 dimensions of health and design circuit-breaker interventions.',
     active: true
   }
   ```

---

## 8. Pre-Flight Checklist for LLMs & Developers

Before committing any assignment:
- [ ] Filename contains **course only** (e.g. `HL8_...`), never a homeroom number (`Class804`).
- [ ] Title tag and heading reflect the course-wide scope.
- [ ] Inline SVG favicon is present in `<head>`.
- [ ] All student-facing buttons, badges, and alerts say **"Server"**, never "GAS".
- [ ] No defunct legacy `fetch()` calls to old Apps Script URLs exist in the code.
- [ ] Dropdown select placeholder options include `value=""`.
- [ ] Custom tables use the `{ type: 'static', html: ... }` pre-rendering pattern.
- [ ] Custom inputs are wired to `custom.collect` and `custom.populate`.
- [ ] All math tools output full, readable sentences and provide button feedback.
- [ ] File is committed and pushed to `origin/main` (GitHub Pages deploys automatically).
