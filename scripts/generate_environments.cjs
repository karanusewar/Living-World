const fs = require('fs');
const { execSync } = require('child_process');

console.log("Reading source PPM...");
if (!fs.existsSync('public/images/source.ppm')) {
  execSync('convert public/images/my_world.jpg public/images/source.ppm');
}

const buf = fs.readFileSync('public/images/source.ppm');
const headerEnd = 16;
const W = 1376;
const H = 768;

function getRGB(b, x, y) {
  const idx = headerEnd + (y * W + x) * 3;
  return [b[idx], b[idx + 1], b[idx + 2]];
}

function setRGB(b, x, y, r, g, bl) {
  const idx = headerEnd + (y * W + x) * 3;
  b[idx] = Math.max(0, Math.min(255, Math.round(r)));
  b[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
  b[idx + 2] = Math.max(0, Math.min(255, Math.round(bl)));
}

// -------------------------------------------------------------------------
// 1. MORNING (Authentic baseline sunrise diorama)
// -------------------------------------------------------------------------
fs.copyFileSync('public/images/my_world.jpg', 'public/images/env_morning.jpg');
console.log("env_morning.jpg ready.");

// -------------------------------------------------------------------------
// 2. AFTERNOON (Vivid midday sunlight, clear sapphire sky, crisp greens)
// -------------------------------------------------------------------------
const bufAfternoon = Buffer.from(buf);
for (let y = 0; y < H; y++) {
  // Smooth vertical sky influence
  const skyFade = y < 260 ? Math.pow((260 - y) / 260, 1.4) : 0;
  for (let x = 0; x < W; x++) {
    const [r, g, b] = getRGB(buf, x, y);

    // Midday sky enhancement: remove dawn yellow, shift to rich clear blue
    let newR = r * (0.96 - skyFade * 0.12) + skyFade * 14;
    let newG = g * (1.02 + skyFade * 0.05);
    let newB = b * (1.10 + skyFade * 0.32) + skyFade * 40;

    // Enhance contrast and midday brilliance
    const gray = (newR * 0.299 + newG * 0.587 + newB * 0.114);
    newR = gray + (newR - gray) * 1.16;
    newG = gray + (newG - gray) * 1.16;
    newB = gray + (newB - gray) * 1.16;

    setRGB(bufAfternoon, x, y, newR * 1.03, newG * 1.03, newB * 1.03);
  }
}
fs.writeFileSync('public/images/afternoon.ppm', bufAfternoon);
execSync('convert public/images/afternoon.ppm -quality 95 public/images/env_afternoon.jpg');
fs.unlinkSync('public/images/afternoon.ppm');
console.log("env_afternoon.jpg ready.");

// -------------------------------------------------------------------------
// 3. EVENING (Golden Hour Sunset, Fiery Amber Sky, Warm Terracotta)
// -------------------------------------------------------------------------
const bufEvening = Buffer.from(buf);
for (let y = 0; y < H; y++) {
  const dy = Math.abs(y - 210) / 95;
  const sunsetSky = y < 330 ? Math.exp(-dy * dy) : 0;

  for (let x = 0; x < W; x++) {
    const [r, g, b] = getRGB(buf, x, y);
    const dx = Math.abs(x - 720) / 460;
    const centerGlow = sunsetSky * Math.exp(-dx * dx);

    let newR = r * 1.25 + centerGlow * 55;
    let newG = g * 0.98 + centerGlow * 28;
    let newB = b * 0.72 - (1 - centerGlow) * 8;

    const gray = (newR * 0.299 + newG * 0.587 + newB * 0.114);
    newR = gray + (newR - gray) * 1.20;
    newG = gray + (newG - gray) * 1.20;
    newB = gray + (newB - gray) * 1.20;

    // Warm shop windows and lantern glow in evening
    const isLamp = (r > 165 && g > 120 && (r - b) > 35);
    if (isLamp && y > 320) {
      newR = Math.min(255, newR + 25);
      newG = Math.min(255, newG + 18);
    }

    setRGB(bufEvening, x, y, newR, newG, newB);
  }
}
fs.writeFileSync('public/images/evening.ppm', bufEvening);
execSync('convert public/images/evening.ppm -quality 95 public/images/env_evening.jpg');
fs.unlinkSync('public/images/evening.ppm');
console.log("env_evening.jpg ready.");

// -------------------------------------------------------------------------
// 4. NIGHT (Flawless Moonlight Landscape, Starry Azure Sky, Glowing Windows)
// -------------------------------------------------------------------------
const bufNight = Buffer.from(buf);

for (let y = 0; y < H; y++) {
  // Smooth vertical sky progression
  const skyFade = y < 280 ? Math.pow((280 - y) / 280, 1.2) : 0;

  for (let x = 0; x < W; x++) {
    const [r, g, b] = getRGB(buf, x, y);
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);

    // 1. Detect warm incandescent window/lantern glow (bakery, cafe, streetlamps)
    // Pure color-based detection: high yellow/amber warmth
    let lampWeight = 0;
    if (y > 280 && r > 165 && g > 120 && (r - b) > 40 && (g - b) > 15) {
      lampWeight = Math.min(1.0, ((r - b) - 40) / 45.0);
    }

    // 2. Detect crystal luminescence (violet/cyan)
    let crystalWeight = 0;
    if (y > 540 && b > 145 && (b > g + 15 || (r > g + 15 && b > 130))) {
      crystalWeight = Math.min(1.0, (b - 145) / 50.0);
    }

    // 3. Moonlit terrain (cool slate-blue shadows, bright snow highlights)
    const snowHighlight = (y < 350 && brightness > 185) ? (brightness - 185) / 70.0 : 0.0;

    let nightR = r * 0.28 + snowHighlight * 45;
    let nightG = g * 0.38 + snowHighlight * 65;
    let nightB = b * 0.62 + snowHighlight * 95;

    // Apply nocturnal sky cooling
    if (skyFade > 0) {
      // Sky deepens into starlit midnight indigo
      nightR = nightR * (1 - skyFade * 0.45);
      nightG = nightG * (1 - skyFade * 0.35);
      nightB = nightB * (1 + skyFade * 0.15);

      // Star field in the highest sky
      if (y < 200 && (r > 130 && b > 140)) {
        const starSeed = y * W + x;
        const pseudoR = Math.sin(starSeed * 12.9898 + y * 78.233) * 43758.5453;
        const frac = pseudoR - Math.floor(pseudoR);
        if (frac > 0.995) {
          const starVal = 160 + frac * 95;
          nightR = Math.min(255, nightR + starVal);
          nightG = Math.min(255, nightG + starVal);
          nightB = Math.min(255, nightB + starVal);
        }
      }
    }

    // Blend warm golden lamp/window radiance
    if (lampWeight > 0) {
      const glowR = Math.min(255, r * 1.35 + 40);
      const glowG = Math.min(255, g * 1.25 + 25);
      const glowB = b * 0.45;
      nightR = nightR * (1 - lampWeight) + glowR * lampWeight;
      nightG = nightG * (1 - lampWeight) + glowG * lampWeight;
      nightB = nightB * (1 - lampWeight) + glowB * lampWeight;
    }

    // Blend crystal luminescence
    if (crystalWeight > 0) {
      const cR = Math.min(255, r * 1.1 + 40);
      const cG = Math.min(255, g * 1.2 + 65);
      const cB = Math.min(255, b * 1.4 + 90);
      nightR = nightR * (1 - crystalWeight) + cR * crystalWeight;
      nightG = nightG * (1 - crystalWeight) + cG * crystalWeight;
      nightB = nightB * (1 - crystalWeight) + cB * crystalWeight;
    }

    setRGB(bufNight, x, y, nightR, nightG, nightB);
  }
}

fs.writeFileSync('public/images/night.ppm', bufNight);
execSync('convert public/images/night.ppm -quality 95 public/images/env_night.jpg');
fs.unlinkSync('public/images/night.ppm');
console.log("env_night.jpg ready with organic color grading.");
