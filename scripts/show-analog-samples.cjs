const fs = require('fs');
const path = require('path');

const files = [
  'src/new-products.json',
  'src/price1-products.json',
  'src/price2-products.json',
  'src/price3-products.json'
].map((p) => path.join(__dirname, '..', p));

const needle = /аналог/i;
let found = 0;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const item of data) {
      const txt = (item.name || '') + ' ' + (item.fullName || '') + ' ' + (item.category_raw || '');
      if (needle.test(txt)) {
        console.log('---');
        console.log('category_raw:', item.category_raw || '<EMPTY>');
        console.log('name:', item.name || '<no name>');
        console.log('fullName:', item.fullName || '<no fullName>');
        found++;
        if (found >= 30) break;
      }
    }
    if (found >= 30) break;
  } catch (err) {
    // ignore
  }
}

console.log('\nPrinted', found, 'examples.');
process.exit(0);
