const config = require('../../data/site.config');
const renderHeader = require('./header');
const renderFooter = require('./footer');

function renderLayout({
  title,
  description,
  canonicalPath = '/',
  content = '',
  breadcrumbs = null,
  schemaJson = null,
  extraScripts = '',
  ogImage = '/public/images/og/og-default.jpg',
  ogImageAlt = null,
  preloadHero = false,
  assetHash = '',
  suppressBreadcrumbsHtml = false,
  isNoindex = false,
  dateModified = null
}) {
  const finalTitle = title;
  const finalDesc = description;
  const finalOgImage = ogImage;
  const fullCanonicalUrl = `${config.domain}${canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath}`;
  const noindexFlag = isNoindex || canonicalPath === '/404.html';
  
  // Default Organization & Website Schema
  const sameAsList = (config.socialLinks || [])
    .map(l => l && l.url)
    .filter(u => typeof u === 'string' && !/^https?:\/\/(www\.)?[a-z]+\.com\/?$/i.test(u));

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": config.siteName,
    "url": config.domain,
    "logo": `${config.domain}/public/favicon.svg`,
    "email": config.contactEmail,
    "contactPoint": {
      "@type": "ContactPoint",
      "email": config.contactEmail,
      "contactType": "customer support"
    }
  };
  if (sameAsList.length > 0) {
    orgSchema.sameAs = sameAsList;
  }

  const defaultSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": config.siteName,
      "url": config.domain,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${config.domain}/panda-express-menu/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    orgSchema
  ];

  if (breadcrumbs && breadcrumbs.length > 0) {
    defaultSchemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": crumb.label,
        "item": `${config.domain}${crumb.url}`
      }))
    });
  }

  if (schemaJson) {
    let schemas = Array.isArray(schemaJson) ? schemaJson : [schemaJson];
    if (dateModified) {
      schemas = schemas.map(schema => {
        if (schema['@type'] === 'Article' || schema['@type'] === 'WebPage' || schema['@type'] === 'FAQPage' || schema['@type'] === 'ItemPage') {
          return { ...schema, dateModified };
        }
        return schema;
      });
    }
    defaultSchemas.push(...schemas);
  }

  // Breadcrumbs HTML for UI
  let breadcrumbsHtml = '';
  if (breadcrumbs && breadcrumbs.length > 1 && !suppressBreadcrumbsHtml) {
    breadcrumbsHtml = `
      <nav aria-label="Breadcrumbs" class="container" style="padding-top: 1rem;">
        <ol class="breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
          ${breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return `
              <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                ${isLast 
                  ? `<span itemprop="name" aria-current="page">${crumb.label}</span>`
                  : `<a href="${crumb.url}" itemprop="item"><span itemprop="name">${crumb.label}</span></a><span class="crumb-separator" aria-hidden="true">/</span>`
                }
                <meta itemprop="position" content="${idx + 1}" />
              </li>
            `;
          }).join('')}
        </ol>
      </nav>
    `;
  }

  const vParam = assetHash ? `?v=${assetHash}` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${finalTitle}</title>
  <meta name="description" content="${finalDesc}">
  <meta name="site-timezone" content="${require('../utils/date').getDynamicDate().timeZone}">
  <meta name="robots" content="${noindexFlag ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
