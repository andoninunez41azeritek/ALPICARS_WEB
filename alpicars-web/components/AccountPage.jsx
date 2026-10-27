"use client";

import { useEffect, useState } from "react";
import config from "../content/config";
import ReportShell from "./ReportShell";
import { useSite } from "./SiteProvider";
import { ArrowIcon, WhatsAppIcon } from "./Icons";
import { db, signOut, updatePassword } from "../lib/supabase";
import { track } from "../lib/track";
import { ORDER_STATUS } from "../lib/orderCode";

// Área de clientes: ofertas exclusivas, enlace para recomendar, informes guardados, solicitudes y datos personales.

const STATUS = { nueva: "Recibida", contactada: "Te hemos contactado", presupuestada: "Presupuesto enviado", cerrada: "Cerrada", descartada: "Cerrada" };
const date = (d) => new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

function NewPassword() {
  const { setRecovery } = useSite();
  const [msg, setMsg] = useState("");
  return (
    <section className="panel report-panel">
      <h2>Crea tu nueva contraseña</h2>
      <form
        className="form account-form"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await updatePassword(new FormData(e.currentTarget).get("password"));
            setMsg("Contraseña cambiada.");
            setTimeout(() => setRecovery(false), 1200);
          } catch {
            setMsg("No se ha podido cambiar. Pide otro enlace.");
          }
        }}
      >
        <label>
          <span>Contraseña nueva</span>
          <input type="password" name="password" minLength={8} required autoComplete="new-password" />
        </label>
        <button className="btn btn-accent" type="submit">Guardar</button>
        {msg && <p className="form-note" role="status">{msg}</p>}
      </form>
    </section>
  );
}

