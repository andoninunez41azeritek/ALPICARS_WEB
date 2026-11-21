"use client";

import { useEffect, useMemo, useState } from "react";
import config from "../content/config";
import products, { categories, shop, resolveLine, getVariant } from "../content/products";
import { ArrowIcon } from "./Icons";
import { rememberOrigin, track } from "../lib/track";
import { orderCode } from "../lib/orderCode";
import { LegalBody } from "./LegalDoc";
import { tiendaCondiciones } from "../content/legal";
import { LANGS, fill, localLabel, localizeProduct, money, setLang, shopT } from "../lib/shopI18n";
import useShopLang from "../lib/useShopLang";

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

const eur = (n) => money(n, "es");

// Idioma de la tienda + textos + productos traducidos
export function useShop() {
  const lang = useShopLang();
  const T = shopT(lang);
  return { lang, T, eur: (n) => money(n, lang), L: (p) => localizeProduct(p, lang) };
}
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

// Precio de la tarjeta: "Desde 12,99 €" si hay opciones con precios distintos
const priceText = (p, T, fmt) => (p.priceFrom < p.priceTo ? fill(T.from, { p: fmt(p.priceFrom) }) : fmt(p.priceFrom));
function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* sin almacenamiento: el carrito vive solo en esta visita */
  }
}

const BackIcon = () => <Icon d="M15 18l-6-6 6-6" />;

