// @ts-nocheck
/* eslint-disable */
// Portado de script.js (site original) para módulo TypeScript.
// Lógica e valores mantidos; só mudou a embalagem (módulos, estado partilhado).
import { engine } from "./state";
import { setupCyberpunkSkillTree } from "./skillTree";

function setupControlButtons() {

  // Aguardar mais tempo para garantir que todos os elementos estejam renderizados
  setTimeout(() => {

    // Toggle controls panel (Skill Tree)
    const toggleBtn = document.getElementById("toggle-controls");
    const controlsPanel = document.getElementById("skill-tree-controls");


    if (toggleBtn && controlsPanel) {

      // Remover event listeners existentes para evitar duplicação
      const newToggleBtn = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

      newToggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();


        const isVisible = controlsPanel.style.display !== "none";

        if (isVisible) {
          controlsPanel.style.display = "none";
          newToggleBtn.textContent = "CONTROLS";
        } else {
          controlsPanel.style.display = "block";
          newToggleBtn.textContent = "HIDE";

          // Configurar controles diretamente quando painel é aberto
          setTimeout(() => {
            setupSkillTreeControlsDirect();
          }, 100);
        }
      });

    } else {
      console.error("Elementos não encontrados:", {
        toggleBtn: !!toggleBtn,
        controlsPanel: !!controlsPanel,
      });
    }

    // Toggle engine.model controls panel
    const toggleModelBtn = document.getElementById("toggle-model-controls");
    const modelControlsPanel = document.getElementById("model-controls-panel");


    if (toggleModelBtn && modelControlsPanel) {

      // Remover event listeners existentes para evitar duplicação
      const newToggleModelBtn = toggleModelBtn.cloneNode(true);
      toggleModelBtn.parentNode.replaceChild(newToggleModelBtn, toggleModelBtn);

      newToggleModelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();


        const isVisible = modelControlsPanel.style.display !== "none";

        if (isVisible) {
          modelControlsPanel.style.display = "none";
          newToggleModelBtn.textContent = "🎮 MODELO 3D";
        } else {
          modelControlsPanel.style.display = "block";
          newToggleModelBtn.textContent = "🎮 OCULTAR";

          // Configurar controles diretamente quando painel é aberto
          setTimeout(() => {
            setupModelControlsDirect();
          }, 100);
        }
      });

    } else {
      console.error("Elementos do modelo não encontrados:", {
        toggleModelBtn: !!toggleModelBtn,
        modelControlsPanel: !!modelControlsPanel,
      });
    }

    // Tornar os painéis arrastáveis na tela
    function makePanelDraggable(panel) {
      if (!panel) return;
      panel.style.position = "fixed";

      // Converter right para left se necessário
      if (panel.style.right && !panel.style.left) {
        const rect = panel.getBoundingClientRect();
        panel.style.left = rect.left + "px";
        panel.style.right = "";
      }

      // posição inicial se ainda não houver uma
      if (!panel.style.left && !panel.style.right) {
        panel.style.left = "20px";
        panel.style.top = "20px";
      }

      const handle = panel.querySelector("h3") || panel; // preferir cabeçalho
      let dragging = false,
        ox = 0,
        oy = 0,
        startL = 0,
        startT = 0;
      handle.style.cursor = "move";
      handle.addEventListener("mousedown", (e) => {
        dragging = true;
        const rect = panel.getBoundingClientRect();
        ox = e.clientX;
        oy = e.clientY;
        startL = rect.left;
        startT = rect.top;
        e.preventDefault();
      });
      document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const dx = e.clientX - ox;
        const dy = e.clientY - oy;
        panel.style.left = startL + dx + "px";
        panel.style.top = startT + dy + "px";
      });
      document.addEventListener("mouseup", () => {
        dragging = false;
      });
    }
    makePanelDraggable(controlsPanel);
    makePanelDraggable(modelControlsPanel);
  }, 2000); // Aumentar timeout para 2 segundos
}

