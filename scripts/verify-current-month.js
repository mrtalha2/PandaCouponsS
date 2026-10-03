const fs = require('fs');
const path = require('path');
const { getCurrentMonthYear, SITE_TIMEZONE } = require('../src/utils/date');

const currentMonthYear = getCurrentMonthYear();
console.log(`🔍 Verifying all rendered month/year dates match current month/year: "${currentMonthYear}" (${SITE_TIMEZONE})...`);

const DIST_DIR = path.join(__dirname, '../dist');
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ dist/ directory does not exist. Run "node build.js" first.');
  process.exit(1);
}

let failed = false;
let verifiedCount = 0;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const monthRegex = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d\d)\b/g;

  lines.forEach((line, lineIdx) => {
    let match;
    while ((match = monthRegex.exec(line)) !== null) {
      const foundDate = match[0];
      if (foundDate !== currentMonthYear) {
        // Exclude past historical context if explicitly about history (e.g. historical origins)
        // But for all coupon/updated/review stamps, fail if not current month
        console.error(`❌ Mismatched date "${foundDate}" (expected "${currentMonthYear}") in ${path.relative(path.join(__dirname, '..'), filePath)}:${lineIdx + 1}`);
        failed = true;
      } else {
        verifiedCount++;
      }
    }
  });
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.html') || entry.name === 'sitemap.xml') {
      scanFile(fullPath);
    }
  }
}

scanDir(DIST_DIR);

if (failed) {
  console.error('\n❌ Month verification FAILED: Found dates differing from the current month/year in SITE_TIMEZONE.\n');
  process.exit(1);
} else {
  console.log(`✓ All rendered dates (${verifiedCount} instances) match current month/year ("${currentMonthYear}")!\n`);
  process.exit(0);
}
