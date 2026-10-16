# THE MOLE — Game Specification

Version: 1.3 draft, 2026-10-16. Status: built, untested at full scale. A4 print fit fixed; material counts verified against the printables; final vote resolved to plurality. Sections 1-15 are the design, section 16 is a design critique with a separate caveat about what is measured versus predicted.

Purpose of this document: the single source of truth for the game, gameplay, materials, and process. Written to be auditable: another reviewer should be able to find every rule, number, and edge case here without reading the code.

## 1. The game in one paragraph

THE MOLE is a whole-class social deduction game. 23 students (grade 7) form 5 teams and play 4 team challenges across one hour. Before play, one student is secretly "hired" as the Mole: once per challenge they sabotage their own team's result while pretending to help. Every challenge win grows a shared class pot; the sabotage shrinks it indirectly through missed bonuses. Between challenges every student individually and secretly guesses the Mole's identity into a box. The hour ends with a whole-class final accusation: if the plurality of WRITTEN final accusation slips names the Mole, the Mole is caught and the pot survives; otherwise the Mole escapes and the pot is lost. The stand-and-point that precedes it is ceremony; the box decides. Personal glory runs on stars: correct guesses score points, and the top scorer is the Mole Hunter champion. The teacher hosts, knows the Mole's identity, and is strictly neutral.

## 2. Roles

| Role | Count | Knows | Does |
|---|---|---|---|
| Host (teacher) | 1 | Everything, including the Mole's identity | Runs the deck, timers, scoring; judges challenges; stays neutral; never confirms sabotage |
| The Mole | 1 | Own identity only (not who else suspects them) | One sabotage per challenge inside their own team; one visible help act per challenge; lies freely; never confesses before the reveal |
| Hunters | 22 | Only the public rules | Do challenges in teams; individually guess the Mole between rounds; final accusation |

Design intent: the Mole sits inside one team, so their sabotage always damages that team. The victim team therefore holds the best evidence while being structurally unable to attribute it: honest failure and sabotage are built to be indistinguishable.

## 3. The three economies

1. **Stars (personal).** 1 star per correct guess in each of 4 guess rounds; 3 stars for a correct final accusation. Most stars = Mole Hunter champion. Ties share the title.
2. **The pot (class).** Starts at $1,000. Challenge payouts are PER TEAM: C1 +$60 (16+ correct) or +$30 (12-15) per team; C2 +$60 (2+ nailed drawings) or +$30 (1 nailed) per team; C3 +$60 (9+ correct) or +$30 (7-8) per team; C4 +$400 to the pot once (first vault opened anywhere, only the first). Maximum pot $2,300 = $1,000 + 5 teams x $60 x 3 challenges + $400. The pot is whatever real-world prize the host attaches to it. If the Mole is caught, the class keeps the pot; if the Mole escapes, the pot is lost.
3. **The Mole's win.** The Mole escapes unless the plurality of WRITTEN final accusation slips names them. Plurality, not majority: a scattered room (5 slips for the Mole, 6 for someone else, 12 spread thin across everyone else) still loses the pot. A tie for the most slips counts as an escape. The finger-pointing is ceremony and changes nothing. Changed from strict majority on 2026-10-16: with no feedback between rounds, 12 of 23 students converging on one name was unlikely enough that the pot would almost always have been lost, which quietly made the Mole the default winner.

## 4. Materials

### 4.1 Printed (the-mole-printables.html, A4, single-sided, cut where dashed)

24 pages. Every page prints its own copy count in the top-right corner, so the
table below is a cross-check rather than the only instruction.

| Page | Content | Copies | Used in |
|---|---|---|---|
| 1 | Hired cards, 4 identical quarter-page triggers | 1 page (1 to the box, 3 spares) | The Draw |
| 2-7 | Decoy packets, 24 quarter-page cards | 1 each | The Draw |
| 8-11 | Guess slips, 15-up, 60 per pass | 2 each (120 slips) | Guess rounds |
| 12 | Final accusation slips, 24-up, 3-star vote | 1 | Final vote |
| 13 | Memory poster, 24 coloured shapes in a 6x4 grid, lettered A-F and numbered 1-4 | 1 | Challenge 1 |
| 14 | Memory answer grids, 6 blank grids | 1 | Challenge 1 |
| 15-16 | Blueprint cards, 8 compound pictures with 6-part checklists | 2 each (16 cards) | Challenge 2 |
| 17-18 | Wall statements 1-12, half-page posters | 1 each | Challenge 3 |
| 19 | Wall answer sheets, 4-up | 2 (8 sheets, 5 teams + spares) | Challenge 3 |
| 20 | Code strips A-D, quarter-page puzzle cards | 5 (one set per team) | Challenge 4 |
| 21 | Teacher key + terminal cheat sheet | 1 | Host desk, never posted |
| 22-24 | Terminal signs A-E with team fill-line | 1 each | Tape above screens |

