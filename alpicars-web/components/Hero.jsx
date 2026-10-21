"use client";

import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";

export default function Hero() {
  const { t } = useSite();
  const h = t.hero;
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-inner">
        <img className="hero-mark reveal" src="/logo-mark-white.png" alt="" width="406" height="234" />
        <h1 id="hero-title" className="reveal">{h.title}</h1>
        <p className="hero-lead reveal">{h.lead}</p>
        <div className="hero-actions reveal">
          <a className="btn btn-accent" href="#presupuesto">
            {h.cta}
            <ArrowIcon />
          </a>
          <a className="btn btn-ghost" href="#calculadora">
            {h.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}
