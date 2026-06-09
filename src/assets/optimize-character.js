import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'character.png');

const sizes = [
  { width: 400, suffix: '-400' },
  { width: 800, suffix: '-800' },
  { width: 1200, suffix: '-1200' },
];

async function optimize() {
  console.log('Optimizing character image...');

  // Create full size WebP
  await sharp(inputPath)
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(__dirname, 'character.webp'));
  console.log('Created full-size character.webp');

  // Create resized WebP & PNG files
  for (const size of sizes) {
    // WebP version
    await sharp(inputPath)
      .resize(size.width, size.width, {
        fit: 'contain',
        kernel: 'lanczos3' // High-quality lanczos downscaling kernel
      })
      .webp({ quality: 92, effort: 6 })
      .toFile(path.join(__dirname, `character${size.suffix}.webp`));
    console.log(`Created character${size.suffix}.webp`);

    // PNG version
    await sharp(inputPath)
      .resize(size.width, size.width, {
        fit: 'contain',
        kernel: 'lanczos3'
      })
      .png({ compressionLevel: 8 })
      .toFile(path.join(__dirname, `character${size.suffix}.png`));
    console.log(`Created character${size.suffix}.png`);
  }

  console.log('Optimization complete!');
}

optimize().catch((err) => {
  console.error('Error during optimization:', err);
  process.exit(1);
});
