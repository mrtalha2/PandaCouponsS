const fs = require('fs');
const path = require('path');
const config = require('../../data/site.config');
const { renderBlocks } = require('../admin/block-renderer');

function renderDisclaimer() {
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

  const disclaimerBlocks = pageBlocks.disclaimer;
  const disclaimerContent = adminContent.disclaimer || {};
  const h1Block = (disclaimerBlocks || []).find(b => b.type === 'heading' && b.level === 1);
  const disclaimerHeading = h1Block?.content || disclaimerContent.heading || 'Website Disclaimer &amp; Trademarks';

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Disclaimer", url: "/disclaimer/" }
  ];

  const defaultBody = `
    <!-- Table of Contents -->
    <div class="legal-toc-card">
      <h3 style="margin-top: 0; font-size: 1.1rem;">Table of Contents</h3>
      <ul style="margin-bottom: 0; padding-left: 1.25rem;">
        <li><a href="#independence">1. Independent Status</a></li>
        <li><a href="#trademarks">2. Ownership of Trademarks &amp; Fair Use</a></li>
        <li><a href="#funding">3. How This Site Is Funded</a></li>
        <li><a href="#volatility">4. Coupon Accuracy &amp; Offer Expiration</a></li>
        <li><a href="#nutrition">5. Nutrition &amp; Allergen Disclaimers</a></li>
        <li><a href="#liability">6. Limitation of Liability</a></li>
        <li><a href="#contact">7. Corrections &amp; Editorial Inquiries</a></li>
      </ul>
    </div>

    <div style="font-size: 1rem; line-height: 1.7;">
      <section id="independence" class="section-border" style="padding: 1.75rem 0;">
        <h2>1. Independent Website Disclaimer</h2>
        <p>
          <strong>Panda Express Coupons</strong> (accessible at ${config.domain}) is an autonomous consumer information guide maintained by the Panda Coupons Editorial Team. This website is <strong>NOT</strong> owned, operated, authorized, endorsed, or sponsored by Panda Express, Panda Restaurant Group, Inc., or any of their parent corporations, subsidiaries, or franchise entities.
        </p>
      </section>

      <section id="trademarks" class="section-border" style="padding: 1.75rem 0;">
        <h2>2. Ownership of Trademarks &amp; Fair Use</h2>
        <p>
          "Panda Express", "Orange Chicken", "Beijing Beef", "Panda Rewards", and all related brand names, emblems, and logos are registered trademarks or service marks owned solely by Panda Restaurant Group, Inc.
        </p>
        <p>
          These trademarks and proprietary names are used on this site strictly to identify and accurately describe the restaurant brand, menu items, and publicly shared discount offers under nominative fair use legal doctrines. We assert no proprietary claim or affiliation with Panda Restaurant Group, Inc.
        </p>
      </section>

      <section id="funding" class="section-border" style="padding: 1.75rem 0;">
        <h2>3. How This Site Is Funded</h2>
        <p>
          <strong>This site currently carries no ads and no affiliate links.</strong>
        </p>
        <p>
          All coupon listings, nutrition calculations, and money-saving guides are provided purely for public consumer benefit with zero sponsored placement, paid ranking, or commission compensation. If our funding model ever changes in the future, we will place prominent, transparent disclosures at the top of every page containing sponsored or affiliate links.
        </p>
      </section>

      <section id="volatility" class="section-border" style="padding: 1.75rem 0;">
        <h2>4. Coupon Accuracy &amp; Offer Expiration</h2>
        <p>
          Promotional codes, digital coupons, and discount terms are aggregated from public deal reports and verified where feasible, but fast-casual promotions change frequently. Codes may be location-limited, require minimum purchases, or expire without advance notice.
        </p>
        <p>
          Always verify the applied discount in your digital shopping cart or at the cash register before completing your payment. We do not operate a live technical data feed from Panda Express restaurants.
        </p>
      </section>

      <section id="nutrition" class="section-border" style="padding: 1.75rem 0;">
        <h2>5. Nutrition Information &amp; Allergen Disclaimers</h2>
        <p>
          Calorie counts, macro metrics, and allergen indicators reflect standard published baseline recipes from the official Panda Express nutrition guide, last checked {{MONTH_YEAR}}. Because dishes are prepared in small wok batches, actual nutritional values vary by location, scooping portion size, and culinary preparation.
        </p>
        <p>
          This content does not constitute medical or nutritional advice. If you have severe food allergies, celiac disease, or specific dietary requirements, always verify ingredients with restaurant personnel directly before ordering.
        </p>
      </section>

      <section id="liability" class="section-border" style="padding: 1.75rem 0;">
        <h2>6. Limitation of Liability &amp; Use at Your Own Risk</h2>
        <p>
          Your utilization of this website and reliance on any content, vouchers, or nutritional estimates provided herein occurs strictly at your sole risk. Under no circumstances shall the authors, editors, or publishers of this site be liable for direct, indirect, or consequential damages resulting from website use.
        </p>
      </section>

      <section id="contact" class="section-border" style="padding: 1.75rem 0;">
        <h2>7. Corrections &amp; Editorial Inquiries</h2>
        <p>
          If you identify an expired coupon, an outdated price, or an inaccurate nutrition number, please send a note to our editorial inbox. We review reports and apply corrections promptly:
        </p>
        <p>
          ✉️ <a href="mailto:${config.contactEmail}" style="font-weight: 700; color: #C8102E;">
            ${config.contactEmail}
          </a>
        </p>
      </section>
    </div>
  `;

  let bodyContent = defaultBody;
  if (disclaimerBlocks && disclaimerBlocks.length > 0) {
    const nonH1Blocks = disclaimerBlocks.filter(b => !(b.type === 'heading' && b.level === 1));
    bodyContent = renderBlocks(nonH1Blocks, {});
  } else if (disclaimerContent.bodyHtml) {
    bodyContent = `<div class="rich-text-content" style="font-size: 1.05rem; line-height: 1.8;">${disclaimerContent.bodyHtml}</div>`;
  }

  const content = `
  <section class="subpage-photo-banner">
    <div class="subpage-banner-mask"></div>
    <div class="container relative-z">
      <div class="dish-hero-kicker">EDITORIAL &amp; LEGAL DISCLAIMER</div>
      <h1 class="dish-hero-title">${disclaimerHeading}</h1>
      <p class="dish-hero-subtitle">
        Reviewed {{MONTH_YEAR}} by the Panda Coupons Editorial Team • Independent publishing statement and terms.
      </p>
    </div>
  </section>

  <div class="container" style="padding-top: 3rem; padding-bottom: 4rem; max-width: 860px;">
    ${bodyContent}
  </div>
  `;

  return {
    title: `Disclaimer & Trademark Statement – Panda Express Coupons`,
    description: `Independent disclaimer for Panda Express Coupons. Review our trademark notices, terms of use, funding model, and non-affiliation statements.`,
    canonicalPath: '/disclaimer/',
    content,
    breadcrumbs
  };
}

module.exports = renderDisclaimer;
