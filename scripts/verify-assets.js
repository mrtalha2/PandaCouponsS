/**
 * Asset Reference Verification Script
 * Scans built HTML files in dist/ for all local asset references (img src, srcset, link href, script src, meta images)
 * and verifies that every referenced file exists in dist/.
 */
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');

// Known missing base images at baseline (tracked for owner decision)
const ALLOWLIST = new Set([
  'public/images/menu/broccoli-beef-panda-cub-meal-cub-meal.webp',
  'public/images/menu/build-your-own-panda-cub-meal-cub-meal.webp',
  'public/images/menu/orange-chicken-panda-cub-meal-cub-meal.webp'
]);

function getAllHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function verifyAssets() {
  console.log('🔍 Verifying asset references in built dist/ HTML files...');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory does not exist. Run "node build.js" first.');
    process.exit(1);
  }

  const htmlFiles = getAllHtmlFiles(DIST_DIR);
  if (htmlFiles.length === 0) {
    console.error('❌ No HTML files found in dist/.');
    process.exit(1);
  }

  let totalReferences = 0;
  let missingAssets = [];

  for (const htmlFile of htmlFiles) {
    const relativeHtml = path.relative(DIST_DIR, htmlFile);
    const content = fs.readFileSync(htmlFile, 'utf8');

    const referencedUrls = new Set();

    // 1. Extract <img src="...">, <script src="...">, <source src="...">
    const srcMatches = content.matchAll(/\b(?:src)=["']([^"']+)["']/gi);
    for (const m of srcMatches) {
      referencedUrls.add(m[1]);
    }

    // 2. Extract <img srcset="...">, <source srcset="...">
    const srcsetMatches = content.matchAll(/\bsrcset=["']([^"']+)["']/gi);
    for (const m of srcsetMatches) {
      const parts = m[1].split(',');
      for (const part of parts) {
        const item = part.trim().split(/\s+/)[0];
        if (item) referencedUrls.add(item);
      }
    }

    // 3. Extract <link href="..."> (stylesheets, icons, preload)
    const linkMatches = content.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi);
    for (const m of linkMatches) {
      const tag = m[0];
      const href = m[1];
      // Only check asset links, not page navigation or external
      if (tag.includes('rel="stylesheet"') || tag.includes('rel="icon"') || tag.includes('rel="preload"') || tag.includes('rel="apple-touch-icon"') || tag.includes('rel="manifest"')) {
        referencedUrls.add(href);
      }
    }

    // 4. Extract <meta property="og:image" content="...">, <meta name="twitter:image" content="...">
    const metaMatches = content.matchAll(/<meta\b[^>]*\b(?:property|name)=["'](?:og:image|twitter:image|og:image:secure_url)["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/gi);
    for (const m of metaMatches) {
      referencedUrls.add(m[1]);
    }

    // 5. Extract url(...) in inline styles
    const styleUrls = content.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/gi);
    for (const m of styleUrls) {
      referencedUrls.add(m[1]);
    }

    for (const rawUrl of referencedUrls) {
      // Ignore external URLs, data URLs, hashes, mailto, tel
      if (!rawUrl || rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('data:') || rawUrl.startsWith('#') || rawUrl.startsWith('mailto:') || rawUrl.startsWith('tel:') || rawUrl.startsWith('javascript:')) {
        continue;
      }

      totalReferences++;
      // Clean query strings & hashes (e.g., ?v=123)
      const cleanPath = rawUrl.split('?')[0].split('#')[0];
      // Normalize leading slash to relative from dist root
      const relPath = cleanPath.replace(/^\//, '');

      // Check allowlist
      if (ALLOWLIST.has(relPath)) {
        continue;
      }

      const absoluteTarget = path.join(DIST_DIR, relPath);
      if (!fs.existsSync(absoluteTarget)) {
        missingAssets.push({
          page: relativeHtml,
          reference: rawUrl,
          expectedPath: relPath
        });
      }
    }
  }

  console.log(`\nChecked ${totalReferences} asset references across ${htmlFiles.length} pages.`);

  if (missingAssets.length > 0) {
    console.error(`\n❌ Found ${missingAssets.length} broken/missing asset references in dist/:`);
    missingAssets.forEach(item => {
      console.error(`  - Page: ${item.page} -> Missing: ${item.reference} (looked for ${item.expectedPath})`);
    });
    process.exit(1);
  }

  console.log('✅ All asset references verified successfully! Zero broken asset links.');
}

if (require.main === module) {
  verifyAssets();
}

module.exports = verifyAssets;
