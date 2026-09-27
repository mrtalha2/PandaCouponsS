/**
 * Header Component
 * Transparent over hero, transitions to glassmorphic black with blur on scroll
 * Includes red pill "Get Codes" CTA button
 */
const config = require('../../data/site.config');

function renderHeader(currentPath = '/') {
  return `
  <header class="site-header" id="siteHeader" role="banner">
    <div class="container header-inner">
      <!-- Brand Logo -->
      <a href="/" class="brand-logo" aria-label="${config.siteName} Homepage">
        <svg class="brand-icon" viewBox="0 0 100 100" width="40" height="40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="50" cy="50" r="48" fill="${config.colors.primaryRed}" />
          <circle cx="25" cy="27" r="15" fill="#0B0B0C" />
          <circle cx="75" cy="27" r="15" fill="#0B0B0C" />
          <path d="M20 54 C20 34 33 22 50 22 C67 22 80 34 80 54 C80 75 67 84 50 84 C33 84 20 75 20 54 Z" fill="#FFFFFF" />
          <ellipse cx="36.5" cy="48" rx="9.5" ry="13" fill="#0B0B0C" transform="rotate(-18 36.5 48)" />
          <ellipse cx="63.5" cy="48" rx="9.5" ry="13" fill="#0B0B0C" transform="rotate(18 63.5 48)" />
          <circle cx="38.5" cy="45.5" r="3.2" fill="#FFFFFF" />
          <circle cx="61.5" cy="45.5" r="3.2" fill="#FFFFFF" />
          <circle cx="36" cy="49" r="1.3" fill="#FFFFFF" />
          <circle cx="64" cy="49" r="1.3" fill="#FFFFFF" />
          <path d="M44 59 C46 56.5 54 56.5 56 59 C56 63.5 44 63.5 44 59 Z" fill="#0B0B0C" />
          <path d="M45 66 Q50 70.5 55 66" stroke="#0B0B0C" stroke-width="2.4" stroke-linecap="round" fill="none" />
        </svg>
        <div class="brand-wordmark">
          <span class="brand-name-primary">PANDA</span>
          <span class="brand-name-secondary">COUPONS</span>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <nav class="nav-desktop" aria-label="Main Navigation">
        <ul class="nav-list">
          <li>
            <a href="/" class="nav-link ${currentPath === '/' ? 'is-current' : ''}">Home</a>
          </li>
          <li>
            <a href="/panda-express-savings-calculator/" class="nav-link ${currentPath.includes('savings-calculator') ? 'is-current' : ''}">Savings Calculator</a>
          </li>
          <li>
            <a href="/panda-express-menu/" class="nav-link ${currentPath.includes('menu') ? 'is-current' : ''}">Menu</a>
          </li>
          <li>
            <a href="/panda-express-nutrition/" class="nav-link ${currentPath.includes('nutrition') ? 'is-current' : ''}">Nutrition</a>
          </li>
          <li>
            <a href="/panda-express-orange-chicken/" class="nav-link ${currentPath.includes('orange-chicken') ? 'is-current' : ''}">Orange Chicken</a>
          </li>
          <li>
            <a href="/beijing-beef/" class="nav-link ${currentPath.includes('beijing-beef') ? 'is-current' : ''}">Beijing Beef</a>
          </li>
          <li>
            <a href="/about-us/" class="nav-link ${currentPath.includes('about') ? 'is-current' : ''}">About Us</a>
          </li>
          <!-- Red Pill CTA Button -->
          <li>
            <a href="/#coupon-section" class="nav-cta-pill" aria-label="Jump directly to coupon codes">
              <span>🎟️ Get Codes</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Mobile Hamburger Toggle -->
      <button type="button" class="mobile-nav-toggle" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-nav-menu">
        <span aria-hidden="true">☰</span>
      </button>
    </div>

    <!-- Accessible Full-Height Mobile Navigation Drawer Overlay -->
    <div id="mobile-nav-menu" class="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
      <div class="mobile-nav-drawer-header">
        <span class="mobile-nav-drawer-title">Navigation Menu</span>
        <button type="button" id="mobileNavCloseBtn" class="mobile-nav-close-btn" aria-label="Close navigation menu">✕</button>
      </div>
      <ul class="mobile-nav-list">
        <li><a href="/" class="mobile-nav-link ${currentPath === '/' ? 'is-current' : ''}">Home</a></li>
        <li><a href="/#coupon-section" class="mobile-nav-link mobile-nav-cta">🎟️ Get Today's Coupon Codes</a></li>
        <li><a href="/panda-express-savings-calculator/" class="mobile-nav-link ${currentPath.includes('savings-calculator') ? 'is-current' : ''}">🧮 Savings Calculator</a></li>
        <li><a href="/panda-express-nutrition/" class="mobile-nav-link ${currentPath.includes('nutrition') ? 'is-current' : ''}">Nutrition Calculator</a></li>
        <li><a href="/panda-express-menu/" class="mobile-nav-link ${currentPath.includes('menu') ? 'is-current' : ''}">Panda Express Menu</a></li>
        <li><a href="/panda-express-orange-chicken/" class="mobile-nav-link ${currentPath.includes('orange-chicken') ? 'is-current' : ''}">Orange Chicken Guide</a></li>
        <li><a href="/beijing-beef/" class="mobile-nav-link ${currentPath.includes('beijing-beef') ? 'is-current' : ''}">Beijing Beef Guide</a></li>
        <li><a href="/contact-us/" class="mobile-nav-link ${currentPath.includes('contact') ? 'is-current' : ''}">Contact Us</a></li>
        <li><a href="/about-us/" class="mobile-nav-link ${currentPath.includes('about') ? 'is-current' : ''}">About Us</a></li>
      </ul>
    </div>
  </header>
  `;
}

module.exports = renderHeader;
