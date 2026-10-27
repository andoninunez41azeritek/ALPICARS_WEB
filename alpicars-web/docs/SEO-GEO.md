# Sistema SEO y GEO de AlpiCars

Objetivo: que AlpiCars aparezca en Google cuando alguien busque "importar coche de Alemania", "importar coche de Suiza",
"impuesto de matriculación coche importado", etc., y que ChatGPT, Gemini, Claude y Perplexity la citen.

## 1. Lo que ya está hecho en la web

| Pieza | Dónde |
|---|---|
| Títulos y descripciones para Google en cada página | `app/layout.js`, `app/guias/[slug]/page.js` |
| Datos estructurados: empresa, servicios con precios, preguntas frecuentes, artículos y migas de pan | `app/layout.js`, `components/Faq.jsx`, `components/GuidePage.jsx` |
| 4 guías que responden a las búsquedas principales, con la normativa de 2026 | `content/guides.js` → `/guias/...` |
| Mapa del sitio para Google | `app/sitemap.js` → `/sitemap.xml` |
| Permiso para los buscadores de IA | `app/robots.js` → `/robots.txt` |
| Resumen de la empresa para la IA | `public/llms.txt` |
| PDF compartibles con QR y enlaces medidos (`utm_source=pdf`) | `lib/pdf.js`, `lib/pdfBlocks.js` |

## 2. El día de la publicación (una sola vez)

1. **Dominio definitivo** en `content/config.js` (`siteUrl`). Sin esto, Google ve direcciones equivocadas.
2. **Google Search Console** (search.google.com/search-console): añadir el dominio, verificarlo con el registro DNS que pide
   y enviar `https://DOMINIO/sitemap.xml` en "Sitemaps".
3. **Bing Webmaster Tools** (bing.com/webmasters): importar el sitio desde Search Console. Bing alimenta a ChatGPT y Copilot.
4. **Perfil de empresa en Google** (business.google.com): categoría "Importador de automóviles" o "Agencia de vehículos",
   zona de servicio España, web, WhatsApp, horario y fotos reales. Pedir reseñas a los primeros clientes (reales, nunca inventadas).
5. **Redes**: crear Instagram, LinkedIn y YouTube de AlpiCars y poner sus enlaces en `sameAs` (`content/config.js`).
   Así Google y la IA saben que todo es la misma empresa.
6. **Analítica**: activar Vercel Analytics o Google Analytics 4 (con el banner de cookies si se usa GA4).

## 3. Cada mes (trabajo de la cuota de SEO y GEO)

- **Search Console → Rendimiento**: ver por qué búsquedas aparece la web y en qué posición. Si una búsqueda sale en la
  página 2, mejorar la guía que la trata (más detalle, ejemplos, tablas).
- **Una guía nueva al mes** en `content/guides.js`. Ideas por orden de interés:
  - Coches más rentables de importar desde Alemania (por modelo).
  - Importar un coche eléctrico o híbrido enchufable (0 % de impuesto de matriculación).
  - Importar un coche de Alemania a Barcelona / Valencia / Sevilla (tipos de cada comunidad).
  - ITV de importación: qué piden y cuánto cuesta.
  - Comprar un coche en Suiza: dónde buscar y qué revisar.
- **Prueba de IA**: preguntar en ChatGPT, Gemini y Perplexity "¿cómo importo un coche de Alemania a España?" y
  "¿qué empresa me trae un coche de Suiza?" y anotar si citan a AlpiCars.
- **Actualizar cifras**: cada enero cambian las tablas de Hacienda y a veces las tasas. Revisar `lib/calc.js`,
  `content/guides.js` y `public/llms.txt`, y cambiar la fecha `updated` de las guías.
- **Informe** al cliente con: solicitudes de presupuesto, uso de la calculadora y el test, PDF descargados
  (visitas con `utm_source=pdf`), posiciones en Google y menciones en IA.

## 4. Reglas para que funcione

- Respuesta directa en las primeras líneas de cada guía (es lo que copian Google y la IA).
- Cifras concretas con su fuente y su fecha.
- Nada inventado: ni reseñas, ni clientes, ni cifras sin fuente.


## 5. Estrategia (octubre de 2026)

Hecha con las skills `seo`, `seo-plan`, `keyword-research`, `serp-analysis`, `competitor-analysis`, `geo-content-optimizer` y `seo-programmatic`.
Sin herramienta de volúmenes conectada: las prioridades son **estimadas** a partir de lo que hoy muestra Google, no cifras medidas.

### Qué hay hoy en Google

- Las búsquedas informativas ("importar coche de Alemania", "comprar coche en Alemania") las ocupan medios y portales: RACE, Motorpasión, Autohero, carwow, Mapfre, coches.com.
- Competidores directos que salen: Radikal Cars, Nettcars y XLcars (Alemania). En "importar coche de Suiza" casi no hay agencias: salen empresas de transporte y páginas de aduanas. **Es el hueco más claro para AlpiCars.**
- Hay artículos sobre los problemas de importar ("pesadilla", "lotería"): la gente busca seguridad. AlpiCars responde con revisión en origen y presupuesto cerrado.

### Mapa de búsquedas → página

| Búsqueda | Intención | Página |
|---|---|---|
| importar coche de Alemania / traer coche de Alemania | Informativa + comercial | /guias/importar-coche-alemania |
| importar coche de Suiza / comprar coche en Suiza | Informativa + comercial (poca competencia) | /guias/importar-coche-suiza |
| impuesto de matriculación coche importado / tabla de Hacienda | Informativa | /guias/impuesto-matriculacion-coche-importado |
| cuánto cuesta importar un coche / merece la pena | Comercial | /guias/cuanto-cuesta-importar-un-coche + calculadora |
| riesgos / problemas importar coche Alemania | Informativa (miedo) | /guias/riesgos-comprar-coche-alemania |
| dónde comprar coche en Alemania / mobile.de | Informativa | /guias/donde-buscar-coche-alemania-suiza |
| comprar coche en Suiza / coches de Suiza | Informativa + comercial (poca competencia) | /guias/comprar-coche-en-suiza |
| importar coche Alemania a Madrid / Barcelona / … | Local | /importar-coche/[ciudad] |
| empresa importación coches Alemania Suiza | Transaccional | Inicio |

### Próximos contenidos (por orden)

1. ~~Comprar un coche en Suiza~~ hecho: /guias/comprar-coche-en-suiza.
2. Importar un coche eléctrico o híbrido enchufable (0 % de impuesto de matriculación).
3. Páginas por modelo solo cuando haya datos reales de AlpiCars (precios de coches traídos, fotos propias), para no crear páginas vacías.
4. Casos reales de clientes, con su permiso, en cuanto existan (refuerzan la experiencia, la E de E-E-A-T).

### Fuera de la web (GEO)

- Ficha de empresa en Google, perfiles en Instagram, LinkedIn y YouTube con el mismo nombre y descripción, y enlaces en `sameAs`.
- Responder con nombre propio en foros donde se pregunta por importar coches (por ejemplo bmwfaq o forocoches), sin spam: la IA cita mucho esos foros.
- Vídeos cortos de revisiones en origen (YouTube e Instagram), enlazando a las guías.
