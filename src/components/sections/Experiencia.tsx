"use client";

import { memo, useRef, useState, type KeyboardEvent } from "react";
import { texts } from "@/config/texts";
import { iconStyle } from "@/lib/icons";

type Tab = {
  key: string;
  label: string;
  heading: string;
  description: string;
  type: "cards" | "icons" | "info";
  cards?: { meta: string; title: string; place: string }[];
  icons?: { name: string; icon: string }[];
  info?: { label: string; value: string }[];
};

/** "Porquê me contratar?": abas Experiência / Educação / Skills / Sobre mim. */
function ExperienciaBase() {
  const { experiencia } = texts;
  const tabs = experiencia.tabs as Tab[];
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    setActive(index);
    if (focus) refs.current[index]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    if (step) {
      e.preventDefault();
      select((active + step + tabs.length) % tabs.length, true);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      select(e.key === "Home" ? 0 : tabs.length - 1, true);
    }
  };

  const tab = tabs[active];

  return (
    <section className="panel" id="experiencia" aria-label="Resumo">
      <div className="container">
        <div className="resume">
          <div className="resume__side">
            <h2 className="anaglyph cyberpunk" id="experiencia-title">
              {experiencia.title}
            </h2>
            <p className="resume__intro">{experiencia.intro}</p>
            <div className="resume__tabs" role="tablist" aria-label={experiencia.title} onKeyDown={onKeyDown}>
              {tabs.map((t, i) => (
                <button
                  type="button"
                  key={t.key}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className={`resume__tab${i === active ? " is-active" : ""}`}
                  role="tab"
                  id={`resume-tab-${t.key}`}
                  aria-controls="resume-panel"
                  aria-selected={i === active}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => select(i)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* key = reinicia a animação de entrada a cada troca de aba */}
          <div
            key={tab.key}
            className="resume__panel"
            id="resume-panel"
            role="tabpanel"
            aria-labelledby={`resume-tab-${tab.key}`}
          >
            <h3 className="resume__heading">{tab.heading}</h3>
            <p className="resume__desc">{tab.description}</p>

            {tab.type === "cards" && (
              <div className="resume__grid">
                {tab.cards!.map((c) => (
                  <div className="resume__card" key={c.title}>
                    <span className="resume__meta">{c.meta}</span>
                    <strong className="resume__title">{c.title}</strong>
                    <span className="resume__place">{c.place}</span>
                  </div>
                ))}
              </div>
            )}

            {tab.type === "icons" && (
              <div className="resume__icons">
                {tab.icons!.map((ic) => (
                  <div className="resume__icon-card" key={ic.name} title={ic.name}>
                    <span className="resume__icon" style={iconStyle(ic.icon)} aria-hidden="true"></span>
                    <span className="resume__icon-name">{ic.name}</span>
                  </div>
                ))}
              </div>
            )}

            {tab.type === "info" && (
              <dl className="resume__info">
                {tab.info!.map((row) => (
                  <div className="resume__info-row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export const Experiencia = memo(ExperienciaBase);
