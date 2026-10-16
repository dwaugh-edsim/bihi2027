# THE MOLE — Grade 7 ILT (23 students, 5 teams)

A whole-class social deduction hour. One secret Mole sabotages four team
challenges while the class hunts them. The class pot grows with every win and
shrinks with every sabotage. Guess slips between rounds, dramatic final vote,
vault reveal on the projector deck.

**No resources needed beyond:** paper prints, a wall or twelve, pencils, a box
for slips, and 5 computers (4 Windows + 1 Chromebook is fine).

## Files

| File | What it is |
|---|---|
| `the-mole-deck.html` | Projector deck: story, rules, challenges, timers, pot HUD, final vote, reveal. Arrows change slides, SPACE runs the timer. |
| `the-mole-printables.html` | A4 print set, 24 pages. Print single-sided, cut where dashed. |
| `mole-terminal.html` | The vault app. One copy on each team computer. Any browser. |

## The hour

| Time | Beat |
|---|---|
| 0:00 | Welcome + story (deck stages 1-2) |
| 0:04 | The Mole's Job slide: the sabotage menu is PUBLIC, everyone sees it |
| 0:05 | The Draw: identical folded packets, one says YOU HAVE BEEN HIRED |
| 0:07 | Teams: count off by fives, name teams (deck stage 4) |
| 0:09 | C1 Memory Run (8 min): poster relay, fill the 24-cell grid |
| 0:18 | Guess 1 (60s, slips in the box) |
| 0:20 | C2 Back to Back Blueprint (9 min): pairs draw, describer talks |
| 0:30 | Guess 2 |
| 0:32 | C3 Wall of Lies (9 min): 12 wall statements, T/F team sheet |
| 0:42 | Guess 3 |
| 0:44 | C4 Code Break (8 min): 4 strips give digits, type code at team terminal, first vault open = +$400 |
| 0:53 | Guess 4, then Final Accusation: dedicated 3-star slip (page 12) + stand and point |
| 0:56 | Tally (rounds pre-scored during challenges), reveal, verdict |

Pot: starts $1,000. C1/C2/C3 win +$300 each, C4 vault +$400, max $2,300,
sabotage -$150 each. Attach whatever prize you want to the pot.

## Print checklist (23 students, 5 teams)

Every page now carries its own copy count in the top-right corner, so this table
is a cross-check rather than the only source.

| Page | Copies | Notes |
|---|---|---|
| 1 Hired packets | 1 | 4 identical HIRED cards. Cut, fold twice, ONE goes in the box |
| 2-7 Decoy packets | 1 each | 24 decoys, folded the same size as the hired card |
| 8-11 Guess slips A-D | 2 each | 60 per pass, 120 total: 4 rounds x 23 + spares |
| 12 Final accusation slips | 1 | 24 slips, one per student. The 3-star vote |
| 13 Memory poster | 1 | Face down until C1 starts |
| 14 Memory grids | 1 | 6 grids on the page |
| 15-16 Blueprint cards | 2 each | 16 cards, about 3 per team |
| 17-18 Wall statements 1-12 | 1 each | Post around the room |
| 19 Wall answer sheets | 2 | 8 sheets, 5 teams + spares |
| 20 Code strips | 5 | One 4-strip set per team |
| 21 Teacher key | 1 | Answers + terminal cheat sheet. Do not post |
| 22-24 Terminal signs A-E | 1 each | 5 signs + 1 spare, tape above the screens |

## Terminals (5 minutes of setup)

1. Copy `mole-terminal.html` onto each of the 5 computers (USB stick works).
2. Open it with the team letter in the address: `mole-terminal.html#t=A`
   through `#t=E`, so the on-screen ID always matches the taped sign.
   Then F11 for fullscreen.
3. Windows machines, harder lockdown (blocks Alt+F4 etc.):
   `start msedge --kiosk "file:///C:/.../mole-terminal.html#t=A" --edge-kiosk-type=fullscreen`
4. The vault code lives in the file only as a hash; the DENIED ATTEMPTS count
   survives reloads, so closing and reopening gains nothing. After 10 denied
   attempts the vault seals itself until the teacher re-arms.
5. Re-arm between classes: type `TEACHER` on the terminal keyboard.
6. Before the reveal, check each terminal's attempt count. A terminal that
   burned 6+ denials had the Mole typing on it.

Ctrl+Alt+Del is OS-level and cannot be blocked by any browser page. In practice
kiosk mode + F11 + a visible teacher is plenty for 50 minutes.

## Answer key (also on print page 21)

- Strips: A=2, B=9, C=7, D=4. **Vault code 2974.** Order matters.
- Wall of Lies: 1F 2T 3T 4F 5T 6F 7F 8T 9F 10T 11T 12F (6 true, 6 false).
- Stars: 1 per correct round guess, 3 for the correct final accusation.
- The Mole wins unless the plurality of WRITTEN final accusation slips names them.
  Plurality, not majority: 5 slips for the Mole, 6 for one other student, 12 spread
  around = Mole escapes. A tie for the most = escape. The pointing is ceremony.

## Choosing the Mole

There is exactly ONE Mole in the room. The Mole sits on one team and their
sabotage lands on their own team's challenges, so that team is both victim and
prime suspect pool, same engine as one wolf in a Werewolf circle.

The sabotage menu is public (deck stage 3, "The Mole's Job"): everyone sees all
four moves, so the only secret is WHO was hired. The HIRED packet is just the
trigger; drop it in the box last, on top, toward a student you trust to enjoy
the job. If the wrong kid draws it, a quiet swap during C1 fixes everything,
and the three spare HIRED cards make the swap invisible.
