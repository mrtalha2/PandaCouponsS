/**
 * IndexNow Automated URL Submission Script
 * Submits all active, indexable site URLs directly to IndexNow endpoints
 * (Bing, Yandex, IndexNow API) for immediate search engine re-crawling.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('../data/site.config');

const SITEMAP_PATH = path.join(__dirname, '..', 'dist', 'sitemap.xml');

function getUrlsFromSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error(`Sitemap not found at ${SITEMAP_PATH}. Please run "npm run build" first.`);
  }

  const content = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const matches = content.match(/<loc>(.*?)<\/loc>/g) || [];
  return matches.map(m => m.replace(/<\/?loc>/g, '').trim()).filter(Boolean);
}

function postIndexNow(endpointUrl, payload) {
  return new Promise((resolve) => {
    const urlObj = new URL(endpointUrl);
    const data = JSON.stringify(payload);

    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          endpoint: endpointUrl,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        endpoint: endpointUrl,
        statusCode: null,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        endpoint: endpointUrl,
        statusCode: 408,
        error: 'Request timed out'
      });
    });

    req.write(data);
    req.end();
  });
}

async function submit() {
  console.log('📡 Extracting URLs from dist/sitemap.xml...');
  const urls = getUrlsFromSitemap();
  console.log(`✓ Found ${urls.length} indexable URLs to submit.`);

  const host = new URL(config.domain).hostname;
  const key = config.indexNowKey;
  const keyLocation = `${config.domain}/${key}.txt`;

  const payload = {
    host,
    key,
    keyLocation,
    urlList: urls
  };

  console.log(`\n🚀 Submitting to IndexNow for host "${host}" using key "${key}"...`);

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (const endpoint of endpoints) {
    console.log(`\nSubmitting to ${endpoint}...`);
    const res = await postIndexNow(endpoint, payload);
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log(`  ✅ Success! Status: ${res.statusCode} (${res.statusMessage || 'OK / Accepted'})`);
    } else {
      console.log(`  ℹ️ Response: Status ${res.statusCode} ${res.statusMessage || ''}`);
      if (res.body) console.log(`  Details: ${res.body}`);
      if (res.error) console.log(`  Error: ${res.error}`);
    }
  }

  console.log('\n🎉 IndexNow submission sequence complete!\n');
}

submit().catch(err => {
  console.error('❌ IndexNow submission failed:', err);
  process.exit(1);
});
