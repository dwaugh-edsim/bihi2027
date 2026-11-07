# Digital Werewolf - Design Spec & v1 Build Notes

**Status: v1.0 IMPROVEMENT PLAN EXECUTED (2026-11-06 evening, after the first live class playtest) - see Change Log.**
Student pitch received 2026-11-06; backend decided same day (**Google Apps Script web app + gnspes identity**). First playable full-class draft (20-30+ students, custom graphics, Class LCD Display, Student Chromebook screen, Teacher God-View, and private GAS backend) is now live for student playtesting and rules feedback.

## Why this exists

- A student pitched a digital Werewolf for class play (written pitch, 2026-11-06).
- The paper Werewolf kit lives one level up (deck, guide, role cards). The per-device digital mechanics and front-of-room Class LCD Display are the freshness angle.

## Shipped Architecture (v0.3)

```
bihi2027/ILT/werewolf/digital-werewolf/          PUBLIC - student-facing, PII-free
├── SPEC.md                    living scope & student-pitch toggle map
├── lcd.html                   Class LCD Display (Strongly Typed 1080p zero-scroll, 20-30+ seats)
├── index.html                 Student Chromebook client + ?demo=1 preview + ?god=1 Teacher Console
├── engine/
│   └── werewolf_engine.js     pure deterministic JS state machine + 20-check self-test suite
└── assets/                    9 bespoke zero-text board-game illustrations (~2.2 MB total)
    ├── bg_day_village.jpg
    ├── bg_night_village.jpg
    ├── banner_victory_village.jpg
    ├── banner_victory_wolves.jpg
    ├── card_back.jpg
    ├── role_werewolf.jpg
    ├── role_doctor.jpg
    ├── role_detective.jpg
    └── role_villager.jpg

bihipri-27/Student_System-priv/digital-werewolf-gas/   PRIVATE - handles @gnspes.ca emails & PIN
├── Code.gs                    lock-free atomic CacheService votes/picks + Path B HMAC verification
└── DEPLOY_README.md           5-minute paste-and-deploy checklist
```

## How the Student's Pitch Rules & Open Questions Are Handled in v1

Every rule from the student pitch is wired into `werewolf_engine.js` and exposed as **1-click Lobby controls** on `lcd.html` so Mr. Waugh and the student designer can test both sides of every open question live in class:

| Pitch Area | v1 Default | Lobby Toggle / Customizability |
|---|---|---|
| Class Size | **28 players** | Quick-pick pills (`20`, `22`, `24`, `26`, `28`, `30`) + smooth slider (`8..36`), or 1-click load from Room 8 Homerooms (`801..903`). |
| Role Density | **Classic Balance** (`3 Wolves, 1 Doc, 1 Det, 23 Villagers` at 28) | 1-click **`Student Pitch (Multi-Role)`** preset (`3 Wolves, 2 Doctors, 2 Detectives`) + individual `-` / `+` steppers on every role card. |
| Multi-Role Unanimity | **Supported** | Multiple Wolves, multiple Doctors, and multiple Detectives see live pack/colleague picks and converge on 1 unanimous target. |
| Night Order | **Wolves -> Doctor -> Detective** | Resolved in exact pitch order; Detective always inspects true role into their private Case Notebook; Doctor save blocks Wolf kill. |
| Night 1 Kill | **Peaceful Starter Night ON** | 1-click toggle (`Peaceful Night 1: ON` vs `LIVE KILL`). On peaceful Night 1, Wolves run a pack coordination dry-run and Detectives get a real Night 1 clue. |
| Detective Claim Fork | **Quiet Inference (`QUIET ONLY`)** | 1-click toggle (`QUIET ONLY` vs `OPEN`). Reminds the room on both LCD and Chromebook screens during Day Debate. |
| Doctor Limits | **No Self-Save, No Repeat Target** | `Doc Self-Save` toggle in Lobby; repeat consecutive target blocked automatically on the Doctor's night grid. |
| Death Role Reveal | **Hidden (`HIDDEN`)** | 1-click toggle (`HIDDEN` vs `REVEAL`) when a player is eliminated at Dawn or Dusk. |
| Day Ballot & Ties | **Secret Ballot + 1 Runoff Revote** | 1-click toggle (`1 RUNOFF` vs `NO EXILE`); includes `Skip / Hold` option and animated Dusk ballot tally bars on the LCD. |
| Night Click Tell Guard | **Villager Night Watch Cover Tap** | Villagers tap 1 personal watch suspect during Night so every Chromebook clicks once, and the front LCD hides individual night checkmarks (showing only aggregate readiness). |
| Eliminated Players | **Silent Ghost Spectators (`TRUTH ON`)** | 1-click toggle (`TRUTH ON` vs `OFF`); unlocks private truth board on the eliminated student's own Chromebook with a strict silent-spectator warning. |
| Win Condition | **Parity** | Village wins when `livingWolves === 0`; Werewolves win when `livingWolves >= livingTown`. |

## Three Play Modes Supported Out of the Box

