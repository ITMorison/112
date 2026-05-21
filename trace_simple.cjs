const fs = require('fs');
const f = 'src/data/ip-ats-i-shlyuzy.js';
const content = fs.readFileSync(f, 'utf8');
const lines = content.split('\n');
const line = lines[12];

// Show byte positions 75-90 of the line
for (let i = 75; i < 90; i++) {
  console.log(`line[${i}]: char=${JSON.stringify(line[i])}  U+${line.charCodeAt(i).toString(16)}`);
}

const imgIdx = line.indexOf('"image"');
const colonIdx = line.indexOf(':', imgIdx);
const valQ = line.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;

let k = 0, closingQ = -1;
for (let j = valStart; j < line.length && j < 300; j++) {
  if (line[j] === '\\') {k++; continue;}
  if (line[j] === '"') { if (k%2===0) {closingQ=j; break;} }
  k = 0;
}
const vc = line.substring(valStart, closingQ);
console.log('\nvalStart:', valStart, 'closingQ:', closingQ, 'vc.length:', vc.length);
console.log('vc[0-6]:', JSON.stringify(vc.substring(0, 6)));

// Show byte codes around the width= area
// width= is at vc[39-44] (from earlier analysis)
for (let i = 39; i < 55; i++) {
  if (i >= vc.length) break;
  console.log(`  vc[${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString(16)}`);
}

// Now run the replacement
let fixed = '';
let j2 = 0;
let replaced = 0;
while (j2 < vc.length) {
  if (j2 + 1 < vc.length && vc[j2] === '\\' && vc[j2+1] === '"') {
    fixed += "\\'";
    j2 += 2;
    replaced++;
  } else {
    fixed += vc[j2];
    j2++;
  }
}

console.log('\nTotal replacements:', replaced);
console.log('fixed[0-10]:', JSON.stringify(fixed.substring(0, 10)));
console.log('fixed[39-55]:', JSON.stringify(fixed.substring(39, Math.min(55, fixed.length))));
