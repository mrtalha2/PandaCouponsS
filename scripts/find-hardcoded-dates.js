const fs = require('fs');
const path = require('path');

function scanDir(dir) {
  let files = fs.readdirSync(dir);
  let failed = false;
  for (let file of files) {
    if (file === 'backups') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (scanDir(fullPath)) failed = true;
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Find literal Month 2026 (excluding currentMonthYear variable logic)
        // Only warn for string literals containing the exact month year
        const match = line.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s(2025|2026)\b/g);
        if (match) {
          // Exclude comments and lines that are part of the token logic
          if (!line.includes('//') && !line.includes('lastVerifiedDate') && !line.includes('replace') && !line.includes('getDynamicDate')) {
            console.error(`Found literal date '${match.join(', ')}' in ${fullPath}:${i + 1}`);
            failed = true;
          }
        }
      });
    }
  }
  return failed;
}

let failed = false;
if (scanDir(path.join(__dirname, '../data/admin'))) failed = true;
if (scanDir(path.join(__dirname, '../src/pages'))) failed = true;
if (scanDir(path.join(__dirname, '../src/templates'))) failed = true;

if (failed) {
  process.exit(1);
} else {
  console.log('No hardcoded dates found.');
  process.exit(0);
}
