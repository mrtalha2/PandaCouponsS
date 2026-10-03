/**
 * scripts/verify-auto-rebuild.js
 * Verifies that server.js with AUTO_REBUILD=1 detects a stale dist/.build-month,
 * triggers an automated rebuild, updates dist/.build-month, and keeps /healthz operational.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const assert = require('assert');
const { getSiteDateParts } = require('../src/utils/date');

console.log('🔄 Verifying self-hosted AUTO_REBUILD behavior in server.js...\n');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const BUILD_MONTH_FILE = path.join(DIST_DIR, '.build-month');
const TEST_PORT = 4015;

async function verifyAutoRebuild() {
  const currentExpected = getSiteDateParts().monthYearLabel;
  const staleMonth = 'January 2020';

  // 1. Artificially set .build-month to stale value
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }
  fs.writeFileSync(BUILD_MONTH_FILE, staleMonth, 'utf8');
  assert.strictEqual(fs.readFileSync(BUILD_MONTH_FILE, 'utf8').trim(), staleMonth, 'Failed to write stale build month');
  console.log(`  ✓ Set dist/.build-month to stale value: "${staleMonth}"`);

  // 2. Spawn server with AUTO_REBUILD=1
  console.log(`  🚀 Starting server on port ${TEST_PORT} with AUTO_REBUILD=1...`);
  const serverProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      PORT: String(TEST_PORT),
      AUTO_REBUILD: '1',
      IGNORE_DOTENV: '1'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let serverOutput = '';
  serverProcess.stdout.on('data', (d) => { serverOutput += d.toString(); });
  serverProcess.stderr.on('data', (d) => { serverOutput += d.toString(); });

  try {
    // 3. Poll /healthz until server is online
    console.log('  Waiting for server to become ready...');
    let isReady = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await new Promise((resolve, reject) => {
          const req = http.get(`http://localhost:${TEST_PORT}/healthz`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
          });
          req.on('error', reject);
          req.setTimeout(500, () => { req.destroy(); reject(new Error('Timeout')); });
        });

        if (res.status === 200) {
          isReady = true;
          console.log(`  ✓ /healthz responded with 200 OK (${res.body})`);
          break;
        }
      } catch (e) {}
    }

    assert(isReady, 'Server failed to start and respond to /healthz');

    // 4. Verify that .build-month has been updated to currentExpected
    console.log('  Verifying dist/.build-month was updated by auto-rebuild...');
    let updatedMonth = '';
    for (let attempt = 0; attempt < 30; attempt++) {
      if (fs.existsSync(BUILD_MONTH_FILE)) {
        updatedMonth = fs.readFileSync(BUILD_MONTH_FILE, 'utf8').trim();
        if (updatedMonth === currentExpected) {
          break;
        }
      }
      await new Promise(r => setTimeout(r, 300));
    }

    assert.strictEqual(
      updatedMonth,
      currentExpected,
      `dist/.build-month should have been updated from "${staleMonth}" to "${currentExpected}", got "${updatedMonth}"`
    );
    console.log(`  ✓ dist/.build-month updated to: "${updatedMonth}"`);

  } finally {
    // 5. Cleanly shut down test server process
    serverProcess.kill('SIGTERM');
    await new Promise(r => setTimeout(r, 200));
    try {
      serverProcess.kill('SIGKILL');
    } catch (e) {}
  }

  console.log('\n🎉 Self-hosted AUTO_REBUILD verification PASSED successfully!\n');
}

verifyAutoRebuild().catch(err => {
  console.error('\n❌ AUTO_REBUILD verification failed:', err);
  process.exit(1);
});
