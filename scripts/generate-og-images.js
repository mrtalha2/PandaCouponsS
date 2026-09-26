/**
 * Generate 1200x630 Social Sharing (Open Graph) Images
 * Creates branded high-resolution JPEG cards under 100 KB using Sharp and SVG overlays.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OG_DIR = path.join(__dirname, '..', 'public', 'images', 'og');
const SOURCE_HERO = path.join(__dirname, '..', 'public', 'images', 'hero-wok.jpg');
const SOURCE_SPREAD = path.join(__dirname, '..', 'public', 'images', 'takeout-spread.jpg');

const OG_CONFIGS = [
  {
    filename: 'og-default.jpg',
    source: SOURCE_HERO,
    kicker: 'INDEPENDENT CONSUMER GUIDE',
    title: 'Panda Express Coupon Codes & Deals',
    subtitle: 'Tested & Verified Daily • Save on Family Meals, Plates & Bowls'
  },
  {
    filename: 'og-home.jpg',
    source: SOURCE_HERO,
    kicker: 'VERIFIED 2026 DEALS',
    title: 'Working Panda Express Coupon Codes',
    subtitle: 'Honest Promo Codes, 20% Off Survey Hacks & Family Savings'
  },
  {
    filename: 'og-menu.jpg',
    source: SOURCE_SPREAD,
    kicker: 'COMPLETE 2026 GUIDE',
    title: 'Panda Express Menu with Prices & Photos',
    subtitle: 'Every Entree, Side, Appetizer, and Drink with Real-Time Pricing'
  },
  {
    filename: 'og-nutrition.jpg',
    source: SOURCE_SPREAD,
    kicker: 'MACRO & CALORIE CALCULATOR',
    title: 'Panda Express Nutrition Calculator',
    subtitle: 'Real-Time Calories, Protein, Carbs, Fat & Allergen Filtering'
  }
];

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function createSvgOverlay(kicker, title, subtitle) {
  const safeKicker = escapeXml(kicker);
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);

  return Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0B0B0C" stop-opacity="0.75"/>
          <stop offset="60%" stop-color="#0B0B0C" stop-opacity="0.88"/>
          <stop offset="100%" stop-color="#0B0B0C" stop-opacity="0.96"/>
        </linearGradient>
      </defs>
      
      <!-- Dark backdrop overlay -->
      <rect width="1200" height="630" fill="url(#bgGrad)"/>
      
      <!-- Brand red top border bar -->
      <rect x="0" y="0" width="1200" height="10" fill="#C8102E"/>
      
      <!-- Inner decorative frame border -->
      <rect x="50" y="50" width="1100" height="530" rx="20" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      
      <!-- Panda Icon Graphic -->
      <g transform="translate(90, 95)">
        <circle cx="36" cy="36" r="36" fill="#C8102E"/>
        <circle cx="36" cy="36" r="32" fill="#0B0B0C"/>
        <circle cx="24" cy="22" r="7" fill="#FFFFFF"/>
        <circle cx="48" cy="22" r="7" fill="#FFFFFF"/>
        <circle cx="24" cy="22" r="4.5" fill="#C8102E"/>
        <circle cx="48" cy="22" r="4.5" fill="#C8102E"/>
        <ellipse cx="36" cy="40" rx="19" ry="16" fill="#FFFFFF"/>
        <ellipse cx="29" cy="37" rx="5" ry="6.5" fill="#000000"/>
        <ellipse cx="43" cy="37" rx="5" ry="6.5" fill="#000000"/>
        <circle cx="30" cy="37" r="1.8" fill="#FFFFFF"/>
        <circle cx="42" cy="37" r="1.8" fill="#FFFFFF"/>
        <path d="M33 44 Q36 47 39 44" stroke="#C8102E" stroke-width="2" fill="none"/>
      </g>
      
      <!-- Brand Name -->
      <text x="180" y="140" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" letter-spacing="1">
        PANDA EXPRESS COUPONS
      </text>
      
      <!-- Gold Kicker -->
      <text x="90" y="245" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="800" fill="#F5B301" letter-spacing="3">
        ${safeKicker}
      </text>
      
      <!-- Main Title -->
      <text x="90" y="325" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="46" font-weight="900" fill="#FFFFFF" letter-spacing="-1">
        ${safeTitle}
      </text>
      
      <!-- Subtitle -->
      <text x="90" y="390" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="24" font-weight="500" fill="#D1D5DB">
        ${safeSubtitle}
      </text>
      
      <!-- Bottom Badge -->
      <g transform="translate(90, 480)">
        <rect width="280" height="46" rx="23" fill="#C8102E"/>
        <text x="140" y="29" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="17" font-weight="800" fill="#FFFFFF" text-anchor="middle">
          pandacoupons.org ↗
        </text>
      </g>
      <text x="390" y="510" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="500" fill="#9CA3AF">
        Independent Diner Resource • Updated Daily
      </text>
    </svg>
  `);
}

async function generateOgImages() {
  console.log('🎨 Generating 1200x630 Open Graph images...\n');

  if (!fs.existsSync(OG_DIR)) {
    fs.mkdirSync(OG_DIR, { recursive: true });
  }

  for (const item of OG_CONFIGS) {
    const outputPath = path.join(OG_DIR, item.filename);
    const svgOverlay = createSvgOverlay(item.kicker, item.title, item.subtitle);

    const imageBuffer = await sharp(item.source)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .composite([{ input: svgOverlay }])
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(outputPath, imageBuffer);
    const kb = (imageBuffer.length / 1024).toFixed(1);
    console.log(`  ✓ Created ${item.filename}: ${kb} KB (budget: < 100 KB)`);
  }

  console.log('\n✨ Open Graph image generation complete!');
}

if (require.main === module) {
  generateOgImages().catch(err => {
    console.error('Error generating OG images:', err);
    process.exit(1);
  });
}

module.exports = generateOgImages;
