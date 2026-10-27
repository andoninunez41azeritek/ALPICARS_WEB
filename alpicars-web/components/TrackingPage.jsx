"use client";

import { useEffect, useState } from "react";
import { ShopShell } from "./ShopPage";
import { db, hasSupabase } from "../lib/supabase";
import { ORDER_STATUS, trackingUrl } from "../lib/orderCode";

// Seguimiento de pedidos de la tienda: con el código del pedido y el email.

const STEPS = ["pagado", "pedido_proveedor", "enviado", "entregado"];
const date = (d) => (d ? new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "long" }) : "");

export default function TrackingPage() {
  const [code, setCode] = useState("");
  const [order, setOrder] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("pedido");
    if (c) setCode(c);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setMsg("");
    setOrder(null);
    try {
      const rows = await db("rpc/track_order", { method: "POST", body: { p_code: f.get("code"), p_email: f.get("email") } });
      if (rows?.[0]) setOrder(rows[0]);
      else setMsg("No encontramos ningún pedido con ese código y ese email. Revisa el email de confirmación del pedido.");
    } catch {
      setMsg("No hemos podido consultar el pedido. Inténtalo de nuevo en unos minutos.");
    } finally {
      setBusy(false);
    }
  };

  const idx = order ? STEPS.indexOf(order.status) : -1;

  return (
    <ShopShell>
      <section className="shop-hero">
        <h1>Seguimiento de tu pedido</h1>
        <p>Escribe el código del pedido (empieza por AC-) y el email con el que compraste.</p>
      </section>
      <form className="form track-form" onSubmit={onSubmit}>
        <label>
          <span>Código del pedido</span>
          <input name="code" required placeholder="AC-XXXXXXXX" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <button className="btn btn-accent" type="submit" disabled={busy || !hasSupabase}>
          {busy ? "Buscando…" : "Ver mi pedido"}
        </button>
        {msg && <p className="shop-msg" role="alert">{msg}</p>}
      </form>

      {order && (
        <section className="track-result" aria-live="polite">
          <h2>
            Pedido {order.code} · {ORDER_STATUS[order.status]}
          </h2>
          {idx >= 0 && (
            <ol className="track-steps">
              {STEPS.map((s, i) => (
                <li key={s} className={i <= idx ? "is-done" : undefined}>
                  <span>{ORDER_STATUS[s]}</span>
                  <small>{s === "pagado" ? date(order.created_at) : s === "enviado" ? date(order.shipped_at) : s === "entregado" ? date(order.delivered_at) : ""}</small>
                </li>
              ))}
            </ol>
          )}
          {order.status === "incidencia" && <p>Estamos resolviendo un problema con el envío. Te escribimos en cuanto haya novedades.</p>}
          <ul className="track-items">
            {(order.items || []).map((i) => (
              <li key={i.name}>
                {i.qty} × {i.name}
              </li>
            ))}
          </ul>
          {order.tracking_number && (
            <p>
              {order.carrier ? `${order.carrier} · ` : ""}Nº de seguimiento <b>{order.tracking_number}</b>
              <br />
              <a className="btn btn-accent btn-small track-link" href={trackingUrl(order.tracking_number)} target="_blank" rel="noopener noreferrer">
                Seguir el paquete
              </a>
            </p>
          )}
        </section>
      )}
    </ShopShell>
  );
}
