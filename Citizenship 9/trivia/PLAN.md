# CIT9 Geo Game - World Atlas Arena (maps + flags + trivia + capitals + oceans)

Status: **complete and playable** (`index.html`, `geo_data.js`, four question banks,
and vendored `assets/`). Folder: `Citizenship 9/trivia/`.

## Goal
An engaging online geography game for Citizenship 9 (also useful for the NS/Canada
map checkpoint): students sign in with their school Google account, play fast-paced
shuffled rounds of interactive map, flag, and country trivia challenges, earn rank
emblems, and compete on personal and class leaderboards. Single mixed pool - no
separate local/Canada/world levels. Every item carries its own difficulty
(`easy` / `medium` / `hard`).

## Files in this folder
| File | Contents |
|---|---|
| `index.html` | World Atlas Arena game UI (gate, lobby, Leaflet map stage, flag/trivia arena, Intel reveal card, results review, Web Audio SFX, confetti, self-test) |
| `geo_data.js` | Bank loader, country metadata index, distractor builder, round builder (standard / Challenge / seeded Daily / topic passes incl. Canada), rank/XP definitions |
| `trivia_90.js` | 155 base country-trivia items (`window.GEO_TRIVIA`) across easy/medium/hard |
| `trivia_extra.js` | 89 extra items: capitals, oceans/seas, Africa & South Asia, Canada/Nova Scotia, map skills. Merged into `window.GEO_TRIVIA` after the base bank |
| `canada_trivia.js` | 77 Canadian geography + history items (ages 13-15, `topic:'canada'`, cn-prefix IDs). Merged into `window.GEO_TRIVIA` after the extra bank |
| `maps_60.js` | 80 map items (`window.GEO_MAPS`) - `iso`, `name`, `mode`, `maxZoom` |
| `flags_60.js` | 80 world flag items (`window.GEO_FLAGS`) - `iso`, `name`, 4 options |
| `canada_flags.js` | 13 provincial/territorial flag items (`window.GEO_PROV_FLAGS`) - ISO 3166-2 `iso` (CA-NS...), `prov:true`, `region`, `pop`, `topic:'canada'`. Merged into `window.GEO_FLAGS` |
| `assets/leaflet/` | Vendored Leaflet 1.9.4 (`leaflet.js`, `leaflet.css`, MIT) |
| `assets/world_countries.js` | Merged Natural Earth 110m + 50m country borders (`window.WORLD_GEOJSON`, 235 countries) + `.geojson` source |
| `assets/flags/` | 138 world `4x3` SVG flags (`<iso_lower>.svg` from `flag-icons`) + 13 official provincial/territorial flags (`ca-XX.svg`, Wikimedia Commons public-domain official symbols) |
| `PLAN.md` | This architecture and design reference |

**Pool: 494 items** = 80 maps + 93 flags + 321 trivia (96 easy / 129 medium / 96 hard).
Run `python tools-priv/trivia_bank_lint.py` to verify the banks after any edit.

## Item model (all banks)
`{ id, type, diff, pts, ... }` - `type` = `map` | `flag` | `trivia`; `diff` = `easy` |
`medium` | `hard`; `pts` = `100` / `200` / `300` by tier. Options are shuffled per
round. Map-highlight and flag options include documented lookalikes (Romania/Chad,
Monaco/Indonesia, Australia/New Zealand, Ivory Coast/Ireland) at the hard tier.

Trivia answers may be a country, a city, or a body of water. Non-country answers
resolve to no ISO: they carry no flag, are never offered as a Combo or click-on-map
item, and the map is not clickable for them.

## Round modes
**Endless is the default Round Type** (2026-11-18); Standard and Challenge are one
click away and the choice sticks for the session.
- **Endless (default)** - deals one fresh item per call (`GEO_ENGINE.nextEndlessItem`):
  Q1-3 Easy, Q4-7 Medium, Q8+ Hard forever, per-question timer shrinking after Q12
  (min 6s). The run ends only on **3 strikes** (wrong or timed-out answers) or when
  the player quits; counter shows Q / infinity and a strike meter. Repeats only
  when a tier is exhausted.
- **Standard Mixed** - 10 items on the common escalating curve (Q1-3 Easy, Q4-7
  Medium, Q8-10 Hard), balanced to 3 maps / 3 flags / 4 trivia.
- **Challenge** - 10 hard items, 14 seconds each, 1.5x points, no Combo upgrade.
  Tracks its own `best.challenge`; does not touch the Standard best.
- **Daily Challenge** - a seeded 10-item Standard round (`GEO_ENGINE.buildDailyRound`),
  identical for everyone on a given date, one attempt per day, no Combo upgrade.
  Ranked on the server's **Today** board.

