import { memo } from "react";
import { texts } from "@/config/texts";
import { Socials } from "./Socials";

function FooterBase() {
  const { footer, hero } = texts;
  return (
    <footer className="site-footer" id="footer">
      <div className="container site-footer__inner">
        <div className="site-footer__social">
          <span className="site-footer__label">{footer.social || ""}</span>
          <Socials socials={hero.socials} className="site-footer__social-links" />
        </div>
        <p className="site-footer__copy" suppressHydrationWarning>
          {footer.copyright.replace("{year}", String(new Date().getFullYear()))}
        </p>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterBase);
