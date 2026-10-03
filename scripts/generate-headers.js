const fs = require('fs');
const path = require('path');
const { securityHeaders, cacheHeaders } = require('../headers.config');

const headersFilePath = path.join(__dirname, '../public/_headers');

let fileContent = '/*\n';
for (const [key, value] of Object.entries(securityHeaders)) {
  fileContent += `  ${key}: ${value}\n`;
}

fileContent += `
/assets/css/*.*.css
  Cache-Control: ${cacheHeaders.immutableAssets}

/assets/js/*.*.js
  Cache-Control: ${cacheHeaders.immutableAssets}

/public/fonts/*
  Cache-Control: ${cacheHeaders.immutableAssets}

/public/images/*
  Cache-Control: ${cacheHeaders.staticAssets}

/assets/css/*.css
  Cache-Control: ${cacheHeaders.staticAssets}

/assets/js/*.js
  Cache-Control: ${cacheHeaders.staticAssets}

/public/*.png
  Cache-Control: ${cacheHeaders.staticAssets}

/public/*.ico
  Cache-Control: ${cacheHeaders.staticAssets}

/public/*.svg
  Cache-Control: ${cacheHeaders.staticAssets}

/*.html
  Cache-Control: ${cacheHeaders.htmlPages}

/
  Cache-Control: ${cacheHeaders.htmlPages}

/admin/*
  X-Robots-Tag: noindex, nofollow, noarchive
`;

fs.writeFileSync(headersFilePath, fileContent.trim() + '\n', 'utf8');
console.log('✓ Generated public/_headers from headers.config.js');
