# Changes Report

## Phase 1: Server Security & Robustness
- **Security Headers:** Implemented Helmet-like strict security headers in `server.js` including Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Content-Type-Options, X-Frame-Options, Cross-Origin-Embedder-Policy (COEP), and Cross-Origin-Opener-Policy (COOP).
- **Compression:** Added `compression` (gzip & brotli) middleware to `server.js` for faster asset delivery.
- **Path Traversal Protection:** Added middleware to block requests containing `../` or `%2e%2e%2f` to prevent directory traversal attacks.
- **Cache Controls:** Set aggressive caching (1 year immutable) for hashed `/assets/` and short caching for HTML (15m/1h) in `server.js`.
- **Health Endpoint:** Implemented a non-logging `/healthz` endpoint returning `{status: 'ok'}` with no caching.
- **Asset Fingerprinting:** `build.js` now dynamically minifies CSS and JS into `.min` files, computes a hash (e.g. `style.[hash].css`), updates HTML templates, and cleans up old unminified versions.

## Phase 2: Dynamic Dates (Zero-Maintenance)
- **Centralized Date Logic:** Created `src/utils/date.js` generating `{{MONTH_YEAR}}` and `{{YEAR}}` natively using `Intl.DateTimeFormat` with `America/Los_Angeles` timezone.
- **Server Reloading:** Added a `setInterval` in `server.js` that checks for a month rollover every 6 hours and dynamically triggers `node build.js` if the month changes.
- **Content Refresh:** Swapped out all instances of static `September 2026` or `October 2026` in `data/faq.json`, `data/menu.json`, and all JS templates (`src/pages/*.js`, `src/templates/*.js`) with `{{MONTH_YEAR}}` or `{{YEAR}}` tokens.
- **Build-time Check:** Provided `scripts/find-hardcoded-dates.js` that scans `src/` and `data/` (excluding backups) for remaining static "Month 2025/2026" strings.
- **Build Replacement:** `build.js` seamlessly resolves `{{MONTH_YEAR}}`, `{{MONTH}}`, and `{{YEAR}}` in the final HTML output.

## Phase 3: SEO and Crawlability
- **Sitemap `lastmod`:** `build.js` now dynamically appends `<lastmod>YYYY-MM-DD</lastmod>` into the generated `sitemap.xml`.
- **Robots.txt Updates:** Blocked query string parameters (`/*?*`) and admin paths (`/admin/`, `/admin/preview/`) to prevent duplicate indexing and crawling sensitive areas.
- **Schema & Meta Tags:** Confirmed generation of `Organization`, `Website`, and `BreadcrumbList` schemas. Upgraded the fallback `<meta name="robots">` tag in `src/templates/layout.js` to explicitly output `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` when indexing is allowed.

## Phase 4: Performance and Design Rules
- **CSS Reset Consolidation:** Removed redundant `box-sizing: border-box;` and reset styles across `style.css` to rely solely on the single global reset rule, reducing file size and repetition.
- **Menu Usability Fixes:** 
  - Removed confusing "View Items" order buttons from the menu summary tables.
  - Adjusted the mobile styles for `.btn-hero-secondary` by removing the `background: transparent !important` override, making sure the "View More" links remain readable against light backgrounds.

## Needs Owner Decision
- **C1 - C6 (Trust & Legal):** Intentionally skipped per task guidelines.
- **E3 (Meta Description Check):** Intentionally skipped per task guidelines.
- **Admin Panel Data Integration:** Hardcoded dates originally inside `data/admin/backups` or dynamically served by the admin UI were not modified because they belong to the protected `admin/` environment. A broader migration or data entry update from the owner is recommended for those items.
