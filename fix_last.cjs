const fs = require('fs');
const dir = 'src/data/';

function fixImageValuesInFile(f) {
  const path = dir + f;
  const raw = fs.readFileSync(path, 'utf8');
  if (!raw.includes('"image"') || !raw.includes('svg+xml,')) return 0;

  const lines = raw.split('\n');
  let newLines = [];
  let totalReplacements = 0;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) {
      newLines.push(line); continue;
    }

    // Find the 3rd " in the line = opening " of the image value
    let q = 0, valStart = -1;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') { q++; if (q === 3) { valStart = j + 1; break; } }
    }
    if (valStart < 0) { newLines.push(line); continue; }

    // Find unescaped closing " of the outer JS value string
    let be = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') {be++; continue;}
      if (line[j] === '"') { if (be % 2 === 0) { closingQ = j; break; } be=0; continue; }
      be = 0;
    }
    if (closingQ < 0) { newLines.push(line); continue; }

    const vc = line.substring(valStart, closingQ);
    // vc[last] + line[closingQ] might be a `\" ` sequence spanning the boundary
    // Count all `\"` occurrences in the value
    let count = 0;
    for (let i = 0; i < vc.length - 1; i++) {
      if (vc[i] === '\\' && vc[i + 1] === '"') count++;
    }
    // Also check boundary: vc[last] = \ and line[closingQ] = "
    if (vc.length > 0 && vc[vc.length - 1] === '\\' && line[closingQ] === '"') {
      count++; // closing " is part of the broken inner \" pair
    }
    if (count === 0) { newLines.push(line); continue; }

    // Now do the replacement
    // Single `\` + `"` → `\` + `'`
    // Note: replacement is of each occurrence of \" pair
    let nv = '';
    let i = 0;
    let reps = 0;

    while (i < vc.length) {
      if (i + 1 < vc.length && vc[i] === '\\' && vc[i + 1] === '"') {
        // Replace \" with \'
        // In JS source: this produces \\  == two chars from one `\` + second `'`
        nv = nv + '\\';
        i += 2;
        reps++;
      } else if (i === vc.length - 1 && vc[i] === '\\') {
        // Last char is \ - boundary case, check if line[closingQ] is "
        nv = nv + '\\';
        i++;
      } else {
        nv = nv + vc[i];
        i++;
      }
    }

    // Replace the `"` at line[closingQ] with `'` if we had the boundary case
    if (vc[vc.length - 1] === '\\' && line[closingQ] === '"') {
      // Keep the rest of the line same, just replace the closing "
      newLines.push(line.substring(0, valStart) + nv + "'" + line.substring(closingQ + 1));
    } else {
      newLines.push(line.substring(0, valStart) + nv + line.substring(closingQ));
    }

    totalReplacements += reps;
    console.log('  Fixed: ' + f + ':' + (li + 1) + ' -> ' + reps + ' occurrences');
  }

  if (totalReplacements > 0) {
    fs.writeFileSync(path, newLines.join('\n'), 'utf8');
    return totalReplacements;
  }
  return 0;
}

const allFiles = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let filesFixed = 0, total = 0;

for (const f of allFiles) {
  const n = fixImageValuesInFile(f);
  if (n > 0) { filesFixed++; total += n; }
}

console.log('\nDone! Fixed: ' + filesFixed + ' files, ' + total + ' total replacements.');
