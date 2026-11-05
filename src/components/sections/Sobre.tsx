import { memo } from "react";
import { texts } from "@/config/texts";
import { Card } from "./Card";

function SobreBase() {
  const { sobre } = texts;
  return (
    <section className="panel" id="sobre" aria-label="Sobre">
      <div className="container">
        <h2 className="anaglyph cyberpunk" id="sobre-title">
          {sobre.title}
        </h2>
        <p className="muted hud-frame" id="sobre-description">
          {sobre.description}
        </p>
        <div className="cards" id="sobre-cards">
          {sobre.cards.map((card) => (
            <Card
              key={card.title}
              dataText={card.dataText}
              title={card.title}
              description={card.description}
              phone={"phone" in card ? (card as { phone?: string }).phone : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export const Sobre = memo(SobreBase);
