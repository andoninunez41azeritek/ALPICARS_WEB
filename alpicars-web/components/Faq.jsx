"use client";

import { useSite } from "./SiteProvider";

export default function Faq() {
  const { t } = useSite();
  const f = t.faq;

  // Datos estructurados para que Google pueda mostrar las preguntas en los resultados
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: f.items.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };

  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="panel">
      <h2 id="faq-title" className="reveal">{f.title}</h2>
      <div className="faq-list">
        {f.items.map((x, i) => (
          <details key={x.q} name="faq" className="reveal" style={{ "--d": `${Math.min(i, 5) * 50}ms` }} open={i === 0}>
            <summary>
              <span>{x.q}</span>
              <i aria-hidden="true" />
            </summary>
            <p>{x.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </div>
    </section>
  );
}
