# PandaCoupons Remediation & Hardening Report

This report documents all fixes, enhancements, and verification results across Rounds 1, 2, 3, and Round 4 (Monthly Automated Rebuild, Deploy Pipeline & Exact-Case Asset Remediation).

---

## 🚀 Round 4: Automated Monthly 12:00 AM Rebuild, Deployment Pipeline & Letter-Case Asset Remediation

### 1. Summary of Changes & Architecture

| Component | Changes Made | Verification Status |
| :--- | :--- | :--- |
| **Step 1: Time Zone & Month Single Source of Truth** | Exported `getSiteDateParts()` from `src/utils/date.js` computing `{ year, month, day, hour, monthYearLabel }` using `SITE_TIMEZONE` from `data/site.config.js` (default: `America/Los_Angeles`). Added `TODO(owner)` for timezone choice. | ✅ PASS (`node -e "..."`) |
| **Step 2: Month Gate Decision Script** | Created `scripts/month-gate.js` with fail-open network fetching (15s timeout, Cache-Control: no-cache), CLI overrides (`--now`, `--zone`, `--site-url`, `--live-title`, `--mock-fetch-fail`). Created `scripts/verify-month-gate.js`. | ✅ PASS (All 7 matrix rows + 3 mock date tests pass) |
| **Step 3: GitHub Actions Monthly Workflow** | Rewrote `.github/workflows/monthly-rebuild.yml` with global timezone schedule `cron: '7 * 1,28-31 * *'`, `workflow_dispatch` with `force`, concurrency controls, 3-job pipeline (`gate` -> `build-deploy` with masked `DEPLOY_HOOK_URL` -> `verify-live` polling for up to 15m). Updated `ci.yml`. | ✅ PASS (Validated jobs, needs, and expressions) |
| **Step 4: Self-Hosted Monthly Rebuild Fallback** | Added `AUTO_REBUILD=1` in `server.js` (default off) checking startup + every 10m against `dist/.build-month`, safe atomic build with rollback on failure. Created `scripts/verify-auto-rebuild.js`. | ✅ PASS (`/healthz` 200 OK, month updated) |
| **Step 5: Host Headers & Deployment Guide** | Synchronized `headers.config.js`, `public/_headers`, `scripts/generate-headers.js`, and `scripts/verify-headers.js`. Removed stale `/admin/*` rule. Added "Monthly update" section to `DEPLOYMENT.md`. | ✅ PASS (`node scripts/verify-headers.js`) |
| **Step 6: Broken Menu Images (Letter-Case Bug)** | Fixed 3 image paths in `data/menu.json` to exact case on disk (`Orange-Chicken-...`, `Broccoli-Beef-...`, `Build-Your-Own-...`). Removed allow-list from `scripts/verify-assets.js`. Made asset verification cross-platform case-exact via directory tree sets. Added `scripts/verify-case-exact.js`. | ✅ PASS (49/49 menu items have responsive `srcset`, 0 broken images) |

---

## 🔬 Round 4 Final Verification Command Outputs

