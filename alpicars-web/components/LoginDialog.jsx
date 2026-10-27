"use client";

import { useEffect, useRef, useState } from "react";
import config from "../content/config";
import { useSite } from "./SiteProvider";
import { hasSupabase, sendPasswordReset, signIn, signInWithGoogle, signUp } from "../lib/supabase";
import { track } from "../lib/track";

// Acceso y registro de clientes (Supabase Auth: email y contraseña; Google si está activado en config).
// Registrarse da acceso a las ofertas exclusivas, a los informes guardados y al enlace para recomendar.

const ERRORS = {
  "Invalid login credentials": "El email o la contraseña no son correctos.",
  "Email not confirmed": "Confirma tu email: te hemos enviado un enlace al registrarte.",
  "User already registered": "Ya hay una cuenta con ese email. Entra con tu contraseña.",
};

export default function LoginDialog() {
  const { loginOpen, setLoginOpen, loginMode, setLoginMode } = useSite();
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
        if (needsConfirm) setDone("¡Cuenta creada! Te hemos enviado un email para confirmarla. Ábrelo y entrarás directamente a tu área.");
        else window.location.href = "/cuenta";
      } else if (mode === "reset") {
        await sendPasswordReset(f.email);
        setDone("Si el email está registrado, te llegará un enlace para crear una contraseña nueva.");
      } else {
        await signIn(f.email, f.password);
        track("login");
        window.location.href = "/cuenta";
      }
    } catch (err) {
      setMsg(ERRORS[err.message] || "No se ha podido completar. Revisa los datos e inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const title = mode === "signup" ? "Crea tu cuenta" : mode === "reset" ? "Recuperar contraseña" : "Accede a tu cuenta";

  return (
    <dialog ref={ref} className="dlg dlg-login" onClose={close} aria-labelledby="login-title">
      <div className="dlg-head">
        <h2 id="login-title">{title}</h2>
        <button type="button" className="dlg-x" onClick={close} aria-label="Cerrar">
          <span />
          <span />
        </button>
      </div>

      {!hasSupabase ? (
        <p className="dlg-msg" role="status">
          El área de clientes estará disponible muy pronto. Mientras tanto, escríbenos por WhatsApp o pide tu presupuesto.
        </p>
      ) : done ? (
        <p className="dlg-msg" role="status">{done}</p>
      ) : (
        <>
          {mode !== "reset" && (
            <>
              <p className="login-perk">Con tu cuenta tienes ofertas exclusivas, tus informes guardados y tu enlace para recomendarnos.</p>
              <div className="seg" role="tablist">
                <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => setLoginMode("login")}>
                  Acceder
                </button>
                <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => setLoginMode("signup")}>
                  Registrarme
                </button>
              </div>
            </>
          )}
          <form className="form" onSubmit={onSubmit}>
            {mode === "signup" && (
              <label>
                <span>Nombre</span>
                <input name="name" autoComplete="name" required maxLength={120} />
              </label>
            )}
            <label>
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>
            {mode === "signup" && (
              <label>
                <span>Teléfono (opcional)</span>
                <input type="tel" name="phone" autoComplete="tel" maxLength={30} />
              </label>
            )}
            {mode !== "reset" && (
              <label>
                <span>Contraseña</span>
                <input type="password" name="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} />
              </label>
            )}
            {mode === "signup" && (
              <>
                <label className="check">
                  <input type="checkbox" name="marketing" defaultChecked />
                  <span>Quiero recibir ofertas exclusivas y avisos de coches que encajen conmigo.</span>
                </label>
                <label className="check">
                  <input type="checkbox" required />
                  <span>
                    Acepto la <a href="/privacidad" target="_blank" rel="noopener noreferrer">política de privacidad</a>.
                  </span>
                </label>
              </>
            )}
            <button className="btn btn-accent btn-block" type="submit" disabled={busy}>
              {busy ? "Un momento…" : mode === "login" ? "Acceder" : mode === "signup" ? "Crear cuenta" : "Enviar enlace"}
            </button>
            {msg && <p className="form-error" role="alert">{msg}</p>}
          </form>
          {config.googleLogin && mode !== "reset" && (
            <button type="button" className="btn btn-ghost btn-block login-google" onClick={signInWithGoogle}>
              Continuar con Google
            </button>
          )}
          <p className="login-alt">
            {mode === "reset" ? (
              <button type="button" className="link-btn" onClick={() => setLoginMode("login")}>Volver a acceder</button>
            ) : (
              <button type="button" className="link-btn" onClick={() => setLoginMode("reset")}>¿Has olvidado la contraseña?</button>
            )}
          </p>
        </>
      )}
    </dialog>
  );
}
