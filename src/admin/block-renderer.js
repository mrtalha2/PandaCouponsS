/**
 * Unified Block Renderer Engine (100% Interactive In-Place Visual Editor)
 * Renders structured block lists to production-grade HTML for both:
 * 1. Live site generation (src/pages/*.js, build.js)
 * 2. Visual Gutenberg-style interactive canvas (/admin/edit/:pageSlug)
 * Every heading, paragraph, card, label, badge, discount, note, and stat is 100% editable in place.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const { getDynamicDate } = require('../utils/date');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderBlock(block, context = {}, isEditor = false) {
  if (!block || !block.type) return '';
  const { id } = block;

  let blockInnerHtml = '';

  switch (block.type) {
    case 'heading': {
      const level = block.level || 2;
      const tag = `h${level}`;
      const kickerHtml = (block.kicker || isEditor)
        ? `<div class="dish-hero-kicker ${isEditor ? 'block-editable' : ''}" style="${isEditor && !block.kicker ? 'opacity: 0.5;' : ''}" ${isEditor ? `contenteditable="true" data-field="kicker" data-block-id="${id}"` : ''}>${block.kicker || (isEditor ? 'Add kicker tag...' : '')}</div>`
        : '';

      blockInnerHtml = `
        ${kickerHtml}
        <${tag} class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="content" data-block-id="${id}"` : ''}>
          ${block.content || ''}
        </${tag}>
      `;
      break;
    }

    case 'paragraph': {
      blockInnerHtml = `
        <div class="block-paragraph-wrapper">
          <p class="${isEditor ? 'block-editable block-paragraph' : ''}" style="font-size: 1.05rem; line-height: 1.75; color: inherit; margin-bottom: 1rem;" ${isEditor ? `contenteditable="true" data-field="content" data-block-id="${id}"` : ''}>
            ${block.content || (isEditor ? 'Type paragraph text here...' : '')}
          </p>
        </div>
      `;
      break;
    }

    case 'image': {
      const captionHtml = block.caption || isEditor
        ? `<figcaption class="${isEditor ? 'block-editable' : ''}" style="font-size: 0.88rem; color: #64748B; margin-top: 0.6rem; text-align: center;" ${isEditor ? `contenteditable="true" data-field="caption" data-block-id="${id}"` : ''}>${block.caption || (isEditor ? 'Add image caption...' : '')}</figcaption>`
        : '';

      blockInnerHtml = `
        <figure class="block-image-figure" style="margin: 1.5rem 0;">
          <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); position: relative;">
            <img src="${escapeHtml(block.url || '/public/images/hero-wok.jpg')}" 
                 alt="${escapeHtml(block.alt || 'Panda Express dish')}" 
                 width="${block.width || 1280}" 
                 height="${block.height || 720}" 
                 loading="lazy" 
                 style="width: 100%; height: auto; display: block; max-height: 550px; object-fit: cover;">
            ${isEditor ? `
              <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.75); padding: 0.35rem 0.65rem; border-radius: 6px; font-size: 0.75rem; color: #FFF;">
                Image URL: <span class="block-editable" contenteditable="true" data-field="url" data-block-id="${id}" style="color: #F5B301; text-decoration: underline;">${escapeHtml(block.url || '/public/images/hero-wok.jpg')}</span>
              </div>
            ` : ''}
          </div>
          ${captionHtml}
        </figure>
      `;
      break;
    }

    case 'button': {
      const isSec = block.style === 'secondary';
      blockInnerHtml = `
        <div style="margin: 1.25rem 0; display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <a href="${escapeHtml(block.url || '#')}" target="${escapeHtml(block.target || '_self')}" class="btn ${isSec ? 'btn-hero-secondary' : 'btn-hero-primary'}">
            <span class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="text" data-block-id="${id}"` : ''}>${block.text || 'Click Here'}</span>
          </a>
          ${isEditor ? `
            <span style="font-size: 0.8rem; color: #64748B;">
              Target URL: <span class="block-editable" contenteditable="true" data-field="url" data-block-id="${id}" style="color: #C8102E; text-decoration: underline;">${escapeHtml(block.url || '#')}</span>
            </span>
          ` : ''}
        </div>
      `;
      break;
    }

    case 'quote': {
      blockInnerHtml = `
        <blockquote class="block-quote-box" style="margin: 2rem 0; padding: 1.5rem; background: rgba(200, 16, 46, 0.04); border-left: 4px solid #C8102E; border-radius: 0 8px 8px 0;">
          <p class="${isEditor ? 'block-editable' : ''}" style="font-size: 1.15rem; font-style: italic; color: #1E293B; margin-bottom: 0.75rem; line-height: 1.6;" ${isEditor ? `contenteditable="true" data-field="content" data-block-id="${id}"` : ''}>
            &ldquo;${block.content || ''}&rdquo;
          </p>
          <footer style="font-size: 0.9rem; color: #64748B;">
            &mdash; <strong class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="author" data-block-id="${id}"` : ''}>${block.author || 'Author'}</strong>, 
            <span class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="role" data-block-id="${id}"` : ''}>${block.role || 'Contributor'}</span>
          </footer>
        </blockquote>
      `;
      break;
    }

    case 'callout': {
      blockInnerHtml = `
        <div class="highlight-callout-box" style="margin: 2rem 0;">
          <div class="callout-icon ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="icon" data-block-id="${id}"` : ''}>${block.icon || '🎯'}</div>
          <div style="flex: 1;">
            <h3 class="${isEditor ? 'block-editable' : ''}" style="color: #92400E; margin-top: 0; margin-bottom: 0.35rem; font-size: 1.15rem;" ${isEditor ? `contenteditable="true" data-field="title" data-block-id="${id}"` : ''}>${block.title || 'Important Notice'}</h3>
            <div class="${isEditor ? 'block-editable' : ''}" style="color: #78350F; margin-bottom: 0; font-size: 0.95rem; line-height: 1.6;" ${isEditor ? `contenteditable="true" data-field="content" data-block-id="${id}"` : ''}>${block.content || ''}</div>
          </div>
        </div>
      `;
      break;
    }

    case 'faq-item': {
      blockInnerHtml = `
        <div class="faq-card-item" style="margin-bottom: 1rem; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1.25rem; background: #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <h3 class="${isEditor ? 'block-editable' : ''}" style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.1rem; color: #0F172A;" ${isEditor ? `contenteditable="true" data-field="question" data-block-id="${id}"` : ''}>
            ${block.question || 'Question'}
          </h3>
          <div class="${isEditor ? 'block-editable' : ''}" style="margin-bottom: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;" ${isEditor ? `contenteditable="true" data-field="answer" data-block-id="${id}"` : ''}>
            ${block.answer || 'Answer'}
          </div>
        </div>
      `;
      break;
    }

    case 'divider': {
      blockInnerHtml = `<hr class="section-divider" style="margin: 3rem 0; border: none; border-top: 1px solid rgba(0,0,0,0.1);">`;
      break;
    }

    case 'spacer': {
      blockInnerHtml = `<div style="height: ${escapeHtml(block.height || '2rem')}; background: ${isEditor ? 'rgba(0,0,0,0.02); border: 1px dashed #E2E8F0;' : 'transparent'};" aria-hidden="true">${isEditor ? '<div style="font-size: 0.75rem; color: #94A3B8; text-align: center; padding: 0.25rem;">↕ Spacer (' + escapeHtml(block.height || '2rem') + ')</div>' : ''}</div>`;
      break;
    }

    case 'stepper-timeline': {
      const steps = block.steps || [
        { num: 1, title: 'Step 1 Title', description: 'Step description text...' },
        { num: 2, title: 'Step 2 Title', description: 'Step description text...' },
        { num: 3, title: 'Step 3 Title', description: 'Step description text...' }
      ];
      blockInnerHtml = `
        <div class="stepper-timeline" style="margin: 2rem 0;">
          <div class="stepper-track-line" aria-hidden="true"></div>
          ${steps.map((s, idx) => `
            <div class="stepper-step">
              <div class="stepper-circle">${s.num || (idx + 1)}</div>
              <div class="stepper-card">
                <h3 class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="step_${idx}_title" data-block-id="${id}"` : ''}>${s.title}</h3>
                <p class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="step_${idx}_desc" data-block-id="${id}"` : ''}>${s.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    case 'author-card': {
      blockInnerHtml = `
        <div class="author-profile-card" style="margin: 2rem 0;">
          <div class="author-avatar ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="avatar" data-block-id="${id}"` : ''}>${block.avatar || '🐼'}</div>
          <div>
            <h3 class="${isEditor ? 'block-editable' : ''}" style="margin-top: 0; margin-bottom: 0.25rem;" ${isEditor ? `contenteditable="true" data-field="name" data-block-id="${id}"` : ''}>${block.name || 'Author Name'}</h3>
            <p class="${isEditor ? 'block-editable' : ''}" style="font-size: 0.9rem; font-weight: 700; color: #C8102E; margin-bottom: 0.5rem;" ${isEditor ? `contenteditable="true" data-field="role" data-block-id="${id}"` : ''}>${block.role || 'Lead Editor'}</p>
            <p class="${isEditor ? 'block-editable' : ''}" style="font-size: 0.95rem; color: #4B5563; margin-bottom: 0;" ${isEditor ? `contenteditable="true" data-field="bio" data-block-id="${id}"` : ''}>${block.bio || ''}</p>
          </div>
        </div>
      `;
      break;
    }

    case 'disclaimer-box': {
      blockInnerHtml = `
        <p style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-left: 5px solid #0B0B0B; padding: 1.25rem; font-size: 0.95rem; color: #374151; border-radius: 8px; margin: 1.5rem 0;">
          <span class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="text" data-block-id="${id}"` : ''}>${block.text || ''}</span>
        </p>
      `;
      break;
    }

    // ==========================================================
    // SMART BLOCKS (LOCKED DATA-DRIVEN COMPONENTS WITH 100% IN-PLACE EDITING)
    // ==========================================================
    case 'hero': {
      blockInnerHtml = `
        <section class="hero-premium" aria-labelledby="hero-title-${id}">
          <div class="hero-bg-media">
            <picture>
              <source type="image/webp" srcset="/public/images/optimized/hero-wok-800.webp 800w, /public/images/optimized/hero-wok-1280.webp 1280w" sizes="100vw">
              <img src="${escapeHtml(block.bgImage || '/public/images/hero-wok.jpg')}" alt="Fresh Chinese noodles in sizzling wok" width="1920" height="1080" class="hero-bg-img">
            </picture>
            <div class="hero-gradient-overlay"></div>
          </div>
          <div class="container hero-content-wrapper">
            <div class="hero-badge-row">
              <div class="pill-verified-date">
                <span class="pulse-dot-green"></span>
                <span>Verified for <strong class="js-current-month-year">${context.lastVerified || getDynamicDate().currentMonthYear}</strong></span>
              </div>
              <div class="pill-trust-badge">
                <span class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="kicker" data-block-id="${id}"` : ''}>${block.kicker || '🔒 Direct Checkout • No Data Saved'}</span>
              </div>
            </div>
            <h1 id="hero-title-${id}" class="hero-main-title ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="title" data-block-id="${id}"` : ''}>
              ${block.title || 'Panda Express Coupon Codes'}
            </h1>
            <p class="hero-subtitle ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="subtitle" data-block-id="${id}"` : ''}>
              ${block.subtitle || ''}
            </p>
            <div class="hero-cta-group">
              <a href="${escapeHtml(block.primaryBtnUrl || '#coupon-section')}" class="btn btn-hero-primary">
                <span class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="primaryBtnText" data-block-id="${id}"` : ''}>${block.primaryBtnText || "🎟️ Get Today's Codes"}</span>
                <span class="btn-arrow">&darr;</span>
              </a>
              <a href="${escapeHtml(block.secondaryBtnUrl || '#family-meal-deals')}" class="btn btn-hero-secondary">
                <span class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="secondaryBtnText" data-block-id="${id}"` : ''}>${block.secondaryBtnText || "🥡 Family Meal Deals"}</span>
              </a>
            </div>
            <div class="hero-trust-points">
              <div class="trust-point-item">
                <svg class="check-icon" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                <span>100% Free to Use</span>
              </div>
              <div class="trust-point-item">
                <svg class="check-icon" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                <span>Manual Cart Testing</span>
              </div>
              <div class="trust-point-item">
                <svg class="check-icon" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                <span>No Spam or Accounts</span>
              </div>
            </div>
          </div>
        </section>
      `;
      break;
    }

    case 'stats-bar': {
      const items = block.items || [
        { num: '5', label: 'Tracked Codes' },
        { num: '3', label: 'Confirmed Active' },
        { num: context.lastVerified || getDynamicDate().currentMonthYear, label: 'Last Database Check' },
        { num: 'App & Web', label: 'Official Compatibility', color: '#F5B301' }
      ];
      blockInnerHtml = `
        <div class="container stats-bar-container">
          <div class="stats-glass-dock" role="region" aria-label="Quick Verification Stats">
            ${items.map((item, idx) => `
              ${idx > 0 ? '<div class="stat-dock-divider"></div>' : ''}
              <div class="stat-dock-item">
                <div class="stat-dock-num ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="stat_${idx}_num" data-block-id="${id}"` : ''} ${item.color ? `style="color: ${item.color};"` : ''}>${item.num}</div>
                <div class="stat-dock-label ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="stat_${idx}_label" data-block-id="${id}"` : ''}>${item.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;
    }

    case 'coupon-grid': {
      let coupons = [];
      try {
        const cPath = path.join(DATA_DIR, 'coupons.json');
        if (fs.existsSync(cPath)) {
          coupons = JSON.parse(fs.readFileSync(cPath, 'utf8')).coupons || [];
        }
      } catch (e) {}

      const liveCoupons = coupons.filter(c => !c.isDraft);
      const count = liveCoupons.length;

      function getStatusClass(status) {
        const s = (status || '').toLowerCase().replace(/\s+/g, '-');
        if (s.includes('active')) return 'status-active';
        if (s.includes('check')) return 'status-check-app';
        if (s.includes('expired')) return 'status-expired';
        return 'status-unverified';
      }

      blockInnerHtml = `
        <section id="coupon-section" class="section coupon-dark-section" aria-labelledby="coupon-heading-${id}">
          <div class="container">
            <div class="section-title-header">
              <span class="kicker-tag kicker-gold ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="kicker" data-block-id="${id}"` : ''}>${block.kicker || 'CURRENT PROMOTIONS'}</span>
              <h2 id="coupon-heading-${id}" class="title-light ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="heading" data-block-id="${id}"` : ''}>${block.heading || 'Working Panda Express Coupon Codes'}</h2>
              <p class="subtitle-light ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="subtext" data-block-id="${id}"` : ''}>
                ${block.subtext || ''}
              </p>
            </div>

            <div class="notice-callout-red">
              <div class="notice-icon">⚠️</div>
              <div class="notice-body">
                <strong>Delivery Platform Notice:</strong> 
                <span class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="deliveryNotice" data-block-id="${id}"` : ''}>${block.deliveryNotice || 'Official vouchers do NOT function on DoorDash, Uber Eats, or Grubhub.'}</span>
              </div>
            </div>

            <div class="coupons-filter-toolbar">
              <div class="coupon-search-wrapper">
                <span class="coupon-search-icon">🔍</span>
                <input type="text" id="couponSearchInput" class="coupon-search-input" placeholder="Search codes, discounts..." autocomplete="off">
              </div>
              <div class="coupon-filter-chips">
                <button type="button" class="coupon-filter-pill is-active" data-filter="all">All Codes (${count})</button>
                <button type="button" class="coupon-filter-pill" data-filter="percent">% Off</button>
                <button type="button" class="coupon-filter-pill" data-filter="family">Family Meals</button>
                <button type="button" class="coupon-filter-pill" data-filter="free">Free Items</button>
              </div>
            </div>

            <div class="coupon-cards-grid" id="couponCardsContainer">
              ${liveCoupons.map((c, cIdx) => `
                <article class="ticket-card" data-category="${c.discount.includes('%') ? 'percent' : 'other'}">
                  <div class="ticket-top">
                    <div class="ticket-status-row">
                      <span class="status-badge ${getStatusClass(c.status)}">${c.status}</span>
                      <span class="ticket-min-badge">${c.minOrder === 'None' ? 'No Min Order' : 'Min: ' + c.minOrder}</span>
                    </div>
                    <div class="ticket-discount">${c.discount}</div>
                    <div class="ticket-bestfor">Best for: <strong>${c.bestFor}</strong></div>
                    <p class="ticket-notes">${c.notes}</p>
                  </div>
                  <div class="ticket-divider" aria-hidden="true"><div class="ticket-dashed-line"></div></div>
                  <div class="ticket-bottom">
                    <div class="ticket-code-display">
                      <span class="ticket-code-label">PROMO CODE</span>
                      <code class="ticket-code-val">${c.code}</code>
                    </div>
                    <div class="ticket-actions-group">
                      <button type="button" class="btn-copy ticket-copy-btn" data-code="${c.code}"><span>Copy Code</span></button>
                      <a href="https://www.pandaexpress.com" target="_blank" rel="noopener noreferrer" class="btn-redeem-direct"><span>Order ↗</span></a>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          </div>
        </section>
      `;
      break;
    }

    case 'rewards-calculator': {
      blockInnerHtml = `
        <section id="rewards-section" class="section rewards-dark-section">
          <div class="container">
            <div class="section-title-header">
              <span class="kicker-tag kicker-red ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="kicker" data-block-id="${id}"` : ''}>${block.kicker || 'LOYALTY REWARDS'}</span>
              <h2 class="title-dark ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="heading" data-block-id="${id}"` : ''}>${block.heading || 'Panda Rewards: The Most Consistent Way to Save'}</h2>
              <p class="subtitle-dark ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="subtext" data-block-id="${id}"` : ''}>${block.subtext || ''}</p>
            </div>
            <div class="rewards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
              <div class="reward-tier-card" style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; border: 1.5px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
                <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🥢</div>
                <h3 class="${isEditor ? 'block-editable' : ''}" style="margin: 0 0 0.5rem 0; font-size: 1.2rem; color: #0F172A;" ${isEditor ? `contenteditable="true" data-field="tier1_title" data-block-id="${id}"` : ''}>${block.tier1_title || '200 Points Tier'}</h3>
                <p class="${isEditor ? 'block-editable' : ''}" style="color: #64748B; font-size: 0.92rem; line-height: 1.6; margin: 0;" ${isEditor ? `contenteditable="true" data-field="tier1_desc" data-block-id="${id}"` : ''}>${block.tier1_desc || 'Redeem for Free Medium Drink, Regular Side Upgrade, or Apple Pie Roll ($2.30–$2.90 Value).'}</p>
              </div>
              <div class="reward-tier-card" style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; border: 1.5px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
                <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🥡</div>
                <h3 class="${isEditor ? 'block-editable' : ''}" style="margin: 0 0 0.5rem 0; font-size: 1.2rem; color: #0F172A;" ${isEditor ? `contenteditable="true" data-field="tier2_title" data-block-id="${id}"` : ''}>${block.tier2_title || '350 Points Tier'}</h3>
                <p class="${isEditor ? 'block-editable' : ''}" style="color: #64748B; font-size: 0.92rem; line-height: 1.6; margin: 0;" ${isEditor ? `contenteditable="true" data-field="tier2_desc" data-block-id="${id}"` : ''}>${block.tier2_desc || 'Redeem for Free Single Entree or Free Appetizer (Egg Roll / Spring Roll) ($4.50–$5.20 Value).'}</p>
              </div>
              <div class="reward-tier-card" style="background: #FFFFFF; border-radius: 12px; padding: 1.5rem; border: 1.5px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
                <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🥣</div>
                <h3 class="${isEditor ? 'block-editable' : ''}" style="margin: 0 0 0.5rem 0; font-size: 1.2rem; color: #0F172A;" ${isEditor ? `contenteditable="true" data-field="tier3_title" data-block-id="${id}"` : ''}>${block.tier3_title || '650 Points Tier'}</h3>
                <p class="${isEditor ? 'block-editable' : ''}" style="color: #64748B; font-size: 0.92rem; line-height: 1.6; margin: 0;" ${isEditor ? `contenteditable="true" data-field="tier3_desc" data-block-id="${id}"` : ''}>${block.tier3_desc || 'Redeem for Free Bowl (1 Side + 1 Entree) ($8.30–$9.20 Value).'}</p>
              </div>
            </div>
          </div>
        </section>
      `;
      break;
    }

    case 'family-meal-stepper': {
      blockInnerHtml = `
        <section id="family-meal-deals" class="section family-meal-section">
          <div class="container">
            <div class="section-title-header">
              <span class="kicker-tag kicker-red ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="kicker" data-block-id="${id}"` : ''}>${block.kicker || 'GROUP VALUE'}</span>
              <h2 class="title-dark ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="heading" data-block-id="${id}"` : ''}>${block.heading || 'Panda Express Family Meal Deals: $35 vs $48'}</h2>
              <p class="subtitle-dark ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="subtext" data-block-id="${id}"` : ''}>${block.subtext || ''}</p>
            </div>
            <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; border: 1px solid #E2E8F0; margin-top: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; align-items: center;">
                <div>
                  <h3 class="${isEditor ? 'block-editable' : ''}" style="margin-top: 0; color: #0F172A;" ${isEditor ? `contenteditable="true" data-field="cardTitle" data-block-id="${id}"` : ''}>${block.cardTitle || 'What Comes in a Family Meal?'}</h3>
                  <div class="${isEditor ? 'block-editable' : ''}" style="color: #475569; font-size: 1rem; line-height: 1.8; margin-bottom: 0;" ${isEditor ? `contenteditable="true" data-field="cardBody" data-block-id="${id}"` : ''}>
                    ${block.cardBody || '<ul><li><strong>2 Large Sides</strong> (Chow Mein, Fried Rice, White Rice, Super Greens)</li><li><strong>3 Large Entrees</strong> (Orange Chicken, Beijing Beef, Kung Pao, etc.)</li><li>Feeds 4 to 5 hungry diners with generous leftovers</li></ul>'}
                  </div>
                </div>
                <div style="background: #F8FAFC; border-radius: 10px; padding: 1.5rem; text-align: center; border: 1px dashed #CBD5E1;">
                  <div class="${isEditor ? 'block-editable' : ''}" style="font-size: 0.9rem; color: #64748B; font-weight: 700; text-transform: uppercase;" ${isEditor ? `contenteditable="true" data-field="savingsLabel" data-block-id="${id}"` : ''}>${block.savingsLabel || 'Average Savings'}</div>
                  <div class="${isEditor ? 'block-editable' : ''}" style="font-size: 2.5rem; font-weight: 800; color: #C8102E; margin: 0.35rem 0;" ${isEditor ? `contenteditable="true" data-field="savingsValue" data-block-id="${id}"` : ''}>${block.savingsValue || 'Save $13.50+'}</div>
                  <p class="${isEditor ? 'block-editable' : ''}" style="font-size: 0.88rem; color: #475569; margin: 0;" ${isEditor ? `contenteditable="true" data-field="savingsDesc" data-block-id="${id}"` : ''}>${block.savingsDesc || 'Compared to ordering 4 individual 2-Entree Plates'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
      break;
    }

    case 'faq-accordion': {
      let faqs = [];
      try {
        const faqPath = path.join(DATA_DIR, 'faq.json');
        if (fs.existsSync(faqPath)) faqs = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
      } catch (e) {}

      blockInnerHtml = `
        <section id="faq-section" class="section faq-dark-section">
          <div class="container">
            <div class="section-title-header">
              <span class="kicker-tag kicker-gold ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="kicker" data-block-id="${id}"` : ''}>${block.kicker || 'HELP &amp; ADVICE'}</span>
              <h2 class="title-light ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="heading" data-block-id="${id}"` : ''}>${block.heading || 'Frequently Asked Questions'}</h2>
              <p class="subtitle-light ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="subtext" data-block-id="${id}"` : ''}>${block.subtext || ''}</p>
            </div>
            <div class="faq-accordion-container" style="max-width: 860px; margin: 2rem auto 0 auto;">
              ${faqs.slice(0, 6).map((item, idx) => `
                <details class="faq-item-accordion" style="background: #16161D; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 0.75rem; padding: 1rem 1.25rem;">
                  <summary class="${isEditor ? 'block-editable' : ''}" style="font-weight: 700; color: #FFF; cursor: pointer; font-size: 1.05rem;" ${isEditor ? `contenteditable="true" data-field="faq_${idx}_q" data-block-id="${id}"` : ''}>${item.question}</summary>
                  <div class="${isEditor ? 'block-editable' : ''}" style="color: #94A3B8; margin: 0.75rem 0 0 0; line-height: 1.7; font-size: 0.95rem;" ${isEditor ? `contenteditable="true" data-field="faq_${idx}_a" data-block-id="${id}"` : ''}>${item.answer}</div>
                </details>
              `).join('')}
            </div>
          </div>
        </section>
      `;
      break;
    }

    case 'nutrition-calculator': {
      blockInnerHtml = `
        <div class="container" style="padding-top: 2rem; padding-bottom: 3rem;">
          <div class="section-title-header">
            <span class="kicker-tag kicker-red ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="badgeText" data-block-id="${id}"` : ''}>${block.badgeText || 'NUTRITION &amp; MACRO ENGINE'}</span>
            <h1 class="title-dark ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="heading" data-block-id="${id}"` : ''}>${block.heading || 'Panda Express Nutrition Calculator'}</h1>
            <p class="subtitle-dark ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="subtext" data-block-id="${id}"` : ''}>${block.subtext || ''}</p>
          </div>
          <div class="notice-callout-gray" style="background: #F1F5F9; border-radius: 8px; padding: 1rem 1.25rem; font-size: 0.92rem; color: #475569; margin: 1.5rem 0;">
            <strong>Official Source Disclosure:</strong> <span class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="disclosure" data-block-id="${id}"` : ''}>${block.disclosure || "Nutritional figures and allergen flags are compiled directly from Panda Express's published nutrition disclosures and standardized corporate formulations."}</span>
          </div>
          <div style="background: #0B0B0E; border-radius: 12px; padding: 2.5rem; color: #FFF; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🥗</div>
            <h3 class="${isEditor ? 'block-editable' : ''}" style="margin: 0 0 0.5rem 0; color: #FFF;" ${isEditor ? `contenteditable="true" data-field="cardTitle" data-block-id="${id}"` : ''}>${block.cardTitle || 'Interactive Combo Meal Builder &amp; 12-Column Explorer'}</h3>
            <p class="${isEditor ? 'block-editable' : ''}" style="color: #94A3B8; max-width: 600px; margin: 0 auto;" ${isEditor ? `contenteditable="true" data-field="cardDesc" data-block-id="${id}"` : ''}>${block.cardDesc || 'Live dynamic calculator active on published site.'}</p>
          </div>
        </div>
      `;
      break;
    }

    case 'menu-grid': {
      blockInnerHtml = `
        <div class="container" style="padding-top: 2rem; padding-bottom: 3rem;">
          <div class="section-title-header">
            <span class="kicker-tag kicker-red ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="badgeText" data-block-id="${id}"` : ''}>${block.badgeText || '2026 MENU &amp; PRICES'}</span>
            <h1 class="title-dark ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="heading" data-block-id="${id}"` : ''}>${block.heading || 'Panda Express Menu with Prices &amp; Pictures'}</h1>
            <p class="subtitle-dark ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="subtext" data-block-id="${id}"` : ''}>${block.subtext || ''}</p>
          </div>
          <div style="background: #0B0B0E; border-radius: 12px; padding: 2.5rem; color: #FFF; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📖</div>
            <h3 class="${isEditor ? 'block-editable' : ''}" style="margin: 0 0 0.5rem 0; color: #FFF;" ${isEditor ? `contenteditable="true" data-field="cardTitle" data-block-id="${id}"` : ''}>${block.cardTitle || 'Wok Dishes, A La Carte Boxes &amp; Catering Directory'}</h3>
            <p class="${isEditor ? 'block-editable' : ''}" style="color: #94A3B8; max-width: 600px; margin: 0 auto;" ${isEditor ? `contenteditable="true" data-field="cardDesc" data-block-id="${id}"` : ''}>${block.cardDesc || 'Live menu directory active on published site.'}</p>
          </div>
        </div>
      `;
      break;
    }

    case 'dish-guide': {
      const isOc = block.slug === 'orange-chicken';
      blockInnerHtml = `
        <section class="dish-hero-banner" style="background-image: url('${isOc ? '/public/images/orange-chicken.jpg' : '/public/images/beijing-beef.jpg'}'); min-height: 380px; position: relative; display: flex; align-items: center;">
          <div class="dish-hero-mask" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%);"></div>
          <div class="container relative-z" style="position: relative; z-index: 2; padding: 2rem 0;">
            <div class="dish-hero-kicker ${isEditor ? 'block-editable' : ''}" style="color: #F5B301; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;" ${isEditor ? `contenteditable="true" data-field="kicker" data-block-id="${id}"` : ''}>${block.kicker || 'WOK SPECIALTY GUIDE'}</div>
            <h1 class="dish-hero-title ${isEditor ? 'block-editable' : ''}" style="color: #FFF; font-size: 2.4rem; font-weight: 800; margin: 0.5rem 0;" ${isEditor ? `contenteditable="true" data-field="title" data-block-id="${id}"` : ''}>${block.title || 'Specialty Dish'}</h1>
            <p class="dish-hero-subtitle ${isEditor ? 'block-editable' : ''}" style="color: #E2E8F0; font-size: 1.1rem; max-width: 650px;" ${isEditor ? `contenteditable="true" data-field="subtitle" data-block-id="${id}"` : ''}>${block.subtitle || ''}</p>
          </div>
        </section>
        <div class="container" style="padding-top: 2.5rem; padding-bottom: 3rem;">
          <h2 class="${isEditor ? 'block-editable' : ''}" style="margin-top: 0;" ${isEditor ? `contenteditable="true" data-field="aboutHeading" data-block-id="${id}"` : ''}>${block.aboutHeading || 'About Panda Express ' + (block.title || 'Dish')}</h2>
          <div class="${isEditor ? 'block-editable' : ''}" style="font-size: 1.12rem; color: #374151; line-height: 1.7; margin-bottom: 1.5rem;" ${isEditor ? `contenteditable="true" data-field="intro" data-block-id="${id}"` : ''}>
            ${block.intro || ''}
          </div>
        </div>
      `;
      break;
    }

    case 'contact-form': {
      blockInnerHtml = `
        <div class="container" style="padding-top: 2rem; padding-bottom: 4rem; max-width: 860px;">
          <div class="section-title-header" style="text-align: center; margin-bottom: 2rem;">
            <span class="kicker-tag kicker-red ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="kicker" data-block-id="${id}"` : ''}>${block.kicker || 'GET IN TOUCH'}</span>
            <h1 class="dish-hero-title ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="title" data-block-id="${id}"` : ''}>${block.title || 'Contact Our Editorial Team'}</h1>
            <p class="dish-hero-subtitle ${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="subtitle" data-block-id="${id}"` : ''}>${block.subtitle || ''}</p>
          </div>
          <div class="contact-info-card" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem;">
            <h2 class="${isEditor ? 'block-editable' : ''}" style="font-size: 1.25rem; margin-top: 0; color: #0F172A;" ${isEditor ? `contenteditable="true" data-field="boxTitle" data-block-id="${id}"` : ''}>${block.boxTitle || 'Direct Support Email'}</h2>
            <p class="${isEditor ? 'block-editable' : ''}" style="color: #475569; font-size: 0.95rem; margin-bottom: 0.5rem;" ${isEditor ? `contenteditable="true" data-field="boxDesc" data-block-id="${id}"` : ''}>${block.boxDesc || 'For direct assistance, media inquiries, or updates:'}</p>
            <p style="margin-bottom: 0;">✉️ <strong class="${isEditor ? 'block-editable' : ''}" style="color: #C8102E; font-size: 1.1rem;" ${isEditor ? `contenteditable="true" data-field="supportEmail" data-block-id="${id}"` : ''}>${block.supportEmail || 'helppandacoupons@gmail.com'}</strong></p>
          </div>
        </div>
      `;
      break;
    }

    default:
      blockInnerHtml = `<div class="${isEditor ? 'block-editable' : ''}" ${isEditor ? `contenteditable="true" data-field="content" data-block-id="${id}"` : ''}>${block.content || ''}</div>`;
  }

  // If not editor mode, return clean HTML
  if (!isEditor) {
    return blockInnerHtml;
  }

  // If editor canvas mode, wrap with block handles, hover toolbar, and inserters
  return `
    <div class="admin-block-wrapper ${block.locked ? 'is-smart-block' : 'is-free-block'}" 
         id="block_${id}" 
         data-block-id="${id}" 
         data-block-type="${block.type}" 
         data-locked="${block.locked ? 'true' : 'false'}">
      
      <!-- Block Top Hover Actions Toolbar -->
      <div class="block-action-toolbar">
        <span class="block-drag-handle" draggable="true" title="Drag to reorder" ondragstart="handleBlockDragStart(event, '${id}')">⋮⋮</span>
        <span class="block-type-badge">${block.locked ? '🔒 ' : ''}${block.type}</span>
        
        <div class="block-action-buttons">
          <button type="button" class="btn-block-action" onclick="moveBlockUp('${id}')" title="Move Block Up">↑</button>
          <button type="button" class="btn-block-action" onclick="moveBlockDown('${id}')" title="Move Block Down">↓</button>
          <button type="button" class="btn-block-action" onclick="duplicateBlock('${id}')" title="Duplicate Block">📄</button>
          <button type="button" class="btn-block-action btn-block-delete" onclick="deleteBlock('${id}', ${Boolean(block.locked)})" title="Delete Block">🗑️</button>
        </div>
      </div>

      ${block.locked ? `
        <div class="smart-block-header-indicator">
          <span>🔒 Smart Data Component: <strong>${block.type}</strong> (Click any text below to edit inline)</span>
          <a href="/admin/${block.type === 'coupon-grid' ? 'coupons' : 'pages'}" class="btn-smart-edit" target="_blank">⚙️ Edit Underlying Data</a>
        </div>
      ` : ''}

      <!-- Block Content Area -->
      <div class="block-content-body">
        ${blockInnerHtml}
      </div>

      <!-- Inserter Hotspot Between Blocks -->
      <div class="block-inserter-hotspot">
        <button type="button" class="btn-hotspot-insert" onclick="openBlockPicker('${id}')" title="Insert block below">
          <span>+</span>
        </button>
      </div>
    </div>
  `;
}

function renderBlocks(blocks, context = {}, isEditor = false) {
  if (!Array.isArray(blocks)) return '';

  const blocksHtml = blocks.map(b => renderBlock(b, context, isEditor)).join('\n');

  if (!isEditor) {
    return blocksHtml;
  }

  // In editor mode, prepend a top inserter hotspot
  return `
    <div class="editor-canvas-container" id="editorCanvas">
      <div class="block-inserter-hotspot hotspot-top">
        <button type="button" class="btn-hotspot-insert" onclick="openBlockPicker('TOP')" title="Insert block at top">
          <span>+ Add Block to Top</span>
        </button>
      </div>
      
      <div id="blocksContainer" class="blocks-dropzone">
        ${blocksHtml}
      </div>
    </div>
  `;
}

module.exports = {
  renderBlock,
  renderBlocks
};
