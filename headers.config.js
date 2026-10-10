/**
 * headers.config.js - Centralized Single Source of Truth for HTTP Security & Cache Headers
 */

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '0',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
};

const cacheHeaders = {
  immutableAssets: 'public, max-age=31536000, immutable',
  staticAssets: 'public, max-age=604800, stale-while-revalidate=86400',
  htmlPages: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800, must-revalidate',
  healthCheck: 'no-store, no-cache, must-revalidate, proxy-revalidate'
};

module.exports = {
  securityHeaders,
  cacheHeaders
};
