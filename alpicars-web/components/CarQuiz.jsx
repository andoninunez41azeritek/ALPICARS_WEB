"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";

// Test "¿Qué coche es para ti?": 15 preguntas y una recomendación basada en la guía de modelos.
// La lógica de recomendación es orientativa. PENDIENTE: revisarla con AlpiCars.

function recommend(a) {
  const budget = a.budget ?? 1; // 0 <15k, 1 15-25k, 2 25-45k, 3 >45k
  const body = a.body ?? 1;
  const green = a.fuel === 2 || a.fuel === 3 || a.label === 0;
  const premiumOnly = a.brand === 0;
  const sporty = a.use === 3 || a.equip === 3 || body === 3;
  let model;
  let why;

  if (body === 3 || (sporty && budget === 3)) {
    model = budget === 3 ? "Porsche 911, BMW M o Audi RS desde Suiza" : "Volkswagen Golf GTI o Golf R desde Alemania";
    why = budget === 3 ? "En Suiza hay unidades con todos los extras, pocos kilómetros y guardadas en garaje." : "Deportivo, práctico y con recambios económicos: la opción con más oferta en Alemania.";
  } else if (body === 2 || a.space === 2 || a.space === 3) {
    if (budget <= 1) {
      model = "Volkswagen Tiguan";
      why = "Un SUV con muchísima oferta en Alemania y muy fácil de revender en España.";
    } else if (budget === 2) {
      model = green ? "Mercedes GLC híbrido enchufable" : "BMW X3 o Audi Q5";
      why = green ? "Llega con etiqueta CERO y en Alemania hay muchas unidades AMG Line." : "Tracción total, gran equipamiento y valor de reventa muy alto en España.";
    } else {
      model = premiumOnly || a.origin === 1 ? "Porsche Macan o Cayenne desde Suiza" : "BMW X5 30d";
      why = premiumOnly || a.origin === 1 ? "Kilometrajes bajos y mantenimiento en concesionario oficial." : "El diésel de 6 cilindros más buscado por fiabilidad y par motor.";
    }
  } else if (body === 1) {
    if (budget <= 1) {
      model = "Volkswagen Golf Variant";
      why = "Espacio familiar, consumo contenido y repuestos económicos.";
    } else {
      model = green ? "Mercedes Clase C o E híbrido enchufable" : a.km === 2 ? "BMW Serie 3 Touring 330d" : "Audi A4 o A6 Avant";
      why = green ? "Etiqueta CERO y un valor percibido altísimo." : a.km === 2 ? "Perfecto para muchos kilómetros: diésel fiable y mucho maletero." : "Acabado quattro y S-Line, que mantienen muy bien su valor.";
    }
  } else {
    model = "Volkswagen Golf";
    why = "Fácil de aparcar, fácil de revender y con la mayor oferta de Alemania.";
  }

  const service = a.service === 1 ? "Revisión presencial" : a.service === 2 ? "Asesoramiento telemático" : "Llave en mano";
  return { model, why, service, green };
}

export default function CarQuiz() {
  const { t, quizOpen, setQuizOpen, setPresetService, setPresetCar, formatPrice } = useSite();
  const q = t.quiz;
  const ref = useRef(null);
  const [i, setI] = useState(-1);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (quizOpen && !d.open) d.showModal();
    if (!quizOpen && d.open) d.close();
  }, [quizOpen]);

  const total = q.questions.length;
  const done = i >= total;
  const cur = q.questions[i];
  const result = done ? recommend(answers) : null;
  const plan = result && t.services.plans.find((p) => p.name === result.service);

  const choose = (k) => {
    setAnswers((a) => ({ ...a, [cur.key]: k }));
    setTimeout(() => setI((n) => n + 1), 160);
  };

  const finish = () => {
    setPresetService(plan ? plan.name : result.service);
    setPresetCar(result.model);
    setQuizOpen(false);
    setTimeout(() => document.getElementById("presupuesto")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <dialog ref={ref} className="dlg dlg-quiz" onClose={() => setQuizOpen(false)} aria-labelledby="quiz-title">
      <div className="dlg-head">
        <h2 id="quiz-title">{done ? q.resultTitle : q.title}</h2>
        <button type="button" className="dlg-x" onClick={() => setQuizOpen(false)} aria-label={q.close}>
          <span />
          <span />
        </button>
      </div>

      {i >= 0 && !done && (
        <div className="quiz-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${i / total})` }} />
        </div>
      )}

      {i < 0 && (
        <div className="quiz-body">
          <p className="quiz-intro">{q.intro}</p>
          <button type="button" className="btn btn-accent" onClick={() => setI(0)}>
            {q.start}
            <ArrowIcon />
          </button>
        </div>
      )}

      {cur && (
        <div className="quiz-body" key={i}>
          <p className="quiz-count">
            {i + 1} {q.of} {total}
          </p>
          <h3 className="quiz-q">{cur.q}</h3>
          <div className="quiz-options">
            {cur.a.map((opt, k) => (
              <button key={opt} type="button" aria-pressed={answers[cur.key] === k} onClick={() => choose(k)}>
                {opt}
              </button>
            ))}
          </div>
          {i > 0 && (
            <button type="button" className="quiz-back" onClick={() => setI((n) => n - 1)}>
              {q.back}
            </button>
          )}
        </div>
      )}

      {done && (
        <div className="quiz-body quiz-result">
          <p className="quiz-model">{result.model}</p>
          <p>{result.why}</p>
          {result.green && <p>Te buscaremos versiones con etiqueta ECO o CERO.</p>}
          <p className="quiz-service">
            Servicio recomendado: <strong>{plan ? plan.name : result.service}</strong>
            {plan?.price != null && <> · desde {formatPrice(plan.price)}</>}
          </p>
          <div className="quiz-actions">
            <button type="button" className="btn btn-accent" onClick={finish}>
              {q.resultCta}
              <ArrowIcon />
            </button>
            <button
              type="button"
              className="quiz-back"
              onClick={() => {
                setAnswers({});
                setI(0);
              }}
            >
              {q.restart}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
