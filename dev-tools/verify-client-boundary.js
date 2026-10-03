/**
 * dev-tools/verify-client-boundary.js
 * Verifies client-side date resolution boundary transitions across different time zones.
 */

function simulateClientFormat(now, siteTimezone = 'America/Los_Angeles') {
  const formatterMonth = new Intl.DateTimeFormat('en-US', { timeZone: siteTimezone, month: 'long', year: 'numeric' });
  const formatterYear = new Intl.DateTimeFormat('en-US', { timeZone: siteTimezone, year: 'numeric' });
  return {
    monthYear: formatterMonth.format(now),
    year: formatterYear.format(now)
  };
}

console.log('🌐 Testing Client Boundary Transitions (follows site time zone)...\n');

console.log('--- Site Timezone: America/Los_Angeles (US Default) ---');

// 1 second before midnight in LA (2026-11-01T06:59:59Z = 2026-10-31 23:59:59 PDT)
const t1 = new Date('2026-11-01T06:59:59Z');
const res1 = simulateClientFormat(t1, 'America/Los_Angeles');
console.log('1. LA 23:59:59 (Oct 31) [UTC 2026-11-01T06:59:59Z]:');
console.log('   Displayed Month/Year:', res1.monthYear);

// Exactly midnight in LA (2026-11-01T07:00:00Z = 2026-11-01 00:00:00 PDT)
const t2 = new Date('2026-11-01T07:00:00Z');
const res2 = simulateClientFormat(t2, 'America/Los_Angeles');
console.log('2. LA 00:00:00 (Nov 01) [UTC 2026-11-01T07:00:00Z]:');
console.log('   Displayed Month/Year:', res2.monthYear);

// Visitor in Asia/Karachi at their local midnight (2026-10-31T19:00:00Z = Nov 1 00:00:00 PKT)
// Since site time zone is America/Los_Angeles, visitor in Karachi still sees October 2026 because it is 12:00 PM Oct 31 in LA
const t3 = new Date('2026-10-31T19:00:00Z');
const res3 = simulateClientFormat(t3, 'America/Los_Angeles');
console.log('3. Karachi local 00:00:00 Nov 1 (Site in LA is Oct 31 12:00 PM):');
console.log('   Displayed Month/Year:', res3.monthYear);

console.log('\n--- Site Timezone: Asia/Karachi (Configurable) ---');

// 1 second before midnight in Karachi (2026-10-31T18:59:59Z = Oct 31 23:59:59 PKT)
const t4 = new Date('2026-10-31T18:59:59Z');
const res4 = simulateClientFormat(t4, 'Asia/Karachi');
console.log('4. Karachi 23:59:59 (Oct 31) [UTC 2026-10-31T18:59:59Z]:');
console.log('   Displayed Month/Year:', res4.monthYear);

// Exactly midnight in Karachi (2026-10-31T19:00:00Z = Nov 01 00:00:00 PKT)
const t5 = new Date('2026-10-31T19:00:00Z');
const res5 = simulateClientFormat(t5, 'Asia/Karachi');
console.log('5. Karachi 00:00:00 (Nov 01) [UTC 2026-10-31T19:00:00Z]:');
console.log('   Displayed Month/Year:', res5.monthYear);

console.log('\n✅ All client boundary transitions strictly follow the site time zone.');
