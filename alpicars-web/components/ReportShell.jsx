"use client";

import config from "../content/config";
import { SiteProvider, useSite } from "./SiteProvider";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import CarQuiz from "./CarQuiz";
import Motion from "./Motion";

// Estructura común de las páginas de informe (resultado del test e informe de la calculadora).
// Incluye una cabecera y un pie "de documento" que solo se ven al guardar en PDF,
// para que el PDF compartido lleve siempre el contacto de AlpiCars.

export function DocBrand() {
  const { t } = useSite();
  return (
    <div className="doc-brand print-only">
      <img src="/logo-horizontal.png" alt="AlpiCars" width="945" height="172" />
      <span>{t.marquee}</span>
    </div>
  );
}

export function DocContact() {
  const { t } = useSite();
  const site = config.siteUrl.replace(/^https?:\/\//, "");
  return (
    <div className="doc-contact print-only">
      <strong>AlpiCars</strong> · {t.hero.title} · {site} · {config.email} · WhatsApp +{config.whatsappNumber}
    </div>
  );
}

export default function ReportShell({ children }) {
  return (
    <SiteProvider>
      <div className="report-bg" aria-hidden="true" />
      <Header />
      <main id="contenido" className="report">
        <DocBrand />
        {children}
        <DocContact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <CarQuiz />
      <Motion />
    </SiteProvider>
  );
}
