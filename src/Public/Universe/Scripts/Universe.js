import * as THREE from "/lib/three/three.module.js";
import { OrbitControls } from "/lib/three/examples/controls/OrbitControls.js";



const planetMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime:   { value: 0.0 },
    uColor1: { value: new THREE.Color(0x4fa3ff) }, // ocean
    uColor2: { value: new THREE.Color(0x1b4d8c) }, // deep ocean
    uColor3: { value: new THREE.Color(0x88cc66) }, // land
    uColor4: { value: new THREE.Color(0xffffff) }, // ice tint
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vObjPos;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vObjPos = position;   // true object-space
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vObjPos;

    uniform vec3 uColor1; // ocean
    uniform vec3 uColor2; // deep ocean
    uniform vec3 uColor3; // land
    uniform vec3 uColor4; // ice tint

    // --- Noise ---
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + .1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);

      float n = mix(
        mix(
          mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
          f.y
        ),
        mix(
          mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
          f.y
        ),
        f.z
      );
      return n;
    }

    void main() {

      // --- Terrain noise ---
      vec3 p = normalize(vObjPos) * 3.0;

      float n = noise(p * 1.5);
      n += 0.5 * noise(p * 3.0);
      n += 0.25 * noise(p * 6.0);
      n /= 1.75;

      float land = smoothstep(0.45, 0.55, n);

      vec3 ocean     = mix(uColor1, uColor2, n);
      vec3 landColor = mix(uColor3, vec3(0.8, 0.8, 0.5), n);

      vec3 baseColor = mix(ocean, landColor, land);

      // --- Ice caps (object-space latitude) ---
      float lat = abs(normalize(vObjPos).y);

      // Noise to break up the ice boundary
      float edgeNoise = noise(vObjPos * 4.0) * 0.08;

      float iceStart = 0.78 + edgeNoise;
      float iceEnd   = 0.92 + edgeNoise;

      // Soft transition
      float t = smoothstep(iceStart, iceEnd, lat);

      // Nonlinear falloff
      t = pow(t, 1.8);

      // Hard cap at the very top to hide UV distortion
      float poleCap = smoothstep(0.97, 0.995, lat);

      // Combine soft ice + hard cap
      float iceMask = max(t, poleCap);

      // Biome-aware ice color
      vec3 iceOcean = vec3(0.75, 0.85, 1.0); // grey-blue over water
      vec3 iceLand  = vec3(0.90, 0.95, 1.0); // white-blue over land

      vec3 biomeIce = mix(iceOcean, iceLand, land);

      // Final blend
      vec3 finalColor = mix(baseColor, biomeIce, iceMask);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
});







// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;   // IMPORTANT
document.body.appendChild(renderer.domElement);


// Globe
const globe = new THREE.Mesh(
  new THREE.SphereGeometry(1, 128, 128),
  planetMaterial
);
scene.add(globe);
scene.add(globe);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 1));
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 5, 5);
scene.add(dir);

// Orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.enablePan = false;
orbit.target.set(0, 0, 0);

// Resize
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  orbit.update();
  renderer.render(scene, camera);
}
animate();
