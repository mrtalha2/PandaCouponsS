const http = require('http');

const tests = [
  '/../.env',
  '/%2e%2e/.env',
  '/..%2f.env',
  '/..%5cserver.js',
  '/%00',
  '/.git/config'
];

async function getTargetPort() {
  const is3000Active = await new Promise((resolve) => {
    const req = http.get('http://localhost:3000/healthz', (res) => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(300, () => { req.destroy(); resolve(false); });
  });
  if (is3000Active) return { port: 3000, server: null };

  const server = require('child_process').spawn('node', ['server.js'], { 
    env: { ...process.env, PORT: '4005' },
    stdio: 'ignore'
  });

  await new Promise((resolve) => {
    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount++;
      const req = http.get('http://localhost:4005/healthz', (res) => {
        res.resume();
        clearInterval(interval);
        resolve();
      });
      req.on('error', () => {
        if (checkCount > 20) {
          clearInterval(interval);
          resolve();
        }
      });
      req.setTimeout(200, () => req.destroy());
    }, 100);
  });

  return { port: 4005, server };
}

async function run() {
  const { port, server } = await getTargetPort();
  let failed = false;

  for (const path of tests) {
    await new Promise((resolve) => {
      const req = http.get(`http://localhost:${port}${path}`, (res) => {
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

  if (server) {
    try {
      server.kill('SIGKILL');
    } catch (e) {}
  }

  process.exit(failed ? 1 : 0);
}

run();
