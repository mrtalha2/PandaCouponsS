const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying headers consistency across server.js, public/_headers, and vercel.json');

const serverJsPath = path.join(__dirname, '../server.js');
const _headersPath = path.join(__dirname, '../public/_headers');
const vercelJsonPath = path.join(__dirname, '../vercel.json');

const serverJs = fs.readFileSync(serverJsPath, 'utf8');
const _headers = fs.readFileSync(_headersPath, 'utf8');
const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

// Extract from server.js
const serverHeaders = {};
const serverMatch = serverJs.match(/res\.setHeader\(['"]([^'"]+)['"],\s*(['"])(.*?)\2\)/g);
if (serverMatch) {
  serverMatch.forEach(m => {
    const parts = m.match(/res\.setHeader\(['"]([^'"]+)['"],\s*(['"])(.*?)\2\)/);
    if (parts) {
      serverHeaders[parts[1]] = parts[3];
    }
  });
}

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

// Extract from vercel.json
const vercelHeaders = {};
const rootConfig = vercelJson.headers.find(h => h.source === '/(.*)');
if (rootConfig && rootConfig.headers) {
  rootConfig.headers.forEach(h => {
    vercelHeaders[h.key] = h.value;
  });
}

let errors = 0;
const keysToCheck = [
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'X-XSS-Protection',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy',
  'Content-Security-Policy-Report-Only'
];

for (const key of keysToCheck) {
  const v1 = serverHeaders[key];
  const v2 = staticHeaders[key];
  const v3 = vercelHeaders[key];
  
  if (v1 !== v2 || v1 !== v3) {
    console.error(`❌ Mismatch in header ${key}:`);
    console.error(`  server.js   : ${v1}`);
    console.error(`  _headers    : ${v2}`);
    console.error(`  vercel.json : ${v3}`);
    errors++;
  }
}

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✓ All security headers match perfectly.');
}
