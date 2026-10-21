"use client";

import { useEffect, useState } from "react";
import config from "../content/config";
import { useSite } from "./SiteProvider";
import { ArrowIcon, WhatsAppIcon } from "./Icons";

// Formulario de presupuesto.
// De momento abre el correo del visitante con la solicitud rellenada (funciona sin servidor).
// TODO (fase 2): guardar el lead en Supabase y avisar por email/WhatsApp al equipo.

export default function LeadForm() {
  const { t, presetService, presetCar } = useSite();
  const l = t.lead;
  const [service, setService] = useState("");
  const [car, setCar] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (presetService) setService(presetService);
  }, [presetService]);

  useEffect(() => {
    if (presetCar) setCar(presetCar);
  }, [presetCar]);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = [
      `Nombre: ${data.get("name")}`,
      `Contacto: ${data.get("contact")}`,
      `Servicio: ${data.get("service") || "Sin decidir"}`,
      `Coche que busco: ${data.get("car") || "-"}`,
    ].join("\n");
    const subject = `Solicitud de presupuesto - ${data.get("name")}`;
    window.location.href = `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const wa = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappText)}`;

  return (
    <section className="cta" id="presupuesto" aria-labelledby="lead-title">
      <div className="cta-main">
        <div className="cta-copy">
          <h2 id="lead-title" className="reveal">{l.title}</h2>
          <p className="reveal" style={{ "--d": "60ms" }}>{l.text}</p>
        </div>
        <form className="form form-dark reveal" style={{ "--d": "120ms" }} onSubmit={onSubmit}>
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
            <button className="btn btn-accent btn-big" type="submit">
              {l.submit}
              <ArrowIcon />
            </button>
            <a className="wa-btn wa-big" href={wa} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {l.whatsapp}
            </a>
          </div>
          <p className="form-note" role="status">{sent ? l.sent : l.privacy}</p>
        </form>
      </div>
    </section>
  );
}
