// test_ip-telephony.cjs
const fs = require('fs');
const f = 'src/data/ip-telefony.js';
const content = fs.readFileSync(f, 'utf8');
const lines = content.split('\n');
const line = lines[12];

const imgIdx = line.indexOf('"image"');
console.log('imgIdx:', imgIdx);
console.log('Line 13 (first 60 chars):', JSON.stringify(line.substring(0,60)));
console.log('Line 13 chars around pos 10-16:', Array.from(line).slice(10, 16).map((c,i) => (10+i)+': '+JSON.stringify(c)+' U+'+c.charCodeAt(0).toString(16)).join('\n'));
console.log();

// Now let's see what each search finds
const afterImg = line.indexOf('"', imgIdx + 8);
console.log('afterImg = indexOf("", imgIdx+8=12):', afterImg, 'chars:', JSON.stringify(line.substring(afterImg-2, afterImg+3)));

const colonIdx = line.indexOf(':', imgIdx);
console.log('colonIdx = indexOf(":", imgIdx=4):', colonIdx, 'char:', JSON.stringify(line[colonIdx]));

const valQ = line.indexOf('"', colonIdx + 1);
console.log('valQ = indexOf("", colonIdx+1=' + (colonIdx+1) + '):', valQ, 'char:', JSON.stringify(line[valQ]));

const valContentStart = valQ + 1;
console.log('valContentStart:', valContentStart, 'char:', JSON.stringify(line.substring(valContentStart, valContentStart+10)));

// Check the closing quote trace
let k = 0, foundUnescaped = false;
for (let j = valContentStart; j < valContentStart + 100; j++) {
  const ch = line[j];
  if (ch === '\\') {k++; continue;}
  if (ch === '"') {
    if (!foundUnescaped && k % 2 === 0) {
      console.log('First unescaped " at position', j, '(k='+k+')');
      foundUnescaped = true;
    }
    if (foundUnescaped) break;
  }
  k = 0;
}
