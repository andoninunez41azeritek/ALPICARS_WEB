// Productos de la tienda AlpiCars (lista del documento de AlpiCars).
// Los precios son los finales para el cliente, en euros.
// El precio que cobra la web sale SIEMPRE de este archivo (en el servidor), nunca de lo que envíe el navegador.
//
// Cada producto:
//   images    fotos en /public/tienda (la primera es la portada). Sacadas de los anuncios del proveedor (29/10/2026).
//   features  puntos clave que se ven en la ficha del producto
//   supplier  anuncio de AliExpress donde se compra
//   variant   qué opción hay que elegir en AliExpress al hacer el pedido (sale en el panel y en el email del pedido)
//
// Textos escritos a partir de los anuncios. PENDIENTE (AlpiCars): confirmar las variantes marcadas y revisar los textos
// cuando tengáis el producto en la mano.

const img = (id, ns) => ns.map((n) => `/tienda/${id}-${n}.webp`);

const products = [
  // Detailing
  {
    id: "pistola-agua-presion",
    category: "detailing",
    name: "Pistola de agua a presión inalámbrica",
    price: 59.99,
    short: "Lava el coche donde quieras: funciona con batería y coge el agua de un cubo.",
    text: "Hidrolavadora a batería para lavar la carrocería, las llantas y los bajos sin depender de un enchufe ni de un túnel de lavado. Con su manguera aspira el agua de un cubo o una garrafa, así que puedes usarla en el garaje, en la calle o en el campo.",
    features: [
      "Sin cable: funciona con batería recargable",
      "Manguera de aspiración para coger el agua de un cubo",
      "Varias boquillas: chorro, abanico y espuma",
      "Botella para espuma incluida",
      "También sirve para bicis, terrazas y muebles de jardín",
    ],
    images: img("pistola-agua-presion", [1, 2, 3, 4]),
    supplier: "https://es.aliexpress.com/item/1005011812168005.html",
    variant: "Kit con 2 baterías y cargador (el de la foto) · PENDIENTE confirmar",
  },
  {
    id: "kit-detailing-20",
    category: "detailing",
    name: "Kit de detailing de 20 piezas",
    price: 34.99,
    short: "Cepillos, manopla y paños para dejar el coche impecable por dentro y por fuera.",
    text: "Juego de 20 piezas para limpiar cada rincón del coche: cepillos finos para las rejillas del aire y los huecos de los asientos, cepillo para llantas, manopla de lavado, esponjas y paños de microfibra.",
    features: [
      "20 piezas para el interior y el exterior",
      "Cepillos de detalle para rejillas, botones y costuras",
      "Cepillo de llantas con mango largo",
      "Manopla de lavado y paños de microfibra",
    ],
    images: img("kit-detailing-20", [1, 2, 4]),
    supplier: "https://es.aliexpress.com/item/1005012878751653.html",
    variant: "20 piezas (no la de 16)",
  },
  {
    id: "aspiradora",
    category: "detailing",
    name: "Aspiradora inalámbrica para coche",
    price: 49.99,
    short: "Compacta y potente (26.000 Pa) para alfombrillas, asientos y maletero.",
    text: "Aspiradora de mano sin cable pensada para el coche. Es pequeña, se carga por USB-C y trae boquillas para llegar a los huecos entre los asientos. También sopla, para sacar el polvo de las rejillas y del teclado.",
    features: [
      "Potencia de succión de 26.000 Pa",
      "4 en 1: aspira, sopla y trae boquillas para cada zona",
      "Sin cable, con carga por USB-C",
      "Pequeña y ligera, fácil de guardar en el coche",
    ],
    images: img("aspiradora", [1, 2, 3, 4]),
    supplier: "https://es.aliexpress.com/item/1005010126985836.html",
    variant: "Color plateado (el de la foto) · PENDIENTE confirmar",
  },
  {
    id: "toallas-30x40",
    category: "detailing",
    name: "Toallas de microfibra 30 × 40 (3 unidades)",
    price: 14.99,
    short: "Gruesas y de doble capa: secan y pulen sin dejar marcas ni rayar.",
    text: "Tres toallas de microfibra de 30 × 40 cm, gruesas y de doble capa. Absorben mucha agua y no sueltan pelusa, ideales para secar, pulir y limpiar cristales e interiores.",
    features: ["3 toallas de 30 × 40 cm", "Microfibra gruesa de doble capa", "Muy absorbentes y sin pelusa"],
    images: img("toallas", [3, 2, 4]),
    supplier: "https://es.aliexpress.com/item/1005006620527681.html",
    variant: "3pcs 30x40cm",
  },
  {
    id: "toallas-30x60",
    category: "detailing",
    name: "Toallas de microfibra 30 × 60 (3 unidades)",
    price: 19.99,
    short: "Tamaño grande para secar la carrocería en menos pasadas.",
    text: "Tres toallas de microfibra de 30 × 60 cm, más grandes, para secar la carrocería completa después del lavado sin dejar marcas de agua.",
    features: ["3 toallas de 30 × 60 cm", "Microfibra gruesa de doble capa", "Secan el coche entero en menos pasadas"],
    images: img("toallas", [4, 3, 2]),
    supplier: "https://es.aliexpress.com/item/1005006620527681.html",
    variant: "3pcs 30x60cm",
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
    images: img("pulidor-faros", [2, 3, 4]),
    supplier: "https://de.aliexpress.com/item/1005005560124384.html",
    variant: "Upgraded Version",
  },
  {
    id: "limpiador-interiores",
    category: "detailing",
    name: "Limpiador de interiores (300 ml)",
    price: 29.99,
    short: "Limpia tapicería, cuero, techo y salpicadero sin necesidad de agua.",
    text: "Espray limpiador multiusos para el interior del coche. Se aplica, se frota con un paño y se retira: quita manchas de la tapicería de tela, el cuero, el techo y los plásticos sin tener que aclarar con agua.",
    features: ["300 ml", "Para tela, cuero, techo y plásticos", "No necesita agua para aclarar", "Quita manchas y suciedad del día a día"],
    images: img("limpiador-interiores", [1, 2, 3, 4]),
    supplier: "https://de.aliexpress.com/item/1005008040606742.html",
    variant: "S21-300ML",
  },
  // Accesorios
  {
    id: "llavero-seguridad",
    category: "accesorios",
    name: "Llavero de seguridad con cortacinturón y martillo",
    price: 24.99,
    short: "Corta el cinturón y rompe la ventanilla en caso de emergencia.",
    text: "Llavero de emergencia que va siempre con las llaves del coche: un martillo rompecristales para salir por la ventanilla, una cuchilla protegida para cortar el cinturón y un silbato para pedir ayuda.",
    features: ["Martillo rompecristales", "Cuchilla protegida para cortar el cinturón", "Silbato de emergencia", "Pequeño y ligero: va en el llavero"],
    images: img("llavero-seguridad", [1, 2, 3, 4]),
    supplier: "https://de.aliexpress.com/item/1005006696359316.html",
    variant: "Color a elegir (azul, rojo, naranja o amarillo) · PENDIENTE decidir",
  },
  {
    id: "adaptador-usb-bluetooth",
    category: "accesorios",
    name: "Adaptador Bluetooth y USB para el coche",
    price: 18.99,
    short: "Música y llamadas por Bluetooth y carga rápida del móvil en cualquier coche.",
    text: "Se enchufa en la toma de mechero y conecta el móvil por Bluetooth 5.0: pon tu música en la radio del coche (por FM) y habla por manos libres. Además carga el móvil rápido por USB y USB-C.",
    features: [
      "Bluetooth 5.0: música y llamadas manos libres",
      "Funciona en cualquier coche con radio FM",
      "Carga rápida de 22,5 W por USB y 20 W por USB-C",
      "Pantalla con la frecuencia y la tensión de la batería",
    ],
    images: img("adaptador-usb-bluetooth", [1, 2, 3, 4]),
    supplier: "https://es.aliexpress.com/item/1005005060630213.html",
    variant: "Modelo de la foto (negro, con luces de colores) · PENDIENTE confirmar",
  },
  {
    id: "luz-interior",
    category: "accesorios",
    name: "Luces LED de ambiente para el interior (2 unidades)",
    price: 34.99,
    short: "Dos luces sin cables de 8 colores con mando a distancia.",
    text: "Dos luces LED inalámbricas y recargables para dar un ambiente más cuidado al habitáculo por la noche. Se pegan donde quieras, sin cables ni instalación, y se cambian de color con el mando.",
    features: ["2 luces LED inalámbricas", "8 colores y varios modos", "Recargables, sin cables ni instalación", "Mando a distancia incluido"],
    images: img("luz-interior", [1, 2, 3, 4]),
    supplier: "https://de.aliexpress.com/item/1005008716612671.html",
    variant: "2PCS · RGB",
  },
  {
    id: "quita-aranazos",
    category: "accesorios",
    name: "Quita-arañazos para la pintura",
    price: 47.99,
    short: "Elimina o disimula los arañazos superficiales en pocos minutos.",
    text: "Crema pulidora con esponja aplicadora para quitar los arañazos superficiales y las marcas de la pintura, como las de las uñas junto a las manillas o los roces leves. Se aplica a mano en tres pasos.",
    features: ["Para arañazos superficiales y roces leves", "Esponja aplicadora incluida", "Se aplica a mano en 3 pasos"],
    images: img("quita-aranazos", [1, 2, 3, 4]),
    supplier: "https://es.aliexpress.com/item/1005013065446716.html",
    variant: "1pc",
  },
  {
    id: "pantalla-frontal",
    category: "accesorios",
    name: "Pantalla frontal de velocidad (HUD)",
    price: 36.99,
    short: "La velocidad a la vista, sin apartar los ojos de la carretera.",
    text: "Pantalla para el salpicadero que muestra la velocidad en km/h, medida por GPS. Se enchufa por USB y funciona en cualquier coche, sin conexiones ni instalación. El brillo se ajusta solo de día y de noche.",
    features: ["Velocidad en km/h medida por GPS", "Compatible con todos los coches", "Enchufar y listo, por USB", "Brillo automático de día y de noche"],
    images: img("pantalla-frontal", [1, 2, 3]),
    supplier: "https://es.aliexpress.com/item/1005008164160774.html",
    variant: "Versión KM/H (¡no la MPH, que es la que sale marcada!)",
  },
].map((p) => ({ ...p, image: p.images[0] }));

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
