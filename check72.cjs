const fs = require('fs');
const p = 'src/data/upravlyaemye-soho-poe.js';
const lines = fs.readFileSync(p, 'utf8').split('\n');
// Show lines 72-76 for context of the second error
for (let i = 69; i < 76; i++) {
  console.log(i+1, JSON.stringify(lines[i]?.substring(0, 130)));
}
