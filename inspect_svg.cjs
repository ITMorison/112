const fs = require('fs');
const files = [
  'src/data/poe-адаптеры.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/neupravlyaemye-soho-poe.js'
];
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const idx = c.indexOf('data:image/svg+xml,');
  const snippet = c.substring(idx, idx + 280);
  console.log(`\n=== ${f} ===`);
  // Show char codes for the SVG portion
  for (let i = 0; i < snippet.length; i++) {
    const ch = snippet[i];
    const code = ch.charCodeAt(0);
    if (ch === '\\' || ch === '"' || ch === '\'') {
      console.log(`  pos ${i}: char='${ch}' code=${code}`);
    }
  }
  console.log('Raw string:', snippet.substring(0, 120));
}
