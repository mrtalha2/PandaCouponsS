/**
 * Panda Express Coupons - Static Site Generator
 * 
 * Compiles data files and templates into ultra-fast, zero-dependency static HTML.
 * Run with: npm run build (or node build.js)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const CleanCSS = require('clean-css');
const { minify: terserMinify } = require('terser');
const { minify: htmlMinify } = require('html-minifier-terser');

// Load Site Configuration & Data
const config = require('./data/site.config');
const dishesData = require('./data/dishes.json');

// Load Layout & Page Generators
const renderLayout = require('./src/templates/layout');
const renderHome = require('./src/pages/home');
const renderMenu = require('./src/pages/menu');
const renderNutrition = require('./src/pages/nutrition');
const renderSavingsCalculator = require('./src/pages/savings-calculator');
const renderDish = require('./src/pages/dish');
const renderAbout = require('./src/pages/about');
const renderContact = require('./src/pages/contact');
const renderDisclaimer = require('./src/pages/disclaimer');
const renderPrivacy = require('./src/pages/privacy');
const render404 = require('./src/pages/404');

const DIST_DIR = path.join(__dirname, 'dist');

// Helper to ensure directories exist
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper to write an HTML page
async function writePage(routePath, pageData, assetHash) {
  pageData.assetHash = assetHash;
  if (routePath === '/') {
    pageData.preloadHero = true;
  }

  let fullHtml = renderLayout(pageData);
  const { currentMonthYear } = require('./src/utils/date').getDynamicDate();
  const dateRegex = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s20\d\d\b/g;
  fullHtml = fullHtml.replace(dateRegex, currentMonthYear);
  let finalHtml = fullHtml;

  try {
    finalHtml = await htmlMinify(fullHtml, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      useShortDoctype: false,
      removeEmptyAttributes: true,
      minifyCSS: true,
      minifyJS: true
    });
  } catch (err) {
    console.warn(`  ⚠️ HTML minification warning on ${routePath}:`, err.message);
  }

  if (routePath.endsWith('.html')) {
    const targetFile = path.join(DIST_DIR, routePath.replace(/^\//, ''));
    ensureDirSync(path.dirname(targetFile));
    fs.writeFileSync(targetFile, finalHtml, 'utf8');
    console.log(`  ✓ Built: ${routePath} (${(Buffer.byteLength(finalHtml, 'utf8') / 1024).toFixed(1)} KB)`);
    return;
  }

  // If routePath is '/', output dist/index.html
  // Otherwise, output dist/routePath/index.html for clean URLs
  const cleanRoute = routePath.replace(/^\/|\/$/g, '');
  const targetDir = cleanRoute === '' ? DIST_DIR : path.join(DIST_DIR, cleanRoute);
  ensureDirSync(targetDir);

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, finalHtml, 'utf8');
  console.log(`  ✓ Built: ${routePath === '/' ? '/ (index.html)' : '/' + cleanRoute + '/'} (${(Buffer.byteLength(finalHtml, 'utf8') / 1024).toFixed(1)} KB)`);
}

// Copy file helper
function copyFileSync(src, dest) {
  ensureDirSync(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

// Copy directory recursively
function copyDirRecursiveSync(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  ensureDirSync(destDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursiveSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Generate sitemap.xml
function generateSitemap(routes) {
  const today = new Date().toISOString().split('T')[0];
  const pagePriorityMap = {
    '/': { priority: '1.0', changeFreq: 'daily' },
    '/panda-express-menu/': { priority: '0.9', changeFreq: 'weekly' },
    '/panda-express-nutrition/': { priority: '0.9', changeFreq: 'weekly' },
    '/panda-express-savings-calculator/': { priority: '0.9', changeFreq: 'weekly' },
    '/panda-express-orange-chicken/': { priority: '0.8', changeFreq: 'weekly' },
    '/beijing-beef/': { priority: '0.8', changeFreq: 'weekly' },
    '/about-us/': { priority: '0.5', changeFreq: 'monthly' },
    '/contact-us/': { priority: '0.5', changeFreq: 'monthly' },
    '/disclaimer/': { priority: '0.3', changeFreq: 'monthly' },
    '/privacy-policy/': { priority: '0.3', changeFreq: 'monthly' }
  };

  const urlsXml = routes.map((route) => {
    const configData = pagePriorityMap[route] || { priority: '0.7', changeFreq: 'weekly' };
    const cleanUrl = `${config.domain}${route.endsWith('/') ? route : route + '/'}`;
    return `  <url>
    <loc>${cleanUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${configData.changeFreq}</changefreq>
    <priority>${configData.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log(`  ✓ Generated sitemap.xml with ${routes.length} URLs`);
}

// Generate robots.txt
function generateRobots() {
  const robotsTxt = `# Robots.txt for ${config.siteName}
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/preview/
Disallow: /api/

# Sitemap
Sitemap: ${config.domain}/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
  console.log('  ✓ Generated robots.txt');
}

// Main Build Sequence
async function build() {
  const startTime = Date.now();
  console.log(`\n🚀 Starting static build for ${config.siteName}...`);

  if (!config.formEndpoint || config.formEndpoint.includes('placeholder')) {
    console.warn('\n⚠️  BUILD WARNING: config.formEndpoint contains "placeholder"!\n    Contact form submissions will be discarded until a real Formspree ID is set in data/site.config.js.\n');
  }

  // 1. Clean or create dist
  ensureDirSync(DIST_DIR);

  // 2. Copy Assets & Public Resources first so unminified base exists
  console.log('\n📦 Copying assets & public resources...');
  copyDirRecursiveSync(path.join(__dirname, 'assets'), path.join(DIST_DIR, 'assets'));
  copyDirRecursiveSync(path.join(__dirname, 'public'), path.join(DIST_DIR, 'public'));

  // 3. Asset Minification & Content Hashing (CleanCSS & Terser)
  console.log('\n⚡ Minifying assets with CleanCSS & Terser and computing cache hash...');
  const rawCss = fs.readFileSync(path.join(__dirname, 'assets', 'css', 'style.css'), 'utf8');
  const cleanCssResult = new CleanCSS({ level: 2 }).minify(rawCss);
  if (cleanCssResult.errors && cleanCssResult.errors.length) {
    throw new Error('CleanCSS error: ' + cleanCssResult.errors.join(', '));
  }
  // We will write the fingerprinted file after computing assetHash
  console.log(`  ✓ style.min.css: ${rawCss.length}B -> ${cleanCssResult.styles.length}B (${((1 - cleanCssResult.styles.length / rawCss.length) * 100).toFixed(1)}% savings)`);

  // Remove unminified CSS from dist (only serve the .min version)
  const distRawCss = path.join(DIST_DIR, 'assets', 'css', 'style.css');
  if (fs.existsSync(distRawCss)) {
    fs.unlinkSync(distRawCss);
    console.log('  ✓ Removed unminified style.css from dist (saves 161KB)');
  }

  const rawJs = fs.readFileSync(path.join(__dirname, 'assets', 'js', 'main.js'), 'utf8');
  const terserResult = await terserMinify(rawJs, {
    compress: {
      drop_console: false, // Keep console.error/warn for runtime debugging
      drop_debugger: true,  // Remove debugger statements
      passes: 2             // Two compression passes for better ratio
    },
    mangle: true
  });
  if (!terserResult.code) {
    throw new Error('Terser minification produced empty output');
  }
  // We will write the fingerprinted file after computing assetHash
  console.log(`  ✓ main.min.js: ${rawJs.length}B -> ${terserResult.code.length}B (${((1 - terserResult.code.length / rawJs.length) * 100).toFixed(1)}% savings)`);

  // Remove unminified JS from dist (only serve the .min version)
  const distRawJs = path.join(DIST_DIR, 'assets', 'js', 'main.js');
  if (fs.existsSync(distRawJs)) {
    fs.unlinkSync(distRawJs);
    console.log('  ✓ Removed unminified main.js from dist (saves 62KB)');
  }

  // Content-based cache-bust hash for static assets (Phase 7e)
  const assetHash = crypto.createHash('md5')
    .update(cleanCssResult.styles + terserResult.code)
    .digest('hex')
    .slice(0, 8);
  console.log(`  ✓ Asset version hash: ${assetHash}`);
  
  fs.writeFileSync(path.join(DIST_DIR, 'assets', 'css', `style.${assetHash}.css`), cleanCssResult.styles, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'assets', 'js', `main.${assetHash}.js`), terserResult.code, 'utf8');
  

  // 4. Render and Minify HTML Pages (Phase 7a, 7b, 7c)
  console.log('\n📄 Building and minifying HTML pages...');
  const routes = [];

  // Build Home Page
  await writePage('/', renderHome(), assetHash);
  routes.push('/');

  // Build Menu Page
  await writePage('/panda-express-menu/', renderMenu(), assetHash);
  routes.push('/panda-express-menu/');

  // Build Nutrition Calculator Page
  await writePage('/panda-express-nutrition/', renderNutrition(), assetHash);
  routes.push('/panda-express-nutrition/');

  // Build Savings Calculator Cluster Page
  await writePage('/panda-express-savings-calculator/', renderSavingsCalculator(), assetHash);
  routes.push('/panda-express-savings-calculator/');

  // Build Food Pages from data/dishes.json
  for (const dish of dishesData) {
    const dishRoute = `/${dish.slug}/`;
    await writePage(dishRoute, renderDish(dish), assetHash);
    routes.push(dishRoute);
  }

  // Build Informational & Legal Pages
  await writePage('/about-us/', renderAbout(), assetHash);
  routes.push('/about-us/');

  await writePage('/contact-us/', renderContact(), assetHash);
  routes.push('/contact-us/');

  await writePage('/disclaimer/', renderDisclaimer(), assetHash);
  routes.push('/disclaimer/');

  await writePage('/privacy-policy/', renderPrivacy(), assetHash);
  routes.push('/privacy-policy/');

  // Build 404 page
  await writePage('/404.html', render404(), assetHash);

  // 5. Copy root favicon and headers files
  const rootCopies = [
    { src: 'public/favicon.svg', dest: 'dist/favicon.svg' },
    { src: 'public/favicon.ico', dest: 'dist/favicon.ico' },
    { src: 'public/apple-touch-icon.png', dest: 'dist/apple-touch-icon.png' },
    { src: 'public/site.webmanifest', dest: 'dist/site.webmanifest' },
    { src: 'public/_headers', dest: 'dist/_headers' }
  ];

  rootCopies.forEach(({ src, dest }) => {
    const fullSrc = path.join(__dirname, src);
    const fullDest = path.join(__dirname, dest);
    if (fs.existsSync(fullSrc)) {
      copyFileSync(fullSrc, fullDest);
    }
  });

  // 6. Image Size Budget Guards
  console.log('\n🛡️ Checking Image Size Budgets...');
  const optDir = path.join(__dirname, 'public', 'images', 'optimized');
  if (fs.existsSync(optDir)) {
    const optFiles = fs.readdirSync(optDir);
    for (const f of optFiles) {
      const p = path.join(optDir, f);
      const stat = fs.statSync(p);
      if (stat.size > 130 * 1024) {
        throw new Error(`Size budget exceeded: Optimized image ${f} is ${(stat.size / 1024).toFixed(1)} KB (budget: 130 KB)`);
      }
    }
  }

  const rawImagesDir = path.join(__dirname, 'public', 'images');
  if (fs.existsSync(rawImagesDir)) {
    const rawFiles = fs.readdirSync(rawImagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
    for (const f of rawFiles) {
      const p = path.join(rawImagesDir, f);
      const stat = fs.statSync(p);
      if (stat.size > 975 * 1024) {
        throw new Error(`Size budget exceeded: Original image ${f} is ${(stat.size / 1024).toFixed(1)} KB (budget: 975 KB)`);
      }
    }
  }
  console.log('  ✓ All optimized and source images pass strict size budget guards');

  // 7. Generate SEO automation files
  console.log('\n🗺️ Generating SEO files...');
  generateSitemap(routes);
  generateRobots();

  const totalTime = Date.now() - startTime;
  console.log(`\n✨ Build completed successfully in ${totalTime}ms! Output folder: ./dist/\n`);
}

build().catch(err => {
  console.error('\n❌ Build failed:', err);
  process.exit(1);
});
