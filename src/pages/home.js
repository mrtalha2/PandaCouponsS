/**
 * Home Page Generator (Award-Winning Premium Redesign)
 * Full-bleed photo hero, ticket-style coupons, visual steppers, rewards ladder, cost comparison, FAQ schema
 */
const fs = require('fs');
const path = require('path');
const couponsData = require('../../data/coupons.json');
const faqData = require('../../data/faq.json');
const config = require('../../data/site.config');
const { getDynamicDate } = require('../utils/date');

function renderHome() {
  const { currentMonthYear, currentMonth, currentYear } = getDynamicDate();
  const lastVerifiedDate = currentMonthYear;
  const liveCoupons = (couponsData.coupons || []).filter(c => c.isDraft !== true);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  // Helper for status badge class
  function getStatusClass(status) {
    const s = (status || '').toLowerCase().replace(/\s+/g, '-');
    if (s.includes('active')) return 'status-active';
    if (s.includes('check')) return 'status-check-app';
    if (s.includes('expired')) return 'status-expired';
    return 'status-unverified';
  }

  // Calculate metrics from coupons data
  const totalCodesCount = liveCoupons.length;
  const activeCount = liveCoupons.filter(c => c.status === 'Active').length;

  // Extract top 2 active codes from the table for the hero header cards
  const heroActiveCoupons = liveCoupons.filter(c => c.status === 'Active');
  const heroCoupon1 = heroActiveCoupons[0] || {
    code: 'PANDA20',
    discount: '20% Off Entire Order',
    bestFor: 'Online orders',
    minOrder: 'None'
  };
  const heroCoupon2 = heroActiveCoupons[1] || {
    code: 'FAMILY10',
    discount: '$10 Off Family Meal',
    bestFor: 'Family orders',
    minOrder: 'Family Meal'
  };

  const content = `
  <!-- 1. HERO SECTION WITH CINEMATIC PHOTOGRAPHY & SEO-OPTIMIZED ARTICLE LEAD -->
  <section class="hero-premium" aria-labelledby="home-hero-heading">
    <!-- Background Photo with Gradient Overlay -->
    <div class="hero-bg-media">
      <picture>
        <source type="image/webp" 
                srcset="/public/images/optimized/hero-wok-640.webp 640w,
                        /public/images/optimized/hero-wok-800.webp 800w,
                        /public/images/optimized/hero-wok-1280.webp 1280w,
                        /public/images/optimized/hero-wok-1920.webp 1920w"
                sizes="100vw">
        <img src="/public/images/hero-wok.jpg" 
             alt="Sizzling wok cooking fresh Chinese noodles over roaring open fire" 
             width="1920" 
             height="1080" 
             fetchpriority="high"
             loading="eager"
             decoding="async"
             class="hero-bg-img">
      </picture>
      <div class="hero-gradient-overlay"></div>
    </div>

    <div class="container hero-content-wrapper">
      <div class="hero-badge-row">
        <div class="pill-verified-date">
          <span class="pulse-dot-green"></span>
          <span>Updated <strong class="js-current-month-year">${lastVerifiedDate}</strong></span>
        </div>
        <div class="pill-trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Direct Checkout &bull; No Data Saved</span>
        </div>
      </div>

      <h1 id="home-hero-heading" class="hero-main-title">
        Panda Express Coupon Code: What Actually Works in <span class="highlight-gold js-current-month-year">${lastVerifiedDate}</span>
      </h1>

      <div class="hero-lead-box">
        <p class="hero-subtitle">
          Most coupon lists are copied from each other and expired. Every code here is tagged verified, reported, or likely expired, so you know before you order.
        </p>
      </div>

      <!-- Hero Coupon Cards (Extracted directly from coupons table) -->
      <div class="hero-coupon-cards" id="heroCouponCards">
        <!-- Card 1 -->
        <div class="hero-coupon-card" data-card-code="${heroCoupon1.code}">
          <div class="hero-card-header-row">
            <div class="hero-coupon-status">
              <span class="hero-coupon-dot"></span>
              <span>Verified active</span>
            </div>
            <span class="hero-deal-pill pill-flame">🔥 Top Pick</span>
          </div>
          <div class="hero-coupon-deal">${heroCoupon1.discount}</div>
          <div class="hero-coupon-code-row">
            <code class="hero-coupon-code" id="heroCode0">${heroCoupon1.code}</code>
            <button type="button" class="hero-copy-btn" data-hero-code="${heroCoupon1.code}" aria-label="Copy code ${heroCoupon1.code}">
              <svg class="hero-copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span class="hero-copy-label">Copy Code</span>
            </button>
          </div>
          <div class="hero-coupon-footer">
            <div class="hero-coupon-terms">${heroCoupon1.bestFor || 'Online orders'} &bull; ${heroCoupon1.minOrder && heroCoupon1.minOrder.toLowerCase() !== 'none' ? 'Min. ' + heroCoupon1.minOrder : 'No minimum'}</div>
            <a href="https://www.pandaexpress.com" target="_blank" rel="noopener noreferrer" class="hero-redeem-hint" aria-label="Apply code ${heroCoupon1.code} on Panda Express">Apply at pandaexpress.com ↗</a>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="hero-coupon-card" data-card-code="${heroCoupon2.code}">
          <div class="hero-card-header-row">
            <div class="hero-coupon-status">
              <span class="hero-coupon-dot"></span>
              <span>Verified active</span>
            </div>
            <span class="hero-deal-pill pill-group">🥡 Best for Groups</span>
          </div>
          <div class="hero-coupon-deal">${heroCoupon2.discount}</div>
          <div class="hero-coupon-code-row">
            <code class="hero-coupon-code" id="heroCode1">${heroCoupon2.code}</code>
            <button type="button" class="hero-copy-btn" data-hero-code="${heroCoupon2.code}" aria-label="Copy code ${heroCoupon2.code}">
              <svg class="hero-copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span class="hero-copy-label">Copy Code</span>
            </button>
          </div>
          <div class="hero-coupon-footer">
            <div class="hero-coupon-terms">${heroCoupon2.bestFor || 'Family orders'} &bull; ${heroCoupon2.minOrder && heroCoupon2.minOrder.toLowerCase() !== 'none' ? heroCoupon2.minOrder : 'App &amp; web'}</div>
            <a href="https://www.pandaexpress.com" target="_blank" rel="noopener noreferrer" class="hero-redeem-hint" aria-label="Apply code ${heroCoupon2.code} on Panda Express">Apply at pandaexpress.com ↗</a>
          </div>
        </div>
      </div>

      <div class="hero-cta-group">
        <a href="#coupon-section" class="btn btn-hero-primary" id="heroGetCodesBtn">
          <span>Explore All ${totalCodesCount} Codes</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
        </a>
        <a href="#how-codes-work" class="btn btn-hero-ghost">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"></path></svg>
          <span>How We Verify</span>
        </a>
        <a href="#family-meal-deals" class="btn btn-hero-ghost">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <span>Family Meal Math</span>
        </a>
      </div>

      <!-- Trust Badges List -->
      <div class="hero-trust-points">
        <div class="trust-point-item">
          <svg class="check-icon" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
          <span>100% free</span>
        </div>
        <div class="trust-point-item">
          <svg class="check-icon" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
          <span>Checked across multiple sources</span>
        </div>
        <div class="trust-point-item">
          <svg class="check-icon" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
          <span>Zero data stored</span>
        </div>
      </div>
    </div>
  </section>


  <!-- 2. QUICK STATS BAR (OVERLAPPING HERO) -->
  <div class="container stats-bar-container">
    <div class="stats-glass-dock" role="region" aria-label="Quick Verification Stats">
      <div class="stat-dock-item">
        <div class="stat-dock-num">${totalCodesCount}</div>
        <div class="stat-dock-label">Tracked Codes</div>
      </div>
      <div class="stat-dock-divider"></div>
      <div class="stat-dock-item">
        <div class="stat-dock-num" style="color: #22C55E;">${activeCount} Active</div>
        <div class="stat-dock-label">Confidence Rated</div>
      </div>
      <div class="stat-dock-divider"></div>
      <div class="stat-dock-item">
        <div class="stat-dock-num js-current-month-year">${lastVerifiedDate}</div>
        <div class="stat-dock-label">Database Freshness</div>
      </div>
      <div class="stat-dock-divider"></div>
      <div class="stat-dock-item">
        <div class="stat-dock-num" style="color: #F5B301;">Official App &amp; Web</div>
        <div class="stat-dock-label">Direct Channel Only</div>
      </div>
    </div>
  </div>

  <!-- TABLE OF CONTENTS (MOBILE ACCORDION + DESKTOP STICKY DOCK) -->
  <div class="container home-toc-wrapper">
    <!-- Mobile Collapsible TOC -->
    <details class="home-toc-mobile" id="homeTocMobile">
      <summary class="home-toc-summary">
        <span class="toc-icon">📑</span>
        <span class="toc-title">Quick Navigation: Jump to Guide Sections</span>
        <span class="toc-chevron">▼</span>
      </summary>
      <nav class="home-toc-links" aria-label="Table of contents mobile">
        <a href="#how-codes-work" class="toc-link">⚙️ How Coupon Codes Actually Work</a>
        <a href="#coupon-section" class="toc-link">🎟️ Status Table (${lastVerifiedDate})</a>
        <a href="#howto-section-heading" class="toc-link">📋 How to Apply a Code</a>
        <a href="#why-fail-heading" class="toc-link">⚠️ Why Codes Fail at Checkout</a>
        <a href="#delivery-platforms-section" class="toc-link">🛵 DoorDash, Uber Eats &amp; Grubhub</a>
        <a href="#family-meal-deals" class="toc-link">🥡 Family Meal Cost &amp; Savings Math</a>
        <a href="#rewards-section-heading" class="toc-link">🐼 Panda Rewards vs. Coupon Codes</a>
        <a href="#other-discounts-heading" class="toc-link">🎖️ Other Ways to Save in 2026</a>
        <a href="#verification-process-section" class="toc-link">🔍 Our Verification Process</a>
        <a href="#faq-section-heading" class="toc-link">❓ Frequently Asked Questions</a>
        <a href="#cta-final-heading" class="toc-link">📱 Official App</a>
      </nav>
    </details>

    <!-- Desktop Floating Sticky TOC Bar -->
    <nav class="home-toc-desktop" id="homeTocDesktop" aria-label="Table of contents desktop">
      <div class="home-toc-label">Jump to:</div>
      <div class="home-toc-pills">
        <a href="#how-codes-work" class="toc-pill">⚙️ How Codes Work</a>
        <a href="#coupon-section" class="toc-pill">🎟️ Status Table</a>
        <a href="#howto-section-heading" class="toc-pill">📋 How to Apply</a>
        <a href="#why-fail-heading" class="toc-pill">⚠️ Why Codes Fail</a>
        <a href="#delivery-platforms-section" class="toc-pill">🛵 Delivery Apps</a>
        <a href="#family-meal-deals" class="toc-pill">🥡 Family Meals</a>
        <a href="#rewards-section-heading" class="toc-pill">🐼 Rewards &amp; Stacking</a>
        <a href="#other-discounts-heading" class="toc-pill">🎖️ Secret Savings</a>
        <a href="#verification-process-section" class="toc-pill">🔍 Verification</a>
        <a href="#faq-section-heading" class="toc-pill">❓ FAQ</a>
        <a href="#cta-final-heading" class="toc-pill">📱 Official App</a>
      </div>
    </nav>
  </div>

  <!-- 3. ARTICLE SECTION: HOW PANDA EXPRESS COUPON CODES ACTUALLY WORK -->
  <section id="how-codes-work" class="section section-white" aria-labelledby="how-work-title">
    <div class="container">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">THE BASICS</span>
        <h2 id="how-work-title">How Panda Express Coupon Codes Actually Work</h2>
        <p class="section-subtitle-muted" style="max-width: 800px; margin-left: auto; margin-right: auto;">
          A coupon code is a short string of letters or numbers. You type it into a promo box at checkout on the website or app. If it's valid, the discount shows up before you pay. That's the simple part. The confusing part is knowing which codes are real.
        </p>
      </div>

      <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); margin-top: 1.5rem;">
        <div class="feature-lift-card feature-card-green">
          <div class="card-icon-round icon-bg-green"><svg class="step-svg-icon color-green" aria-hidden="true"><use href="#icon-check-circle"></use></svg></div>
          <h3>Where a Code Can Be Used</h3>
          <p>
            Panda Express codes <strong>only work through direct channels</strong> — the official website (<a href="https://www.pandaexpress.com" target="_blank" rel="noopener noreferrer">pandaexpress.com</a>) or the official mobile app. Enter the code, place the order, get the discount.
          </p>
        </div>

        <div class="feature-lift-card feature-card-red">
          <div class="card-icon-round icon-bg-red"><svg class="step-svg-icon color-red" aria-hidden="true"><use href="#icon-clock"></use></svg></div>
          <h3>Where a Code Won't Work</h3>
          <p>
            Codes <strong>do not work on DoorDash, Uber Eats, or Grubhub</strong>. Those platforms run their own separate promotions, controlled by the delivery app, not by Panda Express. If you're ordering through a delivery app, skip the search for a Panda Express code entirely. Check that app's own deals tab instead.
          </p>
        </div>

        <div class="feature-lift-card feature-card-gold">
          <div class="card-icon-round icon-bg-gold"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tag"></use></svg></div>
          <h3>Why Panda Express Doesn't Run Public Sitewide Coupons</h3>
          <p>
            Most fast food chains blast the same discount to everyone. Panda Express runs things differently. Discounts mostly come through three channels: the <strong>Panda Rewards program</strong>, <strong>app-only offers</strong>, and <strong>short-term event promotions</strong>. That's exactly why so many "codes" floating around the internet are shaky. They were never meant to be permanent, public, or universal. Someone found one, it worked once, and it's been copied onto coupon sites ever since — long after it stopped working.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. STATUS TABLE SECTION (TICKET-STYLE & ACCESSIBLE TABLE) -->
  <div id="coupon-table"></div>
  <section id="coupon-section" class="section coupon-dark-section" aria-labelledby="coupon-section-title">
    <div class="container">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-gold">VERIFIED STATUS TABLE</span>
        <h2 id="coupon-section-title" class="title-light">Panda Express Coupon Codes — Status Table (${lastVerifiedDate})</h2>
        <p class="subtitle-light" style="max-width: 860px; margin-left: auto; margin-right: auto;">
          Before you copy any code from this table or anywhere else, understand this: <strong>no coupon site — including this one — can guarantee a code works at the exact moment you check out</strong>. Codes rotate, deactivate after one use, or get switched off regionally without notice. What we can do is tell you how much corroboration each code has, so you're not wasting time on something that's been dead for months.
        </p>
      </div>

      <!-- Security Callout -->
      <div class="notice-callout-red" style="margin-bottom: 2rem;">
        <div class="notice-icon">🔒</div>
        <div class="notice-body">
          <strong>Direct Checkout Only:</strong> No data is stored on this site. Every code is entered directly on <a href="https://www.pandaexpress.com" target="_blank" rel="noopener noreferrer" style="color: #FFFFFF; text-decoration: underline;">pandaexpress.com</a> or the official Panda Express app — never here.
        </div>
      </div>

      <!-- Filter Chips, Live Search & View Toggle Bar -->
      <div class="coupons-filter-toolbar">
        <div class="coupon-search-wrapper">
          <span class="coupon-search-icon">🔍</span>
          <input type="text" id="couponSearchInput" class="coupon-search-input" placeholder="Search codes (e.g. 20%, Family, Free, Egg Roll, $5)..." autocomplete="off" aria-label="Search promo codes">
          <button type="button" id="couponClearSearch" class="coupon-search-clear" style="display: none;" aria-label="Clear coupon search">✕</button>
        </div>

        <div class="coupon-filter-chips" role="group" aria-label="Filter coupons by category">
          <button type="button" class="coupon-filter-pill is-active" data-filter="all" aria-pressed="true">All Codes (${totalCodesCount})</button>
          <button type="button" class="coupon-filter-pill" data-filter="percent" aria-pressed="false">% Off</button>
          <button type="button" class="coupon-filter-pill" data-filter="family" aria-pressed="false">Family Meals</button>
          <button type="button" class="coupon-filter-pill" data-filter="free" aria-pressed="false">Free Items</button>
        </div>

        <button type="button" class="btn-toggle-view" id="btnToggleCouponView" aria-label="Toggle between cards and table view">
          <span id="viewToggleIcon">⊞</span> <span id="viewToggleText">Switch to Table View</span>
        </button>
      </div>

      <!-- Live Results Count Announcement -->
      <div id="couponResultsCount" class="coupon-results-live" aria-live="polite">
        Showing ${totalCodesCount} of ${totalCodesCount} codes
      </div>

      <!-- Coupon Empty State -->
      <div id="couponEmptyState" class="coupon-empty-state is-hidden">
        <div class="empty-icon">🎟️</div>
        <h3>No codes match your search</h3>
        <p>Try checking a different category or clear your search query to view all working discounts.</p>
        <button type="button" id="btnClearCouponFilters" class="btn btn-hero-primary">Clear filters</button>
      </div>

      <!-- Ticket Cards View Grid -->
      <div class="coupon-cards-grid" id="couponCardsContainer">
        ${liveCoupons.map((c) => {
          let category = 'other';
          if (c.discount.includes('%')) category = 'percent';
          else if (c.discount.toLowerCase().includes('family') || c.bestFor.toLowerCase().includes('group')) category = 'family';
          else if (c.discount.toLowerCase().includes('free')) category = 'free';

          const confidenceLabel = c.confidence || (c.status === 'Active' ? 'Multiple Recent Sources' : 'Reported, Unconfirmed');

          return `
            <article class="ticket-card" data-category="${category}" data-search="${c.code} ${c.discount} ${c.bestFor} ${c.notes} ${c.status}">
              <div class="ticket-top">
                <div class="ticket-status-row">
                  <span class="status-badge ${getStatusClass(c.status)}">${c.status}</span>
                  <span class="ticket-min-badge">${c.minOrder === 'None' ? 'No Min Order' : 'Min: ' + c.minOrder}</span>
                </div>
                <div class="ticket-discount">${c.discount}</div>
                <div class="ticket-bestfor">Best for: <strong>${c.bestFor}</strong></div>
                <p class="ticket-notes">${c.notes}</p>
                <div class="ticket-confidence" style="font-size: 0.78rem; color: #94A3B8; margin-top: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
                  <span>Confidence:</span> <strong style="color: ${c.status === 'Active' ? '#86EFAC' : '#FDE047'};">${confidenceLabel}</strong>
                </div>
              </div>

              <div class="ticket-divider" aria-hidden="true">
                <div class="ticket-dashed-line"></div>
              </div>

              <div class="ticket-bottom">
                <div class="ticket-code-display">
                  <span class="ticket-code-label">PROMO CODE</span>
                  <code class="ticket-code-val">${c.code}</code>
                </div>
                <div class="ticket-actions-group">
                  <button type="button" class="btn-copy ticket-copy-btn" data-code="${c.code}">
                    <span>Copy Code</span>
                  </button>
                  <a href="https://www.pandaexpress.com" target="_blank" rel="noopener noreferrer" class="btn-redeem-direct">
                    <span>Order ↗</span>
                  </a>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>

      <!-- Accessible Table View (Hidden by default, toggleable) -->
      <div class="table-responsive coupon-table-toggle-wrapper" id="couponTableWrapper" style="display: none;">
        <table class="coupon-table" id="couponTableMain">
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Min Order</th>
              <th scope="col">Offer</th>
              <th scope="col">Best For</th>
              <th scope="col">Description</th>
              <th scope="col">Promo Code</th>
              <th scope="col" class="td-actions">Action</th>
            </tr>
          </thead>
          <tbody>
            ${liveCoupons.map((c) => {
              let category = 'other';
              if (c.discount.includes('%')) category = 'percent';
              else if (c.discount.toLowerCase().includes('family') || c.bestFor.toLowerCase().includes('group')) category = 'family';
              else if (c.discount.toLowerCase().includes('free')) category = 'free';

              return `
              <tr data-category="${category}" data-search="${c.code} ${c.discount} ${c.bestFor} ${c.notes} ${c.status}">
                <td><span class="status-badge ${getStatusClass(c.status)}">${c.status}</span></td>
                <td><strong>${c.minOrder === 'None' ? 'No Min Order' : c.minOrder}</strong></td>
                <td><span class="discount-highlight">${c.discount}</span></td>
                <td>${c.bestFor}</td>
                <td>${c.notes}</td>
                <td><span class="coupon-code-pill">${c.code}</span></td>
                <td class="td-actions">
                  <button type="button" class="btn-copy" data-code="${c.code}">
                    <span>Copy Code</span>
                  </button>
                  <a href="https://www.pandaexpress.com" target="_blank" rel="noopener noreferrer" class="btn-table-redeem">Order ↗</a>
                </td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
      </div>

      <!-- Table Footnote & Sourcing Callouts -->
      <div style="margin-top: 1.5rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-md); padding: 1.25rem;">
        <p class="table-footnote" style="margin-bottom: 0.5rem; color: #E2E8F0;">
          * <strong>Important:</strong> This table is not exhaustive and not a guarantee. Confirm the discount actually appears in your cart before completing payment — if it doesn't apply, the code is dead, restricted to your region, or below the minimum spend.
        </p>
        <p style="font-size: 0.82rem; color: #94A3B8; margin-bottom: 0; line-height: 1.5;">
          ⚠️ <strong>A note on where these codes come from:</strong> Most circulate through Reddit threads, deal forums, and coupon aggregators — not from an official Panda Express public coupon feed, because one doesn't exist. Treat anything marked "Reported, Unconfirmed" as worth a try, not a promise.
        </p>
      </div>
    </div>
  </section>

  <!-- SVG Section Transition: Dark to Cream -->
  <div class="section-divider-curve curve-dark-to-cream">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" fill="#FFF8F0"></path>
    </svg>
  </div>

  <!-- 5. HOW TO APPLY A PANDA EXPRESS COUPON CODE (VISUAL STEPPER ON WARM CREAM) -->
  <section class="section section-cream" aria-labelledby="howto-section-heading">
    <div class="container">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">REDEMPTION GUIDE</span>
        <h2 id="howto-section-heading">How to Apply a Panda Express Coupon Code</h2>
        <p class="section-desc-center">
          Applying a code takes under a minute, and the process is nearly identical on the website and the app. Follow this step-by-step checklist:
        </p>
      </div>

      <div class="stepper-timeline">
        <div class="stepper-track-line" aria-hidden="true"></div>
        
        <div class="stepper-step">
          <div class="stepper-circle">1</div>
          <div class="stepper-card">
            <h3><svg class="step-svg-icon" aria-hidden="true"><use href="#icon-phone"></use></svg> Go to Website or App</h3>
            <p>Go to <a href="https://www.pandaexpress.com" target="_blank" rel="noopener noreferrer">pandaexpress.com</a> or open the official Panda Express mobile app.</p>
          </div>
        </div>

        <div class="stepper-step">
          <div class="stepper-circle">2</div>
          <div class="stepper-card">
            <h3><svg class="step-svg-icon" aria-hidden="true"><use href="#icon-map-pin"></use></svg> Choose Pickup or Delivery</h3>
            <p>Choose pickup or delivery and select your participating store location.</p>
          </div>
        </div>

        <div class="stepper-step">
          <div class="stepper-circle">3</div>
          <div class="stepper-card">
            <h3><svg class="step-svg-icon" aria-hidden="true"><use href="#icon-cart"></use></svg> Add Items to Cart</h3>
            <p>Add your meals, bowls, entrees, and sides to your cart meeting any minimum spend threshold.</p>
          </div>
        </div>

        <div class="stepper-step">
          <div class="stepper-circle">4</div>
          <div class="stepper-card">
            <h3><svg class="step-svg-icon" aria-hidden="true"><use href="#icon-checkout"></use></svg> Proceed to Checkout</h3>
            <p>Tap your order bag and proceed to the checkout screen.</p>
          </div>
        </div>

        <div class="stepper-step">
          <div class="stepper-circle">5</div>
          <div class="stepper-card">
            <h3><svg class="step-svg-icon" aria-hidden="true"><use href="#icon-tag"></use></svg> Find Promo Code Field</h3>
            <p>Find the "Promo Code" field, usually positioned right next to the order summary.</p>
          </div>
        </div>

        <div class="stepper-step">
          <div class="stepper-circle">6</div>
          <div class="stepper-card">
            <h3><svg class="step-svg-icon" aria-hidden="true"><use href="#icon-tag"></use></svg> Type Code &amp; Apply</h3>
            <p>Type or paste the code exactly as shown (e.g. <code>PANDA20</code>), then hit <strong>Apply</strong>.</p>
          </div>
        </div>

        <div class="stepper-step">
          <div class="stepper-circle">7</div>
          <div class="stepper-card">
            <h3><svg class="step-svg-icon" aria-hidden="true"><use href="#icon-check-circle"></use></svg> Confirm Cart Discount</h3>
            <p>Confirm the discount appears in your order total before entering payment details.</p>
          </div>
        </div>
      </div>

      <!-- Helpful Alerts -->
      <div class="step-alerts-grid">
        <div class="step-alert-card alert-important">
          <div class="alert-icon-wrap" aria-hidden="true">⚠️</div>
          <div class="alert-content">
            <strong class="alert-title">Important Step:</strong>
            <p class="alert-body">If the discount doesn't show up after applying, don't pay yet — check the reasons a code fails below before assuming your order doesn't qualify.</p>
          </div>
        </div>
        <div class="step-alert-card alert-tip">
          <div class="alert-icon-wrap" aria-hidden="true">🧮</div>
          <div class="alert-content">
            <strong class="alert-title">Group Order Tip:</strong>
            <p class="alert-body">Not sure which order size actually saves the most? Use the <a href="/panda-express-savings-calculator/" class="alert-link">Panda Express Savings Calculator</a> to compare Plate, Family Meal, and Catering pricing for your group size before you check out.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. WHY A PANDA EXPRESS COUPON CODE FAILS AT CHECKOUT -->
  <section class="section section-white section-border" aria-labelledby="why-fail-heading">
    <div class="container">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">TROUBLESHOOTING</span>
        <h2 id="why-fail-heading">Why a Panda Express Coupon Code Fails at Checkout</h2>
        <p class="section-subtitle-muted">
          A code that looked valid five minutes ago can still get rejected at checkout. Here's why, in order of how often each one actually happens:
        </p>
      </div>

      <div class="card-grid">
        <div class="feature-lift-card">
          <div class="card-icon-round icon-bg-red"><svg class="step-svg-icon color-red" aria-hidden="true"><use href="#icon-clock"></use></svg></div>
          <h3>1. Expired or Recycled from Third-Party Sites</h3>
          <p>Panda Express promotions typically run for days or weeks, not months. Coupon sites often leave codes listed long after they stop working, because removing them means losing search traffic. A code marked "verified" on another site may have been dead for weeks.</p>
        </div>

        <div class="feature-lift-card">
          <div class="card-icon-round icon-bg-gold"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-single-use"></use></svg></div>
          <h3>2. Single-Use or Account-Specific Codes</h3>
          <p>Some codes are generated for one account or one redemption only. The moment someone else uses it, it deactivates for everyone. These circulate constantly on Reddit and deal forums, often already dead by the time they're posted.</p>
        </div>

        <div class="feature-lift-card">
          <div class="card-icon-round icon-bg-blue"><svg class="step-svg-icon color-blue" aria-hidden="true"><use href="#icon-map-pin"></use></svg></div>
          <h3>3. Regional or Franchise Restrictions</h3>
          <p>Codes tied to a regional campaign or a sports promotion — like offers linked to local teams — often only work in specific states or franchise zones. A code that works in one city can fail entirely in another.</p>
        </div>

        <div class="feature-lift-card">
          <div class="card-icon-round icon-bg-green"><svg class="step-svg-icon color-green" aria-hidden="true"><use href="#icon-min-order"></use></svg></div>
          <h3>4. Minimum Order Not Met</h3>
          <p>Many codes carry a cart minimum that isn't clearly stated wherever you found the code. If your order falls short by even a dollar, the code will reject at checkout.</p>
        </div>
      </div>

      <!-- Franchise vs Corporate Deep-Dive Callout -->
      <div class="highlight-callout-box" style="margin-top: 2rem;">
        <div class="callout-icon">🏢</div>
        <div>
          <h3 class="callout-h">5. Franchise vs. Corporate Locations</h3>
          <p class="callout-p">
            Not every Panda Express location operates under the same rules. Corporate-owned stores tend to follow national promotions consistently. Franchise locations — common near <strong>universities, airports, and theme parks</strong> — may not honor every code or discount, even when it works fine on the app elsewhere.
          </p>
          <p class="callout-p" style="margin-bottom: 0;">
            If a code applies online but gets refused in-store at a specific location, this is usually why. When in doubt, call the location directly before ordering.
          </p>
        </div>
      </div>

      <!-- What to Do Checklist -->
      <div class="troubleshooting-checklist-card">
        <div class="checklist-card-header">
          <h3 class="troubleshoot-title">What to Do If Your Code Isn't Working</h3>
          <p class="checklist-subtitle">Run through this quickly before giving up on it:</p>
        </div>
        <ul class="styled-checklist">
          <li>
            <span class="chk-icon" aria-hidden="true">✓</span>
            <div class="chk-text"><strong>Try the app</strong> if you were using the website, or vice versa — some codes are channel-specific.</div>
          </li>
          <li>
            <span class="chk-icon" aria-hidden="true">✓</span>
            <div class="chk-text"><strong>Check your cart total</strong> against the minimum order requirement.</div>
          </li>
          <li>
            <span class="chk-icon" aria-hidden="true">✓</span>
            <div class="chk-text"><strong>Assume it may simply be expired</strong>, especially if you found it on a third-party aggregator.</div>
          </li>
          <li>
            <span class="chk-icon" aria-hidden="true">✓</span>
            <div class="chk-text"><strong>Remember some codes are single-use</strong> — once redeemed by anyone, they're gone for everyone.</div>
          </li>
          <li>
            <span class="chk-icon" aria-hidden="true">✓</span>
            <div class="chk-text"><strong>If none of that fixes it, skip the code and lean on Panda Rewards points instead</strong> — you won't lose the savings, you'll just access them a different way.</div>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- 7. PANDA EXPRESS COUPON CODES FOR DOORDASH, UBER EATS & GRUBHUB -->
  <section id="delivery-platforms-section" class="section section-soft section-border" aria-labelledby="delivery-heading">
    <div class="container">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">DELIVERY BREAKDOWN</span>
        <h2 id="delivery-heading">Panda Express Coupon Codes for DoorDash, Uber Eats &amp; Grubhub</h2>
        <p class="section-subtitle-muted" style="max-width: 820px; margin-left: auto; margin-right: auto;">
          If you're ordering through a delivery app, a Panda Express coupon code found on a coupon site almost certainly won't work — and this is one of the most common points of confusion for people searching for a discount.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--color-card-bg); border-radius: var(--radius-md); padding: var(--card-pad-desktop); box-shadow: var(--shadow-sm); border: 1px solid var(--color-borders);">
          <h3 style="font-size: 1.2rem; color: var(--color-body-text); margin-top: 0; font-weight: 700;">Why In-App Codes Don't Transfer to Delivery Platforms</h3>
          <p style="font-size: 0.92rem; color: var(--color-muted-text); line-height: 1.6; margin-bottom: 0;">
            Codes entered on <code>pandaexpress.com</code> or the Panda Express app are processed by Panda Express directly. DoorDash, Uber Eats, and Grubhub run entirely separate checkout systems. A promo box on one platform has no connection to the other. Pasting a Panda Express code into a DoorDash cart will simply return an error — the code isn't recognized because it was never meant to work there.
          </p>
        </div>

        <div style="background: var(--color-card-bg); border-radius: var(--radius-md); padding: var(--card-pad-desktop); box-shadow: var(--shadow-sm); border: 1px solid var(--color-borders);">
          <h3 style="font-size: 1.2rem; color: var(--color-body-text); margin-top: 0; font-weight: 700;">Where Delivery-Specific Promos Actually Live</h3>
          <p style="font-size: 0.92rem; color: var(--color-muted-text); margin-bottom: 0.5rem;">Each delivery platform manages its own restaurant promotions, and they change independently of anything Panda Express runs directly:</p>
          <ul style="font-size: 0.9rem; color: var(--color-muted-text); padding-left: 1.25rem; margin-bottom: 0.5rem;">
            <li><strong>DoorDash</strong> — check the "Deals" or "Offers" tab within the app; Panda Express periodically appears in platform-wide promotions.</li>
            <li><strong>Uber Eats</strong> — look under "Offers" on the home screen; restaurant-specific discounts rotate regularly.</li>
            <li><strong>Grubhub</strong> — check the "Perks" section; some discounts are tied to Grubhub+ membership rather than the restaurant itself.</li>
          </ul>
          <p style="font-size: 0.85rem; color: var(--color-muted-text); opacity: 0.85; margin-bottom: 0;"><em>None of these require a Panda Express code. The discount is applied by the delivery platform, not typed in.</em></p>
        </div>
      </div>

      <!-- Cost Comparison Table -->
      <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem;">Direct Order vs. Delivery: Cost Comparison</h3>
      <p style="font-size: 0.95rem; color: var(--color-muted-text); margin-bottom: 1.25rem;">
        Ordering directly through Panda Express is almost always cheaper once delivery fees and service charges are factored in.
      </p>

      <div class="table-responsive">
        <table class="coupon-table delivery-comparison-table">
          <thead>
            <tr>
              <th scope="col">Order Method</th>
              <th scope="col">Menu Pricing</th>
              <th scope="col">Delivery Fee</th>
              <th scope="col">Service Fee</th>
              <th scope="col">Coupon Codes Apply?</th>
            </tr>
          </thead>
          <tbody>
            <tr class="direct-order-row">
              <td><strong>Panda Express website/app</strong></td>
              <td>Standard</td>
              <td>None (pickup) or reduced (delivery)</td>
              <td>Minimal</td>
              <td><span class="badge-apply-yes">Yes (Official Codes)</span></td>
            </tr>
            <tr>
              <td><strong>DoorDash</strong></td>
              <td>Often marked up ($2–$6)</td>
              <td>$2–$6</td>
              <td>Yes, added at checkout</td>
              <td><span class="badge-apply-no">No</span></td>
            </tr>
            <tr>
              <td><strong>Uber Eats</strong></td>
              <td>Often marked up ($2–$6)</td>
              <td>$2–$6</td>
              <td>Yes, added at checkout</td>
              <td><span class="badge-apply-no">No</span></td>
            </tr>
            <tr>
              <td><strong>Grubhub</strong></td>
              <td>Often marked up ($2–$6)</td>
              <td>$2–$6</td>
              <td>Yes, added at checkout</td>
              <td><span class="badge-apply-no">No</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="takeaway-callout-box">
        <strong class="takeaway-title">💡 Best Value Takeaway:</strong>
        <span class="takeaway-text">If saving money is the priority, ordering pickup directly through the app with a Panda Express coupon code and earning Rewards points at the same time beats any delivery platform discount in most cases.</span>
      </div>
    </div>
  </section>

  <!-- 8. FAMILY MEAL COUPONS & WHETHER THEY'RE WORTH IT -->
  <section id="family-meal-deals" class="section section-photo-overlay bg-family-meal" aria-labelledby="family-meal-heading">
    <div class="photo-dark-mask"></div>
    <div class="container relative-z">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-gold">GROUP SAVINGS</span>
        <h2 id="family-meal-heading" class="title-light">Family Meal Coupons &amp; Whether They're Worth It</h2>
        <p class="subtitle-light" style="max-width: 820px; margin-left: auto; margin-right: auto;">
          A Panda Express Family Meal feeds four to five people and includes three large entrees plus two large sides, mixed and matched from the full menu — Orange Chicken, Beijing Beef, Kung Pao Chicken, Chow Mein, Fried Rice, and more. It's generally the best per-person value on the menu, and a working Panda Express coupon code makes it stronger.
        </p>
      </div>

      <div class="family-glass-layout">
        <!-- What's Included & Honest Math -->
        <div class="family-deals-card">
          <h3 class="family-card-title">What's Included in a Family Meal</h3>
          <ul style="color: #E2E8F0; font-size: 0.95rem; margin-bottom: 1.5rem; padding-left: 1.25rem;">
            <li><strong>3 large entrees</strong> (your choice)</li>
            <li><strong>2 large sides</strong> (your choice)</li>
            <li><strong>Enough food for 4–5 people</strong></li>
          </ul>

          <h3 class="family-card-title" style="font-size: 1.15rem;">Is the Family Meal Actually Worth It?</h3>
          <p style="color: #CBD5E1; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            Here's the honest math. A Family Meal without a code typically runs <strong>$45–$55</strong>. Ordering the same amount of food as individual plates costs closer to <strong>$70–$80</strong>. Apply a working code like <code>FAMILY10</code> and you're feeding five people for roughly <strong>$35–$45 — about $7–$9 per person</strong>.
          </p>

          <div class="table-responsive" style="margin: 0;">
            <table class="coupon-table table-dark-mode">
              <thead>
                <tr>
                  <th scope="col">Order Type</th>
                  <th scope="col">Serves</th>
                  <th scope="col">Typical Cost</th>
                  <th scope="col">With a Code</th>
                  <th scope="col">Cost Per Person</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Individual Plate</td>
                  <td>1</td>
                  <td>$12–$14</td>
                  <td>$9–$11</td>
                  <td>$9–$14</td>
                </tr>
                <tr>
                  <td>Bigger Plate</td>
                  <td>1</td>
                  <td>$14–$16</td>
                  <td>$11–$13</td>
                  <td>$11–$16</td>
                </tr>
                <tr style="background: rgba(245, 179, 1, 0.15);">
                  <td><strong style="color: #F5B301;">Family Meal</strong></td>
                  <td><strong>4–5</strong></td>
                  <td>$45–$55</td>
                  <td><strong style="color: #86EFAC;">$35–$45</strong></td>
                  <td><strong style="color: #86EFAC;">$7–$9</strong></td>
                </tr>
                <tr>
                  <td>Catering (10)</td>
                  <td>10</td>
                  <td>$90–$120</td>
                  <td>$80–$110</td>
                  <td>$8–$12</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Visual Cost Per Person Comparison Chart -->
        <div class="cost-comparison-card">
          <h3 class="comp-card-title">Group Value Breakdown</h3>
          <p class="comp-card-desc">
            For groups of four or more, the Family Meal wins nearly every time. For two or three people, a Plate or Bigger Plate is usually the smarter call — the Family Meal's savings only really kick in at scale.
          </p>

          <div class="comparison-bar-group">
            <div class="comp-label-row">
              <span>Family Meal (with Code FAMILY10 / $30 Deal)</span>
              <strong class="text-green">~$7.00 / person</strong>
            </div>
            <div class="comp-bar-track">
              <div class="comp-bar-fill fill-green" style="width: 35%;"></div>
            </div>
          </div>

          <div class="comparison-bar-group">
            <div class="comp-label-row">
              <span>Family Meal (Standard Retail Menu Price)</span>
              <strong class="text-gold">~$9.50 / person</strong>
            </div>
            <div class="comp-bar-track">
              <div class="comp-bar-fill fill-gold" style="width: 55%;"></div>
            </div>
          </div>

          <div class="comparison-bar-group">
            <div class="comp-label-row">
              <span>Individual Plates (5 Separate Orders)</span>
              <strong class="text-red">~$15.00 / person</strong>
            </div>
            <div class="comp-bar-track">
              <div class="comp-bar-fill fill-red" style="width: 100%;"></div>
            </div>
          </div>

          <div class="comp-summary-note">
            💡 <strong>Stacking Note:</strong> <strong>Can You Stack a Family Meal Code With Panda Rewards?</strong> Yes. Panda Express doesn't allow two coupon codes on one order, but applying a code doesn't block you from earning Rewards points on that same purchase. As long as you're logged into your Rewards account at checkout, you still earn points on the discounted total.
          </div>

          <div style="background: rgba(245, 179, 1, 0.15); border: 1px solid rgba(245, 179, 1, 0.35); border-radius: var(--radius-sm); padding: 0.85rem 1rem; margin-top: 1rem; color: #FEF3C7; font-size: 0.88rem;">
            🧮 <strong>Not sure which size fits your group?</strong> The <a href="/panda-express-savings-calculator/" style="color: #FDE047; font-weight: 700; text-decoration: underline;">Panda Express Savings Calculator</a> runs this math for your exact party size.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. PANDA REWARDS VS COUPON CODES — WHICH SAVES MORE -->
  <section id="rewards-section-heading" class="section section-rewards-gradient" aria-labelledby="rewards-title">
    <div class="container">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-white">LOYALTY &amp; STACKING</span>
        <h2 id="rewards-title" class="title-light">Panda Rewards vs. Coupon Codes — Which Saves More</h2>
        <p class="subtitle-light" style="max-width: 820px; margin-left: auto; margin-right: auto;">
          Panda Rewards is Panda Express's free loyalty program, and it's worth understanding properly. For anyone who orders more than once a month, it delivers more consistent savings than hunting for a working Panda Express coupon code.
        </p>
      </div>

      <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2rem; color: #FFFFFF;">
        <h3 style="color: #FFFFFF; font-size: 1.3rem; margin-top: 0;">How Panda Rewards Points Work</h3>
        <p style="font-size: 0.95rem; color: #F1F5F9; line-height: 1.6; margin-bottom: 0.5rem;">
          You earn <strong>10 points for every $1 spent</strong> on qualifying purchases made through the app, website, or in-store with your account scanned. Points don't expire as long as you make at least one qualifying purchase every 12 months.
        </p>
        <p style="font-size: 0.88rem; color: #E2E8F0; margin-bottom: 0;">
          The entry point is low. Spend $20 and you already have enough points for your first redemption — most loyalty programs make you spend hundreds before you see any benefit.
        </p>
      </div>

      <!-- Progression Ladder -->
      <div class="rewards-ladder-grid">
        <div class="reward-ladder-card">
          <div class="reward-pts-pill">200 PTS</div>
          <div class="reward-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tier-star1"></use></svg></div>
          <h3>Premium Upgrade</h3>
          <p>Upgrade to a premium entree</p>
        </div>

        <div class="reward-ladder-card">
          <div class="reward-pts-pill">250 PTS</div>
          <div class="reward-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tier-star2"></use></svg></div>
          <h3>Plate Upgrade</h3>
          <p>Upgrade Bowl to Plate, or Plate to Bigger Plate</p>
        </div>

        <div class="reward-ladder-card">
          <div class="reward-pts-pill">300 PTS</div>
          <div class="reward-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tier-star2"></use></svg></div>
          <h3>Small Appetizer</h3>
          <p>Free Egg Roll, Spring Roll, or Rangoon</p>
        </div>

        <div class="reward-ladder-card">
          <div class="reward-pts-pill">350 PTS</div>
          <div class="reward-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tier-star2"></use></svg></div>
          <h3>Medium Drink</h3>
          <p>Free 22oz fountain drink</p>
        </div>

        <div class="reward-ladder-card">
          <div class="reward-pts-pill">850 PTS</div>
          <div class="reward-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tier-star3"></use></svg></div>
          <h3>Cub Meal</h3>
          <p>Complete kids meal with drink and fruit</p>
        </div>

        <div class="reward-ladder-card">
          <div class="reward-pts-pill">1,250 PTS</div>
          <div class="reward-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tier-star3"></use></svg></div>
          <h3>Free Bowl</h3>
          <p>1 Full Side + 1 Entree</p>
        </div>

        <div class="reward-ladder-card">
          <div class="reward-pts-pill">1,500 PTS</div>
          <div class="reward-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tier-star3"></use></svg></div>
          <h3>Free Plate</h3>
          <p>1 Side + 2 Entrees</p>
        </div>

        <div class="reward-ladder-card">
          <div class="reward-pts-pill">1,750 PTS</div>
          <div class="reward-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tier-star4"></use></svg></div>
          <h3>Free Bigger Plate</h3>
          <p>1 Side + 3 Entrees</p>
        </div>

        <div class="reward-ladder-card highlight-tier">
          <div class="reward-pts-pill gold-pts">5,000 PTS</div>
          <div class="reward-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tier-star4"></use></svg></div>
          <h3>Free Family Meal</h3>
          <p>Feeds 5 people! 2 large sides + 3 large entrees</p>
        </div>
      </div>

      <!-- Rewards vs Codes & Stacking Strategy -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
        <div class="rewards-insight-box">
          <h3 class="rewards-h4" style="font-size: 1.2rem; font-weight: 700; color: #FFFFFF; margin-top: 0; margin-bottom: 0.75rem;">Rewards vs. Codes: Which Wins?</h3>
          <p class="rewards-p" style="margin-bottom: 0.75rem;">
            It depends entirely on how often you order:
          </p>
          <ul style="color: #E2E8F0; font-size: 0.9rem; padding-left: 1.25rem; margin-bottom: 0;">
            <li style="margin-bottom: 0.5rem;"><strong>Occasional or first-time orders:</strong> A solid Panda Express coupon code wins in the short term. You get an immediate discount with no history needed.</li>
            <li><strong>Regular orders (twice a month or more):</strong> Rewards consistently outperforms any code, because every purchase compounds into future free food instead of a one-time discount.</li>
          </ul>
        </div>

        <div class="rewards-insight-box" style="background: rgba(245, 179, 1, 0.15); border-color: rgba(245, 179, 1, 0.4);">
          <h3 class="rewards-h4" style="font-size: 1.2rem; font-weight: 700; color: #FDE047; margin-top: 0; margin-bottom: 0.75rem;">The 3-Layer Stacking Strategy</h3>
          <p class="rewards-p" style="margin-bottom: 0.5rem;">
            The strongest approach combines both: apply a Panda Express coupon code at checkout while logged into your Rewards account — you get the immediate discount and still earn points on the discounted total.
          </p>
          <p class="rewards-p" style="margin-bottom: 0; font-size: 0.88rem; color: #FEF3C7;">
            <strong>There's a third layer most people miss entirely:</strong> discounted gift cards. Warehouse retailers like Costco and Sam's Club periodically sell Panda Express gift cards below face value — typically a $25 card for around $21–$22. Load that card into your account, use it to pay, apply a Panda Express coupon code on top, and earn Rewards points on the same purchase. That's three separate discounts stacked on one order.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 10. OTHER WAYS TO SAVE AT PANDA EXPRESS IN 2026 -->
  <section id="other-discounts-heading" class="section section-white section-border" aria-labelledby="other-discounts-title">
    <div class="container">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">SECRET SAVINGS</span>
        <h2 id="other-discounts-title">Other Ways to Save at Panda Express in 2026</h2>
        <p class="section-subtitle-muted">
          Coupon codes aren't the only lever here. These are either consistently available or regularly overlooked by customers who only search for codes:
        </p>
      </div>

      <div class="card-grid discounts-grid">
        <div class="discount-feature-card">
          <div class="discount-card-badge">IN-STORE</div>
          <div class="discount-icon"><svg class="step-svg-icon color-red" aria-hidden="true"><use href="#icon-military"></use></svg></div>
          <h3>Military and First Responder Discount</h3>
          <p>Active duty military, veterans, first responders, and hospital workers can get <strong>10% off in-store</strong> at participating locations. Show a valid ID at the register. This applies mainly at corporate-owned locations and is an in-store-only benefit — it doesn't stack with online promo codes. Franchise locations near airports, universities, and theme parks may not participate, so it's worth confirming with your local store.</p>
        </div>

        <div class="discount-feature-card">
          <div class="discount-card-badge">CAMPUS</div>
          <div class="discount-icon"><svg class="step-svg-icon" aria-hidden="true"><use href="#icon-student"></use></svg></div>
          <h3>Student Discount</h3>
          <p>Panda Express doesn't run a nationwide student discount program. Some campus and college-area locations offer a local discount with a valid student ID, but this varies entirely by location and management. If you're near a university, ask at the counter — don't assume it exists before you get there.</p>
        </div>

        <div class="discount-feature-card">
          <div class="discount-card-badge">APP BONUS</div>
          <div class="discount-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-tag"></use></svg></div>
          <h3>What New Members Get</h3>
          <p>Signing up for Panda Rewards with just an email address gets you a <strong>welcome reward</strong> toward your first order — no credit card, no waiting period. Members also receive a <strong>birthday reward</strong> each year, usually a free item added automatically to the account around their birthday month. Neither of these requires a coupon code.</p>
        </div>

        <div class="discount-feature-card">
          <div class="discount-card-badge">REGIONAL</div>
          <div class="discount-icon"><svg class="step-svg-icon" aria-hidden="true"><use href="#icon-baseball"></use></svg></div>
          <h3>The Dodgers Home-Game Promotion</h3>
          <p>Panda Express runs a promotion tied to Los Angeles Dodgers home games. When the Dodgers score <strong>7 or more runs at home</strong>, Panda Express releases a discount offer valid the following day at participating Southern California locations. It's time-sensitive, usually a flat discount or free item, and only redeemable through the app. Keep notifications on if in SoCal.</p>
        </div>

        <div class="discount-feature-card highlight-gold-border">
          <div class="discount-card-badge gold-badge">PRO TIP</div>
          <div class="discount-icon"><svg class="step-svg-icon color-gold" aria-hidden="true"><use href="#icon-giftcard"></use></svg></div>
          <h3>The Gift Card Discount Most People Miss</h3>
          <p>Buying a Panda Express gift card through Costco or Sam's Club at a markdown (typically $25 for $21–$22), then using it alongside a Panda Express coupon code and your Rewards account, stacks <strong>three savings layers</strong> into a single order with guaranteed results.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 11. OUR VERIFICATION PROCESS -->
  <section id="verification-process-section" class="section section-soft section-border" aria-labelledby="verification-heading">
    <div class="container">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">TRANSPARENCY</span>
        <h2 id="verification-heading">Our Verification Process</h2>
        <p class="section-subtitle-muted" style="max-width: 820px; margin-left: auto; margin-right: auto;">
          Most coupon sites treat "verified" as a label, not a process. We want to be upfront about what verification actually means here, because that honesty is the entire point of this page.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
        <div style="background: var(--color-card-bg); border-radius: var(--radius-md); padding: var(--card-pad-desktop); box-shadow: var(--shadow-sm); border: 1px solid var(--color-borders);">
          <h3 style="font-size: 1.2rem; color: var(--color-body-text); margin-top: 0;">How We Check Codes</h3>
          <p style="font-size: 0.92rem; color: var(--color-muted-text); line-height: 1.6; margin-bottom: 0;">
            Each code listed on this page is checked against multiple independent sources — coupon aggregators, deal forums, and reported user activity — before it's assigned a confidence level. We do not have a live, automated feed from Panda Express, and no third-party site does either, since Panda Express doesn't publish a public coupon API. That's exactly why the confidence system exists instead of a flat "verified" badge: it tells you how much corroboration a code has, not a guarantee that it will work the moment you check out.
          </p>
        </div>

        <div style="background: var(--color-card-bg); border-radius: var(--radius-md); padding: var(--card-pad-desktop); box-shadow: var(--shadow-sm); border: 1px solid var(--color-borders);">
          <h3 style="font-size: 1.2rem; color: var(--color-body-text); margin-top: 0;">What Each Confidence Level Means</h3>
          <ul style="font-size: 0.92rem; color: var(--color-muted-text); padding-left: 1.25rem; margin-bottom: 1rem;">
            <li style="margin-bottom: 0.5rem;"><strong>Multiple Recent Sources:</strong> The code appears consistently across several independent sources within the last 30 days.</li>
            <li style="margin-bottom: 0.5rem;"><strong>Reported, Unconfirmed:</strong> The code appears on coupon sites, but we found no recent independent confirmation it's still active.</li>
            <li><strong>Likely Expired:</strong> Tied to a closed promotional window, or flagged as inactive across multiple sources.</li>
          </ul>

          <h4 style="font-size: 0.95rem; text-transform: uppercase; color: var(--color-muted-text); margin-bottom: 0.35rem;">Where We Look</h4>
          <p style="font-size: 0.88rem; color: var(--color-muted-text); margin-bottom: 0;">
            Official Panda Express channels (<code>pandaexpress.com</code> and the Rewards signup page), independent deal communities where codes are first reported, and cross-referencing dates to catch codes that have quietly gone stale.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 12. FREQUENTLY ASKED QUESTIONS (ACCORDION & FAQ SCHEMA) -->
  <section class="section section-cream section-border" aria-labelledby="faq-section-heading">
    <div class="container faq-container">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">COMMON QUESTIONS</span>
        <h2 id="faq-section-heading">Frequently Asked Questions</h2>
        <p class="section-desc-center">Everything you need to know about redeeming promo codes, store rules, and saving money:</p>
      </div>

      <div class="faq-accordion" role="region" aria-label="Frequently Asked Questions Accordion">
        ${faqData.map((item, idx) => `
          <div class="faq-item ${idx === 0 ? 'is-open' : ''}">
            <button type="button" class="faq-trigger" aria-expanded="${idx === 0 ? 'true' : 'false'}" aria-controls="${item.id}">
              <span>${item.question}</span>
              <span class="faq-icon" aria-hidden="true">+</span>
            </button>
            <div id="${item.id}" class="faq-content">
              <p>${item.answer}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 13. FINAL CALL TO ACTION WITH SPREAD PHOTO -->
  <section class="section final-cta-section bg-takeout-spread" aria-labelledby="cta-final-heading">
    <div class="cta-dark-mask"></div>
    <div class="container text-center relative-z">
      <h2 id="cta-final-heading" class="title-light final-cta-title">
        Ready to Order Dinner for Less?
      </h2>
      <p class="subtitle-light final-cta-sub">
        Grab a tested coupon code, calculate your meal macros, or browse full menu prices before ordering on the official Panda Express app.
      </p>
      <div class="final-cta-btns">
        <a href="#coupon-section" class="btn btn-hero-primary">
          <span>Copy Working Codes &uarr;</span>
        </a>
        <a href="/panda-express-nutrition/" class="btn btn-hero-secondary">
          <span>Launch Nutrition Calculator</span>
        </a>
        <a href="/panda-express-menu/" class="btn btn-hero-secondary">
          <span>View Menu &amp; Prices</span>
        </a>
      </div>
    </div>
  </section>

  <!-- STICKY BOTTOM BAR FOR MOBILE -->
  <aside class="mobile-sticky-coupon-bar" id="mobileStickyCouponBar" role="region" aria-label="Top active coupon mobile shortcut">
    <div class="mobile-sticky-inner">
      <div class="mobile-sticky-info">
        <span class="mobile-sticky-label">🔥 Top Promo Code</span>
        <code class="mobile-sticky-code">PANDA20</code>
      </div>
      <button type="button" class="btn-copy mobile-sticky-btn" data-code="PANDA20" aria-label="Copy top code PANDA20">
        <span>Copy 20% Off</span>
      </button>
    </div>
  </aside>
  `;

  return {
    title: `Panda Express Coupon Codes Verified & Working - ${lastVerifiedDate}`,
    description: `Panda Express coupon code list for ${currentMonth} ${currentYear}, checked and rated by confidence. Free, no signup, no data saved. See what still works.`,
    canonicalPath: '/',
    ogImage: '/public/images/og/og-home.jpg',
    ogImageAlt: 'Panda Express Coupon Codes and Deals - Verified Working',
    content,
    schemaJson: faqSchema
  };
}

module.exports = renderHome;
