/**
 * Panda Express Menu Page Generator (World-Class UI/UX Edition)
 * Full Atmospheric Canvas, Alternating Sizzling Dark Wok Studio & Warm Linen Canvas,
 * Real-time Search, Sticky Glass Discovery Bar & High-Definition Food Cards
 */
const fs = require('fs');
const path = require('path');
const menuData = require('../../data/menu.json');
const { getDynamicDate } = require('../utils/date');

function renderMenu() {
  const { currentMonthYear, currentYear } = getDynamicDate();
  let adminContent = {};
  try {
    const contentPath = path.join(__dirname, '../../data/admin/page-content.json');
    if (fs.existsSync(contentPath)) adminContent = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  } catch (e) {}

  let pageBlocks = {};
  try {
    const blocksPath = path.join(__dirname, '../../data/admin/page-blocks.json');
    if (fs.existsSync(blocksPath)) pageBlocks = JSON.parse(fs.readFileSync(blocksPath, 'utf8'));
  } catch (e) {}

  const menuBlocks = pageBlocks.menu || [];
  const menuGridBlock = menuBlocks.find(b => b.type === 'menu-grid');

  const menuContent = adminContent.menu || {};
  const badgeText = menuGridBlock?.badgeText || menuContent.badgeText || '🐼 OFFICIAL 2026 PANDA EXPRESS MENU &amp; PRICES';
  const heroTitle = menuGridBlock?.heading || menuContent.heroTitle || 'Panda Express Menu with Prices &amp; Pictures';
  const heroSubtitle = menuGridBlock?.subtext || menuContent.heroSubtitle || 'Explore complete 2026 pricing, per-serving calorie counts, portion options, and high-definition photography for all Bowls, Plates, A La Carte Entrées, Sides, Crafted Refreshers, and Catering Trays.';
  const stat1Label = menuGridBlock?.stat1Label || menuContent.stat1Label || 'Wok-Crafted Dishes';
  const stat2Label = menuGridBlock?.stat2Label || menuContent.stat2Label || 'A La Carte Boxes';
  const stat3Label = menuGridBlock?.stat3Label || menuContent.stat3Label || 'Zero Artificial Trans Fat';

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Panda Express Menu", url: "/panda-express-menu/" }
  ];

  const totalItemsCount = menuData.categories.reduce((acc, cat) => acc + cat.items.length, 0);

  // Category Icon & Theme Mapping
  function getCategoryTheme(catId) {
    switch (catId) {
      case 'entrees':
        return {
          sectionClass: 'theme-dark-wok',
          cardClass: 'card-theme-dark',
          icon: '🥢',
          isDark: true,
          kickerClass: 'kicker-gold'
        };
      case 'crafted-drinks':
      case 'drinks':
        return {
          sectionClass: 'theme-refresh-sunset',
          cardClass: 'card-theme-light',
          icon: '🧋',
          isDark: false,
          kickerClass: 'kicker-red'
        };
      case 'protein-plates':
        return {
          sectionClass: 'theme-wellness-mint',
          cardClass: 'card-theme-light',
          icon: '🏋️',
          isDark: false,
          kickerClass: 'kicker-red'
        };
      case 'catering':
        return {
          sectionClass: 'theme-banquet-gold',
          cardClass: 'card-theme-dark',
          icon: '🎉',
          isDark: true,
          kickerClass: 'kicker-gold'
        };
      case 'kids-menu':
        return {
          sectionClass: 'theme-warm-cream',
          cardClass: 'card-theme-light',
          icon: '🐼',
          isDark: false,
          kickerClass: 'kicker-red'
        };
      case 'sides':
        return {
          sectionClass: 'theme-warm-cream',
          cardClass: 'card-theme-light',
          icon: '🍚',
          isDark: false,
          kickerClass: 'kicker-red'
        };
      case 'appetizers':
        return {
          sectionClass: 'theme-warm-cream',
          cardClass: 'card-theme-light',
          icon: '🥟',
          isDark: false,
          kickerClass: 'kicker-red'
        };
      default:
        return {
          sectionClass: 'theme-warm-cream',
          cardClass: 'card-theme-light',
          icon: '🥣',
          isDark: false,
          kickerClass: 'kicker-red'
        };
    }
  }

  const content = `
  <div class="menu-page-canvas">
    <!-- 1. EPIC CINEMATIC HERO BANNER -->
    <section class="menu-hero-epic" aria-labelledby="menu-main-title">
      <div class="menu-hero-epic-overlay"></div>
      <div class="container relative-z">
        <div class="hero-pill-badge">
          <span>${badgeText}</span>
        </div>
        <h1 id="menu-main-title" class="dish-hero-title">
          ${heroTitle}
        </h1>
        <p class="dish-hero-subtitle">
          ${heroSubtitle}
        </p>

        <div style="display: flex; gap: 0.9rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
          <a href="/#coupon-section" class="btn btn-hero-primary">
            <span>🎟️ Apply 20% Off Coupon</span>
          </a>
          <a href="/panda-express-nutrition/" class="btn btn-hero-secondary">
            <span>⚡ Launch Nutrition Calculator</span>
          </a>
        </div>

        <!-- Quick Hero Stats Row -->
        <div class="hero-stats-row">
          <div class="hero-stat-box">
            <span class="hero-stat-val">50+</span>
            <span class="hero-stat-desc">${stat1Label}</span>
          </div>
          <div class="hero-stat-box">
            <span class="hero-stat-val">From $5.40</span>
            <span class="hero-stat-desc">${stat2Label}</span>
          </div>
          <div class="hero-stat-box">
            <span class="hero-stat-val">100%</span>
            <span class="hero-stat-desc">${stat3Label}</span>
          </div>
          <div class="hero-stat-box">
            <span class="hero-stat-val" style="color: #F5B301;">${currentMonthYear}</span>
            <span class="hero-stat-desc">Verified Pricing</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. QUICK SUMMARY PRICING BOARD (FLOATING) -->
    <div class="container" style="position: relative; z-index: 10;">
      <div class="menu-summary-board" id="menu-overview">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="kicker-tag kicker-red" style="margin-bottom: 0.35rem;">QUICK MENU BOARD</span>
            <h2 style="margin: 0; font-size: 1.7rem;">Panda Express Menu Summary (${currentYear})</h2>
          </div>
          <span style="font-size: 0.88rem; color: var(--color-muted-text); font-weight: 600;">Standard corporate store pricing</span>
        </div>

        <!-- Desktop Table View (>= 769px) -->
        <div class="table-responsive menu-summary-table-desktop" style="margin: 0; border: 1px solid #EAE3D6; border-radius: 12px; max-width: 100%; box-sizing: border-box;">
          <table class="menu-summary-table" summary="Summary of Panda Express menu categories, items included, calorie ranges, starting prices, and best use cases.">
            <thead>
              <tr>
                <th scope="col" style="min-width: 130px;">Menu Category</th>
                <th scope="col" style="min-width: 95px;">Starting Price</th>
                <th scope="col" style="min-width: 140px;">What's Included</th>
                <th scope="col" style="min-width: 110px;">Calories Range</th>
                <th scope="col" style="min-width: 130px;">Best For</th>
                <th scope="col" style="text-align: right; min-width: 100px;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${menuData.summaryTable.map((row) => `
                <tr>
                  <td>
                    <div class="summary-cat-cell">
                      <span>${row.icon}</span>
                      <strong>${row.category}</strong>
                    </div>
                  </td>
                  <td><span class="summary-price-badge">${row.price}</span></td>
                  <td>${row.included}</td>
                  <td><span class="summary-cal-val" style="font-weight: 700;">${row.calories}</span></td>
                  <td>${row.bestFor}</td>
                  <td style="text-align: right;">
                    <a href="#${row.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" class="btn-order-direct-sm" style="font-size: 0.78rem; white-space: nowrap;">
                      View Items &darr;
                    </a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Mobile Card List View (<= 768px) -->
        <div class="menu-summary-cards-mobile">
          ${menuData.summaryTable.map((row) => `
            <div class="menu-summary-card-item">
              <div class="summary-card-item-top">
                <div class="summary-cat-cell">
                  <span>${row.icon}</span>
                  <strong>${row.category}</strong>
                </div>
                <span class="summary-price-badge">${row.price}</span>
              </div>
              <div class="summary-card-item-body">
                <div class="summary-meta-row">
                  <span class="meta-label">Included:</span>
                  <span class="meta-value">${row.included}</span>
                </div>
                <div class="summary-meta-row">
                  <span class="meta-label">Calories:</span>
                  <span class="meta-value cal-value">${row.calories}</span>
                </div>
                <div class="summary-meta-row">
                  <span class="meta-label">Best For:</span>
                  <span class="meta-value">${row.bestFor}</span>
                </div>
              </div>
              <div class="summary-card-item-footer">
                <a href="#${row.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" class="btn-order-direct-sm" style="width: 100%; justify-content: center;">
                  View ${row.category} Items &darr;
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- 3. STICKY GLASS DISCOVERY BAR (SEARCH + CATEGORIES) -->
    <div class="container" style="position: relative; z-index: 20;">
      <div class="menu-category-sticky-bar">
        <!-- Live Instant Search -->
        <div class="menu-search-toolbar">
          <div class="menu-search-input-box">
            <span class="menu-search-icon-pos">🔍</span>
            <input type="text" id="menuSearchInput" placeholder="Search dishes, ingredients, or macros (e.g. Orange Chicken, Wagyu, Sirloin, Chow Mein)..." autocomplete="off" aria-label="Search Panda Express menu">
            <button type="button" id="menuClearSearch" class="menu-search-clear-btn" style="display: none;" aria-label="Clear menu search">✕</button>
          </div>
          <div id="menuMatchCount" class="menu-match-count" style="font-size: 0.88rem; font-weight: 800; white-space: nowrap;" aria-live="polite">
            Showing all ${totalItemsCount} items
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="category-pills-row" role="group" aria-label="Menu categories">
          <button type="button" class="cat-nav-pill is-active" data-cat="all" aria-pressed="true">🍽️ All Items (${totalItemsCount})</button>
          ${menuData.categories.map((cat) => {
            const theme = getCategoryTheme(cat.id);
            return `
              <button type="button" class="cat-nav-pill" data-cat="${cat.id}" aria-pressed="false">
                <span>${theme.icon}</span>
                <span>${cat.name.split(' (')[0]}</span>
                <span style="opacity: 0.65; font-size: 0.78rem;">(${cat.items.length})</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- 4. ATMOSPHERIC ALTERNATING SECTIONS -->
    <div id="menuCardsContainer">
      <!-- Menu Empty State -->
      <div id="menuEmptyState" class="menu-empty-state is-hidden container" style="text-align: center; padding: 4rem 1.5rem; border: 2px dashed #CBD5E1; border-radius: 20px; margin: 2rem auto; max-width: 680px;">
        <div style="font-size: 2.75rem; margin-bottom: 0.75rem;">🥢</div>
        <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">No menu items match your search</h3>
        <p style="max-width: 440px; margin: 0 auto 1.5rem auto;">Try checking your spelling or clear your search query to see the complete Panda Express menu.</p>
        <button type="button" id="btnClearMenuFilters" class="btn btn-hero-primary" style="padding: 0.6rem 1.5rem; font-size: 0.95rem;">Clear filters</button>
      </div>
      ${menuData.categories.map((cat) => {
        const theme = getCategoryTheme(cat.id);
        return `
          <section id="${cat.id}" class="menu-section-wrapper menu-category-block ${theme.sectionClass}" data-category-id="${cat.id}">
            <div class="container">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.65rem; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <span class="kicker-tag ${theme.kickerClass}" style="font-size: 0.72rem; margin-bottom: 0.35rem;">
                    ${theme.icon} ${cat.badge}
                  </span>
                  <h2 style="margin: 0; font-size: clamp(1.6rem, 3.5vw, 2.25rem); font-weight: 900; letter-spacing: -0.02em;">
                    ${cat.name}
                  </h2>
                </div>
                <span class="category-item-count" style="font-size: 0.9rem; font-weight: 800;">
                  ${cat.items.length} items available
                </span>
              </div>
              <p class="section-subtext" style="margin-bottom: 2.25rem; max-width: 820px; font-size: 1.02rem; line-height: 1.65; font-weight: 500;">
                ${cat.description}
              </p>

              <div class="card-grid">
                ${cat.items.map((item) => {
                  const searchStr = (item.name + ' ' + item.description + ' ' + (item.tags || []).join(' ')).toLowerCase();
                  return `
                    <article class="menu-item-card ${theme.cardClass}" data-category="${cat.id}" data-search="${searchStr}">
                      <div class="card-img-wrapper">
                        <div class="card-img-scrim"></div>
                        ${item.isPremium ? '<div class="premium-ribbon-gold">⭐ Premium Entrée</div>' : ''}
                        <img src="${item.image}" alt="${item.name} - Panda Express Menu with Prices &amp; Pictures" width="600" height="400" loading="lazy" decoding="async" class="zoom-on-hover-img">
                        <span class="card-cal-badge">${item.calories}</span>
                      </div>

                      <div class="menu-card-body">
                        <div style="margin-bottom: 0.5rem;">
                          <h3 class="card-title" style="font-size: 1.2rem; font-weight: 850; line-height: 1.3; margin: 0;">${item.name}</h3>
                        </div>

                        <div style="margin-bottom: 0.75rem;">
                          <span class="card-price-tag">${item.price}</span>
                        </div>

                        <p class="card-desc" style="font-size: 0.92rem; line-height: 1.55; margin-bottom: 0.65rem;">
                          ${item.description}
                        </p>

                        ${item.tags && item.tags.length > 0 ? `
                          <div class="item-tags-row">
                            ${item.tags.map(tag => `<span class="item-tag-pill">${tag}</span>`).join('')}
                          </div>
                        ` : ''}

                        <div class="menu-card-footer">
                          ${item.guideUrl ? `
                            <a href="${item.guideUrl}" style="font-size: 0.85rem; color: #C8102E; font-weight: 800; text-decoration: none;">
                              Read Food Guide &rarr;
                            </a>
                          ` : `
                            <a href="/panda-express-nutrition/" class="menu-card-nutrition-link" style="font-size: 0.85rem; font-weight: 700; text-decoration: none;">
                            Nutrition Facts &rarr;
                          </a>
                          `}
                          <a href="https://www.pandaexpress.com" target="_blank" rel="noopener noreferrer" class="btn-order-direct-sm" title="Order ${item.name} on pandaexpress.com">
                            <span>Order ↗</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  `;
                }).join('')}
              </div>
            </div>
          </section>
        `;
      }).join('')}
    </div>

    <!-- 5. MONEY-SAVING MENU HACKS (WARM HIGHLIGHT SECTION) -->
    <section class="menu-section-wrapper theme-warm-cream" style="padding: 4.5rem 0;" aria-labelledby="menu-hacks-heading">
      <div class="container">
        <div class="section-title-header text-center">
          <span class="kicker-tag kicker-red">INSIDER TIPS</span>
          <h2 id="menu-hacks-heading" style="font-size: clamp(1.8rem, 3.5vw, 2.35rem); font-weight: 900;">
            Smart Hacks to Get More Food for Less at Panda Express
          </h2>
          <p style="max-width: 780px; margin: 0 auto;">
            Tested ordering secrets to maximize your portion size, flavor variety, and wallet savings:
          </p>
        </div>

        <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
          <div class="discount-feature-card highlight-gold-border">
            <div class="discount-card-badge gold-badge">PORTION HACK</div>
            <div class="discount-icon">⚖️</div>
            <h3>Order Half &amp; Half Sides</h3>
            <p>You never have to choose just Chow Mein or Fried Rice! Ask the server for <strong>half Chow Mein and half Fried Rice</strong> (or half Super Greens) for zero extra fee. You get double the variety and often slightly more food volume.</p>
          </div>

          <div class="discount-feature-card highlight-gold-border">
            <div class="discount-card-badge gold-badge">VALUE KING</div>
            <div class="discount-icon">🍱</div>
            <h3>Bigger Plate is the Lowest Cost Per Entrée</h3>
            <p>A Bigger Plate costs only ~$2.00 more than a regular Plate, but gives you a full 3rd entrée. Whether you're splitting with a friend or packing leftovers for tomorrow, the Bigger Plate yields the highest food-per-dollar ratio.</p>
          </div>

          <div class="discount-feature-card">
            <div class="discount-card-badge">FREE FLAVOR</div>
            <div class="discount-icon">🥣</div>
            <h3>Free Extra Teriyaki &amp; Chili Sauce</h3>
            <p>Panda Express offers Sweet &amp; Sour sauce, Hot Mustard, and Soy Sauce packets completely free. You can also request a complimentary cup of warm Teriyaki glaze on the side with any order!</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. BOTTOM CTA PROMO BANNER (DARK WOK STYLE) -->
    <div class="container" style="padding: 3rem 1.5rem 5rem 1.5rem;">
      <div style="background: linear-gradient(135deg, #111116 0%, #1A1A22 100%); border: 1px solid rgba(255,255,255,0.15); border-radius: 28px; padding: 4rem 2rem; text-align: center; box-shadow: 0 20px 48px rgba(0,0,0,0.35);">
        <span class="hero-pill-badge" style="margin-bottom: 1rem;">SAVE ON YOUR ORDER</span>
        <h2 style="color: #FFFFFF; font-size: clamp(2rem, 4vw, 2.75rem); margin-top: 0; margin-bottom: 1rem; font-weight: 900;">
          Ready to Order? Grab a 20% Off Code First
        </h2>
        <p style="color: #E2E8F0; max-width: 650px; margin: 0 auto 2.25rem auto; font-size: 1.12rem; line-height: 1.65; font-weight: 500;">
          Check our verified coupon database for today's active coupon codes, or calculate your meal's exact calories, protein, and fat.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="/#coupon-section" class="btn btn-hero-primary" style="font-size: 1.05rem; padding: 0.9rem 1.8rem;">
            <span>🎟️ Copy Today's Working Codes</span>
          </a>
          <a href="/panda-express-savings-calculator/" class="btn btn-hero-secondary" style="font-size: 1.05rem; padding: 0.9rem 1.8rem;">
            <span>🧮 Group Savings Calculator</span>
          </a>
          <a href="/panda-express-nutrition/" class="btn btn-hero-secondary" style="font-size: 1.05rem; padding: 0.9rem 1.8rem;">
            <span>⚡ Launch Nutrition Calculator</span>
          </a>
        </div>
      </div>
    </div>
  </div>
  `;

  return {
    title: `Panda Express Menu with Prices & Pictures (2026 Updated)`,
    description: `Browse the complete Panda Express menu with prices and pictures. See calorie counts, portion sizes, and savings for Bowls, Plates, Entrées, Sides, and Catering.`,
    canonicalPath: '/panda-express-menu/',
    ogImage: '/public/images/og/og-menu.jpg',
    ogImageAlt: 'Panda Express Menu with Prices and Pictures',
    content,
    breadcrumbs
  };
}

module.exports = renderMenu;
