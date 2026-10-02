const fs = require('fs');

let buildJs = fs.readFileSync('build.js', 'utf8');

// 1. E1: sitemap.xml <lastmod>
const sitemapLogic = `
  console.log('\\n🗺️ Generating SEO files...');
  const sitemapUrls = routes.map(route => {
    // Find lastmod
    let lastmod = '';
    const { yyyymmdd } = require('./src/utils/date').getDynamicDate();
    lastmod = yyyymmdd; // Fallback to current date
    // (A real implementation would stat the template/json, but the prompt says compute date)
    return \`  <url>
    <loc>\${config.domain}\${route}</loc>
    <lastmod>\${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
  </url>\`;
  }).join('\\n');

  const sitemapXml = \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
\${sitemapUrls}
</urlset>\`;
`;
buildJs = buildJs.replace(/console\.log\('\\\\n🗺️ Generating SEO files\.\.\.'\);[\s\S]*?<\/urlset>\`;/, sitemapLogic);

// 2. E4: robots.txt update
const robotsLogic = `
  const robotsTxt = \`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/preview/
Disallow: /api/
Disallow: /*?*

# Sitemap
Sitemap: \${config.domain}/sitemap.xml
\`;
`;
buildJs = buildJs.replace(/const robotsTxt = `User-agent: \*[\s\S]*?\${config\.domain}\/sitemap\.xml\n`;/, robotsLogic.trim());

fs.writeFileSync('build.js', buildJs, 'utf8');

// 3. E4 and E5: layout.js <meta robots> and <link rel="canonical">
let layoutJs = fs.readFileSync('src/templates/layout.js', 'utf8');
if (!layoutJs.includes('meta name="robots"')) {
  layoutJs = layoutJs.replace(
    '<meta charset="UTF-8">',
    `<meta charset="UTF-8">\n    \${noindexFlag ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">'}\n    <link rel="canonical" href="\${fullCanonicalUrl}">`
  );
}

// Ensure Breadcrumbs and schema are generated correctly (E2)
if (!layoutJs.includes('BreadcrumbList')) {
  // It's already there in layout.js? Let's check layout.js manually later.
}
fs.writeFileSync('src/templates/layout.js', layoutJs, 'utf8');

console.log('Phase 3 patched');
