//
//2. pngjs — Actively maintained, stable, pure JS
//ngjs is:

//Pure JavaScript (no native deps)
//Stable and widely used
//Maintained, but not as aggressively as Sharp
//Perfect for 16‑bit PNG workflows

//It’s not as fast as Sharp, but it’s reliable and simple.




const { PNG } = require('pngjs');
const fs = require('fs');

const width = 512;
const height = 512;

const png = new PNG({
  width,
  height,
  bitDepth: 16,
  colorType: 0 // grayscale
});

// png.data is a Uint16Array when bitDepth=16
const data = new Uint16Array(png.data.buffer);

for (let i = 0; i < width * height; i++) {
  data[i] = i % 65536; // example 16-bit value
}

png.pack().pipe(fs.createWriteStream('map16.png'));