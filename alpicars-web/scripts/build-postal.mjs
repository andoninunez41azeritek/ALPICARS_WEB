// Genera lib/postalData.js: un destino por provincia (los 2 primeros dígitos del código postal),
// con la ruta dibujada sobre el mapa de fondo y los km aproximados por carretera desde Basilea.
// Uso: npm run postal   (necesita las dependencias de desarrollo: d3-geo y d3-shape)
//
// Cómo se calcula la distancia: las rutas principales (Madrid, Barcelona, Bilbao, Valencia, Sevilla, Málaga)
// tienen sus km reales. Para cada provincia se busca el punto de esas rutas desde el que sale el camino
// más corto (km hasta ese punto + línea recta × 1,35 por las curvas de la carretera).
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { geoConicConformal } = require("d3-geo");
const { line, curveCatmullRom } = require("d3-shape");

// Misma proyección que scripts/build-map.mjs
const extent = {
  type: "Feature",
  geometry: { type: "MultiPoint", coordinates: [[-9.6, 35.4], [15.2, 54.6], [-9.6, 54.6], [15.2, 35.4]] },
};
const projection = geoConicConformal().parallels([38, 52]).rotate([-3, 0]).fitSize([1000, 1000], extent);
const P = (lon, lat) => projection([lon, lat]).map((v) => Math.round(v * 10) / 10);
const mk = line().curve(curveCatmullRom.alpha(0.5));
const toD = (pts) => mk(pts.map(([lon, lat]) => P(lon, lat))).replace(/(\d+\.\d)\d+/g, "$1");

const HUB = [7.59, 47.56];
const toLyon = [HUB, [6.9, 47.05], [6.14, 46.2], [4.84, 45.76]];
const toBarcelona = [...toLyon, [4.89, 44.93], [3.88, 43.61], [3.0, 43.18], [2.9, 42.7], [2.82, 41.98], [2.17, 41.39]];
const toMadrid = [...toBarcelona, [0.62, 41.62], [-0.88, 41.65], [-2.3, 41.2], [-3.7, 40.42]];
const routes = [
  { km: 1580, pts: toMadrid },
  { km: 960, pts: toBarcelona },
  { km: 1250, pts: [...toLyon, [3.08, 45.78], [1.3, 45.4], [-0.58, 44.84], [-1.47, 43.49], [-1.98, 43.32], [-2.93, 43.26]] },
  { km: 1310, pts: [...toBarcelona, [1.25, 41.12], [-0.04, 39.99], [-0.38, 39.47]] },
  { km: 2110, pts: [...toMadrid, [-3.6, 39.0], [-4.78, 37.89], [-5.98, 37.39]] },
  { km: 2120, pts: [...toMadrid, [-3.6, 39.0], [-3.6, 37.18], [-4.42, 36.72]] },
];

