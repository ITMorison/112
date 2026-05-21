// check_mesh.cjs
const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const lines = fs.readFileSync(f,'utf8').split('\n');

console.log('Line 13:');
let line13 = lines[12];
for (let i = 75; i < 95; i++) {
  console.log(`pos ${i}: ${JSON.stringify(line13[i])} U+${line13.charCodeAt(i).toString(16)}`);
}

console.log('\nLine 25:');
let line25 = lines[24];
for (let i = 75; i < 95; i++) {
  console.log(`pos ${i}: ${JSON.stringify(line25[i])} U+${line25.charCodeAt(i).toString(16)}`);
}
