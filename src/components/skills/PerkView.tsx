"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { texts } from "@/config/texts";
import { iconUrl } from "@/lib/icons";

export type Perk = { name: string; icon: string; level: string; where?: string; desc: string };
export type Branch = {
  title: string;
  subtitle: string;
  columns: { major: Perk; mid: Perk; side: Perk[] }[];
};

// Geometria da prancha (1000 x 620): três colunas simétricas.
// Cada coluna: perk grande em cima, nó do meio e dois perks ao lado dele.
const BOARD = { w: 1000, h: 620 };
const COLUMNS_X = [270, 560, 850];
const MAJOR = { y: 180, size: 124 };
const MID = { y: 405, size: 92 };
const SIDE = { dx: 100, size: 62 };
const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(3)}%`;

const branches = texts.skills.branches as unknown as Record<string, Branch>;
const ui = texts.skills.perksUi;
const attributeKeys = Object.keys(branches);
const attributeIcon = (key: string) =>
  texts.skills.attributes.find((a) => a.slot === key)?.icon || "";
const attributeLevel = (key: string) =>
  texts.skills.attributes.find((a) => a.slot === key)?.level ?? "";

type Tip = { name: string; where: string; desc: string; level: string; style: CSSProperties };

type Props = {
  /** ramo aberto (null = fechado) */
  openKey: string | null;
  onSelect: (key: string) => void;
  onClose: () => void;
};

function PerkButton({ perk, kind, x, y, size }: { perk: Perk; kind: "major" | "mid" | "side"; x: number; y: number; size: number }) {
  const maxed = /^(\d+)\/\1$/.test(perk.level);
  return (
    <button
      type="button"
      className={`perk perk--${kind}${maxed ? " is-maxed" : ""}`}
      style={{
        left: pct(x - size / 2, BOARD.w),
        top: pct(y - size / 2, BOARD.h),
        width: pct(size, BOARD.w),
        height: pct(size, BOARD.h),
      }}
      data-name={perk.name}
      data-where={perk.where || ""}
      data-desc={perk.desc}
      data-level={perk.level}
      aria-label={`${perk.name} — ${perk.level}`}
    >
      <span className="perk__frame">
        <span className="perk__icon" style={{ ["--icon" as string]: `url('${iconUrl(perk.icon)}')` }}></span>
      </span>
      {kind === "side" ? null : <span className="perk__level">{perk.level}</span>}
      <span className="perk__label">{perk.name}</span>
    </button>
  );
}

export function PerkView({ openKey, onSelect, onClose }: Props) {
  const open = openKey !== null;
  // último ramo mostrado (a tela continua montada, só escondida, quando fecha)
  const [current, setCurrent] = useState<string>(attributeKeys[0]);
  const [tip, setTip] = useState<Tip | null>(null);
  const [mobile, setMobile] = useState(false);
  const backRef = useRef<HTMLButtonElement>(null);
  const lastKey = useRef<string | null>(null);

  // Abrir: marca ramo, decide layout mobile (no celular a árvore tem transform, que prende
  // elementos fixed: a tela de perks vai para o body para ocupar a tela inteira).
  useEffect(() => {
    if (openKey) {
      setCurrent(openKey);
      lastKey.current = openKey;
      setTip(null);
      const isMobile = window.innerWidth <= 768;
      setMobile(isMobile);
      if (isMobile) document.body.style.overflow = "hidden";
      // foco no botão "voltar" depois de montar (inclui o portal)
      requestAnimationFrame(() => backRef.current?.focus({ preventScroll: true }));
    } else if (lastKey.current) {
      document.body.style.overflow = "";
      setMobile(false);
      setTip(null);
      document
        .querySelector<HTMLElement>(`.skill-attribute[data-attribute="${lastKey.current}"] .attribute-panel`)
        ?.focus({ preventScroll: true });
    }
  }, [openKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const branch = branches[current];
  const count = branch.columns.reduce((n, c) => n + 2 + c.side.length, 0);

  const showTooltip = (perk: HTMLElement) => {
    const { name = "", where = "", desc = "", level = "" } = perk.dataset;
    // Posição em % da prancha (independe da escala da tela do monitor)
    const left = parseFloat(perk.style.left);
    const top = parseFloat(perk.style.top);
    const width = parseFloat(perk.style.width);
    const toRight = left + width / 2 < 62;
    setTip({
      name,
      where,
      desc,
      level,
      style: {
        left: toRight ? `${left + width + 1.2}%` : "auto",
        right: toRight ? "auto" : `${100 - left + 1.2}%`,
        top: `${Math.min(top, 58)}%`,
      },
    });
  };
  const perkFrom = (target: EventTarget) => (target as HTMLElement).closest?.(".perk") as HTMLElement | null;

  const view = (
    <div className={`perk-view${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="perk-board" onClick={(e) => e.stopPropagation()}>
        <nav className="perk-sidebar" aria-label="Ramos">
          {attributeKeys.map((key) => (
            <button
              type="button"
              key={key}
              className={`perk-tab${key === current ? " is-active" : ""}`}
              data-branch={key}
              aria-label={branches[key].title}
              aria-current={key === current ? "true" : "false"}
              onClick={() => {
                setCurrent(key);
                setTip(null);
                onSelect(key);
              }}
            >
              <img src={attributeIcon(key)} alt="" />
              <span>{attributeLevel(key)}</span>
            </button>
          ))}
          <img className="perk-relic" src="/build/images/relic-2d40d586.png" alt="" />
        </nav>
        <div className="perk-header">
          <div className="perk-title" role="heading" aria-level={3}>
            {branch.title}
          </div>
          <p className="perk-subtitle">{branch.subtitle}</p>
        </div>
        <div className="perk-tree">
          <svg className="perk-links" viewBox={`0 0 ${BOARD.w} ${BOARD.h}`} preserveAspectRatio="none" aria-hidden="true">
            {branch.columns.map((_, i) => {
              const x = COLUMNS_X[i];
              const majorBottom = MAJOR.y + MAJOR.size / 2;
              const midTop = MID.y - MID.size / 2;
              const ds = [`M${x} ${majorBottom} V${midTop}`];
              [-1, 1].forEach((side) => {
                const from = x + (side * MID.size) / 2;
                const to = x + side * (SIDE.dx - SIDE.size / 2);
                ds.push(`M${from} ${MID.y} H${to}`);
              });
              return ds.map((d) => (
                // Trilha dupla (como as do jogo): contorno claro + miolo escuro
                <g key={`${i}-${d}`}>
                  <path className="perk-link-outer" d={d} />
                  <path className="perk-link-inner" d={d} />
                </g>
              ));
            })}
            {/* Trilho inferior ligando os ramos */}
            <path className="perk-rail" d="M150 540 H980" />
          </svg>
          <div
            className="perk-nodes"
            onPointerOver={(e) => {
              const perk = perkFrom(e.target);
              if (perk) showTooltip(perk);
            }}
            onPointerLeave={() => setTip(null)}
            onFocus={(e) => {
              const perk = perkFrom(e.target);
              if (perk) showTooltip(perk);
            }}
            onBlur={() => setTip(null)}
          >
            {branch.columns.map((column, i) => {
              const x = COLUMNS_X[i];
              return (
                <div className="perk-col" key={`${current}-${i}`}>
                  <PerkButton perk={column.major} kind="major" x={x} y={MAJOR.y} size={MAJOR.size} />
                  <PerkButton perk={column.mid} kind="mid" x={x} y={MID.y} size={MID.size} />
                  {column.side.map((perk, s) => (
                    <PerkButton
                      key={perk.name}
                      perk={perk}
                      kind="side"
                      x={x + (s === 0 ? -1 : 1) * SIDE.dx}
                      y={MID.y}
                      size={SIDE.size}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div className="perk-tooltip" role="tooltip" hidden={!tip} style={tip?.style}>
          {tip && (
            <>
              <strong>{tip.name}</strong>
              {tip.where ? <em>{tip.where}</em> : null}
              <p>{tip.desc}</p>
              <span className="perk-tooltip__level">
                {ui.levelLabel} {tip.level}
              </span>
            </>
          )}
        </div>
        <div className="perk-footer">
          <button type="button" className="perk-back" ref={backRef} onClick={onClose}>
            <span aria-hidden="true">←</span> {ui.back}
          </button>
          <span className="perk-hint">{ui.hint}</span>
          <span className="perk-count">
            {count} {ui.perksLabel}
          </span>
        </div>
      </div>
    </div>
  );

  return open && mobile ? createPortal(view, document.body) : view;
}
