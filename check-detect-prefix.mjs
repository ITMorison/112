import p3 from './src/price3-products.json' with { type: "json" };

// Count "DECT-" products in DECT category
const D = 'Д' + String.fromCharCode(0x0415) + String.fromCharCode(0x041A) + String.fromCharCode(0x0422) + '-';
const dectWithPrefix = p3.filter(function(p) {
  if (String(p.category_raw || '') !== 'dect') return false;
  const n = String(p.name || '') + String(p.fullName || '');
  return new RegExp(D, 'i').test(n);
});
console.log('DECT- prefix count:', dectWithPrefix.length);

// Show samples of DECT- prefix products
console.log('DECT- prefix samples:');
dectWithPrefix.slice(0, 15).forEach(function(p) { console.log(p.code, '|', (p.name || p.fullName || '').slice(0, 60)); });