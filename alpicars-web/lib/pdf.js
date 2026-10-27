// Generador de PDF de AlpiCars (informe del test y de la calculadora).
// Crea un PDF de verdad en el navegador, sin servidor, con la librería pdf-lib.
// Se carga solo cuando alguien pulsa "Descargar PDF", así no hace más lenta la web.
//
// Un documento es una lista de bloques:
//   { type: "hero", kicker, title, big, lines: [] }
//   { type: "h2", text }            { type: "h3", text }
//   { type: "p", text, small }      { type: "bullets", items: [] }
//   { type: "rows", rows: [[etiqueta, valor, detalle?]], total: [etiqueta, valor] }
//   { type: "compare", left: [etiqueta, valor], right: [etiqueta, valor] }
//   { type: "cols", left: { title, items }, right: { title, items } }
//   { type: "table", rows: [[nombre, texto, precio, destacado]] }
//   { type: "steps", items: [{ title, text }] }
//   { type: "qa", items: [[pregunta, respuesta]] }
//   { type: "cta", title, text, url }
//   { type: "contact", title, text, wa, waText, site, qr, qrCaption, share }   ← bloque final para compartir y contactar

import { PDFDocument, PDFName, PDFString, StandardFonts, rgb } from "pdf-lib";
import config from "../content/config";
import qrcodegen from "./qrcodegen";

const A4 = [595.28, 841.89];
const M = 48; // margen
const NAVY = rgb(15 / 255, 34 / 255, 56 / 255);
const RED = rgb(200 / 255, 22 / 255, 29 / 255);
const INK = rgb(0.16, 0.2, 0.26);
const SOFT = rgb(0.42, 0.46, 0.53);
const LINE = rgb(0.87, 0.89, 0.92);
const SNOW = rgb(0.957, 0.965, 0.976);
const WHITE = rgb(1, 1, 1);

