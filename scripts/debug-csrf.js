const http = require('http');
function request(opts, body) {
  return new Promise((res, rej) => {
    const req = http.request(opts, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res({ s: r.statusCode, h: r.headers, b: d }));
    });
    req.on('error', rej);
    if (body) req.write(body);
    req.end();
  });
}
async function run() {
  // Login
  const loginRes = await request({
    hostname: 'localhost', port: 3000, path: '/admin/login', method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }, 'username=admin&password=PandaAdmin2026!');
  const cookie = loginRes.h['set-cookie'][0].split(';')[0];
  console.log('Cookie received:', cookie.substring(0, 80));

  // Load dashboard page
  const dash = await request({
    hostname: 'localhost', port: 3000, path: '/admin', method: 'GET',
    headers: { Cookie: cookie }
  });
  
  // Extract CSRF token from the rendered page
  const m = dash.b.match(/window\.CSRF_TOKEN\s*=\s*'([^']*)'/);
  const csrfFromPage = m ? m[1] : '(NOT FOUND)';
  console.log('CSRF token in page:', csrfFromPage.length > 0 ? csrfFromPage.substring(0, 20) + '...' : '*** EMPTY ***');

  // Attempt a coupon save with CSRF token from page
  const apiRes = await request({
    hostname: 'localhost', port: 3000, path: '/admin/api/coupons', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfFromPage, Cookie: cookie }
  }, JSON.stringify({ action: 'add', coupon: { code: 'DEBUGTEST', discount: '5% off', bestFor: 'Test', minOrder: 'None', notes: 'Debug', category: 'Online Deals', status: 'Active', isDraft: true } }));
  
  console.log('API response status:', apiRes.s);
  console.log('API response body:', apiRes.b);
}
run().catch(console.error);
