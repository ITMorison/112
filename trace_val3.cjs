const fs = require('fs');
const f = 'src/data/ip-ats-i-shlyuzy.js';
const raw = fs.readFileSync(f);
const bytes = new Uint8Array(raw);
const line13bytes = bytes.slice(100, Bs);
// Actually let me find line 13 byte range
const content = fs.readFileSync(f, 'utf8');
const lines = content.split('\n');
const line = lines[12];

// Find raw bytes around position 75 in the LINE (NOT file)
for (let i = 75; i < 90; i++) {
  console.log(`line[${i}]: ${JSON.stringify(line[i])} U+${line.charCodeAt(i).toString(16)}`);
}

// Now let's inspect the actual JS variable names I've been confused about
// The key test: does the file really have \\" or \" at the width= position?
// I'll work with actual char codes of the LINE

console.log('\nline[79-90] byte codes:');
for (let i = 79; i < 90; i++) {
  console.log(`line[${i}]: U+${line.charCodeAt(i).toString(16)} = ${JSON.stringify(line[i])}`);
}

// Now trace through what my fix script sees for valContent:
// valContent = line.substring(valStart, closingQ)
// valStart = valQ + 1 - I need to find valQ

const imgIdx = line.indexOf('"image"');
const colonIdx = line.indexOf(':', imgIdx);
const valQ = line.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;
console.log('\nvalStart:', valStart, 'line[valStart]:', JSON.stringify(line[valStart]));

// Find closingQ
let k = 0, closingQ = -1;
for (let j = valStart; j < 500; j++) {
  if (line[j] === '\\') {k++; continue;}
  if (line[j] === '"') {
    if (k % 2 === 0) { closingQ = j; break; }
  }
  k = 0;
}
console.log('closingQ:', closingQ);

const vc = line.substring(valStart, closingQ);
console.log('vc length:', vc.length);
console.log('vc[0-5]:', JSON.stringify(vc.substring(0, 6)));

// Now view byte codes of vc[0-12]
console.log('\nvc byte codes [0-12]:');
for (let i = 0; i < 13; i++) {
  if (i >= vc.length) break;
  console.log(`  [${i}]: U+${vc.charCodeAt(i).toString(16)} = ${JSON.stringify(vc[i])}`);
}

// Now the replacement logic
let fixed = '';
let j = 0;
while (j < vc.length) {
  if (j + 1 < vc.length && vc[j] === '\\' && vc[j+1] === '"') {
    // Replace \" with \'  (backslash followed by single quote)
    // Source: '\\'' produces: backslash, single-quote
    fixed += "\\'";
    j += 2;
  } else {
    fixed += vc[j];
    j++;
  }
}