function setupSkillTreeControlsDirect() {

  const skillTree = document.querySelector(".cyberpunk-skill-tree");
  const globalScale = document.getElementById("global-scale");
  const svgScale = document.getElementById("svg-scale");
  const posX = document.getElementById("pos-x");
  const posY = document.getElementById("pos-y");
  const scaleValue = document.getElementById("scale-value");
  const svgScaleValue = document.getElementById("svg-scale-value");
  const posXValue = document.getElementById("pos-x-value");
  const posYValue = document.getElementById("pos-y-value");
  const resetBtn = document.getElementById("reset-positions");
  const captureBtn = document.getElementById("capture-positions");
  const copyBtn = document.getElementById("copy-values");
  const cssOutput = document.getElementById("css-output");


  if (!skillTree) {
    console.error("Skill tree não encontrada!");
    return;
  }

  let currentScale = 1;
  let currentSvgScale = 1;
  let currentPosX = 0;
  let currentPosY = 0;

  // Função para aplicar transformações
  function applyTransformations() {
    skillTree.style.transform = `scale(${currentScale}) translate(${currentPosX}px, ${currentPosY}px)`;

    // Aplicar escala aos painéis individuais
    const attributePanels = document.querySelectorAll(
      ".skill-attribute .attribute-panel"
    );
    attributePanels.forEach((panel) => {
      panel.style.transform = `scale(${currentSvgScale})`;
    });

    // Atualizar valores exibidos
    if (scaleValue) scaleValue.textContent = currentScale.toFixed(1);
    if (svgScaleValue) svgScaleValue.textContent = currentSvgScale.toFixed(1);
    if (posXValue) posXValue.textContent = currentPosX;
    if (posYValue) posYValue.textContent = currentPosY;

    // Atualizar CSS output
    updateCSSOutput();
  }

  // Função para atualizar output CSS
  function updateCSSOutput() {
    if (!cssOutput) return;

    let css = `/* SKILL TREE CONTROLS */
.cyberpunk-skill-tree {
  transform: scale(${currentScale}) translate(${currentPosX}px, ${currentPosY}px);
}

/* Escala dos painéis individuais */
.skill-attribute .attribute-panel {
  transform: scale(${currentSvgScale});
}`;

    // Capturar posições individuais dos atributos
    const skillAttributes = document.querySelectorAll(".skill-attribute");
    skillAttributes.forEach((attribute) => {
      const attributeName = attribute.getAttribute("data-attribute");
      const rect = attribute.getBoundingClientRect();
      const skillTreeRect = skillTree.getBoundingClientRect();

      // Calcular posição relativa à skill tree
      const relativeLeft = rect.left - skillTreeRect.left;
      const relativeTop = rect.top - skillTreeRect.top;

      // Converter para porcentagem
      const leftPercent = (relativeLeft / skillTreeRect.width) * 100;
      const topPercent = (relativeTop / skillTreeRect.height) * 100;

      // Verificar se foi movido (comparar com posição original)
      const isMoved = attribute.style.left || attribute.style.top;

      if (isMoved) {
        css += `

/* Posição customizada do ${attributeName.toUpperCase()} */
.skill-attribute[data-attribute="${attributeName}"] {
  left: ${leftPercent.toFixed(1)}% !important;
  top: ${topPercent.toFixed(1)}% !important;
  transform: translateY(-50%) !important;
}`;
      }
    });

    css += `

/* Valores atuais:
   - Scale Global: ${currentScale}
   - Scale SVGs: ${currentSvgScale}
   - Posição X: ${currentPosX}px
   - Posição Y: ${currentPosY}px
*/`;

    cssOutput.value = css;
  }

  // Remover event listeners existentes para evitar duplicação
  if (globalScale) {
    globalScale.removeEventListener("input", globalScale._skillTreeHandler);
    globalScale._skillTreeHandler = (e) => {
      currentScale = parseFloat(e.target.value);
      applyTransformations();
    };
    globalScale.addEventListener("input", globalScale._skillTreeHandler);
  }

  if (svgScale) {
    svgScale.removeEventListener("input", svgScale._skillTreeHandler);
    svgScale._skillTreeHandler = (e) => {
      currentSvgScale = parseFloat(e.target.value);
      applyTransformations();
    };
    svgScale.addEventListener("input", svgScale._skillTreeHandler);
  }

  if (posX) {
    posX.removeEventListener("input", posX._skillTreeHandler);
    posX._skillTreeHandler = (e) => {
      currentPosX = parseInt(e.target.value);
      applyTransformations();
    };
    posX.addEventListener("input", posX._skillTreeHandler);
  }

  if (posY) {
    posY.removeEventListener("input", posY._skillTreeHandler);
    posY._skillTreeHandler = (e) => {
      currentPosY = parseInt(e.target.value);
      applyTransformations();
    };
    posY.addEventListener("input", posY._skillTreeHandler);
  }

  if (resetBtn) {
    resetBtn.removeEventListener("click", resetBtn._skillTreeHandler);
    resetBtn._skillTreeHandler = () => {
      currentScale = 1;
      currentSvgScale = 1;
      currentPosX = 0;
      currentPosY = 0;

      if (globalScale) globalScale.value = 1;
      if (svgScale) svgScale.value = 1;
      if (posX) posX.value = 0;
      if (posY) posY.value = 0;

      // Resetar posições dos painéis individuais
      const skillAttributes = document.querySelectorAll(".skill-attribute");
      skillAttributes.forEach((attribute) => {
        attribute.style.left = "";
        attribute.style.top = "";
        attribute.style.transform = "";
      });

      applyTransformations();
    };
    resetBtn.addEventListener("click", resetBtn._skillTreeHandler);
  }

  // Capturar posições atuais
  if (captureBtn) {
    captureBtn.removeEventListener("click", captureBtn._skillTreeHandler);
    captureBtn._skillTreeHandler = () => {
      updateCSSOutput();
      captureBtn.textContent = "CAPTURED!";
      setTimeout(() => {
        captureBtn.textContent = "CAPTURE POS";
      }, 2000);
    };
    captureBtn.addEventListener("click", captureBtn._skillTreeHandler);
  }

  // Copiar valores CSS
  if (copyBtn && cssOutput) {
    copyBtn.removeEventListener("click", copyBtn._skillTreeHandler);
    copyBtn._skillTreeHandler = async () => {
      try {
        await navigator.clipboard.writeText(cssOutput.value);
        copyBtn.textContent = "COPIED!";
        setTimeout(() => {
          copyBtn.textContent = "COPY VALUES";
        }, 2000);
      } catch (err) {
        // Fallback para navegadores mais antigos
        cssOutput.select();
        document.execCommand("copy");
        copyBtn.textContent = "COPIED!";
        setTimeout(() => {
          copyBtn.textContent = "COPY VALUES";
        }, 2000);
      }
    };
    copyBtn.addEventListener("click", copyBtn._skillTreeHandler);
  }

  // Drag & drop de painéis individuais (direto)
  try {
    const skillTreeRect = document
      .querySelector(".cyberpunk-skill-tree")
      ?.getBoundingClientRect();
    const attributes = document.querySelectorAll(".skill-attribute");
    attributes.forEach((attribute) => {
      let dragging = false;
      let sx = 0,
        sy = 0,
        startL = 0,
        startT = 0;
      const handleDown = (e) => {
        // Não iniciar drag se clicou em botões ou elementos dentro de botões
        // Layout fixo (build planner): os nós não são arrastáveis
        if (attribute.closest(".skill-tree-board")) return;
        const clickedButton = e.target.closest(".attr-btn");
        if (clickedButton) {
          e.stopPropagation();
          return;
        }
        dragging = true;
        const stRect = document
          .querySelector(".cyberpunk-skill-tree")
          .getBoundingClientRect();
        const rect = attribute.getBoundingClientRect();
        sx = e.clientX;
        sy = e.clientY;
        startL = rect.left - stRect.left;
        startT = rect.top - stRect.top;
        attribute.classList.add("dragging");
        e.preventDefault();
      };
      const handleMove = (e) => {
        if (!dragging) return;
        const stRect = document
          .querySelector(".cyberpunk-skill-tree")
          .getBoundingClientRect();
        const dx = e.clientX - sx;
        const dy = e.clientY - sy;
        let left = startL + dx;
        let top = startT + dy;
        // clamp within container
        const w = attribute.offsetWidth;
        const h = attribute.offsetHeight;
        left = Math.max(0, Math.min(left, stRect.width - w));
        top = Math.max(0, Math.min(top, stRect.height - h));
        attribute.style.left = `${left}px`;
        attribute.style.top = `${top}px`;
        attribute.style.transform = "none";
      };
      const handleUp = () => {
        if (dragging) {
          dragging = false;
          attribute.classList.remove("dragging");
        }
      };
      attribute.addEventListener("mousedown", handleDown);
      attribute
        .querySelector(".attribute-panel")
        ?.addEventListener("mousedown", handleDown);
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    });
  } catch (_) {}

  // Aplicar transformações iniciais
  applyTransformations();

}

