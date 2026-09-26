/**
 * Admin Page Content Editor View (Phase D + Inline Hyperlinking)
 * Comprehensive, structure-preserving field editors for custom template pages,
 * with minimal inline hyperlinking & formatting (Bold, Italic, Internal Link Picker, External Link)
 * and WordPress-style rich-text editing with allowlist sanitization for policy pages.
 */

const { getSiteRoutes } = require('../site-routes');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInlineEditor({ id, name, label, value, rows = 3, helpText = '' }) {
  const minHeight = rows * 26 + 18;
  return `
    <div class="admin-form-group">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.5rem;">
        <label class="admin-label" for="${id}_editor" style="margin-bottom: 0;">${label}</label>
        <span style="font-size: 0.75rem; color: var(--admin-muted); font-weight: 500;">
          ✨ Inline Formatting: <strong>B</strong>, <em>I</em>, 🔗 Link
        </span>
      </div>
      
      <!-- Minimal Inline Formatting Toolbar -->
      <div class="inline-editor-toolbar" style="background: #121217; border: 1px solid rgba(255,255,255,0.14); border-bottom: none; border-radius: 6px 6px 0 0; padding: 0.35rem 0.5rem; display: flex; gap: 0.35rem; align-items: center;">
        <button type="button" class="btn-admin-secondary" style="padding: 0.2rem 0.55rem; font-size: 0.8rem; font-weight: 800; min-width: 28px;" title="Bold" onclick="execInlineCmd('${id}_editor', 'bold')">B</button>
        <button type="button" class="btn-admin-secondary" style="padding: 0.2rem 0.55rem; font-size: 0.8rem; font-style: italic; font-weight: 700; min-width: 28px;" title="Italic" onclick="execInlineCmd('${id}_editor', 'italic')">I</button>
        <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.15); margin: 0 0.2rem;"></div>
        <button type="button" class="btn-admin-secondary" style="padding: 0.2rem 0.65rem; font-size: 0.8rem; font-weight: 600;" title="Insert or Edit Link" onclick="openLinkModal('${id}_editor')">🔗 Link</button>
        <button type="button" class="btn-admin-secondary" style="padding: 0.2rem 0.55rem; font-size: 0.8rem;" title="Remove Link" onclick="unlinkInline('${id}_editor')">🚫 Unlink</button>
      </div>

      <!-- Contenteditable Area -->
      <div id="${id}_editor" 
           class="admin-inline-editor" 
           contenteditable="true" 
           data-target="${id}"
           style="background: #0B0B0E; border: 1px solid rgba(255,255,255,0.14); border-radius: 0 0 6px 6px; padding: 0.75rem 0.85rem; min-height: ${minHeight}px; color: #FFF; font-size: 0.95rem; line-height: 1.6; outline: none; word-break: break-word;">${value || ''}</div>
      <input type="hidden" id="${id}" name="${name}" value="${escapeHtml(value || '')}">
      ${helpText ? `<small style="color: var(--admin-muted); display: block; margin-top: 0.35rem; font-size: 0.8rem;">${helpText}</small>` : ''}
    </div>
  `;
}

