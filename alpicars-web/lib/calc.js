// Cálculo de la calculadora de importación (lo usan la calculadora de la web y el informe PDF).
// Normativa aplicada (revisada en octubre de 2026):
//
//  ALEMANIA (dentro de la UE)
//   - Coche usado (más de 6 meses Y más de 6.000 km): se paga el IVA alemán incluido en el precio
//     y no se vuelve a pagar IVA en España.
//   - Coche "nuevo" a efectos de IVA (6 meses o menos, O 6.000 km o menos): se compra sin IVA alemán
//     y se paga el 21 % de IVA en España (modelo 309).
//
//  SUIZA (fuera de la UE)
//   - El precio se introduce sin IVA suizo (se recupera al exportar).
//   - Arancel del 10 % salvo que el coche tenga origen preferencial UE/Suiza (certificado EUR.1): 0 %.
//   - IVA de importación del 21 % sobre coche + arancel + transporte hasta el destino en España.
//
//  IMPUESTO DE MATRICULACIÓN (IEDMT, modelo 576)
//   - Tipo según CO2 (WLTP) y comunidad autónoma (Agencia Tributaria, tipos vigentes 2026).
//   - Coche usado: base = valor de mercado / (1 + 21 % + tipo IEDMT). El valor de mercado es el precio
//     de las tablas de Hacienda (Orden HAC/1501/2025) por el porcentaje de antigüedad (Anexo IV).
//     Si no se conoce el valor de tablas, se estima con el precio del mismo coche en España.
//   - Coche nuevo: base = precio de compra sin IVA.
//
//  GASTOS DE MATRICULACIÓN: tasa DGT oficial 2026 + ITV de importación, placas y documentación
//  (estimaciones en content/config.js, a confirmar con AlpiCars).

import config from "../content/config";
import map from "./mapData";

// Anexo IV de la Orden HAC/1501/2025: porcentaje del valor de tablas según los años de uso
export const AGES = [
  { label: "Menos de 1 año", coef: 1 },
  { label: "Entre 1 y 2 años", coef: 0.84 },
  { label: "Entre 2 y 3 años", coef: 0.67 },
  { label: "Entre 3 y 4 años", coef: 0.56 },
  { label: "Entre 4 y 5 años", coef: 0.47 },
  { label: "Entre 5 y 6 años", coef: 0.39 },
  { label: "Entre 6 y 7 años", coef: 0.34 },
  { label: "Entre 7 y 8 años", coef: 0.28 },
  { label: "Entre 8 y 9 años", coef: 0.24 },
  { label: "Entre 9 y 10 años", coef: 0.19 },
  { label: "Entre 10 y 11 años", coef: 0.17 },
  { label: "Entre 11 y 12 años", coef: 0.13 },
  { label: "Más de 12 años", coef: 0.1 },
];

// Tramos de CO2 (epígrafes 1.º a 4.º del IEDMT para turismos)
export const CO2 = [
  { label: "Hasta 120 g/km (eléctricos, híbridos enchufables y muchos híbridos)", short: "Hasta 120 g/km" },
  { label: "De 121 a 159 g/km", short: "121–159 g/km" },
  { label: "De 160 a 199 g/km", short: "160–199 g/km" },
  { label: "200 g/km o más", short: "200 g/km o más" },
];

// Tipos del IEDMT por comunidad autónoma (Agencia Tributaria, 2026). Índice = tramo de CO2.
export const RATES = {
  general: [0, 0.0475, 0.0975, 0.1475],
  cataluna: [0, 0.0475, 0.0975, 0.16],
  valencia: [0, 0.0475, 0.0975, 0.16],
  andalucia: [0, 0.0475, 0.0975, 0.1475],
};
// Ciudad de entrega → comunidad autónoma
export const REGION = {
  madrid: { key: "general", label: "Comunidad de Madrid" },
  barcelona: { key: "cataluna", label: "Cataluña" },
  bilbao: { key: "general", label: "Bizkaia (Hacienda Foral)" },
  valencia: { key: "valencia", label: "Comunitat Valenciana" },
  sevilla: { key: "andalucia", label: "Andalucía" },
  malaga: { key: "andalucia", label: "Andalucía" },
};

