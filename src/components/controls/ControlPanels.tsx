import { memo, type CSSProperties } from "react";
import { texts } from "@/config/texts";

const hint: CSSProperties = { fontSize: 10, margin: "5px 0", color: "#00ffff" };
const output = (height: number): CSSProperties => ({
  width: "100%",
  height,
  background: "rgba(0, 0, 0, 0.5)",
  border: "1px solid #00ffff",
  color: "#ffffff",
  fontFamily: "'VT323', monospace",
  fontSize: 10,
  padding: 5,
});

function Range({
  id, label, min, max, step, value, valueId, valueText, labelFor = true,
}: {
  id: string; label: string; min: string; max: string; step: string; value: string;
  valueId: string; valueText: string; labelFor?: boolean;
}) {
  return (
    <div className="control-group">
      <label htmlFor={labelFor ? id : undefined}>{label}</label>
      <input type="range" id={id} name={id} min={min} max={max} step={step} defaultValue={value} />
      <span id={valueId}>{valueText}</span>
    </div>
  );
}

function ModelRange({ id, label, min, max, step, value, text }: {
  id: string; label: string; min: string; max: string; step: string; value: string; text: string;
}) {
  return (
    <div className="control-group">
      <label>
        {label} <span id={`${id}-value`}>{text}</span>
      </label>
      <input type="range" id={id} min={min} max={max} step={step} defaultValue={value} />
    </div>
  );
}

/** Painéis "SKILL TREE CONTROLS" e "MODELO 3D CONTROLS" (ocultos até o botão em Tweaks visuais). */
function ControlPanelsBase() {
  const { controls } = texts;
  return (
    <>
      {/* Painel de Controles da Skill Tree */}
      <div className="skill-tree-controls" id="skill-tree-controls" style={{ display: "none" }}>
        <h3 className="cyberpunk">{controls.skillTree.title}</h3>
        <p style={hint}>{controls.skillTree.instructions}</p>

        <Range id="global-scale" label="Scale Global:" min="0.5" max="2" step="0.1" value="1" valueId="scale-value" valueText="1.0" />
        <Range id="svg-scale" label="Tamanho SVGs:" min="0.5" max="3" step="0.1" value="1" valueId="svg-scale-value" valueText="1.0" />
        <Range id="pos-x" label="Posição X:" min="-50" max="50" step="1" value="0" valueId="pos-x-value" valueText="0" />
        <Range id="pos-y" label="Posição Y:" min="-50" max="50" step="1" value="0" valueId="pos-y-value" valueText="0" />

        <div className="control-buttons">
          <button className="control-btn" id="reset-positions">RESET</button>
          <button className="control-btn" id="capture-positions">CAPTURE POS</button>
          <button className="control-btn copy-btn" id="copy-values">COPY VALUES</button>
        </div>

        <div className="control-group">
          <label>Valores CSS:</label>
          <textarea id="css-output" readOnly style={output(80)} />
        </div>
      </div>

      {/* Painel de Controles do Modelo 3D */}
      <div className="model-controls-panel" id="model-controls-panel" style={{ display: "none" }}>
        <h3 className="cyberpunk">{controls.model3D.title}</h3>
        <p style={hint}>{controls.model3D.instructions}</p>

        <ModelRange id="model-pos-x" label="Position X:" min="-50" max="50" step="0.1" value="0" text="0" />
        <ModelRange id="model-pos-y" label="Position Y:" min="-50" max="50" step="0.1" value="-11.3" text="-11.3" />
        <ModelRange id="model-pos-z" label="Position Z:" min="-50" max="50" step="0.1" value="-8.4" text="-8.4" />
        <ModelRange id="model-scale" label="Scale:" min="0.1" max="2" step="0.1" value="1.0" text="1.0" />
        <ModelRange id="model-rot-x" label="Rotation X:" min="0" max="6.28" step="0.01" value="0.30" text="0.30" />
        <ModelRange id="model-rot-y" label="Rotation Y:" min="0" max="6.28" step="0.01" value="0.60" text="0.60" />
        <ModelRange id="model-rot-z" label="Rotation Z:" min="0" max="6.28" step="0.01" value="0.00" text="0.00" />
        <div className="control-buttons">
          <button className="control-btn" id="model-reset-positions">RESET</button>
        </div>

        <div className="control-buttons">
          <button className="control-btn" id="model-capture-values">CAPTURE POS</button>
          <button className="control-btn copy-btn" id="model-copy-values">COPY VALUES</button>
        </div>
        <div className="control-group">
          <label>Valores do Modelo:</label>
          <textarea id="model-values-output" readOnly style={output(90)} />
        </div>
      </div>
    </>
  );
}

export const ControlPanels = memo(ControlPanelsBase);
