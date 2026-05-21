const fs = require('fs');
const p = 'src/data/ip-ats-i-shlyuzy.js';
const c = fs.readFileSync(p, 'utf8');
const idx = c.indexOf('data:image/svg+xml,');
const s = c.substring(idx, idx + 400);
console.log('JSON:', JSON.stringify(s.substring(0, 200)));

// Show char codes for positions 62-95 (where width height attrs live)
for (let i = 62; i < 100; i++) {
  const ch = s[i];
  if (ch.charCodeAt(0) === 92 || ch.charCodeAt(0) === 34 || ch.charCodeAt(0) === 39) {
    console.log(`pos ${i}: '${ch}' code=${ch.charCodeAt(0)}`);
  }
}
