const fs = require('fs');
const path = require('path');
const { securityHeaders } = require('../headers.config');

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

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✓ All security headers match headers.config.js perfectly.');
}
