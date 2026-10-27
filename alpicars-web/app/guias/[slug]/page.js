import { notFound } from "next/navigation";
import guides from "../../../content/guides";
import GuidePage from "../../../components/GuidePage";

// Una página por guía, generada al publicar la web (rápida y fácil de leer para Google)
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) return {};
  return {
    title: { absolute: g.metaTitle },
    description: g.description,
    alternates: { canonical: `/guias/${g.slug}` },
    openGraph: { title: g.metaTitle, description: g.description, url: `/guias/${g.slug}`, type: "article", locale: "es_ES" },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!guides.some((g) => g.slug === slug)) notFound();
  return <GuidePage slug={slug} />;
}
