"use client";

import { useEffect, useState } from "react";
import { decodeAnswers, recommend } from "../lib/recommend";
import ReportShell from "./ReportShell";
import ShareBar from "./ShareBar";
import { contactBlock } from "../lib/pdfBlocks";
import LeadForm from "./LeadForm";
import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";

function Result() {
  const { t, formatPrice, setPresetService, setPresetCar, setQuizOpen } = useSite();
  const r = t.result;
  const q = t.quiz;
  const [answers, setAnswers] = useState(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("r") || "";
    setAnswers(decodeAnswers(q.questions, code));
  }, [q.questions]);

  const res = answers ? recommend(answers) : null;

  useEffect(() => {
    if (!res) return;
    setPresetService(t.services.plans.find((p) => p.id === res.service)?.name || "");
    setPresetCar(t.rec.models[res.model]);
  }, [res?.model, res?.service, t]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!res) return <div className="report-loading">{q.loading}</div>;

  const rc = t.rec;
  const model = rc.models[res.model];
  const why = rc.why[res.why];
  const plan = t.services.plans.find((p) => p.id === res.service);
  const guide = t.models[res.guide[0]][res.guide[1]];
  const originLabel = rc[res.origin];
  const fromLabel = plan?.price != null ? rc.from.replace("{p}", formatPrice(plan.price)) : "";
  const priceOf = (p) => (p.price == null ? t.services.onRequest : `${formatPrice(p.price)}${p.suffix ? ` ${p.suffix}` : ""}`);

  // Contenido del PDF (el mismo que ves en la página)
  const makeDoc = () => ({
    title: `${r.title}: ${model}`,
    fileName: `AlpiCars-coche-ideal.pdf`,
    blocks: [
      {
        type: "hero",
        kicker: r.kicker,
        title: r.title,
        big: model,
        lines: [why, ...(res.green ? [rc.green] : []), `${rc.origin}: ${originLabel} · ${rc.service}: ${plan?.name || ""}${fromLabel ? ` · ${fromLabel}` : ""}`],
      },
      { type: "h2", text: r.guideTitle },
      { type: "h3", text: guide.name },
      { type: "cols", left: { title: t.models.pros, items: guide.pros }, right: { title: t.models.cons, items: guide.cons } },
      { type: "h2", text: r.serviceTitle },
      ...(plan ? [{ type: "table", rows: [[plan.name, `${plan.text} ${plan.excludes || ""}`.trim(), priceOf(plan), true]] }] : []),
      { type: "h3", text: r.allServices },
      { type: "table", rows: t.services.plans.map((p) => [p.name, p.text, priceOf(p), p.id === res.service]) },
      { type: "h2", text: r.stepsTitle },
      { type: "steps", items: t.route.steps.map((st) => ({ title: st.title, text: `${st.text}${st.note ? ` ${st.note}` : ""}` })) },
      { type: "h2", text: r.yourAnswers },
      { type: "qa", items: q.questions.map((qq) => [qq.q, qq.a[answers[qq.key]]]) },
      { type: "p", text: r.note, small: true },
      contactBlock(t.share.pdfContact, "test", t.share.pdfContact.waTest.replace("{model}", model)),
    ],
  });

  return (
    <>
      <section className="report-hero">
        <h1>{r.title}</h1>
        <p className="report-model">{model}</p>
        <p className="report-lead">{why}</p>
        {res.green && <p className="report-lead">{rc.green}</p>}
        <ul className="report-pills">
          <li>{rc.origin}: {originLabel}</li>
          <li>{rc.service}: {plan?.name}</li>
          {fromLabel && <li>{fromLabel}</li>}
        </ul>
        <ShareBar shareText={`${r.shareText} ${model}.`} source="Test ¿Qué coche es para ti?" makeDoc={makeDoc} kind="test" />
      </section>

      <section className="panel report-panel">
        <h2>{r.guideTitle}</h2>
        <h3 className="report-sub">{guide.name}</h3>
        <div className="model-cols">
          <div>
            <h4>{t.models.pros}</h4>
            <ul>
              {guide.pros.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{t.models.cons}</h4>
            <ul>
              {guide.cons.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="panel report-panel">
        <h2>{r.serviceTitle}</h2>
        {plan && (
          <div className="report-plan">
            <div>
              <h3 className="report-sub">{plan.name}</h3>
              <p>{plan.text}</p>
              <p className="report-small">{plan.excludes}</p>
            </div>
            <p className="report-price">
              {plan.price == null ? t.services.onRequest : formatPrice(plan.price)}
              {plan.suffix && <small> {plan.suffix}</small>}
            </p>
          </div>
        )}
        <h3 className="report-sub">{r.allServices}</h3>
        <table className="report-table">
          <tbody>
            {t.services.plans.map((p) => (
              <tr key={p.id} className={p.id === res.service ? "is-hl" : undefined}>
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

      <section className="panel report-panel">
        <h2>{r.stepsTitle}</h2>
        <ol className="steps">
          {t.route.steps.map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>
                {s.text}
                {s.note && <em> {s.note}</em>}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel report-panel">
        <h2>{r.yourAnswers}</h2>
        <dl className="report-answers">
          {q.questions.map((qq) => (
            <div key={qq.key}>
              <dt>{qq.q}</dt>
              <dd>{qq.a[answers[qq.key]]}</dd>
            </div>
          ))}
        </dl>
        <p className="report-small">{r.note}</p>
      </section>

      <section className="report-cta no-print">
        <h2>{r.ctaTitle}</h2>
        <p>{r.ctaText}</p>
        <div className="report-cta-actions">
          <a className="btn btn-accent" href="#presupuesto">
            {r.cta}
            <ArrowIcon />
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => setQuizOpen(true)}>
            {r.retake}
          </button>
        </div>
      </section>

      <div className="no-print">
        <LeadForm />
      </div>
    </>
  );
}

export default function QuizResultPage() {
  return (
    <ReportShell>
      <Result />
    </ReportShell>
  );
}
