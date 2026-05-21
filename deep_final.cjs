const fs = require('fs');
const f = 'src/data/ip-ats-i-shlyuzy.js';
const lines = fs.readFileSync(f, 'utf8').split('\n');
const line = lines[12];

const imgIdx = line.indexOf('"image"');
const colonIdx = line.indexOf(':', imgIdx);
const valQ = line.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;

let k = 0, closingQ = -1;
for (let j = valStart; j < 250; j++) {
  if (line[j] === '\\') {k++; continue;}
  if (line[j] === '"') { if (k%2===0) {closingQ=j; break;} }
  k=0;
}
const vc = line.substring(valStart, closingQ);

console.log('valStart:', valStart, 'closingQ:', closingQ, 'vc length:', vc.length);
console.log('vc[0]:', JSON.stringify(vc[0]));
console.log('vc[1]:', JSON.stringify(vc[1]));
console.log('vc[2]:', JSON.stringify(vc[2]));
console.log('vc[3]:', JSON.stringify(vc[3]));
console.log('vc[4]:', JSON.stringify(vc[4]));
console.log('vc[5]:', JSON.stringify(vc[5]));
console.log('vc[6]:', JSON.stringify(vc[6]));
console.log('vc[7]:', JSON.stringify(vc[7]));
console.log('vc[8]:', JSON.stringify(vc[8]));
console.log('vc[9]:', JSON.stringify(vc[9]));
console.log('vc[10]:', JSON.stringify(vc[10]));
console.log('vc[11]:', JSON.stringify(vc[11]));
console.log('vc[12]:', JSON.stringify(vc[12]));
console.log('vc[13]:', JSON.stringify(vc[13]));
console.log('vc[14]:', JSON.stringify(vc[14]));
console.log('vc[15]:', JSON.stringify(vc[15]));

console.log('\nNow testing includes:');
console.log('vc includes "\\":', vc.includes('\\'));
console.log('(testing char: one backslash)');
const test = '\\\"'; // source: \\\"
console.log('test repr:', JSON.stringify(test), 'len:', test.length);
console.log('vc.includes(JSON.stringify(test)):', vc.includes(test));

// This is the key question: does vc[1] === '"' ?
// Or vc[1] === '\\"' ?