/**
 * Image Optimization Pipeline using Sharp
 * Converts source JPEGs to responsive WebP with strict per-width size budgets.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const OPTIMIZED_DIR = path.join(IMAGES_DIR, 'optimized');
const MENU_DIR = path.join(IMAGES_DIR, 'menu');

const SOURCE_IMAGES = [
  'hero-wok.jpg',
  'family-meal.jpg',
  'takeout-spread.jpg',
  'orange-chicken.jpg',
  'beijing-beef.jpg',
  'nutrition-plate.jpg',
  'about-kitchen.jpg'
];

const TARGET_WIDTHS = [
  { width: 640, maxBytes: 30 * 1024, startQuality: 75 },
  { width: 800, maxBytes: 45 * 1024, startQuality: 75 },
  { width: 1280, maxBytes: 80 * 1024, startQuality: 78 },
  { width: 1920, maxBytes: 130 * 1024, startQuality: 78 }
];

async function optimizeImages() {
  console.log('🖼️ Starting image optimization with Sharp...\n');

  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }

  const warnings = [];

  for (const filename of SOURCE_IMAGES) {
    const inputPath = path.join(IMAGES_DIR, filename);
    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ Source image not found: ${filename}`);
      continue;
    }

    const baseName = path.parse(filename).name;
    const inputStats = fs.statSync(inputPath);
    console.log(`Processing ${filename} (original: ${(inputStats.size / 1024).toFixed(1)} KB)...`);

    for (const spec of TARGET_WIDTHS) {
      const outputFilename = `${baseName}-${spec.width}.webp`;
      const outputPath = path.join(OPTIMIZED_DIR, outputFilename);

      const inputBuffer = fs.readFileSync(inputPath);
      let quality = spec.startQuality;
      let finalBuffer = null;

      while (quality >= 15) {
        finalBuffer = await sharp(inputBuffer)
          .resize({ width: spec.width, withoutEnlargement: true })
          .webp({ quality, effort: 6, smartSubsample: true })
          .toBuffer();

        if (finalBuffer.length <= spec.maxBytes) {
          break;
        }
        quality -= (quality > 45 ? 5 : 1);
      }

      fs.writeFileSync(outputPath, finalBuffer);
      const finalKb = (finalBuffer.length / 1024).toFixed(1);
      const budgetKb = (spec.maxBytes / 1024).toFixed(0);

      if (finalBuffer.length > spec.maxBytes) {
        const msg = `⚠️ ${outputFilename} is ${finalKb} KB (exceeds ${budgetKb} KB budget at quality ${quality})`;
        warnings.push(msg);
        console.warn(`   ${msg}`);
      } else {
        console.log(`   ✓ ${outputFilename}: ${finalKb} KB (quality ${quality}, budget ${budgetKb} KB)`);
      }
    }
  }

  // Audit menu/ directory
  if (fs.existsSync(MENU_DIR)) {
    console.log('\n🔍 Auditing public/images/menu/ images...');
    const menuFiles = fs.readdirSync(MENU_DIR).filter(f => f.endsWith('.webp'));
    let reencodedCount = 0;

    for (const file of menuFiles) {
      const filePath = path.join(MENU_DIR, file);
      const stat = fs.statSync(filePath);
      if (stat.size > 45 * 1024) {
        console.log(`   Re-encoding ${file} (${(stat.size / 1024).toFixed(1)} KB > 45 KB)...`);
        const fileBuffer = fs.readFileSync(filePath);
        let quality = 75;
        let buf = null;
        while (quality >= 40) {
          buf = await sharp(fileBuffer)
            .resize({ width: 800, withoutEnlargement: true })
            .webp({ quality, effort: 6, smartSubsample: true })
            .toBuffer();
          if (buf.length <= 45 * 1024) break;
          quality -= 5;
        }
        fs.writeFileSync(filePath, buf);
        console.log(`   ✓ ${file} compressed to ${(buf.length / 1024).toFixed(1)} KB (quality ${quality})`);
        reencodedCount++;
      }
    }
    console.log(`   Audited ${menuFiles.length} menu images (${reencodedCount} re-encoded to <= 45 KB).`);
  }

  console.log('\n✨ Image optimization complete!');
  if (warnings.length > 0) {
    console.log('\nSummary warnings:');
    warnings.forEach(w => console.warn(` - ${w}`));
  }
}

if (require.main === module) {
  optimizeImages().catch(err => {
    console.error('Fatal error optimizing images:', err);
    process.exit(1);
  });
}

module.exports = optimizeImages;
