

class IDMTerminal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/xterm/css/xterm.css">

      <style>
        .crt {
          width: 600px;
          height: 450px;
          margin: 40px auto;
          background: #111;
          padding: 1px 0px;
          border-radius: 20px;
          box-shadow: 0 0 40px rgba(0,0,0,0.8);
          border: 6px solid #333;
          position: relative;
          overflow: hidden;
        }

        .crt-warp {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .crt-screen {
          width: calc(100% - 30px);
          height: calc(100% - 30px);
          background: #0a0a0a;
          color: #33ff33;
          font-family: "Courier New", monospace;
          padding: 20px;
          border-radius: 12px;
          position: relative;
          display: flex;
          flex-direction: column;
          text-shadow: 0 0 5px #33ff33;
          box-shadow: inset 0 0 40px rgba(0,255,0,0.2);
          overflow: hidden;
          pointer-events: auto;
        }

        .crt-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,0) 2px,
            rgba(0,0,0,0.15) 3px
          );
        }

        #terminal {
          flex: 1;
          overflow: hidden;
          outline: none;
        }
      </style>

      <div class="crt">
        <div class="crt-warp">
          <div class="crt-screen">
            <div id="terminal" tabindex="0"></div>
          </div>
        </div>
      </div>
    `;

    this.initTerminal();
  }

  async initTerminal() {
    await this.loadXterm();

    const terminalEl = this.shadowRoot.getElementById("terminal");

    this.term = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",
      convertEol: true,
      wordWrap: true,
      theme: {
        background: "#000000",
        foreground: "#33ff33",
        cursor: "#33ff33",
      }
    });

    this.term.open(terminalEl);

    this.buffer = "";
    this.history = [];
    this.historyIndex = -1;

    this.PROMPT = "$ ";
    this.PROMPT_LENGTH = this.PROMPT.length;

    this.setupKeyHandlers();
    this.setupInputHandlers();

    setTimeout(() => {
      terminalEl.focus();
      this.term.focus();
    }, 50);

    this.term.write("IDM Commander Terminal Ready\r\n" + this.PROMPT);
  }

  async loadXterm() {
    if (!window.Terminal) {
      await import("/xterm/lib/xterm.js");
    }
  }

  setupKeyHandlers() {
    this.term.attachCustomKeyEventHandler(e => {
      if (e.key === "ArrowLeft") {
        const x = this.term._core.buffer.x;
        if (x <= this.PROMPT_LENGTH) return false;
      }
      return true;
    });
  }

  setupInputHandlers() {
    this.term.onData(async data => {
      const code = data.charCodeAt(0);

      // ENTER
      if (code === 13) {
        this.term.write("\r\n");
        const input = this.buffer.trim();

        if (input.length > 0) {
          this.history.push(input);
          this.historyIndex = this.history.length;

          const output = await this.dispatchCommand(input);
          this.term.write(output + "\r\n");
        }

        this.buffer = "";
        this.term.write(this.PROMPT);
        return;
      }

      // BACKSPACE
      if (code === 127) {
        const cursorX = this.term._core.buffer.x;
        if (cursorX > this.PROMPT_LENGTH && this.buffer.length > 0) {
          this.buffer = this.buffer.slice(0, -1);
          this.term.write("\b \b");
        }
        return;
      }

      // ARROW UP
      if (data === "\u001b[A") {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.replaceCurrentLine(this.history[this.historyIndex]);
        }
        return;
      }

      // ARROW DOWN
      if (data === "\u001b[B") {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.replaceCurrentLine(this.history[this.historyIndex]);
        } else {
          this.historyIndex = this.history.length;
          this.replaceCurrentLine("");
        }
        return;
      }

      // Normal characters
      this.buffer += data;
      this.term.write(data);
    });
  }

  replaceCurrentLine(text) {
    this.term.write("\x1b[2K\r" + this.PROMPT);
    this.buffer = text;
    this.term.write(this.buffer);
  }

  async dispatchCommand(input) {
    const parts = input.trim().split(/\s+/);
    const name = parts[0];
    const args = parts.slice(1);

    try {
      const res = await fetch("/Commander/terminal.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          args,
          me: { environment: "universe" }
        })
      });

      const data = await res.json();
      return data.text || "(no response)";
    } catch (err) {
      return "Error contacting server: " + err.message;
    }
  }
}

customElements.define("idm-terminal", IDMTerminal);
