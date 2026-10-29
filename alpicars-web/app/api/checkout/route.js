// Pago de la tienda con Stripe Checkout.
// El navegador envía solo qué productos y cuántos; los precios se leen aquí, en el servidor (no se pueden manipular).
// Los datos de envío (nombre, apellidos y dirección) se guardan en el pago para que AlpiCars haga el pedido
// al proveedor a mano. Se ven en el panel de Stripe → Pagos.
//
// Para activarlo: crear la cuenta de Stripe de AlpiCars y poner la clave secreta en .env.local:
//   STRIPE_SECRET_KEY=sk_test_...   (pruebas)   ·   sk_live_...   (cobros reales, cuando AlpiCars esté dada de alta)

import products, { shop, getVariant, resolveLine } from "../../../content/products";

const cents = (eur) => Math.round(eur * 100);

export async function POST(req) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return Response.json({ error: "demo", message: "La tienda todavía no está conectada a Stripe." }, { status: 503 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  // Productos: solo los que existen, con una opción válida si tienen opciones, y cantidades de 1 a 10.
  // El precio sale de content/products.js (de la opción elegida), nunca del navegador.
  const items = (Array.isArray(body.items) ? body.items.slice(0, 30) : [])
    .map((it) => {
      const p = products.find((x) => x.id === it.id);
      if (!p || (p.variants && !getVariant(p, it.sku))) return null;
      const r = resolveLine(p.id, it.sku);
      return { p, sku: r.variant?.sku || "", price: r.price, label: r.label, qty: Math.min(10, Math.max(1, Math.floor(Number(it.qty) || 0))) };
    })
    .filter(Boolean);
  if (!items.length) return Response.json({ error: "empty" }, { status: 400 });

  // Datos del cliente (obligatorios)
  const c = body.customer || {};
  const field = (k, max = 120) => String(c[k] ?? "").trim().slice(0, max);
  const customer = {
    name: field("name", 60),
    surname: field("surname", 80),
    email: field("email", 120),
    phone: field("phone", 30),
    address: field("address", 160),
    zip: field("zip", 10),
    city: field("city", 80),
    province: field("province", 80),
  };
  const missing = ["name", "surname", "email", "address", "zip", "city", "province"].filter((k) => !customer[k]);
  if (missing.length || !/^\S+@\S+\.\S+$/.test(customer.email) || !/^\d{5}$/.test(customer.zip)) {
    return Response.json({ error: "customer", missing }, { status: 400 });
  }

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal >= shop.freeShippingFrom ? 0 : shop.shipping;
  const origin = req.headers.get("origin") || new URL(req.url).origin;
  const fullName = (it) => (it.label ? `${it.p.name} (${it.label})` : it.p.name);
  const summary = items.map((it) => `${it.qty} x ${fullName(it)}`).join("; ").slice(0, 480);

  const f = new URLSearchParams();
  f.set("mode", "payment");
  f.set("locale", "es");
  f.set("success_url", `${origin}/tienda/gracias?pedido={CHECKOUT_SESSION_ID}`);
  f.set("cancel_url", `${origin}/tienda?pago=cancelado`);
  f.set("customer_email", customer.email);
  items.forEach((it, i) => {
    f.set(`line_items[${i}][quantity]`, String(it.qty));
    f.set(`line_items[${i}][price_data][currency]`, "eur");
    f.set(`line_items[${i}][price_data][unit_amount]`, String(cents(it.price)));
    f.set(`line_items[${i}][price_data][product_data][name]`, fullName(it).slice(0, 250));
  });
  f.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  f.set("shipping_options[0][shipping_rate_data][display_name]", shipping === 0 ? "Envío gratuito" : "Envío a domicilio");
  f.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(cents(shipping)));
  f.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "eur");
  // Lo que verá AlpiCars en cada pago para hacer el pedido al proveedor
  const meta = {
    pedido: summary,
    nombre: `${customer.name} ${customer.surname}`,
    telefono: customer.phone || "-",
    direccion: `${customer.address}, ${customer.zip} ${customer.city} (${customer.province})`,
  };
  // Productos y cantidades para crear el pedido desde el webhook (id:cantidad,...)
  meta.items = items.map((it) => (it.sku ? `${it.p.id}:${it.sku}:${it.qty}` : `${it.p.id}:${it.qty}`)).join(",").slice(0, 490);
  meta.email = customer.email;
  for (const [k, v] of Object.entries(meta)) {
    f.set(`metadata[${k}]`, v);
    f.set(`payment_intent_data[metadata][${k}]`, v);
  }
  f.set("payment_intent_data[description]", `Tienda AlpiCars: ${summary}`.slice(0, 500));
  f.set("payment_intent_data[shipping][name]", `${customer.name} ${customer.surname}`);
  if (customer.phone) f.set("payment_intent_data[shipping][phone]", customer.phone);
  f.set("payment_intent_data[shipping][address][line1]", customer.address);
  f.set("payment_intent_data[shipping][address][postal_code]", customer.zip);
  f.set("payment_intent_data[shipping][address][city]", customer.city);
  f.set("payment_intent_data[shipping][address][state]", customer.province);
  f.set("payment_intent_data[shipping][address][country]", "ES");

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: f.toString(),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Stripe:", data?.error?.message);
    return Response.json({ error: "stripe" }, { status: 502 });
  }
  return Response.json({ url: data.url });
}
