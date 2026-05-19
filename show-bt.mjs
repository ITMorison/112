import { PRODUCTS } from './src/data.js';

// Find the 2 products with besprovodnye-telephony subcategory
const bt = PRODUCTS.filter(p => p.subcategory === 'besprovodnye-telefony' || p.subcategory === 'besprovodnye-telephony');
console.log('besprovodnye count by exact match:', bt.length);
bt.forEach(p => console.log(String(p.code), '|', String(p.title || p.description || '').slice(0, 60), '|', String(p.category_raw || '').slice(0, 35)));

// Also search by comparing subcategory against known list
const ip = PRODUCTS.filter(p => p.category === 'ip-telefony');
const subcounts = {};
ip.forEach(p => { subcounts[p.subcategory] = (subcounts[p.subcategory] || 0) + 1; });
console.log('\nIP phone subcategories:', JSON.stringify(subcounts, null, 2));