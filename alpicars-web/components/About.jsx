"use client";

import Image from "next/image";
import map from "../lib/mapData";
import photos from "../content/photos";
import { useSite } from "./SiteProvider";

const CH = map.countries.find((c) => c.name === "Switzerland");

export default function About() {
  const { t } = useSite();
  const a = t.about;
  const zur = map.origins.zurich;

  return (
    <section className="section about" id="quienes-somos" aria-labelledby="about-title">
      <div className="panel">
      <div className="about-head">
        <h2 id="about-title" className="reveal">{a.title}</h2>
        <p className="lead reveal" style={{ "--d": "60ms" }}>{a.lead}</p>
      </div>

      <div className="about-board">
        <figure className="about-photo reveal" style={{ "--d": "120ms" }}>
          <Image src={photos.basilea.src} alt={photos.basilea.alt} sizes="(max-width: 760px) 100vw, 460px" />
          <figcaption>{a.photoNote}</figcaption>
        </figure>

        <div className="about-side">
          <div className="about-swiss reveal" aria-hidden="true">
            {/* Silueta de Suiza recortada del mapa, con Zúrich marcado */}
            <svg viewBox="578 368 210 130">
              <path d={CH.d} />
              <circle cx={zur.x} cy={zur.y} r="5.5" />
            </svg>
          </div>
          <dl className="facts reveal">
            {a.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="about-text">
        {a.paragraphs.map((p, i) => (
          <p key={i} className="reveal" style={{ "--d": `${i * 80}ms` }}>
            {p}
          </p>
        ))}
      </div>
      </div>
    </section>
  );
}
