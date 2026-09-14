from PIL import Image, ImageFilter, ImageOps
import os

src_path = r"C:\Users\dave\.gemini\antigravity-ide\brain\f3c51515-b05b-4e08-83ab-da44a915fc84\.user_uploaded\media_1789124814788.png"
out_dir = r"F:\Antigravity\simroom\Github Repos\bihi2027\Citizenship 9\resources"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "nova_scotia_base.png")

img = Image.open(src_path).convert("RGBA")
w, h = img.size

# Remove scale bar at bottom right (x > 175, y > 145)
pixels = img.load()
for x in range(165, w):
    for y in range(135, h):
        pixels[x, y] = (255, 255, 255, 255)

# Convert blue lines to crisp dark slate / black line art
gray = img.convert("L")
# Upscale 4x with Lanczos
scale = 4
up = gray.resize((w * scale, h * scale), Image.Resampling.LANCZOS)

# Smooth and threshold slightly
up = up.filter(ImageFilter.SMOOTH_MORE)
# Convert to clean sharp line art with transparent or white background
up = ImageOps.autocontrast(up)

up.save(out_path)
print("Saved clean upscaled map to:", out_path, "Size:", up.size)