function LangPicker() {
  const { lang } = useShop();
  return (
    <label className="shop-lang">
      <span className="sr-only">Idioma / Language</span>
      <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Idioma / Language">
        {LANGS.map((l) => (
          <option key={l} value={l}>
            {l.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ShopShell({ children, cartCount = 0, onCart, back = { href: "/", key: "site" } }) {
  const { T, eur } = useShop();
  const backLabel = T.back[back.key] || back.label;
  return (
    <div className="shop">
      <header className="shop-header">
        <a className="shop-back-btn" href={back.href} aria-label={backLabel}>
          <BackIcon />
          <span>{backLabel}</span>
        </a>
        <a className="shop-logo" href="/tienda" aria-label={T.logoAria}>
          <img src="/logo-horizontal-white.png" alt="AlpiCars" width="945" height="172" />
          <span>{T.shop}</span>
        </a>
        <nav className="shop-nav">
          <a href="/">{T.importCar}</a>
          <LangPicker />
          {onCart && (
            <button type="button" className="shop-cart-btn" onClick={onCart} aria-label={cartCount === 1 ? T.cartAria1 : fill(T.cartAria, { n: cartCount })}>
              {T.cart}
              <span className="shop-badge">{cartCount}</span>
            </button>
          )}
        </nav>
      </header>
      <main className="shop-main">{children}</main>
      <footer className="shop-footer">
        <p>
          AlpiCars · <a href={`mailto:${config.email}`}>{config.email}</a> · {T.delivery} ·{" "}
          {shop.freeShippingFrom ? fill(T.freeFrom, { p: eur(shop.freeShippingFrom) }) : ""}
        </p>
        <p>
          <a href="/seguimiento">{T.tracking}</a> · <a href="/tienda/condiciones">{T.terms}</a> · <a href="/privacidad">{T.privacy}</a>
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
        {o.label || o.name}: <b>{current?.label}</b>
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
  const { T, eur, L } = useShop();
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
  // (solo si el cliente ha cambiado la opción: la marcada por defecto ya sale en la portada)
  const changed = p.variants && p.options.some((o) => sel[o.name] !== p.variants[0].sel[o.name]);
  const optImage = changed ? p.options.map((o) => o.values.find((x) => x.id === sel[o.name])?.image).find(Boolean) : null;
  const pics = [...(optImage && !p.images.includes(optImage) ? [optImage] : []), ...(p.images || [])];
  const shown = shot === -1 ? 0 : Math.min(shot, pics.length - 1);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4).map(L);
  const catLabel = T.categories[p.category] || categories.find((c) => c.id === p.category)?.label;
  const shareText = fill(T.shareText, { name: p.name, p: priceText(p, T, eur).toLowerCase() });
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
      <nav className="guide-crumbs shop-crumbs" aria-label={T.crumbs}>
        <a href="/tienda">{T.shop}</a> / <span>{catLabel}</span>
      </nav>
      <article className="shop-product">
        <div className="shop-gallery">
          <div className="shop-gallery-main">
            {pics.length ? <img src={pics[shown]} alt={p.name} width="800" height="800" /> : <ProductImage p={p} />}
          </div>
          {pics.length > 1 && (
            <div className="shop-thumbs" role="list">
              {pics.map((src, i) => (
                <button key={src} type="button" role="listitem" aria-label={fill(T.photo, { n: i + 1 })} aria-pressed={shown === i} onClick={() => setShot(i)}>
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
              {T.buyNow}
              <ArrowIcon />
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => onAdd(p.id, variant?.sku)}>
              {T.addToCart}
            </button>
          </div>
          <ul className="shop-perks">
            <li>{shop.freeShippingFrom ? fill(T.perkShipFree, { free: eur(shop.freeShippingFrom), ship: eur(shop.shipping) }) : fill(T.perkShip, { ship: eur(shop.shipping) })}</li>
            <li>{fill(T.perkDelivery, { delivery: T.delivery })}</li>
            <li>{T.perkReturn}</li>
            <li>{T.perkPay}</li>
          </ul>
          {p.features?.length > 0 && (
            <>
              <h2>{T.mustKnow}</h2>
              <ul className="shop-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </>
          )}
          <p className="shop-text">{p.text}</p>
          <button type="button" className="share-btn shop-share" onClick={share}>
            {T.share}
          </button>
        </div>
      </article>

      {related.length > 0 && (
        <section className="shop-related">
          <h2>{T.related}</h2>
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
  const { T, eur } = useShop();
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
        {p.options && (
          <p className="shop-card-opts">
            {p.options.map((o, i) => {
              const colors = o.values.filter((x) => x.swatch);
              return (
                <span key={o.name}>
                  {i > 0 && " · "}
                  {colors.length > 1 && (
                    <span className="shop-card-dots" aria-hidden="true">
                      {colors.slice(0, 8).map((x) => (
                        <i key={x.id} style={{ background: x.swatch }} title={x.label} />
                      ))}
                    </span>
                  )}
                  {o.values.length} {T.plural[o.name] || T.optionsWord}
                </span>
              );
            })}
          </p>
        )}
        <div className="shop-card-foot">
          <strong>{priceText(p, T, eur)}</strong>
          {p.variants && p.variants.length > 1 ? (
            <a className="btn btn-accent btn-small" href={href} aria-label={fill(T.chooseAria, { name: p.name })}>
              {T.choose}
            </a>
          ) : (
            <button type="button" className="btn btn-accent btn-small" onClick={() => onAdd(p.id)} aria-label={fill(T.addAria, { name: p.name })}>
              {T.add}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export default function ShopPage({ productId = null }) {
  const { lang, T, eur, L } = useShop();
  const product = productId ? L(products.find((p) => p.id === productId)) : null;
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
      const lp = L(r?.p);
      return r && { ...it, key: lineKey(it), p: lp, price: r.price, label: localLabel(lp, r.variant), image: (r.p.options || []).map((o) => o.values.find((x) => x.id === r.variant?.sel[o.name])?.image).find(Boolean) || r.p.image };
    })
    .filter(Boolean);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= shop.freeShippingFrom ? 0 : shop.shipping;
  const total = subtotal + shipping;
  const missingForFree = Math.max(0, shop.freeShippingFrom - subtotal);

  const list = useMemo(() => (cat === "all" ? products : products.filter((p) => p.category === cat)).map(L), [cat, lang]); // eslint-disable-line react-hooks/exhaustive-deps

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
        body: JSON.stringify({ items: cart, customer: data, lang }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.url) {
        window.location.href = out.url;
        return;
      }
      if (out.error === "demo") setMsg(T.errDemo);
      else if (out.error === "customer") setMsg(T.errCustomer);
      else setMsg(T.errPay);
    } catch {
      setMsg(T.errNet);
    } finally {
      setSending(false);
    }
  };

  return (
    <ShopShell cartCount={count} onCart={() => setOpen(true)} back={product ? { href: "/tienda", key: "shop" } : { href: "/", key: "home" }}>
      {product ? (
        <ProductDetail p={product} onAdd={add} onBuy={buyNow} />
      ) : (
      <>
      <section className="shop-hero">
        <h1>{T.heroTitle}</h1>
        <p>{T.heroText}</p>
        {cancelled && <p className="shop-note">{T.cancelled}</p>}
      </section>

      <div className="shop-filters" role="tablist" aria-label={T.categoriesAria}>
        {[{ id: "all", label: T.all }, ...categories.map((c) => ({ ...c, label: T.categories[c.id] || c.label }))].map((c) => (
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
          <aside className="shop-drawer" role="dialog" aria-modal="true" aria-label={T.cart} onClick={(e) => e.stopPropagation()}>
            <div className="shop-drawer-head">
              <h2>{step === "cart" ? T.cartTitle : T.shipTitle}</h2>
              <button type="button" className="shop-x" onClick={() => setOpen(false)} aria-label={T.close}>
                <X />
              </button>
            </div>

            {lines.length === 0 ? (
              <p className="shop-empty">{T.empty}</p>
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
                        <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label={T.removeOne}>
                          <Minus />
                        </button>
                        <span>{l.qty}</span>
                        <button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label={T.addOne}>
                          <Plus />
                        </button>
                      </span>
                      <span className="shop-line-price">{eur(l.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="shop-sum">
                  <div><dt>{T.subtotal}</dt><dd>{eur(subtotal)}</dd></div>
                  <div><dt>{T.shipping}</dt><dd>{shipping === 0 ? T.free : eur(shipping)}</dd></div>
                  <div className="shop-total"><dt>{T.total}</dt><dd>{eur(total)}</dd></div>
                </dl>
                {missingForFree > 0 && <p className="shop-note">{fill(T.missing, { p: eur(missingForFree) })}</p>}
                <button type="button" className="btn btn-accent btn-block" onClick={() => setStep("datos")}>
                  {T.continue}
                  <ArrowIcon />
                </button>
              </>
            ) : (
              <form className="form shop-form" onSubmit={checkout}>
                <div className="shop-two">
                  <label><span>{T.f.name}</span><input name="name" autoComplete="given-name" required /></label>
                  <label><span>{T.f.surname}</span><input name="surname" autoComplete="family-name" required /></label>
                </div>
                <label><span>{T.f.email}</span><input name="email" type="email" autoComplete="email" required /></label>
                <label><span>{T.f.phone}</span><input name="phone" type="tel" autoComplete="tel" /></label>
                <label><span>{T.f.address}</span><input name="address" autoComplete="street-address" required placeholder={T.f.addressPh} /></label>
                <div className="shop-two">
                  <label><span>{T.f.zip}</span><input name="zip" inputMode="numeric" pattern="\d{5}" autoComplete="postal-code" required /></label>
                  <label><span>{T.f.city}</span><input name="city" autoComplete="address-level2" required /></label>
                </div>
                <label><span>{T.f.province}</span><input name="province" autoComplete="address-level1" required /></label>
                <label className="check">
                  <input type="checkbox" required />
                  <span>
                    {T.acceptPre} <a href="/tienda/condiciones" target="_blank" rel="noopener noreferrer">{T.termsLink}</a> {T.acceptMid}{" "}
                    <a href="/privacidad" target="_blank" rel="noopener noreferrer">{T.privacyLink}</a>.
                  </span>
                </label>
                <p className="shop-note">{fill(T.payNote, { delivery: T.delivery })} {T.shipOnlySpain}</p>
                <button type="submit" className="btn btn-accent btn-block" disabled={sending}>
                  {sending ? T.opening : fill(T.pay, { p: eur(total) })}
                </button>
                {msg && <p className="shop-msg" role="alert">{msg}</p>}
                <button type="button" className="shop-back" onClick={() => setStep("cart")}>
                  {T.backCart}
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
  const { T } = useShop();
  const [code, setCode] = useState("");
  useEffect(() => {
    saveCart([]);
    const sid = new URLSearchParams(window.location.search).get("pedido");
    if (sid) setCode(orderCode(sid));
  }, []);
  return (
    <ShopShell back={{ href: "/tienda", key: "shop" }}>
      <section className="shop-hero">
        <h1>{T.thanksTitle}</h1>
        {code && (
          <p>
            {T.codePre} <b>{code}</b>. {T.codePost}
          </p>
        )}
        <p>{T.thanksText} {T.delivery}.</p>
        <p className="report-cta-actions">
          <a className="btn btn-accent" href={code ? `/seguimiento?pedido=${code}` : "/seguimiento"}>{T.trackBtn}</a>
          <a className="btn btn-ghost" href="/tienda">{T.keepShopping}</a>
        </p>
      </section>
    </ShopShell>
  );
}

export function ShopTerms() {
  const { T } = useShop();
  return (
    <ShopShell back={{ href: "/tienda", key: "shop" }}>
      <section className="shop-terms">
        {T.legalNote && <p className="shop-note">{T.legalNote}</p>}
        <LegalBody doc={tiendaCondiciones(shop, eur)} />
      </section>
    </ShopShell>
  );
}
