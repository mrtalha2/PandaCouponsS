const fs = require('fs');
const path = require('path');
const config = require('../data/site.config');

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

const forbiddenTypes = ['Product', 'Review', 'AggregateRating', 'aggregateRating'];

function checkUrlsInObject(obj, file) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      if (val.startsWith('http://') || val.startsWith('https://')) {
        if (!val.startsWith('https://schema.org') &&
            !val.startsWith('http://schema.org') &&
            !val.startsWith('https://twitter.com') &&
            !val.startsWith('https://facebook.com') &&
            !val.startsWith('https://instagram.com') &&
            !val.startsWith('https://pinterest.com')) {
          if (!val.startsWith(config.domain)) {
            console.error(`❌ [${file}] JSON-LD URL "${val}" does not use canonical domain "${config.domain}"`);
            errors++;
          }
        }
      }
    } else if (typeof val === 'object') {
      checkUrlsInObject(val, file);
    }
  }
}

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

        if (forbiddenTypes.includes(schema['@type'])) {
          console.error(`❌ [${file}] Forbidden schema type found: ${schema['@type']}`);
          errors++;
        }

        checkUrlsInObject(schema, file);

        // Required field checks
        if (schema['@type'] === 'Organization') {
          if (!schema.name || !schema.url || !schema.contactPoint) {
            console.error(`❌ [${file}] Organization missing required fields (name, url, contactPoint)`);
            errors++;
          }
        } else if (schema['@type'] === 'WebSite') {
          if (!schema.name || !schema.url) {
            console.error(`❌ [${file}] WebSite missing name or url`);
            errors++;
          }
        } else if (schema['@type'] === 'FAQPage') {
          if (!schema.mainEntity || !Array.isArray(schema.mainEntity) || schema.mainEntity.length === 0) {
            console.error(`❌ [${file}] FAQPage missing mainEntity array`);
            errors++;
          }
          if (!html.includes('faq-item') && !html.includes('faq-section') && !html.includes('faq-accordion') && !html.includes('FAQ')) {
            console.error(`❌ [${file}] FAQPage schema present on page without visible FAQ content`);
            errors++;
          }
        } else if (schema['@type'] === 'Article') {
          if (!schema.headline || !schema.author || !schema.publisher || !schema.dateModified) {
            console.error(`❌ [${file}] Article missing required fields`);
            errors++;
          }
        } else if (schema['@type'] === 'MenuItem') {
          if (!schema.name || !schema.nutrition) {
            console.error(`❌ [${file}] MenuItem missing name or nutrition`);
            errors++;
          }
        } else if (schema['@type'] === 'BreadcrumbList') {
          if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
            console.error(`❌ [${file}] BreadcrumbList missing itemListElement`);
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
  console.log('✓ JSON-LD validation passed successfully: all canonical URLs, required fields, and clean schemas verified.');
}
