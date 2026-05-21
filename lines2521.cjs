const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const fileContent = fs.readFileSync(f, 'utf8');
const lines = fileContent.split('\n');
const line21 = lines[20];
const line25 = lines[24];

console.log('=== Line 21 ===');
for (let i = 74; i < 86; i++) {
  if (i < line21.length) console.log(`[${i}]: ${JSON.stringify(line21[i])} U+${line21.charCodeAt(i).toString(16)}`);
}

console.log('=== Line 25 ===');
for (let i = 74; i < 86; i++) {
  if (i < line25.length) console.log(`[${i}]: ${JSON.stringify(line25[i])} U+${line25.charCodeAt(i).toString(16)}`);
}