export function setupModelControlsDirect() {

  const modelPosX = document.getElementById("model-pos-x");
  const modelPosY = document.getElementById("model-pos-y");
  const modelPosZ = document.getElementById("model-pos-z");
  const modelScale = document.getElementById("model-scale");
  const modelRotX = document.getElementById("model-rot-x");
  const modelRotY = document.getElementById("model-rot-y");
  const modelRotZ = document.getElementById("model-rot-z");
  const modelResetBtn = document.getElementById("model-reset-positions");

  // Spans de valor
  const modelPosXValue = document.getElementById("model-pos-x-value");
  const modelPosYValue = document.getElementById("model-pos-y-value");
  const modelPosZValue = document.getElementById("model-pos-z-value");
  const modelScaleValue = document.getElementById("model-scale-value");
  const modelRotXValue = document.getElementById("model-rot-x-value");
  const modelRotYValue = document.getElementById("model-rot-y-value");
  const modelRotZValue = document.getElementById("model-rot-z-value");


  // Position X
  if (modelPosX && modelPosXValue) {
    modelPosX.removeEventListener("input", modelPosX._modelHandler);
    modelPosX._modelHandler = (e) => {
      const value = parseFloat(e.target.value);
      modelPosXValue.textContent = value.toFixed(1);
      const targets = window.__modelTargets || {};
      if (targets.targetPosition) targets.targetPosition.x = value;
    };
    modelPosX.addEventListener("input", modelPosX._modelHandler);
  }

  // Position Y
  if (modelPosY && modelPosYValue) {
    modelPosY.removeEventListener("input", modelPosY._modelHandler);
    modelPosY._modelHandler = (e) => {
      const value = parseFloat(e.target.value);
      modelPosYValue.textContent = value.toFixed(1);
      const targets = window.__modelTargets || {};
      if (targets.targetPosition) targets.targetPosition.y = value;
    };
    modelPosY.addEventListener("input", modelPosY._modelHandler);
  }

  // Position Z
  if (modelPosZ && modelPosZValue) {
    modelPosZ.removeEventListener("input", modelPosZ._modelHandler);
    modelPosZ._modelHandler = (e) => {
      const value = parseFloat(e.target.value);
      modelPosZValue.textContent = value.toFixed(1);
      const targets = window.__modelTargets || {};
      if (targets.targetPosition) targets.targetPosition.z = value;
    };
    modelPosZ.addEventListener("input", modelPosZ._modelHandler);
  }

  // Scale
  if (modelScale && modelScaleValue) {
    modelScale.removeEventListener("input", modelScale._modelHandler);
    modelScale._modelHandler = (e) => {
      const value = parseFloat(e.target.value);
      modelScaleValue.textContent = value.toFixed(1);
      if (
        typeof engine.model !== "undefined" &&
        typeof engine.modelLoaded !== "undefined" &&
        engine.modelLoaded &&
        engine.model
      ) {
        engine.model.scale.set(value, value, value);
      }
    };
    modelScale.addEventListener("input", modelScale._modelHandler);
  }

  // Rotation X
  if (modelRotX && modelRotXValue) {
    modelRotX.removeEventListener("input", modelRotX._modelHandler);
    modelRotX._modelHandler = (e) => {
      const value = parseFloat(e.target.value);
      modelRotXValue.textContent = value.toFixed(2);
      const targets = window.__modelTargets || {};
      if (targets.targetRotation) targets.targetRotation.x = value;
    };
    modelRotX.addEventListener("input", modelRotX._modelHandler);
  }

  // Rotation Y
  if (modelRotY && modelRotYValue) {
    modelRotY.removeEventListener("input", modelRotY._modelHandler);
    modelRotY._modelHandler = (e) => {
      const value = parseFloat(e.target.value);
      modelRotYValue.textContent = value.toFixed(2);
      const targets = window.__modelTargets || {};
      if (targets.targetRotation) targets.targetRotation.y = value;
    };
    modelRotY.addEventListener("input", modelRotY._modelHandler);
  }

  // Rotation Z
  if (modelRotZ && modelRotZValue) {
    modelRotZ.removeEventListener("input", modelRotZ._modelHandler);
    modelRotZ._modelHandler = (e) => {
      const value = parseFloat(e.target.value);
      modelRotZValue.textContent = value.toFixed(2);
      const targets = window.__modelTargets || {};
      if (targets.targetRotation) targets.targetRotation.z = value;
    };
    modelRotZ.addEventListener("input", modelRotZ._modelHandler);
  }

  // Reset button
  if (modelResetBtn) {
    modelResetBtn.removeEventListener("click", modelResetBtn._modelHandler);
    modelResetBtn._modelHandler = () => {

      const initialPos = { x: 3.2, y: -11.3, z: -8.4 };
      const initialRot = { x: 0.3, y: 0.6, z: 0.0 };
      const initialScale = 1.0;

      if (modelPosX) modelPosX.value = initialPos.x;
      if (modelPosY) modelPosY.value = initialPos.y;
      if (modelPosZ) modelPosZ.value = initialPos.z;
      if (modelScale) modelScale.value = initialScale;
      if (modelRotX) modelRotX.value = initialRot.x;
      if (modelRotY) modelRotY.value = initialRot.y;
      if (modelRotZ) modelRotZ.value = initialRot.z;

      if (modelPosXValue) modelPosXValue.textContent = initialPos.x.toFixed(1);
      if (modelPosYValue) modelPosYValue.textContent = initialPos.y.toFixed(1);
      if (modelPosZValue) modelPosZValue.textContent = initialPos.z.toFixed(1);
      if (modelScaleValue)
        modelScaleValue.textContent = initialScale.toFixed(1);
      if (modelRotXValue) modelRotXValue.textContent = initialRot.x.toFixed(2);
      if (modelRotYValue) modelRotYValue.textContent = initialRot.y.toFixed(2);
      if (modelRotZValue) modelRotZValue.textContent = initialRot.z.toFixed(2);

      const targets = window.__modelTargets || {};
      if (targets.targetPosition) {
        targets.targetPosition.x = initialPos.x;
        targets.targetPosition.y = initialPos.y;
        targets.targetPosition.z = initialPos.z;
      }
      if (targets.targetRotation) {
        targets.targetRotation.x = initialRot.x;
        targets.targetRotation.y = initialRot.y;
        targets.targetRotation.z = initialRot.z;
      }
      if (
        typeof engine.model !== "undefined" &&
        typeof engine.modelLoaded !== "undefined" &&
        engine.modelLoaded &&
        engine.model
      ) {
        engine.model.scale.set(initialScale, initialScale, initialScale);
      }
    };
    modelResetBtn.addEventListener("click", modelResetBtn._modelHandler);
  }

  // Capture and copy values
  const modelCaptureBtn = document.getElementById("model-capture-values");
  const modelCopyBtn = document.getElementById("model-copy-values");
  const modelOutput = document.getElementById("model-values-output");

  function getModelValuesString() {
    const hasModel =
      typeof engine.model !== "undefined" &&
      engine.model &&
      typeof engine.modelLoaded !== "undefined" &&
      engine.modelLoaded;
    const targets = window.__modelTargets || {};
    const pos = hasModel
      ? engine.model.position
      : targets.targetPosition || { x: 3.2, y: -11.3, z: -8.4 };
    const rot = hasModel
      ? engine.model.rotation
      : targets.targetRotation || { x: 0.3, y: 0.6, z: 0.0 };
    const scl = hasModel ? engine.model.scale : { x: 1, y: 1, z: 1 };
    const cam =
      typeof engine.modelCamera !== "undefined" && engine.modelCamera
        ? engine.modelCamera.position
        : { x: 0, y: 0, z: 0 };
    let canvasRect = { x: 0, y: 0, width: 0, height: 0 };
    try {
      const rect =
        engine.modelRenderer && engine.modelRenderer.domElement
          ? engine.modelRenderer.domElement.getBoundingClientRect()
          : null;
      if (rect)
        canvasRect = {
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
    } catch (_) {}

    // Obter posição da página (scroll)
    const pageScrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop;
    const pageScrollX =
      window.scrollX ||
      window.pageXOffset ||
      document.documentElement.scrollLeft;

    return `// 3D MODEL VALUES
position: { x: ${pos.x.toFixed(1)}, y: ${pos.y.toFixed(1)}, z: ${pos.z.toFixed(
      1
    )} }
rotation(rad): { x: ${rot.x.toFixed(2)}, y: ${rot.y.toFixed(
      2
    )}, z: ${rot.z.toFixed(2)} }
scale: { x: ${(+scl.x).toFixed(2)}, y: ${(+scl.y).toFixed(
      2
    )}, z: ${(+scl.z).toFixed(2)} }
camera: { x: ${cam.x.toFixed(2)}, y: ${cam.y.toFixed(2)}, z: ${cam.z.toFixed(
      2
    )} }
canvasViewport: { x: ${canvasRect.x}, y: ${canvasRect.y}, width: ${
      canvasRect.width
    }, height: ${canvasRect.height} }
pagePosition: { scrollX: ${pageScrollX}, scrollY: ${pageScrollY} }
objectRelativeToPage: { 
  canvasPageX: ${canvasRect.x + pageScrollX}, 
  canvasPageY: ${canvasRect.y + pageScrollY},
  canvasPageWidth: ${canvasRect.width},
  canvasPageHeight: ${canvasRect.height}
}`;
  }

  if (modelCaptureBtn && modelOutput) {
    modelCaptureBtn.removeEventListener("click", modelCaptureBtn._modelHandler);
    modelCaptureBtn._modelHandler = () => {
      modelOutput.value = getModelValuesString();
      modelCaptureBtn.textContent = "CAPTURED!";
      setTimeout(() => {
        modelCaptureBtn.textContent = "CAPTURE POS";
      }, 2000);
    };
    modelCaptureBtn.addEventListener("click", modelCaptureBtn._modelHandler);
  }

  if (modelCopyBtn && modelOutput) {
    modelCopyBtn.removeEventListener("click", modelCopyBtn._modelHandler);
    modelCopyBtn._modelHandler = async () => {
      if (!modelOutput.value) modelOutput.value = getModelValuesString();
      try {
        await navigator.clipboard.writeText(modelOutput.value);
      } catch (_) {
        modelOutput.select();
        document.execCommand("copy");
      }
      modelCopyBtn.textContent = "COPIED!";
      setTimeout(() => {
        modelCopyBtn.textContent = "COPY VALUES";
      }, 2000);
    };
    modelCopyBtn.addEventListener("click", modelCopyBtn._modelHandler);
  }

}

export function ensureControlsBound() {
  // O DOMContentLoaded deste arquivo nunca dispara (ele é injetado depois),
  // então a lógica dos botões +/− da skill tree é ligada aqui, uma vez só.
  try {
    if (!window.__skillTreeBound) {
      window.__skillTreeBound = true;
      setupCyberpunkSkillTree();
    }
  } catch (err) {
    console.warn("Falha ao configurar a skill tree (safe):", err);
  }
  try {
    setupSkillTreeControlsDirect();
  } catch (err) {
    console.warn("Falha ao configurar controles da skill tree (safe):", err);
  }
  try {
    setupModelControlsDirect();
  } catch (err) {
    console.warn("Falha ao configurar controles do modelo 3D (safe):", err);
  }
  try {
    // Garantir toggle dos painéis
    setupControlButtons();
  } catch (err) {
    console.warn("Falha ao configurar botões de toggle (safe):", err);
  }
}
