import { PRODUCTS, CATEGORY_MAP } from './src/data.js';

// Find all products from DECT category
const dect = PRODUCTS.filter(function(p) { 
  return String(p.category_raw || '') === 'dect';
});

console.log('DECT products total:', dect.length);
console.log('dect in CATEGORY_MAP:', 'dect' in CATEGORY_MAP);
if ('dect' in CATEGORY_MAP) console.log('dect entry:', JSON.stringify(CATEGORY_MAP['dect']));

// Show unique subcategories
const subcats = {};
dect.forEach(function(p) { 
  subcats[p.subcategory || 'none'] = (subcats[p.subcategory || 'none'] || 0) + 1; 
});
console.log('\nSubcategory distribution:', JSON.stringify(subcats, null, 2));

// Show wireless products (зага)
const BT = 'besprovodnye-telefony';
console.log('\nProducts with besprovodnye-telefony subcategory ALL:');
const allBt = PRODUCTS.filter(function(p) { return p.subcategory === BT; });
console.log('All wireless count:', allBt.length);
allBt.forEach(function(p) { console.log(' ', p.code, '|', String(p.category_raw || '').slice(0, 35), '|', String(p.title || '').slice(0, 50)); });
