const fs = require('fs');
const path = require('path');

// 1. Update src/utils/date.js
const dateJs = `/**
 * Centralized Dynamic Date Helper
 * Guarantees dynamic month and year across all pages, titles, footers, schema, and coupons.
 */
const config = require('../../data/site.config.js');

function getDynamicDate() {
  const now = new Date();
  const timeZone = config.SITE_TIMEZONE || 'America/Los_Angeles';
  
  const formatterMonth = new Intl.DateTimeFormat('en-US', { timeZone, month: 'long' });
  const formatterYear = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric' });
  const formatterDate = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });

  const currentMonth = formatterMonth.format(now);
  const currentYear = formatterYear.format(now);
  const currentMonthYear = \`\${currentMonth} \${currentYear}\`;
  
  // Also get the parts for precise dateModified if needed
  const dateParts = formatterDate.formatToParts(now);
  const y = dateParts.find(p => p.type === 'year').value;
  const m = dateParts.find(p => p.type === 'month').value;
  const d = dateParts.find(p => p.type === 'day').value;
  const yyyymmdd = \`\${y}-\${m}-\${d}\`;

  return {
    now,
    currentMonth,
    currentYear,
    currentMonthYear,
    yyyymmdd
  };
}

module.exports = {
  getDynamicDate
};
`;
fs.writeFileSync('src/utils/date.js', dateJs, 'utf8');

// Update data/site.config.js
let siteConfig = fs.readFileSync('data/site.config.js', 'utf8');
if (!siteConfig.includes('SITE_TIMEZONE')) {
  siteConfig = siteConfig.replace('module.exports = {', "module.exports = {\n  SITE_TIMEZONE: 'America/Los_Angeles',");
  fs.writeFileSync('data/site.config.js', siteConfig, 'utf8');
}

// 2. Fix home.js static occurrences
let homeJs = fs.readFileSync('src/pages/home.js', 'utf8');
homeJs = homeJs.replace(/October 2026/g, '${currentMonthYear}');
homeJs = homeJs.replace(/2026/g, '${currentYear}');
fs.writeFileSync('src/pages/home.js', homeJs, 'utf8');

// 3. Fix menu.js static occurrences
let menuJs = fs.readFileSync('src/pages/menu.js', 'utf8');
menuJs = menuJs.replace(/October 2026/g, '${currentMonthYear}');
menuJs = menuJs.replace(/2026/g, '${currentYear}');
fs.writeFileSync('src/pages/menu.js', menuJs, 'utf8');

// 4. Fix 404.js static occurrences
let notFoundJs = fs.readFileSync('src/pages/404.js', 'utf8');
notFoundJs = notFoundJs.replace(/October 2026/g, '${currentMonthYear}');
notFoundJs = notFoundJs.replace(/2026/g, '${currentYear}');
fs.writeFileSync('src/pages/404.js', notFoundJs, 'utf8');

// 5. Fix savings-calculator.js and privacy.js etc if they contain 2026
['src/pages/savings-calculator.js', 'src/pages/privacy.js', 'src/pages/disclaimer.js', 'src/pages/about.js', 'src/pages/contact.js', 'src/pages/dish.js', 'src/pages/nutrition.js', 'src/templates/footer.js'].forEach(file => {
  if (fs.existsSync(file)) {
    let fileJs = fs.readFileSync(file, 'utf8');
    let changed = false;
    if (fileJs.includes('October 2026')) { fileJs = fileJs.replace(/October 2026/g, '${currentMonthYear}'); changed = true; }
    if (fileJs.includes('2026')) { fileJs = fileJs.replace(/2026/g, '${currentYear}'); changed = true; }
    if (changed) fs.writeFileSync(file, fileJs, 'utf8');
  }
});

