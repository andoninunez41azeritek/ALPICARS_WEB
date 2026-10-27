"use client";

import { useMemo, useState } from "react";
import map from "../lib/mapData";
import { AGES, CO2, calculate, toQuery } from "../lib/calc";
import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";
import { track } from "../lib/track";

// Calculadora de ahorro al importar. El cálculo está en lib/calc.js (lo comparte con el informe PDF).

export default function Calculator() {
  const { t, formatPrice, dest, setDest, setPresetService, setPresetCar } = useSite();
  const c = t.calc;
  const [origin, setOrigin] = useState("de");
  const [priceEs, setPriceEs] = useState(62000);
  const [priceOrigin, setPriceOrigin] = useState(44000);
  const [age, setAge] = useState(3);
  const [co2, setCo2] = useState(1);
  const [eur1, setEur1] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [tableValue, setTableValue] = useState("");

  const input = { origin, priceEs, priceOrigin, age, co2, eur1, dest, isNew, tableValue: Number(tableValue) || 0 };
  const r = useMemo(() => calculate(input), [origin, priceEs, priceOrigin, age, co2, eur1, dest, isNew, tableValue]); // eslint-disable-line react-hooks/exhaustive-deps
  const reportHref = `/calculadora/informe?${toQuery(input)}`;
  const rows = r.rows;
  const pct = (x) => `${(x * 100).toLocaleString("es-ES", { maximumFractionDigits: 2 })} %`;

  const ask = () => {
    setPresetService("Llave en mano");
    setPresetCar(`Importar desde ${origin === "ch" ? "Suiza" : "Alemania"} un coche de unos ${formatPrice(r.car)} (en España cuesta ${formatPrice(Number(priceEs) || 0)})`);
  };

  return (
    <section className="section calc" id="calculadora" aria-labelledby="calc-title">
      <div className="panel calc-panel">
        <div className="calc-head">
          <h2 id="calc-title" className="reveal">{c.title}</h2>
          <p className="lead reveal">{c.lead}</p>
        </div>

        <div className="calc-grid">
          <form className="form calc-form" onSubmit={(e) => e.preventDefault()}>
            <div className="field">
              <span className="field-label">{c.origin}</span>
              <div className="seg" role="radiogroup" aria-label={c.origin}>
                {[
                  ["de", "Alemania"],
                  ["ch", "Suiza"],
                ].map(([k, l]) => (
                  <button key={k} type="button" role="radio" aria-checked={origin === k} onClick={() => setOrigin(k)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span className="field-label">{c.state}</span>
              <div className="seg" role="radiogroup" aria-label={c.state}>
                {[
                  [false, c.states.used],
                  [true, c.states.new],
                ].map(([k, l]) => (
                  <button key={l} type="button" role="radio" aria-checked={isNew === k} onClick={() => setIsNew(k)}>
                    {l}
                  </button>
                ))}
              </div>
              {isNew && <small className="field-hint">{c.stateHint}</small>}
            </div>

            <label>
              <span>{c.priceEs}</span>
              <span className="money">
                <input type="number" inputMode="numeric" min="0" step="500" value={priceEs} onChange={(e) => setPriceEs(e.target.value)} />
                <i>€</i>
              </span>
            </label>
            <label>
              <span>
                {c.priceOrigin} <small>{origin === "ch" ? c.priceOriginHintCH : isNew ? c.priceOriginHintNew : c.priceOriginHintDE}</small>
              </span>
              <span className="money">
                <input type="number" inputMode="numeric" min="0" step="500" value={priceOrigin} onChange={(e) => setPriceOrigin(e.target.value)} />
                <i>€</i>
              </span>
            </label>
            <div className="calc-two">
              <label>
                <span>{c.age}</span>
                <select value={age} onChange={(e) => setAge(Number(e.target.value))}>
                  {AGES.map((a, i) => (
                    <option key={a.label} value={i}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{c.dest}</span>
                <select value={dest} onChange={(e) => setDest(e.target.value)}>
                  {Object.entries(map.routes).map(([k, rt]) => (
                    <option key={k} value={k}>
                      {rt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              <span>{c.co2}</span>
              <select value={co2} onChange={(e) => setCo2(Number(e.target.value))}>
                {CO2.map((x, i) => (
                  <option key={x.label} value={i}>
                    {x.label}
                  </option>
                ))}
              </select>
            </label>
            {!isNew && (
              <label>
                <span>
                  {c.tableValue} <small>{c.tableValueHint}</small>
                </span>
                <span className="money">
                  <input type="number" inputMode="numeric" min="0" step="500" placeholder="—" value={tableValue} onChange={(e) => setTableValue(e.target.value)} />
                  <i>€</i>
                </span>
                <a className="field-link" href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26357" target="_blank" rel="noopener noreferrer">
                  {c.tableValueLink}
                </a>
              </label>
            )}
            {origin === "ch" && (
              <label className="check">
                <input type="checkbox" checked={eur1} onChange={(e) => setEur1(e.target.checked)} />
                <span>{c.eur1}</span>
              </label>
            )}
          </form>

          <div className={`calc-result${r.save > 0 ? " is-save" : " is-loss"}`} aria-live="polite">
            <p className="calc-kicker">{r.save > 0 ? c.resultSave : c.resultNoSave}</p>
            <p className="calc-big">{r.save > 0 ? formatPrice(r.save) : formatPrice(Math.abs(r.save)) + " más"}</p>
            {r.save <= 0 && <p className="calc-sub">{c.resultNoSaveText}</p>}

            <h3>{c.breakdown}</h3>
            <dl className="calc-rows">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt>
                    {c.rows[k]}
                    {k === "reg" && r.rate > 0 && (
                      <small className="calc-detail">
                        {c.regDetail.replace("{base}", formatPrice(r.regBase)).replace("{rate}", pct(r.rate)).replace("{region}", r.regionLabel)}
                        {r.estimatedValue && ` · ${c.estimated}`}
                      </small>
                    )}
                  </dt>
                  <dd>{formatPrice(v)}</dd>
                </div>
              ))}
              <div className="calc-total">
                <dt>{c.rows.total}</dt>
                <dd>{formatPrice(r.total)}</dd>
              </div>
            </dl>
            <a href="#presupuesto" className="btn btn-accent btn-block" onClick={ask}>
              {c.cta}
              <ArrowIcon />
            </a>
            <a href={reportHref} className="btn btn-ghost btn-block calc-report" onClick={() => track("calc_report", { save: Math.round(r.save) })}>
              {c.report}
            </a>
            <p className="calc-note">{c.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
