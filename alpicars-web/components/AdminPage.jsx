"use client";

import { useCallback, useEffect, useState } from "react";
import ReportShell from "./ReportShell";
import { useSite } from "./SiteProvider";
import { db } from "../lib/supabase";
import products, { variantLabel } from "../content/products";
import { ORDER_STATUS, trackingUrl } from "../lib/orderCode";

// Panel del equipo de AlpiCars: solicitudes que llegan desde la web y ofertas para los clientes registrados.
// Solo entra quien esté en la tabla "staff" de Supabase (las reglas de la base de datos lo impiden al resto).

const STATUSES = ["nueva", "contactada", "presupuestada", "cerrada", "descartada"];
const KIND = { presupuesto: "Presupuesto", registro: "Registro", oferta: "Oferta" };
const when = (d) => new Date(d).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

const eur = (n) => `${Number(n).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

// Un pedido de la tienda: datos de envío, compra al proveedor y número de seguimiento
function OrderRow({ o, onSaved }) {
  const [f, setF] = useState({ status: o.status, supplier_order: o.supplier_order || "", carrier: o.carrier || "", tracking_number: o.tracking_number || "", notes: o.notes || "" });
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const dirty = ["status", "supplier_order", "carrier", "tracking_number", "notes"].some((k) => (o[k] || "") !== f[k]);
  const save = async () => {
    if (f.status === "enviado" && !f.tracking_number) {
      setMsg("Pon el número de seguimiento antes de marcarlo como enviado (el cliente lo recibe por email).");
      return;
    }
    try {
      await db(`orders?id=eq.${o.id}`, {
        method: "PATCH",
        body: { status: f.status, supplier_order: f.supplier_order || null, carrier: f.carrier || null, tracking_number: f.tracking_number || null, notes: f.notes || null },
        prefer: "return=minimal",
      });
      setMsg(f.status !== o.status && ["enviado", "entregado", "incidencia"].includes(f.status) ? "Guardado. Se avisa al cliente por email." : "Guardado.");
      onSaved();
    } catch {
      setMsg("No se ha podido guardar.");
    }
  };
  const ship = `${o.name}\n${o.address}\n${o.phone || ""}`;
  return (
    <li className={`order is-${o.status}`}>
      <div className="order-head">
        <strong>{o.code}</strong>
        <span className="report-small">{new Date(o.created_at).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
        <span className={`account-status is-${o.status === "entregado" ? "presupuestada" : o.status === "cancelado" ? "descartada" : "nueva"}`}>{ORDER_STATUS[o.status]}</span>
        <strong>{eur(o.total)}</strong>
      </div>
      <div className="order-grid">
        <div>
          <h4>Productos</h4>
          <ul>
            {(o.items || []).map((i) => (
              <li key={i.id}>
                {i.qty} × {i.name}{" "}
                {i.supplier && (
                  <a href={i.supplier} target="_blank" rel="noopener noreferrer">
                    AliExpress
                  </a>
                )}
                {i.variant && <span className="report-small"> · Elegir: {i.variant}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Enviar a</h4>
          <p className="order-ship">
            {o.name}
            <br />
            {o.address}
            <br />
            {o.phone} · <a href={`mailto:${o.email}`}>{o.email}</a>
          </p>
          <button
            type="button"
            className="link-btn"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(ship);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {
                window.prompt("Copia la dirección", ship);
              }
            }}
          >
            {copied ? "Copiada" : "Copiar dirección"}
          </button>
        </div>
      </div>
      <div className="order-form">
        <label>
          <span>Estado</span>
          <select value={f.status} onChange={set("status")}>
            {Object.entries(ORDER_STATUS).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Nº pedido en AliExpress</span>
          <input value={f.supplier_order} onChange={set("supplier_order")} maxLength={200} />
        </label>
        <label>
          <span>Transportista</span>
          <input value={f.carrier} onChange={set("carrier")} maxLength={80} placeholder="Cainiao, Correos…" />
        </label>
        <label>
          <span>Nº de seguimiento</span>
          <input value={f.tracking_number} onChange={set("tracking_number")} maxLength={80} />
        </label>
        <label className="order-notes">
          <span>Notas internas</span>
          <input value={f.notes} onChange={set("notes")} maxLength={2000} />
        </label>
        <div className="order-actions">
          <button type="button" className="btn btn-accent btn-small" onClick={save} disabled={!dirty}>
            Guardar
          </button>
          {o.tracking_number && (
            <a className="link-btn" href={trackingUrl(o.tracking_number)} target="_blank" rel="noopener noreferrer">
              Ver seguimiento
            </a>
          )}
        </div>
        {msg && <p className="form-note" role="status">{msg}</p>}
      </div>
    </li>
  );
}

function Panel() {
  const { authReady, session, openLogin } = useSite();
  const [isStaff, setIsStaff] = useState(null);
  const [leads, setLeads] = useState([]);
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("pendientes");
  const [filter, setFilter] = useState("abiertas");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const staff = await db("rpc/is_staff", { method: "POST", body: {} });
      setIsStaff(Boolean(staff));
      if (!staff) return;
      setLeads((await db("leads?select=*&order=created_at.desc&limit=300")) || []);
      setOffers((await db("offers?select=*&order=created_at.desc")) || []);
      setOrders((await db("orders?select=*&order=created_at.desc&limit=200")) || []);
    } catch {
      setIsStaff(false);
    }
  }, []);

  useEffect(() => {
    if (session) load();
  }, [session, load]);

  if (!authReady) return <div className="report-loading">Cargando…</div>;
  if (!session)
    return (
      <section className="report-hero">
        <h1>Panel de AlpiCars</h1>
        <p className="report-lead">Entra con tu cuenta del equipo.</p>
        <button type="button" className="btn btn-accent" onClick={() => openLogin("login")}>Acceder</button>
      </section>
    );
  if (isStaff === null) return <div className="report-loading">Comprobando permisos…</div>;
  if (!isStaff)
    return (
      <section className="report-hero">
        <h1>Sin acceso</h1>
        <p className="report-lead">Tu cuenta no tiene permisos de equipo. Pide a Azeritek que te dé acceso.</p>
      </section>
    );

  const setStatus = async (id, status) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    await db(`leads?id=eq.${id}`, { method: "PATCH", body: { status }, prefer: "return=minimal" }).catch(() => setMsg("No se ha podido guardar el estado."));
  };
  const setNotes = async (id, notes) => {
    await db(`leads?id=eq.${id}`, { method: "PATCH", body: { notes }, prefer: "return=minimal" }).catch(() => setMsg("No se han podido guardar las notas."));
  };

  const addOffer = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form));
    try {
      await db("offers", {
        method: "POST",
        body: { title: f.title, text: f.text, cta_label: f.cta_label || null, cta_url: f.cta_url || null, valid_until: f.valid_until || null },
        prefer: "return=minimal",
      });
      form.reset();
      setMsg("Oferta publicada. Ya la ven los clientes registrados.");
      load();
    } catch {
      setMsg("No se ha podido publicar la oferta.");
    }
  };
  const toggleOffer = async (o) => {
    await db(`offers?id=eq.${o.id}`, { method: "PATCH", body: { active: !o.active }, prefer: "return=minimal" }).catch(() => {});
    load();
  };
  const deleteOffer = async (o) => {
    if (!window.confirm(`¿Borrar la oferta «${o.title}»?`)) return;
    await db(`offers?id=eq.${o.id}`, { method: "DELETE" }).catch(() => {});
    load();
  };

  const shown = leads.filter((l) => (filter === "abiertas" ? !["cerrada", "descartada"].includes(l.status) : filter === "todas" ? true : l.kind === filter));
  const counts = { nuevas: leads.filter((l) => l.status === "nueva").length, total: leads.length };

  return (
    <>
      <section className="report-hero">
        <h1>Panel de AlpiCars</h1>
        <p className="report-lead">
          {counts.nuevas} solicitudes nuevas · {counts.total} en total
        </p>
        {msg && <p className="form-note" role="status">{msg}</p>}
      </section>

      <section className="panel report-panel">
        <div className="admin-head">
          <h2>Solicitudes</h2>
          <div className="seg" role="tablist">
            {[
              ["abiertas", "Abiertas"],
              ["presupuesto", "Presupuestos"],
              ["registro", "Registros"],
              ["todas", "Todas"],
            ].map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}>
                {l}
              </button>
            ))}
          </div>
        </div>
        {shown.length === 0 ? (
          <p className="account-empty">No hay solicitudes en esta vista.</p>
        ) : (
          <div className="admin-table" role="region" aria-label="Solicitudes" tabIndex={0}>
            <table className="report-table">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Qué busca</th>
                  <th scope="col">Origen</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Notas</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => (
                  <tr key={l.id}>
                    <td>
                      {when(l.created_at)}
                      <br />
                      <small>{KIND[l.kind]}</small>
                    </td>
                    <th scope="row">
                      {l.name}
                      <br />
                      <a href={l.contact.includes("@") ? `mailto:${l.contact}` : `https://wa.me/${l.contact.replace(/\D/g, "").replace(/^(?!34)(\d{9})$/, "34$1")}`} target="_blank" rel="noopener noreferrer">
                        {l.contact}
                      </a>
                    </th>
                    <td>
                      {l.service || "—"}
                      {l.car && (
                        <>
                          <br />
                          <small>{l.car}</small>
                        </>
                      )}
                    </td>
                    <td>
                      <small>
                        {l.source || ""}
                        {l.origin ? ` · ${l.origin}` : ""}
                        {l.ref ? ` · recomendado (${l.ref})` : ""}
                      </small>
                    </td>
                    <td>
                      <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)} aria-label="Estado">
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <textarea defaultValue={l.notes || ""} rows={2} maxLength={2000} onBlur={(e) => e.target.value !== (l.notes || "") && setNotes(l.id, e.target.value)} aria-label="Notas" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel report-panel">
        <div className="admin-head">
          <h2>Pedidos de la tienda</h2>
          <div className="seg" role="tablist">
            {[
              ["pendientes", "Por enviar"],
              ["enviados", "Enviados"],
              ["todos", "Todos"],
            ].map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={orderFilter === k} onClick={() => setOrderFilter(k)}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <p className="report-small">Por cada pedido: 1) cómpralo en AliExpress con la dirección del cliente, 2) marca «En preparación» con el nº de pedido, 3) cuando AliExpress dé el nº de seguimiento, ponlo y marca «Enviado»: el cliente recibe un email con el enlace para seguirlo.</p>
        {(() => {
          const list = orders.filter((o) => (orderFilter === "pendientes" ? ["pagado", "pedido_proveedor", "incidencia"].includes(o.status) : orderFilter === "enviados" ? o.status === "enviado" : true));
          return list.length === 0 ? (
            <p className="account-empty">No hay pedidos en esta vista.</p>
          ) : (
            <ul className="orders">
              {list.map((o) => (
                <OrderRow key={`${o.id}-${o.status}-${o.tracking_number || ""}`} o={o} onSaved={load} />
              ))}
            </ul>
          );
        })()}
      </section>

      <section className="panel report-panel">
        <h2>Proveedores de la tienda</h2>
        <ul className="account-list">
          {products.map((p) => (
            <li key={p.id}>
              <span>{p.name}</span>
              <span className="report-small">
                {p.priceFrom < p.priceTo
                  ? `${p.priceFrom.toLocaleString("es-ES", { minimumFractionDigits: 2 })} – ${p.priceTo.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`
                  : `${p.price.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`}
              </span>
              {p.variant && <span className="report-small">Elegir: {p.variant}</span>}
              {p.variants && (
                <span className="report-small admin-variants">
                  {p.variants.map((x) => `${variantLabel(p, x)} → ${x.supplier}`).join(" · ")}
                </span>
              )}
              {p.supplier ? (
                <a href={p.supplier} target="_blank" rel="noopener noreferrer">Abrir en AliExpress</a>
              ) : (
                <span className="report-small">Sin proveedor</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel report-panel">
        <h2>Ofertas para registrados</h2>
        <form className="form admin-offer" onSubmit={addOffer}>
          <label>
            <span>Título</span>
            <input name="title" required maxLength={120} placeholder="Ej.: Revisión presencial a mitad de precio en noviembre" />
          </label>
          <label>
            <span>Texto</span>
            <textarea name="text" required maxLength={600} rows={3} />
          </label>
          <div className="calc-two">
            <label>
              <span>Botón (opcional)</span>
              <input name="cta_label" maxLength={40} placeholder="Lo quiero" />
            </label>
            <label>
              <span>Enlace del botón (opcional)</span>
              <input name="cta_url" maxLength={300} placeholder="/#presupuesto" />
            </label>
          </div>
          <label>
            <span>Válida hasta (opcional)</span>
            <input name="valid_until" type="date" />
          </label>
          <button className="btn btn-accent" type="submit">Publicar oferta</button>
        </form>
        <ul className="account-list">
          {offers.map((o) => (
            <li key={o.id}>
              <span>
                <strong>{o.title}</strong>
                {o.valid_until ? ` · hasta ${o.valid_until}` : ""}
              </span>
              <span className={`account-status ${o.active ? "is-presupuestada" : "is-descartada"}`}>{o.active ? "Activa" : "Oculta"}</span>
              <span>
                <button type="button" className="link-btn" onClick={() => toggleOffer(o)}>{o.active ? "Ocultar" : "Activar"}</button>{" "}
                <button type="button" className="link-btn" onClick={() => deleteOffer(o)}>Borrar</button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function AdminPage() {
  return (
    <ReportShell>
      <Panel />
    </ReportShell>
  );
}
