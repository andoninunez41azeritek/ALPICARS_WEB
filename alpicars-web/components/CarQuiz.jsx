"use client";

import { useEffect, useRef, useState } from "react";
import { encodeAnswers } from "../lib/recommend";
import { useSite } from "./SiteProvider";
import { ArrowIcon } from "./Icons";
import { track } from "../lib/track";

// Test "¿Qué coche es para ti?": 15 preguntas.
// Al responder la última, lleva a la página /test/resultado con el informe completo (descargable y compartible).

export default function CarQuiz() {
  const { t, quizOpen, setQuizOpen } = useSite();
  const q = t.quiz;
  const ref = useRef(null);
  const [i, setI] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [leaving, setLeaving] = useState(false);

  // Los enlaces y QR que terminan en #test (por ejemplo, en los PDF compartidos) abren el test directamente
  useEffect(() => {
    if (window.location.hash === "#test") setQuizOpen(true);
  }, [setQuizOpen]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    // Al abrir, va directo a la primera pregunta (el botón "Empezar el test" ya explica de qué va)
    if (quizOpen && !d.open) {
      setI((n) => (n < 0 ? 0 : n));
      track("quiz_start");
      d.showModal();
    }
    if (!quizOpen && d.open) d.close();
  }, [quizOpen]);

  const total = q.questions.length;
  const cur = q.questions[i];

  const choose = (k) => {
    const next = { ...answers, [cur.key]: k };
    setAnswers(next);
    if (i === total - 1) {
      setLeaving(true);
      track("quiz_complete");
      const code = encodeAnswers(q.questions, next);
      setTimeout(() => {
        window.location.href = `/test/resultado?r=${code}`;
      }, 350);
      return;
    }
    setTimeout(() => setI((n) => n + 1), 160);
  };

  return (
    <dialog ref={ref} className="dlg dlg-quiz" onClose={() => setQuizOpen(false)} aria-labelledby="quiz-title">
      <div className="dlg-head">
        <h2 id="quiz-title">{q.title}</h2>
        <button type="button" className="dlg-x" onClick={() => setQuizOpen(false)} aria-label={q.close}>
          <span />
          <span />
        </button>
      </div>

      {i >= 0 && (
        <div className="quiz-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${leaving ? 1 : i / total})` }} />
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

      {cur && !leaving && (
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

      {leaving && (
        <div className="quiz-body">
          <p className="quiz-intro" role="status">{q.loading}</p>
        </div>
      )}
    </dialog>
  );
}
