// Productos de la tienda AlpiCars (lista del documento de AlpiCars).
// Los precios son los finales para el cliente, en euros.
// El precio que cobra la web sale SIEMPRE de este archivo (en el servidor), nunca de lo que envíe el navegador.
//
// Cada producto:
//   images    fotos en /public/tienda: portada de estudio, ficha con ventajas y fotos de uso del proveedor
//   features  puntos clave que se ven en la ficha del producto
//   supplier  anuncio de AliExpress donde se compra
//   price / variant   precio y opción a elegir en AliExpress, para productos sin opciones
//   choice    UNA opción para el cliente (color, modelo...). Cada valor lleva su precio y la opción de AliExpress.
//   options + variants   VARIAS opciones combinadas (p. ej. tamaño y pack): una variante por combinación.
//
// La opción de AliExpress ("supplier" de cada valor/variante) sale en el panel y en el email de cada pedido.
//
// PENDIENTE (AlpiCars):
//  - Revisar los precios de las opciones nuevas (packs, modelos, 2 baterías): son una propuesta de Azeritek
//    con un margen parecido al de los precios originales.
//  - Confirmar los textos cuando tengáis los productos en la mano.

// Portada de estudio + ficha con las ventajas (editadas por Azeritek) + fotos de uso del proveedor
const pro = (id, extra) => [`/tienda/${id}-portada.webp`, `/tienda/${id}-ficha.webp`, ...extra.map((n) => `/tienda/${n}.webp`)];
const v = (name) => `/tienda/v-${name}.webp`;

