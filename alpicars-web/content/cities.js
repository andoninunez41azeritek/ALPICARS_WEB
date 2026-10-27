// Páginas por ciudad de entrega (SEO local y GEO). Cada una usa datos propios de esa ciudad:
// distancia desde Basilea (lib/mapData.js), comunidad autónoma y sus tipos del impuesto de matriculación (lib/calc.js)
// y el cálculo de ejemplo con la calculadora real. Nada inventado: si cambia una cifra, cambia en su origen.

const cities = [
  { slug: "madrid", dest: "madrid", name: "Madrid", region: "la Comunidad de Madrid", note: "" },
  { slug: "barcelona", dest: "barcelona", name: "Barcelona", region: "Cataluña", note: "Cataluña aplica el 16 % a los coches de 200 g/km de CO₂ o más, por encima del 14,75 % general." },
  {
    slug: "bilbao",
    dest: "bilbao",
    name: "Bilbao",
    region: "Bizkaia",
    note: "En Bizkaia el impuesto lo gestiona la Hacienda Foral, con sus propias tablas de precios (Orden Foral 51/2026). Los importes pueden variar algo respecto al resto de España; la calculadora usa los tipos generales como referencia y en el presupuesto te damos la cifra exacta.",
  },
  { slug: "valencia", dest: "valencia", name: "Valencia", region: "la Comunitat Valenciana", note: "La Comunitat Valenciana aplica el 16 % a los coches de 200 g/km de CO₂ o más, por encima del 14,75 % general." },
  { slug: "sevilla", dest: "sevilla", name: "Sevilla", region: "Andalucía", note: "" },
  { slug: "malaga", dest: "malaga", name: "Málaga", region: "Andalucía", note: "" },
];

export default cities;
