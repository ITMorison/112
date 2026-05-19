// Verify what data.js actually produces for the relevant sections
import { PRODUCTS, CATEGORY_MAP, MENU_SLUG_TO_PRODUCT_MAP } from './src/data.js';

const ipPhones = PRODUCTS.filter(p => p.category === 'ip-telefony');
const bySub = {};
ipPhones.forEach(p => { bySub[p.subcategory] = (bySub[p.subcategory] || 0) + 1; });
console.log('IP Telephony subcategories:', JSON.stringify(bySub, null, 2));
console.log('\nBesprovodnye-telefony count:', (bySub['besprovodnye-telefony'] || 0));
