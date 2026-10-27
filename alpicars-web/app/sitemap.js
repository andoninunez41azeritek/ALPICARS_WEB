import config from "../content/config";
import guides, { updatedIso } from "../content/guides";
import cities from "../content/cities";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${config.siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${config.siteUrl}/guias`, lastModified: new Date(updatedIso), changeFrequency: "monthly", priority: 0.8 },
    ...guides.map((g) => ({ url: `${config.siteUrl}/guias/${g.slug}`, lastModified: new Date(updatedIso), changeFrequency: "monthly", priority: 0.8 })),
    { url: `${config.siteUrl}/importar-coche`, lastModified: new Date(updatedIso), changeFrequency: "monthly", priority: 0.7 },
    ...cities.map((c) => ({ url: `${config.siteUrl}/importar-coche/${c.slug}`, lastModified: new Date(updatedIso), changeFrequency: "monthly", priority: 0.7 })),
    { url: `${config.siteUrl}/tienda`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${config.siteUrl}/aviso-legal`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${config.siteUrl}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${config.siteUrl}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
