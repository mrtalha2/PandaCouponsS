const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, '../src/pages');
const files = fs.readdirSync(pagesDir).map(f => path.join(pagesDir, f));
files.push(path.join(__dirname, '../src/templates/footer.js'));

for (const file of files) {
  if (!file.endsWith('.js')) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove existing permutations
  content = content.replace(/^[ \t]*const \{[^}]*currentMonthYear[^}]*\} = getDynamicDate\(\);\r?\n/gm, '');
  content = content.replace(/^[ \t]*const \{[^}]*currentYear[^}]*\} = getDynamicDate\(\);\r?\n/gm, '');

  fs.writeFileSync(file, content, 'utf8');
}
