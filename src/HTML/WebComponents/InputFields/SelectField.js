class SelectField extends HTMLElement {
  static get observedAttributes() {
    return ["value", "placeholder"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.select = document.createElement("select");
    this.select.part = "select";

    this.shadowRoot.append(this.select);

    this._options = [];
    this._display = {};
  }

  connectedCallback() {
    this.#upgradeProperty("value");
    this.#upgradeProperty("options");
    this.#upgradeProperty("display");
    this.#render();
    this.select.addEventListener("change", () => this.#onChange());
  }

  #upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.#render();
    }
  }

  // -----------------------------
  // OPTIONS PROPERTY
  // -----------------------------
  get options() {
    return this._options;
  }

  set options(arr) {
    if (Array.isArray(arr)) {
      this._options = arr;
      this.#render();
    }
  }

  // -----------------------------
  // DISPLAY PROPERTY
  // -----------------------------
  get display() {
    return this._display;
  }

  set display(obj) {
    if (typeof obj === "object" && obj !== null) {
      this._display = obj;
      this.#render();
    }
  }

  // -----------------------------
  // VALUE PROPERTY
  // -----------------------------
  get value() {
    return this.select.value || "";
  }

  set value(v) {
    if (v === null || v === undefined) {
      this.removeAttribute("value");
      this.select.value = "";
    } else {
      this.setAttribute("value", v);
      this.select.value = v;
    }
  }

  // -----------------------------
  // RENDER OPTIONS
  // -----------------------------
  #render() {
    if (!this.select) return;

    this.select.innerHTML = "";

    // Determine placeholder
    const placeholder =
      this._display.placeholder ??
      this.getAttribute("placeholder") ??
      null;

    if (placeholder) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = placeholder;
      opt.disabled = true;
      opt.selected = !this.hasAttribute("value");
      this.select.appendChild(opt);
    }

    // Render options
    for (const item of this._options) {
      const key = String(item);
      const opt = document.createElement("option");

      opt.value = key;
      opt.textContent = key;

      // Apply display params if present
      const cfg = this._display[key];
      if (cfg) {
        for (const [prop, val] of Object.entries(cfg)) {
          opt.style.setProperty(prop, val);
        }
      }

      this.select.appendChild(opt);
    }

    // Sync selected value
    if (this.hasAttribute("value")) {
      this.select.value = this.getAttribute("value");
    }
  }

  // -----------------------------
  // CHANGE EVENT
  // -----------------------------
  #onChange() {
    this.setAttribute("value", this.select.value);

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
}

customElements.define("select-field", SelectField);
