/**
 * Admin Authentication & Security Module (Phase A)
 * Provides bcrypt verification, signed sessions with SESSION_SECRET, CSRF protection,
 * and strict IP rate limiting (5 failed attempts within 15 minutes = 5-minute lockout).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Load environment variables if .env exists
try {
  const envPath = path.join(__dirname, '../../.env');
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

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'panda-coupons-session-secret-key-32chars';
const SESSION_COOKIE_NAME = 'panda_admin_session';

// In-memory & file-backed active sessions: Map<sessionId, { username, csrfToken, createdAt, expiresAt }>
const sessions = new Map();
const SESSIONS_FILE = path.join(__dirname, '../../data/admin/.sessions.json');

function loadPersistedSessions() {
  try {
    const fs = require('fs');
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
      const now = Date.now();
      for (const [id, sess] of Object.entries(data)) {
        if (sess && sess.expiresAt > now) {
          sessions.set(id, sess);
        }
      }
    }
  } catch (e) {}
}

function persistSessions() {
  try {
    const fs = require('fs');
    const obj = {};
    const now = Date.now();
    for (const [id, sess] of sessions.entries()) {
      if (sess && sess.expiresAt > now) {
        obj[id] = sess;
      }
    }
    const dir = path.dirname(SESSIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (e) {}
}

// Initial load
loadPersistedSessions();

// Rate limiting: Map<ip, { failedAttempts: number[], lockedUntil: number | null }>
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 5 * 60 * 1000;         // 5 minutes

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.socket.remoteAddress ||
         '127.0.0.1';
}

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (!rc) return list;
  rc.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

// Sign and verify cookie with SESSION_SECRET
function signValue(val) {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(val).digest('hex');
  return `${val}.${hmac}`;
}

function unsignValue(signedVal) {
  if (!signedVal || typeof signedVal !== 'string') return null;
  const lastDot = signedVal.lastIndexOf('.');
  if (lastDot === -1) return null;

  const val = signedVal.substring(0, lastDot);
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(val).digest('hex');
  const actualSig = signedVal.substring(lastDot + 1);

  if (actualSig.length !== expectedSig.length) return null;
  try {
    const match = crypto.timingSafeEqual(Buffer.from(actualSig), Buffer.from(expectedSig));
    return match ? val : null;
  } catch (e) {
    return null;
  }
}

function checkRateLimit(ip) {
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    const minutesLeft = Math.ceil((record.lockedUntil - now) / 60000);
    return {
      allowed: false,
      message: `Too many failed login attempts. Locked out for ${minutesLeft} more minute(s).`
    };
  }

  if (record.lockedUntil && record.lockedUntil <= now) {
    record.lockedUntil = null;
    record.failedAttempts = [];
  }

  // Filter out attempts older than 15 minutes
  record.failedAttempts = (record.failedAttempts || []).filter(t => now - t < ATTEMPT_WINDOW_MS);
  if (record.failedAttempts.length >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    return {
      allowed: false,
      message: 'Too many failed login attempts. Locked out for 5 minutes.'
    };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { failedAttempts: [], lockedUntil: null };
  // Prune old attempts
  record.failedAttempts = (record.failedAttempts || []).filter(t => now - t < ATTEMPT_WINDOW_MS);
  record.failedAttempts.push(now);

  if (record.failedAttempts.length >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }
  loginAttempts.set(ip, record);
}

function clearRateLimit(ip) {
  loginAttempts.delete(ip);
}

function createSession(username) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const csrfToken = crypto.randomBytes(24).toString('hex');
  const session = {
    username,
    csrfToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  sessions.set(sessionId, session);
  persistSessions();
  return { sessionId, csrfToken };
}

function getSession(req) {
  const cookies = parseCookies(req);
  const rawCookie = cookies[SESSION_COOKIE_NAME];
  if (!rawCookie) return null;

  // Verify HMAC signature
  const sessionId = unsignValue(rawCookie);
  if (!sessionId) return null;

  let session = sessions.get(sessionId);
  if (!session) {
    loadPersistedSessions();
    session = sessions.get(sessionId);
  }
  if (!session) return null;

  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    persistSessions();
    return null;
  }

  return { sessionId, ...session };
}

function setSessionCookie(res, sessionId) {
  const isProd = process.env.NODE_ENV === 'production';
  const signed = signValue(sessionId);
  const cookieVal = `${SESSION_COOKIE_NAME}=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; ${isProd ? 'Secure;' : ''}`;
  res.setHeader('Set-Cookie', cookieVal);
}

function destroySession(req, res) {
  const cookies = parseCookies(req);
  const rawCookie = cookies[SESSION_COOKIE_NAME];
  if (rawCookie) {
    const sessionId = unsignValue(rawCookie) || rawCookie;
    sessions.delete(sessionId);
    persistSessions();
  }
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${isProd ? 'Secure;' : ''}`);
}

function verifyCredentials(username, password) {
  if (!username || !password) return false;
  if (username !== ADMIN_USER) return false;
  if (!ADMIN_PASSWORD_HASH) return false;
  try {
    return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
  } catch (e) {
    return false;
  }
}

function validateCsrf(req, session) {
  if (!session) return false;
  const headerToken = req.headers['x-csrf-token'];
  if (headerToken && headerToken === session.csrfToken) return true;
  return false;
}

module.exports = {
  getClientIp,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  verifyCredentials,
  createSession,
  getSession,
  destroySession,
  setSessionCookie,
  validateCsrf
};
