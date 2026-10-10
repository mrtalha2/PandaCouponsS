const config = require('../../data/site.config');

function renderAbout() {
  const aboutHeading = 'About Panda Express Coupons';

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us/" }
  ];

  const defaultBody = `
    <!-- Editorial Mission -->
    <section>
      <h2>Our Mission: Fighting Dead Coupon Fatigue</h2>
      <p style="font-size: 1.1rem; line-height: 1.75;">
        If you have ever ordered dinner online and spent twenty minutes copying and pasting dozens of alphanumeric codes from generic aggregator sites—only to be met with constant "Coupon Expired" or "Invalid Promo Code" errors—you know how frustrating digital coupon hunting has become.
      </p>
      <p style="font-size: 1.05rem; line-height: 1.75;">
        Most commercial coupon directories prioritize search engine ranking over user experience, publishing bot-scraped garbage codes and automated clickbait buttons to generate ad revenue.
      </p>
      
      <div class="highlight-callout-box" style="margin: 2rem 0;">
        <div class="callout-icon">🎯</div>
        <div>
          <h3 class="callout-h" style="margin-top: 0;">Our Editorial Promise</h3>
          <p class="callout-p" style="margin-bottom: 0;">
            Provide a clean, fast, and trustworthy resource where Panda Express diners can check deal confidence levels, understand loyalty point math, review accurate meal nutrition from official guides, and save money at checkout.
          </p>
        </div>
      </div>

      <!-- Kitchen Photography -->
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
      <p style="font-size: 1.05rem; line-height: 1.75;">
        We collect codes from Panda Express's own app and website and from public deal reports, try them where possible, and label each by how sure we are. Codes change often and vary by location, so confirm the discount in your cart before paying. We do not have a live feed from Panda Express.
      </p>
      
      <div class="stepper-timeline" style="margin-top: 1.5rem;">
        <div class="stepper-track-line" aria-hidden="true"></div>
        <div class="stepper-step">
          <div class="stepper-circle">1</div>
          <div class="stepper-card">
            <h3>Deal Collection &amp; App Tracking</h3>
            <p>We monitor Panda Express digital channels and community deal reports to catch new promotional campaigns.</p>
          </div>
        </div>
        <div class="stepper-step">
          <div class="stepper-circle">2</div>
          <div class="stepper-card">
            <h3>Honest Confidence Rating</h3>
            <p>Codes are labeled Active (Reported working), Unconfirmed, or Expired so you know the reliability before ordering.</p>
          </div>
        </div>
        <div class="stepper-step">
          <div class="stepper-circle">3</div>
          <div class="stepper-card">
            <h3>Continuous Date Tracking</h3>
            <p>We record exact checked dates and promptly retire expired seasonal promotions like Mother's Day deals.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Editorial Policy & Corrections -->
    <section class="section-border" style="padding: 2.5rem 0;">
      <h2>Editorial Policy &amp; Corrections</h2>
      <p style="font-size: 1.05rem; line-height: 1.75;">
        Our editorial team selects featured coupon codes, pricing breakdowns, and nutritional tables based on public availability and consumer utility. We do not accept payment for coupon placement or favorable dish rankings.
      </p>
      <p style="font-size: 1.05rem; line-height: 1.75;">
        <strong>How Readers Report Errors:</strong> If you find an expired code, an altered restaurant price, or a discrepancy in nutritional figures, email us at <span style="font-weight: 700; color: #C8102E; user-select: text; cursor: default;">${config.contactEmail}</span>. Our team investigates every submission and applies corrections promptly to maintain data accuracy.
      </p>
    </section>

    <!-- Editorial Team & Author -->
    <section class="section-border" style="padding: 2.5rem 0;">
      <h2>Who We Are</h2>
      <div class="author-profile-card">
        <div class="author-avatar">🐼</div>
        <div>
          <h3 style="margin-top: 0; margin-bottom: 0.25rem;">Editorial Team</h3>
          <p style="font-size: 0.9rem; font-weight: 700; color: #C8102E; margin-bottom: 0.5rem;">Independent Food &amp; Dining Research Group</p>
          <p style="font-size: 0.95rem; margin-bottom: 0;">
            Our independent research group catalogs verified restaurant savings, loyalty rewards economics, and authentic nutrition metrics from official guides to give diners a clean, transparent resource.
          </p>
        </div>
      </div>
    </section>

    <!-- Independence Statement -->
    <section class="section-border" style="padding: 2.5rem 0;">
      <h2>Strict Independence Statement</h2>
      <p class="statement-callout-box" style="padding: 1.25rem; font-size: 0.95rem; border-radius: 8px;">
        ${config.independenceDisclaimer} All trademarks, registered logos, dish titles, and corporate service marks featured or referenced on this website remain the sole intellectual property of their respective trademark proprietors. Reference to any third-party commercial brand does not constitute an endorsement, sponsorship, or recommendation by either party.
      </p>
    </section>

    <!-- Contact CTA -->
    <div class="subpage-contact-card">
      <h3 style="margin-top: 0;">Have a Question or Found a New Code?</h3>
      <p style="max-width: 600px; margin: 0 auto 1.25rem auto;">
        We welcome submissions from fellow diners! If you discover a fresh regional promo code or notice that an existing code has ceased functioning, reach out to our editorial desk:
      </p>
      <div class="btn" style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: default; user-select: text;">
        ✉️ ${config.contactEmail}
      </div>
    </div>
  `;

  const bodyContent = defaultBody;

  const content = `
  <section class="subpage-photo-banner">
    <div class="subpage-banner-mask"></div>
    <div class="container relative-z">
      <div class="dish-hero-kicker">INDEPENDENT CONSUMER RESOURCE</div>
      <h1 class="dish-hero-title">${aboutHeading}</h1>
      <p class="dish-hero-subtitle">
        Reviewed {{MONTH_YEAR}} by the Editorial Team • Eliminating coupon fatigue with honest, tested savings.
      </p>
    </div>
  </section>

  <div class="container" style="padding-top: 3rem; padding-bottom: 4rem; max-width: 860px;">
    ${bodyContent}
  </div>
  `;

  return {
    title: `About Us – Panda Express Coupons Editorial Mission`,
    description: `Learn about Panda Express Coupons, our independent editorial team, how we check promo codes, our sourcing standards, and our honest dining mission.`,
    canonicalPath: '/about-us/',
    content,
    breadcrumbs
  };
}

module.exports = renderAbout;
