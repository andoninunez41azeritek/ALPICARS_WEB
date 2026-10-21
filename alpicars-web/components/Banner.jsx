"use client";

import config from "../content/config";
import photos from "../content/photos";
import { useSite } from "./SiteProvider";
import { ArrowIcon, ExternalIcon } from "./Icons";

// Los tres bloques pedidos por AlpiCars: servicios (grande), test (pequeño arriba) y tienda (pequeño abajo)
export default function Banner() {
  const { t, formatPrice, setQuizOpen, setPresetService } = useSite();
  const b = t.board;

  return (
    <section className="board" id="servicios-inicio" aria-labelledby="board-title">
      <div className="tile tile-services panel">
        <div className="ts-head">
          <h2 id="board-title" className="reveal">{b.servicesTitle}</h2>
          <p className="reveal">{b.servicesText}</p>
        </div>
        <ul className="ts-list">
          {t.services.plans.map((p, i) => (
            <li key={p.id} className="reveal" style={{ "--d": `${i * 70}ms` }}>
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

      <button type="button" className="tile tile-quiz" onClick={() => setQuizOpen(true)}>
        <span className="quiz-big" aria-hidden="true">15</span>
        <span className="tile-title">{b.quiz.title}</span>
        <span className="tile-text">{b.quiz.text}</span>
        <span className="tile-link">
          {b.quiz.cta}
          <ArrowIcon />
        </span>
      </button>

      <a className="tile tile-shop" href={config.shopUrl} target="_blank" rel="noopener noreferrer">
        <img className="tile-img" src={photos.shop.src} alt={photos.shop.alt} width="900" height="600" loading="lazy" />
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
