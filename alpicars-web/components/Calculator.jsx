"use client";

import { useMemo, useState } from "react";
import config from "../content/config";
import map from "../lib/mapData";
import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";

// Calculadora de ahorro al importar.
// Cálculo orientativo:
//  - Alemania (UE): el precio ya incluye IVA alemán, no se paga IVA otra vez en coches usados.
//  - Suiza (fuera de la UE): arancel del 10 % si el coche no tiene origen UE/Suiza (EUR.1)
//    + IVA de importación del 21 % sobre coche + arancel + viaje.
//  - Impuesto de matriculación (IEDMT) por tramos de CO2 sobre el valor del coche
//    depreciado según la antigüedad (tablas de Hacienda para vehículos usados).

const AGES = [
  { label: "Menos de 1 año", coef: 1 },
  { label: "1 año", coef: 0.84 },
  { label: "2 años", coef: 0.67 },
  { label: "3 años", coef: 0.56 },
  { label: "4 años", coef: 0.47 },
  { label: "5 años", coef: 0.39 },
  { label: "6 años", coef: 0.34 },
  { label: "7 años", coef: 0.28 },
  { label: "8 años", coef: 0.24 },
  { label: "9 años", coef: 0.19 },
  { label: "10 años o más", coef: 0.17 },
];
const CO2 = [
  { label: "Hasta 120 g/km (eléctricos, híbridos enchufables y muchos híbridos)", rate: 0 },
  { label: "De 121 a 159 g/km", rate: 0.0475 },
  { label: "De 160 a 199 g/km", rate: 0.0975 },
  { label: "200 g/km o más", rate: 0.1475 },
];

export default function Calculator() {
  const { t, formatPrice, dest, setDest, setPresetService, setPresetCar } = useSite();
  const c = t.calc;
  const [origin, setOrigin] = useState("de");
  const [priceEs, setPriceEs] = useState(62000);
  const [priceOrigin, setPriceOrigin] = useState(44000);
  const [age, setAge] = useState(3);
  const [co2, setCo2] = useState(1);
  const [eur1, setEur1] = useState(true);

  const r = useMemo(() => {
    const km = map.routes[dest].km;
    const travel = Math.round(km * config.calculator.travelPerKm);
    const car = Number(priceOrigin) || 0;
    const duty = origin === "ch" && !eur1 ? Math.round(car * 0.1) : 0;
    const vat = origin === "ch" ? Math.round((car + duty + travel) * 0.21) : 0;
    const reg = Math.round(car * AGES[age].coef * CO2[co2].rate);
    const fees = config.calculator.fees;
    const service = config.calculator.serviceFee;
    const total = car + duty + vat + reg + fees + travel + service;
    const save = (Number(priceEs) || 0) - total;
    return { car, duty, vat, reg, fees, travel, service, total, save };
  }, [origin, priceEs, priceOrigin, age, co2, eur1, dest]);

  const rows = [
    ["car", r.car],
    ...(origin === "ch" ? [["duty", r.duty], ["vat", r.vat]] : []),
    ["reg", r.reg],
    ["fees", r.fees],
    ["travel", r.travel],
    ["service", r.service],
  ];

  const ask = () => {
    setPresetService("Llave en mano");
    setPresetCar(`Importar desde ${c.origins[origin]} un coche de unos ${formatPrice(r.car)} (en España cuesta ${formatPrice(Number(priceEs) || 0)})`);
  };

  return (
    <section className="section calc" id="calculadora" aria-labelledby="calc-title">
      <div className="panel calc-panel">
        <div className="calc-head">
          <h2 id="calc-title" className="reveal">{c.title}</h2>
          <p className="lead reveal" style={{ "--d": "60ms" }}>{c.lead}</p>
        </div>

        <div className="calc-grid">
          <form className="form calc-form reveal" style={{ "--d": "120ms" }} onSubmit={(e) => e.preventDefault()}>
            <div className="field">
              <span className="field-label">{c.origin}</span>
              <div className="seg" role="radiogroup" aria-label={c.origin}>
                {Object.entries(c.origins).map(([k, l]) => (
                  <button key={k} type="button" role="radio" aria-checked={origin === k} onClick={() => setOrigin(k)}>
                    {l}
                  </button>
                ))}
              </div>
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
                {c.priceOrigin} <small>{origin === "ch" ? c.priceOriginHintCH : c.priceOriginHintDE}</small>
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
            {origin === "ch" && (
              <label className="check">
                <input type="checkbox" checked={eur1} onChange={(e) => setEur1(e.target.checked)} />
                <span>{c.eur1}</span>
              </label>
            )}
          </form>

          <div className={`calc-result reveal${r.save > 0 ? " is-save" : " is-loss"}`} style={{ "--d": "200ms" }} aria-live="polite">
            <p className="calc-big">{formatPrice(Math.abs(r.save))}</p>
            <p className="calc-verdict">{r.save > 0 ? c.resultSave : c.resultNoSave}</p>
            {r.save <= 0 && <p className="calc-sub">{c.resultNoSaveText}</p>}

            <h3>{c.breakdown}</h3>
            <dl className="calc-rows">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{c.rows[k]}</dt>
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
            <p className="calc-note">{c.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
