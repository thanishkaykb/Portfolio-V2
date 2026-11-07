"""Generates public/og-image.png - a 1200x630 black-and-gold social card.

Run with: python3 scripts/generate-og.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
INK = (8, 8, 8)
BONE = (245, 242, 233)
GOLD = (255, 201, 40)
MUTED = (167, 162, 155)
LINE = (41, 41, 41)

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSans.ttf",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size)


img = Image.new("RGB", (W, H), INK)
draw = ImageDraw.Draw(img, "RGBA")

# atmospheric glow
glow = Image.new("RGB", (W, H), INK)
gdraw = ImageDraw.Draw(glow)
for radius in range(560, 0, -8):
    alpha = int(38 * (1 - radius / 560) ** 1.6)
    gdraw.ellipse((820 - radius, 300 - radius, 820 + radius, 300 + radius), fill=(alpha, int(alpha * 0.79), 0))
img = Image.blend(img, glow, 0.55)
draw = ImageDraw.Draw(img, "RGBA")

# grid
for x in range(0, W, 88):
    draw.line([(x, 0), (x, H)], fill=(41, 41, 41, 90), width=1)
for y in range(0, H, 88):
    draw.line([(0, y), (W, y)], fill=(41, 41, 41, 90), width=1)

# aperture rings
cx, cy = 905, 300
for r in (250, 210, 170):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(255, 201, 40, 42), width=2)
draw.ellipse((cx - 150, cy - 150, cx + 150, cy + 150), fill=(16, 16, 16, 235), outline=(255, 201, 40, 120), width=2)
draw.ellipse((cx - 150, cy - 150, cx + 150, cy + 150), outline=(255, 201, 40, 160), width=3)

monogram = load_font(96)
bbox = draw.textbbox((0, 0), "TY", font=monogram)
draw.text((cx - (bbox[2] - bbox[0]) / 2, cy - (bbox[3] - bbox[1]) / 2 - 12), "TY", font=monogram, fill=GOLD)

# small gold dot near the name
draw.ellipse((72, 122, 84, 134), fill=GOLD)

# eyebrow
eyebrow = load_font(20)
draw.text((100, 118), "P O R T F O L I O   /   2 0 2 6", font=eyebrow, fill=MUTED)

# name
name_font = load_font(126)
draw.text((70, 172), "THANISHKA", font=name_font, fill=BONE)
draw.text((70, 296), "YOGESH", font=name_font, fill=GOLD)

# divider
draw.line([(74, 438), (610, 438)], fill=LINE, width=2)
draw.line([(74, 438), (214, 438)], fill=GOLD, width=2)

# tagline
small = load_font(24)
draw.text((74, 470), "Website Developer  ·  Full-Stack Developer", font=small, fill=(245, 242, 233, 225))
draw.text((74, 506), "Chennai, Tamil Nadu, India", font=load_font(20), fill=MUTED)
draw.text((74, 556), "Developer. Student. Experimenter.", font=load_font(20), fill=GOLD)

out = Path(__file__).resolve().parent.parent / "public" / "og-image.png"
out.parent.mkdir(parents=True, exist_ok=True)
img.save(out, "PNG", optimize=True)
print(f"wrote {out} ({out.stat().st_size} bytes)")
