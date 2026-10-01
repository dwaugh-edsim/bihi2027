"""Builds werewolf-role-cards.pdf and werewolf-props.pdf — printable game materials (A4)."""
import math
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth

PW, PH = A4                      # 595 x 842 pt
M = 28                           # page margin
BG    = HexColor("#0F1726")
PANEL = HexColor("#1A2540")
TEXT  = HexColor("#F2EFE6")
MUTED = HexColor("#9AA6BF")
GOLD  = HexColor("#F2C14E")
GOLDD = HexColor("#6E5A24")
RED   = HexColor("#E4572E")
REDP  = HexColor("#351B1E")
HAIR  = HexColor("#3A4763")
CUT   = HexColor("#C9CDD6")

FB, FBOLD = "Helvetica", "Helvetica-Bold"

def wrap(text, font, size, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if stringWidth(t, font, size) <= maxw: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def rrect(c, x, y, w, h, r, fill, stroke=None, lw=0.8):
    c.setLineWidth(lw)
    if fill: c.setFillColor(fill)
    if stroke: c.setStrokeColor(stroke)
    c.roundRect(x, y, w, h, r, stroke=1 if stroke else 0, fill=1 if fill else 0)

# ---- icons (drawn in a box centred at cx,cy with size k) -------------------
def icon_paw(c, cx, cy, k, col):
    c.setFillColor(col)
    c.ellipse(cx-0.30*k, cy-0.30*k, cx+0.30*k, cy+0.12*k, stroke=0, fill=1)
    for dx, dy, dd in [(-0.40,0.12,0.20),(-0.15,0.26,0.22),(0.15,0.26,0.22),(0.40,0.12,0.20)]:
        c.circle(cx+dx*k, cy+dy*k, dd*k/2, stroke=0, fill=1)

def icon_lens(c, cx, cy, k, col):
    c.setStrokeColor(col); c.setLineWidth(0.10*k)
    c.circle(cx-0.10*k, cy+0.10*k, 0.34*k, stroke=1, fill=0)
    c.saveState()
    c.translate(cx+0.26*k, cy-0.26*k); c.rotate(45)
    c.setFillColor(col)
    c.rect(-0.20*k, -0.075*k, 0.40*k, 0.15*k, stroke=0, fill=1)
    c.restoreState()

def icon_cross(c, cx, cy, k, col):
    c.setFillColor(col); r = 0.09*k
    c.roundRect(cx-0.10*k, cy-0.36*k, 0.20*k, 0.72*k, r, stroke=0, fill=1)
    c.roundRect(cx-0.36*k, cy-0.10*k, 0.72*k, 0.20*k, r, stroke=0, fill=1)

def icon_house(c, cx, cy, k, col):
    c.setFillColor(col)
    p = c.beginPath()
    p.moveTo(cx-0.46*k, cy+0.05*k); p.lineTo(cx, cy+0.46*k); p.lineTo(cx+0.46*k, cy+0.05*k)
    p.close(); c.drawPath(p, stroke=0, fill=1)
    c.rect(cx-0.32*k, cy-0.42*k, 0.64*k, 0.44*k, stroke=0, fill=1)

def icon_moon(c, cx, cy, k, col, over=BG):
    c.setFillColor(col); c.circle(cx, cy, 0.38*k, stroke=0, fill=1)
    c.setFillColor(over); c.circle(cx+0.16*k, cy+0.12*k, 0.32*k, stroke=0, fill=1)

ICONS = {"paw": icon_paw, "lens": icon_lens, "cross": icon_cross, "house": icon_house, "moon": icon_moon}

# ---- role card (default 172 x 235 pt) --------------------------------------
def role_card(c, x, y, w, h, role):
    rrect(c, x, y, w, h, 10, role["panel"] if role["key"]=="wolf" else BG,
          stroke=role["col"] if role["key"]=="wolf" else HAIR, lw=1.4)
    pad = 13
    ix, iy = x+pad, y+h-pad
    c.setFillColor(role["col"]); c.setFont(FBOLD, 7.5)
    c.drawString(ix, iy-6, role["team"])
    c.setFont(FB, 7.5); c.setFillColor(MUTED)
    c.drawRightString(x+w-pad, iy-6, role["count"])
    c.setFillColor(TEXT if role["key"] != "wolf" else RED)
    fs = 21 if len(role["name"]) < 10 else 17
    c.setFont(FBOLD, fs)
    c.drawString(ix, iy-30, role["name"])
    # icon
    ICONS[role["icon"]](c, x+w/2, y+h*0.60, 66 if role["key"] in ("villager","spectator") else 56,
                        role["col"])
    # blocks
    c.setStrokeColor(HAIR); c.setLineWidth(0.7)
    c.line(ix, y+h*0.44, x+w-pad, y+h*0.44)
    ty = y+h*0.40
    for bi, (label, body) in enumerate(role["blocks"]):
        c.setFont(FBOLD, 7); c.setFillColor(role["col"])
        c.drawString(ix, ty, label)
        ty -= 11
        c.setFont(FB, 8.6); c.setFillColor(TEXT)
        for ln in wrap(body, FB, 8.6, w-2*pad):
            c.drawString(ix, ty, ln); ty -= 11
        ty -= (5 if bi < len(role["blocks"])-1 else 2)

def page_header(c, left, right):
    c.setFont(FBOLD, 8); c.setFillColor(MUTED)
    c.drawString(M, PH-M+2, left)
    c.setFont(FB, 8)
    c.drawRightString(PW-M, PH-M+2, right)
    c.setStrokeColor(HAIR); c.setLineWidth(0.6)
    c.line(M, PH-M-6, PW-M, PH-M-6)

ROLES = {
    "wolf": dict(key="wolf", name="WEREWOLF", team="TEAM: WOLVES", count="3 of 28 in play",
                 col=RED, panel=REDP, icon="paw",
                 blocks=[("NIGHT", "Wake with the pack. Point together at one villager to eliminate."),
                         ("DAY", "Blend in. Deflect. Vote like a villager."),
                         ("YOU WIN", "when wolves match the living villagers.")]),
    "detective": dict(key="detective", name="DETECTIVE", team="TEAM: VILLAGE", count="1 of 28 in play",
                 col=GOLD, panel=BG, icon="lens",
                 blocks=[("NIGHT", "Wake alone. Point at one player. The moderator answers: thumb UP = wolf, thumb DOWN = innocent."),
                         ("DAY", "Guard your secret. Reveal too early and the wolves kill you at dawn.")]),
    "doctor": dict(key="doctor", name="DOCTOR", team="TEAM: VILLAGE", count="1 of 28 in play",
                 col=GOLD, panel=BG, icon="cross",
                 blocks=[("NIGHT", "Wake alone. Point at one player to protect. If the wolves attacked them, nobody dies."),
                         ("RULES", "Not the same person twice in a row. You may protect yourself.")]),
    "villager": dict(key="villager", name="VILLAGER", team="TEAM: VILLAGE", count="23 of 28 in play",
                 col=GOLD, panel=BG, icon="house",
                 blocks=[("NIGHT", "Sleep. You have no powers."),
                         ("DAY", "Ask questions. Track stories. Vote the wolves out.")]),
    "spectator": dict(key="spectator", name="SPECTATOR", team="TEAM: VILLAGE", count="eliminated",
                 col=MUTED, panel=PANEL, icon="moon",
                 blocks=[("NOW", "Watch everything. Say nothing until the final reveal."),
                         ("", "No faces. No hints. You are a shadow.")]),
}

# ============ PDF 1 · ROLE CARDS (9 per page, 172x235 pt) ===================
out1 = "D:/temp/ILT/werewolf-role-cards.pdf"
c = canvas.Canvas(out1, pagesize=A4)
c.setTitle("Werewolf — Role Cards (print & cut)")
c.setAuthor("ILT"); c.setCreator("Z.ai"); c.setSubject("Printable role cards for the Werewolf class game")

deck = (["wolf"]*3 + ["detective", "doctor"] + ["villager"]*4,
        ["villager"]*9,
        ["villager"]*9,
        ["villager"]*3 + ["wolf", "detective", "doctor", "spectator", "spectator", "spectator"])

CW, CH = 172, 235
GX = (PW - 2*M - 3*CW) / 2
GY = 16
for pi, page in enumerate(deck):
    page_header(c, "WEREWOLF · ROLE CARDS",
                "print on card · cut along the cards · deal FACE DOWN · one per student")
    label = {0: "PAGE 1 — WOLVES & SPECIALS (standard game)",
             1: "PAGE 2 — VILLAGERS",
             2: "PAGE 3 — VILLAGERS",
             3: "PAGE 4 — SPARES & SPECTATORS"}[pi]
    for i, key in enumerate(page):
        col, row = i % 3, i // 3
        x = M + col * (CW + GX)
        y = PH - M - 14 - (row+1)*CH - row*GY
        r = dict(ROLES[key])
        if pi == 3 and key != "spectator":
            r["count"] = {"wolf": "spare — 4-wolf variant", "detective": "spare card",
                          "doctor": "spare card", "villager": "spare card"}.get(key, r["count"])
        role_card(c, x, y, CW, CH, r)
        rrect(c, x-2.5, y-2.5, CW+5, CH+5, 12, None, stroke=CUT, lw=0.5)
    c.showPage()
c.save()
print("saved", out1)

# ============ PDF 2 · PROPS =================================================
out2 = "D:/temp/ILT/werewolf-props.pdf"
c = canvas.Canvas(out2, pagesize=A4)
c.setTitle("Werewolf — Props Pack (ballots, slips, moderator card, reference)")
c.setAuthor("ILT"); c.setCreator("Z.ai"); c.setSubject("Voting ballots, accusation slips, moderator pocket card, role reference")

def grid_positions(cols, rows, cw, chh, gx, gy):
    for r in range(rows):
        for cc in range(cols):
            yield M + cc*(cw+gx), PH - M - 20 - (r+1)*chh - r*gy

# --- P1: ballots 3x4, 172x178
BW, BH, GB = 172, 178, 9
page_header(c, "WEREWOLF · PROPS", "ballot slips — print one sheet per game day, cut, keep in the box")
for i, (x, y) in enumerate(grid_positions(3, 4, BW, BH, (PW-2*M-3*BW)//2, GB)):
    rrect(c, x, y, BW, BH, 8, BG, stroke=HAIR, lw=1)
    icon_moon(c, x+BW/2, y+BH-30, 26, GOLD)
    c.setFont(FBOLD, 13); c.setFillColor(TEXT)
    c.drawCentredString(x+BW/2, y+BH-62, "THE VOTE")
    c.setFont(FB, 9); c.setFillColor(MUTED)
    c.drawCentredString(x+BW/2, y+BH-76, "Day ______")
    c.setFont(FBOLD, 9.5); c.setFillColor(GOLD)
    c.drawString(x+16, y+BH-102, "I vote to eliminate:")
    c.setStrokeColor(MUTED); c.setLineWidth(0.8)
    c.line(x+16, y+42, x+BW-16, y+42)
    c.setFont(FB, 7); c.setFillColor(MUTED)
    c.drawCentredString(x+BW/2, y+18, "fold once · drop in the box · one name only")
c.showPage()

# --- P2: accusation slips 3x2, 172x365
AW, AH = 172, 365
page_header(c, "WEREWOLF · PROPS", "secret accusation slips — everyone hands one in every day, every game")
for x, y in grid_positions(3, 2, AW, AH, (PW-2*M-3*AW)//2, 14):
    rrect(c, x, y, AW, AH, 8, BG, stroke=HAIR, lw=1)
    c.setFont(FBOLD, 10); c.setFillColor(GOLD)
    c.drawString(x+16, y+AH-30, "SECRET ACCUSATION")
    c.setFont(FB, 8.5); c.setFillColor(MUTED)
    c.drawString(x+16, y+AH-44, "Day ______")
    c.setFont(FB, 10); c.setFillColor(TEXT)
    c.drawString(x+16, y+AH-72, "I suspect ____________________")
    c.drawString(x+16, y+AH-92, "because...")
    c.setStrokeColor(HexColor("#55617E")); c.setLineWidth(0.6)
    for li in range(7):
        yy = y+AH-120 - li*26
        c.line(x+16, yy, x+AW-16, yy)
    c.setFont(FB, 7); c.setFillColor(MUTED)
    c.drawCentredString(x+AW/2, y+16, "no name is fine — write \u201cnot sure yet\u201d")
c.showPage()

# --- P3: moderator pocket cards x2
MW, MH = 250, 470
page_header(c, "WEREWOLF · PROPS", "moderator pocket card — cut out, keep in your hand all game")
for pi in range(2):
    x = M + 6 + pi * (MW + 22); y = PH - M - 20 - MH
    rrect(c, x, y, MW, MH, 10, BG, stroke=GOLD, lw=1.2)
    c.setFillColor(GOLD); c.setFont(FBOLD, 12)
    c.drawString(x+18, y+MH-32, "MODERATOR · NIGHT ORDER")
    lines = [
        ("1", "NIGHT FALLS", "\u201cHeads down, eyes closed, absolute silence.\u201d"),
        ("2", "WEREWOLVES", "\u201cWolves, open your eyes. Point together at one victim.\u201d Nod. \u201cClose your eyes.\u201d"),
        ("3", "DETECTIVE", "\u201cDetective, open your eyes. Point at one player.\u201d Thumb up = WOLF, thumb down = innocent. \u201cClose your eyes.\u201d"),
        ("4", "DOCTOR", "\u201cDoctor, open your eyes. Point to protect \u2014 not the same player twice in a row.\u201d Nod. \u201cClose your eyes.\u201d"),
        ("5", "DAWN", "\u201cVillage, wake up!\u201d Announce who died \u2014 or \u201cthe doctor saved them, nobody died.\u201d"),
    ]
    yy = y+MH-56
    for num, head, body in lines:
        c.setFillColor(GOLD); c.circle(x+26, yy+9, 8, stroke=0, fill=1)
        c.setFillColor(BG); c.setFont(FBOLD, 9)
        c.drawCentredString(x+26, yy+6, num)
        c.setFillColor(TEXT); c.setFont(FBOLD, 9.5)
        c.drawString(x+42, yy+5, head)
        c.setFont(FB, 8.3); c.setFillColor(MUTED)
        for ln in wrap(body, FB, 8.3, MW-64):
            yy -= 10.5
            c.drawString(x+42, yy, ln)
        yy -= 20
    c.setStrokeColor(HAIR); c.setLineWidth(0.7); c.line(x+18, yy+8, x+MW-18, yy+8)
    yy -= 4
    c.setFillColor(GOLD); c.setFont(FBOLD, 9.5)
    c.drawString(x+18, yy, "THE DAY")
    yy -= 14
    for body in ["60 sec silence \u2192 5 min debate (talking object, timer rules)",
                 "Every accusation needs a BECAUSE",
                 "Ballot slips \u2192 count aloud \u2192 majority is eliminated",
                 "Tie = nobody dies · eliminated = one last sentence, then silence"]:
        c.setFillColor(TEXT); c.setFont(FB, 8.3)
        for ln in wrap("\u2014  " + body, FB, 8.3, MW-40):
            c.drawString(x+18, yy, ln); yy -= 11
        yy -= 3
    yy -= 6
    c.setFillColor(RED); c.setFont(FBOLD, 8.5)
    c.drawString(x+18, yy, "CHECK THE WIN")
    c.setFillColor(MUTED); c.setFont(FB, 8.3)
    yy -= 12
    for body in ["All wolves gone \u2192 VILLAGE WINS", "Wolves \u2265 villagers \u2192 WOLVES WIN"]:
        c.drawString(x+18, yy, body); yy -= 11
    c.setFillColor(MUTED); c.setFont(FB, 7.5)
    c.drawCentredString(x+MW/2, y+14, "You never play. You never hint. You are the referee.")
c.showPage()

# --- P4: role reference poster (A4 portrait)
page_header(c, "WEREWOLF · ROLE REFERENCE", "post on the board · everyone can check it at any time")
cw2, chh2 = 246, 300
positions = [(M+8, PH-M-20-chh2), (M+8+cw2+20, PH-M-20-chh2),
             (M+8, PH-M-20-2*chh2-18), (M+8+cw2+20, PH-M-20-2*chh2-18)]
for key, (x, y) in zip(["wolf", "detective", "doctor", "villager"], positions):
    role_card(c, x, y, cw2, chh2, ROLES[key])
ty = M + 30
rrect(c, M, ty, PW-2*M, 82, 8, PANEL)
c.setFillColor(GOLD); c.setFont(FBOLD, 10)
c.drawString(M+18, ty+58, "HOW THE GAME ENDS")
c.setFillColor(TEXT); c.setFont(FB, 9.5)
c.drawString(M+18, ty+38, "Village wins when every wolf has been voted out.")
c.drawString(M+18, ty+22, "Wolves win when they equal or outnumber the living villagers.")
c.setFillColor(MUTED); c.setFont(FB, 8.5)
c.drawString(M+18, ty+7, "One round = night (90 sec) + day (60 sec silence, 5 min debate, vote). Play 3\u20135 rounds.")
c.showPage()
c.save()
print("saved", out2)
