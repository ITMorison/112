const fs = require('fs');
const p = 'src/data/upravlyaemye-soho-poe.js';
const raw = fs.readFileSync(p, 'utf8');
const lines = raw.split('\n');
for (let i = 0; i < Math.min(15, lines.length); i++) {
  console.log(i+1, JSON.stringify(lines[i]));
}
