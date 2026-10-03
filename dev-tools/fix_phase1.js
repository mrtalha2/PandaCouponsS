const fs = require('fs');

const headersContent = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  X-XSS-Protection: 0
  Permissions-Policy: geolocation=(), camera=(), microphone=()
  Cross-Origin-Opener-Policy: same-origin
  Content-Security-Policy-Report-Only: default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://formspree.io
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/assets/css/*.*.css
  Cache-Control: public, max-age=31536000, immutable

/assets/js/*.*.js
  Cache-Control: public, max-age=31536000, immutable

/public/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/public/images/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

/assets/css/*.css
  Cache-Control: public, max-age=86400, stale-while-revalidate=86400

/assets/js/*.js
  Cache-Control: public, max-age=86400, stale-while-revalidate=86400

/public/*.png
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

/public/*.ico
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

/public/*.svg
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/
  Cache-Control: public, max-age=0, must-revalidate

/admin/*
  X-Robots-Tag: noindex, nofollow, noarchive
`;

fs.writeFileSync('public/_headers', headersContent, 'utf8');

const vercelContent = {
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-XSS-Protection", "value": "0" },
        { "key": "Permissions-Policy", "value": "geolocation=(), camera=(), microphone=()" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Content-Security-Policy-Report-Only", "value": "default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://formspree.io" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" }
      ]
    },
    {
      "source": "/assets/css/(.*)\\.(.*)\\.css",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/assets/js/(.*)\\.(.*)\\.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/public/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/public/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=604800, stale-while-revalidate=86400" }
      ]
    },
    {
      "source": "/(.*)\\.html",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    }
  ]
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelContent, null, 2), 'utf8');

let buildJs = fs.readFileSync('build.js', 'utf8');
buildJs = buildJs.replace(
  "fs.writeFileSync(path.join(DIST_DIR, 'assets', 'css', 'style.min.css'), cleanCssResult.styles, 'utf8');",
  "// We will write the fingerprinted file after computing assetHash"
).replace(
  "fs.writeFileSync(path.join(DIST_DIR, 'assets', 'js', 'main.min.js'), terserResult.code, 'utf8');",
  "// We will write the fingerprinted file after computing assetHash"
);

const hashBlock = `  const assetHash = crypto.createHash('md5')
    .update(cleanCssResult.styles + terserResult.code)
    .digest('hex')
    .slice(0, 8);
  console.log(\`  ✓ Asset version hash: \${assetHash}\`);`;

const newHashBlock = `  const assetHash = crypto.createHash('md5')
    .update(cleanCssResult.styles + terserResult.code)
    .digest('hex')
    .slice(0, 8);
  console.log(\`  ✓ Asset version hash: \${assetHash}\`);
  
  fs.writeFileSync(path.join(DIST_DIR, 'assets', 'css', \`style.\${assetHash}.css\`), cleanCssResult.styles, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'assets', 'js', \`main.\${assetHash}.js\`), terserResult.code, 'utf8');
  `;

buildJs = buildJs.replace(hashBlock, newHashBlock);
fs.writeFileSync('build.js', buildJs, 'utf8');

let layoutJs = fs.readFileSync('src/templates/layout.js', 'utf8');
layoutJs = layoutJs.replace(
  '<link rel="stylesheet" href="/assets/css/style.min.css${vParam}">',
  '<link rel="stylesheet" href="/assets/css/style.${assetHash}.css">'
).replace(
  '<script src="/assets/js/main.min.js${vParam}" defer></script>',
  '<script src="/assets/js/main.${assetHash}.js" defer></script>'
);
fs.writeFileSync('src/templates/layout.js', layoutJs, 'utf8');

console.log('Phase 1 remaining tasks completed');
