/**
 * Centralized Dynamic Date Helper
 * Guarantees dynamic month and year across all pages, titles, footers, schema, and coupons.
 */
const config = require('../../data/site.config.js');

function getDynamicDate() {
  const now = new Date();
  const timeZone = config.SITE_TIMEZONE || 'America/Los_Angeles';
  
  const formatterMonth = new Intl.DateTimeFormat('en-US', { timeZone, month: 'long' });
  const formatterYear = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric' });
  const formatterDate = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });

  const currentMonth = formatterMonth.format(now);
  const currentYear = formatterYear.format(now);
  const currentMonthYear = `${currentMonth} ${currentYear}`;
  
  // Also get the parts for precise dateModified if needed
  const dateParts = formatterDate.formatToParts(now);
  const y = dateParts.find(p => p.type === 'year').value;
  const m = dateParts.find(p => p.type === 'month').value;
  const d = dateParts.find(p => p.type === 'day').value;
  const yyyymmdd = `${y}-${m}-${d}`;

  return {
    now,
    currentMonth,
    currentYear,
    currentMonthYear,
    yyyymmdd
  };
}

module.exports = {
  getDynamicDate
};
