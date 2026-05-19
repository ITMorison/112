import { PRODUCTS, CATEGORY_MAP } from './src/data.js';

// Find all products with subcategory starting with latin 'b'
const bProducts = PRODUCTS.filter(function(p) { 
  const s = p.subcategory || '';
  return 'b' === s.charCodeAt(0) && s.length > 0;
});

const subcats = {};
bProducts.forEach(function(p) { 
  const s = p.subcategory || '';
  subcats[s] = (subcats[s] || 0) + 1; 
});
console.log('b-starting subcategory counts:', JSON.stringify(subcats, null, 2));

// Check the besprovodnye-telefony entry
console.log('\nLooking for "besprovodny" type keys:');
Object.keys(CATEGORY_MAP).filter(function(k) { return k.indexOf('prov') > -1; }).forEach(function(k) { console.log(' - categoryMap key:', k); });