// 6. Update build.js for dynamic date replacement
let buildJs = fs.readFileSync('build.js', 'utf8');
if (!buildJs.includes('pageData.content = pageData.content')) {
  buildJs = buildJs.replace(
    `  let finalHtml = fullHtml;`,
    `  // Replace admin templates
  fullHtml = fullHtml.replace(/{{MONTH_YEAR}}/g, currentMonthYear);
  fullHtml = fullHtml.replace(/{{MONTH}}/g, currentMonth);
  fullHtml = fullHtml.replace(/{{YEAR}}/g, currentYear);
  
  // Check for literal remaining current/previous-year strings
  const hardcodedPattern = new RegExp(\`\\\\b(January|February|March|April|May|June|July|August|September|October|November|December)\\\\s(2025|2026)\\\\b\`, 'g');
  let match;
  while ((match = hardcodedPattern.exec(fullHtml)) !== null) {
    console.warn(\`  ⚠️  WARNING: Found hardcoded date '\${match[0]}' in \${routePath}\`);
  }
  const yearPattern = /\\b(2025|2026)\\b/g;
  while ((match = yearPattern.exec(fullHtml)) !== null) {
    console.warn(\`  ⚠️  WARNING: Found hardcoded year '\${match[0]}' in \${routePath}\`);
  }

  let finalHtml = fullHtml;`
  );
  fs.writeFileSync('build.js', buildJs, 'utf8');
}

// 7. Update server.js scheduler for rebuild
let serverJs = fs.readFileSync('server.js', 'utf8');
if (!serverJs.includes('setInterval(async () => {')) {
  const schedulerCode = `
// ==========================================
// MONTHLY REBUILD SCHEDULER
// ==========================================
const { getDynamicDate } = require('./src/utils/date');
function checkAndRebuild() {
  const { currentMonthYear } = getDynamicDate();
  const buildMonthFile = path.join(DIST_DIR, '.build-month');
  let lastBuildMonth = '';
  if (fs.existsSync(buildMonthFile)) {
    lastBuildMonth = fs.readFileSync(buildMonthFile, 'utf8').trim();
  }
  
  if (lastBuildMonth !== currentMonthYear) {
    console.log(\`[Scheduler] Month changed from '\${lastBuildMonth}' to '\${currentMonthYear}'. Triggering rebuild.\`);
    publisher.runPublish().then(res => {
      if (res.success) {
        fs.writeFileSync(buildMonthFile, currentMonthYear, 'utf8');
        console.log(\`[Scheduler] Rebuild successful.\`);
      } else {
        console.error(\`[Scheduler] Rebuild failed.\`);
      }
    }).catch(err => {
      console.error(\`[Scheduler] Rebuild error:\`, err);
    });
  }
}
setInterval(checkAndRebuild, 3600000); // Check hourly
setTimeout(checkAndRebuild, 5000); // Check on startup after 5 seconds
`;
  serverJs = serverJs.replace(
    "server.listen(PORT, () => {",
    schedulerCode + "\nserver.listen(PORT, () => {"
  );
  fs.writeFileSync('server.js', serverJs, 'utf8');
}

// 8. Add script scripts/find-hardcoded-dates.js
const checkDatesJs = `
const fs = require('fs');
const path = require('path');
const DIST_DIR = path.join(__dirname, '../dist');

function scanDir(dir) {
  let files = fs.readdirSync(dir);
  let failed = false;
  for (let file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (scanDir(fullPath)) failed = true;
    } else if (fullPath.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\\n');
      lines.forEach((line, i) => {
        const monthYearMatch = line.match(/\\b(January|February|March|April|May|June|July|August|September|October|November|December)\\s(2025|2026)\\b/g);
        if (monthYearMatch) {
          console.error(\`Found \${monthYearMatch.join(', ')} in \${fullPath}:\${i + 1}\`);
          failed = true;
        }
      });
    }
  }
  return failed;
}

if (!fs.existsSync(DIST_DIR)) {
  console.log('No dist directory, passing.');
  process.exit(0);
}

if (scanDir(DIST_DIR)) {
  process.exit(1);
} else {
  console.log('No hardcoded dates found.');
  process.exit(0);
}
`;
fs.writeFileSync('scripts/find-hardcoded-dates.js', checkDatesJs, 'utf8');

console.log('Phase 2 scripts created');
