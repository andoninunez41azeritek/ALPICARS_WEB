"use client";

import Image from "next/image";
import config from "../content/config";
import photos from "../content/photos";
import { useSite } from "./SiteProvider";
import { ArrowIcon, ExternalIcon } from "./Icons";

// Los tres bloques principales, en el centro: servicios (grande), test (pequeño arriba) y tienda (pequeño abajo)
export default function Banner() {
  const { t, formatPrice, setQuizOpen, setPresetService } = useSite();
  const b = t.board;

  return (
    <section className="board" id="servicios-inicio" aria-labelledby="board-title">
      <div className="tile tile-services">
        <div className="ts-head">
          <h2 id="board-title" className="reveal">{b.servicesTitle}</h2>
          <p className="reveal" style={{ "--d": "60ms" }}>{b.servicesText}</p>
        </div>
        <ul className="ts-list">
          {t.services.plans.map((p, i) => (
            <li key={p.id} className="reveal" style={{ "--d": `${120 + i * 70}ms` }}>
              <a href="#servicios" className={p.recommended ? "is-rec" : undefined} onClick={() => setPresetService(p.name)}>
                <span className="ts-name">{p.name}</span>
                <span className="ts-text">{p.text}</span>
                <span className="ts-price">
                  {p.price == null ? t.services.onRequest : formatPrice(p.price)}
                  {p.suffix && <small> {p.suffix}</small>}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="tile tile-quiz reveal" style={{ "--d": "120ms" }}>
        <span className="quiz-big" aria-hidden="true">15</span>
        <span className="tile-title">{b.quiz.title}</span>
        <span className="tile-text">{b.quiz.text}</span>
        <ul className="quiz-meta">
          {b.quiz.meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <button type="button" className="quiz-start" onClick={() => setQuizOpen(true)}>
          <span className="qs-dots" aria-hidden="true">
            {Array.from({ length: 15 }, (_, i) => (
              <i key={i} style={{ "--i": i }} />
            ))}
          </span>
          <span className="qs-label">
            {b.quiz.cta}
            <ArrowIcon />
          </span>
        </button>
      </div>

      <a className="tile tile-shop reveal" style={{ "--d": "200ms" }} href={config.shopUrl} target="_blank" rel="noopener noreferrer">
        <Image className="tile-img" src={photos.detalle.src} alt={photos.detalle.alt} sizes="(max-width: 760px) 50vw, 30vw" />
        <span className="shop-copy">
          <span className="tile-title">{b.shop.title}</span>
          <span className="tile-text">{b.shop.text}</span>
          <span className="tile-link">
            {b.shop.cta}
            <ExternalIcon />
          </span>
        </span>
      </a>
    </section>
  );
}
