class TextField extends HTMLElement {
  static get observedAttributes() {
    return ["value", "placeholder", "maxlength", "minlength"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.input = document.createElement("input");
    this.input.type = "text";
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
    return this.input.value || "";
  }

  set value(v) {
    if (v === null || v === undefined) {
      this.input.value = "";
      this.removeAttribute("value");
    } else {
      this.input.value = v;
      this.setAttribute("value", v);
    }
  }

  #onInput() {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
}

customElements.define("text-field", TextField);
