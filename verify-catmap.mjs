import p3 from './src/price3-products.json' with { type: "json" };

// Check the exact category_raw values
const cats = new Set();
for (const p of p3) {
  const cat = String(p.category_raw || '');
  if (/^1\./.test(cat)) {
    cats.add(cat);
  }
}

console.log('Categories starting with "1.":');
for (const c of cats) {
  const count = p3.filter(function(p) { return String(p.category_raw || '') === c; }).length;
  console.log('  `' + c + '`: ' + count + ' products');
}

// Now check categoryMap key lookup directly
const { categoryMap } = await import('./src/data.js', { with: { type: 'json' } });
console.log('\nChecking categoryMap key "d\\. SIP-\u0442\u0435\u043b\u0435\u0444\u043e\u043d\u044b":');
const key = 'd' + String.fromCharCode(0x0435) + String.fromCharCode(0x043A) + String.fromCharCode(0x0442) + '. SIP-';
const keys = Object.keys(categoryMap);
console.log('Keys containing "1.":', keys.filter(function(k) { return /^1\s*\./.test(k); }));
const sipKeys = keys.filter(function(k) { return k.startsWith('1.'); });
console.log('Keys starting with "1.":', sipKeys.join(', '));
