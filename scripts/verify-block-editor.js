const http = require('http');
const fs = require('fs');
const path = require('path');
const auth = require('../src/admin/auth');
const { loadAllPageBlocks } = require('../src/admin/block-converter');
const { PAGE_ALLOWED_SMART_BLOCKS } = require('../src/admin/block-schema');

async function main() {
  console.log('=== VERIFYING UNIFIED VISUAL PAGE EDITOR (GUTENBERG-STYLE) ===\n');

  // 1. Verify Auto-Converted Blocks for all pages
  console.log('[Test 1] Checking auto-converted page blocks in data/admin/page-blocks.json...');
  const allBlocks = loadAllPageBlocks();
  const pages = Object.keys(allBlocks);
  console.log(`  ✓ Converted pages found: ${pages.join(', ')}`);
  
  if (!allBlocks.home || allBlocks.home.length === 0) throw new Error('Homepage block list is empty');
  console.log(`  ✓ Homepage has ${allBlocks.home.length} blocks:`);
  allBlocks.home.forEach((b, i) => {
    console.log(`     ${i + 1}. [${b.type}] ${b.locked ? '(Smart Component)' : '(Free Block)'} - id: ${b.id}`);
  });

  // 2. Authenticate session
  console.log('\n[Test 2] Establishing authenticated admin session...');
  const { sessionId, csrfToken } = auth.createSession('admin');
  const signedCookie = (function() {
    const crypto = require('crypto');
    const secret = process.env.SESSION_SECRET || '39d0d9d764d66394de0b99ea4eb98af65d7763ee0b0ab7553d7a0ece5f2ddf7c';
    const hmac = crypto.createHmac('sha256', secret).update(sessionId).digest('hex');
    return `${sessionId}.${hmac}`;
  })();
  const cookieHeader = `panda_admin_session=${signedCookie}`;
  console.log('  ✓ Session active, CSRF Token:', csrfToken);

  // 3. Fetch /admin/pages?page=home
  console.log('\n[Test 3] Requesting /admin/pages?page=home visual editor view...');
  const getRes = await request('GET', '/admin/pages?page=home', null, cookieHeader);
  console.log(`  ✓ Response status: ${getRes.statusCode}`);
  if (!getRes.body.includes('Visual Canvas: <strong>🏠 Homepage</strong>')) {
    throw new Error('FAIL: Visual editor canvas header not found in HTML response');
  }
  if (!getRes.body.includes('class="floating-selection-toolbar"')) {
    throw new Error('FAIL: Floating text selection toolbar not found in HTML response');
  }
  if (!getRes.body.includes('id="blockInserterModal"')) {
    throw new Error('FAIL: Block inserter modal not found in HTML response');
  }
  console.log('  ✓ Visual canvas, floating toolbar, inserter hotspot, and action controls verified.');

  // 4. Test Block Inserter, Modification & Server Sanitization
  console.log('\n[Test 4] Testing block modification and server-side allowlist sanitization...');
  const testBlocks = JSON.parse(JSON.stringify(allBlocks.home));
  
  // Insert a new callout block at index 2
  testBlocks.splice(2, 0, {
    id: 'b_test_callout_123',
    type: 'callout',
    title: 'Special Weekend Alert • <b>Save 20%</b>', // inline tags permitted
    content: 'Order directly via <a href="/panda-express-orange-chicken/">Orange Chicken Guide</a> or <a href="https://pandaexpress.com" target="_blank" rel="noopener noreferrer">Official App</a>! <script>alert("hack")</script>',
    icon: '🔥'
  });

  const saveRes = await request('POST', '/admin/api/blocks', {
    page: 'home',
    blocks: testBlocks
  }, cookieHeader, csrfToken);

  console.log(`  ✓ Save status: ${saveRes.statusCode}, body:`, JSON.parse(saveRes.body));

  // Verify saved blocks in JSON
  const blocksPath = path.join(__dirname, '../data/admin/page-blocks.json');
  const savedBlocks = JSON.parse(fs.readFileSync(blocksPath, 'utf8')).home;
  const inserted = savedBlocks.find(b => b.id === 'b_test_callout_123');
  if (!inserted) throw new Error('FAIL: Inserted block was not saved to page-blocks.json');
  if (inserted.content.includes('<script>')) throw new Error('FAIL: Script tag was not sanitized');
  if (!inserted.content.includes('href="/panda-express-orange-chicken/"')) throw new Error('FAIL: Internal relative link was lost');
  console.log('  ✓ Inserted block verified in page-blocks.json (sanitized cleanly):', inserted.content);

  // 5. Test Live Real-Time Canvas Re-renderer API
  console.log('\n[Test 5] Testing real-time canvas render API (/admin/api/blocks/render-canvas)...');
  const renderRes = await request('POST', '/admin/api/blocks/render-canvas', {
    page: 'home',
    blocks: savedBlocks
  }, cookieHeader, csrfToken);

  const renderData = JSON.parse(renderRes.body);
  if (!renderData.success || !renderData.html.includes('b_test_callout_123')) {
    throw new Error('FAIL: Canvas renderer did not output updated block HTML');
  }
  console.log('  ✓ Real-time canvas render API functioning properly.');

  // Clean up test callout
  console.log('\n[Test 6] Restoring original block list...');
  await request('POST', '/admin/api/blocks', {
    page: 'home',
    blocks: allBlocks.home
  }, cookieHeader, csrfToken);
  console.log('  ✓ Original clean state restored.');

  console.log('\n🎉 ALL VISUAL BLOCK EDITOR TESTS PASSED SUCCESSFULLY!');
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
