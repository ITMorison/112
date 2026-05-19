const fs = require('fs');
const np = JSON.parse(fs.readFileSync('src/new-products.json', 'utf-8'));
const items = np.filter(p => (p.category_raw || p.category || '').trim() === 'Напольные');
console.log('Напольные count:', items.length);
items.slice(0,5).forEach(p => {
  console.log(' ', (p.name || p.fullName).substring(0, 70), '|', p.category_raw, '|', p.category, '|', p.subcategory);
});
const uniqSubs = [...new Set(items.map(p => p.subcategory))];
console.log('Unique subcategories:', uniqSubs);
