"""Draws the app icon and splash screen (run by the build workflow; needs Pillow)."""
import glob, os
from PIL import Image, ImageDraw

BLUE, PAPER, RED, RULE = (36, 65, 196), (247, 249, 252), (216, 72, 63), (170, 190, 225)
RES = "android/app/src/main/res"


def art(size, page=0.62, rounded=False):
    """Blue cover with a ruled page and a red margin line."""
    k = 4
    s = size * k
    im = Image.new("RGB", (s, s), BLUE)
    d = ImageDraw.Draw(im)
    pw = int(s * page)
    x0, y0 = (s - pw) // 2, (s - pw) // 2
    d.rounded_rectangle([x0, y0, x0 + pw, y0 + pw], radius=int(pw * 0.09), fill=PAPER)
    for i in range(1, 5):
        y = y0 + int(pw * (0.16 + i * 0.16))
        d.rectangle([x0 + int(pw * 0.1), y, x0 + pw - int(pw * 0.1), y + max(2, int(pw * 0.014))], fill=RULE)
    mx = x0 + int(pw * 0.26)
    d.rectangle([mx, y0, mx + max(3, int(pw * 0.02)), y0 + pw], fill=RED)
    im = im.resize((size, size), Image.LANCZOS)
    if rounded:
        mask = Image.new("L", (size * k, size * k), 0)
        ImageDraw.Draw(mask).ellipse([0, 0, size * k - 1, size * k - 1], fill=255)
        im.putalpha(mask.resize((size, size), Image.LANCZOS))
    return im


legacy = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
for name, px in legacy.items():
    d = f"{RES}/mipmap-{name}"
    os.makedirs(d, exist_ok=True)
    art(px, 0.78).save(f"{d}/ic_launcher.png")
    art(px, 0.78, rounded=True).save(f"{d}/ic_launcher_round.png")
    art(int(px * 2.25), 0.5).save(f"{d}/ic_launcher_foreground.png")

bg = f"{RES}/values/ic_launcher_background.xml"
if os.path.exists(bg):
    t = open(bg).read().replace("#FFFFFF", "#2441C4")
    open(bg, "w").write(t)

for f in glob.glob(f"{RES}/**/splash.png", recursive=True):
    w, h = Image.open(f).size
    sp = Image.new("RGB", (w, h), PAPER)
    m = int(min(w, h) * 0.26)
    sp.paste(art(m, 0.86), ((w - m) // 2, (h - m) // 2))
    sp.save(f)

os.makedirs("www", exist_ok=True)
art(192, 0.78).save("www/icon-192.png")
art(512, 0.78).save("www/icon-512.png")
print("icons and splash written")
