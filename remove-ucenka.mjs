const fs = require('fs');

// Parse Уценка codes
const ucenkaText = fs.readFileSync('output_prices/Al-Style_price/Уценка.txt', 'utf8');
const col1Codes = new Set();
ucenkaText.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed) return;
  const cols = trimmed.split('\t');
  const c1 = cols[0]?.trim();
  if (/^\d{5,6}y$/.test(c1)) col1Codes.add(c1);
});

console.log(`Уценка Код codes: ${col1Codes.size}`);

// Extract PRODUCTS from data.js
const dataJs = fs.readFileSync('src/data.js', 'utf8');
const m = dataJs.match(/export const PRODUCTS = (\[[\s\S]*\]);/);
if (!m) {
  console.log('ERROR: PRODUCTS not found in data.js');
  process.exit(1);
}
let PRODUCTS;
try {
  // data.js can't be parsed as JSON, use Function constructor
  const fn = new Function(m[1]);
  PRODUCTS = fn();
} catch(e) {
  console.log('Parse error:', e.message);
  process.exit(1);
}
console.log(`PRODUCTS in data.js: ${PRODUCTS.length}`);

// Find Уценка products in PRODUCTS
function isUcenkaProduct(p) {
  const art = String(p.articul || '').trim();
  if (col1Codes.has(art)) return true;
  const code = String(p.code || '').trim();
  if (col1Codes.has(code)) return true;
  return false;
}

const toRemove = PRODUCTS.filter(isUcenkaProduct);
console.log(`Products to remove from data.js: ${toRemove.length}`);
toRemove.slice(0,10).forEach(p => console.log(`  articul="${p.articul}" title="${p.title}"`));

// Remove them
const remaining = PRODUCTS.filter(p => !isUcenkaProduct(p));
console.log(`\nRemaining after removal: ${remaining.length}`);

// Update data.js: Find and replace the PRODUCTS array
const oldProductStr = m[1];

// Generate new PRODUCTS string
const newProductsStr = JSON.stringify(remaining, null, 2);
const newFull = `export const PRODUCTS = ${newProductsStr};`;

const newJs = dataJs.replace(oldProductStr, newProductsStr.replace(/\\/g, '\\\\'));
console.log('\nWriting updated data.js...');
fs.writeFileSync('src/data.js', newJs, 'utf8');
console.log('Done.');

// Verify
const fn2 = new Function(new Full);
const checkFn = fn2 ? new Function(`return (${checkFn})()`, '').length : 0
