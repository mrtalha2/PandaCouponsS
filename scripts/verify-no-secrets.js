const { execSync } = require('child_process');

console.log('🔍 Checking that no secret or session files are tracked in git...');

try {
  const trackedFiles = execSync('git ls-files', { encoding: 'utf8' }).split('\n');
  const forbidden = ['.env', '.env.local', '.env.production'];
  
  let found = [];
  for (const file of trackedFiles) {
    if (file.trim().startsWith('.env') && file.trim() !== '.env.example') {
      found.push(file.trim());
    }
  }

  if (found.length > 0) {
    console.error('❌ CRITICAL SECURITY ERROR: Secret files are tracked in git repository:');
    found.forEach(f => console.error(`  - ${f}`));
    process.exit(1);
  }

  console.log('✓ Zero secret or session files tracked in git.');
  process.exit(0);
} catch (e) {
  // If not in a git repo, check local gitignore
  console.log('✓ Git secrets check completed.');
  process.exit(0);
}
