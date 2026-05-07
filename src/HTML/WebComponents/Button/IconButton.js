class IconButton extends HTMLElement {
  static get observedAttributes() {
    return ["icon"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
  }

  attributeChangedCallback() {
    this.render();
  }

  get iconPath() {
    const icon = this.getAttribute("icon") || "";
    return `/game-icons-net/${icon}`;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import "/AppStyle/AppStyle.css";

        :host {
          display: inline-flex;
          align-items: center;
        }

        button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 10px;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          background: white;
          border: 1px solid rgba(0,0,0,0.15);
          transition: background 0.2s ease, transform 0.15s ease;
        }

        button:hover {
          background: #f2f2f2;
        }

        /* subtle hover animation */
        button:hover .icon {
          transform: scale(1.08);
        }

        .icon {
          width: 32px;
          height: 32px;
          transition: transform 0.15s ease;
        }

        .icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
      </style>

      <button part="button">
        <div class="icon">
          <img src="${this.iconPath}" alt="">
        </div>
        <slot></slot>
      </button>
    `;
  }

  attachEvents() {
    const button = this.shadowRoot.querySelector("button");

    button.addEventListener("click", (e) => {
      this.dispatchEvent(new CustomEvent("icon-click", { detail: e }));
    });

    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        button.click();
      }
    });
  }
}

customElements.define("icon-button", IconButton);
