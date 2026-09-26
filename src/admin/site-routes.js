/**
 * Site Routes Registry Helper
 * Dynamically discovers and exports all internal navigable site routes
 * for the Admin link picker.
 */

const path = require('path');
const fs = require('fs');

function getSiteRoutes() {
  const routes = [
    { title: '🏠 Homepage', url: '/' },
    { title: '📖 Menu Prices & Directory', url: '/panda-express-menu/' },
    { title: '🥗 Nutrition Calculator & Explorer', url: '/panda-express-nutrition/' }
  ];

  // Dynamic dishes from data/dishes.json
  try {
    const dishesPath = path.join(__dirname, '../../data/dishes.json');
    if (fs.existsSync(dishesPath)) {
      const dishes = JSON.parse(fs.readFileSync(dishesPath, 'utf8'));
      if (Array.isArray(dishes)) {
        dishes.forEach(d => {
          routes.push({
            title: `🍽️ ${d.name} Dish Guide`,
            url: `/${d.slug}/`
          });
        });
      }
    }
  } catch (e) {}

  // Informational & Policy Pages
  routes.push(
    { title: '🏢 About Us', url: '/about-us/' },
    { title: '✉️ Contact Us', url: '/contact-us/' },
    { title: '⚖️ Disclaimer & Terms', url: '/disclaimer/' },
    { title: '🔒 Privacy Policy', url: '/privacy-policy/' }
  );

  return routes;
}

module.exports = {
  getSiteRoutes
};
