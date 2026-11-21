"use client";

import { useEffect, useState } from "react";
import { ShopShell, useShop } from "./ShopPage";
import { db, hasSupabase } from "../lib/supabase";
import { trackingUrl } from "../lib/orderCode";

// Seguimiento de pedidos de la tienda: con el código del pedido y el email.

const STEPS = ["pagado", "pedido_proveedor", "enviado", "entregado"];
const LOC = { es: "es-ES", en: "en-GB", de: "de-DE", fr: "fr-FR", it: "it-IT", eu: "eu-ES" };

export default function TrackingPage() {
  const { lang, T: S } = useShop();
  const T = S.track;
  const ORDER_STATUS = T.status;
  const date = (d) => (d ? new Date(d).toLocaleDateString(LOC[lang] || "es-ES", { day: "numeric", month: "long" }) : "");
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
      else setMsg(T.notFound);
    } catch {
      setMsg(T.error);
    } finally {
      setBusy(false);
    }
  };

  const idx = order ? STEPS.indexOf(order.status) : -1;

  return (
    <ShopShell>
      <section className="shop-hero">
        <h1>{T.title}</h1>
        <p>{T.lead}</p>
      </section>
      <form className="form track-form" onSubmit={onSubmit}>
        <label>
          <span>{T.code}</span>
          <input name="code" required placeholder="AC-XXXXXXXX" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        </label>
        <label>
          <span>{T.email}</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <button className="btn btn-accent" type="submit" disabled={busy || !hasSupabase}>
          {busy ? T.searching : T.search}
        </button>
        {msg && <p className="shop-msg" role="alert">{msg}</p>}
      </form>

      {order && (
        <section className="track-result" aria-live="polite">
          <h2>
            {T.order} {order.code} · {ORDER_STATUS[order.status]}
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
          {order.status === "incidencia" && <p>{T.incident}</p>}
          <ul className="track-items">
            {(order.items || []).map((i) => (
              <li key={i.name}>
                {i.qty} × {i.name}
              </li>
            ))}
          </ul>
          {order.tracking_number && (
            <p>
              {order.carrier ? `${order.carrier} · ` : ""}{T.trackingNo} <b>{order.tracking_number}</b>
              <br />
              <a className="btn btn-accent btn-small track-link" href={trackingUrl(order.tracking_number)} target="_blank" rel="noopener noreferrer">
                {T.follow}
              </a>
            </p>
          )}
        </section>
      )}
    </ShopShell>
  );
}
