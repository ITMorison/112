const fs = require('fs');
const p = 'src/data/mesh-системы.js';
const c = fs.readFileSync(p, 'utf8');

const idx = c.indexOf("data:image/svg+xml,");
const snippet = c.substring(idx, idx + 280);
console.log('SVG blob 140 chars:', JSON.stringify(snippet.substring(0,140)));

// Count chars char-by-char
const result = [];
for (let i = 0; i < 140 && i < snippet.length; i++) {
  const code = snippet.charCodeAt(i);
  if (code === 34 || code === 39) {
    result.push({ pos: i, char: snippet[i], code });
  }
}
console.log('\n" and \' positions (code 34 or 39) up to char 140:');
console.table(result.slice(0, 30));
