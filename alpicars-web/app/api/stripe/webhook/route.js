// Webhook de Stripe: cuando un pago de la tienda se completa, crea el pedido en Supabase.
// La base de datos envía entonces el email de confirmación al cliente y el aviso al equipo (función order-email).
//
// Configuración (cuando la tienda esté en marcha):
//  1. Stripe → Desarrolladores → Webhooks → Añadir endpoint: https://DOMINIO/api/stripe/webhook
//     Evento: checkout.session.completed
//  2. Copiar el "Signing secret" (whsec_...) en STRIPE_WEBHOOK_SECRET
//  3. Supabase → Project Settings → API Keys → clave secreta (service_role) en SUPABASE_SERVICE_ROLE_KEY
//  Las dos solo en el servidor (.env.local y Vercel), nunca con NEXT_PUBLIC_.

import crypto from "node:crypto";
import products from "../../../../content/products";
import { orderCode } from "../../../../lib/orderCode";

export const runtime = "nodejs";

function validSignature(payload, header, secret) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=")));
  const t = parts.t;
  const v1 = header.split(",").filter((kv) => kv.startsWith("v1=")).map((kv) => kv.slice(3));
  if (!t || !v1.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false; // máximo 5 minutos
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return v1.some((sig) => sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
}

export async function POST(req) {
  const payload = await req.text();
  if (!validSignature(payload, req.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET)) {
    return new Response("firma no válida", { status: 400 });
  }
  const event = JSON.parse(payload);
  if (event.type !== "checkout.session.completed") return Response.json({ ignored: event.type });

  const s = event.data.object;
  if (s.payment_status !== "paid") return Response.json({ ignored: "no pagado" });
  const m = s.metadata || {};

  const items = String(m.items || "")
    .split(",")
    .map((x) => x.split(":"))
    .map(([id, qty]) => ({ p: products.find((p) => p.id === id), qty: Number(qty) || 1 }))
    .filter((x) => x.p)
    .map(({ p, qty }) => ({ id: p.id, name: p.name, qty, price: p.price, supplier: p.supplier || "", variant: p.variant || "" }));
  const subtotal = items.reduce((t, i) => t + i.price * i.qty, 0);
  const total = (s.amount_total || 0) / 100;

  const order = {
    code: orderCode(s.id),
    stripe_session_id: s.id,
    email: (m.email || s.customer_details?.email || s.customer_email || "").slice(0, 160),
    name: (m.nombre || s.customer_details?.name || "").slice(0, 160),
    phone: m.telefono && m.telefono !== "-" ? m.telefono.slice(0, 30) : null,
    address: (m.direccion || "").slice(0, 300),
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(Math.max(0, total - subtotal) * 100) / 100,
    total,
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Pedido sin guardar: falta SUPABASE_SERVICE_ROLE_KEY", order.code);
    return new Response("falta configuración", { status: 500 }); // Stripe reintentará
  }
  const res = await fetch(`${url}/rest/v1/orders?on_conflict=stripe_session_id`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    console.error("Supabase:", await res.text());
    return new Response("error al guardar", { status: 500 });
  }
  return Response.json({ ok: true, code: order.code });
}
