// final_replacement_test.cjs
const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const lines = fs.readFileSync(f, 'utf8').split('\n');
const line25 = lines[24];

// Find the value
let q = 0, valStart = -1;
for (let j = 0; j < line25.length; j++) {
  if (line25[j] === '"') { q++; if (q === 3) { valStart = j + 1; break; } }
}

let be = 0, closingQ = -1;
for (let j = valStart; j < line25.length; j++) {
  if (line25[j] === '\\') {be++; continue;}
  if (line25[j] === '"') { if (be%2===0) {closingQ=j; break;} be=0; }
}
const vc = line25.substring(valStart, closingQ);

console.log('valStart:', valStart, 'closingQ:', closingQ, 'vc.length:', vc.length);
console.log('line25.length:', line25.length);
console.log('line[valStart]:', JSON.stringify(line25[valStart]));
console.log('line[closingQ]:', JSON.stringify(line25[closingQ]));
console.log('vc[vc.length-2..end]:');
for (let i = Math.max(0, vc.length-3); i < vc.length; i++) {
  console.log(`  [${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString(16).padStart(4,'0')}`);
}
console.log('line25[closingQ..closingQ+5]:');
for (let i = closingQ; i < closingQ+6; i++) {
  console.log(`  line25[${i}]: ${JSON.stringify(line25[i])} U+${line25.charCodeAt(i).toString(16).padStart(4,'0')}`);
}
