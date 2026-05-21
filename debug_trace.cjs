const fs = require('fs');
const f = 'src/data/ip-telefony.js';
const lines = fs.readFileSync(f, 'utf8').split('\n');
const line = lines[12];

// print raw bytes of the entire line to understand the structure
console.log('Full line as JSON:');
console.log(JSON.stringify(line));

const imgIdx = line.indexOf('"image"');
console.log('\nimgIdx:', imgIdx);

const col1 = line.indexOf('"', imgIdx + 9);
console.log('col1 (first " after image):', col1, 'char:', line[col1]);

const valStartQ = line.indexOf('"', col1 + 1);
console.log('valStartQ (opening " of value):', valStartQ, 'char:', line[valStartQ]);

// The actual content starts after this opening quote
const contentStart = valStartQ + 1;
console.log('contentStart:', contentStart);
console.log('First 40 chars of SVG content:', JSON.stringify(line.substring(contentStart, contentStart+40)));

// Trace through the string looking for issues
let k = 0;
let inSvgContent = false;
for (let j = contentStart; j < line.length; j++) {
  const ch = line[j];
  if (!inSvgContent && ch === 's' && line.substring(j, j+9) === 'svg+xml,') {
    inSvgContent = true;
    console.log(`\nSVG content starts at ${j}`);
  }
  if (ch === '\\') {k++; continue;}
  if (ch === '"' && inSvgContent && k % 2 == 0) {
    console.log(`** UNESCAPED " at j=${j} context: ${JSON.stringify(line.substring(Math.max(0,j-10), j+10))}`);
  }
  k = 0;
}
