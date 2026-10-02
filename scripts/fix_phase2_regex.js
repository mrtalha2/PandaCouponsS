const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/home.js',
  'src/pages/menu.js',
  'src/pages/404.js',
  'src/pages/savings-calculator.js',
  'src/pages/privacy.js',
  'src/pages/disclaimer.js',
  'src/pages/about.js',
  'src/pages/contact.js',
  'src/pages/dish.js',
  'src/pages/nutrition.js',
  'src/templates/footer.js',
  'src/templates/layout.js'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s(2025|2026)\b/g, '{{MONTH_YEAR}}');
    content = content.replace(/([^${{])\b(2025|2026)\b/g, '$1{{YEAR}}');
    fs.writeFileSync(fullPath, content, 'utf8');
  }
});