### 4.2 Digital

| File | Role |
|---|---|
| the-mole-deck.html | Projector deck: 21 stages, rules, challenge GO slides with timers and pot buttons, guess rounds, final vote, tally, reveal shroud, verdict |
| mole-terminal.html | The vault app, one copy on each of 5 computers (4 Windows + 1 Chromebook). Keypad, ACCESS DENIED attempt counter that persists across reloads, vault-open celebration |

### 4.3 Non-print physical

- Box or envelope for guess slips
- ~120 pieces of scrap paper and 23 pencils (backup for printed slips)
- Tape or sticky tack and wall space for 12 statements
- Scissors or paper cutter
- Projector computer; USB stick or network share to move the terminal file
- Optional: the real prize attached to the pot

## 5. Answer key (inline for audit)

- Strip A: count the letter E in "THE MOLE IS IN THIS ROOM." = 2 (THE=1, MOLE=1).
- Strip B: a digit printed rotated 180 degrees; flipping reads 9.
- Strip C: odd, bigger than a triangle's corners (3), smaller than a spider's legs (8), not five = 7.
- Strip D: M is the 13th letter; 1+3 = 4.
- Vault code: 2974, entered in strip order A, B, C, D. First correct entry on any terminal pays +$400. The code exists in the terminal only as a djb2 hash (2088334395); re-arm by typing TEACHER.
- Wall of Lies: 1 false, 2 true, 3 true, 4 false, 5 true, 6 false, 7 false, 8 true, 9 false, 10 true, 11 true, 12 false.
- Memory poster (row: cells): Row 1: red star, blue circle, green triangle, yellow square, orange diamond, purple heart. Row 2: blue triangle, green star, yellow circle, red diamond, purple square, orange heart. Row 3: green diamond, yellow heart, red square, blue star, orange circle, purple triangle. Row 4: purple star, red heart, green circle, yellow diamond, orange triangle, blue square.

## 6. The Mole's public contract

The sabotage menu is PUBLIC, shown on deck stage 3 so every student knows what to watch for. The only secret is who was hired.

Per challenge, the Mole takes exactly one action:

1. MEMORY RUN: as runner, report one wrong detail with total confidence.
2. BLUEPRINT: as describer, drop one part or swap two parts. Never describer this round? A miscount as judge, or one dropped part as drawer, is the same move.
3. WALL OF LIES: while holding the team pencil, mark one statement wrong.
4. CODE BREAK: swap one digit on the answer sheet, or type a wrong code at the terminal.

Standing rules of the job: at least one visible help act per challenge (run fast, cheer, carry, solve a strip for real); volunteer sometimes; look shocked when accused; lying is allowed and expected; never confess before the reveal. Win condition: the final accusation misses them. The hired packet is a trigger only ("YOU HAVE BEEN HIRED, you saw the job on the board, start now, never confess") because the menu itself is public.

## 7. The draw procedure

- 24 folded quarter-page packets: 1 HIRED card + decoys to reach class size with spares. All packets fold identically: bottom up, then left over, so no packet is distinguishable by shape.
- The host pre-selects the recipient (curate for a kid who will enjoy the job), then drops the HIRED packet in the box last, on top, angled toward them.
- Everyone takes one packet, opens on their lap simultaneously, reads privately, says nothing.
- Wrong kid draws it: before anyone has read, run a bad-print redraw. Collect every packet, swap the HIRED card for a decoy, re-deal. After reading there is no clean undo: a swap tells a second student, so avoid it. Last resort only: a same-team swap at a challenge boundary, framed as a re-deal, accepting the leak.
- A student who refuses the job after drawing: host quietly reassigns within the same team at the next transition.

