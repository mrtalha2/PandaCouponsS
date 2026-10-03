const fs = require('fs');

const filesToMigrate = [
  'data/admin/page-blocks.json',
  'data/admin/page-content.json',
  'data/admin/page-meta.json',
  'data/admin/site-injections.json'
];

filesToMigrate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace September 2026, October 2026, etc.
    content = content.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s(2025|2026)\b/g, '{{MONTH_YEAR}}');
    // Replace standalone 2026
    content = content.replace(/\b2026\b/g, '{{YEAR}}');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Migrated ${file}`);
  }
});
