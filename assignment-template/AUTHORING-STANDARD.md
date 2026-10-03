# Assignment Authoring Standard (all formats)

> **In force 2026-09-30.** Applies to every student-facing assignment build — Google Docs/Slides
> task templates (current default) and Room 8 v2 HTML pages (legacy). It exists because of three
> recurring failure modes in LLM-built assignments. Every build must pass the three gates below
> **and log the evidence**. A gate that isn't logged wasn't run.

---

## The three failure modes this standard exists to stop

1. **Haiku prose.** LLM-compressed instructions that read like notes to someone who already
   understands the task. A Grade 8/9 student — including EAL students and Read & Write users —
   cannot follow them, and won't ask a follow-up question.
2. **Questions that don't further the outcomes.** Topic-shaped questions ("What is X?", "List
   three things about Y") that elicit recall but produce no evidence of the curriculum outcome's
   verb. The question looks like assessment; it isn't.
3. **Incoherent design that leaks answers.** The exemplar *is* the answer, the word bank contains
   the expected sentence, question 3 pre-solves question 4, or the intro names the conclusion the
   question is supposed to draw.

---

## Gate A — Audience & register (kills haiku prose)

### Who is reading

- Grade 8/9 students. Every class has EAL readers and Read & Write / text-to-speech users;
  several students have reduced reading/writing stamina documented.
- **The reader will not ask you a follow-up question.** Write every instruction as if this is
  the only chance to be understood — because it is.

### Register rules

- Complete sentences, always. No fragments, no telegram style, no bullet points where a
  sentence is needed.
- One idea per sentence. Instructions: ≤ 2 sentences plus one concrete example.
  Explanations: paragraphs ≤ 4 sentences.
- Active voice, second person ("You will…", "Your task is…").
- Define every term of art at first use — inline or in the word bank. No unexplained acronyms.
- Example before or immediately after abstraction: no abstract instruction without a concrete
  instance in the same block.
- Student-facing readability target: comfortable for Grade 7–8. (The teacher build spec can be
  dense — this rule applies to what students see.)

### The Cold-Read Test (required, logged)

After the student template is written, re-read it as a student seeing it cold: no teacher
context, no ability to ask questions, on a Chromebook. At every point where a student might
stall — unclear referent, missing step, undefined word, unexplained "why" — fix the text or add
the missing step. **Log the stalls you found and what you rewrote. If you found zero stalls, you
did not actually do the test.**

### What "not lazy" looks like (before → after)

- ❌ "Analyze the source and connect it to the outcome." *(What source? Which outcome? Connect how?)*
- ✅ "Read Source A (the 2026 hrM transit survey, linked below). In the box underneath, write
  3–5 sentences naming the two biggest concerns in the survey and explaining which one matters
  more for Dartmouth residents — use at least one number from the survey as evidence."

---

## Gate B — Outcome traceability (kills decorative questions)

### Backward design chain, in this exact order

1. Copy the target outcome(s) **verbatim, with codes**, from
   `../bihipri-27/curriculum-planning-priv/2026-27outcomes.md` (private repo).
2. Write 2–4 **evidence statements** per outcome: "A student who meets this outcome can ____."
   Use the outcome's own verb — an "analyze" outcome is not evidenced by a "list" question.
3. Design the minimum set of items that *collectively* elicit every evidence statement.
4. **Write the ideal answer for each item BEFORE writing the item's student-facing wording.**
   If you cannot write a strong Grade 8/9 answer, the item is broken — fix the item, not the
   answer. (This also produces the marking key as a byproduct.)

### The traceability table (required artifact in the build spec)

| ID | Student task (one line) | Outcome code | Evidence it elicits | Verb match |
|----|--------------------------|--------------|---------------------|------------|

Rules:

- Every item traces to ≥ 1 outcome code. Every targeted outcome has ≥ 1 item. No orphans in
  either direction.
- The item's cognitive verb must **match or exceed** the outcome's verb level.
- Recall items may scaffold, but cannot be the sole evidence for an analyze/evaluate outcome.

---

## Gate C — Coherence & leak sweep (kills answer-leaking design)

### Task spine (write it before any prose)

One paragraph in the build spec: what the student does in each part and how it feeds the next
part. If you cannot write the spine, the assignment is incoherent — redesign before writing a
word of student-facing text.

### Leak vectors & rules