## 8. Run of show (60 minutes)

| Time | Deck stage (tab) | What happens |
|---|---|---|
| 0:00 | 1 WELCOME, 2 RULES | Premise, stars, pot, win conditions |
| 0:03 | 3 THE MOLE'S JOB | Public sabotage menu; class knows what to watch for |
| 0:05 | 4 THE DRAW | Packets out, read on laps, silence |
| 0:07 | 5 TEAMS | Count off by fives; 5 teams; team names typed into deck; signs get team names |
| 0:09 | 6-7 C1 RULES, C1 GO | Memory Run, 8:00 timer |
| 0:17 | 8 GUESS 1 | 60 s, slips in box |
| 0:19 | 9-10 C2 RULES, C2 GO | Blueprint, 9:00 timer |
| 0:28 | 11 GUESS 2 | 60 s |
| 0:30 | 12-13 C3 RULES, C3 GO | Wall of Lies, 9:00 timer |
| 0:39 | 14 GUESS 3 | 60 s |
| 0:41 | 15-16 C4 RULES, C4 GO | Code Break, 8:00 timer |
| 0:49 | 17 GUESS 4 | 60 s, last cheap star |
| 0:51 | 18 FINAL VOTE | Dedicated 3-star accusation slip (print page 12) + stand and point on three |
| 0:54 | 19 TALLY | Recap pre-scored rounds, read final accusations for the plurality, crown champions |
| 0:56 | 20 REVEAL | Click the shroud, type the name |
| 0:58 | 21 CHAMPIONS | Verdict: caught (pot survives) or escaped (pot lost) |

Controls: arrow keys change stages, SPACE runs the stage timer, R resets it, pot buttons sit on each GO slide, the reveal shroud is click-through, team names / reveal name / champions are typed directly on the slides.

## 9. Challenge specifications

### Challenge 1: MEMORY RUN (8 min)

- Materials: poster face-down at the front; one answer grid and pencil per team.
- Play: the poster flips when the stage timer starts. One runner per team at a time: 10-second look at the poster, run back, report from memory. Team fills all 24 grid cells as colour + shape ("red star", cell D2). Every team member runs once before anyone runs twice.
- Scoring: host checks each grid against the key. 16+ correct = +$300. 12-15 = +$150. Below 12 = $0. Scores are announced per team.
- Mole vector: as runner, report one wrong detail confidently.
- Evidence produced: public per-team scores; a sabotaged team lands one tier lower.

### Challenge 2: BACK-TO-BACK BLUEPRINT (9 min)

- Materials: 16 picture cards split across teams (about 3 per team), scrap paper, pencils.
- Play: team splits into pairs (a 5th student is the judge holding the card checklist). Pairs sit back to back. Describer looks at the card and describes it; drawer draws without looking. 90 seconds per picture, then swap roles with a fresh card. No peeking, no pointing, no letters or spelling.
- Judging: a drawing is NAILED when it contains at least 5 of the card's 6 listed parts. The judge counts immediately after each drawing.
- Scoring: 2+ nailed drawings in the team = +$300. 1 nailed = +$150. 0 = $0.
- Mole vector: as describer, omit one part or swap two parts. Ambiguity by design: the drawing failure is attributable to describer or drawer.

### Challenge 3: WALL OF LIES (9 min)

- Materials: 12 statements posted around the walls (numbered), one answer sheet per team (or scrap numbered 1-12), pencils.
- Play: one runner at a time reads a statement, runs back, team debates and marks T or F. All 12 marked before the timer ends.
- Scoring: 9+ correct = +$300. 7-8 = +$150. Below 7 = $0.
- Mole vector: while holding the team pencil, mark one statement wrong. Buried under sincere team disagreement about the statements.
- Key: 1F 2T 3T 4F 5T 6F 7F 8T 9F 10T 11T 12F.

### Challenge 4: CODE BREAK (8 min)

