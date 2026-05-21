const fs = require('fs');
const files = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

for (const p of files) {
  const c = fs.readFileSync(p, 'utf8');
  const lines = c.split('\n');
  // Show line 13 (1-indexed = index 12) and surrounding
  for (let i = 10; i <= 16; i++) {
    const line = lines[i];
    if (!line) continue;
    // Show with isImage flag if it contains the SVG
    const isImg = line.indexOf('data:image/svg+xml,') !== -1;
    console.log(`${p.substr(13)}:${i+1} ${isImg?'>>>':'   '} ${JSON.stringify(line.substring(0,150))}`);
  }
  console.log('');
}
