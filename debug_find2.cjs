const fs = require('fs');
const dir = 'src/data/';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const result = {broken: [], ok: []};

for (const f of files) {
  const content = fs.readFileSync(dir + f, 'utf8');
  if (!content.includes('"image"') || !content.includes('svg+xml')) { result.ok.push(f); continue; }

  const lines = content.split('\n');
  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    const line = lines[i];
    if (!(line.includes('"image"') && line.includes('svg+xml'))) continue;
    if (line.split('"image"').length < 2) continue;

    // Find the first "image" occurrence
    const imgIdx = line.indexOf('"image"');
    if (imgIdx < 0) continue;

    // Find the opening " of the value: first " after "image":  
    const col1 = line.indexOf('"', imgIdx + 9);
    if (col1 < 0) continue;
    const valStart = line.indexOf('"', col1 + 1);
    if (valStart < 0) continue;

    const svgPos = line.indexOf('svg+xml,', valStart);
    if (svgPos < 0) continue;

    const svgContentStart = svgPos + 9;

    // Trace: look for UNESCAPED "
    let k = 0;
    for (let j = svgContentStart; j < line.length; j++) {
      if (line[j] === '\\') { k++; continue; }
      if (line[j] === '"') {
        // k == number of immediately preceding backslashes
        // If k is even (or 0), this " closes the outer string
        if (k % 2 === 0) {
          const isAtEnd = j === line.length - 1;
          if (!isAtEnd) {
            // Examine what precedes this "
            // Check: is this " a " that closes the JS string, or is it escaped?
            // Actually check the actual bytes BEFORE the ":
            // If there's exactly ONE backslash before it (k==1), the " is escaped
            // But we counted k=0 after escaping, so if k%2==0 here, the " is NOT escaped
            result.broken.push({file:f, line:i+1, col:j, context:JSON.stringify(line.substring(Math.max(0,j-10),j+10))});
            break;
          }
        }
      }
      k = 0;
    }
  }
}

console.log(`\n=> Broken: ${result.broken.length}, OK: ${result.ok.length}`);
if (result.broken.length > 0) {
  console.log('\nFirst 10 broken files:');
  result.broken.slice(0, 10).forEach(b => console.log(`  ${b.file}:${b.line} col=${b.col} ctx=${b.context}`));
}
