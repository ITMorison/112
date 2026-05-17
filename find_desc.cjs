const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');

function parse(content) {
  let cleaned = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const startIdx = cleaned.indexOf('[');
  const endIdx = cleaned.lastIndexOf(']');
  let arr = cleaned.substring(startIdx, endIdx + 1);
  return arr; // без замены \n
}

const arr = parse(c);

// Find "description" and show full context
const descIdx = arr.indexOf('"description"');
console.log('Found "description" at:', descIdx);
console.log('Full context:');
console.log(arr.substring(Math.max(0, descIdx - 100), descIdx + 50));
console.log('\n---');

// Count the " chars before description
let qCount = 0;
for (let i = 0; i < descIdx; i++) {
  if (arr[i] === '"') qCount++;
}
console.log('Total quotes before description:', qCount);

// Show chars at descIdx-5 to descIdx+5
console.log('\nChars at descIdx-5 to descIdx+5:');
for (let i = descIdx - 5; i < descIdx + 10; i++) {
  process.stdout.write(i.toString().padStart(3) + ':' + arr.charCodeAt(i).toString(16).padStart(2,'0') + ' ');
}
console.log();
