/**
 * Panda Express Coupons - High-Performance Static Production & Dev Server
 * Pure zero-dependency server: static delivery, security headers, 301 redirects,
 * compression, healthz endpoint, 404 handling, and traversal protection.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const zlib = require('zlib');
const { securityHeaders, cacheHeaders } = require('./headers.config');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Load optional .env file
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath) && !process.env.IGNORE_DOTENV) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach((line) => {
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

const PORT = parseInt(process.env.PORT || '3000', 10);
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

// Rate Limiting Map (IP -> { count, resetTime })
const ipRequestMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 600;

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now > record.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}, 30000);

function isRateLimited(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  let record = ipRequestMap.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    ipRequestMap.set(ip, record);
    return false;
  }
  record.count++;
  return record.count > RATE_LIMIT_MAX;
}

// 301 Permanent Redirect Routes
const STATIC_301_REDIRECTS = {
  '/about-us': '/about-us/',
  '/contact-us': '/contact-us/',
  '/disclaimer': '/disclaimer/',
  '/privacy-policy': '/privacy-policy/',
  '/panda-express-menu': '/panda-express-menu/',
  '/panda-express-nutrition': '/panda-express-nutrition/',
  '/panda-express-savings-calculator': '/panda-express-savings-calculator/',
  '/panda-express-orange-chicken': '/panda-express-orange-chicken/',
  '/beijing-beef': '/beijing-beef/',
  '/panda-express-grilled-teriyaki': '/panda-express-grilled-teriyaki/',
  '/panda-express-cream-cheese': '/panda-express-cream-cheese/',
  '/panda-express-black-pepper-steak': '/panda-express-black-pepper-steak/',
  '/panda-express-sweet-sour-chicken': '/panda-express-sweet-sour-chicken/',
  '/panda-express-string-bean-chicken': '/panda-express-string-bean-chicken/',
  '/panda-express-chow-mein': '/panda-express-chow-mein/',
  '/index.html': '/',
  '/about-us/index.html': '/about-us/',
  '/contact-us/index.html': '/contact-us/',
  '/disclaimer/index.html': '/disclaimer/',
  '/privacy-policy/index.html': '/privacy-policy/',
  '/panda-express-menu/index.html': '/panda-express-menu/',
  '/panda-express-nutrition/index.html': '/panda-express-nutrition/',
  '/panda-express-savings-calculator/index.html': '/panda-express-savings-calculator/',
  '/panda-express-orange-chicken/index.html': '/panda-express-orange-chicken/',
  '/beijing-beef/index.html': '/beijing-beef/'
};

// Security Headers Helper
function setSecurityHeaders(res) {
  for (const [header, val] of Object.entries(securityHeaders)) {
    res.setHeader(header, val);
  }
}

// Cache-Control Header Resolver
function getCacheControlHeader(pathname, ext) {
  if (pathname.includes('/assets/css/style.') || pathname.includes('/assets/js/main.') || ext === '.woff2') {
    return cacheHeaders.immutableAssets;
  }
  if (['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.ico'].includes(ext)) {
    return cacheHeaders.staticAssets;
  }
  if (ext === '.html' || pathname.endsWith('/')) {
    return cacheHeaders.htmlPages;
  }
  return 'public, max-age=3600';
}

// Serve compressed or uncompressed response
function sendResponse(req, res, statusCode, contentType, body, cacheControl) {
  setSecurityHeaders(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  if (cacheControl) {
    res.setHeader('Cache-Control', cacheControl);
  }

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  if (typeof body === 'string') {
    body = Buffer.from(body, 'utf8');
  }

  const acceptEncoding = req.headers['accept-encoding'] || '';
  if (body && body.length > 512) {
    if (acceptEncoding.includes('gzip')) {
      zlib.gzip(body, (err, gzipped) => {
        if (!err) {
          res.setHeader('Content-Encoding', 'gzip');
          res.setHeader('Vary', 'Accept-Encoding');
          res.end(gzipped);
          return;
        }
        res.end(body);
      });
      return;
    }
  }

  res.end(body);
}

// Serve Custom 404 Page
function serve404(req, res) {
  const custom404Path = path.join(DIST_DIR, '404.html');
  if (fs.existsSync(custom404Path)) {
    const html = fs.readFileSync(custom404Path, 'utf8');
    sendResponse(req, res, 404, 'text/html; charset=utf-8', html, 'no-cache');
  } else {
    sendResponse(req, res, 404, 'text/html; charset=utf-8', '<h1>404 - Page Not Found</h1>', 'no-cache');
  }
}

// Resolve static file path in dist or public
function resolveStaticFilePath(decodedPath) {
  // Try direct file in dist
  let filePath = path.join(DIST_DIR, decodedPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  // If path is a folder with index.html in dist
  if (decodedPath.endsWith('/')) {
    filePath = path.join(DIST_DIR, decodedPath, 'index.html');
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  } else {
    filePath = path.join(DIST_DIR, decodedPath, 'index.html');
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }

  // Try public directory
  if (decodedPath.startsWith('/public/')) {
    filePath = path.join(__dirname, decodedPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }

  return null;
}

// Create HTTP Server
const server = http.createServer((req, res) => {
  // Method guard (Phase 7d)
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, HEAD, POST');
    sendResponse(req, res, 405, 'text/plain; charset=utf-8', 'Method Not Allowed');
    return;
  }

  // URI Length Guard
  if (req.url.length > 2048) {
    sendResponse(req, res, 414, 'text/plain; charset=utf-8', 'URI Too Long');
    return;
  }

  // Rate Limiting
  if (isRateLimited(req)) {
    sendResponse(req, res, 429, 'text/plain; charset=utf-8', 'Too Many Requests');
    return;
  }

  // Path Traversal Guard
  const rawUrl = req.url || '/';
  if (
    rawUrl.includes('/../') ||
    rawUrl.includes('/%2e%2e/') ||
    rawUrl.includes('/..%2f') ||
    rawUrl.includes('/..%5c') ||
    rawUrl.includes('/%00') ||
    rawUrl.includes('\0') ||
    rawUrl.startsWith('/.git')
  ) {
    if (rawUrl.includes('/%00') || rawUrl.includes('\0')) {
      sendResponse(req, res, 400, 'text/plain; charset=utf-8', 'Bad Request');
      return;
    }
    serve404(req, res);
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = url.parse(req.url, true);
  } catch (err) {
    sendResponse(req, res, 400, 'text/plain; charset=utf-8', 'Bad Request');
    return;
  }

  const pathname = parsedUrl.pathname || '/';

  // Health check endpoint
  if (pathname === '/healthz') {
    setSecurityHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', cacheHeaders.healthCheck);
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // 301 Permanent Redirects
  if (STATIC_301_REDIRECTS[pathname]) {
    setSecurityHeaders(res);
    res.statusCode = 301;
    res.setHeader('Location', STATIC_301_REDIRECTS[pathname]);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.end();
    return;
  }

  // Trailing slash redirect for directory paths
  if (!pathname.endsWith('/') && !path.extname(pathname)) {
    const candidateDir = path.join(DIST_DIR, pathname);
    if (fs.existsSync(candidateDir) && fs.statSync(candidateDir).isDirectory()) {
      setSecurityHeaders(res);
      res.statusCode = 301;
      const search = parsedUrl.search || '';
      res.setHeader('Location', pathname + '/' + search);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.end();
      return;
    }
  }

  // Decode URI component safely
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch (e) {
    sendResponse(req, res, 400, 'text/plain; charset=utf-8', 'Bad Request');
    return;
  }

  // Static File Resolution
  const staticFile = resolveStaticFilePath(decodedPath);
  if (staticFile) {
    const ext = path.extname(staticFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const cacheControl = getCacheControlHeader(pathname, ext);

    try {
      const fileData = fs.readFileSync(staticFile);
      sendResponse(req, res, 200, contentType, fileData, cacheControl);
      return;
    } catch (readErr) {
      console.error('File read error:', readErr);
      serve404(req, res);
      return;
    }
  }

  // Fallback 404
  serve404(req, res);
});

// Optional Auto-Rebuild Scheduler (Self-Hosted Fallback when AUTO_REBUILD=1)
if (process.env.AUTO_REBUILD === '1') {
  const { execSync } = require('child_process');
  const { getSiteDateParts } = require('./src/utils/date');
  let isRebuilding = false;

  function performAutoRebuild() {
    if (isRebuilding) return;
    try {
      const buildMonthFile = path.join(DIST_DIR, '.build-month');
      const currentBuildMonth = fs.existsSync(buildMonthFile) ? fs.readFileSync(buildMonthFile, 'utf8').trim() : '';
      const { monthYearLabel } = getSiteDateParts();

      if (currentBuildMonth !== monthYearLabel) {
        isRebuilding = true;
        console.log(`[Auto-Rebuild] Month changed ("${currentBuildMonth}" -> "${monthYearLabel}"). Rebuilding static site...`);
        
        // Backup dist before rebuild in case of failure
        const backupDir = path.join(__dirname, 'dist.bak');
        try {
          if (fs.existsSync(DIST_DIR)) {
            fs.cpSync(DIST_DIR, backupDir, { recursive: true });
          }
          execSync('node build.js', { cwd: __dirname, stdio: 'pipe' });
          if (fs.existsSync(backupDir)) {
            fs.rmSync(backupDir, { recursive: true, force: true });
          }
          console.log(`[Auto-Rebuild] Rebuild complete successfully for ${monthYearLabel}.`);
        } catch (buildErr) {
          console.error('[Auto-Rebuild] Build error, restoring previous dist backup:', buildErr.message);
          if (fs.existsSync(backupDir)) {
            if (fs.existsSync(DIST_DIR)) fs.rmSync(DIST_DIR, { recursive: true, force: true });
            fs.cpSync(backupDir, DIST_DIR, { recursive: true });
            fs.rmSync(backupDir, { recursive: true, force: true });
          }
        } finally {
          isRebuilding = false;
        }
      }
    } catch (err) {
      isRebuilding = false;
      console.error('[Auto-Rebuild] Unexpected error during check:', err.message);
    }
  }

  // Initial check on server start
  performAutoRebuild();

  // Check every 10 minutes (600,000 ms)
  const rebuildInterval = setInterval(performAutoRebuild, 10 * 60 * 1000);
  rebuildInterval.unref();
}

server.listen(PORT, () => {
  console.log(`\n🚀 Panda Express Coupons static server running at http://localhost:${PORT}/`);
  console.log(`   - Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`   - Static directory: ${DIST_DIR}`);
  if (process.env.AUTO_REBUILD === '1') {
    console.log(`   - Auto-rebuild: ENABLED (checks every 10m on month change)`);
  }
});

module.exports = server;

