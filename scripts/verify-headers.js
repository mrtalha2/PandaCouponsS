const fs = require('fs');
const path = require('path');
const { securityHeaders, cacheHeaders } = require('../headers.config');

console.log('🔍 Verifying headers consistency across headers.config.js, server.js, and public/_headers');

const _headersPath = path.join(__dirname, '../public/_headers');
const _headers = fs.readFileSync(_headersPath, 'utf8');

// Extract from _headers
const staticHeaders = {};
const rootLines = _headers.split('\n');
let inRoot = false;
rootLines.forEach(line => {
  if (line.startsWith('/*')) {
    inRoot = true;
  } else if (line.startsWith('/')) {
    inRoot = false;
  } else if (inRoot && line.includes(':')) {
    const [key, ...rest] = line.split(':');
    staticHeaders[key.trim()] = rest.join(':').trim();
  }
});

let errors = 0;
for (const [key, expectedVal] of Object.entries(securityHeaders)) {
  const staticVal = staticHeaders[key];
  if (staticVal !== expectedVal) {
    console.error(`❌ Mismatch in header "${key}":`);
    console.error(`  headers.config.js : ${expectedVal}`);
    console.error(`  public/_headers   : ${staticVal}`);
    errors++;
  }
}

// Check that stale /admin/* rule is absent from public/_headers
if (_headers.includes('/admin/*')) {
  console.error('❌ Stale rule "/admin/*" found in public/_headers (admin panel was removed)');
  errors++;
}

// Check vercel.json consistency if present
const vercelPath = path.join(__dirname, '../vercel.json');
if (fs.existsSync(vercelPath)) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    if (!vercelConfig.headers || !Array.isArray(vercelConfig.headers)) {
      console.error('❌ vercel.json missing valid headers array');
      errors++;
    } else {
      const rootHeaderEntry = vercelConfig.headers.find(h => h.source === '/(.*)');
      if (!rootHeaderEntry) {
        console.error('❌ vercel.json missing root /(.*) security headers entry');
        errors++;
      } else {
        const vHeadersMap = Object.fromEntries((rootHeaderEntry.headers || []).map(h => [h.key, h.value]));
        for (const [key, expectedVal] of Object.entries(securityHeaders)) {
          if (vHeadersMap[key] !== expectedVal) {
            console.error(`❌ vercel.json mismatch in header "${key}": expected "${expectedVal}", got "${vHeadersMap[key]}"`);
            errors++;
          }
        }
      }
    }
  } catch (err) {
    console.error('❌ Failed to parse vercel.json:', err.message);
    errors++;
  }
}

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✓ All security headers match headers.config.js perfectly.');
}
