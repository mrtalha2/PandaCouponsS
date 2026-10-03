const fs = require('fs');
const path = require('path');
const assert = require('assert');

const MOCK_DATE = new Date('2026-11-01T09:30:00Z');
const RealDate = Date;

global.Date = class extends RealDate {
  constructor(...args) {
    if (args.length === 0) {
      super(MOCK_DATE.getTime());
    } else {
      super(...args);
    }
  }
  static now() {
    return MOCK_DATE.getTime();
  }
};

// Clear require cache for build modules
Object.keys(require.cache).forEach(k => {
  if (k.includes('/src/') || k.includes('/data/') || k.includes('build.js')) {
    delete require.cache[k];
  }
});

async function runMockBuild() {
  console.log('🏗️ Running mock build for 2026-11-01T09:30:00Z...\n');
  const renderLayout = require('../src/templates/layout');
  const renderHome = require('../src/pages/home');
  const { resolveTokens, getSiteDateParts } = require('../src/utils/date');
  
  console.log('Site date parts for mocked date:', getSiteDateParts(new Date()));
  
  const homeData = renderHome();
  let fullHtml = renderLayout(homeData);
  fullHtml = resolveTokens(fullHtml, new Date());

  // Extract home tags
  const title = fullHtml.match(/<title>([^<]+)<\/title>/i)[1];
  const desc = fullHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/i)[1];
  const ogTitle = fullHtml.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)[1];
  const ogDesc = fullHtml.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)[1];
  const jsonLdMatch = fullHtml.match(/<script type="application\/ld\+json">([^<]+)<\/script>/i);
  const jsonLd = jsonLdMatch ? jsonLdMatch[1] : '';

  console.log('Home <title>          :', title);
  console.log('Home meta description :', desc);
  console.log('Home og:title         :', ogTitle);
  console.log('Home og:description   :', ogDesc);
  console.log('Home JSON-LD length   :', jsonLd.length);

  assert(title.includes('November 2026'), 'Home title must contain November 2026');
  assert(desc.includes('November 2026'), 'Home desc must contain November 2026');
  assert(ogTitle.includes('November 2026'), 'Home og:title must contain November 2026');
  assert(ogDesc.includes('November 2026'), 'Home og:description must contain November 2026');
  assert(!title.includes('October 2026'), 'Home title must NOT contain October 2026');
  assert(!desc.includes('October 2026'), 'Home desc must NOT contain October 2026');

  // Check all other pages to ensure none have month in title/desc
  const otherPages = [
    { file: 'about', fn: require('../src/pages/about') },
    { file: 'contact', fn: require('../src/pages/contact') },
    { file: 'disclaimer', fn: require('../src/pages/disclaimer') },
    { file: 'privacy', fn: require('../src/pages/privacy') },
    { file: 'menu', fn: require('../src/pages/menu') },
    { file: 'nutrition', fn: require('../src/pages/nutrition') },
    { file: 'savings-calculator', fn: require('../src/pages/savings-calculator') }
  ];

  for (const p of otherPages) {
    const pageData = p.fn();
    const pageHtml = resolveTokens(renderLayout(pageData), new Date());
    const pTitle = pageHtml.match(/<title>([^<]+)<\/title>/i)[1];
    const pDesc = pageHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/i)[1];
    
    assert(!pTitle.includes('November 2026') && !pTitle.includes('October 2026'), `${p.file} title should NOT contain month name: "${pTitle}"`);
    assert(!pDesc.includes('November 2026') && !pDesc.includes('October 2026'), `${p.file} desc should NOT contain month name: "${pDesc}"`);
  }

  console.log('\n✓ Rollover verification passed: Home updated to November 2026, other 15 pages have no month in title/description.');
}

runMockBuild().catch(err => {
  console.error(err);
  process.exit(1);
});
