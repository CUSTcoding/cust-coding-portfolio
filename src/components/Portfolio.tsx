"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { texts } from "@/config/texts";
import { startLoaderFlow } from "@/lib/loaderFlow";
import { initPortfolioEngine } from "@/lib/engine";
import { Background } from "./layers/Background";
import { Header } from "./Header";
import { Hero } from "./sections/Hero";
import { Servicos } from "./sections/Servicos";
import { Experiencia } from "./sections/Experiencia";
import { Projetos } from "./sections/Projetos";
import { Skills } from "./sections/Skills";
import { Contato } from "./sections/Contato";
import { ControlPanels } from "./controls/ControlPanels";
import { Footer } from "./Footer";

/**
 * Raiz do portfólio.
 * 1) Mostra o loader (breach protocol, /cyberpunk.js) e mantém #main-content escondido;
 * 2) quando o loader termina, carrega o styles.css, mostra o conteúdo e arranca o motor 3D.
 */
export function Portfolio() {
  const [mainShown, setMainShown] = useState(false);

  useEffect(() => {
    let stopEngine: (() => void) | undefined;

    // Prefetch só do modelo que este aparelho vai usar
    const prefetch = document.createElement("link");
    prefetch.rel = "prefetch";
    prefetch.crossOrigin = "anonymous";
    prefetch.href = window.innerWidth <= 768 ? "/retro_computer.mobile.glb" : "/retro_computer.glb";
    document.head.appendChild(prefetch);

    const stopFlow = startLoaderFlow({
      showMain: () => flushSync(() => setMainShown(true)),
      startEngine: () => {
        // textos (já renderizados pelo React) + meta tags, como fazia o textLoader
        document.title = texts.meta.title;
        document.documentElement.lang = texts.meta.lang;
        window.textLoader = { texts };
        stopEngine = initPortfolioEngine();
      },
    });

    // Abertura (breach protocol): cópia local do original
    const loaderScript = document.createElement("script");
    loaderScript.src = "/cyberpunk.js";
    document.body.appendChild(loaderScript);

    return () => {
      stopFlow();
      stopEngine?.();
      prefetch.remove();
      loaderScript.remove();
    };
  }, []);

  return (
    <>
      {/* Loading Screen - Página inicial */}
      <div id="initial-loader" style={{ display: "none" }}>
        <div id="loader-text">Carregando...</div>
      </div>

      {/* Conteúdo principal - escondido até o loading terminar */}
      <div id="main-content" style={{ display: mainShown ? "block" : "none" }}>
        <Background />
        <Header />
        <main>
          <Hero />
          <Servicos />
          <Experiencia />
          <Projetos />
          <Skills />
          <Contato />
        </main>
        <ControlPanels />
        <Footer />
      </div>
    </>
  );
}
