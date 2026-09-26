const fs = require('fs');
const code = fs.readFileSync('src/pages/home.js', 'utf8');
const styles = code.match(/style="([^"]+)"/g) || [];
console.log('Total style attributes:', styles.length);

const freq = {};
styles.forEach(s => {
  freq[s] = (freq[s] || 0) + 1;
});

const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
sorted.forEach(([st, count]) => {
  console.log(`${count}x: ${st}`);
});
