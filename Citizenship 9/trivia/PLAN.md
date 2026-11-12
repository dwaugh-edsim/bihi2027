# CIT9 Geo Game — plan (maps + flags + country trivia)

Status: **question banks drafted, game page not built yet.** Folder: `Citizenship 9/trivia/`.

## Goal
A basic online geography game for Citizenship 9 (also useful for the NS/Canada map
checkpoint): students sign in with their school Google account, play shuffled rounds of
map, flag, and trivia questions, and compete on leaderboards. Single mixed pool — no
separate local/Canada/world levels. Every item carries its own difficulty
(easy / medium / hard), because recognizing the UK is easier than Thailand.

## Files in this folder
| File | Contents |
|---|---|
| `trivia_90.js` | 90 country-trivia items, 30 per tier (`window.GEO_TRIVIA`) |
| `maps_60.js` | 60 map items, 20 per tier (`window.GEO_MAPS`) — iso, name, mode, maxZoom |
| `flags_60.js` | 60 flag items, 20 per tier (`window.GEO_FLAGS`) — iso, name, 4 options |
| `PLAN.md` | this plan |
| `index.html`, `geo_data.js`, `assets/` | **to be built** — game page, loader, vendored Leaflet + world GeoJSON + flag SVGs |

## Item model (all banks)
`{ id, type, diff, pts, ... }` — `type` = `map` | `flag` | `trivia`; `diff` = easy/medium/hard;
`pts` = 100/200/300 by tier. Round = shuffle of the combined pool, with a balance rule:
a 10-item round guarantees at least 2 map, 2 flag, 1 trivia, rest random. Options are
shuffled per round. Map-highlight and flag options may include documented lookalikes
(Romania/Chad, Monaco/Indonesia, Australia/NZ) at the hard tier.

## Map rendering
- **Leaflet (MIT), vendored locally** into `assets/` — no CDN at runtime, so school
  Chromebook filtering can't break it and the repo stays zero-build standalone.
- **Country borders: world-atlas 110m GeoJSON, committed locally** — one `L.geoJSON`
  layer, no tile server (avoids OSM tile-policy issues and works offline-ish).
- Every map item keeps **context**: `map.fitBounds(feature.getBounds().pad(0.6), {maxZoom})`
  so the target is shown among its neighbours. `maxZoom` is the difficulty lever:
  easy 6 (big), medium 4, hard 3 (small shape in a crowded region).
- Modes: `click` (student clicks the named country) and `highlight` (target filled,
  pick its name from 4 same-continent options). `flag-map` combo (flag shown, click the
  country) and `trivia-map` (trivia question, click the answer country) are hard-tier
  presentation choices made at load time.

## Flags
Local SVG per country at `assets/flags/<iso>.svg` (flag-icons set). **Not emoji** —
Windows Chrome shows flag emoji as letter pairs, so the teacher's machine would look
broken while ChromeOS looks fine. SVGs are identical everywhere.

## Sign-in (same pattern as the Centennial sim)
Splash gate → popup to the school identity endpoint (`@gnspes.ca` domain-enforced,
HMAC-signed `{email, ts, sig}` returned via postMessage) → stored in sessionStorage.
Allowlisted to the GitHub Pages origin; `?demo=1` gives a local preview with a demo
identity. Chromebooks wipe localStorage, so all real state lives server-side.

## Persistence + leaderboard
- Save/load per student via the existing vault webhook (`submit_assignment` /
  `load_assignment`) under a new task name (e.g. `CIT9-GeoGame`), storing
  `best: { overall, easy, medium, hard }` and round history.
- Leaderboard needs one new vault action, `get_leaderboard` (PIN-gated like
  `get_submissions`), grouping rows by task + tier. Screens show **first name + last two
  initials only** — never full names/emails on any display. Overall board + per-tier boards.

## Scoring
Per item: `pts` by tier + time bonus (shrinks with tier and with elapsed time) −
wrong-pick penalty. Timed sprint mode for competition; **untimed practice mode with
identical scoring** always available (extra-time compatible, adapted silently — never
labelled on a student's screen). Streak multiplier optional per round.

## Adaptations (documented supports, built in silently)
Untimed path, chunked short rounds, one-line read-aloud-friendly trivia text, high-contrast
flags, no personal content, no hard fail states.

## Conventions honoured
Standalone zero-dependency HTML/JS on GitHub Pages, no build step; course-level naming
only (no class numbers in filenames); student-facing labels say "Server"; colour is fine
here (screen-only, not a printable); no PII/PINs in tracked files.

## Next steps
1. Vendor `leaflet.js`/`leaflet.css` + world-atlas 110m GeoJSON + flag SVGs into `assets/`.
2. Build `index.html` + `geo_data.js`: gate → lobby (best scores, leaderboard) → round →
   results; loader merges the three banks and tags type/diff/pts.
3. Add `get_leaderboard` to the vault script (deploy separately) — until then the game
   saves bests but shows only the student's own board.
4. Wire into Classroom; add task to `Student_System/assignments_data.js` with outcome ref.