## Map rendering
- **Leaflet (MIT), vendored locally** into `assets/leaflet/` - no CDN at runtime.
- **Country borders: Natural Earth 110m + microstate 50m GeoJSON, committed locally**.
- Every map item keeps **context**: `map.fitBounds(feature.getBounds().pad(0.6), { maxZoom })`.
  `maxZoom` is the difficulty lever: easy 6, medium 4, hard 3.
- Modes: `click` (student clicks the named country) and `highlight` (target filled,
  pick its name from 4 same-continent options). Hard-tier items can upgrade into
  **Combo Strike** (`flag-map` or `trivia-map`). Map-click items allow three attempts
  with a -35 pt penalty per miss.

## Flags
Local SVG per country at `assets/flags/<iso_lower>.svg`. **Not emoji** - Windows
Chrome shows flag emoji as letter pairs, so SVGs keep teacher + student screens
identical.

### Provincial + territorial flags (2026-11-19)
All 13 provinces and territories ride in the same flag bank with
`prov:true` items (`canada_flags.js`). Their SVGs are the **official designs**
vendored from Wikimedia Commons at `assets/flags/ca-XX.svg` (ISO 3166-2 lowercased,
e.g. `CA-NS` -> `ca-ns.svg`). Because provinces are not GeoJSON countries:
no Combo Strike, no map clicks, and the Intel card shows the province name,
`Canada - Province/Territory`, and its approximate population instead of country
stats. Provincial flags carry `topic:'canada'`, so they appear in Mixed and
Endless draws and in the **Canada Pass** topic round, but not in the World Flags
pass. The question prompt reads "Which province or territory flies this flag?"

## Sign-in (same pattern as the Centennial sim)
Splash gate -> popup to the school identity endpoint (`@gnspes.ca` domain-enforced,
HMAC-signed `{ email, ts, sig }` returned via `postMessage` or `#r8id=`) -> stored in
`sessionStorage`. `?demo=1` gives a local preview with a demo identity.
**A section must be picked before any round starts** (`requireSection()` guards
`startRound`/`startDaily`; blocked starts toast + pulse the Section dropdown): scores
land on the class leaderboard by section, so an empty section loses the round.

### Privacy invariant (emails never in the repo)
Emails exist ONLY server-side (GAS roster script property + vault sheet as storage
key) and in the signed identity object in the student's own sessionStorage. The
vault `get_leaderboard` action returns pre-formatted `First Ls.` labels resolved
server-side, NOT raw emails. Keep the repo copy of `vault.gs` in sync with the
deployed action.

## Scoring
Modes: Standard (fixed 10, 3E/4M/3H ramp), Challenge (10 hard, 14s, 1.5x), Daily (same 10
for everyone), and **Endless** (added 2026-11-12): keeps dealing fresh questions with
difficulty ramping by question number (Q1-3 easy, Q4-7 medium, Q8+ hard), the per-question
timer shrinking after Q12 (min 6s), and the run ends only on **3 strikes** (missed
questions) or when the player quits; counter shows Q / infinity and a strike meter.
`GEO_ENGINE.nextEndlessItem` draws one fresh item per call (repeats allowed only when a
tier is exhausted).
Per item: `pts` by tier + pace/accuracy bonus (Sprint up to 30%, Zen 25% on a clean
first-try hit), minus 35 per wrong attempt, times the streak multiplier
(`x1.0` / `x1.2` / `x1.5` / `x2.0`), times the Challenge multiplier (`1.5`).
**Wrong answers award no XP.** A perfect 10/10 round adds a 250 pt/XP bonus.

### Anti-grind
XP is capped at **2,000 per calendar day** (`state.xpToday`); further rounds still
score but add no XP. The class leaderboard's default **Best Round** board ranks on
skill (`best.overall`), not lifetime XP. XP and Today boards are available as
separate views.

### Streak carry
A streak of 3+ at the end of a round carries into the next round (`state.carryStreak`).

## Progression
Completing 2 Mixed rounds (or scoring 7/10+) earns **+1 Free Topic Pass**, unlocking
a focused 10-question round on **Culture & Modern Era**, **World Flags**,
**Maps & Borders**, **Landmarks & Facts**, or **Canada** (geography + history +
provincial flags). Ranks: Traveller (0), Navigator (2,000), Cartographer (5,000),
World Fellow (10,000).

## Adaptations (documented supports, built in silently)
Untimed Zen pace toggle with equal score ceiling, chunked 10-item rounds, concise
read-aloud-friendly trivia text, keyboard shortcuts (`1`-`4`, `Enter`), high-contrast
SVG flags, microstate click-assist markers, post-answer Intel reveal card, no personal
content, no hard fail states, reduced-motion support for the splash globe.

## Conventions honoured
Standalone zero-dependency HTML/JS on GitHub Pages, no build step; course-level
naming only; student-facing labels say "Server"; colour is rich and screen-native;
zero em/en-dashes; no PII/PINs in tracked files.
