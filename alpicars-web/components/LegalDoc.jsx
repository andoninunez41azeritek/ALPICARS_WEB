"use client";

import ReportShell from "./ReportShell";
import { updated } from "../content/legal";
import { openCookieSettings } from "./CookieBanner";

// Muestra un texto legal de content/legal.js: título, índice y secciones.

function Block({ b }) {
  if (typeof b === "string") return <p>{b}</p>;
  if (b.ul)
    return (
      <ul>
        {b.ul.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    );
  if (b.note) return <p className="legal-note">{b.note}</p>;
  if (b.table)
    return (
      <div className="legal-table-wrap">
        <table className="legal-table">
          <thead>
            <tr>
              {b.table.head.map((h) => (
                <th key={h} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.table.rows.map((r) => (
              <tr key={r[0]}>
                {r.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  return null;
}

export function LegalBody({ doc }) {
  const id = (i) => `apartado-${i + 1}`;
  return (
    <article className="legal-doc">
      <header className="legal-head">
        <h1>{doc.title}</h1>
        {doc.subtitle && <p className="legal-sub">{doc.subtitle}</p>}
        <p className="legal-updated">Última actualización: {updated}</p>
      </header>
      {doc.sections.length > 4 && (
        <nav className="legal-toc" aria-label="Índice">
          <ol>
            {doc.sections.map((s, i) => (
              <li key={s.h}>
                <a href={`#${id(i)}`}>{s.h.replace(/^\d+\.\s*/, "")}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {doc.sections.map((s, i) => (
        <section key={s.h} id={id(i)} className="legal-section">
          <h2>{s.h}</h2>
          {s.blocks.map((b, j) => (
            <Block key={j} b={b} />
          ))}
        </section>
      ))}
      {doc.slug === "cookies" && (
        <p>
          <button type="button" className="btn btn-accent" onClick={openCookieSettings}>
            Configurar cookies
          </button>
        </p>
      )}
    </article>
  );
}

export default function LegalDoc({ doc }) {
  return (
    <ReportShell>
      <LegalBody doc={doc} />
    </ReportShell>
  );
}