const raw = [
  // Detailing
  {
    id: "pistola-agua-presion",
    category: "detailing",
    name: "Pistola de agua a presión inalámbrica",
    short: "Lava el coche donde quieras: funciona con batería y coge el agua de un cubo.",
    text: "Hidrolavadora a batería para lavar la carrocería, las llantas y los bajos sin depender de un enchufe ni de un túnel de lavado. Con su manguera aspira el agua de un cubo o una garrafa, así que puedes usarla en el garaje, en la calle o en el campo.",
    features: [
      "Sin cable: funciona con batería recargable",
      "Manguera de aspiración para coger el agua de un cubo",
      "Varias boquillas: chorro, abanico y espuma",
      "Botella para espuma incluida",
      "También sirve para bicis, terrazas y muebles de jardín",
    ],
    images: pro("pistola-agua-presion", ["pistola-agua-presion-2", "pistola-agua-presion-3"]),
    supplier: "https://es.aliexpress.com/item/1005011812168005.html",
    choice: {
      name: "Batería",
      values: [
        { id: "1-bateria", label: "1 batería", price: 59.99, supplier: "1 battery(5 sec)", image: v("pistola-1bat") },
        { id: "2-baterias", label: "2 baterías", price: 69.99, supplier: "2 battery(5 sec)", image: v("pistola-2bat") },
      ],
    },
  },
  {
    id: "kit-detailing-20",
    category: "detailing",
    name: "Kit de detailing",
    short: "Cepillos, manopla y paños para dejar el coche impecable por dentro y por fuera.",
    text: "Juego completo para limpiar cada rincón del coche: cepillos finos para las rejillas del aire y los huecos de los asientos, cepillo para llantas, manopla de lavado, esponjas y paños de microfibra.",
    features: [
      "Para el interior y el exterior",
      "Cepillos de detalle para rejillas, botones y costuras",
      "Cepillo de llantas con mango largo",
      "Manopla de lavado y paños de microfibra",
    ],
    images: pro("kit-detailing-20", ["kit-detailing-20-2"]),
    supplier: "https://es.aliexpress.com/item/1005012878751653.html",
    choice: {
      name: "Piezas",
      values: [
        { id: "20", label: "20 piezas", price: 34.99, supplier: "20PCSBB", image: "/tienda/kit-detailing-20-portada.webp" },
        { id: "16", label: "16 piezas", price: 29.99, supplier: "16pcsAA", image: v("kit-16") },
      ],
    },
  },
  {
    id: "aspiradora",
    category: "detailing",
    name: "Aspiradora inalámbrica para coche",
    short: "Compacta y potente (26.000 Pa) para alfombrillas, asientos y maletero.",
    text: "Aspiradora de mano sin cable pensada para el coche. Es pequeña, se carga por USB-C y trae boquillas para llegar a los huecos entre los asientos. También sopla, para sacar el polvo de las rejillas y del teclado.",
    features: [
      "Potencia de succión de 26.000 Pa",
      "4 en 1: aspira, sopla y trae boquillas para cada zona",
      "Sin cable, con carga por USB-C",
      "Pequeña y ligera, fácil de guardar en el coche",
    ],
    images: pro("aspiradora", ["aspiradora-2"]),
    supplier: "https://es.aliexpress.com/item/1005010126985836.html",
    choice: {
      name: "Color",
      values: [
        // PENDIENTE: confirmar que "Purple" es la gris con detalles morados de las fotos
        { id: "gris", label: "Gris y morado", price: 49.99, supplier: "Purple", swatch: "linear-gradient(135deg,#8a8f99 50%,#7b4fd6 50%)" },
        { id: "amarillo", label: "Amarillo", price: 49.99, supplier: "Yellow", swatch: "#f2c230" },
      ],
    },
  },
  {
    id: "toallas-microfibra",
    category: "detailing",
    name: "Toallas de microfibra para el coche",
    short: "Gruesas y de doble capa: secan y pulen sin dejar marcas ni rayar.",
    text: "Toallas de microfibra gruesas y de doble capa. Absorben mucha agua y no sueltan pelusa: las pequeñas para cristales, interiores y pulir; las grandes para secar la carrocería en menos pasadas.",
    features: ["Microfibra gruesa de doble capa", "Muy absorbentes y sin pelusa", "3 tamaños: 30 × 30, 30 × 40 y 30 × 60 cm", "Packs de 3, 5 o 10 unidades"],
    images: pro("toallas-microfibra", ["toallas-3"]),
    supplier: "https://es.aliexpress.com/item/1005006620527681.html",
    options: [
      {
        name: "Tamaño",
        values: [
          { id: "30x40", label: "30 × 40 cm" },
          { id: "30x60", label: "30 × 60 cm" },
          { id: "30x30", label: "30 × 30 cm" },
        ],
      },
      {
        name: "Unidades",
        values: [
          { id: "3", label: "3 toallas" },
          { id: "5", label: "5 toallas" },
          { id: "10", label: "10 toallas" },
        ],
      },
    ],
    variants: [
      // Las dos primeras son las del documento de AlpiCars (14,99 € y 19,99 €); el resto, propuesta
      { sku: "30x40-3", sel: { Tamaño: "30x40", Unidades: "3" }, price: 14.99, supplier: "3pcs 30x40cm" },
      { sku: "30x60-3", sel: { Tamaño: "30x60", Unidades: "3" }, price: 19.99, supplier: "3pcs 30x60cm" },
      { sku: "30x30-3", sel: { Tamaño: "30x30", Unidades: "3" }, price: 12.99, supplier: "3pcs 30x30cm" },
      { sku: "30x40-5", sel: { Tamaño: "30x40", Unidades: "5" }, price: 19.99, supplier: "5pcs 30x40cm" },
      { sku: "30x60-5", sel: { Tamaño: "30x60", Unidades: "5" }, price: 24.99, supplier: "5pcs 30x60cm" },
      { sku: "30x30-5", sel: { Tamaño: "30x30", Unidades: "5" }, price: 16.99, supplier: "5pcs 30x30cm" },
      { sku: "30x40-10", sel: { Tamaño: "30x40", Unidades: "10" }, price: 32.99, supplier: "10pcs 30x40cm" },
      { sku: "30x60-10", sel: { Tamaño: "30x60", Unidades: "10" }, price: 39.99, supplier: "10pcs 30x60cm" },
      { sku: "30x30-10", sel: { Tamaño: "30x30", Unidades: "10" }, price: 24.99, supplier: "10pcs 30x30cm" },
    ],
  },
  {
    id: "pulidor-faros",
    category: "detailing",
    name: "Kit de restauración de faros",
    price: 54.99,
    short: "Devuelve la transparencia a los faros amarillentos o mates.",
    text: "Kit para restaurar los faros opacos o amarillentos con el método de vapor: se lija la capa dañada y el vapor del líquido restaurador deja el faro transparente de nuevo. Mejora la luz por la noche y el aspecto del coche.",
    features: [
      "Restauración por vapor: el faro vuelve a quedar transparente",
      "Incluye lijas, líquido restaurador y vaporizador",
      "Para faros amarillentos, mates o con arañazos finos",
    ],
    images: pro("pulidor-faros", ["pulidor-faros-2", "pulidor-faros-3"]),
    supplier: "https://de.aliexpress.com/item/1005005560124384.html",
    variant: "Upgraded Version",
  },
  {
    id: "limpiador-interiores",
    category: "detailing",
    name: "Limpiador de interiores",
    short: "Limpia tapicería, cuero, techo y salpicadero sin necesidad de agua.",
    text: "Espray limpiador multiusos para el interior del coche. Se aplica, se frota con un paño y se retira: quita manchas de la tapicería de tela, el cuero, el techo y los plásticos sin tener que aclarar con agua.",
    features: ["Para tela, cuero, techo y plásticos", "No necesita agua para aclarar", "Quita manchas y suciedad del día a día"],
    images: pro("limpiador-interiores", ["limpiador-interiores-2"]),
    supplier: "https://de.aliexpress.com/item/1005008040606742.html",
    choice: {
      name: "Formato",
      values: [
        { id: "300ml", label: "1 bote de 300 ml", price: 29.99, supplier: "S21-300ML" },
        { id: "4x50ml", label: "4 botes de 50 ml", price: 29.99, supplier: "50MLx4pcs" },
      ],
    },
  },
  // Accesorios
  {
    id: "llavero-seguridad",
    category: "accesorios",
    name: "Llavero de seguridad con cortacinturón y martillo",
    short: "Corta el cinturón y rompe la ventanilla en caso de emergencia.",
    text: "Llavero de emergencia que va siempre con las llaves del coche: un martillo rompecristales para salir por la ventanilla, una cuchilla protegida para cortar el cinturón y un silbato para pedir ayuda.",
    features: ["Martillo rompecristales", "Cuchilla protegida para cortar el cinturón", "Silbato de emergencia", "Pequeño y ligero: va en el llavero"],
    images: pro("llavero-seguridad", []),
    supplier: "https://de.aliexpress.com/item/1005006696359316.html",
    choice: {
      name: "Color",
      values: [
        ["rojo", "Rojo", "Red", "#d42a2a"],
        ["negro", "Negro", "Black", "#1b1b1b"],
        ["azul", "Azul", "Blue", "#1f4fd6"],
        ["naranja", "Naranja", "Orange", "#f07a1a"],
        ["amarillo", "Amarillo", "Yellow", "#f2c230"],
        ["verde", "Verde", "Green", "#2fb04a"],
        ["rosa", "Rosa", "Pink", "#f2a6c0"],
        ["morado", "Morado", "Purple", "#7b3fc4"],
      ].map(([id, label, supplier, swatch]) => ({ id, label, price: 24.99, supplier, swatch, image: v(`llavero-${id}`) })),
    },
  },
  {
    id: "adaptador-usb-bluetooth",
    category: "accesorios",
    name: "Adaptador Bluetooth y USB para el coche",
    short: "Música y llamadas por Bluetooth y carga del móvil en cualquier coche.",
    text: "Se enchufa en la toma de mechero y conecta el móvil por Bluetooth 5.0: pon tu música en la radio del coche (por FM) y habla por manos libres. Además carga el móvil por USB; los modelos de carga rápida lo cargan en mucho menos tiempo.",
    features: [
      "Bluetooth 5.0: música y llamadas manos libres",
      "Funciona en cualquier coche con radio FM",
      "Carga el móvil por USB (rápida en los modelos C22, C17 y C16)",
      "Pantalla con la frecuencia de radio",
    ],
    images: pro("adaptador-usb-bluetooth", []),
    supplier: "https://es.aliexpress.com/item/1005005060630213.html",
    choice: {
      name: "Modelo",
      values: [
        { id: "c22", label: "C22 · carga rápida 22,5 W + USB-C 20 W", price: 22.99, supplier: "C22", image: v("transmisor-c22") },
        { id: "c16", label: "C16 · supercarga 22,5 W", price: 22.99, supplier: "C16-Black", image: v("transmisor-c16") },
        { id: "c17", label: "C17 · carga rápida USB-C 20 W y QC 3.0", price: 24.99, supplier: "C17-Black", image: v("transmisor-c17") },
        { id: "c26", label: "C26 · estándar", price: 18.99, supplier: "C26-Black", image: v("transmisor-c26") },
        { id: "c24", label: "C24 · estándar", price: 18.99, supplier: "C24-Black", image: v("transmisor-c24") },
      ],
    },
  },
  {
    id: "luz-interior",
    category: "accesorios",
    name: "Luces LED de ambiente para el interior",
    short: "Luces sin cables de 8 colores con mando a distancia.",
    text: "Luces LED inalámbricas y recargables para dar un ambiente más cuidado al habitáculo por la noche. Se pegan donde quieras, sin cables ni instalación, y se cambian de color con el mando.",
    features: ["Luces LED inalámbricas", "8 colores y varios modos", "Recargables, sin cables ni instalación", "Mando a distancia incluido"],
    images: pro("luz-interior", ["luz-interior-1"]),
    supplier: "https://de.aliexpress.com/item/1005008716612671.html",
    choice: {
      name: "Unidades",
      values: [
        { id: "2", label: "2 luces", price: 34.99, supplier: "2PCS · RGB" },
        { id: "4", label: "4 luces", price: 54.99, supplier: "4PCS · RGB" },
        { id: "6", label: "6 luces", price: 64.99, supplier: "6PCS · RGB" },
        { id: "8", label: "8 luces", price: 79.99, supplier: "8pcs · RGB" },
      ],
    },
  },
  {
    id: "quita-aranazos",
    category: "accesorios",
    name: "Quita-arañazos para la pintura",
    short: "Elimina o disimula los arañazos superficiales en pocos minutos.",
    text: "Crema pulidora con esponja aplicadora para quitar los arañazos superficiales y las marcas de la pintura, como las de las uñas junto a las manillas o los roces leves. Se aplica a mano en tres pasos.",
    features: ["Para arañazos superficiales y roces leves", "Esponja aplicadora incluida", "Se aplica a mano en 3 pasos"],
    images: pro("quita-aranazos", ["quita-aranazos-3", "quita-aranazos-4"]),
    supplier: "https://es.aliexpress.com/item/1005013065446716.html",
    choice: {
      name: "Unidades",
      values: [
        { id: "1", label: "1 bote", price: 47.99, supplier: "1pc" },
        { id: "3", label: "3 botes", price: 89.99, supplier: "3pcs" },
        { id: "5", label: "5 botes", price: 129.99, supplier: "5pcs" },
      ],
    },
  },
  {
    id: "pantalla-frontal",
    category: "accesorios",
    name: "Pantalla frontal de velocidad (HUD)",
    short: "La velocidad a la vista, sin apartar los ojos de la carretera.",
    text: "Pantalla para el salpicadero que muestra la velocidad en km/h, medida por GPS. Se enchufa por USB y funciona en cualquier coche, sin conexiones ni instalación. El brillo se ajusta solo de día y de noche.",
    features: ["Velocidad en km/h medida por GPS", "Compatible con todos los coches", "Enchufar y listo, por USB", "Brillo automático de día y de noche"],
    images: pro("pantalla-frontal", ["pantalla-frontal-3"]),
    supplier: "https://es.aliexpress.com/item/1005008164160774.html",
    choice: {
      name: "Color de los números",
      values: [
        // Siempre la versión KM H (la MPH es para EE. UU. y Reino Unido)
        { id: "blanco", label: "Blanco", price: 36.99, supplier: "White Light KM H", swatch: "#f4f6f9", image: v("hud-blanco") },
        { id: "verde", label: "Verde", price: 36.99, supplier: "Green Light KM H", swatch: "#2fd36a", image: v("hud-verde") },
      ],
    },
  },
];

