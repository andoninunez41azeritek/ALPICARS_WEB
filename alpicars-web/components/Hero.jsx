"use client";

import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";

export default function Hero() {
  const { t, formatPrice } = useSite();
  const h = t.hero;
  const from = Math.min(...t.services.plans.filter((p) => p.price != null).map((p) => p.price));

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-inner">
        <h1 id="hero-title" className="reveal">{h.title}</h1>
        <p className="hero-lead reveal" style={{ "--d": "80ms" }}>
          {h.lead}
        </p>
        <p className="hero-from reveal" style={{ "--d": "140ms" }}>
          {h.from} <strong>{formatPrice(from)}</strong>
        </p>
        <div className="hero-actions reveal" style={{ "--d": "200ms" }}>
          <a className="btn btn-accent btn-big" href="#presupuesto">
            {h.cta}
            <ArrowIcon />
          </a>
          <a className="btn btn-ghost btn-big" href="#calculadora">
            {h.secondary}
          </a>
        </div>
        <ul className="hero-points">
          {h.points.map((p, i) => (
            <li key={p} className="reveal" style={{ "--d": `${260 + i * 70}ms` }}>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
