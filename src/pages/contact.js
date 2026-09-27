const fs = require('fs');
const path = require('path');
const config = require('../../data/site.config');

function renderContact() {
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

  const contactBlocks = pageBlocks.contact || [];
  const contactFormBlock = contactBlocks.find(b => b.type === 'contact-form');
  const contactContent = adminContent.contact || {};

  const heroTitle = contactFormBlock?.title || contactContent.heading || 'Contact Our Editorial Team';
  const heroSubtitle = contactFormBlock?.subtitle || contactContent.subtitle || 'Have feedback, spotted an unlisted coupon code, or found a broken deal? We reply within 2–3 business days.';
  const boxTitle = contactFormBlock?.boxTitle || 'Direct Support Email';
  const boxDesc = contactFormBlock?.boxDesc || 'For direct assistance, media inquiries, or legal notifications, send an email to our editorial desk:';
  const supportEmail = contactFormBlock?.supportEmail || contactContent.supportEmail || 'helppandacoupons@gmail.com';

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Contact Us", url: "/contact-us/" }
  ];

  const content = `
  <section class="subpage-photo-banner">
    <div class="subpage-banner-mask"></div>
    <div class="container relative-z">
      <div class="dish-hero-kicker">GET IN TOUCH</div>
      <h1 class="dish-hero-title">${heroTitle}</h1>
      <p class="dish-hero-subtitle">
        ${heroSubtitle}
      </p>
    </div>
  </section>

  <div class="container" style="padding-top: 3rem; padding-bottom: 4rem; max-width: 860px;">
    <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
      <!-- Direct Email Box -->
      <div class="contact-info-card">
        <h2 style="font-size: 1.35rem; margin-top: 0;">${boxTitle}</h2>
        <p style="font-size: 0.98rem; margin-bottom: 1rem;">
          ${boxDesc}
        </p>
        <p style="margin-bottom: 0;">
          ✉️ <a href="mailto:${supportEmail}" style="font-size: 1.15rem; font-weight: 800; color: #C8102E;">
            ${supportEmail}
          </a>
        </p>
      </div>

      <!-- Form Box -->
      <div class="contact-form-card">
        <h2 style="font-size: 1.4rem; margin-top: 0; margin-bottom: 0.5rem;">Send Us a Message</h2>
        <p class="section-subtitle-muted" style="font-size: 0.92rem; margin-bottom: 1.75rem;">
          Fill out the form below and our team will get back to you shortly.
        </p>

        <form action="${config.formEndpoint}" method="POST" id="contact-form">
          <!-- Honeypot spam protection -->
          <input type="text" name="_gotcha" class="visually-hidden" tabindex="-1" autocomplete="off" aria-hidden="true">

          <div class="form-group">
            <label for="contact-topic" class="form-label">Subject / Purpose</label>
            <select id="contact-topic" name="topic" class="form-select" required>
              <option value="broken-code">🚨 Report a Broken or Expired Coupon Code</option>
              <option value="new-code">🎉 Submit a New Working Promo Code</option>
              <option value="nutrition-correction">🥗 Nutrition Data Correction</option>
              <option value="general-inquiry" selected>💬 General Feedback or Question</option>
              <option value="legal-trademark">⚖️ Trademark or Legal Inquiry</option>
            </select>
          </div>

          <div class="form-group">
            <label for="contact-name" class="form-label">Your Name</label>
            <input type="text" id="contact-name" name="name" class="form-input" placeholder="e.g. Alex Smith" required>
          </div>

          <div class="form-group">
            <label for="contact-email" class="form-label">Your Email Address</label>
            <input type="email" id="contact-email" name="email" class="form-input" placeholder="alex@example.com" required>
          </div>

          <div class="form-group">
            <label for="contact-message" class="form-label">Message Details</label>
            <textarea id="contact-message" name="message" rows="5" class="form-textarea" placeholder="Please provide specific details..." required></textarea>
          </div>

          <!-- Live Form Status Announcement Region -->
          <div id="contactFormStatus" class="form-status-region" aria-live="polite" style="margin-bottom: 1rem;"></div>

          <button type="submit" class="btn" style="width: 100%; font-size: 1.05rem; padding: 0.9rem;">
            Send Message &rarr;
          </button>
        </form>
      </div>
    </div>
  </div>
  `;

  return {
    title: `Contact Us – Panda Express Coupons Support & Inquiries`,
    description: `Contact the editorial desk at Panda Express Coupons. Submit new promo codes, report broken discounts, ask nutrition questions, and get quick email responses.`,
    canonicalPath: '/contact-us/',
    content,
    breadcrumbs
  };
}

module.exports = renderContact;
