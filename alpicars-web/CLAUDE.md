# AlpiCars · contexto para Claude Code

Proyecto de cliente de Azeritek: web de AlpiCars, agencia que importa coches desde Suiza y Alemania a España.
Objetivo de la web: convertir visitas en solicitudes de presupuesto (leads) transmitiendo confianza y transparencia.

## Reglas del proyecto

- Next.js App Router, JavaScript (sin TypeScript), CSS propio en `app/globals.css`. No añadir Tailwind ni librerías de UI sin acordarlo.
- Todos los textos visibles viven en `content/es.js`; nunca escribir textos sueltos dentro de los componentes.
- Colores de marca (los del PDF del cliente): azul oscuro #0F2238 como fondo, rojo suizo #E60000, blanco #FFFFFF, gris nieve #F4F6F9. El rojo se reserva para la acción principal, la ruta y el coche.
- Estilo: tema oscuro inspirado en astraautomations.es: mapa fijo de fondo, paneles translúcidos, menú tipo píldora, botones redondeados. Sin emojis ni testimonios inventados.
- El mapa de fondo (`components/MapBackdrop.jsx`) es la seña de identidad: el coche baja de Alemania/Suiza a España con el scroll y llega al llegar a `#presupuesto`.
- SEO y GEO: todo el texto importante debe estar en el HTML (no solo en JavaScript), con respuestas directas, precios concretos y fechas de actualización. Mantener al día `public/llms.txt` si cambian precios o servicios.
- Animaciones solo con transform y opacity, siempre con alternativa para `prefers-reduced-motion`.
- No inventar testimonios, reseñas, cifras de clientes ni logos.
- El usuario no programa: entregar siempre archivos completos y explicar los pasos en español.

## Skills

En `.claude/skills` están las skills del proyecto. Usar `design-taste-frontend` y `web-design-guidelines` para diseño,
`cro`, `copywriting` y `signup` para conversión, `supabase` para la fase 2.
SEO: `seo` (auditoría completa), `seo-technical`, `seo-page`, `seo-content`, `seo-schema`, `seo-sitemap`, `seo-local`, `seo-hreflang` (para los 6 idiomas), `seo-audit`, `schema`.
GEO (aparecer en ChatGPT, Gemini, Claude, Perplexity): `geo`, `seo-geo`, `geo-citability`, `geo-crawlers`, `geo-llmstxt`, `geo-platform-optimizer`, `ai-seo`.
