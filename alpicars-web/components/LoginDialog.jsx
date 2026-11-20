"use client";

import { useEffect, useRef, useState } from "react";
import config from "../content/config";
import { useSite } from "./SiteProvider";
import { hasSupabase, sendPasswordReset, signIn, signInWithGoogle, signUp } from "../lib/supabase";
import { track } from "../lib/track";

// Acceso y registro de clientes (Supabase Auth: email y contraseña; Google si está activado en config).
// Registrarse da acceso a las ofertas exclusivas, a los informes guardados y al enlace para recomendar.

const ERRORS = { "Invalid login credentials": "errCreds", "Email not confirmed": "errConfirm", "User already registered": "errExists" };

export default function LoginDialog() {
  const { loginOpen, setLoginOpen, loginMode, setLoginMode, t } = useSite();
  const L = t.login;
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (loginOpen && !d.open) {
      setMsg("");
      setDone("");
      d.showModal();
    }
    if (!loginOpen && d.open) d.close();
  }, [loginOpen]);

  const close = () => setLoginOpen(false);
  const mode = loginMode;

  const onSubmit = async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setMsg("");
    try {
      if (mode === "signup") {
        let referredBy = "";
        try {
          referredBy = localStorage.getItem("alpicars-ref") || "";
        } catch {
          /* nada */
        }
        const { needsConfirm } = await signUp({
          email: f.email,
          password: f.password,
          fullName: f.name,
          phone: f.phone,
          marketingOk: f.marketing === "on",
          referredBy,
        });
        track("signup");
        if (needsConfirm) setDone(L.created);
        else window.location.href = "/cuenta";
      } else if (mode === "reset") {
        await sendPasswordReset(f.email);
        setDone(L.resetSent);
      } else {
        await signIn(f.email, f.password);
        track("login");
        window.location.href = "/cuenta";
      }
    } catch (err) {
      setMsg(L[ERRORS[err.message]] || L.errGeneric);
    } finally {
      setBusy(false);
    }
  };

  const title = mode === "signup" ? L.titleSignup : mode === "reset" ? L.titleReset : L.titleLogin;

  return (
    <dialog ref={ref} className="dlg dlg-login" onClose={close} aria-labelledby="login-title">
      <div className="dlg-head">
        <h2 id="login-title">{title}</h2>
        <button type="button" className="dlg-x" onClick={close} aria-label={L.close}>
          <span />
          <span />
        </button>
      </div>

      {!hasSupabase ? (
        <p className="dlg-msg" role="status">
          {L.soon}
        </p>
      ) : done ? (
        <p className="dlg-msg" role="status">{done}</p>
      ) : (
        <>
          {mode !== "reset" && (
            <>
              <p className="login-perk">{L.perk}</p>
              <div className="seg" role="tablist">
                <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => setLoginMode("login")}>
                  {L.tabLogin}
                </button>
                <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => setLoginMode("signup")}>
                  {L.tabSignup}
                </button>
              </div>
            </>
          )}
          <form className="form" onSubmit={onSubmit}>
            {mode === "signup" && (
              <label>
                <span>{L.name}</span>
                <input name="name" autoComplete="name" required maxLength={120} />
              </label>
            )}
            <label>
              <span>{L.email}</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>
            {mode === "signup" && (
              <label>
                <span>{L.phone}</span>
                <input type="tel" name="phone" autoComplete="tel" maxLength={30} />
              </label>
            )}
            {mode !== "reset" && (
              <label>
                <span>{L.password}</span>
                <input type="password" name="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} />
              </label>
            )}
            {mode === "signup" && (
              <>
                <label className="check">
                  <input type="checkbox" name="marketing" />
                  <span>{L.marketing}</span>
                </label>
                <label className="check">
                  <input type="checkbox" required />
                  <span>
                    {L.privacyPre} <a href="/privacidad" target="_blank" rel="noopener noreferrer">{L.privacyLink}</a>.
                  </span>
                </label>
              </>
            )}
            <button className="btn btn-accent btn-block" type="submit" disabled={busy}>
              {busy ? L.wait : mode === "login" ? L.submitLogin : mode === "signup" ? L.submitSignup : L.submitReset}
            </button>
            {msg && <p className="form-error" role="alert">{msg}</p>}
          </form>
          {config.googleLogin && mode !== "reset" && (
            <button type="button" className="btn btn-ghost btn-block login-google" onClick={signInWithGoogle}>
              {L.google}
            </button>
          )}
          <p className="login-alt">
            {mode === "reset" ? (
              <button type="button" className="link-btn" onClick={() => setLoginMode("login")}>{L.back}</button>
            ) : (
              <button type="button" className="link-btn" onClick={() => setLoginMode("reset")}>{L.forgot}</button>
            )}
          </p>
        </>
      )}
    </dialog>
  );
}
