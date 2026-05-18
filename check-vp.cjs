const fs = require('fs');
const re = /"Вызывные панели"\s*:\s*\{\s*category:\s*"([^"]+)"[^}]*subcategory:\s*"([^"]+)"/;
const data = fs.readFileSync('src/data.js', 'utf8');
const m = data.match(re);
if (m) {
  console.log('FOUND:', `category: "${m[1]}", subcategory: "${m[2]}"`);
} else {
  console.log('NOT found - looking for alternative match...');
  const m2 = data.match(/"Вызывные панели"\s*:\s*\{([\s\S]*?)\},/);
  console.log(m2 ? `Found entry: ${m2[1].trim().substring(0, 150)}` : 'No entry at all');
}