- **Exemplars** must model the move on a **different topic or question** than the assessed one.
  An exemplar for the exact task being marked *is* the answer. ("Copy the structure, not the
  content" only works if the content differs.)
- **Word banks** never contain the operative phrases of an expected answer. If the bank hands
  over the answer, rephrase the item to require synthesis beyond the bank — or cut the bank.
- **Sequencing**: no item's framing, example, or hint pre-solves a later item.
- **Criteria**: process scaffolds (how to structure an answer) are student-visible; the
  answer's *content* criteria (the conclusion you expect) live in the private rubric only —
  never in the student-facing intro of the item that assesses them.
- **Worked examples**: one per concept, attached to practice, never attached to the item that
  assesses that concept.

### The Leak Sweep (required, logged)

With the answer key written, re-read the student template end to end. Check every key element
of every ideal answer against every hint, example, word-bank entry, earlier item, title, and
intro. **Log each key element → where it's protected (stated nowhere) or the redesign you made.**

---

## Build sequence (plan before prose — always in this order)

1. Outcomes verbatim (private repo, with codes)
2. Evidence statements per outcome
3. Task spine paragraph
4. Skeleton — sections + item IDs, **no prose**. (For a large or high-stakes task, show the
   teacher the skeleton before writing prose.)
5. Ideal answers per item (the marking key)
6. Student-facing prose
7. Adaptations pass (AGENTS.md "Student adaptations" + the UDL defaults) — silent, baked in
8. Gates A / B / C + QA log
9. Deliverables (below)

---

## Delivery: Google Docs/Slides via Google Classroom (current default)

- **Student template**: a Google Doc (or Slides for visual/poster tasks) the teacher assigns
  through Classroom. Structure:
  - Header: task name, course, then the UDL intro — goal, why it matters, time & pace, word
    bank, what "done" looks like.
  - Numbered sections; **each instruction sits immediately above its response area** ("Your
    response:" box or organizer table). Chunking lives inside the document — students never
    need a separate instruction sheet.
  - Exemplar near the first substantial task; quality checklist at the end (core-task bar).
- **Core vs. extension**: an optional "Go Further" section visible to all, or — preferred for
  reduced-pathway students — **assign-to-individual core-only copies in Classroom**. The
  differentiation happens in *who receives which copy*; the document itself carries no
  adaptation labels.
- **Build spec, ideal answers, rubric**: private repo, in the course's `-priv` folder
  (e.g. `HealthyLiving8-priv/`). Enter the rubric in Classroom's rubric tool where practical.
- **Student responses and marks live in Google/Classroom** — never copy them into either repo.
- v2 HTML pages remain live for existing assignments; their README patterns still apply there.

---

## Hand-off: rendering the Doc via Gemini Canvas

The agent does not create Google Docs directly. The agent produces a **Gemini hand-off prompt**
(stored with the build spec in the private repo) that the teacher pastes into Gemini with Canvas
on. The division of labour is strict:

- **The hand-off prompt contains the finished, verbatim student-facing text** — every instruction,
  exemplar, word bank, checklist, and response-area label, written to this standard. The agent does
  the authoring; **Gemini does the typesetting only.**
- The prompt opens with: *"You are formatting a finished document. Insert the text below exactly
  as written — do not shorten, summarize, rewrite, or 'improve' anything. Your job is layout only."*
- The prompt then gives Docs-specific layout directives (Heading 1 for the task name, Heading 2 per
  section, response areas as single-cell bordered tables labelled "Your response:", the checklist as
  a bulleted list, keep the intro block together on page 1).
- Content arrives in clearly fenced blocks (one per section) so nothing is paraphrased in transit.

### Post-render check (teacher, ~1 minute)

Canvas models sometimes trim long payloads. Before assigning, verify: every section number is
present, the checklist has all its items, and spot-read one instruction against the hand-off
prompt — if Gemini compressed anything, re-paste the offending block as a follow-up message
("replace section 2 with this text exactly").

---

## QA log (required at the bottom of every build spec)

```
Gate A — Cold read:   stalls found & rewrites (list ≥ 3; "none found" = not run)
Gate B — Traceability:  table embedded above in this spec
Gate C — Leak sweep:    key elements checked & where each is protected
Adaptations:            section adaptations reviewed; supports baked in silently
```

If the QA log is empty, the assignment is not done.
