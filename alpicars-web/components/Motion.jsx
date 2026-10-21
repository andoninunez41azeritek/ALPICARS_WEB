"use client";

import { useEffect } from "react";

// Animación de entrada: cada elemento con la clase "reveal" sube y aparece al entrar en pantalla.
// Si el JavaScript falla o el usuario prefiere menos movimiento, el contenido se ve igualmente.

export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    // Lo que ya está en pantalla al cargar se queda visible (sin parpadeo); el resto entra al hacer scroll
    document.querySelectorAll(".reveal, .blockmark").forEach((el) => {
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

    const watch = () => document.querySelectorAll(".reveal:not(.is-in), .blockmark:not(.is-in)").forEach((el) => io.observe(el));
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
