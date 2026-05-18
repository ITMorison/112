const fs = require('fs');

const dataJs = fs.readFileSync('src/data.js','utf8');
const cmJson = JSON.parse(fs.readFileSync('src/category-mapping-suggestions.json','utf8'));
const price3 = JSON.parse(fs.readFileSync('src/price3-products.json','utf8'));

// Check what's in data.js for kommercheskaya and ofisnoe categories
const mdcKeys = Object.keys(cmJson);
const komVizuKeys = mdcKeys.filter(k => /сумка|чехол|бумаг|фото|аксессуар/i.test(k) || (cmJson[k] && cmJson[k].category === 'kommercheskaya-vizualizaciya'));

console.log('komVizu/accessory entries in category-mapping-suggestions:');
komVizuKeys.forEach(k => {
  const v = cmJson[k];
  console.log(`  "${k}" -> ${v.category}/${v.subcategory}`);
});

// Check actual ofisnoe-oborudovanie entries
const officeKeys = mdcKeys.filter(k => cmJson[k] && cmJson[k].category === 'ofisnoe-oborudovanie');
console.log('\nofisnoe-oborudovanie entries in suggestions:', officeKeys.length);
officeKeys.forEach(k => console.log(`  "${k}"`));

// Check what bags items have cat_raw= "Сумки и чехлы" map to
const bagMap = cmJson["Сумки и чехлы"];
console.log('\n"Сумки и чехлы" mapping:', bagMap);

// What about bags specifically in new-products - what subcats do they get
const nameProd = JSON.parse(fs.readFileSync('src/new-products.json','utf8'));
const bags = nameProd.filter(p => /сумка|чемодан|рюкзак|портфель/i.test(p.name || ''));
console.log('\nBags in new-products.json:');
const bagCats = [...new Set(bags.map(p => `${p.category}/${p.subcategory}`))];
bagCats.forEach(c => console.log(`  ${c}`));
