"use client";

import { useEffect, useMemo, useState } from "react";
import config from "../content/config";
import products, { categories, shop, resolveLine, getVariant } from "../content/products";
import { ArrowIcon } from "./Icons";
import { rememberOrigin, track } from "../lib/track";
import { orderCode } from "../lib/orderCode";
import { LegalBody } from "./LegalDoc";
import { tiendaCondiciones } from "../content/legal";

// Tienda AlpiCars: productos de detailing y accesorios.
// Va aparte de la web principal (con su propia cabecera) para no mezclarla con el servicio de importación.
// Carrito guardado en el navegador; pago con Stripe (app/api/checkout/route.js).

// Iconos dibujados (mismo trazo que el resto de la web)
const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const X = () => <Icon d="M6 6l12 12M18 6L6 18" />;
const Minus = () => <Icon d="M5 12h14" />;
const Plus = () => <Icon d="M12 5v14M5 12h14" />;

const eur = (n) => `${n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const CART_KEY = "alpicars-cart";

// Cada línea del carrito: { id, sku, qty }. "sku" es la opción elegida (color, modelo...); vacío si no tiene.
const lineKey = (it) => `${it.id}|${it.sku || ""}`;

function readCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .map((it) => {
        const p = products.find((x) => x.id === it.id);
        if (!p) return null;
        const sku = p.variants ? (getVariant(p, it.sku) || p.variants[0]).sku : "";
        return { id: p.id, sku, qty: Math.min(10, Math.max(1, Number(it.qty) || 1)) };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

const priceText = (p) => (p.priceFrom < p.priceTo ? `Desde ${eur(p.priceFrom)}` : eur(p.priceFrom));
function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* sin almacenamiento: el carrito vive solo en esta visita */
  }
}

export function ShopShell({ children, cartCount = 0, onCart }) {
  return (
    <div className="shop">
      <header className="shop-header">
        <a className="shop-logo" href="/tienda" aria-label="Tienda AlpiCars">
          <img src="/logo-horizontal-white.png" alt="AlpiCars" width="945" height="172" />
          <span>Tienda</span>
        </a>
        <nav className="shop-nav">
          <a href="/">Importar un coche</a>
          {onCart && (
            <button type="button" className="shop-cart-btn" onClick={onCart} aria-label={`Carrito, ${cartCount} productos`}>
              Carrito
              <span className="shop-badge">{cartCount}</span>
            </button>
          )}
        </nav>
      </header>
      <main className="shop-main">{children}</main>
      <footer className="shop-footer">
        <p>
          AlpiCars · <a href={`mailto:${config.email}`}>{config.email}</a> · {shop.deliveryTime} ·{" "}
          {shop.freeShippingFrom ? `Envío gratis a partir de ${eur(shop.freeShippingFrom)}` : ""}
        </p>
        <p>
          <a href="/seguimiento">Seguimiento de pedido</a> · <a href="/tienda/condiciones">Condiciones de venta, envíos y devoluciones</a> · <a href="/privacidad">Privacidad</a>
        </p>
      </footer>
    </div>
  );
}

function ProductImage({ p, eager = false }) {
  if (!p.image)
    return (
      <div className="shop-ph" aria-hidden="true">
        <span>{p.name.charAt(0)}</span>
      </div>
    );
  return (
    <span className="shop-pic">
      <img src={p.image} alt={p.name} width="800" height="800" loading={eager ? "eager" : "lazy"} />
      {p.images?.[1] && <img className="shop-pic-alt" src={p.images[1]} alt="" width="800" height="800" loading="lazy" aria-hidden="true" />}
    </span>
  );
}

// Ficha de un producto: galería, puntos clave, compra y productos relacionados
// Selector de una opción: muestras de color, foto o botón de texto
function OptionPicker({ o, value, onChange }) {
  const current = o.values.find((x) => x.id === value);
  return (
    <fieldset className="shop-opt">
      <legend>
        {o.name}: <b>{current?.label}</b>
      </legend>
      <div className="shop-opt-values">
        {o.values.map((x) => (
          <button
            key={x.id}
            type="button"
            className={`shop-opt-btn${x.image ? " has-img" : x.swatch ? " has-swatch" : ""}`}
            aria-pressed={x.id === value}
            aria-label={x.label}
            title={x.label}
            onClick={() => onChange(x.id)}
          >
            {x.image ? (
              <img src={x.image} alt="" width="64" height="64" loading="lazy" />
            ) : x.swatch ? (
              <span className="shop-swatch" style={{ background: x.swatch }} />
            ) : (
              x.label
            )}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ProductDetail({ p, onAdd, onBuy }) {
  const [shot, setShot] = useState(0);
  const [sel, setSel] = useState(() => (p.variants ? { ...p.variants[0].sel } : {}));
  // Variante de la combinación elegida; si no existe, la primera que tenga la última opción tocada
  const variant = p.variants ? p.variants.find((x) => p.options.every((o) => x.sel[o.name] === sel[o.name])) || null : null;
  const price = variant ? variant.price : p.price;
  const choose = (name, id) => {
    const next = { ...sel, [name]: id };
    const ok = p.variants.find((x) => p.options.every((o) => x.sel[o.name] === next[o.name]));
    setSel(ok ? next : { ...(p.variants.find((x) => x.sel[name] === id) || p.variants[0]).sel });
    const val = p.options.find((o) => o.name === name)?.values.find((x) => x.id === id);
    if (val?.image) setShot(-1);
  };
  // Foto de la opción elegida (si tiene) delante de la galería
  const optImage = p.options?.map((o) => o.values.find((x) => x.id === sel[o.name])?.image).find(Boolean);
  const pics = [...(optImage && !p.images.includes(optImage) ? [optImage] : []), ...(p.images || [])];
  const shown = shot === -1 ? 0 : Math.min(shot, pics.length - 1);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const cat = categories.find((c) => c.id === p.category);
  const shareText = `Mira esto de la tienda de AlpiCars: ${p.name} (${priceText(p).toLowerCase()})`;
  const shareUrl = () => `${window.location.origin}/tienda/${p.id}?utm_source=whatsapp&utm_medium=share`;
  const share = async () => {
    track("share_click", { channel: "product", id: p.id });
    if (navigator.share) {
      try {
        await navigator.share({ title: p.name, text: shareText, url: shareUrl() });
        return;
      } catch {
        /* cancelado: probamos WhatsApp */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl()}`)}`, "_blank", "noopener");
  };

  return (
    <>
      <nav className="guide-crumbs shop-crumbs" aria-label="Migas de pan">
        <a href="/tienda">Tienda</a> / <span>{cat?.label}</span>
      </nav>
      <article className="shop-product">
        <div className="shop-gallery">
          <div className="shop-gallery-main">
            {pics.length ? <img src={pics[shown]} alt={p.name} width="800" height="800" /> : <ProductImage p={p} />}
          </div>
          {pics.length > 1 && (
            <div className="shop-thumbs" role="list">
              {pics.map((src, i) => (
                <button key={src} type="button" role="listitem" aria-label={`Foto ${i + 1}`} aria-pressed={shown === i} onClick={() => setShot(i)}>
                  <img src={src} alt="" width="160" height="160" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="shop-info">
          <h1>{p.name}</h1>
          <p className="shop-price">{eur(price)}</p>
          <p className="shop-lead">{p.short}</p>
          {p.options?.map((o) => (
            <OptionPicker key={o.name} o={o} value={sel[o.name]} onChange={(id) => choose(o.name, id)} />
          ))}
          <div className="shop-buy">
            <button type="button" className="btn btn-accent" onClick={() => onBuy(p.id, variant?.sku)}>
              Comprar ahora
              <ArrowIcon />
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => onAdd(p.id, variant?.sku)}>
              Añadir al carrito
            </button>
          </div>
          <ul className="shop-perks">
            <li>{shop.freeShippingFrom ? `Envío gratis a partir de ${eur(shop.freeShippingFrom)} (si no, ${eur(shop.shipping)})` : `Envío: ${eur(shop.shipping)}`}</li>
            <li>{shop.deliveryTime}, con número de seguimiento</li>
            <li>Devolución en 14 días y garantía de 3 años</li>
            <li>Pago seguro con tarjeta, Apple Pay o Google Pay</li>
          </ul>
          {p.features?.length > 0 && (
            <>
              <h2>Lo que tienes que saber</h2>
              <ul className="shop-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </>
          )}
          <p className="shop-text">{p.text}</p>
          <button type="button" className="share-btn shop-share" onClick={share}>
            Compartir este producto
          </button>
        </div>
      </article>

      {related.length > 0 && (
        <section className="shop-related">
          <h2>También te puede interesar</h2>
          <ul className="shop-grid">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} onAdd={onAdd} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function ProductCard({ p, onAdd }) {
  const href = `/tienda/${p.id}`;
  return (
    <li className="shop-card">
      <a href={href} className="shop-card-pic" tabIndex={-1} aria-hidden="true">
        <ProductImage p={p} />
      </a>
      <div className="shop-card-body">
        <h2>
          <a href={href}>{p.name}</a>
        </h2>
        <p>{p.short}</p>
        {p.options && <p className="shop-card-opts">{p.options.map((o) => `${o.values.length} ${o.name.toLowerCase()}`).join(" · ")}</p>}
        <div className="shop-card-foot">
          <strong>{priceText(p)}</strong>
          {p.variants && p.variants.length > 1 ? (
            <a className="btn btn-accent btn-small" href={href} aria-label={`Elegir opciones de ${p.name}`}>
              Elegir
            </a>
          ) : (
            <button type="button" className="btn btn-accent btn-small" onClick={() => onAdd(p.id)} aria-label={`Añadir ${p.name} al carrito`}>
              Añadir
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export default function ShopPage({ productId = null }) {
  const product = productId ? products.find((p) => p.id === productId) : null;
  const [cart, setCart] = useState([]);
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("cart"); // cart → datos
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    rememberOrigin();
    setCart(readCart());
    setCancelled(new URLSearchParams(window.location.search).get("pago") === "cancelado");
  }, []);

  // Cerrar el carrito con la tecla Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.querySelector(".shop-drawer button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const update = (next) => {
    setCart(next);
    saveCart(next);
  };
  const withSku = (id, sku) => {
    const p = products.find((x) => x.id === id);
    return { id, sku: p?.variants ? (getVariant(p, sku) || p.variants[0]).sku : "" };
  };
  const add = (id, sku) => {
    const item = withSku(id, sku);
    const key = lineKey(item);
    const found = cart.find((it) => lineKey(it) === key);
    update(found ? cart.map((it) => (lineKey(it) === key ? { ...it, qty: Math.min(10, it.qty + 1) } : it)) : [...cart, { ...item, qty: 1 }]);
    setStep("cart");
    setOpen(true);
    track("shop_add", { id, sku: item.sku });
  };
  // "Comprar ahora": añade (si no está) y abre directamente los datos de envío
  const buyNow = (id, sku) => {
    const item = withSku(id, sku);
    if (!cart.some((it) => lineKey(it) === lineKey(item))) update([...cart, { ...item, qty: 1 }]);
    setStep("datos");
    setOpen(true);
    track("shop_buy_now", { id, sku: item.sku });
  };
  const setQty = (key, qty) => update(qty <= 0 ? cart.filter((it) => lineKey(it) !== key) : cart.map((it) => (lineKey(it) === key ? { ...it, qty: Math.min(10, qty) } : it)));

  const lines = cart
    .map((it) => {
      const r = resolveLine(it.id, it.sku);
      return r && { ...it, key: lineKey(it), p: r.p, price: r.price, label: r.label, image: (r.p.options || []).map((o) => o.values.find((x) => x.id === r.variant?.sel[o.name])?.image).find(Boolean) || r.p.image };
    })
    .filter(Boolean);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= shop.freeShippingFrom ? 0 : shop.shipping;
  const total = subtotal + shipping;
  const missingForFree = Math.max(0, shop.freeShippingFrom - subtotal);

  const list = useMemo(() => (cat === "all" ? products : products.filter((p) => p.category === cat)), [cat]);

  const checkout = async (e) => {
    e.preventDefault();
    setMsg("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setSending(true);
    track("checkout_start", { total: Math.round(total * 100) / 100 });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, customer: data }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.url) {
        window.location.href = out.url;
        return;
      }
      if (out.error === "demo") setMsg("La tienda abre muy pronto: todavía no se pueden hacer pagos. Escríbenos y te avisamos.");
      else if (out.error === "customer") setMsg("Revisa los datos de envío: faltan campos o el código postal no es válido.");
      else setMsg("No hemos podido iniciar el pago. Inténtalo de nuevo en unos minutos.");
    } catch {
      setMsg("No hemos podido conectar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <ShopShell cartCount={count} onCart={() => setOpen(true)}>
      {product ? (
        <ProductDetail p={product} onAdd={add} onBuy={buyNow} />
      ) : (
      <>
      <section className="shop-hero">
        <h1>Cuida tu coche como el primer día</h1>
        <p>Productos de detailing y accesorios seleccionados por AlpiCars, con envío a toda España.</p>
        {cancelled && <p className="shop-note">El pago se ha cancelado. Tu carrito sigue aquí.</p>}
      </section>

      <div className="shop-filters" role="tablist" aria-label="Categorías">
        {[{ id: "all", label: "Todo" }, ...categories].map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <ul className="shop-grid">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} onAdd={add} />
        ))}
      </ul>
      </>
      )}

      {open && (
        <div className="shop-drawer-bg" onClick={() => setOpen(false)}>
          <aside className="shop-drawer" role="dialog" aria-modal="true" aria-label="Carrito" onClick={(e) => e.stopPropagation()}>
            <div className="shop-drawer-head">
              <h2>{step === "cart" ? "Tu carrito" : "Datos de envío"}</h2>
              <button type="button" className="shop-x" onClick={() => setOpen(false)} aria-label="Cerrar">
                <X />
              </button>
            </div>

            {lines.length === 0 ? (
              <p className="shop-empty">Tu carrito está vacío.</p>
            ) : step === "cart" ? (
              <>
                <ul className="shop-lines">
                  {lines.map((l) => (
                    <li key={l.key}>
                      <span className="shop-line-name">
                        {l.image && <img src={l.image} alt="" width="48" height="48" />}
                        <span>
                          {l.p.name}
                          {l.label && <small>{l.label}</small>}
                        </span>
                      </span>
                      <span className="shop-qty">
                        <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Quitar uno">
                          <Minus />
                        </button>
                        <span>{l.qty}</span>
                        <button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Añadir uno">
                          <Plus />
                        </button>
                      </span>
                      <span className="shop-line-price">{eur(l.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="shop-sum">
                  <div><dt>Subtotal</dt><dd>{eur(subtotal)}</dd></div>
                  <div><dt>Envío</dt><dd>{shipping === 0 ? "Gratis" : eur(shipping)}</dd></div>
                  <div className="shop-total"><dt>Total (IVA incluido)</dt><dd>{eur(total)}</dd></div>
                </dl>
                {missingForFree > 0 && <p className="shop-note">Te faltan {eur(missingForFree)} para el envío gratis.</p>}
                <button type="button" className="btn btn-accent btn-block" onClick={() => setStep("datos")}>
                  Continuar
                  <ArrowIcon />
                </button>
              </>
            ) : (
              <form className="form shop-form" onSubmit={checkout}>
                <div className="shop-two">
                  <label><span>Nombre</span><input name="name" autoComplete="given-name" required /></label>
                  <label><span>Apellidos</span><input name="surname" autoComplete="family-name" required /></label>
                </div>
                <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
                <label><span>Teléfono</span><input name="phone" type="tel" autoComplete="tel" /></label>
                <label><span>Dirección</span><input name="address" autoComplete="street-address" required placeholder="Calle, número, piso" /></label>
                <div className="shop-two">
                  <label><span>Código postal</span><input name="zip" inputMode="numeric" pattern="\d{5}" autoComplete="postal-code" required /></label>
                  <label><span>Ciudad</span><input name="city" autoComplete="address-level2" required /></label>
                </div>
                <label><span>Provincia</span><input name="province" autoComplete="address-level1" required /></label>
                <label className="check">
                  <input type="checkbox" required />
                  <span>
                    Acepto las <a href="/tienda/condiciones" target="_blank" rel="noopener noreferrer">condiciones de venta</a> y la{" "}
                    <a href="/privacidad" target="_blank" rel="noopener noreferrer">política de privacidad</a>.
                  </span>
                </label>
                <p className="shop-note">{shop.deliveryTime}. El pago es seguro con tarjeta, Apple Pay o Google Pay.</p>
                <button type="submit" className="btn btn-accent btn-block" disabled={sending}>
                  {sending ? "Abriendo el pago…" : `Pagar ${eur(total)}`}
                </button>
                {msg && <p className="shop-msg" role="alert">{msg}</p>}
                <button type="button" className="shop-back" onClick={() => setStep("cart")}>
                  Volver al carrito
                </button>
              </form>
            )}
          </aside>
        </div>
      )}
    </ShopShell>
  );
}

export function ShopThanks() {
  const [code, setCode] = useState("");
  useEffect(() => {
    saveCart([]);
    const sid = new URLSearchParams(window.location.search).get("pedido");
    if (sid) setCode(orderCode(sid));
  }, []);
  return (
    <ShopShell>
      <section className="shop-hero">
        <h1>¡Gracias por tu pedido!</h1>
        {code && (
          <p>
            Tu código de pedido es <b>{code}</b>. Guárdalo para seguir el envío.
          </p>
        )}
        <p>Te enviamos la confirmación por email y te avisamos con el número de seguimiento cuando salga. {shop.deliveryTime}.</p>
        <p className="report-cta-actions">
          <a className="btn btn-accent" href={code ? `/seguimiento?pedido=${code}` : "/seguimiento"}>Seguir mi pedido</a>
          <a className="btn btn-ghost" href="/tienda">Seguir comprando</a>
        </p>
      </section>
    </ShopShell>
  );
}

export function ShopTerms() {
  return (
    <ShopShell>
      <section className="shop-terms">
        <LegalBody doc={tiendaCondiciones(shop, eur)} />
      </section>
    </ShopShell>
  );
}
