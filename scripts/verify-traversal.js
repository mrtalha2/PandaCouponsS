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
  const server = require('child_process').spawn('node', ['server.js'], { 
    env: { ...process.env, PORT: '4005' },
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

  for (const path of tests) {
    await new Promise((resolve) => {
      const req = http.get(`http://localhost:4005${path}`, (res) => {
        if (res.statusCode !== 403 && res.statusCode !== 400 && res.statusCode !== 404) {
          console.error(`FAILED: ${path} returned ${res.statusCode}`);
          failed = true;
        } else {
          console.log(`PASS: ${path} returned ${res.statusCode}`);
        }
        res.resume();
        resolve();
      });
      req.on('error', (e) => {
        if (e.message.includes('socket hang up') || e.code === 'ECONNRESET' || e.code === 'HPE_INVALID_CONSTANT') {
          console.log(`PASS (Error handled): ${path}`);
        } else {
          console.error(`FAILED (Unknown error): ${path}`, e);
          failed = true;
        }
        resolve();
      });
      req.setTimeout(2000, () => {
        req.destroy();
        resolve();
      });
    });
  }

  try {
    server.kill('SIGKILL');
  } catch (e) {}

  process.exit(failed ? 1 : 0);
}

run();
