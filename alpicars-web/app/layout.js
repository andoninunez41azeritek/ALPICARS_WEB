import { Libre_Franklin } from "next/font/google";
import config from "../content/config";
import es from "../content/es";
import "./globals.css";
import CookieBanner from "../components/CookieBanner";

const franklin = Libre_Franklin({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-franklin", display: "swap" });

const siteUrl = config.siteUrl;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Importar coche de Suiza y Alemania a España | AlpiCars",
    template: "%s | AlpiCars",
  },
  description:
    "Importamos tu coche de Suiza y Alemania: lo buscamos, lo revisamos en origen y te lo entregamos matriculado en España. Presupuesto cerrado desde 230 €.",
  keywords: [
    "importar coche de Alemania",
    "importar coche de Suiza",
    "importación de coches a España",
    "coche de importación llave en mano",
    "matricular coche importado",
    "comprar coche en Alemania",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "AlpiCars · Tu coche de Suiza y Alemania, matriculado en España",
    description: "Lo buscamos, lo revisamos en origen y te lo llevamos conduciendo hasta tu puerta. Presupuesto cerrado desde el primer día.",
    url: siteUrl,
    siteName: "AlpiCars",
    locale: "es_ES",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AlpiCars · Ingeniería alemana, precisión suiza, garaje español" }],
  },
  twitter: { card: "summary_large_image", title: "AlpiCars · Importación de coches desde Suiza y Alemania", images: ["/og.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: "/logo-mark.png", apple: "/logo-mark.png" },
};

export const viewport = { themeColor: "#0F2238", colorScheme: "dark" };

// Datos estructurados: quién es AlpiCars, qué servicios ofrece y a qué precio.
// Ayudan a Google y a los asistentes de IA (ChatGPT, Gemini, Claude, Perplexity) a entender y citar la web.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organizacion`,
      name: "AlpiCars",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      slogan: config.slogan,
      description: es.about.lead,
      email: config.email,
      knowsLanguage: ["es", "de", "en"],
      sameAs: config.sameAs,
      foundingLocation: { "@type": "Country", name: "Suiza" },
      areaServed: [
        { "@type": "Country", name: "España" },
        ...["Madrid", "Barcelona", "Bilbao", "Valencia", "Sevilla", "Málaga"].map((name) => ({ "@type": "City", name })),
      ],
      knowsAbout: [
        "Importación de coches desde Alemania",
        "Importación de coches desde Suiza",
        "Impuesto de matriculación de coches importados",
        "Inspección de coches de ocasión",
        "Matriculación de vehículos importados en España",
      ],
      contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: config.email, availableLanguage: ["es", "de"] },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#web`,
      url: siteUrl,
      name: "AlpiCars",
      inLanguage: "es-ES",
      publisher: { "@id": `${siteUrl}/#organizacion` },
    },
    ...es.services.plans.map((p) => ({
      "@type": "Service",
      name: `${p.name} · importación de coches desde Suiza y Alemania`,
      description: p.text,
      serviceType: "Importación de vehículos",
      provider: { "@id": `${siteUrl}/#organizacion` },
      areaServed: { "@type": "Country", name: "España" },
      ...(p.price != null
        ? { offers: { "@type": "Offer", price: p.price, priceCurrency: "EUR", url: `${siteUrl}/#servicios` } }
        : {}),
    })),
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={franklin.variable}>
      <body>
        {children}
        <CookieBanner />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
