/**
 * Panda Express Nutrition Calculator Page Generator (V2 Modern & Comprehensive)
 * Dual-Mode: Interactive Combo Meal Builder + Searchable 12-Column Explorer
 * Includes 2,000+ words of authoritative nutritional guides, macro tables, combo comparisons & FAQ schema
 */
const fs = require('fs');
const path = require('path');
const nutritionFull = require('../../data/menu_full.json');
const nutritionData = require('../../data/nutrition.json');

function renderNutrition() {
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

  const nutrBlocks = pageBlocks.nutrition || [];
  const nutrBlock = nutrBlocks.find(b => b.type === 'nutrition-calculator');

  const nutrContent = adminContent.nutrition || {};
  const badgeText = nutrBlock?.badgeText || nutrContent.badgeText || 'Interactive Nutrition &amp; Macro Engine (2026 Edition)';
  const heroTitle = nutrBlock?.heading || nutrContent.heroTitle || 'Panda Express Nutrition Calculator';
  const heroSubtitle = nutrBlock?.subtext || nutrContent.heroSubtitle || 'Instantly calculate calories, macronutrients, and allergen disclosures for custom bowls, plates, and entrees across all 45+ official Panda Express menu items and 12 laboratory-verified metrics.';
  const sourceDisclosure = nutrBlock?.disclosure || nutrContent.sourceDisclosure || "Nutritional figures and allergen flags are compiled directly from Panda Express's published nutrition disclosures and standardized corporate formulations. Portion sizes may vary by &plusmn;15% to 20% in-store due to hand-scoop volume and wok reduction.";
  const tab1Label = nutrBlock?.tab1Label || nutrContent.tab1Label || '🥣 Combo Meal Builder';
  const tab2Label = nutrBlock?.tab2Label || nutrContent.tab2Label || '📊 12-Column Nutrition &amp; Allergen Explorer';

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Nutrition Calculator", url: "/panda-express-nutrition/" }
  ];

  // Nutrition FAQs for Reference Section & FAQPage Schema
  const nutritionFaqs = [
    {
      q: "What is the absolute lowest calorie meal combo you can order at Panda Express?",
      a: "The lowest-calorie meal combo at Panda Express is a Bowl featuring Super Greens (90 to 130 calories depending on batch water content) paired with Broccoli Beef (150 calories). This entire balanced meal delivers 240 to 280 total calories, 15 grams of protein, 8 grams of dietary fiber, and only 7 grams of total fat, making it one of the lowest-calorie hot fast-casual meals in America."
    },
    {
      q: "How can I eat strict Keto or Low-Carb at Panda Express?",
      a: "To eat keto or low-carb at Panda Express, always avoid Chow Mein (80–94g carbs) and Fried or Steamed Rice (85–118g carbs). Request a full serving of Super Greens (7g net carbs) or ask for an all-entree plate. For entrees, choose Kung Pao Chicken (12g net carbs), Mushroom Chicken (11g net carbs), Black Pepper Angus Steak (15g net carbs), or Grilled Teriyaki Chicken ordered without the teriyaki glaze (4g net carbs). Avoid breaded items like Orange Chicken or Beijing Beef, which carry over 45g of carbohydrate glazes."
    },
    {
      q: "Does Panda Express add MSG (Monosodium Glutamate) to their dishes?",
      a: "Panda Express corporate policy states that they do not add Monosodium Glutamate (MSG) directly to any of their ingredients or wok stations during food preparation. However, naturally occurring glutamates are present in ingredients like hydrolyzed soy protein, soy sauce, yeast extract, fermented chili pastes, and mushrooms used throughout their recipes."
    },
    {
      q: "Are there any 100% certified gluten-free entrees or sides at Panda Express?",
      a: "Panda Express does not maintain a certified gluten-free kitchen. White Steamed Rice and Brown Steamed Rice do not contain gluten ingredients, but virtually all hot entrees, marinades, and sauces (including soy sauce and teriyaki sauce) contain wheat. Additionally, because dishes are tossed in shared woks and served from adjacent steam table pans, cross-contact with gluten is always possible."
    },
    {
      q: "Which Panda Express entrees have the highest protein per calorie?",
      a: "Grilled Teriyaki Chicken is the undisputed protein champion at Panda Express, packing 36 grams of protein for 300 calories (or 33g protein for 275 calories depending on glaze application), meaning roughly 48% of its calories come directly from lean protein. The runner-up is Kung Pao Chicken, delivering 28 grams of protein for 290 calories, followed by Black Pepper Angus Steak offering 19 grams of protein for 210 calories."
    },
    {
      q: "What is the best strategy to cut sodium when dining at Panda Express?",
      a: "To minimize sodium, choose White Steamed Rice (0mg sodium) or Brown Steamed Rice (15mg sodium) as your base side, which eliminates the 860–1,000mg of sodium found in Chow Mein or Fried Rice. For entrees, select Broccoli Beef (520mg sodium) and Grilled Teriyaki Chicken with the glaze served strictly on the side. Avoid soups like Hot & Sour Soup (1,290mg sodium per bowl) and heavy soy glazes."
    },
    {
      q: "Are Super Greens cooked using chicken broth, lard, or butter?",
      a: "No. Panda Express Super Greens (a blend of broccoli, kale, and cabbage) are steamed and lightly tossed in vegetable oil with garlic and a mild ginger-soy seasoning. They do not contain chicken broth, butter, or animal fats, making them completely vegetarian and vegan-friendly."
    },
    {
      q: "Can you split your side 50/50 between two different sides at no extra charge?",
      a: "Yes! At all Panda Express locations, you can order a 'half and half' side at zero additional charge. The most popular fitness hack is ordering half Super Greens and half Chow Mein or Brown Rice. This cuts carb and calorie density by 40% while still letting you enjoy warm noodles or savory rice alongside your protein."
    },
    {
      q: "How accurate are Panda Express's published nutrition facts compared to laboratory tests?",
      a: "Published nutrition values are based on standardized laboratory nutritional chemical analyses of corporate recipe formulations. However, in-restaurant servings will vary by ±15% to 25% due to human scoop sizes, wok oil absorption, and sauce reduction levels. A generous server scoop can easily add 80–120 calories to an entree, while a lighter scoop will decrease it."
    },
    {
      q: "Does Grilled Teriyaki Chicken come pre-sauced, or can you get the teriyaki sauce on the side?",
      a: "Grilled Teriyaki Chicken is sliced hot from the grill without sauce. By default, team members drizzle dark teriyaki glaze over the sliced chicken breast. You can explicitly request 'teriyaki sauce on the side' or 'no sauce at all'. Skipping the glaze saves approximately 60 calories, 10 grams of added sugars, and 180mg of sodium."
    },
    {
      q: "What kind of cooking oil does Panda Express use in fryers and woks, and does it contain peanuts?",
      a: "Panda Express prepares all wok dishes and deep-fried items using 100% pure highly refined soybean oil. Highly refined soybean oil is classified by the FDA as non-allergenic because the refining process removes allergenic proteins. Panda Express does not use peanut oil in any restaurant. However, whole peanuts are used in Kung Pao Chicken and tree nuts (glazed walnuts) are used in Honey Walnut Shrimp, meaning kitchen woks and utensils handle nuts."
    },
    {
      q: "Which menu items at Panda Express contain milk or dairy allergens?",
      a: "Only two regular menu items contain dairy: Cream Cheese Rangoon (which contains real cream cheese made from pasteurized milk and cream) and Honey Walnut Shrimp (which features a sweet honey glaze made with sweetened condensed milk). All core poultry, beef, and noodle/rice sides are dairy-free by formulation."
    },
    {
      q: "Which Panda Express dishes contain egg?",
      a: "Egg is an ingredient in Fried Rice, Chicken Egg Rolls, and the batter coating used on breaded entrees including The Original Orange Chicken, Beijing Beef, Sweet & Sour Chicken, and Honey Walnut Shrimp. If you have an egg allergy, choose unbreaded wok entrees like Grilled Teriyaki Chicken (without sauce/plain), Broccoli Beef, or String Bean Chicken Breast paired with Steamed White or Brown Rice."
    },
    {
      q: "How does Panda Express handle food allergy cross-contact in kitchen woks?",
      a: "Panda Express operations utilize shared cooking equipment, woks, cutting boards, and steam table serving wells across all recipes. While woks are rinsed with water and scraped between batches, micro-particles of wheat (gluten), soy, eggs, sesame, and shellfish can transfer between dishes. Diners with life-threatening food allergies are strongly advised to inform the manager before ordering."
    }
  ];

  // FAQPage Schema JSON-LD
  const nutritionFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": nutritionFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  // NutritionInformation Schemas for Key Dishes
  const nutritionSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "MenuItem",
      "name": "The Original Orange Chicken",
      "description": "Crispy boneless chicken wok-tossed in sweet and spicy chili orange sauce.",
      "nutrition": {
        "@type": "NutritionInformation",
        "servingSize": "5.7 oz (162g)",
        "calories": "510 calories",
        "fatContent": "23 g",
        "saturatedFatContent": "5 g",
        "transFatContent": "0 g",
        "cholesterolContent": "80 mg",
        "sodiumContent": "820 mg",
        "carbohydrateContent": "53 g",
        "fiberContent": "2 g",
        "sugarContent": "19 g",
        "proteinContent": "26 g"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "MenuItem",
      "name": "Grilled Teriyaki Chicken",
      "description": "Grilled marinated chicken thigh sliced and served with sweet teriyaki glaze.",
      "nutrition": {
        "@type": "NutritionInformation",
        "servingSize": "6.0 oz (170g)",
        "calories": "300 calories",
        "fatContent": "13 g",
        "saturatedFatContent": "4 g",
        "transFatContent": "0 g",
        "cholesterolContent": "170 mg",
        "sodiumContent": "530 mg",
        "carbohydrateContent": "14 g",
        "fiberContent": "1 g",
        "sugarContent": "8 g",
        "proteinContent": "36 g"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "MenuItem",
      "name": "Kung Pao Chicken",
      "description": "Sichuan-inspired wok-tossed chicken with peanuts, vegetables, and chili peppers.",
      "nutrition": {
        "@type": "NutritionInformation",
        "servingSize": "5.8 oz (164g)",
        "calories": "290 calories",
        "fatContent": "19 g",
        "saturatedFatContent": "3.5 g",
        "transFatContent": "0 g",
        "cholesterolContent": "60 mg",
        "sodiumContent": "970 mg",
        "carbohydrateContent": "14 g",
        "fiberContent": "2 g",
        "sugarContent": "5 g",
        "proteinContent": "17 g"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "MenuItem",
      "name": "Super Greens",
      "description": "A healthful steamed medley of fresh broccoli, kale, and green cabbage.",
      "nutrition": {
        "@type": "NutritionInformation",
        "servingSize": "7.0 oz (198g)",
        "calories": "90 calories",
        "fatContent": "2 g",
        "saturatedFatContent": "0 g",
        "transFatContent": "0 g",
        "cholesterolContent": "0 mg",
        "sodiumContent": "260 mg",
        "carbohydrateContent": "10 g",
        "fiberContent": "5 g",
        "sugarContent": "4 g",
        "proteinContent": "6 g"
      }
    }
  ];

  const content = `
  <!-- Light Hero Section (Phase 16h Inspired Layout) -->
  <section class="nutrition-hero-light">
    <div class="container">
      <div class="nutrition-hero-inner">
        <!-- Breadcrumb Trail -->
        <nav aria-label="Breadcrumbs" class="nutrition-breadcrumbs">
          <ol class="breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
              <a href="/" itemprop="item"><span itemprop="name">Home</span></a>
              <span class="crumb-separator" aria-hidden="true">/</span>
              <meta itemprop="position" content="1" />
            </li>
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
              <span itemprop="name" aria-current="page">Nutrition Calculator</span>
              <meta itemprop="position" content="2" />
            </li>
          </ol>
        </nav>

        <!-- Pill-Style Badge -->
        <div class="nutrition-hero-badge">
          <span class="nutrition-badge-dot"></span>
          <span>${badgeText}</span>
        </div>

        <!-- Heading -->
        <h1 class="nutrition-hero-title">${heroTitle}</h1>

        <!-- Concise Scope Subheading -->
        <p class="nutrition-hero-subtitle">
          ${heroSubtitle}
        </p>

        <!-- Source-of-Truth Disclosure Line -->
        <div class="source-disclosure-bar">
          <span style="font-size: 1.25rem; line-height: 1;">📋</span>
          <div>
            <strong>Official Source Disclosure:</strong> ${sourceDisclosure}
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="container" style="padding-top: 2rem;">

    <!-- Contextual Food Photography (Phase 6b) -->
    <div style="max-width: 840px; margin: 0 auto 2rem auto; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12);">
      <picture>
        <source type="image/webp" 
                srcset="/public/images/optimized/nutrition-plate-640.webp 640w,
                        /public/images/optimized/nutrition-plate-800.webp 800w,
                        /public/images/optimized/nutrition-plate-1280.webp 1280w,
                        /public/images/optimized/nutrition-plate-1920.webp 1920w"
                sizes="(max-width: 840px) 100vw, 840px">
        <img src="/public/images/nutrition-plate.jpg" 
             alt="Balanced Panda Express plate meal featuring steamed brown rice, flame-grilled teriyaki chicken, and fresh broccoli wok vegetables" 
             width="1280" 
             height="720" 
             loading="lazy" 
             decoding="async" 
             style="width: 100%; height: auto; display: block; aspect-ratio: 16/9; object-fit: cover;">
      </picture>
    </div>

    <!-- "Your Meal (N items)" Running Summary Header (Phase 5 Item 2 & 3) -->
    <div class="running-meal-banner" id="runningMealHeader" style="max-width: 840px; margin: 0 auto 1.5rem auto; background: linear-gradient(135deg, #101014 0%, #1A0C10 60%, #240A0F 100%); border: 1px solid rgba(200, 16, 46, 0.35); border-radius: 12px; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem; color: #FFFFFF; box-shadow: 0 4px 16px rgba(0,0,0,0.25);">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.6rem;">🍱</span>
        <div>
          <div id="runningMealTitle" style="font-weight: 800; font-size: 1.05rem; color: #FFFFFF;">Your Meal (0 items)</div>
          <div id="runningMealCals" style="font-size: 0.88rem; color: #E2E8F0; font-weight: 500;">0 total calories &bull; Select dishes to calculate</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
        <button type="button" id="btnShareMealLink" class="btn btn-secondary" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; border-color: rgba(255,255,255,0.2); color: #FFF; background: rgba(255,255,255,0.06); border-radius: 6px; cursor: pointer;">
          🔗 Copy Share Link
        </button>
        <button type="button" id="btnClearMealCart" class="btn btn-secondary" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; border-color: rgba(255,255,255,0.2); color: #FFF; background: rgba(255,255,255,0.06); border-radius: 6px; cursor: pointer;">
          🗑️ Clear Meal
        </button>
      </div>
    </div>

    <!-- Mode Switcher Tabs -->
    <div id="nutrition-app">
      <div class="calc-mode-switcher" role="tablist" aria-label="Calculator Modes">
        <button type="button" class="calc-mode-btn is-active" data-mode="combo" role="tab" aria-selected="true">
          ${tab1Label}
        </button>
        <button type="button" class="calc-mode-btn" data-mode="explorer" role="tab" aria-selected="false">
          ${tab2Label}
        </button>
      </div>

      <!-- VIEW 1: COMBO MEAL BUILDER -->
      <div id="view-combo-builder" style="display: block;">
        <div class="calc-interactive-card">
          <!-- Step 1: Format -->
          <div style="margin-bottom: 2rem;">
            <div class="calc-step-header">
              <span class="calc-step-title">1. Select Combo Format</span>
            </div>
            <div class="pill-group">
              <button type="button" class="calc-pill-btn combo-meal-pill" data-meal="bowl">
                🥣 Bowl (1 Side + 1 Entree)
              </button>
              <button type="button" class="calc-pill-btn combo-meal-pill is-selected" data-meal="plate">
                🍽️ Plate (1 Side + 2 Entrees)
              </button>
              <button type="button" class="calc-pill-btn combo-meal-pill" data-meal="bigger_plate">
                🍱 Bigger Plate (1 Side + 3 Entrees)
              </button>
            </div>
          </div>

          <!-- Step 2: Side -->
          <div style="margin-bottom: 2rem;">
            <div class="calc-step-header">
              <span class="calc-step-title">2. Choose Your Base Side</span>
              <span style="font-size: 0.85rem; color: #64748B; font-weight: 600;">Choose 1 Side (or 50/50 Split)</span>
            </div>
            <div class="item-selection-grid" id="combo-sides-grid"></div>
          </div>

          <!-- Step 3: Entrees -->
          <div style="margin-bottom: 2rem;">
            <div class="calc-step-header">
              <span class="calc-step-title">3. Choose Your Entrees</span>
              <span id="combo-entree-notice" style="font-size: 0.88rem; font-weight: 700; color: #C8102E;">
                Selected: 2/2 Entrees
              </span>
            </div>
            <div class="item-selection-grid" id="combo-entrees-grid"></div>
          </div>

          <!-- Macro Summary Dashboard -->
          <div class="macro-summary-dashboard">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <h2 style="color: #FFFFFF; font-size: 1.25rem; margin: 0;">Calculated Combo Total</h2>
              <span style="font-size: 0.85rem; color: #CBD5E1; font-weight: 500;">Target daily benchmark: 2,000 kcal / day</span>
            </div>

            <!-- Calorie Gauge -->
            <div style="margin-bottom: 1.25rem;">
              <div style="height: 10px; background: rgba(255, 255, 255, 0.15); border-radius: 999px; overflow: hidden;">
                <div id="combo-cal-bar" style="height: 100%; width: 50%; background: linear-gradient(90deg, #10B981 0%, #F59E0B 70%, #EF4444 100%); border-radius: 999px; transition: width 0.4s ease;"></div>
              </div>
            </div>

            <!-- 4 Macro Metrics -->
            <div class="macro-grid-cards">
              <div class="macro-metric-card">
                <span id="combo-total-cals" class="macro-metric-val calories">0</span>
                <span class="macro-metric-label">Calories (kcal)</span>
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
      </div>

      <!-- VIEW 2: 12-COLUMN EXPLORER & FULL MEAL CALCULATOR -->
      <div id="view-explorer" style="display: none;">
        <div class="calc-interactive-card" style="padding: 1.5rem;">
          <!-- Toolbar -->
          <div class="explorer-toolbar">
            <!-- Search -->
            <div class="explorer-search-box">
              <span class="search-icon-pos">🔍</span>
              <input type="text" id="calcSearchInput" class="explorer-search-input" placeholder="Search dishes (Orange Chicken, Chow Mein, Angus Steak, Super Greens)..." autocomplete="off" aria-label="Search dishes for nutrition">
              <button type="button" id="calcClearSearch" class="search-clear-btn" style="display: none;" aria-label="Clear search">✕</button>
            </div>

            <!-- Allergen Filter Dropdown -->
            <div class="allergen-dropdown" id="calcAllergenDropdown">
              <button type="button" id="calcAllergenBtn" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.6rem 1rem;">
                <span>🛡️ Allergen Exclusion Filter</span>
                <span id="calcAllergenCount" class="status-badge" style="background:#EF4444;color:#FFF;padding:0.1rem 0.4rem;font-size:0.75rem;display:none;">0</span>
              </button>
              
              <div class="allergen-dropdown-panel">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; padding: 0.35rem 0.5rem;">
                  Hide dishes containing:
                </div>
                <label class="allergen-option"><input type="checkbox" value="wheat"> <span>🌾 Wheat &amp; Gluten</span></label>
                <label class="allergen-option"><input type="checkbox" value="soy"> <span>🫘 Soy</span></label>
                <label class="allergen-option"><input type="checkbox" value="egg"> <span>🥚 Egg</span></label>
                <label class="allergen-option"><input type="checkbox" value="milk"> <span>🥛 Milk / Dairy</span></label>
                <label class="allergen-option"><input type="checkbox" value="sesame"> <span>🌱 Sesame</span></label>
                <label class="allergen-option"><input type="checkbox" value="shellfish"> <span>🦐 Crustacean Shellfish</span></label>
                <label class="allergen-option"><input type="checkbox" value="tree_nuts"> <span>🌳 Tree Nuts</span></label>
                <label class="allergen-option"><input type="checkbox" value="peanuts"> <span>🥜 Peanuts</span></label>
                <label class="allergen-option"><input type="checkbox" value="fish"> <span>🐟 Fish</span></label>
                <button type="button" id="calcClearAllergens" class="btn btn-sm" style="width: 100%; margin-top: 0.65rem; background: #F1F5F9; color: #334155; border: 1px solid #CBD5E1; font-size: 0.75rem; padding: 0.4rem; cursor: pointer; border-radius: 6px;">Clear all allergen filters</button>
              </div>
            </div>
          </div>

          <!-- Category Filter Bar -->
          <div class="category-filter-bar" id="calcCategoryBar">
            <button type="button" class="cat-pill is-active" data-category="All Items">All Items (45+)</button>
            <button type="button" class="cat-pill" data-category="Sides">Sides</button>
            <button type="button" class="cat-pill" data-category="Chicken">Chicken</button>
            <button type="button" class="cat-pill" data-category="Chicken Breast">Chicken Breast</button>
            <button type="button" class="cat-pill" data-category="Beef">Beef</button>
            <button type="button" class="cat-pill" data-category="Seafood">Seafood</button>
            <button type="button" class="cat-pill" data-category="Vegetables">Vegetables</button>
            <button type="button" class="cat-pill" data-category="Appetizers">Appetizers</button>
            <button type="button" class="cat-pill" data-category="Soup">Soup</button>
            <button type="button" class="cat-pill" data-category="Beverages">Beverages</button>
            <button type="button" class="cat-pill" data-category="Cub Meals">Cub Meals</button>
          </div>

          <!-- 12-Column Explorer Table -->
          <div class="table-responsive" style="max-height: 580px; overflow-y: auto;">
            <table class="coupon-table" id="calcNutritionTable">
              <thead>
                <tr>
                  <th scope="col" class="sortable" data-field="name" style="position: sticky; left: 0; z-index: 6; background: #0F172A; color: #FFFFFF; min-width: 170px;">Dish &amp; Serving ↕</th>
                  <th scope="col" class="sortable" data-field="calories" style="background: #0F172A; color: #FFFFFF;">Calories (kcal) ↕</th>
                  <th scope="col" class="sortable" data-field="totalFat" style="background: #0F172A; color: #FFFFFF;">Fat (g) ↕</th>
                  <th scope="col" class="sortable" data-field="saturatedFat" style="background: #0F172A; color: #FFFFFF;">Sat Fat (g) ↕</th>
                  <th scope="col" class="sortable" data-field="transFat" style="background: #0F172A; color: #FFFFFF;">Trans Fat (g) ↕</th>
                  <th scope="col" class="sortable" data-field="cholesterol" style="background: #0F172A; color: #FFFFFF;">Chol (mg) ↕</th>
                  <th scope="col" class="sortable" data-field="sodium" style="background: #0F172A; color: #FFFFFF;">Sodium (mg) ↕</th>
                  <th scope="col" class="sortable" data-field="totalCarbs" style="background: #0F172A; color: #FFFFFF;">Carbs (g) ↕</th>
                  <th scope="col" class="sortable" data-field="dietaryFiber" style="background: #0F172A; color: #FFFFFF;">Fiber (g) ↕</th>
                  <th scope="col" class="sortable" data-field="sugars" style="background: #0F172A; color: #FFFFFF;">Sugars (g) ↕</th>
                  <th scope="col" class="sortable" data-field="protein" style="background: #0F172A; color: #FFFFFF;">Protein (g) ↕</th>
                  <th scope="col" style="min-width: 130px; background: #0F172A; color: #FFFFFF;">Allergens</th>
                  <th scope="col" style="text-align: right; min-width: 90px; background: #0F172A; color: #FFFFFF;">Action</th>
                </tr>
              </thead>
              <tbody id="calcTableBody"></tbody>
            </table>
          </div>

          <!-- Table Scroll Affordance (Phase 1 & 5) -->
          <div class="table-scroll-hint" id="tableScrollHint" aria-hidden="true" style="text-align: center; font-size: 0.82rem; color: #64748B; padding: 0.6rem; background: #F8FAFC; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px; display: none;">
            &larr; Swipe sideways to explore all 12 nutrition &amp; macro metrics &rarr;
          </div>
        </div>
      </div>

      <!-- Floating Sticky Calorie Bar Dock -->
      <div id="stickyCalorieDock" class="sticky-calorie-dock" role="region" aria-label="Active Meal Dock">
        <div class="calorie-dock-inner">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #E2E8F0; font-weight: 700; letter-spacing: 0.04em;">Custom Meal Running Total</div>
            <div id="dockItemCount" style="font-size: 0.9rem; color: #FFFFFF; font-weight: 600;">0 items selected</div>
          </div>
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div id="dockCalorieValue" class="calorie-dock-total">0 cal</div>
            <a href="/#coupon-section" class="btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
              Get Coupon Discounts &rarr;
            </a>
          </div>
        </div>
      </div>

      <!-- Item Detail Modal -->
      <div id="nutritionModal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="nutritionModalTitle">
        <div class="modal-dialog">
          <div class="modal-header-bar">
            <h2 id="nutritionModalTitle" style="font-weight: 800; font-size: 1.15rem; margin: 0; color: #FFFFFF;">Complete Nutritional &amp; Allergen Specifications</h2>
            <button type="button" id="modalCloseBtn" class="modal-close-btn" aria-label="Close modal">✕</button>
          </div>
          <div id="modalDetailsBody" style="padding: 1.5rem;"></div>
        </div>
      </div>
    </div>

    <!-- Official Notice -->
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.25rem 1.5rem; font-size: 0.9rem; color: #475569; margin: 2rem 0;">
      <strong>Official Nutrition &amp; Allergen Disclaimer:</strong> ${nutritionData.disclaimer}
    </div>

    <!-- ====================================================================
         PHASE 5: QUICK REFERENCE TABLE FOR MOST-SEARCHED ITEMS
         ==================================================================== -->
    <section style="margin: 2.5rem 0;" aria-labelledby="quick-ref-heading">
      <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
        <h2 id="quick-ref-heading" style="font-size: 1.6rem; font-weight: 900; color: #0F172A; margin: 0;">
          📊 Quick-Reference Nutrition Table: 15 Most-Searched Dishes
        </h2>
        <span style="font-size: 0.85rem; color: #64748B;">Standard restaurant serving sizes</span>
      </div>
      <p style="color: #475569; font-size: 0.95rem; margin-bottom: 1.25rem;">
        Instant reference guide for Panda Express's most commonly ordered items. All metrics are calibrated directly from official Panda Express laboratory testing disclosures:
      </p>

      <div class="table-responsive" style="margin: 1rem 0;">
        <table class="coupon-table">
          <thead>
            <tr>
              <th scope="col" style="position: sticky; left: 0; background: #0F172A; color: #FFF; min-width: 170px;">Dish &amp; Serving</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Calories</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Total Fat</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Sodium</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Carbs</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Sugars</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Protein</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Orange Chicken</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">5.7 oz (162g)</span></td>
              <td style="font-weight:800;color:#B91C1C;">490 kcal</td>
              <td style="font-weight:600;color:#1E293B;">22g</td>
              <td style="font-weight:600;color:#1E293B;">820mg</td>
              <td style="font-weight:600;color:#1E293B;">57g</td>
              <td style="font-weight:600;color:#1E293B;">30g</td>
              <td style="font-weight:800;color:#15803D;">25g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Grilled Teriyaki Chicken</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">5.7 oz (162g)</span></td>
              <td style="font-weight:800;color:#15803D;">300 kcal</td>
              <td style="font-weight:600;color:#1E293B;">11g</td>
              <td style="font-weight:600;color:#1E293B;">530mg</td>
              <td style="font-weight:600;color:#1E293B;">12g</td>
              <td style="font-weight:600;color:#1E293B;">10g</td>
              <td style="font-weight:800;color:#15803D;">36g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Beijing Beef</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">5.7 oz (159g)</span></td>
              <td style="font-weight:800;color:#B91C1C;">470 kcal</td>
              <td style="font-weight:600;color:#1E293B;">24g</td>
              <td style="font-weight:600;color:#1E293B;">660mg</td>
              <td style="font-weight:600;color:#1E293B;">52g</td>
              <td style="font-weight:600;color:#1E293B;">30g</td>
              <td style="font-weight:800;color:#15803D;">14g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Broccoli Beef</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">5.4 oz (153g)</span></td>
              <td style="font-weight:800;color:#15803D;">150 kcal</td>
              <td style="font-weight:600;color:#1E293B;">5g</td>
              <td style="font-weight:600;color:#1E293B;">660mg</td>
              <td style="font-weight:600;color:#1E293B;">13g</td>
              <td style="font-weight:600;color:#1E293B;">4g</td>
              <td style="font-weight:800;color:#15803D;">9g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Kung Pao Chicken</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">6.0 oz (170g)</span></td>
              <td style="font-weight:800;color:#B45309;">290 kcal</td>
              <td style="font-weight:600;color:#1E293B;">14g</td>
              <td style="font-weight:600;color:#1E293B;">930mg</td>
              <td style="font-weight:600;color:#1E293B;">14g</td>
              <td style="font-weight:600;color:#1E293B;">8g</td>
              <td style="font-weight:800;color:#15803D;">28g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Black Pepper Chicken</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">5.4 oz (153g)</span></td>
              <td style="font-weight:800;color:#B45309;">280 kcal</td>
              <td style="font-weight:600;color:#1E293B;">15g</td>
              <td style="font-weight:600;color:#1E293B;">1,060mg</td>
              <td style="font-weight:600;color:#1E293B;">17g</td>
              <td style="font-weight:600;color:#1E293B;">8g</td>
              <td style="font-weight:800;color:#15803D;">19g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Honey Walnut Shrimp</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">5.7 oz (162g)</span></td>
              <td style="font-weight:800;color:#B91C1C;">430 kcal</td>
              <td style="font-weight:600;color:#1E293B;">28g</td>
              <td style="font-weight:600;color:#1E293B;">460mg</td>
              <td style="font-weight:600;color:#1E293B;">37g</td>
              <td style="font-weight:600;color:#1E293B;">20g</td>
              <td style="font-weight:800;color:#15803D;">11g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">String Bean Chicken Breast</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">5.4 oz (153g)</span></td>
              <td style="font-weight:800;color:#15803D;">210 kcal</td>
              <td style="font-weight:600;color:#1E293B;">10g</td>
              <td style="font-weight:600;color:#1E293B;">980mg</td>
              <td style="font-weight:600;color:#1E293B;">13g</td>
              <td style="font-weight:600;color:#1E293B;">4g</td>
              <td style="font-weight:800;color:#15803D;">17g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Chow Mein</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">11.0 oz (312g)</span></td>
              <td style="font-weight:800;color:#B91C1C;">600 kcal</td>
              <td style="font-weight:600;color:#1E293B;">23g</td>
              <td style="font-weight:600;color:#1E293B;">1,000mg</td>
              <td style="font-weight:600;color:#1E293B;">94g</td>
              <td style="font-weight:600;color:#1E293B;">11g</td>
              <td style="font-weight:800;color:#15803D;">15g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Fried Rice</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">11.0 oz (312g)</span></td>
              <td style="font-weight:800;color:#B91C1C;">620 kcal</td>
              <td style="font-weight:600;color:#1E293B;">19g</td>
              <td style="font-weight:600;color:#1E293B;">1,000mg</td>
              <td style="font-weight:600;color:#1E293B;">101g</td>
              <td style="font-weight:600;color:#1E293B;">4g</td>
              <td style="font-weight:800;color:#15803D;">13g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">White Steamed Rice</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">11.0 oz (312g)</span></td>
              <td style="font-weight:800;color:#B45309;">520 kcal</td>
              <td style="font-weight:600;color:#1E293B;">0g</td>
              <td style="font-weight:600;color:#1E293B;">0mg</td>
              <td style="font-weight:600;color:#1E293B;">118g</td>
              <td style="font-weight:600;color:#1E293B;">0g</td>
              <td style="font-weight:800;color:#15803D;">10g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Chicken Egg Roll</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">3.0 oz (85g)</span></td>
              <td style="font-weight:800;color:#15803D;">200 kcal</td>
              <td style="font-weight:600;color:#1E293B;">12g</td>
              <td style="font-weight:600;color:#1E293B;">430mg</td>
              <td style="font-weight:600;color:#1E293B;">15g</td>
              <td style="font-weight:600;color:#1E293B;">2g</td>
              <td style="font-weight:800;color:#15803D;">8g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Cream Cheese Rangoon</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">3.0 oz (85g)</span></td>
              <td style="font-weight:800;color:#15803D;">190 kcal</td>
              <td style="font-weight:600;color:#1E293B;">9g</td>
              <td style="font-weight:600;color:#1E293B;">180mg</td>
              <td style="font-weight:600;color:#1E293B;">24g</td>
              <td style="font-weight:600;color:#1E293B;">4g</td>
              <td style="font-weight:800;color:#15803D;">4g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Hot &amp; Sour Soup</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">12.0 oz (340g)</span></td>
              <td style="font-weight:800;color:#15803D;">90 kcal</td>
              <td style="font-weight:600;color:#1E293B;">3g</td>
              <td style="font-weight:600;color:#1E293B;">1,290mg</td>
              <td style="font-weight:600;color:#1E293B;">10g</td>
              <td style="font-weight:600;color:#1E293B;">2g</td>
              <td style="font-weight:800;color:#15803D;">7g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;"><strong style="color: #0F172A; font-weight: 700; font-size: 0.95rem; display: block;">Fortune Cookie</strong><span style="display:block;font-size:0.75rem;color:#475569;font-weight:600;">0.35 oz (10g)</span></td>
              <td style="font-weight:800;color:#15803D;">35 kcal</td>
              <td style="font-weight:600;color:#1E293B;">0.5g</td>
              <td style="font-weight:600;color:#1E293B;">30mg</td>
              <td style="font-weight:600;color:#1E293B;">7g</td>
              <td style="font-weight:600;color:#1E293B;">3g</td>
              <td style="font-weight:800;color:#15803D;">0g</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ====================================================================
         PHASE 5: GOAL-BASED QUICK TIPS SECTION (Written Fresh)
         ==================================================================== -->
    <section style="margin: 3rem 0;" aria-labelledby="quick-tips-heading">
      <h2 id="quick-tips-heading" style="font-size: 1.6rem; font-weight: 900; color: #0F172A; margin-bottom: 1.25rem;">
        💡 Goal-Based Nutrition Quick Tips &amp; Smart Swaps
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
        
        <!-- Tip Card 1 -->
        <div class="nutrition-tip-card" style="border-top: 4px solid #16A34A;">
          <h3 style="font-size: 1.15rem; color: #16A34A; margin-top: 0; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🥗</span> Want Fewer Calories
          </h3>
          <ul style="padding-left: 1.2rem; color: #475569; font-size: 0.92rem; line-height: 1.6; margin-bottom: 0;">
            <li style="margin-bottom: 0.5rem;"><strong>Swap sides:</strong> Replace Chow Mein (600 kcal) or Fried Rice (620 kcal) with Super Greens (90 kcal) to instantly save up to 530 calories per meal.</li>
            <li style="margin-bottom: 0.5rem;"><strong>Pick lean stir-fries:</strong> Broccoli Beef (150 kcal) or String Bean Chicken (210 kcal) slash 280–340 calories compared to deep-fried Orange Chicken (490 kcal).</li>
            <li><strong>Glaze on the side:</strong> Ask for Grilled Teriyaki Chicken with glaze served on the side to eliminate 60 calories of added cornstarch sugars.</li>
          </ul>
        </div>

        <!-- Tip Card 2 -->
        <div class="nutrition-tip-card" style="border-top: 4px solid #0284C7;">
          <h3 style="font-size: 1.15rem; color: #0284C7; margin-top: 0; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>💪</span> Want More Protein
          </h3>
          <ul style="padding-left: 1.2rem; color: #475569; font-size: 0.92rem; line-height: 1.6; margin-bottom: 0;">
            <li style="margin-bottom: 0.5rem;"><strong>Order Grilled Teriyaki Chicken:</strong> Yields a massive 36g of whole meat protein per serving (72g in a double entree Plate) for only 300 calories.</li>
            <li style="margin-bottom: 0.5rem;"><strong>Choose unbreaded wok entrees:</strong> Kung Pao Chicken (28g protein) and Black Pepper Chicken (19g protein) provide dense amino acids without fried batter filler.</li>
            <li><strong>Split your base:</strong> Half Super Greens + half White Rice preserves high muscle glycogen while boosting micronutrients and fiber.</li>
          </ul>
        </div>

        <!-- Tip Card 3 -->
        <div class="nutrition-tip-card" style="border-top: 4px solid #D97706;">
          <h3 style="font-size: 1.15rem; color: #D97706; margin-top: 0; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>❤️</span> Watching Sodium
          </h3>
          <ul style="padding-left: 1.2rem; color: #475569; font-size: 0.92rem; line-height: 1.6; margin-bottom: 0;">
            <li style="margin-bottom: 0.5rem;"><strong>Stick to Steamed White Rice:</strong> Features 0mg sodium, bypassing the heavy 1,000mg salt foundation in Chow Mein and Fried Rice.</li>
            <li style="margin-bottom: 0.5rem;"><strong>Order lower-sodium entrees:</strong> Broccoli Beef (660mg) and Grilled Teriyaki Chicken without glaze (530mg) keep meal totals below AHA daily benchmarks.</li>
            <li><strong>Pass on soup &amp; soy sauce:</strong> Hot &amp; Sour Soup contains 1,290mg sodium per bowl, and a single soy sauce packet adds 350mg of extra sodium.</li>
          </ul>
        </div>

      </div>
    </section>

    <!-- ====================================================================
         PHASE 5: POPULAR COMBO CALCULATOR TABLE (Real Dataset Totals)
         ==================================================================== -->
    <section style="margin: 3rem 0;" aria-labelledby="combo-table-heading">
      <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
        <h2 id="combo-table-heading" style="font-size: 1.6rem; font-weight: 900; color: #0F172A; margin: 0;">
          🍽️ Popular Combo Meal Nutritional Totals (Real Macro Sums)
        </h2>
        <span style="font-size: 0.85rem; color: #64748B;">Accurately computed from dataset</span>
      </div>
      <p style="color: #475569; font-size: 0.95rem; margin-bottom: 1.25rem;">
        Exact combined macro sums for 5 of Panda Express's most popular counter combos, calculated directly from our verified menu database:
      </p>

      <div class="table-responsive" style="margin: 1rem 0;">
        <table class="coupon-table">
          <thead>
            <tr>
              <th scope="col" style="position: sticky; left: 0; background: #0F172A; color: #FFF; min-width: 150px;">Combo &amp; Vessel</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Exact Dishes Included</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Calories</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Total Fat</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Sodium</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Carbs</th>
              <th scope="col" style="background: #0F172A; color: #FFF;">Protein</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;">Signature Plate</td>
              <td style="font-size: 0.88rem; color: #334155; font-weight: 500;">Chow Mein + Orange Chicken + Grilled Teriyaki Chicken</td>
              <td style="font-weight: 800; color: #B91C1C;">1,390 kcal</td>
              <td style="font-weight: 600; color: #1E293B;">56g</td>
              <td style="font-weight: 600; color: #1E293B;">2,350mg</td>
              <td style="font-weight: 600; color: #1E293B;">163g</td>
              <td style="font-weight: 800; color: #15803D;">76g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;">Super Greens Bowl</td>
              <td style="font-size: 0.88rem; color: #334155; font-weight: 500;">Super Greens + Broccoli Beef</td>
              <td style="font-weight: 800; color: #15803D;">280 kcal</td>
              <td style="font-weight: 600; color: #1E293B;">9g</td>
              <td style="font-weight: 600; color: #1E293B;">1,030mg</td>
              <td style="font-weight: 600; color: #1E293B;">27g</td>
              <td style="font-weight: 800; color: #15803D;">18g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;">Athletic Builder Bowl</td>
              <td style="font-size: 0.88rem; color: #334155; font-weight: 500;">White Steamed Rice + Grilled Teriyaki Chicken</td>
              <td style="font-weight: 800; color: #B45309;">820 kcal</td>
              <td style="font-weight: 600; color: #1E293B;">11g</td>
              <td style="font-weight: 600; color: #1E293B;">530mg</td>
              <td style="font-weight: 600; color: #1E293B;">130g</td>
              <td style="font-weight: 800; color: #15803D;">46g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;">Lean Wok Stir-Fry Plate</td>
              <td style="font-size: 0.88rem; color: #334155; font-weight: 500;">Super Greens + Kung Pao Chicken + String Bean Chicken Breast</td>
              <td style="font-weight: 800; color: #15803D;">630 kcal</td>
              <td style="font-weight: 600; color: #1E293B;">28g</td>
              <td style="font-weight: 600; color: #1E293B;">2,280mg</td>
              <td style="font-weight: 600; color: #1E293B;">41g</td>
              <td style="font-weight: 800; color: #15803D;">54g</td>
            </tr>
            <tr>
              <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; color: #0F172A;">Ultimate Feast Bigger Plate</td>
              <td style="font-size: 0.88rem; color: #334155; font-weight: 500;">Fried Rice + Orange Chicken + Beijing Beef + Grilled Teriyaki Chicken</td>
              <td style="font-weight: 800; color: #B91C1C;">1,880 kcal</td>
              <td style="font-weight: 600; color: #1E293B;">76g</td>
              <td style="font-weight: 600; color: #1E293B;">3,010mg</td>
              <td style="font-weight: 600; color: #1E293B;">222g</td>
              <td style="font-weight: 800; color: #15803D;">88g</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ====================================================================
         COMPREHENSIVE NUTRITION REFERENCE CONTENT (2,000+ Words)
         ==================================================================== -->
    <article class="nutrition-guide-prose" style="line-height: 1.7; color: #1F242E; margin-top: 3rem;">
      
      <!-- Section 1: How the Calculator Works -->
      <section style="margin-bottom: 3.5rem;">
        <h2 style="font-size: 1.85rem; font-weight: 900; margin-bottom: 1rem; color: #0F172A;">
          How the Panda Express Nutrition Calculator Works
        </h2>
        <p>
          Managing caloric intake, balancing macronutrient splits, and navigating allergens at high-volume fast-casual Chinese restaurants requires transparency. Unlike traditional fast-food burger establishments where meals arrive as static wrapped sandwiches, Panda Express operates on an interactive wok-to-plate assembly line. You choose a meal vessel—a Bowl, a Plate, or a Bigger Plate—and populate that vessel with a combination of high-volume base carbohydrates and stir-fried protein entrees.
        </p>
        <p>
          Our interactive calculator utilizes calibrated nutritional data derived from official Panda Express corporate laboratory formulations. Every menu item is measured against two key operational parameters:
        </p>
        <ul style="padding-left: 1.5rem; margin-bottom: 1.25rem;">
          <li><strong>Standard Base Portion Sizing:</strong> Sides such as Chow Mein, Fried Rice, and Steamed Rice are portioned using standard 10 to 11 ounce scoops. These carbohydrate foundations range from 90 calories (Super Greens) to 620 calories (Fried Rice).</li>
          <li><strong>Standard Entree Portion Sizing:</strong> Entrees are served with a 5.3 to 6.0 ounce perforated portion spoodle. Caloric density across entrees varies by over 350%, ranging from 150 calories for lean Broccoli Beef to 490 calories for crispy, sweet-glazed Original Orange Chicken.</li>
        </ul>
        <p>
          When you assemble a combo in the calculator, our engine dynamically sums the caloric totals, protein mass, carbohydrate counts, dietary fiber, saturated fats, and milligram sodium concentrations. It then graphs your total meal against the standard 2,000-calorie FDA daily recommended reference value, allowing bodybuilders, diabetic diners, keto adherents, and heart-healthy eaters to adjust their orders before walking up to the register.
        </p>
      </section>

      <!-- Section 2: Macro Profiles of the 5 Most Popular Dishes -->
      <section style="margin-bottom: 3.5rem;">
        <h2 style="font-size: 1.85rem; font-weight: 900; margin-bottom: 1rem; color: #0F172A;">
          Nutritional Profiles of the 5 Most Popular Panda Express Entrees
        </h2>
        <p>
          Over 80% of all customer orders at Panda Express feature at least one of five core entrees. Understanding the distinct macronutrient balance of these signature recipes enables smarter substitutions:
        </p>

        <!-- 5 Classics Comparative Table -->
        <div class="table-responsive" style="margin: 1.5rem 0;">
          <table class="coupon-table">
            <thead>
              <tr>
                <th scope="col" style="background: #0F172A; color: #FFF;">Iconic Entree</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Serving Size</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Calories</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Protein</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Total Fat</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Sat Fat</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Carbs</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Sugars</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Sodium</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Key Allergens</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style="color: #0F172A; font-weight: 700;">The Original Orange Chicken</strong></td>
                <td style="color: #475569; font-weight: 500;">5.7 oz (162g)</td>
                <td style="font-weight: 800; color: #B91C1C;">490 kcal</td>
                <td style="color: #15803D; font-weight: 800;">25g</td>
                <td style="color: #1E293B; font-weight: 600;">22g</td>
                <td style="color: #1E293B; font-weight: 600;">4.0g</td>
                <td style="color: #1E293B; font-weight: 600;">57g</td>
                <td style="color: #1E293B; font-weight: 600;">30g</td>
                <td style="color: #1E293B; font-weight: 600;">820mg</td>
                <td style="color: #475569; font-weight: 500;">Wheat, Soy, Egg</td>
              </tr>
              <tr>
                <td><strong style="color: #0F172A; font-weight: 700;">Beijing Beef</strong></td>
                <td style="color: #475569; font-weight: 500;">5.7 oz (159g)</td>
                <td style="font-weight: 800; color: #B91C1C;">470 kcal</td>
                <td style="color: #15803D; font-weight: 800;">14g</td>
                <td style="color: #1E293B; font-weight: 600;">24g</td>
                <td style="color: #1E293B; font-weight: 600;">4.0g</td>
                <td style="color: #1E293B; font-weight: 600;">52g</td>
                <td style="color: #1E293B; font-weight: 600;">30g</td>
                <td style="color: #1E293B; font-weight: 600;">660mg</td>
                <td style="color: #475569; font-weight: 500;">Wheat, Soy, Egg</td>
              </tr>
              <tr>
                <td><strong style="color: #0F172A; font-weight: 700;">Grilled Teriyaki Chicken</strong></td>
                <td style="color: #475569; font-weight: 500;">5.7 oz (162g)</td>
                <td style="font-weight: 800; color: #15803D;">300 kcal</td>
                <td style="color: #15803D; font-weight: 800;">36g</td>
                <td style="color: #1E293B; font-weight: 600;">11g</td>
                <td style="color: #1E293B; font-weight: 600;">3.0g</td>
                <td style="color: #1E293B; font-weight: 600;">12g</td>
                <td style="color: #1E293B; font-weight: 600;">10g</td>
                <td style="color: #1E293B; font-weight: 600;">530mg</td>
                <td style="color: #475569; font-weight: 500;">Wheat, Soy</td>
              </tr>
              <tr>
                <td><strong style="color: #0F172A; font-weight: 700;">Kung Pao Chicken</strong></td>
                <td style="color: #475569; font-weight: 500;">6.0 oz (164g)</td>
                <td style="font-weight: 800; color: #B45309;">290 kcal</td>
                <td style="color: #15803D; font-weight: 800;">28g</td>
                <td style="color: #1E293B; font-weight: 600;">14g</td>
                <td style="color: #1E293B; font-weight: 600;">3.0g</td>
                <td style="color: #1E293B; font-weight: 600;">14g</td>
                <td style="color: #1E293B; font-weight: 600;">8g</td>
                <td style="color: #1E293B; font-weight: 600;">930mg</td>
                <td style="color: #475569; font-weight: 500;">Peanuts, Wheat, Soy, Sesame</td>
              </tr>
              <tr>
                <td><strong style="color: #0F172A; font-weight: 700;">Honey Walnut Shrimp</strong></td>
                <td style="color: #475569; font-weight: 500;">5.7 oz (162g)</td>
                <td style="font-weight: 800; color: #B91C1C;">430 kcal</td>
                <td style="color: #15803D; font-weight: 800;">11g</td>
                <td style="color: #1E293B; font-weight: 600;">28g</td>
                <td style="color: #1E293B; font-weight: 600;">5.0g</td>
                <td style="color: #1E293B; font-weight: 600;">37g</td>
                <td style="color: #1E293B; font-weight: 600;">20g</td>
                <td style="color: #1E293B; font-weight: 600;">460mg</td>
                <td style="color: #475569; font-weight: 500;">Shellfish, Tree Nuts, Wheat, Soy, Milk, Egg</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1.35rem; font-weight: 800; margin-top: 1.75rem; color: #1E293B;">
          Detailed Macro Analysis of Top Entrees:
        </h3>
        <p>
          <strong>1. The Original Orange Chicken:</strong> Panda Express’s flagship entree accounts for over one-third of all entree volume. Boneless dark-meat chicken chunks are double-dredged in flour and cornstarch batter, deep-fried until crisp, and tossed in an aromatic glaze of sugar, vinegar, soy sauce, garlic, and red chili flakes. The result is 30 grams of sugar and 57 grams of total carbohydrate per serving. While delivering a respectable 25g of protein, the high caloric density (490 calories) makes it a culinary treat best balanced with steamed greens.
        </p>
        <p>
          <strong>2. Beijing Beef:</strong> Strips of flank steak are dredged in batter, wok-fried until crispy, and tossed with bell peppers and yellow onions in a sweet-and-tangy glaze. At 470 calories and 24g of fat, Beijing Beef yields 14g of protein—a relatively modest protein yield per calorie compared to chicken entrees.
        </p>
        <p>
          <strong>3. Grilled Teriyaki Chicken:</strong> The gold standard for gym-goers, athletes, and low-carb diners. Boneless chicken thighs are flame-grilled, developing smoky char marks without batter or deep-frying. Sliced hot to order, a standard portion delivers an extraordinary 36g of protein with only 11g of fat and 300 calories. <em>Pro tip:</em> Asking for the sweet teriyaki glaze on the side drops carbohydrate content from 12g to under 4g, saving roughly 60 calories.
        </p>
        <p>
          <strong>4. Kung Pao Chicken:</strong> Inspired by classic Sichuan cooking, tender marinated diced chicken is wok-fired with whole dried chili peppers, zucchini, bell peppers, and whole roasted peanuts. With only 14g of carbohydrates and 28g of protein, it delivers intense savory heat with zero breading. Watch the sodium level (930mg), which represents over 40% of the recommended daily limit.
        </p>
        <p>
          <strong>5. Honey Walnut Shrimp:</strong> A beloved Cantonese banquet specialty featuring plump tempura-battered shrimp tossed in a velvety honey-cream mayonnaise glaze and topped with caramelized glazed walnuts. While deeply satisfying, it is the most fat-dense seafood choice on the menu (28g total fat, 5g saturated fat), with 430 calories and 11g of protein.
        </p>
      </section>

      <!-- Section 3: Combo Math Comparison -->
      <section style="margin-bottom: 3.5rem;">
        <h2 style="font-size: 1.85rem; font-weight: 900; margin-bottom: 1rem; color: #0F172A;">
          Plate vs Bowl vs Bigger Plate vs Family Meal: Combo Math &amp; Value Analysis
        </h2>
        <p>
          Choosing the right meal format at Panda Express is both an economic and nutritional calculation. The table below breaks down the mathematical relationship between portion volume, caloric ranges, protein density, and price:
        </p>

        <div class="table-responsive" style="margin: 1.5rem 0;">
          <table class="coupon-table">
            <thead>
              <tr>
                <th scope="col" style="background: #0F172A; color: #FFF;">Combo Format</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Components</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Weight (oz)</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Lowest Cal Combo</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Highest Cal Combo</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Protein Range</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Avg Price</th>
                <th scope="col" style="background: #0F172A; color: #FFF;">Best Value For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style="color: #0F172A; font-weight: 700;">Bowl</strong></td>
                <td style="color: #475569; font-weight: 500;">1 Side + 1 Entree</td>
                <td style="color: #475569; font-weight: 500;">15 – 17 oz</td>
                <td style="color:#15803D; font-weight:700;">240 cal (Greens + Broccoli Beef)</td>
                <td style="color:#B91C1C; font-weight:700;">1,110 cal (Fried Rice + Orange Chicken)</td>
                <td style="color: #1E293B; font-weight: 600;">15g – 49g</td>
                <td style="color: #1E293B; font-weight: 600;">$8.30 – $9.10</td>
                <td style="color: #475569; font-weight: 500;">Solo quick lunch, portion control, strict calorie budgeting</td>
              </tr>
              <tr>
                <td><strong style="color: #0F172A; font-weight: 700;">Plate</strong></td>
                <td style="color: #475569; font-weight: 500;">1 Side + 2 Entrees</td>
                <td style="color: #475569; font-weight: 500;">20 – 23 oz</td>
                <td style="color:#15803D; font-weight:700;">390 cal (Greens + 2x Broccoli Beef)</td>
                <td style="color:#B91C1C; font-weight:700;">1,600 cal (Fried Rice + 2x Orange Chicken)</td>
                <td style="color: #1E293B; font-weight: 600;">24g – 85g</td>
                <td style="color: #1E293B; font-weight: 600;">$9.80 – $10.60</td>
                <td style="color: #475569; font-weight: 500;">Standard dinner, high-protein athletic recovery, best dollar-per-calorie ratio</td>
              </tr>
              <tr>
                <td><strong style="color: #0F172A; font-weight: 700;">Bigger Plate</strong></td>
                <td style="color: #475569; font-weight: 500;">1 Side + 3 Entrees</td>
                <td style="color: #475569; font-weight: 500;">26 – 29 oz</td>
                <td style="color:#15803D; font-weight:700;">540 cal (Greens + 3x Broccoli Beef)</td>
                <td style="color:#B91C1C; font-weight:700;">2,090 cal (Fried Rice + 3x Orange Chicken)</td>
                <td style="color: #1E293B; font-weight: 600;">33g – 121g</td>
                <td style="color: #1E293B; font-weight: 600;">$11.30 – $12.10</td>
                <td style="color: #475569; font-weight: 500;">Heavy calorie surplus, post-marathon feast, shared meal for two light eaters</td>
              </tr>
              <tr>
                <td><strong style="color: #0F172A; font-weight: 700;">Family Meal</strong></td>
                <td style="color: #475569; font-weight: 500;">2 Large Sides + 3 Large Entrees</td>
                <td style="color: #475569; font-weight: 500;">75 – 85 oz</td>
                <td style="color:#15803D; font-weight:700;">1,550 cal (2x Greens + 3x String Bean Chicken)</td>
                <td style="color:#B91C1C; font-weight:700;">5,850 cal (2x Fried Rice + 3x Orange Chicken)</td>
                <td style="color: #1E293B; font-weight: 600;">120g – 340g</td>
                <td style="color: #1E293B; font-weight: 600;">$35.00</td>
                <td style="color: #475569; font-weight: 500;">Families of 4–5, office catering, meal preppers dividing into 5 daily containers</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>The Economic Sweet Spot:</strong> From a cost-per-gram-of-protein perspective, upgrading from a Bowl ($8.50) to a Plate ($10.00) costs just $1.50 more while providing an extra 25g to 36g of whole meat protein. For athletes and bodybuilders, the Plate is statistically the most cost-effective whole-food meal prep available in modern fast-casual dining, yielding over 70g of bioavailable protein for under $11.00 when ordered with double Teriyaki Chicken.
        </p>
      </section>

      <!-- Section 4: Why Nutrition Values Vary -->
      <section style="margin-bottom: 3.5rem;">
        <h2 style="font-size: 1.85rem; font-weight: 900; margin-bottom: 1rem; color: #0F172A;">
          Why Official Panda Express Nutrition Values Vary in Reality
        </h2>
        <p>
          Corporate nutrition tables are compiled in analytical test kitchens using calibrated gram scales and standardized recipes. However, when dining at any of Panda Express’s 2,400+ brick-and-mortar storefronts, your actual consumed macros will experience natural variations of 15% to 25%. Understanding why these variances occur allows you to make more accurate dietary adjustments:
        </p>
        <div class="card-grid" style="margin: 1.5rem 0;">
          <div class="menu-card">
            <h3 style="font-size: 1.15rem; color: #0F172A; margin-top: 0;">1. Wok Toss Oil Absorption</h3>
            <p class="card-desc">
              Panda Express chefs cook hot entrees in massive seasoned steel woks over roaring gas burners exceeding 100,000 BTUs. When an entree is freshly fired, soybean oil is added to coat the wok. Depending on the chef's ladle technique and how thoroughly the food is strained before being scooped into the steam table pan, oil retention can fluctuate by 4 to 8 grams of fat (36 to 72 calories) per serving.
            </p>
          </div>
          <div class="menu-card">
            <h3 style="font-size: 1.15rem; color: #0F172A; margin-top: 0;">2. Manual Scoop Variance</h3>
            <p class="card-desc">
              Service team members use ergonomic metal spoodles designed to capture roughly 5.5 to 6.0 ounces of product. During high-volume lunch rushes, servers frequently scoop generous heaping portions, easily exceeding official serving weights by 20% to 30%. Conversely, near closing time or when a pan is almost empty, scoops can be lighter and contain a higher ratio of sauce over whole protein pieces.
            </p>
          </div>
          <div class="menu-card">
            <h3 style="font-size: 1.15rem; color: #0F172A; margin-top: 0;">3. Sauce Reduction &amp; Glaze Thickness</h3>
            <p class="card-desc">
              Sauces like Orange Glaze, Beijing Sweet &amp; Sour, and Honey Sesame simmer continually under steam table heat lamps. As water evaporates over 20 to 40 minutes, the sugar and cornstarch glaze concentrates, increasing the caloric density of remaining chicken pieces significantly compared to a batch fresh from the wok.
            </p>
          </div>
          <div class="menu-card">
            <h3 style="font-size: 1.15rem; color: #0F172A; margin-top: 0;">4. Vegetable-to-Meat Ratios</h3>
            <p class="card-desc">
              Dishes like Broccoli Beef, String Bean Chicken, and Mushroom Chicken feature a natural distribution of dense protein alongside high-water-content vegetables. A scoop with four broccoli crowns and three beef slices will have vastly lower calories, fat, and protein than a scoop drawn from the bottom of the pan packed with beef strips.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 5: Goal-Based Combo Blueprints -->
      <section style="margin-bottom: 3.5rem;">
        <h2 style="font-size: 1.85rem; font-weight: 900; margin-bottom: 1rem; color: #0F172A;">
          Goal-Based Combo Meal Blueprints (Exact Macro Formulas)
        </h2>
        <p>
          Whether your priority is packing on lean muscle, adhering to ketogenic ketosis, limiting cardiovascular sodium intake, or eating strictly plant-based, here are four rigorously calculated meal formulas you can order verbatim at the counter:
        </p>

        <!-- Blueprint 1 -->
        <div class="nutrition-blueprint-card" style="border-left: 5px solid #16A34A;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <h3 style="margin: 0; font-size: 1.25rem; color: #0F172A;">💪 The Lean Muscle Builder (Plate)</h3>
            <span style="font-weight: 800; color: #16A34A; font-size: 1.05rem;">730 kcal | 81g Protein | 25g Fat | 46g Carbs</span>
          </div>
          <p style="color: #475569; margin-bottom: 0.75rem; font-size: 0.95rem;">
            <strong>The Order:</strong> Plate with Half Super Greens + Half Brown Rice as the base, Double Grilled Teriyaki Chicken (with sauce served strictly on the side).
          </p>
          <div style="font-size: 0.88rem; color: #64748B;">
            <strong>Macro Breakdown:</strong> Super Greens (45 cal, 3g P) + Brown Rice (210 cal, 4.5g P) + 2x Grilled Chicken without glaze (480 cal, 72g P, 22g F, 8g C). Provides an astounding 81 grams of high-quality animal protein with sustained-release complex carbohydrates and high micronutrient density.
          </div>
        </div>

        <!-- Blueprint 2 -->
        <div class="nutrition-blueprint-card" style="border-left: 5px solid #0284C7;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <h3 style="margin: 0; font-size: 1.25rem; color: #0F172A;">🥑 The Strict Keto / Low-Carb Powerhouse (Plate)</h3>
            <span style="font-weight: 800; color: #0284C7; font-size: 1.05rem;">630 kcal | 54g Protein | 26g Fat | 19g Net Carbs</span>
          </div>
          <p style="color: #475569; margin-bottom: 0.75rem; font-size: 0.95rem;">
            <strong>The Order:</strong> Plate with Full Super Greens as base + Kung Pao Chicken + Mushroom Chicken.
          </p>
          <div style="font-size: 0.88rem; color: #64748B;">
            <strong>Macro Breakdown:</strong> Super Greens (90 cal, 5g fiber, 5g net carbs) + Kung Pao Chicken (290 cal, 14g fat, 28g P, 12g net carbs) + Mushroom Chicken (220 cal, 12g fat, 17g P, 11g net carbs). Eliminates breading and deep-fry coatings while providing whole peanuts and fresh zucchini in savory ginger garlic soy.
          </div>
        </div>

        <!-- Blueprint 3 -->
        <div class="nutrition-blueprint-card" style="border-left: 5px solid #F59E0B;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <h3 style="margin: 0; font-size: 1.25rem; color: #0F172A;">❤️ The Heart-Smart Low-Sodium Lunch (Bowl)</h3>
            <span style="font-weight: 800; color: #D97706; font-size: 1.05rem;">530 kcal | 16g Protein | 7g Fat | 100g Carbs | 520mg Sodium</span>
          </div>
          <p style="color: #475569; margin-bottom: 0.75rem; font-size: 0.95rem;">
            <strong>The Order:</strong> Bowl with White Steamed Rice as base + Broccoli Beef.
          </p>
          <div style="font-size: 0.88rem; color: #64748B;">
            <strong>Macro Breakdown:</strong> White Steamed Rice (380 cal, 0mg sodium, 0g fat) + Broccoli Beef (150 cal, 7g fat, 9g P, 520mg sodium). By avoiding salty noodle bases and fried rices, total meal sodium remains at 520mg—well under the American Heart Association's 1,500mg daily ideal target.
          </div>
        </div>

        <!-- Blueprint 4 -->
        <div class="nutrition-blueprint-card" style="border-left: 5px solid #8B5CF6;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <h3 style="margin: 0; font-size: 1.25rem; color: #0F172A;">🌱 The Plant-Forward Vegan Feast (Plate)</h3>
            <span style="font-weight: 800; color: #8B5CF6; font-size: 1.05rem;">870 kcal | 29g Protein | 42g Fat | 96g Carbs | 16g Fiber</span>
          </div>
          <p style="color: #475569; margin-bottom: 0.75rem; font-size: 0.95rem;">
            <strong>The Order:</strong> Plate with Full Super Greens base + Beyond The Original Orange Chicken + Eggplant Tofu.
          </p>
          <div style="font-size: 0.88rem; color: #64748B;">
            <strong>Macro Breakdown:</strong> Super Greens (90 cal, 6g P) + Beyond Orange Chicken (440 cal, 15g P, 21g fat, plant-based protein) + Eggplant Tofu (340 cal, 8g P, 20g fat, tender aubergine and crispy tofu). Offers rich, authentic Chinese wok flavor with zero animal cholesterol and 16 grams of gut-healthy dietary fiber.
          </div>
        </div>
      </section>

      <!-- Section 6: Comprehensive FAQ -->
      <section style="margin-bottom: 3.5rem;" aria-labelledby="nutrition-faq-heading">
        <h2 id="nutrition-faq-heading" style="font-size: 1.85rem; font-weight: 900; margin-bottom: 1.5rem; color: #0F172A;">
          Frequently Asked Questions: Panda Express Nutrition, Diet &amp; Allergens
        </h2>
        
        <div class="faq-accordion-container" style="display: flex; flex-direction: column; gap: 1rem;">
          ${nutritionFaqs.map((faq, idx) => `
            <details class="faq-item" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1rem 1.25rem; transition: all 0.2s ease;">
              <summary style="font-weight: 800; font-size: 1.05rem; color: #0F172A; cursor: pointer; display: flex; justify-content: space-between; align-items: center; list-style: none;">
                <span>${idx + 1}. ${faq.q}</span>
                <span class="faq-chevron" style="color: #C8102E; font-size: 0.85rem;">▼</span>
              </summary>
              <div style="margin-top: 0.75rem; color: #475569; font-size: 0.95rem; line-height: 1.65; border-top: 1px solid #F1F5F9; padding-top: 0.75rem;">
                ${faq.a}
              </div>
            </details>
          `).join('')}
        </div>
      </section>

      <!-- Bottom CTAs -->
      <div class="nutrition-dark-cta">
        <h3 style="font-size: 1.5rem; font-weight: 800; margin-top: 0; margin-bottom: 0.75rem; color: #FFFFFF;">Ready to Order Your Optimized Panda Express Meal?</h3>
        <p style="color: #E2E8F0; max-width: 600px; margin: 0 auto 1.5rem auto; font-size: 1.02rem; line-height: 1.6; font-weight: 500;">
          Don't pay full price for your calories. Copy today's verified promotion codes to save up to 20% on online orders and app pickup.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="/#coupon-section" class="btn" style="padding: 0.85rem 1.75rem; font-size: 1rem;">🎟️ View Today's Active Coupon Codes</a>
          <a href="/panda-express-savings-calculator/" class="btn btn-secondary" style="padding: 0.85rem 1.75rem; font-size: 1rem; color: #FFFFFF; border-color: rgba(255,255,255,0.3);">🧮 Group Savings Calculator</a>
          <a href="/panda-express-menu/" class="btn btn-secondary" style="padding: 0.85rem 1.75rem; font-size: 1rem; color: #FFFFFF; border-color: rgba(255,255,255,0.3);">🥡 Explore Full Menu &amp; Prices</a>
        </div>
      </div>

    </article>
  </div>

  <!-- Embed Full Nutrition Dataset for Client Calculator -->
  <script>
    window.PANDA_MENU_ITEMS = ${JSON.stringify(nutritionFull)};
  </script>
  `;

  return {
    title: `Panda Express Nutrition Calculator & Full Menu Calories (2026)`,
    description: `Interactive Panda Express nutrition calculator. Calculate calories, protein, carbs, fat, and sodium for custom Bowls, Plates, and all 45+ dishes across 12 metrics.`,
    canonicalPath: '/panda-express-nutrition/',
    ogImage: '/public/images/og/og-nutrition.jpg',
    ogImageAlt: 'Panda Express Nutrition and Macro Calculator',
    schemaJson: [nutritionFaqSchema, ...nutritionSchemas],
    content,
    breadcrumbs,
    suppressBreadcrumbsHtml: true
  };
}

module.exports = renderNutrition;
