import LegalDoc from "../../components/LegalDoc";
import { privacidad } from "../../content/legal";

// Texto en content/legal.js
export const metadata = {
  title: "Política de privacidad",
  description: "Cómo trata AlpiCars tus datos personales y cómo ejercer tus derechos.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegalDoc doc={privacidad} />;
}
