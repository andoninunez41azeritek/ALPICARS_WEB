"use client";

import guides from "../content/guides";
import cities from "../content/cities";

// Enlaces internos desde la página de inicio a las guías y a las páginas de ciudad
// (ayudan a Google y a la IA a encontrar y entender todo el contenido).
export default function SeoLinks() {
  return (
    <section className="section seo-links" aria-labelledby="seo-links-title">
      <div className="panel">
        <h2 id="seo-links-title" className="reveal">Todo lo que necesitas saber antes de importar</h2>
        <div className="seo-links-grid">
          <div>
            <h3>Guías 2026</h3>
            <ul>
              {guides.map((g) => (
                <li key={g.slug}>
                  <a href={`/guias/${g.slug}`}>{g.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Te lo entregamos en</h3>
            <ul className="seo-links-cities">
              {cities.map((c) => (
                <li key={c.slug}>
                  <a href={`/importar-coche/${c.slug}`}>{c.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
