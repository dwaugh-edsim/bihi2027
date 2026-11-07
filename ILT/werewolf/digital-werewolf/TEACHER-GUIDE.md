# Moonhollow Werewolf — Teacher Guide & System Status

*2026-11-07. Version: engine 2.1.0 / server R8-WEREWOLF-2.1.2, live and validated end to end (31/31 automated checks on the production server).*

---

## 1. The three surfaces

| Page | Who uses it | What it is |
|---|---|---|
| **`run.html`** | Teacher (laptop) | The ONE teacher console: open/close rooms, seats, rules, every phase button, secret god-view, night intel, Story Theatre remote, **Teacher Coach** panel |
| **`lcd.html`** | Projector | Display-only class screen: hero banner, seat grid, timer, chronicle, full-screen Story Theatre. Auto-follows the server's active room — zero controls (only `F` for fullscreen) |
| **`index.html`** | Students (Chromebooks) | Join with @gnspes.ca sign-in, camouflaged night console, press-and-hold corner role peek (`Hold [ID]` / `P` key) |

Server: single-file Apps Script `gas/Code.gs` (this repo), deployed web app.
Health probe: `<EXEC_URL>?action=get_health` — always check `serverVersion`/`engineVersion` after any redeploy.

## 2. Running a real class (quick start)

1. **Open the room**: `run.html` → enter Teacher PIN → press **Open Room on Server** (the console binds to the room code shown — `WOLF-E8SQ` for 703, `WOLF-BFJJ` for 902, or type your own).
2. **Seats**: students join from the link on the projector footer. Late/missing devices: **Add seat** (claims a free placeholder), **Rename** any seat, **Kick** wrong joins — all in the Live Roster.
3. **Rules** (Lobby only): presets or steppers for Wolves/Doctor/Detective, 1-click toggles (Peaceful Night 1, Quiet vs Open claiming, Doc self-save, reveal-on-death, tie runoff, ghost truth).
4. **Deal Roles & Start Night 1 →** — the cockpit walks you through every phase (see Teacher Coach, §4).

## 3. Rehearsal mode (practice without kids)

The bots can play every kid input:

1. **`run.html`** — PIN → room open → **Test Mode: ON** (Lobby only!) → **Deal Roles**.
   - Advance by hand to practice each button, or flip **Auto-play: ON** (topbar) and watch a whole game play itself.
   - Test Mode drives bot seats *and* unclaimed "Seat N" placeholders — but **never a named student seat** (verified by test).
2. **`lcd.html`** — auto-follows the room; the Story Theatre plays each reveal automatically.
3. **`index.html?demo=1`** — a pixel-identical student Chromebook (local demo): practice the corner peek, see how camouflaged the night console is. Not wired to the cloud room.
4. **Real cloud student screen**: sign in with your own @gnspes.ca account on a phone/second device and join the room code — you become a human seat among the bots.

**Remember**: Test Mode can only be toggled in the Lobby. For the real class: Reset to Lobby → Test Mode OFF.

## 4. Teacher Coach panel

`run.html` shows a green **Teacher Coach** card at every phase: what to do (which button, what to watch), what to *say* (verbatim classroom lines — role-reveal whisper script, the night narration cue, Quiet-Rule debate opener, ghost "no reactions" reminder, debrief prompt), plus warnings (pack split needs your decision; Story Theatre has the stage; "REHEARSAL: Test Mode is ON"). Deterministic by design — no LLM key, works offline.

## 5. Mid-game teacher powers

- **Night intel** (Teacher Eyes Only): live wolf picks and lock state, doctor shield, detective target — and a **DOCTOR INTERCEPT** flash when the save matches the strike.
- **Pack Split panel**: if wolves disagree, *you* decide the target (or no kill) — resolution is never random.
- **Night reports**: "What happened tonight" card before each reveal, with history.
- **Story Theatre remote**: Back / Next / Pause / Skip / Read-aloud (Space/Right next, Left back, S skip, P pause, T read-aloud on the projector).
- **Timer**: Pause / +30s in the topbar.
- **Seat actions**: Rename (any phase — names are never secret), Eliminate/Revive (moderator override), Kick (lobby).

## 6. Server & deployment

- Canonical backend: `gas/Code.gs` in this repo (no secrets in the file — `TEACHER_PIN` and `R8_IDENTITY_KEY` are Apps Script **Script Properties**; the teacher PIN reference copy lives in the private repo `bihipri-27/GAS-downloads/werewolf_teacher_pin.txt`).
- Redeploy: paste `gas/Code.gs` into the Apps Script project → **Ctrl+S** (no orange dot!) → Deploy → Manage deployments → ✏️ Edit → **Version: New version** → Deploy (same URL). Verify with `?action=get_health`.
- `tools-priv/bundle_werewolf_gas.py` (private repo) re-bundles the engine into Code.gs after any `engine/*.js` edit; `--check` verifies byte-identity.
- Engine self-tests: `node engine/selftest_node.js` (107 checks).
- Locking: moderator/join paths use a CacheService soft mutex — **LockService was removed** (2.1.1) after it refused all locks across two fresh projects.

## 7. Troubleshooting

| Symptom | Cause & fix |
|---|---|
| Console shows "No Room / Open Room" | No game for that code on the server — press **Open Room on Server** |
| LCD shows "Waking the Class Display" forever | Room not open, or wrong `?game=` — open the room in `run.html`; the LCD follows the active room automatically |
| Toggle/Test Mode button flips back | Rules only change in the Lobby — reset to Lobby first |
| Test Mode did nothing | It was toggled after roles were dealt — reset to Lobby, toggle, re-deal |
| Health `engineVersion` older than expected | Deployment didn't take: save the editor (no orange dot), then Manage deployments → Edit → **New version** (same URL) |
| Wolf never kills / nobody dies | Wolves are placeholder seats and Test Mode is OFF, or pack split unresolved (decide it in the Pack Split panel), or Peaceful Night 1 is on |
| Cockpit froze on old state | Check the connection pill; polls retry automatically every ~3.5s |

## 8. History in one paragraph

Built 2026-11-06 from a student pitch (engine + LCD + Chromebook client + GAS backend). 2026-11-06 evening: night integrity (never-random pack resolution), Story Theatre, hardening — but the deployed GAS kept running a stale engine; the cloud Test Mode failed until the correct redeploy. 2026-11-07: diagnosed the full stack (stale deployment → unsaved editor paste → wedged LockService at Google's level → replaced with a CacheService soft lock), shipped the v2.1 consolidation (run.html = the one teacher console, lcd.html display-only, seat add/rename/kick, Open Room binding), moved `Code.gs` into this repo, and validated everything with a 31-check live playthrough (7-night game, werewolves parity win).

## 9. Optional leftovers (nobody is blocked on these)

- Upgrade `R8_IDENTITY_KEY` off its placeholder value — must be set on the **R8 Identity app and the werewolf project at the same time** or student sign-in breaks.
- The two old GAS projects can be deleted outright (the live one is the `AKfycbz6RDat...` deployment); delete their stale `ww_state_*` / `ww_emap_*` script properties first if you want the history gone too.
- Future idea: "AI director" coaching via the projector's browser-local LLM key (richer per-round narration/hints) — the deterministic coach stays the default; CORS must be preflighted first (house rule).
