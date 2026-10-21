// Datos de contacto y ajustes del negocio.
// TODO: confirmar todos los valores marcados con "PENDIENTE" con AlpiCars antes de publicar.

const config = {
  brand: "AlpiCars",

  // PENDIENTE: dominio definitivo (se usa en Google, el mapa del sitio y los datos estructurados)
  siteUrl: "https://alpicars.com",

  // PENDIENTE: perfiles oficiales (Instagram, LinkedIn, YouTube, Google Business...). Ayudan al SEO y al GEO.
  sameAs: [],
  slogan: "Ingeniería alemana, precisión suiza, garaje español.",

  // PENDIENTE: número real de WhatsApp en formato internacional, sin "+" ni espacios
  whatsappNumber: "34600000000",
  whatsappText: "Hola AlpiCars, me gustaría información para importar un coche.",

  // PENDIENTE: email donde llegan las solicitudes de presupuesto
  email: "info@alpicars.com",

  // PENDIENTE: enlace real de la tienda Shopify
  shopUrl: "https://alpicars.myshopify.com",

  // Cambio fijo para mostrar precios en francos suizos.
  // PENDIENTE: decidir con AlpiCars si es un cambio fijo o se actualiza a diario.
  chfPerEur: 0.94,

  // Calculadora de ahorro. PENDIENTE: confirmar estas cifras con AlpiCars.
  calculator: {
    serviceFee: 2490, // servicio Llave en mano
    travelPerKm: 0.3, // combustible, peajes y vuelta del conductor (€/km)
    fees: 450, // ITV de importación, ficha técnica y tasas DGT
  },

  languages: [
    { code: "es", label: "Español", short: "ES" },
    { code: "en", label: "English", short: "EN" },
    { code: "de", label: "Deutsch", short: "DE" },
    { code: "eu", label: "Euskara", short: "EU" },
    { code: "it", label: "Italiano", short: "IT" },
    { code: "fr", label: "Français", short: "FR" },
  ],
};

export default config;
