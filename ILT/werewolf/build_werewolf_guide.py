"""Builds werewolf-facilitator-guide.docx — printable moderator guide (A4, English)."""
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

NAVY = RGBColor(0x0F, 0x17, 0x26)
PANELC = RGBColor(0x1A, 0x25, 0x40)
GOLD = RGBColor(0xB8, 0x8A, 0x1A)   # print-friendly dark gold for text
MUTED = RGBColor(0x5A, 0x64, 0x7A)
BORDER = "C9CFDC"

doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Cm(21), Cm(29.7)
sec.left_margin = sec.right_margin = Cm(2)
sec.top_margin, sec.bottom_margin = Cm(1.8), Cm(1.6)

st = doc.styles["Normal"]
st.font.name = "Arial"; st.font.size = Pt(10.5)
st.paragraph_format.line_spacing = 1.3
st.paragraph_format.space_after = Pt(6)
st.element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")

for name, size, color, before in [("Heading 1", 15, NAVY, 14), ("Heading 2", 12, PANELC, 10)]:
    h = doc.styles[name]
    h.font.name = "Arial"; h.font.size = Pt(size); h.font.bold = True
    h.font.color.rgb = color
    h.paragraph_format.space_before = Pt(before); h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True

def para(text="", bold=False, italic=False, size=10.5, color=None, style=None, space_after=None, align=None):
    p = doc.add_paragraph(style=style)
    if align: p.alignment = align
    if space_after is not None: p.paragraph_format.space_after = Pt(space_after)
    if text:
        r = p.add_run(text)
        r.font.bold = bold; r.font.italic = italic; r.font.size = Pt(size)
        if color: r.font.color.rgb = color
    return p

def rich(runs, style=None, space_after=None):
    p = doc.add_paragraph(style=style)
    if space_after is not None: p.paragraph_format.space_after = Pt(space_after)
    for text, kw in runs:
        r = p.add_run(text)
        r.font.bold = kw.get("b", False); r.font.italic = kw.get("i", False)
        r.font.size = Pt(kw.get("s", 10.5))
        if kw.get("c"): r.font.color.rgb = kw["c"]
    return p

def bullet(text, bold_lead=None):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(3)
    if bold_lead:
        r = p.add_run(bold_lead); r.font.bold = True
    p.add_run(text)
    return p

def set_cell_shade(cell, hexcolor):
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear"); shd.set(qn("w:fill"), hexcolor)
    cell._tc.get_or_add_tcPr().append(shd)

def style_table(table, widths_cm, header_fill="0F1726"):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = None
    tbl = table._tbl
    tblPr = tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement(f"w:{edge}")
        e.set(qn("w:val"), "single"); e.set(qn("w:sz"), "4")
        e.set(qn("w:color"), BORDER)
        borders.append(e)
    tblPr.append(borders)
    mar = OxmlElement("w:tblCellMar")
    for m, v in (("top", 80), ("left", 110), ("bottom", 80), ("right", 110)):
        e = OxmlElement(f"w:{m}"); e.set(qn("w:w"), str(v)); e.set(qn("w:type"), "dxa")
        mar.append(e)
    tblPr.append(mar)
    for row in table.rows:
        trPr = row._tr.get_or_add_trPr()
        cant = OxmlElement("w:cantSplit"); trPr.append(cant)
        for ci, cell in enumerate(row.cells):
            cell.width = Cm(widths_cm[ci])
    for ci, cell in enumerate(table.rows[0].cells):
        set_cell_shade(cell, header_fill)
        trPr = table.rows[0]._tr.get_or_add_trPr()
        th = OxmlElement("w:tblHeader"); trPr.append(th)
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF); r.font.bold = True
                r.font.size = Pt(9.5)

def cell_text(cell, text, bold=False, italic=False, size=9.5, color=None):
    p = cell.paragraphs[0]
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(text)
    r.font.bold = bold; r.font.italic = italic; r.font.size = Pt(size)
    r.font.name = "Arial"
    if color: r.font.color.rgb = color