function Account() {
  const { authReady, session, profile, openLogin, recovery, refreshAuth } = useSite();
  const [offers, setOffers] = useState(null);
  const [reports, setReports] = useState(null);
  const [leads, setLeads] = useState(null);
  const [orders, setOrders] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState("");
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (!session) return;
    db("rpc/is_staff", { method: "POST", body: {} }).then((s) => setIsStaff(Boolean(s))).catch(() => setIsStaff(false));
    // Informe que el cliente quiso guardar antes de tener cuenta
    (async () => {
      try {
        const pending = JSON.parse(localStorage.getItem("alpicars-pending-report") || "null");
        if (pending?.kind && pending?.url) {
          await db("saved_reports", { method: "POST", body: { kind: pending.kind, title: String(pending.title).slice(0, 160), url: String(pending.url).slice(0, 600) }, prefer: "return=minimal" });
          localStorage.removeItem("alpicars-pending-report");
          setReports(await db("saved_reports?select=*&order=created_at.desc"));
        }
      } catch {
        /* se intentará la próxima vez */
      }
    })();
    db("offers?select=*&order=created_at.desc").then(setOffers).catch(() => setOffers([]));
    db("saved_reports?select=*&order=created_at.desc").then(setReports).catch(() => setReports([]));
    db(`leads?select=id,created_at,kind,service,car,status&user_id=eq.${session.user?.id}&order=created_at.desc`).then(setLeads).catch(() => setLeads([]));
    db("orders?select=code,created_at,status,total,tracking_number,carrier&order=created_at.desc").then(setOrders).catch(() => setOrders([]));
  }, [session]);

  if (!authReady) return <div className="report-loading">Cargando tu cuenta…</div>;

  if (!session)
    return (
      <section className="report-hero">
        <h1>Tu área de cliente</h1>
        <p className="report-lead">Ofertas exclusivas para registrados, tus informes del test y de la calculadora guardados y tu enlace para recomendarnos.</p>
        <div className="report-cta-actions">
          <button type="button" className="btn btn-accent" onClick={() => openLogin("signup")}>
            Crear mi cuenta
            <ArrowIcon />
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => openLogin("login")}>
            Ya tengo cuenta
          </button>
        </div>
      </section>
    );

  const name = profile?.full_name?.split(" ")[0] || "";
  const refUrl = profile?.ref_code ? `${window.location.origin}/?ref=${profile.ref_code}` : "";
  const refText = `Te paso AlpiCars: traen coches de Suiza y Alemania a España con presupuesto cerrado. Calcula cuánto te ahorras aquí: ${refUrl}`;

  const removeReport = async (id) => {
    await db(`saved_reports?id=eq.${id}`, { method: "DELETE" }).catch(() => {});
    setReports((r) => r.filter((x) => x.id !== id));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await db(`profiles?id=eq.${session.user.id}`, {
        method: "PATCH",
        body: { full_name: f.get("full_name"), phone: f.get("phone"), marketing_ok: f.get("marketing_ok") === "on" },
        prefer: "return=minimal",
      });
      setSaved("Datos guardados.");
      refreshAuth();
    } catch {
      setSaved("No se han podido guardar. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      {recovery && <NewPassword />}
      <section className="report-hero account-hero">
        <h1>{name ? `Hola, ${name}` : "Tu área de cliente"}</h1>
        <p className="report-lead">Aquí tienes tus ofertas exclusivas, tus informes y el estado de tus solicitudes.</p>
        {isStaff && (
          <div className="report-cta-actions">
            <a className="btn btn-accent" href="/panel">
              Abrir el panel de AlpiCars
              <ArrowIcon />
            </a>
          </div>
        )}
      </section>

      <section className="panel report-panel">
        <h2>Ofertas exclusivas para ti</h2>
        {offers === null ? (
          <p className="report-small">Cargando…</p>
        ) : offers.length === 0 ? (
          <p className="account-empty">Ahora mismo no hay ofertas activas. En cuanto tengamos una, aparecerá aquí{profile?.marketing_ok ? " y te avisaremos por email" : ""}.</p>
        ) : (
          <ul className="account-offers">
            {offers.map((o) => (
              <li key={o.id}>
                <h3>{o.title}</h3>
                <p>{o.text}</p>
                {o.valid_until && <p className="report-small">Válida hasta el {date(o.valid_until)}</p>}
                {o.cta_url && (
                  <a className="btn btn-accent btn-small" href={o.cta_url} onClick={() => track("offer_click", { id: o.id })}>
                    {o.cta_label || "Lo quiero"}
                    <ArrowIcon />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {refUrl && (
        <section className="panel report-panel">
          <h2>Recomiéndanos</h2>
          <p>{config.referral?.reward || "Pásale tu enlace a quien esté pensando en cambiar de coche. Si nos pide presupuesto desde él, sabremos que viene de tu parte."}</p>
          <p className="account-ref">{refUrl}</p>
          <div className="report-cta-actions account-ref-actions">
            <a className="share-btn share-wa" href={`https://wa.me/?text=${encodeURIComponent(refText)}`} target="_blank" rel="noopener noreferrer" onClick={() => track("share_click", { channel: "whatsapp", source: "cuenta" })}>
              <WhatsAppIcon width="18" height="18" />
              Enviar por WhatsApp
            </a>
            <button
              type="button"
              className="share-btn"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(refUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  window.prompt("Copia tu enlace", refUrl);
                }
              }}
            >
              {copied ? "Enlace copiado" : "Copiar enlace"}
            </button>
          </div>
        </section>
      )}

      <section className="panel report-panel">
        <h2>Mis informes</h2>
        {reports === null ? (
          <p className="report-small">Cargando…</p>
        ) : reports.length === 0 ? (
          <div className="account-empty">
            <p>Aún no has guardado ningún informe. Haz el test o la calculadora y pulsa «Guardar en mi cuenta».</p>
            <div className="report-cta-actions">
              <a className="btn btn-ghost btn-small" href="/#test">Hacer el test</a>
              <a className="btn btn-ghost btn-small" href="/#calculadora">Usar la calculadora</a>
            </div>
          </div>
        ) : (
          <ul className="account-list">
            {reports.map((r) => (
              <li key={r.id}>
                <a href={r.url}>{r.title}</a>
                <span className="report-small">{date(r.created_at)}</span>
                <button type="button" className="link-btn" onClick={() => removeReport(r.id)}>Quitar</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel report-panel">
        <h2>Mis solicitudes</h2>
        {leads === null ? (
          <p className="report-small">Cargando…</p>
        ) : leads.length === 0 ? (
          <p className="account-empty">No tienes solicitudes todavía. <a href="/#presupuesto">Pide tu presupuesto</a>.</p>
        ) : (
          <ul className="account-list">
            {leads.map((l) => (
              <li key={l.id}>
                <span>{l.service || "Solicitud"}{l.car ? ` · ${l.car}` : ""}</span>
                <span className="report-small">{date(l.created_at)}</span>
                <span className={`account-status is-${l.status}`}>{STATUS[l.status] || l.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {orders?.length > 0 && (
        <section className="panel report-panel">
          <h2>Mis pedidos de la tienda</h2>
          <ul className="account-list">
            {orders.map((o) => (
              <li key={o.code}>
                <a href={`/seguimiento?pedido=${o.code}`}>{o.code}</a>
                <span className="report-small">{date(o.created_at)}</span>
                <span className="account-status">{ORDER_STATUS[o.status] || o.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel report-panel">
        <h2>Mis datos</h2>
        <form className="form account-form" onSubmit={saveProfile}>
          <p className="report-small">Email: {session.user?.email}</p>
          <label>
            <span>Nombre</span>
            <input name="full_name" defaultValue={profile?.full_name || ""} maxLength={120} />
          </label>
          <label>
            <span>Teléfono</span>
            <input name="phone" type="tel" defaultValue={profile?.phone || ""} maxLength={30} />
          </label>
          <label className="check">
            <input type="checkbox" name="marketing_ok" defaultChecked={profile?.marketing_ok} />
            <span>Quiero recibir ofertas exclusivas y avisos de coches que encajen conmigo.</span>
          </label>
          <div className="report-cta-actions">
            <button className="btn btn-accent" type="submit">Guardar mis datos</button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
            >
              Cerrar sesión
            </button>
          </div>
          {saved && <p className="form-note" role="status">{saved}</p>}
        </form>
      </section>
    </>
  );
}

export default function AccountPage() {
  return (
    <ReportShell>
      <Account />
    </ReportShell>
  );
}
