const sanitizeHtml = require('sanitize-html');

const INLINE_SANITIZE_OPTIONS = {
  allowedTags: ['b', 'strong', 'i', 'em', 'a', 'br', 'span'],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'class'],
    span: ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto']
};

console.log('1. Relative internal link:');
console.log(sanitizeHtml('<a href="/panda-express-orange-chicken/">Orange Chicken</a>', INLINE_SANITIZE_OPTIONS));

console.log('2. External link with target/rel:');
console.log(sanitizeHtml('<a href="https://pandaexpress.com" target="_blank" rel="nofollow noopener noreferrer">Official Site</a>', INLINE_SANITIZE_OPTIONS));

console.log('3. Bad javascript link:');
console.log(sanitizeHtml('<a href="javascript:alert(1)">Click me</a>', INLINE_SANITIZE_OPTIONS));

console.log('4. Bad data link:');
console.log(sanitizeHtml('<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Click</a>', INLINE_SANITIZE_OPTIONS));

console.log('5. Disallowed tags (h1, table, script, img):');
console.log(sanitizeHtml('<h1>Title</h1><p><b>Bold</b> <i>Italic</i> <img src="x" onerror="alert(1)"><script>alert(2)</script></p>', INLINE_SANITIZE_OPTIONS));