# ---------------- title block ----------------
p = para("WEREWOLF", bold=True, size=30, color=NAVY, space_after=0)
p.paragraph_format.space_before = Pt(0)
rich([("Facilitator Guide — how to run the class game", {"s": 13, "c": GOLD, "b": True})], space_after=2)
rich([("28 players  ·  ages 12–14  ·  45–60 minutes  ·  you are the moderator, never a player",
       {"s": 10, "c": MUTED, "i": True})], space_after=10)

# ---------------- 1 · the game in 30 seconds ----------------
doc.add_heading("1 · The game in 30 seconds", level=1)
para("Werewolf (also called Mafia) is a secret-roles deduction game. A few students are secretly "
     "Werewolves picking off villagers; everyone else tries to unmask them through argument and voting. "
     "You never play — you narrate the night, run the debate, and count the votes.")
bullet("The class is a village. Of your 28 students, 3 are secretly Werewolves, 1 is a Detective, "
       "1 is a Doctor, and 23 are ordinary Villagers. Only the wolves know who their pack is.", bold_lead="Hidden roles. ")
bullet("Everyone closes their eyes. You wake each special role one at a time: the wolves silently point "
       "at a victim, the detective asks you whether one player is a wolf (silent thumbs signal), the doctor "
       "silently protects one player.", bold_lead="NIGHT — about 90 seconds. ")
bullet("Everyone opens their eyes. You announce who died. The village debates for 5 minutes, then votes "
       "by secret ballot to eliminate one suspect. The wolves vote too — and lie brilliantly.",
       bold_lead="DAY — about 7 minutes. ")
bullet("Village wins when the last wolf is voted out. Wolves win when they equal or outnumber the "
       "villagers still alive.", bold_lead="Winning. ")
bullet("One night + one day is 8–10 minutes. Three to five rounds is a satisfying game.",
       bold_lead="Pace. ")

# ---------------- 2 · what you need ----------------
doc.add_heading("2 · What you need", level=1)
t = doc.add_table(rows=7, cols=3)
data = [
    ("Item", "Where it comes from", "How many"),
    ("Role cards", "werewolf-role-cards.pdf, pages 1–3", "28 cards: 3 wolf, 1 detective, 1 doctor, 23 villager"),
    ("Spares + spectator cards", "werewolf-role-cards.pdf, page 4", "optional — replacements and 3 spectator cards"),
    ("Ballot slips", "werewolf-props.pdf, page 1", "28 per game (one sheet = 12; print 3 sheets)"),
    ("Accusation slips", "werewolf-props.pdf, page 2", "28 per day (print 5 sheets for a full game)"),
    ("Moderator pocket card", "werewolf-props.pdf, page 3", "1 for you (the sheet has 2 identical copies)"),
    ("Role reference poster", "werewolf-props.pdf, page 4", "1, on the board or wall"),
]
for ri, row in enumerate(data):
    for ci, val in enumerate(row):
        cell_text(t.rows[ri].cells[ci], val, bold=(ri == 0), size=9.5)
style_table(t, [4.2, 6.0, 6.8])
para("")
para("Also grab: a mug or box for ballots, any object as the \u201ctalking stick\u201d (a whiteboard marker "
     "works), your phone as a visible timer, and cardstock for the cards if you have it.", color=MUTED)

# ---------------- 3 · prep ----------------
doc.add_heading("3 · Prep — 10 minutes before class", level=1)
bullet("Cut the 28 role cards, shuffle, and keep the spares in your folder.")
bullet("Decide your detective signal and rehearse it once: thumb UP = werewolf, thumb DOWN = innocent. "
       "Keep your signalling hand low, near your chest, so a peeking neighbour can't see it.")
bullet("Arrange seats so everyone can see everyone (circle or paired rows facing in). Ballot box at the front.")
bullet("Deal one card per student face down either as they enter or right after the intro slide. "
       "What they do with a role is private — no swapping, no showing.")

