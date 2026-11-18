import LegalDoc from "../../components/LegalDoc";
import { avisoLegal } from "../../content/legal";

// Texto en content/legal.js
export const metadata = {
  title: "Aviso legal",
  description: "Aviso legal de AlpiCars: titulares de la web, datos de contacto, condiciones de uso y propiedad intelectual del sitio alpicars.com.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegalDoc doc={avisoLegal} />;
}
