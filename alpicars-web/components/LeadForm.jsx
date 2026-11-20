"use client";

import { useEffect, useState } from "react";
import config from "../content/config";
import { useSite } from "./SiteProvider";
import { ArrowIcon, WhatsAppIcon } from "./Icons";
import { origin, originLines, track } from "../lib/track";
import { saveLead } from "../lib/supabase";

// Formulario de presupuesto: guarda la solicitud en la base de datos (panel /panel) y el equipo recibe un email.
// Si la base de datos no responde, abre el correo del visitante con la solicitud ya escrita.

export default function LeadForm() {
  const { t, presetService, presetCar } = useSite();
  const l = t.lead;
  const [service, setService] = useState("");
  const [car, setCar] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (presetService) setService(presetService);
  }, [presetService]);

  useEffect(() => {
    if (presetCar) setCar(presetCar);
  }, [presetCar]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return; // evita enviar la misma solicitud varias veces
    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    const o = origin();
    // 1) Se guarda en la base de datos (panel del equipo en /panel)
    const saved = await saveLead({
      kind: "presupuesto",
      name: String(data.get("name") || "").slice(0, 120),
      contact: String(data.get("contact") || "").slice(0, 160),
      service: String(data.get("service") || "").slice(0, 80) || null,
      car: String(data.get("car") || "").slice(0, 300) || null,
      source: "Formulario de presupuesto",
      origin: o.origen,
      ref: o.recomendado_por || null,
      page: window.location.href.slice(0, 500),
    });
    setSending(false);
    if (saved) {
      track("lead_submit", { service: data.get("service") || "sin decidir" });
      form.reset();
      setCar("");
      setService("");
      setSent("db");
      return;
    }
    // 2) Si la base de datos no está disponible, se abre el correo con la solicitud rellenada
    const body = [
      `Nombre: ${data.get("name")}`,
      `Contacto: ${data.get("contact")}`,
      `Servicio: ${data.get("service") || "Sin decidir"}`,
      `Coche que busco: ${data.get("car") || "-"}`,
      "",
      ...originLines(),
    ].join("\n");
    track("lead_submit", { service: data.get("service") || "sin decidir" });
    const subject = `Solicitud de presupuesto - ${data.get("name")}`;
    window.location.href = `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent("mail");
  };

  const wa = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(t.whatsappText || config.whatsappText)}`;

  return (
    <section className="cta" id="presupuesto" aria-labelledby="lead-title">
      <div className="cta-main">
        <div className="cta-copy">
          <h2 id="lead-title" className="reveal">{l.title}</h2>
          <p className="reveal" style={{ "--d": "60ms" }}>{l.text}</p>
        </div>
        {sent === "db" ? (
          <div className="form form-dark lead-done" role="status">
            <span className="lead-done-icon" aria-hidden="true">✓</span>
            <h3>{l.sentTitle}</h3>
            <p>{l.sentDb}</p>
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setSent(false)}>
                {l.again}
              </button>
              <a className="wa-btn wa-big" href={wa} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                {l.whatsapp}
              </a>
            </div>
          </div>
        ) : (
        <form className="form form-dark reveal" style={{ "--d": "120ms" }} onSubmit={onSubmit} aria-busy={sending}>
          <label>
            <span>{l.fields.name}</span>
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            <span>{l.fields.contact}</span>
            <input name="contact" autoComplete="tel" required />
          </label>
          <label>
            <span>{l.fields.service}</span>
            <select name="service" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">{l.noService}</option>
              {t.services.plans.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{l.fields.car}</span>
            <input name="car" value={car} onChange={(e) => setCar(e.target.value)} placeholder={l.fields.carPlaceholder} />
          </label>
          <div className="form-actions">
            <button className="btn btn-accent btn-big" type="submit" disabled={sending}>
              {sending ? l.sending : l.submit}
              {!sending && <ArrowIcon />}
            </button>
            <a className="wa-btn wa-big" href={wa} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {l.whatsapp}
            </a>
          </div>
          <p className="form-note" role="status">{sent ? l.sent : l.privacy}</p>
        </form>
        )}
      </div>
    </section>
  );
}
