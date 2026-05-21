const fs = require('fs');
const files = [
  'src/data/poe-адаптеры.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/neupravlyaemye-soho-poe.js'
];
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('width="') || l.includes('height="') || l.includes('fill="')) {
      console.log(f, i + 1, l.substring(0, 150));
    }
  });
}
