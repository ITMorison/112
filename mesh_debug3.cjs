const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const content = fs.readFileSync(f, 'utf8');
const lines = content.split('\n');
const line25 = lines[24]; // line 25 (0-indexed: 24)

console.log('Line 25 length:', line25.length);
console.log('Line 25 (first 30 chars):', JSON.stringify(line25.substring(0, 30)));
console.log('Line 25 chars at pos 14-20:');
for (let i = 14; i < 21; i++) {
  console.log(`  [${i}]: ${JSON.stringify(line25[i])} U+${line25.charCodeAt(i).toString(16)}`);
}

// Find closing " in the value
let k = 0, closingQ = -1;
const imgIdx = line25.indexOf('"image"');
const colonIdx = line25.indexOf(':', imgIdx);
const valQ = line25.indexOf('"', colonIdx > 0 ? colonIdx + 1 : 1);
const valStart = valQ + 1;

console.log('valStart:', valStart, 'line[valStart]:', JSON.stringify(line25[valStart]));

for (let j = valStart; j < Math.min(line25.length, 500); j++) {
  if (line25[j] === '\\') {k++; continue;}
  if (line25[j] === '"') {
    if (k % 2 === 0) {closingQ = j; console.log('Found closing quote at', j, 'k='+k); break;}
  }
  k = 0;
}
console.log('closingQ:', closingQ);

if (closingQ >= 0) {
  const vc = line25.substring(valStart, closingQ);
  console.log('vc length:', vc.length);
  
  // Now show byte codes at positions 0-5, and around position 44-50
  console.log('vc chars 0-10:');
  for (let i = 0; i < 11; i++) {
    console.log(`  vc[${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString(16)}`);
  }
  
  console.log('\nvc chars 40-52:');
  for (let i = 40; i < 53; i++) {
    if (i >= vc.length) break;
    console.log(`  vc[${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString(16)}`);
  }
  
  // Check for \\\" pattern in vc
  console.log('\nPattern check in vc:');
  let foundPattern = false;
  for (let i = 0; i < vc.length - 1; i++) {
    if (vc[i] === '\\' && vc[i+1] === '"') {
      console.log(`Found \\" at vc[${i}]:`);
      if (i > 44 && i < 50);
      foundPattern = true;
    }
  }
  if (!foundPattern) {
    console.log('NO \\" pattern found in vc');
    // Show different patterns
    // Check for single backslash anywhere
    for (let i = 0; i < Math.min(vc.length, 100); i++) {
      if (vc[i] === '\\') {
        console.log(`Found single backslash at vc[${i}]`);
      }
    }
  }
  
  // Show the actual vc content to understand
  console.log('\nFull vc content:', JSON.stringify(vc));
}
