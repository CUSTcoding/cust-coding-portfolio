import { memo } from "react";
import { texts } from "@/config/texts";

const LINKS = ["home", "servicos", "experiencia", "projetos", "skills", "contato"] as const;

function HeaderBase() {
  const { navigation } = texts;
  return (
    <header>
      <nav className="container">
        <div className="brand">
          <div className="dot"></div>
          <a href="#home">
            <strong id="brand-name">{navigation.brand}</strong>
          </a>
        </div>
        <div className="nav-links">
          {LINKS.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              id={`nav-${key}`}
              className={key === "contato" ? "magnet" : undefined}
            >
              {navigation.links[key]}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

export const Header = memo(HeaderBase);