function renderPages({ activePage = 'home', pageContent }) {
  const content = pageContent || {};
  const home = content.home || {};
  const nutrition = content.nutrition || {};
  const menu = content.menu || {};
  const orangeChicken = content['orange-chicken'] || {};
  const beijingBeef = content['beijing-beef'] || {};
  const about = content.about || {};
  const privacy = content.privacy || {};
  const disclaimer = content.disclaimer || {};

  const siteRoutes = getSiteRoutes();

  const pagesList = [
    { key: 'home', label: '🏠 Homepage', isRich: false },
    { key: 'menu', label: '📖 Menu Prices', isRich: false },
    { key: 'nutrition', label: '🥗 Nutrition Calculator', isRich: false },
    { key: 'orange-chicken', label: '🍗 Orange Chicken Dish', isRich: false },
    { key: 'beijing-beef', label: '🥩 Beijing Beef Dish', isRich: false },
    { key: 'about', label: '🏢 About Us (Rich Text)', isRich: true },
    { key: 'privacy', label: '🔒 Privacy Policy (Rich Text)', isRich: true },
    { key: 'disclaimer', label: '⚖️ Disclaimer (Rich Text)', isRich: true }
  ];

  const currentPageObj = pagesList.find(p => p.key === activePage) || pagesList[0];

  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="font-size: 1.85rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #FFF;">Page Content Editor</h1>
        <p style="color: var(--admin-muted); margin: 0; font-size: 0.95rem;">
          Exhaustive on-page text editing with inline hyperlinking. Structured pages preserve cards &amp; macros; policy pages feature rich text.
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <a id="btnPreviewPage" href="/admin/preview/${activePage}" target="_blank" class="btn-admin-secondary">
          👁️ Preview Page
        </a>
        <button id="btnSaveContent" class="btn-admin-primary">
          💾 Save Changes
        </button>
      </div>
    </div>

    <!-- Page Selection Tabs -->
    <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.5rem; border-bottom: 1px solid var(--admin-border);">
      ${pagesList.map(p => `
        <a href="/admin/pages?page=${p.key}" class="btn-admin-secondary" style="${activePage === p.key ? 'background: #C8102E; border-color: #C8102E; color: #FFF; font-weight: 700;' : ''}">
          ${p.label}
        </a>
      `).join('')}
    </div>

    <form id="pageContentForm">
      <!-- ============================================================ -->
      <!-- 1. HOMEPAGE FIELDS -->
      <!-- ============================================================ -->
      ${activePage === 'home' ? `
        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">1. Hero Banner (Above the Fold)</h2>
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="homeKicker">Kicker Tag (Above Heading)</label>
            <input class="admin-input" type="text" id="homeKicker" name="home.kicker" value="${escapeHtml(home.kicker || '🔒 Direct Checkout • No Data Saved')}">
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="homeHeroHeading">Hero Main Heading (H1)</label>
            <input class="admin-input" type="text" id="homeHeroHeading" name="home.heroHeading" value="${escapeHtml(home.heroHeading ? home.heroHeading.replace(/\[MONTH_YEAR\]/g, 'September 2026').replace(/<[^>]+>/g, '') : 'Panda Express Coupon Codes September 2026: Verified Deals & Family Savings')}">
            <small style="color: var(--admin-muted); display: block; margin-top: 0.35rem; font-size: 0.8rem;">
              The date/month (e.g. September 2026) is automatically styled in the signature gold accent font.
            </small>
          </div>

          ${renderInlineEditor({
            id: 'homeHeroSubtext',
            name: 'home.heroSubtext',
            label: 'Hero Subtitle Paragraph',
            value: home.heroSubtext || 'Real, manually-tested promo codes for <a href="https://pandaexpress.com" target="_blank" rel="noopener noreferrer">pandaexpress.com</a> and the official mobile app. Stop clicking dead links—check honest verification status, save up to 20%, and maximize your Panda Rewards.',
            rows: 3
          })}

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="admin-form-group">
              <label class="admin-label" for="homeBtnCodes">Primary Button Label</label>
              <input class="admin-input" type="text" id="homeBtnCodes" name="home.btnCodesText" value="${escapeHtml(home.btnCodesText || "🎟️ Get Today's Codes")}">
            </div>
            <div class="admin-form-group">
              <label class="admin-label" for="homeBtnFamily">Secondary Button Label</label>
              <input class="admin-input" type="text" id="homeBtnFamily" name="home.btnFamilyText" value="${escapeHtml(home.btnFamilyText || "🥡 Family Meal Deals")}">
            </div>
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">2. Coupon Section Intro</h2>
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="homeCouponHeading">Coupon Section Heading (H2)</label>
            <input class="admin-input" type="text" id="homeCouponHeading" name="home.couponHeading" value="${escapeHtml(home.couponHeading || 'Working Panda Express Coupon Codes')}">
          </div>

          ${renderInlineEditor({
            id: 'homeCouponSubtext',
            name: 'home.couponSubtext',
            label: 'Coupon Section Subtext',
            value: home.couponSubtext || 'A Panda Express coupon code is an alphanumeric promotional string applied at checkout for immediate discounts. Copy code and paste directly on the official app or website.',
            rows: 3
          })}

          ${renderInlineEditor({
            id: 'homeDeliveryNotice',
            name: 'home.deliveryNotice',
            label: 'Delivery Platform Notice Box',
            value: home.deliveryNotice || 'Official promotional vouchers do NOT function on DoorDash, Uber Eats, Grubhub, or Postmates. You must order directly via <a href="https://pandaexpress.com" target="_blank" rel="noopener noreferrer">pandaexpress.com</a> or the official mobile app to redeem these savings.',
            rows: 2
          })}
        </div>

        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">3. Panda Rewards Loyalty Section</h2>
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="homeRewardsHeading">Rewards Section Heading (H2)</label>
            <input class="admin-input" type="text" id="homeRewardsHeading" name="home.rewardsHeading" value="${escapeHtml(home.rewardsHeading || 'Panda Rewards: The Most Consistent Way to Save')}">
          </div>

          ${renderInlineEditor({
            id: 'homeRewardsSubtext',
            name: 'home.rewardsSubtext',
            label: 'Rewards Section Paragraph',
            value: home.rewardsSubtext || 'Earn 10 points per $1 spent via the app, website, or in-store scan. Points stay active with at least one purchase every 12 months.',
            rows: 3
          })}
        </div>

        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">4. Family Meal Deals &amp; Stepper</h2>
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="homeFamilyHeading">Family Section Heading (H2)</label>
            <input class="admin-input" type="text" id="homeFamilyHeading" name="home.familyHeading" value="${escapeHtml(home.familyHeading || 'Panda Express Family Meal Deals: $35 vs $48')}">
          </div>

          ${renderInlineEditor({
            id: 'homeFamilySubtext',
            name: 'home.familySubtext',
            label: 'Family Section Subtext',
            value: home.familySubtext || 'Feeding 4 to 5 people? The Panda Express Family Meal bundle delivers 2 large sides and 3 large entrees, saving roughly $35 to $40 over individual plates.',
            rows: 3
          })}
        </div>
      ` : ''}

      <!-- ============================================================ -->
      <!-- 2. NUTRITION CALCULATOR FIELDS -->
      <!-- ============================================================ -->
      ${activePage === 'nutrition' ? `
        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">Nutrition Calculator → Hero &amp; Disclosures</h2>
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="nutrBadge">Pill Badge Text</label>
            <input class="admin-input" type="text" id="nutrBadge" name="nutrition.badgeText" value="${escapeHtml(nutrition.badgeText || 'Interactive Nutrition & Macro Engine (2026 Edition)')}">
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="nutrTitle">On-Page Heading (H1)</label>
            <input class="admin-input" type="text" id="nutrTitle" name="nutrition.heroTitle" value="${escapeHtml(nutrition.heroTitle || 'Panda Express Nutrition Calculator')}">
          </div>

          ${renderInlineEditor({
            id: 'nutrSubtitle',
            name: 'nutrition.heroSubtitle',
            label: 'Concise Scope Subheading',
            value: nutrition.heroSubtitle || 'Instantly calculate calories, macronutrients, and allergen disclosures for custom bowls, plates, and entrees across all 45+ official Panda Express menu items and 12 laboratory-verified metrics.',
            rows: 3
          })}

          ${renderInlineEditor({
            id: 'nutrDisclosure',
            name: 'nutrition.sourceDisclosure',
            label: 'Official Source Disclosure Text',
            value: nutrition.sourceDisclosure || "Nutritional figures and allergen flags are compiled directly from Panda Express's published nutrition disclosures and standardized corporate formulations. Portion sizes may vary by ±15% to 20% in-store due to hand-scoop volume and wok reduction.",
            rows: 3
          })}
        </div>

        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">Nutrition Calculator → Mode Tab Labels</h2>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="admin-form-group">
              <label class="admin-label" for="nutrTab1">Combo Builder Tab Label</label>
              <input class="admin-input" type="text" id="nutrTab1" name="nutrition.tab1Label" value="${escapeHtml(nutrition.tab1Label || '🥣 Combo Meal Builder')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-label" for="nutrTab2">Explorer Tab Label</label>
              <input class="admin-input" type="text" id="nutrTab2" name="nutrition.tab2Label" value="${escapeHtml(nutrition.tab2Label || '📊 12-Column Nutrition & Allergen Explorer')}">
            </div>
          </div>
        </div>
      ` : ''}

      <!-- ============================================================ -->
      <!-- 3. MENU PRICES FIELDS -->
      <!-- ============================================================ -->
      ${activePage === 'menu' ? `
        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">Menu Prices → Hero &amp; Stat Counters</h2>
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="menuPill">Hero Badge Text</label>
            <input class="admin-input" type="text" id="menuPill" name="menu.badgeText" value="${escapeHtml(menu.badgeText || '🐼 OFFICIAL 2026 PANDA EXPRESS MENU & PRICES')}">
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="menuTitle">On-Page Heading (H1)</label>
            <input class="admin-input" type="text" id="menuTitle" name="menu.heroTitle" value="${escapeHtml(menu.heroTitle || 'Panda Express Menu with Prices & Pictures')}">
          </div>

          ${renderInlineEditor({
            id: 'menuSubtitle',
            name: 'menu.heroSubtitle',
            label: 'Hero Subheading',
            value: menu.heroSubtitle || 'Explore complete 2026 pricing, per-serving calorie counts, portion options, and high-definition photography for all Bowls, Plates, A La Carte Entrées, Sides, Crafted Refreshers, and Catering Trays.',
            rows: 3
          })}

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
            <div class="admin-form-group">
              <label class="admin-label">Stat Box 1 Label</label>
              <input class="admin-input" type="text" name="menu.stat1Label" value="${escapeHtml(menu.stat1Label || 'Wok-Crafted Dishes')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Stat Box 2 Label</label>
              <input class="admin-input" type="text" name="menu.stat2Label" value="${escapeHtml(menu.stat2Label || 'A La Carte Boxes')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Stat Box 3 Label</label>
              <input class="admin-input" type="text" name="menu.stat3Label" value="${escapeHtml(menu.stat3Label || 'Zero Artificial Trans Fat')}">
            </div>
          </div>
        </div>
      ` : ''}

      <!-- ============================================================ -->
      <!-- 4. DISH PAGES (ORANGE CHICKEN & BEIJING BEEF) -->
      <!-- ============================================================ -->
      ${activePage === 'orange-chicken' ? `
        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">Orange Chicken Page Copy</h2>
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="ocTitle">On-Page Heading (H1)</label>
            <input class="admin-input" type="text" id="ocTitle" name="orange-chicken.title" value="${escapeHtml(orangeChicken.title || 'The Original Orange Chicken')}">
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="ocSubtitle">Hero Subtitle</label>
            <input class="admin-input" type="text" id="ocSubtitle" name="orange-chicken.subtitle" value="${escapeHtml(orangeChicken.subtitle || 'Calories, complete nutrition facts, health evaluation, and smart coupon ordering hacks.')}">
          </div>

          ${renderInlineEditor({
            id: 'ocIntro',
            name: 'orange-chicken.intro',
            label: 'Introductory Section Body Text',
            value: orangeChicken.intro || "The Original Orange Chicken is Panda Express's iconic flagship entree, created in 1987 by Executive Chef Andy Kao. Featuring crispy battered boneless dark meat chicken bites tossed in a sweet, tangy, and mildly spicy signature chili-orange glaze.",
            rows: 5
          })}
        </div>
      ` : ''}

      ${activePage === 'beijing-beef' ? `
        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">Beijing Beef Page Copy</h2>
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="bbTitle">On-Page Heading (H1)</label>
            <input class="admin-input" type="text" id="bbTitle" name="beijing-beef.title" value="${escapeHtml(beijingBeef.title || 'Beijing Beef')}">
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="bbSubtitle">Hero Subtitle</label>
            <input class="admin-input" type="text" id="bbSubtitle" name="beijing-beef.subtitle" value="${escapeHtml(beijingBeef.subtitle || 'Calories, complete nutrition facts, health evaluation, and smart coupon ordering hacks.')}">
          </div>

          ${renderInlineEditor({
            id: 'bbIntro',
            name: 'beijing-beef.intro',
            label: 'Introductory Section Body Text',
            value: beijingBeef.intro || 'Beijing Beef features crispy marinated beef strips tossed with fresh red bell peppers and yellow onions in a sweet, tangy, and savory wok sauce.',
            rows: 5
          })}
        </div>
      ` : ''}

      <!-- ============================================================ -->
      <!-- 5. FREEFORM PAGES — WORDPRESS-STYLE RICH-TEXT EDITOR -->
      <!-- ============================================================ -->
      ${['about', 'privacy', 'disclaimer'].includes(activePage) ? `
        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">${currentPageObj.label} — Rich-Text Body Editor</h2>
          </div>

          <p style="font-size: 0.88rem; color: var(--admin-muted); margin: 0 0 1rem 0;">
            Type directly into the content area below. Formats are sanitized on save with an allowlist sanitizer (bold, italic, links, headings, lists).
          </p>

          <div class="admin-form-group">
            <label class="admin-label" for="pageHeading">On-Page Title (H1)</label>
            <input class="admin-input" type="text" id="pageHeading" name="${activePage}.heading" value="${escapeHtml(content[activePage]?.heading || (activePage === 'about' ? 'About PandaCoupons' : (activePage === 'privacy' ? 'Privacy Policy' : 'Disclaimer & Terms')))}">
          </div>

          <!-- Visual Formatting Toolbar -->
          <div style="background: #0B0B0E; border: 1px solid rgba(255,255,255,0.18); border-bottom: none; border-radius: 6px 6px 0 0; padding: 0.5rem; display: flex; gap: 0.4rem; flex-wrap: wrap;">
            <button type="button" class="btn-admin-secondary" style="padding: 0.3rem 0.6rem; font-weight: 700;" onclick="formatDoc('bold')">B</button>
            <button type="button" class="btn-admin-secondary" style="padding: 0.3rem 0.6rem; font-style: italic;" onclick="formatDoc('italic')">I</button>
            <button type="button" class="btn-admin-secondary" style="padding: 0.3rem 0.6rem;" onclick="formatDoc('formatBlock', 'h2')">H2</button>
            <button type="button" class="btn-admin-secondary" style="padding: 0.3rem 0.6rem;" onclick="formatDoc('formatBlock', 'h3')">H3</button>
            <button type="button" class="btn-admin-secondary" style="padding: 0.3rem 0.6rem;" onclick="formatDoc('insertUnorderedList')">• List</button>
            <button type="button" class="btn-admin-secondary" style="padding: 0.3rem 0.6rem;" onclick="formatDoc('insertOrderedList')">1. List</button>
            <button type="button" class="btn-admin-secondary" style="padding: 0.3rem 0.6rem;" onclick="openLinkModal('richTextEditor')">🔗 Link</button>
            <button type="button" class="btn-admin-secondary" style="padding: 0.3rem 0.6rem;" onclick="formatDoc('formatBlock', 'p')">¶ Para</button>
          </div>

          <!-- ContentEditable Area -->
          <div id="richTextEditor" contenteditable="true" style="background: #0B0B0E; border: 1px solid rgba(255,255,255,0.18); border-radius: 0 0 6px 6px; padding: 1.25rem; min-height: 350px; color: #FFF; font-size: 1rem; line-height: 1.7; outline: none; overflow-y: auto;">
            ${content[activePage]?.bodyHtml || (activePage === 'about' ? '<p>PandaCoupons is an independent consumer savings portal dedicated to finding, verifying, and documenting deals for Panda Express fans across North America.</p>' : (activePage === 'privacy' ? '<p>Your privacy is important to us. PandaCoupons operates with zero server tracking and does not harvest personal checkout information.</p>' : '<p>PandaCoupons is an independent reference guide and is not affiliated with, endorsed by, or sponsored by Panda Restaurant Group, Inc.</p>'))}
          </div>
          <input type="hidden" id="richBodyInput" name="${activePage}.bodyHtml">
        </div>
      ` : ''}
    </form>

    <!-- Hyperlink Configuration Modal -->
    <div id="inlineLinkModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 999999; justify-content: center; align-items: center; backdrop-filter: blur(5px); padding: 1rem;">
      <div style="background: #14141A; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; width: 100%; max-width: 520px; padding: 1.75rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #FFF; display: flex; align-items: center; gap: 0.5rem;">
            <span>🔗</span> Insert / Edit Hyperlink
          </h3>
          <button type="button" onclick="closeLinkModal()" style="background: none; border: none; color: var(--admin-muted); font-size: 1.5rem; cursor: pointer; line-height: 1;">&times;</button>
        </div>

        <!-- Mode Toggle Tabs -->
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; background: #0B0B0E; padding: 0.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <button type="button" id="tabInternal" class="btn-admin-primary" style="flex: 1; font-size: 0.85rem; padding: 0.45rem;" onclick="setLinkType('internal')">
            🏠 Internal Site Page
          </button>
          <button type="button" id="tabExternal" class="btn-admin-secondary" style="flex: 1; font-size: 0.85rem; padding: 0.45rem;" onclick="setLinkType('external')">
            🌐 External URL
          </button>
        </div>

        <!-- Internal Route Picker -->
        <div id="sectionInternal" class="admin-form-group">
          <label class="admin-label" for="internalPageSelect">Select Verified Page Destination</label>
          <select id="internalPageSelect" class="admin-input" style="background: #0B0B0E; color: #FFF; font-size: 0.95rem; padding: 0.6rem;">
            ${siteRoutes.map(r => `<option value="${escapeHtml(r.url)}">${escapeHtml(r.title)} &rarr; ${escapeHtml(r.url)}</option>`).join('')}
          </select>
          <small style="color: var(--admin-muted); display: block; margin-top: 0.35rem; font-size: 0.8rem;">
            Populated dynamically from live site routes to prevent broken internal links.
          </small>
        </div>

        <!-- External URL Input -->
        <div id="sectionExternal" class="admin-form-group" style="display: none;">
          <label class="admin-label" for="externalUrlInput">Target Web URL (https://...)</label>
          <input type="url" id="externalUrlInput" class="admin-input" placeholder="https://example.com/target" style="background: #0B0B0E; color: #FFF; font-size: 0.95rem; padding: 0.6rem;">
        </div>

        <!-- SEO & Navigation Attributes -->
        <div style="margin-top: 1.25rem; padding: 1rem; background: #0B0B0E; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; display: flex; flex-direction: column; gap: 0.75rem;">
          <label style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem; color: #E2E8F0; cursor: pointer;">
            <input type="checkbox" id="linkOpenNewTab" style="accent-color: #C8102E; width: 16px; height: 16px;">
            <span>Open in new tab (<code style="color: #F5B301; font-size: 0.8rem;">target="_blank" rel="noopener noreferrer"</code>)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem; color: #E2E8F0; cursor: pointer;">
            <input type="checkbox" id="linkSponsored" style="accent-color: #C8102E; width: 16px; height: 16px;">
            <span>Mark as sponsored / nofollow (<code style="color: #F5B301; font-size: 0.8rem;">rel="nofollow sponsored"</code>)</span>
          </label>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
          <button type="button" class="btn-admin-secondary" onclick="closeLinkModal()">Cancel</button>
          <button type="button" class="btn-admin-primary" onclick="applyLinkFromModal()">Apply Link</button>
        </div>
      </div>
    </div>

    <script>
      let currentActiveEditorId = null;
      let savedSelectionRange = null;
      let currentLinkMode = 'internal';

      function execInlineCmd(editorId, cmd, val = null) {
        const editor = document.getElementById(editorId);
        if (!editor) return;
        editor.focus();
        document.execCommand(cmd, false, val);
        syncEditorToInput(editorId);
      }

      function formatDoc(cmd, value = null) {
        document.execCommand(cmd, false, value);
      }

      function unlinkInline(editorId) {
        const editor = document.getElementById(editorId);
        if (editor) editor.focus();
        document.execCommand('unlink', false, null);
        syncEditorToInput(editorId);
      }

      function setLinkType(type) {
        currentLinkMode = type;
        const btnInternal = document.getElementById('tabInternal');
        const btnExternal = document.getElementById('tabExternal');
        const secInternal = document.getElementById('sectionInternal');
        const secExternal = document.getElementById('sectionExternal');
        const chkNewTab = document.getElementById('linkOpenNewTab');

        if (type === 'internal') {
          btnInternal.className = 'btn-admin-primary';
          btnExternal.className = 'btn-admin-secondary';
          secInternal.style.display = 'block';
          secExternal.style.display = 'none';
          chkNewTab.checked = false;
        } else {
          btnInternal.className = 'btn-admin-secondary';
          btnExternal.className = 'btn-admin-primary';
          secInternal.style.display = 'none';
          secExternal.style.display = 'block';
          chkNewTab.checked = true; // External links default to new tab
        }
      }

      function openLinkModal(editorId) {
        currentActiveEditorId = editorId;
        const editor = document.getElementById(editorId);
        if (editor) editor.focus();

        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          savedSelectionRange = sel.getRangeAt(0).cloneRange();
        } else {
          savedSelectionRange = null;
        }

        // Check if cursor is currently inside an existing <a> tag
        let existingAnchor = null;
        if (sel && sel.anchorNode) {
          existingAnchor = sel.anchorNode.nodeType === 1 ? sel.anchorNode.closest('a') : sel.anchorNode.parentElement?.closest('a');
        }

        const modal = document.getElementById('inlineLinkModal');
        const internalSelect = document.getElementById('internalPageSelect');
        const externalInput = document.getElementById('externalUrlInput');
        const chkNewTab = document.getElementById('linkOpenNewTab');
        const chkSponsored = document.getElementById('linkSponsored');

        if (existingAnchor) {
          const href = existingAnchor.getAttribute('href') || '';
          const target = existingAnchor.getAttribute('target') || '';
          const rel = existingAnchor.getAttribute('rel') || '';

          chkNewTab.checked = target === '_blank';
          chkSponsored.checked = rel.includes('sponsored') || rel.includes('nofollow');

          if (href.startsWith('/') && !href.startsWith('//')) {
            setLinkType('internal');
            internalSelect.value = href;
          } else {
            setLinkType('external');
            externalInput.value = href;
          }
        } else {
          externalInput.value = '';
          chkSponsored.checked = false;
          setLinkType('internal');
        }

        modal.style.display = 'flex';
      }

      function closeLinkModal() {
        const modal = document.getElementById('inlineLinkModal');
        modal.style.display = 'none';
        if (currentActiveEditorId) {
          const editor = document.getElementById(currentActiveEditorId);
          if (editor) editor.focus();
        }
      }

      function applyLinkFromModal() {
        const internalSelect = document.getElementById('internalPageSelect');
        const externalInput = document.getElementById('externalUrlInput');
        const chkNewTab = document.getElementById('linkOpenNewTab');
        const chkSponsored = document.getElementById('linkSponsored');

        let targetHref = '';
        if (currentLinkMode === 'internal') {
          targetHref = internalSelect.value;
        } else {
          targetHref = externalInput.value.trim();
          if (!targetHref) {
            alert('Please enter a valid URL');
            return;
          }
          if (!targetHref.startsWith('http://') && !targetHref.startsWith('https://') && !targetHref.startsWith('/')) {
            targetHref = 'https://' + targetHref;
          }
        }

        const editor = document.getElementById(currentActiveEditorId);
        if (editor) editor.focus();

        if (savedSelectionRange) {
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(savedSelectionRange);
        }

        // Create link
        document.execCommand('createLink', false, targetHref);

        // Enhance newly created / updated <a> tags with attributes
        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
          const anchor = sel.anchorNode.nodeType === 1 ? sel.anchorNode.closest('a') : sel.anchorNode.parentElement?.closest('a');
          if (anchor) {
            anchor.setAttribute('href', targetHref);
            if (chkNewTab.checked) {
              anchor.setAttribute('target', '_blank');
              let relTokens = ['noopener', 'noreferrer'];
              if (chkSponsored.checked) {
                relTokens.push('nofollow', 'sponsored');
              }
              anchor.setAttribute('rel', relTokens.join(' '));
            } else {
              anchor.removeAttribute('target');
              if (chkSponsored.checked) {
                anchor.setAttribute('rel', 'nofollow sponsored');
              } else {
                anchor.removeAttribute('rel');
              }
            }
          }
        }

        syncEditorToInput(currentActiveEditorId);
        closeLinkModal();
      }

      function syncEditorToInput(editorId) {
        const editor = document.getElementById(editorId);
        if (!editor) return;
        const targetInputId = editor.dataset.target;
        if (targetInputId) {
          const input = document.getElementById(targetInputId);
          if (input) input.value = editor.innerHTML;
        }
      }

      // Plain text paste interceptor on all inline editors to strip unwanted tags
      document.querySelectorAll('.admin-inline-editor').forEach(editor => {
        editor.addEventListener('paste', e => {
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData('text/plain');
          document.execCommand('insertText', false, text);
          syncEditorToInput(editor.id);
        });

        editor.addEventListener('input', () => {
          syncEditorToInput(editor.id);
        });
      });

      const btnSaveContent = document.getElementById('btnSaveContent');
      btnSaveContent.onclick = async () => {
        btnSaveContent.disabled = true;
        btnSaveContent.innerHTML = '⏳ Saving...';

        try {
          const form = document.getElementById('pageContentForm');
          
          // Sync all inline editors
          document.querySelectorAll('.admin-inline-editor').forEach(editor => {
            syncEditorToInput(editor.id);
          });

          // If on a rich text policy page, sync editor HTML into hidden input
          const richEditor = document.getElementById('richTextEditor');
          const richInput = document.getElementById('richBodyInput');
          if (richEditor && richInput) {
            richInput.value = richEditor.innerHTML;
          }

          const formData = new FormData(form);
          const updates = {};

          for (const [key, value] of formData.entries()) {
            const parts = key.split('.');
            if (parts.length === 2) {
              const [section, field] = parts;
              if (!updates[section]) updates[section] = {};
              updates[section][field] = value;
            }
          }

          const data = await adminFetch('/admin/api/pages', {
            method: 'POST',
            body: JSON.stringify({ page: '${activePage}', updates })
          });

          if (data.success) {
            showToast('Page content saved successfully! (Atomic backup created)');
          } else {
            throw new Error(data.error || 'Server error');
          }
        } catch (err) {
          showToast(err.message, 'error');
          alert('Failed to save content: ' + err.message);
        } finally {
          btnSaveContent.disabled = false;
          btnSaveContent.innerHTML = '💾 Save Changes';
        }
      };
    </script>
  `;
}

module.exports = renderPages;