export const VAT = 0.21;
export const DUTY = 0.1;

export const DEFAULT_INPUT = {
  origin: "de",
  priceEs: 62000,
  priceOrigin: 44000,
  age: 3,
  co2: 1,
  eur1: true,
  dest: "madrid",
  isNew: false,
  tableValue: 0,
};

const n = (v) => Math.max(0, Number(v) || 0);

export function calculate(input) {
  const i = { ...DEFAULT_INPUT, ...input };
  const route = map.routes[i.dest] || map.routes.madrid;
  const region = REGION[i.dest] || REGION.madrid;
  const ageIdx = Math.min(AGES.length - 1, Math.max(0, Number(i.age) || 0));
  const co2Idx = Math.min(CO2.length - 1, Math.max(0, Number(i.co2) || 0));
  const rate = RATES[region.key][co2Idx];
  const fees = config.calculator;

  const car = n(i.priceOrigin);
  const travel = Math.round(route.km * fees.travelPerKm);

  // Arancel e IVA
  let duty = 0;
  let vat = 0;
  if (i.origin === "ch") {
    duty = i.eur1 ? 0 : Math.round(car * DUTY);
    vat = Math.round((car + duty + travel) * VAT);
  } else if (i.isNew) {
    vat = Math.round(car * VAT);
  }

  // Impuesto de matriculación
  let regBase;
  let marketValue = 0;
  if (i.isNew) {
    regBase = car + duty;
  } else {
    marketValue = n(i.tableValue) > 0 ? n(i.tableValue) * AGES[ageIdx].coef : n(i.priceEs);
    regBase = marketValue / (1 + VAT + rate);
  }
  const reg = Math.round(regBase * rate);

  // Gastos de matriculación
  const dgt = fees.dgtFee;
  const itv = fees.itv;
  const plates = fees.plates;
  const docs = fees.docs;
  const paperwork = dgt + itv + plates + docs;

  const service = fees.serviceFee;
  const total = Math.round(car + duty + vat + reg + paperwork + travel + service);
  const save = n(i.priceEs) - total;

  // Filas del desglose, en el orden en que se muestran
  const rows = [
    ["car", car],
    ...(i.origin === "ch" ? [["duty", duty], ["vat", vat]] : i.isNew ? [["vatNew", vat]] : []),
    ["reg", reg],
    ["dgt", dgt],
    ["itv", itv],
    ["plates", plates],
    ["docs", docs],
    ["travel", travel],
    ["service", service],
  ];

  return {
    car, duty, vat, reg, dgt, itv, plates, docs, paperwork, travel, service, total, save, rows,
    rate, regBase: Math.round(regBase), marketValue: Math.round(marketValue),
    estimatedValue: !i.isNew && !(n(i.tableValue) > 0),
    km: route.km, destLabel: route.label, regionLabel: region.label,
  };
}

// Convierte los datos de la calculadora en una URL compartible y al revés
export function toQuery(input) {
  const p = new URLSearchParams({
    o: input.origin,
    es: String(Math.round(n(input.priceEs))),
    or: String(Math.round(n(input.priceOrigin))),
    a: String(input.age),
    c: String(input.co2),
    e: input.eur1 ? "1" : "0",
    d: input.dest,
    nw: input.isNew ? "1" : "0",
    tv: String(Math.round(n(input.tableValue))),
  });
  return p.toString();
}

export function fromQuery(search) {
  const p = new URLSearchParams(search);
  const num = (k, d) => (p.has(k) && !Number.isNaN(Number(p.get(k))) ? Number(p.get(k)) : d);
  return {
    origin: p.get("o") === "ch" ? "ch" : "de",
    priceEs: num("es", DEFAULT_INPUT.priceEs),
    priceOrigin: num("or", DEFAULT_INPUT.priceOrigin),
    age: Math.min(AGES.length - 1, Math.max(0, num("a", DEFAULT_INPUT.age))),
    co2: Math.min(CO2.length - 1, Math.max(0, num("c", DEFAULT_INPUT.co2))),
    eur1: p.get("e") !== "0",
    dest: map.routes[p.get("d")] ? p.get("d") : DEFAULT_INPUT.dest,
    isNew: p.get("nw") === "1",
    tableValue: num("tv", 0),
  };
}
