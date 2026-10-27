// Conexión con Supabase (cuentas de clientes, solicitudes, informes guardados y ofertas).
// Usa directamente la API de Supabase con fetch, sin librerías extra.
// Datos en .env.local (y en Vercel → Settings → Environment Variables):
//   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...   (clave pública: se puede ver en el navegador, la seguridad la ponen las reglas RLS)

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SESSION_KEY = "alpicars-session";

export const hasSupabase = Boolean(URL_ && KEY);

// ---------- Sesión ----------
function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}
function writeSession(s) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* sin almacenamiento */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("alpicars-auth"));
}
function toSession(d) {
  if (!d?.access_token) return null;
  return {
    access_token: d.access_token,
    refresh_token: d.refresh_token,
    expires_at: d.expires_at || Math.floor(Date.now() / 1000) + Number(d.expires_in || 3600),
    user: d.user || null,
  };
}

async function authFetch(path, body, method = "POST", token) {
  const res = await fetch(`${URL_}/auth/v1/${path}`, {
    method,
    headers: { apikey: KEY, "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || data.error_description || data.message || "error");
  return data;
}

// Devuelve la sesión válida (la renueva si ha caducado)
export async function getSession() {
  if (!hasSupabase) return null;
  const s = readSession();
  if (!s) return null;
  if (s.expires_at - 60 > Date.now() / 1000) return s;
  try {
    const d = await authFetch("token?grant_type=refresh_token", { refresh_token: s.refresh_token });
    const next = toSession(d);
    writeSession(next);
    return next;
  } catch {
    writeSession(null);
    return null;
  }
}

// Recoge la sesión cuando se vuelve del email de confirmación, de Google o de "recuperar contraseña"
export function captureSessionFromUrl() {
  if (typeof window === "undefined" || !window.location.hash.includes("access_token")) return null;
  const p = new URLSearchParams(window.location.hash.slice(1));
  const s = toSession({
    access_token: p.get("access_token"),
    refresh_token: p.get("refresh_token"),
    expires_in: p.get("expires_in"),
  });
  writeSession(s);
  const type = p.get("type");
  history.replaceState(null, "", window.location.pathname + window.location.search);
  return { session: s, type };
}

export async function signUp({ email, password, fullName, phone, marketingOk, referredBy }) {
  const d = await authFetch(`signup?redirect_to=${encodeURIComponent(`${window.location.origin}/cuenta`)}`, {
    email,
    password,
    data: { full_name: fullName, phone, marketing_ok: Boolean(marketingOk), referred_by: referredBy || "" },
  });
  const s = toSession(d);
  if (s) writeSession(s);
  return { needsConfirm: !s };
}

export async function signIn(email, password) {
  const d = await authFetch("token?grant_type=password", { email, password });
  writeSession(toSession(d));
}

export function signInWithGoogle() {
  window.location.href = `${URL_}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${window.location.origin}/cuenta`)}`;
}

export async function sendPasswordReset(email) {
  await authFetch(`recover?redirect_to=${encodeURIComponent(`${window.location.origin}/cuenta`)}`, { email });
}

export async function updatePassword(password) {
  const s = await getSession();
  await authFetch("user", { password }, "PUT", s?.access_token);
}

export async function signOut() {
  const s = readSession();
  writeSession(null);
  try {
    if (s) await authFetch("logout", null, "POST", s.access_token);
  } catch {
    /* ya está cerrada */
  }
}

// ---------- Base de datos ----------
// db("leads", { method: "POST", body: {...} })  ·  db("offers?select=*&order=created_at.desc")
export async function db(path, { method = "GET", body, prefer } = {}) {
  if (!hasSupabase) throw new Error("sin supabase");
  const s = await getSession();
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: KEY,
      "Content-Type": "application/json",
      ...(s ? { Authorization: `Bearer ${s.access_token}` } : {}),
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || `error ${res.status}`);
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}

// Guarda una solicitud (presupuesto, registro u oferta). Devuelve true si se ha guardado.
export async function saveLead(lead) {
  if (!hasSupabase) return false;
  try {
    await db("leads", { method: "POST", body: lead, prefer: "return=minimal" });
    return true;
  } catch {
    return false;
  }
}
