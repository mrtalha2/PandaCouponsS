const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const card = html.split('<article class="ticket-card"')[1]?.split('</article>')[0] || '';
console.log('Card length:', card.length);
console.log('Card content:\n', card);
