import config from "../content/config";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${config.siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${config.siteUrl}/aviso-legal`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${config.siteUrl}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${config.siteUrl}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
