"use client";

import { useEffect, useRef, useState } from "react";
import config from "../content/config";
import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";
import { hasSupabase, saveLead, signUp } from "../lib/supabase";
import { origin, originLines, track } from "../lib/track";

// Oferta para registrarse que aparece después de descargar o enviar el PDF.
// Con Supabase: crea la cuenta del cliente (ofertas exclusivas + informe guardado en su área).
// Sin Supabase: envía los datos por email a AlpiCars.
// pendingReport: { kind, title, url } → se guarda en su cuenta en cuanto entre por primera vez.

export default function OfferDialog({ open, onClose, source, pendingReport }) {
  const { t, session } = useSite();
  const o = t.offer;
  const ref = useRef(null);
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setSent("");
      setErr("");
      d.showModal();
    }
    if (!open && d.open) d.close();
  }, [open]);

  // Ya registrado: no hace falta pedirle nada
  useEffect(() => {
    if (open && session) onClose();
  }, [open, session, onClose]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (hasSupabase) {
      setBusy(true);
      setErr("");
      try {
        let referredBy = "";
        try {
          referredBy = localStorage.getItem("alpicars-ref") || "";
          if (pendingReport) localStorage.setItem("alpicars-pending-report", JSON.stringify(pendingReport));
        } catch {
          /* nada */
        }
        const { needsConfirm } = await signUp({
          email: data.get("email"),
          password: data.get("password"),
          fullName: data.get("name"),
          marketingOk: true,
          referredBy,
        });
        const or = origin();
        await saveLead({ kind: "registro", name: String(data.get("name")).slice(0, 120), contact: String(data.get("email")).slice(0, 160), source, origin: or.origen, ref: or.recomendado_por || null, page: window.location.href.slice(0, 500) });
        track("offer_submit", { source });
        if (needsConfirm) setSent(o.doneConfirm);
        else window.location.href = "/cuenta";
      } catch (e2) {
        setErr(e2.message === "User already registered" ? o.exists : o.error);
      } finally {
        setBusy(false);
      }
      return;
    }
    const body = [`Nombre: ${data.get("name")}`, `Contacto: ${data.get("email")}`, `Origen: ${source}`, `Enlace: ${window.location.href}`, ...originLines()].join("\n");
    track("offer_submit", { source });
    window.location.href = `mailto:${config.email}?subject=${encodeURIComponent("Registro desde la web - " + data.get("name"))}&body=${encodeURIComponent(body)}`;
    setSent(o.done);
  };

  return (
    <dialog ref={ref} className="dlg dlg-offer" onClose={onClose} aria-labelledby="offer-title">
      <div className="dlg-head">
        <h2 id="offer-title">{o.title}</h2>
        <button type="button" className="dlg-x" onClick={onClose} aria-label={o.later}>
          <span />
          <span />
        </button>
      </div>
      <div className="offer-body">
        <p className="offer-text">{o.text}</p>
        <ul className="offer-perks">
          {o.perks.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        {sent ? (
          <p className="offer-done" role="status">{sent}</p>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <label>
              <span>{o.name}</span>
              <input name="name" autoComplete="name" required maxLength={120} />
            </label>
            <label>
              <span>{o.email}</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            {hasSupabase && (
              <label>
                <span>{o.password}</span>
                <input name="password" type="password" autoComplete="new-password" minLength={8} required />
              </label>
            )}
            <label className="check">
              <input type="checkbox" required />
              <span>
                {o.consent} <a href="/privacidad" target="_blank" rel="noopener noreferrer">{o.privacy}</a>.
              </span>
            </label>
            <button type="submit" className="btn btn-accent btn-block" disabled={busy}>
              {busy ? "Un momento…" : o.submit}
              <ArrowIcon />
            </button>
            {err && <p className="form-error" role="alert">{err}</p>}
            <button type="button" className="quiz-back" onClick={onClose}>
              {o.later}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
