// verifier.cjs - identify which files still have broken syntax
const fs = require('fs');
const dir = 'src/data/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

let broken = [], ok = [];

for (const f of files) {
  const content = fs.readFileSync(dir + f, 'utf8');
  if (!content.includes('"image"') || !content.includes('svg+xml,')) { ok.push(f); continue; }
  try { new Function(content); ok.push(f); } catch(e) { broken.push(f + ': ' + e.message.substring(0, 80)); }
}

console.log(`Total data files with image/svgs:`, broken.length + ok.length);
console.log(`BROKEN (${broken.length}):`);
broken.forEach(b => console.log(' ', b));
console.log(`\nOK (${ok.length})`);
