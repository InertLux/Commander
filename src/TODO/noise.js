
import { makeNoise2D } from "open-simplex-noise";

const noise2D = makeNoise2D(Date.now());

function scatter(x, y) {
  const n = noise2D(x * 0.1, y * 0.1); // -1..1
  return n > 0.4; // threshold for placing an object
}