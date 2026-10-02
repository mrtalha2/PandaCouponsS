const fs = require('fs');

let content = fs.readFileSync('server.js', 'utf8');

// 1. Add zlib and error handlers
if (!content.includes('const zlib = require(\'zlib\');')) {
  content = content.replace(
    "const bcrypt = require('bcryptjs');",
    "const bcrypt = require('bcryptjs');\nconst zlib = require('zlib');\n\nprocess.on('uncaughtException', err => {\n  console.error('Uncaught Exception:', err);\n});\nprocess.on('unhandledRejection', (reason, promise) => {\n  console.error('Unhandled Rejection at:', promise, 'reason:', reason);\n});"
  );
}

// 2. Add /healthz and try-catch
if (!content.includes('pathname === \'/healthz\'')) {
  content = content.replace(
    "const server = http.createServer(async (req, res) => {\n  const parsedUrl = url.parse(req.url, true);\n  const pathname = parsedUrl.pathname;",
    "const server = http.createServer(async (req, res) => {\n  try {\n  const parsedUrl = url.parse(req.url, true);\n  const pathname = parsedUrl.pathname;\n\n  if (pathname === '/healthz' && req.method === 'GET') {\n    res.writeHead(200, { 'Content-Type': 'text/plain' });\n    return res.end('200 ok');\n  }"
  );
}

// 3. Security headers
if (!content.includes('Cross-Origin-Opener-Policy')) {
  content = content.replace(
    "res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');",
    "res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');\n  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');\n  res.setHeader('Content-Security-Policy-Report-Only', \"default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://formspree.io\");\n\n  const proto = req.headers['x-forwarded-proto'] || (req.socket && req.socket.encrypted ? 'https' : 'http');\n  if (proto === 'https') {\n    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');\n  }"
  );
}

// 4. Static routing and path traversal
const staticMatch = content.match(/\/\/ ==========================================\n\s*\/\/ PUBLIC STATIC SITE SERVING\n\s*\/\/ ==========================================\n([\s\S]*?)\}\);\n\}\);/);

if (staticMatch) {
  const staticLogic = `// ==========================================
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
  if (decoded.includes('\\0')) {
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
      let pubDecoded = pathname.replace(/^\\/public\\//, '/');
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
    if (base.match(/\\.[0-9a-f]{8}\\.(css|js)$/)) {
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
  });`;

  const newStaticStr = staticLogic + `\n  } catch (err) {\n    console.error('Top-level request error:', err);\n    if (!res.headersSent) {\n      res.writeHead(500, { 'Content-Type': 'text/plain' });\n      res.end('500 Internal Server Error');\n    }\n  }\n});\n\nserver.requestTimeout = 30000;\nserver.headersTimeout = 31000;\nserver.keepAliveTimeout = 30000;\n\nprocess.on('SIGTERM', () => { console.log('SIGTERM'); server.close(() => process.exit(0)); });\nprocess.on('SIGINT', () => { console.log('SIGINT'); server.close(() => process.exit(0)); });\n`;

  content = content.replace(staticMatch[0], newStaticStr);
}

fs.writeFileSync('server.js', content, 'utf8');
console.log('server.js patched');
