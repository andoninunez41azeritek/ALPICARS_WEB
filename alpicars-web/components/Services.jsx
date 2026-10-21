"use client";

import { useSite } from "./SiteProvider";

export default function Services() {
  const { t, formatPrice, setPresetService } = useSite();
  const s = t.services;
  const price = (p) => (p.price == null ? s.onRequest : formatPrice(p.price));
  const choose = (p) => () => setPresetService(p.name);

  return (
    <section className="section services" id="servicios" aria-labelledby="services-title">
      <div className="panel">
      <div className="services-head">
        <h2 id="services-title" className="reveal">{s.title}</h2>
        <div>
          <p className="lead reveal" style={{ "--d": "60ms" }}>{s.lead}</p>
          <p className="updated reveal" style={{ "--d": "100ms" }}>{s.updated}</p>
        </div>
      </div>

      {/* Escritorio: tabla comparativa grande */}
      <div className="plans-table reveal" role="region" aria-labelledby="services-title" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col" className="pt-corner">{s.tableCorner}</th>
              {s.plans.map((p) => (
                <th key={p.id} scope="col" className={p.recommended ? "is-rec" : undefined}>
                  <span className="pt-name">{p.name}</span>
                  <span className="pt-price">{price(p)}</span>
                  {p.suffix && <span className="pt-suffix">{p.suffix}</span>}
                  {p.recommended && <span className="pt-rec">{s.recTag}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="pt-desc">
              <th scope="row">{s.forWhom}</th>
              {s.plans.map((p) => (
                <td key={p.id} className={p.recommended ? "is-rec" : undefined}>{p.text}</td>
              ))}
            </tr>
            {s.rows.map((row, i) => (
              <tr key={row}>
                <th scope="row">{row}</th>
                {s.plans.map((p) => (
                  <td key={p.id} className={`${p.recommended ? "is-rec " : ""}${/^No /.test(p.cells[i]) ? "is-no" : ""}`}>
                    {p.cells[i]}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="pt-small">
              <th scope="row">{s.notes}</th>
              {s.plans.map((p) => (
                <td key={p.id} className={p.recommended ? "is-rec" : undefined}>{p.excludes}</td>
              ))}
            </tr>
            <tr className="pt-actions">
              <th scope="row" />
              {s.plans.map((p) => (
                <td key={p.id} className={p.recommended ? "is-rec" : undefined}>
                  <a href="#presupuesto" className={`btn ${p.recommended ? "btn-accent" : "btn-dark"} btn-block`} onClick={choose(p)}>
                    {s.choose}
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Móvil: un bloque por servicio */}
      <div className="plans-stack">
        {s.plans.map((p) => (
          <article key={p.id} className={`plan${p.recommended ? " is-rec" : ""} reveal`}>            <h3>{p.name}</h3>
            <p className="plan-price">
              {price(p)} {p.suffix && <small>{p.suffix}</small>}
            </p>
            <p>{p.text}</p>
            <dl>
              {s.rows.map((row, i) => (
                <div key={row}>
                  <dt>{row}</dt>
                  <dd>{p.cells[i]}</dd>
                </div>
              ))}
            </dl>
            <p className="plan-note">{p.excludes}</p>
            <a href="#presupuesto" className="btn btn-accent btn-block" onClick={choose(p)}>
              {s.choose}
            </a>
          </article>
        ))}
      </div>

      <div className="trust">
        {t.trust.map((x, i) => (
          <div key={x.title} className="trust-item reveal" style={{ "--d": `${i * 90}ms` }}>
            <h3>{x.title}</h3>
            <p>{x.text}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
