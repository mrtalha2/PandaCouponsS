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
`;

fs.writeFileSync(headersFilePath, fileContent.trim() + '\n', 'utf8');
console.log('✓ Generated public/_headers from headers.config.js');

// Function to generate vercel.json if requested by owner
function generateVercelConfig() {
  const vercelPath = path.join(__dirname, '../vercel.json');
  
  const headers = [
    {
      source: '/(.*)',
      headers: Object.entries(securityHeaders).map(([key, value]) => ({ key, value }))
    },
    {
      source: '/assets/css/(.*)\\.(.*)\\.css',
      headers: [{ key: 'Cache-Control', value: cacheHeaders.immutableAssets }]
    },
    {
      source: '/assets/js/(.*)\\.(.*)\\.js',
      headers: [{ key: 'Cache-Control', value: cacheHeaders.immutableAssets }]
    },
    {
      source: '/public/fonts/(.*)',
      headers: [{ key: 'Cache-Control', value: cacheHeaders.immutableAssets }]
    },
    {
      source: '/public/images/(.*)',
      headers: [{ key: 'Cache-Control', value: cacheHeaders.staticAssets }]
    },
    {
      source: '/assets/css/(.*)\\.css',
      headers: [{ key: 'Cache-Control', value: cacheHeaders.staticAssets }]
    },
    {
      source: '/assets/js/(.*)\\.js',
      headers: [{ key: 'Cache-Control', value: cacheHeaders.staticAssets }]
    },
    {
      source: '/public/(.*)\\.(png|ico|svg)',
      headers: [{ key: 'Cache-Control', value: cacheHeaders.staticAssets }]
    },
    {
      source: '/(.*)\\.html',
      headers: [{ key: 'Cache-Control', value: cacheHeaders.htmlPages }]
    },
    {
      source: '/',
      headers: [{ key: 'Cache-Control', value: cacheHeaders.htmlPages }]
    }
  ];

  const redirects = [
    { source: '/about-us', destination: '/about-us/', permanent: true },
    { source: '/contact-us', destination: '/contact-us/', permanent: true },
    { source: '/disclaimer', destination: '/disclaimer/', permanent: true },
    { source: '/privacy-policy', destination: '/privacy-policy/', permanent: true },
    { source: '/panda-express-menu', destination: '/panda-express-menu/', permanent: true },
    { source: '/panda-express-nutrition', destination: '/panda-express-nutrition/', permanent: true },
    { source: '/panda-express-savings-calculator', destination: '/panda-express-savings-calculator/', permanent: true },
    { source: '/panda-express-orange-chicken', destination: '/panda-express-orange-chicken/', permanent: true },
    { source: '/beijing-beef', destination: '/beijing-beef/', permanent: true },
    { source: '/panda-express-grilled-teriyaki', destination: '/panda-express-grilled-teriyaki/', permanent: true },
    { source: '/panda-express-cream-cheese', destination: '/panda-express-cream-cheese/', permanent: true },
    { source: '/panda-express-black-pepper-steak', destination: '/panda-express-black-pepper-steak/', permanent: true },
    { source: '/panda-express-sweet-sour-chicken', destination: '/panda-express-sweet-sour-chicken/', permanent: true },
    { source: '/panda-express-string-bean-chicken', destination: '/panda-express-string-bean-chicken/', permanent: true },
    { source: '/panda-express-chow-mein', destination: '/panda-express-chow-mein/', permanent: true },
    { source: '/index.html', destination: '/', permanent: true },
    { source: '/about-us/index.html', destination: '/about-us/', permanent: true },
    { source: '/contact-us/index.html', destination: '/contact-us/', permanent: true },
    { source: '/disclaimer/index.html', destination: '/disclaimer/', permanent: true },
    { source: '/privacy-policy/index.html', destination: '/privacy-policy/', permanent: true },
    { source: '/panda-express-menu/index.html', destination: '/panda-express-menu/', permanent: true },
    { source: '/panda-express-nutrition/index.html', destination: '/panda-express-nutrition/', permanent: true },
    { source: '/panda-express-savings-calculator/index.html', destination: '/panda-express-savings-calculator/', permanent: true },
    { source: '/panda-express-orange-chicken/index.html', destination: '/panda-express-orange-chicken/', permanent: true },
    { source: '/beijing-beef/index.html', destination: '/beijing-beef/', permanent: true }
  ];

  const vercelConfig = {
    cleanUrls: true,
    trailingSlash: true,
    headers,
    redirects
  };

  fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2) + '\n', 'utf8');
  console.log('✓ Generated vercel.json from headers.config.js and server redirects');
}

if (process.argv.includes('--vercel') || process.env.GENERATE_VERCEL === '1') {
  generateVercelConfig();
}

module.exports = {
  generateVercelConfig
};
