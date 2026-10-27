"use client";

import { useEffect } from "react";
import { rememberOrigin, track } from "../lib/track";

// Animación de entrada: cada elemento con la clase "reveal" sube y aparece al entrar en pantalla.
// Si el JavaScript falla o el usuario prefiere menos movimiento, el contenido se ve igualmente.

export default function Motion() {
  useEffect(() => {
    rememberOrigin();
    // Cada clic en un enlace de WhatsApp cuenta como contacto
    const onClick = (e) => {
      const a = e.target.closest?.('a[href*="wa.me/"]');
      if (a && !a.href.includes("wa.me/?")) track("whatsapp_click", { place: a.closest("section,header,footer")?.id || a.className.split(" ")[0] || "web" });
    };
    document.addEventListener("click", onClick);

    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    // Lo que ya está en pantalla al cargar se queda visible (sin parpadeo); el resto entra al hacer scroll
    document.querySelectorAll(".reveal, .alps").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
    });
    root.classList.add("motion");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const watch = () => document.querySelectorAll(".reveal:not(.is-in), .alps:not(.is-in)").forEach((el) => io.observe(el));
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("click", onClick);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
