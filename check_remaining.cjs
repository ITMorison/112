const fs = require('fs');
const files = [
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/neupravlyaemye-soho-poe.js'
];
for (const p of files) {
  const c = fs.readFileSync(p, 'utf8');
  const idx = c.indexOf('data:image/svg+xml,');
  const snippet = c.substring(idx, idx + 300);
  console.log(`\n=== ${p} ===`);
  console.log('Has \\":', (snippet.match(/\\"/g) || []).length);
  console.log('Has plain ":', (snippet.match(/([^\\])"/g) || []).length);
  console.log(JSON.stringify(snippet.substring(0, 180)));
}
