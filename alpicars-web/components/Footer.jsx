"use client";

import config from "../content/config";
import photos from "../content/photos";
import { useSite } from "./SiteProvider";
import { openCookieSettings } from "./CookieBanner";

// Los Alpes: tres cordilleras (lejana, media y cercana) con cumbres nevadas y luz de atardecer.
// Los perfiles se generan siempre igual (semilla fija), así el dibujo no cambia entre visitas.
const W = 1600;
const H = 420;

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Perfil de una cordillera: picos principales + desplazamiento del punto medio (relieve fino)
function ridge({ seed, base, peaks, rough, detail = 8 }) {
  const r = rng(seed);
  const n = 2 ** detail;
  const ys = new Array(n + 1).fill(0);
  let amp = rough;
  for (let step = n; step > 1; step /= 2) {
    for (let i = step / 2; i < n; i += step) ys[i] = (ys[i - step / 2] + ys[i + step / 2]) / 2 + (r() - 0.5) * amp;
    amp *= 0.6;
  }
  // cada pico con su forma: laderas cóncavas, más o menos afiladas y algo asimétricas
  const shaped = peaks.map(([px, h, w]) => [px, h, w * (0.8 + r() * 0.4), w * (0.8 + r() * 0.4), 1.15 + r() * 0.6]);
  return ys.map((noise, i) => {
    const x = (i / n) * W;
    const lift = shaped.reduce((m, [px, h, wl, wr, k]) => {
      const d = x < px ? (px - x) / wl : (x - px) / wr;
      return Math.max(m, h * Math.max(0, 1 - d) ** k);
    }, 0);
    // el relieve fino pesa más en las cumbres (roca) que en la base (valles)
    return [x, base - lift + noise * (0.45 + lift / 260)];
  });
}

const toPoly = (pts) => [`0,${H}`, ...pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`), `${W},${H}`].join(" ");

// Nieve: todo lo que queda por encima de una línea irregular (con lenguas que bajan por los canales)
function snowLine(seed, y0) {
  const r = rng(seed);
  const pts = [];
  let y = y0;
  for (let x = 0; x <= W; x += 8) {
    y = y0 + (y - y0) * 0.6 + (r() - 0.45) * 22;
    pts.push([x, y + (r() < 0.12 ? r() * 40 : 0)]);
  }
  return [`0,0`, `${W},0`, ...pts.reverse().map(([x, yy]) => `${x},${yy.toFixed(1)}`)].join(" ");
}

const LAYERS = [
  {
    id: "far",
    pts: ridge({ seed: 11, base: 290, rough: 70, peaks: [[60, 120, 160], [230, 170, 210], [430, 140, 170], [600, 215, 240], [820, 160, 190], [980, 190, 200], [1210, 235, 260], [1400, 165, 180], [1560, 190, 200]] }),
    snow: snowLine(5, 168),
  },
  {
    id: "mid",
    pts: ridge({ seed: 23, base: 340, rough: 80, peaks: [[120, 140, 190], [340, 185, 220], [520, 120, 150], [760, 245, 260], [930, 150, 170], [1110, 175, 200], [1330, 205, 230], [1520, 140, 170]] }),
    snow: snowLine(9, 205),
  },
  {
    id: "near",
    pts: ridge({ seed: 37, base: 400, rough: 46, peaks: [[160, 85, 260], [480, 110, 280], [820, 70, 240], [1120, 120, 300], [1450, 90, 260]] }),
    snow: null,
  },
];

function Alps() {
  return (
    <svg className="alps-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" role="img" aria-label="Los Alpes">
      <defs>
        <linearGradient id="alps-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8161d" stopOpacity="0" />
          <stop offset="0.75" stopColor="#c8161d" stopOpacity="0.16" />
          <stop offset="1" stopColor="#c8161d" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="alps-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f87a2" />
          <stop offset="1" stopColor="#2f4b68" />
        </linearGradient>
        <linearGradient id="alps-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f5c7b" />
          <stop offset="1" stopColor="#1a3450" />
        </linearGradient>
        <linearGradient id="alps-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#173251" />
          <stop offset="1" stopColor="#0c1d31" />
        </linearGradient>
        <linearGradient id="alps-snowfill" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#e8eef5" />
          <stop offset="1" stopColor="#b9c7d6" />
        </linearGradient>
        {LAYERS.map((l) => (
          <clipPath key={l.id} id={`alps-clip-${l.id}`}>
            <polygon points={toPoly(l.pts)} />
          </clipPath>
        ))}
      </defs>
      <rect x="0" y="120" width={W} height="240" fill="url(#alps-glow)" />
      {LAYERS.map((l, i) => (
        <g key={l.id} className={`alps-layer alps-${l.id}`} style={{ "--d": `${i * 140}ms` }}>
          <polygon points={toPoly(l.pts)} fill={`url(#alps-${l.id})`} />
          {l.snow && (
            <g clipPath={`url(#alps-clip-${l.id})`}>
              <polygon points={l.snow} fill="url(#alps-snowfill)" className="alps-snowcap" />
              {/* cara en sombra de cada cumbre: la luz entra por la izquierda */}
              <polygon points={l.snow} fill="#0f2238" opacity="0.18" transform="translate(26 0)" />
            </g>
          )}
        </g>
      ))}
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
            <a href={config.shopUrl}>
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
      <details className="ft-credits">
        <summary>{f.creditsTitle}</summary>
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
      </details>
    </footer>
  );
}
