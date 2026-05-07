import { THREE, OrbitControls, GLTFLoader } from "/lib/render-bundle.js";

class GltfMeshField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Basic template
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.gltf,.glb,model/gltf-binary,model/gltf+json';

    const canvas = document.createElement('canvas');
    canvas.classList.add('viewport');

    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        display: inline-flex;
        flex-direction: column;
        gap: 0.25rem;
        font-family: system-ui, sans-serif;
      }

      input[type="file"] {
        font-size: 0.8rem;
      }

      .viewport {
        width: 200px;
        height: 200px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: #111;
        display: block;
      }
    `;

    wrapper.appendChild(fileInput);
    wrapper.appendChild(canvas);
    this.shadowRoot.append(style, wrapper);

    this._fileInput = fileInput;
    this._canvas = canvas;

    // Three.js core
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0x111111);

    // --- Grey cubemap environment ---
    const greyFace = (() => {
      const size = 4;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, size, size);
      return canvas.toDataURL();
    })();

    const cubeLoader = new THREE.CubeTextureLoader();
    const greyCube = cubeLoader.load([
      greyFace, greyFace, greyFace,
      greyFace, greyFace, greyFace
    ]);

    this._scene.environment = greyCube;

    // --- Blender‑like atmosphere sky ---
    const skyGeo = new THREE.SphereGeometry(50, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(0x1a1a1a) },
        midColor: { value: new THREE.Color(0x3a3a3a) },
        bottomColor: { value: new THREE.Color(0x0d0d0d) }
      },
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPos;
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;

        void main() {
          float h = normalize(vPos).y;

          vec3 col = mix(bottomColor, midColor, smoothstep(-1.0, 0.2, h));
          col = mix(col, topColor, smoothstep(0.0, 1.0, h));

          gl_FragColor = vec4(col, 1.0);
        }
      `
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    this._scene.add(sky);

    // Optional atmospheric fog
    this._scene.fog = new THREE.Fog(0x111111, 5, 40);

    this._camera = new THREE.PerspectiveCamera(
      45,
      1,
      0.01,
      1000
    );
    this._camera.position.set(0, 1, 3);

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: false
    });
    this._renderer.setPixelRatio(window.devicePixelRatio || 1);
    this._renderer.setSize(200, 200, false);

    // Blender‑like soft lighting
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    this._scene.add(hemi);

    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    this._scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.4);
    dir.position.set(3, 5, 2);
    this._scene.add(dir);

    // Controls
    this._controls = new OrbitControls(this._camera, this._canvas);
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.08;
    this._controls.enablePan = false;

    // Loader
    this._loader = new GLTFLoader();

    // Current model
    this._model = null;

    // Animation loop
    this._animating = true;
    this._animate = this._animate.bind(this);
    requestAnimationFrame(this._animate);

    // Events
    this._fileInput.addEventListener('change', (e) => this._onFileChange(e));
  }

  connectedCallback() {
    this._resizeFromCSS();
    window.addEventListener('resize', this._resizeFromCSSBound = () => this._resizeFromCSS());
  }

  disconnectedCallback() {
    this._animating = false;
    window.removeEventListener('resize', this._resizeFromCSSBound);
  }

  _resizeFromCSS() {
    const rect = this._canvas.getBoundingClientRect();
    if (rect.width && rect.height) {
      this._camera.aspect = rect.width / rect.height;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(rect.width, rect.height, false);
    }
  }

  _animate() {
    if (!this._animating) return;
    requestAnimationFrame(this._animate);

    this._controls.update();
    this._renderer.render(this._scene, this._camera);
  }

  async _onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    try {
      await this._loadGltf(url);
      this._currentFile = file;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { file },
        bubbles: true,
        composed: true
      }));
    } finally {
      // URL.revokeObjectURL(url);
    }
  }

  async _loadGltf(url) {
    if (this._model) {
      this._scene.remove(this._model);
      this._model.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.();
          if (obj.material?.map) obj.material.map.dispose?.();
          obj.material?.dispose?.();
        }
      });
      this._model = null;
    }

    const gltf = await this._loader.loadAsync(url);
    this._model = gltf.scene;
    this._scene.add(this._model);

    this._frameModel();
  }

  _frameModel() {
    const box = new THREE.Box3().setFromObject(this._model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    this._model.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this._camera.fov * (Math.PI / 180);
    const distance = maxDim / (2 * Math.tan(fov / 2));

    this._camera.position.set(0, maxDim * 0.3, distance * 1.4);
    this._camera.lookAt(0, 0, 0);
    this._controls.target.set(0, 0, 0);
    this._controls.update();
  }

  get value() {
    return this._currentFile || null;
  }

  set value(file) {
    if (!(file instanceof File)) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    this._fileInput.files = dt.files;
    this._onFileChange({ target: this._fileInput });
  }
}

customElements.define('gltf-mesh-field', GltfMeshField);
