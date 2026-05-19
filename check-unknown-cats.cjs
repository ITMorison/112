const fs = require('fs');
const p1 = JSON.parse(fs.readFileSync('src/price1-products.json', 'utf-8'));
const p2 = JSON.parse(fs.readFileSync('src/price2-products.json', 'utf-8'));
const p3 = JSON.parse(fs.readFileSync('src/price3-products.json', 'utf-8'));
const np = JSON.parse(fs.readFileSync('src/new-products.json', 'utf-8'));
const all = [...p1, ...p2, ...p3, ...np];

// Find products with 'category' field that don't match any HEADER_CATEGORIES category
const knownCategories = ['videonablyudenie','domofoniya','sistemy-kontrolya-dostupa','ip-telefony',
  'pozharnaya-signalizaciya','setevoe-oborudovanie','passivnoe-setevoe','istochniki-besperebojnogo-pitaniya',
  'servernye-shkafi','garnitura','wifi-oborudovanie','radiooborudovanie','optovolokonaya-produkciya'];

const hasCat = all.filter(p => p.category || p.subcategory);
const inKnown = hasCat.filter(p => knownCategories.includes(p.category));
const unknown = hasCat.filter(p => !knownCategories.includes(p.category));

console.log('Total with category:', hasCat.length);
console.log('In known categories:', inKnown.length);
console.log('Not in known categories:', unknown.length);

// Show categories for unknown
const unkCats = [...new Set(unknown.map(p => p.category))];
console.log('\nUnknown categories:');
unkCats.forEach(c => {
  const items = unknown.filter(p => p.category === c);
  console.log('  [' + items.length + '] ' + c);
  items.slice(0,3).forEach(p => console.log('    -', (p.name||p.fullName||'').substring(0,60)));
});

// Also show all categories assigned to these unknown products that should be mapped to existing categories
console.log('\n--- Products where subcategory name implies they should be somewhere ---');
unknown.filter(p => {
  const sc = (p.subcategory||'').toLowerCase();
  return ['videonablyudenie','domofoniya','skd','controll','turniket','shlagbaum',
    'ip-telefony','ip_phone','ip','voip','asterisk','minipbx','sip',
    'pozharna','signalizaciy','p_pozhar','detector','sensor',
    'router','kommutator','switch','sfp','poe','Media Conv',
    'network','cable','patch','rozetk','connector','module',
    'ups','batarey','power','shkaf',
    'mesh','wifi','access.point','ap',
    'radio','antenna','walkie','duplexer','repeater',
    'fiber','optic','opticheskie','adapt','roscet'].some(k => sc.includes(k) || (p.category||'').includes(k));
}).slice(0,20).forEach(p => {
  console.log('  cat:', p.category, '| sub:', p.subcategory, '| name:', (p.name||p.fullName||'').substring(0,60));
});
