import sys
from PIL import Image

src = sys.argv[1]
out_dir = sys.argv[2]
im = Image.open(src).convert("RGB")
W, H = im.size

# Cast sheet layout: Sam left-of-centre, Rae right-of-centre.
# Crop head-and-shoulders at ~2:1 to match the A4 cast-card aspect, so object-fit:cover
# does not slice the portrait down to a hairline.
crops = {
    "cast_sam.jpg": (0.130, 0.020, 0.570, 0.400),
    "cast_rae.jpg": (0.460, 0.020, 0.900, 0.400),
}

for name, (l, t, r, b) in crops.items():
    box = (int(W * l), int(H * t), int(W * r), int(H * b))
    out = im.crop(box)
    # Upscale so a small print card isn't starved of pixels.
    target_w = 1500
    if out.width < target_w:
        ratio = target_w / out.width
        out = out.resize((target_w, int(out.height * ratio)), Image.LANCZOS)
    out.save(f"{out_dir}/{name}", "JPEG", quality=92)
    print(f"{name}  {out.width}x{out.height}  aspect {out.width/out.height:.2f}")