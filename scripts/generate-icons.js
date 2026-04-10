const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const svgPath = path.join(__dirname, "../public/icons/icon.svg");
const outputDir = path.join(__dirname, "../public/icons");
const svg = fs.readFileSync(svgPath);

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

async function run() {
  for (const size of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon-${size}.png`));
    console.log(`✓ icon-${size}.png`);
  }
  console.log("All icons generated.");
}

run().catch(console.error);
