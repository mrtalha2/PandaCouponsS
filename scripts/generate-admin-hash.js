#!/usr/bin/env node
/**
 * Panda Express Coupons - Admin Credentials Hash Generator
 * 
 * Interactive CLI that prompts for a username and a masked password,
 * generates the salted bcrypt hash and random SESSION_SECRET,
 * and prints the three lines ready to paste into host environment variables.
 * 
 * Usage:
 *   node scripts/generate-admin-hash.js
 *   node scripts/generate-admin-hash.js --user admin --pass secret123
 */

const readline = require('readline');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const args = process.argv.slice(2);
let cliUser = null;
let cliPass = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--user' && args[i + 1]) {
    cliUser = args[i + 1];
    i++;
  } else if ((args[i] === '--pass' || args[i] === '--password') && args[i + 1]) {
    cliPass = args[i + 1];
    i++;
  }
}

function generate(username, password) {
  if (!username || !password) {
    console.error('\n❌ Username and password are required.');
    process.exit(1);
  }

  const saltRounds = 12;
  const hash = bcrypt.hashSync(password, saltRounds);
  const sessionSecret = crypto.randomBytes(32).toString('hex');

  console.log('\n======================================================');
  console.log('✅ Admin Credentials Generated Successfully!');
  console.log('======================================================\n');
  console.log('Paste the following lines into your server environment variables (or .env file):\n');
  console.log(`ADMIN_USER=${username}`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log(`SESSION_SECRET=${sessionSecret}`);
  console.log('\n======================================================\n');
}

function askMasked(promptText) {
  return new Promise((resolve) => {
    process.stdout.write(promptText);
    let password = '';
    
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      const onData = (chunk) => {
        for (let i = 0; i < chunk.length; i++) {
          const char = chunk[i];
          if (char === '\n' || char === '\r' || char === '\u0004') {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdin.removeListener('data', onData);
            process.stdout.write('\n');
            resolve(password);
            return;
          } else if (char === '\u0003') { // Ctrl+C
            process.exit(1);
          } else if (char === '\b' || char === '\x7f') { // Backspace
            if (password.length > 0) {
              password = password.slice(0, -1);
              process.stdout.write('\b \b');
            }
          } else {
            password += char;
            process.stdout.write('*');
          }
        }
      };

      process.stdin.on('data', onData);
    } else {
      // Non-TTY fallback
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      rl.question('', (ans) => {
        rl.close();
        resolve(ans.trim());
      });
    }
  });
}

async function runInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter desired Admin Username [default: admin]: ', async (userAns) => {
    const username = userAns.trim() || 'admin';
    rl.close();

    const password = await askMasked('Enter desired Admin Password (masked): ');
    if (!password) {
      console.error('❌ Password cannot be empty.');
      process.exit(1);
    }
    generate(username, password);
  });
}

if (cliUser && cliPass) {
  generate(cliUser, cliPass);
} else {
  runInteractive();
}
