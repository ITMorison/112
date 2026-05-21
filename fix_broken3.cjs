const fs = require('fs');
const dir = 'src/data/';

// The 3 files still broken per Vite build:
const brokenFiles = ['mesh-системы.js', 'ip-telefony.js', 'ip-ats-i-shlyuzy.js'];

let totalChanges = 0;

for (const f of brokenFiles) {
  const path = dir + f;
  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');

  let newLines = [];
  let fileChanges = 0;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.includes('"image"') || !line.includes('svg+xml')) {
      newLines.push(line);
      continue;
    }

    // Find third " to determine value start (0-indexed in line)
    let qCount = 0, valQ = -1;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') {
        qCount++;
        if (qCount === 3) { valQ = j; break; }
      }
    }
    if (valQ < 0) { newLines.push(line); continue; }

    const valStart = valQ + 1;

    // Trace through val string to find the closing "
    let k = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') {k++; continue;}
      if (line[j] === '"' && k % 2 === 0) { closingQ = j; break; }
      k = 0;
    }
    if (closingQ < 0) { newLines.push(line); continue; }

    const vc = line.substring(valStart, closingQ);

    // Do the replacement: in the vc, replace any `\"` → `\'`
    // where `\` and `"` are ACTUAL characters in vc
    // In source JS: `valContent[j] === '\\' && valContent[j+1] === '"'`
    // tests if chars at j and j+1 are `\` and `"`
    let nv = '';
    let j = 0;
    let reps = 0;
    while (j < vc.length) {
      if (j + 1 < vc.length && vc[j] === '\\' && vc[j + 1] === '"') {
        // Replace with `\'` in source: `"\\';"` - RECIPE FOR DISASTER
        // What I're writing to newVal: a `\` followed by `'`
        // The actual chars: backslash, single-quote
        // Force value: `\` + `'`
        const singleQuote = "'";
        nv += String.fromCharCode(0x5c, 0x27); // \ = 0x5c, ' = 0x27
        j += 2;
        reps++;
      } else {
        nv += vc[j];
        j++;
      }
    }

    if (reps === 0) { newLines.push(line); continue; }
    fileChanges++;
    newLines.push(line.substring(0, valStart) + nv + line.substring(closingQ));
  }

  if (fileChanges > 0) {
    fs.writeFileSync(path, newLines.join('\n'), 'utf8');
    console.log(`Fixed ${fileChanges} lines in ${f}`);
    totalChanges += fileChanges;
  } else {
    console.log(`No fixes needed for ${f}`);
  }
}

console.log(`\nTotal: ${totalChanges} lines fixed across ${brokenFiles.length} files`);
