const fs = require('fs');
const path = require('path');
const config = require('../../data/site.config');
const { renderBlocks } = require('../admin/block-renderer');

function renderAbout() {
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

  const aboutBlocks = pageBlocks.about;
  const aboutContent = adminContent.about || {};
  const h1Block = (aboutBlocks || []).find(b => b.type === 'heading' && b.level === 1);
  const aboutHeading = h1Block?.content || aboutContent.heading || 'About Panda Express Coupons';

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us/" }
  ];

  const defaultBody = `
    <!-- Editorial Mission -->
    <section>
      <h2>Our Mission: Fighting Dead Coupon Fatigue</h2>
      <p style="font-size: 1.1rem; color: #1F242E; line-height: 1.75;">
        If you have ever ordered dinner online and spent twenty minutes copying and pasting dozens of alphanumeric codes from generic aggregator sites—only to be met with constant "Coupon Expired" or "Invalid Promo Code" errors—you know how frustrating digital coupon hunting has become.
      </p>
      <p style="font-size: 1.05rem; color: #2D3748; line-height: 1.75;">
        Most commercial coupon directories prioritize search engine ranking over user experience, publishing bot-scraped garbage codes and automated clickbait buttons to generate ad revenue.
      </p>
      
      <div class="highlight-callout-box" style="margin: 2rem 0;">
        <div class="callout-icon">🎯</div>
        <div>
          <h3 style="color: #92400E; margin-top: 0;">Our Editorial Promise</h3>
          <p style="color: #78350F; margin-bottom: 0;">
            Provide a clean, lightning-fast, and trustworthy resource where Panda Express diners can check verified deals, understand loyalty point math, calculate accurate meal nutrition, and actually save money at checkout.
          </p>
        </div>
      </div>

      <!-- Real Culinary Kitchen Photography (Phase 6b) -->
      <div style="margin: 2rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12);">
        <picture>
          <source type="image/webp" 
                  srcset="/public/images/optimized/about-kitchen-640.webp 640w,
                          /public/images/optimized/about-kitchen-800.webp 800w,
                          /public/images/optimized/about-kitchen-1280.webp 1280w,
                          /public/images/optimized/about-kitchen-1920.webp 1920w"
                  sizes="(max-width: 860px) 100vw, 860px">
          <img src="/public/images/about-kitchen.jpg" 
               alt="Professional culinary chefs stir-frying fresh Asian entrees over open flame wok ranges in commercial restaurant kitchen" 
               width="1280" 
               height="720" 
               loading="lazy" 
               decoding="async" 
               style="width: 100%; height: auto; display: block;">
        </picture>
      </div>
    </section>

    <!-- How We Check Codes -->
    <section class="section-border" style="padding: 2.5rem 0;">
      <h2>How We Check &amp; Verify Codes</h2>
      <p>
        We treat coupon testing with scientific discipline. Here is our exact verification procedure:
      </p>
      
      <div class="stepper-timeline" style="margin-top: 1.5rem;">
        <div class="stepper-track-line" aria-hidden="true"></div>
        <div class="stepper-step">
          <div class="stepper-circle">1</div>
          <div class="stepper-card">
            <h3>Manual Checkout Testing</h3>
            <p>We open pandaexpress.com and the mobile app, add qualifying entrees, and manually apply each code.</p>
          </div>
        </div>
        <div class="stepper-step">
          <div class="stepper-circle">2</div>
          <div class="stepper-card">
            <h3>Transparent Status Tagging</h3>
            <p>Codes are labeled Active, Check App, or Unverified. We never make up fake verification dates.</p>
          </div>
        </div>
        <div class="stepper-step">
          <div class="stepper-circle">3</div>
          <div class="stepper-card">
            <h3>Pruning Defunct Codes</h3>
            <p>Once an offer concludes nationwide, we promptly flag it as Expired or remove it from rotation.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Editorial Team & Author -->
    <section class="section-border" style="padding: 2.5rem 0;">
      <h2>Who We Are</h2>
      <div class="author-profile-card">
        <div class="author-avatar">🐼</div>
        <div>
          <h3 style="margin-top: 0; margin-bottom: 0.25rem;">PandaCoupons Editorial Desk</h3>
          <p style="font-size: 0.9rem; font-weight: 700; color: #C8102E; margin-bottom: 0.5rem;">Lead Editorial Team &amp; Fast-Casual Dining Analysts</p>
          <p style="font-size: 0.95rem; color: #2D3748; margin-bottom: 0;">
            Our independent research group tests and catalogs verified restaurant savings, loyalty rewards economics, and authentic nutrition metrics to give everyday diners an honest, ad-clutter-free resource.
          </p>
        </div>
      </div>
    </section>

    <!-- Independence Statement -->
    <section class="section-border" style="padding: 2.5rem 0;">
      <h2>Strict Independence Statement</h2>
      <p style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-left: 5px solid #0B0B0B; padding: 1.25rem; font-size: 0.95rem; color: #374151; border-radius: 8px;">
        ${config.independenceDisclaimer} All trademarks, registered logos, dish titles, and corporate service marks featured or referenced on this website remain the sole intellectual property of their respective trademark proprietors. Reference to any third-party commercial brand does not constitute an endorsement, sponsorship, or recommendation by either party.
      </p>
    </section>

    <!-- Contact CTA -->
    <div class="subpage-contact-card">
      <h3 style="margin-top: 0; color: #991B1B;">Have a Question or Found a New Code?</h3>
      <p style="color: #2D3748; max-width: 600px; margin: 0 auto 1.25rem auto;">
        We welcome submissions from fellow diners! If you discover a fresh regional promo code or notice that an existing code has ceased functioning, reach out to our editorial desk:
      </p>
      <a href="mailto:helppandacoupons@gmail.com" class="btn" style="display: inline-flex; align-items: center; gap: 0.5rem;">
        ✉️ helppandacoupons@gmail.com
      </a>
    </div>
  `;

  let bodyContent = defaultBody;
  if (aboutBlocks && aboutBlocks.length > 0) {
    const nonH1Blocks = aboutBlocks.filter(b => !(b.type === 'heading' && b.level === 1));
    bodyContent = renderBlocks(nonH1Blocks, {});
  } else if (aboutContent.bodyHtml) {
    bodyContent = `<div class="rich-text-content" style="font-size: 1.05rem; color: #374151; line-height: 1.8;">${aboutContent.bodyHtml}</div>`;
  }

  const content = `
  <section class="subpage-photo-banner">
    <div class="subpage-banner-mask"></div>
    <div class="container relative-z">
      <div class="dish-hero-kicker">INDEPENDENT CONSUMER RESOURCE</div>
      <h1 class="dish-hero-title">${aboutHeading}</h1>
      <p class="dish-hero-subtitle">
        Our mission: eliminating expired coupon frustration and giving diners honest, tested savings.
      </p>
    </div>
  </section>

  <div class="container" style="padding-top: 3rem; padding-bottom: 4rem; max-width: 860px;">
    ${bodyContent}
  </div>
  `;

  return {
    title: `About Us – Panda Express Coupons Editorial Mission`,
    description: `Learn about Panda Express Coupons, our independent editorial team, our rigorous manual code verification process, and our commitment to clean, honest savings.`,
    canonicalPath: '/about-us/',
    content,
    breadcrumbs
  };
}

module.exports = renderAbout;
