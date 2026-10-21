"use client";

import { useState } from "react";
import photos from "../content/photos";
import { useSite } from "./SiteProvider";

export default function Models() {
  const { t } = useSite();
  const m = t.models;
  const [tab, setTab] = useState("de");
  const list = m[tab];

  return (
    <section className="section models" id="mas-solicitados" aria-labelledby="models-title">
      <div className="panel">
      <div className="models-head">
        <div>
          <h2 id="models-title" className="reveal">{m.title}</h2>
          <p className="lead reveal">{m.lead}</p>
        </div>
        <div className="seg seg-dark reveal" role="tablist" aria-label="Origen">
          {["de", "ch"].map((k) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} aria-controls="models-panel" onClick={() => setTab(k)}>
              {m.tabs[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="models-board" id="models-panel" role="tabpanel">
        <figure className="models-photo" aria-hidden="true">
          <img src={tab === "ch" ? photos.peaks.src : photos.road.src} alt="" width="900" height="900" loading="lazy" />
        </figure>
        {list.map((car, i) => (
          <article key={car.name} className={`model tone-${i % 3}`}>
            <h3>{car.name}</h3>
            <div className="model-cols">
              <div>
                <h4>{m.pros}</h4>
                <ul>
                  {car.pros.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>{m.cons}</h4>
                <ul>
                  {car.cons.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
