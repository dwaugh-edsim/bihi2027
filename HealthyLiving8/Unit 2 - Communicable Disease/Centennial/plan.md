# Centennial Case 55 - SunriseWharf-style outbreak sim (build plan)

- **Status:** BUILT and headless-tested 2026-11-04 (`index.html`, `case55_data.js`, `dashboard.html`, 14 images). Not yet pushed; real student sign-in round-trip still to verify (see build log in section 8)
- **Date:** 2026-11-04
- **Course:** Healthy Living 8 (HL8), Unit 2: Communicable Disease - maps to **HL8 CO2 (Health Behaviours)**; confirm exact code in `../bihipri-27/curriculum-planning-priv/2026-27outcomes.md`
- **Deliverable location:** this folder (`HealthyLiving8/Unit 2 - Communicable Disease/Centennial/`)
- **Live URL once deployed:** `https://dwaugh-edsim.github.io/bihi2027/HealthyLiving8/Unit%202%20-%20Communicable%20Disease/Centennial/index.html`
- **Note on repo split:** you asked for this plan in the public repo, so it lives here. Keep it PII-free. The detailed build spec, ideal answers and rubric go in `../bihipri-27/...-priv/` (never here).

---

## 1. Goal and what "done" looks like

Turn the existing Case 55 lesson (deck + worksheet) into a **SunriseWharf-style "moving sidewalk" simulation**: a single-page HTML sim on GitHub Pages where a student signs in with their school Google account and is carried station-by-station through the Centennial Junior High outbreak. At each station the story drops new evidence plus the "toolkit" context they need, and the student makes and records a judgment. Everything they type or choose is autosaved to the server and fully restored the next time they log in, on any device.

Done = a student can open the link, click one sign-in button, get walked through the whole case, close the tab mid-sentence, come back days later on a different Chromebook, sign in again, and land exactly where they left off with every answer intact.

---

## 2. What we already have (inputs - do not rebuild)

| Input | Where | What we take from it |
|---|---|---|
| Case 55 story + toolkit content | `../HL8_Germs_C2_Outbreak_Deck.html` (12 slides), `../HL8_Germs_C2_Outbreak_Worksheet.html` (Parts A-D + bonus) | All narrative beats, clue boxes, suspect files, verdict, sources |
| **Sim images (generated)** | **`Centennial/assets/`** - 14 PNGs generated 2026-11-04 with the Qwen engine: 10 station scenes at 1920x1080 + 4 character portraits at 1328x1328 (see "Reproducing the images" in section 7). Older `../assets/*.jpg` remain as alternates | Station exhibits + dossier portraits, referenced locally as `assets/<name>.png` |
| "Moving sidewalk" UX pattern | `C:\Users\dwaugh\source\repos\projectimages\MM Studies\SunriseWharf\sunrise_wharf.html` + `simscript.md` | Layout: left nav-rail (briefing + chapters), center deck with tabbed evidence + big exhibit image, right "terminal" panel with the operational task, option buttons, rationale box, and a running history; per-chapter judgment state; a final retrospective revealed after commit |
| Google sign-in + persistence (deployed) | `Student_System/GoogleAuth/no_gcp/` (`identity.gs` R8-ID, `vault.gs` R8-VAULT, `assignment_pages.html` template, `README.md`) | Path B: page stays on Pages, popup identity handoff, server autosave/restore keyed by verified email + task. **Already deployed; RETURN_ALLOWLIST already covers `https://dwaugh-edsim.github.io`, so no `identity.gs` change is needed** |
| Repo conventions | `AGENTS.md` | Standalone zero-dependency HTML/JS, no build step; course-level naming only; "Server" not "GAS" in student-facing labels; zero student `localStorage`; no personal-reflection prompts; PII rules; adaptations consulted first |

Key upgrade over SunriseWharf: that old sim used `localStorage`, which Chromebooks wipe on close. This build uses the no-GCP Vault for all student state, so nothing durable lives on the device.

---

## 3. Concept: the moving sidewalk

