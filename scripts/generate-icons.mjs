import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 384, 512];
const splashSizes = [
  { width: 640, height: 1136, name: 'splash-640x1136' },
  { width: 750, height: 1334, name: 'splash-750x1334' },
  { width: 1242, height: 2208, name: 'splash-1242x2208' },
  { width: 1125, height: 2436, name: 'splash-1125x2436' },
];

const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons...\n');

  // Read SVG content
  const svgBuffer = fs.readFileSync(inputSvg);

  // Generate icon sizes
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: icon-${size}x${size}.png`);
  }

  // Generate splash screens
  console.log('\nGenerating splash screens...\n');
  for (const splash of splashSizes) {
    const outputPath = path.join(outputDir, `${splash.name}.png`);

    // Create a splash screen with the icon centered
    const iconSize = Math.min(splash.width, splash.height) * 0.3;
    const iconBuffer = await sharp(svgBuffer)
      .resize(Math.round(iconSize), Math.round(iconSize))
      .png()
      .toBuffer();

    // Create background with icon centered
    await sharp({
      create: {
        width: splash.width,
        height: splash.height,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 }, // #0f172a
      }
    })
      .composite([{
        input: iconBuffer,
        gravity: 'center'
      }])
      .png()
      .toFile(outputPath);

    console.log(`Generated: ${splash.name}.png`);
  }

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
