// @ts-nocheck
/* eslint-disable */
// Portado de script.js (site original) para módulo TypeScript.
// Lógica e valores mantidos; só mudou a embalagem (módulos, estado partilhado).
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

function applyAnaglyphEffect(intensity) {
  // intensity vai de 0 a 1
  // Calcular deslocamento baseado na intensidade (0px a 3px)
  const offset = intensity * 3;
  
  // Aplicar a todos os elementos com classe .anaglyph
  const anaglyphElements = document.querySelectorAll(".anaglyph");
  anaglyphElements.forEach((el) => {
    // text-shadow: 0 0 0 var(--text), offset 0 0 var(--acc), -offset 0 0 var(--acc2)
    el.style.textShadow = `0 0 0 var(--text), ${offset}px 0 0 var(--acc), -${offset}px 0 0 var(--acc2)`;
  });
  
}

// Tornar função globalmente acessível
if (typeof window !== 'undefined') {
  window.applyAnaglyphEffect = applyAnaglyphEffect;
}

/** Entradas GSAP (cards, h1, subtítulo). */
export function setupEntrances() {
  gsap.utils.toArray(".card").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
  gsap.from("h1", {
    y: 36,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.15,
  });
  gsap.from(".subtitle", {
    y: 16,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.3,
  });
}

/** Controlo do anaglifo (era feito pelo textLoader 100 ms depois de montar o contacto). */
export function bindAnaglyphControl() {
  const anaRange = document.getElementById("anaRange");
  if (!anaRange) return;
  applyAnaglyphEffect(parseFloat(anaRange.value));
  anaRange.addEventListener("input", (e) => {
    applyAnaglyphEffect(parseFloat(e.target.value));
  });
}

// Rail de progresso (HUD): trilho com um marcador por seção, preenchido
// conforme o scroll; a seção atual fica acesa e mostra o nome ao lado.
export function setupProgressRail() {
  const rail = document.querySelector(".progress");
  if (!rail) return;
  const ids = ["home", "servicos", "experiencia", "projetos", "skills", "contato"];
  const sections = ids
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const label = (section) =>
    document.querySelector(`.nav-links a[href="#${section.id}"]`)?.textContent.trim() ||
    section.id;

  rail.innerHTML = `
    <div class="progress__track"><div class="bar"></div></div>
    ${sections
      .map(
        (section, i) => `
      <a class="progress__mark" href="#${section.id}" data-section="${section.id}" aria-label="${label(section)}">
        <span class="progress__num">${String(i + 1).padStart(2, "0")}</span>
        <span class="progress__label">${label(section)}</span>
      </a>`
      )
      .join("")}
    <div class="progress__readout">SYNC <b>0</b>%</div>`;
  rail.removeAttribute("aria-hidden");
  rail.setAttribute("aria-label", "Seções");

  const bar = rail.querySelector(".bar");
  const readout = rail.querySelector(".progress__readout b");
  const marks = [...rail.querySelectorAll(".progress__mark")];
  let starts = [];

  // posição de cada marcador = onde a seção começa, em % da rolagem total
  const layout = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    starts = sections.map((section) => {
      let top = 0;
      for (let el = section; el; el = el.offsetParent) top += el.offsetTop;
      return Math.min(1, Math.max(0, top / max));
    });
    marks.forEach((mark, i) => (mark.style.top = `${starts[i] * 100}%`));
  };

  const update = (progress) => {
    bar.style.height = `${progress * 100}%`;
    readout.textContent = Math.round(progress * 100);
    // seção atual = a última cujo topo já passou de 40% da tela
    let active = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= innerHeight * 0.4) active = i;
    });
    marks.forEach((mark, i) => {
      mark.classList.toggle("is-passed", i < active);
      mark.classList.toggle("is-active", i === active);
    });
  };

  layout();
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => update(self.progress),
    onRefresh: () => {
      layout();
      update(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
    },
  });
  // textos, skill tree e imagens mudam a altura da página depois do início
  new ResizeObserver(layout).observe(document.body);
  update(0);
}
