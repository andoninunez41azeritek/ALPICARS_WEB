import CityPage from "../../components/CityPage";

export const metadata = {
  title: "Importar un coche de Alemania o Suiza a tu ciudad",
  description: "Entrega del coche matriculado en Madrid, Barcelona, Bilbao, Valencia, Sevilla y Málaga: distancia, impuesto de matriculación de cada comunidad y ejemplo de coste.",
  alternates: { canonical: "/importar-coche" },
};

export default function Page() {
  return <CityPage />;
}
