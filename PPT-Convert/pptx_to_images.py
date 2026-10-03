"""Render a PPTX deck (e.g. a Google Slides download) to one PNG/JPG per slide.

Real slide rendering needs a real renderer, so this tool auto-detects, in order:
  1. PowerPoint (Windows COM automation via PowerShell — no Python deps, full fidelity)
  2. LibreOffice headless (soffice) -> PDF -> per-slide images via PyMuPDF
If neither exists it says so plainly; there is no faithful pure-Python fallback.

Usage:
  python tools-priv/pptx_to_images.py deck.pptx                  # ./deck_slides/slide-01.png
  python tools-priv/pptx_to_images.py deck.pptx -o outdir --fmt jpg --width 1920
  python tools-priv/pptx_to_images.py folder_of_decks            # converts every .pptx inside
  python tools-priv/pptx_to_images.py deck.pptx --engine soffice # force LibreOffice
"""

import argparse
import os
import subprocess
import sys
import tempfile

sys.stdout.reconfigure(encoding="utf-8")

PS_TEMPLATE = r"""
$ErrorActionPreference = 'Stop'
try {{ $app = New-Object -ComObject PowerPoint.Application }} catch {{ Write-Output 'NO_PPT_COM'; exit 1 }}
try {{
  $pres = $app.Presentations.Open('{pptx}', $true, $false, $false)  # ReadOnly, not untitled, no window
  $w = {width}
  $h = [int]($pres.PageSetup.SlideHeight / $pres.PageSetup.SlideWidth * $w)
  $i = 0
  foreach ($slide in $pres.Slides) {{
    $i++
    $out = '{outdir}\{stem}_slide-{{0:d2}}.{ext}' -f $i
    $slide.Export($out, '{fmt2}', $w, $h)
  }}
  Write-Output ('OK ' + $i + ' slides')
  $pres.Close()
}} catch {{ Write-Output ('PPT_FAIL: ' + $_.Exception.Message) }}
finally {{ $app.Quit() }}
"""


def detect_ppt():
    if os.name != "nt":
        return False
    probe = ("try { $p = New-Object -ComObject PowerPoint.Application; "
             "$p.Quit(); Write-Output 'YES' } catch { Write-Output 'NO' }")
    try:
        out = subprocess.run(["powershell", "-NoProfile", "-Command", probe],
                             capture_output=True, text=True, timeout=60).stdout.strip()
        return out.endswith("YES")
    except Exception:
        return False


def detect_soffice():
    for p in (r"C:\Program Files\LibreOffice\program\soffice.exe",
              r"C:\Program Files (x86)\LibreOffice\program\soffice.exe"):
        if os.path.exists(p):
            return p
    from shutil import which
    return which("soffice")


def winpath(p):
    """PowerPoint COM rejects forward slashes — always hand it backslash paths."""
    return os.path.abspath(p).replace("/", "\\")


def render_ppt(pptx, outdir, stem, fmt, width):
    ps = PS_TEMPLATE.format(pptx=winpath(pptx), outdir=winpath(outdir), stem=stem, ext=fmt,
                            fmt2=fmt.upper(), width=width)
    with tempfile.NamedTemporaryFile("w", suffix=".ps1", delete=False, encoding="utf-8-sig") as f:
        f.write(ps)
        ps1 = f.name
    try:
        r = subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ps1],
                           capture_output=True, text=True, timeout=600)
        out = (r.stdout or "") + (r.stderr or "")
        if "NO_PPT_COM" in out:
            return None
        if "OK " in out:
            return int(out.split("OK ")[1].split()[0].strip())
        print(out.strip()[:500], file=sys.stderr)
        return None
    finally:
        os.unlink(ps1)


def render_soffice(soffice, pptx, outdir, stem, fmt, width):
    with tempfile.TemporaryDirectory() as td:
        r = subprocess.run([soffice, "--headless", "--convert-to", "pdf", "--outdir", td, str(pptx)],
                           capture_output=True, text=True, timeout=600)
        pdfs = [f for f in os.listdir(td) if f.lower().endswith(".pdf")]
        if not pdfs:
            print((r.stdout or "") + (r.stderr or ""), file=sys.stderr)
            return None
        import pymupdf  # or fitz on older installs
        doc = pymupdf.open(os.path.join(td, pdfs[0]))
        zoom = width / max(p.rect.width for p in doc)
        mat = pymupdf.Matrix(zoom, zoom)
        n = 0
        for i, page in enumerate(doc, 1):
            pix = page.get_pixmap(matrix=mat)
            target = os.path.join(outdir, f"{stem}_slide-{i:02d}.{fmt}")
            if fmt == "jpg":
                pix.pil_save(target, format="JPEG") if hasattr(pix, "pil_save") else None
                if not os.path.exists(target):
                    from PIL import Image
                    Image.frombytes("RGB", (pix.width, pix.height), pix.samples).save(target, quality=90)
            else:
                pix.save(target)
            n = i
        doc.close()
        return n


def convert(pptx, outdir, fmt, width, engine):
    pptx = os.path.abspath(pptx)
    if not os.path.exists(pptx):
        print(f"not found: {pptx}", file=sys.stderr)
        return False
    stem = os.path.splitext(os.path.basename(pptx))[0]
    os.makedirs(outdir, exist_ok=True)

    chosen = engine
    if chosen == "auto":
        chosen = "ppt" if detect_ppt() else ("soffice" if detect_soffice() else "none")
    if chosen == "none":
        print("No renderer available. Install PowerPoint or LibreOffice — a PPTX cannot be "
              "faithfully rendered without one. (Google Slides can also export PDF directly, "
              "which pymupdf can split.)", file=sys.stderr)
        return False

    n = None
    if chosen == "ppt":
        n = render_ppt(pptx, outdir, stem, fmt, width)
        if n is None:  # COM failed mid-run; fall through to soffice if present
            soffice = detect_soffice()
            if soffice:
                print("PowerPoint export failed; falling back to LibreOffice", file=sys.stderr)
                chosen, n = "soffice", render_soffice(soffice, pptx, outdir, stem, fmt, width)
    elif chosen == "soffice":
        soffice = detect_soffice()
        n = render_soffice(soffice, pptx, outdir, stem, fmt, width) if soffice else None

    if not n:
        print(f"FAILED: {pptx}", file=sys.stderr)
        return False
    print(f"{pptx} -> {n} {fmt} files in {outdir} (engine: {chosen})")
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path", help=".pptx file, or a folder of .pptx files")
    ap.add_argument("-o", "--outdir", help="output dir (default: <deck>_slides next to the file)")
    ap.add_argument("--fmt", default="png", choices=["png", "jpg"])
    ap.add_argument("--width", type=int, default=1600, help="pixel width of exported slides")
    ap.add_argument("--engine", default="auto", choices=["auto", "ppt", "soffice"])
    args = ap.parse_args()

    if os.path.isdir(args.path):
        decks = sorted(f for f in os.listdir(args.path) if f.lower().endswith(".pptx"))
        if not decks:
            sys.exit("no .pptx files in that folder")
        ok = all(convert(os.path.join(args.path, d),
                         os.path.splitext(os.path.join(args.path, d))[0] + "_slides",
                         args.fmt, args.width, args.engine) for d in decks)
    else:
        outdir = args.outdir or os.path.splitext(args.path)[0] + "_slides"
        ok = convert(args.path, outdir, args.fmt, args.width, args.engine)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
