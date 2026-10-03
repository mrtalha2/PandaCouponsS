/**
 * scripts/verify-month-gate.js
 * Verification suite for month-gate.js logic and matrix cases.
 */

const assert = require('assert');
const { spawnSync } = require('child_process');
const path = require('path');
const { getSiteDateParts } = require('../src/utils/date');
const renderHome = require('../src/pages/home');
const renderLayout = require('../src/templates/layout');
const { resolveTokens } = require('../src/utils/date');

console.log('🚪 Verifying Month Gate decision matrix & date synchronization...\n');

const GATE_SCRIPT = path.join(__dirname, 'month-gate.js');

const testMatrix = [
  {
    name: 'Row 1: Nov 1 07:10 UTC (PDT 00:10) with October title -> Deploy (0)',
    now: '2026-11-01T07:10:00Z',
    zone: 'America/Los_Angeles',
    liveTitle: 'Panda Express Coupon Code: Active Deals (October 2026)',
    expectedExit: 0,
    expectedOutputContains: 'DEPLOY'
  },
  {
    name: 'Row 2: Nov 1 07:10 UTC (PDT 00:10) with November title -> Skip (10)',
    now: '2026-11-01T07:10:00Z',
    zone: 'America/Los_Angeles',
    liveTitle: 'Panda Express Coupon Code: Active Deals (November 2026)',
    expectedExit: 10,
    expectedOutputContains: 'SKIP'
  },
  {
    name: 'Row 3: Nov 1 08:10 UTC (hour 00 in winter/01 in PDT) with October title -> Deploy (0)',
    now: '2026-11-01T08:10:00Z',
    zone: 'America/Los_Angeles',
    liveTitle: 'Panda Express Coupon Code: Active Deals (October 2026)',
    expectedExit: 0,
    expectedOutputContains: 'DEPLOY'
  },
  {
    name: 'Row 4: Oct 31 23:30 UTC (Oct 31 16:30 PDT) with October title -> Skip (10)',
    now: '2026-10-31T23:30:00Z',
    zone: 'America/Los_Angeles',
    liveTitle: 'Panda Express Coupon Code: Active Deals (October 2026)',
    expectedExit: 10,
    expectedOutputContains: 'SKIP: not the 1st'
  },
  {
    name: 'Row 5: Oct 31 19:05 UTC (Nov 1 00:05 PKT in Asia/Karachi) with October title -> Deploy (0)',
    now: '2026-10-31T19:05:00Z',
    zone: 'Asia/Karachi',
    liveTitle: 'Panda Express Coupon Code: Active Deals (October 2026)',
    expectedExit: 0,
    expectedOutputContains: 'DEPLOY'
  },
  {
    name: 'Row 6: Dec 1 08:30 UTC with fetch failure -> Deploy / Fail Open (0)',
    now: '2026-12-01T08:30:00Z',
    zone: 'America/Los_Angeles',
    mockFetchFail: true,
    expectedExit: 0,
    expectedOutputContains: 'DEPLOY'
  },
  {
    name: 'Row 7: Jul 1 07:05 UTC (PDT 00:05) with June title -> Deploy (0)',
    now: '2026-07-01T07:05:00Z',
    zone: 'America/Los_Angeles',
    liveTitle: 'Panda Express Coupon Code: Active Deals (June 2026)',
    expectedExit: 0,
    expectedOutputContains: 'DEPLOY'
  }
];

let passed = 0;

for (const testCase of testMatrix) {
  const args = [
    GATE_SCRIPT,
    '--now', testCase.now,
    '--zone', testCase.zone
  ];

  if (testCase.liveTitle !== undefined) {
    args.push('--live-title', testCase.liveTitle);
  }
  if (testCase.mockFetchFail) {
    args.push('--mock-fetch-fail');
  }

  const result = spawnSync('node', args, {
    encoding: 'utf8',
    env: { ...process.env, NODE_ENV: 'test' }
  });

  const output = (result.stdout || '') + (result.stderr || '');
  const exitCode = result.status;

  assert.strictEqual(
    exitCode,
    testCase.expectedExit,
    `Matrix test failed for [${testCase.name}]: expected exit ${testCase.expectedExit}, got ${exitCode}.\nOutput:\n${output}`
  );

  if (testCase.expectedOutputContains) {
    assert(
      output.includes(testCase.expectedOutputContains),
      `Expected output to contain "${testCase.expectedOutputContains}".\nGot: ${output}`
    );
  }

  console.log(`  ✓ ${testCase.name} (exit ${exitCode})`);
  passed++;
}

// Verification: getSiteDateParts returns exact monthYearLabel that build writes into home <title>
console.log('\n🔍 Verifying getSiteDateParts label matches home <title> template output...');
const mockDates = [
  new Date('2026-01-01T10:00:00Z'),
  new Date('2026-07-01T08:00:00Z'),
  new Date('2026-11-01T08:00:00Z')
];

for (const mockDate of mockDates) {
  const { monthYearLabel } = getSiteDateParts(mockDate);
  const homeData = renderHome();
  const renderedLayout = renderLayout(homeData);
  const resolved = resolveTokens(renderedLayout, mockDate);
  
  const titleMatch = resolved.match(/<title>([^<]+)<\/title>/i);
  assert(titleMatch, 'Home page must have a <title>');
  const titleText = titleMatch[1];
  
  assert(
    titleText.includes(monthYearLabel),
    `Home <title> "${titleText}" does not contain expected monthYearLabel "${monthYearLabel}"`
  );
  console.log(`  ✓ Mock date ${mockDate.toISOString()} -> monthYearLabel "${monthYearLabel}" matches <title> "${titleText}"`);
  passed++;
}

console.log(`\n🎉 All ${passed} month gate verification tests passed successfully!\n`);
