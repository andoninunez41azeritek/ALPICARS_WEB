"""Traduce los textos que vienen escritos dentro de algunas fotos de producto de la tienda.

Para cada etiqueta: mide dónde está el texto en español, lo borra (rellenando con el fondo o
redibujando la píldora de color) y escribe la traducción con el mismo tamaño y posición.

Uso:  python3 scripts/localize-photos.py
Resultado: public/tienda/<foto>-<idioma>.webp  (en, de, fr, it, eu)
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
TIENDA = ROOT / "public" / "tienda"
FONTS = Path("/usr/share/fonts/opentype/inter")
BOLD = str(FONTS / "Inter-Bold.otf")
SEMI = str(FONTS / "Inter-SemiBold.otf")
XBOLD = str(FONTS / "Inter-ExtraBold.otf")

TR = {
    "Cerdas suaves": dict(en="Soft bristles", de="Weiche Borsten", fr="Poils doux", it="Setole morbide", eu="Zurda bigunak"),
    "Para colgar": dict(en="For hanging", de="Zum Aufhängen", fr="Pour suspendre", it="Per appendere", eu="Zintzilikatzeko"),
    "Mango cómodo": dict(en="Comfy grip", de="Bequemer Griff", fr="Poignée confort", it="Impugnatura comoda", eu="Kirten erosoa"),
    "Antes": dict(en="Before", de="Vorher", fr="Avant", it="Prima", eu="Aurretik"),
    "Durante": dict(en="During", de="Während", fr="Pendant", it="Durante", eu="Bitartean"),
    "Después": dict(en="After", de="Nachher", fr="Après", it="Dopo", eu="Ondoren"),
    "Coche, jardín, bici y terraza": dict(
        en="Car, garden, bike and patio", de="Auto, Garten, Fahrrad, Terrasse", fr="Voiture, jardin, vélo et terrasse",
        it="Auto, giardino, bici e terrazza", eu="Autoa, lorategia, bizikleta, terraza"),
    "ANTES DE USAR": dict(en="BEFORE USE", de="VOR DER ANWENDUNG", fr="AVANT UTILISATION", it="PRIMA DELL'USO", eu="ERABILI AURRETIK"),
    "DESPUÉS DE SU USO": dict(en="AFTER USE", de="NACH DER ANWENDUNG", fr="APRÈS UTILISATION", it="DOPO L'USO", eu="ERABILI ONDOREN"),
    "3 pasos fáciles": dict(en="3 easy steps", de="3 einfache Schritte", fr="3 étapes faciles", it="3 semplici passaggi", eu="3 urrats errazak"),
    "Arañazos fuera, sin taller": dict(
        en="Scratches gone, no workshop", de="Kratzer weg, ohne Werkstatt", fr="Rayures effacées, sans garage",
        it="Graffi via, senza officina", eu="Marradurak kanpora, tailerrik gabe"),
}

# Cada etiqueta:
#  text: el texto en español que hay en la foto
#  box: zona donde buscarlo (x0, y0, x1, y1)
#  ink: cómo reconocer las letras ("dark", "light", "red", "notwhite")
#  erase: "inpaint" (rellenar con el fondo de alrededor), "fill" (color liso), "pill" (redibujar la píldora)
#  align: "left" o "center";  maxx: hasta dónde puede llegar el texto
LABELS = {
    "kit-detailing-20-2": [
        dict(text="Cerdas suaves", box=(270, 50, 600, 120), ink="dark", erase="inpaint", font=SEMI, align="left", maxx=595),
        dict(text="Para colgar", box=(160, 590, 420, 660), ink="dark", erase="inpaint", font=SEMI, align="left", maxx=595),
        dict(text="Mango cómodo", box=(320, 1095, 603, 1170), ink="dark", erase="inpaint", font=SEMI, align="left", maxx=588),
    ],
    "limpiador-interiores-2": [
        dict(text="Antes", box=(0, 530, 320, 660), ink="light", erase="pill", font=BOLD, align="center", pill="left"),
        dict(text="Después", box=(760, 530, 1200, 660), ink="light", erase="pill", font=BOLD, align="center", pill="right"),
    ],
    "pistola-agua-presion-3": [
        dict(text="Coche, jardín, bici y terraza", box=(60, 15, 1140, 125), ink="notwhite", erase="fill", font=XBOLD, align="center", maxw=1100),
    ],
    "pulidor-faros-3": [
        dict(text="ANTES DE USAR", box=(80, 745, 330, 800), ink="dark", erase="inpaint", font=BOLD, align="center", maxw=380),
        dict(text="DESPUÉS DE SU USO", box=(480, 740, 780, 795), ink="dark", erase="inpaint", font=BOLD, align="center", maxw=380),
    ],
    "quita-aranazos-3": [
        dict(text="Antes", box=(42, 796, 240, 876), ink="red", erase="pill", font=BOLD, align="center", radius=16),
        dict(text="Después", box=(920, 790, 1185, 865), ink="dark", erase="pill", font=BOLD, align="center", radius=16),
    ],
    "quita-aranazos-4": [
        dict(text="Antes", box=(20, 14, 368, 100), ink="light", erase="fill", font=BOLD, align="center", maxw=320),
        dict(text="Durante", box=(384, 14, 768, 100), ink="light", erase="fill", font=BOLD, align="center", maxw=360),
        dict(text="Después", box=(782, 14, 1186, 100), ink="light", erase="fill", font=BOLD, align="center", maxw=380),
        dict(text="3 pasos fáciles", box=(600, 900, 1190, 990), ink="dark", erase="fill", font=XBOLD, align="center", maxw=580),
        dict(text="Arañazos fuera, sin taller", box=(600, 1020, 1190, 1095), ink="dark", erase="fill", font=SEMI, align="center", maxw=580),
    ],
}


def ink_mask(reg, kind):
    r, g, b = reg[:, :, 0].astype(int), reg[:, :, 1].astype(int), reg[:, :, 2].astype(int)
    if kind == "dark":
        return reg.max(axis=2) < 110
    if kind == "light":
        return reg.min(axis=2) > 225
    if kind == "red":
        return (r > 150) & (g < 90) & (b < 90)
    return reg.min(axis=2) < 170  # notwhite


def bbox(mask):
    ys, xs = np.nonzero(mask)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def fit_size(text, font, width):
    """Tamaño de letra con el que `text` mide `width` píxeles de ancho (tinta)."""
    lo, hi = 8, 200
    while lo < hi:
        mid = (lo + hi + 1) // 2
        b = ImageFont.truetype(font, mid).getbbox(text, anchor="ls")
        if b[2] - b[0] <= width:
            lo = mid
        else:
            hi = mid - 1
    return lo


def label(img, spec, lang):
    a = np.array(img)
    x0, y0, x1, y1 = spec["box"]
    reg = a[y0:y1, x0:x1]
    m = ink_mask(reg, spec["ink"])
    bx0, by0, bx1, by1 = bbox(m)
    tx0, ty0, tx1, ty1 = x0 + bx0, y0 + by0, x0 + bx1, y0 + by1
    # color de la letra = mediana de los píxeles de tinta más "puros"
    ink_px = reg[m]
    color = tuple(int(v) for v in np.median(ink_px, axis=0))
    size = fit_size(spec["text"], spec["font"], tx1 - tx0)
    f = ImageFont.truetype(spec["font"], size)
    ob = f.getbbox(spec["text"], anchor="ls")
    baseline = ty0 - ob[1]
    cx = (tx0 + tx1) / 2

    # 1) borrar
    if spec["erase"] == "inpaint":
        mk = np.zeros(a.shape[:2], np.uint8)
        mk[y0:y1, x0:x1] = m.astype(np.uint8) * 255
        mk = cv2.dilate(mk, np.ones((7, 7), np.uint8), iterations=1)
        out = cv2.inpaint(cv2.cvtColor(a, cv2.COLOR_RGB2BGR), mk, 7, cv2.INPAINT_TELEA)
        img = Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))
        d = ImageDraw.Draw(img)
    elif spec["erase"] == "fill":
        pad = 8
        ring = np.concatenate([
            a[max(0, ty0 - pad - 3):ty0 - pad, tx0:tx1].reshape(-1, 3),
            a[ty1 + pad:ty1 + pad + 3, tx0:tx1].reshape(-1, 3),
        ])
        bg = tuple(int(v) for v in np.median(ring, axis=0))
        d = ImageDraw.Draw(img)
        d.rectangle((tx0 - pad, ty0 - pad, tx1 + pad, ty1 + pad), fill=bg)
    else:  # pill
        if "pill" in spec:  # píldora de color: localizarla por su color
            core = reg[~m & (reg.min(axis=2) < 200)]
            pc = np.median(reg[by0:by1, bx0:bx1][~m[by0:by1, bx0:bx1]], axis=0)
            near = (np.abs(reg.astype(int) - pc).sum(axis=2) < 60)
            px0, py0, px1, py1 = bbox(near)
            px0, py0, px1, py1 = x0 + px0, y0 + py0, x0 + px1, y0 + py1
            radius = (py1 - py0) // 2
        else:
            px0, py0, px1, py1 = x0, y0, x1, y1
            pc = np.median(reg[2:6, 20:-20].reshape(-1, 3), axis=0)
            radius = spec.get("radius", 14)
        pcol = tuple(int(v) for v in pc)
        d = ImageDraw.Draw(img)
        d.rounded_rectangle((px0, py0, px1 - 1, py1 - 1), radius=radius, fill=pcol)
        spec = dict(spec, maxw=(px1 - px0) - 2 * max(26, radius))
        cx = (px0 + px1) / 2

    # 2) escribir la traducción
    new = TR[spec["text"]][lang]
    maxw = spec.get("maxw") or (spec["maxx"] - tx0)
    s = size
    while s > 10:
        f = ImageFont.truetype(spec["font"], s)
        nb = f.getbbox(new, anchor="ls")
        if nb[2] - nb[0] <= maxw:
            break
        s -= 1
    if spec["align"] == "left":
        d.text((tx0 - nb[0], baseline), new, font=f, fill=color, anchor="ls")
    else:
        # mantener el centro vertical de las mayúsculas si la letra encoge
        cap = ImageFont.truetype(spec["font"], size).getbbox("H", anchor="ls")[1]
        ncap = f.getbbox("H", anchor="ls")[1]
        bl = baseline + (cap - ncap) / 2
        d.text((cx - (nb[0] + nb[2]) / 2, bl), new, font=f, fill=color, anchor="ls")
    return img


def main():
    for name, specs in LABELS.items():
        src = Image.open(TIENDA / f"{name}.webp").convert("RGB")
        for lang in ["en", "de", "fr", "it", "eu"]:
            img = src.copy()
            for spec in specs:
                img = label(img, spec, lang)
            img.save(TIENDA / f"{name}-{lang}.webp", "WEBP", quality=88, method=6)
        print("ok", name)


if __name__ == "__main__":
    main()
