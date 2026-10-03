const config = require('../../data/site.config');

function renderContact() {
  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Contact Us", url: "/contact-us/" }
  ];

  const quickLinks = [
    {
      title: "🚨 Report a broken or expired coupon code",
      subject: "Report Broken or Expired Coupon Code",
      body: "Coupon Code:\nWhat error appeared:\nDate attempted:\nOrder type (App / Web / In-Store):\n"
    },
    {
      title: "🎉 Submit a new working promo code",
      subject: "Submit a New Working Promo Code",
      body: "Coupon Code:\nWhere you found it:\nWhat it gives (discount):\nMinimum order requirement (if any):\n"
    },
    {
      title: "🥗 Nutrition data correction",
      subject: "Nutrition Data Correction Request",
      body: "Item name:\nWhich page:\nThe number you believe is right:\nSource link:\n"
    },
    {
      title: "⚖️ Trademark or legal inquiry",
      subject: "Trademark or Legal Inquiry",
      body: "Inquiry / Request Details:\n"
    }
  ];

  const content = `
  <section class="subpage-photo-banner">
    <div class="subpage-banner-mask"></div>
    <div class="container relative-z">
      <div class="dish-hero-kicker">GET IN TOUCH</div>
      <h1 class="dish-hero-title">Contact Us</h1>
      <p class="dish-hero-subtitle">
        Have feedback, spotted an unlisted coupon code, or found an issue? We read every message and reply as soon as we can.
      </p>
    </div>
  </section>

  <div class="container" style="padding-top: 3rem; padding-bottom: 4rem; max-width: 860px;">
    <div class="contact-info-card" style="margin-bottom: 2.5rem; text-align: center; padding: 2.5rem 2rem;">
      <h2 style="font-size: 1.6rem; margin-top: 0; margin-bottom: 0.75rem;">Direct Email Contact</h2>
      <p style="font-size: 1.05rem; margin-bottom: 1.75rem; color: #D1D5DB; max-width: 600px; margin-left: auto; margin-right: auto;">
        Our team handles all inquiries directly via email. Click below to compose a message or copy our address to your clipboard:
      </p>
      
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; align-items: center; margin-bottom: 1rem;">
        <a href="mailto:${config.contactEmail}" class="btn" style="font-size: 1.1rem; padding: 0.9rem 1.75rem;">
          ✉️ Email Us: ${config.contactEmail}
        </a>
        <button type="button" class="btn btn-outline btn-copy-email" data-email="${config.contactEmail}" aria-label="Copy email address to clipboard" style="font-size: 1.05rem; padding: 0.85rem 1.5rem;">
          📋 Copy Email
        </button>
      </div>
    </div>

    <!-- Quick-link mailto actions -->
    <div class="quick-inquiry-section" style="margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.35rem; margin-bottom: 1rem;">Common Inquiries &amp; Quick Email Templates</h2>
      <p style="font-size: 0.95rem; color: #D1D5DB; margin-bottom: 1.25rem;">
        Select an inquiry category below to open a pre-formatted email draft in your email client:
      </p>
      <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
        ${quickLinks.map(link => {
          const mailtoUrl = `mailto:${config.contactEmail}?subject=${encodeURIComponent(link.subject)}&body=${encodeURIComponent(link.body)}`;
          return `
            <a href="${mailtoUrl}" class="quick-link-card" style="display: block; padding: 1.25rem 1.5rem; background: #18181B; border: 1px solid #27272A; border-radius: 12px; text-decoration: none; transition: border-color 0.2s ease;">
              <div style="font-weight: 700; font-size: 1.05rem; color: #FFFFFF; margin-bottom: 0.25rem;">${link.title}</div>
              <div style="font-size: 0.88rem; color: #9CA3AF;">Click to open pre-filled email draft &rarr;</div>
            </a>
          `;
        }).join('')}
      </div>
    </div>

    <!-- What to include in your email -->
    <div class="contact-guidelines-card" style="background: #140E0C; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 1.75rem 2rem; margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: #FFFFFF;">What to Include in Your Email</h2>
      <ul style="color: #D1D5DB; font-size: 0.95rem; line-height: 1.7; padding-left: 1.25rem; margin-bottom: 0;">
        <li><strong>For promo codes:</strong> The exact code string, where you found it, and any order minimums.</li>
        <li><strong>For broken deals:</strong> The code, the error message returned, and your ordering channel (App, Web, or Store).</li>
        <li><strong>For nutrition questions:</strong> The specific menu item name and a link to the official Panda Express nutrition guide.</li>
      </ul>
    </div>

    <!-- Independence Statement -->
    <div style="margin-top: 2rem;">
      <p class="statement-callout-box" style="padding: 1.25rem; font-size: 0.92rem; border-radius: 8px; color: #9CA3AF; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08);">
        ${config.independenceDisclaimer} All trademarks, registered logos, and menu dish names featured or referenced on this website remain the sole intellectual property of their respective trademark proprietors.
      </p>
    </div>
  </div>
  `;

  return {
    title: `Contact Us – Panda Express Coupons Support & Inquiries`,
    description: `Contact the Panda Express Coupons editorial desk at ${config.contactEmail}. Submit working promo codes, report expired deals, or request menu data updates.`,
    canonicalPath: '/contact-us/',
    content,
    breadcrumbs
  };
}

module.exports = renderContact;
