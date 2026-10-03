const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');
const files = fs.readdirSync(pagesDir).map(f => path.join(pagesDir, f));
files.push(path.join(__dirname, '../src/templates/footer.js'));

for (const file of files) {
  if (!file.endsWith('.js')) continue;
  
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('${currentYear}') || content.includes('${currentMonthYear}')) {
    // Need to add import
    if (!content.includes("require('../utils/date')") && !content.includes("require('../../utils/date')")) {
      const isTemplateDir = file.includes('/templates/');
      const reqPath = isTemplateDir ? "'../utils/date'" : "'../utils/date'";
      content = `const { getDynamicDate } = require(${reqPath});\n` + content;
      changed = true;
    }
    
    // Need to add destructuring inside render function
    const renderMatch = content.match(/function\s+render[A-Za-z0-9_]*\s*\([^)]*\)\s*\{/);
    if (renderMatch && !content.includes('const { currentMonthYear, currentMonth, currentYear } = getDynamicDate();')) {
      content = content.replace(renderMatch[0], `${renderMatch[0]}\n  const { currentMonthYear, currentMonth, currentYear } = getDynamicDate();`);
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
}
