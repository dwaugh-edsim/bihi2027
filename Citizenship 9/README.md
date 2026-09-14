# Citizenship 9 — Course Hub & Simulation Architecture

**Teacher:** Mr. Dave Waugh  
**Room:** Room 8, Bicentennial Junior High School ("BiHi"), Dartmouth, Nova Scotia  
**Academic Cohort:** 2026–2027  
**Class Sections:** Class 901, Class 902 (Homeroom), Class 903  
**Curriculum Standard:** Nova Scotia Department of Education & Early Childhood Development — Citizenship 9  

---

## 1. Directory Purpose & LLM Context

This folder contains all curriculum plans, interactive simulation webapps, classroom presentation decks, printable student dossiers, and teacher facilitation keys for **Grade 9 Citizenship**.

The curriculum is structured around active, participatory democracy, regional and global geography, constitutional law, Indigenous treaties (Peace and Friendship Treaties), and historical simulations. All digital student deliverables are built as **zero-dependency, single-file HTML/CSS/JS applications** optimized for school-issued Chromebooks, offline resilience, and classroom projector display.

---

## 2. Key Modules & Flagship Applications

### A. The "WHERE" Project — Places of Significance Studio
* **Core Files:**
  * `Places_Of_Significance_Studio.html` — Student interactive web studio.
  * `09_WHERE_4_Places_Activity.html` — Printable/offline 4-places brainstorm worksheet.
  * `10_WHERE_Slide_Deck.html` — Classroom launch slide deck for projector display.
* **Curriculum Outcome:** Citizenship 9 Indicator 2A (*Investigate how personal roots, local community infrastructure, ancestral heritage, and aspirational destinations shape worldview and active citizenship*).
* **Technical Integration:**
  * Uses Leaflet.js for interactive mapping (offline-tolerant).
  * Auto-syncs student work directly to Google Sheets via `StudentAPI` in `../Student_System/api.js` every 2 seconds after typing pauses.
  * Synchronized with `../Student_System/WHERE_Grade9_Progress_Dashboard.html` for real-time teacher oversight.

### B. Three Levels of Government & Constitutional Division
* **Core Files:**
  * `16_Cit9_Class5_Three_Levels_Slide_Deck.html` — High-contrast classroom slide deck.
  * `16_Cit9_Class5_Three_Levels_of_Government_Dossier.html` — Student forensic case dossier.
  * `Cit9_Class05_Teacher_Facilitation_and_Answer_Key.md` — Minute-by-minute teacher pacing, debate prompts, and constitutional answer key.
* **Curriculum Outcome:** Citizenship 9 Unit 5 (*Governance, Democracy, and Canadian Political Systems*). Sections 91 and 92 of the Constitution Act 1867, division of municipal, provincial, and federal powers.

### C. Map Sprint: Nova Scotia & Canadian Geography
* **Core Files:**
  * `17_Cit9_Map_Sprint_NS_and_Canada.html` — High-speed timed geography sprint.
  * `Cit9_Map_Sprint_Answer_Key.md` — Complete master coordinate and reference key for Nova Scotia counties, waterways, Canadian provinces, and territories.

### D. Historical & Civic Simulations (`resources/`)
* **Leo 1752 Treaty Sim (`resources/Unit_02_.../Leo-1752-Treaty-Sim/`):** Simulated 1752 Peace & Friendship Treaty negotiation between Mi'kmaq leaders and the British Crown at Halifax.
* **Nora Bernard Residential School Project (`resources/Unit_02_.../Residentialschools/`):** Historical inquiry into Nora Bernard's advocacy and the Indian Residential Schools Settlement Agreement.
* **Maya-Paul Tribunal & Justice Sim (`resources/Unit_02_.../`):** Human rights and restorative justice legal simulations.
* **Political Spectrum & Elections (`resources/Unit_05_Governance/`):** Interactive Canadian political spectrum and party platform analysis.
* **Service Learning Project (`resources/Unit_01_.../`):** 14-day ecological/civic community action audit with automated LLM marking scripts.

---

## 3. Curriculum Documents & Reference Files

* `cit9-outline.md` — Complete multi-unit year-long course outline.
* `cit9-assessment-plan.md` — Term weights, formative/summative breakdown, and rubric matrix.
* `cit9-outcomes-enhanced.md` — Granular breakdown of NS Citizenship 9 curriculum indicators.
* `CIT9-CALENDAR-2026-27.md` — 10-day cycle scheduling map across the school year.
* `CIT9_Student_Survey_Diagnostic_Summary.md` — Day 1 diagnostic intake survey analysis.

---

## 4. Technical Constraints for LLMs Modifying This Folder

1. **No External Build Tools:** Keep all HTML apps self-contained. Do not introduce npm, bundlers, Tailwind, or complex frameworks unless explicitly directed.
2. **Chromebook Friendly:** Chromebooks on school carts reset memory. Always hook student input into `StudentAPI` (`../Student_System/api.js`) and ensure fallback to `mode: 'no-cors'` for Google Apps Script webhooks.
3. **Typography & Styling:** Standard font stack uses Google Fonts (`Inter`, `Courier Prime`, `Plus Jakarta Sans`, `Outfit`). Ensure clean print media queries (`@media print`) on all student sheets.
