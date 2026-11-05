"use client";

import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import { texts } from "@/config/texts";
import { iconStyle } from "@/lib/icons";
import { PerkView, type Branch } from "./PerkView";

const branches = texts.skills.branches as unknown as Record<string, Branch>;

/** Ordem/tags do esqueleto original: cada atributo mostra a tag em cima, embaixo ou nos dois. */
const LAYOUT: Record<string, { top?: boolean; bottom?: boolean }> = {
  frontend: { top: true, bottom: true },
  backend: { top: true },
  database: { top: true },
  devops: { bottom: true },
  ia: { bottom: true },
};

export function SkillTree() {
  const { skills } = texts;
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [touch, setTouch] = useState<boolean | null>(null);

  // Aviso de interação no canto livre da prancha (abaixo do nó de IA)
  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  const open = useCallback((key: string) => setOpenKey(key), []);
  const close = useCallback(() => setOpenKey(null), []);

  const onKey = (key: string) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open(key);
    }
  };

  return (
    <div className={`cyberpunk-skill-tree${openKey ? " is-perks" : ""}`}>
      {/* Background Image */}
      <div className="skill-tree-bg">
        <img src="/build/images/bg-70388ab4.webp" alt="Cyberpunk Background" className="bg-image" />
        <img src="/build/images/tree-decoration-6ce8e6ed.png" alt="Tree Decoration" className="tree-decoration" />
      </div>

      {/* Prancha com as proporções do build planner (762x820) */}
      <div className="skill-tree-board">
        {/* Central Level Diamond */}
        <div className="central-level">
          <div className="level-diamond">
            <img src="/build/images/tile-master-available-1322f2e3.png" alt="Level Diamond" className="diamond-tile" />
            <div className="level-number" id="skills-level">
              {skills.level}
            </div>
            <div className="level-label" id="skills-level-label">
              {skills.levelLabel}
            </div>
          </div>
        </div>

        {/* Skill Attributes */}
        {skills.attributes.map((attribute) => {
          const key = attribute.slot;
          const layout = LAYOUT[key] ?? {};
          const tags = attribute.tags as { top?: string; bottom?: string };
          return (
            <div className="skill-attribute" data-attribute={key} data-level={attribute.level} key={key}>
              {layout.top && <div className="attribute-tag attribute-tag--top">{tags.top}</div>}
              <div
                className="attribute-panel"
                data-level={attribute.level}
                role="button"
                tabIndex={0}
                aria-label={`Abrir perks de ${branches[key].title}`}
                onClick={() => open(key)}
                onKeyDown={onKey(key)}
              >
                <div className="attribute-name">{attribute.name}</div>
                <div className="attribute-stats">
                  <img src={attribute.icon} alt={attribute.name} className="attribute-icon" />
                  <div className="attribute-level">{attribute.level}</div>
                </div>
              </div>
              {layout.bottom && <div className="attribute-tag attribute-tag--bottom">{tags.bottom}</div>}
            </div>
          );
        })}

        {/* Relic Panel */}
        <div className="relic-panel">
          <img src="/build/images/relic-2d40d586.png" alt="Relic" className="relic-icon" />
          <div className="relic-text" id="skills-relic-text">
            {skills.relicText}
          </div>
        </div>

        {touch !== null && skills.perksUi.interact && (
          <div className="skill-interact-hint">
            <span
              className="skill-interact-hint__icon"
              style={{
                ...iconStyle(touch ? "lu:pointer" : "lu:mouse-pointer-click"),
              }}
            ></span>
            <span>{touch ? skills.perksUi.interact.touch : skills.perksUi.interact.mouse}</span>
          </div>
        )}
      </div>

      {/* Central connectors grid to match style */}
      <div className="central-diamond-grid">
        <div className="mini-diamond pos-1"></div>
        <div className="mini-diamond pos-2"></div>
        <div className="mini-diamond pos-3"></div>
        <div className="mini-diamond pos-4"></div>
      </div>

      {/* Background Circuit Elements */}
      <div className="circuit-elements">
        {skills.circuitTexts.map((text, i) => (
          <div className="circuit-text" id={`circuit-text-${i + 1}`} key={i}>
            {text}
          </div>
        ))}
      </div>

      <PerkView openKey={openKey} onSelect={open} onClose={close} />
    </div>
  );
}
