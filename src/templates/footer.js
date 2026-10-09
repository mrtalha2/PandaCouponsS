/**
 * Footer Component
 * Black background, full navigation links, spam-safe mailto link, disclaimers
 */
const config = require('../../data/site.config');

function renderFooter() {
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-top">
        <!-- Site Summary -->
        <div class="footer-brand">
          <div class="footer-brand-title">${config.siteName}</div>
          <p style="color: #D1D5DB; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            Your independent guide to reported promo codes, family meal discounts, official rewards hacks, and live nutrition tracking for Panda Express orders.
          </p>
          <div style="font-size: 0.88rem;">
            <strong>Contact:</strong><br>
            <!-- Support Email -->
            <a href="mailto:${config.contactEmail}" class="footer-contact-link">
              ${config.contactEmail}
            </a>
          </div>
          
          ${(() => {
            const validSocial = (config.socialLinks || []).filter(link => {
              try {
                const u = new URL(link.url);
                return (u.pathname !== '' && u.pathname !== '/') || u.search.length > 0;
              } catch {
                return false;
              }
            });
            if (validSocial.length === 0) return '';
            return `
              <div class="social-links" aria-label="Social media links">
                ${validSocial.map(s => `<a href="${s.url}" class="social-icon-btn" aria-label="${s.platform}" target="_blank" rel="noopener noreferrer">${s.icon}</a>`).join('')}
              </div>
            `;
          })()}
        </div>

        <!-- Quick Navigation -->
        <div>
          <div class="footer-col-title" style="color: #FFFFFF; font-size: 1.05rem; font-weight: 700; margin-bottom: 0.75rem;">Navigation</div>
          <ul class="footer-links-list">
            <li><a href="/">Home Coupons</a></li>
            <li><a href="/panda-express-savings-calculator/">Savings Calculator</a></li>
            <li><a href="/panda-express-menu/">Panda Express Menu</a></li>
            <li><a href="/panda-express-nutrition/">Nutrition Calculator</a></li>
            <li><a href="/panda-express-orange-chicken/">Orange Chicken Guide</a></li>
            <li><a href="/beijing-beef/">Beijing Beef Guide</a></li>
            <li><a href="/panda-express-grilled-teriyaki/">Grilled Teriyaki Guide</a></li>
            <li><a href="/panda-express-cream-cheese/">Cream Cheese Rangoon Guide</a></li>
            <li><a href="/panda-express-black-pepper-steak/">Black Pepper Steak Guide</a></li>
            <li><a href="/panda-express-sweet-sour-chicken/">Sweet &amp; Sour Chicken Guide</a></li>
            <li><a href="/panda-express-string-bean-chicken/">String Bean Chicken Guide</a></li>
            <li><a href="/panda-express-chow-mein/">Chow Mein Guide</a></li>
          </ul>
        </div>

        <!-- Legal & Contact -->
        <div>
          <div class="footer-col-title" style="color: #FFFFFF; font-size: 1.05rem; font-weight: 700; margin-bottom: 0.75rem;">Information</div>
          <ul class="footer-links-list">
            <li><a href="/about-us/">About Us</a></li>
            <li><a href="/contact-us/">Contact Us</a></li>
            <li><a href="/disclaimer/">Disclaimer & Trademarks</a></li>
            <li><a href="/privacy-policy/">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© <span class="js-current-year">${config.currentYear}</span> ${config.siteName}. All rights reserved.</p>
        <p class="footer-disclaimer-text">
          ${config.independenceDisclaimer}
        </p>
      </div>
    </div>
  </footer>
  `;
}

module.exports = renderFooter;
