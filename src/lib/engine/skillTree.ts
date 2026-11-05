// @ts-nocheck
/* eslint-disable */
// Portado de script.js (site original) para módulo TypeScript.
// Lógica e valores mantidos; só mudou a embalagem (módulos, estado partilhado).
export function setupCyberpunkSkillTree() {
  const skillAttributes = document.querySelectorAll(".skill-attribute");
  const levelNumber = document.querySelector(".level-number");
  
  // Calcular pontos iniciais baseado nos atributos atuais no DOM
  const initialTotal = Array.from(skillAttributes).reduce(
    (sum, attr) => sum + parseInt(attr.dataset.level || 0),
    0
  );
  
  // Obter nível inicial das configurações ou usar o total calculado
  let initialLevel = initialTotal; // Usar o total calculado como padrão
  try {
    // Tentar obter das configurações se disponível (carregado dinamicamente)
    if (window.textLoader && window.textLoader.texts && window.textLoader.texts.skills) {
      const configLevel = window.textLoader.texts.skills.level;
      if (configLevel && configLevel > 0) {
        initialLevel = configLevel;
      }
    }
  } catch (e) {
    console.warn("Não foi possível obter nível inicial das configurações:", e);
  }
  
  // O nível base é o maior entre o configurado e o total inicial
  const baseLevel = Math.max(initialLevel, initialTotal);
  let availablePoints = Math.max(0, baseLevel - initialTotal);

  // Armazenar referências aos atributos para acesso global
  const attributeData = new Map();

  // Initialize skill tree
  skillAttributes.forEach((attribute) => {
    const levelElement = attribute.querySelector(".attribute-level");
    const plusBtn = attribute.querySelector(".attr-btn.plus");
    const minusBtn = attribute.querySelector(".attr-btn.minus");
    let currentLevel = parseInt(attribute.dataset.level || 0);
    

    // Armazenar dados do atributo
    attributeData.set(attribute, {
      levelElement,
      plusBtn,
      minusBtn,
      currentLevel,
      attribute
    });

    // Update display
    function updateDisplay() {
      if (levelElement) {
        levelElement.textContent = currentLevel;
      }
      attribute.dataset.level = currentLevel;

      // Update panel data-level and visual state
      const panel = attribute.querySelector(".attribute-panel");
      if (panel) {
        panel.setAttribute("data-level", currentLevel);

        // Update visual state based on level
        panel.style.opacity =
          currentLevel === 0
            ? "0.4"
            : currentLevel === 1
            ? "0.6"
            : currentLevel === 2
            ? "0.8"
            : "1";

        panel.style.filter =
          currentLevel === 0
            ? "drop-shadow(0 0 5px rgba(0,255,136,0.2))"
            : currentLevel === 1
            ? "drop-shadow(0 0 8px rgba(0,255,136,0.3))"
            : currentLevel === 2
            ? "drop-shadow(0 0 12px rgba(0,255,136,0.4))"
            : currentLevel === 3
            ? "drop-shadow(0 0 15px rgba(0,255,136,0.5))"
            : currentLevel === 4
            ? "drop-shadow(0 0 20px rgba(0,255,136,0.7))"
            : "drop-shadow(0 0 25px rgba(0,255,136,0.9))";
      }
    }

    // Plus button
    if (plusBtn) {
      const handlePlusClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (currentLevel < 20 && availablePoints > 0) {
          currentLevel++;
          availablePoints--;
          attributeData.get(attribute).currentLevel = currentLevel;
          updateDisplay();
          updateTotalLevel();
        } else {
        }
        return false;
      };
      
      const handlePlusMouseDown = (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      };
      
      // Remover listeners anteriores se existirem
      plusBtn.removeEventListener("click", handlePlusClick);
      plusBtn.removeEventListener("mousedown", handlePlusMouseDown);
      
      // Adicionar listeners com capture para garantir prioridade
      plusBtn.addEventListener("mousedown", handlePlusMouseDown, { capture: true });
      plusBtn.addEventListener("click", handlePlusClick, { capture: true });
      
      // Garantir que cliques na imagem também funcionem
      const plusImg = plusBtn.querySelector("img");
      if (plusImg) {
        plusImg.style.pointerEvents = "none";
        plusImg.style.cursor = "pointer";
      }
      plusBtn.style.pointerEvents = "auto";
      plusBtn.style.cursor = "pointer";
    }

    // Minus button
    if (minusBtn) {
      const handleMinusClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (currentLevel > 0) {
          currentLevel--;
          availablePoints++;
          attributeData.get(attribute).currentLevel = currentLevel;
          updateDisplay();
          updateTotalLevel();
        }
        return false;
      };
      
      const handleMinusMouseDown = (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      };
      
      // Remover listeners anteriores se existirem
      minusBtn.removeEventListener("click", handleMinusClick);
      minusBtn.removeEventListener("mousedown", handleMinusMouseDown);
      
      // Adicionar listeners com capture para garantir prioridade
      minusBtn.addEventListener("mousedown", handleMinusMouseDown, { capture: true });
      minusBtn.addEventListener("click", handleMinusClick, { capture: true });
      
      // Garantir que cliques na imagem também funcionem
      const minusImg = minusBtn.querySelector("img");
      if (minusImg) {
        minusImg.style.pointerEvents = "none";
        minusImg.style.cursor = "pointer";
      }
      minusBtn.style.pointerEvents = "auto";
      minusBtn.style.cursor = "pointer";
    }

    // Initialize display
    updateDisplay();
  });

  // Update total level display
  function updateTotalLevel() {
    const currentTotal = Array.from(skillAttributes).reduce(
      (sum, attr) => sum + parseInt(attr.dataset.level || 0),
      0
    );

    if (levelNumber) {
      levelNumber.textContent = currentTotal;
    }

    // Atualizar pontos disponíveis baseado no nível inicial
    availablePoints = Math.max(0, baseLevel - currentTotal);
  }

  // Initialize total level
  updateTotalLevel();
}
