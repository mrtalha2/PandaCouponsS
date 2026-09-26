/**
 * Admin Preview Engine (Phase 17i)
 * Dynamically renders pages in memory with pending admin overrides without rebuilding dist/.
 */

const renderLayout = require('../templates/layout');
const renderHome = require('../pages/home');
const renderMenu = require('../pages/menu');
const renderNutrition = require('../pages/nutrition');
const renderDish = require('../pages/dish');
const dishesData = require('../../data/dishes.json');
const renderAbout = require('../pages/about');
const renderContact = require('../pages/contact');
const renderPrivacy = require('../pages/privacy');
const renderDisclaimer = require('../pages/disclaimer');

function renderPreview(pageKey) {
  let pageResult = null;

  switch (pageKey.toLowerCase()) {
    case 'home':
    case 'index':
      pageResult = renderHome();
      break;
    case 'menu':
    case 'panda-express-menu':
      pageResult = renderMenu();
      break;
    case 'nutrition':
    case 'panda-express-nutrition':
      pageResult = renderNutrition();
      break;
    case 'orange-chicken':
    case 'panda-express-orange-chicken':
      pageResult = renderDish(dishesData[0]);
      break;
    case 'beijing-beef':
      pageResult = renderDish(dishesData[1]);
      break;
    case 'about':
    case 'about-us':
      pageResult = renderAbout();
      break;
    case 'contact':
    case 'contact-us':
      pageResult = renderContact();
      break;
    case 'privacy':
    case 'privacy-policy':
      pageResult = renderPrivacy();
      break;
    case 'disclaimer':
      pageResult = renderDisclaimer();
      break;
    default:
      return null;
  }

  // Inject a floating admin preview notice bar into the rendered HTML
  const previewBanner = `
    <div style="position: fixed; top: 0; left: 0; right: 0; height: 38px; background: #C8102E; color: #FFF; font-family: system-ui, sans-serif; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; z-index: 999999; box-shadow: 0 2px 10px rgba(0,0,0,0.4);">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span>👁️ ADMIN PREVIEW MODE</span>
        <span style="font-weight: 400; opacity: 0.85;">(Rendering pending in-memory overrides — Live dist/ untouched)</span>
      </div>
      <div>
        <a href="/admin/pages" style="color: #FFF; text-decoration: underline; margin-right: 1rem;">Back to Editor</a>
        <a href="/admin" style="color: #FFF; text-decoration: underline;">Dashboard</a>
      </div>
    </div>
    <div style="height: 38px;"></div>
  `;

  // Prepend banner to page content
  const previewPageResult = {
    ...pageResult,
    content: previewBanner + pageResult.content
  };

  return renderLayout(previewPageResult);
}

module.exports = {
  renderPreview
};
