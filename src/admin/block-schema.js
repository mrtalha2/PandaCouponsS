/**
 * Block Schema Definitions & Constraints
 * Defines free blocks, smart blocks, allowed attributes, and page-specific component constraints.
 */

const FREE_BLOCK_TYPES = [
  'heading',
  'paragraph',
  'image',
  'button',
  'quote',
  'callout',
  'faq-item',
  'divider',
  'spacer',
  'stepper-timeline',
  'author-card',
  'disclaimer-box'
];

const SMART_BLOCK_TYPES = [
  'hero',
  'stats-bar',
  'coupon-grid',
  'rewards-calculator',
  'family-meal-stepper',
  'faq-accordion',
  'nutrition-calculator',
  'menu-grid',
  'dish-guide',
  'contact-form'
];

// Which smart blocks are logically permitted on which pages
const PAGE_ALLOWED_SMART_BLOCKS = {
  'home': ['hero', 'stats-bar', 'coupon-grid', 'rewards-calculator', 'family-meal-stepper', 'faq-accordion'],
  'menu': ['hero', 'stats-bar', 'menu-grid', 'faq-accordion'],
  'nutrition': ['hero', 'nutrition-calculator', 'faq-accordion'],
  'orange-chicken': ['dish-guide', 'faq-accordion'],
  'beijing-beef': ['dish-guide', 'faq-accordion'],
  'about': ['callout', 'stepper-timeline', 'author-card', 'disclaimer-box'],
  'privacy': ['disclaimer-box'],
  'disclaimer': ['disclaimer-box'],
  'contact': ['contact-form']
};

function generateBlockId() {
  return 'b_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36).substring(4);
}

function createDefaultBlock(type, pageSlug = 'home') {
  const id = generateBlockId();

  switch (type) {
    case 'heading':
      return { id, type, level: 2, content: 'Enter Section Heading Here' };
    case 'paragraph':
      return { id, type, content: 'Enter your paragraph text here. Click to format bold, italic, or add links.' };
    case 'image':
      return { id, type, url: '/public/images/hero-wok.jpg', alt: 'Panda Express fresh wok dish', caption: '' };
    case 'button':
      return { id, type, text: '🎟️ View Deals', url: '#coupon-section', target: '_self', style: 'primary' };
    case 'quote':
      return { id, type, content: 'Providing honest, verified Panda Express savings for every meal.', author: 'Lead Editor', role: 'Savings Specialist' };
    case 'callout':
      return { id, type, title: 'Important Note', content: 'Always check checkout totals before placing orders.', icon: '🎯' };
    case 'faq-item':
      return { id, type, question: 'How do I redeem Panda Express promo codes?', answer: 'Enter the promo code in the coupon field during online checkout at pandaexpress.com or in the mobile app.' };
    case 'divider':
      return { id, type };
    case 'spacer':
      return { id, type, height: '2rem' };
    case 'stepper-timeline':
      return {
        id,
        type,
        steps: [
          { num: 1, title: 'Manual Checkout Testing', description: 'We test every code on live carts before publishing.' },
          { num: 2, title: 'Transparent Status Tagging', description: 'Codes are clearly marked Active, Check App, or Expired.' },
          { num: 3, title: 'Pruning Defunct Codes', description: 'Defunct offers are pruned immediately.' }
        ]
      };
    case 'author-card':
      return {
        id,
        type,
        avatar: '🐼',
        name: 'Alex Rivera',
        role: 'Lead Editor & Savings Specialist',
        bio: 'Tracking fast-casual savings and restaurant nutrition data since 2020.'
      };
    case 'disclaimer-box':
      return {
        id,
        type,
        text: 'PandaCoupons is an independent consumer savings directory and is not affiliated with, endorsed by, or sponsored by Panda Restaurant Group, Inc.'
      };
    case 'coupon-grid':
      return {
        id,
        type,
        locked: true,
        heading: 'Working Panda Express Coupon Codes',
        subtext: 'A Panda Express coupon code is an alphanumeric promotional string applied at checkout for immediate discounts.',
        deliveryNotice: 'Official promotional vouchers do NOT function on DoorDash, Uber Eats, Grubhub, or Postmates.'
      };
    case 'rewards-calculator':
      return {
        id,
        type,
        locked: true,
        heading: 'Panda Rewards: The Most Consistent Way to Save',
        subtext: 'Earn 10 points per $1 spent via the app, website, or in-store scan.'
      };
    case 'family-meal-stepper':
      return {
        id,
        type,
        locked: true,
        heading: 'Panda Express Family Meal Deals: $35 vs $48',
        subtext: 'Feeding 4 to 5 people? The Panda Express Family Meal bundle delivers 2 large sides and 3 large entrees.'
      };
    case 'faq-accordion':
      return {
        id,
        type,
        locked: true,
        heading: 'Frequently Asked Questions',
        subtext: 'Everything you need to know about Panda Express coupons, app redemption, and policies.'
      };
    case 'nutrition-calculator':
      return {
        id,
        type,
        locked: true,
        badgeText: 'Interactive Nutrition & Macro Engine (2026 Edition)',
        heading: 'Panda Express Nutrition Calculator',
        subtext: 'Instantly calculate calories, macronutrients, and allergen disclosures for custom bowls, plates, and entrees.',
        disclosure: 'Nutritional figures and allergen flags are compiled directly from published nutrition disclosures.'
      };
    case 'menu-grid':
      return {
        id,
        type,
        locked: true,
        badgeText: '🐼 OFFICIAL 2026 PANDA EXPRESS MENU & PRICES',
        heading: 'Panda Express Menu with Prices & Pictures',
        subtext: 'Explore complete 2026 pricing, per-serving calorie counts, portion options, and photography.'
      };
    case 'dish-guide':
      return {
        id,
        type,
        locked: true,
        slug: pageSlug === 'beijing-beef' ? 'beijing-beef' : 'orange-chicken',
        title: pageSlug === 'beijing-beef' ? 'Beijing Beef' : 'The Original Orange Chicken',
        subtitle: 'Calories, complete nutrition facts, health evaluation, and smart coupon ordering hacks.',
        intro: 'Crispy, wok-tossed specialty entree prepared fresh throughout the day.'
      };
    case 'contact-form':
      return {
        id,
        type,
        locked: true,
        title: 'Contact Our Editorial Team',
        subtitle: 'Have feedback, spotted an unlisted coupon code, or found a broken deal? We reply within 2–3 business days.',
        supportEmail: 'help [at] pandacoupons.org'
      };
    default:
      return { id, type: 'paragraph', content: '' };
  }
}

module.exports = {
  FREE_BLOCK_TYPES,
  SMART_BLOCK_TYPES,
  PAGE_ALLOWED_SMART_BLOCKS,
  generateBlockId,
  createDefaultBlock
};
