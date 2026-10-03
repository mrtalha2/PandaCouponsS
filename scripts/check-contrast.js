/**
 * WCAG 2.1 AA Color Contrast Verification Script
 * Validates text and background color pairs used across the nutrition page and calculator.
 * Requires contrast ratio >= 4.5:1 for standard text (3:1 for large text / graphical UI components).
 */

function hexToRgb(hex) {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Key color pairs used in Nutrition Page and Nutrition Calculator
const NUTRITION_COLOR_PAIRS = [
  { element: 'Page Hero Heading on Dark Canvas', fg: '#FFFFFF', bg: '#0D0907', minRatio: 4.5 },
  { element: 'Page Hero Subtext on Dark Canvas', fg: '#D6CFCB', bg: '#0D0907', minRatio: 4.5 },
  { element: 'Nutrition Card Title on Card Bg', fg: '#FFFFFF', bg: '#1A1412', minRatio: 4.5 },
  { element: 'Nutrition Card Text on Card Bg', fg: '#D1D5DB', bg: '#1A1412', minRatio: 4.5 },
  { element: 'Nutrition Table Cell Text on Dark Row', fg: '#F3F4F6', bg: '#140E0C', minRatio: 4.5 },
  { element: 'Nutrition Table Header Text on Header Bg', fg: '#FFFFFF', bg: '#1A1412', minRatio: 4.5 },
  { element: 'Calorie Count Number on Dark Badge', fg: '#FFFFFF', bg: '#261D1A', minRatio: 4.5 },
  { element: 'Macro Protein Tag on Dark Card', fg: '#E5E7EB', bg: '#1A1412', minRatio: 4.5 },
  { element: 'Macro Carbs Tag on Dark Card', fg: '#E5E7EB', bg: '#1A1412', minRatio: 4.5 },
  { element: 'Macro Fat Tag on Dark Card', fg: '#E5E7EB', bg: '#1A1412', minRatio: 4.5 },
  { element: 'Calculator Option Card Title on Dark Card', fg: '#FFFFFF', bg: '#1A1412', minRatio: 4.5 },
  { element: 'Calculator Option Subtext on Dark Card', fg: '#9CA3AF', bg: '#1A1412', minRatio: 4.5 },
  { element: 'Calculator CTA Button Text on Button Bg', fg: '#FFFFFF', bg: '#374151', minRatio: 4.5 },
  { element: 'Nutrition Filter Pill Active Text on White', fg: '#0D0907', bg: '#FFFFFF', minRatio: 4.5 },
  { element: 'Nutrition Filter Pill Inactive Text on Dark', fg: '#D1D5DB', bg: '#1F1917', minRatio: 4.5 },
  { element: 'Feature Card Neutral Heading on Dark Bg', fg: '#FFFFFF', bg: '#140E0C', minRatio: 4.5 },
  { element: 'Feature Card Neutral Text on Dark Bg', fg: '#D1D5DB', bg: '#140E0C', minRatio: 4.5 }
];

function checkContrast() {
  console.log('🎨 Verifying WCAG Color Contrast for Nutrition Page & Calculator...');

  let failures = 0;
  console.log('--------------------------------------------------------------------------------------');
  console.log(String('Element / Context').padEnd(46) + 'FG / BG'.padEnd(18) + 'Ratio'.padEnd(10) + 'Status');
  console.log('--------------------------------------------------------------------------------------');

  for (const pair of NUTRITION_COLOR_PAIRS) {
    const ratio = getContrastRatio(pair.fg, pair.bg);
    const passed = ratio >= pair.minRatio;
    const ratioStr = `${ratio.toFixed(2)}:1`;
    const colorStr = `${pair.fg} on ${pair.bg}`;

    if (!passed) {
      failures++;
      console.error(`❌ ${pair.element.padEnd(44)} ${colorStr.padEnd(18)} ${ratioStr.padEnd(10)} FAIL (expected >= ${pair.minRatio}:1)`);
    } else {
      console.log(`✓  ${pair.element.padEnd(44)} ${colorStr.padEnd(18)} ${ratioStr.padEnd(10)} PASS`);
    }
  }

  console.log('--------------------------------------------------------------------------------------');
  if (failures > 0) {
    console.error(`\n❌ Found ${failures} color contrast violation(s).`);
    process.exit(1);
  }

  console.log(`\n✅ All ${NUTRITION_COLOR_PAIRS.length} color pairs pass WCAG 2.1 AA contrast requirements (>= 4.5:1)!`);
}

if (require.main === module) {
  checkContrast();
}

module.exports = { checkContrast, getContrastRatio };
