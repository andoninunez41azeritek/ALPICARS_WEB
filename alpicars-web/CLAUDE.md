# AlpiCars · contexto para Claude Code

Proyecto de cliente de Azeritek: web de AlpiCars, agencia que importa coches desde Suiza y Alemania a España.
Objetivo de la web: convertir visitas en solicitudes de presupuesto (leads) transmitiendo confianza y transparencia.

## Reglas del proyecto

- Next.js App Router, JavaScript (sin TypeScript), CSS propio en `app/globals.css`. No añadir Tailwind ni librerías de UI sin acordarlo.
- Todos los textos visibles viven en `content/es.js`; nunca escribir textos sueltos dentro de los componentes.
- Colores de marca (los del PDF del cliente): azul oscuro #0F2238 como fondo, rojo de marca suavizado #C8161D (el del PDF era #E60000), blanco #FFFFFF, gris nieve #F4F6F9. El rojo se reserva para la acción principal, la ruta y el coche.
- Estilo: tema oscuro inspirado en astraautomations.es: mapa fijo de fondo, paneles translúcidos, menú tipo píldora, botones redondeados. Sin emojis ni testimonios inventados.
- El mapa de fondo (`components/MapBackdrop.jsx`) es la seña de identidad: el coche baja de Alemania/Suiza a España con el scroll y llega al llegar a `#presupuesto`.
- SEO y GEO: todo el texto importante debe estar en el HTML (no solo en JavaScript), con respuestas directas, precios concretos y fechas de actualización. Mantener al día `public/llms.txt` si cambian precios o servicios.
- Inicio centrado: eslogan grande en el centro, los tres bloques (servicios, test, tienda) en el centro y translúcidos; el mapa queda de fondo, atenuado. El pie tiene los Alpes formados por las letras de ALPICARS.
- Resultado del test (`/test/resultado`) e informe de la calculadora (`/calculadora/informe`) son páginas aparte, imprimibles a PDF (`@media print`) y compartibles; tras descargar sale `OfferDialog`.
- Tienda propia en `/tienda` (Stripe Checkout por la API REST, sin librería; pedidos a mano en AliExpress). Los precios se leen siempre en el servidor desde `content/products.js`.
- PDF con `pdf-lib` en el navegador (`lib/pdf.js`, carga diferida). Calculadora con normativa 2026 en `lib/calc.js`. Guías SEO/GEO en `content/guides.js`.
- Animaciones solo con transform y opacity, siempre con alternativa para `prefers-reduced-motion`.
- No inventar testimonios, reseñas, cifras de clientes ni logos.
- El usuario no programa: entregar siempre archivos completos y explicar los pasos en español.

## Skills

En `.claude/skills` están las skills del proyecto. Usar `design-taste-frontend` y `web-design-guidelines` para diseño,
`cro`, `copywriting` y `signup` para conversión, `supabase` para la fase 2.
SEO: `seo` (auditoría completa), `seo-technical`, `seo-page`, `seo-content`, `seo-schema`, `seo-sitemap`, `seo-local`, `seo-hreflang` (para los 6 idiomas), `seo-audit`, `schema`.
GEO (aparecer en ChatGPT, Gemini, Claude, Perplexity): `geo`, `seo-geo`, `geo-citability`, `geo-crawlers`, `geo-llmstxt`, `geo-platform-optimizer`, `ai-seo`.
Diseño de primer nivel: `impeccable` (diseñar, criticar y pulir), `ui-ux-pro-max` (sistema de diseño y UX), `apple-design` y `emil-design-eng` (acabado tipo Apple/Linear).
Animación: `animate`, `improve-animations`, `review-animations`, `find-animation-opportunities`, `animation-performance`, `react-view-transitions`.
Next.js y Vercel: `react-best-practices`, `composition-patterns`, `vercel-optimize`, `deploy-to-vercel`.
Crecimiento y viralidad: `referrals` (programa de referidos), `marketing-loops`, `social`, `launch`, `free-tools` (calculadora y test como imán), `programmatic-seo` (páginas por modelo y ciudad).
Conversión e ingresos: `popups`, `offers`, `pricing`, `onboarding`, `emails` (secuencias para registrados), `ab-testing`, `conversion-tracking`.
SEO y GEO profesional (usar como consultor): empezar por `seo` (orquestador) y `seo-plan`; investigación con `keyword-research`, `serp-analysis`, `competitor-analysis`, `content-gap-analysis`; contenido con `content-writer`, `geo-content-optimizer`, `page-play-builder`, `serp-markup-builder`; revisión con `on-page-seo-checker`, `technical-seo-checker`, `content-quality-auditor`, `site-structure-optimizer`; seguimiento con `rank-tracker`, `performance-monitor`, `offsite-signal-analyzer`, `domain-authority-auditor`. Estrategia y mapa de búsquedas en `docs/SEO-GEO.md`.

