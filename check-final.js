import fs from 'fs';

const files = [
  './src/new-products.json',
  './src/price1-products.json', 
  './src/price2-products.json',
  './src/price3-products.json'
];

const imageMap = JSON.parse(fs.readFileSync('./src/image-map.json'));

let total = 0;
let withImages = 0;

for (const file of files) {
  const products = JSON.parse(fs.readFileSync(file));
  for (const p of products) {
    total++;
    const codeStr = String(p.code);
    const articleStr = p.article ? String(p.article).toLowerCase() : null;
    
    const images = imageMap[codeStr] || imageMap[codeStr.padStart(5, '0')] || (articleStr && imageMap[articleStr]);
    if (images && images.length > 0) {
      withImages++;
    }
  }
}

console.log(`Total products: ${total}`);
console.log(`Products with images: ${withImages}`);
console.log(`Products without images: ${total - withImages}`);