"use client";

import { useEffect, useMemo, useState } from "react";
import config from "../content/config";
import products, { categories, shop } from "../content/products";
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

function readCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((it) => products.some((p) => p.id === it.id)) : [];
  } catch {
    return [];
  }
}
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

function ProductImage({ p }) {
  if (p.image) return <img src={p.image} alt={p.name} width="600" height="600" loading="lazy" />;
  return (
    <div className="shop-ph" aria-hidden="true">
      <span>{p.name.charAt(0)}</span>
    </div>
  );
}

export default function ShopPage() {
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
  const add = (id) => {
    const found = cart.find((it) => it.id === id);
    update(found ? cart.map((it) => (it.id === id ? { ...it, qty: Math.min(10, it.qty + 1) } : it)) : [...cart, { id, qty: 1 }]);
    setStep("cart");
    setOpen(true);
    track("shop_add", { id });
  };
  const setQty = (id, qty) => update(qty <= 0 ? cart.filter((it) => it.id !== id) : cart.map((it) => (it.id === id ? { ...it, qty: Math.min(10, qty) } : it)));

  const lines = cart.map((it) => ({ ...it, p: products.find((p) => p.id === it.id) })).filter((l) => l.p);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
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
          <li key={p.id} className="shop-card">
            <ProductImage p={p} />
            <div className="shop-card-body">
              <h2>{p.name}</h2>
              <p>{p.short}</p>
              <div className="shop-card-foot">
                <strong>{eur(p.price)}</strong>
                <button type="button" className="btn btn-accent btn-small" onClick={() => add(p.id)}>
                  Añadir
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

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
                    <li key={l.id}>
                      <span className="shop-line-name">{l.p.name}</span>
                      <span className="shop-qty">
                        <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label="Quitar uno">
                          <Minus />
                        </button>
                        <span>{l.qty}</span>
                        <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label="Añadir uno">
                          <Plus />
                        </button>
                      </span>
                      <span className="shop-line-price">{eur(l.p.price * l.qty)}</span>
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
