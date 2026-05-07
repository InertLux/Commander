import "/WebComponents/Main/CommanderTerminal.js";

class SimulationLayer extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });

    // --- STYLE ---
    const style = document.createElement("style");
    style.textContent = `
      :host {
        position: relative;
        display: grid;
        grid-template-columns: 600px 280px 1fr; /* <-- MATCH TERMINAL WIDTH */
        width: 100%;
        height: 100%;
        background: #000;
        color: #33ff33;
        font-family: "Courier New", monospace;
      }

      .terminal-panel {
        border-right: 1px solid #229922;
        padding: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        align-items: center;   /* center terminal horizontally */
        justify-content: start;
      }

      .middle-panel {
        border-right: 1px solid #229922;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .label {
        font-size: 11px;
        opacity: 0.8;
        margin-bottom: 4px;
      }

      .env-block, .status-block {
        border: 1px solid #229922;
        padding: 8px;
        font-size: 12px;
      }

      .status-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      }

      .right-panel {
        position: relative;
        width: 100%;
        height: 100%;
      }

      #holoCanvas {
        width: 100%;
        height: 100%;
        background: #001100;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        color: #33ff33;
        text-shadow: 0 0 8px #33ff33;
      }

      .scene-label {
        position: absolute;
        top: 12px;
        left: 12px;
        opacity: 0.8;
      }
    `;

    // --- ROOT WRAPPER ---
    const wrapper = document.createElement("div");
    wrapper.style.display = "contents";

    // --- LEFT PANEL (TERMINAL ONLY) ---
    const terminalPanel = document.createElement("div");
    terminalPanel.className = "terminal-panel";

    const terminal = document.createElement("idm-terminal");
    terminalPanel.append(terminal);

    // --- MIDDLE PANEL (ENV + STATUS) ---
    const middlePanel = document.createElement("div");
    middlePanel.className = "middle-panel";

    const envLabel = document.createElement("div");
    envLabel.className = "label";
    envLabel.textContent = "ENVIRONMENT";

    this.envBlock = document.createElement("div");
    this.envBlock.className = "env-block";

    const envContainer = document.createElement("div");
    envContainer.append(envLabel, this.envBlock);

    const statusBlock = document.createElement("div");
    statusBlock.className = "status-block";

    statusBlock.innerHTML = `
      <div class="status-row"><span>DATA</span><span id="statusData">--</span></div>
      <div class="status-row"><span>TERMINAL</span><span>idm-terminal</span></div>
      <div class="status-row"><span>SCENE</span><span id="statusScene">NONE</span></div>
    `;

    this.statusData = statusBlock.querySelector("#statusData");
    this.statusScene = statusBlock.querySelector("#statusScene");

    middlePanel.append(envContainer, statusBlock);

    // --- RIGHT PANEL (SCENE VIEW) ---
    const rightPanel = document.createElement("div");
    rightPanel.className = "right-panel";

    this.canvas = document.createElement("div");
    this.canvas.id = "holoCanvas";
    this.canvas.textContent = "NO SCENE";

    this.sceneLabel = document.createElement("div");
    this.sceneLabel.className = "scene-label";
    this.sceneLabel.textContent = "SCENE: NONE";

    rightPanel.append(this.canvas, this.sceneLabel);

    // --- APPEND ALL ---
    wrapper.append(terminalPanel, middlePanel, rightPanel);
    root.append(style, wrapper);

    this.sceneMap = {
      meadow: "🌿 MEADOW",
      combat: "⚔️ COMBAT",
      dungeon: "🏰 DUNGEON"
    };
  }

  connectedCallback() {
    this.setScene(this.getAttribute("scene") || "meadow");
  }

  static get observedAttributes() {
    return ["scene"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "scene" && newVal !== oldVal) {
      this._loadScene(newVal);
    }
  }

  setEnvironmentData(env = {}) {
    this.envBlock.innerHTML = Object.entries(env)
      .map(([k, v]) => `<div><span>${k.toUpperCase()}</span> <span>${v}</span></div>`)
      .join("");

    this.statusData.textContent = env.mode || "--";
  }

  setScene(name) {
    this.setAttribute("scene", name);
  }

  _loadScene(name) {
    this.canvas.textContent = this.sceneMap[name] || "NO SCENE";
    this.sceneLabel.textContent = `SCENE: ${name.toUpperCase()}`;
    this.statusScene.textContent = name.toUpperCase();

    this.dispatchEvent(new CustomEvent("scene-change", {
      detail: { scene: name },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define("simulation-layer", SimulationLayer);
