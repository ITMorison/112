const fs = require('fs');
const np = JSON.parse(fs.readFileSync('src/new-products.json', 'utf-8'));
const items = np.filter(p => (p.category_raw || p.category || '').trim() === 'Однофазные');
console.log('=== Однофазные в new-products ===');
console.log('Count:', items.length);
items.slice(0, 5).forEach(p => {
  console.log('  ', (p.name || p.fullName).substring(0, 80), 'price:', p.price);
});

const upsSamples = np.filter(p => {
  const n = String(p.name || p.fullName || '').toLowerCase();
  const cat = String(p.category_raw || p.category || '').toLowerCase();
  return n.includes('ups') || n.includes('ибп') || cat.includes('ups') || cat.includes('ибп');
});
console.log('\n=== UPS-related products in new-products ===');
console.log('Count:', upsSamples.length);
upsSamples.slice(0, 10).forEach(p => {
  console.log('  ', p.category_raw || p.category, '|', (p.name || p.fullName).substring(0, 70), '| price:', p.price);
});
