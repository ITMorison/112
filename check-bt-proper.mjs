import { PRODUCTS, CATEGORY_MAP } from './src/data.js';

// Show actual unicode codepoints of the besprovodnye subcategory products
const bt = PRODUCTS.filter(function(p) { 
  const s = p.subcategory || '';
  return s.startsWith('b') || s.startsWith('\u0431');
});

console.log('Products with b/б-starting subcategory:', bt.length);

// Check categoryMap keys for besprovodnye  
const btKeys = Object.keys(CATEGORY_MAP).filter(function(k) { 
  return k.startsWith('b') || k.startsWith('\u0431'); 
});
console.log('Besprovodnye keys in CATEGORY_MAP:', btKeys.join(', '));
