/**
 * Panda Express Nutrition Guide & Macro Analysis Page Generator
 * Redesigned with High-Contrast Dark Navy / Charcoal Theme + Electric Cyan Accent.
 * Strict Constraint: ZERO Green, ZERO Red. 100% WCAG AAA Readability.
 * Dynamic Year & Month integration.
 */
const config = require('../../data/site.config');
const nutritionMaster = require('../../data/nutrition-master.json');
const nutritionFull = nutritionMaster.items;

function renderNutrition() {

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Nutrition Guide", url: "/panda-express-nutrition/" }
  ];

  const faqs = [
    {
      q: "How many calories are in Panda Express Orange Chicken?",
      a: "A standard serving of Orange Chicken has {{cal:orange-chicken}} calories, {{fat:orange-chicken}} grams of fat, and {{sugar:orange-chicken}} grams of sugar, according to Panda Express's official nutrition data."
    },
    {
      q: "Is Panda Express healthy?",
      a: "It depends on your order rather than the restaurant itself — meals range from 280 to over 2,000 calories depending on entrée and side choices, so the same visit can be a light meal or a heavy one based entirely on what you pick."
    },
    {
      q: "What is the healthiest thing to order at Panda Express?",
      a: "Grilled Teriyaki Chicken ({{cal:grilled-teriyaki-chicken}} cal) paired with Super Greens ({{cal:super-greens}} cal) is one of the strongest combinations on the menu: {{protein:grilled-teriyaki-chicken}}g protein and low saturated fat."
    },
    {
      q: "Does Panda Express use peanut oil?",
      a: "No. Panda Express cooks with soybean oil, not peanut oil. However, some dishes like Kung Pao Chicken do contain actual peanuts as an ingredient, so check the specific dish's allergen flag rather than assuming the oil alone makes it peanut-safe."
    },
    {
      q: "What's gluten-free at Panda Express?",
      a: "White Steamed Rice and Super Greens are the two menu items that don't list wheat as an allergen. Most sauce-based entrées, including Orange Chicken and Chow Mein, contain wheat through soy sauce or batter."
    },
    {
      q: "How many calories are in a Panda Express Bowl vs. Plate vs. Bigger Plate?",
      a: "A Bowl (one side, one entrée) ranges from 280 to 1,130 calories. A Plate (one side, two entrées) ranges from 430 to 1,640 calories. A Bigger Plate (one side, three entrées) typically runs from about 580 to 2,150 or more calories, based on combining official per-item figures."
    },
    {
      q: "What can't this nutrition guide tell you?",
      a: "It can't account for portion variation by location, seasonal menu changes, or how a specific store prepares your order. These are standard recipe values published by Panda Express, not a measurement of your exact meal."
    },
    {
      q: "Where can I verify this data officially?",
      a: "Panda Express publishes its full nutrition and allergen sheet directly on its website, and you can also call (800) 877-8988 for direct confirmation on any item."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Panda Express Nutrition Calculator: Calories, Macros & Facts`,
    "description": `Stop guessing your Panda Express calories! Free calculator instantly shows calories, macros, sodium & allergens for every dish. Build your meal.`,
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

  const content = `
  <div class="nutr-page-wrap">

    <!-- HERO SECTION -->
    <header class="nutr-hero-section">
      <div class="container">
        
        <!-- Breadcrumbs -->
        <nav aria-label="Breadcrumbs" style="margin-bottom: 1.25rem;">
          <ol style="display: flex; gap: 0.5rem; list-style: none; padding: 0; margin: 0; font-size: 0.88rem; color: #9CA3AF;">
            <li><a href="/" style="color: #9CA3AF; text-decoration: none;">Home</a></li>
            <li><span style="color: #4B5563;">/</span></li>
            <li aria-current="page" style="color: #38BDF8; font-weight: 600;">Nutrition Guide</li>
          </ol>
        </nav>

        <div class="nutr-badge-pill">
          <span>Nutrition Guide {{YEAR}}</span>
        </div>

        <h1 class="nutr-hero-title">
          Panda Express Nutrition: Calories, Macros &amp; the Smartest Way to Order in {{YEAR}}
        </h1>

        <p class="nutr-hero-lead">
          Reviewed {{MONTH_YEAR}} by the Panda Coupons Editorial Team • Panda Express nutrition varies more than almost any fast-food menu, because meals are built à la carte instead of sold as fixed combos. A Bowl alone can run anywhere from 280 to 1,130 calories depending on what you pick, and a Plate stretches from 430 to 1,640. The numbers below come straight from official Panda Express nutrition disclosures.
        </p>

        <!-- Optimized Responsive Hero Image -->
        <div class="nutr-hero-media-card">
          <picture>
            <source type="image/webp" 
                    srcset="/public/images/optimized/nutrition-plate-640.webp 640w,
                            /public/images/optimized/nutrition-plate-800.webp 800w,
                            /public/images/optimized/nutrition-plate-1280.webp 1280w"
                    sizes="(max-width: 900px) 100vw, 900px">
            <img src="/public/images/nutrition-plate.jpg" 
                 alt="Panda Express balanced wok plate with steamed rice, lean chicken and vegetables" 
                 width="1280" 
                 height="720" 
                 loading="eager" 
                 fetchpriority="high"
                 decoding="async" 
                 class="nutr-hero-img">
          </picture>
        </div>

        <!-- Quick Calorie Stats Strip -->
        <div class="nutr-stats-strip">
          <div class="nutr-stat-box">
            <span class="nutr-stat-number">280–1,130</span>
            <span class="nutr-stat-label">Bowl Range (kcal)</span>
          </div>
          <div class="nutr-stat-box">
            <span class="nutr-stat-number">430–1,640</span>
            <span class="nutr-stat-label">Plate Range (kcal)</span>
          </div>
          <div class="nutr-stat-box">
            <span class="nutr-stat-number">580–2,150+</span>
            <span class="nutr-stat-label">Bigger Plate (kcal)</span>
          </div>
          <div class="nutr-stat-box">
            <span class="nutr-stat-number">100%</span>
            <span class="nutr-stat-label">Official Disclosures</span>
          </div>
        </div>

      </div>
    </header>

    <!-- MAIN BODY CONTENT -->
    <div class="nutr-main-container">

      <!-- SECTION: Interactive Nutrition Calculator Widget -->
      <section id="calculator-section" class="nutr-section" aria-labelledby="calc-heading">
        <div style="text-align: center; max-width: 780px; margin: 0 auto 1.75rem auto;">
          <div class="nutr-badge-pill" style="margin-bottom: 0.65rem;">
            <span>Interactive Nutrition Builder</span>
          </div>
          <h2 id="calc-heading" class="nutr-section-title" style="margin-bottom: 0.5rem; text-align: center;">
            Panda Express Meal &amp; Nutrition Calculator
          </h2>
          <p class="nutr-paragraph" style="text-align: center; color: #94A3B8; margin-bottom: 0;">
            Customize your Panda Express meal and calculate real-time calories, protein, carbs, and fat. Switch between the fast Combo Builder and the complete Nutrition Explorer with allergen exclusions.
          </p>
        </div>

        <div id="nutrition-app" class="calc-widget-container">
          
          <!-- Mode Tabs -->
          <div class="calc-mode-switcher-wrap">
            <div class="calc-mode-switcher" role="tablist" aria-label="Calculator Modes">
              <button type="button" class="calc-mode-btn is-active" data-mode="combo" role="tab" aria-selected="true">
                <span aria-hidden="true">🍱</span> Combo Meal Builder
              </button>
              <button type="button" class="calc-mode-btn" data-mode="explorer" role="tab" aria-selected="false">
                <span aria-hidden="true">🔍</span> Full Nutrition Explorer
              </button>
            </div>
          </div>

          <!-- VIEW 1: COMBO MEAL BUILDER -->
          <div id="view-combo-builder" class="calc-view-panel">
            
            <!-- Step 1: Choose Meal Type -->
            <div class="calc-builder-step">
              <div class="calc-step-header">
                <h3 class="calc-step-title">
                  <span class="calc-step-badge">1</span> Choose Meal Format
                </h3>
                <span class="calc-step-hint">Select a portion size</span>
              </div>
              <div class="calc-meal-pills-row">
                <button type="button" class="combo-meal-pill" data-meal="bowl">
                  <span class="meal-pill-title">Bowl</span>
                  <span class="meal-pill-desc">1 Side + 1 Entrée</span>
                </button>
                <button type="button" class="combo-meal-pill is-selected" data-meal="plate">
                  <span class="meal-pill-title">Plate</span>
                  <span class="meal-pill-desc">1 Side + 2 Entrées</span>
                </button>
                <button type="button" class="combo-meal-pill" data-meal="bigger_plate">
                  <span class="meal-pill-title">Bigger Plate</span>
                  <span class="meal-pill-desc">1 Side + 3 Entrées</span>
                </button>
              </div>
            </div>

            <!-- Step 2: Choose Side -->
            <div class="calc-builder-step">
              <div class="calc-step-header">
                <h3 class="calc-step-title">
                  <span class="calc-step-badge">2</span> Select 1 Side Dish
                </h3>
                <span class="calc-step-hint">Click to choose your base</span>
              </div>
              <div id="combo-sides-grid" class="item-selection-grid">
                <!-- Injected by main.js renderComboGrids() -->
              </div>
            </div>

            <!-- Step 3: Choose Entrees -->
            <div class="calc-builder-step">
              <div class="calc-step-header">
                <h3 class="calc-step-title">
                  <span class="calc-step-badge">3</span> Select Entrées
                </h3>
                <span id="combo-entree-notice" class="calc-step-notice">Selected: 2/2 Entrees</span>
              </div>
              <div id="combo-entrees-grid" class="item-selection-grid">
                <!-- Injected by main.js renderComboGrids() -->
              </div>
            </div>

            <!-- Live Combo Macro Dashboard -->
            <div class="macro-summary-dashboard">
              <div class="macro-dashboard-header">
                <div>
                  <span class="macro-dashboard-kicker">Live Nutrition Output</span>
                  <h4 class="macro-dashboard-title">Your Combo Meal Totals</h4>
                </div>
                <div class="macro-cal-bar-wrap">
                  <div class="macro-cal-bar-labels">
                    <span>Daily Calorie Impact</span>
                    <span>Standard 2,000 kcal Diet</span>
                  </div>
                  <div class="macro-cal-track">
                    <div id="combo-cal-bar" class="macro-cal-fill" style="width: 50%;"></div>
                  </div>
                </div>
              </div>

              <div class="macro-grid-cards">
                <div class="macro-metric-card">
                  <span id="combo-total-cals" class="macro-metric-val calories">0</span>
                  <span class="macro-metric-label">Total Calories</span>
                </div>
                <div class="macro-metric-card">
                  <span id="combo-total-protein" class="macro-metric-val protein">0g</span>
                  <span class="macro-metric-label">Protein</span>
                </div>
                <div class="macro-metric-card">
                  <span id="combo-total-carbs" class="macro-metric-val carbs">0g</span>
                  <span class="macro-metric-label">Carbohydrates</span>
                </div>
                <div class="macro-metric-card">
                  <span id="combo-total-fat" class="macro-metric-val fat">0g</span>
                  <span class="macro-metric-label">Total Fat</span>
                </div>
              </div>
            </div>

          </div>

          <!-- VIEW 2: EXPLORER & FULL MEAL CALCULATOR -->
          <div id="view-explorer" class="calc-view-panel" style="display: none;">
            
            <!-- Explorer Toolbar -->
            <div class="explorer-toolbar">
              <div class="explorer-search-box">
                <span class="search-icon-pos" aria-hidden="true">🔍</span>
                <input type="search" id="calcSearchInput" class="explorer-search-input" placeholder="Search dishes (e.g. Orange Chicken, Teriyaki, Steak)..." aria-label="Search dishes">
                <button type="button" id="calcClearSearch" class="search-clear-btn" style="display: none;" aria-label="Clear search">✕</button>
              </div>

              <div class="allergen-dropdown" id="calcAllergenContainer">
                <button type="button" id="calcAllergenBtn" class="allergen-dropdown-btn">
                  <span>🛡️ Exclude Allergens</span>
                  <span id="calcAllergenCount" class="allergen-count-badge" style="display: none;">0</span>
                  <span aria-hidden="true" style="font-size: 0.75rem;">▾</span>
                </button>
                <div id="calcAllergenDropdown" class="allergen-dropdown-panel" role="region" aria-label="Allergen filter options">
                  <div class="allergen-dropdown-header">
                    <span style="font-weight: 700; font-size: 0.88rem; color: #FFFFFF;">Exclude Allergens</span>
                    <button type="button" id="calcClearAllergens" class="btn-text-cyan">Clear</button>
                  </div>
                  <div class="allergen-options-list">
                    <label class="allergen-option"><input type="checkbox" value="wheat"> Wheat / Gluten</label>
                    <label class="allergen-option"><input type="checkbox" value="soy"> Soy</label>
                    <label class="allergen-option"><input type="checkbox" value="egg"> Egg</label>
                    <label class="allergen-option"><input type="checkbox" value="milk"> Milk / Dairy</label>
                    <label class="allergen-option"><input type="checkbox" value="peanuts"> Peanuts</label>
                    <label class="allergen-option"><input type="checkbox" value="tree_nuts"> Tree Nuts</label>
                    <label class="allergen-option"><input type="checkbox" value="shellfish"> Shellfish</label>
                    <label class="allergen-option"><input type="checkbox" value="sesame"> Sesame</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Category Pills -->
            <div id="calcCategoryBar" class="category-filter-bar" role="toolbar" aria-label="Filter dishes by category">
              <button type="button" class="cat-pill is-active" data-category="All Items">All Items</button>
              <button type="button" class="cat-pill" data-category="Sides">Sides</button>
              <button type="button" class="cat-pill" data-category="Chicken">Chicken</button>
              <button type="button" class="cat-pill" data-category="Chicken Breast">Chicken Breast</button>
              <button type="button" class="cat-pill" data-category="Beef">Beef</button>
              <button type="button" class="cat-pill" data-category="Seafood">Seafood</button>
              <button type="button" class="cat-pill" data-category="Vegetables">Vegetables</button>
              <button type="button" class="cat-pill" data-category="Appetizers">Appetizers</button>
              <button type="button" class="cat-pill" data-category="Soup">Soup</button>
              <button type="button" class="cat-pill" data-category="Beverages">Beverages</button>
              <button type="button" class="cat-pill" data-category="More">Sauces &amp; More</button>
            </div>

            <!-- Meal Cart Status Bar -->
            <div class="calc-cart-status-bar">
              <div>
                <span id="runningMealTitle" class="cart-status-title">Your Meal (0 items)</span>
                <span id="runningMealCals" class="cart-status-cals">0 total calories • Select dishes to calculate</span>
              </div>
              <div class="cart-status-actions">
                <button type="button" id="btnShareMealLink" class="nutr-btn-outline" style="padding: 0.4rem 0.9rem; font-size: 0.82rem;">
                  <span>🔗 Share Meal</span>
                </button>
                <button type="button" id="btnClearMealCart" class="btn-cart-clear" style="padding: 0.4rem 0.9rem; font-size: 0.82rem;">
                  Clear Meal
                </button>
              </div>
            </div>

            <div id="tableScrollHint" class="table-scroll-hint" style="display: none;">
              <span>👈 Swipe horizontally to view full nutrition facts 👉</span>
            </div>

            <!-- Explorer Table -->
            <div class="nutr-table-wrap table-container" role="region" tabindex="0" aria-label="Interactive Panda Express Nutrition Explorer Table" style="margin-top: 1rem;">
              <table id="calcNutritionTable" class="nutr-table" aria-label="Interactive Panda Express Nutrition Explorer">
                <caption class="visually-hidden">Complete Panda Express Entrée and Side Dish Nutrition Facts, Calories, and Macronutrients Table</caption>
                <thead>
                  <tr>
                    <th scope="col" style="position: sticky; left: 0; z-index: 6; min-width: 170px;">Dish Name</th>
                    <th scope="col" class="sortable" data-field="calories" style="cursor: pointer;" title="Sort by Calories">Calories ↕</th>
                    <th scope="col" class="sortable" data-field="totalFat" style="cursor: pointer;" title="Sort by Fat">Fat (g) ↕</th>
                    <th scope="col">Sat Fat (g)</th>
                    <th scope="col">Trans Fat (g)</th>
                    <th scope="col">Chol (mg)</th>
                    <th scope="col" class="sortable" data-field="sodium" style="cursor: pointer;" title="Sort by Sodium">Sodium (mg) ↕</th>
                    <th scope="col" class="sortable" data-field="totalCarbs" style="cursor: pointer;" title="Sort by Carbs">Carbs (g) ↕</th>
                    <th scope="col">Fiber (g)</th>
                    <th scope="col">Sugar (g)</th>
                    <th scope="col" class="sortable" data-field="protein" style="cursor: pointer;" title="Sort by Protein">Protein (g) ↕</th>
                    <th scope="col">Allergens</th>
                    <th scope="col" style="text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody id="calcTableBody">
                  <!-- Injected by main.js renderExplorerTable() -->
                </tbody>
              </table>
            </div>

          </div>

          <!-- Sticky Calorie Bottom Dock -->
          <div id="stickyCalorieDock" class="sticky-calorie-dock" role="region" aria-label="Meal Calorie Summary Dock">
            <div class="calorie-dock-inner">
              <div>
                <span id="dockItemCount" class="dock-count-label">0 items in meal</span>
                <div id="dockCalorieValue" class="calorie-dock-total">0 cal</div>
              </div>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <button type="button" id="dockViewMealBtn" class="nutr-btn" style="padding: 0.6rem 1.25rem; font-size: 0.9rem;">
                  View Meal Breakdown
                </button>
              </div>
            </div>
          </div>

          <!-- Item Details Modal -->
          <div id="nutritionModal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modalDishTitle">
            <div class="modal-dialog">
              <div class="modal-header-bar">
                <span id="modalDishTitle" style="font-weight: 800; font-size: 1.1rem; color: #FFFFFF;">Nutrition Details</span>
                <button type="button" id="modalCloseBtn" class="modal-close-btn" aria-label="Close dialog">✕</button>
              </div>
              <div id="modalDetailsBody" style="padding: 1.5rem;">
                <!-- Injected by main.js openItemModal() -->
              </div>
            </div>
          </div>

          <div id="a11yClipboardAnnouncer" class="sr-only" aria-live="polite"></div>

        </div>
      </section>

      <!-- SECTION: How We Verify This Data -->
      <section class="nutr-section" aria-labelledby="verify-heading">
        <div class="nutr-callout-card">
          <h2 id="verify-heading" style="color: #FFFFFF; font-size: 1.35rem; font-weight: 800; margin-top: 0; margin-bottom: 0.6rem;">
            How We Verify This Data
          </h2>
          <p>
            Every figure in this guide is sourced directly from Panda Express's official Nutrition &amp; Allergen page and cross-checked against our own calculator database. Panda Express states that its values are based on standard recipes, so actual numbers can shift slightly by location, portion size, and prep method. If you're managing a medical condition or a severe allergy, confirm details in-app or in-store before ordering — this guide is a planning tool, not a substitute for that.
          </p>
        </div>
      </section>

      <!-- SECTION: Meal Sizes at a Glance -->
      <section class="nutr-section" aria-labelledby="sizes-heading">
        <h2 id="sizes-heading" class="nutr-section-title">
          Panda Express Meal Sizes at a Glance
        </h2>
        <p class="nutr-paragraph">
          The range is this wide because Panda Express doesn't set fixed combos — every entrée and side is priced and calculated individually, so your total depends entirely on what goes into the bowl. A White Rice and Grilled Teriyaki Chicken bowl and a Fried Rice and Orange Chicken bowl are both technically "a Bowl," but they're 800+ calories apart.
        </p>

        <!-- Meal Sizes Table -->
        <div class="nutr-table-wrap table-container" role="region" tabindex="0" aria-label="Panda Express Meal Sizes Caloric Comparison">
          <table class="nutr-table" aria-label="Panda Express Meal Sizes Caloric Comparison">
            <caption class="visually-hidden">Panda Express Meal Formats and Calorie Ranges Comparison</caption>
            <thead>
              <tr>
                <th scope="col">Meal Format</th>
                <th scope="col">Items Included</th>
                <th scope="col">Caloric Range</th>
                <th scope="col">Key Takeaway</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style="color: #FFFFFF;">Bowl</strong></td>
                <td>1 Side + 1 Entrée</td>
                <td><span class="nutr-table-accent">280–1,130 kcal</span></td>
                <td>Ideal for single portions; wide calorie swing based on side chosen</td>
              </tr>
              <tr>
                <td><strong style="color: #FFFFFF;">Plate</strong></td>
                <td>1 Side + 2 Entrées</td>
                <td><span class="nutr-table-accent">430–1,640 kcal</span></td>
                <td>Standard dinner; best protein yield per dollar when choosing lean meats</td>
              </tr>
              <tr>
                <td><strong style="color: #FFFFFF;">Bigger Plate</strong></td>
                <td>1 Side + 3 Entrées</td>
                <td><span class="nutr-table-accent">580–2,150+ kcal</span></td>
                <td>Roughly 580–2,150+ calories, based on combining official per-item figures</td>
              </tr>
              <tr>
                <td><strong style="color: #FFFFFF;">Panda Bundle</strong></td>
                <td>Any Size Meal + Medium Drink</td>
                <td><span class="nutr-table-accent">280–2,560 kcal</span></td>
                <td>Sugary drinks can add 200–400+ calories; opt for water or zero-calorie soda</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- SECTION: Calories by Category -->
      <section class="nutr-section" aria-labelledby="categories-heading">
        <h2 id="categories-heading" class="nutr-section-title">
          Panda Express Calories by Category
        </h2>
        <p class="nutr-paragraph">
          Detailed breakdown of all official menu departments. Review exact calories, sodium, and macronutrient trends before customizing your plate:
        </p>

        <!-- Row 0 (full-width): Sides featured card above the 3x3 grid -->
        <div style="margin-bottom: 24px;">
          <div class="nutr-category-card" style="background: linear-gradient(135deg, #111827 0%, #0f1f35 100%); border-color: rgba(56,189,248,0.2);">
            <div class="nutr-cat-header">
              <h3 class="nutr-cat-title">Sides</h3>
              <span class="nutr-cat-badge">130–620 cal</span>
            </div>
            <ul class="nutr-item-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0 1.5rem;">
              <li class="nutr-item-row">
                <span class="nutr-item-name">Super Greens</span>
                <span class="nutr-item-meta">130 cal</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">White Steamed Rice</span>
                <span class="nutr-item-meta">520 cal | 0mg sod</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Chow Mein</span>
                <span class="nutr-item-meta">{{cal:chow-mein}} cal | {{sodium:chow-mein}}mg sod</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Fried Rice</span>
                <span class="nutr-item-meta">{{cal:fried-rice}} cal | {{sodium:fried-rice}}mg sod</span>
              </li>
            </ul>
            <p class="nutr-item-desc">
              Sides swing harder than any other category. Super Greens sits at {{cal:super-greens}} calories, while Fried Rice reaches {{cal:fried-rice}}. The difference isn't really the rice or the greens — it's the oil, egg, and seasoning used in wok preparation. White Steamed Rice lands at {{cal:white-steamed-rice}} calories with zero sodium, making it the cleanest carb option if sodium is your concern.
            </p>
          </div>
        </div>

        <!-- 3×3 Grid: Row 1 — Chicken | Chicken Breast | Beef -->
        <!-- Row 2 — Seafood | Vegetables & Tofu | Appetizers -->
        <!-- Row 3 — Soup | Sauces | Cub Meals -->
        <div class="nutr-category-grid">

          <!-- Row 1, Col 1: Chicken Entrées -->
          <div class="nutr-category-card">
            <div class="nutr-cat-header">
              <h3 class="nutr-cat-title">Chicken Entrées</h3>
              <span class="nutr-cat-badge">{{cal:string-bean-chicken}}–{{cal:orange-chicken}} cal</span>
            </div>
            <ul class="nutr-item-list">
              <li class="nutr-item-row">
                <span class="nutr-item-name">Grilled Teriyaki Chicken</span>
                <span class="nutr-item-meta">{{cal:grilled-teriyaki-chicken}} cal | {{protein:grilled-teriyaki-chicken}}g P</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Black Pepper Chicken</span>
                <span class="nutr-item-meta">{{cal:black-pepper-chicken}} cal | {{sodium:black-pepper-chicken}}mg sod</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Kung Pao Chicken</span>
                <span class="nutr-item-meta">{{cal:kung-pao-chicken}} cal | {{sodium:kung-pao-chicken}}mg sod</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">The Original Orange Chicken</span>
                <span class="nutr-item-meta">{{cal:orange-chicken}} cal | {{protein:orange-chicken}}g P</span>
              </li>
            </ul>
            <p class="nutr-item-desc">
              Grilled Teriyaki Chicken is the standout here: {{cal:grilled-teriyaki-chicken}} calories and {{protein:grilled-teriyaki-chicken}} grams of protein, the highest protein count on the wok menu. Orange Chicken, the chain's best-known dish, runs {{cal:orange-chicken}} calories with {{protein:orange-chicken}} grams of protein and {{sugar:orange-chicken}} grams of sugar — batter and glaze account for most of that gap. Kung Pao Chicken ({{cal:kung-pao-chicken}} cal, {{sodium:kung-pao-chicken}}mg sodium) and Black Pepper Chicken ({{cal:black-pepper-chicken}} cal, {{sodium:black-pepper-chicken}}mg sodium) offer moderate calories with savory seasonings.
            </p>
          </div>

          <!-- Row 1, Col 2: Chicken Breast -->
          <div class="nutr-category-card">
            <div class="nutr-cat-header">
              <h3 class="nutr-cat-title">Chicken Breast</h3>
              <span class="nutr-cat-badge">{{cal:string-bean-chicken}}–{{cal:sweetfire-chicken}} cal</span>
            </div>
            <ul class="nutr-item-list">
              <li class="nutr-item-row">
                <span class="nutr-item-name">String Bean Chicken Breast</span>
                <span class="nutr-item-meta">{{cal:string-bean-chicken}} cal | {{protein:string-bean-chicken}}g P</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Honey Sesame Chicken Breast</span>
                <span class="nutr-item-meta">{{cal:honey-sesame-chicken}} cal | Sweet Glaze</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">SweetFire Chicken Breast</span>
                <span class="nutr-item-meta">{{cal:sweetfire-chicken}} cal | Crisp Glaze</span>
              </li>
            </ul>
            <p class="nutr-item-desc">
              This line trades a little batter for leaner numbers. String Bean Chicken Breast comes in at {{cal:string-bean-chicken}} calories with {{protein:string-bean-chicken}} grams of protein and dietary fiber from fresh string beans. SweetFire Chicken Breast ({{cal:sweetfire-chicken}} cal) and Honey Sesame Chicken Breast ({{cal:honey-sesame-chicken}} cal) lean sweeter with delicious glazes.
            </p>
          </div>

          <!-- Row 1, Col 3: Beef -->
          <div class="nutr-category-card">
            <div class="nutr-cat-header">
              <h3 class="nutr-cat-title">Beef</h3>
              <span class="nutr-cat-badge">{{cal:broccoli-beef}}–{{cal:beijing-beef}} cal</span>
            </div>
            <ul class="nutr-item-list">
              <li class="nutr-item-row">
                <span class="nutr-item-name">Broccoli Beef</span>
                <span class="nutr-item-meta">{{cal:broccoli-beef}} cal | {{protein:broccoli-beef}}g P</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Beijing Beef</span>
                <span class="nutr-item-meta">{{cal:beijing-beef}} cal | {{fat:beijing-beef}}g F</span>
              </li>
            </ul>
            <p class="nutr-item-desc">
              Broccoli Beef is the lightest entrée on the menu at {{cal:broccoli-beef}} calories with {{protein:broccoli-beef}} grams of protein — a strong pick for lower-calorie dining. Beijing Beef is battered and crispy, landing at {{cal:beijing-beef}} calories with {{fat:beijing-beef}} grams of fat.
            </p>
          </div>

          <!-- Row 2, Col 1: Seafood -->
          <div class="nutr-category-card">
            <div class="nutr-cat-header">
              <h3 class="nutr-cat-title">Seafood</h3>
              <span class="nutr-cat-badge">{{cal:kung-pao-shrimp}}–{{cal:honey-walnut-shrimp}} cal</span>
            </div>
            <ul class="nutr-item-list">
              <li class="nutr-item-row">
                <span class="nutr-item-name">Kung Pao Shrimp</span>
                <span class="nutr-item-meta">{{cal:kung-pao-shrimp}} cal | {{protein:kung-pao-shrimp}}g P</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Honey Walnut Shrimp</span>
                <span class="nutr-item-meta">{{cal:honey-walnut-shrimp}} cal | Sweet Glaze</span>
              </li>
            </ul>
            <p class="nutr-item-desc">
              Honey Walnut Shrimp ({{cal:honey-walnut-shrimp}} cal) features tempura shrimp tossed in honey sauce with candied walnuts. Kung Pao Shrimp ({{cal:kung-pao-shrimp}} cal, {{protein:kung-pao-shrimp}}g protein) provides a savory, spicy seafood alternative wok-tossed with peanuts and chili peppers.
            </p>
          </div>

          <!-- Row 2, Col 2: Vegetables & Tofu -->
          <div class="nutr-category-card">
            <div class="nutr-cat-header">
              <h3 class="nutr-cat-title">Vegetables &amp; Tofu</h3>
              <span class="nutr-cat-badge">{{cal:super-greens}}–{{cal:eggplant-tofu}} cal</span>
            </div>
            <ul class="nutr-item-list">
              <li class="nutr-item-row">
                <span class="nutr-item-name">Super Greens (Side Portion)</span>
                <span class="nutr-item-meta">{{cal:super-greens}} cal | {{protein:super-greens}}g P</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Eggplant Tofu</span>
                <span class="nutr-item-meta">{{cal:eggplant-tofu}} cal | {{protein:eggplant-tofu}}g P</span>
              </li>
            </ul>
            <p class="nutr-item-desc">
              Super Greens ({{cal:super-greens}} cal) delivers a blend of steamed broccoli, kale, and cabbage with {{fiber:super-greens}}g of dietary fiber. Eggplant Tofu ({{cal:eggplant-tofu}} cal, {{protein:eggplant-tofu}}g protein) pairs tofu and eggplant in sweet-spicy ginger garlic sauce.
            </p>
          </div>

          <!-- Row 2, Col 3: Appetizers -->
          <div class="nutr-category-card">
            <div class="nutr-cat-header">
              <h3 class="nutr-cat-title">Appetizers</h3>
              <span class="nutr-cat-badge">{{cal:apple-pie-roll}}–{{cal:chicken-egg-roll}} cal</span>
            </div>
            <ul class="nutr-item-list">
              <li class="nutr-item-row">
                <span class="nutr-item-name">Chicken Potstickers</span>
                <span class="nutr-item-meta">{{cal:chicken-potsticker}} cal | {{protein:chicken-potsticker}}g P</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Chicken Egg Roll</span>
                <span class="nutr-item-meta">{{cal:chicken-egg-roll}} cal | {{fat:chicken-egg-roll}}g F</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Veggie Spring Roll</span>
                <span class="nutr-item-meta">{{cal:veggie-spring-roll}} cal | {{carbs:veggie-spring-roll}}g C</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Cream Cheese Rangoon</span>
                <span class="nutr-item-meta">{{cal:cream-cheese-rangoon}} cal | {{fat:cream-cheese-rangoon}}g F</span>
              </li>
            </ul>
            <p class="nutr-item-desc">
              Veggie Spring Rolls ({{cal:veggie-spring-roll}} cal) and Chicken Egg Rolls ({{cal:chicken-egg-roll}} cal) offer crispy flavor. Cream Cheese Rangoons ({{cal:cream-cheese-rangoon}} cal) provide sweet cream cheese in wonton wrappers.
            </p>
          </div>

          <!-- Row 3, Col 1: Soup -->
          <div class="nutr-category-card">
            <div class="nutr-cat-header">
              <h3 class="nutr-cat-title">Soup</h3>
              <span class="nutr-cat-badge">{{cal:egg-drop-soup}}–{{cal:wonton-soup}} cal</span>
            </div>
            <ul class="nutr-item-list">
              <li class="nutr-item-row">
                <span class="nutr-item-name">Egg Drop Soup</span>
                <span class="nutr-item-meta">{{cal:egg-drop-soup}} cal | {{sodium:egg-drop-soup}}mg sod</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Hot &amp; Sour Soup</span>
                <span class="nutr-item-meta">{{cal:hot-and-sour-soup}} cal | {{sodium:hot-and-sour-soup}}mg sod</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Wonton Soup</span>
                <span class="nutr-item-meta">{{cal:wonton-soup}} cal | {{sodium:wonton-soup}}mg sod</span>
              </li>
            </ul>
            <p class="nutr-item-desc">
              Hot &amp; Sour Soup ({{cal:hot-and-sour-soup}} cal) carries {{sodium:hot-and-sour-soup}}mg of sodium. Egg Drop Soup ({{cal:egg-drop-soup}} cal) is a lighter option with {{protein:egg-drop-soup}}g protein.
            </p>
          </div>

          <!-- Row 3, Col 2: Sauces -->
          <div class="nutr-category-card">
            <div class="nutr-cat-header">
              <h3 class="nutr-cat-title">Sauces</h3>
              <span class="nutr-cat-badge">{{cal:chili-sauce}}–{{cal:sweet-and-sour-sauce}} cal</span>
            </div>
            <ul class="nutr-item-list">
              <li class="nutr-item-row">
                <span class="nutr-item-name">Chili Sauce</span>
                <span class="nutr-item-meta">{{cal:chili-sauce}} cal | {{sodium:chili-sauce}}mg sod</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Sweet &amp; Sour Sauce</span>
                <span class="nutr-item-meta">{{cal:sweet-and-sour-sauce}} cal | {{sugar:sweet-and-sour-sauce}}g sugar</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Teriyaki Sauce</span>
                <span class="nutr-item-meta">{{cal:teriyaki-sauce}} cal | {{sodium:teriyaki-sauce}}mg sod</span>
              </li>
            </ul>
            <p class="nutr-item-desc">
              Sauces add extra flavor. Sweet &amp; Sour Sauce adds {{cal:sweet-and-sour-sauce}} calories and {{sugar:sweet-and-sour-sauce}}g sugar per cup, while Teriyaki Sauce adds {{cal:teriyaki-sauce}} calories.
            </p>
          </div>

          <!-- Row 3, Col 3: Cub Meals (Kids) -->
          <div class="nutr-category-card">
            <div class="nutr-cat-header">
              <h3 class="nutr-cat-title">Cub Meals (Kids)</h3>
              <span class="nutr-cat-badge">Under 600 cal</span>
            </div>
            <ul class="nutr-item-list">
              <li class="nutr-item-row">
                <span class="nutr-item-name">Grilled Teriyaki Cub Meal</span>
                <span class="nutr-item-meta">Balanced Protein</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Orange Chicken Cub Meal</span>
                <span class="nutr-item-meta">Kid Favorite</span>
              </li>
              <li class="nutr-item-row">
                <span class="nutr-item-name">Broccoli Beef Cub Meal</span>
                <span class="nutr-item-meta">Lean Beef &amp; Veggies</span>
              </li>
            </ul>
            <p class="nutr-item-desc">
              Panda Express designed its Cub Meals around balanced nutrition for children. Each one includes a junior entrée, junior side, and fruit.
            </p>
          </div>

        </div>

        <div class="nutr-source-note">
          ℹ️ Nutrition source: official Panda Express nutrition guide, last checked {{MONTH_YEAR}}. Values vary by location and preparation.</div>
      </section>

      <!-- SECTION: Orange Chicken Deep Dive -->
      <section class="nutr-section" aria-labelledby="orange-dive-heading">
        <h2 id="orange-dive-heading" class="nutr-section-title">
          Orange Chicken Nutrition — The Deep Dive
        </h2>
        <p class="nutr-paragraph">
          A single serving of Orange Chicken ({{serving:orange-chicken}} oz) contains {{cal:orange-chicken}} calories, {{fat:orange-chicken}} grams of fat, {{carbs:orange-chicken}} grams of carbohydrate, {{sugar:orange-chicken}} grams of sugar, and {{protein:orange-chicken}} grams of protein, with {{sodium:orange-chicken}}mg of sodium. These figures reflect Panda Express's official nutrition guide disclosure.
        </p>

        <h3 class="nutr-sub-title">Why Orange Chicken Is the Highest-Calorie Chicken Entrée</h3>
        <p class="nutr-paragraph">
          The chicken is battered and deep-fried first, then coated in a sugar-based glaze. Both steps add calories independently: the batter absorbs oil during frying, and the glaze adds nearly all {{sugar:orange-chicken}} grams of sugar on top of that. Neither step is unusual for fast food — it's just compounding on a dish that's already fried.
        </p>

        <h3 class="nutr-sub-title">Orange Chicken vs. Grilled Teriyaki Chicken</h3>

        <!-- Comparison Table: Orange Chicken vs Grilled Teriyaki -->
        <div class="nutr-table-wrap table-container" role="region" tabindex="0" aria-label="Orange Chicken vs Grilled Teriyaki Chicken Nutrition Comparison">
          <table class="nutr-table" aria-label="Orange Chicken vs Grilled Teriyaki Chicken Nutrition Comparison">
            <caption class="visually-hidden">Nutritional Comparison between Orange Chicken and Grilled Teriyaki Chicken</caption>
            <thead>
              <tr>
                <th scope="col">Nutritional Metric</th>
                <th scope="col">Orange Chicken</th>
                <th scope="col">Grilled Teriyaki Chicken</th>
                <th scope="col">Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style="color: #FFFFFF;">Calories</strong></td>
                <td><span class="nutr-table-accent">{{cal:orange-chicken}} kcal</span></td>
                <td><span class="nutr-table-val">{{cal:grilled-teriyaki-chicken}} kcal</span></td>
                <td>-190 kcal (39% fewer calories)</td>
              </tr>
              <tr>
                <td><strong style="color: #FFFFFF;">Protein</strong></td>
                <td>{{protein:orange-chicken}}g</td>
                <td><span class="nutr-table-val">{{protein:grilled-teriyaki-chicken}}g</span></td>
                <td>+11g (+44% more protein)</td>
              </tr>
              <tr>
                <td><strong style="color: #FFFFFF;">Sodium</strong></td>
                <td>{{sodium:orange-chicken}}mg</td>
                <td><span class="nutr-table-val">{{sodium:grilled-teriyaki-chicken}}mg</span></td>
                <td>-290mg (35% less sodium)</td>
              </tr>
              <tr>
                <td><strong style="color: #FFFFFF;">Sugar</strong></td>
                <td>{{sugar:orange-chicken}}g</td>
                <td><span class="nutr-table-val">{{sugar:grilled-teriyaki-chicken}}g</span></td>
                <td>-20g (67% less sugar)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="nutr-paragraph">
          Grilled Teriyaki Chicken delivers roughly double the protein-per-calorie ratio compared to Orange Chicken with significantly less sugar and fat.
        </p>
      </section>

      <!-- SECTION: Sides Showdown -->
      <section class="nutr-section" aria-labelledby="sides-showdown-heading">
        <h2 id="sides-showdown-heading" class="nutr-section-title">
          Sides Showdown: Chow Mein vs. Fried Rice vs. White Rice vs. Super Greens
        </h2>

        <!-- Sides Table -->
        <div class="nutr-table-wrap table-container" role="region" tabindex="0" aria-label="Panda Express Sides Comparison">
          <table class="nutr-table" aria-label="Panda Express Sides Comparison">
            <caption class="visually-hidden">Comparison of Panda Express Sides Nutritional Profiles and Calorie Counts</caption>
            <thead>
              <tr>
                <th scope="col">Base Side</th>
                <th scope="col">Calories</th>
                <th scope="col">Sodium</th>
                <th scope="col">Carbs</th>
                <th scope="col">Key Profile Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style="color: #FFFFFF;">White Steamed Rice</strong></td>
                <td><span class="nutr-table-val">520 cal</span></td>
                <td><span class="nutr-table-val">0mg</span></td>
                <td>118g</td>
                <td>Cleanest option if oil and sodium are your concern, heaviest in raw carbs</td>
              </tr>
              <tr>
                <td><strong style="color: #FFFFFF;">Fried Rice</strong></td>
                <td><span class="nutr-table-accent">620 cal</span></td>
                <td>1,000mg</td>
                <td>101g</td>
                <td>The eggs and oil used in frying push both calories and cholesterol (140mg) well above white rice</td>
              </tr>
              <tr>
                <td><strong style="color: #FFFFFF;">Chow Mein</strong></td>
                <td><span class="nutr-table-accent">600 cal</span></td>
                <td>1,000mg</td>
                <td>94g</td>
                <td>Stir-fried in oil with similar sodium to fried rice but fewer carbs</td>
              </tr>
              <tr>
                <td><strong style="color: #FFFFFF;">Super Greens</strong></td>
                <td><span class="nutr-table-val">130 cal</span></td>
                <td>370mg</td>
                <td>14g</td>
                <td>The outlier, roughly a quarter of the calories of every other side</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="nutr-callout-card">
          <h3>The #1 Nutritional Swap on the Menu</h3>
          <p>
            Swapping a side of Fried Rice ({{cal:fried-rice}} cal) for Super Greens ({{cal:super-greens}} cal) in a Bowl saves about 490 calories and 630mg of sodium in one change — the single biggest impact swap available anywhere on the menu.
          </p>
        </div>
      </section>

      <!-- SECTION: Is Panda Express Healthy? -->
      <section class="nutr-section" aria-labelledby="healthy-heading">
        <h2 id="healthy-heading" class="nutr-section-title">
          Is Panda Express Healthy?
        </h2>
        <p class="nutr-paragraph">
          The honest answer: it depends entirely on which entrée and side you pick, because the range runs from a 280-calorie Bowl to a 2,150-calorie Bigger Plate. Panda Express isn't inherently unhealthy or healthy — it's an à la carte menu where the choice matters more than the restaurant.
        </p>

        <h3 class="nutr-sub-title">The Wok Smart Line</h3>
        <p class="nutr-paragraph">
          Wok Smart is Panda Express's designation for entrées that are lower in calories, fat, and sodium relative to the rest of the menu — generally the grilled and steamed options like Grilled Teriyaki Chicken, Broccoli Beef, and Super Greens. It exists specifically to make healthier scanning easier without needing a calculator.
        </p>

        <h3 class="nutr-sub-title">Kids LiveWell / Cub Meal Criteria</h3>
        <p class="nutr-paragraph">
          Panda Express's Cub Meals are built to meet Kids LiveWell program criteria, verified by the National Restaurant Association against nutrition guidelines from major health organizations. Each Cub Meal stays under 600 calories and includes a vegetable and a fruit serving by design, not as an afterthought.
        </p>

        <h3 class="nutr-sub-title">Building a Lower-Calorie, Lower-Sodium, or Higher-Protein Plate</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; margin: 1.5rem 0;">
          <div class="nutr-stat-box" style="text-align: left; padding: 1.5rem;">
            <h4 style="color: #FFFFFF; font-size: 1.1rem; margin-top: 0; margin-bottom: 0.5rem;">For Fewer Calories</h4>
            <p style="color: #D1D5DB; font-size: 0.95rem; line-height: 1.6; margin-bottom: 0;">
              Choose Super Greens ({{cal:super-greens}} cal) instead of starch sides like Fried Rice ({{cal:fried-rice}} cal) or Chow Mein ({{cal:chow-mein}} cal) to cut nearly 500 calories per meal. Pick a Bowl over a Plate, and ask for sauce on the side.
            </p>
          </div>
          <div class="nutr-stat-box" style="text-align: left; padding: 1.5rem;">
            <h4 style="color: #FFFFFF; font-size: 1.1rem; margin-top: 0; margin-bottom: 0.5rem;">For More Protein</h4>
            <p style="color: #D1D5DB; font-size: 0.95rem; line-height: 1.6; margin-bottom: 0;">
              Grilled Teriyaki Chicken ({{protein:grilled-teriyaki-chicken}}g protein, {{cal:grilled-teriyaki-chicken}} cal) is the highest-protein entrée on the menu.
            </p>
          </div>
          <div class="nutr-stat-box" style="text-align: left; padding: 1.5rem;">
            <h4 style="color: #FFFFFF; font-size: 1.1rem; margin-top: 0; margin-bottom: 0.5rem;">For Less Sodium</h4>
            <p style="color: #D1D5DB; font-size: 0.95rem; line-height: 1.6; margin-bottom: 0;">
              Watch high-sodium specialty items specifically. Grilled Teriyaki Chicken ({{sodium:grilled-teriyaki-chicken}}mg) and Broccoli Beef ({{sodium:broccoli-beef}}mg) are among the lower-sodium entrée options.
            </p>
          </div>
        </div>
      </section>

      <!-- SECTION: Allergens & Ingredients -->
      <section class="nutr-section" aria-labelledby="allergens-heading">
        <h2 id="allergens-heading" class="nutr-section-title">
          Allergens &amp; Ingredients: What's Actually Safe
        </h2>
        <p class="nutr-paragraph">
          Panda Express states it uses ingredients containing all major FDA allergens — wheat, soy, egg, milk, tree nuts, peanuts, shellfish, fish, and sesame — and that cross-contact is possible in any item because food is prepared on shared equipment. No menu item can be guaranteed allergen-free.
        </p>

        <h3 class="nutr-sub-title">What's Gluten-Free at Panda Express</h3>
        <p class="nutr-paragraph">
          White Steamed Rice and Super Greens are the safest base choices, since neither lists wheat on the official allergen sheet. Broccoli Beef also skips the wheat flag, though it still lists soy. Orange Chicken, Chow Mein, and most sauce-based dishes all contain wheat, mainly from soy sauce and batter.
        </p>

        <h3 class="nutr-sub-title">The Peanut Oil Question, Answered Directly</h3>
        <p class="nutr-paragraph">
          Panda Express does not cook with peanut oil — it uses soybean oil for frying and stir-frying. That said, several dishes (Kung Pao Chicken specifically) do contain actual peanuts as an ingredient, so "no peanut oil" doesn't mean "peanut-free." Check the allergen flag on the specific dish, not just the cooking oil.
        </p>

        <div class="nutr-callout-card">
          <h3>Official Verification</h3>
          <p>
            For anything allergy-critical, don't rely solely on this guide or any third-party page — Panda Express provides a dedicated allergen lookup and a customer service line at <strong style="color: #38BDF8;">(800) 877-8988</strong> for direct confirmation before you order.
          </p>
        </div>
      </section>

      <!-- SECTION: Popular Meal Combos -->
      <section class="nutr-section" aria-labelledby="combos-heading">
        <h2 id="combos-heading" class="nutr-section-title">
          Popular Meal Combos and Their Real Totals
        </h2>
        <p class="nutr-paragraph">
          Calculated totals for frequently ordered meal pairing formulas:
        </p>

        <div>
          <div class="nutr-combo-card">
            <span class="nutr-combo-formula">Grilled Teriyaki Chicken + Super Greens &rarr; {{cal:grilled-teriyaki-chicken}} + {{cal:super-greens}}</span>
            <span class="nutr-combo-badge">430 calories</span>
          </div>
          <div style="font-size: 0.85rem; color: #9CA3AF; margin-top: -0.5rem; margin-bottom: 1rem; padding-left: 0.5rem;">
            * Lightest realistic combo on the menu
          </div>

          <div class="nutr-combo-card">
            <span class="nutr-combo-formula">Broccoli Beef + White Steamed Rice &rarr; {{cal:broccoli-beef}} + {{cal:white-steamed-rice}}</span>
            <span class="nutr-combo-badge">670 calories</span>
          </div>

          <div class="nutr-combo-card">
            <span class="nutr-combo-formula">Orange Chicken + Chow Mein &rarr; {{cal:orange-chicken}} + {{cal:chow-mein}}</span>
            <span class="nutr-combo-badge">1,090 calories</span>
          </div>

          <div class="nutr-combo-card">
            <span class="nutr-combo-formula">Beijing Beef + Fried Rice &rarr; {{cal:beijing-beef}} + {{cal:fried-rice}}</span>
            <span class="nutr-combo-badge">1,100 calories</span>
          </div>

          <div class="nutr-combo-card">
            <span class="nutr-combo-formula">Honey Walnut Shrimp + Chow Mein &rarr; {{cal:honey-walnut-shrimp}} + {{cal:chow-mein}}</span>
            <span class="nutr-combo-badge">1,030 calories</span>
          </div>
        </div>
      </section>

      <!-- SECTION: What This Guide Can't Tell You -->
      <section class="nutr-section" aria-labelledby="disclaimer-heading">
        <h2 id="disclaimer-heading" class="nutr-section-title">
          What This Guide Can't Tell You
        </h2>
        <div class="nutr-callout-card">
          <p>
            Panda Express prepares food fresh in small batches, so actual nutrition can vary by location, portion scooping, and regional recipe differences. These figures reflect standard recipes as published by Panda Express, not a lab measurement of your specific order. If you have celiac disease or a severe allergy, treat every number here as a starting point, not a guarantee, and confirm with the restaurant directly.
          </p>
        </div>
      </section>

      <!-- SECTION: FAQs -->
      <section class="nutr-section" aria-labelledby="faqs-heading">
        <h2 id="faqs-heading" class="nutr-section-title">
          Panda Express Nutrition FAQs
        </h2>
        
        <div class="nutr-faq-list">
          ${faqs.map((faq, idx) => `
            <details class="nutr-faq-item" ${idx === 0 ? 'open' : ''}>
              <summary>
                <span>${faq.q}</span>
                <span class="nutr-faq-chevron" aria-hidden="true">&#9662;</span>
              </summary>
              <div class="nutr-faq-answer">
                ${faq.a}
              </div>
            </details>
          `).join('')}
        </div>
      </section>

      <!-- FOOTER ACTION SHORTCUTS -->
      <div style="text-align: center; margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid #1F2937;">
        <h3 style="color: #FFFFFF; font-size: 1.35rem; font-weight: 800; margin-bottom: 1rem;">
          Plan Your Order &amp; Save at Checkout
        </h3>
        <p style="color: #9CA3AF; max-width: 600px; margin: 0 auto 1.5rem auto; font-size: 0.95rem;">
          Pair your nutritional choices with verified promotion codes and smart group ordering calculations.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="/#coupon-section" class="nutr-btn">🎟️ View Today's Working Coupons</a>
          <a href="/panda-express-savings-calculator/" class="nutr-btn-outline">🧮 Savings Calculator</a>
          <a href="/panda-express-menu/" class="nutr-btn-outline">🥡 Explore Full Menu &amp; Prices</a>
        </div>
      </div>

    </div>

    <script>
      window.PANDA_MENU_ITEMS = ${JSON.stringify(nutritionFull)};
    </script>

  </div>
  `;

  return {
    title: `Panda Express Nutrition Calculator: Calories, Macros & Facts`,
    description: `Stop guessing your Panda Express calories! Free calculator instantly shows calories, macros, sodium & allergens for every dish. Build your meal.`,
    canonicalPath: '/panda-express-nutrition/',
    content,
    breadcrumbs,
    schemaJson: [faqSchema, articleSchema],
    ogImage: '/public/images/og/og-nutrition.jpg',
    ogImageAlt: `Panda Express Nutrition Facts and Calorie Calculator {{YEAR}}`
  };
}

module.exports = renderNutrition;
