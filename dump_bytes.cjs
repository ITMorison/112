const fs = require('fs');
const f = 'src/data/ip-telefony.js';
const line = fs.readFileSync(f,'utf8').split('\n')[12];

// Print every character with its index
for(let i=70; i<120; i++) {
  console.log(i, JSON.stringify(line[i]), `U+${line.charCodeAt(i).toString(16).padStart(4,'0')}`);
}
