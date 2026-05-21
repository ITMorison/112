const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const lines = fs.readFileSync(f, 'utf8').split('\n');

for (let li = 0; li < Math.min(lines.length, 35); li++) {
  const line = lines[li];
  if (!line.includes('"image"')) continue;
  console.log(`Line ${li+1}:`);
  let k = 0, closingQ = -1;
  for (let j = 0; j < line.length; j++) {
    if (!line.includes('"image"')) continue;
    const imgIdx = line.indexOf('"image"');
    const colonIdx = line.indexOf(':', imgIdx);
    const valQ = line.indexOf('"', colonIdx + 1);
    const valStart = valQ + 1;
    let be = 0;
    for (let x = valStart; x < line.length; x++) {
      if (line[x] === '\\') {be++; continue;}
      if (line[x] === '"') { if (be%2===0) {closingQ=x; break;} }
      be = 0;
    }
    if (closingQ < 0) { console.log(' NO CLOSE'); continue; }
    console.log(`  imgIdx=${imgIdx}, valStart=${valStart}, closingIdx=${closingQ}`);
    const vc = line.substring(valStart, closingQ);
    console.log('  vc:', JSON.stringify(vc));
    console.log('  vc[0-10]:');
    for (let x = 0; x < 10; x++) console.log(`    [${x}]: ${JSON.stringify(vc[x])} U+${vc.charCodeAt(x).toString(16)}`);
    // check for broken pattern
    for (let x = 35; x < 50; x++) {
      console.log(`  [${x}]: ${JSON.stringify(vc[x])} U+${vc.charCodeAt(x).toString(16)}`);
    }
    break;
  }
}
