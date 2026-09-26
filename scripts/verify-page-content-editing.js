/**
 * Automated Verification Script: Page Content Editor End-to-End
 */

const http = require('http');

function makeRequest({ method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        ...headers
      }
    };

    if (body) {
      if (typeof body === 'object') {
        body = JSON.stringify(body);
        options.headers['Content-Type'] = 'application/json';
      }
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Page Content Editing End-to-End Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  try {
    // 1. Log in to get session cookie & CSRF token
    console.log('1. Authenticating as admin...');
    const loginRes = await makeRequest({
      method: 'POST',
      path: '/admin/login',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'username=admin&password=PandaAdmin2026!'
    });

    const cookieHeader = loginRes.headers['set-cookie'];
    const sessionCookie = (cookieHeader || []).map(c => c.split(';')[0]).join('; ');

    const pagesGetRes = await makeRequest({
      method: 'GET',
      path: '/admin/pages',
      headers: { 'Cookie': sessionCookie }
    });

    const csrfMatch = pagesGetRes.body.match(/name="csrf-token" content="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';
    assert(csrfToken.length > 0, 'Extracted CSRF token successfully');

    const authHeaders = {
      'Cookie': sessionCookie,
      'X-CSRF-Token': csrfToken
    };

    // 2. Test Home Page Editing
    console.log('\n2. Testing Homepage Heading and Text Updates...');
    const homeUpdate = {
      page: 'home',
      updates: {
        home: {
          kicker: 'TEST SAVINGS BADGE 2026',
          heroHeading: 'Tested Panda Express Deals &amp; Discounts',
          heroSubtext: 'Custom hero subtext updated via admin panel.',
          btnCodesText: '⚡ Claim Tested Codes',
          btnFamilyText: '🍲 Group Banquet Bundles',
          couponHeading: 'Exclusive Verified Vouchers &amp; Codes',
          couponSubtext: 'Custom coupon subtext entered in admin editor.',
          deliveryNotice: 'Custom delivery alert box text here.',
          rewardsHeading: 'Updated Rewards Loyalty Heading',
          rewardsSubtext: 'Updated rewards subtext line.',
          familyHeading: 'Updated Family Feast Savings',
          familySubtext: 'Updated family feast subtext line.'
        }
      }
    };

    const saveHomeRes = await makeRequest({
      method: 'POST',
      path: '/admin/api/pages',
      headers: authHeaders,
      body: homeUpdate
    });
    const saveHomeJson = JSON.parse(saveHomeRes.body);
    assert(saveHomeJson.success === true && saveHomeJson.published === true, 'Saved Home content via API and published');

    // Wait a brief moment for build to complete
    await new Promise(r => setTimeout(r, 1200));

    // Verify on live Home Page
    const liveHome = await makeRequest({ method: 'GET', path: '/' });
    assert(liveHome.body.includes('TEST SAVINGS BADGE 2026'), 'Live Homepage reflects custom kicker');
    assert(liveHome.body.includes('Tested Panda Express Deals &amp; Discounts'), 'Live Homepage reflects custom hero heading');
    assert(liveHome.body.includes('Custom hero subtext updated via admin panel.'), 'Live Homepage reflects custom hero subtext');
    assert(liveHome.body.includes('Claim Tested Codes'), 'Live Homepage reflects custom primary button label');
    assert(liveHome.body.includes('Group Banquet Bundles'), 'Live Homepage reflects custom secondary button label');
    assert(liveHome.body.includes('Exclusive Verified Vouchers &amp; Codes'), 'Live Homepage reflects custom coupon heading');
    assert(liveHome.body.includes('Custom coupon subtext entered in admin editor.'), 'Live Homepage reflects custom coupon subtext');
    assert(liveHome.body.includes('Custom delivery alert box text here.'), 'Live Homepage reflects custom delivery notice');
    assert(liveHome.body.includes('Updated Rewards Loyalty Heading'), 'Live Homepage reflects custom rewards heading');
    assert(liveHome.body.includes('Updated Family Feast Savings'), 'Live Homepage reflects custom family heading');

    // 3. Test Menu Page Editing
    console.log('\n3. Testing Menu Page Heading and Text Updates...');
    const menuUpdate = {
      page: 'menu',
      updates: {
        menu: {
          badgeText: '🔥 OFFICIAL 2026 CHEF SELECTION',
          heroTitle: 'Complete Panda Express Menu Pricing Guide',
          heroSubtitle: 'Updated menu hero subtitle description here.',
          stat1Label: 'Authentic Wok Entrees',
          stat2Label: 'Single Takeout Boxes',
          stat3Label: 'Trans Fat Free Quality'
        }
      }
    };

    const saveMenuRes = await makeRequest({
      method: 'POST',
      path: '/admin/api/pages',
      headers: authHeaders,
      body: menuUpdate
    });
    const saveMenuJson = JSON.parse(saveMenuRes.body);
    assert(saveMenuJson.success === true, 'Saved Menu content via API');

    await new Promise(r => setTimeout(r, 1200));
    const liveMenu = await makeRequest({ method: 'GET', path: '/panda-express-menu/' });
    assert(liveMenu.body.includes('OFFICIAL 2026 CHEF SELECTION'), 'Live Menu reflects custom badge');
    assert(liveMenu.body.includes('Complete Panda Express Menu Pricing Guide'), 'Live Menu reflects custom H1');
    assert(liveMenu.body.includes('Updated menu hero subtitle description here.'), 'Live Menu reflects custom subtitle');
    assert(liveMenu.body.includes('Authentic Wok Entrees'), 'Live Menu reflects custom Stat 1 label');

    // 4. Test Nutrition Page Editing
    console.log('\n4. Testing Nutrition Calculator Updates...');
    const nutrUpdate = {
      page: 'nutrition',
      updates: {
        nutrition: {
          badgeText: '⚡ Real-Time Calorie Engine',
          heroTitle: 'Official Panda Express Nutrition &amp; Macro Calculator',
          heroSubtitle: 'Custom nutrition subtitle text.',
          sourceDisclosure: 'Custom laboratory source disclosure note.',
          tab1Label: '🍲 Custom Plate Builder',
          tab2Label: '📋 Complete Item Matrix'
        }
      }
    };

    const saveNutrRes = await makeRequest({
      method: 'POST',
      path: '/admin/api/pages',
      headers: authHeaders,
      body: nutrUpdate
    });
    assert(JSON.parse(saveNutrRes.body).success === true, 'Saved Nutrition content via API');

    await new Promise(r => setTimeout(r, 1200));
    const liveNutr = await makeRequest({ method: 'GET', path: '/panda-express-nutrition/' });
    assert(liveNutr.body.includes('Real-Time Calorie Engine'), 'Live Nutrition reflects custom badge');
    assert(liveNutr.body.includes('Official Panda Express Nutrition &amp; Macro Calculator'), 'Live Nutrition reflects custom H1');
    assert(liveNutr.body.includes('Custom laboratory source disclosure note.'), 'Live Nutrition reflects custom source disclosure');
    assert(liveNutr.body.includes('Custom Plate Builder'), 'Live Nutrition reflects custom tab 1 label');

    // 5. Test Dish Page Editing
    console.log('\n5. Testing Dish Pages (Orange Chicken & Beijing Beef) Updates...');
    const dishUpdate = {
      page: 'orange-chicken',
      updates: {
        'orange-chicken': {
          title: 'Signature Original Orange Chicken',
          subtitle: 'The award-winning crispy entree that defined American Chinese dining.',
          intro: 'Chef Andy Kao created this masterpiece in 1987 in Hawaii using sweet chili orange glaze.'
        }
      }
    };

    const saveDishRes = await makeRequest({
      method: 'POST',
      path: '/admin/api/pages',
      headers: authHeaders,
      body: dishUpdate
    });
    assert(JSON.parse(saveDishRes.body).success === true, 'Saved Orange Chicken content via API');

    await new Promise(r => setTimeout(r, 1200));
    const liveDish = await makeRequest({ method: 'GET', path: '/panda-express-orange-chicken/' });
    assert(liveDish.body.includes('Signature Original Orange Chicken'), 'Live Dish reflects custom H1');
    assert(liveDish.body.includes('The award-winning crispy entree that defined American Chinese dining.'), 'Live Dish reflects custom subtitle');
    assert(liveDish.body.includes('Chef Andy Kao created this masterpiece in 1987 in Hawaii'), 'Live Dish reflects custom intro text');

    // 6. Test Policy & Rich Text Pages
    console.log('\n6. Testing About Us Rich-Text Updates...');
    const aboutUpdate = {
      page: 'about',
      updates: {
        about: {
          heading: 'About Our Independent Dining Mission',
          bodyHtml: '<h2>Who We Are</h2><p>We are independent researchers testing Panda Express discount vouchers daily with <strong>zero spam</strong> and <em>transparent methodology</em>.</p>'
        }
      }
    };

    const saveAboutRes = await makeRequest({
      method: 'POST',
      path: '/admin/api/pages',
      headers: authHeaders,
      body: aboutUpdate
    });
    assert(JSON.parse(saveAboutRes.body).success === true, 'Saved About Us content via API');

    await new Promise(r => setTimeout(r, 1200));
    const liveAbout = await makeRequest({ method: 'GET', path: '/about-us/' });
    assert(liveAbout.body.includes('About Our Independent Dining Mission'), 'Live About Us reflects custom H1');
    assert(liveAbout.body.includes('We are independent researchers testing Panda Express discount vouchers daily'), 'Live About Us reflects custom rich text body');

    console.log(`\n======================================================`);
    console.log(`🏁 Test Summary: ${passed} passed, ${failed} failed`);
    console.log(`======================================================\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal error during test run:', err);
    process.exit(1);
  }
}

runTests();
