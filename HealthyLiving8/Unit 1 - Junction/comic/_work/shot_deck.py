import sys, os, subprocess, shutil

deck = sys.argv[1]
outdir = sys.argv[2]
chrome = sys.argv[3]
profile = sys.argv[4]
slides = [int(x) for x in sys.argv[5].split(",")]

html = open(deck, encoding="utf-8").read()
os.makedirs(outdir, exist_ok=True)
# Temp copies MUST sit beside the deck, otherwise the deck's ../comic/panels/
# relative paths resolve somewhere else and every image 404s in the screenshot.
tmpdir = os.path.dirname(deck)

for n in slides:
    # Activate a specific slide without touching the real deck.
    tmp = os.path.join(tmpdir, f"_shot_slide{n}.html")
    open(tmp, "w", encoding="utf-8").write(
        html.replace("</body>", f"<script>goToSlide({n-1});</script>\n</body>")
    )
    png = os.path.join(outdir, f"slide{n}.png")
    url = "file:///" + tmp.replace("\\", "/").replace(" ", "%20")
    subprocess.run([
        chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
        "--no-first-run", f"--user-data-dir={profile}",
        "--hide-scrollbars", "--force-device-scale-factor=1",
        "--window-size=1600,900", "--virtual-time-budget=9000",
        f"--screenshot={png}", url,
    ], capture_output=True)
    print(("ok   " if os.path.exists(png) else "FAIL ") + png)