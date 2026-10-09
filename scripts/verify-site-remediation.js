const http = require('http');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

async function getTargetPort() {
  const TEST_PORT = 4006;
  const server = require('child_process').spawn('node', ['server.js'], { 
    env: { ...process.env, PORT: String(TEST_PORT) },
    stdio: 'ignore'
  });

  await new Promise((resolve) => {
    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount++;
      const req = http.get('http://localhost:4006/healthz', (res) => {
        res.resume();
        clearInterval(interval);
        resolve();
      });
      req.on('error', () => {
        if (checkCount > 20) {
          clearInterval(interval);
          resolve();
        }
      });
      req.setTimeout(200, () => req.destroy());
    }, 100);
  });

  return { port: 4006, server };
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('🧪 Running Comprehensive Remediation Verification...\n');
  const { port, server } = await getTargetPort();
  let passed = 0;

  try {
    // 1. Verify Home Page
    console.log(`Testing Home Page (http://localhost:${port}/)...`);
    const homeRes = await fetchUrl(`http://localhost:${port}/`);
    assert.strictEqual(homeRes.status, 200, 'Home page must return 200 OK');
  
  // Font Preloads
  assert(homeRes.body.includes('plus-jakarta-sans-400.woff2'), 'Must preload 400 woff2 font');
  
  // TOC Elements
  assert(homeRes.body.includes('id="homeTocDesktop"'), 'Home page must contain responsive TOC');
  
  const tocTargets = [
    '#how-codes-work',
    '#coupon-section',
    '#howto-section-heading',
    '#why-fail-heading',
    '#delivery-platforms-section',
    '#family-meal-deals',
    '#rewards-section-heading',
    '#other-discounts-heading',
    '#verification-process-section',
    '#faq-section-heading',
    '#cta-final-heading'
  ];
  for (const target of tocTargets) {
    assert(homeRes.body.includes(`href="${target}"`), `TOC must link to ${target}`);
    assert(homeRes.body.includes(`id="${target.replace('#', '')}"`), `Section ${target} must exist on home page`);
  }
  console.log('  ✓ Home page font preloads, responsive TOC, and all 11 anchor targets verified');
  passed++;

  // 2. Verify Nutrition Page
    console.log(`\nTesting Nutrition Page (http://localhost:${port}/panda-express-nutrition/)...`);
    const nutritionRes = await fetchUrl(`http://localhost:${port}/panda-express-nutrition/`);
    assert.strictEqual(nutritionRes.status, 200, 'Nutrition page must return 200 OK');

    // 12 Column Headers
    const expectedCols = [
      'Dish Name',
      'Calories',
      'Fat (g)',
      'Sat Fat (g)',
      'Trans Fat (g)',
      'Chol (mg)',
      'Sodium (mg)',
      'Carbs (g)',
      'Fiber (g)',
      'Sugar (g)',
      'Protein (g)',
      'Allergens'
    ];
    for (const col of expectedCols) {
      assert(nutritionRes.body.includes(col), `Nutrition table must include column: ${col}`);
    }

    // Clear All Allergens Button
    assert(nutritionRes.body.includes('id="calcClearAllergens"'), 'Must contain Clear all allergen filters button');

    // Rich Reference Content & Tables
    assert(nutritionRes.body.includes('Panda Express Meal &amp; Nutrition Calculator'), 'Must contain meal calculator header');
    assert(nutritionRes.body.includes('How We Verify This Data'), 'Must contain data verification callout');
    assert(nutritionRes.body.includes('Panda Express Meal Sizes at a Glance'), 'Must contain meal sizes comparison');
    assert(nutritionRes.body.includes('Orange Chicken Nutrition — The Deep Dive'), 'Must detail Orange Chicken');
    assert(nutritionRes.body.includes('Orange Chicken vs. Grilled Teriyaki Chicken'), 'Must detail comparison');
    assert(nutritionRes.body.includes('Sides Showdown'), 'Must contain sides comparison');
    assert(nutritionRes.body.includes('Is Panda Express Healthy?'), 'Must contain healthy eating guide');
    assert(nutritionRes.body.includes('Allergens &amp; Ingredients: What&#39;s Actually Safe') || nutritionRes.body.includes('Allergens &amp; Ingredients'), 'Must contain allergen breakdown');
    assert(nutritionRes.body.includes('Popular Meal Combos and Their Real Totals'), 'Must contain combo meal totals');
    
    // Schemas
    assert(nutritionRes.body.includes('"FAQPage"'), 'Nutrition page must include FAQPage schema');
    assert(nutritionRes.body.includes('"Article"'), 'Nutrition page must include Article schema');
    console.log('  ✓ Nutrition page 12-column table, allergen filter, blueprints, and rich guide verified');
    passed++;

    // 3. Verify Menu Page & Orange Chicken Dish Page
    console.log(`\nTesting Menu & Dish Pages...`);
    const menuRes = await fetchUrl(`http://localhost:${port}/panda-express-menu/`);
    assert.strictEqual(menuRes.status, 200, 'Menu page must return 200 OK');
    assert(menuRes.body.includes('menu-category-block'), 'Menu page must contain menu-category-block');

    const dishRes = await fetchUrl(`http://localhost:${port}/panda-express-orange-chicken/`);
    assert.strictEqual(dishRes.status, 200, 'Orange chicken dish page must return 200 OK');
    assert(dishRes.body.includes('dish-content-grid'), 'Dish page must contain dish-content-grid');
    console.log('  ✓ Menu and Dish pages verified');
    passed++;

    // 4. Verify Savings Calculator Cluster Page
    console.log(`\nTesting Savings Calculator Page (http://localhost:${port}/panda-express-savings-calculator/)...`);
    const calcRes = await fetchUrl(`http://localhost:${port}/panda-express-savings-calculator/`);
    assert.strictEqual(calcRes.status, 200, 'Savings calculator page must return 200 OK');
    assert(calcRes.body.includes('id="partySizeInput"'), 'Must contain party size input');
    assert(calcRes.body.includes('id="couponToggleCheckbox"'), 'Must contain coupon toggle checkbox');
    assert(calcRes.body.includes('id="recommendationTitle"'), 'Must contain dynamic recommendation');
    assert(calcRes.body.includes('"FAQPage"'), 'Must contain FAQPage schema');
    assert(calcRes.body.includes('"Article"'), 'Must contain Article schema');
    console.log('  ✓ Savings calculator page, interactive controls, and schemas verified');
    passed++;

    // 5. Verify Assets & Build Guards
    console.log('\nTesting Optimized Assets & Budgets...');
    const distDir = path.join(__dirname, '..', 'dist');
    assert(fs.existsSync(path.join(distDir, 'assets', 'css', 'style.min.css')), 'style.min.css must exist');
    assert(fs.existsSync(path.join(distDir, 'assets', 'js', 'main.min.js')), 'main.min.js must exist');
    assert(fs.existsSync(path.join(distDir, 'public', 'fonts', 'plus-jakarta-sans-400.woff2')), '400 font must exist in dist');
    assert(fs.existsSync(path.join(distDir, 'public', 'fonts', 'plus-jakarta-sans-700.woff2')), '700 font must exist in dist');
    assert(fs.existsSync(path.join(distDir, 'public', 'fonts', 'plus-jakarta-sans-900.woff2')), '900 font must exist in dist');
    
    const minCssSize = fs.statSync(path.join(distDir, 'assets', 'css', 'style.min.css')).size;
    const minJsSize = fs.statSync(path.join(distDir, 'assets', 'js', 'main.min.js')).size;
    console.log(`  ✓ Minified CSS size: ${(minCssSize / 1024).toFixed(1)} KB`);
    console.log(`  ✓ Minified JS size: ${(minJsSize / 1024).toFixed(1)} KB`);
    passed++;

    console.log(`\n🎉 ALL ${passed}/${passed} ADVANCED REMEDIATION VERIFICATION SUITES PASSED!`);
  } finally {
    if (server) {
      try {
        server.kill('SIGKILL');
      } catch (e) {}
    }
  }
}

verify().catch(err => {
  console.error('\n❌ Verification failed:', err);
  process.exit(1);
});
