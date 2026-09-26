# 🐼 Panda Express Coupons

An ultra-fast, mobile-first, SEO-optimized static website for Panda Express coupons, menu prices, and nutrition calculations.

> **Legal Disclaimer:** This website is an independent consumer resource and is **not** affiliated with, endorsed by, or sponsored by Panda Express or Panda Restaurant Group, Inc. All trademarks belong to their respective owners.

---

## 🚀 Key Features

- **Award-Winning Visual Design**: Bold, appetizing food-brand aesthetic with full-bleed high-res food photography, dark wok-textured surfaces, warm cream accents, and custom SVG panda branding.
- **Ticket-Style Coupon Cards**: Modern perforated coupon cards with radial punch-notches, dashed tear lines, discount badges, and instant one-click copy.
- **Dual-Mode Interactive Nutrition Explorer**: Combo Meal Builder (Bowl, Plate, Bigger Plate) + full 68-item live menu explorer with macro calculators, allergen search, and FDA nutrition label modal.
- **Blazing Fast Performance**: Zero runtime frameworks or heavy client libraries. Pure vanilla JavaScript (<10KB gzipped) and optimized CSS delivering instant page transitions and target 95–100 Google Lighthouse scores.
- **Pure Static Architecture**: 100% database-free and backend-free. Ready to deploy on any free static host (Cloudflare Pages, Vercel, Netlify, or GitHub Pages).
- **Automatic SEO Automation**: Pre-rendered Schema.org JSON-LD structured data (FAQPage, Organization, BreadcrumbList, WebSite), canonical URLs, Open Graph / Twitter cards, dynamic `sitemap.xml`, and `robots.txt`.
- **Spam-Protected Contact Link**: Contact email (`helppandacoupons@gmail.com`) is decoded dynamically to protect against naive scraper bots.

---

## 📁 Project Structure

```text
PandaCoupons/
├── package.json               # NPM scripts: "build" and "dev"
├── build.js                   # Static site generator compiler
├── server.js                  # Zero-dependency local preview server
├── test.js                    # Verification test suite
│
├── data/                      # 💡 EDIT YOUR DATA HERE (Easy for beginners!)
│   ├── site.config.js         # Site name, colors, email, domain, and nav links
│   ├── coupons.json           # 10 starter coupon codes & last verified date
│   ├── menu.json              # Entrees, sides, meal types, and appetizers
│   ├── menu_full.json         # Complete 68-item official nutrition & allergen dataset
│   ├── nutrition.json         # Per-serving macros for calculator
│   ├── faq.json               # Frequently Asked Questions
│   └── dishes.json            # Dedicated food page data (Orange Chicken, Beijing Beef)
│
├── assets/                    # Static styling and client scripts
│   ├── css/style.css          # Modern, responsive stylesheet (Ticket cards, steppers, glassmorphism)
│   └── js/main.js             # Lean vanilla JS (copy code, mobile nav, calculator, modal)
│
├── public/                    # Public static files
│   ├── favicon.svg            # Custom red/black/gold panda logo
│   └── images/                # High-res royalty-free food photography
│       ├── hero-wok.jpg       # Sizzling wok stir-fry hero
│       ├── orange-chicken.jpg # Crispy orange chicken dish photo
│       ├── beijing-beef.jpg   # Beijing beef dish photo
│       ├── family-meal.jpg    # Family dinner table spread
│       ├── takeout-spread.jpg # Takeout spread banner
│       └── IMAGE_CREDITS.md   # Asset provenance and license docs
│
├── src/                       # Layout and page generators
│   ├── templates/
│   │   ├── layout.js          # Shared HTML shell with SEO meta & schema
│   │   ├── header.js          # Sticky transparent-to-solid header & "Get Codes" CTA
│   │   └── footer.js          # Dark footer with disclaimer and protected email
│   └── pages/
│       ├── home.js            # Home page (10 modern visual sections)
│       ├── menu.js            # Menu page with photo cards
│       ├── nutrition.js       # Dual-mode nutrition calculator & explorer
│       ├── dish.js            # Reusable food dish guide (Orange Chicken, Beijing Beef)
│       ├── about.js           # About Us page
│       ├── contact.js         # Contact Us page
│       ├── disclaimer.js      # Legal disclaimer page
│       └── privacy.js         # Privacy policy page
│
└── dist/                      # 📦 Compiled production-ready static site
```

