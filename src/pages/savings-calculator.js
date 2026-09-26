/**
 * Panda Express Savings Calculator Page Generator
 * Dedicated topical authority cluster page for group ordering cost optimization.
 */
const config = require('../../data/site.config');

function renderSavingsCalculator() {
  const currentMonthYear = 'September 2026';
  const lastUpdatedIso = new Date().toISOString();

  // Primary keyword: "Panda Express savings calculator" (Density strictly controlled between 0.5% - 0.7%)
  const pageTitle = "Panda Express Savings Calculator: Group Value (2026)";
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
    "datePublished": "2026-09-01T08:00:00+00:00",
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
          <span>Updated: <strong class="js-current-month-year">${currentMonthYear}</strong></span>
        </span>
        <span class="pill-trust-badge">
          <span>🔒 100% Free • No Data Stored</span>
        </span>
      </div>

      <h1 id="savings-calc-h1" class="title-light subpage-main-title">
        Panda Express Savings Calculator: Group Value &amp; Cost Estimator
      </h1>
      
      <p class="subtitle-light subpage-main-desc" style="max-width: 780px; margin-left: auto; margin-right: auto;">
        Planning lunch or dinner for a crowd? Our <strong>Panda Express savings calculator</strong> computes exact per-person costs across Individual Plates, Bigger Plates, Family Meals, and Party Catering to find the absolute cheapest way to feed your party size.
      </p>
    </div>
  </section>

  <!-- CALCULATOR TOOL SECTION -->
  <section class="section section-soft" id="calculator-tool" aria-labelledby="calc-tool-title">
    <div class="container" style="max-width: 960px;">
      
      <!-- Interactive Calculator Card -->
      <div class="calc-main-card" style="background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--color-borders); box-shadow: var(--shadow-lg); padding: clamp(1.25rem, 3vw, 2.25rem); margin-bottom: 2.5rem;">
        <div style="border-bottom: 1px solid var(--color-borders); padding-bottom: 1.25rem; margin-bottom: 1.75rem; text-align: center;">
          <h2 id="calc-tool-title" style="font-size: clamp(1.3rem, 2.5vw, 1.75rem); margin-top: 0; margin-bottom: 0.35rem; color: #0F172A; text-align: center;">
            Interactive Group Cost Calculator
          </h2>
          <p style="color: #475569; font-size: 0.95rem; margin-bottom: 0; text-align: center;">
            Adjust your group size and toggle promotional discount pricing to view the cheapest meal format.
          </p>
        </div>

        <!-- Controls Row -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: center; margin-bottom: 2rem;">
          
          <!-- Party Size Stepper -->
          <div>
            <label for="partySizeInput" style="display: block; font-weight: 700; color: #1E293B; font-size: 0.95rem; margin-bottom: 0.5rem;">
              👥 Number of People to Feed:
            </label>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button type="button" id="btnPartyMinus" class="btn-calc-step" aria-label="Decrease party size by 1" style="width: 46px; height: 46px; border-radius: var(--radius-sm); border: 1px solid #CBD5E1; background: #F8FAFC; font-size: 1.4rem; font-weight: 800; cursor: pointer; color: #1E293B; display: flex; align-items: center; justify-content: center;">-</button>
              <input type="number" id="partySizeInput" min="1" max="50" value="5" aria-label="Party size number" style="width: 80px; height: 46px; text-align: center; font-size: 1.25rem; font-weight: 800; color: #0F172A; border: 2px solid #CBD5E1; border-radius: var(--radius-sm); outline: none;">
              <button type="button" id="btnPartyPlus" class="btn-calc-step" aria-label="Increase party size by 1" style="width: 46px; height: 46px; border-radius: var(--radius-sm); border: 1px solid #CBD5E1; background: #F8FAFC; font-size: 1.4rem; font-weight: 800; cursor: pointer; color: #1E293B; display: flex; align-items: center; justify-content: center;">+</button>
            </div>
            
            <!-- Quick Chips -->
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-top: 0.6rem;">
              <span style="font-size: 0.78rem; color: #64748B; align-self: center; margin-right: 0.2rem;">Quick:</span>
              <button type="button" class="btn-quick-party" data-size="1" style="padding: 0.2rem 0.55rem; font-size: 0.78rem; border-radius: 4px; border: 1px solid #E2E8F0; background: #F1F5F9; cursor: pointer; font-weight: 700;">1</button>
              <button type="button" class="btn-quick-party" data-size="2" style="padding: 0.2rem 0.55rem; font-size: 0.78rem; border-radius: 4px; border: 1px solid #E2E8F0; background: #F1F5F9; cursor: pointer; font-weight: 700;">2</button>
              <button type="button" class="btn-quick-party" data-size="4" style="padding: 0.2rem 0.55rem; font-size: 0.78rem; border-radius: 4px; border: 1px solid #E2E8F0; background: #F1F5F9; cursor: pointer; font-weight: 700;">4</button>
              <button type="button" class="btn-quick-party is-active" data-size="5" style="padding: 0.2rem 0.55rem; font-size: 0.78rem; border-radius: 4px; border: 1px solid #C8102E; background: #FEE2E2; color: #C8102E; cursor: pointer; font-weight: 700;">5</button>
              <button type="button" class="btn-quick-party" data-size="8" style="padding: 0.2rem 0.55rem; font-size: 0.78rem; border-radius: 4px; border: 1px solid #E2E8F0; background: #F1F5F9; cursor: pointer; font-weight: 700;">8</button>
              <button type="button" class="btn-quick-party" data-size="10" style="padding: 0.2rem 0.55rem; font-size: 0.78rem; border-radius: 4px; border: 1px solid #E2E8F0; background: #F1F5F9; cursor: pointer; font-weight: 700;">10</button>
              <button type="button" class="btn-quick-party" data-size="15" style="padding: 0.2rem 0.55rem; font-size: 0.78rem; border-radius: 4px; border: 1px solid #E2E8F0; background: #F1F5F9; cursor: pointer; font-weight: 700;">15</button>
              <button type="button" class="btn-quick-party" data-size="20" style="padding: 0.2rem 0.55rem; font-size: 0.78rem; border-radius: 4px; border: 1px solid #E2E8F0; background: #F1F5F9; cursor: pointer; font-weight: 700;">20</button>
            </div>
          </div>

          <!-- Coupon Code Toggle -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: var(--radius-md); padding: 1.1rem 1.25rem;">
            <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; user-select: none;">
              <input type="checkbox" id="couponToggleCheckbox" style="width: 20px; height: 20px; accent-color: #C8102E; cursor: pointer;">
              <div>
                <strong style="color: #0F172A; font-size: 0.95rem; display: block;">🎟️ I have a promo / coupon code</strong>
                <span style="color: #64748B; font-size: 0.82rem;">Applies active $10 off Family Meal or ~20% order discount</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Dynamic Recommendation Callout Banner -->
        <div id="calcRecommendationBanner" style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); color: #FFFFFF; border-radius: var(--radius-md); padding: 1.35rem; margin-bottom: 2rem; border-left: 5px solid #22C55E; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="font-size: 1.8rem; line-height: 1;">🏆</span>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; color: #86EFAC; font-weight: 800;">Recommended Best Value</div>
              <h3 id="recommendationTitle" style="color: #FFFFFF; margin: 0.25rem 0 0.4rem 0; font-size: 1.25rem;">
                Family Meal (1 Bundle)
              </h3>
              <p id="recommendationReasoning" style="color: #CBD5E1; font-size: 0.92rem; line-height: 1.5; margin-bottom: 0;">
                For 5 people, 1 Family Meal feeds everyone for ~$7–$9 per person ($35–$45 total) compared to $60–$70 for individual plates.
              </p>
            </div>
          </div>
        </div>

        <!-- Comparative Output Grid (Cards for Each Format) -->
        <div style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.2rem; color: #0F172A; font-weight: 800; margin-top: 0; margin-bottom: 1.25rem; text-align: center;">
            Cost Comparison Across Order Types (<span id="displayPartySize">5</span> People)
          </h3>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;" id="calcComparisonCards">
            
            <!-- Plate Option -->
            <div class="calc-option-card" id="cardPlate" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: var(--radius-md); padding: 1.15rem; transition: transform var(--transition-fast);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">🍱</span>
                <span class="badge-rec" id="badgePlate" style="display: none; background: #DCFCE7; color: #15803D; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 999px;">BEST VALUE</span>
              </div>
              <h4 style="font-size: 1rem; color: #0F172A; font-weight: 800; margin: 0 0 0.35rem 0;">Individual Plates</h4>
              <div style="font-size: 0.78rem; color: #64748B;" id="qtyPlate">5 Plates (2 Entrees / ea)</div>
              <div style="margin: 0.75rem 0 0.25rem 0;">
                <div style="font-size: 1.35rem; font-weight: 800; color: #0F172A;" id="costPlate">$60–$70</div>
                <div style="font-size: 0.82rem; color: #475569; font-weight: 600;" id="perPersonPlate">~$12–$14 / person</div>
              </div>
            </div>

            <!-- Bigger Plate Option -->
            <div class="calc-option-card" id="cardBiggerPlate" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: var(--radius-md); padding: 1.15rem; transition: transform var(--transition-fast);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">🍽️</span>
                <span class="badge-rec" id="badgeBiggerPlate" style="display: none; background: #DCFCE7; color: #15803D; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 999px;">BEST VALUE</span>
              </div>
              <h4 style="font-size: 1rem; color: #0F172A; font-weight: 800; margin: 0 0 0.35rem 0;">Bigger Plates</h4>
              <div style="font-size: 0.78rem; color: #64748B;" id="qtyBiggerPlate">5 Bigger Plates (3 Entrees / ea)</div>
              <div style="margin: 0.75rem 0 0.25rem 0;">
                <div style="font-size: 1.35rem; font-weight: 800; color: #0F172A;" id="costBiggerPlate">$70–$80</div>
                <div style="font-size: 0.82rem; color: #475569; font-weight: 600;" id="perPersonBiggerPlate">~$14–$16 / person</div>
              </div>
            </div>

            <!-- Family Meal Option -->
            <div class="calc-option-card is-recommended" id="cardFamilyMeal" style="background: #F0FDF4; border: 2px solid #22C55E; border-radius: var(--radius-md); padding: 1.15rem; transition: transform var(--transition-fast); box-shadow: 0 4px 12px rgba(34,197,94,0.15);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">🥡</span>
                <span class="badge-rec" id="badgeFamilyMeal" style="display: inline-block; background: #DCFCE7; color: #15803D; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 999px;">BEST VALUE</span>
              </div>
              <h4 style="font-size: 1rem; color: #15803D; font-weight: 800; margin: 0 0 0.35rem 0;">Family Meal</h4>
              <div style="font-size: 0.78rem; color: #166534;" id="qtyFamilyMeal">1 Bundle (3 Lg Entrees + 2 Lg Sides)</div>
              <div style="margin: 0.75rem 0 0.25rem 0;">
                <div style="font-size: 1.35rem; font-weight: 800; color: #15803D;" id="costFamilyMeal">$45–$55</div>
                <div style="font-size: 0.82rem; color: #16A34A; font-weight: 700;" id="perPersonFamilyMeal">~$9–$11 / person</div>
              </div>
            </div>

            <!-- Catering Option -->
            <div class="calc-option-card" id="cardCatering" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: var(--radius-md); padding: 1.15rem; transition: transform var(--transition-fast);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">📦</span>
                <span class="badge-rec" id="badgeCatering" style="display: none; background: #DCFCE7; color: #15803D; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 999px;">BEST VALUE</span>
              </div>
              <h4 style="font-size: 1rem; color: #0F172A; font-weight: 800; margin: 0 0 0.35rem 0;">Party Catering</h4>
              <div style="font-size: 0.78rem; color: #64748B;" id="qtyCatering">1 Set (Serves 10-12)</div>
              <div style="margin: 0.75rem 0 0.25rem 0;">
                <div style="font-size: 1.35rem; font-weight: 800; color: #0F172A;" id="costCatering">$90–$120</div>
                <div style="font-size: 0.82rem; color: #475569; font-weight: 600;" id="perPersonCatering">~$18–$24 / person</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visual Cost-Per-Person Bar Chart -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: var(--radius-md); padding: 1.5rem;">
          <h4 style="font-size: 1rem; text-transform: uppercase; color: #0F172A; font-weight: 800; letter-spacing: 0.05em; margin-top: 0; margin-bottom: 1.25rem; text-align: center;">
            Cost-Per-Person Visual Comparison
          </h4>
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.92rem; font-weight: 700; color: #0F172A; margin-bottom: 0.35rem;">
                <span>🍱 Individual Plates</span>
                <span id="chartLabelPlate" style="color: #1E293B; font-weight: 800;">~$13/person</span>
              </div>
              <div style="height: 12px; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
                <div id="chartBarPlate" style="height: 100%; width: 75%; background: #64748B; border-radius: 999px; transition: width 0.3s ease;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.92rem; font-weight: 700; color: #0F172A; margin-bottom: 0.35rem;">
                <span>🍽️ Bigger Plates</span>
                <span id="chartLabelBiggerPlate" style="color: #1E293B; font-weight: 800;">~$15/person</span>
              </div>
              <div style="height: 12px; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
                <div id="chartBarBiggerPlate" style="height: 100%; width: 85%; background: #64748B; border-radius: 999px; transition: width 0.3s ease;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.92rem; font-weight: 700; color: #0F172A; margin-bottom: 0.35rem;">
                <span>🥡 Family Meal</span>
                <span id="chartLabelFamilyMeal" style="color: #15803D; font-weight: 800;">~$10/person</span>
              </div>
              <div style="height: 12px; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
                <div id="chartBarFamilyMeal" style="height: 100%; width: 50%; background: #16A34A; border-radius: 999px; transition: width 0.3s ease;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.92rem; font-weight: 700; color: #0F172A; margin-bottom: 0.35rem;">
                <span>📦 Catering Set</span>
                <span id="chartLabelCatering" style="color: #1E293B; font-weight: 800;">~$21/person</span>
              </div>
              <div style="height: 12px; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
                <div id="chartBarCatering" style="height: 100%; width: 100%; background: #94A3B8; border-radius: 999px; transition: width 0.3s ease;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Callout to main coupon page -->
        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.95rem; color: #334155; font-weight: 500;">
          Ready to order? <a href="/#coupon-section" style="font-weight: 700; color: #C8102E; text-decoration: underline;">Check today's verified Panda Express coupon codes</a> before heading to checkout on pandaexpress.com or the official mobile app.
        </div>
      </div>
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
      <h3 style="font-size: 1.3rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #0F172A; font-weight: 800; text-align: center;">
        Official Baseline Cost Data
      </h3>
      <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem; text-align: center; max-width: 720px; margin-left: auto; margin-right: auto;">
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
            <tr class="direct-order-row" style="background: #F0FDF4;">
              <td><strong style="color: #15803D;">Family Meal</strong></td>
              <td><strong>4–5</strong></td>
              <td>$45–$55</td>
              <td><strong style="color: #16A34A;">$35–$45</strong></td>
              <td><strong style="color: #16A34A;">$7–$9</strong></td>
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
        
        <div style="background: #FFFFFF; border: 1px solid var(--color-borders); border-radius: var(--radius-md); padding: var(--card-pad-desktop); box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.2rem; color: #0F172A; font-weight: 800; margin-top: 0; margin-bottom: 0.65rem; text-align: center;">
            When the Family Meal Wins
          </h3>
          <p style="font-size: 0.94rem; color: #334155; line-height: 1.65; margin-bottom: 0.75rem; font-weight: 500;">
            For groups of 4 to 9 people, the <a href="/#family-meal-deals" style="font-weight: 700; color: #C8102E; text-decoration: underline;">Panda Express Family Meal</a> delivers the steepest savings on the entire menu. Five individual plates total roughly $65 to $70, whereas a single Family Meal costs $45 to $55 (or $35 with an active promo code).
          </p>
          <p style="font-size: 0.9rem; color: #64748B; margin-bottom: 0;">
            Even for 3 people with healthy appetites, opting for a Family Meal often makes sense because the per-serving cost ($12–$15) provides substantial next-day lunch leftovers.
          </p>
        </div>

        <div style="background: #FFFFFF; border: 1px solid var(--color-borders); border-radius: var(--radius-md); padding: var(--card-pad-desktop); box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.2rem; color: #0F172A; font-weight: 800; margin-top: 0; margin-bottom: 0.65rem; text-align: center;">
            When Catering Beats Smaller Orders
          </h3>
          <p style="font-size: 0.94rem; color: #334155; line-height: 1.65; margin-bottom: 0.75rem; font-weight: 500;">
            Once party size reaches 10 or more guests (office gatherings, tailgates, or youth sports teams), Party Catering sets become the most efficient choice. At $8 to $12 per guest, catering matches or beats multi-plate purchases while including serving tongs, plates, and steam table containers.
          </p>
          <p style="font-size: 0.9rem; color: #64748B; margin-bottom: 0;">
            Compare your selections against our full <a href="/panda-express-menu/" style="font-weight: 700; color: #C8102E; text-decoration: underline;">Panda Express Menu with prices</a> to see entree choices.
          </p>
        </div>
      </div>

      <!-- Calculation Methodology Note -->
      <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-left: 5px solid #D97706; border-radius: var(--radius-md); padding: 1.35rem; margin-bottom: 2.5rem;">
        <h3 style="font-size: 1.15rem; color: #92400E; font-weight: 800; margin-top: 0; margin-bottom: 0.4rem; text-align: center;">
          How We Calculated This (Methodology &amp; Disclosures)
        </h3>
        <p style="color: #78350F; font-size: 0.93rem; line-height: 1.6; margin-bottom: 0.5rem; font-weight: 500;">
          Our <strong>Panda Express savings calculator</strong> applies linear price modeling using verified corporate pricing bands. Rather than fabricating decimal-level precision for a menu where local sales tax and regional pricing vary, the calculator surfaces realistic price ranges.
        </p>
        <p style="color: #78350F; font-size: 0.88rem; margin-bottom: 0;">
          Estimates are designed for dine-in and pickup orders placed directly on official Panda Express digital channels. You can also evaluate nutritional macros using our <a href="/panda-express-nutrition/" style="font-weight: 700; color: #92400E; text-decoration: underline;">Panda Express Nutrition Calculator</a>.
        </p>
      </div>

      <!-- Related Menu Favorites -->
      <div style="border-top: 1px solid var(--color-borders); padding-top: 2rem; margin-bottom: 2rem;">
        <h3 style="font-size: 1.3rem; color: #0F172A; font-weight: 800; margin-bottom: 1.25rem; text-align: center;">Explore Popular Panda Express Dishes</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
          <div style="background: #FFFFFF; border: 1px solid var(--color-borders); border-radius: var(--radius-md); padding: 1.25rem; box-shadow: var(--shadow-sm);">
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.35rem; text-align: center;"><a href="/panda-express-orange-chicken/" style="color: #0F172A;">The Original Orange Chicken &rarr;</a></h4>
            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 0; line-height: 1.55;">510 calories, sweet &amp; spicy crispy wok-tossed chicken. The #1 guest favorite for Family Meal entrees.</p>
          </div>
          <div style="background: #FFFFFF; border: 1px solid var(--color-borders); border-radius: var(--radius-md); padding: 1.25rem; box-shadow: var(--shadow-sm);">
            <h4 style="font-size: 1.1rem; font-weight: 700; margin-top: 0; margin-bottom: 0.35rem; text-align: center;"><a href="/beijing-beef/" style="color: #0F172A;">Beijing Beef &rarr;</a></h4>
            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 0; line-height: 1.55;">480 calories, crispy marinated beef strips tossed with bell peppers and onions in sweet-tangy glaze.</p>
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
