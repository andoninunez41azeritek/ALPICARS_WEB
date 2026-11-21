// Idioma de la tienda: el mismo que el visitante eligió en la web (se guarda en el navegador).
import { useEffect, useState } from "react";
import shopTexts from "../content/shop-i18n";
import productTexts from "../content/products-i18n";

export const LANGS = ["es", "en", "de", "fr", "it", "eu"];
const KEY = "alpicars-lang";
const EVENT = "alpicars-lang";

export function readLang() {
  try {
    const l = window.localStorage.getItem(KEY);
    return LANGS.includes(l) ? l : "es";
  } catch {
    return "es";
  }
}

export function setLang(l) {
  try {
    window.localStorage.setItem(KEY, l);
  } catch {
    /* sin almacenamiento */
  }
  window.dispatchEvent(new Event(EVENT));
}

// Devuelve el idioma actual y se actualiza si cambia (en esta pestaña o en otra)
export function useShopLang() {
  const [lang, setL] = useState("es");
  useEffect(() => {
    const sync = () => setL(readLang());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return lang;
}

export const shopT = (lang) => shopTexts[lang] || shopTexts.es;

// Rellena {p}, {n}, {name}...
export const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

const LOCALE = { es: "es-ES", en: "en-IE", de: "de-DE", fr: "fr-FR", it: "it-IT", eu: "eu-ES" };
export const money = (n, lang = "es") =>
  `${n.toLocaleString(LOCALE[lang] || "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

// Las fichas con texto tienen una imagen por idioma: <id>-ficha-<idioma>.webp (español: <id>-ficha.webp)
// Fotos del proveedor que traen texto escrito: también tienen versión por idioma (<foto>-<idioma>.webp)
const PHOTOS_WITH_TEXT = /(kit-detailing-20-2|limpiador-interiores-2|pistola-agua-presion-3|pulidor-faros-3|quita-aranazos-3|quita-aranazos-4)\.webp$/;
const fichaFor = (src, lang) =>
  lang === "es"
    ? src
    : src.replace(/-ficha\.webp$/, `-ficha-${lang}.webp`).replace(PHOTOS_WITH_TEXT, `$1-${lang}.webp`);

// Producto con los textos (y la ficha) del idioma. Los ids, precios y nombres internos de opciones no cambian.
export function localizeProduct(p, lang) {
  if (!p || lang === "es") return p;
  const tr = productTexts[lang]?.[p.id];
  if (!tr) return p;
  const options = p.options
    ? p.options.map((o) => {
        const ot = tr.options?.[o.name] || tr.choice;
        if (!ot) return o;
        return { ...o, label: ot.name, values: o.values.map((v) => ({ ...v, label: ot.values?.[v.id] || v.label })) };
      })
    : p.options;
  const images = (p.images || []).map((src) => fichaFor(src, lang));
  return {
    ...p,
    name: tr.name || p.name,
    short: tr.short || p.short,
    text: tr.text || p.text,
    features: tr.features || p.features,
    options,
    images,
    image: images[0] || p.image,
  };
}

// Texto de la opción elegida en el idioma (p. ej. "30 × 40 cm · 5 Tücher")
export function localLabel(p, variant) {
  if (!p?.options || !variant) return "";
  return p.options.map((o) => o.values.find((x) => x.id === variant.sel[o.name])?.label).filter(Boolean).join(" · ");
}
