import { memo } from "react";
import { texts } from "@/config/texts";
import { Card } from "./Card";

function ServicosBase() {
  const { servicos } = texts;
  return (
    <section className="panel" id="servicos" aria-label="Serviços">
      <div className="container">
        <h2 className="anaglyph cyberpunk" id="servicos-title">
          {servicos.title}
        </h2>
        {servicos.intro && <p className="section-intro">{servicos.intro}</p>}
        <div className="cards" id="servicos-cards">
          {servicos.cards.map((card) => (
            <Card key={card.title} dataText={card.dataText} title={card.title} description={card.description} />
          ))}
        </div>
      </div>
    </section>
  );
}

export const Servicos = memo(ServicosBase);
