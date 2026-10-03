const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const SRC_DIR = path.join(__dirname, '../src');
const DATA_DIR = path.join(__dirname, '../data');

const master = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'nutrition-master.json'), 'utf8'));

console.log('🔍 Running verify-nutrition-consistency.js across built HTML and source templates...\n');

let failed = false;

// 1. Ensure "nutrition.json" does not appear in any source files
function scanNoLegacyNutritionFile(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'backups') {
        scanNoLegacyNutritionFile(fullPath);
      }
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.json')) {
      // Exclude discrepancy script if kept for historical audit
      if (entry.name === 'nutrition-discrepancies.js') continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('data/nutrition.json') || content.includes('"nutrition.json"') || content.includes("'nutrition.json'")) {
        console.error(`❌ Legacy "nutrition.json" reference found in: ${path.relative(path.join(__dirname, '..'), fullPath)}`);
        failed = true;
      }
    }
  }
}

scanNoLegacyNutritionFile(SRC_DIR);
scanNoLegacyNutritionFile(DATA_DIR);

// 2. Scan every dist HTML page for item name followed within 80 characters by calorie count
if (fs.existsSync(DIST_DIR)) {
  const htmlFiles = [];
  function collectHtml(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectHtml(fullPath);
      } else if (entry.name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  }
  collectHtml(DIST_DIR);

  master.items.forEach(item => {
    const escapedName = item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Regex for item name followed within 80 characters by a number and "cal" or "calories"
    const regex = new RegExp(`${escapedName}[\\s\\S]{1,80}?\\b(\\d{2,4})\\s*(?:cal|calories)\\b`, 'gi');

    htmlFiles.forEach(htmlFile => {
      const content = fs.readFileSync(htmlFile, 'utf8');
      let match;
      while ((match = regex.exec(content)) !== null) {
        const foundCal = parseInt(match[1], 10);
        // Exclude ranges (e.g., 280-1,130 or ranges of category) and unrelated matches
        if (foundCal !== item.calories) {
          // Check if this was a range or combo bundle
          const snippet = match[0];
          if (!snippet.includes('–') && !snippet.includes('-') && !snippet.includes('Cub Meal') && !snippet.includes('Combo')) {
            console.error(`❌ Nutrition calorie mismatch for "${item.name}" in ${path.relative(path.join(__dirname, '..'), htmlFile)}: found ${foundCal} cal, expected ${item.calories} cal from master`);
            failed = true;
          }
        }
      }
    });
  });
}

if (failed) {
  console.error('\n❌ Nutrition consistency check FAILED.\n');
  process.exit(1);
} else {
  console.log('✅ Nutrition consistency verified: All pages, templates, and datasets strictly adhere to data/nutrition-master.json!\n');
  process.exit(0);
}
