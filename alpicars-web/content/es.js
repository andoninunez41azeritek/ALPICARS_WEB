// Todos los textos de la web en español.
// Para añadir otro idioma: copia este archivo como en.js, de.js, eu.js, it.js o fr.js y traduce los valores.

const es = {
  nav: [
    { href: "#quienes-somos", label: "Quiénes somos" },
    { href: "#como-funciona", label: "Cómo funciona" },
    { href: "#calculadora", label: "Calculadora" },
    { href: "#mas-solicitados", label: "Los más solicitados" },
    { href: "#faq", label: "FAQ" },
  ],
  header: {
    cta: "Pide presupuesto",
    login: "Acceder",
    whatsapp: "WhatsApp",
    currencyLabel: "Moneda",
    languageLabel: "Idioma",
    languageSoon: "Próximamente en este idioma. De momento verás la web en español.",
    menu: "Menú",
    menuClose: "Cerrar menú",
  },

  hero: {
    title: "Tu coche de Suiza y Alemania",
    lead: "Lo buscamos, lo revisamos en origen y te lo entregamos matriculado en España, conduciendo hasta tu puerta.",
    from: "Presupuesto cerrado desde",
    cta: "Pide presupuesto gratis",
    secondary: "Calcula tu ahorro",
    points: [
      "Vemos el coche en persona antes de que pagues",
      "Lo trae un conductor nuestro, con seguro a todo riesgo",
      "ITV y matrícula española incluidas en Llave en mano",
    ],
  },

  board: {
    servicesTitle: "Nuestros servicios",
    servicesText: "Elige cuánto quieres que hagamos por ti.",
    quiz: {
      title: "¿Qué coche es para ti?",
      text: "Test gratuito de 15 preguntas. Te decimos qué modelo encaja con tu presupuesto y tu forma de conducir.",
      cta: "Hacer el test",
    },
    shop: {
      title: "Tienda AlpiCars",
      text: "Detailing y accesorios para cuidar tu coche.",
      cta: "Ir a la tienda",
    },
  },

  marquee: "Ingeniería alemana, precisión suiza, garaje español",

  route: {
    title: "De Alemania y Suiza a tu puerta",
    lead:
      "No dependemos de agencias de transporte: un conductor de nuestro equipo trae tu coche rodando, con seguro a todo riesgo durante todo el trayecto.",
    photoNote: "Autopista en Suiza. Nuestros conductores traen cada coche rodando hasta España.",
    pick: "¿Dónde te lo entregamos?",
    distance: "por carretera desde Basilea, donde se juntan todas nuestras rutas",
    hudReady: "Listo para salir de Basilea",
    hudOnWay: "En camino a",
    hudArrived: "Entregado en",
    steps: [
      {
        title: "Búsqueda y asesoramiento",
        text: "Nos dices marca, modelo, equipamiento y presupuesto. Buscamos la mejor opción o gestionamos el coche que ya has visto.",
      },
      {
        title: "Verificación técnica en origen",
        text: "Comprobamos historial de mantenimiento, informes de accidentes y kilometraje, e inspeccionamos el coche en persona.",
      },
      {
        title: "Compra segura",
        text: "Negociamos en alemán con el vendedor, gestionamos contrato, factura e IVA en origen y formalizamos la compra al 100 % legal.",
      },
      {
        title: "Transporte asegurado",
        text: "Un conductor profesional de nuestro equipo trae el coche hasta cualquier punto de España, con seguro a todo riesgo.",
      },
      {
        title: "ITV, matrícula y entrega",
        text: "Pasamos la ITV de importación, liquidamos los impuestos y te entregamos el coche matriculado, revisado y con garantía europea.",
        note: "Incluido en el servicio Llave en mano.",
      },
    ],
  },

  about: {
    title: "Quiénes somos",
    lead:
      "AlpiCars es una agencia especializada en la gestión e importación de vehículos de alta gama y ocasión desde Suiza y Alemania hacia España.",
    paragraphs: [
      "AlpiCars nace de la visión de dos emprendedores españoles afincados en Suiza. Conocemos lo que necesita el comprador en España y estamos sobre el terreno en el mercado centroeuropeo.",
      "Tener equipo propio en Suiza y dominar el alemán marca la diferencia: acudimos a ver los coches en persona y negociamos directamente con concesionarios y particulares suizos y alemanes.",
      "Comprar un coche en el extranjero puede generar incertidumbre. Por eso asumimos el proceso entero, desde la verificación en origen hasta la ITV en España, y lo convertimos en una experiencia transparente y segura.",
    ],
    photoNote: "El Rin en Basilea, la frontera donde se juntan todas nuestras rutas antes de bajar a España.",
    facts: [
      { label: "Base", value: "Suiza" },
      { label: "Mercados", value: "Suiza y Alemania" },
      { label: "Entrega", value: "Toda España" },
      { label: "Idiomas", value: "Español y alemán" },
    ],
  },

  trust: [
    {
      title: "Sin sorpresas en el precio",
      text: "Presupuesto cerrado desde el primer día, con cada gasto detallado: coche, transporte, impuestos y nuestra gestión.",
    },
    {
      title: "Coches garantizados",
      text: "Solo trabajamos con vehículos con historial transparente y procedencia certificada.",
    },
  ],

  services: {
    title: "Servicios y precios",
    lead: "Elige cuánto quieres que hagamos por ti. Todos los precios son por vehículo e incluyen nuestra gestión.",
    updated: "Precios actualizados en octubre de 2026.",
    rows: ["Búsqueda en Suiza y Alemania", "Análisis de historial y kilometraje", "Inspección presencial y prueba", "Negociación en alemán", "Transporte a España", "Aduana, ITV y matrícula"],
    plans: [
      {
        id: "telematico",
        name: "Asesoramiento telemático",
        short: "Telemático",
        price: 230,
        suffix: "",
        text: "Para quien quiere comprar por su cuenta con el respaldo de expertos en el mercado suizo y alemán.",
        cells: ["Incluida", "Incluido", "No incluida", "No incluida", "No incluido", "Estudio de costes"],
        excludes: "No incluye inspección presencial, transporte ni trámites en España.",
      },
      {
        id: "presencial",
        name: "Revisión presencial",
        short: "Presencial",
        price: 650,
        suffix: "+ extras",
        text: "Vamos a ver el coche en Suiza o Alemania antes de que pagues nada: diagnosis OBD, chasis, pintura y prueba en carretera.",
        cells: ["Incluida", "Incluido", "Incluida, con informe en foto y vídeo", "En persona", "Módulo opcional", "Módulo opcional"],
        excludes: "Coche extra en la zona: 99 € hasta 20 km, 149 € hasta 40 km, 229 € hasta 100 km.",
      },
      {
        id: "llave",
        name: "Llave en mano",
        short: "Llave en mano",
        price: 2490,
        suffix: "+ gastos",
        recommended: true,
        text: "Nos encargamos de todo, desde la búsqueda hasta la entrega del coche matriculado en la puerta de tu casa.",
        cells: ["Incluida", "Incluido", "Incluida", "En persona y contrato", "Conduciendo, con seguro a todo riesgo", "Incluidas"],
        excludes: "No incluye el precio del coche ni las tasas oficiales, que detallamos en la oferta. Canarias, con gastos extra.",
      },
      {
        id: "empresas",
        name: "Empresas y flotas",
        short: "Empresas",
        price: null,
        suffix: "",
        text: "Para empresas, autónomos y pymes que renuevan flota con IVA deducible en origen.",
        cells: ["Lotes o unidades", "Incluido", "Incluida", "Incluida", "Logística prioritaria", "Tramitación agrupada"],
        excludes: "No incluye financiación propia ni rotulación (disponible bajo solicitud).",
      },
    ],
    onRequest: "A consultar",
    choose: "Pedir este servicio",
    tableCorner: "Qué incluye",
    forWhom: "Para quién",
    notes: "A tener en cuenta",
    recTag: "Nos ocupamos de todo",
  },

  calc: {
    title: "¿Cuánto te ahorras importando?",
    lead: "Compara el precio del coche en España con lo que te cuesta traerlo desde Alemania o Suiza con nuestro servicio Llave en mano.",
    origin: "¿Desde dónde?",
    origins: { de: "Alemania", ch: "Suiza" },
    priceEs: "Precio del mismo coche en España",
    priceOrigin: "Precio en origen",
    priceOriginHintCH: "Sin IVA suizo (se recupera al exportar)",
    priceOriginHintDE: "Precio final, con IVA alemán incluido",
    age: "Antigüedad",
    co2: "Emisiones de CO₂",
    eur1: "Fabricado en la UE o en Suiza (certificado EUR.1, sin arancel)",
    dest: "Entrega en",
    resultSave: "de ahorro aproximado frente a comprarlo en España.",
    resultNoSave: "más que en España: en este caso no compensa importar.",
    resultNoSaveText: "Te lo diríamos igual antes de empezar. Prueba con otro modelo o pide que lo revisemos.",
    breakdown: "Cómo sale la cuenta",
    rows: {
      car: "Coche en origen",
      duty: "Arancel (10 %)",
      vat: "IVA de importación (21 %)",
      reg: "Impuesto de matriculación",
      fees: "ITV, ficha técnica y tasas DGT",
      travel: "Gastos del viaje",
      service: "Servicio Llave en mano",
      total: "Coste total en España",
    },
    note: "Estimación orientativa. El impuesto de matriculación se calcula con las tablas oficiales de Hacienda y puede variar; te damos la cifra exacta en el presupuesto.",
    cta: "Quiero el cálculo exacto",
  },

  models: {
    title: "Los más solicitados",
    lead: "Por qué traemos estos modelos y en qué nos fijamos antes de comprarlos.",
    tabs: { de: "Desde Alemania", ch: "Desde Suiza" },
    pros: "A favor",
    cons: "En qué nos fijamos",
    ask: "Quiero uno de estos",
    de: [
      {
        name: "Volkswagen Golf y Tiguan",
        photo: "golf",
        pros: [
          "Reventa muy fácil en España por su altísima demanda.",
          "Oferta enorme en Alemania, con acabados R-Line, GTI y R.",
          "Historial fácil de verificar y recambios económicos.",
        ],
        cons: ["Muchas unidades vienen de alquiler o flotas: descartamos las que tienen desgaste interior alto o kilometraje dudoso."],
      },
      {
        name: "BMW Serie 3 Touring, X3 y X5",
        photo: "bmw",
        pros: [
          "Las versiones Touring y xDrive tienen mucha demanda en España y poca oferta.",
          "Diésel de 6 cilindros (330d, X5 30d) muy valorados por su fiabilidad.",
        ],
        cons: [
          "Revisamos cadena de distribución y sistemas EGR y AdBlue.",
          "Las versiones diésel grandes sin hibridación pagan más al matricular.",
        ],
      },
      {
        name: "Audi A4, A6 Avant y Q5",
        photo: "audi",
        pros: [
          "La tracción quattro y el acabado S-Line mantienen muy bien su valor en España.",
          "Interiores que envejecen excepcionalmente bien.",
        ],
        cons: [
          "Comprobamos que el cambio S-Tronic tenga hecho su cambio de aceite.",
          "Revisamos la suspensión neumática habitual en A6 y Q5.",
        ],
      },
      {
        name: "Mercedes Clase C, E y GLC AMG Line",
        photo: "mercedes",
        pros: [
          "Gran valor percibido y buena depreciación inicial en Alemania.",
          "Las versiones híbridas enchufables llegan con etiqueta CERO en España.",
        ],
        cons: [
          "Pasamos diagnosis oficial Star Diagnosis para detectar fallos electrónicos ocultos.",
          "Recambios originales más caros que en VAG o BMW.",
        ],
      },
    ],
    ch: [
      {
        name: "Porsche 911, Macan y Cayenne",
        photo: "porsche",
        pros: [
          "Estado impecable: en Suiza los kilometrajes son bajos y las revisiones, en concesionario oficial.",
          "Mucha más calidad por el precio que el stock de ocasión en España.",
          "Historial y mantenimiento fáciles de rastrear.",
        ],
        cons: ["Más impuestos al importar desde Suiza (IVA, matriculación y arancel si no aplica el EUR.1): te los detallamos antes de comprar."],
      },
      {
        name: "BMW M y Audi RS",
        photo: "rs",
        pros: [
          "Configuraciones con todos los extras, casi imposibles de encontrar en España.",
          "Unidades muy cuidadas, guardadas en garaje y bien mantenidas.",
        ],
        cons: ["Medimos frenos carbocerámicos y transmisión con espesímetro y diagnosis por si han tenido uso exigente."],
      },
      {
        name: "Mercedes-AMG y Range Rover Sport",
        photo: "rangeRover",
        pros: [
          "Tracción total y equipamiento de invierno suizo de serie.",
          "Muy buscados por clientes que quieren un coche exclusivo.",
        ],
        cons: [
          "En AMG revisamos los bajos por la sal de las carreteras alpinas.",
          "En Range Rover vigilamos depreciación y sistemas eléctricos y neumáticos.",
        ],
      },
    ],
  },

  faq: {
    title: "Preguntas frecuentes",
    lead: "Lo que más nos preguntan antes de importar un coche desde Suiza o Alemania.",
    ask: "¿No encuentras tu pregunta?",
    askCta: "Pregúntanos por WhatsApp",
    items: [
      {
        q: "¿Qué incluye el presupuesto de AlpiCars?",
        a: "Es 100 % cerrado desde el primer día: precio del coche en origen, nuestra gestión, impuestos (IVA e IEDMT), transporte, ITV y matriculación en España.",
      },
      {
        q: "¿Cómo sé que el coche no tiene el kilometraje manipulado?",
        a: "Revisamos el historial oficial de mantenimiento, cruzamos datos con informes internacionales como Carfax o DAT e inspeccionamos el coche en origen antes de comprar.",
      },
      {
        q: "¿El coche viene con garantía?",
        a: "Sí, con garantía europea válida en cualquier taller oficial o concertado de España. No tiene coste si el vendedor la incluye; si no, puedes contratarla aparte.",
      },
      {
        q: "Ya he visto un coche en una web extranjera. ¿Podéis traerlo?",
        a: "Claro. Envíanos el enlace: contactamos con el vendedor, negociamos, verificamos el coche y gestionamos toda la importación y la entrega.",
      },
      {
        q: "¿Tengo que pagar todo por adelantado?",
        a: "No. Pagas una señal para reservar el coche y revisarlo, el coche directamente al vendedor tras la verificación, y el resto cuando el coche está en España.",
      },
      {
        q: "¿Quién pasa la ITV y matricula el coche?",
        a: "Nosotros, si contratas Llave en mano: homologación, ITV de importación, impuestos de matriculación y entrega con placas españolas.",
      },
      {
        q: "¿Puedo elegir dónde me entregáis el coche?",
        a: "Sí, en tu casa o donde nos digas, en cualquier punto de la península. Baleares, Canarias, Ceuta y Melilla tienen gastos extra.",
      },
      {
        q: "¿Qué documentación me entregáis?",
        a: "La factura de compra a tu nombre, el permiso de circulación español, la ficha técnica con la ITV, el libro de mantenimiento y los certificados de garantía.",
      },
      {
        q: "¿Cuánto se tarda?",
        a: "Depende de la disponibilidad del coche en origen y de los plazos de matriculación. Te mantenemos informado en cada fase hasta la entrega.",
      },
      {
        q: "¿Cómo se hacen los pagos?",
        a: "En tres pasos: señal para la inspección y la reserva, pago del coche al vendedor tras aprobar la revisión, y liquidación final de tasas, impuestos y honorarios con el coche ya en España.",
      },
    ],
  },

  lead: {
    title: "Pide tu presupuesto cerrado",
    text: "Cuéntanos qué coche buscas y te enviamos el precio final, con el coche matriculado en tu puerta. Sin compromiso.",
    noService: "Aún no lo sé",
    fields: {
      name: "Nombre",
      contact: "Teléfono o email",
      car: "¿Qué coche buscas?",
      carPlaceholder: "Ej.: BMW X5 30d, 2021, menos de 80.000 km",
      service: "Servicio",
    },
    submit: "Enviar solicitud",
    whatsapp: "O escríbenos por WhatsApp",
    privacy: "Al enviar aceptas que te contactemos para preparar tu presupuesto.",
    sent: "Se ha abierto tu correo con la solicitud lista para enviar.",
  },

  quiz: {
    title: "¿Qué coche es para ti?",
    intro: "15 preguntas rápidas. Al final te recomendamos un tipo de coche y lo que suele costar traerlo.",
    start: "Empezar",
    next: "Siguiente",
    back: "Atrás",
    close: "Cerrar",
    of: "de",
    resultTitle: "Tu coche ideal",
    resultCta: "Quiero un presupuesto para este coche",
    restart: "Repetir el test",
    questions: [
      { q: "¿Cuál es tu presupuesto total aproximado, con matriculación e importación?", key: "budget", a: ["Menos de 15.000 €", "15.000 € – 25.000 €", "25.000 € – 45.000 €", "Más de 45.000 €"] },
      { q: "¿Qué prioridad das a la antigüedad y al kilometraje?", key: "age", a: ["Casi nuevo (0-3 años) y pocos km", "Mejor calidad/precio (3-6 años, 50.000–100.000 km)", "Me da igual si es un modelo superior a buen precio"] },
      { q: "¿Para qué vas a usar el coche principalmente?", key: "use", a: ["Ciudad y recados", "Viajes largos por autopista", "Diario y escapadas de fin de semana", "Disfrute y conducción deportiva"] },
      { q: "¿Cuántos kilómetros harás al año?", key: "km", a: ["Menos de 10.000 km", "Entre 10.000 y 20.000 km", "Más de 20.000 km"] },
      { q: "¿Cuánto espacio necesitas?", key: "space", a: ["1 o 2 personas y poco equipaje", "4-5 plazas estándar", "Familia grande, carritos o mascotas", "7 plazas o carga máxima"] },
      { q: "¿Qué tipo de carrocería encaja contigo?", key: "body", a: ["Compacto o utilitario", "Berlina o familiar", "SUV o crossover", "Deportivo, coupé o cabrio"] },
      { q: "¿Prefieres alguna tracción?", key: "drive", a: ["Delantera", "Total (4x4 / AWD)", "Trasera", "Me da igual"] },
      { q: "¿Qué motorización prefieres?", key: "fuel", a: ["Gasolina", "Diésel", "Híbrido o híbrido enchufable", "100 % eléctrico"] },
      { q: "¿Necesitas una etiqueta ambiental concreta?", key: "label", a: ["ECO o CERO, imprescindible", "Me basta con la C", "No me afectan las ZBE"] },
      { q: "¿Qué cambio prefieres?", key: "gearbox", a: ["Automático", "Manual", "Indiferente"] },
      { q: "¿Qué equipamiento es imprescindible para ti?", key: "equip", a: ["Básico: CarPlay/Android Auto y climatizador", "Confort: asientos calefactables, crucero adaptativo, cámara", "Premium: techo panorámico, sonido top, cuero", "Deportivo: M Sport, S-Line, AMG Line"] },
      { q: "¿Qué marcas te interesan?", key: "brand", a: ["Solo premium alemanas", "Mejor calidad/precio en marcas generalistas", "Cualquiera si el coche está impecable"] },
      { q: "¿Desde dónde prefieres importarlo?", key: "origin", a: ["Alemania: más oferta y equipamiento", "Suiza: pocos km y mantenimiento oficial", "Donde esté el mejor precio y estado"] },
      { q: "¿Cuándo te gustaría tenerlo en España?", key: "when", a: ["Lo antes posible (menos de 1 mes)", "En 1–3 meses", "Solo estoy mirando"] },
      { q: "¿Qué servicio necesitas?", key: "service", a: ["Llave en mano", "Revisión presencial de un coche que ya he visto", "Solo asesoramiento"] },
    ],
  },

  footer: {
    contact: "Contacto",
    legal: [
      { href: "/aviso-legal", label: "Aviso legal" },
      { href: "/privacidad", label: "Privacidad" },
      { href: "/cookies", label: "Cookies" },
    ],
    rights: "Todos los derechos reservados.",
    top: "Volver arriba",
    services: "Servicios y precios",
    shop: "Tienda",
    credits: "Fotografías de Wikimedia Commons, con licencia libre:",
    mapCredit: "Mapa: Natural Earth.",
    photoTitles: {
      basilea: "El Rin en Basilea",
      autobahn: "Autopista en Suiza",
      detalle: "Mercedes-Benz Clase C Cabrio",
      golf: "Volkswagen Golf R",
      bmw: "BMW X5",
      audi: "Audi A6 Avant",
      mercedes: "Mercedes-Benz Clase C",
      porsche: "Porsche 911",
      rs: "Audi RS6 Avant",
      rangeRover: "Range Rover Sport",
    },
  },
};

export default es;
