# CIT9 Geo Game - World Atlas Arena (maps + flags + country trivia)

Status: **complete and playable** (`index.html`, `geo_data.js`, 3 question banks, and vendored `assets/`). Folder: `Citizenship 9/trivia/`.

## Goal
An engaging online geography game for Citizenship 9 (also useful for the NS/Canada map checkpoint): students sign in with their school Google account, play fast-paced shuffled rounds of interactive map, flag, and country trivia challenges, earn rank emblems, and compete on personal and class leaderboards. Single mixed pool - no separate local/Canada/world levels. Every item carries its own difficulty (`easy` / `medium` / `hard`), because recognizing the UK is easier than Thailand.

## Files in this folder
| File | Contents |
|---|---|
| `index.html` | World Atlas Arena game UI (gate, command lobby, Leaflet map stage, flag/trivia arena, Intel reveal card, Web Audio SFX, confetti, results) |
| `geo_data.js` | Bank loader, country metadata index, same-continent distractor generator, round builder, and rank/XP definitions |
| `trivia_90.js` | 155 country-trivia items (`window.GEO_TRIVIA`) across easy/medium/hard, covering World Facts & Landmarks + Culture & Modern Era (20th century to 2020s) |
| `maps_60.js` | 80 map items (`window.GEO_MAPS`) - `iso`, `name`, `mode`, `maxZoom` |
| `flags_60.js` | 80 flag items (`window.GEO_FLAGS`) - `iso`, `name`, 4 options |
| `assets/leaflet/` | Vendored Leaflet 1.9.4 (`leaflet.js`, `leaflet.css`, MIT) |
| `assets/world_countries.js` | Merged Natural Earth 110m + 50m country borders (`window.WORLD_GEOJSON`, 235 countries) + `.geojson` source |
| `assets/flags/` | 138 local `4x3` SVG flags (`<iso_lower>.svg` from `flag-icons`) |
| `PLAN.md` | This architecture and design reference |

## Item model (all banks)
`{ id, type, diff, pts, ... }` - `type` = `map` | `flag` | `trivia`; `diff` = `easy` / `medium` / `hard`; `pts` = `100` / `200` / `300` by tier. Every round uses a single unified Mixed mode with a common escalating curve (`Q1-3` Easy -> `Q4-7` Medium -> `Q8-10` Hard, balancing maps, flags, and trivia). Options are shuffled per round. Map-highlight and flag options include documented lookalikes (Romania/Chad, Monaco/Indonesia, Australia/New Zealand, Ivory Coast/Ireland) at the hard tier.

## Map rendering
- **Leaflet (MIT), vendored locally** into `assets/leaflet/` - no CDN at runtime, so school Chromebook filtering cannot break it and the repo stays zero-build standalone.
- **Country borders: Natural Earth 110m + microstate 50m GeoJSON, committed locally** - one `L.geoJSON` layer, no external tile server (avoids OSM tile-policy issues and works offline).
- Every map item keeps **context**: `map.fitBounds(feature.getBounds().pad(0.6), { maxZoom })` so the target is shown among its neighbours. `maxZoom` is the difficulty lever: easy 6 (big), medium 4, hard 3 (small shape in a crowded region).
- Modes: `click` (student clicks the named country on the map) and `highlight` (target filled, pick its name from 4 same-continent options). Hard-tier items in Mixed Arena can also upgrade into **Combo Strike** (`flag-map` or `trivia-map`: identify the flag or trivia clue by clicking the country on the map).

## Flags
Local SVG per country at `assets/flags/<iso_lower>.svg` (`flag-icons` 4x3 set). **Not emoji** - Windows Chrome shows flag emoji as letter pairs, so the teacher's machine would look broken while ChromeOS looks fine. SVGs render identically everywhere.

## Sign-in (same pattern as the Centennial sim)
Splash gate -> popup to the school identity endpoint (`@gnspes.ca` domain-enforced, HMAC-signed `{ email, ts, sig }` returned via `postMessage` or `#r8id=`) -> stored in `sessionStorage`. Allowlisted to the GitHub Pages origin; `?demo=1` (or the off-origin Local Preview button) gives a local preview with a demo identity. Chromebooks wipe `localStorage`, so all real state lives server-side.

