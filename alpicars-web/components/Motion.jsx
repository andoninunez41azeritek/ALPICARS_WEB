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
    // Red de seguridad: si se salta de golpe (enlace a una sección, scroll muy rápido), todo lo que ya
    // está en pantalla o por encima se muestra, para que nunca quede nada invisible
    let raf = 0;
    const sweep = () => {
      raf = 0;
      document.querySelectorAll(".reveal:not(.is-in), .alps:not(.is-in)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onScroll);
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onScroll);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
