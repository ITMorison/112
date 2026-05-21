const fs = require('fs');
const f = 'src/data/ip-ats-i-shlyuzy.js';
const content = fs.readFileSync(f, 'utf8');
const lines = content.split('\n');
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

// Try different ways to access a backslash + quote pattern in vc
console.log('Test 1: vc.includes one-backslash + quote in source:');
const pat1 = '\\"';                            // source 2 chars = literal \ and "
console.log('pat1:', JSON.stringify(pat1), 'pat1.length:', pat1.length);
console.log('vc.includes(pat1):', vc.includes(pat1));

console.log('\nTest 2: Check position 0,1 specifically:');
console.log('vc[0]:', JSON.stringify(vc[0]), 'U+', vc.charCodeAt(0).toString(16));
console.log('vc[1]:', JSON.stringify(vc[1]), 'U+', vc.charCodeAt(1).toString(16));
