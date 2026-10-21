"use client";

import { useEffect, useRef, useState } from "react";

// Acceso y registro de clientes.
// TODO (fase 2): conectar con Supabase Auth (email + contraseña y "Continuar con Google")
// y crear la página de perfil con email, teléfono, foto y preferencias.

export default function LoginDialog({ open, onClose }) {
  const ref = useRef(null);
  const [mode, setMode] = useState("login");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setSent(false);
      d.showModal();
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className="dlg" onClose={onClose} aria-labelledby="login-title">
      <div className="dlg-head">
        <h2 id="login-title">{mode === "login" ? "Accede a tu cuenta" : "Crea tu cuenta"}</h2>
        <button type="button" className="dlg-x" onClick={onClose} aria-label="Cerrar">
          <span />
          <span />
        </button>
      </div>
      <div className="seg" role="tablist">
        <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => setMode("login")}>
          Acceder
        </button>
        <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => setMode("signup")}>
          Registrarme
        </button>
      </div>
      {sent ? (
        <p className="dlg-msg" role="status">
          El área de clientes estará disponible muy pronto. Mientras tanto, escríbenos por WhatsApp o pide tu presupuesto y te atendemos personalmente.
        </p>
      ) : (
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          {mode === "signup" && (
            <label>
              <span>Nombre</span>
              <input name="name" autoComplete="name" required />
            </label>
          )}
          <label>
            <span>Email</span>
            <input type="email" name="email" autoComplete="email" required />
          </label>
          {mode === "signup" && (
            <label>
              <span>Teléfono</span>
              <input type="tel" name="phone" autoComplete="tel" />
            </label>
          )}
          <label>
            <span>Contraseña</span>
            <input type="password" name="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} />
          </label>
          <button className="btn btn-accent btn-block" type="submit">
            {mode === "login" ? "Acceder" : "Crear cuenta"}
          </button>
        </form>
      )}
    </dialog>
  );
}
