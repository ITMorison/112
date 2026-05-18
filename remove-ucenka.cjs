const fs = require('fs');

// Verify what ARE those "Артикул" column 2 codes like CN5 (after removing by Код col 1)
const newProd = JSON.parse(fs.readFileSync('src/new-products.json','utf8'));
const price1 = JSON.parse(fs.readFileSync('src/price1-products.json','utf8'));

const ucenkaArticles = new Set();
const ucenkaText = fs.readFileSync('output_prices/Al-Style_price/Уценка.txt', 'utf8');
ucenkaText.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed) return;
  const cols = trimmed.split('\t');
  const code = cols[0]?.trim();
  const art = cols[1]?.trim();
  if (/^\d{5,6}y$/.test(code) && art) ucenkaArticles.add(art);
});
console.log(`Артикул (col 2) codes: ${ucenkaArticles.size}`);

// Find if any of these appear in new-products by articul
const found = newProd.filter(p => ucenkaArticles.has(String(p.articul || '').trim()));
console.log('\nnew-products matching articul codes:', found.length);
found.forEach(p => console.log(`  articul="${p.articul}" name="${p.name}"`));

// Check price1
const p1Found = price1.filter(p => ucenkaArticles.has(String(p.articul || '').trim()));
console.log('\nprice1 matching articul codes:', p1Found.length);
p1Found.slice(0, 5).forEach(p => console.log(`  articul="${p.articul}" name="${p.name}"`));

// Also search price3 (after removal) for matching in articul
const price3 = JSON.parse(fs.readFileSync('src/price3-products.json','utf8'));
const p3Found = price3.filter(p => ucenkaArticles.has(String(p.articul || '').trim()));
console.log('\nprice3 matching articul codes (after Код col1 removal):', p3Found.length);
p3Found.forEach(p => console.log(`  articul="${p.articul}" name="${p.name}"`));