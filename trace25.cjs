const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const lines = fs.readFileSync(f, 'utf8').split('\n');
const line25 = lines[24];

// Show positions 72-85 of line25
for (let i = 72; i < 86; i++) {
  console.log(`[${i}]: ${JSON.stringify(line25[i])} U+${line25.charCodeAt(i).toString(16)}`);
}

const imgIdx = line25.indexOf('"image"');
const colonIdx = line25.indexOf(':', imgIdx);
const valQ = line25.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;

console.log('\nvalStart:', valStart, 'line25[valStart]:', JSON.stringify(line25[valStart]));
console.log('line25.substring(valStart, valStart+4):', JSON.stringify(line25.substring(valStart, valStart+4)));

// Find closingQ
let be = 0, closingQ = -1;
for (let j = valStart; j < Math.min(line25.length, 100); j++) {
  if (line25[j] === '\\') {be++; console.log(`k=${be} BSLASH at ${j}`); continue;}
  if (line25[j] === '"') {
    if (be%2===0) {
      console.log('closingQ at ' + j + ', be=' + be + ', be%2=' + (be%2));
      closingQ = j; break;
    } else {
      console.log(`escaped " at ${j}, k=${be}`);
    }
  }
  be = 0;
}
console.log('closingQ:', closingQ);

const vc = line25.substring(valStart, closingQ);
console.log('vc.length:', vc.length);
console.log('line25.length:', line25.length);
// Show vc end
console.log('vc[vc.length-10 .. end]:');
for (let i = Math.max(0, vc.length-10); i < vc.length; i++) {
  console.log(`  [${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString(16)}`);
}
