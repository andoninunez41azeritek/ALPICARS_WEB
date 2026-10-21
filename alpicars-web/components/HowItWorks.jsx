"use client";

import map from "../lib/mapData";
import { useSite } from "./SiteProvider";

const fmt = (n) => new Intl.NumberFormat("es-ES").format(n).replace(/^(\d)(\d{3})$/, "$1.$2");

// "Cómo funciona": los 5 pasos y la elección de ciudad de entrega (cambia la ruta del mapa de fondo)
export default function HowItWorks() {
  const { t, dest, setDest } = useSite();
  const r = t.route;
  const route = map.routes[dest];

  return (
    <section className="section how" id="como-funciona" aria-labelledby="how-title">
      <div className="panel how-panel">
        <h2 id="how-title" className="reveal">{r.title}</h2>
        <p className="lead reveal">{r.lead}</p>

        <fieldset className="route-pick reveal">
          <legend>{r.pick}</legend>
          <div className="chips">
            {Object.entries(map.routes).map(([k, rt]) => (
              <button key={k} type="button" aria-pressed={dest === k} onClick={() => setDest(k)}>
                {rt.label}
              </button>
            ))}
          </div>
          <p className="route-km" aria-live="polite">
            <span className="km-num">≈ {fmt(route.km)} km</span>
            <span className="km-label">{r.distance}</span>
          </p>
        </fieldset>

        <ol className="steps">
          {r.steps.map((s, i) => (
            <li key={s.title} className="reveal" style={{ "--d": `${i * 80}ms` }}>
              <h3>{s.title}</h3>
              <p>
                {s.text}
                {s.note && <em> {s.note}</em>}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
