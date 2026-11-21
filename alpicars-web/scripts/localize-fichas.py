"""Crea las fichas de la tienda en cada idioma a partir de la ficha en español.

Borra los textos (título, puntos y pie) respetando el fondo, la barra roja, los iconos y la foto,
y escribe los textos traducidos de content/products-i18n.js con la misma tipografía (Inter).

Uso:
  node --input-type=module -e "..."  > /tmp/fichas.json   (ver README de scripts o el commit)
  python3 scripts/localize-fichas.py /tmp/fichas.json
Resultado: public/tienda/<id>-ficha-<idioma>.webp
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
TIENDA = ROOT / "public" / "tienda"
FONTS = Path("/usr/share/fonts/opentype/inter")
BOLD = str(FONTS / "Inter-Bold.otf")
SEMI = str(FONTS / "Inter-SemiBold.otf")
MED = str(FONTS / "Inter-Medium.otf")

TITLE_X, TITLE_W = 80, 1040
COL_X = [137, 677]
COL_END = [598, 1140]


def red_mask(a):
    return (a[:, :, 0] > 160) & (a[:, :, 1] < 90) & (a[:, :, 2] < 100)


def clusters(idx, gap=6):
    out = []
    for i in idx:
        if out and i - out[-1][1] <= gap:
            out[-1][1] = i
        else:
            out.append([i, i])
    return out


def analyse(a):
    red = red_mask(a)
    # barra roja bajo el título: filas con muchos píxeles rojos seguidos entre x=80 y 165
    bar_rows = [y for y in range(40, 700) if red[y, 82:160].sum() > 60]
    bar = clusters(bar_rows)[0]
    # iconos (círculos rojos) de la primera columna, por debajo de la barra
    icon_rows = [y for y in range(bar[1] + 5, 760) if red[y, 78:124].sum() > 4]
    icons = [c for c in clusters(icon_rows, 3) if c[1] - c[0] > 25][:2]
    centers = [(c[0] + c[1]) // 2 for c in icons]
    # líneas del título: filas con texto blanco por encima de la barra
    lum = a.max(axis=2)
    title_rows = [y for y in range(30, bar[0] - 4) if (lum[y, 70:1150] > 200).sum() > 3]
    lines = [c for c in clusters(title_rows, 14) if c[1] - c[0] > 20]
    return bar, centers, lines


def inpaint(img, box, thr, solid=False):
    x0, y0, x1, y1 = box
    a = np.array(img)
    region = a[y0:y1, x0:x1]
    mask = np.full(region.shape[:2], 255, np.uint8) if solid else (region.max(axis=2) > thr).astype(np.uint8) * 255
    mask = cv2.dilate(mask, np.ones((9, 9), np.uint8), iterations=1)
    full = np.zeros(a.shape[:2], np.uint8)
    full[y0:y1, x0:x1] = mask
    bgr = cv2.cvtColor(a, cv2.COLOR_RGB2BGR)
    out = cv2.inpaint(bgr, full, 9, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))


def wrap(draw, text, font, width, max_lines):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = f"{cur} {w}".strip()
        if draw.textlength(test, font=font) <= width or not cur:
            cur = test
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines if len(lines) <= max_lines and all(draw.textlength(l, font=font) <= width for l in lines) else None


def make(src, dst, ficha, footer):
    img = Image.open(src).convert("RGB")
    a = np.array(img)
    bar, centers, lines = analyse(a)
    n_lines = max(1, len(lines))

    # 1) borrar textos: título, puntos y pie
    img = inpaint(img, (60, 30, 1160, bar[0] - 3), 64)
    # repaso: cada línea del título se borra entera (el fondo ahí es liso) para que no quede rastro
    for l0, l1 in lines:
        img = inpaint(img, (60, max(20, l0 - 10), 1160, min(bar[0] - 14, l1 + 10)), 0, solid=True)
    for c in centers:
        for x, xe in zip(COL_X, COL_END):
            img = inpaint(img, (x - 6, c - 32, (612 if x < 600 else 1190), c + 32), 80)
    d = ImageDraw.Draw(img)
    fb = img.getpixel((1180, 1180))
    d.rectangle((420, 1112, 1160, 1185), fill=fb)

    # 2) título: mismo número de líneas que el original, con la letra lo más grande posible
    size = 78
    while size > 40:
        font = ImageFont.truetype(BOLD, size)
        tl = wrap(d, ficha["title"], font, TITLE_W, n_lines)
        if tl:
            break
        size -= 2
    lh = round(100 * size / 78)
    base_last = bar[0] - 23
    for i, line in enumerate(tl):
        y = base_last - (len(tl) - 1 - i) * lh
        d.text((TITLE_X, y), line, font=font, fill=(255, 255, 255), anchor="ls")

    # 3) puntos (2 columnas × 2 filas), centrados con su icono
    for k, text in enumerate(ficha["bullets"][: len(centers) * 2]):
        row, col = divmod(k, 2)
        c = centers[row]
        x, xe = COL_X[col], COL_END[col] + (40 if col == 1 else 10)
        s = 36
        f = ImageFont.truetype(SEMI, s)
        while d.textlength(text, font=f) > xe - x and s > 24:
            s -= 1
            f = ImageFont.truetype(SEMI, s)
        d.text((x, c + round(0.727 * s / 2)), text, font=f, fill=(234, 238, 244), anchor="ls")

    # 4) pie
    ff = ImageFont.truetype(MED, 29)
    d.text((1119, 1159), footer, font=ff, fill=(190, 200, 214), anchor="rs")

    img.save(dst, "WEBP", quality=88, method=6)


def main():
    data = json.load(open(sys.argv[1]))
    only = sys.argv[2:] or None
    for lang, items in data.items():
        footer = items["footer"]
        for pid, ficha in items.items():
            if pid == "footer":
                continue
            src = TIENDA / f"{pid}-ficha.webp"
            if not src.exists():
                print("sin ficha:", pid)
                continue
            if only and pid not in only:
                continue
            make(src, TIENDA / f"{pid}-ficha-{lang}.webp", ficha, footer)
            print("ok", lang, pid)


if __name__ == "__main__":
    main()
