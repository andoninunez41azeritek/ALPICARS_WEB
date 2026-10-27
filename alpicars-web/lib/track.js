// Medición de conversiones (skill conversion-tracking).
// track("evento", { datos }) envía el evento a las herramientas que haya instaladas en la web:
//  - Google Tag Manager / Google Analytics 4 (window.dataLayer)
//  - Vercel Analytics (window.va)
// Si no hay ninguna instalada, no hace nada. Así se puede medir sin cambiar los componentes.
//
// Eventos que se envían:
//   quiz_start, quiz_complete          test "¿Qué coche es para ti?"
//   calc_report                        abrir el informe de la calculadora
//   pdf_download, pdf_share            descargar o enviar un PDF
//   share_click {channel}              compartir enlace (whatsapp, telegram, copy, native)
//   lead_submit {service}              solicitud de presupuesto (conversión principal)
//   offer_submit {source}              registro tras descargar el PDF
//   whatsapp_click {place}             clic en WhatsApp
//   shop_add {id}, checkout_start      tienda
//   nudge_view, nudge_click            aviso del test al bajar por la página

const ORIGIN_KEY = "alpicars-origin";
const REF_KEY = "alpicars-ref";

export function track(event, props = {}) {
  if (typeof window === "undefined") return;
  const data = { ...props, ...origin() };
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  } catch {
    /* sin dataLayer */
  }
  try {
    if (typeof window.va === "function") window.va("event", { name: event, data });
  } catch {
    /* sin Vercel Analytics */
  }
}

// Guarda de dónde llegó la visita (utm, PDF compartido, recomendación) para saberlo en cada solicitud
export function rememberOrigin() {
  if (typeof window === "undefined") return;
  try {
    const p = new URLSearchParams(window.location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign"].map((k) => p.get(k)).filter(Boolean).join(" / ");
    const ref = p.get("ref");
    if (utm && !sessionStorage.getItem(ORIGIN_KEY)) sessionStorage.setItem(ORIGIN_KEY, utm);
    if (ref && /^[a-z0-9]{4,12}$/i.test(ref)) localStorage.setItem(REF_KEY, ref);
    if (!sessionStorage.getItem(ORIGIN_KEY) && document.referrer && !document.referrer.includes(window.location.host)) {
      sessionStorage.setItem(ORIGIN_KEY, new URL(document.referrer).hostname);
    }
  } catch {
    /* sin almacenamiento */
  }
}

export function origin() {
  try {
    return {
      origen: sessionStorage.getItem(ORIGIN_KEY) || "directo",
      ...(localStorage.getItem(REF_KEY) ? { recomendado_por: localStorage.getItem(REF_KEY) } : {}),
    };
  } catch {
    return { origen: "directo" };
  }
}

// Texto para añadir al final de los correos de solicitud
export function originLines() {
  const o = origin();
  return [`Origen de la visita: ${o.origen}`, ...(o.recomendado_por ? [`Recomendado por el código: ${o.recomendado_por}`] : [])];
}

// Código personal para recomendar la web (programa de referidos)
export function myRefCode() {
  try {
    let code = localStorage.getItem("alpicars-my-ref");
    if (!code) {
      code = Math.random().toString(36).slice(2, 8);
      localStorage.setItem("alpicars-my-ref", code);
    }
    return code;
  } catch {
    return "";
  }
}
