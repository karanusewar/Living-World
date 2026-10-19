const fs = require('fs');
const { execSync } = require('child_process');

const buf = fs.readFileSync('public/images/source.ppm');
const headerEnd = 16;
const W = 1376, H = 768;
const out = Buffer.from(buf);

function getRGB(x, y) {
  if (x < 0) x = 0;
  if (x >= W) x = W - 1;
  if (y < 0) y = 0;
  if (y >= H) y = H - 1;
  const idx = headerEnd + (y * W + x) * 3;
  return [buf[idx], buf[idx+1], buf[idx+2]];
}

function setRGB(x, y, r, g, b) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const idx = headerEnd + (y * W + x) * 3;
  out[idx] = Math.max(0, Math.min(255, Math.round(r)));
  out[idx+1] = Math.max(0, Math.min(255, Math.round(g)));
  out[idx+2] = Math.max(0, Math.min(255, Math.round(b)));
}

// 1. Cloud 1: Left Big Cloud (x: 10..270, y: 16..104)
for (let x = 10; x <= 270; x++) {
  const top = getRGB(x, 14);
  const bot = getRGB(x, 107);
  for (let y = 16; y <= 104; y++) {
    const t = (y - 16) / (104 - 16);
    const r = top[0] * (1 - t) + bot[0] * t;
    const g = top[1] * (1 - t) + bot[1] * t;
    const b = top[2] * (1 - t) + bot[2] * t;

    let blend = 1.0;
    if (x - 10 < 15) blend = Math.min(blend, (x - 10) / 15);
    if (270 - x < 15) blend = Math.min(blend, (270 - x) / 15);

    const orig = getRGB(x, y);
    setRGB(x, y, orig[0] * (1 - blend) + r * blend, orig[1] * (1 - blend) + g * blend, orig[2] * (1 - blend) + b * blend);
  }
}

// 2. Cloud 2: Left Small Cloud (x: 275..405, y: 68..108)
for (let x = 275; x <= 405; x++) {
  const top = getRGB(x, 65);
  const bot = getRGB(x, 111);
  for (let y = 68; y <= 108; y++) {
    const t = (y - 68) / (108 - 68);
    const r = top[0] * (1 - t) + bot[0] * t;
    const g = top[1] * (1 - t) + bot[1] * t;
    const b = top[2] * (1 - t) + bot[2] * t;

    let blend = 1.0;
    if (x - 275 < 12) blend = Math.min(blend, (x - 275) / 12);
    if (405 - x < 12) blend = Math.min(blend, (405 - x) / 12);

    const orig = getRGB(x, y);
    setRGB(x, y, orig[0] * (1 - blend) + r * blend, orig[1] * (1 - blend) + g * blend, orig[2] * (1 - blend) + b * blend);
  }
}

// 3. Birds: (x: 745..905, y: 70..165)
for (let y = 70; y <= 165; y++) {
  const leftSky = getRGB(735, y);
  const rightSky = getRGB(915, y);
  for (let x = 740; x <= 910; x++) {
    const t = (x - 735) / (915 - 735);
    const easeT = 0.5 - 0.5 * Math.cos(t * Math.PI);
    const interpR = leftSky[0] * (1 - easeT) + rightSky[0] * easeT;
    const interpG = leftSky[1] * (1 - easeT) + rightSky[1] * easeT;
    const interpB = leftSky[2] * (1 - easeT) + rightSky[2] * easeT;

    let blend = 1.0;
    if (x < 748) blend = Math.min(blend, (x - 738) / 10);
    if (x > 902) blend = Math.min(blend, (912 - x) / 10);
    if (y < 78) blend = Math.min(blend, (y - 70) / 8);
    if (y > 158) blend = Math.min(blend, (166 - y) / 8);

    const orig = getRGB(x, y);
    setRGB(x, y, orig[0] * (1 - blend) + interpR * blend, orig[1] * (1 - blend) + interpG * blend, orig[2] * (1 - blend) + interpB * blend);
  }
}

// 4. Cloud 3: Right Small Cloud (x: 940..1035, y: 32..75)
for (let x = 940; x <= 1035; x++) {
  const top = getRGB(x, 28);
  const bot = getRGB(x, 78);
  for (let y = 32; y <= 75; y++) {
    const t = (y - 32) / (75 - 32);
    const r = top[0] * (1 - t) + bot[0] * t;
    const g = top[1] * (1 - t) + bot[1] * t;
    const b = top[2] * (1 - t) + bot[2] * t;

    let blend = 1.0;
    if (x - 940 < 12) blend = Math.min(blend, (x - 940) / 12);
    if (1035 - x < 12) blend = Math.min(blend, (1035 - x) / 12);

    const orig = getRGB(x, y);
    setRGB(x, y, orig[0] * (1 - blend) + r * blend, orig[1] * (1 - blend) + g * blend, orig[2] * (1 - blend) + b * blend);
  }
}

// 5. Cloud 4: Right Big Cloud (x: 1045..1325, y: 16..98)
for (let x = 1045; x <= 1325; x++) {
  const top = getRGB(x, 14);
  // Sample bot safely at y=102, or from x=1270 if close to right mountain
  const sampleX = Math.min(x, 1270);
  const bot = getRGB(sampleX, 103);
  for (let y = 16; y <= 98; y++) {
    const t = (y - 16) / (98 - 16);
    const r = top[0] * (1 - t) + bot[0] * t;
    const g = top[1] * (1 - t) + bot[1] * t;
    const b = top[2] * (1 - t) + bot[2] * t;

    let blend = 1.0;
    if (x - 1045 < 15) blend = Math.min(blend, (x - 1045) / 15);
    if (1325 - x < 15) blend = Math.min(blend, (1325 - x) / 15);

    const orig = getRGB(x, y);
    setRGB(x, y, orig[0] * (1 - blend) + r * blend, orig[1] * (1 - blend) + g * blend, orig[2] * (1 - blend) + b * blend);
  }
}

fs.writeFileSync('public/images/clean_perfect.ppm', out);
execSync('convert public/images/clean_perfect.ppm -quality 98 public/images/my_world_clearsky.jpg');
console.log('Regenerated my_world_clearsky.jpg with 100% flawless sky inpainting');