### Privacy invariant (emails never in the repo)
Verified 2026-11-12: `git grep` for real student emails (`initials+digits@gnspes.ca`)
across all tracked files = 0 matches; `trivia/` = 0. Emails exist ONLY server-side
(GAS roster script property + vault sheet as storage key) and in the signed identity
object in the student's own sessionStorage. Hardening: the vault `get_leaderboard`
action should return pre-formatted `First Ls.` labels resolved server-side from the
private roster, NOT raw emails, so other players' emails never reach the client.
Keep the repo copy of `vault.gs` in sync with the deployed action (get_leaderboard).
### Display names (First L.)
GNSPES emails are `initials+number@gnspes.ca`, so names are NOT derivable client-side;
the public roster is names-only by design. Add a `lookup` action to the identity
endpoint: verify the signed `{email, ts, sig}`, map email -> `{firstName, lastInitial,
homeroom}` from the private roster (script property, never in a repo), return only
`First L.` for the requester's own email. Leaderboard rows (keyed by email in the vault)
are resolved to `First L.` the same way at render time — full names/emails stay
server-side; the vault stores only email + scores. All sections 801-804 / 901-903 are
in the roster, so per-homeroom boards work. Matches the existing `resolve_student`
convention (`firstName` + `lastInitial`).

## Teacher controls (dwaugh@gnspes.ca)
The identity endpoint HMAC-signs the email, so a signed `dwaugh@gnspes.ca` is
cryptographically the teacher. The page reveals teacher UI on that client-side check
ONLY; every mutation is re-authorized server-side: vault.gs (R8-VAULT-0.4.0) adds
`teacher_list` / `teacher_delete_user` / `teacher_reset_all`, each verifying the sig
AND checking a server-side `TEACHER_EMAILS` script property (never in any repo).
Client: HUD "Teacher" button -> panel in the lobby lists saved rows (shown as First Ls.
via formatDisplayName; email used only as an opaque handle for delete calls) with
per-user Delete and a confirm-guarded Reset-ALL. Deploy note: set `TEACHER_EMAILS` on
the vault project and redeploy the web app for the actions to go live.

## Persistence + leaderboard
- Save/load per student via the existing vault webhook (`submit_assignment` / `load_assignment`) under task `CIT9-GeoGame`, storing `best: { overall, easy, medium, hard }`, total XP, best streak, and recent round history.
- Leaderboard queries `get_leaderboard` gracefully and falls back cleanly to the student's personal board until `get_leaderboard` is deployed on the vault script. Screens show **first name + last two initials only** (`First Ls.`) - never full names or emails on any display.

## Scoring
Per item: `pts` by tier + pace/accuracy bonus (scaled by streak multiplier `x1.0` -> `x2.0`). Timed **Sprint** mode adds countdown urgency; **Zen (Untimed)** mode awards an equivalent clean-solve bonus on first-try hits so untimed players have identical scoring potential (extra-time compatible, adapted silently - never labelled on a student's screen). Completing 2 Mixed rounds (or scoring 7/10+ in Mixed mode) earns **+1 Free Topic Pass**, letting students run a focused 10-question round on **Culture & Modern Era**, **World Flags**, **Maps & Borders**, or **World Facts** with the same escalating tier curve.

## Adaptations (documented supports, built in silently)
Untimed Zen pace toggle with equal score ceiling, chunked 10-item rounds, concise read-aloud-friendly trivia text, keyboard shortcuts (`1`-`4`, `Enter`), high-contrast SVG flags, microstate click-assist markers on tight borders, post-answer Intel reveal card for immediate learning feedback, no personal content, no hard fail states.

## Conventions honoured
Standalone zero-dependency HTML/JS on GitHub Pages, no build step; course-level naming only (no class numbers in filenames); student-facing labels say "Server"; colour is rich and screen-native (not a printable); zero em/en-dashes; no PII/PINs in tracked files.
