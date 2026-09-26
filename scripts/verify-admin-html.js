const http = require('http');

function request(opts, body) {
  return new Promise((res, rej) => {
    const req = http.request(opts, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res({ s: r.statusCode, h: r.headers, b: d }));
    });
    req.on('error', rej);
    if (body) req.write(body);
    req.end();
  });
}

async function verifyAll() {
  console.log('🔍 Comprehensive Admin HTML & Structure Verification...\n');

  // 1. Authenticate
  const loginRes = await request({
    hostname: 'localhost', port: 3000, path: '/admin/login', method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }, 'username=admin&password=PandaAdmin2026!');

  const setCookie = loginRes.h['set-cookie'] ? loginRes.h['set-cookie'][0] : '';
  const cookie = setCookie.split(';')[0];
  console.log('✓ Authenticated, cookie acquired:', cookie.substring(0, 30) + '...\n');

  const checks = [
    {
      path: '/admin', name: 'Dashboard',
      needles: ['Admin Dashboard', 'admin-body', 'class="admin-main"', 'admin-sidebar']
    },
    {
      path: '/admin/coupons', name: 'Coupons Manager',
      needles: ['Coupons Manager', 'formBestFor', 'formMinOrder', 'formNotes', 'btnNewCoupon', 'formCode', 'formDiscount']
    },
    {
      path: '/admin/pages?page=home', name: 'Pages (Home)',
      needles: ['homeKicker', 'homeHeroSubtext', 'homeCouponHeading', 'homeRewardsHeading', 'admin-body', 'class="admin-main"']
    },
    {
      path: '/admin/pages?page=menu', name: 'Pages (Menu)',
      needles: ['admin-body', 'class="admin-main"', 'Page Content']
    },
    {
      path: '/admin/pages?page=about', name: 'Pages (About Rich Text)',
      needles: ['admin-body', 'class="admin-main"', 'Page Content']
    },
    {
      path: '/admin/meta', name: 'SEO Meta Editor',
      needles: ['metaTitleCount', 'metaDescCount', 'metaOgImage', 'admin-body', 'class="admin-main"']
    },
    {
      path: '/admin/code', name: 'Code Injections',
      needles: ['Custom Code Injection', 'codemirror.min.css', 'Warning', 'admin-body', 'class="admin-main"']
    },
    {
      path: '/admin/redirects', name: '301 Redirects',
      needles: ['Redirects', 'admin-body', 'class="admin-main"']
    },
    {
      path: '/admin/media', name: 'Media Library',
      needles: ['Media Library', 'admin-body', 'class="admin-main"']
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    const res = await request({
      hostname: 'localhost', port: 3000, path: check.path, method: 'GET',
      headers: { Cookie: cookie }
    });

    if (res.s !== 200) {
      console.error('  ❌ ' + check.name + ' returned HTTP ' + res.s);
      failed++;
      continue;
    }

    let ok = true;
    for (const needle of check.needles) {
      if (!res.b.includes(needle)) {
        console.error('  ❌ ' + check.name + ': missing "' + needle + '"');
        ok = false;
      }
    }

    // Check that admin-main div has meaningful content (>500 chars between the tag and admin-sidebar-footer)
    const mainIdx = res.b.indexOf('class="admin-main"');
    const contentAfterMain = mainIdx >= 0 ? res.b.substring(mainIdx).length : 0;
    if (contentAfterMain < 1000) {
      console.error('  ❌ ' + check.name + ': admin-main content appears thin (' + contentAfterMain + ' chars after)');
      ok = false;
    }

    if (ok) {
      console.log('  ✓ ' + check.name + ' (' + (res.b.length / 1024).toFixed(1) + ' KB) — all checks passed');
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n======================================================');
  console.log('RESULT: ' + passed + '/' + (passed + failed) + ' pages verified successfully.');
  console.log('======================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

verifyAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
