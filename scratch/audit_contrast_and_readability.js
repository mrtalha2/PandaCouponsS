const fs = require('fs');
const path = require('path');

// List of all HTML files in dist/
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

const htmlFiles = getHtmlFiles('dist');
console.log(`Found ${htmlFiles.length} HTML files in dist:`);
htmlFiles.forEach(f => console.log(' - ' + f));

// Search for potential low contrast color values across files:
// Common faint colors that hurt readability: #94A3B8, #A0AEC0, #CBD5E1, #9CA3AF, #D1D5DB, #E2E8F0, #6B7280 (on dark), #475569 (on dark), rgba(255,255,255,0.5), rgba(0,0,0,0.3), etc.
console.log('\n--- SCANNING ALL PAGES FOR INLINE STYLES AND MUTED COLORS ---');

const lowContrastPatterns = [
  /color\s*:\s*#(?:cbd5e1|94a3b8|e2e8f0|d1d5db|a0aec0|9ca3af|64748b|999|aaa|bbb|ccc)/gi,
  /color\s*:\s*rgba\(\s*(?:0\s*,\s*0\s*,\s*0|255\s*,\s*255\s*,\s*255)\s*,\s*0\.[1-4]\d*\s*\)/gi,
  /checklist/gi,
  /table/gi
];

htmlFiles.forEach(filePath => {
  const html = fs.readFileSync(filePath, 'utf8');
  console.log(`\nAnalyzing ${path.relative('dist', filePath)}:`);
  
  // Check inline styles
  const inlineStyles = html.match(/style="[^"]*"/gi) || [];
  let inlineIssues = 0;
  inlineStyles.forEach(st => {
    if (/color\s*:\s*#(?:cbd5e1|94a3b8|e2e8f0|d1d5db|a0aec0|9ca3af|999|aaa|bbb|ccc)/i.test(st)) {
      console.log(`  [POTENTIAL FAINT TEXT]: ${st}`);
      inlineIssues++;
    }
  });
  if (inlineIssues === 0) {
    console.log('  No problematic faint inline colors found.');
  }
});
