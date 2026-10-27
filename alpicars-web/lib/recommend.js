// Lógica del test "¿Qué coche es para ti?" (compartida entre el test y la página de resultado).
// Es orientativa. PENDIENTE: revisarla con AlpiCars.

// Las respuestas viajan en la URL como 15 dígitos, uno por pregunta, en el orden de content/es.js
export function encodeAnswers(questions, answers) {
  return questions.map((q) => (answers[q.key] ?? 0).toString()).join("");
}

export function decodeAnswers(questions, code) {
  const a = {};
  questions.forEach((q, i) => {
    const v = Number((code || "")[i]);
    a[q.key] = Number.isNaN(v) ? 0 : Math.min(q.a.length - 1, Math.max(0, v));
  });
  return a;
}

// Devuelve el coche recomendado, el motivo, el servicio y qué ficha de "Los más solicitados" encaja
export function recommend(a) {
  const budget = a.budget ?? 1; // 0 <15k, 1 15-25k, 2 25-45k, 3 >45k
  const body = a.body ?? 1;
  const green = a.fuel === 2 || a.fuel === 3 || a.label === 0;
  const premiumOnly = a.brand === 0;
  const sporty = a.use === 3 || a.equip === 3 || body === 3;
  let model;
  let why;
  let guide; // [origen, índice] en es.models
  let origin = "de";

  if (body === 3 || (sporty && budget === 3)) {
    if (budget === 3) {
      model = "Porsche 911, BMW M o Audi RS desde Suiza";
      why = "En Suiza hay unidades con todos los extras, pocos kilómetros y guardadas en garaje.";
      guide = ["ch", 1];
      origin = "ch";
    } else {
      model = "Volkswagen Golf GTI o Golf R desde Alemania";
      why = "Deportivo, práctico y con recambios económicos: la opción con más oferta en Alemania.";
      guide = ["de", 0];
    }
  } else if (body === 2 || a.space === 2 || a.space === 3) {
    if (budget <= 1) {
      model = "Volkswagen Tiguan";
      why = "Un SUV con muchísima oferta en Alemania y muy fácil de revender en España.";
      guide = ["de", 0];
    } else if (budget === 2) {
      model = green ? "Mercedes GLC híbrido enchufable" : "BMW X3 o Audi Q5";
      why = green ? "Llega con etiqueta CERO y en Alemania hay muchas unidades AMG Line." : "Tracción total, gran equipamiento y valor de reventa muy alto en España.";
      guide = green ? ["de", 3] : ["de", 1];
    } else if (premiumOnly || a.origin === 1) {
      model = "Porsche Macan o Cayenne desde Suiza";
      why = "Kilometrajes bajos y mantenimiento en concesionario oficial.";
      guide = ["ch", 0];
      origin = "ch";
    } else {
      model = "BMW X5 30d";
      why = "El diésel de 6 cilindros más buscado por fiabilidad y par motor.";
      guide = ["de", 1];
    }
  } else if (body === 1) {
    if (budget <= 1) {
      model = "Volkswagen Golf Variant";
      why = "Espacio familiar, consumo contenido y repuestos económicos.";
      guide = ["de", 0];
    } else if (green) {
      model = "Mercedes Clase C o E híbrido enchufable";
      why = "Etiqueta CERO y un valor percibido altísimo.";
      guide = ["de", 3];
    } else if (a.km === 2) {
      model = "BMW Serie 3 Touring 330d";
      why = "Perfecto para muchos kilómetros: diésel fiable y mucho maletero.";
      guide = ["de", 1];
    } else {
      model = "Audi A4 o A6 Avant";
      why = "Acabado quattro y S-Line, que mantienen muy bien su valor.";
      guide = ["de", 2];
    }
  } else {
    model = "Volkswagen Golf";
    why = "Fácil de aparcar, fácil de revender y con la mayor oferta de Alemania.";
    guide = ["de", 0];
  }

  if (a.origin === 1 && origin !== "ch") origin = "ch";
  const service = a.service === 1 ? "Revisión presencial" : a.service === 2 ? "Asesoramiento telemático" : "Llave en mano";
  return { model, why, service, green, guide, origin };
}
