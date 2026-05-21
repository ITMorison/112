// fix_all_svgs.cjs - CORRECT version
const fs = require('fs');
const dir = 'src/data/';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let fixed = 0;

for (const f of files) {
  const path = dir + f;
  const content = fs.readFileSync(path, 'utf8');
  if (!content.includes('"image"') || !content.includes('svg+xml')) continue;
  if (!content.includes('\\"')) continue;  // quick check for broken pattern

  const lines = content.split('\n');
  let changed = false;
  let newLines = lines.slice();

  for (let i = 0; i < Math.min(lines.length, 2000); i++) {
    const line = lines[i];
    if (!line.includes('"image"') || !line.includes('svg+xml')) continue;

    // Find the value string: "image": "VALUE"
    // positions[0] = opening " of "image"
    // positions[1] = closing " of "image"
    // positions[2] = opening " of the value
    const positions = (line.match(/"/g) || []).map(m => m.index || m); // doesn't work with RegExp result
    // Let me find them manually
    
    // Find "image" first
    const imgIdx = line.indexOf('"image"');
    if (imgIdx < 0) continue;
    
    const imgQ1 = imgIdx + 4;  // closing " of "image", since "image" starts at imgIdx
    
    // Value opening quote is first " after the colon
    const colonIdx = line.indexOf(':', imgIdx);
    if (colonIdx < 0) continue;
    
    const valQ = line.indexOf('"', colonIdx + 1);
    if (valQ < 0) continue;
    
    const valContentStart = valQ + 1;
    
    // Trace to find the unescaped " that closes the value
    let k = 0, closingQ = -1;
    for (let j = valContentStart; j < line.length; j++) {
      const ch = line[j];
      if (ch === '\\') {k++; continue;}
      if (ch === '"') {
        if (k % 2 === 0) {closingQ = j; break;}
      }
      k = 0;
    }
    if (closingQ < 0) continue;

    const valContent = line.substring(valContentStart, closingQ);
    if (!valContent.includes('\\"')) continue;

    // Replace all \" with \' in the SVG content
    let newVal = '';
    let skip = false;
    let replacements = 0;
    for (let j = 0; j < valContent.length; j++) {
      if (skip) { skip = false; continue; }
      if (valContent[j] === '\\' && j + 1 < valContent.length && valContent[j + 1] === '"') {
        newVal += "\\'";
        skip = true;
        replacements++;
      } else {
        newVal += valContent[j];
      }
    }

    if (replacements === 0) continue;

    newLines[i] = line.substring(0, valContentStart) + newVal + line.substring(closingQ);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(path, newLines.join('\n'), 'utf8');
    fixed++;
    console.log(`Fixed: ${f}`);
  }
}

console.log(`\nTotal fixed: ${fixed}`);
