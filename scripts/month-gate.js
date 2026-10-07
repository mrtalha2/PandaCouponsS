#!/usr/bin/env node
/**
 * scripts/month-gate.js
 * Decides whether the deployed static site is stale on the 1st of the month.
 * 
 * Exit codes:
 *   0  - DEPLOY (stale or live fetch failed - fail open)
 *  10  - SKIP (not the 1st in site timezone, or live site already has current month/year)
 * 
 * CLI Options:
 *   --now <ISO_DATE>        Override current timestamp
 *   --zone <TIMEZONE>       Override site timezone (default: SITE_TIMEZONE from site.config.js)
 *   --site-url <URL>        Override live site URL (default: env.SITE_URL or https://pandaxpresscoupon.com/)
 *   --live-title "<TITLE>"  Mock live page <title> (bypasses network fetch)
 *   --mock-fetch-fail       Simulate network error when fetching live site
 */

const https = require('https');
const http = require('http');
const { getSiteDateParts, SITE_TIMEZONE } = require('../src/utils/date');

function parseArgs(args) {
  const options = {
    now: new Date(),
    zone: SITE_TIMEZONE,
    siteUrl: process.env.SITE_URL || 'https://pandaxpresscoupon.com/',
    liveTitle: null,
    mockFetchFail: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--now' && args[i + 1]) {
      options.now = new Date(args[++i]);
    } else if (arg === '--zone' && args[i + 1]) {
      options.zone = args[++i];
    } else if (arg === '--site-url' && args[i + 1]) {
      options.siteUrl = args[++i];
    } else if (arg === '--live-title' && args[i + 1] !== undefined) {
      options.liveTitle = args[++i];
    } else if (arg === '--mock-fetch-fail') {
      options.mockFetchFail = true;
    }
  }

  return options;
}

function fetchLiveTitle(targetUrl, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(targetUrl);
      const client = urlObj.protocol === 'http:' ? http : https;
      const req = client.get(urlObj, {
        headers: {
          'Cache-Control': 'no-cache',
          'User-Agent': 'PandaCoupons-MonthGate/1.0'
        },
        timeout: timeoutMs
      }, (res) => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          res.resume();
          return reject(new Error(`HTTP status ${res.statusCode}`));
        }

        let body = '';
        res.setEncoding('utf8');
        res.on('data', chunk => {
          body += chunk;
          if (body.length > 65536) {
            // Title is always near top of HTML; avoid reading massive payload
            req.destroy();
            resolve(extractTitle(body));
          }
        });
        res.on('end', () => {
          resolve(extractTitle(body));
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timed out after ${timeoutMs}ms`));
      });

      req.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : '';
}

async function run() {
  try {
    const opts = parseArgs(process.argv.slice(2));
    const parts = getSiteDateParts(opts.now, opts.zone);

    // 1. Check if it's the 1st of the month in the site timezone
    if (parts.day !== '01') {
      console.log(`SKIP: not the 1st in ${opts.zone} (day is ${parts.day}, local hour is ${parts.hour})`);
      process.exit(10);
      return;
    }

    // 2. Determine live title
    let liveTitle = '';
    if (opts.liveTitle !== null) {
      liveTitle = opts.liveTitle;
    } else if (opts.mockFetchFail) {
      console.warn('WARNING: Simulated fetch failure (--mock-fetch-fail)');
      console.log(`DEPLOY: live site fetch failed, needs ${parts.monthYearLabel}`);
      process.exit(0);
      return;
    } else {
      try {
        liveTitle = await fetchLiveTitle(opts.siteUrl, 15000);
      } catch (err) {
        console.warn(`WARNING: Unable to fetch live site at ${opts.siteUrl} (${err.message}) - failing open to deploy`);
        console.log(`DEPLOY: live site fetch failed, needs ${parts.monthYearLabel}`);
        process.exit(0);
        return;
      }
    }

    // 3. Compare title with expected monthYearLabel
    if (liveTitle && liveTitle.includes(parts.monthYearLabel)) {
      console.log(`SKIP: live site already shows ${parts.monthYearLabel}`);
      process.exit(10);
      return;
    }

    console.log(`DEPLOY: live site shows "${liveTitle}", needs ${parts.monthYearLabel}`);
    process.exit(0);
  } catch (err) {
    // Fail open on any unexpected top-level error
    console.warn(`WARNING: Unexpected error in month-gate (${err.message}) - failing open to deploy`);
    process.exit(0);
  }
}

if (require.main === module) {
  run();
}

module.exports = {
  parseArgs,
  fetchLiveTitle,
  extractTitle,
  run
};
