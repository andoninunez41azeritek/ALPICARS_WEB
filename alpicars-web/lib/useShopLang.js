"use client";
// Hook del idioma de la tienda (solo navegador). Va aparte para que el servidor pueda usar lib/shopI18n.js.
import { useEffect, useState } from "react";
import { LANG_EVENT, readLang } from "./shopI18n";

// Devuelve el idioma actual y se actualiza si cambia (en esta pestaña o en otra)
export default function useShopLang() {
  const [lang, setL] = useState("es");
  useEffect(() => {
    const sync = () => setL(readLang());
    sync();
    window.addEventListener(LANG_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LANG_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return lang;
}
