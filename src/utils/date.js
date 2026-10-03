/**
 * Centralized Dynamic Date Helper
 * Guarantees dynamic month and year across all pages, titles, footers, schema, and coupons.
 * Always operates in SITE_TIMEZONE (America/Los_Angeles) using Intl.DateTimeFormat.
 */

const SITE_TIMEZONE = 'America/Los_Angeles';

function getCurrentMonth(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', { timeZone: SITE_TIMEZONE, month: 'long' }).format(date);
}

function getCurrentYear(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', { timeZone: SITE_TIMEZONE, year: 'numeric' }).format(date);
}

function getCurrentMonthYear(date = new Date()) {
  const m = getCurrentMonth(date);
  const y = getCurrentYear(date);
  return `${m} ${y}`;
}

function getIsoMonth(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TIMEZONE,
    year: 'numeric',
    month: '2-digit'
  }).formatToParts(date);
  const y = parts.find(p => p.type === 'year').value;
  const m = parts.find(p => p.type === 'month').value;
  return `${y}-${m}`;
}

function getDynamicDate(date = new Date()) {
  const currentMonth = getCurrentMonth(date);
  const currentYear = getCurrentYear(date);
  const currentMonthYear = `${currentMonth} ${currentYear}`;

  const formatterDate = new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const dateParts = formatterDate.formatToParts(date);
  const y = dateParts.find(p => p.type === 'year').value;
  const m = dateParts.find(p => p.type === 'month').value;
  const d = dateParts.find(p => p.type === 'day').value;
  const yyyymmdd = `${y}-${m}-${d}`;

  return {
    now: date,
    currentMonth,
    currentYear,
    currentMonthYear,
    yyyymmdd,
    timeZone: SITE_TIMEZONE
  };
}

function resolveTokens(html, date = new Date()) {
  const { currentMonthYear, currentMonth, currentYear } = getDynamicDate(date);
  let result = html;
  if (result && typeof result === 'string') {
    result = result.replace(/{{MONTH_YEAR}}/g, currentMonthYear);
    result = result.replace(/{{MONTH}}/g, currentMonth);
    result = result.replace(/{{YEAR}}/g, currentYear);
  }
  return result;
}

module.exports = {
  SITE_TIMEZONE,
  getCurrentMonth,
  getCurrentYear,
  getCurrentMonthYear,
  getIsoMonth,
  getDynamicDate,
  resolveTokens
};
