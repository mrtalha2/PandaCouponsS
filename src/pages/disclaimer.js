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
        <li><a href="#trademarks">2. Ownership of Trademarks</a></li>
        <li><a href="#volatility">3. Coupon &amp; Pricing Volatility</a></li>
        <li><a href="#nutrition">4. Nutrition &amp; Allergen Disclaimers</a></li>
        <li><a href="#affiliate">5. Advertising &amp; Affiliate Disclosure</a></li>
        <li><a href="#liability">6. Limitation of Liability</a></li>
        <li><a href="#contact">7. Removal Requests &amp; Inquiries</a></li>
      </ul>
    </div>

    <div style="font-size: 1rem; line-height: 1.7;">
      <section id="independence" class="section-border" style="padding: 1.75rem 0;">
        <h2>1. Independent Website Disclaimer</h2>
        <p>
          <strong>Panda Express Coupons</strong> (accessible at ${config.domain}) is an autonomous, privately-maintained consumer information resource. This website is <strong>NOT</strong> owned, operated, endorsed, authorized, or sponsored by Panda Express, Panda Restaurant Group, Inc., or any of their corporate affiliates, subsidiaries, parent entities, or authorized franchise partners.
        </p>
      </section>

      <section id="trademarks" class="section-border" style="padding: 1.75rem 0;">
        <h2>2. Ownership of Trademarks &amp; Trade Names</h2>
        <p>
          "Panda Express", "Orange Chicken", "Beijing Beef", "Panda Rewards", and all associated trade names, culinary item titles, brand emblems, and logos are registered trademarks or service marks owned solely by Panda Restaurant Group, Inc.
        </p>
        <p>
          The nominative use of these corporate brand names and menu terminology throughout this website serves purely descriptive, educational, and editorial objectives under established Fair Use legal doctrines. Neither this website nor its publishers assert any ownership rights, proprietary claims, or intellectual property rights regarding these trademarks.
        </p>
      </section>

      <section id="volatility" class="section-border" style="padding: 1.75rem 0;">
        <h2>3. Coupon Codes, Promotional Offers &amp; Pricing Volatility</h2>
        <p>
          All promotional codes, digital vouchers, discounts, and percentage-off offers documented on this platform are provided on an "as-is" and "as-available" informational basis. Fast-casual restaurant promotions, pricing, and campaign terms are subject to change, regional revocation, or sudden expiration without notice at the discretion of restaurant management.
        </p>
        <p>
          While our editorial staff takes diligent measures to test and tag codes regularly, we cannot guarantee that any specific promotional code will function at your local store, on any third-party app, or at any specific date or time. Always review your shopping cart subtotal prior to finalizing financial payment on official vendor channels.
        </p>
      </section>

      <section id="nutrition" class="section-border" style="padding: 1.75rem 0;">
        <h2>4. Nutrition Information &amp; Allergen Disclaimers</h2>
        <p>
          Calorie counts, macro breakdowns (protein, carbohydrates, fat), and portion sizes displayed within our articles and interactive Nutrition Calculator represent rounded industry approximations based on publicly disseminated nutritional data. Individual restaurant cooking methods, serving ladle variance, ingredient substitutions, and local preparation variations may alter actual nutritional profiles.
        </p>
        <p>
          Individuals with severe food allergies, celiac disease, diabetes, or specialized medical dietary constraints should never rely on third-party estimates and should consult official restaurant allergen charts or registered healthcare specialists.
        </p>
      </section>

      <section id="affiliate" class="section-border" style="padding: 1.75rem 0;">
        <h2>5. Advertising &amp; Affiliate Disclosure</h2>
        <p>
          To offset server hosting and editorial maintenance expenses, this website may display digital display advertisements or incorporate contextual affiliate links. If you click on an affiliate referral link and complete a transaction, we may earn a modest commission at zero additional expense to you.
        </p>
      </section>

      <section id="liability" class="section-border" style="padding: 1.75rem 0;">
        <h2>6. Limitation of Liability &amp; Use at Your Own Risk</h2>
        <p>
          Your utilization of this website and reliance on any content, vouchers, or nutritional estimates provided herein occurs strictly at your sole risk. Under no legal circumstances shall the owners, developers, or content contributors of this site be held accountable for direct, indirect, incidental, or consequential damages resulting from the use or inability to use this platform.
        </p>
      </section>

      <section id="contact" class="section-border" style="padding: 1.75rem 0;">
        <h2>7. Inquiries, Corrections &amp; Content Removal Requests</h2>
        <p>
          If you are an intellectual property holder or authorized brand representative and hold concerns regarding any reference or content published on this website, please direct formal correspondence to our designated contact inbox. We address all legitimate removal and modification requests promptly:
        </p>
        <p>
          ✉️ <a href="mailto:${config.contactEmail}" style="font-weight: 800; color: #C8102E;">
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
        Independent publishing statement, trademark acknowledgments, and terms of service.
      </p>
    </div>
  </section>

  <div class="container" style="padding-top: 3rem; padding-bottom: 4rem; max-width: 860px;">
    ${bodyContent}
  </div>
  `;

  return {
    title: `Disclaimer & Trademark Statement – Panda Express Coupons`,
    description: `Official independent disclaimer for Panda Express Coupons. Review our trademark notices, terms of use, affiliate policies, and non-affiliation statements.`,
    canonicalPath: '/disclaimer/',
    content,
    breadcrumbs
  };
}

module.exports = renderDisclaimer;
