# Document templates (A4)

Print-ready student documents for Room 8, built on one shared design system.

| template | pages | what it is for |
|---|---|---|
| `A4_Handout.html` | 2 | Notes, a term table, questions, a memory hook, a sign-off. The general student handout. |
| `A4_Quiz.html` | 3 | Two pages of questions, then a separate answer-key sheet. |
| `A4_Worksheet.html` | 2 | Done in class on paper, chunked into parts, with an exit ticket. |
| `A4_Case_File.html` | 2 | A mystery built out of documents: case banner, evidence cards, questions. |

Open `index.html` to browse them.

## The theme

Everything is styled by **`Student_System/doc_theme.css`**. The templates only carry
content — no CSS of their own beyond the shared file. Change a token in the theme and
every document follows.

The look is the newest house direction: the teal / ink / warm palette and the
Open Sans + Open Sans Condensed + JetBrains Mono type scale built for the Germs &
Outbreaks unit (HL8 Unit 2), combined with the millimetre-exact sheet geometry and the
quiz components (section slabs, option grids, tick boxes, fill-in rules) that already
proved themselves on paper.

Before this existed, each A4 printable in the repo carried its own palette and its own
page geometry. Three design systems were running side by side. This replaces them.

## Using one

1. Copy the template into the course folder the document belongs to, e.g.
   `HealthyLiving8/Unit 2 - Communicable Disease/`.
2. Fix the theme path for the new depth:
   - one level below the repo root → `../Student_System/doc_theme.css`
   - two levels below → `../../Student_System/doc_theme.css`
3. Replace the `[bracketed placeholders]`. Nothing else needs touching.
4. Open it in a browser and press **Print**. Choose A4 and *background graphics on*.

If a document has to be a single portable file, inline the theme instead of linking it:

```bash
python ../bihipri-27/tools-priv/build_doc_template.py --inline "HealthyLiving8/Unit 2 - Communicable Disease/My_Task.html"
```

## The one rule that breaks silently

**One `.sheet` block = one A4 page.** Content that overflows a sheet pushes onto a
second physical page and the document comes out with a half-empty orphan page. There is
no clipping to hide it, so nothing looks broken until it is printed.

Always check: the number of printed pages must equal the number of `.sheet` blocks.

```bash
# prints to PDF and counts physical pages
chrome --headless --no-pdf-header-footer --print-to-pdf=out.pdf "file:///path/to/doc.html"
```

## Components

| class | what it does |
|---|---|
| `.sheet` | one A4 page (210 × 297 mm, padding 12/13 mm) |
| `.toolbar` | the screen-only bar with the Print button |
| `.head` / `.head-top` / `.head-main` / `.meta` / `.fill` | the title block and the name/class/date rules |
| `.tag` | a small pill — add `.teal`, `.warm` or `.good` |
| `.sec-head` | the section slab; `.pts` carries the points; `.warm` / `.good` / `.ink` recolour the left rule |
| `h3` / `h4` | subheading / small mono heading with a rule |
| `.note` / `.tip` / `.exemplar` | the three callouts — teal, warm, green |
| `.say` | a pronunciation or science-word label |
| `.q` / `.qn` | questions. **`.q` prints no native marker** — write the number out as `<span class="qn">1.</span>` so it can be restarted or lettered |
| `.opts` | option grid; `.one`, `.three`, `.four` change the column count |
| `.opt` / `.box` | a tick-box option |
| `.checks` | a checklist of tick boxes |
| `.lines` / `.l` | ruled writing lines |
| `.fill-line` | an inline rule to write on |
| `.key` | the marking note under an answer key |
| `.src` | where the facts came from |
| `.sheet-foot` | the footer, pinned to the bottom of the sheet |
| `.signoff` | the name-and-sign strip |
| `.case-title` / `.evidence` / `.ev-head` / `.ev-body` | the case-file furniture |
| `.case-cols` | two- or three-column layout on a case brief |

## House rules that apply to every document

- **Plain words.** A grade 8 reader should be able to read a paragraph aloud without
  stumbling.
- **One instruction per question.** The hint carries the *how*, never the answer.
- **Chunked.** Short sections with their own point value, so a student can finish one and
  move on.
- **Say where the facts came from.** Every document ends with a `.src` line.
- **Print in colour.** The callout colours carry meaning, not decoration.
