const config = require('../../data/site.config');

function renderPrivacy() {
  const privacyHeading = 'Privacy Policy';

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Privacy Policy", url: "/privacy-policy/" }
  ];

  const defaultBody = `
    <!-- Table of Contents -->
    <div class="legal-toc-card">
      <h2 style="margin-top: 0; font-size: 1.1rem;">Table of Contents</h2>
      <ul style="margin-bottom: 0; padding-left: 1.25rem;">
        <li><a href="#who-we-are">1. Who We Are &amp; Contact Information</a></li>
        <li><a href="#data-collection">2. What Information We Collect</a></li>
        <li><a href="#browser-storage">3. Local Browser Storage (Meal Cart)</a></li>
        <li><a href="#server-logs">4. Server Access Logs &amp; Retention</a></li>
        <li><a href="#cookies-analytics">5. Cookies &amp; Analytics</a></li>
        <li><a href="#third-parties">6. Third Parties &amp; Self-Hosted Assets</a></li>
        <li><a href="#privacy-rights">7. Your Privacy Rights (CCPA &amp; GDPR)</a></li>
        <li><a href="#children">8. Children's Privacy</a></li>
      </ul>
    </div>

    <div style="font-size: 1rem; line-height: 1.7;">
      <section id="who-we-are" class="section-border" style="padding: 1.75rem 0;">
        <h2>1. Who We Are &amp; Contact Information</h2>
        <p>
          Panda Express Coupons (accessible at <strong>${config.domain}</strong>) is an independent informational guide maintained by the Panda Coupons Editorial Team. We provide public coupon aggregation, menu pricing breakdowns, and nutritional summaries for consumers.
        </p>
        <p>
          If you have questions regarding this Privacy Policy or wish to exercise any privacy rights, contact us directly at:
          <br>
          ✉️ <span style="font-weight: 700; color: #C8102E; user-select: text; cursor: default;">${config.contactEmail}</span>
        </p>
      </section>

      <section id="data-collection" class="section-border" style="padding: 1.75rem 0;">
        <h2>2. What Information We Collect</h2>
        <p>
          We believe in minimal data collection. We do not require account registration, user logins, payment processing, or submission of personal profile information on this website.
        </p>
        <p>
          The only personal data we receive is information you voluntarily choose to provide when sending an email to our contact address. If you email us, we receive your email address, your name (if included in your email client), and your message text. We use this information exclusively to read your feedback, investigate reported deal inaccuracies, and send a direct reply. We never sell, rent, or distribute your email correspondence to third parties.
        </p>
      </section>

      <section id="browser-storage" class="section-border" style="padding: 1.75rem 0;">
        <h2>3. Local Browser Storage (Meal Cart)</h2>
        <p>
          Our interactive Nutrition &amp; Savings Calculator offers an optional client-side feature allowing you to build and customize meal selections. To preserve your meal selections across browser refreshes, the application stores your chosen item IDs and quantities in your browser's local storage under the key <code>"panda-meal-cart"</code>.
        </p>
        <p>
          This data is saved strictly on your local device hardware. It is never transmitted to our web server or accessible to any external third party. You can clear this stored meal cart at any time by clicking "Clear Meal" inside the calculator tool or by clearing website data in your browser settings.
        </p>
      </section>

      <section id="server-logs" class="section-border" style="padding: 1.75rem 0;">
        <h2>4. Server Access Logs &amp; Security Retention</h2>
        <p>
          Like standard web hosting environments, our web server infrastructure automatically records basic technical connection logs when pages are requested. These access logs may include:
        </p>
        <ul class="checklist">
          <li>Your internet protocol (IP) address</li>
          <li>Browser user agent type and operating system version</li>
          <li>Requested URL path and HTTP status code</li>
          <li>Timestamp and date of the request</li>
        </ul>
        <p>
          These operational logs are maintained solely for cybersecurity monitoring, diagnosing broken assets, rate-limiting malicious traffic, and defending against denial-of-service attacks. Server access logs are automatically rotated and permanently deleted after 30 days.
        </p>
      </section>

      <section id="cookies-analytics" class="section-border" style="padding: 1.75rem 0;">
        <h2>5. Cookies &amp; Analytics</h2>
        <p>
          We do not deploy marketing cookies, cross-site behavioral trackers, or ad-targeting cookies on your computer. We believe in providing fast, clutter-free coupon references without intrusive consumer profiling.
        </p>
      </section>

      <section id="third-parties" class="section-border" style="padding: 1.75rem 0;">
        <h2>6. Third Parties &amp; Self-Hosted Assets</h2>
        <p>
          We restrict external dependencies to maintain high privacy standards:
        </p>
        <ul class="checklist">
          <li><strong>Hosting Infrastructure:</strong> Static site assets and the Node.js application server run on dedicated host infrastructure that delivers requested HTML, CSS, and image files.</li>
          <li><strong>Outbound Restaurant Links:</strong> Articles and deal cards contain outbound hyperlinks leading to external official restaurant domains (such as pandaexpress.com). When clicking these external links, their independent privacy terms and cookie practices govern your interaction.</li>
          <li><strong>Self-Hosted Typography:</strong> All font files (Plus Jakarta Sans) are served directly from our own domain servers, eliminating third-party font network tracking.</li>
        </ul>
      </section>

      <section id="privacy-rights" class="section-border" style="padding: 1.75rem 0;">
        <h2>7. Your Consumer Privacy Rights (CCPA &amp; GDPR)</h2>
        <p>
          Regardless of your physical location, we provide clear mechanisms to exercise privacy rights:
        </p>
        <p>
          <strong>California Consumer Privacy Act (CCPA / CPRA):</strong> Under California privacy regulations, residents hold the right to know what personal details are collected and to request deletion. Because we do not sell, rent, or share personal data with data brokers, your browsing is private. If you have sent us an email, you may request that your message history be expunged.
        </p>
        <p>
          <strong>European Union &amp; UK General Data Protection Regulation (GDPR):</strong> For visitors from the EEA and United Kingdom, any processing of email correspondence is grounded in legitimate interests (responding to your direct inquiries). You retain full rights to request access, rectification, or complete erasure of past email communications by contacting us.
        </p>
      </section>

      <section id="children" class="section-border" style="padding: 1.75rem 0;">
        <h2>8. Children's Online Privacy Protection</h2>
        <p>
          Our platform is intended for general audiences and adult dining consumers. We do not intentionally solicit, collect, or store personal data from children under the age of 13. If you believe a child has contacted us via email, please notify us and we will delete the correspondence immediately.
        </p>
      </section>
    </div>
  `;

  const bodyContent = defaultBody;

  const content = `
  <section class="subpage-photo-banner">
    <div class="subpage-banner-mask"></div>
    <div class="container relative-z">
      <div class="dish-hero-kicker">LEGAL &amp; COMPLIANCE</div>
      <h1 class="dish-hero-title">${privacyHeading}</h1>
      <p class="dish-hero-subtitle">
        Last revised {{MONTH_YEAR}} • Reviewed by the Panda Coupons Editorial Team.
      </p>
    </div>
  </section>

  <div class="container" style="padding-top: 3rem; padding-bottom: 4rem; max-width: 860px;">
    ${bodyContent}
  </div>
  `;

  return {
    title: `Privacy Policy – Panda Express Coupons Data Standards`,
    description: `Read the Panda Express Coupons privacy policy. Clear disclosures on data collection, local storage, server logs, and consumer privacy rights.`,
    canonicalPath: '/privacy-policy/',
    content,
    breadcrumbs
  };
}

module.exports = renderPrivacy;
