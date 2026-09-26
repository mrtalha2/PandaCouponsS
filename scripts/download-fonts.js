const fs = require('fs');
const path = require('path');
const https = require('https');

const fontsDir = path.join(__dirname, '..', 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fontUrl = 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff2';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded ${path.basename(dest)} (${fs.statSync(dest).size} bytes)`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  const file400 = path.join(fontsDir, 'plus-jakarta-sans-400.woff2');
  const file700 = path.join(fontsDir, 'plus-jakarta-sans-700.woff2');
  const file900 = path.join(fontsDir, 'plus-jakarta-sans-900.woff2');

  await downloadFile(fontUrl, file400);
  fs.copyFileSync(file400, file700);
  fs.copyFileSync(file400, file900);

  console.log(`✓ All 3 self-hosted font files ready in ${fontsDir}`);
}

main().catch(err => {
  console.error('Error downloading fonts:', err);
  process.exit(1);
});
