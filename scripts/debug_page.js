const http = require('http');

const postData = 'username=admin&password=PandaAdmin2026!';
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/admin/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
}, res => {
  const cookie = res.headers['set-cookie'][0].split(';')[0];
  http.get({
    hostname: 'localhost',
    port: 3000,
    path: '/admin/pages',
    headers: { 'Cookie': cookie }
  }, res2 => {
    let d = '';
    res2.on('data', c => d += c);
    res2.on('end', () => {
      console.log('STATUS:', res2.statusCode);
      console.log('HTML LENGTH:', d.length);
      const idx = d.indexOf('<main class="admin-content">');
      console.log('CONTENT SLICE:', idx);
      if (idx !== -1) {
        console.log(d.substring(idx, idx + 1000));
      } else {
        console.log('FULL HTML:\n', d.substring(0, 1000));
      }
    });
  });
});
req.write(postData);
req.end();
