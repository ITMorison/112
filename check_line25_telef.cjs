const fs = require('fs');
const p = 'src/data/ip-telefony.js';
const lines = fs.readFileSync(p, 'utf8').split('\n');
for (let i = 24; i < 28; i++) {
  console.log(i+1, JSON.stringify(lines[i]));
}
