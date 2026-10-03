# PPT-Convert — render a PPTX deck as one image per slide

Students submit Google Slides work as `.pptx` downloads. This tool turns a deck
into a numbered series of `.png` (or `.jpg`) files — one per slide — so the work
can be reviewed, archived, or fed to a marking pass.

Zero Python dependencies: real slide rendering needs a real renderer, so the
tool auto-detects one.

1. **PowerPoint** (Windows COM automation via PowerShell) — full fidelity.
2. **LibreOffice headless** → PDF → per-slide images (via PyMuPDF, if installed).
3. If neither exists, it says so — a PPTX cannot be faithfully rendered without
   one. (Fallback: Google Slides → File → Download → PDF, then split the PDF.)

## Usage

```
python pptx_to_images.py deck.pptx                 # -> ./deck_slides/slide-01.png ...
python pptx_to_images.py deck.pptx -o outdir --fmt jpg --width 1920
python pptx_to_images.py folder_of_decks           # every .pptx in the folder
```

| Flag | Default | Meaning |
|---|---|---|
| `-o` / `--outdir` | `<deck>_slides` next to the file | where images land |
| `--fmt` | `png` | `png` or `jpg` |
| `--width` | 1600 | pixel width of exported slides (height follows the deck's aspect) |
| `--engine` | `auto` | force `ppt` or `soffice` |

Output naming: `<deck>_slide-01.png`, `_02`, … (zero-padded, deck order).
