const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const content = fs.readFileSync(f, 'utf8');
const line25 = content.split('\n')[24];
const imgIdx = line25.indexOf('"image"');
const colonIdx = line25.indexOf(':', imgIdx);
const valQ = line25.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;
let k = 0, closingQ = -1;
for (let j = valStart; j < 500; j++) {
  if (j >= line25.length) break;
  if (line25[j] === '\\') {k++; continue;}
  if (line25[j] === '"') { if (k%2===0) {closingQ=j; break;} }
  k=0;
}
const vc = line25.substring(valStart, closingQ);
console.log('vc.length:', vc.length);

// Show chars around positions 63-72 of vc
for (let i = 63; i < Math.min(vc.length, 73); i++) {
  console.log(`vc[${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString(16)}`);
}

console.log('\nFull vc:', JSON.stringify(vc));
