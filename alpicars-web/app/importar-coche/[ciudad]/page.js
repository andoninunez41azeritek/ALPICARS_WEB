import { notFound } from "next/navigation";
import cities from "../../../content/cities";
import CityPage from "../../../components/CityPage";

export function generateStaticParams() {
  return cities.map((c) => ({ ciudad: c.slug }));
}

export async function generateMetadata({ params }) {
  const { ciudad } = await params;
  const c = cities.find((x) => x.slug === ciudad);
  if (!c) return {};
  const title = `Importar coche de Alemania o Suiza a ${c.name}`;
  const description = `Te traemos el coche de Alemania o Suiza a ${c.name}, revisado y matriculado. Impuesto de matriculación de ${c.region}, distancia y ejemplo de coste real.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/importar-coche/${c.slug}` },
    openGraph: { title, description, url: `/importar-coche/${c.slug}`, locale: "es_ES", type: "website" },
  };
}

export default async function Page({ params }) {
  const { ciudad } = await params;
  if (!cities.some((c) => c.slug === ciudad)) notFound();
  return <CityPage slug={ciudad} />;
}
