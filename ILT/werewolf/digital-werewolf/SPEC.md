# Digital Werewolf — design spec

**Status: PRE-BUILD (v0.1).** Student pitch received 2026-11-06, still being written;
gameplay answers pending. This file is the living scope — update it as answers land.
Nothing here is committed design until the answers section says so.

## Why this exists

- A student pitched a digital Werewolf for class play (written pitch, 2026-11-06).
  The pitch is partial: roles + night rules + Detective + Villagers are in;
  the "How does the game work" section is still being typed.
- The paper Werewolf kit already exists one level up (deck, guide, role cards).
  Werewolf is on the played/never-rerun list; the digital angle is the reason to
  revisit. That call is Dave's, and he has made it by commissioning this folder.

## Student's rules as written (intent, not yet confirmed)

- Four roles: **Werewolves, Doctor(s), Detective(s), Villagers**.
- **1 wolf per 10-12 players** → a 28-30 player class gets 2-3 wolves.
- **Multiple** doctors and **multiple** detectives are allowed by the pitch.
- Night order: **wolves kill → doctor saves → detective checks**.
  - Wolves unanimously pick 1 victim.
  - Doctors unanimously pick 1 player to protect; if that player was the wolves'
    target, nobody dies.
  - Detectives unanimously pick 1 player and learn that player's true role.
    The result stays with the detectives.
- Day: the village votes out one player regardless of role.
- Wolves win when wolves equal the remaining villagers (stated earlier in the
  pitch; his final section cut off mid-sentence — re-confirm).
- Special-role density is HIGH as pitched: a 28-30 player class would have
  ~9-10 power roles, about a third of the room. Flagged to the student as
  "is that on purpose?" — classic werewolf at 30 uses one detective, one doctor.

## Contradictions to resolve (asked, answers pending)

1. **Detective claim rule — the big fork.** The pitch says the detective can
   persuade the villagers AND that the detective cannot reveal their true role.
   Those fight. Two coherent readings:
   - (a) open claiming allowed — loud claim-wars, the classic game; or
   - (b) nobody may claim detective (wolves included) — quiet inference game.
   Builder leans (b) for classroom play, but the student must pick.
2. "Put a target on your back" — social consequence (wolves kill persuasive
   players) or an app-enforced penalty? Almost certainly social; confirm.
3. Villager "greatest voting power" — flavor (they outnumber everyone) or a
   mechanical vote-weight bonus?
4. Wolves win condition — parity, or something else in the unwritten ending?

## Open gameplay questions (sent to student, unanswered)

1. "Online" = every kid on their own device in real time, or projector-run?
2. One whole-class game (~28-30) or ~3 parallel 10-player games?
3. Wolf night coordination: secret wolves-only chat, or silent picks with
   unanimity re-pick loop?
4. Doctor self-save allowed? Same target two nights running?
5. Role revealed when someone dies or is voted out?
6. Night 1: wolves kill, or peaceful starter night?
7. Day talk: out loud in the room (app handles secrets only) or in-app chat?
   Builder recommends NO in-app chat — moderation load, school-policy risk.
8. Voting: secret in-app ballot or hands-up? Tie: revote or no elimination?
9. Auto timers or teacher-paced? Teacher god-view console wanted?
10. Dead players: full-reveal spectators or out of the game entirely?
11. Target game length; games per class period?
12. Extra roles beyond the four (Hunter, Bodyguard, ...)?
13. Classroom-only tool, or playable from home? (Home play forces internet
    hosting — likely blocked. Classroom-local keeps it in school.)

## Decisions already made

- **Login: gnspes**, same pattern as Outbreak (Dave, 2026-11-06).
- **Home folder:** `bihi2027/ILT/werewolf/digital-werewolf/` — the game itself
  is student-facing, so the public repo is the right side.
- No student PII in this repo: identity is resolved at join time or
  server-side, Outbreak-style. This spec carries no student names.

## Platform reality

- bihi2027 deploys GitHub Pages from `main`: **static only**. Real-time
  per-device play needs a server; it cannot live on Pages.
- Reuse the Outbreak/Case55 server pattern: a room server on Dave's laptop
  (pod-map bridge runs :8791 live / :8797 test), students join by short URL
  or QR from school wifi.
- **RISK, test before any per-device build:** student Chromebooks/phones must
  be able to reach Dave's laptop over school wifi — separate VLANs are common.
  One-line test: serve a page, join from a student device. If unreachable,
  projector mode is the fallback and the pitch changes shape.
- If per-device works: the server holds ALL state; clients are thin controllers.
  Private info (role, detective results, wolf chat) leaves the server only to
  authorized sessions.

## Recommended first draft (builder recommendation, pre-answers)

One engine, two front-ends, in this order:

1. **Core engine** — pure JS state machine: role deal, night sequence
   (wolf → doctor → detective), day vote, death handling, win detection.
   No UI, deterministic, testable with a scripted game log.
2. **Projector mode, ships first** — deck-style night/day screens plus a
   teacher console for the secret bits. Wolves point while eyes closed
   (classic method), Dave enters the picks, the app announces results,
   runs optional timers, tracks the dead, calls the win. Zero network risk,
   works in any room, deployable the day it is built.
3. **Per-device mode (the student's vision), after the VLAN test passes** —
   join-code lobby, gnspes login, one private screen per role, wolf
   unanimity picker, secret ballot, spectator view for the dead. Same
   engine underneath.

**Default rule set to build v1 against** (defaults, not promises — each one
flips cheaply when the student's answers land):

| Rule | v1 default |
|---|---|
| Wolves | 1 per 10-12 players |
| Doctor | one; no self-save; no repeat target |
| Detective | one; claiming forbidden for everyone (option b) |
| Role reveal on death | no |
| Night 1 | peaceful starter night |
| Day talk | out loud in the room |
| Voting | secret ballot, revote on tie, then no elimination |
| Pacing | auto timers with teacher pause/override |
| Dead players | full-reveal spectators |
| Game shape | one whole-class game, ~15 min |

Role counts are CONFIG, not constants — whether the room runs classic density
(1+1) or the student's 9-10 power roles is a settings line, not a rebuild.

## Folder plan

```
digital-werewolf/
├── SPEC.md        this file — living scope
├── engine/        game state machine (v1)
├── projector/     projector deck + teacher console (v1)
└── server/        room server + per-device client (v2, after the VLAN test)
```

## Change log

- 2026-11-06 v0.1 — first draft from the partial student pitch plus builder
  recommendations. 13 gameplay questions out; 4 contradictions flagged.
