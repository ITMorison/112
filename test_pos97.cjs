const fs = require('fs');
const c = fs.readFileSync('src/data/setevye-patch-kordy.js', 'utf8');
console.log('Position 90-105:');
for (let i = 90; i < 110; i++) {
  console.log(i.toString().padStart(3), JSON.stringify(c[i]));
}
