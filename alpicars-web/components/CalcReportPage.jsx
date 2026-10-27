"use client";

import { useEffect, useState } from "react";
import { AGES, CO2, calculate, fromQuery } from "../lib/calc";
import ReportShell from "./ReportShell";
import ShareBar from "./ShareBar";
import { contactBlock } from "../lib/pdfBlocks";
import LeadForm from "./LeadForm";
import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";

function Report() {
  const { t, formatPrice, setPresetService, setPresetCar } = useSite();
  const c = t.calc;
  const rp = t.report;
  const [input, setInput] = useState(null);

  useEffect(() => {
    setInput(fromQuery(window.location.search));
  }, []);

  const r = input ? calculate(input) : null;

  useEffect(() => {
    if (!input || !r) return;
    setPresetService("Llave en mano");
    setPresetCar(`Importar desde ${input.origin === "ch" ? "Suiza" : "Alemania"} un coche de unos ${formatPrice(r.car)} (en España cuesta ${formatPrice(input.priceEs)})`);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!r) return <div className="report-loading">…</div>;

  const rows = r.rows;
  const pct = (x) => `${(x * 100).toLocaleString("es-ES", { maximumFractionDigits: 2 })} %`;
  const save = r.save > 0;
  const originLabel = input.origin === "ch" ? "Suiza" : "Alemania";
  const regDetail = (k) =>
    k === "reg" && r.rate > 0
      ? `${c.regDetail.replace("{base}", formatPrice(r.regBase)).replace("{rate}", pct(r.rate)).replace("{region}", r.regionLabel)}${r.estimatedValue ? ` · ${c.estimated}` : ""}`
      : undefined;

  // Contenido del PDF (el mismo que ves en la página)
  const makeDoc = () => ({
    title: rp.title,
    fileName: "AlpiCars-informe-de-costes.pdf",
    blocks: [
      {
        type: "hero",
        kicker: rp.kicker,
        title: rp.title,
        big: save ? `${c.resultSave}: ${formatPrice(r.save)}` : `${c.resultNoSave}`,
        lines: [rp.intro],
      },
      { type: "compare", left: [rp.priceEs, formatPrice(input.priceEs)], right: [c.rows.total, formatPrice(r.total)] },
      { type: "h2", text: c.breakdown },
      { type: "rows", rows: rows.map(([k, v]) => [c.rows[k], formatPrice(v), regDetail(k)]), total: [c.rows.total, formatPrice(r.total)] },
      { type: "p", text: c.note, small: true },
      { type: "h2", text: rp.inputs },
      {
        type: "qa",
        items: [
          [rp.origin, originLabel],
          [rp.state, input.isNew ? c.states.new : c.states.used],
          [rp.priceEs, formatPrice(input.priceEs)],
          [rp.priceOrigin, formatPrice(input.priceOrigin)],
          ...(!input.isNew && input.tableValue > 0 ? [[rp.tableValue, formatPrice(input.tableValue)]] : []),
          [rp.age, AGES[input.age].label],
          [rp.co2, CO2[input.co2].short],
          [rp.dest, `${r.destLabel} (aprox. ${r.km} km)`],
          [rp.region, r.regionLabel],
          ...(input.origin === "ch" ? [[rp.eur1, input.eur1 ? rp.yes : rp.no]] : []),
        ],
      },
      { type: "h2", text: t.result.allServices },
      { type: "table", rows: t.services.plans.map((p) => [p.name, p.text, p.price == null ? t.services.onRequest : `${formatPrice(p.price)}${p.suffix ? ` ${p.suffix}` : ""}`, p.recommended]) },
      contactBlock(t.share.pdfContact, "calc", t.share.pdfContact.waCalc),
    ],
  });

  return (
    <>
      <section className="report-hero">
        <h1>{rp.title}</h1>
        <p className="report-lead">{rp.intro}</p>
        <div className={`report-save${save ? " is-save" : ""}`}>
          <span>{save ? c.resultSave : c.resultNoSave}</span>
          <strong>{save ? formatPrice(r.save) : `${formatPrice(Math.abs(r.save))} más`}</strong>
        </div>
        <ShareBar
          shareText={save ? `${rp.shareText} ${formatPrice(r.save)}.` : rp.shareText}
          source="Calculadora de gastos de importación"
          makeDoc={makeDoc} kind="calculadora"
        />
      </section>

      <section className="panel report-panel">
        <h2>{c.breakdown}</h2>
        <div className="report-compare">
          <div>
            <span>{rp.priceEs}</span>
            <strong>{formatPrice(input.priceEs)}</strong>
          </div>
          <div className="is-hl">
            <span>{c.rows.total}</span>
            <strong>{formatPrice(r.total)}</strong>
          </div>
        </div>
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
        <p className="report-small">{c.note}</p>
      </section>

      <section className="panel report-panel">
        <h2>{rp.inputs}</h2>
        <dl className="report-answers report-inputs">
          <div><dt>{rp.origin}</dt><dd>{input.origin === "ch" ? "Suiza" : "Alemania"}</dd></div>
          <div><dt>{rp.priceEs}</dt><dd>{formatPrice(input.priceEs)}</dd></div>
          <div><dt>{rp.priceOrigin}</dt><dd>{formatPrice(input.priceOrigin)}</dd></div>
          <div><dt>{rp.state}</dt><dd>{input.isNew ? c.states.new : c.states.used}</dd></div>
          {!input.isNew && input.tableValue > 0 && <div><dt>{rp.tableValue}</dt><dd>{formatPrice(input.tableValue)}</dd></div>}
          <div><dt>{rp.region}</dt><dd>{r.regionLabel}</dd></div>
          <div><dt>{rp.age}</dt><dd>{AGES[input.age].label}</dd></div>
          <div><dt>{rp.co2}</dt><dd>{CO2[input.co2].short}</dd></div>
          <div><dt>{rp.dest}</dt><dd>{r.destLabel} (≈ {r.km} km)</dd></div>
          {input.origin === "ch" && <div><dt>{rp.eur1}</dt><dd>{input.eur1 ? rp.yes : rp.no}</dd></div>}
        </dl>
        <a className="report-edit no-print" href="/#calculadora">{rp.edit}</a>
      </section>

      <section className="panel report-panel">
        <h2>{t.result.allServices}</h2>
        <table className="report-table">
          <tbody>
            {t.services.plans.map((p) => (
              <tr key={p.id} className={p.recommended ? "is-hl" : undefined}>
                <th scope="row">{p.name}</th>
                <td>{p.text}</td>
                <td className="r">
                  {p.price == null ? t.services.onRequest : formatPrice(p.price)}
                  {p.suffix && <small> {p.suffix}</small>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="report-cta no-print">
        <h2>{t.result.ctaTitle}</h2>
        <p>{t.result.ctaText}</p>
        <div className="report-cta-actions">
          <a className="btn btn-accent" href="#presupuesto">
            {c.cta}
            <ArrowIcon />
          </a>
        </div>
      </section>

      <div className="no-print">
        <LeadForm />
      </div>
    </>
  );
}

export default function CalcReportPage() {
  return (
    <ReportShell>
      <Report />
    </ReportShell>
  );
}
