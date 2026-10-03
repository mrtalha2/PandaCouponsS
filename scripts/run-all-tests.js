/**
 * Unified Test Runner
 * Executes all test and verification suites in order, streaming output and exiting non-zero on failure.
 */
const { execSync } = require('child_process');

const testSuites = [
  { name: 'Core Verification & SEO Tests', script: 'test.js' },
  { name: 'Nutrition Consistency Verification', script: 'scripts/verify-nutrition-consistency.js' },
  { name: 'Current Month / Timezone Verification', script: 'scripts/verify-current-month.js' },
  { name: 'Path Traversal & Directory Protection', script: 'scripts/verify-traversal.js' },
  { name: 'Security Headers Consistency', script: 'scripts/verify-headers.js' },
  { name: '301 Redirects & Status Codes', script: 'scripts/verify-redirects.js' },
  { name: 'Untracked Secrets Guard', script: 'scripts/verify-no-secrets.js' },
  { name: 'Hardcoded Dates Scanner', script: 'scripts/find-hardcoded-dates.js' },
  { name: 'JSON-LD Schema & Canonical Verification', script: 'scripts/validate-jsonld.js' },
  { name: 'Asset Integrity Verification', script: 'scripts/verify-assets.js' },
  { name: 'WCAG Color Contrast Audit', script: 'scripts/check-contrast.js' },
  { name: 'Accessibility & Table Semantics Audit', script: 'scripts/verify-a11y.js' },
  { name: 'Site Remediation & Integration Verification', script: 'scripts/verify-site-remediation.js' },
  { name: 'Forbidden Email Absence Guard', script: 'scripts/verify-no-forbidden-email.js' }
];

console.log('🚀 Running Panda Express Coupons Comprehensive Verification Suite...\n');

let failedSuites = 0;
const totalStart = Date.now();

for (const suite of testSuites) {
  const start = Date.now();
  try {
    const output = execSync(`node ${suite.script}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    const elapsed = Date.now() - start;
    console.log(`[PASS] ${suite.name} (${elapsed}ms)`);
    if (output.trim()) {
      const indented = output.trim().split('\n').map(l => '  ' + l).join('\n');
      console.log(indented);
    }
    console.log('');
  } catch (err) {
    const elapsed = Date.now() - start;
    console.error(`❌ [FAIL] ${suite.name} (${elapsed}ms)`);
    if (err.stdout) console.log(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    failedSuites++;
  }
}

const totalTime = Date.now() - totalStart;
console.log('----------------------------------------------------');
if (failedSuites > 0) {
  console.error(`❌ TEST SUITE FAILED: ${failedSuites} suite(s) reported errors in ${totalTime}ms.`);
  process.exit(1);
} else {
  console.log(`🎉 ALL ${testSuites.length} TEST SUITES PASSED SUCCESSFULLY in ${totalTime}ms!`);
  process.exit(0);
}
