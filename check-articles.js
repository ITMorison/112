import fs from 'fs';

const files = [
  './src/new-products.json',
  './src/price1-products.json', 
  './src/price2-products.json',
  './src/price3-products.json'
];

const allArticles = new Set();
const allCodes = new Set();

for (const file of files) {
  const products = JSON.parse(fs.readFileSync(file));
  for (const p of products) {
    if (p.article) allArticles.add(String(p.article).toLowerCase());
    if (p.code) allCodes.add(String(p.code).toLowerCase());
  }
}

console.log('Sample articles:', [...allArticles].slice(0, 100).join(', '));

// Check for matches with article
const publicFiles = fs.readdirSync('./public');
let articleMatches = 0;
const matchedByArticle = [];

for (const file of publicFiles) {
  const basename = file.toLowerCase().split('.')[0].split('.')[0];
  
  for (const article of allArticles) {
    if (basename.includes(article) || article.includes(basename)) {
      articleMatches++;
      matchedByArticle.push({ file, article });
      break;
    }
  }
}

console.log(`\nMatches by article: ${articleMatches}`);
console.log('Examples:', matchedByArticle.slice(0, 10).map(m => `${m.file} -> ${m.article}`).join('\n'));