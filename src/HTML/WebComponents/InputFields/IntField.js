class IntField extends HTMLElement {
  static get observedAttributes() {
    return ["value", "min", "max", "step", "placeholder"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.input = document.createElement("input");
    this.input.type = "number";
    this.input.inputMode = "numeric";
    this.input.step = "1"; // ensures integer stepping
    this.input.part = "input";

    // No CSS here — styling comes from your global stylesheet
    this.shadowRoot.append(this.input);

    this.input.addEventListener("input", () => this.#onInput());
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;

    if (newVal === null) {
      this.input.removeAttribute(name);
    } else {
      this.input.setAttribute(name, newVal);
    }
  }

  get value() {
    const v = parseInt(this.input.value, 10);
    return Number.isNaN(v) ? null : v;
  }

  set value(v) {
    if (v === null || v === undefined || v === "") {
      this.input.value = "";
      this.removeAttribute("value");
    } else {
      this.input.value = v;
      this.setAttribute("value", v);
    }
  }

  #onInput() {
    const intValue = this.value;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: intValue },
        bubbles: true,
        composed: true
      })
    );
  }
}

customElements.define("int-field", IntField);
