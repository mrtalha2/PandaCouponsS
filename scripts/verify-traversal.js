const http = require('http');

const tests = [
  '/../.env',
  '/%2e%2e/.env',
  '/..%2f.env',
  '/..%5cserver.js',
  '/%00',
  '/.git/config'
];

async function run() {
  const server = require('child_process').spawn('node', ['server.js'], { env: { ...process.env, PORT: '4005' }});
  
  // Wait for server to start
  await new Promise(r => setTimeout(r, 1000));

  let failed = false;

  for (const path of tests) {
    await new Promise((resolve) => {
      http.get(`http://localhost:4005${path}`, (res) => {
        if (res.statusCode !== 403 && res.statusCode !== 400 && res.statusCode !== 404) {
          console.error(`FAILED: ${path} returned ${res.statusCode}`);
          failed = true;
        } else {
          console.log(`PASS: ${path} returned ${res.statusCode}`);
        }
        resolve();
      }).on('error', (e) => {
        if (e.message.includes('socket hang up') || e.code === 'ECONNRESET' || e.code === 'HPE_INVALID_CONSTANT') {
          console.log(`PASS (Error handled): ${path}`);
          resolve();
        } else {
          console.error(`FAILED (Unknown error): ${path}`, e);
          failed = true;
          resolve();
        }
      });
    });
  }

  server.kill();

  if (failed) {
    process.exit(1);
  }
}

run();
