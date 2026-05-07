class HoloButton extends HTMLElement {
  static get observedAttributes() {
    return ["icon", "size", "icon-color", "url", "target"];
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
    console.log(`/game-icons-net/${icon}`);
    return `/game-icons-net/${icon}`;
  }

  get size() {
    return this.getAttribute("size") || "24";
  }

  get iconColor() {
    return this.getAttribute("icon-color") || "currentColor";
  }

  get url() {
    return this.getAttribute("url");
  }

  get target() {
    return this.getAttribute("target") || "_self";
  }

  render() {
    // ... (styles remain the same)
    this.shadowRoot.innerHTML = `
      <style>
        @import "/AppStyle/AppStyle.css";

        :host {
          display: inline-flex;
          align-items: center;

          --holo-color: ${this.iconColor};
          --icon-brightness: 0.35; /* DIM default */
        }

        /* Scanline drift animation */
        @keyframes scanline-drift {
          0% {
            mask-position: center 0px, 0 0;
            -webkit-mask-position: center 0px, 0 0;
          }
          100% {
            mask-position: center 200%, 0 200%;
            -webkit-mask-position: center 200%, 0 200%;
          }
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
          background: transparent;
          position: relative;
          overflow: visible;
          transition: transform 0.2s ease;
        }

        button:hover {
          background: rgba(0,0,0,0.08);
          --icon-brightness: 1; /* FULL BRIGHTNESS on hover */
        }

        button::before {
          content: "";
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, var(--holo-color), transparent 70%);
          filter: blur(12px);
          opacity: 0.05;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        button::after {
          content: "";
          position: absolute;
          inset: -14px;
          background: radial-gradient(circle, var(--holo-color), transparent 75%);
          filter: blur(18px);
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 0.25s ease, transform 0.25s ease;
          pointer-events: none;
        }

        button:hover::after {
          opacity: 0.12;
          transform: scale(1.05);
        }

        button:hover::before {
          opacity: 0.06;
        }

        .icon {
          width: ${this.size}px;
          height: ${this.size}px;
          background-color: ${this.iconColor};

          /* brightness animation */
          filter:
            brightness(var(--icon-brightness))
            drop-shadow(0 0 6px var(--holo-color))
            drop-shadow(0 0 12px var(--holo-color));
          transition: filter 0.35s ease, transform 0.2s ease;

          /* Base SVG mask */
          mask-image:
            url(${this.iconPath}),
            repeating-linear-gradient(
              to bottom,
              rgba(0,0,0,1) 0px,
              rgba(0,0,0,1) ${this.size * 0.02}px,
              rgba(0,0,0,0.92) ${this.size * 0.04}px,
              rgba(0,0,0,0.92) ${this.size * 0.06}px
            );

          mask-size:
            contain,
            100% 200%;

          mask-repeat:
            no-repeat,
            repeat;

          mask-position:
            center 0px,
            0 0;

          mask-composite: intersect;

          /* WebKit mask */
          -webkit-mask-image:
            url(${this.iconPath}),
            repeating-linear-gradient(
              to bottom,
              rgba(0,0,0,1) 0px,
              rgba(0,0,0,1) ${this.size * 0.02}px,
              rgba(0,0,0,0.92) ${this.size * 0.04}px,
              rgba(0,0,0,0.92) ${this.size * 0.06}px
            );

          -webkit-mask-size:
            contain,
            100% 200%;

          -webkit-mask-repeat:
            no-repeat,
            repeat;

          -webkit-mask-position:
            center 0px,
            0 0;

          -webkit-mask-composite: source-in;

          /* Animate scanlines */
          animation: scanline-drift 20s linear infinite;
          -webkit-animation: scanline-drift 20s linear infinite;
        }

        button:hover .icon {
          transform: translateY(-2px) scale(1.05);
        }
      </style>

      <button part="button">
        <div class="icon"></div>
        <slot></slot>
      </button>
    `;
  }

  attachEvents() {
    const button = this.shadowRoot.querySelector("button");

    button.addEventListener("click", (e) => {
      // Only navigate if url is explicitly set
      if (this.url) {
        window.open(this.url, this.target);
      }
      // Always dispatch event for script binding
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

customElements.define("holo-button", HoloButton);