- Materials: one 4-strip set per team; one terminal per team, open and fullscreened before class.
- Play: strips A-D each hide one digit (letter hunt, rotated glyph, riddle, letter math). Team assembles the digits in strip order into the vault code and types it at their terminal.
- Scoring: first correct code on any terminal in the room = +$400 to the pot, once. Wrong codes: the terminal answers ACCESS DENIED with an attempt counter, publicly.
- Terminal facts: the code is stored only as a hash; the denied-attempt count persists across reloads and restarts; re-arm between classes by typing TEACHER; each terminal shows its own ID and attempt count, which doubles as evidence at the tally.
- Mole vector: swap a digit on the shared answer sheet, or type a wrong code when holding the keypad. Every denial burns class time and the race.
- Fallback: if a terminal dies, that team whispers the code to the host, who judges it against the key page.

### Guess rounds (60 seconds, after every challenge)

- Individual, silent, whole-room. Every student writes ONE name (anyone in the room, teammates included) and optionally a 3-word reason, folds, and deposits in the box.
- No feedback between rounds. The box stays sealed from students until the tally; each slip carries the voter's name so the host can award stars.
- The host quietly scores each round's slips during the following challenge and empties the box between rounds, so the tally only handles the final accusation slips.
- After guess round 4, the FINAL ACCUSATION: written on its own printed slip (print page 12, worth 3 stars, voter name included). The written slips are the official vote. Then everyone stands and on three points at the Mole simultaneously, purely for drama. The accusation slip is separate from the round slips precisely so no one has to write on a slip already sealed in the box.

### Tally, reveal, verdict (deck stages 19-21)

- Host recaps the pre-scored round sheets, reads the final accusation slips to establish the plurality, awards 1 star per correct round guess and 3 for the final. Most stars = Mole Hunter champion(s).
- Host types the Mole's name into the reveal slide, clicks the shroud, dramatic reveal.
- Verdict: plurality of pointers = caught, pot survives. The Mole needs strictly more fingers than any other single student; a tie for the most = escaped, pot lost. Mole takes a bow either way; champions are celebrated regardless.

## 10. Sabotage economics (how the Mole's damage reaches the pot)

Primary channel: missed bonus tiers. A sabotaged challenge drops its team one tier, costing the pot about $30-60 per sabotage (one team out of five), plus -$150 per denied code in C4. The pot cost of sabotage is deliberately small: only one of five teams contains the Mole, so the other four usually clear their tiers. The Mole's real stakes are the escape and the stars hunt, and the entire pot still swings on the verdict.

The deck's SABOTAGE -$150 buttons are for objectively verifiable events only:

- Challenge 4: every terminal ACCESS DENIED is objective; the host may click -$150 per denial.
- Any challenge the host witnesses being torched in the act (rare, dramatic).

The host never clicks -$150 on suspicion. Attribution of C1-C3 errors is designed to be impossible; the host applies published bonus tiers mechanically and nothing else. This is the pot rule as built, and it is listed as a tuning knob in Open Issues.

## 11. Host neutrality rules (critical)

1. Never confirm that a sabotage happened. Only pay published scores: "Team 3, twelve, that's $150."
2. Never confirm or deny any individual suspicion, before or during the tally.
3. The host knows the Mole's identity from the draw and must never leak it by behaviour: even-handed timing, even-handed commentary.
4. Ambiguity between honest failure and sabotage is the game's fuel. Every host utterance protects it.

## 12. Terminals: setup and security

- Windows: copy mole-terminal.html locally, open mole-terminal.html#t=A (letter per taped sign) in a browser, F11. Stronger: `start msedge --kiosk "file:///C:/path/mole-terminal.html#t=A" --edge-kiosk-type=fullscreen`, which blocks browser shortcuts; exit only via Ctrl+Alt+Del sign-out.
- Chromebook: file via Drive or share, open mole-terminal.html#t=B (letter per sign) from Files, F11. The session is already account-locked.
- Ctrl+Alt+Del is OS-level and cannot be blocked by any web page; the mitigations are kiosk mode, a visible host, and the fact that cheating gains almost nothing: the code is hash-stored, the attempt counter persists, and after 10 denied attempts the vault seals itself until the teacher re-arms, which kills brute force.
- Re-arm between classes: type TEACHER on any terminal keyboard.
- Five terminals: 4 Windows + 1 Chromebook is the planned fleet. Signs (pages 21-23) tape above each screen with a team fill-line.

## 13. Edge cases

