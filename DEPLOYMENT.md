# Deployment & Setup Guide — Panda Express Coupons

This guide covers building, testing, and deploying the **Panda Express Coupons** independent static site and production server.

---

## Step 1: Prerequisites & Dependencies

- **Node.js**: Version 20.x or newer (Node `>=20` engine enforced in `package.json`).
- **NPM**: Version 9.x or newer.

Install production dependencies using `npm ci`:
```bash
npm ci
```

---

## Step 2: Static Compilation & Image Optimization

1. **Optimize photography and generate responsive variants**:
   ```bash
   npm run optimize-images
   ```
   *Generates responsive WebP images in `public/images/optimized/` and `public/images/menu/`, as well as web-optimized JPG fallbacks (<200KB) in `public/images/`.*

2. **Compile static distribution**:
   ```bash
   npm run build
   ```
   *Minifies HTML, CSS, JavaScript with cache-busting hashes, and generates `sitemap.xml` and `robots.txt` in `./dist`.*

3. **Run the comprehensive verification test suite**:
   ```bash
   npm test
   ```

---

## Step 3: Deployment Options

### Option A: Static Hosting (Cloudflare Pages, Netlify, Vercel, AWS S3 / CloudFront)

1. Build the distribution:
   ```bash
   npm run build
   ```
2. Set the publish directory to `./dist`.
3. Pre-configured security and cache headers in `public/_headers` are automatically deployed to Netlify and Cloudflare Pages.

### Option B: Node.js Production Server

1. Start the production server:
   ```bash
   npm start
   ```
2. The server will listen on `PORT` (default `3000`), serving static assets from `dist/`, enforcing 301 redirects, security headers, compression, and handling `/healthz`.

### Option C: Docker Container

1. **Build container**:
   ```bash
   docker build -t pandacoupons:latest .
   ```

2. **Run container**:
   ```bash
   docker run -d \
     --name pandacoupons \
     -p 3000:3000 \
     -e PORT=3000 \
     -e NODE_ENV=production \
     pandacoupons:latest
   ```

---

## Step 5: Monthly Update & Automated Rebuilds

The site is configured to automatically rebuild and deploy on the 1st of every month to update SEO titles, meta descriptions, and structured data with the new month and year.

- **Build Command**: `npm ci && node build.js`
- **Output Directory**: `dist`
- **Node Version**: `20.x` (or `>=20`)
- **Site Time Zone**: Defined by `SITE_TIMEZONE` in `data/site.config.js` (default: `America/Los_Angeles`).
- **GitHub Secret `DEPLOY_HOOK_URL`**: Set this secret in repository settings (`Settings > Secrets and variables > Actions > New repository secret`) with the webhook trigger URL from your static host (e.g. Netlify Build Hook, Vercel Deploy Hook, Cloudflare Pages Deploy Hook).
- **GitHub Variable `SITE_URL`**: Set this variable (`Settings > Secrets and variables > Actions > Variables`) to the live site address (e.g. `https://pandaxpresscoupon.com/`).
- **Manual Trigger / Fail-Safe**: If the 1st passes without an update or if you need an immediate redeploy, go to **Actions > Monthly Rebuild & Deploy > Run workflow**, check **force**, and click **Run workflow**.

---

## Step 6: Health Check & Monitoring

- **Health Check Endpoint**: `GET /healthz` returns `{"status":"ok","timestamp":"..."}` with `200 OK`.
- **Release Packaging**: `npm run release` packages the clean repository into `release-pandacoupons.zip`.

