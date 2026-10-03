const http = require('http');

const redirectTests = [
  { from: '/about-us', expectedStatus: 301, expectedLocation: '/about-us/' },
  { from: '/contact-us', expectedStatus: 301, expectedLocation: '/contact-us/' },
  { from: '/disclaimer', expectedStatus: 301, expectedLocation: '/disclaimer/' },
  { from: '/privacy-policy', expectedStatus: 301, expectedLocation: '/privacy-policy/' },
  { from: '/panda-express-menu', expectedStatus: 301, expectedLocation: '/panda-express-menu/' },
  { from: '/panda-express-nutrition', expectedStatus: 301, expectedLocation: '/panda-express-nutrition/' },
  { from: '/panda-express-savings-calculator', expectedStatus: 301, expectedLocation: '/panda-express-savings-calculator/' },
  { from: '/panda-express-orange-chicken', expectedStatus: 301, expectedLocation: '/panda-express-orange-chicken/' },
  { from: '/beijing-beef', expectedStatus: 301, expectedLocation: '/beijing-beef/' },
  { from: '/index.html', expectedStatus: 301, expectedLocation: '/' },
  { from: '/about-us/index.html', expectedStatus: 301, expectedLocation: '/about-us/' }
];

async function run() {
  console.log('🔍 Verifying 301 redirect rules and 404/405 status codes...');

  const server = require('child_process').spawn('node', ['server.js'], { 
    env: { ...process.env, PORT: '4006' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  await new Promise((resolve) => {
    let started = false;
    server.stdout.on('data', (d) => {
      if (!started && d.toString().includes('listening on port')) {
        started = true;
        resolve();
      }
    });
    setTimeout(() => {
      if (!started) resolve();
    }, 1200);
  });

  let failed = false;

  // Test 301 Redirects
  for (const test of redirectTests) {
    await new Promise((resolve) => {
      const req = http.get(`http://localhost:4006${test.from}`, { headers: { 'Host': 'localhost:4006' } }, (res) => {
        if (res.statusCode !== test.expectedStatus) {
          console.error(`❌ REDIRECT FAIL: ${test.from} returned status ${res.statusCode}, expected ${test.expectedStatus}`);
          failed = true;
        } else if (res.headers.location !== test.expectedLocation) {
          console.error(`❌ REDIRECT LOCATION FAIL: ${test.from} redirected to "${res.headers.location}", expected "${test.expectedLocation}"`);
          failed = true;
        } else {
          console.log(`✓ 301 Redirect PASS: ${test.from} -> ${res.headers.location}`);
        }
        res.resume();
        resolve();
      });
      req.on('error', (e) => {
        console.error(`❌ Connection error on ${test.from}:`, e.message);
        failed = true;
        resolve();
      });
      req.setTimeout(2000, () => {
        req.destroy();
        resolve();
      });
    });
  }

  // Test 404 on nonexistent route
  await new Promise((resolve) => {
    const req = http.get('http://localhost:4006/non-existent-page-test-xyz', (res) => {
      if (res.statusCode !== 404) {
        console.error(`❌ 404 FAIL: non-existent page returned ${res.statusCode}, expected 404`);
        failed = true;
      } else {
        console.log(`✓ 404 Custom Page PASS: /non-existent-page-test-xyz returned 404`);
      }
      res.resume();
      resolve();
    });
    req.on('error', (e) => {
      console.error('❌ Connection error on 404 test:', e.message);
      failed = true;
      resolve();
    });
  });

  // Test 405 Method Not Allowed on non-GET/HEAD/POST
  await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 4006,
      path: '/about-us/',
      method: 'TRACE'
    }, (res) => {
      if (res.statusCode !== 405) {
        console.error(`❌ 405 FAIL: TRACE /about-us/ returned ${res.statusCode}, expected 405`);
        failed = true;
      } else {
        console.log(`✓ 405 Method Not Allowed PASS: TRACE returned 405`);
      }
      res.resume();
      resolve();
    });
    req.on('error', (e) => {
      console.error('❌ Connection error on 405 test:', e.message);
      failed = true;
      resolve();
    });
    req.end();
  });

  try {
    server.kill('SIGKILL');
  } catch (e) {}

  if (failed) {
    console.error('\n❌ Redirect verification FAILED.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All 301 redirects, 404s, and 405 responses verified successfully!\n');
    process.exit(0);
  }
}

run();
