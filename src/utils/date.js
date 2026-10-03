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

let nutritionMasterCache = null;
function getNutritionMaster() {
  if (!nutritionMasterCache) {
    const path = require('path');
    const fs = require('fs');
    const p = path.join(__dirname, '../../data/nutrition-master.json');
    if (fs.existsSync(p)) {
      nutritionMasterCache = JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  }
  return nutritionMasterCache;
}

function resolveTokens(html, date = new Date()) {
  const { currentMonthYear, currentMonth, currentYear } = getDynamicDate(date);
  let result = html;
  if (result && typeof result === 'string') {
    result = result.replace(/{{MONTH_YEAR}}/g, currentMonthYear);
    result = result.replace(/{{MONTH}}/g, currentMonth);
    result = result.replace(/{{YEAR}}/g, currentYear);

    const master = getNutritionMaster();
    if (master && master.items) {
      result = result.replace(/{{(cal|calories|fat|totalFat|satfat|saturatedFat|carbs|totalCarbs|protein|sodium|sugar|sugars|fiber|dietaryFiber|cholesterol|serving):([a-z0-9-]+)}}/g, (match, field, id) => {
        const item = master.items.find(i => i.id === id);
        if (!item) return match;
        switch (field) {
          case 'cal':
          case 'calories': return item.calories;
          case 'fat':
          case 'totalFat': return item.totalFat;
          case 'satfat':
          case 'saturatedFat': return item.saturatedFat;
          case 'carbs':
          case 'totalCarbs': return item.totalCarbs;
          case 'protein': return item.protein;
          case 'sodium': return item.sodium;
          case 'sugar':
          case 'sugars': return item.sugars;
          case 'fiber':
          case 'dietaryFiber': return item.dietaryFiber;
          case 'cholesterol': return item.cholesterol;
          case 'serving': return item.servingSize;
          default: return match;
        }
      });
    }
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
