import config from "../content/config";

// robots.txt: dejamos entrar a Google y a los buscadores de IA para que puedan citar la web
export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot"], allow: "/" },
    ],
    sitemap: `${config.siteUrl}/sitemap.xml`,
    host: config.siteUrl,
  };
}
