# Authoring an assignment on the pipe

The goal: **assignment content is data, not code.** A new assignment is a copy of
`template_assignment.html` with three things changed — plus your actual questions.

## Quick start

1. Copy `template_assignment.html` next to your other course pages (pick a clean path —
   that URL is what goes in Google Classroom).
2. Edit the `ASSIGNMENT` config block at the top of the script (see schema below).
3. Leave `IDENTITY_URL` / `BACKEND_URL` alone unless you've redeployed the apps.
4. Push. GitHub Pages deploys `main` in 1–2 minutes.
5. **Test with your own account first**: sign in → fill → watch for `Saved ✓` → reload →
   answers return → check the row in the v2 sheet.

## The config schema

```js
const ASSIGNMENT = {
  taskName: 'HL9 Operation Addictive by Design (Class 2)',  // EXACT save key
  course:   'HL9',                                          // CIT9 | HL9 | HL8
  title:    'Operation: Addictive by Design',
  badge:    'HL9 • CLASS 2 • 30 MARKS',
  sections: [                                               // the worksheet body
    { title: 'Step 1 — Choose your app',
      hint: 'Pick the boring app you will rebuild.',
      fields: [
        { id: 's1_base', type: 'select', label: 'Which boring app?', options: ['…'] },
        { id: 's1_name', type: 'text',   label: 'Your app\'s name:' },
        { id: 's1_base', type: 'textarea', label: 'What does it do right now?', rows: 3 },
        { id: 's2a_tricks', type: 'checks', label: 'Pick your tricks:',
          options: ['Variable Rewards', 'Mystery Drop'] },
      ] },
  ],
};
```

Field types: `text` · `textarea` (rows) · `number` (step) · `select` (options) ·
`radios` (options) · `checks` (options → saves an array) · `static` (html, read-only).

The engine ships the classroom-safety layer automatically — you don't wire any of it:
effort telemetry (counts only), server autosave with an outbox badge and
offline/reconnect states, in-tab crash recovery, restore-on-load, and emergency
exports (**Copy for Google Docs** / **Download JSON**) for network outages at the bell.
Optional page hooks: `custom.collect` / `custom.populate` (for custom blocks like the
Numbeo matrix) and `custom.exportExtra(answers)` (extra Markdown in the export).

## Payload conventions

- Student answers save under `answers: { <field id>: value|string[] }`, plus
  `{ name, section, _v: 2, _pipe: true }` metadata.
- The Backend stores it per student under `_tasks[taskName].data` — **schema-agnostic**,
  so any shape works. But keeping the same `taskName` (and, where applicable, the same
  payload keys as the V6.x page it replaces) means teacher tooling and future data joins
  stay coherent.

## Rules the pipe imposes on every assignment

- **No `localStorage`.** Autosave is the durability. The template wires it for you
  (debounced ~2.5s, flush on tab-hide, `requestId` on every attempt).
- **No PINs, no name entry when the roster knows them.** `Room8.resolve()` returns the
  student's real name/section from the verified email. If `known:false`, *ask* — don't
  guess.
- **Restore before you render blank.** On load, `load(task)` returns the student's own
  newest save; populate, then set the clean-hash baseline so autosave doesn't immediately
  re-write it.
- **Sign-in is a popup, and it closes itself.** Listen for the identity, close the popup
  from the opener (Google's sign-in redirects can push the popup's history past its own
  `close()`).

## Before you design: pull the adaptation profile (step 0)

Every new assignment starts by fetching the documented adaptations for the section(s) it serves:

```
POST <BACKEND_URL>  { "action":"get_adaptations", "teacherPin":"…", "section":"802-HE", "aggregateOnly":true }
```

Then **state in your reply** which adaptations this assignment must support and how it does so —
writing volume, chunking, read-aloud friendliness, whether extended time changes the task shape.
Use `aggregateOnly:true` unless per-student detail is genuinely needed.

**Privacy:** adaptations are confidential student information. Names and notes must never be
written into this public repo, and an adaptation must never be printed as a label on a student's
own screen. Adapt silently — make the page easier to use, don't announce why.

## Step 0b: write the exemplar BEFORE the fields

One worked example of strong student work for the main written task, added to the config:

```js
exemplar: {
  title: 'Example of a strong response',
  html: '<p>…your 1–2 paragraph model answer…</p>'
}
```

Why first: it defines what "successful work" means before the fields lock it in, and it
catches rubric ambiguity while changes are still cheap. The engine renders it collapsed for
students (green card) and the Station shows it above the mark sheet, so you mark against it.

Follow the personal-reflection rule for Healthy Living: the exemplar is a *model*, not a
prompt — frame it third-person or scenario-based where the course demands it.

## Mark-sheet registration (one line)

The GAS Station renders mark sheets by loading the live page in a hidden iframe and asking
the engine for its config (`?r8config=1`). For a NEW assignment to get the original-layout
mark sheet, add one line to `PAGES` in `gas_station.html`:

```js
'Exact taskName from the ASSIGNMENT config': '../../<Folder>/<page>.html',
```

Miss it and nothing breaks — the Station falls back to a plain answers list.

## Checklist before you link it from Google Classroom

- [ ] `taskName` is unique and exact (it's the ledger key — renaming it orphans data)
- [ ] Signed in as **your own** account: sign-in, autosave, restore, and the row in the
      v2 sheet all work
- [ ] **One real student account** signs in through the popup (the standing gate)
- [ ] Section auto-resolves, or the page asks when the roster doesn't know them
- [ ] The page path is clean (no `%20`-heavy folder cruft — that URL is what students see)
- [ ] Anything marked "private/anonymous" on paper really should be — the pipe identifies
      the submitter, so anonymous fields need to be dropped or rerouted
