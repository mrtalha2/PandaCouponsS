/**
 * Panda Express Coupons - Persistent Production & Development Server
 * Supports static delivery, 301 redirects, session auth, and administrative management.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const Busboy = require('busboy');
const bcrypt = require('bcryptjs');
const zlib = require('zlib');

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Admin Modules
const auth = require('./src/admin/auth');
const dataManager = require('./src/admin/data-manager');
const publisher = require('./src/admin/publisher');
const mediaManager = require('./src/admin/media');
const { renderPreview } = require('./src/admin/preview-engine');

// Admin Views
const renderAdminLayout = require('./src/admin/views/layout');
const renderLogin = require('./src/admin/views/login');
const renderDashboard = require('./src/admin/views/dashboard');
const renderCoupons = require('./src/admin/views/coupons');
const renderPages = require('./src/admin/views/pages');
const renderVisualEditor = require('./src/admin/views/editor');
const { renderBlocks } = require('./src/admin/block-renderer');
const { loadAllPageBlocks } = require('./src/admin/block-converter');
const { getDynamicDate } = require('./src/utils/date');
const renderMeta = require('./src/admin/views/meta');
const renderCode = require('./src/admin/views/code');
const renderRedirects = require('./src/admin/views/redirects');
const renderMedia = require('./src/admin/views/media');

// Load environment variables if .env exists
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath) && !process.env.IGNORE_DOTENV) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        if (!process.env[k.trim()]) {
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    });
  }
} catch (e) {}

// Strict environment validation (Phase A.1)
const REQUIRED_ENV = ['PORT', 'ADMIN_USER', 'ADMIN_PASSWORD_HASH', 'SESSION_SECRET'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key] || !process.env[key].trim());
if (missingEnv.length > 0) {
  console.error('\n❌ CRITICAL STARTUP FAILURE: Required environment variables are missing:');
  missingEnv.forEach(key => console.error(`   - ${key}`));
  console.error('\nPlease define them in your environment settings or .env file before starting the server.');
  console.error('Run "node scripts/generate-admin-hash.js" to generate credentials and a session secret.\n');
  process.exit(1);
}

const sanitizeHtml = require('sanitize-html');
const SANITIZE_OPTIONS = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span'
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel', 'class'],
    '*': ['class', 'id', 'style']
  },
  allowedSchemes: ['http', 'https', 'mailto']
};

const INLINE_SANITIZE_OPTIONS = {
  allowedTags: ['b', 'strong', 'i', 'em', 'a', 'br', 'span'],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'class'],
    span: ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto']
};

const INLINE_UPGRADED_FIELDS = new Set([
  'heroSubtext',
  'couponSubtext',
  'deliveryNotice',
  'rewardsSubtext',
  'familySubtext',
  'heroSubtitle',
  'sourceDisclosure',
  'intro',
  'subtitle'
]);

function sanitizeBlock(block) {
  if (!block || typeof block !== 'object') return block;
  const clean = { ...block };
  if (typeof clean.content === 'string') {
    clean.content = sanitizeHtml(clean.content, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.question === 'string') {
    clean.question = sanitizeHtml(clean.question, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.answer === 'string') {
    clean.answer = sanitizeHtml(clean.answer, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.title === 'string') {
    clean.title = sanitizeHtml(clean.title, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.subtitle === 'string') {
    clean.subtitle = sanitizeHtml(clean.subtitle, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.subtext === 'string') {
    clean.subtext = sanitizeHtml(clean.subtext, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.intro === 'string') {
    clean.intro = sanitizeHtml(clean.intro, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.kicker === 'string') {
    clean.kicker = sanitizeHtml(clean.kicker, { allowedTags: [], allowedAttributes: {} });
  }
  if (typeof clean.heading === 'string') {
    clean.heading = sanitizeHtml(clean.heading, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.text === 'string') {
    clean.text = sanitizeHtml(clean.text, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.caption === 'string') {
    clean.caption = sanitizeHtml(clean.caption, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.deliveryNotice === 'string') {
    clean.deliveryNotice = sanitizeHtml(clean.deliveryNotice, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.disclosure === 'string') {
    clean.disclosure = sanitizeHtml(clean.disclosure, INLINE_SANITIZE_OPTIONS);
  }
  if (typeof clean.url === 'string') {
    if (!clean.url.startsWith('http://') && !clean.url.startsWith('https://') && !clean.url.startsWith('/') && !clean.url.startsWith('#')) {
      clean.url = '#' + clean.url;
    }
  }
  return clean;
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8'
};

// Body parsers
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2e6) { // 2MB
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function parseUrlEncodedBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const result = {};
      for (const [key, value] of params.entries()) {
        result[key] = value;
      }
      resolve(result);
    });
    req.on('error', reject);
  });
}

// Redirect checking
function check301Redirects(req, res) {
  const redirects = dataManager.readData('redirects.json', []);
  const reqPath = req.url.split('?')[0];

  const matched = redirects.find(r => r.from === reqPath || r.from === reqPath + '/');
  if (matched) {
    res.writeHead(301, { 'Location': matched.to, 'Cache-Control': 'public, max-age=3600' });
    res.end();
    return true;
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  try {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/healthz' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('200 ok');
  }
  const clientIp = auth.getClientIp(req);

  // Security Headers (sitewide)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Content-Security-Policy-Report-Only', "default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://formspree.io");

  const proto = req.headers['x-forwarded-proto'] || (req.socket && req.socket.encrypted ? 'https' : 'http');
  if (proto === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Search engine indexation control: explicitly block indexing of admin/preview routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  // 1. Check 301 redirects first
  if (check301Redirects(req, res)) return;

  // ==========================================
  // AUTHENTICATION ROUTES
  // ==========================================
  if (pathname === '/admin/login') {
    const rateCheck = auth.checkRateLimit(clientIp);

    if (req.method === 'GET') {
      const session = auth.getSession(req);
      if (session) {
        res.writeHead(302, { 'Location': '/admin' });
        return res.end();
      }

      const isExpired = parsedUrl.query && parsedUrl.query.expired === '1';
      const expiredMsg = isExpired ? 'Your session expired — please log in again.' : null;

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(renderLogin({
        error: rateCheck.allowed ? expiredMsg : rateCheck.message,
        lockout: !rateCheck.allowed,
        info: isExpired && rateCheck.allowed
      }));
    }

    if (req.method === 'POST') {
      if (!rateCheck.allowed) {
        res.writeHead(429, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderLogin({ error: rateCheck.message, lockout: true }));
      }

      const body = await parseUrlEncodedBody(req);
      const username = (body.username || '').trim();
      const password = (body.password || '').trim();

      if (auth.verifyCredentials(username, password)) {
        auth.clearRateLimit(clientIp);
        const { sessionId } = auth.createSession(username);
        auth.setSessionCookie(res, sessionId);
        res.writeHead(302, { 'Location': '/admin' });
        return res.end();
      } else {
        auth.recordFailedAttempt(clientIp);
        const newCheck = auth.checkRateLimit(clientIp);
        res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderLogin({
          error: newCheck.allowed ? 'Invalid username or password.' : newCheck.message,
          lockout: !newCheck.allowed
        }));
      }
    }
  }

  if (pathname === '/admin/logout') {
    auth.destroySession(req, res);
    res.writeHead(302, { 'Location': '/admin/login' });
    return res.end();
  }

  // ==========================================
  // PROTECTED ADMIN ROUTE GUARDS
  // ==========================================
  if (pathname.startsWith('/admin')) {
    const session = auth.getSession(req);
    if (!session) {
      if (pathname.startsWith('/admin/api/')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Unauthorized session' }));
      }
      res.writeHead(302, { 'Location': '/admin/login' });
      return res.end();
    }

    const publishState = publisher.getPublishState();

    // ------------------------------------------
    // ADMIN API ENDPOINTS
    // ------------------------------------------
    if (pathname.startsWith('/admin/api/')) {
      // GET /admin/api/csrf-token — returns current CSRF token for the authenticated session
      if (pathname === '/admin/api/csrf-token' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        return res.end(JSON.stringify({ csrfToken: session.csrfToken }));
      }

      // Validate CSRF on mutating requests
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        if (!pathname.endsWith('/media/upload') && !auth.validateCsrf(req, session)) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Invalid CSRF token' }));
        }
      }

      // API: Publish
      if (pathname === '/admin/api/publish' && req.method === 'POST') {
        const result = await publisher.runPublish();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(result));
      }

      // API: Coupons CRUD
      if (pathname === '/admin/api/coupons' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const couponsData = dataManager.readData('coupons.json', { coupons: [] });
        let changeDesc = '';

        if (body.action === 'add') {
          const newCoupon = {
            id: Date.now().toString(),
            ...body.coupon
          };
          couponsData.coupons.unshift(newCoupon);
          changeDesc = `Added coupon ${newCoupon.code}`;
        } else if (body.action === 'edit') {
          if (couponsData.coupons[body.index]) {
            couponsData.coupons[body.index] = {
              ...couponsData.coupons[body.index],
              ...body.coupon
            };
            changeDesc = `Updated coupon ${couponsData.coupons[body.index].code}`;
          }
        } else if (body.action === 'delete') {
          const removed = couponsData.coupons.splice(body.index, 1);
          changeDesc = `Deleted coupon ${removed[0]?.code || ''}`;
        } else if (body.action === 'reorder') {
          const { index, direction } = body;
          const targetIndex = index + direction;
          if (targetIndex >= 0 && targetIndex < couponsData.coupons.length) {
            const item = couponsData.coupons.splice(index, 1)[0];
            couponsData.coupons.splice(targetIndex, 0, item);
            changeDesc = `Reordered coupons list`;
          }
        } else if (body.action === 'bulk-expire') {
          body.indices.forEach(idx => {
            if (couponsData.coupons[idx]) couponsData.coupons[idx].status = 'Expired';
          });
          changeDesc = `Bulk expired ${body.indices.length} coupons`;
        } else if (body.action === 'bulk-delete') {
          couponsData.coupons = couponsData.coupons.filter((_, idx) => !body.indices.includes(idx));
          changeDesc = `Bulk deleted ${body.indices.length} coupons`;
        }

        dataManager.writeData('coupons.json', couponsData, changeDesc);
        await publisher.runPublish();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, published: true }));
      }

      // API: Page Content
      if (pathname === '/admin/api/pages' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const pageContent = dataManager.readData('page-content.json', {});
        if (body.updates) {
          for (const section in body.updates) {
            const secUpdates = body.updates[section];
            if (secUpdates && typeof secUpdates === 'object') {
              for (const field in secUpdates) {
                const val = secUpdates[field];
                if (typeof val === 'string') {
                  if (field === 'bodyHtml' || field === 'contentHtml') {
                    secUpdates[field] = sanitizeHtml(val, SANITIZE_OPTIONS);
                  } else if (INLINE_UPGRADED_FIELDS.has(field) || field === 'heroHeading') {
                    secUpdates[field] = sanitizeHtml(val, INLINE_SANITIZE_OPTIONS);
                  } else {
                    secUpdates[field] = sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });
                  }
                }
              }
            }
            pageContent[section] = { ...(pageContent[section] || {}), ...secUpdates };
          }
        }
        dataManager.writeData('page-content.json', pageContent, `Updated ${body.page || 'page'} content`);
        await publisher.runPublish();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, published: true }));
      }

      // API: Visual Block Editor Save (Draft Autosave & Manual Save)
      if (pathname === '/admin/api/blocks' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const allBlocks = dataManager.readData('page-blocks.json', null) || loadAllPageBlocks();
        const pageKey = body.page || 'home';
        if (Array.isArray(body.blocks)) {
          allBlocks[pageKey] = body.blocks.map(sanitizeBlock);
        }
        dataManager.writeData('page-blocks.json', allBlocks, `Draft updated blocks for ${pageKey}`);

        // Also sync relevant fields to page-content.json for bidirectional compatibility
        try {
          const pageContent = dataManager.readData('page-content.json', {});
          const blocks = allBlocks[pageKey] || [];
          if (pageKey === 'home') {
            const hero = blocks.find(b => b.type === 'hero');
            const coupons = blocks.find(b => b.type === 'coupon-grid');
            const rewards = blocks.find(b => b.type === 'rewards-calculator');
            const family = blocks.find(b => b.type === 'family-meal-stepper');
            pageContent.home = {
              ...(pageContent.home || {}),
              ...(hero ? { kicker: hero.kicker, heroHeading: hero.title, heroSubtext: hero.subtitle, btnCodesText: hero.primaryBtnText, btnFamilyText: hero.secondaryBtnText } : {}),
              ...(coupons ? { couponHeading: coupons.heading, couponSubtext: coupons.subtext, deliveryNotice: coupons.deliveryNotice } : {}),
              ...(rewards ? { rewardsHeading: rewards.heading, rewardsSubtext: rewards.subtext } : {}),
              ...(family ? { familyHeading: family.heading, familySubtext: family.subtext } : {})
            };
          } else if (pageKey === 'menu') {
            const mg = blocks.find(b => b.type === 'menu-grid');
            if (mg) {
              pageContent.menu = {
                ...(pageContent.menu || {}),
                badgeText: mg.badgeText,
                heroTitle: mg.heading,
                heroSubtitle: mg.subtext,
                stat1Label: mg.stat1Label,
                stat2Label: mg.stat2Label,
                stat3Label: mg.stat3Label
              };
            }
          } else if (pageKey === 'nutrition') {
            const nc = blocks.find(b => b.type === 'nutrition-calculator');
            if (nc) {
              pageContent.nutrition = {
                ...(pageContent.nutrition || {}),
                badgeText: nc.badgeText,
                heroTitle: nc.heading,
                heroSubtitle: nc.subtext,
                sourceDisclosure: nc.disclosure,
                tab1Label: nc.tab1Label,
                tab2Label: nc.tab2Label
              };
            }
          } else if (pageKey === 'orange-chicken' || pageKey === 'beijing-beef') {
            const dg = blocks.find(b => b.type === 'dish-guide');
            if (dg) {
              pageContent[pageKey] = {
                ...(pageContent[pageKey] || {}),
                title: dg.title,
                subtitle: dg.subtitle,
                intro: dg.intro
              };
            }
          } else if (pageKey === 'contact') {
            const cf = blocks.find(b => b.type === 'contact-form');
            if (cf) {
              pageContent.contact = {
                ...(pageContent.contact || {}),
                heading: cf.title,
                subtitle: cf.subtitle,
                supportEmail: cf.supportEmail
              };
            }
          }
          dataManager.writeData('page-content.json', pageContent, `Synced page-content.json from visual blocks for ${pageKey}`);
        } catch (syncErr) {
          console.error('Error syncing page-content.json:', syncErr);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, saved: true }));
      }

      // API: Visual Block Editor Live Real-Time Canvas Renderer
      if (pathname === '/admin/api/blocks/render-canvas' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const cleanBlocks = (body.blocks || []).map(sanitizeBlock);
        const canvasHtml = renderBlocks(cleanBlocks, { lastVerified: getDynamicDate().currentMonthYear }, true);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, html: canvasHtml }));
      }

      // API: Change Password
      if (pathname === '/admin/api/change-password' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const currentPassword = (body.currentPassword || '').trim();
        const newPassword = (body.newPassword || '').trim();
        const confirmPassword = (body.confirmPassword || '').trim();

        if (!currentPassword || !newPassword || !confirmPassword) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'All password fields are required.' }));
        }

        if (newPassword !== confirmPassword) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'New password and confirmation do not match.' }));
        }

        if (newPassword.length < 8) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'New password must be at least 8 characters long.' }));
        }

        // Verify current password against active hash
        const currentHash = process.env.ADMIN_PASSWORD_HASH || '';
        let isMatch = false;
        try {
          isMatch = bcrypt.compareSync(currentPassword, currentHash);
        } catch (cmpErr) {
          isMatch = false;
        }

        if (!isMatch) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Current password is incorrect.' }));
        }

        // Generate salted bcrypt hash
        const newHash = bcrypt.hashSync(newPassword, 12);

        // Update .env file persistently
        try {
          const envPath = path.join(__dirname, '.env');
          let envContent = '';
          if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
          }

          if (envContent.includes('ADMIN_PASSWORD_HASH=')) {
            envContent = envContent.replace(/ADMIN_PASSWORD_HASH=[^\r\n]*(\r?\n|$)/, `ADMIN_PASSWORD_HASH=${newHash}$1`);
          } else {
            envContent += `\nADMIN_PASSWORD_HASH=${newHash}\n`;
          }

          fs.writeFileSync(envPath, envContent, 'utf8');
        } catch (fileErr) {
          console.error('Error persisting new password to .env:', fileErr);
        }

        // Update in-memory hash immediately
        process.env.ADMIN_PASSWORD_HASH = newHash;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, message: 'Password updated successfully!' }));
      }

      // API: Meta
      if (pathname === '/admin/api/meta' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const metaData = dataManager.readData('page-meta.json', {});
        metaData[body.path] = body.meta;
        dataManager.writeData('page-meta.json', metaData, `Updated SEO metadata for ${body.path}`);
        await publisher.runPublish();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, published: true }));
      }

      // API: Code Injections
      if (pathname === '/admin/api/code' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        dataManager.writeData('site-injections.json', body, 'Updated custom code injections');
        await publisher.runPublish();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, published: true }));
      }

      // API: Redirects
      if (pathname === '/admin/api/redirects' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        let redirects = dataManager.readData('redirects.json', []);
        let changeDesc = '';

        if (body.action === 'add') {
          redirects.push(body.redirect);
          changeDesc = `Added redirect ${body.redirect.from} -> ${body.redirect.to}`;
        } else if (body.action === 'delete') {
          const removed = redirects.splice(body.index, 1);
          changeDesc = `Deleted redirect ${removed[0]?.from || ''}`;
        }

        dataManager.writeData('redirects.json', redirects, changeDesc);
        await publisher.runPublish();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, published: true }));
      }

      // API: Media Upload
      if (pathname === '/admin/api/media/upload' && req.method === 'POST') {
        const busboy = Busboy({ headers: req.headers });
        let fileBuffer = [];
        let filename = '';

        busboy.on('file', (name, file, info) => {
          filename = info.filename;
          file.on('data', (data) => fileBuffer.push(data));
        });

        busboy.on('finish', async () => {
          if (!fileBuffer.length) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: 'No file uploaded' }));
          }
          const buffer = Buffer.concat(fileBuffer);
          try {
            const result = await mediaManager.processUploadedImage(filename, buffer);
            dataManager.recordPendingChange(`Uploaded media asset ${filename}`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, ...result }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });

        return req.pipe(busboy);
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }

    // ------------------------------------------
    // DYNAMIC PREVIEW ROUTE
    // ------------------------------------------
    if (pathname.startsWith('/admin/preview/')) {
      const pageKey = pathname.replace('/admin/preview/', '').replace(/\/$/, '');
      const previewHtml = renderPreview(pageKey);
      if (previewHtml) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(previewHtml);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Preview page not found: ' + pageKey);
      }
    }

    // ------------------------------------------
    // ADMIN PAGES (GET)
    // ------------------------------------------
    let html = '';

    if (pathname === '/admin' || pathname === '/admin/') {
      const couponsData = dataManager.readData('coupons.json', { coupons: [] });
      const redirectsData = dataManager.readData('redirects.json', []);
      const stats = {
        totalCoupons: couponsData.coupons.length,
        activeCoupons: couponsData.coupons.filter(c => c.status === 'Active' && !c.isDraft).length,
        totalRedirects: redirectsData.length
      };
      html = renderAdminLayout({
        title: 'Dashboard',
        activeNav: 'dashboard',
        session,
        publishState,
        content: renderDashboard({ publishState, stats })
      });
    } else if (pathname === '/admin/coupons') {
      const couponsData = dataManager.readData('coupons.json', { coupons: [] });
      html = renderAdminLayout({
        title: 'Coupons Manager',
        activeNav: 'coupons',
        session,
        publishState,
        content: renderCoupons({ coupons: couponsData.coupons })
      });
    } else if (pathname === '/admin/pages' || pathname.startsWith('/admin/edit/')) {
      const activePage = pathname.startsWith('/admin/edit/')
        ? pathname.replace('/admin/edit/', '').replace(/\/$/, '')
        : (parsedUrl.query.page || 'home');
      const allBlocks = dataManager.readData('page-blocks.json', null) || loadAllPageBlocks();
      const blocks = allBlocks[activePage] || [];
      html = renderAdminLayout({
        title: `Visual Block Editor – ${activePage}`,
        activeNav: 'pages',
        session,
        publishState,
        content: renderVisualEditor({ activePage, blocks, publishState })
      });
    } else if (pathname === '/admin/meta') {
      const activePath = parsedUrl.query.path || '/';
      const metaData = dataManager.readData('page-meta.json', {});
      const mediaUploads = mediaManager.listUploads();
      html = renderAdminLayout({
        title: 'SEO Meta Editor',
        activeNav: 'meta',
        session,
        publishState,
        content: renderMeta({ activePath, metaData, mediaUploads })
      });
    } else if (pathname === '/admin/code') {
      const injections = dataManager.readData('site-injections.json', {});
      html = renderAdminLayout({
        title: 'Custom Code Injections',
        activeNav: 'code',
        session,
        publishState,
        content: renderCode({ injections })
      });
    } else if (pathname === '/admin/redirects') {
      const redirects = dataManager.readData('redirects.json', []);
      html = renderAdminLayout({
        title: '301 Redirects',
        activeNav: 'redirects',
        session,
        publishState,
        content: renderRedirects({ redirects })
      });
    } else if (pathname === '/admin/media') {
      const uploads = mediaManager.listUploads();
      html = renderAdminLayout({
        title: 'Media Library',
        activeNav: 'media',
        session,
        publishState,
        content: renderMedia({ uploads })
      });
    } else {
      res.writeHead(302, { 'Location': '/admin' });
      return res.end();
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  // ==========================================
  // PUBLIC STATIC SITE SERVING
  // ==========================================
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Allow': 'GET, HEAD', 'Content-Type': 'text/plain' });
    return res.end('Method Not Allowed');
  }

  const distRoot = path.resolve(DIST_DIR);
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch (err) {
    res.writeHead(400); return res.end('Bad request');
  }
  if (decoded.includes('\0')) {
    res.writeHead(400); return res.end('Bad request');
  }

  // Block segments starting with dot, except the whole name can be .html etc, but block .env, .git, etc.
  const pathParts = decoded.split('/');
  if (pathParts.some(p => p.startsWith('.') && p.length > 1)) {
    res.writeHead(403); return res.end('Forbidden');
  }

  let filePath = path.resolve(distRoot, '.' + decoded);
  if (filePath !== distRoot && !filePath.startsWith(distRoot + path.sep)) {
    res.writeHead(403); return res.end('Forbidden');
  }

  // Check public/ directory if not found in dist/
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // If it's a directory, maybe index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory() && fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    } else if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else {
      const publicRoot = path.resolve(PUBLIC_DIR);
      let pubDecoded = pathname.replace(/^\/public\//, '/');
      let pubFilePath = path.resolve(publicRoot, '.' + pubDecoded);
      if (pubFilePath === publicRoot || pubFilePath.startsWith(publicRoot + path.sep)) {
        if (fs.existsSync(pubFilePath) && !fs.statSync(pubFilePath).isDirectory()) {
          filePath = pubFilePath;
        }
      }
    }
  }

  // Block data files from being served statically
  if (filePath.includes(path.sep + 'data' + path.sep) && (filePath.endsWith('.map') || filePath.endsWith('.env') || filePath.endsWith('.json'))) {
    res.writeHead(403); return res.end('Forbidden');
  }

  // 404 handler
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const notFoundPage = path.join(distRoot, '404.html');
    if (fs.existsSync(notFoundPage)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(notFoundPage));
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Cache headers (S5)
  if (ext === '.woff2') {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (['.css', '.js'].includes(ext)) {
    // Fingerprinted?
    const base = path.basename(filePath);
    if (base.match(/\.[0-9a-f]{8}\.(css|js)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400');
    }
  } else if (['.webp', '.avif', '.jpg', '.jpeg', '.png', '.svg', '.ico'].includes(ext)) {
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
  } else if (ext === '.html') {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  } else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error: ' + err.code);
    } else {
      // Compression (S3)
      const acceptEncoding = req.headers['accept-encoding'] || '';
      res.setHeader('Vary', 'Accept-Encoding');
      
      const compressable = ['text/html; charset=utf-8', 'text/css; charset=utf-8', 'application/javascript; charset=utf-8', 'application/json; charset=utf-8', 'image/svg+xml', 'application/xml', 'text/plain; charset=utf-8'];
      
      if (content.length >= 1024 && compressable.includes(contentType)) {
        if (acceptEncoding.includes('br')) {
          res.writeHead(200, { 'Content-Type': contentType, 'Content-Encoding': 'br' });
          return res.end(zlib.brotliCompressSync(content));
        } else if (acceptEncoding.includes('gzip')) {
          res.writeHead(200, { 'Content-Type': contentType, 'Content-Encoding': 'gzip' });
          return res.end(zlib.gzipSync(content));
        }
      }

      res.writeHead(200, { 'Content-Type': contentType });
      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(content);
      }
    }
  });
  } catch (err) {
    console.error('Top-level request error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    }
  }
});

server.requestTimeout = 30000;
server.headersTimeout = 31000;
server.keepAliveTimeout = 30000;

process.on('SIGTERM', () => { console.log('SIGTERM'); server.close(() => process.exit(0)); });
process.on('SIGINT', () => { console.log('SIGINT'); server.close(() => process.exit(0)); });



// ==========================================
// MONTHLY REBUILD SCHEDULER
// ==========================================
let isRebuilding = false;

function checkAndRebuild() {
  if (isRebuilding) return;
  const { currentMonthYear } = getDynamicDate();
  const buildMonthFile = path.join(DIST_DIR, '.build-month');
  let lastBuildMonth = '';
  if (fs.existsSync(buildMonthFile)) {
    lastBuildMonth = fs.readFileSync(buildMonthFile, 'utf8').trim();
  }
  
  if (lastBuildMonth !== currentMonthYear) {
    isRebuilding = true;
    console.log(`[Scheduler] Month changed from '${lastBuildMonth}' to '${currentMonthYear}'. Triggering rebuild.`);
    publisher.runPublish().then(res => {
      isRebuilding = false;
      if (res.success) {
        console.log(`[Scheduler] Rebuild successful.`);
      } else {
        console.error(`[Scheduler] Rebuild failed.`);
      }
    }).catch(err => {
      isRebuilding = false;
      console.error(`[Scheduler] Rebuild error:`, err);
    });
  }
}
const intervalTimer = setInterval(checkAndRebuild, 3600000); // Check hourly
if (intervalTimer.unref) intervalTimer.unref();

const startupTimer = setTimeout(checkAndRebuild, 5000); // Check on startup after 5 seconds
if (startupTimer.unref) startupTimer.unref();

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Panda Express Coupons Server Active`);
  console.log(`👉 Public Site:  http://localhost:${PORT}/`);
  console.log(`👉 Admin Portal: http://localhost:${PORT}/admin`);
  console.log(`======================================================\n`);
});
