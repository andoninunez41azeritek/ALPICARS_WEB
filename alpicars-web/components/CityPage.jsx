"use client";

import config from "../content/config";
import cities from "../content/cities";
import guides from "../content/guides";
import map from "../lib/mapData";
import { CO2, RATES, REGION, calculate } from "../lib/calc";
import ReportShell from "./ReportShell";
import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";

// Página "Importar un coche de Alemania o Suiza a <ciudad>" (SEO local y GEO).

const pct = (x) => `${(x * 100).toLocaleString("es-ES", { maximumFractionDigits: 2 })} %`;
const num = (n) => n.toLocaleString("es-ES");

function City({ c }) {
  const { t, formatPrice } = useSite();
  const route = map.routes[c.dest];
  const rates = RATES[(REGION[c.dest] || REGION.madrid).key];
  const ex = calculate({ origin: "de", priceEs: 62000, priceOrigin: 44000, age: 3, co2: 1, dest: c.dest });
  const url = `${config.siteUrl}/importar-coche/${c.slug}`;
  const title = `Importar un coche de Alemania o Suiza a ${c.name}`;
  const answer = `AlpiCars busca tu coche en Alemania o Suiza, lo revisa en origen y lo trae conduciendo unos ${num(route.km)} km desde Basilea hasta ${c.name}, donde te lo entregamos matriculado. En ${c.region}, el impuesto de matriculación es del 0 % hasta 120 g/km de CO₂, del ${pct(rates[1])} de 121 a 159 g/km, del ${pct(rates[2])} de 160 a 199 g/km y del ${pct(rates[3])} desde 200 g/km.`;
  const faq = [
    { q: `¿Me entregáis el coche en ${c.name}?`, a: `Sí. Con el servicio Llave en mano un conductor de AlpiCars trae el coche rodando desde Basilea hasta ${c.name} (unos ${num(route.km)} km), con seguro a todo riesgo, y te lo entregamos matriculado en tu puerta.` },
    { q: `¿Qué impuesto de matriculación pago en ${c.name}?`, a: `Depende de las emisiones de CO₂: 0 % hasta 120 g/km, ${pct(rates[1])} de 121 a 159, ${pct(rates[2])} de 160 a 199 y ${pct(rates[3])} desde 200 g/km. En un coche usado se calcula sobre el valor de las tablas de Hacienda según su antigüedad.` },
    { q: `¿Cuánto cuesta traer un coche de Alemania a ${c.name}?`, a: `Además del coche, cuenta el impuesto de matriculación, la tasa de la DGT (97,80 €), la ITV de importación, las placas y el viaje (unos ${formatPrice(ex.travel)} hasta ${c.name}). En el ejemplo de esta página, un coche de 44.000 € en Alemania sale por unos ${formatPrice(ex.total)} matriculado en ${c.name}.` },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: title,
        serviceType: "Importación de vehículos",
        description: answer,
        provider: { "@id": `${config.siteUrl}/#organizacion` },
        areaServed: { "@type": "City", name: c.name },
        url,
      },
      { "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${config.siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Importar a tu ciudad", item: `${config.siteUrl}/importar-coche` },
          { "@type": "ListItem", position: 3, name: c.name, item: url },
        ],
      },
    ],
  };

  return (
    <article className="guide">
      <nav className="guide-crumbs" aria-label="Migas de pan">
        <a href="/">Inicio</a> / <a href="/importar-coche">Importar a tu ciudad</a> / <span>{c.name}</span>
      </nav>
      <header className="report-hero guide-hero">
        <h1>{title}</h1>
        <p className="guide-answer">{answer}</p>
        <div className="report-cta-actions">
          <a className="btn btn-accent" href={`/?destino=${c.dest}#calculadora`}>
            Calcula tu coche en {c.name}
            <ArrowIcon />
          </a>
          <a className="btn btn-ghost" href="/#presupuesto">
            Pide presupuesto
          </a>
        </div>
      </header>

      <section className="panel report-panel guide-section">
        <h2>Datos para {c.name}</h2>
        <div className="guide-table" role="region" aria-label={`Datos para ${c.name}`} tabIndex={0}>
          <table className="report-table">
            <tbody>
              <tr><th scope="row">Distancia desde Basilea</th><td>Unos {num(route.km)} km por carretera</td></tr>
              <tr><th scope="row">Cómo llega el coche</th><td>Conducido por un conductor de AlpiCars, con seguro a todo riesgo</td></tr>
              {CO2.map((x, i) => (
                <tr key={x.short}><th scope="row">Impuesto de matriculación · {x.short}</th><td>{pct(rates[i])}</td></tr>
              ))}
              <tr><th scope="row">Tasa DGT de matriculación (2026)</th><td>97,80 €</td></tr>
            </tbody>
          </table>
        </div>
        {c.note && <p>{c.note}</p>}
      </section>

      <section className="panel report-panel guide-section">
        <h2>Ejemplo: coche de Alemania entregado en {c.name}</h2>
        <p>Coche usado de entre 3 y 4 años y 140 g/km comprado en Alemania por 44.000 € (con IVA alemán), que en España cuesta 62.000 €:</p>
        <dl className="calc-rows">
          {ex.rows.map(([k, v]) => (
            <div key={k}>
              <dt>{t.calc.rows[k]}</dt>
              <dd>{formatPrice(v)}</dd>
            </div>
          ))}
          <div className="calc-total">
            <dt>{t.calc.rows.total}</dt>
            <dd>{formatPrice(ex.total)}</dd>
          </div>
        </dl>
        <p className="report-small">
          Ahorro aproximado frente a comprarlo en España: {formatPrice(ex.save)}. Cálculo con la calculadora de AlpiCars; el impuesto se estima con el precio en España. Haz el tuyo con los datos de tu coche.
        </p>
      </section>

      <section className="panel report-panel guide-section">
        <h2>Cómo lo hacemos</h2>
        <ol className="steps">
          {t.route.steps.map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel report-panel guide-section">
        <h2>Preguntas frecuentes</h2>
        <div className="faq-list">
          {faq.map((f) => (
            <details key={f.q} name="city-faq">
              <summary>
                <span>{f.q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="panel report-panel guide-more" aria-label="Más información">
        <h2>Otras ciudades y guías</h2>
        <ul>
          {cities
            .filter((x) => x.slug !== c.slug)
            .map((x) => (
              <li key={x.slug}>
                <a href={`/importar-coche/${x.slug}`}>Importar un coche a {x.name}</a>
              </li>
            ))}
          {guides.map((g) => (
            <li key={g.slug}>
              <a href={`/guias/${g.slug}`}>{g.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}

function CityIndex() {
  return (
    <div className="guide">
      <header className="report-hero guide-hero">
        <h1>Importar un coche de Alemania o Suiza a tu ciudad</h1>
        <p className="guide-answer">Te entregamos el coche matriculado en toda la península. Elige tu ciudad para ver la distancia, el impuesto de matriculación de tu comunidad y un ejemplo de coste.</p>
      </header>
      <ul className="guide-cards">
        {cities.map((c) => (
          <li key={c.slug} className="panel">
            <a href={`/importar-coche/${c.slug}`}>
              <strong>{c.name}</strong>
              <span>Unos {num(map.routes[c.dest].km)} km desde Basilea · impuesto de matriculación de {c.region}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CityPage({ slug }) {
  const c = slug ? cities.find((x) => x.slug === slug) : null;
  return <ReportShell>{c ? <City c={c} /> : <CityIndex />}</ReportShell>;
}
