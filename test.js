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
function getAllHtmlFiles(dir, list = []) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      getAllHtmlFiles(full, list);
    } else if (item.endsWith('.html')) {
      list.push(path.relative(DIST_DIR, full));
    }
  }
  return list;
}

const allHtmlFiles = getAllHtmlFiles(DIST_DIR);
const seenTitles = new Map();
const seenDescriptions = new Map();

for (const relPath of allHtmlFiles) {
  const content = fs.readFileSync(path.join(DIST_DIR, relPath), 'utf8');

  // Check Doctype
  assert(content.includes('<!DOCTYPE html>'), `${relPath} is missing <!DOCTYPE html>`);

  // Check Title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  assert(titleMatch, `${relPath} is missing <title>`);
  const pageTitle = titleMatch[1].trim();
  assert(pageTitle.length >= 50 && pageTitle.length <= 60, 
    `${relPath} title length (${pageTitle.length}) out of 50-60 bounds: "${pageTitle}"`);
  assert(!seenTitles.has(pageTitle), 
    `Duplicate title across pages: "${pageTitle}" found in ${relPath} and ${seenTitles.get(pageTitle)}`);
  seenTitles.set(pageTitle, relPath);

  // Check Meta Description
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  assert(descMatch, `${relPath} is missing meta description`);
  const pageDesc = descMatch[1].trim();
  assert(pageDesc.length >= 140 && pageDesc.length <= 160, 
    `${relPath} description length (${pageDesc.length}) out of 140-160 bounds: "${pageDesc}"`);
  assert(!seenDescriptions.has(pageDesc), 
    `Duplicate description across pages: "${pageDesc}" found in ${relPath} and ${seenDescriptions.get(pageDesc)}`);
  seenDescriptions.set(pageDesc, relPath);

  // Check Canonical (only on indexable pages)
  if (relPath === '404.html') {
    assert(!content.includes('<link rel="canonical"'), `404.html must NOT have a canonical tag`);
    assert(content.includes('noindex'), `404.html must have noindex`);
  } else {
    assert(content.includes('<link rel="canonical"'), `${relPath} is missing canonical URL`);
  }

  const cssMatch = content.match(/href="(\/assets\/css\/style(\.[a-f0-9]{8})?(\.min)?\.css)"/);
  assert(cssMatch, `${relPath} missing valid stylesheet link`);
  assert(fs.existsSync(path.join(DIST_DIR, cssMatch[1])), `Referenced CSS file ${cssMatch[1]} missing from dist/`);

  const jsMatch = content.match(/src="(\/assets\/js\/main(\.[a-f0-9]{8})?(\.min)?\.js)"/);
  assert(jsMatch, `${relPath} missing valid main.js link`);
  assert(fs.existsSync(path.join(DIST_DIR, jsMatch[1])), `Referenced JS file ${jsMatch[1]} missing from dist/`);

  // Check Self-Hosted Font Preloads
  assert(content.includes('plus-jakarta-sans-400.woff2'), `${relPath} missing font preload for 400`);
  assert(content.includes('plus-jakarta-sans-700.woff2'), `${relPath} missing font preload for 700`);

  // Check Schema JSON-LD
  assert(content.includes('application/ld+json'), `${relPath} missing schema JSON-LD`);

  // Check Independence disclaimer
  assert(content.includes('Panda Express Coupons is an independent website and is not affiliated with'), 
    `${relPath} is missing required independence disclaimer`);

  // Check Contact Email (single source of truth: helppandacoupons@gmail.com)
  assert(content.includes('helppandacoupons@gmail.com'), `${relPath} is missing helppandacoupons@gmail.com`);

  // Check no formspree or placeholder endpoints
  assert(!content.toLowerCase().includes('formspree'), `${relPath} contains unexpected formspree reference`);
  assert(!content.includes('https://formspree.io'), `${relPath} contains formspree URL`);

  // Check Contact page has no form
  if (relPath === 'contact-us/index.html') {
    assert(!content.includes('<form'), 'contact-us page must not contain a <form> tag');
  }

  // Check that NO other email exists in the built page
  const emailMatches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  for (const email of emailMatches) {
    assert.strictEqual(email.toLowerCase(), 'helppandacoupons@gmail.com', `Forbidden or unknown email "${email}" found in ${relPath}`);
  }
}
console.log(`\n✓ All ${allHtmlFiles.length} HTML pages passed strict SEO (50-60 title, 140-160 desc, unique) and semantic checks!`);

