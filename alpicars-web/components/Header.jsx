"use client";

import { useEffect, useRef, useState } from "react";
import config from "../content/config";
import { useSite } from "./SiteProvider";
import { ChevronIcon, UserIcon, WhatsAppIcon } from "./Icons";
import LoginDialog from "./LoginDialog";

const waLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappText)}`;

function LanguageMenu() {
  const { lang, setLang, t, hasTranslation } = useSite();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = config.languages.find((l) => l.code === lang) || config.languages[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="ctl"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.header.languageLabel}: ${current.label}`}
        onClick={() => setOpen((v) => !v)}
      >
        {current.short}
        <ChevronIcon />
      </button>
      {open && (
        <ul className="lang-list" role="listbox" aria-label={t.header.languageLabel}>
          {config.languages.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
              >
                <span>{l.label}</span>
                <span className="lang-code">{l.short}</span>
              </button>
            </li>
          ))}
          {!hasTranslation && <li className="lang-note">{t.header.languageSoon}</li>}
        </ul>
      )}
    </div>
  );
}

function CurrencySwitch() {
  const { currency, setCurrency, t } = useSite();
  return (
    <div className="currency" role="group" aria-label={t.header.currencyLabel}>
      {["EUR", "CHF"].map((c) => (
        <button key={c} type="button" aria-pressed={currency === c} onClick={() => setCurrency(c)}>
          {c === "EUR" ? "€" : "CHF"}
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const { t } = useSite();
  const [loginOpen, setLoginOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // La barra fija avisa al resto de la página (por ejemplo, el contador de km en el móvil)
  useEffect(() => {
    document.documentElement.classList.toggle("is-compact", compact);
  }, [compact]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="hdr-top">
          <a href="#inicio" className="hdr-logo" aria-label="AlpiCars, inicio">
            <img src="/logo-horizontal-white.png" alt="AlpiCars" width="945" height="172" />
          </a>
          <p className="hdr-slogan">{config.slogan}</p>
          <button
            type="button"
            className="ctl menu-btn"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`menu-icon${menuOpen ? " is-open" : ""}`} aria-hidden="true">
              <i />
              <i />
            </span>
            {menuOpen ? t.header.menuClose : t.header.menu}
          </button>
          <div className="hdr-tools">
            <LanguageMenu />
            <CurrencySwitch />
            <a className="wa-btn" href={waLink} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              <span>{t.header.whatsapp}</span>
            </a>
            <button type="button" className="ctl login-btn" onClick={() => setLoginOpen(true)}>
              <UserIcon />
              <span>{t.header.login}</span>
            </button>
          </div>
        </div>
        <nav className="hdr-nav" aria-label="Principal">
          <ul>
            {t.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
          <a className="btn btn-accent" href="#presupuesto">
            {t.header.cta}
          </a>
        </nav>
        {menuOpen && (
          <nav className="menu-panel" id="menu-movil" aria-label={t.header.menu}>
            <ul>
              {t.nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} onClick={closeMenu}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <a className="btn btn-accent btn-block" href="#presupuesto" onClick={closeMenu}>
              {t.header.cta}
            </a>
          </nav>
        )}
      </header>

      <div className={`sticky-bar${compact ? " is-on" : ""}`} aria-hidden={!compact}>
        <a href="#inicio" className="sb-logo" tabIndex={compact ? 0 : -1} aria-label="AlpiCars, inicio">
          <img src="/logo-mark-white.png" alt="" width="406" height="234" />
        </a>
        <ul>
          {t.nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} tabIndex={compact ? 0 : -1}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="wa-btn wa-round" href={waLink} target="_blank" rel="noopener noreferrer" tabIndex={compact ? 0 : -1} aria-label="WhatsApp">
          <WhatsAppIcon />
        </a>
        <a className="btn btn-accent" href="#presupuesto" tabIndex={compact ? 0 : -1}>
          {t.header.cta}
        </a>
      </div>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
