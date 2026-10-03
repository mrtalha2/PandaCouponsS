const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Login Request ---');
  const loginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, 'username=admin&password=PandaAdmin2026%21');

  console.log('Login status:', loginRes.statusCode);
  console.log('Set-Cookie raw:', loginRes.headers['set-cookie']);

  const cookie = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '';
  console.log('Cookie to send:', cookie);

  console.log('\n--- 2. Fetch /admin/coupons ---');
  const pageRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/coupons',
    method: 'GET',
    headers: {
      'Cookie': cookie
    }
  });
  console.log('Page status:', pageRes.statusCode);
  const match = pageRes.body.match(/<meta name="csrf-token" content="([^"]*)"/);
  const csrfToken = match ? match[1] : null;
  console.log('CSRF token in HTML:', csrfToken);

  console.log('\n--- 3. Send Save Coupon Request ---');
  const saveRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/api/coupons',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
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
      notes: 'Test save',
      category: 'Online Deals',
      status: 'Active',
      expiry: 'Ongoing',
      isDraft: false
    }
  }));

  console.log('Save response status:', saveRes.statusCode);
  console.log('Save response body:', saveRes.body);

  console.log('\n--- 4. Unauthenticated Save Coupon Request (e.g. Expired session) ---');
  const saveUnauthRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/api/coupons',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'panda_admin_session=invalid-cookie',
      'X-CSRF-Token': csrfToken
    }
  }, JSON.stringify({
    action: 'edit',
    index: 0,
    coupon: { code: 'PANDA20' }
  }));
  console.log('Unauth Save response status:', saveUnauthRes.statusCode);
  console.log('Unauth Save response body:', saveUnauthRes.body);

  console.log('\n--- 5. Invalid CSRF Save Coupon Request ---');
  const saveBadCsrfRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/api/coupons',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
      'X-CSRF-Token': 'bad-token'
    }
  }, JSON.stringify({
    action: 'edit',
    index: 0,
    coupon: { code: 'PANDA20' }
  }));
  console.log('Bad CSRF Save response status:', saveBadCsrfRes.statusCode);
  console.log('Bad CSRF Save response body:', saveBadCsrfRes.body);
}

run().catch(console.error);
