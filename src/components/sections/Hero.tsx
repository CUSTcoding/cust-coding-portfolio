import { memo } from "react";
import { texts } from "@/config/texts";
import { escapeHtml, html } from "@/lib/html";
import { iconStyle } from "@/lib/icons";
import CTA from "../CTA";
import { Socials } from "../Socials";
import { Stats } from "./Stats";

function HeroBase() {
  const { hero } = texts;
  return (
    <section className="hero" id="home" aria-label="Abertura">
      <div className="container inner">
        <span className="kicker" id="hero-kicker">
          {hero.kicker}
        </span>
        {/* h1 e subtítulo: o motor/GSAP mexe neles diretamente, o React não gere os filhos */}
        <h1
          className="anaglyph glitch"
          id="hero-title"
          data-text={hero.title}
          dangerouslySetInnerHTML={html(escapeHtml(hero.title))}
        />
        <p className="subtitle" id="hero-subtitle" dangerouslySetInnerHTML={html(hero.subtitle)} />
        <div className="hero-ctas" id="hero-ctas">
          {hero.ctas.map((cta) => (
            <a className="btn-cp" href={cta.href} key={cta.href}>
              {cta.label}
            </a>
          ))}
        </div>
        {/* Download CV + redes sociais */}
        <div className="hero-extra">
          <a className="cv-btn" href={hero.cv.href} download>
            <CTA className="cv-cta" value={<span className="cv-btn__icon" style={iconStyle("lu:download")} aria-hidden="true" />}>
              {hero.cv.label}
            </CTA>
          </a>
          <Socials socials={hero.socials} className="hero-socials" />
        </div>
        <Stats />
      </div>

    </section>
  );
}

export const Hero = memo(HeroBase);
