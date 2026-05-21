const fs = require('fs');
const f = 'src/data/ip-ats-i-shlyuzy.js';
const content = fs.readFileSync(f, 'utf8');
const lines = content.split('\n');
const line = lines[12];

const imgIdx = line.indexOf('"image"');
const colonIdx = line.indexOf(':', imgIdx);
const valQ = line.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;

// Find closing
let k = 0, closingQ = -1;
for (let j = valStart; j < 250; j++) {
  if (j >= line.length) break;
  if (line[j] === '\\') {k++; continue;}
  if (line[j] === '"') {
    if (k % 2 === 0) {closingQ = j; break;}
  }
  k = 0;
}

const vc = line.substring(valStart, closingQ);
console.log('valContent length:', vc.length);
console.log('First 20 chars of valContent:', JSON.stringify(vc.substring(0, 20)));
console.log('Chars 0-12 of valContent:');
for (let j = 0; j < 12; j++) {
  console.log(`  [${j}] ${JSON.stringify(vc[j])} U+${vc.charCodeAt(j).toString(16)}`);
}
console.log();

// Test includings
console.log('vc[0]:', vc[0], 'vc[1]:', vc[1]);
console.log('vc[0]===\\\\\\:', vc[0] === '\\\\');  // Is first char a literal backslash?
console.log('vc[1]===\\\" :', vc[1] === '\\"');   // Is second char a quote?

// Pattern tests  
console.log('vc.includes(\\"\\\\ \\\"):', vc.includes('\\ "')); // two chars: \ "
// How many patterns does vc match?
const patChar = '\\"'; // JS string => one \ then one "
console.log('Pattern \\\\" chars:', JSON.stringify(patChar), 'len:', patChar.length);
for (let j = 0; j < vc.length - 1; j++) {
  if (vc[j] === '\\' && vc[j+1] === '"') {
    console.log(`  Match at vc[${j}]: `);
  }
}