${noindexFlag ? '' : `  <link rel="canonical" href="${fullCanonicalUrl}">\n`}${config.googleSiteVerification ? `  <meta name="google-site-verification" content="${config.googleSiteVerification}">\n` : ''}${config.bingSiteVerification ? `  <meta name="msvalidate.01" content="${config.bingSiteVerification}">\n` : ''}
  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${fullCanonicalUrl}">
  <meta property="og:title" content="${finalTitle}">
  <meta property="og:description" content="${finalDesc}">
  <meta property="og:site_name" content="${config.siteName}">
  <meta property="og:locale" content="en_US">
  <meta property="article:modified_time" content="${dateModified || new Date().toISOString()}">
  <meta property="og:image" content="${config.domain}${finalOgImage.startsWith('/') ? finalOgImage : '/' + finalOgImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${ogImageAlt || finalTitle}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${finalTitle}">
  <meta name="twitter:description" content="${finalDesc}">
  <meta name="twitter:image" content="${config.domain}${finalOgImage.startsWith('/') ? finalOgImage : '/' + finalOgImage}">
  <meta name="twitter:image:alt" content="${ogImageAlt || finalTitle}">

  <!-- Favicon & Touch Icon Suite -->
  <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/public/favicon-16x16.png">
  <link rel="icon" href="/public/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/public/apple-touch-icon.png">
  <link rel="manifest" href="/public/site.webmanifest">
  <meta name="theme-color" content="#C8102E">

  <!-- Preload Critical Self-Hosted Font (400 weight only) -->
  <link rel="preload" href="/public/fonts/plus-jakarta-sans-400.woff2" as="font" type="font/woff2" crossorigin>
${preloadHero ? `
  <!-- Preload Homepage Hero Image (LCP critical path) -->
  <link rel="preload" as="image"
        imagesrcset="/public/images/optimized/hero-wok-640.webp 640w,
                     /public/images/optimized/hero-wok-800.webp 800w,
                     /public/images/optimized/hero-wok-1280.webp 1280w,
                     /public/images/optimized/hero-wok-1920.webp 1920w"
        imagesizes="100vw"
        fetchpriority="high">` : ''}

  <!-- Core Stylesheet (Production Minified with Cache-Bust) -->
  <link rel="stylesheet" href="/assets/css/style.${assetHash}.css">

  <!-- Structured Data JSON-LD (Compact) -->
  <script type="application/ld+json">${JSON.stringify(defaultSchemas)}</script>
</head>
<body>
  <!-- Inline SVG Icon Sprite (Phase 6a Reusable Icons) -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display:none;" aria-hidden="true">
    <symbol id="icon-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></symbol>
    <symbol id="icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></symbol>
    <symbol id="icon-checkout" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></symbol>
    <symbol id="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></symbol>
    <symbol id="icon-check-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></symbol>
    <symbol id="icon-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></symbol>
    <symbol id="icon-single-use" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></symbol>
    <symbol id="icon-map-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></symbol>
    <symbol id="icon-min-order" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></symbol>
    <symbol id="icon-tier-star1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></symbol>
    <symbol id="icon-tier-star2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="rgba(245,179,1,0.2)"></polygon><circle cx="12" cy="12" r="3" fill="none"></circle></symbol>
    <symbol id="icon-tier-star3" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="rgba(245,179,1,0.5)"></polygon><polygon points="12 6 13.5 9 17 9.5 14.5 12 15 15.5 12 13.8 9 15.5 9.5 12 7 9.5 10.5 9 12 6" fill="none"></polygon></symbol>
    <symbol id="icon-tier-star4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F5B301"></path><path d="M5 21h14" fill="none"></path></symbol>
    <symbol id="icon-military" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none"></path><polygon points="12 7 13.5 10 16.5 10.5 14.2 12.8 14.8 16 12 14.5 9.2 16 9.8 12.8 7.5 10.5 10.5 10 12 7" fill="none"></polygon></symbol>
    <symbol id="icon-student" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></symbol>
    <symbol id="icon-giftcard" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></symbol>
    <symbol id="icon-baseball" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M5.5 5.5a10 10 0 0 1 0 13"></path><path d="M18.5 5.5a10 10 0 0 0 0 13"></path></symbol>
  </svg>

  <a href="#main-content" class="skip-link">Skip to main content</a>
  <div id="a11yClipboardAnnouncer" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
  ${renderHeader(canonicalPath)}
  ${breadcrumbsHtml}
  <main id="main-content">
    ${content}
  </main>
  ${renderFooter()}

  <!-- Client Script (Deferred for Performance with Cache-Bust) -->
  <script src="/assets/js/main.${assetHash}.js" defer></script>
  ${extraScripts}
</body>
</html>`;
}

module.exports = renderLayout;
