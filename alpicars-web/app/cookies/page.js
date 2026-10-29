import LegalDoc from "../../components/LegalDoc";
import { cookies } from "../../content/legal";

// Texto en content/legal.js
export const metadata = {
  title: "Política de cookies",
  description: "Qué cookies usa la web de AlpiCars y cómo configurarlas.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegalDoc doc={cookies} />;
}