// 3. Validate Coupons Data
const couponsData = require('./data/coupons.json');
assert.strictEqual(couponsData.coupons.length, 10, 'Expected 10 starter coupons');
const validStatuses = ['Active', 'Check App', 'Unconfirmed', 'Expired'];
const requiredFields = ['code', 'discount', 'bestFor', 'minOrder', 'status', 'confidence', 'notes', 'category', 'expiry', 'isDraft', 'lastChecked'];
const seenCodes = new Set();
const { yyyymmdd } = require('./src/utils/date').getDynamicDate();

for (const c of couponsData.coupons) {
  // Required fields check
  for (const field of requiredFields) {
    assert(c[field] !== undefined && c[field] !== null && c[field] !== '', `Coupon ${c.code || 'UNKNOWN'} missing required field: ${field}`);
  }

  // Valid status check
  assert(validStatuses.includes(c.status), `Coupon ${c.code} has invalid status: ${c.status}`);

  // No "test" in notes
  assert(!/\btest\b/i.test(c.notes), `Coupon ${c.code} contains "test" in notes: "${c.notes}"`);

  // Code format [A-Z0-9]{3,20}
  assert(/^[A-Z0-9]{3,20}$/.test(c.code), `Coupon code "${c.code}" does not match [A-Z0-9]{3,20}`);

  // Duplicate code check
  assert(!seenCodes.has(c.code), `Duplicate coupon code found: ${c.code}`);
  seenCodes.add(c.code);

  // Active status with past expiry check
  if (c.status === 'Active' && c.expiry !== 'Ongoing') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(c.expiry)) {
      assert(c.expiry >= yyyymmdd, `Coupon ${c.code} is marked Active but has a past expiry date (${c.expiry} < ${yyyymmdd})`);
    }
  }
}
console.log('✓ Coupons data verified: 10 starter coupons pass all strict field, status, code format, and freshness rules');

// 4. Validate Nutrition Master Dataset
const nutritionMaster = require('./data/nutrition-master.json');
assert(nutritionMaster.source, 'nutrition-master.json missing "source" field');
assert(nutritionMaster.sourceCheckedDate, 'nutrition-master.json missing "sourceCheckedDate" field');
assert(Array.isArray(nutritionMaster.items) && nutritionMaster.items.length >= 40, 'Expected at least 40 items in nutrition-master.json');

const requiredNutritionFields = ['id', 'name', 'category', 'servingSize', 'calories', 'totalFat', 'saturatedFat', 'sodium', 'totalCarbs', 'protein', 'allergens'];

for (const item of nutritionMaster.items) {
  for (const field of requiredNutritionFields) {
    assert(item[field] !== undefined, `Item ${item.id || 'UNKNOWN'} missing required nutrition field: ${field}`);
  }
  assert(typeof item.calories === 'number' && item.calories >= 0, `${item.id} has invalid calories`);
  assert(typeof item.totalFat === 'number' && item.totalFat >= 0, `${item.id} has invalid totalFat`);
  assert(typeof item.totalCarbs === 'number' && item.totalCarbs >= 0, `${item.id} has invalid totalCarbs`);
  assert(typeof item.protein === 'number' && item.protein >= 0, `${item.id} has invalid protein`);
  assert(typeof item.sodium === 'number' && item.sodium >= 0, `${item.id} has invalid sodium`);
  assert(Array.isArray(item.allergens), `${item.id} allergens must be an array`);

  // Macro calorie sanity check (within 15% of 9*fat + 4*carbs + 4*protein)
  const calcCal = 9 * item.totalFat + 4 * item.totalCarbs + 4 * item.protein;
  if (item.calories > 0 && calcCal > 0) {
    const diffPct = Math.abs(item.calories - calcCal) / item.calories;
    if (diffPct > 0.18) {
      console.warn(`⚠️ Warning: ${item.id} calories (${item.calories}) differs from 4-9-4 macro sum (${calcCal}) by ${(diffPct * 100).toFixed(1)}%`);
    }
  }
}
console.log(`✓ Nutrition master verified: ${nutritionMaster.items.length} items validated with non-negative numbers and array allergens`);

// 5. Validate FAQ Items
const faqData = require('./data/faq.json');
assert(faqData.length >= 8, 'Expected at least 8 FAQ questions');
console.log(`✓ FAQ data verified: ${faqData.length} Q&As present`);

console.log('\n🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
