import LegalDoc from "../../components/LegalDoc";
import { condicionesServicio } from "../../content/legal";

// Texto en content/legal.js
export const metadata = {
  title: "Condiciones del servicio de importación",
  description: "Términos y condiciones del servicio de importación de vehículos de AlpiCars.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegalDoc doc={condicionesServicio} />;
}
