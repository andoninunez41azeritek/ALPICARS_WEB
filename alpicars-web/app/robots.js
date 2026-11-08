import config from "../content/config";

// robots.txt: dejamos entrar a Google y a los buscadores de IA para que puedan citar la web
// Las zonas privadas quedan fuera también para los buscadores de IA (cada grupo de robots se lee por separado)
const privado = ["/panel", "/cuenta", "/api/", "/tienda/gracias", "/seguimiento"];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privado },
      { userAgent: ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot"], allow: "/", disallow: privado },
    ],
    sitemap: `${config.siteUrl}/sitemap.xml`,
    host: config.siteUrl,
  };
}
