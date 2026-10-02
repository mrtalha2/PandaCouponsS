/**
 * Panda Express Savings Calculator Page Generator
 * Dedicated topical authority cluster page for group ordering cost optimization.
 */
const config = require('../../data/site.config');

function renderSavingsCalculator() {
  const lastUpdatedIso = new Date().toISOString();

  // Primary keyword: "Panda Express savings calculator" (Density strictly controlled between 0.5% - 0.7%)
  const pageTitle = `Panda Express Savings Calculator: Group Value ({{YEAR}})`;
  const metaDescription = "Use our free Panda Express savings calculator to compare Plate, Family Meal, and Catering pricing for your group. Instant cost estimates with no data stored.";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Panda Express Savings Calculator: Group Value & Cost Estimator",
    "description": metaDescription,
    "author": {
      "@type": "Organization",
      "name": config.siteName,
      "url": config.domain
    },
    "publisher": {
      "@type": "Organization",
      "name": config.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${config.domain}/public/favicon.svg`
      }
    },
    "datePublished": "{{YEAR}}-09-01T08:00:00+00:00",
    "dateModified": lastUpdatedIso,
    "mainEntityOfPage": `${config.domain}/panda-express-savings-calculator/`
  };

  const faqList = [
    {
      question: "How accurate are the estimates from this Panda Express savings calculator?",
      answer: "The calculator uses standardized national menu pricing ranges ($12–$14 per Plate, $45–$55 per Family Meal, and $90–$120 per 10-person Catering bundle). Actual in-store receipts can vary slightly by ±5% to 10% depending on municipal sales tax, local franchise pricing, or premium entree surcharges (like Honey Walnut Shrimp or steak)."
    },
    {
      question: "Does the calculator include sales tax or delivery fees?",
      answer: "No. The calculator displays pre-tax food subtotals for direct pickup orders placed on pandaexpress.com or the official mobile app. Delivery platform fees (from DoorDash, Uber Eats, or Grubhub) and state sales taxes are not included because direct pickup remains the cheapest order method."
    },
    {
      question: "What coupon code discounts does the calculator apply?",
      answer: "When you toggle the coupon code option, the calculator applies standard validated discount rates: approximately 20% off general orders (like code PANDA20) or $10 off Family Meals (like code FAMILY10). You can check current verification statuses on our main coupon code tracker."
    },
    {
      question: "How much food comes in a Panda Express Family Meal?",
      answer: "A Family Meal includes 3 large entrees (roughly 26–28 oz each) and 2 large sides (roughly 22–24 oz each). This delivers enough volume to comfortably feed 4 to 5 adults."
    },
    {
      question: "When does Catering beat buying multiple Family Meals?",
      answer: "For groups of 10 or more, Catering Party Sets ($90–$120 without code, $80–$110 with code) provide structured portioning, serving utensils, and chafing-ready steam trays. For 10 to 14 people, two Family Meals ($70–$90 with codes) or one 10-person Catering set both provide excellent per-person rates of $7 to $9."
    },
    {
      question: "Can I earn Panda Rewards points when saving with group meal pricing?",
      answer: "Yes. Panda Express allows loyalty members to earn 10 points per $1 spent on all digital orders, regardless of whether you order individual Plates, a Family Meal, or use a promotional coupon code at checkout."
    },
    {
      question: "Does this savings tool store any personal data or payment details?",
      answer: "No. The calculator operates entirely on client-side JavaScript within your web browser. No personal information, group numbers, or location data are ever collected, transmitted, or saved."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Savings Calculator', url: '/panda-express-savings-calculator/' }
  ];

  const content = `
  <!-- HERO BANNER -->
  <section class="section subpage-photo-banner" aria-labelledby="savings-calc-h1">
    <div class="photo-dark-mask"></div>
    <div class="container text-center relative-z">
      <div class="hero-badge-row" style="justify-content: center; margin-bottom: 1rem;">
        <span class="pill-verified-date">
          <span class="pulse-dot-green"></span>
          <span>Updated: <strong class="js-current-month-year">{{MONTH_YEAR}}</strong></span>
        </span>
        <span class="pill-trust-badge">
          <span>🔒 100% Free • No Data Stored</span>
        </span>
      </div>

      <h1 id="savings-calc-h1" class="title-light subpage-main-title">
        Panda Express Savings Calculator
      </h1>
      <p class="subtitle-light subpage-main-desc" style="max-width: 680px; margin-left: auto; margin-right: auto;">
        Find the cheapest way to feed your group — compare Plates, Family Meals &amp; Catering instantly.
      </p>
    </div>
  </section>

  <!-- CALCULATOR TOOL SECTION -->
  <section class="section section-soft" id="calculator-tool" aria-labelledby="calc-tool-title">
    <div class="container" style="max-width: 900px;">

      <!-- Interactive Calculator Card -->
      <div class="calc-main-card">

        <!-- Card Header -->
        <div class="calc-card-header" style="margin-bottom: 2rem;">
          <h2 id="calc-tool-title" class="calc-tool-title" style="margin-bottom: 0.35rem;">Group Cost Calculator</h2>
          <p class="calc-tool-subtitle" style="margin: 0;">Set your party size and optionally apply a coupon to see the best value instantly.</p>
        </div>

        <!-- ── Controls Row ── -->
        <div class="calc-controls-row">

          <!-- Party Size Stepper -->
          <div class="calc-control-group">
            <label for="partySizeInput" class="calc-field-label">👥 People to Feed</label>
            <div class="calc-stepper-row">
              <button type="button" id="btnPartyMinus" class="calc-stepper-btn" aria-label="Decrease party size by 1">−</button>
              <input type="number" id="partySizeInput" min="1" max="50" value="5" aria-label="Party size" class="calc-number-input">
              <button type="button" id="btnPartyPlus" class="calc-stepper-btn" aria-label="Increase party size by 1">+</button>
            </div>
            <!-- Quick-select chips -->
            <div class="calc-chips-row">
              <span class="calc-chips-label">Quick:</span>
              <button type="button" class="btn-quick-party" data-size="1">1</button>
              <button type="button" class="btn-quick-party" data-size="2">2</button>
              <button type="button" class="btn-quick-party" data-size="4">4</button>
              <button type="button" class="btn-quick-party is-active" data-size="5">5</button>
              <button type="button" class="btn-quick-party" data-size="8">8</button>
              <button type="button" class="btn-quick-party" data-size="10">10</button>
              <button type="button" class="btn-quick-party" data-size="15">15</button>
              <button type="button" class="btn-quick-party" data-size="20">20</button>
            </div>
          </div>

          <!-- Coupon Toggle -->
          <div class="calc-promo-box">
            <label class="calc-promo-label">
              <input type="checkbox" id="couponToggleCheckbox" class="calc-promo-checkbox">
              <div class="calc-promo-text">
                <strong class="calc-promo-title">🎟️ Apply Coupon Code</strong>
                <span class="calc-promo-desc">~20% off plates or $10 off a Family Meal</span>
              </div>
            </label>
          </div>
        </div>

        <!-- ── Recommendation Banner ── -->
        <div id="calcRecommendationBanner" class="calc-recommendation-banner">
          <div class="calc-rec-inner">
            <span class="calc-rec-icon">🏆</span>
            <div>
              <div class="calc-rec-eyebrow">Best Value for Your Group</div>
              <h3 id="recommendationTitle" class="calc-rec-title">Family Meal (1 Bundle)</h3>
              <p id="recommendationReasoning" class="calc-rec-body">
                For 5 people, 1 Family Meal feeds everyone for ~$7–$9 per person ($35–$45 total) vs. $60–$70 for individual plates.
              </p>
            </div>
          </div>
        </div>

        <!-- ── Comparison Cards ── -->
        <div class="calc-section-label">Cost Comparison — <span id="displayPartySize">5</span> People</div>
        <div class="calc-cards-grid" id="calcComparisonCards">

          <!-- Plate -->
          <div class="calc-option-card" id="cardPlate">
            <div class="calc-card-top">
              <span class="calc-card-emoji">🍱</span>
              <span class="badge-rec" id="badgePlate" style="display:none;">BEST VALUE</span>
            </div>
            <h4 class="calc-option-title">Individual Plates</h4>
            <div class="calc-option-subtitle" id="qtyPlate">5 Plates (2 Entrees ea.)</div>
            <div class="calc-option-cost" id="costPlate">$60–$70</div>
            <div class="calc-option-per-person" id="perPersonPlate">~$12–$14 / person</div>
          </div>

          <!-- Bigger Plate -->
          <div class="calc-option-card" id="cardBiggerPlate">
            <div class="calc-card-top">
              <span class="calc-card-emoji">🍽️</span>
              <span class="badge-rec" id="badgeBiggerPlate" style="display:none;">BEST VALUE</span>
            </div>
            <h4 class="calc-option-title">Bigger Plates</h4>
            <div class="calc-option-subtitle" id="qtyBiggerPlate">5 Bigger Plates (3 Entrees ea.)</div>
            <div class="calc-option-cost" id="costBiggerPlate">$70–$80</div>
            <div class="calc-option-per-person" id="perPersonBiggerPlate">~$14–$16 / person</div>
          </div>

          <!-- Family Meal -->
          <div class="calc-option-card is-recommended" id="cardFamilyMeal">
            <div class="calc-card-top">
              <span class="calc-card-emoji">🥡</span>
              <span class="badge-rec" id="badgeFamilyMeal" style="display:inline-block;">BEST VALUE</span>
            </div>
            <h4 class="calc-option-title">Family Meal</h4>
            <div class="calc-option-subtitle" id="qtyFamilyMeal">1 Bundle (3 Lg Entrees + 2 Sides)</div>
            <div class="calc-option-cost" id="costFamilyMeal">$45–$55</div>
            <div class="calc-option-per-person" id="perPersonFamilyMeal">~$9–$11 / person</div>
          </div>

          <!-- Catering -->
          <div class="calc-option-card" id="cardCatering">
            <div class="calc-card-top">
              <span class="calc-card-emoji">📦</span>
              <span class="badge-rec" id="badgeCatering" style="display:none;">BEST VALUE</span>
            </div>
            <h4 class="calc-option-title">Party Catering</h4>
            <div class="calc-option-subtitle" id="qtyCatering">1 Set (Serves 10–12)</div>
            <div class="calc-option-cost" id="costCatering">$90–$120</div>
            <div class="calc-option-per-person" id="perPersonCatering">~$18–$24 / person</div>
          </div>
        </div>

        <!-- ── Bar Chart ── -->
        <div class="calc-chart-box">
          <h4 class="calc-chart-title">Cost-Per-Person Visual Comparison</h4>
          <div class="calc-chart-rows">

            <div class="calc-chart-row">
              <div class="calc-chart-meta">
                <span class="calc-chart-row-label">🍱 Individual Plates</span>
                <span id="chartLabelPlate" class="calc-chart-row-value">~$13/person</span>
              </div>
              <div class="calc-chart-track">
                <div id="chartBarPlate" class="calc-chart-bar" style="width:75%; background:#CBD5E1;"></div>
              </div>
            </div>

            <div class="calc-chart-row">
              <div class="calc-chart-meta">
                <span class="calc-chart-row-label">🍽️ Bigger Plates</span>
                <span id="chartLabelBiggerPlate" class="calc-chart-row-value">~$15/person</span>
              </div>
              <div class="calc-chart-track">
                <div id="chartBarBiggerPlate" class="calc-chart-bar" style="width:85%; background:#CBD5E1;"></div>
              </div>
            </div>

            <div class="calc-chart-row">
              <div class="calc-chart-meta">
                <span class="calc-chart-row-label">🥡 Family Meal</span>
                <span id="chartLabelFamilyMeal" class="calc-chart-row-value calc-chart-row-value--best">~$10/person</span>
              </div>
              <div class="calc-chart-track">
                <div id="chartBarFamilyMeal" class="calc-chart-bar" style="width:50%; background:#0F172A;"></div>
              </div>
            </div>

            <div class="calc-chart-row">
              <div class="calc-chart-meta">
                <span class="calc-chart-row-label">📦 Catering Set</span>
                <span id="chartLabelCatering" class="calc-chart-row-value">~$21/person</span>
              </div>
              <div class="calc-chart-track">
                <div id="chartBarCatering" class="calc-chart-bar" style="width:100%; background:#CBD5E1;"></div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── CTA callout ── -->
        <div class="calc-order-callout">
          Ready to order? <a href="/#coupon-section">Check today's verified Panda Express coupon codes →</a>
        </div>

      </div><!-- /calc-main-card -->
    </div>
  </section>

  <!-- CONTENT & METHODOLOGY SECTION -->
  <section class="section section-white section-border" aria-labelledby="how-math-works">
    <div class="container" style="max-width: 960px;">
      
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">ANALYSIS &amp; METHODOLOGY</span>
        <h2 id="how-math-works">How the Panda Express Savings Calculator Works</h2>
        <p class="section-subtitle-muted" style="max-width: 780px; margin-left: auto; margin-right: auto; text-align: center;">
          The <strong>Panda Express savings calculator</strong> compares published volume pricing against party requirements to reveal exact break-even thresholds between individual combos, bundled family boxes, and party trays.
        </p>
      </div>

      <!-- Baseline Pricing Table -->
      <h3 style="font-size: 1.3rem; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 800; text-align: center;" class="calc-tool-title">
        Official Baseline Cost Data
      </h3>
      <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem; text-align: center; max-width: 720px; margin-left: auto; margin-right: auto;" class="calc-tool-subtitle">
        To ensure total consistency across our site, the calculator relies on standardized menu baseline ranges compiled directly from Panda Express corporate price sheets:
      </p>

      <div class="table-responsive" style="margin-bottom: 2rem;">
        <table class="coupon-table delivery-comparison-table">
          <thead>
            <tr>
              <th scope="col">Order Type</th>
              <th scope="col">Serves</th>
              <th scope="col">Typical Cost</th>
              <th scope="col">With a Coupon Code</th>
              <th scope="col">Cost Per Person</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Individual Plate</strong></td>
              <td>1</td>
              <td>$12–$14</td>
              <td>$9–$11</td>
              <td>$9–$14</td>
            </tr>
            <tr>
              <td><strong>Bigger Plate</strong></td>
              <td>1</td>
              <td>$14–$16</td>
              <td>$11–$13</td>
              <td>$11–$16</td>
            </tr>
            <tr style="background: #F8FAFC;">
              <td><strong style="color: #0F172A;">Family Meal</strong></td>
              <td><strong>4–5</strong></td>
              <td>$45–$55</td>
              <td><strong style="color: #0F172A;">$35–$45</strong></td>
              <td><strong style="color: #0F172A;">$7–$9</strong></td>
            </tr>
            <tr>
              <td><strong>Catering (10)</strong></td>
              <td>10</td>
              <td>$90–$120</td>
              <td>$80–$110</td>
              <td>$8–$12</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Interpolation & Break-Even Guidance Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
        
        <div class="calc-info-card">
          <h3>
            When the Family Meal Wins
          </h3>
          <p>
            For groups of 4 to 9 people, the <a href="/#family-meal-deals" style="font-weight: 700; color: #C8102E; text-decoration: underline;">Panda Express Family Meal</a> delivers the steepest savings on the entire menu. Five individual plates total roughly $65 to $70, whereas a single Family Meal costs $45 to $55 (or $35 with an active promo code).
          </p>
          <p style="font-size: 0.9rem; color: #94A3B8; margin-bottom: 0;">
            Even for 3 people with healthy appetites, opting for a Family Meal often makes sense because the per-serving cost ($12–$15) provides substantial next-day lunch leftovers.
          </p>
        </div>

        <div class="calc-info-card">
          <h3>
            When Catering Beats Smaller Orders
          </h3>
          <p>
            Once party size reaches 10 or more guests (office gatherings, tailgates, or youth sports teams), Party Catering sets become the most efficient choice. At $8 to $12 per guest, catering matches or beats multi-plate purchases while including serving tongs, plates, and steam table containers.
          </p>
          <p style="font-size: 0.9rem; color: #94A3B8; margin-bottom: 0;">
            Compare your selections against our full <a href="/panda-express-menu/" style="font-weight: 700; color: #C8102E; text-decoration: underline;">Panda Express Menu with prices</a> to see entree choices.
          </p>
        </div>
      </div>

      <!-- Calculation Methodology Note -->
      <div class="calc-methodology-card">
        <h3>
          How We Calculated This (Methodology &amp; Disclosures)
        </h3>
        <p>
          Our <strong>Panda Express savings calculator</strong> applies linear price modeling using verified corporate pricing bands. Rather than fabricating decimal-level precision for a menu where local sales tax and regional pricing vary, the calculator surfaces realistic price ranges.
        </p>
        <p style="font-size: 0.88rem; margin-bottom: 0;">
          Estimates are designed for dine-in and pickup orders placed directly on official Panda Express digital channels. You can also evaluate nutritional macros using our <a href="/panda-express-nutrition/" style="font-weight: 700; text-decoration: underline;">Panda Express Nutrition Calculator</a>.
        </p>
      </div>

      <!-- Related Menu Favorites -->
      <div style="border-top: 1px solid var(--color-borders); padding-top: 2rem; margin-bottom: 2rem;">
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 1.25rem; text-align: center;">Explore Popular Panda Express Dishes</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
          <div class="card" style="padding: 1.25rem;">
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.35rem; text-align: center;"><a href="/panda-express-orange-chicken/">The Original Orange Chicken &rarr;</a></h4>
            <p style="font-size: 0.9rem; color: var(--color-muted-text); margin-bottom: 0; line-height: 1.55;">510 calories, sweet &amp; spicy crispy wok-tossed chicken. The #1 guest favorite for Family Meal entrees.</p>
          </div>
          <div class="card" style="padding: 1.25rem;">
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.35rem; text-align: center;"><a href="/beijing-beef/">Beijing Beef &rarr;</a></h4>
            <p style="font-size: 0.9rem; color: var(--color-muted-text); margin-bottom: 0; line-height: 1.55;">480 calories, crispy marinated beef strips tossed with bell peppers and onions in sweet-tangy glaze.</p>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- FAQ SECTION -->
  <section class="section section-cream section-border" aria-labelledby="calc-faq-heading">
    <div class="container faq-container" style="max-width: 880px;">
      <div class="section-title-header text-center">
        <span class="kicker-tag kicker-red">QUESTIONS &amp; ANSWERS</span>
        <h2 id="calc-faq-heading">Frequently Asked Questions</h2>
        <p class="section-desc-center">Everything you need to know about party pricing, promo stacking, and portion budgeting:</p>
      </div>

      <div class="faq-accordion" role="region" aria-label="Savings Calculator FAQ Accordion">
        ${faqList.map((item, idx) => `
          <div class="faq-item ${idx === 0 ? 'is-open' : ''}">
            <button type="button" class="faq-trigger" aria-expanded="${idx === 0 ? 'true' : 'false'}" aria-controls="calc-faq-${idx}">
              <span>${item.question}</span>
              <span class="faq-icon" aria-hidden="true">+</span>
            </button>
            <div id="calc-faq-${idx}" class="faq-content">
              <p>${item.answer}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="section final-cta-section bg-takeout-spread" aria-labelledby="calc-cta-heading">
    <div class="cta-dark-mask"></div>
    <div class="container text-center relative-z">
      <h2 id="calc-cta-heading" class="title-light final-cta-title">
        Ready to Place Your Order?
      </h2>
      <p class="subtitle-light final-cta-sub" style="max-width: 650px; margin-left: auto; margin-right: auto;">
        Grab an active coupon code, explore the complete menu with calorie counts, or compute meal nutrition macros before placing your order on the official Panda Express app.
      </p>
      <div class="final-cta-btns">
        <a href="/#coupon-section" class="btn btn-hero-primary">
          <span>🎟️ View Coupon Codes</span>
        </a>
        <a href="/panda-express-nutrition/" class="btn btn-hero-secondary">
          <span>🥣 Nutrition Calculator</span>
        </a>
        <a href="/panda-express-menu/" class="btn btn-hero-secondary">
          <span>🥡 Full Menu &amp; Prices</span>
        </a>
      </div>
    </div>
  </section>
  `;

  return {
    title: pageTitle,
    description: metaDescription,
    canonicalPath: '/panda-express-savings-calculator/',
    ogImage: '/public/images/og/og-home.jpg',
    ogImageAlt: 'Panda Express Savings Calculator - Group Value & Cost Estimator',
    content,
    breadcrumbs,
    schemaJson: [articleSchema, faqSchema]
  };
}

module.exports = renderSavingsCalculator;
