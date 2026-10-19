const fs = require('fs');
const { execSync } = require('child_process');

const origBuf = fs.readFileSync('public/images/source.ppm');
const cleanBuf = fs.readFileSync('public/images/clean_perfect.ppm');
const headerEnd = 16;
const W = 1376, H = 768;

function getOrigRGB(x, y) {
  const idx = headerEnd + (y * W + x) * 3;
  return [origBuf[idx], origBuf[idx+1], origBuf[idx+2]];
}

function getCleanRGB(x, y) {
  const idx = headerEnd + (y * W + x) * 3;
  return [cleanBuf[idx], cleanBuf[idx+1], cleanBuf[idx+2]];
}

function extractCloud(x1, y1, x2, y2, outPng, featherBorder = 3) {
  const w = x2 - x1;
  const h = y2 - y1;
  
  const header = `P7\nWIDTH ${w}\nHEIGHT ${h}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n`;
  const body = Buffer.alloc(w * h * 4);

  for (let cy = 0; cy < h; cy++) {
    for (let cx = 0; cx < w; cx++) {
      const x = x1 + cx;
      const y = y1 + cy;
      const [or, og, ob] = getOrigRGB(x, y);
      const [sr, sg, sb] = getCleanRGB(x, y);

      const redDiff = or - sr;
      const greenDiff = og - sg;
      const blueDiff = ob - sb;
      const valDiff = (or * 0.3 + og * 0.59 + ob * 0.11) - (sr * 0.3 + sg * 0.59 + sb * 0.11);
      const dist = Math.sqrt(redDiff * redDiff + greenDiff * greenDiff + blueDiff * blueDiff);

      let alpha = 0;
      if (redDiff > 7 || valDiff > 9 || dist > 15) {
        alpha = Math.min(255, Math.max(0, Math.round((Math.max(redDiff * 1.8, dist) - 7) * 4.2)));
      }

      if (cx < featherBorder) alpha = Math.min(alpha, Math.round((cx / featherBorder) * 255));
      if (w - 1 - cx < featherBorder) alpha = Math.min(alpha, Math.round(((w - 1 - cx) / featherBorder) * 255));
      if (cy < featherBorder) alpha = Math.min(alpha, Math.round((cy / featherBorder) * 255));
      if (h - 1 - cy < featherBorder) alpha = Math.min(alpha, Math.round(((h - 1 - cy) / featherBorder) * 255));

      const outIdx = (cy * w + cx) * 4;
      body[outIdx] = or;
      body[outIdx + 1] = og;
      body[outIdx + 2] = ob;
      body[outIdx + 3] = alpha;
    }
  }

  const pamPath = `/tmp/${outPng.replace(/[^a-zA-Z0-9]/g, '_')}.pam`;
  fs.writeFileSync(pamPath, Buffer.concat([Buffer.from(header, 'utf8'), body]));
  execSync(`convert ${pamPath} ${outPng}`);
  console.log(`Generated ${outPng} (${w}x${h})`);
}

extractCloud(22, 16, 268, 106, 'public/images/cloud_left_main.png');
extractCloud(285, 66, 398, 110, 'public/images/cloud_left_small.png');
extractCloud(1055, 22, 1130, 65, 'public/images/cloud_right_small.png');
extractCloud(1132, 16, 1320, 90, 'public/images/cloud_right_main.png');
