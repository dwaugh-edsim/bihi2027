# CIT9 Peace & Friendship Treaties Kit — Build Spec & QA Log

**Course:** Citizenship 9 (901/902/903) · **Built:** 2026-10-14 · **Standard:** `assignment-template/AUTHORING-STANDARD.md`
**Artifacts in this folder:**

| File | Role |
|---|---|
| `NotebookLM_source_Peace_and_Friendship_Treaties.md` | Source text for the teacher's 7-minute NotebookLM intro video (students "take on board content" before discussing) |
| `Cit9_Treaty_Courtroom_Materials.html` | Debate-day card kit: role cards, clause cards, evidence cards, timeline/map, justice slips, teacher reveal & rubric |
| `Cit9_Treaty_Inquiry_Student_Dossier.html` | Printable 2-sided paper docket — individual written evidence (same class or a follow-up class) |
| `AI_Scanner_Evaluation_Prompt.md` | Marking key for the docket (rubric matrix + JSON schema for ADF scan ingestion) |
| `Treaty_Inquiry_Lesson_Plan_Paper.md` / `Treaty_Courtroom_Lesson_Plan.md` | The two lesson plans |

**Design direction (teacher-confirmed):** students asked for discussion and debate; the
courtroom plan is the main event, and the video + shared handout carry the content load
first. The paper docket stays available as the individual-evidence option.

---

## 1. Task spine

