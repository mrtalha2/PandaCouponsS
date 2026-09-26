# Deployment & Setup Guide — Panda Express Coupons

This guide covers setting up, configuring, and deploying the Panda Express Coupons static site generator and persistent administrative portal.

---

## Step 1: Generate Admin Credentials (Required First Step)

Before starting the server or deploying to any host, generate your administrator password hash and session signing secret using the interactive CLI:

```bash
node scripts/generate-admin-hash.js
```

The CLI will prompt for your desired administrator username and securely mask your password while typing:

```text
Enter desired Admin Username [default: admin]: admin
Enter desired Admin Password (masked): *************

======================================================
✅ Admin Credentials Generated Successfully!
======================================================

Paste the following lines into your server environment variables (or .env file):

ADMIN_USER=admin
ADMIN_PASSWORD_HASH=$2b$12$...
SESSION_SECRET=...
======================================================
```

Alternatively, you can provide parameters non-interactively in automated CI/CD scripts:
```bash
node scripts/generate-admin-hash.js --user admin --pass "YourSecurePassword2026!"
```

---

## Step 2: Environment Variables Reference

The server strictly verifies all four required environment variables on startup. The process exits with code `1` if any are missing:

| Variable | Description | Required | Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Listening HTTP port for the web server | **Yes** | `3000` |
| `ADMIN_USER` | Administrator login username | **Yes** | `admin` |
| `ADMIN_PASSWORD_HASH` | 12-round salted bcrypt hash of your admin password | **Yes** | `$2b$12$...` |
| `SESSION_SECRET` | 64-character random hex string used to sign session cookies | **Yes** | `39d0d9d...` |
| `NODE_ENV` | Application environment (`development` or `production`) | Optional | `production` |

For local development, copy `.env.example` to `.env` and fill in the values generated in Step 1:
```bash
cp .env.example .env
```

---

## Step 3: Deployment Options

### Option A: Standard Docker (Host-Agnostic)

The included multi-stage `Dockerfile` works on any Linux host or container runtime (Render, Railway, Fly.io, DigitalOcean, AWS ECS):

1. **Build the container image**:
   ```bash
   docker build -t pandacoupons:latest .
   ```

2. **Run the container with persistent volumes**:
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
> Always mount persistent volumes for `/app/data` and `/app/public/images/uploads` so coupon updates, page content changes, and media uploads survive container restarts.

---

### Option B: Cloud Platforms (Render / Railway / Fly.io)

1. Connect your repository to the hosting platform.
2. Select **Docker** as the environment (or Node.js with Build Command: `npm install && node build.js`, Start Command: `node server.js`).
3. Under **Environment Variables**, add:
   - `PORT`: `3000` (or host assigned)
   - `ADMIN_USER`: `admin`
   - `ADMIN_PASSWORD_HASH`: `<generated bcrypt hash>`
   - `SESSION_SECRET`: `<generated session secret>`
   - `NODE_ENV`: `production`
4. Attach a persistent disk / volume mapped to `/app/data` and `/app/public/images/uploads`.

---

### Option C: Bare Metal VPS / Ubuntu / Debian with PM2

1. **Clone repository and install dependencies**:
   ```bash
   git clone <repo-url> /var/www/pandacoupons
   cd /var/www/pandacoupons
   npm install
   ```

2. **Compile static assets**:
   ```bash
   node build.js
   ```

3. **Configure environment**:
   Create `/var/www/pandacoupons/.env` containing your generated credentials.

4. **Launch with PM2**:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "pandacoupons"
   pm2 save
   pm2 startup
   ```

5. **Nginx Reverse Proxy Configuration**:
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

## Step 4: Security Features & Architecture

- **HMAC-Signed Sessions**: Admin sessions use signed `httpOnly`, `SameSite=Strict`, `Secure` (in production) cookies signed with your `SESSION_SECRET`.
- **Brute-Force Rate Limiting**: If 5 failed login attempts occur from a single IP within 15 minutes, the IP is automatically locked out for 5 minutes.
- **CSRF Protection**: All mutating admin requests (`POST`, `PUT`, `DELETE`) require a cryptographically unique `X-CSRF-Token` header tied to the authenticated session.
- **Sanitized Rich-Text**: Public policies and rich-text pages pass through an allowlist-based HTML sanitizer (`sanitize-html`) before saving.
- **Zero-Downtime Safe Publishing**: The "Rebuild & Publish" button compiles the static site in the background. If a build error occurs, the previous working `dist/` directory is automatically restored without affecting the live public site.
- **Atomic Backup System**: Before any write to `data/admin/*.json` or `data/coupons.json`, a timestamped backup is saved to `data/admin/backups/` (capped at the 20 most recent versions per file).
