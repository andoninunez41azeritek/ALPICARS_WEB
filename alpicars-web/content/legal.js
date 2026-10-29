// Textos legales de la web.
//
// - Aviso legal, Política de cookies y Condiciones del servicio: textos entregados por AlpiCars (29/10/2026),
//   con los datos de contacto ya rellenados. La tabla de cookies está adaptada a las que usa esta web de verdad.
// - Política de privacidad y Condiciones de la tienda: BORRADOR preparado por Azeritek a partir de lo que hace
//   la web. AlpiCars (o su asesor) debe revisarlos antes de publicar. Los puntos a confirmar llevan "PENDIENTE".
//
// Formato: cada documento tiene secciones; cada sección, bloques de texto:
//   "texto"                       párrafo
//   { ul: ["...", "..."] }        lista
//   { table: { head, rows } }     tabla
//   { note: "texto" }             recuadro destacado

import config from "./config";

const c = config.company;
const site = config.siteUrl.replace(/^https?:\/\//, "");
const owners = c.owners.join(" y ");

export const updated = "29 de octubre de 2026";

const contactLines = [
  `Nombre comercial / Proyecto: ${config.brand}`,
  `Titulares / Promotores responsables: ${owners}`,
  `Ubicación principal: ${c.city}`,
  `Correo electrónico de contacto: ${config.email}`,
  ...(c.phone ? [`Teléfono: ${c.phone}`] : []),
  `Sitio web: ${site}`,
];

/* ---------------------------------------------------------------- Aviso legal */

export const avisoLegal = {
  slug: "aviso-legal",
  title: "Aviso legal",
  subtitle: "Impressum",
  sections: [
    {
      h: "1. Titularidad del sitio web y contacto",
      blocks: [
        "En cumplimiento de la legislación suiza aplicable (en particular, la Ley Federal contra la Competencia Desleal, LCD / UWG), se facilita la siguiente información sobre los titulares de este sitio web:",
        { ul: contactLines },
        "AlpiCars se encuentra actualmente en fase de lanzamiento y formalización. Todos los servicios presentados a través de este portal son gestionados directamente por los promotores indicados.",
      ],
    },
    {
      h: "2. Objeto de la actividad",
      blocks: [
        "AlpiCars es una agencia especializada en la intermediación, gestión y tramitación de la importación de vehículos desde Suiza y Alemania con destino a España, ofreciendo un servicio integral de búsqueda, verificación técnica, transporte, trámites aduaneros y matriculación.",
      ],
    },
    {
      h: "3. Propiedad intelectual",
      blocks: [
        "Todos los contenidos de este sitio web (incluyendo textos, imágenes, logotipos, marcas, diseño gráfico y código fuente) son propiedad de los titulares de AlpiCars o de terceros que han autorizado expresamente su uso. Queda prohibida la reproducción, distribución o modificación total o parcial de dichos contenidos sin la autorización previa y por escrito de sus titulares.",
        "Las fotografías de vehículos procedentes de Wikimedia Commons se utilizan con licencia libre; su autoría y licencia se indican al pie de la página principal.",
      ],
    },
    {
      h: "4. Exención de responsabilidad",
      blocks: [
        "Información de vehículos: AlpiCars actualiza constantemente la información sobre los vehículos importables procedentes de Alemania y Suiza. No obstante, al tratarse de un mercado dinámico, los datos, disponibilidad, precios o especificaciones técnicas de terceros pueden sufrir variaciones. AlpiCars no asume responsabilidad por la exactitud de dichos datos externos hasta la formalización de la reserva mediante contrato.",
        "Calculadora y test: los importes de la calculadora de ahorro y los resultados del test son estimaciones orientativas. El precio definitivo es el que figura en el presupuesto personalizado que AlpiCars entrega por escrito.",
        "Enlaces de terceros: este sitio web puede contener enlaces a portales o servicios de terceros. AlpiCars no ejerce ningún control sobre dichos sitios y declina cualquier responsabilidad sobre sus contenidos o políticas.",
        "Aduanas e impuestos: la importación de vehículos entre Suiza/Alemania y España está sometida a la normativa aduanera y fiscal vigente. AlpiCars actúa como intermediario y gestor; el cliente final será responsable de los impuestos y tasas legales que procedan en España conforme a la ley aplicable.",
      ],
    },
    {
      h: "5. Ley aplicable y jurisdicción",
      blocks: [
        "El presente sitio web y sus contenidos se rigen conforme a la legislación suiza. Para cualquier controversia o reclamación derivada del uso de esta web, las partes se someten a la jurisdicción de los tribunales competentes de Zúrich, Suiza, salvo que la legislación imperativa en materia de protección al consumidor establezca otro fuero aplicable.",
      ],
    },
  ],
};

/* ---------------------------------------------------------------- Cookies */

export const cookieBanner = {
  title: "Uso de cookies en AlpiCars",
  text: "Utilizamos cookies propias y de terceros para garantizar el correcto funcionamiento de la web, analizar el tráfico y personalizar nuestros contenidos. Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias.",
  more: "Política de cookies",
  accept: "Aceptar todas",
  reject: "Rechazar no esenciales",
  configure: "Configurar",
  save: "Guardar mis preferencias",
  categories: [
    { id: "necessary", label: "Técnicas o necesarias", text: "Imprescindibles para que la web funcione: tu sesión, el carrito y tus preferencias. No se pueden desactivar.", locked: true },
    { id: "analytics", label: "Análisis", text: "Nos dicen cuántas personas visitan la web y qué páginas usan, de forma anónima, para mejorarla." },
    { id: "marketing", label: "Marketing", text: "Miden la efectividad de nuestras campañas en redes sociales." },
  ],
};

export const cookies = {
  slug: "cookies",
  title: "Política de cookies",
  sections: [
    {
      h: "1. ¿Qué son las cookies?",
      blocks: [
        "Una cookie es un pequeño archivo de texto que un sitio web almacena en tu ordenador, teléfono móvil o cualquier otro dispositivo cuando lo visitas. Las cookies permiten que la página web recuerde tus acciones y preferencias (como el idioma u otras preferencias de visualización) durante un período de tiempo, para que no tengas que volver a configurarlas cada vez que regresas al sitio o navegas de una página a otra.",
        "Esta web también utiliza el almacenamiento local de tu navegador (localStorage y sessionStorage), que funciona de forma parecida a una cookie. En esta política llamamos «cookies» a ambas cosas.",
      ],
    },
    {
      h: "2. ¿Qué tipos de cookies utiliza este sitio web?",
      blocks: [
        "En AlpiCars podemos utilizar los siguientes tipos de cookies según su finalidad:",
        {
          ul: [
            "Cookies técnicas o estrictamente necesarias: son indispensables para el funcionamiento básico del sitio web y para permitirte la navegación y el uso de las diferentes opciones o servicios que en él existen (por ejemplo, identificar la sesión, acceder a partes de acceso restringido o recordar los elementos de una solicitud o del carrito). No pueden ser desactivadas.",
            "Cookies de análisis o medición: nos permiten a nosotros o a terceros cuantificar el número de usuarios y realizar la medición y análisis estadístico de la utilización que hacen los usuarios de nuestro sitio web, con el fin de mejorar la oferta de servicios de importación de vehículos. Solo se instalan si las aceptas.",
            "Cookies de personalización y marketing: permiten gestionar de la forma más eficaz posible la oferta publicitaria, adecuando el contenido del anuncio al servicio solicitado o al uso que realices de nuestra página web. Solo se instalan si las aceptas.",
          ],
        },
      ],
    },
    {
      h: "3. Cookies utilizadas en AlpiCars",
      blocks: [
        {
          table: {
            head: ["Nombre", "Proveedor", "Finalidad", "Duración", "Tipo"],
            rows: [
              ["cookie_consent", "AlpiCars (propia)", "Guardar tus preferencias sobre el uso de cookies", "1 año", "Técnica / necesaria"],
              ["alpicars-session", "AlpiCars (propia)", "Mantener la sesión iniciada en tu cuenta de cliente", "Hasta que cierres sesión", "Técnica / necesaria"],
              ["alpicars-cart", "AlpiCars (propia)", "Recordar los productos de tu carrito de la tienda", "Hasta que compres o lo vacíes", "Técnica / necesaria"],
              ["alpicars-ref, alpicars-origin", "AlpiCars (propia)", "Saber si llegas recomendado por otro cliente o desde un informe compartido, para atender bien tu solicitud", "alpicars-ref: persistente · alpicars-origin: la visita", "Técnica / necesaria"],
              ["alpicars-lang, alpicars-currency, alpicars-nudge", "AlpiCars (propia)", "Recordar tu idioma, la moneda y los avisos que ya has visto", "Persistente", "Técnica / necesaria"],
              ["Cookies de Stripe", "Stripe, Inc.", "Procesar el pago con seguridad y prevenir el fraude (solo en la página de pago)", "Hasta 2 años", "Técnica / necesaria"],
              ["_ga, _gid", "Google LLC (Analytics)", "Distinguir a los usuarios de forma anónima para medir las visitas", "Hasta 2 años", "Análisis (solo si la aceptas)"],
              ["_fbp", "Meta Platforms, Inc.", "Medir la efectividad de campañas publicitarias en redes sociales", "3 meses", "Marketing (solo si la aceptas)"],
            ],
          },
        },
        { note: "Las cookies de análisis y de marketing solo se instalan si las aceptas en el aviso de cookies, y solo cuando AlpiCars tiene activada esa herramienta." },
      ],
    },
    {
      h: "4. ¿Cómo aceptar, rechazar o configurar las cookies?",
      blocks: [
        "La primera vez que accedes a nuestro sitio web se muestra un aviso explicativo sobre el uso de cookies. Desde este aviso puedes:",
        {
          ul: [
            "Aceptar todas las cookies: autorizarás la instalación de todas las cookies indicadas.",
            "Rechazar las cookies no esenciales: solo se instalarán aquellas necesarias para el funcionamiento del sitio.",
            "Configurar tus preferencias: podrás elegir qué categorías de cookies deseas activar o desactivar.",
          ],
        },
        "Puedes modificar tus preferencias en cualquier momento con el enlace «Configurar cookies» situado en el pie de página de nuestro sitio web.",
      ],
    },
    {
      h: "5. Configuración del navegador",
      blocks: [
        "Además, puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de tu navegador:",
        {
          ul: [
            "Google Chrome: Configuración > Privacidad y seguridad > Cookies y otros datos de sitios",
            "Mozilla Firefox: Ajustes > Privacidad & Seguridad > Cookies y datos del sitio",
            "Safari (Mac / iOS): Preferencias > Privacidad",
            "Microsoft Edge: Configuración > Permisos del sitio > Cookies y datos del sitio",
          ],
        },
        "Ten en cuenta que si desactivas las cookies necesarias, es posible que no puedas navegar correctamente o utilizar ciertas funciones de nuestro sitio web, como tu cuenta o el carrito.",
      ],
    },
    {
      h: "6. Transferencia de datos a terceros países",
      blocks: [
        "Algunas cookies analíticas o publicitarias pueden pertenecer a proveedores de servicios con sede fuera de Suiza o de la Unión Europea. Estas transferencias se realizan bajo mecanismos legales seguros acordes a las exigencias del Reglamento General de Protección de Datos (RGPD) y de la Ley Federal de Protección de Datos suiza (nLPD).",
      ],
    },
    {
      h: "7. Actualización de la Política de cookies",
      blocks: [
        "AlpiCars se reserva el derecho de modificar esta Política de cookies en función de exigencias legislativas, reglamentarias o con la finalidad de adaptarla a las instrucciones dictadas por las autoridades de protección de datos aplicables.",
      ],
    },
  ],
};

/* ---------------------------------------------------------------- Condiciones del servicio (importación) */

export const condicionesServicio = {
  slug: "condiciones-servicio",
  title: "Términos y condiciones del servicio de importación",
  subtitle: "Documento AGB · válido para servicios de localización, inspección técnica, intermediación, gestión logística e importación de vehículos",
  sections: [
    {
      h: "Partes del contrato",
      blocks: [
        "De una parte, AlpiCars International Car Import (en adelante, la «Agencia»), y de otra parte, la persona física o jurídica identificada en la hoja de encargo u orden de servicio (en adelante, el «Cliente»).",
        { note: "Estas condiciones se aceptan expresamente al firmar la Hoja de Pedido o Mandato de Importación. Te las enviamos junto con tu presupuesto para que las leas con calma antes de firmar." },
      ],
    },
    {
      h: "1. Objeto del contrato y naturaleza del servicio",
      blocks: [
        "1.1. Prestación de servicios: la Agencia actúa como prestadora de servicios especializados de asesoramiento, inspección presencial, intermediación en la compraventa, coordinación logística de transporte internacional y gestión aduanera para la importación de vehículos de motor.",
        "1.2. Calidad de mandataria: salvo que se estipule expresamente por escrito lo contrario, la Agencia actúa exclusivamente en calidad de mandataria e intermediaria por cuenta y orden del Cliente. La propiedad del vehículo es adquirida directamente por el Cliente al vendedor u origen correspondiente.",
        "1.3. Exclusión de relación de compraventa: la Agencia no actúa como concesionario, fabricante ni vendedor final del vehículo. Cualquier relación jurídica y contractual derivada de la compraventa vincula exclusivamente al Cliente y al vendedor en origen.",
      ],
    },
    {
      h: "2. Encargo, proceso de compra y estructura de pagos",
      blocks: [
        "2.1. Formalización: el encargo se formalizará mediante la firma de la Hoja de Pedido o Mandato de Importación, donde se especificarán las características del vehículo solicitado, presupuesto máximo y servicios contratados.",
        "2.2. Provisión de fondos: el Cliente abonará a la Agencia una provisión de fondos o depósito previo antes de iniciar las gestiones de reserva, transporte o pago a cuenta del vehículo.",
        "2.3. Desglose financiero: el precio final reflejará de forma transparente: (a) el coste neto o bruto del vehículo en origen; (b) los honorarios de gestión de la Agencia; (c) los costes de traslado por carretera (combustible, peajes, seguros de trayecto y placas de tránsito); (d) los tributos, aranceles e impuestos aduaneros obligatorios.",
        "2.4. Fluctuación de divisas (EUR/CHF): los presupuestos expresados en moneda extranjera están sujetos a variaciones del tipo de cambio. El riesgo o diferencia cambiaria entre la emisión del presupuesto y el pago efectivo será asumido íntegramente por el Cliente.",
        "2.5. Gastos adicionales MFK / ITV: cualquier reparación, adaptación técnica o sustitución de componentes requerida por el órgano oficial de inspección (Strassenverkehrsamt / MFK / ITV) para la homologación del vehículo no incluida en la inspección inicial será asumida económicamente por el Cliente.",
        "2.6. Derecho de retención (art. 895 ZGB): la Agencia mantendrá el derecho de retención sobre el vehículo, sus llaves y la documentación original (Fahrzeugausweis, DUA, etc.) hasta que el Cliente haya satisfecho el 100 % de la liquidación final de gastos, honorarios y tributos.",
      ],
    },
    {
      h: "3. Inspección técnica y exención de vicios ocultos",
      blocks: [
        "3.1. Alcance de la inspección: las inspecciones previas a la compra realizadas por la Agencia se basan en un protocolo estándar visual, diagnóstico electrónico mediante escáner OBD y verificación documental disponible al momento de la revisión.",
        "3.2. Exención de responsabilidad y vehículo usado: la Agencia no opera como taller fabricante ni concede garantía mecánica directa. El Cliente acepta la compra del vehículo usado en el estado de conservación e inspección en que se encuentra («tal cual»). La Agencia no asumirá responsabilidad por vicios ocultos, averías mecánicas internas no detectables sin desmontaje técnico, manipulaciones previas de kilometraje por terceros o fallos sobrevenidos tras la entrega.",
        "3.3. Garantía del vendedor original: cualquier derecho de garantía legal o contractual corresponde exclusivamente al vendedor en origen. El Cliente deberá dirigir sus reclamaciones directamente a dicho vendedor sin involucrar a la Agencia.",
      ],
    },
    {
      h: "4. Traslado por carretera, conducción directa y plazos",
      blocks: [
        "4.1. Modalidad de traslado: el traslado del vehículo desde su ubicación de origen hasta el punto de entrega designado se realizará por conducción directa a cargo de personal cualificado o conductores autorizados por la Agencia, utilizando placas de tránsito/garaje oficiales y seguro específico.",
        "4.2. Incremento de kilometraje: el Cliente acepta el incremento en el kilometraje del vehículo correspondiente a la distancia real del trayecto de traslado directo y las comprobaciones dinámicas necesarias en ruta.",
        "4.3. Riesgo de tránsito menor: el tránsito rodado en autopista conlleva un desgaste ordinario e imponderables cosméticos menores fuera del control de la Agencia (picaduras de grava en carrocería, pequeños impactos en parabrisas o suciedad de ruta). Salvo negligencia grave o dolo del conductor, dichos percances no constituirán responsabilidad de la Agencia ni darán derecho a indemnización.",
        "4.4. Estimación de plazos: los plazos comunicados son estimaciones operativas. La Agencia no responderá por retrasos derivados de incidencias de tráfico, condiciones meteorológicas adversas, controles de carretera o inspecciones aduaneras fronterizas.",
      ],
    },
    {
      h: "5. Gestiones aduaneras, aranceles e impuestos",
      blocks: [
        "5.1. Sujeto pasivo: el Cliente es el sujeto pasivo único de los tributos de importación (IVA/MwSt, aranceles aduaneros e impuestos sobre vehículos de motor). La Agencia tramitará la liquidación en nombre y representación del Cliente en base a las leyes aduaneras vigentes.",
        "5.2. Certificado EUR.1 / declaración de origen: la Agencia gestionará la solicitud del beneficio de arancel preferencial (0 %) en vehículos comunitarios. Si el vendedor u organismo aduanero deniega la emisión del documento por falta de trazabilidad, el arancel estándar (10 %) correrá a cargo del Cliente.",
        "5.3. Veracidad documental y origen de fondos: el Cliente declara que la información y documentación facilitadas para la aduana son auténticas y que los fondos destinados a la adquisición provienen de actividades legítimas, asumiendo la responsabilidad por falsedad u omisión.",
      ],
    },
    {
      h: "6. Cancelación, desistimiento y penalizaciones",
      blocks: [
        "6.1. Cancelación por el Cliente: si el Cliente cancela unilateralmente el encargo tras la reserva formalizada o compra en origen, perderá el importe depositado y responderá por los gastos devengados (inspecciones, reservas no reembolsables).",
        "6.2. Cancelación por defectos graves: si la compra no se concreta por defectos graves no declarados detectados durante la inspección técnica de la Agencia, la provisión de fondos será reembolsada íntegramente al Cliente, descontando únicamente el coste de la inspección realizada.",
        "6.3. Tasa de custodia (Standgebühren): si tras la llegada del vehículo el Cliente retrasa más de 5 días hábiles el pago final de la liquidación, la matriculación o la recogida del vehículo, se devengará una tasa de custodia de 50 CHF por día en concepto de aparcamiento y guarda.",
      ],
    },
    {
      h: "7. Protección de datos personales",
      blocks: [
        "7.1. Tratamiento de datos: los datos del Cliente se tratarán conforme a la Ley Federal de Protección de Datos de Suiza (nLPD) y el Reglamento General de Protección de Datos de la UE (RGPD). Serán cedidos exclusivamente a aduanas, autoridades de tráfico, aseguradoras y organismos de matriculación para la ejecución del servicio. Más información en nuestra Política de privacidad.",
      ],
    },
    {
      h: "8. Ley aplicable y jurisdicción competente",
      blocks: [
        "8.1. Legislación aplicable: el presente contrato se rige e interpreta conforme al Derecho sustantivo suizo (Código de Obligaciones, CO).",
        "8.2. Fuero judicial: para la resolución de cualquier discrepancia derivada del presente acuerdo, las partes se someten expresamente a la jurisdicción de los tribunales ordinarios del cantón de residencia de la Agencia en Suiza, renunciando a cualquier otro fuero.",
      ],
    },
  ],
};

/* ---------------------------------------------------------------- Privacidad (BORRADOR) */
// BORRADOR de Azeritek: AlpiCars no ha entregado este texto. Revisarlo antes de publicar.

export const privacidad = {
  slug: "privacidad",
  title: "Política de privacidad",
  sections: [
    {
      h: "1. Responsable del tratamiento",
      blocks: [
        `Los responsables de tus datos son los titulares de ${config.brand}: ${owners}, con domicilio en ${c.city}.`,
        `Para cualquier cuestión sobre tus datos puedes escribirnos a ${config.email}.`,
        "Tratamos tus datos conforme a la Ley Federal de Protección de Datos de Suiza (nLPD) y, cuando resides en la Unión Europea, conforme al Reglamento General de Protección de Datos (RGPD).",
      ],
    },
    {
      h: "2. Qué datos recogemos",
      blocks: [
        {
          ul: [
            "Solicitudes de presupuesto y contacto: nombre, email, teléfono, el coche o servicio que te interesa y lo que nos cuentes en el mensaje.",
            "Cuenta de cliente: email, contraseña (guardada cifrada, nunca la vemos), nombre, teléfono, si quieres recibir ofertas, y los informes del test o de la calculadora que decidas guardar.",
            "Pedidos de la tienda: nombre, apellidos, email, teléfono, dirección de envío, productos comprados e importe. Los datos de la tarjeta los recoge directamente Stripe; AlpiCars no los ve ni los guarda.",
            "Encargos de importación: los datos necesarios para la compra, el transporte, la aduana y la matriculación del vehículo (documento de identidad, domicilio y datos del vehículo), que nos facilitas al firmar el encargo.",
            "Datos de navegación: de dónde llegas a la web (por ejemplo, desde el enlace de otro cliente o un informe compartido) y, solo si las aceptas, cookies de análisis y marketing. Más detalle en la Política de cookies.",
          ],
        },
      ],
    },
    {
      h: "3. Para qué los usamos y con qué base legal",
      blocks: [
        {
          table: {
            head: ["Finalidad", "Base legal"],
            rows: [
              ["Responder a tu solicitud y preparar tu presupuesto", "Tu solicitud (medidas precontractuales)"],
              ["Prestar el servicio de importación que contratas", "Ejecución del contrato"],
              ["Gestionar tu cuenta y guardar tus informes", "Ejecución del contrato (condiciones de uso de la cuenta)"],
              ["Preparar, enviar y hacer el seguimiento de tus pedidos de la tienda", "Ejecución del contrato"],
              ["Enviarte ofertas exclusivas y novedades", "Tu consentimiento (puedes retirarlo cuando quieras)"],
              ["Saber si llegas recomendado por otro cliente", "Interés legítimo en gestionar el programa de recomendación"],
              ["Cumplir obligaciones fiscales, contables y aduaneras", "Obligación legal"],
            ],
          },
        },
      ],
    },
    {
      h: "4. Con quién compartimos tus datos",
      blocks: [
        "Solo compartimos tus datos cuando es necesario para darte el servicio:",
        {
          ul: [
            "Aduanas, autoridades de tráfico (DGT), estaciones de ITV, aseguradoras y organismos de matriculación, para importar y matricular tu vehículo.",
            "Vendedores del vehículo en origen y conductores o transportistas autorizados por AlpiCars.",
            "Proveedores de la tienda y empresas de transporte, que reciben tu nombre, dirección y teléfono para hacerte llegar el pedido.",
            "Proveedores tecnológicos que trabajan por encargo de AlpiCars: Supabase (base de datos, con servidores en Zúrich, Suiza), Vercel (alojamiento de la web), Stripe (pagos) y Resend (envío de emails).",
          ],
        },
        "No vendemos tus datos a nadie.",
      ],
    },
    {
      h: "5. Transferencias internacionales",
      blocks: [
        "Algunos proveedores tecnológicos (Vercel, Stripe y Resend) tienen sede en Estados Unidos. Las transferencias se realizan con garantías reconocidas por Suiza y la Unión Europea, como el Marco de Privacidad de Datos o las cláusulas contractuales tipo.",
      ],
    },
    {
      h: "6. Cuánto tiempo los guardamos",
      blocks: [
        // PENDIENTE (AlpiCars): confirmar los plazos de conservación
        {
          ul: [
            "Solicitudes que no terminan en encargo: hasta 2 años, por si vuelves a contactarnos.",
            "Clientes y pedidos: mientras dure la relación y, después, durante los plazos que exige la ley (por ejemplo, 10 años para la documentación contable en Suiza).",
            "Cuenta de cliente: hasta que la borres o nos pidas borrarla.",
            "Ofertas por email: hasta que te des de baja.",
          ],
        },
      ],
    },
    {
      h: "7. Tus derechos",
      blocks: [
        `Puedes pedirnos en cualquier momento acceder a tus datos, corregirlos, borrarlos, oponerte a su uso, limitarlo, recibirlos en un formato portable o retirar tu consentimiento. Escríbenos a ${config.email} indicando qué necesitas.`,
        "Si consideras que no hemos tratado bien tus datos, puedes reclamar ante el Encargado Federal de Protección de Datos y Transparencia de Suiza (PFPDT/EDÖB) o, si resides en España, ante la Agencia Española de Protección de Datos (aepd.es).",
      ],
    },
    {
      h: "8. Seguridad",
      blocks: [
        "Aplicamos medidas técnicas y organizativas para proteger tus datos: conexión cifrada, contraseñas cifradas, acceso a los datos solo para el personal autorizado de AlpiCars y reglas en la base de datos para que cada cliente vea únicamente su propia información.",
      ],
    },
    {
      h: "9. Cambios en esta política",
      blocks: [
        "Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha de actualización.",
      ],
    },
  ],
};

/* ---------------------------------------------------------------- Condiciones de la tienda (BORRADOR) */
// BORRADOR de Azeritek: AlpiCars no ha entregado este texto. Revisarlo antes de activar los cobros reales.

export function tiendaCondiciones(shop, eur) {
  return {
    slug: "tienda/condiciones",
    title: "Condiciones de venta, envíos y devoluciones",
    sections: [
      {
        h: "1. Quién vende",
        blocks: [
          `La tienda online de ${site} pertenece a ${config.brand} (${owners}, ${c.city}). Contacto: ${config.email}.`,
          "Estas condiciones se aplican a las compras de productos de cuidado y accesorios del coche en la tienda. Los servicios de importación de vehículos se rigen por sus propias condiciones del servicio.",
        ],
      },
      {
        h: "2. Precios y pago",
        blocks: [
          "Los precios se muestran en euros. Antes de pagar verás el total del pedido con los gastos de envío.",
          "El pago se hace con tarjeta a través de Stripe, una plataforma de pago segura. AlpiCars no ve ni guarda los datos de tu tarjeta.",
          "Al completar el pago recibirás un email de confirmación con tu número de pedido.",
        ],
      },
      {
        h: "3. Envíos",
        blocks: [
          {
            ul: [
              // PENDIENTE (AlpiCars): confirmar si se envía a Canarias, Ceuta y Melilla (allí hay aduana)
              "Enviamos a domicilio en España.",
              `Gastos de envío: ${eur(shop.shipping)} por pedido${shop.freeShippingFrom ? `; gratis a partir de ${eur(shop.freeShippingFrom)}` : ""}.`,
              `Plazo: ${shop.deliveryTime.charAt(0).toLowerCase() + shop.deliveryTime.slice(1)} desde la confirmación del pago. Los productos se envían desde el almacén del proveedor.`,
              "Cuando el pedido salga, te enviaremos por email el número de seguimiento. También puedes consultarlo en la página Seguimiento de pedido.",
            ],
          },
          "Si el pedido no llega en el plazo indicado, escríbenos y lo revisamos con el transportista.",
        ],
      },
      {
        h: "4. Derecho de desistimiento (14 días)",
        blocks: [
          "Tienes 14 días naturales desde que recibes el pedido para devolverlo sin dar ninguna explicación.",
          `Para hacerlo, escríbenos a ${config.email} con tu número de pedido. Te indicaremos la dirección de devolución.`,
          "El producto debe devolverse sin usar y en su estado original. Los gastos de la devolución corren a tu cargo, salvo que el producto llegue defectuoso o no sea el que pediste.",
          "Te devolvemos el importe pagado, incluido el envío inicial, en un máximo de 14 días desde que recibimos el producto, con el mismo medio de pago.",
        ],
      },
      {
        h: "5. Garantía",
        blocks: [
          "Los productos tienen la garantía legal de 3 años por falta de conformidad. Si un producto llega dañado o falla, escríbenos con una foto y tu número de pedido y te enviamos uno nuevo o te devolvemos el dinero.",
        ],
      },
      {
        h: "6. Ley aplicable",
        blocks: [
          "Estas condiciones se rigen por la legislación suiza, sin perjuicio de las normas imperativas de protección del consumidor de tu país de residencia, que siempre se aplican a tu favor.",
          "Si tienes cualquier problema con tu compra, escríbenos primero: lo resolvemos contigo.",
        ],
      },
    ],
  };
}
