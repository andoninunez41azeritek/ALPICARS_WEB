// Datos de contacto y ajustes del negocio.
// TODO: confirmar todos los valores marcados con "PENDIENTE" con AlpiCars antes de publicar.

const config = {
  brand: "AlpiCars",

  // Dominio de AlpiCars (GoDaddy). Se usa en Google, el mapa del sitio, los datos estructurados y los emails.
  siteUrl: "https://alpicars.com",

  // PENDIENTE: perfiles oficiales (Instagram, LinkedIn, YouTube, Google Business...). Ayudan al SEO y al GEO.
  sameAs: [],
  slogan: "Ingeniería alemana, precisión suiza, garaje español.",

  // PENDIENTE: número real de WhatsApp en formato internacional, sin "+" ni espacios
  whatsappNumber: "34600000000",
  whatsappText: "Hola AlpiCars, me gustaría información para importar un coche.",

  // Email de contacto público (el del aviso legal de AlpiCars)
  email: "contact@alpicars.com",

  // Titulares de la web (aviso legal y privacidad)
  company: {
    owners: ["Mohamed El hachimi", "Peio Berasategui"],
    city: "Zúrich, Suiza",
    // PENDIENTE (AlpiCars): teléfono suizo de contacto, p. ej. "+41 44 123 45 67". Vacío = no se muestra.
    phone: "",
  },

  // Medición. Vacío = desactivado. Solo se cargan si el visitante acepta esas cookies en el aviso.
  // PENDIENTE (AlpiCars/Azeritek): crear Google Analytics 4 y el píxel de Meta si se quieren usar.
  analytics: {
    ga4: "", // ID de Google Analytics 4, p. ej. "G-XXXXXXXXXX"
    metaPixel: "", // ID del píxel de Meta, p. ej. "123456789012345"
  },

  // Tienda propia (app/tienda). Si algún día se pasa a Shopify, cambia aquí el enlace.
  shopUrl: "/tienda",

  // Cambio fijo para mostrar precios en francos suizos.
  // PENDIENTE: decidir con AlpiCars si es un cambio fijo o se actualiza a diario.
  chfPerEur: 0.94,

  // Calculadora de ahorro. PENDIENTE: confirmar estas cifras con AlpiCars.
  calculator: {
    serviceFee: 2490, // servicio Llave en mano
    travelPerKm: 0.3, // combustible, peajes y vuelta del conductor (€/km)
    dgtFee: 97.8, // tasa DGT de matriculación 2026 (oficial)
    itv: 150, // PENDIENTE: ITV de importación (varía según la estación y la comunidad)
    plates: 30, // PENDIENTE: juego de placas
    docs: 120, // PENDIENTE: ficha técnica reducida / certificado de conformidad (COC)
  },

  // Botón "Continuar con Google" en el acceso. Activarlo solo después de configurar Google en
  // Supabase → Authentication → Sign In / Providers → Google.
  googleLogin: false,

  // Programa de referidos. PENDIENTE (AlpiCars): definir el premio y escribirlo aquí,
  // por ejemplo: "Si alguien contrata con tu enlace, te regalamos ...". Vacío = texto general.
  referral: { reward: "" },

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
