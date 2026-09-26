/**
 * Media Library & Optimization Engine (Phase 17g)
 * Handles uploads, runs them through the Sharp optimization pipeline, and exposes the library.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const UPLOADS_DIR = path.join(__dirname, '../../public/images/uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const TARGET_WIDTHS = [
  { width: 640, quality: 75 },
  { width: 800, quality: 75 },
  { width: 1200, quality: 78 }
];

async function processUploadedImage(filename, fileBuffer) {
  // Sanitize filename
  const cleanBase = path.basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');
  const ext = path.extname(filename).toLowerCase() || '.jpg';
  const timestamp = Date.now();
  const originalName = `${cleanBase}-${timestamp}${ext}`;
  const originalPath = path.join(UPLOADS_DIR, originalName);

  // 1. Save original
  fs.writeFileSync(originalPath, fileBuffer);

  // 2. Generate optimized WebP responsive variants
  const variants = [];
  for (const spec of TARGET_WIDTHS) {
    const variantName = `${cleanBase}-${timestamp}-${spec.width}.webp`;
    const variantPath = path.join(UPLOADS_DIR, variantName);

    try {
      await sharp(fileBuffer)
        .resize({ width: spec.width, withoutEnlargement: true })
        .webp({ quality: spec.quality })
        .toFile(variantPath);

      const stats = fs.statSync(variantPath);
      variants.push({
        width: spec.width,
        path: `/public/images/uploads/${variantName}`,
        sizeKb: (stats.size / 1024).toFixed(1)
      });
    } catch (e) {
      console.error(`Failed to generate ${spec.width}w variant for ${filename}:`, e);
    }
  }

  return {
    filename: originalName,
    url: `/public/images/uploads/${originalName}`,
    variants
  };
}

function listUploads() {
  if (!fs.existsSync(UPLOADS_DIR)) return [];

  const files = fs.readdirSync(UPLOADS_DIR);
  // Filter for original or main image files (not sub-variants)
  const mainImages = files.filter(f => !f.match(/-\d{3,4}\.webp$/));

  return mainImages.map(f => {
    const fullPath = path.join(UPLOADS_DIR, f);
    const stats = fs.statSync(fullPath);
    return {
      filename: f,
      url: `/public/images/uploads/${f}`,
      sizeKb: (stats.size / 1024).toFixed(1),
      uploadedAt: stats.mtime
    };
  }).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

module.exports = {
  processUploadedImage,
  listUploads
};
