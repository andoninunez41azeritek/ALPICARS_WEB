import LegalDoc from "../../components/LegalDoc";
import { avisoLegal } from "../../content/legal";

// Texto en content/legal.js
export const metadata = {
  title: "Aviso legal",
  description: "Titulares, contacto y condiciones de uso de la web de AlpiCars.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegalDoc doc={avisoLegal} />;
}
