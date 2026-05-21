const fs = require('fs');
const p = 'src/data/mesh-системы.js';
const c = fs.readFileSync(p, 'utf8');
const lines = c.split('\n');
console.log('Show lines 22-27 of mesh-системы.js:');
for (let i = 21; i < 27; i++) {
  console.log(i+1, JSON.stringify(lines[i]));
}
