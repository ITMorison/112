const fs = require('fs');
const f = 'src/data/ip-ats-i-shlyuzy.js';
const content = fs.readFileSync(f, 'utf8');
const line = content.split('\n')[12];
const imgIdx = line.indexOf('"image"');
const colonIdx = line.indexOf(':', imgIdx);
const valQ = line.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;

// Find unescaped closing
let k = 0, closingQ = -1;
for (let j = valStart; j < 250; j++) {
  if (j >= line.length) break;
  if (line[j] === '\\') {k++; continue;}
  if (line[j] === '"') { if (k%2===0) {closingQ=j; break;} }
  k=0;
}

const vc = line.substring(valStart, closingQ);

// What ACTUALLY is vc[1]?
console.log('vc length:', vc.length);
console.log('vc[0]:', JSON.stringify(vc[0]), 'is backslash:', vc[0] === '\\');
console.log('vc[1]:', JSON.stringify(vc[1]), 'is quote:', vc[1] === '"');

// vc[0] == '\\' ?  The source code string '\\' produces one '\'
// vc[1] == '"' ?  
//  If vc[1] in source code is the literal char ", then vc[1] === '"' is FALSE because '"' in source is the end-of-string literal

// I think the issue: in JavaScript source, '\"' is the PIECE of '""' - a string that contains one "
// So '\\' means: escape backslash = literal \
// And '\"' would mean: escape quote = literal "
// And in source code '\\\"' means: literal \, literal \, literal " = 3 chars

// So: if valContent[0] == '\\'  - this tests for a literal backslash
// And valContent[1] == '"'  - this tests for a literal quote

console.log('vc[0]===\\\\\\:", vc[0] === '\\\\');});
console.log('vc[1]===\\" :', vc[1] === '"');

// The "includes" check
// valContent.includes('\\"')
// The arg '\\"': 
//    -> escape backslash (\\), then normal "' 
//    -> produces two chars: \ and "
const pat = '\\';
console.log('Pattern to include:', JSON.stringify(pat), 'len:', pat.length);
console.log('vc.length:', vc.length);
// Check manually which positions match
// looking for \" in the actual chars of vc

for (let j = 0; j < 10; j++) {
  console.log(`vc[${j}]: ${JSON.stringify(vc[j])} U+${vc.charCodeAt(j).toString(16)}`);
}
console.log('---');
// Looking for a \ followed by " in vc
for (let j = 0; j < vc.length-1; j++) {
  if (vc[j] === '\\' && vc[j+1] === '"') {
    console.log(`Found pattern \\" at vc[${j}]`);
    break;
  }
}
