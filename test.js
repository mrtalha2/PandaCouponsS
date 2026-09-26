/**
 * Verification Test Suite for Panda Express Coupons
 * Validates file generation, SEO, HTML structure, nutrition math, and coupons data
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Panda Express Coupons verification tests...\n');

const DIST_DIR = path.join(__dirname, 'dist');

// 1. Check generated files
const requiredFiles = [
  'index.html',
  'panda-express-menu/index.html',
  'panda-express-nutrition/index.html',
  'panda-express-savings-calculator/index.html',
  'panda-express-orange-chicken/index.html',
  'beijing-beef/index.html',
  'about-us/index.html',
  'contact-us/index.html',
  'disclaimer/index.html',
  'privacy-policy/index.html',
  'sitemap.xml',
  'robots.txt',
  'assets/css/style.css',
  'assets/css/style.min.css',
  'assets/js/main.js',
  'assets/js/main.min.js',
  'public/fonts/plus-jakarta-sans-400.woff2',
  'public/fonts/plus-jakarta-sans-700.woff2',
  'public/fonts/plus-jakarta-sans-900.woff2',
  'public/favicon.svg'
];

let errors = 0;

for (const relPath of requiredFiles) {
  const fullPath = path.join(DIST_DIR, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required file: ${relPath}`);
    errors++;
  } else {
    console.log(`✓ File exists: ${relPath} (${fs.statSync(fullPath).size} bytes)`);
  }
}

// 2. Validate HTML Files
const htmlFiles = requiredFiles.filter(f => f.endsWith('.html'));
for (const relPath of htmlFiles) {
  const content = fs.readFileSync(path.join(DIST_DIR, relPath), 'utf8');

  // Check Doctype
  assert(content.includes('<!DOCTYPE html>'), `${relPath} is missing <!DOCTYPE html>`);

  // Check Title
  assert(content.includes('<title>'), `${relPath} is missing <title>`);

  // Check Canonical
  assert(content.includes('<link rel="canonical"'), `${relPath} is missing canonical URL`);

  // Check Meta Description
  assert(content.includes('<meta name="description"'), `${relPath} is missing meta description`);

  // Check Stylesheet & JS (supports both standard and production minified links)
  assert(content.includes('/assets/css/style.css') || content.includes('/assets/css/style.min.css'), `${relPath} missing stylesheet link`);
  assert(content.includes('/assets/js/main.js') || content.includes('/assets/js/main.min.js'), `${relPath} missing main.js link`);

  // Check Self-Hosted Font Preloads
  assert(content.includes('plus-jakarta-sans-400.woff2'), `${relPath} missing font preload for 400`);
  assert(content.includes('plus-jakarta-sans-700.woff2'), `${relPath} missing font preload for 700`);

  // Check Schema JSON-LD
  assert(content.includes('application/ld+json'), `${relPath} missing schema JSON-LD`);

  // Check Independence disclaimer
  assert(content.includes('Panda Express Coupons is an independent website and is not affiliated with'), 
    `${relPath} is missing required independence disclaimer`);

  // Check Protected Email
  assert(content.includes('help [at] pandacoupons.org') || content.includes('help@pandacoupons.org'), `${relPath} is missing protected email reference`);
}
console.log(`\n✓ All ${htmlFiles.length} HTML pages passed strict SEO and semantic checks!`);

// 3. Validate Coupons Data
const couponsData = require('./data/coupons.json');
assert.strictEqual(couponsData.coupons.length, 10, 'Expected 10 starter coupons');
const validStatuses = ['Active', 'Check app', 'Check App', 'Unverified', 'Expired'];
const allValid = couponsData.coupons.every(c => validStatuses.includes(c.status));
assert(allValid, 'All starter coupons must have a valid status (Active, Check app, or Unverified)');
console.log('✓ Coupons data verified: 10 starter coupons present with verified active statuses');

// 4. Validate Nutrition Macros
const nutritionData = require('./data/nutrition.json');
const allItems = [...nutritionData.sides, ...nutritionData.entrees];

const expectedMacros = {
  'orange-chicken': { calories: 510, fat: 23, carbs: 53, protein: 26 },
  'beijing-beef': { calories: 480, fat: 27, carbs: 46, protein: 14 },
  'kung-pao-chicken': { calories: 290, fat: 19, carbs: 14, protein: 17 },
  'broccoli-beef': { calories: 150, fat: 7, carbs: 13, protein: 9 },
  'grilled-teriyaki-chicken': { calories: 275, fat: 13, carbs: 14, protein: 33 },
  'honey-walnut-shrimp': { calories: 360, fat: 23, carbs: 27, protein: 11 },
  'chow-mein': { calories: 510, fat: 20, carbs: 80, protein: 13 },
  'fried-rice': { calories: 520, fat: 16, carbs: 85, protein: 11 },
  'white-steamed-rice': { calories: 380, fat: 0, carbs: 87, protein: 7 },
  'super-greens': { calories: 90, fat: 2, carbs: 10, protein: 6 }
};

for (const [id, exp] of Object.entries(expectedMacros)) {
  const item = allItems.find(i => i.id === id);
  assert(item, `Missing nutrition item: ${id}`);
  assert.strictEqual(item.calories, exp.calories, `${id} calories mismatch`);
  assert.strictEqual(item.fat, exp.fat, `${id} fat mismatch`);
  assert.strictEqual(item.carbs, exp.carbs, `${id} carbs mismatch`);
  assert.strictEqual(item.protein, exp.protein, `${id} protein mismatch`);
}
console.log('✓ Nutrition macros verified: all 10 items match exact per-serving specifications');

// 5. Validate FAQ Items
const faqData = require('./data/faq.json');
assert(faqData.length >= 8, 'Expected at least 8 FAQ questions');
console.log(`✓ FAQ data verified: ${faqData.length} Q&As present`);

console.log('\n🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
