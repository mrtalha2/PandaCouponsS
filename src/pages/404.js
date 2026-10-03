/**
 * Custom 404 Error Page Generator (Expanded & Useful)
 * Welcoming message, direct coupon CTA, and shortcuts to the top 5 site resources
 */
function render404() {
  const content = `
  <section class="subpage-photo-banner" style="min-height: 420px; display: flex; align-items: center;">
    <div class="subpage-banner-mask"></div>
    <div class="container text-center relative-z">
      <div class="dish-hero-kicker" style="color: #F5B301;">ERROR 404 — PAGE NOT FOUND</div>
      <h1 class="dish-hero-title" style="font-size: clamp(2.2rem, 5vw, 3.5rem); margin-bottom: 1rem;">
        Looks Like This Order Got Swapped!
      </h1>
      <p class="dish-hero-subtitle" style="max-width: 680px; margin: 0 auto 2rem auto;">
        The page or recipe link you are looking for has moved, expired, or doesn't exist. Don't worry—our verified discounts, nutrition tools, and full menu guides are fresh and ready for you.
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <a href="/#coupon-section" class="btn btn-hero-primary" style="font-size: 1.1rem; padding: 0.85rem 1.75rem;">
          <span>🎟️ View All Coupon Codes &rarr;</span>
        </a>
      </div>
    </div>
  </section>

  <div class="container" style="padding-top: 3.5rem; padding-bottom: 4.5rem; max-width: 960px;">
    <div style="text-align: center; margin-bottom: 2.5rem;">
      <span class="kicker-tag kicker-red">HELPFUL SHORTCUTS</span>
      <h2 style="font-size: 1.8rem; margin-top: 0.35rem;">Popular Pages to Get You Back on Track</h2>
      <p style="max-width: 620px; margin: 0 auto;">
        Here are the five most frequently visited sections where you can claim discounts, view nutrition facts, or browse current menu items:
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
      <!-- Page 1: Home Coupons -->
      <a href="/#coupon-section" class="menu-card" style="display: block; padding: 1.5rem; border-radius: 12px; border: 1px solid #E5E7EB; text-decoration: none; transition: transform 0.2s ease, box-shadow 0.2s ease;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎟️</div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Verified Coupon Codes</h3>
        <p style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 0;">
          Browse tested promo codes, 20% off survey discounts, and family feast savings updated daily.
        </p>
      </a>

      <!-- Page 2: Menu & Prices -->
      <a href="/panda-express-menu/" class="menu-card" style="display: block; padding: 1.5rem; border-radius: 12px; border: 1px solid #E5E7EB; text-decoration: none; transition: transform 0.2s ease, box-shadow 0.2s ease;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🥢</div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Official Menu &amp; Prices</h3>
        <p style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 0;">
          Explore the complete {{YEAR}} Panda Express menu with hi-res photos, calorie counts, and current pricing.
        </p>
      </a>

      <!-- Page 3: Nutrition Calculator -->
      <a href="/panda-express-nutrition/" class="menu-card" style="display: block; padding: 1.5rem; border-radius: 12px; border: 1px solid #E5E7EB; text-decoration: none; transition: transform 0.2s ease, box-shadow 0.2s ease;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🥗</div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Nutrition &amp; Macro Calculator</h3>
        <p style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 0;">
          Calculate total calories, protein, carbs, and fat for custom Bowls, Plates, and allergen-free meals.
        </p>
      </a>

      <!-- Page 4: Orange Chicken Guide -->
      <a href="/panda-express-orange-chicken/" class="menu-card" style="display: block; padding: 1.5rem; border-radius: 12px; border: 1px solid #E5E7EB; text-decoration: none; transition: transform 0.2s ease, box-shadow 0.2s ease;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🍗</div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">The Original Orange Chicken</h3>
        <p style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 0;">
          Read the complete nutrition breakdown, allergen details, and ordering hacks for Panda's #1 dish.
        </p>
      </a>

      <!-- Page 5: Beijing Beef Guide -->
      <a href="/beijing-beef/" class="menu-card" style="display: block; padding: 1.5rem; border-radius: 12px; border: 1px solid #E5E7EB; text-decoration: none; transition: transform 0.2s ease, box-shadow 0.2s ease;">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🥩</div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Beijing Beef Specialty Guide</h3>
        <p style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 0;">
          Crispy beef strips, tangy sweet glaze, macro statistics, and smart entree pairing strategies.
        </p>
      </a>
    </div>
  </div>
  `;

  return {
    title: `Page Not Found (404) – Panda Express Coupons Directory`,
    description: `The page you requested could not be found. Explore verified Panda Express coupon codes, full menu prices, and the interactive meal nutrition calculator.`,
    canonicalPath: '/404.html',
    isNoindex: true,
    content
  };
}

module.exports = render404;
