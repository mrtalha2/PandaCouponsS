const fs = require('fs');
const path = require('path');
const config = require('../../data/site.config');
const { renderBlocks } = require('../admin/block-renderer');

function renderPrivacy() {
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

  const privacyBlocks = pageBlocks.privacy;
  const privacyContent = adminContent.privacy || {};
  const h1Block = (privacyBlocks || []).find(b => b.type === 'heading' && b.level === 1);
  const privacyHeading = h1Block?.content || privacyContent.heading || 'Privacy Policy';

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Privacy Policy", url: "/privacy-policy/" }
  ];

  const defaultBody = `
    <!-- Table of Contents -->
    <div class="legal-toc-card">
      <h3 style="margin-top: 0; font-size: 1.1rem;">Table of Contents</h3>
      <ul style="margin-bottom: 0; padding-left: 1.25rem;">
        <li><a href="#no-accounts">1. Zero Sensitive Data Retention</a></li>
        <li><a href="#data-collected">2. Information We Collect</a></li>
        <li><a href="#cookies">3. Cookies &amp; Tracking Choices</a></li>
        <li><a href="#third-parties">4. Third-Party Analytics &amp; Ads</a></li>
        <li><a href="#coppa">5. Children's Online Privacy (COPPA)</a></li>
        <li><a href="#rights">6. Your Consumer Privacy Rights</a></li>
        <li><a href="#contact">7. Contact Us About Privacy</a></li>
      </ul>
    </div>

    <div style="font-size: 1rem; line-height: 1.7;">
      <section id="no-accounts" class="section-border" style="padding: 1.75rem 0;">
        <h2>1. No User Accounts, Financial Processing, or Order Storage</h2>
        <div class="notice-callout-green" style="margin-top: 0.75rem;">
          <div style="font-size: 1.25rem;">🔒</div>
          <div>
            <strong>Zero Sensitive Data Retention:</strong> We do not require visitors to register user accounts, log in with passwords, or enter credit card numbers on our site. All coupon redemption and food ordering transactions occur exclusively on external official domains (such as pandaexpress.com or authorized mobile apps).
          </div>
        </div>
      </section>

      <section id="data-collected" class="section-border" style="padding: 1.75rem 0;">
        <h2>2. Information We May Collect</h2>
        <p>We restrict data collection strictly to essential operational and navigational elements:</p>
        <ul class="checklist">
          <li><strong>Voluntary Contact Submissions:</strong> If you reach out to us via our contact form or direct email, we collect your name, email address, and message contents to formulate a response.</li>
          <li><strong>Aggregated Navigational Analytics:</strong> Technical details such as browser type, referring URL, pages viewed, and visit timestamps are collected in aggregate to improve speed and layout.</li>
        </ul>
      </section>

      <section id="cookies" class="section-border" style="padding: 1.75rem 0;">
        <h2>3. Cookies &amp; Tracking Technologies</h2>
        <p>
          Cookies are compact text files stored on your local hardware by your web browser. We may utilize standard functional cookies to analyze general site traffic trends and remember user preferences (such as calculator toggles).
        </p>
        <p>
          <strong>Your Cookie Choices:</strong> You retain complete autonomy over cookie storage. You may adjust your web browser settings to reject all cookies or notify you whenever a cookie is created.
        </p>
      </section>

      <section id="third-parties" class="section-border" style="padding: 1.75rem 0;">
        <h2>4. Third-Party Services &amp; Advertising Partners</h2>
        <p>
          We may cooperate with reputable third-party analytics and advertising service vendors (including Google Analytics or display advertising networks) to evaluate website engagement and sustain free access to our content.
        </p>
        <p>
          These external partners may deploy their own cookies to display non-personalized or contextual ads. We do not transmit personal identifiers to these advertising vendors.
        </p>
      </section>

      <section id="coppa" class="section-border" style="padding: 1.75rem 0;">
        <h2>5. Children's Online Privacy Protection (COPPA)</h2>
        <p>
          Our platform is tailored exclusively for general adult and teenage consumer audiences looking for dining value. We do not intentionally solicit, collect, or store personal information from children under the age of 13.
        </p>
      </section>

      <section id="rights" class="section-border" style="padding: 1.75rem 0;">
        <h2>6. Your Privacy Rights (Access &amp; Deletion Requests)</h2>
        <p>
          Depending on your regional jurisdiction (such as California under the CCPA/CPRA, or the European Economic Area under GDPR), you possess specific legal rights concerning your data, including the right to inquire about data processed or request the deletion of email correspondence you sent us.
        </p>
      </section>

      <section id="contact" class="section-border" style="padding: 1.75rem 0;">
        <h2>7. Contact Us About Privacy</h2>
        <p>
          If you have questions, privacy concerns, or data erasure requests concerning this Privacy Policy, our designated privacy representative can be reached at:
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
  if (privacyBlocks && privacyBlocks.length > 0) {
    const nonH1Blocks = privacyBlocks.filter(b => !(b.type === 'heading' && b.level === 1));
    bodyContent = renderBlocks(nonH1Blocks, {});
  } else if (privacyContent.bodyHtml) {
    bodyContent = `<div class="rich-text-content" style="font-size: 1.05rem; line-height: 1.8;">${privacyContent.bodyHtml}</div>`;
  }

  const content = `
  <section class="subpage-photo-banner">
    <div class="subpage-banner-mask"></div>
    <div class="container relative-z">
      <div class="dish-hero-kicker">LEGAL &amp; COMPLIANCE</div>
      <h1 class="dish-hero-title">${privacyHeading}</h1>
      <p class="dish-hero-subtitle">
        Last Revised: {{MONTH_YEAR}} • Our commitment to consumer data protection and privacy.
      </p>
    </div>
  </section>

  <div class="container" style="padding-top: 3rem; padding-bottom: 4rem; max-width: 860px;">
    ${bodyContent}
  </div>
  `;

  return {
    title: `Privacy Policy – Panda Express Coupons Data Standards`,
    description: `Read the Panda Express Coupons privacy policy. Zero personal data retention, no third-party tracking cookies, and transparent consumer privacy protections.`,
    canonicalPath: '/privacy-policy/',
    content,
    breadcrumbs
  };
}

module.exports = renderPrivacy;
