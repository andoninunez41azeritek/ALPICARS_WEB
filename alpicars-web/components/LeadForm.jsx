"use client";

import { useEffect, useState } from "react";
import config from "../content/config";
import photos from "../content/photos";
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
    <section className="cta-row" id="presupuesto" aria-labelledby="lead-title">
      <div className="cta-flank cta-flank-photo" aria-hidden="true">
        <img src={photos.road.src} alt="" width="900" height="900" loading="lazy" />
      </div>
      <div className="cta-main">
        <div className="cta-copy">
          <h2 id="lead-title" className="reveal">{l.title}</h2>
          <p className="reveal">{l.text}</p>
          <a className="wa-btn wa-big reveal" href={wa} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            {l.whatsapp}
          </a>
        </div>
        <form className="form form-dark reveal" onSubmit={onSubmit}>
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
              <option value="">Aún no lo sé</option>
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
          <button className="btn btn-light btn-block" type="submit">
            {l.submit}
            <ArrowIcon />
          </button>
          <p className="form-note" role="status">{sent ? l.sent : l.privacy}</p>
        </form>
      </div>
      <div className="cta-flank cta-flank-color" aria-hidden="true" />
    </section>
  );
}
