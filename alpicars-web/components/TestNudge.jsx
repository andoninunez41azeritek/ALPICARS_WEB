"use client";

import { useEffect, useState } from "react";
import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";
import { track } from "../lib/track";

// Aviso discreto para hacer el test (skill popups): aparece una sola vez, cuando el visitante ya ha leído
// la mitad de la página o lleva 45 segundos, nunca nada más entrar. No tapa la página y se cierra con un clic.
// Si se cierra, no vuelve a salir en 7 días.

const KEY = "alpicars-nudge";
const WEEK = 7 * 24 * 3600 * 1000;

export default function TestNudge() {
  const { t, quizOpen, setQuizOpen } = useSite();
  const n = t.nudge;
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const last = Number(localStorage.getItem(KEY) || 0);
      if (Date.now() - last < WEEK) return;
    } catch {
      /* sin almacenamiento: se puede mostrar */
    }
    let done = false;
    const open = () => {
      if (done) return;
      done = true;
      setShow(true);
      track("nudge_view");
      cleanup();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.45) open();
    };
    const timer = setTimeout(open, 45000);
    window.addEventListener("scroll", onScroll, { passive: true });
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
    return cleanup;
  }, []);

  // Junto al formulario de presupuesto el aviso estorba: se esconde mientras se ve el formulario
  useEffect(() => {
    if (!show) return;
    const form = document.getElementById("presupuesto");
    if (!form || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(false), { threshold: 0.15 });
    io.observe(form);
    return () => io.disconnect();
  }, [show]);

  // Si el visitante abre el test por su cuenta, el aviso ya no hace falta
  useEffect(() => {
    if (quizOpen) setShow(false);
  }, [quizOpen]);

  const remember = () => {
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {
      /* nada */
    }
  };
  const close = () => {
    remember();
    setShow(false);
  };
  const start = () => {
    remember();
    track("nudge_click");
    setShow(false);
    setQuizOpen(true);
  };

  if (!show) return null;
  return (
    <aside className="nudge" role="complementary" aria-label={n.title}>
      <button type="button" className="nudge-x" onClick={close} aria-label={n.close}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <p className="nudge-title">{n.title}</p>
      <p className="nudge-text">{n.text}</p>
      <button type="button" className="btn btn-accent btn-small" onClick={start}>
        {n.cta}
        <ArrowIcon />
      </button>
    </aside>
  );
}
