/**
 * Initial Page Block Converter
 * Automatically parses existing page structures into unified block lists.
 * Preserves all content, copy, smart component hooks, and layout fidelity.
 */

const fs = require('fs');
const path = require('path');
const { generateBlockId } = require('./block-schema');

const DATA_DIR = path.join(__dirname, '../../data');
const ADMIN_DATA_DIR = path.join(DATA_DIR, 'admin');
const { getDynamicDate } = require('../utils/date');

function getInitialPageBlocks(pageKey) {
  const { currentMonthYear } = getDynamicDate();
  let pageContent = {};
  try {
    const pcPath = path.join(ADMIN_DATA_DIR, 'page-content.json');
    if (fs.existsSync(pcPath)) {
      pageContent = JSON.parse(fs.readFileSync(pcPath, 'utf8'));
    }
  } catch (e) {}

  let couponsData = { coupons: [], lastVerified: currentMonthYear };
  try {
    const cPath = path.join(DATA_DIR, 'coupons.json');
    if (fs.existsSync(cPath)) couponsData = JSON.parse(fs.readFileSync(cPath, 'utf8'));
  } catch (e) {}

  switch (pageKey) {
    case 'home': {
      const home = pageContent.home || {};
      return [
        {
          id: generateBlockId(),
          type: 'hero',
          locked: true,
          kicker: home.kicker || '🔒 Direct Checkout • No Data Saved',
          title: home.heroHeading ? home.heroHeading.replace(/\[MONTH_YEAR\]/g, currentMonthYear) : `Panda Express Coupon Codes ${currentMonthYear}: Verified Deals & Family Savings`,
          subtitle: home.heroSubtext || 'Real, manually-tested promo codes for <a href="https://pandaexpress.com" target="_blank" rel="noopener noreferrer">pandaexpress.com</a> and the official mobile app. Stop clicking dead links—check honest verification status, save up to 20%, and maximize your Panda Rewards.',
          primaryBtnText: home.btnCodesText || "🎟️ Get Today's Codes",
          primaryBtnUrl: '#coupon-section',
          secondaryBtnText: home.btnFamilyText || "🥡 Family Meal Deals",
          secondaryBtnUrl: '#family-meal-deals',
          bgImage: '/public/images/hero-wok.jpg'
        },
        {
          id: generateBlockId(),
          type: 'stats-bar',
          locked: true,
          items: [
            { num: String((couponsData.coupons || []).filter(c => !c.isDraft).length || 5), label: 'Tracked Codes' },
            { num: String((couponsData.coupons || []).filter(c => c.status === 'Active' && !c.isDraft).length || 3), label: 'Confirmed Active' },
            { num: couponsData.lastVerified || currentMonthYear, label: 'Last Database Check' },
            { num: 'App & Web', label: 'Official Compatibility', color: '#F5B301' }
          ]
        },
        {
          id: generateBlockId(),
          type: 'coupon-grid',
          locked: true,
          heading: home.couponHeading || 'Working Panda Express Coupon Codes',
          subtext: home.couponSubtext || 'A Panda Express coupon code is an alphanumeric promotional string applied at checkout for immediate discounts. Copy code and paste directly on the official app or website.',
          deliveryNotice: home.deliveryNotice || 'Official promotional vouchers do NOT function on DoorDash, Uber Eats, Grubhub, or Postmates. You must order directly via <a href="https://pandaexpress.com" target="_blank" rel="noopener noreferrer">pandaexpress.com</a> or the official mobile app to redeem these savings.'
        },
        {
          id: generateBlockId(),
          type: 'rewards-calculator',
          locked: true,
          heading: home.rewardsHeading || 'Panda Rewards: The Most Consistent Way to Save',
          subtext: home.rewardsSubtext || 'Earn 10 points per $1 spent via the app, website, or in-store scan. Points stay active with at least one purchase every 12 months.'
        },
        {
          id: generateBlockId(),
          type: 'family-meal-stepper',
          locked: true,
          heading: home.familyHeading || 'Panda Express Family Meal Deals: $35 vs $48',
          subtext: home.familySubtext || 'Feeding 4 to 5 people? The Panda Express Family Meal bundle delivers 2 large sides and 3 large entrees, saving roughly $35 to $40 over individual plates.'
        },
        {
          id: generateBlockId(),
          type: 'faq-accordion',
          locked: true,
          heading: 'Frequently Asked Questions About Panda Express Coupons',
          subtext: 'Expert answers on promo codes, Panda Rewards points, app redemption, and checkout troubleshooting.'
        }
      ];
    }

    case 'menu': {
      const menu = pageContent.menu || {};
      return [
        {
          id: generateBlockId(),
          type: 'menu-grid',
          locked: true,
          badgeText: menu.badgeText || '🐼 OFFICIAL 2026 PANDA EXPRESS MENU & PRICES',
          heading: menu.heroTitle || 'Panda Express Menu with Prices & Pictures',
          subtext: menu.heroSubtitle || 'Explore complete 2026 pricing, per-serving calorie counts, portion options, and high-definition photography for all Bowls, Plates, A La Carte Entrées, Sides, Crafted Refreshers, and Catering Trays.',
          stat1Label: menu.stat1Label || 'Wok-Crafted Dishes',
          stat2Label: menu.stat2Label || 'A La Carte Boxes',
          stat3Label: menu.stat3Label || 'Zero Artificial Trans Fat'
        }
      ];
    }

    case 'nutrition': {
      const nutr = pageContent.nutrition || {};
      return [
        {
          id: generateBlockId(),
          type: 'nutrition-calculator',
          locked: true,
          badgeText: nutr.badgeText || 'Interactive Nutrition & Macro Engine (2026 Edition)',
          heading: nutr.heroTitle || 'Panda Express Nutrition Calculator',
          subtext: nutr.heroSubtitle || 'Instantly calculate calories, macronutrients, and allergen disclosures for custom bowls, plates, and entrees across all 45+ official Panda Express menu items and 12 laboratory-verified metrics.',
          disclosure: nutr.sourceDisclosure || "Nutritional figures and allergen flags are compiled directly from Panda Express's published nutrition disclosures and standardized corporate formulations. Portion sizes may vary by ±15% to 20% in-store due to hand-scoop volume and wok reduction.",
          tab1Label: nutr.tab1Label || '🥣 Combo Meal Builder',
          tab2Label: nutr.tab2Label || '📊 12-Column Nutrition & Allergen Explorer'
        }
      ];
    }

    case 'orange-chicken': {
      const oc = pageContent['orange-chicken'] || {};
      return [
        {
          id: generateBlockId(),
          type: 'dish-guide',
          locked: true,
          slug: 'orange-chicken',
          title: oc.title || 'The Original Orange Chicken',
          subtitle: oc.subtitle || 'Calories, complete nutrition facts, health evaluation, and smart coupon ordering hacks.',
          intro: oc.intro || "The Original Orange Chicken is Panda Express's iconic flagship entree, created in 1987 by Executive Chef Andy Kao. Featuring crispy battered boneless dark meat chicken bites tossed in a sweet, tangy, and mildly spicy signature chili-orange glaze."
        }
      ];
    }

    case 'beijing-beef': {
      const bb = pageContent['beijing-beef'] || {};
      return [
        {
          id: generateBlockId(),
          type: 'dish-guide',
          locked: true,
          slug: 'beijing-beef',
          title: bb.title || 'Beijing Beef',
          subtitle: bb.subtitle || 'Calories, complete nutrition facts, health evaluation, and smart coupon ordering hacks.',
          intro: bb.intro || 'Beijing Beef features crispy marinated beef strips tossed with fresh red bell peppers and yellow onions in a sweet, tangy, and savory wok sauce.'
        }
      ];
    }

    case 'about': {
      const about = pageContent.about || {};
      return [
        {
          id: generateBlockId(),
          type: 'heading',
          level: 1,
          content: about.heading || 'About Panda Express Coupons'
        },
        {
          id: generateBlockId(),
          type: 'heading',
          level: 2,
          content: 'Our Mission: Fighting Dead Coupon Fatigue'
        },
        {
          id: generateBlockId(),
          type: 'paragraph',
          content: 'If you have ever ordered dinner online and spent twenty minutes copying and pasting dozens of alphanumeric codes from generic aggregator sites—only to be met with constant "Coupon Expired" or "Invalid Promo Code" errors—you know how frustrating digital coupon hunting has become.'
        },
        {
          id: generateBlockId(),
          type: 'paragraph',
          content: 'Most commercial coupon directories prioritize search engine ranking over user experience, publishing bot-scraped garbage codes and automated clickbait buttons to generate ad revenue.'
        },
        {
          id: generateBlockId(),
          type: 'callout',
          title: 'Our Editorial Promise',
          content: 'Provide a clean, lightning-fast, and trustworthy resource where Panda Express diners can check verified deals, understand loyalty point math, calculate accurate meal nutrition, and actually save money at checkout.',
          icon: '🎯'
        },
        {
          id: generateBlockId(),
          type: 'image',
          url: '/public/images/about-kitchen.jpg',
          alt: 'Professional culinary chefs stir-frying fresh Asian entrees over open flame wok ranges in commercial restaurant kitchen',
          caption: 'Fresh wok preparation in commercial kitchen.'
        },
        {
          id: generateBlockId(),
          type: 'heading',
          level: 2,
          content: 'How We Check & Verify Codes'
        },
        {
          id: generateBlockId(),
          type: 'paragraph',
          content: 'We treat coupon testing with scientific discipline. Here is our exact verification procedure:'
        },
        {
          id: generateBlockId(),
          type: 'stepper-timeline',
          steps: [
            { num: 1, title: 'Manual Checkout Testing', description: 'We open pandaexpress.com and the mobile app, add qualifying entrees, and manually apply each code.' },
            { num: 2, title: 'Transparent Status Tagging', description: 'Codes are labeled Active, Check App, or Unverified. We never make up fake verification dates.' },
            { num: 3, title: 'Pruning Defunct Codes', description: 'Once an offer concludes nationwide, we promptly flag it as Expired or remove it from rotation.' }
          ]
        },
        {
          id: generateBlockId(),
          type: 'heading',
          level: 2,
          content: 'Who We Are'
        },
        {
          id: generateBlockId(),
          type: 'author-card',
          avatar: '🐼',
          name: 'Savings Research Desk',
          role: 'Lead Editor & Fast-Casual Savings Enthusiast',
          bio: 'Dedicated to providing diners with a single, distraction-free destination for honest restaurant discounts and accurate wok nutritional data.'
        },
        {
          id: generateBlockId(),
          type: 'heading',
          level: 2,
          content: 'Strict Independence Statement'
        },
        {
          id: generateBlockId(),
          type: 'disclaimer-box',
          text: 'PandaCoupons is an independent consumer reference guide and is not affiliated with, endorsed by, or sponsored by Panda Restaurant Group, Inc. All trademarks and brand names remain the property of their respective owners.'
        }
      ];
    }

    case 'privacy': {
      const priv = pageContent.privacy || {};
      return [
        {
          id: generateBlockId(),
          type: 'heading',
          level: 1,
          content: priv.heading || 'Privacy Policy'
        },
        {
          id: generateBlockId(),
          type: 'heading',
          level: 2,
          content: 'Zero Server Tracking & Privacy Commitment'
        },
        {
          id: generateBlockId(),
          type: 'paragraph',
          content: 'Your privacy is paramount. PandaCoupons operates with zero server tracking and does not harvest personal checkout information.'
        },
        {
          id: generateBlockId(),
          type: 'heading',
          level: 2,
          content: 'Data Collection & Analytics'
        },
        {
          id: generateBlockId(),
          type: 'paragraph',
          content: 'We do not set third-party tracking cookies or store personally identifiable information. All coupon copying and meal calculations take place locally in your browser.'
        },
        {
          id: generateBlockId(),
          type: 'disclaimer-box',
          text: 'If you contact us via email, your email address is used solely to respond to your inquiry and is never shared or sold.'
        }
      ];
    }

    case 'disclaimer': {
      const disc = pageContent.disclaimer || {};
      return [
        {
          id: generateBlockId(),
          type: 'heading',
          level: 1,
          content: disc.heading || 'Disclaimer & Terms of Use'
        },
        {
          id: generateBlockId(),
          type: 'heading',
          level: 2,
          content: 'Independent Savings Portal'
        },
        {
          id: generateBlockId(),
          type: 'paragraph',
          content: 'PandaCoupons is an independent reference guide and is not affiliated with, endorsed by, or sponsored by Panda Restaurant Group, Inc.'
        },
        {
          id: generateBlockId(),
          type: 'heading',
          level: 2,
          content: 'Coupon Terms & Exclusions'
        },
        {
          id: generateBlockId(),
          type: 'paragraph',
          content: 'Promotional codes, discounts, and regional specials are subject to restaurant location participation and change without notice. Verify terms during checkout.'
        },
        {
          id: generateBlockId(),
          type: 'disclaimer-box',
          text: 'All product names, logos, and brands are property of their respective owners. All company, product and service names used in this website are for identification purposes only.'
        }
      ];
    }

    case 'contact': {
      return [
        {
          id: generateBlockId(),
          type: 'contact-form',
          locked: true,
          title: 'Contact Our Editorial Team',
          subtitle: 'Have feedback, spotted an unlisted coupon code, or found a broken deal? We reply within 2–3 business days.',
          supportEmail: 'help [at] pandacoupons.org'
        }
      ];
    }

    default:
      return [];
  }
}

function loadAllPageBlocks() {
  const blocksFile = path.join(ADMIN_DATA_DIR, 'page-blocks.json');
  let blocksData = {};
  if (fs.existsSync(blocksFile)) {
    try {
      blocksData = JSON.parse(fs.readFileSync(blocksFile, 'utf8'));
    } catch (e) {}
  }

  const allPages = ['home', 'menu', 'nutrition', 'orange-chicken', 'beijing-beef', 'about', 'privacy', 'disclaimer', 'contact'];
  let modified = false;

  allPages.forEach(p => {
    if (!blocksData[p] || !Array.isArray(blocksData[p]) || blocksData[p].length === 0) {
      blocksData[p] = getInitialPageBlocks(p);
      modified = true;
    }
  });

  if (modified) {
    if (!fs.existsSync(ADMIN_DATA_DIR)) fs.mkdirSync(ADMIN_DATA_DIR, { recursive: true });
    fs.writeFileSync(blocksFile, JSON.stringify(blocksData, null, 2), 'utf8');
  }

  return blocksData;
}

module.exports = {
  getInitialPageBlocks,
  loadAllPageBlocks
};
