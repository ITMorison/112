const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const content = fs.readFileSync(f, 'utf8');
const lines = content.split('\n');

for (let lineNum = 1; lineNum <= 28; lineNum++) {
  const line = lines[lineNum - 1];
  if (!line.includes('"image"')) continue;
  if (!line.includes('svg+xml')) continue;

  // Find val start
  const imgIdx = line.indexOf('"image"');
  const colonIdx = line.indexOf(':', imgIdx);
  const valQ = line.indexOf('"', colonIdx + 1);
  const valStart = valQ + 1;

  let be=0, closingQ=-1;
  for (let j = valStart; j < line.length; j++) {
    if (line[j] === '\\') {be++; continue;}
    if (line[j] === '"') { if (be%2===0) {closingQ=j; break;} }
    be=0;
  }

  if (closingQ < 0) { console.log(`Line ${lineNum}: no closing quote`); continue; }

  const vc = line.substring(valStart, closingQ);
  console.log(`\nLine ${lineNum}, valLength=${closingQ-valStart}, vc.length=${vc.length}`);
  
  // Find "width" in vc
  const wIdx = vc.indexOf('width');
  if (wIdx < 0) { console.log('No width found'); continue;}
  // Show 4 chars before and after 'width'
  console.log(`"width" at vc[${wIdx}]: ${JSON.stringify(vc.substring(wIdx, wIdx+15))}`);
  
  // Break after first line
  break;
}
