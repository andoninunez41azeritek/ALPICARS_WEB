import { notFound } from "next/navigation";
import config from "../../../content/config";
import products, { shop } from "../../../content/products";
import ShopPage from "../../../components/ShopPage";

// Una página por producto (se puede compartir y sale en Google con foto y precio)
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = products.find((x) => x.id === id);
  if (!p) return {};
  const title = `${p.name} · Tienda AlpiCars`;
  return {
    title: { absolute: title },
    description: `${p.short} ${shop.deliveryTime}. Envío a toda España.`.slice(0, 160),
    alternates: { canonical: `/tienda/${p.id}` },
    openGraph: { title, description: p.short, url: `/tienda/${p.id}`, type: "website", locale: "es_ES", images: p.image ? [{ url: p.image, width: 800, height: 800 }] : undefined },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const p = products.find((x) => x.id === id);
  if (!p) notFound();
  const url = `${config.siteUrl}/tienda/${p.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: p.name,
        description: p.text,
        image: (p.images || []).map((src) => `${config.siteUrl}${src}`),
        sku: p.id,
        brand: { "@type": "Brand", name: config.brand },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "EUR",
          price: p.price.toFixed(2),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${config.siteUrl}/#organizacion` },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "ES" },
            shippingRate: { "@type": "MonetaryAmount", value: (p.price >= shop.freeShippingFrom ? 0 : shop.shipping).toFixed(2), currency: "EUR" },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 2, unitCode: "DAY" },
              transitTime: { "@type": "QuantitativeValue", minValue: 7, maxValue: 15, unitCode: "DAY" },
            },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "ES",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 14,
            returnMethod: "https://schema.org/ReturnByMail",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Tienda", item: `${config.siteUrl}/tienda` },
          { "@type": "ListItem", position: 2, name: p.name, item: url },
        ],
      },
    ],
  };
  return (
    <>
      <ShopPage productId={p.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
