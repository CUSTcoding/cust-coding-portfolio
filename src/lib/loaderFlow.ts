/**
 * Fluxo do loader ("breach protocol") -> home.
 * Port fiel do <script> inline do index.html original:
 *  - o loader é o /cyberpunk.js (cópia local do original), que monta a sua UI no <body>;
 *  - quando o progresso do breach chega a 95 % (ou após 20 s, ou no evento
 *    "nightfm-complete") o loader some, o styles.css é carregado e a home aparece.
 */

type Callbacks = {
  /** Torna o #main-content visível (display: block). Deve aplicar-se de forma síncrona. */
  showMain: () => void;
  /** Arranca textos/3D/animações (o que o original fazia carregando textLoader + script.js). */
  startEngine: () => void;
};

/** Limpeza dos elementos que a UI do loader deixa no body (igual ao original). */
export function cleanupSvelteElements() {
  // Limpar elementos svelte
  document
    .querySelectorAll(
      '.svelte-pj992h, main.svelte-pj992h, [class*="svelte-pj992h"], div[class*="svelte"]'
    )
    .forEach((el) => el.remove());

  // Limpar elementos com texto "Loading..."
  document.querySelectorAll("div").forEach((div) => {
    if (div.textContent && div.textContent.trim() === "Loading...") div.remove();
  });

  // Limpar elementos que aparecem após o footer
  const footer = document.querySelector("footer");
  if (footer) {
    const after: Element[] = [];
    let next = footer.nextElementSibling;
    while (next) {
      after.push(next);
      next = next.nextElementSibling;
    }
    after.forEach((el) => {
      if (el.classList && (el.classList.contains("svelte-pj992h") || el.textContent === "Loading...")) {
        el.remove();
      }
    });
  }

  // Limpar elementos específicos que podem aparecer
  document
    .querySelectorAll('div[class*="svelte"], div[class*="breach"], div[class*="loading"]')
    .forEach((el) => {
      if (el.textContent && (el.textContent.includes("Loading") || el.textContent.includes("Loading..."))) {
        el.remove();
      }
    });
}

export function startLoaderFlow({ showMain, startEngine }: Callbacks): () => void {
  const timers: number[] = [];
  const intervals: number[] = [];
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.push(id);
    return id;
  };
  const every = (fn: () => void, ms: number) => {
    const id = window.setInterval(fn, ms);
    intervals.push(id);
    return id;
  };

  const loader = document.getElementById("initial-loader");
  if (loader) loader.style.display = "none";

  let transitionTriggered = false;

  function transitionToHome() {
    if (transitionTriggered) return;
    transitionTriggered = true;

    // Adicionar classe de transição para prevenir recarregamento duplo
    document.body.classList.add("transitioning");

    const showHome = () => {
      const homeCSS = document.createElement("link");
      homeCSS.rel = "stylesheet";
      homeCSS.href = "/styles.css";
      // O tema (verde, JetBrains Mono, componentes novos) vem depois do styles.css para o sobrepor
      const themeCSS = document.createElement("link");
      themeCSS.rel = "stylesheet";
      themeCSS.href = "/theme.css";
      let cssLoaded = 0;
      const onCssLoad = () => {
        if (++cssLoaded < 2) return;
        if (document.body.dataset.resumeLoaded === "1") return;
        document.body.dataset.resumeLoaded = "1";

        showMain();

        // Limpeza robusta dos elementos do loader
        cleanupSvelteElements();

        // Monitor contínuo para elementos que aparecem dinamicamente
        const svelteMonitor = every(cleanupSvelteElements, 500);
        later(() => window.clearInterval(svelteMonitor), 20000);

        // Monitor adicional específico para elementos "Loading..."
        const loadingMonitor = every(() => {
          document.querySelectorAll("div").forEach((div) => {
            if (div.textContent && div.textContent.trim() === "Loading...") div.remove();
          });
        }, 200);
        later(() => window.clearInterval(loadingMonitor), 25000);

        // textos + cena 3D + animações
        startEngine();

        // Transição suave
        later(() => {
          if (loader) {
            loader.classList.add("fade-out");
            later(() => {
              loader.style.display = "none";
            }, 1500);
          }
          document.body.style.overflow = "auto";
          document.body.classList.remove("transitioning");
          document.body.classList.add("loading-complete");
        }, 500);
      };
      homeCSS.addEventListener("load", onCssLoad);
      themeCSS.addEventListener("load", onCssLoad);
      homeCSS.addEventListener("error", onCssLoad);
      themeCSS.addEventListener("error", onCssLoad);
      document.head.appendChild(homeCSS);
      document.head.appendChild(themeCSS);
    };

    if (loader) {
      loader.classList.add("fade-out");
      later(showHome, 1200);
    } else {
      showHome();
    }
  }

  function waitForBreachProgressThenTransition(timeoutMs: number) {
    const start = Date.now();
    const tick = every(() => {
      const inner = document.querySelector<HTMLElement>(".breachProgressInner");
      const bar = inner && inner.parentElement ? inner.parentElement : null;
      if (inner && bar) {
        const w = inner.offsetWidth;
        const total = bar.offsetWidth || 1;
        const pct = total > 0 ? w / total : 0;
        if (pct >= 0.95) {
          window.clearInterval(tick);
          transitionToHome();
          return;
        }
      }
      if (Date.now() - start > timeoutMs) {
        window.clearInterval(tick);
        transitionToHome();
      }
    }, 150);
  }

  const onComplete = () => {
    if (!transitionTriggered) transitionToHome();
  };
  const onPointer = (e: Event) => {
    const target = e.target as Element | null;
    const btn = target && target.closest ? target.closest(".breachButton") : null;
    if (btn && !transitionTriggered) waitForBreachProgressThenTransition(20000);
  };

  document.addEventListener("nightfm-complete", onComplete);
  document.addEventListener("click", onPointer);
  document.addEventListener("touchstart", onPointer, { passive: true });

  const startFallback = () => {
    later(() => {
      if (!transitionTriggered) waitForBreachProgressThenTransition(20000);
    }, 1000);
  };
  if (document.readyState === "complete") startFallback();
  else window.addEventListener("load", startFallback, { once: true });

  return () => {
    timers.forEach((t) => window.clearTimeout(t));
    intervals.forEach((i) => window.clearInterval(i));
    document.removeEventListener("nightfm-complete", onComplete);
    document.removeEventListener("click", onPointer);
    document.removeEventListener("touchstart", onPointer);
  };
}
