import config from "../content/config";

// Bloque final de los PDF: contactar por WhatsApp, pedir presupuesto y un QR para que quien reciba el PDF
// haga su propio test o cálculo (así cada PDF compartido trae visitas nuevas a la web).
export function contactBlock(c, kind, waMessage) {
  const origin = typeof window !== "undefined" ? window.location.origin : config.siteUrl;
  const qr = kind === "test" ? `${origin}/?utm_source=pdf&utm_medium=compartido&utm_campaign=test#test` : `${origin}/?utm_source=pdf&utm_medium=compartido&utm_campaign=calculadora#calculadora`;
  return {
    type: "contact",
    title: c.title,
    text: c.text,
    wa: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(waMessage)}`,
    waText: c.wa,
    site: `${origin}/?utm_source=pdf&utm_medium=compartido#presupuesto`,
    siteText: c.site,
    share: kind === "test" ? c.shareTest : c.shareCalc,
    qr,
    qrCaption: kind === "test" ? c.qrTest : c.qrCalc,
  };
}
