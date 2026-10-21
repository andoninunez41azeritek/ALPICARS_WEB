# AlpiCars · Web

Web de AlpiCars (importación de coches desde Suiza y Alemania a España). Proyecto de cliente de Azeritek.

Hecha con **Next.js** (App Router) y CSS propio, sin librerías de componentes. Todos los textos están en `content/es.js`.

## Arrancar en tu ordenador

Necesitas Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Dónde se cambia cada cosa

| Quiero cambiar… | Archivo |
| --- | --- |
| Textos, servicios, precios, FAQ, test | `content/es.js` |
| WhatsApp, email, enlace de la tienda, cambio EUR/CHF | `content/config.js` |
| Fotos | `content/photos.js` (y las fotos nuevas en `public/img/`) |
| Colores, tamaños, espaciados | `app/globals.css` (variables al principio) |
| Título y descripción para Google | `app/layout.js` |
| Ciudades y rutas del mapa | `scripts/build-map.mjs` y luego `npm run map` |
| Cifras de la calculadora de ahorro | `content/config.js` (`calculator`) y `components/Calculator.jsx` |
| Textos para buscadores de IA | `public/llms.txt` |

## Estructura

```
app/            páginas (inicio, aviso legal, privacidad, cookies)
components/     cada bloque de la web (cabecera, banner, mapa, servicios…)
content/        textos y configuración
lib/mapData.js  mapa de Europa ya proyectado (generado)
public/         logos e imágenes
.claude/skills  skills de diseño, conversión y SEO para Claude Code
```

## Cómo trabajamos los dos (GitHub)

1. Nadie toca `main` directamente. Cada uno trabaja en su rama: `git checkout -b andoni/nombre-tarea`.
2. Al terminar: `git push` y abrir un Pull Request para que el otro lo revise.
3. Las claves (Supabase, etc.) van en `.env.local`, que nunca se sube. Mirad `.env.example`.

## Pendiente antes de publicar

- [ ] Número de WhatsApp, email y enlace de Shopify reales (`content/config.js`)
- [ ] Fotos propias de AlpiCars en lugar de las de ambiente (`content/photos.js`)
- [ ] Precio del servicio Empresas y flotas
- [ ] Textos legales: aviso legal, privacidad y cookies (+ banner de cookies si se usa analítica)
- [ ] Dominio definitivo (`app/layout.js`)
- [ ] Revisar con AlpiCars la lógica de recomendación del test (`components/CarQuiz.jsx`)
- [ ] Confirmar las cifras de la calculadora: gastos de viaje por km, tasas DGT/ITV (`content/config.js`)
- [ ] Perfiles en redes y Google Business para `sameAs` (SEO y GEO)
- [ ] Dar de alta la web en Google Search Console y Bing Webmaster Tools y enviar el sitemap

## Fase 2

- Login, registro y perfil de cliente con Supabase (`components/LoginDialog.jsx`)
- Guardar las solicitudes de presupuesto en Supabase y avisar al equipo (`components/LeadForm.jsx`)
- Traducciones: EN, DE, EU, IT, FR (copiar `content/es.js` y traducir)
- Asistente de IA
