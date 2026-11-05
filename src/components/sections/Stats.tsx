"use client";

import { useEffect, useRef, useState } from "react";
import { texts } from "@/config/texts";

/** Contadores animados (0 → valor) que começam quando a home aparece. */
export function Stats() {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const stats = texts.hero.stats;
  const [values, setValues] = useState(() => stats.map((stat) => stat.value));

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/github-commits", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((result: { count?: unknown } | null) => {
        if (typeof result?.count !== "number" || !Number.isSafeInteger(result.count) || result.count < 0) return;
        const commitStatIndex = stats.findIndex((stat) => stat.label === "Commits de código");
        if (commitStatIndex < 0) return;

        setValues((current) =>
          current.map((value, index) => (index === commitStatIndex ? (result.count as number) : value)),
        );
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [stats]);

  useEffect(() => {
    let raf = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const startTime = performance.now();
      const cycleDuration = 3000;
      const animationDuration = 1800;
      const tick = (now: number) => {
        const cycleProgress = (now - startTime) % cycleDuration;
        const progress = Math.min(1, cycleProgress / animationDuration);
        const eased = 1 - Math.pow(1 - progress, 3);
        stats.forEach((s, i) => {
          const el = refs.current[i];
          if (el) el.textContent = String(Math.round(values[i] * eased));
        });
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (document.body.classList.contains("loading-complete")) run();
    const mo = new MutationObserver(() => {
      if (document.body.classList.contains("loading-complete")) {
        run();
        mo.disconnect();
      }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [stats, values]);

  return (
    <div className="hero-stats" id="hero-stats">
      {stats.map((s, i) => (
        <div className="hero-stat" key={s.label}>
          <span className="hero-stat__num">
            <span
              ref={(el) => {
                refs.current[i] = el;
              }}
            >
              0
            </span>
            {s.suffix}
          </span>
          <span className="hero-stat__label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
