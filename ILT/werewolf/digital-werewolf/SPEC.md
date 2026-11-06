# Digital Werewolf — design spec

**Status: PRE-BUILD (v0.2).** Student pitch received 2026-11-06, still being written;
gameplay answers pending. Backend decided same day: **GAS-backed, gnspes identity**
(Dave). This file is the living scope — update it as answers land.

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
- **Backend: Google Apps Script web app**, Sheets/Cache-backed, riding the
  proven Student_System/Outbreak stack (Dave, 2026-11-06). See Platform reality.
- **Home folder:** `bihi2027/ILT/werewolf/digital-werewolf/` — the game engine
  and client are student-facing, so the public repo is the right side.
  The GAS server code touches roster emails, so IT lives private
  (`bihipri-27/Student_System-priv/digital-werewolf-gas/`).
- No student PII in the public repo: emails/PINs stay Google-side and in the
  private repo only. This spec carries no student names.

## Platform reality — GAS-backed (v0.2)

- bihi2027 deploys GitHub Pages from `main`: **static only**. The game logic
  could live there, but real-time state cannot. That problem is solved by
  putting the backend on a **Google Apps Script web app** instead of a local
  server: GAS runs on Google's machines, so **Dave's laptop is not part of the
  game at all** — no server process, no VLAN reachability question (students
  demonstrably reach Google from school Chromebooks: Outbreak proves it), and
  the game keeps running even if his laptop sleeps or leaves the room.
- **Identity for free:** deployed "execute as me, users in domain," the web app
  knows the caller's gnspes email (`Session.getActiveUser()`), same as the
  existing Student_System login. Chromebooks are already signed in; personal
  phones only work if the kid signs into their gnspes Google account in the
  browser. Guidance to students: play on your Chromebook.
- **Storage:** CacheService for hot state (alive/dead map, night picks, votes,
  phase clock), ScriptProperties for durable game config, Sheets only for
  things worth keeping after class (game logs, scores). The audit-priv lessons
  apply directly: **confirm-after-write** from api.js, an
  `action=get_health` version endpoint to catch repo↔deployment drift
  (the A1 lesson from the 902 loss), and append-only logs to dodge the
  50k-row read wall.
- **Four design constraints to build around:**
  1. **Latency:** GAS round-trips run 1-3s (worse cold). Clients poll on a
     jittered 3-5s interval. That is fine for Werewolf — night phases are
     30s+, day talk is minutes — but it rules out any fast-reflex mechanic,
     and wolf unanimity re-pick loops will feel a beat slow. Accepted.
  2. **Write contention:** 28 kids acting in the same 60s vote window.
     Votes/actions are **append-only** writes (own cache key or log row, no
     read-modify-write), polls are cache reads (no lock), and the ONLY
     read-modify-write in the system is the moderator's phase advance, under
     LockService. Client submissions carry random jitter.
  3. **Secret state must never land anywhere a kid can open.** Roles, detective
     results, and wolf chat live in CacheService/ScriptProperties keyed by
     game id — **never in a sheet students could find by URL**. Sheets hold
     public or post-game data only. "Who's the wolf" is exactly what a kid
     will go hunting for; the design assumes they will try.
  4. **PII placement:** the GAS server source handles emails/PINs, so it is
     private-repo material. The public repo holds only PII-free game code
     (engine + client HTML). The GAS app serves the client via HtmlService,
     importing the same engine source — one paste-deploy, and the audit's
     version endpoint proves which code is actually live.

## Recommended first draft (v0.2 — GAS per-device is now PRIMARY)

One engine, one GAS app, three screens. The old "projector first, per-device
after the VLAN test" phasing is retired — GAS removes the VLAN blocker
entirely (Outbreak already proves students reach Google), so the student's
per-device vision is now the v1 target, not a v2.

1. **Core engine** — pure JS state machine: role deal, night sequence
   (wolf → doctor → detective), day vote, death handling, win detection.
   No UI, no transport, deterministic, testable with a scripted game log.
   Lives in this public folder; imported by the GAS app at deploy.
2. **GAS server** (`bihipri-27/Student_System-priv/digital-werewolf-gas/`) —
   identity, state store, action endpoints (join, night-pick, vote,
   phase-advance, get_health), all following the Student_System patterns:
   confirm-after-write, LockService on the moderator transition, CacheService
   hot state, secrets never in sheets.
3. **Three client screens, one app:**
   - **Student screen** (per-device, the student's vision): join by class +
     PIN, one private screen per role, wolf unanimity picker, secret ballot,
     spectator view for the dead.
   - **Moderator screen** (Dave, projector): phase clock, day/night banners,
     announcements, dead list, win call, pause/override. This REPLACES the
     old standalone projector-mode plan — it is just a privileged client,
     not a separate build.
   - **God view** folded into the moderator screen (see-all, kick, force-end).

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
bihi2027/ILT/werewolf/digital-werewolf/     PUBLIC — student-facing, PII-free
├── SPEC.md        this file — living scope
├── engine/        game state machine (pure JS, no UI, no transport)
└── client/        student screen + moderator screen HTML/JS

bihipri-27/Student_System-priv/digital-werewolf-gas/   PRIVATE — handles PII
└── Code.gs + appsscript notes   identity, state store, action endpoints
```

The GAS app serves the client via HtmlService and imports the engine source,
so the public folder never carries roster data and the private folder never
carries UI. Deploy = paste both into one Apps Script project.

## Change log

- 2026-11-06 v0.2 — backend decided by Dave: GAS web app + gnspes identity
  (Student_System pattern). Per-device mode promoted to v1 PRIMARY; VLAN risk
  retired; projector console folded into the moderator screen. Four GAS
  constraints added (latency, contention, secret-state placement, PII split).
- 2026-11-06 v0.1 — first draft from the partial student pitch plus builder
  recommendations. 13 gameplay questions out; 4 contradictions flagged.
