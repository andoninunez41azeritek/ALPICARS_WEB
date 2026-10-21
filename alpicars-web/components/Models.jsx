"use client";

import { useState } from "react";
import Image from "next/image";
import photos from "../content/photos";
import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";

export default function Models() {
  const { t, setPresetCar } = useSite();
  const m = t.models;
  const [tab, setTab] = useState("de");
  const list = m[tab];

  return (
    <section className="section models" id="mas-solicitados" aria-labelledby="models-title">
      <div className="panel">
        <div className="models-head">
          <div>
            <h2 id="models-title" className="reveal">{m.title}</h2>
            <p className="lead reveal" style={{ "--d": "60ms" }}>{m.lead}</p>
          </div>
          <div className="seg reveal" style={{ "--d": "120ms" }} role="tablist" aria-label={t.calc.origin}>
            {["de", "ch"].map((k) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} aria-controls="models-panel" onClick={() => setTab(k)}>
                {m.tabs[k]}
              </button>
            ))}
          </div>
        </div>

        <ul className="model-list" id="models-panel" role="tabpanel">
          {list.map((car, i) => {
            const photo = photos[car.photo];
            return (
              <li key={car.name} className="model reveal" style={{ "--d": `${Math.min(i, 3) * 80}ms` }}>
                {photo && (
                  <figure className="model-photo">
                    <Image src={photo.src} alt={photo.alt} sizes="(max-width: 760px) 100vw, 40vw" />
                  </figure>
                )}
                <div className="model-body">
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
                  <a className="text-link" href="#presupuesto" onClick={() => setPresetCar(car.name)}>
                    {m.ask}
                    <ArrowIcon />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