const R = 6371;
const hav = ([lo1, la1], [lo2, la2]) => {
  const r = Math.PI / 180;
  const a = Math.sin(((la2 - la1) * r) / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin(((lo2 - lo1) * r) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};
// km acumulados en cada punto de cada ruta, ajustados para que el final coincida con los km reales
const nodes = [];
for (const r of routes) {
  const raw = [0];
  for (let i = 1; i < r.pts.length; i++) raw.push(raw[i - 1] + hav(r.pts[i - 1], r.pts[i]));
  const f = r.km / raw[raw.length - 1];
  r.pts.forEach((p, i) => nodes.push({ p, km: raw[i] * f, path: r.pts.slice(0, i + 1) }));
}
const ROAD = 1.35;

// Provincia (2 primeros dígitos del CP), capital, coordenadas, comunidad y tipo del impuesto de matriculación
const PROV = [
  ["01", "Álava", "Vitoria-Gasteiz", -2.67, 42.85, "País Vasco (Hacienda Foral de Álava)", "general"],
  ["02", "Albacete", "Albacete", -1.86, 38.99, "Castilla-La Mancha", "general"],
  ["03", "Alicante", "Alicante", -0.48, 38.35, "Comunitat Valenciana", "valencia"],
  ["04", "Almería", "Almería", -2.46, 36.84, "Andalucía", "andalucia"],
  ["05", "Ávila", "Ávila", -4.7, 40.66, "Castilla y León", "general"],
  ["06", "Badajoz", "Badajoz", -6.97, 38.88, "Extremadura", "general"],
  ["07", "Illes Balears", "Palma", 2.65, 39.57, "Illes Balears", "general", "isla"],
  ["08", "Barcelona", "Barcelona", 2.17, 41.39, "Cataluña", "cataluna"],
  ["09", "Burgos", "Burgos", -3.7, 42.34, "Castilla y León", "general"],
  ["10", "Cáceres", "Cáceres", -6.37, 39.47, "Extremadura", "general"],
  ["11", "Cádiz", "Cádiz", -6.29, 36.53, "Andalucía", "andalucia"],
  ["12", "Castellón", "Castellón de la Plana", -0.05, 39.99, "Comunitat Valenciana", "valencia"],
  ["13", "Ciudad Real", "Ciudad Real", -3.93, 38.99, "Castilla-La Mancha", "general"],
  ["14", "Córdoba", "Córdoba", -4.78, 37.89, "Andalucía", "andalucia"],
  ["15", "A Coruña", "A Coruña", -8.41, 43.36, "Galicia", "general"],
  ["16", "Cuenca", "Cuenca", -2.13, 40.07, "Castilla-La Mancha", "general"],
  ["17", "Girona", "Girona", 2.82, 41.98, "Cataluña", "cataluna"],
  ["18", "Granada", "Granada", -3.6, 37.18, "Andalucía", "andalucia"],
  ["19", "Guadalajara", "Guadalajara", -3.17, 40.63, "Castilla-La Mancha", "general"],
  ["20", "Gipuzkoa", "Donostia / San Sebastián", -1.98, 43.32, "País Vasco (Hacienda Foral de Gipuzkoa)", "general"],
  ["21", "Huelva", "Huelva", -6.95, 37.26, "Andalucía", "andalucia"],
  ["22", "Huesca", "Huesca", -0.41, 42.14, "Aragón", "general"],
  ["23", "Jaén", "Jaén", -3.79, 37.78, "Andalucía", "andalucia"],
  ["24", "León", "León", -5.57, 42.6, "Castilla y León", "general"],
  ["25", "Lleida", "Lleida", 0.62, 41.62, "Cataluña", "cataluna"],
  ["26", "La Rioja", "Logroño", -2.45, 42.47, "La Rioja", "general"],
  ["27", "Lugo", "Lugo", -7.56, 43.01, "Galicia", "general"],
  ["28", "Madrid", "Madrid", -3.7, 40.42, "Comunidad de Madrid", "general"],
  ["29", "Málaga", "Málaga", -4.42, 36.72, "Andalucía", "andalucia"],
  ["30", "Murcia", "Murcia", -1.13, 37.99, "Región de Murcia", "general"],
  ["31", "Navarra", "Pamplona / Iruña", -1.65, 42.81, "Navarra (Hacienda Foral)", "general"],
  ["32", "Ourense", "Ourense", -7.86, 42.34, "Galicia", "general"],
  ["33", "Asturias", "Oviedo", -5.85, 43.36, "Principado de Asturias", "general"],
  ["34", "Palencia", "Palencia", -4.53, 42.01, "Castilla y León", "general"],
  ["35", "Las Palmas", "Las Palmas de Gran Canaria", -15.43, 28.12, "Canarias", "general", "canarias"],
  ["36", "Pontevedra", "Pontevedra", -8.64, 42.43, "Galicia", "general"],
  ["37", "Salamanca", "Salamanca", -5.66, 40.97, "Castilla y León", "general"],
  ["38", "Santa Cruz de Tenerife", "Santa Cruz de Tenerife", -16.25, 28.46, "Canarias", "general", "canarias"],
  ["39", "Cantabria", "Santander", -3.8, 43.46, "Cantabria", "general"],
  ["40", "Segovia", "Segovia", -4.12, 40.95, "Castilla y León", "general"],
  ["41", "Sevilla", "Sevilla", -5.98, 37.39, "Andalucía", "andalucia"],
  ["42", "Soria", "Soria", -2.46, 41.76, "Castilla y León", "general"],
  ["43", "Tarragona", "Tarragona", 1.25, 41.12, "Cataluña", "cataluna"],
  ["44", "Teruel", "Teruel", -1.11, 40.34, "Aragón", "general"],
  ["45", "Toledo", "Toledo", -4.02, 39.86, "Castilla-La Mancha", "general"],
  ["46", "Valencia", "Valencia", -0.38, 39.47, "Comunitat Valenciana", "valencia"],
  ["47", "Valladolid", "Valladolid", -4.72, 41.65, "Castilla y León", "general"],
  ["48", "Bizkaia", "Bilbao", -2.93, 43.26, "País Vasco (Hacienda Foral de Bizkaia)", "general"],
  ["49", "Zamora", "Zamora", -5.75, 41.5, "Castilla y León", "general"],
  ["50", "Zaragoza", "Zaragoza", -0.88, 41.65, "Aragón", "general"],
  ["51", "Ceuta", "Ceuta", -5.32, 35.89, "Ceuta", "general", "ceuta"],
  ["52", "Melilla", "Melilla", -2.94, 35.29, "Melilla", "general", "ceuta"],
];

// Las islas no tienen ruta por carretera: Baleares sale en barco desde Barcelona
const BARCELONA = [2.17, 41.39];

const provinces = {};
for (const [cp, name, capital, lon, lat, region, rate, special] of PROV) {
  const at = [lon, lat];
  let best = null;
  if (special === "canarias" || special === "ceuta") {
    provinces[`cp${cp}`] = { cp, label: name, capital, region, rate, special, km: null };
    continue;
  }
  const target = special === "isla" ? BARCELONA : at;
  // Si la provincia es el final de una de las rutas principales, se usan sus km reales
  const exact = routes.find((r) => hav(r.pts[r.pts.length - 1], target) < 5);
  if (exact) best = { km: exact.km, path: exact.pts };
  else
    for (const n of nodes) {
      const km = n.km + hav(n.p, target) * ROAD;
      if (!best || km < best.km) best = { km, path: n.path };
    }
  const pts = [...best.path];
  const last = pts[pts.length - 1];
  if (hav(last, target) > 5) pts.push(target);
  if (special === "isla") pts.push(at);
  const [x, y] = P(lon, lat);
  provinces[`cp${cp}`] = {
    cp,
    label: name === capital ? name : `${capital}`,
    province: name,
    capital,
    region,
    rate,
    ...(special ? { special } : {}),
    km: Math.round(best.km / 10) * 10,
    x,
    y,
    d: toD(pts),
  };
}

const out = `// Archivo generado por scripts/build-postal.mjs. No editar a mano.
// Un destino por provincia (2 primeros dígitos del código postal): ruta sobre el mapa y km aproximados desde Basilea.
const postal = ${JSON.stringify(provinces)};

export default postal;
`;
writeFileSync(new URL("../lib/postalData.js", import.meta.url), out);
console.log("Provincias:", Object.keys(provinces).length);
for (const k of ["cp28", "cp08", "cp17", "cp48", "cp15", "cp11", "cp07", "cp35"]) console.log(k, provinces[k].label, provinces[k].km);
