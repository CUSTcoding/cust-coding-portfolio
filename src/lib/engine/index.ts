import ScrollTrigger from "gsap/ScrollTrigger";
import { initScene } from "./scene";
import { setupEntrances, bindAnaglyphControl, setupProgressRail } from "./effects";
import { ensureControlsBound } from "./controls";

/**
 * Arranca o motor do portfólio (Three.js + GSAP + skill tree + painéis).
 * Ordem igual à do script.js original: cena -> efeitos -> controlos (150 ms depois).
 * Devolve a função de limpeza.
 */
export function initPortfolioEngine(): () => void {
  const stopScene = initScene();
  setupEntrances();
  setupProgressRail();

  const timers: number[] = [];
  timers.push(window.setTimeout(bindAnaglyphControl, 100));
  timers.push(window.setTimeout(ensureControlsBound, 150));

  return () => {
    timers.forEach((t) => window.clearTimeout(t));
    stopScene();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}
