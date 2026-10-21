"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import map from "../lib/mapData";
import { useSite } from "./SiteProvider";
import { CarTopIcon } from "./Icons";

// Mapa fijo de fondo de toda la web.
// Las rutas de varias ciudades alemanas y de Zúrich se juntan en Basilea y bajan en una sola línea hasta España.
// El coche avanza por esa línea según el usuario va bajando por la página, y la "cámara" lo sigue.

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const smooth = (x) => x * x * (3 - 2 * x);
const START = { x: 720, y: 235 }; // encuadre inicial: Alemania y Suiza
// El coche sale de Basilea al empezar a bajar y llega a destino cuando aparece el formulario de presupuesto
const ARRIVE_AT = "#presupuesto";
const fmt = (n) => new Intl.NumberFormat("es-ES").format(n).replace(/^(\d)(\d{3})$/, "$1.$2");

export default function MapBackdrop() {
  const { dest, t } = useSite();
  const route = map.routes[dest];
  const r = t.route;
  const svgRef = useRef(null);
  const measureRef = useRef(null);
  const trailRef = useRef(null);
  const carRef = useRef(null);
  const destRef = useRef(null);
  const hudKmRef = useRef(null);
  const hudStateRef = useRef(null);
  const lenRef = useRef(1);
  const frame = useRef(null);

  useIsoLayout(() => {
    if (measureRef.current) lenRef.current = measureRef.current.getTotalLength();
    frame.current?.();
  }, [dest]);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = 0;
      const svg = svgRef.current;
      const path = measureRef.current;
      if (!svg || !path) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const target = document.querySelector(ARRIVE_AT);
      const arriveY = target ? target.getBoundingClientRect().top + y - vh * 0.35 : document.documentElement.scrollHeight - vh;
      const departY = vh * 0.25;
      const drive = ease(clamp((y - departY) / Math.max(1, arriveY - departY)));

      // Posición y giro del coche
      const L = lenRef.current;
      const at = drive * L;
      const pt = path.getPointAtLength(at);
      const a = path.getPointAtLength(Math.min(L, at + 4));
      const b = path.getPointAtLength(Math.max(0, at - 4));
      const ang = (Math.atan2(a.y - b.y, a.x - b.x) * 180) / Math.PI;

      // Cámara: empieza sobre Alemania/Suiza y después sigue al coche
      const narrow = vw < 760;
      const w = narrow ? 330 : vw < 1100 ? 520 : 600;
      const h = (w * vh) / vw;
      const follow = smooth(clamp(y / (vh * 1.1)));
      // en escritorio el coche va en el lado derecho (el contenido ocupa la izquierda)
      const side = narrow ? 0 : w * 0.24;
      const tx = pt.x - side;
      const ty = pt.y + (narrow ? h * 0.1 : h * 0.02);
      const sx = START.x - side;
      const sy = narrow ? map.hub.y + h * 0.1 : START.y;
      let cx = sx + (tx - sx) * follow;
      let cy = sy + (ty - sy) * follow;
      cx = clamp(cx, -150, 1150);
      cy = clamp(cy, h / 2 - 60, 1060 - h / 2);
      svg.setAttribute("viewBox", `${(cx - w / 2).toFixed(1)} ${(cy - h / 2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
      // tamaño de 1 píxel en unidades del mapa (para que textos y coche no cambien de tamaño)
      svg.style.setProperty("--u", (w / vw).toFixed(4));

      const k = w / vw;
      carRef.current?.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${(k * 1.15).toFixed(3)})`);
      if (trailRef.current) trailRef.current.style.strokeDashoffset = String(1 - drive);
      destRef.current?.classList.toggle("is-arrived", drive > 0.995);

      if (hudKmRef.current) hudKmRef.current.textContent = `${fmt(Math.round(drive * route.km))} / ${fmt(route.km)} km`;
      if (hudStateRef.current) {
        hudStateRef.current.textContent =
          drive <= 0.001 ? r.hudReady : drive >= 0.995 ? `${r.hudArrived} ${route.label}` : `${r.hudOnWay} ${route.label}`;
      }
    };
    frame.current = draw;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [route, r]);

  const others = Object.entries(map.routes).filter(([k]) => k !== dest);

  return (
    <>
    <div className="backdrop" aria-hidden="true">
      <svg ref={svgRef} viewBox="400 50 600 600" preserveAspectRatio="xMidYMid slice" className="bd-svg">
        <rect x="-200" y="-200" width="1400" height="1400" className="bd-sea" />
        {map.countries.map((c) => (
          <path key={c.name} d={c.d} className={`bd-land bd-${c.role}`} />
        ))}
        {Object.entries(map.labels).map(([k, [x, y]]) => (
          <text key={k} x={x} y={y} className={`bd-country bd-country-${k}`}>
            {{ de: "Alemania", ch: "Suiza", fr: "Francia", es: "España", pt: "Portugal", it: "Italia" }[k]}
          </text>
        ))}

        {/* Rutas alternativas hacia otras ciudades de España */}
        {others.map(([k, r]) => (
          <path key={k} d={r.d} className="bd-alt" />
        ))}

        {/* Ramales: ciudades alemanas y Zúrich → Basilea */}
        {Object.entries(map.origins).map(([k, o], i) => (
          <g key={k} style={{ "--i": i }}>
            <path d={o.d} pathLength="1" className="bd-feeder" />
            <path d={o.d} pathLength="1" className="bd-flow" />
          </g>
        ))}

        {/* Tronco único hasta España */}
        <path d={route.d} ref={measureRef} className="bd-trunk" />
        <path d={route.d} pathLength="1" ref={trailRef} className="bd-trail" />

        {Object.entries(map.origins).map(([k, o]) => (
          <g key={k} className="bd-city">
            <circle cx={o.x} cy={o.y} className="bd-dot" />
            <text x={o.x} y={o.y} className="bd-label">{o.label}</text>
          </g>
        ))}
        <g className="bd-hub">
          <circle cx={map.hub.x} cy={map.hub.y} className="bd-hub-ring" />
          <circle cx={map.hub.x} cy={map.hub.y} className="bd-hub-dot" />
          <text x={map.hub.x} y={map.hub.y} className="bd-label bd-label-hub">{map.hub.label}</text>
        </g>
        {others.map(([k, r]) => (
          <g key={k}>
            <circle cx={r.x} cy={r.y} className="bd-dot bd-dot-soft" />
            <text x={r.x} y={r.y} className="bd-label bd-label-soft">{r.label}</text>
          </g>
        ))}
        <g ref={destRef} className="bd-dest">
          <circle cx={route.x} cy={route.y} className="bd-dest-ring" />
          <circle cx={route.x} cy={route.y} className="bd-dest-dot" />
          <text x={route.x} y={route.y} className="bd-label bd-label-dest">{route.label}</text>
        </g>

        <g ref={carRef} className="bd-car">
          <CarTopIcon />
        </g>
      </svg>
    </div>

      <div className="hud" aria-hidden="true">
        <span className="hud-state" ref={hudStateRef}>{r.hudReady}</span>
        <span className="hud-km" ref={hudKmRef}>0 / {fmt(route.km)} km</span>
      </div>
    </>
  );
}