---

## 🛠️ Beginner Step-by-Step Guide

### 1. Requirements
Make sure you have [Node.js](https://nodejs.org) installed on your computer (v18 or newer). No extra software is required!

### 2. Run the Site Locally
To preview your website in your browser:
```bash
npm run dev
```
Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

### 3. How to Update Coupon Codes & Verification Date
All coupon data is stored in one simple file: [`data/coupons.json`](file:///c:/Users/talha/Downloads/PandaCoupons/data/coupons.json).

1. Open [`data/coupons.json`](file:///c:/Users/talha/Downloads/PandaCoupons/data/coupons.json).
2. To update the month/date, edit `"lastVerified"`:
   ```json
   "lastVerified": "October 2026"
   ```
3. To mark a coupon as active after testing it yourself, change its `"status"` from `"Unverified"` to `"Active"`:
   ```json
   {
     "code": "PANDA20",
     "discount": "20% off entire order",
     "bestFor": "Any online order",
     "minOrder": "None",
     "status": "Active",
     "notes": "Verified working on online checkout."
   }
   ```
4. Rebuild the site:
   ```bash
   npm run build
   ```

---

### 4. How to Add a New Dish Page
Want to add a new food guide (e.g. "Kung Pao Chicken" or "Honey Walnut Shrimp")?

1. Open [`data/dishes.json`](file:///c:/Users/talha/Downloads/PandaCoupons/data/dishes.json).
2. Copy one of the dish objects (like Beijing Beef) and paste it at the end of the array.
3. Update the `slug`, `name`, `intro`, `nutrition`, `isHealthy`, and `faq` fields.
4. Run:
   ```bash
   npm run build
   ```
The compiler will automatically create the new page at `/your-dish-slug/`, add it to the breadcrumbs, and include it in `sitemap.xml`!

---

### 5. How to Change Colors or Contact Email
Open [`data/site.config.js`](file:///c:/Users/talha/Downloads/PandaCoupons/data/site.config.js).
You can edit the `contactEmail`, `domain`, or any of the named color variables:
```javascript
colors: {
  primaryRed: "#C8102E",
  primaryRedHover: "#A50D26",
  black: "#000000",
  bodyText: "#1A1A1A",
  white: "#FFFFFF",
  softBackground: "#F7F5F2",
  borders: "#E5E5E5"
}
```

---

### 6. Free 1-Click Deployment

Because this site compiles into clean static HTML in the `./dist` folder, you can host it for free forever:

#### Option A: Cloudflare Pages (Recommended - Fastest Global CDN)
1. Push your repository to GitHub or GitLab.
2. Log into the Cloudflare Dashboard and select **Workers & Pages** > **Create application** > **Pages**.
3. Connect your repository.
4. Set **Build command**: `npm run build`
5. Set **Build output directory**: `dist`
6. Click **Save and Deploy**.

#### Option B: Vercel
1. Install the Vercel CLI (`npm i -g vercel`) or connect via [vercel.com](https://vercel.com).
2. Import your Git repository.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Click **Deploy**.

#### Option C: Netlify
1. Log into [Netlify.com](https://netlify.com) and click **Add new site** > **Import an existing project**.
2. Set Build command: `npm run build`
3. Set Publish directory: `dist`
4. Click **Deploy site**.

#### Option D: GitHub Pages
1. In your GitHub repository settings, go to **Pages**.
2. Select **GitHub Actions** as the source.
3. Use the static HTML workflow to deploy the `./dist` directory on every push.

---

## 🧪 Running Verification Tests

Run the built-in automated test suite at any time to verify HTML integrity, SEO meta tags, coupon counts, and nutrition calculations:
```bash
node test.js
```
