/**
 * Centralized Dynamic Date Helper
 * Guarantees dynamic month and year across all pages, titles, footers, schema, and coupons.
 */
function getDynamicDate() {
  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();
  const currentMonthYear = `${currentMonth} ${currentYear}`;

  return {
    now,
    currentMonth,
    currentYear,
    currentMonthYear
  };
}

module.exports = {
  getDynamicDate
};
