"use client";

import config from "../content/config";
import guides, { updated, updatedIso } from "../content/guides";
import ReportShell from "./ReportShell";
import { ArrowIcon } from "./Icons";

// Página de guía (SEO y GEO): respuesta directa arriba, desarrollo, preguntas frecuentes y llamada a la acción.
// Los datos estructurados (Article, FAQPage y BreadcrumbList) ayudan a Google y a los asistentes de IA a citarla.

function Guide({ g }) {
  const url = `${config.siteUrl}/guias/${g.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: g.metaTitle,
        description: g.description,
        inLanguage: "es-ES",
        dateModified: updatedIso,
        mainEntityOfPage: url,
        author: { "@id": `${config.siteUrl}/#organizacion` },
        publisher: { "@id": `${config.siteUrl}/#organizacion` },
      },
      {
        "@type": "FAQPage",
        mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${config.siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Guías", item: `${config.siteUrl}/guias` },
          { "@type": "ListItem", position: 3, name: g.title, item: url },
        ],
      },
    ],
  };
  const others = guides.filter((x) => x.slug !== g.slug);

  return (
    <article className="guide">
      <nav className="guide-crumbs" aria-label="Migas de pan">
        <a href="/">Inicio</a> / <a href="/guias">Guías</a> / <span>{g.title}</span>
      </nav>
      <header className="report-hero guide-hero">
        <h1>{g.title}</h1>
        <p className="guide-updated">Actualizado en {updated}</p>
        <p className="guide-answer">{g.answer}</p>
        <div className="report-cta-actions">
          <a className="btn btn-accent" href="/#calculadora">
            Calcula tu caso
            <ArrowIcon />
          </a>
          <a className="btn btn-ghost" href="/#presupuesto">
            Pide presupuesto
          </a>
        </div>
      </header>

      {g.sections.map((s) => (
        <section key={s.h2} className="panel report-panel guide-section">
          <h2>{s.h2}</h2>
          {s.paragraphs?.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {s.table && (
            <div className="guide-table" role="region" aria-label={s.h2} tabIndex={0}>
              <table className="report-table">
                <thead>
                  <tr>
                    {s.table.head.map((h) => (
                      <th key={h} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.rows.map((r) => (
                    <tr key={r[0]}>
                      {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {s.steps && (
            <ol className="steps">
              {s.steps.map((st) => (
                <li key={st.title}>
                  <h3>{st.title}</h3>
                  <p>{st.text}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}

      <section className="panel report-panel guide-section">
        <h2>Preguntas frecuentes</h2>
        <div className="faq-list">
          {g.faq.map((f) => (
            <details key={f.q} name="guide-faq">
              <summary>
                <span>{f.q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="report-cta">
        <h2>¿Quieres saber cuánto te cuesta a ti?</h2>
        <p>Calcula el coste total y el ahorro de tu coche en un minuto, o pídenos un presupuesto cerrado y sin compromiso.</p>
        <div className="report-cta-actions">
          <a className="btn btn-accent" href="/#calculadora">
            Ir a la calculadora
            <ArrowIcon />
          </a>
          <a className="btn btn-ghost" href="/#presupuesto">
            Pedir presupuesto
          </a>
        </div>
      </section>

      <nav className="panel report-panel guide-more" aria-label="Más guías">
        <h2>Más guías</h2>
        <ul>
          {others.map((o) => (
            <li key={o.slug}>
              <a href={`/guias/${o.slug}`}>{o.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}

function GuideIndex() {
  return (
    <div className="guide">
      <header className="report-hero guide-hero">
        <h1>Guías para importar tu coche de Suiza y Alemania</h1>
        <p className="guide-answer">Todo lo que necesitas saber antes de importar un coche: impuestos, trámites y costes, con la normativa de 2026.</p>
      </header>
      <ul className="guide-cards">
        {guides.map((g) => (
          <li key={g.slug} className="panel">
            <a href={`/guias/${g.slug}`}>
              <strong>{g.title}</strong>
              <span>{g.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GuidePage({ slug }) {
  const g = slug ? guides.find((x) => x.slug === slug) : null;
  return <ReportShell>{g ? <Guide g={g} /> : <GuideIndex />}</ReportShell>;
}
