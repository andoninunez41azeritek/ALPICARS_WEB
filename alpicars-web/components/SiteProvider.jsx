"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import config from "../content/config";
import es from "../content/es";
import map from "../lib/mapData";
import { captureSessionFromUrl, db, getSession, hasSupabase } from "../lib/supabase";

// Cuando existan más traducciones, impórtalas y añádelas aquí: { es, en, de, ... }
const dictionaries = { es };

const SiteContext = createContext(null);

function readStored(key, fallback) {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
function store(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* sin almacenamiento disponible */
  }
}

export function SiteProvider({ children }) {
  const [lang, setLangState] = useState("es");
  const [currency, setCurrencyState] = useState("EUR");
  const [quizOpen, setQuizOpen] = useState(false);
  const [presetService, setPresetService] = useState("");
  const [presetCar, setPresetCar] = useState("");
  const [dest, setDest] = useState("madrid");
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState("login");
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [recovery, setRecovery] = useState(false);

  // Cuenta del cliente: recoge la sesión (también al volver del email o de Google) y carga su perfil
  const refreshAuth = useCallback(async () => {
    if (!hasSupabase) {
      setAuthReady(true);
      return;
    }
    const s = await getSession();
    setSession(s);
    if (s) {
      try {
        const rows = await db(`profiles?select=*&id=eq.${s.user?.id || ""}`);
        setProfile(rows?.[0] || null);
      } catch {
        setProfile(null);
      }
    } else setProfile(null);
    setAuthReady(true);
  }, []);

  useEffect(() => {
    const got = captureSessionFromUrl();
    if (got?.type === "recovery") setRecovery(true);
    refreshAuth();
    window.addEventListener("alpicars-auth", refreshAuth);
    return () => window.removeEventListener("alpicars-auth", refreshAuth);
  }, [refreshAuth]);

  const openLogin = useCallback((mode = "login") => {
    setLoginMode(mode);
    setLoginOpen(true);
  }, []);

  useEffect(() => {
    setLangState(readStored("alpicars-lang", "es"));
    // Enlaces como /?destino=barcelona#calculadora (páginas de ciudad) eligen la ciudad de entrega
    try {
      const d = new URLSearchParams(window.location.search).get("destino");
      if (d && map.routes[d]) setDest(d);
    } catch {
      /* nada */
    }
    setCurrencyState(readStored("alpicars-currency", "EUR"));
  }, []);

  const setLang = useCallback((code) => {
    setLangState(code);
    store("alpicars-lang", code);
  }, []);
  const setCurrency = useCallback((code) => {
    setCurrencyState(code);
    store("alpicars-currency", code);
  }, []);

  const formatPrice = useCallback(
    (eur) => {
      if (eur == null) return null;
      const value = currency === "CHF" ? Math.round((eur * config.chfPerEur) / 10) * 10 : eur;
      const n = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0, useGrouping: true }).format(value);
      // Intl no agrupa los números de 4 cifras en español; lo forzamos para que se lea "2.490"
      const grouped = value >= 1000 && !n.includes(".") ? n.replace(/^(\d)(\d{3})$/, "$1.$2") : n;
      return currency === "CHF" ? `CHF ${grouped}` : `${grouped} €`;
    },
    [currency]
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      currency,
      setCurrency,
      formatPrice,
      t: dictionaries[lang] || es,
      hasTranslation: Boolean(dictionaries[lang]),
      quizOpen,
      setQuizOpen,
      presetService,
      setPresetService,
      presetCar,
      setPresetCar,
      dest,
      setDest,
      loginOpen,
      setLoginOpen,
      loginMode,
      setLoginMode,
      openLogin,
      session,
      user: session?.user || null,
      profile,
      authReady,
      refreshAuth,
      recovery,
      setRecovery,
    }),
    [lang, setLang, currency, setCurrency, formatPrice, quizOpen, presetService, presetCar, dest, loginOpen, loginMode, openLogin, session, profile, authReady, refreshAuth, recovery]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite debe usarse dentro de <SiteProvider>");
  return ctx;
}
