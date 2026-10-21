"use client";

import config from "../content/config";
import photos from "../content/photos";
import { useSite } from "./SiteProvider";

const LETTERS = [
  ["A", 78], ["L", 64], ["P", 88], ["I", 70],
  ["C", 100], ["A", 82], ["R", 92], ["S", 74],
];

export default function Footer() {
  const { t } = useSite();
  const f = t.footer;
  const wa = `https://wa.me/${config.whatsappNumber}`;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="blockmark" aria-label="AlpiCars">
        {LETTERS.map(([l, h], i) => (
          <span key={i} className={i < 4 ? "bm-navy" : "bm-red"} style={{ "--h": `${h}%`, "--d": `${i * 60}ms` }} aria-hidden="true">
            {l}
          </span>
        ))}
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
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
          <li>
            <a href="#servicios">{f.services}</a>
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