1. **Instant Classroom / Demo Sync Mode (Zero Server Setup):** Open `lcd.html` on the projector/desktop and click **Student Screen** (`index.html?demo=1`) or **God View** (`index.html?god=1`). Syncs instantaneously across tabs via `BroadcastChannel` with smart AI bots filling any unseated slots.
2. **Projector + Teacher God-View Mode (Eyes-Closed Classroom Play):** Project `lcd.html` to the class, open `index.html?god=1` on the teacher's un-mirrored tablet/laptop, load a Room 8 Homeroom (`801..903`) or Seat Numbers, and enter Night picks from God View.
3. **Live Per-Device Chromebook Mode (Cloud Server):** Deploy `Code.gs` + `Engine.gs` per `bihipri-27/Student_System-priv/digital-werewolf-gas/DEPLOY_README.md`, paste the `/exec` URL in `lcd.html` -> `Setup`, and students join on Chromebooks via Room 8's `@gnspes.ca` Google Sign-In.

## Change Log

- **2026-11-06 v1.0 (improvement plan 2026-11-06, M1+M3+M4 core)** - Night integrity + Story Theatre + server hardening:
  - Engine v2.0.0: `packDecision` rule (`majority_then_teacher` default, `unanimous`, `plurality`) - split packs are NEVER resolved at random; the teacher decides via the new Pack Split panel (`night_decision`). Bots never hold Werewolf/Doctor/Detective when enough humans are seated; Auto-Bots defaults OFF in cloud mode (demo only, or explicit Test Mode). Per-game `epoch` on every server action key (Play-Again ghost picks fixed). `nightReports[]` written every night and shown as a "What happened tonight" card in `run.html` before the reveal. Pack Lock states (Coordinating / Locked on Seat #N / Split) + optional `wolfConfirmStrike` confirm inside the wolf peek; private dawn strike result for wolves; neutral `Choice recorded: Seat #NN` status line on the open student screen (role-leak fix). Doctor's saved player is no longer named by default (`nameSavedPlayer` toggle).
  - New pure modules: `engine/story_engine.js` (reveal/beat builder) + `engine/story_content.js` (Moonhollow places, 40+ personas, fragment pools, preset epitaphs; spooky/campfire tones, no gore). `shared/config.js` (action names, asset map, copy, timers), `shared/sfx.js` (WebAudio howl/heartbeat/bell/gavel/clang/sting), `shared/tts.js` (voice pick), `shared/theatre.js` + `css/theatre.css` (full-screen LCD theatre: blackout, typed narration, victim card, role flip or sealed card, last words countdown, ghost rules, exile tally, victory roster flip; Space/Right next, Left back, S skip, P pause, T read-aloud; reduced-motion respected; reveal IDs remembered in sessionStorage). Student devices get a light synced mirror plus personal victim/exile screens with a preset-only epitaph picker. Theatre art uses the 9 generated illustrations now, with `shared/config.js` ASSETS slots for the planned `scene_*.jpg` files (auto-fallback until they land).
  - `run.html` cockpit: real engine phase names (DAY_DISCUSSION/DAY_VOTE fix), working `pause_timer`/`add_time`/`moderator_override`, no `confirm()`/`prompt()` (modal system + toasts), connection pill, server/engine/epoch footer, night-gate primary button label, Pack Split panel, theatre control bar, `?god=1` on `index.html` now redirects to `run.html`.
  - `lcd.html`: projector-only during play (controls hidden, Ctrl+. teacher strip), theatre overlay, Auto-Bots OFF in cloud, Setup never `create_game`s over a live game, debounced class-size slider, connection pill + toasts.
  - All emojis removed from UI text. `node engine/selftest_node.js` runs the 91-check suite (A8 + story guarantees) without a browser.
  - Private `Code.gs` v2.0.0 (R8-WEREWOLF-2.0.0): cache-only hot state (9KB fix), epoch action keys + purge, stale-submit guard, JSON-only errors + `serverNowMs`, PIN throttle/lockout + strict `endsWith('@gnspes.ca')`, burst-join cache-only writes with `busy` retry, new actions `night_decision`/`reveal_control`/`kick_player`/`remove_empty_seats`/`moderator_override`/`lcd_heartbeat`; engine bundled between markers by `tools-priv/bundle_werewolf_gas.py` (byte-identical verified).
- **2026-11-06 v0.4** - Anti-Cheat / Anti-Shoulder-Surfing overhaul on `index.html`: replaced the large role card and role-specific Night headers with a 100% camouflaged single-column console (identical heading, neutral `SET` / `WAITING` status line, and uniform seat buttons across all roles) plus a tiny `216px` monochrome press-and-hold **Corner Micro-Peek** (`Hold [ID] to Peek` or hold `P` key, instant snap-shut on release/blur + 3.2s max timer, and `<- L` / `-> R` corner flip away from pod neighbours).
- **2026-11-06 v0.3** - Built full v1 playable draft: `werewolf_engine.js` (20/20 self-tests passing), 9 Qwen-Image-3.0-Pro custom illustrations in `assets/`, Strongly Typed 1080p/864p `lcd.html` Class Display, Chromebook-tuned `index.html` (with Tap-to-Peek card cover, Villager Night Watch anti-tell, `?demo=1` seat switcher, and `?god=1` Teacher Console), and private `Code.gs` server.
- **2026-11-06 v0.2** - Backend decided by Dave: Google Apps Script web app + gnspes identity. Per-device mode promoted to v1 primary; four server constraints documented.
- **2026-11-06 v0.1** - First draft spec from partial student pitch + 19 open gameplay questions.
