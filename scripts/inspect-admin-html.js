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
  const login = await request(
    { hostname: 'localhost', port: 3000, path: '/admin/login', method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    'username=admin&password=PandaAdmin2026!'
  );
  const cookie = login.h['set-cookie'][0].split(';')[0];
  const dash = await request({ hostname: 'localhost', port: 3000, path: '/admin', method: 'GET', headers: { Cookie: cookie } });
  const b = dash.b;
  const marker = 'class="admin-main"';
  const idx = b.indexOf(marker);
  console.log('admin-main class found at index:', idx);
  if (idx >= 0) {
    console.log('--- Snippet around admin-main ---');
    console.log(b.substring(idx, idx + 600));
  }
  console.log('Total body length:', b.length);
  console.log('Has Admin Dashboard:', b.includes('Admin Dashboard'));
  console.log('Has admin-body:', b.includes('admin-body'));
}
run().catch(console.error);
