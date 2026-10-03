/**
 * Image Optimization Pipeline using Sharp
 * Converts source JPEGs to responsive WebP with strict per-width size budgets.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = path.join(__dirname, '..', 'assets-src', 'images');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const OPTIMIZED_DIR = path.join(PUBLIC_IMAGES_DIR, 'optimized');
const MENU_DIR = path.join(PUBLIC_IMAGES_DIR, 'menu');

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
    const inputPath = path.join(SOURCE_DIR, filename);
    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ Source image not found: ${filename}`);
      continue;
    }

    const baseName = path.parse(filename).name;
    const inputStats = fs.statSync(inputPath);
    console.log(`Processing ${filename} (original: ${(inputStats.size / 1024).toFixed(1)} KB)...`);

    // Generate small JPG fallback (<200KB, max width 1280, quality ~75)
    const jpgFallbackPath = path.join(PUBLIC_IMAGES_DIR, filename);
    const jpgBuffer = await sharp(inputPath)
      .resize({ width: 1280, withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(jpgFallbackPath, jpgBuffer);
    console.log(`   ✓ Small JPG fallback: ${filename} (${(jpgBuffer.length / 1024).toFixed(1)} KB)`);

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

  // Generate Menu Variants (300, 600, 900)
  if (fs.existsSync(MENU_DIR)) {
    console.log('\n🔍 Generating responsive variants for menu images...');
    const menuFiles = fs.readdirSync(MENU_DIR).filter(f => f.endsWith('.webp') && !f.match(/-\d{3}\.webp$/));
    
    for (const file of menuFiles) {
      const filePath = path.join(MENU_DIR, file);
      const baseName = path.parse(file).name;
      const fileBuffer = fs.readFileSync(filePath);
      
      const widths = [300, 600, 900];
      for (const w of widths) {
        const outName = `${baseName}-${w}.webp`;
        const outPath = path.join(MENU_DIR, outName);
        if (!fs.existsSync(outPath)) {
          await sharp(fileBuffer)
            .resize({ width: w, withoutEnlargement: true })
            .webp({ quality: 80, effort: 6 })
            .toFile(outPath);
          console.log(`   ✓ Created menu variant ${outName}`);
        }
      }
    }
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
