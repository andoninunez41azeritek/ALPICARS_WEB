"use client";

import config from "../content/config";
import { useSite } from "./SiteProvider";
import { WhatsAppIcon } from "./Icons";

export default function Faq() {
  const { t } = useSite();
  const f = t.faq;
  const wa = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappText)}`;

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
      <div className="panel faq-panel">
        <div className="faq-side">
          <h2 id="faq-title" className="reveal">{f.title}</h2>
          <p className="lead reveal" style={{ "--d": "60ms" }}>{f.lead}</p>
          <p className="faq-ask reveal" style={{ "--d": "120ms" }}>{f.ask}</p>
          <a className="wa-btn wa-big reveal" style={{ "--d": "160ms" }} href={wa} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            {f.askCta}
          </a>
        </div>
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
