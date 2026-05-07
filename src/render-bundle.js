// Core Three.js
export * as THREE from "three";

// Controls
export { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
export { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
export { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
export { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

// Loaders
export { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
export { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
export { TextureLoader } from "three/src/loaders/TextureLoader.js";
export { CubeTextureLoader } from "three/src/loaders/CubeTextureLoader.js";

// Postprocessing
export { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
export { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
export { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
export { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// Math / Utils (optional)
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
export { BufferGeometryUtils };
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
export { SkeletonUtils };

