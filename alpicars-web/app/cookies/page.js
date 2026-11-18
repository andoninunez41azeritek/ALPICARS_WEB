import LegalDoc from "../../components/LegalDoc";
import { cookies } from "../../content/legal";

// Texto en content/legal.js
export const metadata = {
  title: "Política de cookies",
  description: "Política de cookies de AlpiCars: qué cookies usa la web, para qué sirven y cómo aceptarlas, rechazarlas o configurarlas.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegalDoc doc={cookies} />;
}
