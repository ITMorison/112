const fs = require('fs');
const p = 'src/data/upravlyaemye-soho-poe.js';
const lines = fs.readFileSync(p, 'utf8').split('\n');
for (let i = 68; i < 78; i++) {
  console.log(i+1, JSON.stringify(lines[i]?.substring(0, 130)));
}
