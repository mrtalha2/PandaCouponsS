const { spawnSync } = require('child_process');
const path = require('path');

// Test running server.js with missing env variables
const res = spawnSync('node', [path.join(__dirname, '../server.js')], {
  env: {
    PATH: process.env.PATH,
    IGNORE_DOTENV: 'true',
    PORT: '3000',
    ADMIN_USER: 'admin'
    // Missing ADMIN_PASSWORD_HASH and SESSION_SECRET
  }
});

console.log('Exit code:', res.status);
console.log('Stderr output:\n' + (res.stderr ? res.stderr.toString() : ''));
if (res.status === 1 && res.stderr.toString().includes('Required environment variables are missing:')) {
  console.log('✅ PASS: Server refused to start, exited with code 1, and logged missing variables.');
  process.exit(0);
} else {
  console.error('❌ FAIL: Expected exit code 1 with missing variable notice.');
  process.exit(1);
}
