const http = require('http');
const fs = require('fs');

async function check() {
  const loginReq = http.request({
    hostname: 'localhost', port: 3000, path: '/admin/login', method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }, res => {
    const cookie = res.headers['set-cookie'][0].split(';')[0];
    http.get({
      hostname: 'localhost', port: 3000, path: '/admin/pages',
      headers: { 'Cookie': cookie }
    }, pageRes => {
      let html = '';
      pageRes.on('data', chunk => html += chunk);
      pageRes.on('end', () => {
        fs.writeFileSync('temp_pages.html', html, 'utf8');
        console.log('Saved temp_pages.html, length:', html.length);
        const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
        console.log('Found scripts count:', scripts ? scripts.length : 0);
        if (scripts) {
          scripts.forEach((s, i) => {
            console.log('\n================ SCRIPT ' + i + ' ================');
            console.log(s);
          });
        }
      });
    });
  });
  loginReq.write('username=admin&password=PandaAdmin2026%21');
  loginReq.end();
}
check();
