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

## Step 4: Health Check & Monitoring

- **Health Check Endpoint**: `GET /healthz` returns `{"status":"ok","timestamp":"..."}` with `200 OK`.
- **Release Packaging**: `npm run release` packages the clean repository into `release-pandacoupons.zip`.
