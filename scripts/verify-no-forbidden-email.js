/**
 * Guard Script: Verify No Forbidden Email References
 * Ensures that forbidden legacy email variations never appear anywhere in the repository.
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Construct forbidden patterns from fragments so this script does not flag itself
const FORBIDDEN_FRAGMENTS = [
  ['help', '@', 'pandacoupons.org'].join(''),
  ['help', ' [at] ', 'pandacoupons.org'].join(''),
  ['help', '(at)', 'pandacoupons'].join(''),
  ['help', '&#64;', 'pandacoupons'].join('')
];

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist'
]);

function scanDirectory(dir, issues = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, issues);
    } else if (entry.isFile()) {
      // Exclude binary files and this script itself
      if (entry.name.match(/\.(jpg|jpeg|png|webp|woff2|woff|ttf|ico|pdf|zip)$/i)) continue;
      if (fullPath === __filename) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      const contentLower = content.toLowerCase();

      for (const pattern of FORBIDDEN_FRAGMENTS) {
        if (contentLower.includes(pattern.toLowerCase())) {
          issues.push({
            file: path.relative(ROOT_DIR, fullPath),
            pattern
          });
        }
      }
    }
  }
  return issues;
}

function verifyNoForbiddenEmail() {
  console.log('🔍 Scanning repository for forbidden legacy email variations...');
  const issues = scanDirectory(ROOT_DIR);

  if (issues.length > 0) {
    console.error(`\n❌ Found ${issues.length} forbidden email reference(s):`);
    issues.forEach(iss => {
      console.error(`  - ${iss.file} contains forbidden string "${iss.pattern}"`);
    });
    process.exit(1);
  }

  console.log('✅ Zero forbidden email references found across the repository.');
}

if (require.main === module) {
  verifyNoForbiddenEmail();
}

module.exports = verifyNoForbiddenEmail;
