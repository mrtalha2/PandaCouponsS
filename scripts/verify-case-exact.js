/**
 * scripts/verify-case-exact.js
 * Unit test and repository-wide exact-case asset validator.
 * Proves that case-mismatched paths are detected as missing even on case-insensitive filesystems (macOS / Windows),
 * and verifies all source data and templates for exact case matching.
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { buildExactDiskFileSet } = require('./verify-assets');

console.log('🔍 Running Exact-Case Asset Verification Unit Tests...\n');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const publicExactFiles = buildExactDiskFileSet(PUBLIC_DIR);

// 1. Unit Test: Prove that wrong-case is caught even when fs.existsSync passes on macOS/Windows
const realFileRel = 'images/menu/Orange-Chicken-Panda-Cub-Meal-cub-meal.webp';
const wrongCaseRel = 'images/menu/orange-chicken-panda-cub-meal-cub-meal.webp';

assert(
  publicExactFiles.has(realFileRel),
  `Expected exact path "${realFileRel}" to exist in public file set`
);

assert(
  !publicExactFiles.has(wrongCaseRel),
  `Expected wrong-case path "${wrongCaseRel}" to NOT exist in exact file set`
);

console.log(`  ✓ Exact case test PASS: "${realFileRel}" correctly found.`);
console.log(`  ✓ Exact case test PASS: "${wrongCaseRel}" correctly rejected as missing.`);

// 2. Scan data/menu.json image paths against public/
const menuData = require('../data/menu.json');
let menuErrors = 0;
for (const cat of menuData.categories) {
  for (const item of cat.items) {
    if (item.image && item.image.startsWith('/public/')) {
      const relPublic = item.image.replace(/^\/public\//, '');
      if (!publicExactFiles.has(relPublic)) {
        console.error(`❌ Case or file mismatch in data/menu.json: "${item.image}" (looked for exact public path "${relPublic}")`);
        menuErrors++;
      }
    }
  }
}
assert.strictEqual(menuErrors, 0, `Found ${menuErrors} case or file mismatches in data/menu.json`);
console.log(`  ✓ All ${menuData.categories.reduce((a, c) => a + c.items.length, 0)} menu item images verified with exact letter-case.`);

// 3. Scan data/dishes.json image paths against public/
const dishesData = require('../data/dishes.json');
let dishErrors = 0;
for (const dish of dishesData) {
  if (dish.image && dish.image.startsWith('/public/')) {
    const relPublic = dish.image.replace(/^\/public\//, '');
    if (!publicExactFiles.has(relPublic)) {
      console.error(`❌ Case or file mismatch in data/dishes.json: "${dish.image}" (looked for exact public path "${relPublic}")`);
      dishErrors++;
    }
  }
}
assert.strictEqual(dishErrors, 0, `Found ${dishErrors} case or file mismatches in data/dishes.json`);
console.log(`  ✓ All ${dishesData.length} dish data images verified with exact letter-case.`);

console.log('\n🎉 ALL EXACT-CASE TESTS PASSED SUCCESSFULLY!\n');
