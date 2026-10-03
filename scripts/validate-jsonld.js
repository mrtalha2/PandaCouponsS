const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validating JSON-LD in dist/**/*.html...');

const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  console.log('No dist directory found. Skipping.');
  process.exit(0);
}

function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = findHtmlFiles(distDir);
let errors = 0;

htmlFiles.forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  const matches = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  for (const match of matches) {
    try {
      const schemas = JSON.parse(match[1]);
      const list = Array.isArray(schemas) ? schemas : [schemas];
      list.forEach(schema => {
        if (!schema['@type']) {
          console.error(`❌ [${file}] Missing @type in schema`);
          errors++;
          return;
        }
        
        // Basic required field checks
        if (schema['@type'] === 'Organization') {
          if (!schema.name || !schema.url || !schema.contactPoint) {
            console.error(`❌ [${file}] Organization missing required fields (name, url, contactPoint)`);
            errors++;
          }
        }
        if (schema['@type'] === 'Article' || schema['@type'] === 'WebPage') {
          if (!schema.dateModified) {
            console.error(`❌ [${file}] ${schema['@type']} missing dateModified`);
            errors++;
          }
        }
      });
    } catch (e) {
      console.error(`❌ [${file}] Invalid JSON in JSON-LD:`, e.message);
      errors++;
    }
  }
});

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✓ JSON-LD validation passed successfully.');
}
