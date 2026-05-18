const fs = require('fs');
const path = require('path');

const files = [
  'src/new-products.json',
  'src/price1-products.json',
  'src/price2-products.json',
  'src/price3-products.json'
].map((p) => path.join(__dirname, '..', p));

const needle = /аналог|видеок/i;

const counts = new Map();

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const item of data) {
      const raw = String(item.category_raw || '').trim();
      if (!raw) continue;
      if (needle.test(raw) || needle.test(item.name || '') || needle.test(item.fullName || '')) {
        counts.set(raw, (counts.get(raw) || 0) + 1);
      }
    }
  } catch (err) {
    console.error('Failed to read', file, err.message);
  }
}

const sorted = Array.from(counts.entries()).sort((a,b) => b[1]-a[1]);
console.log('Found', sorted.length, 'unique category_raw values matching /аналог|видеок/i');
for (const [k,v] of sorted) {
  console.log(v.toString().padStart(6), ' — ', k);
}

if (sorted.length === 0) {
  console.log('\nNo matching category_raw found. Searching names/fullName for keywords...');
  const names = new Map();
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      for (const item of data) {
        const txt = (item.name || '') + ' ' + (item.fullName || '');
        if (needle.test(txt)) {
          const raw = String(item.category_raw || '').trim() || '<EMPTY>';
          names.set(raw, (names.get(raw) || 0) + 1);
        }
      }
    } catch (err) {}
  }
  const s2 = Array.from(names.entries()).sort((a,b)=>b[1]-a[1]);
  for (const [k,v] of s2) console.log(v.toString().padStart(6), ' — ', k);
}

process.exit(0);
