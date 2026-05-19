const fs = require('fs');
const searchFile = (f, cat) => {
  const d = JSON.parse(fs.readFileSync(f, 'utf-8'));
  const items = d.filter(p => (p.category_raw || p.category || '').trim() === cat);
  console.log(f + ' / ' + cat + ' -> ' + items.length + ' items');
};
[
  { f: 'src/price3-products.json', cat: 'Mesh системы' },
  { f: 'src/price3-products.json', cat: 'Кнопки выхода и гибкие переходы' },
  { f: 'src/price3-products.json', cat: 'Шкафы климатические' },
  { f: 'src/price3-products.json', cat: 'Оборудование для видеоконференций' },
  { f: 'src/price3-products.json', cat: 'Кросс оптический 19\' FDF укомплектованный' },
  { f: 'src/price3-products.json', cat: 'Оптоволоконные патч корды 2.0 Duplex Одномод' },
].forEach(q => searchFile(q.f, q.cat));

// Also check all files
['src/price1-products.json', 'src/price2-products.json', 'src/price3-products.json'].forEach(f => {
  const d = JSON.parse(fs.readFileSync(f, 'utf-8'));
  const cats = [...new Set(d.map(p => (p.category_raw || p.category || '').trim()).filter(Boolean))];
  if (f === 'src/price1-products.json') {
    console.log('\n=== price1 raw categories ===');
    cats.sort().forEach(c => console.log(' ' + c));
  }
});
