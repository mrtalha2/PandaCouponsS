# 🐼 Panda Express Coupons & Deals Platform

A high-performance, mobile-first web platform for verified Panda Express coupons, menu pricing, macro nutrition calculators, and meal combo guides.

> **Legal Disclaimer:** This website is an independent consumer resource and is **not** affiliated with, endorsed by, or sponsored by Panda Express or Panda Restaurant Group, Inc. All trademarks belong to their respective owners.

---

## 🚀 Architectural Overview

- **Hybrid Architecture**: Fast Node.js server (`server.js`) powering production HTTP routing, security headers, live Brotli/Gzip compression, healthchecks (`/healthz`), dynamic monthly date synchronizations, and an authenticated administrative portal (`/admin`).
- **Static Site Pre-Compilation**: Fully pre-renders static HTML (`build.js`) using CleanCSS, Terser, Html-Minifier-Terser, and Sharp image optimization pipeline.
- **Client-Side Freshness**: Dynamic client-side timezone awareness (`assets/js/main.js`) aligned with server rendering, ensuring exact calendar month and year display across global visitor timezones.
- **Automated Monthly Roll-over**: Background monitor in `server.js` checks the calendar month hourly, triggering zero-downtime rebuilds when a new month begins and stamping `dist/.build-month`.
- **Security & Headers**: Strict CSP Report-Only configuration, HSTS, X-Content-Type-Options (`nosniff`), X-Frame-Options (`SAMEORIGIN`), Referrer-Policy, Cross-Origin-Resource-Policy (`same-origin`), and hardened path traversal protections.
- **Structured Data & SEO**: Full Schema.org JSON-LD structured data (`Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `ItemPage`, `Article`), canonical URL integrity, dynamic `sitemap.xml` with source-aware `lastmod` dates, and `robots.txt`.

---

## 📁 Repository Structure

```text
PandaCoupons/
├── server.js                  # Production Node.js HTTP server & admin router
├── build.js                   # Compiler & static HTML generator
├── package.json               # NPM scripts & production dependencies
├── Dockerfile                 # Multi-stage production container definition
├── .dockerignore              # Exclusions for container builds
│
├── assets-src/images/         # Original high-resolution source master photography
├── public/                    # Static runtime assets & optimized web photography
│   ├── favicon.svg            # Custom panda brand vector logo
│   └── images/
│       ├── menu/              # Menu item photography & responsive variants (300/600/900w)
│       ├── optimized/         # Responsive WebP variants (640/800/1280/1920w)
│       └── *.jpg              # Web-optimized JPG fallbacks (<200KB each)
│
├── data/                      # Structured dataset & configuration files
│   ├── site.config.js         # Site metadata, domains, and branding tokens
│   ├── coupons.json           # Live coupon codes and verification metadata
│   ├── menu.json              # Menu categories, dishes, prices, and portion sizes
│   ├── menu_full.json         # Comprehensive nutrition & allergen dataset
│   ├── dishes.json            # Dedicated entrée guides (Orange Chicken, Beijing Beef, etc.)
│   └── admin/                 # Admin configuration & runtime data store
│
├── assets/                    # Frontend client styling and scripts
│   ├── css/style.css          # Core responsive stylesheet
│   └── js/main.js             # Client scripts (copy button, mobile nav, live date sync)
│
├── src/                       # Page templates and layout generators
│   ├── templates/layout.js    # Shared HTML layout shell & JSON-LD schemas
│   ├── templates/header.js    # Header navigation bar & dropdown menu
│   ├── templates/footer.js    # Footer, legal disclaimers, and contact link
│   ├── pages/                 # Individual page generator modules
│   └── utils/date.js          # Unified date token parsing and dynamic time helpers
│
├── scripts/                   # Automated verification & build pipelines
│   ├── optimize-images.js     # Responsive WebP and small JPG generator (Sharp)
│   ├── verify-headers.js      # Security headers & compression tester
│   ├── verify-traversal.js    # Path traversal protection test suite
│   ├── verify-assets.js       # HTML asset link & image existence validator
│   ├── check-contrast.js      # WCAG 2.1 AA color contrast validator
│   ├── find-hardcoded-dates.js# Date token linting script
│   └── validate-jsonld.js     # Schema.org JSON-LD validator
│
└── dist/                      # Pre-compiled production static site output
```

---

## 🛠️ Local Development & Operations

### 1. Prerequisites
- **Node.js**: `v20.x` or newer (`>=20` required in `package.json`).
- **NPM**: `v9.x` or newer.

### 2. Installation
```bash
npm ci
```

### 3. Build Static Site
```bash
npm run build
```

### 4. Optimize Images & Generate Responsive Variants
```bash
npm run optimize-images
```

### 5. Run Local Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live site.

---

## 🧪 Automated Verification Suite

Run all test suites across security, integrity, headers, schemas, assets, and accessibility:
```bash
npm test
```

The test runner executes:
1. `node test.js` — Core template rendering, coupon structures, and page integrity.
2. `node scripts/verify-traversal.js` — Hardened path traversal security checks.
3. `node scripts/verify-headers.js` — HTTP response headers, compression (`br`/`gzip`), and CSP headers.
4. `node scripts/find-hardcoded-dates.js` — Ensures zero hardcoded date strings in templates.
5. `node scripts/validate-jsonld.js` — Syntax and schema validity of all JSON-LD blocks.
6. `node scripts/verify-assets.js` — Scans every built page in `dist/` to ensure 100% of local images and assets exist.
7. `node scripts/check-contrast.js` — Computes WCAG 2.1 AA color contrast ratios (>= 4.5:1).

---

## 🔒 Security Configuration

- **Content Security Policy (CSP)**: Set to `Content-Security-Policy-Report-Only` to monitor inline styles and third-party scripts without breaking rendering.
- **Admin Authentication**: Protected behind `/admin/login` using bcrypt password hashing and session tokens.
- **Path Traversal Protection**: Rejects encoded, nested, null-byte, and backslash traversal vectors.
- **Environment Isolation**: `.env`, `.sessions.json`, and backup archives are strictly ignored from Git and container builds.
