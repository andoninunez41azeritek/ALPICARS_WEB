// Destinos de entrega: las 6 ciudades principales (lib/mapData.js) y una por provincia
// a partir del código postal (lib/postalData.js).
import map from "./mapData";
import postal from "./postalData";

// Ruta de un destino (km, punto final y trazado sobre el mapa). Los destinos sin carretera no tienen ruta.
export function getRoute(key) {
  const r = map.routes[key] || postal[key];
  return r && r.d ? r : null;
}

export const isDest = (key) => Boolean(getRoute(key));

// Provincia a partir de un código postal español (5 cifras). Devuelve null si no es válido.
export function fromPostalCode(code) {
  const cp = String(code || "").replace(/\D/g, "");
  if (cp.length !== 5) return null;
  const p = postal[`cp${cp.slice(0, 2)}`];
  return p ? { key: `cp${p.cp}`, ...p } : null;
}

export { postal };
