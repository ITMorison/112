// dump_bytes.cjs - dwarfed by earlier trace. Let me now trace ip-telefony more carefully
const fs = require('fs');
const line = fs.readFileSync('src/data/ip-telefony.js','utf8').split('\n')[12];

console.log('Total line length:', line.length);
// Find all occurrences of '"image"'
const imgIdx = line.indexOf('"image"');
console.log('imgIdx:', imgIdx);

// Find the actual VALUE opening quote
const afterColon = line.indexOf(':', imgIdx);
console.log('colon at:', afterColon);

// Find the opening " of the value (the first " after the colon)
const valQ = line.indexOf('"', afterColon);
console.log('valQ (opening " of value):', valQ, 'char:', JSON.stringify(line[valQ]));

const contentStart = valQ + 1;
console.log('contentStart:', contentStart);
console.log('JSON of contentStart-10 to contentStart+20:');
console.log(JSON.stringify(line.substring(Math.max(0,contentStart-10), contentStart+20)));

// Check if `svg+xml,` appears AFTER valQ
const svgPos = line.indexOf('svg+xml,', valQ);
console.log('svgPos:', svgPos);

// If no svg+xml inside the value, the value might end on the next line
if (svgPos < 0) {
  console.log('svg+xml not found after valQ! Are we looking at the right line?');
  // Check if the value ends in this line
  // value = string from valQ+1 to the next unescaped "
  let k = 0, valEnd = -1;
  for (let j = contentStart; j < line.length; j++) {
    if (line[j] === '\\') {k++; continue;}
    if (line[j] === '"') {if(k%2===0){valEnd=j; break;}}
    k=0;
  }
  console.log('valEnd at:', valEnd, 'rest of line:', JSON.stringify(line.substring(valEnd, Math.min(valEnd+50, line.length))));
}