Students watch a 7-minute intro (built by the teacher from the source doc), then receive a
one-page timeline/map handout so the shared factual base is on every desk. They are seated
into four groups: two tables study the *historical negotiating positions* of 1760 (Mi'kmaw
and British), one panel carries modern perspectives, and one group serves as justices. Team
prep uses clause cards (what the treaties actually say) and evidence cards (four modern
controversies, two cards each). A structured trial runs on speaking chips — every student
spends one chip before anyone spends a second — with justice question slips as the
non-speaking route into the argument. The teacher's Round-5 reveal names the two facts the
whole debate turns on: the treaties never ceded land, and the oral understanding ("as long
as the sun shines…") still drives modern law. The debrief lands on the civic question, and
the paper docket (or the exit ticket / voice note) captures each student's individual
evidence.

## 2. Outcomes (verbatim from `curriculum-planning-priv/2026-27outcomes.md`)

- **U2B (primary)** — "Learners will evaluate key changes in the citizenship rights of Mi'kmaw and other traditionally disempowered people." Indicators hit: importance of treaties; how/why citizenship rights changed; role of all citizens in reconciliation. Tags matched: Peace and Friendship, treaties, Donald Marshall, treaty rights.
- **U2A (secondary)** — "Learners will evaluate evolving concepts and attributes of citizenship as members of different kinds of communities." Indicator hit: how worldview shapes citizenship understanding (Netukulimk vs. Crown regulation).
- **U5B (supporting)** — "Learners will investigate the structure, operation, and selection of government in Canada…" Indicator hit: interactions/decision-making in Indigenous and non-Indigenous governance; jurisdiction (the St. Mary's Bay regulatory question; tags include Marshall Decision, jurisdiction).
- **U5C (supporting)** — "Learners will evaluate strategies to meaningfully engage as citizens within a democratic process." Indicator hit: resistance and protest as political action (the 2020 blockade round).

## 3. Evidence statements

- **U2B-1:** A student can explain what the 1752/1760–61 treaties promised (trade, "as usual" harvesting, peace) and that they contain **no land surrender**.
- **U2B-2:** A student can trace one line of change: 1760 promise → suppression era → Section 35 (1982) → *R. v. Marshall* (1999) → 2020 dispute.
- **U2B-3:** A student can name a concrete civic responsibility of a non-Indigenous treaty partner (learning the true history, respecting Section 35 rights, holding government to the honour of the Crown).
- **U2A-1:** A student can contrast Netukulimk (inherent stewardship, taking only what is needed) with state regulation (licences, seasons, quotas) as two worldviews, not just two rulebooks.
- **U5B-1:** A student can state the jurisdictional question — who may regulate a treaty fishery — and give one argument per side.
- **U5C-1:** A student can describe the 2020 protests/blockades as political action and evaluate one thing they achieved.

## 4. Traceability table

| ID | Student task (one line) | Outcome code | Evidence it elicits | Verb match |
|----|--------------------------|--------------|---------------------|------------|
| Trial R1 | Argue the fishery round from evidence cards | U2B, U5B | Treaty right to a moderate livelihood; who may regulate | evaluate (argue from evidence) |
| Trial R2 | Argue the unceded-land / development round | U2B | No-cession principle; consent vs. consultation | evaluate |
| Trial R3 | Argue written text vs. oral tradition | U2A, U2B | Two ways of knowing the same agreement | evaluate |
| Trial R4 | Argue sovereignty vs. submission | U2B, U5B | Nation-to-nation reading vs. Crown-law reading | evaluate |
| Trial R5+debrief | Respond to the reveal & modern-implications prompts | U2B, U5C | Rights *and* responsibilities of treaty people; protest as action | evaluate |
| Justice slips | Submit/ask neutral probing questions | U5B, U2B | Jurisdictional and fairness questions | analyse |
| Exit ticket / voice note | One modern-implications prompt, individually | U2B, U5C | Individual synthesis of treaty rights + responsibilities | evaluate |
| Docket Box 1 | Parse the 1760 truckhouse quote | U2B-1 | Promise + no-cession significance | explain/evaluate |
| Docket Box 2 | Contrast the two worldviews | U2A-1 | Stewardship vs. licensing as worldviews | compare (meets U2A investigate→compare) |
| Docket Box 3 | Trace 1760 → Marshall → 2020 | U2B-2 | The change-over-time chain | explain (evaluative chain) |
| Docket Box 4 | One right + one responsibility as treaty people | U2B-3 | Mutual obligations, not unilateral permissions | evaluate |

No orphans: every outcome above has ≥1 item; every item traces to ≥1 outcome.
Recall-only scaffolds (underline "as usual", timeline handout) feed but never solely
carry an evaluate outcome — the trial rounds and Boxes 3–4 do that.

## 5. Marking keys

- **Docket:** the rubric matrix in `AI_Scanner_Evaluation_Prompt.md` §3 IS the ideal-answer
  key (4/3/2/0–1 descriptors per box, 18 points). Written before the student-facing wording.
- **Trial:** facilitator rubric on page 1 of `Cit9_Treaty_Courtroom_Materials.html`
  (evidence use 4 · accuracy 4 · listening/rebuttal 4 · participation equity 3 · respectful
  language 3 = 18). Same 18-point shape as the docket so the two are comparable.
- **Exit ticket ideal answers (written before use):**
  - *Provisions in 2026:* yes — courts enforce them (Marshall). A strong answer names one concrete clause ("as usual" harvesting) still litigated today. Weak: "no, they're old."
  - *Consultation vs. consent:* consultation = government listens and explains; consent = Mi'kmaw agreement is required before acting. Strong answer ties consent to unceded land / FPIC.
  - *"Treaty people":* strong answer names BOTH a right enjoyed and a responsibility carried; weak answer names rights only.
  - *Evidence for interpreting a treaty:* strong answer defends a position with the spirit-and-intent idea or the asymmetry of 1760; weak answer says "written because courts."

## 6. Adaptations (aggregate, from `Private_Student_Data-priv/2026-27 Adaptations.md`)

Live `get_adaptations` POST was down from this machine (411 on all curl variants; GET
fine) — pulled from the detailed record instead. CIT9 cohort documented entries
(901: 3 · 902: 4 · 903: 6, some multi-category), aggregate:

- **Read-aloud / text-to-speech: 4** → Word Help glossary on the docket; short sentences;
  defined terms at first use; teacher reads prompts aloud works naturally in the trial format.
- **Extra time: 7** → docket is one block with modest volume; trial timing has slack
  (prep 8 min, several rounds); scanner flags blank fields for follow-up rather than zeroing.
- **Chunked / reduced volume: 6** → docket boxes are numbered steps (Step 1/2/3); one idea
  per prompt; cards are one-paragraph reads; core-only option = Boxes 1+3 for reduced pathway.
- **Oral elaboration documented: 3** (explicit) → the whole courtroom format is the
  alternative response mode; exit ticket may be a 45–60 s voice note.
- **Checklists/exemplars: 3** → "must be able to say" line on each role card; facilitator
  check-ins use the run-of-show; docket metadata grid doubles as a completion checklist.
- **Alternate location / movement breaks: 6** → justice slips let a student contribute from
  the edge of the room; Learning Centre breaks unaffected.
- **Chromebook/Read & Write for large writing: 7** → no large writing required on the
  debate day; if the docket runs as the follow-up, scribing/Read & Write is compatible
  (scanner handles pasted/typed text poorly — teacher marks those by hand, manual-review flag).

Never printed on any student-facing surface: no adaptation labels, no reasons.

## 7. QA log

```
Gate A — Cold read: stalls found & rewrites
  1. Box 1 prompt was a two-task run-on ("Underline… In your own words… and why is the fact
     that no land was surrendered or ceded legally significant today?") — split into
     Step 1/2/3 with one instruction each; "legally significant" → "why does that promise
     still matter for citizens."
  2. "Truckhouse" appeared in the prompt before any definition — added WORD HELP strip
     (Truckhouse / Peltry / Ceded-unceded) above Box 1.
  3. "DFO" unexpanded in the Box 3 quote; "acquitted" undefined — expanded to
     "Department of Fisheries and Oceans (DFO)" and glossed "(found him not guilty)".
  4. Box 4 opened "unceded Mi'kmaw territory governed by Peace and Friendship covenants" —
     "covenants" cut, "unceded" defined inline ("never sold it or surrendered it").
  5. Section metadata printed "[ 901 / 902 / 903 ]" with no instruction and the scanner
     expects a circled section — label now reads "SECTION (CIRCLE ONE)".
  6. Box 3 prompt referenced "this 260-year-old promise" (ambiguous referent) — rewritten to
     name the treaty and the case explicitly.
Gate B — Traceability: table embedded above (§4); ideal answers written first (§5).
Gate C — Leak sweep:
  - REMOVED from student paper: four "Target:" rubric strips (the marking descriptors were
    the printed ideal answers) and two stale AI field IDs (`box2_worldview`,
    `box4_civic_synthesis`) that did not match the scanner map
    (`box2_netukulimk`/`box2_crown`, `box4_privilege_right`/`box4_responsibility`).
    Descriptors live only in the scanner prompt; field IDs only in the scanner map.
  - REMOVED the "FEEDER OCR VERIFICATION / AUTOPARSE READY" footer from Side B — machine
    metadata, not student content; total-score box kept for teacher use.
  - Trial rubric prints on the FACILITATOR page only, never on student cards.
  - Clause/evidence cards state facts both sides use; no card contains an exit-ticket ideal
    answer; the Round-5 reveal sits on the teacher page, not in student hands.
  - Sequencing: timeline handout carries dates only, not the argument structure; justice
    slips probe without pre-solving rounds.
Adaptations: §6 reviewed against the detailed record; supports baked in silently (no
  labels on any student-facing page).
```

## 8. Open items

- NotebookLM video generation is the teacher's step (paste the source doc; ~7 min target;
  verify the render covers beats 2 and 6 — the pressure-to-sign and the two hard questions).
- Two CIT9 course outlines share a filename across
  `curriculum-planning-priv/` and `Citizenship 9-priv/` (pre-existing drift, not touched here).
- The docket and the courtroom plan carry different summative shapes (18-pt docket vs.
  exit ticket); teacher picks per class — both trace to the same outcomes above.