# ---------------- 4 · being the moderator ----------------
doc.add_heading("4 · The one rule of being the moderator", level=1)
para("You are the referee and the storyteller — never a player, never a hint-giver, never on anyone's team. "
     "Follow the script below word-for-word the first time you run it: it keeps nights tight, keeps your "
     "signals consistent, and keeps the game fair. Use the pocket card from the props pack at your desk.")
rich([("Spectator rule: ", {"b": True}),
      ("when a player is eliminated they stay in the room as a silent shadow — they may watch everything "
       "but say nothing and react to nothing until the final reveal.", {})])

# ---------------- 5 · the script ----------------
doc.add_heading("5 · The script — what to say, word for word", level=1)
t = doc.add_table(rows=10, cols=3)
script = [
    ("When", "Say", "Then do"),
    ("Opening", "\u201cWe are a village, and wolves are hiding among us. Each night they take a victim. Each day we "
     "debate and vote on who to banish. Village wins if we vote out every wolf. Wolves win if they "
     "survive to match our numbers. I am the moderator — I never play. No talking at night, no peeking. Ready?\u201d",
     "Deal cards face down if you haven't. Show the roles slide (slide 4)."),
    ("Night falls", "\u201cNight falls on the village. Everyone close your eyes, heads down. No peeking, no talking.\u201d",
     "Wait 5 seconds. Scan for peekers. Total silence."),
    ("Wolves wake", "\u201cWerewolves — open your eyes. Look at your pack. Werewolves, point together at one villager "
     "to eliminate.\u201d", "Wait until all wolves point at the same player. Memorise the victim. \u201cWerewolves, close your eyes.\u201d"),
    ("Detective wakes", "\u201cDetective, open your eyes. Point at any player.\u201d",
     "Silent signal: thumb UP = wolf, thumb DOWN = innocent. \u201cDetective, close your eyes.\u201d"),
    ("Doctor wakes", "\u201cDoctor, open your eyes. Point at one player to protect — not the same person twice in a row.\u201d",
     "Nod so they know you saw. \u201cDoctor, close your eyes.\u201d"),
    ("Dawn", "\u201cVillage, open your eyes!\u201d",
     "If the doctor saved the target: \u201cThe wolves attacked last night — but the doctor was there. Nobody died.\u201d "
     "Otherwise: \u201c[Name] was attacked last night. [Name], you are out — take a spectator card, you are a shadow now.\u201d"),
    ("Debate", "\u201cOne minute of silence to think and look around.\u201d … after 60 seconds: \u201cFive minutes of debate. "
     "Only the person holding the talking stick speaks. Every accusation needs a because.\u201d",
     "Start the visible 5-minute timer. Pass the stick. Hard-stop at zero."),
    ("The vote", "\u201cTime. Fill in your ballot: one name, fold it, drop it in the box.\u201d",
     "Collect, then count aloud one slip at a time and tally on the board."),
    ("Result", "Majority: \u201c[Name] is banished. One last sentence — then you're a shadow.\u201d  "
     "Tie: \u201cTied vote. Nobody dies today. Night falls again.\u201d",
     "Eliminated player sits to the side with their spectator card. Check win conditions (below), then start the next night."),
]
for ri, row in enumerate(script):
    for ci, val in enumerate(row):
        cell_text(t.rows[ri].cells[ci], val, bold=(ri == 0),
                  italic=(ri > 0 and ci == 1), size=9)
style_table(t, [2.4, 9.6, 5.0])

# ---------------- 6 · ending ----------------
doc.add_heading("6 · Ending the game (always do the reveal)", level=1)
para("After every elimination, silently count wolves vs villagers. All wolves gone \u2192 village wins. "
     "Wolves equal or outnumber villagers \u2192 wolves win. Then have everyone open their cards and show "
     "who was who — kids need to check their hunches. Finish with applause for the winning side, wolves "
     "or village: a clever wolf win deserves the same clap as a clever village win.")

