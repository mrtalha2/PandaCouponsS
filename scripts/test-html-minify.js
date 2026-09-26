const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');

// Basic whitespace minification that preserves pre/code if needed
function minifyHtml(raw) {
  return raw
    .replace(/<!--[\s\S]*?-->/g, '') // strip comments
    .replace(/>\s+</g, '><') // collapse whitespace between tags
    .replace(/\s{2,}/g, ' ') // collapse multi-spaces
    .trim();
}

const minified = minifyHtml(html);
console.log('Original size:', (html.length / 1024).toFixed(1), 'KB');
console.log('Minified size:', (minified.length / 1024).toFixed(1), 'KB');