### 1. Clean Static Build & Comprehensive Verification Suite
```bash
$ rm -rf dist && node build.js && node scripts/run-all-tests.js
```
```text
🚀 Starting static build for Panda Express Coupons...

📦 Copying assets & public resources...

⚡ Minifying assets with CleanCSS & Terser and computing cache hash...
  ✓ style.min.css: 174922B -> 125922B (28.0% savings)
  ✓ Removed unminified style.css from dist (saves 161KB)
  ✓ main.min.js: 65947B -> 38425B (41.7% savings)
  ✓ Removed unminified main.js from dist (saves 62KB)
  ✓ Asset version hash: 6d06a736

📄 Building and minifying HTML pages...
  ✓ Built: / (index.html) (92.7 KB)
  ✓ Built: /panda-express-menu/ (120.6 KB)
  ✓ Built: /panda-express-nutrition/ (72.8 KB)
  ✓ Built: /panda-express-savings-calculator/ (37.4 KB)
  ✓ Built: /panda-express-orange-chicken/ (29.6 KB)
  ✓ Built: /beijing-beef/ (29.6 KB)
  ✓ Built: /panda-express-grilled-teriyaki/ (28.0 KB)
  ✓ Built: /panda-express-cream-cheese/ (27.4 KB)
  ✓ Built: /panda-express-black-pepper-steak/ (27.3 KB)
  ✓ Built: /panda-express-sweet-sour-chicken/ (27.1 KB)
  ✓ Built: /panda-express-string-bean-chicken/ (27.0 KB)
  ✓ Built: /panda-express-chow-mein/ (27.0 KB)
  ✓ Built: /about-us/ (21.9 KB)
  ✓ Built: /contact-us/ (21.3 KB)
  ✓ Built: /disclaimer/ (20.9 KB)
  ✓ Built: /privacy-policy/ (22.7 KB)
  ✓ Built: /404.html (19.0 KB)

🛡️ Checking Image Size Budgets...
  ✓ All optimized and source images pass strict size budget guards

🗺️ Generating SEO files...
  ✓ Generated sitemap.xml with 16 URLs
  ✓ Generated robots.txt

✨ Build completed successfully in 677ms! Output folder: ./dist/

🚀 Running Panda Express Coupons Comprehensive Verification Suite...

[PASS] Core Verification & SEO Tests (51ms)
[PASS] Nutrition Consistency Verification (44ms)
[PASS] Current Month / Timezone Verification (46ms)
[PASS] Month Gate Decision Matrix & Date Sync (172ms)
[PASS] Self-Hosted Auto-Rebuild Verification (1084ms)
[PASS] Path Traversal & Directory Protection (58ms)
[PASS] Security Headers Consistency (41ms)
[PASS] 301 Redirects & Status Codes (169ms)
[PASS] Untracked Secrets Guard (56ms)
[PASS] Hardcoded Dates Scanner (41ms)
[PASS] JSON-LD Schema & Canonical Verification (44ms)
[PASS] Asset Integrity Verification (49ms)
[PASS] Exact-Case Asset & Path Verification (42ms)
[PASS] WCAG Color Contrast Audit (41ms)
[PASS] Accessibility & Table Semantics Audit (46ms)
[PASS] Site Remediation & Integration Verification (167ms)
[PASS] Forbidden Email Absence Guard (49ms)

----------------------------------------------------
🎉 ALL 17 TEST SUITES PASSED SUCCESSFULLY in 2654ms!
```

---

### 2. Month Gate Verification Matrix (All 7 Cases + Date Sync)
```bash
$ node scripts/verify-month-gate.js
```
```text
🚪 Verifying Month Gate decision matrix & date synchronization...

  ✓ Row 1: Nov 1 07:10 UTC (PDT 00:10) with October title -> Deploy (0) (exit 0)
  ✓ Row 2: Nov 1 07:10 UTC (PDT 00:10) with November title -> Skip (10) (exit 10)
  ✓ Row 3: Nov 1 08:10 UTC (hour 00 in winter/01 in PDT) with October title -> Deploy (0) (exit 0)
  ✓ Row 4: Oct 31 23:30 UTC (Oct 31 16:30 PDT) with October title -> Skip (10) (exit 10)
  ✓ Row 5: Oct 31 19:05 UTC (Nov 1 00:05 PKT in Asia/Karachi) with October title -> Deploy (0) (exit 0)
  ✓ Row 6: Dec 1 08:30 UTC with fetch failure -> Deploy / Fail Open (0) (exit 0)
  ✓ Row 7: Jul 1 07:05 UTC (PDT 00:05) with June title -> Deploy (0) (exit 0)

🔍 Verifying getSiteDateParts label matches home <title> template output...
  ✓ Mock date 2026-01-01T10:00:00.000Z -> monthYearLabel "January 2026" matches <title> "Panda Express Coupon Code: Active Deals (January 2026)"
  ✓ Mock date 2026-07-01T08:00:00.000Z -> monthYearLabel "July 2026" matches <title> "Panda Express Coupon Code: Active Deals (July 2026)"
  ✓ Mock date 2026-11-01T08:00:00.000Z -> monthYearLabel "November 2026" matches <title> "Panda Express Coupon Code: Active Deals (November 2026)"

🎉 All 10 month gate verification tests passed successfully!
```

---

### 3. Rollover Build Output (Mocked to `2026-11-01T09:30:00Z`)
```bash
$ node dev-tools/verify-rollover.js
```
```text
🏗️ Running mock build for 2026-11-01T09:30:00Z...

Site date parts for mocked date: {
  year: '2026',
  month: '11',
  day: '01',
  hour: '01',
  monthYearLabel: 'November 2026'
}
Home <title>          : Panda Express Coupon Code: Active Deals (November 2026)
Home meta description : Verified Panda Express coupon code directory for November 2026. Check active deals, calculate meal savings, and avoid expired promos with honest confidence tags.
Home og:title         : Panda Express Coupon Code: Active Deals (November 2026)
Home og:description   : Verified Panda Express coupon code directory for November 2026. Check active deals, calculate meal savings, and avoid expired promos with honest confidence tags.
Home JSON-LD length   : 3854

✓ Rollover verification passed: Home updated to November 2026, other 15 pages have no month in title/description.
```

