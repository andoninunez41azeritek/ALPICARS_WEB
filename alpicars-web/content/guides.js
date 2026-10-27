// Guías para Google y para los asistentes de IA (SEO y GEO).
// Cada guía responde de forma directa a una búsqueda frecuente y enlaza a la calculadora y al presupuesto.
// Normativa revisada en octubre de 2026. Si cambia algún tipo o tasa, actualízalo aquí y en lib/calc.js.

const updated = "octubre de 2026";
const updatedIso = "2026-10-27";

const guides = [
  {
    slug: "importar-coche-alemania",
    metaTitle: "Importar un coche de Alemania a España en 2026",
    description:
      "Cómo traer un coche de Alemania a España en 2026: cuándo se paga IVA, impuesto de matriculación, ITV de importación, tasa DGT y coste total.",
    kicker: "Guía · Alemania",
    title: "Cómo importar un coche de Alemania a España",
    answer:
      "Para importar un coche usado de Alemania a España compras el coche con su IVA alemán ya incluido (no pagas IVA otra vez en España), lo traes con placas de exportación o en camión, pasas la ITV de importación, pagas el impuesto de matriculación según sus emisiones de CO₂ y lo matriculas en la DGT. Si el coche tiene 6 meses o menos, o 6.000 km o menos, se considera nuevo: lo compras sin IVA alemán y pagas el 21 % de IVA en España.",
    sections: [
      {
        h2: "¿Se paga IVA al importar un coche de Alemania?",
        paragraphs: [
          "Depende de si el coche es nuevo o usado a efectos de IVA. Alemania está en la Unión Europea, así que no hay aduana ni aranceles.",
        ],
        table: {
          head: ["Caso", "Qué IVA pagas"],
          rows: [
            ["Usado (más de 6 meses y más de 6.000 km) comprado a un particular", "Ninguno. El precio no lleva IVA y en España no se paga."],
            ["Usado comprado a un concesionario", "El IVA alemán (19 %) ya va incluido en el precio o el coche va en régimen de margen. En España no pagas IVA otra vez."],
            ["Nuevo o casi nuevo (6 meses o menos, o 6.000 km o menos)", "Lo compras sin IVA alemán y pagas el 21 % en España con el modelo 309."],
          ],
        },
      },
      {
        h2: "Pasos para traer el coche",
        steps: [
          { title: "Elegir y revisar el coche", text: "Comprueba el historial de mantenimiento, el kilometraje y que no tenga cargas. Lo ideal es verlo en persona antes de pagar o enviar a alguien de confianza." },
          { title: "Contrato y documentación", text: "Necesitas el contrato o la factura, la documentación alemana del coche (Zulassungsbescheinigung Teil I y Teil II) y, si lo tiene, el certificado de conformidad europeo (COC)." },
          { title: "Traslado a España", text: "El coche viaja con placas de exportación alemanas (Ausfuhrkennzeichen) o placas temporales, con su seguro, o en camión." },
          { title: "ITV de importación", text: "En España se pasa una ITV específica para coches importados. Con el COC se emite la ficha técnica reducida; sin él, puede hacer falta un certificado del fabricante." },
          { title: "Impuesto de matriculación", text: "Se presenta el modelo 576 en la Agencia Tributaria. El importe depende de las emisiones de CO₂, del valor del coche según las tablas de Hacienda y de tu comunidad autónoma." },
          { title: "Matriculación en la DGT", text: "Con la ITV, el impuesto pagado y el impuesto de circulación del ayuntamiento, se paga la tasa de la DGT (97,80 € en 2026), te dan la matrícula española y se colocan las placas." },
        ],
      },
      {
        h2: "¿Cuánto cuesta en total?",
        paragraphs: [
          "Además del precio del coche, cuenta con el impuesto de matriculación (0 % hasta 120 g/km de CO₂ y entre el 4,75 % y el 16 % por encima, según emisiones y comunidad), la tasa de la DGT, la ITV de importación, las placas, el viaje desde Alemania y, si lo contratas, el servicio de importación.",
          "Con la calculadora de AlpiCars ves el coste total y el ahorro frente a comprar el mismo coche en España.",
        ],
      },
    ],
    faq: [
      { q: "¿Compensa traer un coche de Alemania?", a: "Suele compensar en coches de gama media y alta de menos de 8 años, donde Alemania tiene más oferta y mejores precios. En coches baratos, los gastos fijos de la importación pueden comerse el ahorro. La calculadora te lo dice en tu caso." },
      { q: "¿Hay que pagar aduana o aranceles?", a: "No. Alemania está en la Unión Europea y no hay aduana entre Alemania y España." },
      { q: "¿Cuánto se tarda en matricular el coche en España?", a: "Una vez el coche está en España, la ITV, el impuesto y la matriculación suelen resolverse en una o dos semanas, según la cita de ITV y la comunidad." },
    ],
  },
  {
    slug: "importar-coche-suiza",
    metaTitle: "Importar un coche de Suiza a España: guía 2026",
    description:
      "Importar un coche de Suiza en 2026: IVA suizo, aduana, arancel del 10 % o 0 % con origen UE, IVA del 21 %, impuesto de matriculación e ITV.",
    kicker: "Guía · Suiza",
    title: "Cómo importar un coche de Suiza a España",
    answer:
      "Suiza no está en la Unión Europea, así que el coche pasa aduana. Lo compras sin el IVA suizo (8,1 %, que se recupera al exportarlo), en la aduana española pagas un arancel del 10 % (0 % si el coche tiene origen preferencial UE o Suiza) y el 21 % de IVA de importación, y después haces los mismos trámites que con cualquier coche importado: ITV, impuesto de matriculación y matriculación en la DGT.",
    sections: [
      {
        h2: "Impuestos al importar desde Suiza",
        table: {
          head: ["Concepto", "Cuánto"],
          rows: [
            ["IVA suizo (8,1 %)", "No lo pagas: el vendedor factura sin IVA o se recupera al exportar con la documentación de aduana."],
            ["Arancel", "10 % del valor. 0 % si el coche tiene origen preferencial UE o Suiza y se acredita con el certificado EUR.1 o una declaración de origen."],
            ["IVA de importación", "21 % sobre el valor del coche más el arancel y los gastos de transporte hasta su destino en España."],
            ["Impuesto de matriculación", "Igual que cualquier coche importado: según CO₂, tablas de Hacienda y comunidad autónoma."],
          ],
        },
        paragraphs: [
          "Muchos coches europeos (BMW, Mercedes, Audi, Volkswagen, Porsche…) fabricados en la UE pueden acreditar el origen y entrar sin arancel. Los fabricados fuera de Europa normalmente pagan el 10 %.",
        ],
      },
      {
        h2: "Pasos para traer el coche",
        steps: [
          { title: "Revisar el coche y el Fahrzeugausweis", text: "El Fahrzeugausweis es el permiso de circulación suizo. Comprueba que los datos coinciden con el coche y revisa el historial de mantenimiento." },
          { title: "Exportación en Suiza", text: "Se hace la declaración de exportación para recuperar el IVA suizo y salir del país con la documentación en regla." },
          { title: "Aduana e importación (DUA)", text: "Al entrar en la UE se presenta el documento único administrativo (DUA) y se pagan el arancel, si corresponde, y el IVA de importación." },
          { title: "Homologación e ITV", text: "Si el coche no tiene certificado de conformidad europeo (COC), puede hacer falta un certificado del fabricante o una homologación individual antes de la ITV de importación." },
          { title: "Impuesto y matriculación", text: "Modelo 576, impuesto de circulación del ayuntamiento, tasa de la DGT (97,80 € en 2026) y placas españolas." },
        ],
      },
    ],
    faq: [
      { q: "¿Por qué comprar un coche en Suiza?", a: "En Suiza hay muchos coches de gama alta con pocos kilómetros, muy bien equipados y con mantenimiento oficial. Aunque haya que pagar IVA de importación, en muchos modelos el precio final sigue siendo menor que en España." },
      { q: "¿Se paga IVA dos veces?", a: "No. El IVA suizo no se paga (o se recupera al exportar) y solo se paga el IVA español de importación." },
      { q: "¿Qué es el certificado EUR.1?", a: "Es el documento que acredita que el coche tiene origen preferencial en la UE o Suiza. Con él, el arancel baja del 10 % al 0 %." },
    ],
  },
  {
    slug: "impuesto-matriculacion-coche-importado",
    metaTitle: "Impuesto de matriculación de un coche importado 2026",
    description:
      "Tipos del impuesto de matriculación en 2026 por CO₂ y comunidad, tablas de Hacienda, porcentajes por antigüedad y cómo se calcula, con ejemplo.",
    kicker: "Guía · Impuestos",
    title: "Impuesto de matriculación de un coche importado",
    answer:
      "El impuesto de matriculación (IEDMT, modelo 576) de un coche importado depende de sus emisiones de CO₂ y de tu comunidad autónoma: 0 % hasta 120 g/km, 4,75 % de 121 a 159 g/km, 9,75 % de 160 a 199 g/km y 14,75 % desde 200 g/km (16 % en Cataluña, Comunitat Valenciana, Asturias y Baleares). En un coche usado se calcula sobre su valor según las tablas de Hacienda, reducido por la antigüedad y descontando los impuestos que ya llevaba.",
    sections: [
      {
        h2: "Tipos del impuesto en 2026",
        table: {
          head: ["Emisiones de CO₂ (WLTP)", "Tipo general", "Comunidades con tipo distinto"],
          rows: [
            ["Hasta 120 g/km", "0 %", "0 % en todas"],
            ["De 121 a 159 g/km", "4,75 %", "Canarias 3,75 %"],
            ["De 160 a 199 g/km", "9,75 %", "Canarias 8,75 %"],
            ["200 g/km o más", "14,75 %", "Cataluña, C. Valenciana, Asturias y Baleares 16 %; Murcia 15,9 %; Cantabria 15 %; Canarias 13,75 %"],
          ],
        },
        paragraphs: ["Ceuta y Melilla no pagan este impuesto. Fuente: Agencia Tributaria, tipos vigentes en 2026."],
      },
      {
        h2: "Cómo se calcula en un coche usado",
        paragraphs: [
          "1. Se busca el valor del modelo en las tablas de precios medios de Hacienda (Orden HAC/1501/2025, vigente desde el 1 de enero de 2026).",
          "2. Se multiplica por el porcentaje que corresponde a su antigüedad (tabla de abajo). El resultado es el valor de mercado.",
          "3. Como ese valor ya incluye el IVA y el impuesto de matriculación que pagó el coche cuando era nuevo, se descuentan: base = valor de mercado ÷ (1 + 0,21 + tipo del impuesto).",
          "4. El impuesto es la base por el tipo que corresponde a sus emisiones y a tu comunidad.",
        ],
        table: {
          head: ["Antigüedad", "% del valor de tablas"],
          rows: [
            ["Hasta 1 año", "100 %"],
            ["Más de 1 hasta 2 años", "84 %"],
            ["Más de 2 hasta 3 años", "67 %"],
            ["Más de 3 hasta 4 años", "56 %"],
            ["Más de 4 hasta 5 años", "47 %"],
            ["Más de 5 hasta 6 años", "39 %"],
            ["Más de 6 hasta 7 años", "34 %"],
            ["Más de 7 hasta 8 años", "28 %"],
            ["Más de 8 hasta 9 años", "24 %"],
            ["Más de 9 hasta 10 años", "19 %"],
            ["Más de 10 hasta 11 años", "17 %"],
            ["Más de 11 hasta 12 años", "13 %"],
            ["Más de 12 años", "10 %"],
          ],
        },
      },
      {
        h2: "Ejemplo",
        paragraphs: [
          "Coche con un valor de tablas de 70.000 €, entre 3 y 4 años, 140 g/km de CO₂ y matriculado en Madrid:",
          "Valor de mercado: 70.000 € × 56 % = 39.200 €. Base: 39.200 € ÷ 1,2575 = 31.173 €. Impuesto: 31.173 € × 4,75 % = 1.481 €.",
          "Si el coche se compra nuevo (6 meses o menos, o 6.000 km o menos), la base es directamente el precio de compra sin IVA.",
        ],
      },
    ],
    faq: [
      { q: "¿Los coches eléctricos e híbridos enchufables pagan impuesto de matriculación?", a: "No, si emiten 120 g/km de CO₂ o menos tributan al 0 %. La mayoría de eléctricos e híbridos enchufables están en ese tramo." },
      { q: "¿Qué emisiones de CO₂ se usan?", a: "Las del ciclo WLTP que figuran en el certificado de conformidad (COC) o en la ficha técnica del coche." },
      { q: "¿Dónde se paga?", a: "En la Agencia Tributaria con el modelo 576, antes de matricular el coche en la DGT." },
    ],
  },
  {
    slug: "cuanto-cuesta-importar-un-coche",
    metaTitle: "¿Cuánto cuesta importar un coche a España en 2026?",
    description:
      "Todos los gastos de importar un coche de Alemania o Suiza en 2026: impuestos, tasa DGT, ITV, placas y transporte, con un ejemplo real de ahorro.",
    kicker: "Guía · Costes",
    title: "Cuánto cuesta importar un coche a España",
    answer:
      "Importar un coche usado de Alemania cuesta, además del precio del coche, el impuesto de matriculación (0 % a 16 % según CO₂ y comunidad), la tasa de la DGT (97,80 €), la ITV de importación, la ficha técnica, las placas y el traslado. Desde Suiza hay que sumar el 21 % de IVA de importación y, si el coche no tiene origen UE o Suizo, un 10 % de arancel. En un coche de gama media-alta, el ahorro frente a comprarlo en España suele ser de varios miles de euros.",
    sections: [
      {
        h2: "Todos los gastos, uno por uno",
        table: {
          head: ["Gasto", "Importe", "Cuándo"],
          rows: [
            ["Impuesto de matriculación", "0 % – 16 % de la base", "Siempre (0 % hasta 120 g/km)"],
            ["IVA en España (21 %)", "21 % del precio", "Coche nuevo de la UE o cualquier coche de Suiza"],
            ["Arancel", "10 %", "Solo desde Suiza y sin origen preferencial"],
            ["Tasa DGT de matriculación", "97,80 €", "Siempre"],
            ["ITV de importación y ficha técnica", "Unos 200–300 €", "Siempre"],
            ["Placas", "Unos 30 €", "Siempre"],
            ["Traslado a España", "Según distancia", "Siempre"],
            ["Impuesto de circulación", "Según ayuntamiento", "Siempre, proporcional al año"],
          ],
        },
      },
      {
        h2: "Ejemplo: coche usado de Alemania a Madrid",
        paragraphs: [
          "Coche de 3 años y 140 g/km comprado en Alemania por 44.000 € (con IVA alemán), que en España cuesta 62.000 €:",
          "Impuesto de matriculación unos 2.342 €, tasa DGT 98 €, ITV, ficha técnica y placas unos 300 €, viaje unos 474 € y servicio Llave en mano 2.490 €. Total en España: unos 49.700 €. Ahorro: unos 12.300 €.",
        ],
      },
    ],
    faq: [
      { q: "¿Hay que pagar el impuesto de transmisiones (ITP)?", a: "No. Al importar un coche no se paga ITP; se paga el impuesto de matriculación." },
      { q: "¿Puedo saber el coste exacto antes de comprar?", a: "Sí. Con la calculadora tienes una estimación al momento y en el presupuesto de AlpiCars te damos la cifra cerrada para la unidad concreta." },
    ],
  },
  {
    slug: "riesgos-comprar-coche-alemania",
    metaTitle: "Riesgos al comprar un coche en Alemania y cómo evitarlos",
    description:
      "Kilómetros manipulados, daños ocultos, IVA inesperado y estafas: los riesgos de comprar un coche en Alemania o Suiza y la lista para evitarlos.",
    kicker: "Guía · Riesgos",
    title: "Riesgos al comprar un coche en Alemania o Suiza (y cómo evitarlos)",
    answer:
      "Los riesgos principales al comprar un coche en Alemania o Suiza son cuatro: kilometraje manipulado, daños o accidentes no declarados, sorpresas fiscales (un coche casi nuevo paga el 21 % de IVA en España) y estafas en el pago. Se evitan viendo el coche en persona antes de pagar, comprobando su historial de mantenimiento y su documentación, calculando los impuestos antes de comprar y pagando solo a un vendedor verificado.",
    sections: [
      {
        h2: "Los cuatro riesgos y cómo evitar cada uno",
        table: {
          head: ["Riesgo", "Qué pasa", "Cómo evitarlo"],
          rows: [
            ["Kilometraje manipulado", "El cuentakilómetros marca menos de lo real y el coche vale menos de lo que pagas.", "Cruzar los kilómetros con el libro de mantenimiento, las revisiones oficiales (en Alemania, los informes de la inspección técnica HU) y un informe de historial por el número de bastidor."],
            ["Daños o accidentes ocultos", "Reparaciones de chapa, golpes estructurales o averías electrónicas que no se declaran en el anuncio.", "Inspección presencial: medidor de espesor de pintura, diagnosis con máquina (OBD) y prueba en carretera antes de pagar."],
            ["Sorpresas fiscales", "Un coche de 6 meses o menos, o de 6.000 km o menos, cuenta como nuevo y paga el 21 % de IVA en España. Desde Suiza se paga el IVA de importación y, a veces, arancel.", "Calcular el coste total antes de comprar: impuestos, matriculación, ITV y transporte."],
            ["Estafas en el pago", "Anuncios falsos o vendedores que piden el dinero por adelantado por vías que no se pueden reclamar.", "Pagar solo por transferencia a un vendedor verificado, con contrato o factura, y después de ver el coche."],
          ],
        },
      },
      {
        h2: "Lista de comprobaciones antes de pagar",
        steps: [
          { title: "Documentación", text: "El número de bastidor del coche coincide con el de los papeles (en Alemania, Zulassungsbescheinigung Teil I y II; en Suiza, el Fahrzeugausweis) y el vendedor es el titular o un concesionario." },
          { title: "Historial", text: "Libro de mantenimiento sellado o historial digital del fabricante, revisiones con kilómetros coherentes entre sí y sin huecos largos." },
          { title: "Estado real", text: "Espesor de pintura uniforme, diagnosis sin errores guardados, neumáticos y frenos revisados y prueba en carretera." },
          { title: "Certificado de conformidad (COC)", text: "Con el COC europeo la ITV de importación en España es más sencilla. Si no lo tiene, hay que pedir un certificado al fabricante." },
          { title: "Coste total calculado", text: "Impuesto de matriculación, IVA si corresponde, tasas, ITV, placas y transporte, antes de comprometerte con el vendedor." },
        ],
      },
    ],
    faq: [
      { q: "¿Es seguro comprar un coche en Alemania?", a: "Sí, si ves el coche antes de pagar, compruebas su historial y su documentación y pagas a un vendedor verificado. La mayoría de los problemas vienen de comprar solo por las fotos del anuncio." },
      { q: "¿Cómo sé si le han bajado los kilómetros?", a: "Cruzando los kilómetros del cuentakilómetros con el libro de mantenimiento, los informes de las inspecciones técnicas y un informe de historial por número de bastidor. Si hay saltos o huecos, desconfía." },
      { q: "¿Qué pasa si el coche tiene una avería después de comprarlo?", a: "Si lo compras a un profesional en la Unión Europea, tienes la garantía legal de la UE. Comprado a un particular, no hay garantía legal, por eso es clave revisarlo antes." },
    ],
  },
  {
    slug: "donde-buscar-coche-alemania-suiza",
    metaTitle: "Dónde buscar un coche en Alemania y en Suiza (2026)",
    description:
      "Los portales para buscar coche en Alemania y Suiza, qué significan los términos alemanes de los anuncios y si comprar a concesionario o particular.",
    kicker: "Guía · Búsqueda",
    title: "Dónde buscar un coche en Alemania y en Suiza",
    answer:
      "En Alemania los coches de ocasión se buscan sobre todo en mobile.de y AutoScout24, y en Suiza en AutoScout24.ch y Comparis.ch. Conviene filtrar por concesionario (Händler), historial de mantenimiento completo y certificado de conformidad europeo, y entender los términos alemanes del anuncio antes de contactar con el vendedor.",
    sections: [
      {
        h2: "Portales principales",
        table: {
          head: ["País", "Portal", "Para qué sirve"],
          rows: [
            ["Alemania", "mobile.de", "El mayor portal de coches de Alemania. Filtros muy completos por equipamiento y por tipo de vendedor."],
            ["Alemania", "AutoScout24.de", "Muy usado por concesionarios alemanes. Útil para comparar precios del mismo modelo."],
            ["Suiza", "AutoScout24.ch", "El portal de referencia en Suiza para coches de ocasión."],
            ["Suiza", "Comparis.ch", "Comparador suizo que reúne anuncios de varios portales."],
          ],
        },
      },
      {
        h2: "Palabras alemanas que verás en los anuncios",
        table: {
          head: ["En el anuncio", "Qué significa"],
          rows: [
            ["Händler / Privat", "Concesionario / particular"],
            ["Scheckheftgepflegt", "Mantenimiento completo y sellado en el libro"],
            ["Unfallfrei", "Sin accidentes declarados"],
            ["MwSt. ausweisbar", "El concesionario puede facturar con IVA desglosado"],
            ["HU / TÜV neu", "Inspección técnica alemana recién pasada"],
            ["Erstzulassung (EZ)", "Fecha de primera matriculación"],
          ],
        },
      },
      {
        h2: "¿Concesionario o particular?",
        paragraphs: [
          "Comprar a un concesionario da garantía legal en la UE, factura y, en Alemania, la opción de comprar sin IVA alemán si el coche es nuevo a efectos fiscales. Comprar a un particular suele ser más barato, pero sin garantía legal.",
          "En los dos casos, lo decisivo es ver el coche antes de pagar y calcular el coste total en España.",
        ],
      },
    ],
    faq: [
      { q: "¿Es más barato comprar en Alemania o en Suiza?", a: "Depende del modelo. Alemania tiene más oferta y precios más bajos en gama media; Suiza tiene muchos coches de gama alta con pocos kilómetros y mantenimiento oficial. Desde Suiza hay que sumar el IVA de importación y, a veces, arancel." },
      { q: "¿Puedo comprar el coche yo y que AlpiCars haga el resto?", a: "Sí. Con el Asesoramiento telemático te ayudamos a elegir y con la Revisión presencial lo vemos antes de que pagues. Llave en mano incluye todo el proceso hasta la matrícula española." },
    ],
  },
  {
    slug: "comprar-coche-en-suiza",
    metaTitle: "Comprar un coche en Suiza y traerlo a España (2026)",
    description:
      "Por qué comprar un coche en Suiza, dónde buscarlo, qué revisar en un coche suizo y qué impuestos pagas al traerlo a España en 2026, con cálculo.",
    kicker: "Guía · Suiza",
    title: "Comprar un coche en Suiza y traerlo a España",
    answer:
      "Comprar un coche en Suiza compensa sobre todo en gama alta: hay mucha oferta con pocos kilómetros, muy equipada y con mantenimiento oficial. Se compra sin el IVA suizo del 8,1 % (se recupera al exportarlo) y en España se paga el 21 % de IVA de importación, el arancel del 10 % si el coche no tiene origen preferencial UE o Suizo y el impuesto de matriculación según sus emisiones.",
    sections: [
      {
        h2: "Por qué buscar coche en Suiza",
        paragraphs: [
          "Suiza tiene un parque de coches de gama alta muy grande para su tamaño, con kilometrajes bajos y revisiones hechas en concesionario oficial. Muchos coches vienen con equipamiento completo que en España se paga aparte.",
          "La contrapartida son los impuestos de importación: como Suiza no está en la UE, hay que pasar aduana. Por eso compensa más cuanto mayor es la diferencia de precio con el mismo coche en España.",
        ],
      },
      {
        h2: "Dónde buscar y qué significan los anuncios suizos",
        table: {
          head: ["En el anuncio", "Qué significa"],
          rows: [
            ["AutoScout24.ch / Comparis.ch", "Los portales donde se buscan la mayoría de coches de ocasión en Suiza"],
            ["Ab MFK", "Con la inspección técnica suiza (MFK) recién pasada"],
            ["Fahrzeugausweis", "Permiso de circulación suizo: comprueba que el bastidor coincide con el coche"],
            ["Servicegepflegt", "Mantenimiento hecho y documentado"],
            ["Unfallfrei", "Sin accidentes declarados"],
            ["CHF / exkl. MwSt.", "Precio en francos suizos / sin IVA suizo"],
          ],
        },
      },
      {
        h2: "Qué revisar en un coche suizo",
        steps: [
          { title: "Certificado de conformidad europeo (COC)", text: "Muchos coches vendidos en Suiza lo tienen, pero no todos. Sin COC, para la ITV de importación hace falta un certificado del fabricante, que cuesta más y tarda más." },
          { title: "Origen del coche", text: "Si el coche se fabricó en la UE o en Suiza y se acredita su origen, el arancel es del 0 %. Si no, se paga un 10 % sobre su valor." },
          { title: "Bajos y frenos", text: "En invierno las carreteras suizas usan sal: conviene revisar la corrosión de los bajos y el estado de los frenos." },
          { title: "Historial y kilómetros", text: "Revisiones en concesionario oficial y kilómetros coherentes entre la inspección MFK, el libro de mantenimiento y el cuentakilómetros." },
        ],
      },
      {
        h2: "Qué pagas al traerlo a España",
        table: {
          head: ["Concepto", "Cuánto"],
          rows: [
            ["IVA suizo (8,1 %)", "No se paga: se factura sin IVA o se recupera con la exportación"],
            ["Arancel", "0 % con origen preferencial UE/Suiza; 10 % si no lo tiene"],
            ["IVA de importación", "21 % sobre coche, arancel y transporte hasta el destino"],
            ["Impuesto de matriculación", "0 % a 16 % según CO₂ y comunidad"],
            ["Tasa DGT, ITV, placas", "Tasa DGT 97,80 € más ITV de importación y placas"],
          ],
        },
        paragraphs: ["Con la calculadora de AlpiCars puedes elegir «Suiza» y ver el coste total y el ahorro de tu coche."],
      },
    ],
    faq: [
      { q: "¿Se paga dos veces el IVA si compro en Suiza?", a: "No. El IVA suizo no se paga o se recupera al exportar, y solo se paga el 21 % de IVA de importación en España." },
      { q: "¿Qué coches compensa traer de Suiza?", a: "Sobre todo coches de gama alta con pocos kilómetros: SUV y berlinas premium, deportivos y versiones muy equipadas, donde la diferencia de precio con España es mayor que los impuestos de importación." },
      { q: "¿Necesito ir a Suiza para comprarlo?", a: "No. AlpiCars puede buscarlo, revisarlo en persona, gestionar la exportación y la aduana y traértelo matriculado a España." },
    ],
  },
];

export { updated, updatedIso };
export default guides;
