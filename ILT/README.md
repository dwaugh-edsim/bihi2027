# Instructional Leadership Time (ILT) — Project Hub & Gamified Friday Blocks

**Teacher:** Mr. Dave Waugh  
**Room:** Room 8, Bicentennial Junior High School ("BiHi"), Dartmouth, Nova Scotia  
**Academic Cohort:** 2026–2027  
**Student Cohorts:**  
* **Grade 7 ILT (`7ilt`):** Friday Day 5 Period 4 & Day 10 Period 5  
* **Grade 9 ILT (`902`, `903`):** Homeroom leadership, Friday flexible block, academic recovery, and setup sprints  

---

## 1. Directory Purpose & LLM Context

This folder contains all interactive game decks, cooperative team challenges, inquiry project proposals, and debate facilitation tools for **Instructional Leadership Time (ILT)**.

ILT operates with two distinct mandates:
1. **Grade 7 ILT:** Team-building, non-verbal communication, social-emotional transition to junior high, and gamified cooperative challenges.
2. **Grade 9 ILT:** Student agency, classroom governance sprints, academic recovery, passion projects, and structured debate summits.

---

## 2. Key Modules & Flagship Applications

### A. Friday Master Game Decks & Cooperative Challenges
* **Core Files:**
  * `7_ILT_Friday_Master_Game_Deck.html` — Full-screen interactive projector slide deck with embedded live timers, team point trackers, and challenge rounds:
    * **Round 1: Non-Verbal Lineup** (Alphabetical first names, birth months without speaking).
    * **Round 2: Four Corners Movement** (Fast-paced preference & debate prompts).
    * **Round 3: Survival Council** (Wilderness item rationing & team hot seat defense).
    * **Round 4: Room 8 Agreement Debrief**.
  * `7_ILT_Survival_Council_Hot_Seat_Slide.html` — Interactive wilderness/island survival scenario where teams vote to eliminate or keep critical survival tools (flare gun, water jug, duct tape, acoustic guitar, etc.).
  * `Room8_Four_Corners_Signs_A4.html` — High-contrast printable A4 signs (*Strongly Agree, Agree, Disagree, Strongly Disagree*) designed for physical classroom wall mounting in Room 8.

### B. Classroom Operations & Setup Sprints
* **Core Files:**
  * `Room8_ILT_Classroom_Setup_Dashboard.html` — Room 8 operational dashboard tracking materials, cart Chromebook status, and task stations.
  * `9_ILT_Room8_Setup_Sprint_Slide_Deck.html` — Timed 10-minute setup sprint deck for Grade 9 homeroom helpers.
  * `9_ILT_All_Assignments_One_Slide.html` — High-density projector slide displaying all active student deliverables across subjects.

### C. 10 One-Day Rapid Leadership Challenges (`oneday-*.html`)
Turnkey single-period experiential learning simulations:
* `oneday-01-human-knot.html` — Kinesthetic problem solving.
* `oneday-04-minefield-trust.html` — Blindfolded trust navigation.
* `oneday-06-debate-walk.html` & `oneday-06-summit-deck.pptx` — Philosophical walking debates with printable decree slips (`oneday-06-decree-slips.docx`).
* `oneday-07-silent-lineup.html` — Non-verbal logic and spatial coordination.
* `oneday-10-mission-impossible.html` — Team timed escape challenge.

### D. 10 Multi-Week Inquiry Proposals (`proposal-*.html`)
Student-selected capstone projects:
* `proposal-01-cold-case-forensics.html` — Forensic crime scene investigation.
* `proposal-02-podcast-studio.html` — Audio storytelling and journalism.
* `proposal-03-escape-room-lab.html` — Curriculum-based escape puzzle design.
* `proposal-04-cardboard-arcade.html` — Caine's Arcade engineering challenge.
* `proposal-07-learning-game-studio.html` — Board game and simulation mechanics.
* `proposal-10-sports-analytics.html` — Data science in athletics.

---

## 3. Technical Scripts & Generators

* `build_decree_slips.py` — Python script generating printable Word `.docx` slips for silent debates.
* `build_summit_deck.py` — Python script generating PowerPoint `.pptx` slide decks for debate summits.
* `build_editorial_site.py` — Automated static HTML builder for student project showcases.

---

## 4. Technical Constraints for LLMs Modifying This Folder

1. **Classroom Lighting & Font Scale:** Game decks (`7_ILT_Friday_Master_Game_Deck.html`) are projected on an HDMI projector across a full classroom. Headings must be bold and minimum `2.5rem` with high-contrast text (`#ffffff` on `#0f172a` or `#000000`).
2. **Timer Reliability:** Timers use standard `setInterval` with audio synthesis/beeps that run reliably inside Chrome without requiring external audio asset hosting.
3. **No External Frameworks:** Maintain standalone, vanilla HTML/CSS/JS architecture.
