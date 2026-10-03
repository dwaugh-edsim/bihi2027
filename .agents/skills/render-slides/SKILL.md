---
name: render-slides
description: Render student PPTX/Google-Slides decks to one PNG/JPG image per
  slide so the work can be read and marked. Use whenever the user mentions
  PPTX, PowerPoint, Google Slides, slide decks, or asks to render/convert/view
  student slides as images — even if they don't name a tool.
---

# Render student slide decks to images

Students submit Google Slides work as `.pptx` downloads. A PPTX cannot be
faithfully rasterized by pure Python — it needs a real slide renderer. The
repo ships a tool that wraps one; never hand-roll a new renderer, never
re-derive these gotchas.

## The tool

`PPT-Convert/pptx_to_images.py` at the repo root (tracked, pushed — available
on both machines; see `PPT-Convert/README.md` for the user-facing doc).

```bash
python PPT-Convert/pptx_to_images.py deck.pptx                 # → ./deck_slides/slide-01.png …
python PPT-Convert/pptx_to_images.py deck.pptx -o outdir --fmt jpg --width 1920
python PPT-Convert/pptx_to_images.py folder_of_decks           # batch every .pptx in a folder
```

Output: `<deck>_slide-01.png`, `_02`, … zero-padded, in deck order. Aspect
ratio is computed from the deck's own PageSetup — never assume 16:9.

## Engine selection (automatic)

1. **PowerPoint COM** via PowerShell — full fidelity, no Python deps. Works on
   the home machine (Office 16 confirmed 2026-10-03). Runs invisibly.
2. **LibreOffice headless** → PDF → PyMuPDF — fallback (school machine if it
   has LibreOffice but no PowerPoint).
3. Neither → the tool errors with guidance. The honest fallback then is
   Google Slides → File → Download → PDF, then split pages with PyMuPDF
   (`import pymupdf`, already installed at home). Do not invent a pure-Python
   PPTX renderer.

Force with `--engine ppt|soffice` if auto-detect picks wrong.

## If the render fails or looks wrong

- "PowerPoint can't save ^0 to ^1" — a path or dimension problem: the tool
  already normalizes paths to backslashes and computes height from PageSetup;
  if it recurs, check the output dir exists and is a native Windows path, not
  a `/tmp`-style Git-Bash path.
- Blank or garbled slides — re-render one slide at a time with a plain width
  (1200) before assuming the deck is the problem.
- Verify fidelity by Reading one output image before marking from a batch.

## After rendering (marking context)

The output images can be Read directly as images for review/marking. When
reporting on student slide work in chat or any agent-visible output, follow
the repo's presentation convention: first name + last two initials
(`Jordan Th.`), never full names or emails.
