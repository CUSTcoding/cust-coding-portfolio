"use client";

import { memo, useRef, useState } from "react";
import { texts } from "@/config/texts";
import { html } from "@/lib/html";

function ProjetosBase() {
  const { projetos } = texts;
  const label = projetos.cardLabel || "PRJ";
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = Math.max(0, Math.min(index, projetos.cards.length - 1));
    track.scrollTo({ left: nextIndex * track.clientWidth, behavior: "smooth" });
    setActiveIndex(nextIndex);
  };

  const updateActiveCard = () => {
    const track = trackRef.current;
    if (track) setActiveIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <section className="panel" id="projetos" aria-label="Projetos">
      <div className="container">
        <h2 className="anaglyph cyberpunk" id="projetos-title">
          {projetos.title}
        </h2>
        {projetos.intro && <p className="section-intro">{projetos.intro}</p>}
        <div className="project-carousel">
          <div
            className="project-carousel__track"
            id="projetos-cards"
            ref={trackRef}
            onScroll={updateActiveCard}
            role="region"
            aria-roledescription="carrossel"
            aria-label="Projetos"
            tabIndex={0}
          >
            {projetos.cards.map((card, i) => {
              const [name, ...rest] = card.title.split(" — ");
              const tagline = rest.join(" — ");
              const stack = card.stack ? card.stack.split("•").map((s: string) => s.trim()) : [];
              return (
                <article
                  className="card card-cyberpunk project-card"
                  data-text={card.dataText}
                  key={card.title}
                  aria-label={`${i + 1} de ${projetos.cards.length}`}
                >
                  <div className="project-card__visual">
                    <svg
                      className="project-card__background"
                      viewBox="0 0 697 380"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path d="M451.734 12.4763H451.891L452.017 12.3832L468.14 0.476323H696.524V345.154L658.086 379.261H137.108L120.958 371.31L120.859 371.261H120.748H80.4985H80.3876L80.2881 371.31L64.1384 379.261H0.476323V0.476323H395.079L411.202 12.3832L411.328 12.4763H411.485H451.734Z" />
                    </svg>
                    <div className="project-card__content">
                      <span className="project-card__code">
                        {label} :: {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="project-card__heading" dangerouslySetInnerHTML={html(name)} />
                      {tagline && <p className="project-card__tagline" dangerouslySetInnerHTML={html(tagline)} />}
                      <p className="project-card__description" dangerouslySetInnerHTML={html(card.description)} />
                      {stack.length > 0 && (
                        <ul className="mission__stack">
                          {stack.map((item: string) => (
                            <li key={item} dangerouslySetInnerHTML={html(item)} />
                          ))}
                        </ul>
                      )}
                      <a className="project-card__action" href="#contato">
                        Entre em contato <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="project-carousel__controls">
            <button
              type="button"
              className="project-carousel__button"
              onClick={() => goToCard(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Projeto anterior"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5m7 7-7-7 7-7" />
              </svg>
            </button>
            <span className="project-carousel__count" aria-live="polite">{activeIndex + 1}/{projetos.cards.length}</span>
            <button
              type="button"
              className="project-carousel__button"
              onClick={() => goToCard(activeIndex + 1)}
              disabled={activeIndex === projetos.cards.length - 1}
              aria-label="Próximo projeto"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Projetos = memo(ProjetosBase);
