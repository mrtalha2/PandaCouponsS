const fs = require('fs');
const html = fs.readFileSync('temp_pages.html', 'utf8');

console.log('Has <form id="pageContentForm">:', html.includes('<form id="pageContentForm">'));
console.log('Has </form>:', html.includes('</form>'));

const formIndex = html.indexOf('<form id="pageContentForm">');
const formCloseIndex = html.indexOf('</form>');
console.log('Form tag start:', formIndex, 'Close:', formCloseIndex);

const names = html.match(/name="[^"]+"/g);
console.log('All input names in form:', names);
