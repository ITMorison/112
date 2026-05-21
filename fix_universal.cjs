// fix_width_attrs.cjs - At the end of the value content, check if vc ends with `\` and
// the outer closing " means there's an UNESCAPED `"` in the value.
// Replace ALL such `\"` → `\'` across the ENTIRE file
const fs = require('fs');
const dir = 'src/data/';

let filesFixed = 0, totalReplacements = 0;

for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
  const path = dir + f;
  const raw = fs.readFileSync(path, 'utf8');
  if (!raw.includes('"image"') || !raw.includes('svg+xml,')) continue;

  const lines = raw.split('\n');
  let newContent = raw;
  let fileReplacements = 0;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) continue;

    // 3rd " = opening " of value
    let q = 0, valStart = -1;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') { q++; if (q === 3) { valStart = j + 1; break; } }
    }
    if (valStart < 0) continue;

    // Unescaped closing " of outer string
    let be = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') {be++; continue;}
      if (line[j] === '"') { if (be%2===0) {closingQ=j; break;} be=0; continue; }
      be = 0;
    }
    if (closingQ < 0) continue;

    const vc = line.substring(valStart, closingQ);

    // Collect all positions of `\"` IN THE VALUE including the boundary case
    // where vc[last] = \ and the outer closing " at closingQ closes the value early
    // This means the value contains a raw `\"` pair (inner double-quote)
    let positions = [];
    // Check inside vc
    for (let i = 0; i < vc.length - 1; i++) {
      if (vc[i] === '\\' && vc[i+1] === '"') positions.push(i);
    }
    // Boundary case: vc[last] = \ and closingQ points to " — means the raw pair is IN the value
    if (vc.length > 0 && vc[vc.length-1] === '\\' && line[closingQ] === '"') {
      // vc has `\` at end and the quoting " closes it early
      // The pair `\" is in the value so the value closes at `\" ` nv";
      j2 += 2;
      reps++;
    } else { nv += vc[j2]; j2++; }
  }
  
  if (reps === 0) { newLines.push(line); continue; }
  newLines.push(line.substring(0, valStart) + nv + line.substring(closingQ));
  fileReplacements += reps;
}

console.log(`  ${f}:${li+1} -> ${reps} fix`);
newLines.push(line.substring(0, valStart) + nv + line.substring(closingQ));
fileReplacements += reps;
}
}
}

if (fileReplacements > 0) {
  fs.writeFileSync(path, newLines.join('\n'), 'utf8');
}
}
}

console.log('Total:', filesFixed, 'files,', totalReplacements, 'replacements');