---

### 4. Client Boundary Transitions (Follows Site Time Zone)
```bash
$ node dev-tools/verify-client-boundary.js
```
```text
🌐 Testing Client Boundary Transitions (follows site time zone)...

--- Site Timezone: America/Los_Angeles (US Default) ---
1. LA 23:59:59 (Oct 31) [UTC 2026-11-01T06:59:59Z]:
   Displayed Month/Year: October 2026
2. LA 00:00:00 (Nov 01) [UTC 2026-11-01T07:00:00Z]:
   Displayed Month/Year: November 2026
3. Karachi local 00:00:00 Nov 1 (Site in LA is Oct 31 12:00 PM):
   Displayed Month/Year: October 2026

--- Site Timezone: Asia/Karachi (Configurable) ---
4. Karachi 23:59:59 (Oct 31) [UTC 2026-10-31T18:59:59Z]:
   Displayed Month/Year: October 2026
5. Karachi 00:00:00 (Nov 01) [UTC 2026-10-31T19:00:00Z]:
   Displayed Month/Year: November 2026

✅ All client boundary transitions strictly follow the site time zone.
```

---

### 5. Workflow Walkthrough & Scenarios

The workflow `.github/workflows/monthly-rebuild.yml` is structured with three decoupled jobs:

1. **Gate (`gate`)**: Evaluates `scripts/month-gate.js`. If it is not the 1st in `SITE_TIMEZONE` or if the live site already displays the target `monthYearLabel`, it exits `10` (`deploy=false`) and downstream jobs are skipped.
2. **Build & Deploy (`build-deploy`)**: Runs only when `deploy=true`. Executes clean build, runs all 17 automated tests, and calls `DEPLOY_HOOK_URL` with masked logging.
3. **Live Verification (`verify-live`)**: Polls `SITE_URL` every 30 seconds for up to 15 minutes to assert that the live HTML reflects the new month label.

#### Operational Scenarios:

- **Scenario A: Winter Midnight (PST, UTC-8)**
  - At `08:07 UTC` on Dec 1 (00:07 PST), the hourly schedule triggers.
  - Gate detects day is `01`, live title contains `November 2026`, and exits `0` (`deploy=true`).
  - `build-deploy` runs and triggers the host build hook.
  - `verify-live` confirms the live title updates to `December 2026`.
  - At `09:07 UTC` (next hourly run), gate sees live site already displays `December 2026`, exits `10` (`deploy=false`), skipping deploy.
  - **Result: Deploys exactly ONCE.**

- **Scenario B: Summer Midnight (PDT, UTC-7)**
  - At `07:07 UTC` on July 1 (00:07 PDT), the hourly schedule triggers.
  - Gate detects day is `01`, live title contains `June 2026`, and exits `0` (`deploy=true`).
  - Site rebuilds, tests, and deploys. Live site updates to `July 2026`.
  - At `08:07 UTC`, gate exits `10` (`deploy=false`).
  - **Result: Deploys exactly ONCE.**

- **Scenario C: GitHub Scheduling Queue Delay (e.g., 40-minute delay)**
  - If GitHub Actions delays the 07:07 UTC run until 07:47 UTC (00:47 PDT), local time is still the 1st.
  - Gate runs, confirms day is `01`, detects live site is stale, and triggers deploy.
  - Subsequent runs detect the live update and exit `10`.
  - **Result: Deploys exactly ONCE without missing the rollover.**

---

### 6. Exact-Case Asset Verification & Responsive Image Audit
```bash
$ grep -rn "panda-cub-meal-cub-meal" src data scripts dist
```
```text
scripts/verify-case-exact.js:23:const wrongCaseRel = 'images/menu/orange-chicken-panda-cub-meal-cub-meal.webp';
```

```bash
$ node scripts/verify-case-exact.js
```
```text
🔍 Running Exact-Case Asset Verification Unit Tests...

  ✓ Exact case test PASS: "images/menu/Orange-Chicken-Panda-Cub-Meal-cub-meal.webp" correctly found.
  ✓ Exact case test PASS: "images/menu/orange-chicken-panda-cub-meal-cub-meal.webp" correctly rejected as missing.
  ✓ All 50 menu item images verified with exact letter-case.
  ✓ All 8 dish data images verified with exact letter-case.

🎉 ALL EXACT-CASE TESTS PASSED SUCCESSFULLY!
```

