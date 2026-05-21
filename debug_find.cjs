const fs = require('fs');
const dir = 'src/data/';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const brokenFiles = [];

for (const f of files) {
  const content = fs.readFileSync(dir + f, 'utf8');
  if (!content.includes('"image"') || !content.includes('svg+xml')) continue;

  const lines = content.split('\n');
  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    const line = lines[i];
    if (!(line.includes('"image"') && line.includes('svg+xml'))) continue;

    const imgIdx = line.indexOf('"image"');
    if (imgIdx < 0) continue;

    // Find: "image": "value"
    // Strategy: find the first " after "image":
    const col1 = line.indexOf('"', imgIdx);
    const col2 = line.indexOf('"', col1 + 1);  // this is the : "
    if (col2 < 0) continue;
    const col3 = line.indexOf('"', col2 + 1);  // opening " of the value
    if (col3 < 0) continue;

    const valStart = col3 + 1;
    const svgPos = line.indexOf('svg+xml,', valStart);
    if (svgPos < 0) continue;

    const svgContentStart = svgPos + 9;  // length of 'svg+xml,'

    // Trace through the JS string content
    let k = 0;  // escape count
    let problemIdx = -1;
    for (let j = svgContentStart; j < line.length; j++) {
      if (line[j] === '\\') { k++; continue; }
      if (line[j] === '"') {
        if (k % 2 === 0) { problemIdx = j; break; }  // unescaped " -> breaks string
      }
      k = 0;
    }

    if (problemIdx === -1) continue;

    const problemText = line.substring(problemIdx, Math.min(problemIdx + 15, line.length));
    console.log(`BROKEN: ${f}:${i+1} contentStart=${svgContentStart} problemIdx=${problemIdx} problem="..."`);
    console.log(`  context around ${svgContentStart}:`, JSON.stringify(line.substring(svgContentStart, svgContentStart+40)));
    console.log(`  problem: "${problemText}"`);
    brokenFiles.push(f);
    break;
  }
}

console.log('\n==> Total broken:', brokenFiles.length);
