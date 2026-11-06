# Digital Werewolf - Design Spec & v1 Build Notes

**Status: FIRST DRAFT BUILT (v0.3, 2026-11-06).**
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

- **2026-11-06 v0.3** - Built full v1 playable draft: `werewolf_engine.js` (20/20 self-tests passing), 9 Qwen-Image-3.0-Pro custom illustrations in `assets/`, Strongly Typed 1080p/864p `lcd.html` Class Display, Chromebook-tuned `index.html` (with Tap-to-Peek card cover, Villager Night Watch anti-tell, `?demo=1` seat switcher, and `?god=1` Teacher Console), and private `Code.gs` server.
- **2026-11-06 v0.2** - Backend decided by Dave: Google Apps Script web app + gnspes identity. Per-device mode promoted to v1 primary; four server constraints documented.
- **2026-11-06 v0.1** - First draft spec from partial student pitch + 19 open gameplay questions.
