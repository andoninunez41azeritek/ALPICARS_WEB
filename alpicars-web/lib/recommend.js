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

// Devuelve claves (no textos): el coche (t.rec.models), el motivo (t.rec.why), el id del servicio y la ficha de "Los más solicitados".
// Los textos de cada idioma están en content/<idioma>.js → rec
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
      model = "m1";
      why = "w1";
      guide = ["ch", 1];
      origin = "ch";
    } else {
      model = "m2";
      why = "w2";
      guide = ["de", 0];
    }
  } else if (body === 2 || a.space === 2 || a.space === 3) {
    if (budget <= 1) {
      model = "m3";
      why = "w3";
      guide = ["de", 0];
    } else if (budget === 2) {
      model = green ? "m4" : "m5";
      why = green ? "w4" : "w5";
      guide = green ? ["de", 3] : ["de", 1];
    } else if (premiumOnly || a.origin === 1) {
      model = "m6";
      why = "w6";
      guide = ["ch", 0];
      origin = "ch";
    } else {
      model = "m7";
      why = "w7";
      guide = ["de", 1];
    }
  } else if (body === 1) {
    if (budget <= 1) {
      model = "m8";
      why = "w8";
      guide = ["de", 0];
    } else if (green) {
      model = "m9";
      why = "w9";
      guide = ["de", 3];
    } else if (a.km === 2) {
      model = "m10";
      why = "w10";
      guide = ["de", 1];
    } else {
      model = "m11";
      why = "w11";
      guide = ["de", 2];
    }
  } else {
    model = "m12";
    why = "w12";
    guide = ["de", 0];
  }

  if (a.origin === 1 && origin !== "ch") origin = "ch";
  // servicio = id del plan en content/<idioma>.js (services.plans)
  const service = a.service === 1 ? "presencial" : a.service === 2 ? "telematico" : "llave";
  return { model, why, service, green, guide, origin };
}