- **Role:** the student is the public-health outbreak investigator assigned to Centennial Junior High (400 students). They are not a doctor; they are the detective who has to read the evidence and defend a Monday Morning Game Plan.
- **Metaphor:** a conveyor / case-file conveyor. A top progress track shows the stations and the Mon-Fri sick-count surge (3-7-18-34-55) filling in as they advance. A left nav-rail lists BRIEFING + STATION 01..08 with lock/check icons. Students can move forward and back freely (it is a sidewalk, not a one-way chute), but the final "Case Closed" station is locked until they commit their game plan.
- **Center deck:** each station shows a news-dispatch style story card (the unfolding beat), tabbed context (Dispatch / Evidence / Toolkit), and a large exhibit image with caption + click-to-zoom lightbox (the deck already has an `openZoom` pattern to reuse).
- **Right "Investigation Log" terminal:** the current operational task (prompt), the judgment controls (option buttons, sliders, or text areas), a Commit button where relevant, and a running history list of everything the student has entered so far (mirrors SunriseWharf's `updateHistory`). This panel is the visible proof that their work is being captured.
- **HUD chrome:** monospace labels - `CASE 55`, `CENTENNIAL JR HIGH`, `STATUS: ACTIVE`, `SYNC: SERVER`, `INVESTIGATOR: <verified email>`, `STATION n/8`. Dark slate + amber/coral biohazard accent, Inter + JetBrains Mono + Roboto Slab (fonts already used by the deck/worksheet). Screen-only artifact, so color is fine (the black-and-white rule is for printables only).

---

## 3A. Characters and story beats (dossier portraits)

Four fictional characters carry the story. Their portraits live in `assets/char_*.png` (1328x1328) and appear as "dossier cards" at the stations below; the same characters plus their quotes go into `case55_data.js`. Per the repo's generated-visuals rule, each portrait prompt names the character's background explicitly so the cast is not default-white; all are fictional, clearly illustrated, no real people.

| Character | Portrait | Role in the story | Appears at |
|---|---|---|---|
| **Vice-Principal Priya Raman** | `assets/char_vp_raman.png` | Centennial's incident lead and host of the sim: gives the briefing, walks the evidence board, demands the Monday plan, closes the case | S0, S1, S7, S8 |
| **Jayden** (Gr 8 West) | `assets/char_jayden.png` | Early case from the west wing; witness to the Wednesday fountain incident | S2, S6 |
| **Sophie** (Gr 7) | `assets/char_sophie.png` | Resin-duck trader; explains the hand-to-hand duck craze right before lunch | S2, S6 |
| **Marcus** (Gr 9) | `assets/char_marcus.png` | The classmate whose immune system is weakened by cancer treatment; the reason the Monday plan must protect him (handled sensitively, never graphic) | S4, S7 |

Mentioned in text only (no portrait needed): **Mr. Boudreau**, the custodian who mopped the fountain with plain soap (S6), and the **school nurse**, who delivers the toolkit science (S3, S4).

### Story beats (the quotes the sim shows; all fictional, no em/en dashes)

- **S0 Briefing - VP Raman:** "Friday, 3:15 PM. Fifty-five of our four hundred kids are home sick and the phones won't stop. I need a Monday-morning plan before doors open. You're the investigator - read the board, talk to my people, bring me something I can act on."
- **S1 Evidence board - VP Raman + nurse:** "Stomach, not lungs - under five percent have a cough. And it started in the Grade 8 west wing on Monday. Watch the map."
- **S2 Two clues - interviews:**
  - *Jayden:* "Wednesday I was at the west-wing fountain when a kid threw up right beside it. Mr. Boudreau mopped fast, but with just warm water and floor soap."
  - *Sophie:* "Everyone's been trading these little resin ducks at the lockers all week - right before we go in for lunch. I traded mine to three people on Thursday."
- **S3 Toolkit A - nurse:** "Germs can't soak through healthy skin, but hands are a delivery truck. Touch a shared keyboard, then your mouth - that's the trip."
- **S4 Toolkit B - nurse:** "Alcohol gel won't kill a stomach bug - soap and running water wash the tough shells down the drain. Antibiotics fight bacteria only, never viruses. And Marcus can't fight this alone - our habits are his shield."
- **S6 Solve the spread - re-interviews:** *Mr. Boudreau:* "I mopped with what we had - warm water and floor soap. I didn't know it needed bleach." Jayden and Sophie repeat their S2 statements.
- **S7 Monday plan - VP Raman:** "Give me three rules for Monday. What do people do, and why does it stop this thing?"
- **S8 Case closed - VP Raman:** "Case 55 is closed. Norovirus. Your plan matches the health unit's." + sources + Class 3 superbug teaser.

---

## 4. Station map (story beat -> context -> persisted response -> image)

All images referenced locally as `assets/<name>.png`; character dossier portraits (`assets/char_*.png`) appear at the stations listed in section 3A. "Persisted" = saved to the server in the state blob (section 6) and restored on login.

| # | Station | Story beat (source) | Context tabs | Persisted response field(s) | Image |
|---|---|---|---|---|---|
| 0 | Briefing - "Friday 3:15 PM" | Deck slide 1: 55 kids out, phones ringing, penicillin requests, one classmate in cancer treatment, principal needs a Monday plan | Dispatch (role + objective + workflow) | `started: true` | `assets/case55_cover.png` |
| 1 | The Evidence Board | Deck slide 2 + worksheet clue box: symptom profile (88% GI, <5% cough, 24-48h recovery), floor plan, hotspots (Gr8 West 18, Gr7 12, Gr9 8, cafeteria 9, lab 5) | Evidence (symptom log, hotspot trace) | Judgment: body system under attack (Respiratory / Gastrointestinal / Undecided) + 1-line why | `assets/s1_evidence_board.png` |
| 2 | Two Strange Clues | Deck slide 3: Wednesday fountain vomit mopped with plain soap; all-week resin-duck hand-to-hand trading before lunch | Evidence (clue #1, clue #2) | Judgment: rank the two clues (bigger spreader) + why; text field | `assets/s2_fountain_ducks.png` |
| 3 | Toolkit A - How germs get in | Deck slides 4-5 -> Worksheet Part A: 4 entry gates (mouth/nose/eyes/cuts), hands as double agents | Toolkit (4 gates, skin paradox) | Part A table: 4 situations -> entry gate + germ type (virus/bacteria); Q5 two-step hands explanation (text) | `assets/s3_entry_gates.png` |
| 4 | Toolkit B - Choosing weapons | Deck slides 6-8 -> Worksheet Part B: soap vs sanitizer (norovirus hard shell), vaccines vs antibiotics, community shield for the immunocompromised classmate | Toolkit (3 cards) | Part B compare table (4 rows x vaccine/antibiotic); Q6 two reasons soap beats sanitizer on stomach virus (text) | `assets/s4a_soap_sanitizer.png`, `assets/s4b_vaccine_shield.png` |
| 5 | Suspect Files (solo) | Deck slide 9: Influenza vs Norovirus file cards | Evidence (two suspect files side by side) | Part C #1: name the culprit virus + two data clues that prove it (text x2) | `assets/s5_suspects.png` |
| 6 | Solve the spread | Worksheet Part C #2 and #3 | Evidence (recap of clues) | C#2: how fountain spill + resin ducks spread it across grades (text); C#3a: why antibiotics won't cure it (text); C#3b: what classmates do to protect the student in cancer treatment (text) | `assets/s6_spread_map.png` |
| 7 | Monday Morning Game Plan | Worksheet Part D + deck slide 11 setup: 3 rules | Dispatch (principal's ask) | 3 rules, each with what-to-do + why-it-works (text x6); bonus: two-word nickname for the first case ("patient zero"); **Commit button sets `committed:true`** | `assets/s7_monday_plan.png` |
| 8 | Case Closed (locked until committed) | Deck slides 11-12: verdict reveal + sources + Class 3 superbug teaser (Fleming 1945 warning) | Debrief | Self-check: compare their game plan to the verdict; optional 1-line "what I'd change" (text) | `assets/s8_verdict.png` |

The verdict (Norovirus) is deliberately only readable at station 8, gated on the student's own commit flag.

---

## 5. Auth and sign-in (frictionless)

Reuse the deployed no-GCP Path B flow verbatim from `Student_System/GoogleAuth/no_gcp/assignment_pages.html`:

1. Page loads on Pages. If a `#r8id=` fragment or `sessionStorage.r8id` token exists, show the app; else show a single gate with one button: **"Sign in with your school account"**.
2. Button opens the Identity app in a popup (`IDENTITY_URL + '?return=' + location.origin`). Google confirms the account; the popup `postMessage`s `{email, ts, sig}` back and closes. The page never leaves `github.io`.
3. Token stored in `sessionStorage` only (never work). 4-hour signature window; on expiry the page offers one-click re-sign-in and then restores from the server.
4. Wrong (personal) Google account gets an in-app "Wrong account / Switch account" path (handled in `identity.gs`).
5. Known edge (from README): identity only works over HTTPS from the allowlisted origin; a local `file://` preview renders but cannot sign in. Test sign-in with one real student account before rollout.

No PIN, no name entry, nothing to type. The verified `@gnspes.ca` email is the identity and the storage key.

---

## 6. Persistence: everything writes, everything recalls (core spec)

This is the part that must be exactly right. The Vault (`vault.gs`) already supports it with **zero server changes**:

- `submit_assignment` appends one row per save to the `Submissions` tab (columns: Timestamp, Verified Email, Section, Task, Summary, Data JSON, requestId), with `requestId` dedupe and a script lock. Append-only means **every save is a retained version** - full history lives server-side.
- `load_assignment` returns the **most recent** row for `(verified email, task)`. That latest row is what recalls on login.
- `?action=verify&requestId=` confirms a no-cors fallback save landed.

So the design is: **serialize the entire sim state into the `data` blob on every change; rehydrate the whole thing on load.**

### 6.1 State shape (the single `data` object)

```js
{
  v: 1,
  section: '803-HE',
  station: 4,                    // current station index
  visited: { s0:1, s1:1, ... },
  started: true,
  committed: false,
  judgments: {                   // per-station choices
    s1: { choice: 'Gastrointestinal', why: '...' },
    s2: { top: 'resin ducks', why: '...' }
  },
  matches:  { a1:['mouth','virus'], a2:['nose','virus'], a3:['eyes','virus'], a4:['cut','bacteria'] },
  responses: {                   // all free-text answers, keyed by field id
    q5: '...', q6: '...',
    c1_name: 'Norovirus', c1_clue1: '...', c1_clue2: '...',
    c2: '...', c3a: '...', c3b: '...',
    rule1_what:'...', rule1_why:'...', rule2_what:'...', rule2_why:'...',
    rule3_what:'...', rule3_why:'...', bonus:'patient zero',
    selfcheck: '...'
  },
  partB: { does_v:'...', does_a:'...', when_v:'...', ... },  // vaccine vs antibiotic table
  committedAt: 1730000000000,
  lastActive: 1730000000000
}
```

Every field the student can touch maps to a key here, so "everything" literally means everything.

### 6.2 Write path (autosave)

- `collectState()` reads the DOM into the state object. **Null-guard every element read** (the repo's known autosave-baseline crash: one unguarded `.textContent` on a not-yet-built node kills the whole script).
- Debounced autosave **2500 ms** after any input/change; immediate flush on `visibilitychange` (hidden) and `pagehide`; a manual **Save** button for reassurance.
- Save = `POST VAULT_URL` with `{action:'submit_assignment', email, ts, sig, task:TASK_NAME, section, summary, data: state, requestId}` using `Content-Type: text/plain` (no preflight). On failure, fall back to `no-cors` fetch + `navigator.sendBeacon`, then confirm via `?action=verify&requestId=...`.
- HUD status line cycles `SYNC: SAVING...` -> `SYNC: SERVER OK (<time>)` / `SYNC: OFFLINE - will retry`. Only save when dirty (hash of `collectState()` differs from last saved).
- `summary` is a short human string for the sheet (e.g. `station 4, culprit=Norovirus, committed=false`) so the teacher can scan rows without parsing JSON.

### 6.3 Recall path (restore on login)

- After sign-in, `POST {action:'load_assignment', email, ts, sig, task:TASK_NAME}`.
- If `found`, `applyState(data)`: set every input/textarea/select/option-button to its saved value, set `station`, scroll to it, unlock visited stations, set the commit lock, and show a banner **"Restored your investigation from the server (saved <time>)."**
- If `auth_failed` (stale sig), clear the token and offer re-sign-in, then restore.
- If not found, start fresh at the briefing.

### 6.4 Storage rules (hard)

- **No `localStorage` for student work anywhere** (Chromebooks wipe it). The only client token is the sign-in identity in `sessionStorage.r8id`, and that is never work.
- Work lives only in the server Vault, keyed by verified email + `TASK_NAME`. So recall works across devices, days, and reboots. The 4-hour window means a student re-signs in with one click; their work is then reloaded from the server, not the device.
- `TASK_NAME = 'HL8-Centennial-Case55-Sim'` (course-level, no class numbers) namespaces this sim from any other task.

### 6.5 Section

Day one: a small section picker (`801-HE 802-HE 803-HE 804-HE`) persisted with the state, exactly like the template. Enhancement (removes the last bit of friction): auto-resolve section from email via a server-side email->section map in the Vault (script property or a private `Roster` tab) so the picker never appears; keep the picker as fallback.

---

## 7. Files to create (manifest)

All in `HealthyLiving8/Unit 2 - Communicable Disease/Centennial/`. Standalone, zero-dependency, no build step.

| File | Purpose |
|---|---|
| `plan.md` | This document |
| `assets/` | **Done.** 14 generated PNGs: 10 station exhibits (1920x1080) - `case55_cover`, `s1_evidence_board`, `s2_fountain_ducks`, `s3_entry_gates`, `s4a_soap_sanitizer`, `s4b_vaccine_shield`, `s5_suspects`, `s6_spread_map`, `s7_monday_plan`, `s8_verdict` - plus 4 character dossier portraits (1328x1328) - `char_vp_raman`, `char_jayden`, `char_sophie`, `char_marcus`. Referenced as `assets/<name>.png` |
| `case55_data.js` | All story content as data: station definitions, dispatch text, tab content, prompts, option labels, image paths (`assets/...`), and the locked verdict text. Edit content here without touching the engine |
| `index.html` | The sim: sign-in gate + HUD + nav-rail + center deck + investigation-log terminal + lightbox + auth/persistence engine adapted from `assignment_pages.html` + `collectState()/applyState()` |
| `dashboard.html` | **Moved to `bihipri-27` (`HealthyLiving8-priv/Unit 2 - Communicable Disease/Centennial/dashboard.html`).** Teacher-only, PIN-gated view: `get_submissions`, filter to this task, reduce latest-per-email, render a table (investigator, section, station reached, culprit pick, committed, last saved, # saves) + CSV export. PIN entered per session, never stored or shipped in any student file |

### Reproducing / regenerating the images (Qwen engine via Slide_Studio's local MaaS bridge)

The images were generated with the same engine `Student_System/Slide_Studio.html` uses: a local bridge (`%LOCALAPPDATA%\Room8\slide_studio_bridge.py`, started by `Room8_Slide_Studio_Bridge.vbs`) listening on `http://127.0.0.1:8791`, holding the Alibaba MaaS key locally (outside git). While the bridge is up and `/health` returns `hasKey:true`, generate any image with:

```bash
curl -s -X POST http://127.0.0.1:8791/generate \
  -H 'Content-Type: application/json' \
  -d '{"model":"qwen-image-3.0-pro","prompt":"<PROMPT>","size":"1920*1080"}'
# -> {"ok":true,"model":"qwen-image-3.0-pro","dataUrl":"data:image/png;base64,...","usage":{...}}
```

No `apiKey` in the body is needed - the bridge falls back to its saved local key. Decode `dataUrl` (base64 after the comma) to a PNG. The 10 station prompts used on 2026-11-04 shared one style prefix (dark slate/teal + amber outbreak-investigation look, 16:9, fictional students as silhouettes, **no text/letters in the image**) plus one scene sentence each (school exterior + case file, evidence board, fountain + duck trade, four entry gates, soap-vs-sanitizer sink, vaccine/antibiotic/shield nurse station, flu-vs-norovirus suspect folders, glowing spread map, Monday prevention scene, case-closed file). The 4 character portraits (`char_*.png`) used a dossier-portrait style prefix at 1328x1328 with each character's background named explicitly in the prompt (South Asian vice-principal; Mi'kmaw Grade 8 boy; Black African Nova Scotian Grade 7 girl; Latino Grade 9 boy). Re-run with edited scene sentences to regenerate or add variants; the drivers used 4-way parallelism against the threaded bridge.

---

## 8. Build steps (ordered)

0. **Orient + adaptations (mandatory first step per AGENTS.md):** `git pull` both repos. Read `../bihipri-27/Private_Student_Data-priv/2026-27 Adaptations.md` and `../bihipri-27/curriculum-planning-priv/ADAPTATIONS-REFERENCE-2026-09-30.md`, and pull the Adaptations tab via `get_adaptations` (aggregateOnly). Confirm HL8 CO2 code in `2026-27outcomes.md`. Run the AUTHORING-STANDARD gates (Cold-Read Test, outcome traceability table, Leak Sweep) and log them with evidence in the build spec in the private repo.
1. Create `case55_data.js`, `index.html`, `dashboard.html` in this folder (images already done in `assets/`). Start from `assignment_pages.html` for the auth/save/load engine (copy `boot`, `signIn`, the `message` listener, `post`, `save`, `verify`, `onAuthFailed`, `restore` block) and replace the single `answer` field with the full `collectState()/applyState()` sim.
2. Author `case55_data.js` from the deck + worksheet (section 4 mapping). Keep all student-facing strings free of em/en dashes (house rule for this unit).
3. Build the sim UI in `index.html` following the SunriseWharf layout (nav-rail, center deck, tabbed evidence, right terminal, history list), restyled to the outbreak HUD; reuse the deck's card/callout/lightbox CSS vocabulary. Point exhibit `<img>` at `assets/<name>.png`.
4. Gate station 8 on `state.committed`.
5. Local render check with headless Chrome `--dump-dom --enable-logging=stderr` to catch the null-guard/autosave crash gotcha (a bare dump looks fine even when the script died). Sign-in will not work on `file://`; test the live save/load path against the real Vault with the teacher account and then one student account.
6. Commit, push to `main`; Pages auto-deploys in ~1-2 min. Link the Pages URL in Google Classroom.
7. Verify: student opens link, one-click sign-in, works, closes tab mid-sentence, reopens later, signs in, and is restored to the exact station with all answers.

### Build log (2026-11-04)

- `case55_data.js` - all 9 stations (S0 briefing + S1-S8), character quotes, tab copy, field specs, image paths. Written at a ~12-year-old reading level, no em/en dashes. (Fixed a real load bug caught by headless render: top-level `const CASE55` did not attach to `window`, so the engine saw zero stations; changed to `var CASE55` + `window.CASE55 = CASE55`.)
- `index.html` - Path B sign-in gate (popup -> postMessage -> `sessionStorage.r8id`), HUD, nav-rail + Mon-Fri surge progress, center deck (dispatch/evidence/toolkit tabs, character dossier cards, exhibit images + lightbox), right Investigation Log terminal (choice/text/pair/grid/commit fields + live history), autosave (2500 ms debounce + visibilitychange/pagehide + manual Save) to the Vault with CORS -> no-cors/sendBeacon -> verify fallback, restore via `load_assignment`, anti-leak lock on S8 until `committed`, keyboard nav. State is one JS object (`judgments`/`matches`/`responses`/`partB`/`visited`/`started`/`committed`/`station`/`section`) serialized whole into the Vault `data` blob, so everything writes and everything recalls.
- `dashboard.html` - teacher PIN-gated latest-per-student view + CSV export.
- Tested with headless Chrome (`--dump-dom --enable-logging=stderr`): all 9 stations render with correct fields and zero JS errors; an in-page `?selftest=1` harness drives the real engine and reports **13/13 PASS** (data load, get/setPath, text->state, choice->state, S8 locked before commit, commit sets committed, S8 unlocks after commit, applyState roundtrip). `?demo=1` renders offline (disabled on the production origin). Vault `get_health` confirmed live (`R8-VAULT-0.3.0`, key configured). Remaining manual step: one real student Google sign-in to prove the browser save -> reload -> restore round-trip end to end, then commit/push.

### Review & Chronological Rewrite (2026-11-04)

- **Narrative structure & role:** Rewrote the story to unfold chronologically (Monday 8:15 AM Briefing -> Mon -> Tue -> Wed -> Thu -> Fri AM -> Fri Noon -> Fri 3:15 PM -> Case Closed) and recast the student from an outside "investigator" to Centennial's weekly **Health Officer** (usually handling gym-class scraped knees and ice packs). Day 1 opens on a bright, healthy, normal school morning (`s0_normal_school.png` and `s1_normal_office.png`) before the cluster grows. The surge tracker on the left reveals numbers day-by-day (`?` for future days).
- **Visual audit & 8 new/regenerated images (Qwen Image 3.0 Pro):**
  - Added `char_nurse.png` (Nurse Chen) and `char_boudreau.png` (Mr. Boudreau) so all 6 characters have dossier portraits.
  - Added `s1_monday_west_wing.png` (Monday 3 empty desks) and `s2_tuesday_cafeteria.png` (locker duck trading outside cafeteria) so every single day has visual exhibits.
  - Fixed two AI anatomy glitches found during visual inspection (`s2_fountain_ducks.png` locker arm and `s3_entry_gates.png` hologram face) and upgraded `s5_suspects.png` (+ deck `../assets/c2_suspect_three_lineup.png`) to show all 3 suspects (Influenza, Norovirus, Salmonella).
- **Pedagogy & UX polish:**
  - Numbered kid-friendly tabs (`1. Story`, `2. Evidence`, `3. Science & Words`) with unread amber dots (`●`) and `Next tab ->` nudges so 12-year-olds read all tabs.
  - Added a Hypothesis (first guess) on Monday, Suspect C (Salmonella) on Friday AM, a live-preview 5-step fomite sequencer with duplicate-number guard on Friday Noon, Word Bank on every station, and a full `Your File` review tab on Case Closed showing both auto-check scores and the student's Monday Plan alongside Public Health's version.
  - Synced `../HL8_Germs_C2_Outbreak_Deck.html`, `../HL8_Germs_C2_Outbreak_Worksheet.html`, `Student_System/assignments_data.js`, and private keys/spec (`../bihipri-27/HealthyLiving8-priv/HL8_Centennial_Case55_Sim_Spec_and_Key.md` + `HL8_Germs_C2_Worksheet_Teacher_Key.md`).
- **Critical bug fixes & accessibility:**
  - Keyboard navigation disabled inside inputs/textareas/selects/buttons; save race condition blocked until server restore completes; S0-S7 inputs lock on commit; commit validates section + culprit + 3+ words per rule; responsive single-column stack below 920px; `Read this tab` TTS + `A+/A-` zoom.
  - Teacher `dashboard.html` now loads `case55_data.js`, adds section filter + privacy email masking for projector/screenshots, computes auto-check score out of 9, and formats student answers cleanly.

---

## 9. Teacher dashboard and marking

- `dashboard.html` (PIN-gated, teacher-only) reads `get_submissions` and shows the latest state per student for this task: station reached, culprit pick, whether committed, game-plan text, last-saved time, and total save count (history length).
- Marking stays in Google Classroom / the private repo per repo rules; the Vault holds responses, the rubric and ideal answers live in `../bihipri-27/...-priv/`. This sim is formative evidence of the investigation, not a graded quiz by default.

---

## 10. Anti-leak and integrity

- Station 8 (verdict) is locked until the student's own `committed` flag is true, and the verdict text is not rendered into the DOM before that. A student cannot peek ahead in the sim.
- No correctness markers are shown anywhere; responses are open-ended and marked by the teacher against the private key.
- The teacher can still reveal the verdict class-wide with deck slide 11 during the in-class debrief, as today.

---

## 11. Adaptations and accessibility (designed in, silently)

From step 0's adaptations read, and by default: one question per station (chunked), large readable type, semantic HTML with aria-labels for read-aloud, full keyboard nav (arrow keys / number keys for stations), **no timer** (extra time is automatic because the sim autosaves and resumes from the server - a student can leave and finish later), high-contrast and reduced-motion options, and an oral/alternative-response path (teacher scribes into the same fields). Never print an adaptation label or reason on a student's own screen. No personal-reflection prompts - the case is fictional (Centennial), which satisfies the HL no-reflection rule.

---

## 12. Privacy and repo rules honored

- Public repo stays PII-free: no student names, emails, PINs, or IDs in any tracked file or student-facing surface. Full `@gnspes.ca` emails exist only server-side (HMAC-signed) and in the private repo; the sim displays the email only to the signed-in student as their own investigator ID.
- Course-level naming only (`Centennial`, `HL8-Centennial-Case55-Sim`) - no class numbers in filenames or task keys.
- "Server" in all student-facing labels (never "GAS").
- Zero student `localStorage`; all state server-side.
- Images are original generated art (no real people); no PII-bearing imagery.

---

## 13. Config constants (copy into `index.html`)

```js
const IDENTITY_URL = 'https://script.google.com/a/macros/gnspes.ca/s/AKfycbxzrLHgG2_vq8lh3VFB7SfPvbqXnn1atuz5S61oGlLul_l_jmlhrRc7Nwww__k9f5L0Rw/exec';
const VAULT_URL    = 'https://script.google.com/macros/s/AKfycbzhCVthh1eWPNo2apOZPTJPhMDVcyL7Q7PrSxIlhiEbauTbXnEJBJcUCSAnPg2X4cZi/exec';
const TASK_NAME    = 'HL8-Centennial-Case55-Sim';
const SECTIONS     = ['801-HE', '802-HE', '803-HE', '804-HE']; // picker fallback; auto-resolve later
const ID_KEY       = 'r8id';
const AUTOSAVE_MS  = 2500;
```

`RETURN_ALLOWLIST` in `identity.gs` already includes `https://dwaugh-edsim.github.io`, so the Centennial page needs no Identity-app change.

---

## 14. Open questions / decisions needed from you

1. **Delivery:** confirm linking the Pages URL in Google Classroom (Path B) is the intended route, vs. hosting the page inside the Identity app. Path B is what the no-GCP README prescribes for Classroom, so this plan assumes Pages.
2. **Section:** picker on day one, or invest in the server-side email->section auto-resolve now? Recommend picker first, auto-resolve as a fast follow.
3. **Vault growth:** autosave appends a row per save, so the Submissions tab grows quickly (that is also the version history). Day one accepts this. Optional later: add an upsert `save_sim_state` action that keeps one latest row per student while still logging checkpoints. Want it now or later?
4. ~~Cover art~~ **RESOLVED:** generated a full 10-image set (incl. `case55_cover.png` splash) with the Qwen engine into `Centennial/assets/`. Regenerate anytime via the bridge (section 7).
5. **Marking:** treat this as formative (responses reviewed in the dashboard) and keep marks in Classroom, or do you want a marks column flowing into the Master Sheet later?
