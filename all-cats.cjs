const fs = require('fs');
const p1 = JSON.parse(fs.readFileSync('src/price1-products.json', 'utf-8'));
const p2 = JSON.parse(fs.readFileSync('src/price2-products.json', 'utf-8'));
const p3 = JSON.parse(fs.readFileSync('src/price3-products.json', 'utf-8'));
const np = JSON.parse(fs.readFileSync('src/new-products.json', 'utf-8'));
const all = [...p1, ...p2, ...p3, ...np];

const rawCat = p => String(p.category_raw || p.category || '').trim();

// Show all unique `category_raw` across ALL price files
const allCats = [...new Set(all.map(p => rawCat(p)).filter(Boolean))];
allCats.forEach(c => {
  const items = all.filter(p => rawCat(p) === c);
  console.log(c + ' | total=' + items.length + ' | p1: ' + p1.filter(p => rawCat(p) === c).length + 
    ' p2: ' + p2.filter(p => rawCat(p) === c).length + 
    ' p3: ' + p3.filter(p => rawCat(p) === c).length + 
    ' np: ' + np.filter(p => rawCat(p) === c).length);
});