- Class size differs from 23: decoy count scales (class size + a few spares); teams of 4-5; challenge timings roughly hold.
- Absence of the pre-selected Mole candidate: pick another; the draw is host-curated anyway.
- Terminal failure: whisper-verdict fallback (team whispers the code; host judges against the key).
- Challenge finishes early: start the guess round early; the hour carries about 3 minutes of slack.
- Star ties: co-champions.
- Slow tally: rounds are pre-scored during challenges, so the tally only reads final accusation slips.
- Bandwagon pointing: fingers are ceremony; the written slips are the vote, so a hesitant room cannot be swept into a wrong verdict.
- The pot reaches $0: play continues; the pot prize is gone but stars are still contested.
- A student blurts or brags about cheating: host judgement, one-off posture: cheating that surfaces publicly = class point and a public callout, never grade consequences.
- Mole wants out mid-game: avoid it. Last resort: same-team swap at a challenge boundary, framed as a re-deal, accepting that a second student now knows.

## 14. Open issues (for review)

1. A4 print fit: RESOLVED 2026-10-16. Print padding dropped to 6mm inside `@media print`, so the content box is 178 x 265mm and the two-row 128mm card pages (blueprint, wall sheet, code strip) now fit with 5mm to spare. The 12 wall statements still spill onto a second sheet by design (they are cut apart anyway).
2. Sabotage economics (section 10): the -$150 attribution rule is a tuning knob. Alternative designs: (a) deny-only deductions as built, (b) flat -150 per challenge regardless of detection, which requires the host to accept unattributable clicks, (c) remove the buttons entirely and let bonuses carry all damage.
3. Role distribution: only 1 of 23 students is the Mole. Mitigated by draw secrecy and the hunt being the collective fun; a second-agent variant (double agent feeding false clues) exists as a future option.
4. Timing: challenge lengths assume 23 students in 5 teams; larger classes need about +1 minute per challenge.
5. Pacing: Challenge 2 (Blueprint) is the quietest block; watch the room there.
6. C4 endgame: once the first vault opens, losing teams lose interest in typing codes. Mitigation: host pivots attention straight to the guess round.
7. Wall congestion: 5 teams circulating 12 statements simultaneously; spread the statements wide.
8. Terminal ID vs sign: RESOLVED 2026-10-16. The terminal now derives its label from the URL hash (mole-terminal.html#t=A through #t=E) so screen and sign always agree; no hash falls back to a plain TERMINAL label.
9. Sabotage buttons vs host neutrality: RESOLVED 2026-10-16, both fixes applied. The SABOTAGE buttons are removed from the C1-C3 GO slides; the C4 button is relabelled DENIED ATTEMPT -$150. The deck now publishes the true rule on the Rules slide: sabotage = lost bonus money, denied code = -$150 each.
10. Reassignment leaks the identity: RESOLVED 2026-10-16 by process rule. Section 7 now specifies a bad-print redraw before anyone reads, and mid-game reassignment is marked last-resort-only with the leak acknowledged in sections 7 and 13.
11. No vault lockout: RESOLVED 2026-10-16. The vault seals after 10 denied attempts (0.1 percent of the keyspace, brute force dead) and reopens only via the TEACHER re-arm. Section 12 now claims only what is true.

## 15. File inventory (canonical)

| File | Status |
|---|---|
| the-mole-deck.html | 21 stages, verified programmatically, untested on projector |
| the-mole-printables.html | 24 pages, verified programmatically, A4 fit fixed 2026-10-16 |
| mole-terminal.html | Verified: hash-stored code 2974, persistent attempts, TEACHER re-arm |
| README.md | Short run-of-show and print checklist |
| GAME-SPEC.md | This document |

All files live in bihi2027/ILT/mole/ and are uncommitted.

---

## 16. Gemini audit round (2026-10-16), all verified and fixed:

- Guess slips and accusation slips carried no voter name, making individual star scoring impossible: every slip now has a "your name" field (60 round slips, 24 accusation slips).
- Hired card win text was inverted by the plurality edit (it told the Mole they win by getting caught): corrected on all 4 cards.
- Pot math said $2,300 while payouts read per team ($5,900 if summed): payouts are now explicitly per team at +$60/+$30, preserving the $2,300 maximum; deck buttons and rules tags relabelled to match.
- TEACHER re-arm never fired after a vault win (early return above the arm buffer): reordered.
- Tally bottleneck (115 slips in 2 minutes): rounds are now pre-scored during challenges.
- Bandwagon pointing: written slips are the official vote; fingers are ceremony.
- Blueprint Mole freeze-out: judge-miscount and drawer-dropped-part added as fallback vectors in the public contract.

## 17. Design critique (historical)

Added 2026-10-16 after a line-by-line audit of the spec against the built files. This
section is opinion and analysis; everything in sections 1-15 is the design itself.

### 16.1 What the game actually is

Strip the ceremony away and this is **two games sharing one clock**:

- a **cooperative scoring engine** (four challenges, a shared pot), and
- a **1-in-23 attribution problem** (the guess rounds: who did one of four known
  things, badly, on purpose).

The two are coupled by exactly one mechanism — the Mole's sabotage — and that
mechanism is *deliberately unattributable*. That is the design's central bet, and
it is a good one. But it has a consequence worth naming: the visible, scored game
carries all the feedback, while the social game, which is the one students will
actually remember, carries almost none.

### 16.2 The load-bearing decisions (what holds up)

1. **The Mole sits inside a team (§2).** The strongest idea in the document. The
   victim team holds the most evidence and the least ability to attribute it:
   their own honest failure is indistinguishable from sabotage when viewed from
   inside the team. That inversion is what stops the deduction being trivial.
   Protect it in any future variant.

2. **Public sabotage menu, secret hiree (§6).** The class knows all four moves;
   only *who* is hidden. This turns "spot the weird kid" into a real inference
   problem with a defined solution space, and it removes the cheap win of a Mole
   doing something off-menu.

3. **No feedback between guess rounds (§9).** Correct, and load-bearing. Any
   aggregate feedback ("three people think it's Sam") starts an information
   cascade and turns the last two rounds into a popularity contest.

4. **Host neutrality as written rules (§11).** The best-written section here.
   Naming "the host never confirms sabotage" as a rule rather than a tone is what
   makes the ambiguity survivable in a real classroom with 23 people watching.

5. **Three separate economies (§3).** Stars, pot, and Mole-escape have different
   losers, so different students are motivated by different things. The champion
   title is a consolation economy that costs the designer nothing.

### 16.3 Verified mechanically, not by assertion

Every factual claim in sections 1-15 was checked against the built files:

| Claim | Result |
|---|---|
| `CODE_HASH = 2088334395` is djb2 of "2974" | confirmed by independent recomputation |
| Pot maximum $2,300 (1000+300+300+300+400) | confirmed |
| Deck = 21 stages | confirmed, `data-stage` 0-20 |
| Wall key 6 true / 6 false | confirmed |
| Memory poster 24 cells, A-F x 1-4 | confirmed |
| Wall statements 1-12 all present | confirmed |
| Terminal persistence + TEACHER re-arm | confirmed in code |

The spec's own arithmetic and keys are sound. The failures were in the paper
counts and in the rules disagreeing with themselves.

### 16.4 Structural risks

**R1 — the verdict rule made the Mole the default winner (highest impact, now
resolved).** §3 required 12 of 23 to converge on one name, with zero feedback
between rounds and one anonymous vote each. That is close to the worst case for
a detection game: independent guesses with no cascade rarely concentrate. The
	likely result was that the pot was lost nearly every session, which quietly makes
	the Mole the default winner and leaves the class side playing for cosmetics.
Changed to plurality on 2026-10-16. **This is an analytical prediction, not a
measured one — it needs a playtest to confirm, and that is the single most
valuable data point this game has never collected.**

**R2 — all real detective work lands in the last eight minutes.** C1, C2 and C3
produce a *score* and nothing else: a public number with no narrative attached.
C4 is the only challenge where the Mole leaves an attributable, timestamped,
public trace — a denial count on a specific numbered terminal. So all usable
evidence arrives at 0:41, is followed by one guess round, and is resolved by
0:51. If the fix were ever allowed, the strongest version is a mid-game
information beat (see 16.7).

**R3 — the sabotage economy runs one way.** The Mole can cost the class money
through four unattributable misses; the class cannot cost the Mole anything at
all. Stars are the only class-side weapon, and stars do not touch the pot. The
asymmetry is fine for a 60-minute game but it means the class's only real goal
is detection.

**R4 — one Mole in 23 leaves 22 spectators.** §14 notes this. It is the standard
social-deduction tax and the draw secrecy plus the collective hunt are the right
mitigations, but it does mean most students experience this as a spectator sport
with a participation mechanic bolted on. A double-agent variant would address it
directly.

**R5 — the Blueprint card pool is thin against the clock.** Eight unique cards,
sixteen if printed twice, against five teams of two pairs. Over a 9-minute block
at 90 seconds per drawing, each pair wants roughly three cards, so cards recycle
within and across teams. A drawer who overhears a teammate's description of a
card they later draw is a real fairness problem, not a hypothetical one.

**R6 — no scenario where the class can lose honestly.** If the class plays well
and the Mole is subtle, the class simply does not win. There is no partial-credit
path on the detection side at all. The star economy partially covers this, but a
student who plays the game well and still has a 1-in-23 shot feels the system
gave them nothing.

### 16.5 What was wrong in the kit, and is now fixed

- **The final accusation had no paper.** Exactly one accusation slip existed per
  print run; 23 students need one each. The deck's fallback ("write it on the back
  of your last slip") pointed at a slip already sealed in the box. Fixed: new
  24-up page 12.
- **Copy counts existed only in prose.** The page tags said `CUT ALL 15` and
  `CUT 4`; the real multipliers lived in a different file. A teacher printing
  straight from the HTML got 60 slips (needed 92), 8 cards (needed 16), and 4 wall
  sheets labelled "ONE PER TEAM" for 5 teams. Fixed: counts are now on the pages.
- **A4 print overflow.** The screen padding of 12mm was never reset for print,
  leaving a 253mm content box against 260mm of two-row card pages — clipping the
  bottom of every blueprint card, wall sheet, and code strip, including the code
  strip's digit line. Fixed with one declaration.
- **The verdict rule contradicted itself** across spec, deck and README. Resolved
  to plurality, written identically in all five files.

### 16.6 Known holes, unresolved

Listed again from §14 for visibility; these are behaviour decisions, not bugs. Update 2026-10-16: holes 8 to 11 are now resolved, see section 14 for how.

| # | Hole | Severity |
|---|---|---|
| 8 | Terminal ID rolls randomly and can contradict its taped A-E sign | medium — it is used as tally evidence |
| 9 | Red `SABOTAGE -$150` buttons on C1-C3 that host neutrality forbids clicking | medium — visible to students, invites the attribution the design forbids |
| 10 | Any mid-game reassignment tells two students the identity | high if used, easy to avoid |
| 11 | No vault lockout after repeated denials | low — ~300 attempts possible in 8 minutes vs 10,000 |

### 16.7 Tuning recommendations

If the game is played more than once, these are the levers worth pulling, in
order of expected value:

1. **Playtest the plurality verdict and record the win rate.** Everything else in
   this section is inference; this is a measurement. One real session settles R1.
2. **Add one information beat at 0:39**, between Guess 3 and Challenge 4: the host
   announces only how many distinct names appeared in the box last round (not
   which names, not counts per name). It preserves "no feedback on suspects" while
   creating enough convergence pressure for the endgame to be a real vote. This is
   the direct fix for R2 and it is one sentence in the deck.
3. **Print 8 blueprint cards per team, not 3**, if the pile is cheap. Fixes R5 and
   removes the fairness complaint entirely.
4. **Either remove the `-$150` sabotage buttons from C1-C3 or change the published
   rule.** The current state teaches students a rule the host is forbidden to
   apply, which is the worst of both: it invites a deduction the host cannot pay.
5. **Derive the terminal ID from the URL** (`mole-terminal.html#t=3`) so screen
   and sign always agree.
6. **Consider dropping the pot's C4 exclusivity** if sessions run long. "+$400 for
   the first vault" means four teams sit out the last minutes with nothing to do.

### 16.8 Caveat on this critique

Sections 16.4 and 16.7 are analytical. No full-scale session has been run; the
verdict win rate, the Blueprint card shortfall, and the evidence-timing argument
are all predictions from the rule text and the printed layout. Treat them as
hypotheses to be tested, not findings.

