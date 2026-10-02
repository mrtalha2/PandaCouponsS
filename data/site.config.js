/**
 * Master Site Configuration
 * 
 * Edit your site details, colors, social links, and domain here.
 * All pages automatically use these values.
 */
module.exports = {
  SITE_TIMEZONE: 'America/Los_Angeles',
  // Site Identity
  siteName: "Panda Express Coupons",
  siteTagline: "Verified Coupon Codes, Menu Prices & Nutrition Guides",
  domain: "https://pandacoupons.org",
  // Note: domain mailbox (help@pandacoupons.org) must be provisioned on mail server
  contactEmail: "help@pandacoupons.org",
  // TODO: replace with real Formspree form ID
  formEndpoint: "https://formspree.io/f/placeholder",
  get currentYear() {
    return new Date().getFullYear();
  },
  get currentMonth() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[new Date().getMonth()];
  },
  get currentMonthYear() {
    return `${this.currentMonth} ${this.currentYear}`;
  },

  // Branding & Colors
  // Matches authentic brand guidelines and fallback specifications
  colors: {
    primaryRed: "#C8102E",
    primaryRedHover: "#A50D26",
    black: "#0B0B0B",
    deepBlack: "#0B0B0B",
    bodyText: "#1F242E",
    white: "#FFFFFF",
    softBackground: "#F9F8F6",
    warmCream: "#FFF8F0",
    accentGold: "#F5B301",
    borders: "#E5E7EB",
    
    // Coupon Status Badges
    statusActiveText: "#15803D",
    statusActiveBg: "#DCFCE7",
    statusCheckAppText: "#B45309",
    statusCheckAppBg: "#FEF3C7",
    statusUnverifiedText: "#4B5563",
    statusUnverifiedBg: "#F3F4F6",
    statusExpiredText: "#B91C1C",
    statusExpiredBg: "#FEE2E2"
  },

  // Navigation Links
  navLinks: [
    { label: "Home", url: "/" },
    { label: "Nutrition Calculator", url: "/panda-express-nutrition/" },
    { label: "Panda Express Menu", url: "/panda-express-menu/" },
    { label: "Orange Chicken", url: "/panda-express-orange-chicken/" },
    { label: "Beijing Beef", url: "/beijing-beef/" },
    { label: "Contact Us", url: "/contact-us/" },
    { label: "About Us", url: "/about-us/" }
  ],

  // Footer Navigation Links
  footerLinks: [
    { label: "Home", url: "/" },
    { label: "Menu", url: "/panda-express-menu/" },
    { label: "Nutrition Calculator", url: "/panda-express-nutrition/" },
    { label: "Contact Us", url: "/contact-us/" },
    { label: "About Us", url: "/about-us/" },
    { label: "Disclaimer", url: "/disclaimer/" },
    { label: "Privacy Policy", url: "/privacy-policy/" }
  ],

  // Social Links (Placeholders)
  socialLinks: [
    { platform: "X / Twitter", url: "https://twitter.com", icon: "twitter" },
    { platform: "Facebook", url: "https://facebook.com", icon: "facebook" },
    { platform: "Instagram", url: "https://instagram.com", icon: "instagram" },
    { platform: "Pinterest", url: "https://pinterest.com", icon: "pinterest" }
  ],

  // Legal & Disclaimer
  independenceDisclaimer: "Panda Express Coupons is an independent website and is not affiliated with, endorsed by, or sponsored by Panda Express or Panda Restaurant Group."
};
