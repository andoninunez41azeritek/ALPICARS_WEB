"use client";

import config from "../content/config";
import photos from "../content/photos";
import { useSite } from "./SiteProvider";
import { openCookieSettings } from "./CookieBanner";

// Los Alpes formados por las letras de AlpiCars: cada letra es una montaña con su cumbre nevada.
const W = 1600;
const H = 420;
const HALF = 150; // media anchura de cada montaña
const PEAKS = [
  ["A", 120], ["L", 170], ["P", 70], ["I", 150],
  ["C", 40], ["A", 115], ["R", 85], ["S", 140],
];

function snowcap(cx, top) {
  const f = 0.24;
  const y = top + (H - top) * f;
  const dx = HALF * f;
  return [
    [cx, top],
    [cx + dx, y],
    [cx + dx * 0.45, y - 10],
    [cx + dx * 0.1, y + 7],
    [cx - dx * 0.35, y - 9],
    [cx - dx, y],
  ]
    .map((p) => p.join(","))
    .join(" ");
}

function Alps() {
  const step = (W - 2 * HALF) / (PEAKS.length - 1);
  const back = PEAKS.map((_, i) => {
    const cx = HALF + step * i + step / 2;
    const top = 60 + ((i * 53) % 90);
    return `${cx - HALF * 1.2},${H} ${cx},${top} ${cx + HALF * 1.2},${H}`;
  });
  return (
    <svg className="alps-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="AlpiCars">
      {back.slice(0, -1).map((pts, i) => (
        <polygon key={`b${i}`} points={pts} className="alps-back" />
      ))}
      {PEAKS.map(([letter, top], i) => {
        const cx = HALF + step * i;
        return (
          <g key={i} className={`alps-peak ${i < 4 ? "alps-navy" : "alps-red"}`} style={{ "--d": `${i * 70}ms` }}>
            <polygon points={`${cx - HALF},${H} ${cx},${top} ${cx + HALF},${H}`} className="alps-rock" />
            <polygon points={snowcap(cx, top)} className="alps-snow" />
            <text x={cx} y={H - 26} className="alps-letter">
              {letter}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Footer() {
  const { t } = useSite();
  const f = t.footer;
  const wa = `https://wa.me/${config.whatsappNumber}`;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="alps">
        <Alps />
      </div>

      <div className="ft-grid">
        <div className="ft-contact">
          <h2>{f.contact}</h2>
          <p className="ft-slogan">{config.slogan}</p>
          <p>
            <a href={`mailto:${config.email}`}>{config.email}</a>
          </p>
          <p>
            <a href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </p>
        </div>
        <ul className="ft-links">
          {t.nav.map((n) => (
            <li key={n.href}>
              <a href={`/${n.href}`}>{n.label}</a>
            </li>
          ))}
          <li>
            <a href="/#servicios">{f.services}</a>
          </li>
          <li>
            <a href="/guias">{f.guides}</a>
          </li>
          <li>
            <a href="/importar-coche">{f.cities}</a>
          </li>
          <li>
            <a href={config.shopUrl} target="_blank" rel="noopener noreferrer">
              {f.shop}
            </a>
          </li>
        </ul>
        <ul className="ft-links">
          {f.legal.map((n) => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
          <li>
            <button type="button" className="ft-link-btn" onClick={openCookieSettings}>
              {f.cookieSettings || "Configurar cookies"}
            </button>
          </li>
        </ul>
      </div>

      <div className="ft-bottom">
        <p>
          © {year} AlpiCars. {f.rights}
        </p>
        <a className="btn btn-light btn-small" href="#inicio">
          {f.top}
        </a>
      </div>
      <p className="ft-credits">
        {f.credits}{" "}
        {Object.entries(photos).map(([k, p], i, all) => (
          <span key={k}>
            <a href={p.page} target="_blank" rel="noopener noreferrer">
              {f.photoTitles[k]}
            </a>{" "}
            ({p.by},{" "}
            <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer license">
              {p.license}
            </a>
            ){i < all.length - 1 ? "; " : ". "}
          </span>
        ))}
        {f.mapCredit}
      </p>
    </footer>
  );
}
