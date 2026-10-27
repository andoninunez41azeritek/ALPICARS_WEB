// Productos de la tienda AlpiCars (lista del documento de AlpiCars).
// Los precios son los finales para el cliente, en euros.
// PENDIENTE (AlpiCars):
//  - Enlaces del proveedor ("supplier"): sacados del PDF de AlpiCars. Las toallas de 30x40 y 30x60 comparten anuncio (elegir la talla al pedir).
//  - Poner las fotos en /public/tienda/<id>.jpg y escribir la ruta en "image".
//  - Revisar los textos para que describan exactamente el producto elegido (medidas, potencia, contenido del pack).
// El precio que cobra la web sale SIEMPRE de este archivo (en el servidor), nunca de lo que envíe el navegador.

const products = [
  // Detailing
  {
    id: "pistola-agua-presion",
    category: "detailing",
    name: "Pistola de agua a presión",
    price: 59.99,
    short: "Lava el coche en casa con presión, sin ir al túnel de lavado.",
    text: "Pistola de agua a presión para lavar la carrocería, las llantas y los bajos del coche. Ideal para un lavado a mano cuidadoso que no raya la pintura.",
    image: "",
    supplier: "https://es.aliexpress.com/item/1005011812168005.html",
  },
  {
    id: "kit-detailing-20",
    category: "detailing",
    name: "Kit de detailing de 20 piezas",
    price: 34.99,
    short: "Todo lo necesario para dejar el coche como recién salido del concesionario.",
    text: "Pack de 20 piezas para limpiar y cuidar el coche por dentro y por fuera: cepillos, aplicadores, esponjas y paños para cada zona.",
    image: "",
    supplier: "https://es.aliexpress.com/item/1005012878751653.html",
  },
  {
    id: "aspiradora",
    category: "detailing",
    name: "Aspiradora para coche",
    price: 49.99,
    short: "Compacta y potente para alfombrillas, asientos y maletero.",
    text: "Aspiradora de mano pensada para el coche, con boquillas para llegar a los huecos entre asientos, las alfombrillas y el maletero.",
    image: "",
    supplier: "https://es.aliexpress.com/item/1005010126985836.html",
  },
  {
    id: "toallas-30x40",
    category: "detailing",
    name: "Toallas de microfibra 30 × 40 (3 unidades)",
    price: 14.99,
    short: "Secan y pulen sin dejar marcas ni rayar la pintura.",
    text: "Tres toallas de microfibra de 30 × 40 cm para secar, pulir y limpiar cristales e interiores sin dejar pelusa ni marcas.",
    image: "",
    supplier: "https://es.aliexpress.com/item/1005006620527681.html",
  },
  {
    id: "toallas-30x60",
    category: "detailing",
    name: "Toallas de microfibra 30 × 60 (3 unidades)",
    price: 19.99,
    short: "Tamaño grande para secar la carrocería en menos pasadas.",
    text: "Tres toallas de microfibra de 30 × 60 cm, más grandes, para secar la carrocería completa después del lavado.",
    image: "",
    supplier: "https://es.aliexpress.com/item/1005006620527681.html",
  },
  {
    id: "pulidor-faros",
    category: "detailing",
    name: "Pulidor de faros",
    price: 54.99,
    short: "Devuelve la transparencia a los faros amarillentos.",
    text: "Pulidor para restaurar los faros opacos o amarillentos y recuperar la luz y el aspecto del coche.",
    image: "",
    supplier: "https://de.aliexpress.com/item/1005005560124384.html",
  },
  {
    id: "limpiador-interiores",
    category: "detailing",
    name: "Limpiador de interiores",
    price: 29.99,
    short: "Para salpicadero, plásticos, tapicería y paneles de puerta.",
    text: "Limpiador para el interior del coche: salpicadero, plásticos, tapicería y paneles de las puertas.",
    image: "",
    supplier: "https://de.aliexpress.com/item/1005008040606742.html",
  },
  // Accesorios
  {
    id: "llavero-seguridad",
    category: "accesorios",
    name: "Llavero de seguridad con cortacinturón y martillo",
    price: 24.99,
    short: "Corta el cinturón y rompe la ventanilla en caso de emergencia.",
    text: "Llavero de emergencia con cortacinturón y martillo rompecristales, siempre a mano en las llaves del coche.",
    image: "",
    supplier: "https://de.aliexpress.com/item/1005006696359316.html",
  },
  {
    id: "adaptador-usb-bluetooth",
    category: "accesorios",
    name: "Adaptador USB y Bluetooth",
    price: 18.99,
    short: "Música y llamadas por Bluetooth y carga por USB en cualquier coche.",
    text: "Adaptador para el coche con Bluetooth para música y llamadas y puertos USB para cargar el móvil.",
    image: "",
    supplier: "https://es.aliexpress.com/item/1005005060630213.html",
  },
  {
    id: "luz-interior",
    category: "accesorios",
    name: "Luz para interior",
    price: 34.99,
    short: "Iluminación ambiental para el habitáculo.",
    text: "Luz para el interior del coche que da un ambiente más cuidado al habitáculo por la noche.",
    image: "",
    supplier: "https://de.aliexpress.com/item/1005008716612671.html",
  },
  {
    id: "quita-aranazos",
    category: "accesorios",
    name: "Quita-arañazos",
    price: 47.99,
    short: "Disimula los arañazos superficiales de la pintura.",
    text: "Producto para eliminar o disimular arañazos superficiales y marcas de la pintura del coche.",
    image: "",
    supplier: "https://es.aliexpress.com/item/1005013065446716.html",
  },
  {
    id: "pantalla-frontal",
    category: "accesorios",
    name: "Pantalla frontal",
    price: 36.99,
    short: "Información de conducción a la vista, sin apartar los ojos de la carretera.",
    text: "Pantalla para el salpicadero que muestra información de conducción delante del conductor.",
    image: "",
    supplier: "https://es.aliexpress.com/item/1005008164160774.html",
  },
];

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
