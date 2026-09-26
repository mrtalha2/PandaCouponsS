const http = require('http');
const assert = require('assert');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body
      }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testSuite() {
  console.log('🧪 Running comprehensive verification tests for admin session and CSRF flows...\n');

  // Test 1: Fresh Login (Simulating Private/Incognito Tab login)
  console.log('Test 1: Fresh Login with Credentials...');
  const loginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }, 'username=admin&password=PandaAdmin2026%21');

  assert.strictEqual(loginRes.statusCode, 302, 'Login should redirect with 302');
  assert(loginRes.headers['set-cookie'], 'Set-Cookie header must be present');
  const cookieHeader = loginRes.headers['set-cookie'][0];
  console.log('  ✓ Set-Cookie received:', cookieHeader);
  assert(cookieHeader.includes('HttpOnly'), 'Cookie must have HttpOnly');
  assert(cookieHeader.includes('SameSite=Lax'), 'Cookie must have SameSite=Lax');
  // Confirm Secure is NOT set on local plain HTTP (NODE_ENV unset or development)
  assert(!cookieHeader.includes('Secure;'), 'Cookie must NOT have Secure flag in local development (plain HTTP)');

  const cookieVal = cookieHeader.split(';')[0];

  // Test 2: Access /admin/coupons with the session cookie
  console.log('\nTest 2: Load /admin/coupons and extract fresh CSRF token...');
  const couponsPageRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/coupons',
    method: 'GET',
    headers: { 'Cookie': cookieVal }
  });
  assert.strictEqual(couponsPageRes.statusCode, 200, 'Page should return 200 OK');
  const csrfMatch = couponsPageRes.body.match(/<meta name="csrf-token" content="([^"]+)"/);
  assert(csrfMatch && csrfMatch[1], 'CSRF token must be present in HTML meta tag');
  const csrfToken = csrfMatch[1];
  console.log('  ✓ CSRF token in DOM:', csrfToken);

  // Test 3: Edit and Save Coupon successfully
  console.log('\nTest 3: Edit and save coupon with valid session and CSRF token...');
  const saveCouponRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/api/coupons',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieVal,
      'X-CSRF-Token': csrfToken
    }
  }, JSON.stringify({
    action: 'edit',
    index: 0,
    coupon: {
      code: 'PANDA20',
      discount: '20% Off Entire Order',
      bestFor: 'Online orders',
      minOrder: 'None',
      notes: 'Test edit verified',
      category: 'Online Deals',
      status: 'Active',
      expiry: 'Ongoing',
      isDraft: false
    }
  }));

  assert.strictEqual(saveCouponRes.statusCode, 200, 'Save coupon should return 200 OK');
  const saveCouponJson = JSON.parse(saveCouponRes.body);
  assert.strictEqual(saveCouponJson.success, true, 'Save coupon must succeed');
  console.log('  ✓ Coupon saved successfully:', saveCouponJson);

  // Test 4: Edit and Save Page Content (Another Admin Write Action)
  console.log('\nTest 4: Edit and save page content (Phase D write action)...');
  const savePagesRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/api/pages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieVal,
      'X-CSRF-Token': csrfToken
    }
  }, JSON.stringify({
    page: 'home',
    updates: {
      home: { kicker: 'VERIFIED SAVINGS TEST' }
    }
  }));
  assert.strictEqual(savePagesRes.statusCode, 200, 'Save page content should return 200');
  assert.strictEqual(JSON.parse(savePagesRes.body).success, true);
  console.log('  ✓ Page content saved successfully');

  // Test 5: Edit and Save Code Injection
  console.log('\nTest 5: Edit and save code injections (Phase C write action)...');
  const saveCodeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/api/code',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieVal,
      'X-CSRF-Token': csrfToken
    }
  }, JSON.stringify({
    head: '<!-- test tracking tag -->',
    bodyStart: '',
    bodyEnd: ''
  }));
  assert.strictEqual(saveCodeRes.statusCode, 200, 'Save code should return 200');
  assert.strictEqual(JSON.parse(saveCodeRes.body).success, true);
  console.log('  ✓ Code injections saved successfully');

  // Test 6: Expired / Missing Session detection (should return 401 JSON for API)
  console.log('\nTest 6: Expired / Missing session on save request...');
  const expiredRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/api/coupons',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'panda_admin_session=deleted_or_invalid_session.sig',
      'X-CSRF-Token': csrfToken
    }
  }, JSON.stringify({
    action: 'edit',
    index: 0,
    coupon: { code: 'PANDA20' }
  }));
  assert.strictEqual(expiredRes.statusCode, 401, 'Expired session must return 401');
  const expiredJson = JSON.parse(expiredRes.body);
  assert.strictEqual(expiredJson.success, false);
  assert.strictEqual(expiredJson.error, 'Unauthorized session');
  console.log('  ✓ 401 Unauthorized returned with clear JSON error:', expiredJson);

  // Test 7: GET /admin/login?expired=1 displays the expiration notice
  console.log('\nTest 7: Login page with ?expired=1 query parameter...');
  const loginExpiredRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/login?expired=1',
    method: 'GET'
  });
  assert.strictEqual(loginExpiredRes.statusCode, 200);
  assert(loginExpiredRes.body.includes('Your session expired — please log in again.'), 'Login page must show session expired notice');
  console.log('  ✓ Login page displays: "Your session expired — please log in again."');

  // Test 8: CSRF Token Endpoint (GET /admin/api/csrf-token)
  console.log('\nTest 8: CSRF Token refresh endpoint...');
  const csrfEndpointRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/api/csrf-token',
    method: 'GET',
    headers: { 'Cookie': cookieVal }
  });
  assert.strictEqual(csrfEndpointRes.statusCode, 200);
  const csrfEndpointJson = JSON.parse(csrfEndpointRes.body);
  assert.strictEqual(csrfEndpointJson.csrfToken, csrfToken, 'CSRF token from endpoint must match session token');
  console.log('  ✓ CSRF token refresh endpoint works accurately');

  console.log('\n🎉 ALL 8 VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
}

testSuite().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
