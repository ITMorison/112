const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const content = fs.readFileSync(f, 'utf8');
const lines = content.split('\n');

for (let lineNum = 1; lineNum <= 30; lineNum++) {
  const line = lines[lineNum-1];
  if (!line.includes('"image"') || !line.includes('svg+xml,')) continue;

  console.log(`\nLine ${lineNum}:`);
  const imgIdx = line.indexOf('"image"');
  const colonIdx = line.indexOf(':', imgIdx);
  const valQ = line.indexOf('"', colonIdx + 1);
  const valStart = valQ + 1;

  // Find closing
  let k = 0, closingQ = -1;
  for (let j = valStart; j < line.length; j++) {
    if (line[j] === '\\') {k++; continue;}
    if (line[j] === '"') {
      if (k % 2 === 0) {closingQ = j; break;}
    }
    k = 0;
  }

  if (closingQ < 0) { console.log(' NO CLOSING FOUND'); continue; }

  const vc = line.substring(valStart, closingQ);
  console.log(' valStart:', valStart);
  console.log(' closingIdx:', closingQ);
  console.log(' valContent:', JSON.stringify(vc));

  // Manual scan of valContent for \" patterns
  for (let j = 0; j < Math.min(vc.length, 20); j++) {
    const ch = vc[j];
    console.log(`  [${j}] ${JSON.stringify(ch)} U+${ch.charCodeAt(0).toString(16)}`);
  }
}