// Convierte "choice" en options + variants para que todo funcione igual
function normalize(p) {
  let { options, variants } = p;
  if (p.choice) {
    options = [{ name: p.choice.name, values: p.choice.values.map(({ id, label, swatch, image }) => ({ id, label, swatch, image })) }];
    variants = p.choice.values.map((x) => ({ sku: x.id, sel: { [p.choice.name]: x.id }, price: x.price, supplier: x.supplier }));
  }
  const prices = variants ? variants.map((x) => x.price) : [p.price];
  const out = { ...p, options: options || null, variants: variants || null, image: p.images[0] };
  delete out.choice;
  out.price = variants ? variants[0].price : p.price; // precio de la opción que sale marcada
  out.priceFrom = Math.min(...prices);
  out.priceTo = Math.max(...prices);
  return out;
}

const products = raw.map(normalize);

// Variante elegida (o null si el producto no tiene opciones / la variante no existe)
export function getVariant(p, sku) {
  if (!p?.variants) return null;
  return p.variants.find((x) => x.sku === sku) || null;
}

// Texto de la opción elegida, p. ej. "30 × 40 cm · 5 toallas"
export function variantLabel(p, variant) {
  if (!p?.options || !variant) return "";
  return p.options.map((o) => o.values.find((x) => x.id === variant.sel[o.name])?.label).filter(Boolean).join(" · ");
}

// Precio, nombre completo y opción de AliExpress de una línea del carrito (lo usan la tienda, el pago y el webhook)
export function resolveLine(id, sku) {
  const p = products.find((x) => x.id === id);
  if (!p) return null;
  if (!p.variants) return { p, variant: null, price: p.price, label: "", supplierVariant: p.variant || "" };
  const variant = getVariant(p, sku) || p.variants[0];
  return { p, variant, price: variant.price, label: variantLabel(p, variant), supplierVariant: variant.supplier || "" };
}

export const categories = [
  { id: "detailing", label: "Detailing y limpieza" },
  { id: "accesorios", label: "Accesorios" },
];

export const shop = {
  // PENDIENTE (AlpiCars): coste y plazo de envío reales según el proveedor
  shipping: 4.95,
  freeShippingFrom: 49,
  deliveryTime: "Entrega en 7 a 15 días laborables",
  countries: ["ES"],
};

export default products;
