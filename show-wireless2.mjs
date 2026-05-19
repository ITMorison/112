import { PRODUCTS } from './src/data.js';

const allWireless = PRODUCTS.filter(function(p) { 
  const t = String(p.title || p.description || '');
  // use codepoints for б е с п р о в о д н
  return t.includes('\u0431\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d');
});

console.log('Total wireless products:', allWireless.length);
const by = {};
allWireless.forEach(function(p) { 
  by[p.subcategory] = (by[p.subcategory] || 0) + 1; 
});
console.log('By subcategory:', JSON.stringify(by, null, 2));

console.log('\nBesprovodnye-telefony products:');
const bt = allWireless.filter(p => p.subcategory === 'besprovodnye-telefony');
bt.forEach(p => console.log(' ', p.code, '|', p.category_raw || '', '|', String(p.title || '').slice(0, 55)));
