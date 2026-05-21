const fs = require('fs');
const dir = 'src/data/';
const f = 'ip-telefony.js';
const path = dir + f;
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);
console.log('Line 13:', JSON.stringify(lines[12]).substring(0, 100));

for (let i = 0; i < Math.min(lines.length, 2000); i++) {
  const line = lines[i];
  if (!line.includes('"image"') || !line.includes('svg+xml,')) continue;
  
  console.log('\nProcessing line', i+1, ':', JSON.stringify(line.substring(0, 60)));

  const imgStart = line.indexOf('"image"');
  console.log('imgStart:', imgStart);
  
  const afterImg = line.indexOf('"', imgStart + 8);
  console.log('afterImg (end of "image"):', afterImg, '=', JSON.stringify(line[afterImg]));
  
  const colonPos = line.indexOf(':', imgStart);
  console.log('colonPos:', colonPos, '=', JSON.stringify(line[colonPos]));
  
  const valQ = line.indexOf('"', colonPos);
  console.log('valQ:', valQ, '=', JSON.stringify(line[valQ]));
  
  const valStart = valQ + 1;
  console.log('valStart:', valStart, '=', JSON.stringify(line.substring(valStart, valStart+5)));

  // count closing quote
  let k = 0, closingPos = -1;
  for (let j = valStart; j < line.length; j++) {
    if (line[j] === '\\') {k++; continue;}
    if (line[j] === '"') {
      console.log(`  possible closing " at ${j} (k=${k}, k%2=${k%2})`);
      if (k % 2 === 0) {closingPos = j; console.log('  -> FOUND closingPos:', closingPos); break;}
    }
    k = 0;
  }

  if (closingPos < 0) {
    console.log('No closing quote found!');
    continue;
  }

  const valContent = line.substring(valStart, closingPos);
  console.log('valContent:', JSON.stringify(valContent).substring(0, 80));
  console.log('valContent includes svg+xml:', valContent.includes('svg+xml'));
  console.log('valContent includes \\\\" :', valContent.includes('\\\\"'));
  console.log('valContent includes \\" :', valContent.includes('\\"'));
  
  // try the char-by-char replacement
  let newVal = '';
  let skip = false;
  for (let j = 0; j < valContent.length; j++) {
    if (skip) {skip = false; continue;}
    const ch = valContent[j];
    if (ch === '\\' && j + 1 < valContent.length && valContent[j + 1] === '"') {
      newVal += "\\'";
      skip = true; 
    } else {
      newVal += ch;
    }
  }

  console.log('newVal:', JSON.stringify(newVal).substring(0, 80));
  console.log('newVal includes svg+xml:', newVal.includes('svg+xml'));
  
  // Check if it changed
  if (newVal === valContent) {
    console.log('NO CHANGE - replacement did not do anything');
  } else {
    console.log('REPLACEMENT DID CHANGE');
  }

  break; // only first matching line
}
