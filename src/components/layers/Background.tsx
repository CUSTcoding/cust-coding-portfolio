import { memo } from "react";

/** Camadas fixas do fundo: canvases, grid, rail de progresso e contentor do modelo 3D. */
function BackgroundBase() {
  return (
    <>
      <canvas id="hero-canvas" aria-hidden="true"></canvas>
      <canvas id="fx-canvas" aria-hidden="true"></canvas>
      <div className="grid-overlay"></div>
      {/* O rail é montado pelo motor (efeitos.ts), por isso o React não gere os filhos */}
      <div
        className="progress"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: '<div class="bar"></div>' }}
      />
      {/* 3D Model Container */}
      <div className="model-container">
        <div className="model-wrapper" id="model-wrapper"></div>
      </div>
    </>
  );
}

export const Background = memo(BackgroundBase);
