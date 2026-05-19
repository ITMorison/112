const fs = require('fs');
const p3 = JSON.parse(fs.readFileSync('src/price3-products.json', 'utf-8'));

// Check products in intercom-related raw categories
const intercomCats = ['е). Вызывные панели', 'д). Общественные телефоны с клавиатурой', 'з). Телефоны срочного вызова', 'Кнопки выхода и гибкие переходы', 'JR100 всепогодные телефоны', 'JR200 общепользовательские телефоны'];
intercomCats.forEach(cat => {
  const items = p3.filter(p => (p.category_raw || p.category || '').trim() === cat);
  console.log(`=== ${cat} === (${items.length} items)`);
  items.slice(0, 5).forEach(p => console.log('  ', (p.name || p.fullName).substring(0, 80)));
  console.log('');
});
