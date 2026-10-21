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

The look is **the house system you have been using since September**: Roboto Slab
headings, Inter body, JetBrains Mono labels, pure-black rules, zinc neutrals,
`#2563eb` blue accents, black slab section heads, and exact 210 × 297 mm sheets.
That is the system behind the Junction A4 set (Oct 15–16), the HL9 quiz
(Sep 15–17) and the ILT signs (Sep 14).

Before this file existed, every A4 printable re-implemented that look by hand —
the same fonts, the same rules, the same millimetre geometry, typed out again in
each document. That is how they drift. This file is the system written down once.

The Germs & Outbreaks unit (Oct 2026) moved to a different palette — teal / ink /
warm with Open Sans Condensed. That direction is kept in the theme as a
switchable variant: add `data-palette="germs"` to the `<html>` tag and the same
templates render in it.

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
| `.sheet` | one A4 page (210 × 297 mm, padding 11/14/10/14 mm). `data-side="Page 1"` writes the marker bottom-right |
| `.toolbar` | the screen-only bar with the Print button |
| `.head` / `.head-top` / `.head-main` / `.meta` / `.fill` | the title block and the name/class/date rules |
| `.ident` | a row of long rules to write a name on |
| `.tag` | a small pill — add `.blue`, `.amber` or `.green` |
| `.sec-head` | the black section slab; `.pts` carries the points; `.blue` / `.amber` / `.green` recolour the slab, `.ghost` outlines it instead |
| `h3` / `h4` | subheading / small mono heading |
| `.note` / `.tip` / `.exemplar` | the three callouts — blue, amber, green |
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
| `.case-title` / `.evidence` / `.ev-head` / `.ev-body` | the case-file furniture; `.blue` / `.amber` / `.green` recolour the evidence rule |
| `.case-cols` | two- or three-column layout on a case brief |

## Palettes

The theme ships the house system by default. One attribute switches the whole
document to the Germs & Outbreaks direction:

```html
<html lang="en" data-palette="germs">
```

Same components, same geometry, different palette and type — teal `#006376` /
ink `#1c2622` / warm `#c2410c`, Open Sans body, Open Sans Condensed headings,
soft `#d8d5cb` rules instead of hard black.

## House rules that apply to every document

- **Plain words.** A grade 8 reader should be able to read a paragraph aloud without
  stumbling.
- **One instruction per question.** The hint carries the *how*, never the answer.
- **Chunked.** Short sections with their own point value, so a student can finish one and
  move on.
- **Say where the facts came from.** Every document ends with a `.src` line.
- **Print in colour.** The callout colours carry meaning, not decoration.
