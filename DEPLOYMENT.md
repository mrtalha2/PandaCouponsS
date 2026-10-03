# Deployment & Setup Guide — Panda Express Coupons

This guide covers setting up, configuring, and deploying the Panda Express Coupons server and administrative portal.

---

## Step 1: Prerequisites & Dependencies

- **Node.js**: Version 20.x or newer (Node `>=20` engine enforced in `package.json`).
- **NPM**: Version 9.x or newer.

Install production dependencies using `npm ci`:
```bash
npm ci
```

---

## Step 2: Generate Admin Credentials

Before starting the server or deploying to any host, generate your administrator password hash and session signing secret using the interactive CLI:

```bash
node scripts/generate-admin-hash.js
```

Or non-interactively in automated setup scripts:
```bash
node scripts/generate-admin-hash.js --user admin --pass "YourSecurePassword2026!"
```

Paste the resulting output into your `.env` file or hosting environment variables:
```env
PORT=3000
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=$2b$12$...
SESSION_SECRET=...
NODE_ENV=production
```

---

## Step 3: Static Compilation & Image Optimization

1. **Optimize photography and generate responsive variants**:
   ```bash
   npm run optimize-images
   ```
   *Generates responsive WebP images in `public/images/optimized/` and `public/images/menu/`, as well as web-optimized JPG fallbacks (<200KB) in `public/images/`.*

2. **Compile static distribution**:
   ```bash
   npm run build
   ```
   *Minifies HTML, CSS, JavaScript, stamps the build month to `dist/.build-month`, and generates `sitemap.xml` and `robots.txt`.*

3. **Run the verification test suite**:
   ```bash
   npm test
   ```

---

## Step 4: Monthly Automatic Freshness Architecture

- **Hourly Cron in `server.js`**: An automated background interval checks the system calendar month every hour.
- **Auto-Rebuild on Rollover**: When the calendar month transitions, the server triggers `build.js` in a subprocess.
- **Dynamic Client Fallback**: Client-side JavaScript (`assets/js/main.js`) reads `<meta name="site-timezone">` and formats dates using `Intl.DateTimeFormat` so visitors in all timezones see accurate, fresh month and year tokens.

---

## Step 5: Deployment Options

### Option A: Standard Docker Multi-Stage Container (Recommended)

The included `Dockerfile` uses a multi-stage Alpine build running as a non-root `node` user with built-in healthchecks on `/healthz`:

1. **Build container**:
   ```bash
   docker build -t pandacoupons:latest .
   ```

2. **Run container with persistent volumes**:
   ```bash
   docker run -d \
     --name pandacoupons \
     -p 3000:3000 \
     -e PORT=3000 \
     -e NODE_ENV=production \
     -e ADMIN_USER=admin \
     -e ADMIN_PASSWORD_HASH='$2b$12$...' \
     -e SESSION_SECRET='...' \
     -v $(pwd)/data:/app/data \
     -v $(pwd)/public/images/uploads:/app/public/images/uploads \
     pandacoupons:latest
   ```

> [!IMPORTANT]
> Always mount persistent volumes for `/app/data` and `/app/public/images/uploads` to ensure admin edits, coupon updates, and uploaded images persist across container restarts.

---

### Option B: Cloud Platforms (Render, Railway, Fly.io)

1. Connect your repository to the hosting platform.
2. Select **Docker** deployment (or Node.js service with `npm ci && npm run build` and start command `node server.js`).
3. Set required Environment Variables:
   - `PORT`: `3000` (or assigned by platform)
   - `ADMIN_USER`: `admin`
   - `ADMIN_PASSWORD_HASH`: `<generated bcrypt hash>`
   - `SESSION_SECRET`: `<generated secret>`
   - `NODE_ENV`: `production`
4. Attach a persistent volume mounted to `/app/data` and `/app/public/images/uploads`.

---

### Option C: Bare Metal VPS (Ubuntu/Debian) with PM2 & Nginx

1. **Clone repository and install dependencies**:
   ```bash
   git clone <repo-url> /var/www/pandacoupons
   cd /var/www/pandacoupons
   npm ci
   npm run optimize-images
   npm run build
   ```

2. **Start service with PM2**:
   ```bash
   pm2 start server.js --name "pandacoupons"
   pm2 save
   pm2 startup
   ```

3. **Nginx Reverse Proxy Configuration**:
   ```nginx
   server {
       server_name pandacoupons.org;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

---

## Step 6: Security & Policy Notes

- **Content Security Policy (CSP)**: Served with `Content-Security-Policy-Report-Only` headers to allow inline styling across dynamic coupon components while reporting violations.
- **Admin Rate Limiting & Sessions**: 5 failed login attempts per 15 minutes trigger a 5-minute lockout. Sessions use `httpOnly`, `SameSite=Strict`, `Secure` cookies with HMAC verification.
- **Traversal Hardening**: Path normalization strictly blocks encoded, null-byte, and backslash escape sequences.
