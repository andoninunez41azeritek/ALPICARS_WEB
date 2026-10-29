"use client";

import { useEffect, useState } from "react";
import config from "../content/config";
import { cookieBanner as t } from "../content/legal";

// Aviso de cookies (texto de AlpiCars) y carga de Google Analytics / píxel de Meta solo con permiso.
//
// - La elección se guarda 1 año en la cookie "cookie_consent" (como indica la política de cookies).
// - El aviso solo aparece si hay alguna herramienta opcional activada en content/config.js (analytics).
//   Sin ellas la web solo usa cookies necesarias, que no requieren permiso.
// - El enlace "Configurar cookies" del pie (y de la política) lo abre siempre: openCookieSettings().

const COOKIE = "cookie_consent";
const EVENT = "alpicars:cookies";
const YEAR = 60 * 60 * 24 * 365;

export function openCookieSettings() {
  window.dispatchEvent(new Event(EVENT));
}

function readConsent() {
  try {
    const raw = document.cookie.split("; ").find((x) => x.startsWith(`${COOKIE}=`));
    if (!raw) return null;
    const v = JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1)));
    return typeof v === "object" && v ? v : null;
  } catch {
    return null;
  }
}

function writeConsent(c) {
  const v = encodeURIComponent(JSON.stringify({ analytics: !!c.analytics, marketing: !!c.marketing, date: new Date().toISOString().slice(0, 10) }));
  document.cookie = `${COOKIE}=${v}; Max-Age=${YEAR}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

let loaded = { ga: false, meta: false };

function loadTools(c) {
  const { ga4, metaPixel } = config.analytics || {};
  if (c.analytics && ga4 && !loaded.ga) {
    loaded.ga = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", ga4, { anonymize_ip: true });
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`;
    document.head.appendChild(s);
  }
  if (c.marketing && metaPixel && !loaded.meta) {
    loaded.meta = true;
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq("init", metaPixel);
    window.fbq("track", "PageView");
  }
}

const hasOptional = () => Boolean(config.analytics?.ga4 || config.analytics?.metaPixel);

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(false);
  const [choice, setChoice] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    const c = readConsent();
    if (c) {
      setChoice({ analytics: !!c.analytics, marketing: !!c.marketing });
      loadTools(c);
    } else if (hasOptional()) {
      setOpen(true);
    }
    const show = () => {
      const now = readConsent();
      if (now) setChoice({ analytics: !!now.analytics, marketing: !!now.marketing });
      setDetail(true);
      setOpen(true);
    };
    window.addEventListener(EVENT, show);
    return () => window.removeEventListener(EVENT, show);
  }, []);

  const save = (c) => {
    writeConsent(c);
    setChoice(c);
    setOpen(false);
    setDetail(false);
    loadTools(c);
    // Quitar una herramienta ya cargada requiere recargar la página
    if ((loaded.ga && !c.analytics) || (loaded.meta && !c.marketing)) window.location.reload();
  };

  if (!open) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title">
      <h2 id="cookie-title">{t.title}</h2>
      <p>
        {t.text}{" "}
        <a href="/cookies">{t.more}</a>.
      </p>

      {detail && (
        <ul className="cookie-cats">
          {t.categories.map((cat) => (
            <li key={cat.id}>
              <label>
                <input
                  type="checkbox"
                  checked={cat.locked ? true : !!choice[cat.id]}
                  disabled={cat.locked}
                  onChange={(e) => setChoice((c) => ({ ...c, [cat.id]: e.target.checked }))}
                />
                <span>
                  <strong>{cat.label}</strong>
                  {cat.locked && <em> · siempre activas</em>}
                  <small>{cat.text}</small>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className="cookie-actions">
        <button type="button" className="btn btn-accent btn-small" onClick={() => save({ analytics: true, marketing: true })}>
          {t.accept}
        </button>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => save({ analytics: false, marketing: false })}>
          {t.reject}
        </button>
        {detail ? (
          <button type="button" className="btn btn-ghost btn-small" onClick={() => save(choice)}>
            {t.save}
          </button>
        ) : (
          <button type="button" className="link-btn" onClick={() => setDetail(true)}>
            {t.configure}
          </button>
        )}
      </div>
    </div>
  );
}
