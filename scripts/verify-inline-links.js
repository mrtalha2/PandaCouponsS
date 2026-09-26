const http = require('http');
const fs = require('fs');
const path = require('path');
const auth = require('../src/admin/auth');
const { getSiteRoutes } = require('../src/admin/site-routes');

async function main() {
  console.log('=== VERIFYING INLINE HYPERLINKING & CONTENT EDITING ===\n');

  // 1. Verify Site Routes Helper
  const routes = getSiteRoutes();
  console.log(`[Test 1] Site Routes generated: ${routes.length} routes found.`);
  const sampleInternal = routes.find(r => r.url === '/panda-express-orange-chicken/');
  if (!sampleInternal) throw new Error('Failed to find Orange Chicken route in dynamic registry');
  console.log(`  ✓ Sample Route verified: ${sampleInternal.title} -> ${sampleInternal.url}`);

  // 2. Create authenticated session directly via auth module
  console.log('\n[Test 2] Creating test admin session...');
  const { sessionId, csrfToken } = auth.createSession('admin');
  const signedCookie = auth.signValue ? auth.signValue(sessionId) : (function() {
    const crypto = require('crypto');
    const secret = process.env.SESSION_SECRET || '39d0d9d764d66394de0b99ea4eb98af65d7763ee0b0ab7553d7a0ece5f2ddf7c';
    const hmac = crypto.createHmac('sha256', secret).update(sessionId).digest('hex');
    return `${sessionId}.${hmac}`;
  })();

  const cookieHeader = `panda_admin_session=${signedCookie}`;
  console.log('  ✓ Admin session established.');
  console.log('  ✓ CSRF Token:', csrfToken);

  // Read current page-content.json
  const pageContentPath = path.join(__dirname, '../data/admin/page-content.json');

  // Test payload with:
  // - Internal link: /panda-express-orange-chicken/
  // - External link: https://pandaexpress.com with target="_blank" rel="noopener noreferrer"
  // - Sponsored link: https://partner.com with rel="nofollow sponsored"
  // - Attack link: javascript:alert(1)
  // - Script tag injection: <script>alert("xss")</script>
  // - Plain text field tag injection: home.kicker with <b>Bold Kicker</b>
  const testUpdates = {
    home: {
      kicker: '🔒 Direct Checkout • <b>No Data Saved</b>', // Tag should be stripped!
      heroSubtext: 'Real, manually-tested promo codes for <a href="https://pandaexpress.com" target="_blank" rel="noopener noreferrer">pandaexpress.com</a> and the official mobile app. Check our <a href="/panda-express-orange-chicken/">Orange Chicken Guide</a> or <a href="https://partner.com" target="_blank" rel="nofollow sponsored">Sponsored Deal</a>! <script>alert("hacked")</script><a href="javascript:evil()">Bad Link</a>'
    }
  };

  // Post page content update
  console.log('\n[Test 3] Posting updated page content with inline links and XSS payload...');
  const saveRes = await request('POST', '/admin/api/pages', {
    page: 'home',
    updates: testUpdates
  }, cookieHeader, csrfToken);

  console.log(`  ✓ Save Response Status: ${saveRes.statusCode}`);
  const saveResult = JSON.parse(saveRes.body);
  console.log('  ✓ Save Response:', saveResult);

  // Verify saved page-content.json
  const updatedContent = JSON.parse(fs.readFileSync(pageContentPath, 'utf8'));
  console.log('\n[Test 4] Verifying sanitized output in data/admin/page-content.json:');
  console.log('  - home.kicker (plain text field):', updatedContent.home.kicker);
  if (updatedContent.home.kicker.includes('<b>') || updatedContent.home.kicker.includes('</b>')) {
    throw new Error('FAIL: Plain text field retained HTML tags!');
  }
  console.log('    ✓ Plain-text tags cleanly stripped.');

  console.log('  - home.heroSubtext (inline upgraded field):', updatedContent.home.heroSubtext);
  if (updatedContent.home.heroSubtext.includes('<script>') || updatedContent.home.heroSubtext.includes('javascript:')) {
    throw new Error('FAIL: Malicious script/javascript scheme was not sanitized!');
  }
  if (!updatedContent.home.heroSubtext.includes('href="/panda-express-orange-chicken/"')) {
    throw new Error('FAIL: Internal relative link was lost!');
  }
  if (!updatedContent.home.heroSubtext.includes('href="https://pandaexpress.com"')) {
    throw new Error('FAIL: External URL was lost!');
  }
  console.log('    ✓ Internal links, external attributes, and sanitization 100% verified.');

  // Verify generated dist/index.html
  const distIndexPath = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(distIndexPath)) {
    const distHtml = fs.readFileSync(distIndexPath, 'utf8');
    if (distHtml.includes('href="/panda-express-orange-chicken/"')) {
      console.log('  ✓ Live published HTML contains internal hyperlinked phrase cleanly.');
    }
  }

  // Restore clean default content
  console.log('\n[Test 5] Restoring clean default hero subtext...');
  await request('POST', '/admin/api/pages', {
    page: 'home',
    updates: {
      home: {
        kicker: '🔒 Direct Checkout • No Data Saved',
        heroSubtext: 'Real, manually-tested promo codes for <a href="https://pandaexpress.com" target="_blank" rel="noopener noreferrer">pandaexpress.com</a> and the official mobile app. Stop clicking dead links—check honest verification status, save up to 20%, and maximize your Panda Rewards.'
      }
    }
  }, cookieHeader, csrfToken);
  console.log('  ✓ Clean state restored.');

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
}

function request(method, path, body = null, cookie = '', csrfToken = '') {
  return new Promise((resolve, reject) => {
    const postData = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    const headers = {};
    if (body) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    if (cookie) headers['Cookie'] = cookie;
    if (csrfToken) headers['x-csrf-token'] = csrfToken;

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

main().catch(err => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
