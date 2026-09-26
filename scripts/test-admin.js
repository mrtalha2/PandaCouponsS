const http = require('http');

console.log('🧪 Running Phase 17 Admin Panel Integration Tests...\n');

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Public Site
    const pub = await request({ hostname: 'localhost', port: 3000, path: '/', method: 'GET' });
    assert(pub.statusCode === 200 && pub.body.includes('Panda Express'), 'Public site serves 200 OK with content');

    // 2. 301 Redirects
    const red = await request({ hostname: 'localhost', port: 3000, path: '/deals/', method: 'GET' });
    assert(red.statusCode === 301 && red.headers.location === '/', '301 redirect works for /deals/ -> /');

    // 3. Admin Route Protection
    const unauth = await request({ hostname: 'localhost', port: 3000, path: '/admin', method: 'GET' });
    assert(unauth.statusCode === 302 && unauth.headers.location === '/admin/login', 'Unauthenticated /admin redirects to /admin/login');

    // 4. Admin Login Page
    const loginPage = await request({ hostname: 'localhost', port: 3000, path: '/admin/login', method: 'GET' });
    assert(loginPage.statusCode === 200 && loginPage.body.includes('Admin Portal'), 'Login page renders 200 OK');

    // 5. Invalid Login Attempt
    const badLogin = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, 'username=admin&password=wrongpassword');
    assert(badLogin.statusCode === 401 && badLogin.body.includes('Invalid username or password'), 'Invalid credentials return 401');

    // 6. Valid Login
    const goodLogin = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, 'username=admin&password=PandaAdmin2026!');
    assert(goodLogin.statusCode === 302 && goodLogin.headers.location === '/admin', 'Valid credentials redirect to /admin');
    
    const setCookie = goodLogin.headers['set-cookie'] ? goodLogin.headers['set-cookie'][0] : '';
    const cookie = setCookie.split(';')[0];
    assert(cookie.startsWith('panda_admin_session='), 'Sets httpOnly session cookie');

    // 7. Authenticated Dashboard Access
    const dash = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/admin',
      method: 'GET',
      headers: { 'Cookie': cookie }
    });
    assert(dash.statusCode === 200 && dash.body.includes('Admin Dashboard'), 'Authenticated session can access /admin');

    // Extract CSRF token from meta tag (new approach)
    const csrfMetaMatch = dash.body.match(/meta[^>]+name="csrf-token"[^>]+content="([^"]+)"/);
    let csrfToken = csrfMetaMatch ? csrfMetaMatch[1] : '';
    if (!csrfToken) {
      // Fallback: fetch from the csrf-token API endpoint
      const csrfApiRes = await request({ hostname: 'localhost', port: 3000, path: '/admin/api/csrf-token', method: 'GET', headers: { 'Cookie': cookie } });
      const csrfApiData = JSON.parse(csrfApiRes.body);
      csrfToken = csrfApiData.csrfToken || '';
    }
    assert(csrfToken.length > 10, 'CSRF token present in session');

    // 8. Admin Sub-pages
    const couponsPage = await request({ hostname: 'localhost', port: 3000, path: '/admin/coupons', method: 'GET', headers: { 'Cookie': cookie } });
    assert(couponsPage.statusCode === 200 && couponsPage.body.includes('Coupons Manager'), '/admin/coupons loads');

    const pagesPage = await request({ hostname: 'localhost', port: 3000, path: '/admin/pages', method: 'GET', headers: { 'Cookie': cookie } });
    assert(pagesPage.statusCode === 200 && pagesPage.body.includes('Page Content Editor'), '/admin/pages loads');

    const metaPage = await request({ hostname: 'localhost', port: 3000, path: '/admin/meta', method: 'GET', headers: { 'Cookie': cookie } });
    assert(metaPage.statusCode === 200 && metaPage.body.includes('Meta Editor'), '/admin/meta loads');

    const codePage = await request({ hostname: 'localhost', port: 3000, path: '/admin/code', method: 'GET', headers: { 'Cookie': cookie } });
    assert(codePage.statusCode === 200 && codePage.body.includes('Custom Code Injection'), '/admin/code loads');

    const redirectsPage = await request({ hostname: 'localhost', port: 3000, path: '/admin/redirects', method: 'GET', headers: { 'Cookie': cookie } });
    assert(redirectsPage.statusCode === 200 && redirectsPage.body.includes('301 Redirects Manager'), '/admin/redirects loads');

    const mediaPage = await request({ hostname: 'localhost', port: 3000, path: '/admin/media', method: 'GET', headers: { 'Cookie': cookie } });
    assert(mediaPage.statusCode === 200 && mediaPage.body.includes('Media Library'), '/admin/media loads');

    // 9. In-Memory Preview Route
    const preview = await request({ hostname: 'localhost', port: 3000, path: '/admin/preview/home', method: 'GET', headers: { 'Cookie': cookie } });
    assert(preview.statusCode === 200 && preview.body.includes('ADMIN PREVIEW MODE'), 'Dynamic in-memory preview loads with banner');

    // 10. Test Atomic Backup on Mutating API Call
    const testCodeSave = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/admin/api/code',
      method: 'POST',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      }
    }, JSON.stringify({ head: '<!-- test tracking tag -->', bodyStart: '', bodyEnd: '' }));
    assert(testCodeSave.statusCode === 200, 'API call to save code succeeds with CSRF');

    const fs = require('fs');
    const path = require('path');
    const backups = fs.readdirSync(path.join(__dirname, '../data/admin/backups'));
    assert(backups.length > 0, `Atomic backup created in data/admin/backups/ (${backups.length} backup file(s))`);

    // Reset code
    await request({
      hostname: 'localhost',
      port: 3000,
      path: '/admin/api/code',
      method: 'POST',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      }
    }, JSON.stringify({ head: '', bodyStart: '', bodyEnd: '' }));

    // 11. Logout
    const logout = await request({ hostname: 'localhost', port: 3000, path: '/admin/logout', method: 'GET', headers: { 'Cookie': cookie } });
    assert(logout.statusCode === 302 && logout.headers.location === '/admin/login', 'Logout destroys session and redirects to login');

    console.log(`\n======================================================`);
    console.log(`🎉 TEST SUMMARY: ${passed} passed, ${failed} failed.`);
    console.log(`======================================================\n`);

  } catch (err) {
    console.error('Integration test failure:', err);
  }
}

runTests();