export async function buildPdf(blocks, { title = "AlpiCars", url = "" } = {}) {
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  doc.setAuthor("AlpiCars");
  doc.setCreator("alpicars.com");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const charset = new Set(font.getCharacterSet());

  // Caracteres que la fuente estándar no tiene
  const clean = (s) =>
    String(s ?? "")
      .replace(/₂/g, "2")
      .replace(/≈/g, "aprox.")
      .replace(/→/g, "->")
      .replace(/ | /g, " ")
      .split("")
      .filter((ch) => ch === "\n" || charset.has(ch.codePointAt(0)))
      .join("");

  let logo = null;
  try {
    const bytes = await fetch("/logo-horizontal.png").then((r) => (r.ok ? r.arrayBuffer() : null));
    if (bytes) logo = await doc.embedPng(bytes);
  } catch {
    /* sin logo, seguimos */
  }

  const W = A4[0] - M * 2;
  let page;
  let y;

  const width = (text, size, f = font) => f.widthOfTextAtSize(clean(text), size);
  const wrap = (text, size, maxW, f = font) => {
    const out = [];
    for (const para of clean(text).split("\n")) {
      let line = "";
      for (const word of para.split(/\s+/)) {
        const test = line ? `${line} ${word}` : word;
        if (f.widthOfTextAtSize(test, size) <= maxW || !line) line = test;
        else {
          out.push(line);
          line = word;
        }
      }
      out.push(line);
    }
    return out;
  };

  const newPage = () => {
    page = doc.addPage(A4);
    const top = A4[1] - 34;
    if (logo) {
      const h = 22;
      const w = (logo.width / logo.height) * h;
      page.drawImage(logo, { x: M, y: top - h + 4, width: w, height: h });
    } else {
      page.drawText("ALPICARS", { x: M, y: top - 14, size: 14, font: bold, color: NAVY });
    }
    const slogan = clean(config.slogan);
    page.drawText(slogan, { x: A4[0] - M - width(slogan, 8.5), y: top - 12, size: 8.5, font, color: SOFT });
    page.drawRectangle({ x: M, y: top - 26, width: W, height: 1.6, color: RED });
    y = top - 52;
  };

  const ensure = (h) => {
    if (y - h < 64) newPage();
  };

  const text = (str, { x = M, size = 10.5, f = font, color = INK, maxW = W, lead = 1.45 } = {}) => {
    const lines = wrap(str, size, maxW, f);
    for (const l of lines) {
      ensure(size * lead);
      page.drawText(l, { x, y: y - size, size, font: f, color });
      y -= size * lead;
    }
  };

  // Zona clicable que abre un enlace (WhatsApp, la web...)
  const link = (pg, x, yy, w, h, href) => {
    const annot = doc.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [x, yy, x + w, yy + h],
      Border: [0, 0, 0],
      A: { Type: "Action", S: "URI", URI: PDFString.of(href) },
    });
    const ref = doc.context.register(annot);
    const annots = pg.node.lookup(PDFName.of("Annots"));
    if (annots) annots.push(ref);
    else pg.node.set(PDFName.of("Annots"), doc.context.obj([ref]));
  };

  // Código QR dibujado con cuadrados (no necesita imágenes)
  const drawQr = (pg, text, x, yy, size) => {
    const qr = qrcodegen.QrCode.encodeText(text, qrcodegen.QrCode.Ecc.MEDIUM);
    const border = 2;
    const cell = size / (qr.size + border * 2);
    pg.drawRectangle({ x, y: yy, width: size, height: size, color: WHITE });
    for (let r = 0; r < qr.size; r++)
      for (let c = 0; c < qr.size; c++)
        if (qr.getModule(c, r))
          pg.drawRectangle({ x: x + (c + border) * cell, y: yy + size - (r + border + 1) * cell, width: cell + 0.05, height: cell + 0.05, color: NAVY });
  };

  const button = (pg, label, x, yy, bg, fg, href) => {
    const s = clean(label);
    const w = bold.widthOfTextAtSize(s, 10) + 28;
    pg.drawRectangle({ x, y: yy, width: w, height: 26, color: bg });
    pg.drawText(s, { x: x + 14, y: yy + 9, size: 10, font: bold, color: fg });
    if (href) link(pg, x, yy, w, 26, href);
    return w;
  };

  const textRight = (str, rightX, yy, size, f = font, color = INK) => {
    const s = clean(str);
    page.drawText(s, { x: rightX - f.widthOfTextAtSize(s, size), y: yy, size, font: f, color });
  };

  newPage();

  for (const b of blocks) {
    switch (b.type) {
      case "hero": {
        if (b.kicker) text(b.kicker.toUpperCase(), { size: 8.5, f: bold, color: RED });
        y -= 4;
        text(b.title, { size: 22, f: bold, color: NAVY, lead: 1.2 });
        y -= 4;
        if (b.big) {
          text(b.big, { size: 30, f: bold, color: RED, lead: 1.15 });
          y -= 2;
        }
        for (const l of b.lines || []) text(l, { size: 11, color: INK });
        y -= 10;
        break;
      }
      case "h2":
        ensure(48);
        y -= 12;
        text(b.text, { size: 14.5, f: bold, color: NAVY, lead: 1.3 });
        page.drawRectangle({ x: M, y: y - 4, width: 28, height: 2, color: RED });
        y -= 14;
        break;
      case "h3":
        ensure(30);
        y -= 4;
        text(b.text, { size: 11.5, f: bold, color: NAVY });
        break;
      case "p":
        text(b.text, { size: b.small ? 8.5 : 10.5, color: b.small ? SOFT : INK });
        y -= 4;
        break;
      case "bullets":
        for (const it of b.items) {
          const lines = wrap(it, 10, W - 14);
          ensure(lines.length * 14.5);
          page.drawRectangle({ x: M, y: y - 7.5, width: 6, height: 1.6, color: RED });
          for (const l of lines) {
            page.drawText(l, { x: M + 14, y: y - 10, size: 10, font, color: INK });
            y -= 14.5;
          }
        }
        y -= 4;
        break;
      case "compare": {
        ensure(64);
        const half = (W - 10) / 2;
        const boxes = [
          [b.left, M, SNOW, NAVY, SOFT],
          [b.right, M + half + 10, RED, WHITE, WHITE],
        ];
        for (const [[label, value], x, bg, vc, lc] of boxes) {
          page.drawRectangle({ x, y: y - 56, width: half, height: 56, color: bg });
          page.drawText(clean(label), { x: x + 12, y: y - 18, size: 8.5, font, color: lc });
          page.drawText(clean(value), { x: x + 12, y: y - 44, size: 20, font: bold, color: vc });
        }
        y -= 70;
        break;
      }
      case "rows": {
        for (const [label, value, detail] of b.rows) {
          const dl = detail ? wrap(detail, 8, W - 120) : [];
          const h = 20 + dl.length * 10.5;
          ensure(h);
          page.drawText(clean(label), { x: M, y: y - 13, size: 10, font, color: INK });
          textRight(value, M + W, y - 13, 10, bold, NAVY);
          dl.forEach((l, i) => page.drawText(l, { x: M, y: y - 25 - i * 10.5, size: 8, font, color: SOFT }));
          y -= h;
          page.drawRectangle({ x: M, y: y + 3, width: W, height: 0.6, color: LINE });
        }
        if (b.total) {
          ensure(28);
          y -= 4;
          page.drawRectangle({ x: M, y: y - 22, width: W, height: 24, color: NAVY });
          page.drawText(clean(b.total[0]), { x: M + 10, y: y - 14, size: 10.5, font: bold, color: WHITE });
          textRight(b.total[1], M + W - 10, y - 14, 10.5, bold, WHITE);
          y -= 34;
        }
        break;
      }
      case "cols": {
        const half = (W - 20) / 2;
        const col = (c) => [c.title, ...c.items].reduce((n, it, i) => n + wrap(it, i ? 9.5 : 10.5, half - 12).length * 13.5, 0);
        ensure(Math.max(col(b.left), col(b.right)) + 10);
        const startY = y;
        let endY = y;
        [[b.left, M], [b.right, M + half + 20]].forEach(([c, x]) => {
          let yy = startY;
          page.drawRectangle({ x, y: yy - 12, width: 2.4, height: 11, color: RED });
          wrap(c.title, 10.5, half - 12, bold).forEach((l) => {
            page.drawText(l, { x: x + 8, y: yy - 11, size: 10.5, font: bold, color: NAVY });
            yy -= 15;
          });
          for (const it of c.items) {
            const lines = wrap(it, 9.5, half - 12);
            page.drawText("-", { x: x + 2, y: yy - 10, size: 9.5, font, color: RED });
            for (const l of lines) {
              page.drawText(l, { x: x + 10, y: yy - 10, size: 9.5, font, color: INK });
              yy -= 13.5;
            }
          }
          endY = Math.min(endY, yy);
        });
        y = endY - 8;
        break;
      }
      case "table": {
        const c1 = 120;
        const c3 = 78;
        const c2 = W - c1 - c3 - 20;
        for (const [name, desc, price, hl] of b.rows) {
          const dl = wrap(desc, 9, c2);
          const nl = wrap(name, 9.5, c1 - 8, bold);
          const h = Math.max(dl.length, nl.length) * 12.5 + 12;
          ensure(h);
          if (hl) page.drawRectangle({ x: M, y: y - h + 2, width: W, height: h, color: SNOW });
          nl.forEach((l, i) => page.drawText(l, { x: M + 6, y: y - 13 - i * 12.5, size: 9.5, font: bold, color: hl ? RED : NAVY }));
          dl.forEach((l, i) => page.drawText(l, { x: M + c1 + 6, y: y - 13 - i * 12.5, size: 9, font, color: INK }));
          textRight(price, M + W - 6, y - 13, 9.5, bold, NAVY);
          y -= h;
          page.drawRectangle({ x: M, y: y + 2, width: W, height: 0.6, color: LINE });
        }
        y -= 6;
        break;
      }
      case "steps":
        b.items.forEach((s, i) => {
          const lines = wrap(s.text, 9.5, W - 30);
          ensure(lines.length * 13 + 22);
          page.drawCircle({ x: M + 8, y: y - 8, size: 8, color: RED });
          const num = String(i + 1);
          page.drawText(num, { x: M + 8 - bold.widthOfTextAtSize(num, 8.5) / 2, y: y - 11, size: 8.5, font: bold, color: WHITE });
          page.drawText(clean(s.title), { x: M + 24, y: y - 11, size: 10.5, font: bold, color: NAVY });
          y -= 17;
          for (const l of lines) {
            page.drawText(l, { x: M + 24, y: y - 9.5, size: 9.5, font, color: INK });
            y -= 13;
          }
          y -= 6;
        });
        break;
      case "qa": {
        const half = (W - 16) / 2;
        for (let i = 0; i < b.items.length; i += 2) {
          const pair = b.items.slice(i, i + 2);
          const hs = pair.map(([q, a]) => wrap(q, 8, half).length * 10 + wrap(a, 9.5, half, bold).length * 12.5 + 10);
          const h = Math.max(...hs);
          ensure(h);
          pair.forEach(([q, a], j) => {
            const x = M + j * (half + 16);
            let yy = y;
            wrap(q, 8, half).forEach((l) => {
              page.drawText(l, { x, y: yy - 8, size: 8, font, color: SOFT });
              yy -= 10;
            });
            wrap(a, 9.5, half, bold).forEach((l) => {
              page.drawText(l, { x, y: yy - 10, size: 9.5, font: bold, color: NAVY });
              yy -= 12.5;
            });
          });
          y -= h;
        }
        break;
      }
      case "cta": {
        const lines = wrap(b.text, 10, W - 28);
        const h = 46 + lines.length * 14 + (b.url ? 16 : 0);
        ensure(h + 10);
        y -= 8;
        page.drawRectangle({ x: M, y: y - h, width: W, height: h, color: NAVY });
        page.drawText(clean(b.title), { x: M + 14, y: y - 24, size: 14, font: bold, color: WHITE });
        let yy = y - 42;
        for (const l of lines) {
          page.drawText(l, { x: M + 14, y: yy, size: 10, font, color: WHITE });
          yy -= 14;
        }
        if (b.url) page.drawText(clean(b.url), { x: M + 14, y: yy - 2, size: 9, font: bold, color: rgb(1, 0.75, 0.76) });
        y -= h + 10;
        break;
      }
      case "contact": {
        // Bloque para quien recibe el PDF: contactar por WhatsApp y hacer su propio test (así el PDF se comparte y atrae clientes)
        const qrSize = b.qr ? 104 : 0;
        const textW = W - 28 - (qrSize ? qrSize + 18 : 0);
        const lines = wrap(b.text, 10, textW);
        const shareLines = b.share ? wrap(b.share, 9, textW) : [];
        const h = Math.max(70 + lines.length * 14 + shareLines.length * 12 + 40, qrSize + 44);
        ensure(h + 10);
        y -= 8;
        const top = y;
        page.drawRectangle({ x: M, y: top - h, width: W, height: h, color: NAVY });
        page.drawRectangle({ x: M, y: top - 4, width: W, height: 4, color: RED });
        page.drawText(clean(b.title), { x: M + 14, y: top - 28, size: 15, font: bold, color: WHITE });
        let yy = top - 46;
        for (const l of lines) {
          page.drawText(l, { x: M + 14, y: yy, size: 10, font, color: WHITE });
          yy -= 14;
        }
        yy -= 10;
        let bx = M + 14;
        if (b.wa) bx += button(page, b.waText || "Escríbenos por WhatsApp", bx, yy - 18, rgb(37 / 255, 211 / 255, 102 / 255), NAVY, b.wa) + 8;
        if (b.site) button(page, b.siteText || "Pide presupuesto", bx, yy - 18, RED, WHITE, b.site);
        yy -= 34;
        for (const l of shareLines) {
          page.drawText(l, { x: M + 14, y: yy - 4, size: 9, font, color: rgb(0.8, 0.84, 0.9) });
          yy -= 12;
        }
        if (b.qr) {
          const qx = M + W - 14 - qrSize;
          const qy = top - 18 - qrSize;
          drawQr(page, b.qr, qx, qy, qrSize);
          link(page, qx, qy, qrSize, qrSize, b.qr);
          const cap = clean(b.qrCaption || "");
          page.drawText(cap, { x: qx + (qrSize - font.widthOfTextAtSize(cap, 8)) / 2, y: qy - 12, size: 8, font, color: WHITE });
        }
        y -= h + 10;
        break;
      }
      default:
        break;
    }
  }

  // Pie de página en todas las hojas
  const pages = doc.getPages();
  const foot = clean(`AlpiCars · ${config.email} · WhatsApp +${config.whatsappNumber}${url ? ` · ${url.replace(/^https?:\/\//, "").split("?")[0]}` : ""}`);
  pages.forEach((p, i) => {
    p.drawRectangle({ x: M, y: 44, width: W, height: 0.6, color: LINE });
    p.drawText(foot, { x: M, y: 30, size: 7.5, font, color: SOFT });
    link(p, M, 26, font.widthOfTextAtSize(foot, 7.5), 12, `https://wa.me/${config.whatsappNumber}`);
    const num = `${i + 1} / ${pages.length}`;
    p.drawText(num, { x: A4[0] - M - font.widthOfTextAtSize(num, 7.5), y: 30, size: 7.5, font, color: SOFT });
  });

  return doc.save();
}

// Descarga el PDF en el dispositivo
export function downloadPdf(bytes, fileName) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}

// Comparte el PDF como archivo (WhatsApp, Telegram, AirDrop...) en móviles que lo permiten
export async function sharePdf(bytes, fileName, text) {
  const file = new File([bytes], fileName, { type: "application/pdf" });
  if (!navigator.canShare || !navigator.canShare({ files: [file] })) return false;
  await navigator.share({ files: [file], title: "AlpiCars", text });
  return true;
}
