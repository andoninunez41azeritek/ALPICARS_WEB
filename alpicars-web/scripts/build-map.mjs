// Genera lib/mapData.js a partir de data/europe.geojson.
// Uso: npm run map   (necesita las dependencias de desarrollo: d3-geo y d3-shape)
// Solo hace falta volver a ejecutarlo si cambias ciudades, rutas o el encuadre del mapa.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { geoConicConformal, geoPath } = require("d3-geo");
const { line, curveCatmullRom } = require("d3-shape");

const W = 1000;
const H = 1000;
const geo = JSON.parse(readFileSync(new URL("../data/europe.geojson", import.meta.url)));

// Encuadre total: de Lisboa/Cádiz a Berlín/Hamburgo
const extent = {
  type: "Feature",
  geometry: { type: "MultiPoint", coordinates: [[-9.6, 35.4], [15.2, 54.6], [-9.6, 54.6], [15.2, 35.4]] },
};
const projection = geoConicConformal().parallels([38, 52]).rotate([-3, 0]).fitSize([W, H], extent);
const path = geoPath(projection).digits(0);

const keep = new Set([
  "Spain", "Portugal", "France", "Germany", "Switzerland", "Italy", "Austria",
  "Belgium", "Netherlands", "Luxembourg", "Andorra", "Liechtenstein", "Monaco",
  "United Kingdom", "Ireland", "Denmark", "Czech Republic", "Poland", "Slovenia", "Croatia",
]);
const role = { Spain: "dest", Switzerland: "origin", Germany: "origin" };

const countries = geo.features
  .filter((f) => keep.has(f.properties.NAME))
  .map((f) => ({ name: f.properties.NAME, role: role[f.properties.NAME] || "other", d: path(f) }))
  .filter((c) => c.d);

const P = (lon, lat) => projection([lon, lat]).map((v) => Math.round(v * 10) / 10);
const mk = line().curve(curveCatmullRom.alpha(0.5));
const toD = (pts) => mk(pts.map(([lon, lat]) => P(lon, lat))).replace(/(\d+\.\d)\d+/g, "$1");

// Punto donde se juntan todas las rutas: Basilea (frontera Alemania · Suiza · Francia)
const HUB = [7.59, 47.56];

// Ciudades de origen y su ramal hasta Basilea
const origins = {
  hamburgo: { label: "Hamburgo", at: [9.99, 53.55], via: [[9.73, 52.37], [9.1, 50.7], [8.4, 49.1]] },
  berlin: { label: "Berlín", at: [13.4, 52.52], via: [[11.9, 51.4], [10.1, 50.0], [8.6, 48.6]] },
  colonia: { label: "Colonia", at: [6.96, 50.94], via: [[7.3, 49.7], [7.75, 48.5]] },
  francfort: { label: "Fráncfort", at: [8.68, 50.11], via: [[8.45, 49.1], [7.85, 48.2]] },
  stuttgart: { label: "Stuttgart", at: [9.18, 48.78], via: [[8.4, 48.1]] },
  munich: { label: "Múnich", at: [11.58, 48.14], via: [[10.2, 47.85], [8.8, 47.7]] },
  zurich: { label: "Zúrich", at: [8.54, 47.37], via: [[8.05, 47.5]] },
};

// Tronco común desde Basilea hasta España y el tramo final de cada destino
const toLyon = [HUB, [6.9, 47.05], [6.14, 46.2], [4.84, 45.76]];
const toBarcelona = [...toLyon, [4.89, 44.93], [3.88, 43.61], [3.0, 43.18], [2.9, 42.7], [2.82, 41.98], [2.17, 41.39]];
const toMadrid = [...toBarcelona, [0.62, 41.62], [-0.88, 41.65], [-2.3, 41.2], [-3.7, 40.42]];
// Distancias aproximadas por carretera desde Basilea
const routes = {
  madrid: { label: "Madrid", km: 1580, pts: toMadrid },
  barcelona: { label: "Barcelona", km: 960, pts: toBarcelona },
  bilbao: { label: "Bilbao", km: 1250, pts: [...toLyon, [3.08, 45.78], [1.3, 45.4], [-0.58, 44.84], [-1.47, 43.49], [-1.98, 43.32], [-2.93, 43.26]] },
  valencia: { label: "Valencia", km: 1310, pts: [...toBarcelona, [1.25, 41.12], [-0.04, 39.99], [-0.38, 39.47]] },
  sevilla: { label: "Sevilla", km: 2110, pts: [...toMadrid, [-3.6, 39.0], [-4.78, 37.89], [-5.98, 37.39]] },
  malaga: { label: "Málaga", km: 2120, pts: [...toMadrid, [-3.6, 39.0], [-3.6, 37.18], [-4.42, 36.72]] },
};

const labels = { de: [10.6, 51.4], ch: [7.9, 46.62], fr: [2.4, 46.9], es: [-6.3, 41.7], pt: [-8.1, 39.6], it: [11.6, 44.6] };

const out = {
  viewBox: `0 0 ${W} ${H}`,
  countries,
  hub: { label: "Basilea", x: P(...HUB)[0], y: P(...HUB)[1] },
  origins: Object.fromEntries(
    Object.entries(origins).map(([k, o]) => [k, { label: o.label, x: P(...o.at)[0], y: P(...o.at)[1], d: toD([o.at, ...o.via, HUB]) }])
  ),
  routes: Object.fromEntries(
    Object.entries(routes).map(([k, r]) => {
      const end = r.pts[r.pts.length - 1];
      return [k, { label: r.label, km: r.km, x: P(...end)[0], y: P(...end)[1], d: toD(r.pts) }];
    })
  ),
  labels: Object.fromEntries(Object.entries(labels).map(([k, at]) => [k, P(...at)])),
};

writeFileSync(
  new URL("../lib/mapData.js", import.meta.url),
  "// Archivo generado por scripts/build-map.mjs. No editar a mano.\n" +
    "// Fronteras: Natural Earth (dominio público) vía github.com/leakyMirror/map-of-europe\n" +
    "const mapData = " + JSON.stringify(out) + ";\nexport default mapData;\n"
);
console.log("mapData.js:", countries.length, "países");