```bash
$ grep -o 'srcset="[^"]*"' dist/panda-express-menu/index.html | wc -l
```
```text
      49
```
*Proof: All 49 responsive menu dishes generate valid `srcset` attributes pointing to existing `-300.webp`, `-600.webp`, and `-900.webp` assets with exact letter case. The single dish without variants (`.avif`) is served as a direct single source.*

---

## 📌 Needs Owner Action (Do Not Implement in Repository)

1. **Deploy Hook Setup**: Create a Build/Deploy Hook in your static host (e.g. Vercel Deploy Hook, Netlify Build Hook, Cloudflare Pages Deploy Hook, Render Deploy Hook) and save it as the GitHub repository secret `DEPLOY_HOOK_URL` in `Settings > Secrets and variables > Actions > Secrets`.
2. **Live Domain Variable**: Set the GitHub repository variable `SITE_URL` in `Settings > Secrets and variables > Actions > Variables` to your live domain (e.g. `https://pandacoupons.org/`).
3. **Time Zone Decision**: Choose your desired time zone in `data/site.config.js` (`SITE_TIMEZONE`). Use `'America/Los_Angeles'` for US midnight or `'Asia/Karachi'` for Pakistan midnight.
4. **GitHub Actions Health**: Ensure GitHub Actions is enabled on the repository. Scheduled workflows execute on the default branch (`main`).
5. **Cross-Platform Case Sensitivity**: Keep in mind that macOS and Windows disguise letter-case discrepancies. Always rely on the CI / Linux test runner to verify that all assets match exact filesystem case.
6. **Propagation Timing**: The title and meta description update occurs within a few minutes after midnight following static generation and host deployment propagation.

---

*(Historical notes below from Rounds 1–3 are preserved for reference. Note that any mentions of the legacy admin panel, `/admin/login`, or form endpoints are OUTDATED / SUPERSEDED by the hardened zero-dependency static architecture).*

---

## 📋 Remediation Status Matrix (Rounds 1–3 Archive)

| ID | Issue & Requirement | Status | Files Changed | Verification Command & Result |
| :--- | :--- | :--- | :--- | :--- |
| **B1** | Fix `TypeError: url.includes is not a function` in `layout.js` schema generation | **Done** | `src/templates/layout.js` | `rm -rf dist && node build.js`<br>✅ *Build completed successfully with zero errors.* |
| **I1** | Restore web-optimized JPG fallbacks (<200KB, max 1280px) in `public/images/` | **Done** | `scripts/optimize-images.js`, `public/images/*.jpg` | `find dist/public/images -maxdepth 1 -name "*.jpg" -size +250k`<br>✅ *0 files over 250KB. All fallback JPGs present.* |
| **I2** | Generate responsive WebP variants (300/600/900w) & make `srcset` conditional | **Done** | `src/pages/menu.js`, `scripts/optimize-images.js`, `public/images/menu/*` | `grep -o 'srcset="[^"]*"' dist/panda-express-menu/index.html \| wc -l`<br>✅ *49 menu items with valid generated responsive variants.* |
| **I3** | Safety test scanning all built HTML in `dist/` for broken local asset references | **Done** | `scripts/verify-assets.js`, `package.json` | `node scripts/verify-assets.js`<br>✅ *Checked asset references across 17 pages; 0 broken links.* |
| **F4** | Nutrition page WCAG contrast hardening (neutral darks/whites, zero green/red on nutrition) | **Done** | `assets/css/style.css`, `scripts/check-contrast.js`, `package.json` | `node scripts/check-contrast.js`<br>✅ *17/17 color pairs pass WCAG 2.1 AA (>= 4.5:1, up to 19.83:1).* |
| **R5** | Documentation rewrite matching real Node.js server, build scripts, and ops | **Done** | `README.md`, `DEPLOYMENT.md` | *Full rewrite covering runtime architecture, monthly auto-rebuild, CSP, and deploy options.* |
| **R6** | Production Dockerfile modernization (non-root `node` user, healthcheck, clean layers) | **Done** | `Dockerfile`, `.dockerignore` | *Updated to multi-stage build, `npm ci`, `/healthz` healthcheck, and persistent volumes.* |
| **R7** | GitHub Actions CI workflow for pull requests and pushes | **Done** | `.github/workflows/ci.yml` | *Added CI workflow running `node --check server.js`, `node build.js`, and `npm test`.* |
