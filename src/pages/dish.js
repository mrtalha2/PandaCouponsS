const fs = require('fs');
const path = require('path');

const config = require('../../data/site.config');

const nutritionMaster = require('../../data/nutrition-master.json');

function renderDish(dishData) {
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

  const isOrangeChicken = dishData.slug.includes('orange-chicken');
  const pageKey = isOrangeChicken ? 'orange-chicken' : (dishData.slug.includes('beijing-beef') ? 'beijing-beef' : dishData.slug);
  const dishBlocks = pageBlocks[pageKey] || [];
  const dishGuideBlock = dishBlocks.find(b => b.type === 'dish-guide');
  const dishOverrides = adminContent[pageKey] || {};

  const dishTitle = dishGuideBlock?.title || dishOverrides.title || dishData.name;
  const dishSubtitle = dishGuideBlock?.subtitle || dishOverrides.subtitle || 'Calories, complete nutrition facts, health evaluation, and smart coupon ordering hacks.';
  const dishIntro = dishGuideBlock?.intro || dishOverrides.intro || dishData.intro;

  const nutritionItem = (nutritionMaster.items || []).find(i => i.id === dishData.nutritionId || i.id === dishData.slug) || {
    calories: 0,
    totalFat: 0,
    saturatedFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbs: 0,
    dietaryFiber: 0,
    sugars: 0,
    protein: 0,
    servingSize: '1 Serving'
  };

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Menu", url: "/panda-express-menu/" },
    { label: dishTitle, url: `/${dishData.slug}/` }
  ];

  const dishPhoto = isOrangeChicken ? '/public/images/orange-chicken.jpg' : '/public/images/beijing-beef.jpg';
  const relatedPhoto = isOrangeChicken ? '/public/images/beijing-beef.jpg' : '/public/images/orange-chicken.jpg';
  const dishWebp800 = isOrangeChicken ? '/public/images/optimized/orange-chicken-800.webp' : '/public/images/optimized/beijing-beef-800.webp';
  const relatedWebp800 = isOrangeChicken ? '/public/images/optimized/beijing-beef-800.webp' : '/public/images/optimized/orange-chicken-800.webp';

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": dishData.faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Panda Express ${dishTitle}: Calories, Nutrition & Smart Ordering Guide`,
    "description": dishData.metaDescription || dishSubtitle,
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Panda Coupons Editorial Team",
      "url": config.domain
    },
    "publisher": {
      "@type": "Organization",
      "name": "Panda Coupons Editorial Team",
      "url": config.domain
    }
  };

  const menuItemSchema = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    "name": `Panda Express ${dishData.name}`,
    "description": dishData.intro,
    "image": `${config.domain}${dishPhoto}`,
    "nutrition": {
      "@type": "NutritionInformation",
      "servingSize": `${nutritionItem.servingSize} oz`,
      "calories": `${nutritionItem.calories} calories`,
      "proteinContent": `${nutritionItem.protein}g`,
      "fatContent": `${nutritionItem.totalFat}g`,
      "saturatedFatContent": `${nutritionItem.saturatedFat}g`,
      "carbohydrateContent": `${nutritionItem.totalCarbs}g`,
      "fiberContent": `${nutritionItem.dietaryFiber}g`,
      "sugarContent": `${nutritionItem.sugars}g`,
      "sodiumContent": `${nutritionItem.sodium}mg`,
      "cholesterolContent": `${nutritionItem.cholesterol}mg`
    }
  };

  const content = `
  <!-- Full-Bleed Dish Hero Banner -->
  <section class="dish-hero-banner" style="background-image: -webkit-image-set(url('${dishWebp800}') 1x, url('${dishPhoto}') 1x); background-image: image-set(url('${dishWebp800}') type('image/webp'), url('${dishPhoto}') type('image/jpeg'));">
    <div class="dish-hero-mask"></div>
    <div class="container relative-z">
      <div class="dish-hero-kicker">WOK SPECIALTY GUIDE</div>
      <h1 class="dish-hero-title">${dishTitle}</h1>
      <p class="dish-hero-subtitle">
        Reviewed {{MONTH_YEAR}} by the Panda Coupons Editorial Team • ${dishSubtitle}
      </p>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <a href="/#coupon-section" class="btn btn-hero-primary">
          <span>Apply 20% Off Coupon</span>
        </a>
        <a href="/panda-express-nutrition/" class="btn btn-hero-secondary">
          <span>Nutrition Calculator</span>
        </a>
      </div>
    </div>
  </section>

  <div class="container" style="padding-top: 2.5rem;">
    <!-- Main Content & Floating Nutrition Card -->
    <div class="dish-content-grid">
      <div class="dish-main-text">
        <h2 style="margin-top: 0;">About Panda Express ${dishTitle}</h2>
        <p style="font-size: 1.12rem; line-height: 1.75; margin-bottom: 1.5rem; font-weight: 500;">
          ${dishIntro}
        </p>

        <!-- Large Photo Presentation Card -->
        <div class="dish-photo-card" style="margin-bottom: 2rem;">
          <picture>
            <source type="image/webp" srcset="${dishWebp800}">
            <img src="${dishPhoto}" 
                 alt="Freshly prepared Panda Express ${dishData.name}" 
                 width="800" 
                 height="533" 
                 loading="lazy" 
                 decoding="async" 
                 class="dish-card-img">
          </picture>
        </div>

        <!-- Health Assessment Section -->
        <section class="section-border" style="padding: 2rem 0;">
          <h2>${dishData.isHealthy.headline}</h2>
          <p style="font-size: 1.05rem; line-height: 1.75; font-weight: 500;">
            ${dishData.isHealthy.content}
          </p>
        </section>

        <!-- How to Order for Less -->
        <section class="section-border" style="padding: 2rem 0;">
          <h2>${dishData.howToOrderForLess.headline}</h2>
          <ul class="checklist" style="margin-top: 1.25rem;">
            ${dishData.howToOrderForLess.tips.map((tip) => {
              const colonIdx = tip.indexOf(':');
              if (colonIdx !== -1) {
                const title = tip.substring(0, colonIdx);
                const desc = tip.substring(colonIdx + 1);
                return `<li><strong>${title}:</strong><span>${desc.trim()}</span></li>`;
              }
              return `<li>${tip}</li>`;
            }).join('')}
          </ul>
          <div style="margin-top: 1.75rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="/#coupon-section" class="btn">
              <span>🎟️ View Current Coupons &amp; Copy Code</span>
            </a>
            <a href="/panda-express-savings-calculator/" class="btn btn-secondary">
              <span>🧮 Group Savings Calculator</span>
            </a>
          </div>
        </section>

        <!-- Expert Ordering Tips -->
        <section class="section-border" style="padding: 2rem 0;">
          <h2>Expert Ordering &amp; Nutrition Tips</h2>
          <div class="card-grid" style="grid-template-columns: 1fr; gap: 1rem;">
            ${dishData.orderingTips.map((tip) => `
              <div class="feature-lift-card" style="padding: 1.35rem; border-radius: 12px;">
                <h3 style="font-size: 1.12rem; color: #C8102E; margin-top: 0; margin-bottom: 0.4rem; font-weight: 800;">${tip.title}</h3>
                <p style="margin-bottom: 0; font-size: 0.98rem; line-height: 1.6; font-weight: 500;">${tip.detail}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </div>

      <!-- Floating Sticky Nutrition Panel -->
      <aside class="dish-sidebar-col">
        <div class="nutrition-panel" aria-label="Nutrition Facts for ${dishData.name}">
          <div class="nutrition-panel-title">Nutrition Facts</div>
          <div class="nutrition-serving">${nutritionItem.servingSize ? (typeof nutritionItem.servingSize === 'number' ? `Serving Size: ${nutritionItem.servingSize} oz` : nutritionItem.servingSize) : '1 Serving'}</div>
          
          <div class="nutrition-calories-row">
            <div>
              <div style="font-size: 0.85rem; font-weight: 700;">Amount Per Serving</div>
              <div style="font-size: 1.4rem; font-weight: 900;">Calories</div>
            </div>
            <div class="nutrition-cal-number">${nutritionItem.calories}</div>
          </div>

          <div class="nutrition-row bold">
            <span>Total Fat ${nutritionItem.totalFat}g</span>
            <span>${Math.round((nutritionItem.totalFat / 78) * 100)}%</span>
          </div>
          <div class="nutrition-row indent">
            <span>Saturated Fat ${nutritionItem.saturatedFat}g</span>
            <span>${Math.round((nutritionItem.saturatedFat / 20) * 100)}%</span>
          </div>
          <div class="nutrition-row bold">
            <span>Cholesterol ${nutritionItem.cholesterol}mg</span>
            <span>${Math.round((nutritionItem.cholesterol / 300) * 100)}%</span>
          </div>
          <div class="nutrition-row bold">
            <span>Sodium ${nutritionItem.sodium}mg</span>
            <span>${Math.round((nutritionItem.sodium / 2300) * 100)}%</span>
          </div>
          <div class="nutrition-row bold">
            <span>Total Carbohydrate ${nutritionItem.totalCarbs}g</span>
            <span>${Math.round((nutritionItem.totalCarbs / 275) * 100)}%</span>
          </div>
          <div class="nutrition-row indent">
            <span>Dietary Fiber ${nutritionItem.dietaryFiber}g</span>
            <span>${Math.round((nutritionItem.dietaryFiber / 28) * 100)}%</span>
          </div>
          <div class="nutrition-row indent">
            <span>Total Sugars ${nutritionItem.sugars}g</span>
            <span>-</span>
          </div>
          <div class="nutrition-row bold" style="border-bottom: 4px solid #000000; padding-top: 0.4rem; padding-bottom: 0.4rem;">
            <span>Protein ${nutritionItem.protein}g</span>
            <span>${Math.round((nutritionItem.protein / 50) * 100)}%</span>
          </div>
          <div class="nutrition-panel-footnote" style="margin-top: 0.75rem; font-size: 0.78rem; color: #4B5563; line-height: 1.45;">
            * Nutrition source: official Panda Express nutrition guide, last checked {{MONTH_YEAR}}. Values vary by location and preparation.
          </div>
        </div>
      </aside>
    </div>

    <!-- Related Dishes Row -->
    <section class="section-border" style="padding: 3rem 0; margin-top: 2rem;">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">EXPLORE MORE</span>
        <h2>Looking for Other Panda Express Classics?</h2>
      </div>

      <div style="max-width: 600px; margin: 0 auto;">
        <article class="menu-food-card" style="display: flex; flex-direction: column;">
          <div class="card-img-wrapper" style="height: 240px; overflow: hidden; border-radius: 12px 12px 0 0;">
            <picture>
              <source type="image/webp" srcset="${relatedWebp800}">
              <img src="${relatedPhoto}" alt="Panda Express ${dishData.relatedDish.name}" width="600" height="400" loading="lazy" decoding="async" class="zoom-on-hover-img" style="width:100%;height:100%;object-fit:cover;">
            </picture>
          </div>
          <div class="menu-card" style="padding: 1.5rem; border-top: none; border-radius: 0 0 12px 12px;">
            <h3 style="margin-top:0;">${dishData.relatedDish.name}</h3>
            <p style="font-size: 0.95rem;">${dishData.relatedDish.tagline}</p>
            <a href="${dishData.relatedDish.url}" class="btn" style="width: 100%; justify-content: center;">
              Read Full ${dishData.relatedDish.name} Guide &rarr;
            </a>
          </div>
        </article>
      </div>
    </section>

    <!-- Dish FAQ -->
    <section class="section-border" style="padding: 2.5rem 0; max-width: 850px; margin: 0 auto;">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">FAQ</span>
        <h2>Frequently Asked Questions About ${dishData.name}</h2>
      </div>
      <div class="faq-accordion">
        ${dishData.faq.map((item, idx) => `
          <div class="faq-item ${idx === 0 ? 'is-open' : ''}">
            <button type="button" class="faq-trigger" aria-expanded="${idx === 0 ? 'true' : 'false'}">
              <span>${item.question}</span>
              <span class="faq-icon" aria-hidden="true">+</span>
            </button>
            <div class="faq-content">
              <p>${item.answer}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  </div>
  `;

  return {
    title: dishData.metaTitle,
    description: dishData.metaDescription,
    canonicalPath: `/${dishData.slug}/`,
    content,
    breadcrumbs,
    schemaJson: [menuItemSchema, faqSchema, articleSchema]
  };
}

module.exports = renderDish;