# ---------------- 7 · timing ----------------
doc.add_heading("7 · Timing plans", level=1)
t = doc.add_table(rows=4, cols=3)
tim = [
    ("Lesson time", "Realistic plan", "Notes"),
    ("30 min", "One tight game, 3 rounds", "Skip the debrief or take 2 questions on the way out"),
    ("45 min", "One game, 4 rounds + debrief", "The sweet spot for a first run"),
    ("60 min", "Two games + full debrief", "Second game: deal new roles; try the spicy variant"),
]
for ri, row in enumerate(tim):
    for ci, val in enumerate(row):
        cell_text(t.rows[ri].cells[ci], val, bold=(ri == 0), size=9.5)
style_table(t, [3.0, 7.0, 7.0])

# ---------------- 8 · pitfalls ----------------
doc.add_heading("8 · Common problems and fixes", level=1)
t = doc.add_table(rows=9, cols=2)
fix = [
    ("Problem", "Fix"),
    ("The debate drags on", "Hard 5-minute cap with a visible timer. When it rings: \u201cHands on heads — ballot time.\u201d"),
    ("One confident kid dominates", "Only the talking-stick holder speaks. Rotate it deliberately to quiet students."),
    ("Shy students never participate", "Everyone must hand in one accusation slip per day (no name needed). Ballots are anonymous, so quiet kids vote fearlessly."),
    ("The detective announces themselves on day 1", "Before round 1, say: \u201cWhoever you are, detective — survive first, reveal later.\u201d If it still happens, let it play out; it's a lesson in itself."),
    ("Wolves coordinate too openly by day", "Remind everyone: \u201cWolves must act like villagers — bluff, deflect, accuse.\u201d"),
    ("Someone takes a loss personally", "Normalize it: the goal is to survive, but losing well is part of the game. Ban jokes aimed at real personal traits. Applause rule helps."),
    ("Peeking at night", "First offence = public warning. Second = the player sits out the game and spectates."),
    ("Eliminated students whisper hints", "Spectators are shadows — seat them together against a wall, away from living players."),
]
for ri, row in enumerate(fix):
    for ci, val in enumerate(row):
        cell_text(t.rows[ri].cells[ci], val, bold=(ri == 0), size=9)
style_table(t, [5.0, 12.0])

# ---------------- 9 · debrief ----------------
doc.add_heading("9 · Debrief — 10 minutes, and the actual learning", level=1)
para("This is where the game becomes ILT evidence: evaluating evidence, persuasion, source-checking and "
     "group psychology — the students did it, they just called it fun. Pick three questions:")
for q in [
    "What actually helped you decide your vote — and what was just noise?",
    "When the loudest voice won an argument, were they right?",
    "Did you change your mind mid-day? What changed it?",
    "Wolves: what was hardest about lying to your friends?",
    "Detective: when did you sit on information, and why?",
    "What should the village do differently in the next game?",
]:
    bullet(q)

# ---------------- 10 · variants ----------------
doc.add_heading("10 · Variants for game two", level=1)
bullet("Swap one villager card for the spare wolf card: 4 wolves, 22 villagers. Accusations fly faster — "
       "great for a confident group.", bold_lead="Spicy wolves. ")
bullet("Once per day, wolves may briefly flash their eyes open to see each other. Adds coordination "
       "without speaking.", bold_lead="Wolf glance. ")
bullet("If the vote ties two days in a row, the village must nominate exactly two players and choose "
       "between them. No endless stalling.", bold_lead="Forced choice. ")

rich([("Print pack: ", {"b": True}),
      ("werewolf-role-cards.pdf (4 pages) · werewolf-props.pdf (4 pages) · deck: werewolf-ilt.pptx. "
       "Keep this guide and the moderator pocket card in your hand all lesson.", {"c": MUTED, "i": True})],
     space_after=0)

# ---------------- footer with page number ----------------
f = sec.footer.paragraphs[0]
f.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = f.add_run("Werewolf · Facilitator Guide · Integrated Learning Time   —   ")
r.font.size = Pt(8); r.font.color.rgb = MUTED
fld = OxmlElement("w:fldSimple"); fld.set(qn("w:instr"), "PAGE \\* MERGEFORMAT")
f._p.append(fld)

doc.save("D:/temp/ILT/werewolf-facilitator-guide.docx")
print("saved D:/temp/ILT/werewolf-facilitator-guide.docx")
