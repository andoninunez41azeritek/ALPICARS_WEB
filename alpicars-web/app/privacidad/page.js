import LegalDoc from "../../components/LegalDoc";
import { privacidad } from "../../content/legal";

// Texto en content/legal.js
export const metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de AlpiCars: qué datos personales tratamos, para qué, durante cuánto tiempo y cómo ejercer tus derechos.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegalDoc doc={privacidad} />;
}
