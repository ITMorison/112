const fs = require('fs');
const dir = 'src/data/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let fixed = 0, skipped = 0;

for (const f of files) {
  const content = fs.readFileSync(dir + f, 'utf8');
  if (!content.includes('"image"') || !content.includes('svg+xml')) { skipped++; continue; }

  const lines = content.split('\n');
  let changed = false;
  let newLines = lines.slice();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!(line.includes('"image"') && line.includes('svg+xml'))) continue;

    const imgIdx = line.indexOf('"image"');
    if (imgIdx < 0) continue;

    // Find the VALUE start: first " after "image": , then the " opening the value
    const firstQ = line.indexOf('"', imgIdx + 9);
    const valQ = line.indexOf('"', firstQ + 1);
    if (valQ < 0) continue;

    const svgPos = line.indexOf('svg+xml,', valQ);
    if (svgPos < 0) continue;

    const contentStart = svgPos + 'svg+xml,\n'.length - 1;  // == svgPos + 9
    if (contentStart >= line.length) continue;

    // Find first unescaped closing " in the value
    let k = 0;
    let problemIdx = -1;
    for (let j = contentStart; j < line.length; j++) {
      if (line[j] === '\\') { k++; continue; }
      if (line[j] === '"') {
        if (k % 2 === 0) { problemIdx = j; break; }
      }
      k = 0;
    }

    if (problemIdx < 0) { skipped++; continue; }

    // THE FIX: in the substring BEFORE the problemIdx (but AFTER contentStart),
    // every occurrence of \" needs to become \\\
    // Because the file contains a literal backslash-string-quote, and we need
    // the JS parser to see a double-backslash then a quote (properly escaped string closure)
    const before = line.substring(0, contentStart);
    const toFix  = line.substring(contentStart, problemIdx);
    const after  = line.substring(problemIdx);   // the " that closes the JS string

    // Replace: \ " → \ \ "
    // The regex matches each \ that is immediately followed by "
    const fixedPart = toFix.replace(/\\(?=")/g, '\\\\');

    if (fixedPart !== toFix) {
      newLines[i] = before + fixedPart + after;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(dir + f, newLines.join('\n'), 'utf8');
    fixed++;
  }
}

console.log(`Fixed: ${fixed}`);
console.log(`Skipped/no change: ${skipped}`);
