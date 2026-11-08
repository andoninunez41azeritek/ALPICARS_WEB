"use client";

import { useState } from "react";
import Image from "next/image";
import map from "../lib/mapData";
import { getRoute, fromPostalCode } from "../lib/destinations";
import photos from "../content/photos";
import { useSite } from "./SiteProvider";
import { track } from "../lib/track";

const fmt = (n) => new Intl.NumberFormat("es-ES").format(n).replace(/^(\d)(\d{3})$/, "$1.$2");

// Buscador por código postal: elige la provincia de entrega y dibuja la ruta en el mapa de fondo
function PostalSearch() {
  const { t, setDest } = useSite();
  const r = t.route;
  const [code, setCode] = useState("");
  const [found, setFound] = useState(null);
  const [error, setError] = useState("");

  const search = (e) => {
    e.preventDefault();
    const p = fromPostalCode(code);
    if (!p) {
      setFound(null);
      setError(r.cpError);
      return;
    }
    setError("");
    setFound(p);
    track("postal_search", { cp: p.cp, special: p.special || "" });
    if (p.d) setDest(p.key);
  };

  return (
    <div className="cp-search">
      <form onSubmit={search} className="cp-form" role="search" aria-label={r.cpLabel}>
        <label htmlFor="cp-input">{r.cpLabel}</label>
        <div className="cp-row">
          <input
            id="cp-input"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            pattern="\d{5}"
            placeholder={r.cpPlaceholder}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 5));
              setError("");
            }}
          />
          <button type="submit" className="btn btn-accent">{r.cpButton}</button>
        </div>
      </form>
      <div aria-live="polite">
        {error && <p className="cp-error">{error}</p>}
        {found && (
          <div className="cp-result">
            <p className="cp-place">
              <span className="cp-pin" aria-hidden="true" />
              <span>
                <strong>{found.capital}</strong>
                {found.province && found.province !== found.capital && <> · {found.province}</>}
              </span>
            </p>
            {found.km ? (
              <>
                <p className="cp-km">
                  ≈ {fmt(found.km)} km <span>{r.cpFromBasel}</span>
                </p>
                <p className="cp-meta">
                  {r.cpRegion}: {found.region}
                </p>
                {found.special === "isla" && <p className="cp-note">{r.cpIsland}</p>}
              </>
            ) : (
              <p className="cp-note">{r.cpSpecial}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// "Cómo funciona": los 5 pasos y la elección de ciudad de entrega (cambia la ruta del mapa de fondo)
export default function HowItWorks() {
  const { t, dest, setDest } = useSite();
  const r = t.route;
  const route = getRoute(dest) || map.routes.madrid;

  return (
    <section className="section how" id="como-funciona" aria-labelledby="how-title">
      <div className="panel how-panel">
        <h2 id="how-title" className="reveal">{r.title}</h2>
        <p className="lead reveal" style={{ "--d": "60ms" }}>{r.lead}</p>

        <figure className="how-photo reveal" style={{ "--d": "120ms" }}>
          <Image src={photos.autobahn.src} alt={photos.autobahn.alt} sizes="(max-width: 760px) 100vw, 720px" />
          <figcaption>{r.photoNote}</figcaption>
        </figure>

        <fieldset className="route-pick reveal">
          <legend>{r.pick}</legend>
          <PostalSearch />
          <p className="cp-or">{r.cpOr}</p>
          <div className="chips">
            {Object.entries(map.routes).map(([k, rt]) => (
              <button key={k} type="button" aria-pressed={dest === k} onClick={() => setDest(k)}>
                {rt.label}
              </button>
            ))}
          </div>
          <p className="route-km" aria-live="polite">
            <span className="km-num">
              {route.label} · ≈ {fmt(route.km)} km
            </span>
            <span className="km-label">{r.distance}</span>
          </p>
        </fieldset>

        <ol className="steps">
          {r.steps.map((s, i) => (
            <li key={s.title} className="reveal" style={{ "--d": `${i * 80}ms` }}>
              <h3>{s.title}</h3>
              <p>
                {s.text}
                {s.note && <strong> {s.note}</strong>}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
