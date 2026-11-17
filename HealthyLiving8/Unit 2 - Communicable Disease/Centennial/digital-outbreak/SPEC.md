# Case 55: Outbreak at Centennial — Digital Class Game — Spec & Build Notes

**Status: v1.0.0 CREATED 2026-11-17.** New subfolder; the Werewolf game in
`ILT/werewolf/digital-werewolf/` is untouched and still in use.

Whole-class social-deduction game for a 20–30 student Health 8 / ILT class, running on
the same engine shell as Digital Werewolf: teacher console (`run.html`), student
Chromebook client (`index.html`), projector dashboard + Story Theatre (`lcd.html`),
and a single-file Google Apps Script backend (`gas/Code.gs`).

## The story

A mysterious illness ("Case 55") hits fictional **Centennial Junior High** during
Bicentennial week. Some students are secretly **Carriers** who spread it each night;
the rest must find them by day through debate and a secret ballot that sends one
suspect home to isolate. The Nurse shields one student per night; the Investigator
(Health Officer) tests one student per night and learns their true status. Grade 7–9
appropriate: illness, never gore. Fiction ties into the existing HL8 Case 55 sim
world (resin ducks, West Wing, Nurse's office).

## Roles & win conditions

| Role | Count (28) | Night action | Day |
|---|---|---|---|
| Carrier | 3 | Agree on 1 seat to infect (pack lock; split -> teacher decides, never random) | Blend in, deflect |
| Nurse | 1 | Shield 1 seat (no self-shield, no repeat target by default) | Blend in |
| Investigator | 1 | Test 1 seat; true status revealed privately at dawn | Uses findings |
| Student | rest | Tap 1 hunch (anti-tell cover) | Vote to isolate |

- **School wins** when every Carrier is isolated. **Carriers win** at parity
  (carriers >= everyone else) -> "school closes for deep cleaning".
- Day ballot: secret, 1 vote each, Skip/Hold option, tie -> 1 runoff revote.

## Architecture (reused shell, unchanged plumbing)

```
digital-outbreak/
├── host.html / run.html / index.html / lcd.html   4 surfaces (teacher / student / LCD / entry)
├── shared/    config.js (OBConfig: ACTIONS, ASSETS, COPY, TIMERS), sfx.js, tts.js, theatre.js, css/
├── engine/    outbreak_engine.js (OutbreakEngine, pure deterministic, selftest 141 checks)
│              story_engine.js (generic reveal/beat builder, unchanged from werewolf)
│              story_content.js (Centennial content: PLACES, JOBS, POOLS, EPITAPHS, BEAT_COPY)
│              selftest_node.js (node runner; sandbox-run via new Function when node is absent)
├── gas/       Code.gs (single-file GAS backend; engine spliced between @@OUTBREAK_BUNDLE@@ markers)
│              DEPLOY_README.md
└── assets/    generated illustration set (see below) + night_music.mp3 ambience
```

Rebrand mapping from the werewolf shell: WEREWOLF->CARRIER, DOCTOR->NURSE,
DETECTIVE->INVESTIGATOR, VILLAGER->STUDENT, VILLAGE->SCHOOL (win side),
WWConfig->OBConfig, room codes `WOLF-` -> `OUT-`, cache keys `ww_` -> `ob_`.

Fixes applied on top of the copied HEAD engine (HEAD's own selftest was mid-refactor):
- LCD hides individual NIGHT checkmarks (anti-tell; aggregate `counts.acted` only) —
  matches the werewolf SPEC intent; HEAD's stale check now passes.
- Full-game bot playthrough guard 80 -> 300 (28-player games can run ~14 rounds).
- Stale "drama pack" selftest checks (tension/flatline/...) replaced with checks against
  the real story-engine beat vocabulary (blackout/narration/suspense/card_reveal/
  verdict/last_words/ghost_rules).

## Assets (generated with tools-priv/boost_image.py, qwen-image-3.0-pro 1920x1080)

`assets/`: bg_day_school, bg_night_school, banner_victory_school ("OUTBREAK CONTAINED"),
banner_victory_carriers ("SCHOOL CLOSED"), card_back, role_carrier, role_nurse,
role_investigator, role_student, scene_night_ends, scene_dawn_empty_hallway,
scene_carrier_silhouettes, scene_nurse_lantern, scene_council_trial, scene_school_gate,
scene_deadlock, card_sealed. `assets/story/`: scene_night_spread, scene_case_strike,
scene_isolation_verdict + copies of the shared scenes referenced by lcd.html.
Banners pass the Windows OCR spell-check gate (text:true in the manifest).

## Run modes (same as werewolf)

1. **Cloud (primary):** deploy `gas/Code.gs` as a NEW Apps Script web app (do not reuse
   the werewolf deployment — it runs the old bundled engine). Teacher runs `run.html`;
   `lcd.html` on the projector auto-follows the active room; students join from
   `@gnspes.ca` sign-in on Chromebooks. Script Properties: `R8_IDENTITY_KEY`, `TEACHER_PIN`.
2. **Demo (zero server):** `lcd.html?demo=1` + `index.html?demo=1` sync over
   BroadcastChannel (`r8_outbreak_v1`).
3. **Projector-only:** teacher enters night picks from `run.html` god-view tools.

## Verification

- Engine self-test: 141 checks pass (`OutbreakEngine.runSelfTest()`; full bot class
  reaches a valid victory). Run with `node engine/selftest_node.js` where node exists.
- `gas/Code.gs` bundle re-spliced from `engine/` after every engine edit (markers
  `@@OUTBREAK_BUNDLE_BEGIN@@/END@@`; regenerate with a bundler like
  `tools-priv/bundle_outbreak_gas.py` when that script is written).

## TODO / open questions

- Bundle script `bundle_outbreak_gas.py` (copy of bundle_werewolf_gas.py with renamed markers).
- Fresh GAS deploy + first live class playtest; collect student rules feedback.
- Optional: outbreak-specific beat types (diagnosis card) in story_engine for extra drama.
- night_music.mp3 is copied from the werewolf set; replace with a school-appropriate
  quiet ambience if it howls.
