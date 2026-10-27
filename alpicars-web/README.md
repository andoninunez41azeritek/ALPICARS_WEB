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
app/            páginas (inicio, aviso legal, privacidad, cookies,
                test/resultado = resultado del test, calculadora/informe = informe de costes)
components/     cada bloque de la web (cabecera, banner, mapa, servicios…)
content/        textos y configuración
lib/mapData.js  mapa de Europa ya proyectado (generado)
lib/calc.js     cálculo de la calculadora (lo usan la calculadora y su informe)
lib/recommend.js lógica de recomendación del test
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
- [ ] Revisar con AlpiCars la lógica de recomendación del test (`lib/recommend.js`)
- [ ] Definir la oferta real que sale tras descargar el PDF (`content/es.js`, objeto `offer`)
- [ ] Confirmar las cifras de la calculadora: gastos de viaje por km, tasas DGT/ITV (`content/config.js`)
- [ ] Perfiles en redes y Google Business para `sameAs` (SEO y GEO)
- [ ] Dar de alta la web en Google Search Console y Bing Webmaster Tools y enviar el sitemap

## Instalar después de actualizar

Esta versión usa la librería `pdf-lib` para crear los PDF. Después de copiar los cambios, una vez:

```
npm.cmd install
```

## Cuentas de cliente y panel (Supabase: proyecto ALPICARS-WEB, Zúrich)

- Claves en `.env.local` (no se sube a GitHub). En Vercel hay que añadir las mismas dos variables `NEXT_PUBLIC_SUPABASE_...`.
- `/cuenta`: área del cliente con ofertas exclusivas, enlace para recomendar, informes guardados, solicitudes y sus datos.
- `/panel`: panel del equipo con todas las solicitudes (estado y notas) y las ofertas para registrados. Solo entra quien esté en la tabla `staff`.
- Las solicitudes de presupuesto y los registros se guardan en la base de datos (tabla `leads`). Si la base de datos no responde, se abre el correo como antes.
- Antes de publicar: en Supabase → Authentication → URL Configuration, poner el dominio como "Site URL" y añadir `http://localhost:3000/**` en "Redirect URLs".
- Antes de publicar: configurar un SMTP propio (por ejemplo Resend) en Authentication → Emails. El correo de Supabase por defecto solo envía a los miembros del equipo y con un límite muy bajo.

## Tienda (`/tienda`)

- Productos en `content/products.js` (precios, textos, fotos y enlace del proveedor de AliExpress).
- Pago con Stripe: poner `STRIPE_SECRET_KEY` en `.env.local` (ver `.env.example`). Sin clave, la tienda se ve pero avisa de que abre pronto.
- **Pedidos y envíos:** cada pago completado crea el pedido en Supabase (webhook `app/api/stripe/webhook`). El equipo lo gestiona en `/panel` → "Pedidos de la tienda": compra en AliExpress con un clic, guarda el nº de pedido y el nº de seguimiento y marca el estado (recibido → en preparación → enviado → entregado / incidencia).
- **Emails automáticos** (función `order-email` de Supabase + Resend): confirmación al cliente y aviso al equipo al pagar; email con el enlace de seguimiento al marcar "Enviado"; avisos de entregado e incidencia.
- **Seguimiento para el cliente:** `/seguimiento` con el código del pedido (AC-…) y su email; enlace al paquete en 17TRACK. Los clientes registrados ven sus pedidos en `/cuenta`.
- Para activarlo: en Stripe, webhook a `/api/stripe/webhook` con el evento `checkout.session.completed`; en `.env.local`/Vercel `STRIPE_WEBHOOK_SECRET` y `SUPABASE_SERVICE_ROLE_KEY`; en Supabase → Edge Functions → Secrets, además de los de Resend, `SITE_URL` con el dominio.
- Cada pago también aparece en el panel de Stripe con el pedido, el nombre y la dirección (en "Metadatos" y "Envío").
  Con eso se hace el pedido a mano en AliExpress con la dirección del cliente.
- En Stripe: activar los recibos por email a los clientes y los avisos de pagos al equipo.
- Envío y plazos: `shop` en `content/products.js`. Condiciones de venta: `components/ShopPage.jsx` (`ShopTerms`), pendiente de texto legal.

## Calculadora

- La lógica está en `lib/calc.js`, con la normativa de 2026 explicada al principio del archivo.
- Importes de ITV, placas y documentación: `calculator` en `content/config.js` (estimaciones a confirmar con AlpiCars).

## Guías y SEO/GEO

- Guías en `content/guides.js` (salen solas en `/guias`, en el mapa del sitio y con sus datos estructurados).
- Plan completo de posicionamiento: `docs/SEO-GEO.md`.

## Test, informes en PDF y oferta

- Al terminar las 15 preguntas, el test lleva a `/test/resultado?r=...` (las respuestas van en el enlace, así se puede compartir).
- La calculadora tiene un botón que abre `/calculadora/informe?...` con el desglose.
- En las dos páginas: "Descargar PDF" (se descarga directamente, generado con `lib/pdf.js`), "Enviar el PDF" (en el móvil, lo manda como archivo por WhatsApp u otra app), compartir enlace por WhatsApp, Telegram o copiarlo.
- El PDF termina con un bloque "¿Hablamos?" con botón de WhatsApp, botón de presupuesto y un QR para que quien lo reciba haga su propio test o cálculo.
- Después de descargar sale una oferta para registrarse. Hoy envía un email (mailto); en la fase 2 se guardará en Supabase.

## Fase 2

- Login, registro y perfil de cliente con Supabase (`components/LoginDialog.jsx`)
- Guardar las solicitudes de presupuesto en Supabase y avisar al equipo (`components/LeadForm.jsx`)
- Traducciones: EN, DE, EU, IT, FR (copiar `content/es.js` y traducir)
- Asistente de IA
