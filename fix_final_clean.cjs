// fix_boundary.cjs - fix the boundary case where vc ends with `\` and line[closingQ] = `"`
// This means the closing " is inside the value content, creating an inner `\"`  
const fs = require('fs');
const dir = 'src/data/';

let filesFixed = 0, totalReplacements = 0;

for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
  const path = dir + f;
  const raw = fs.readFileSync(path, 'utf8');
  if (!raw.includes('"image"') || !raw.includes('svg+xml,')) continue;

  const lines = raw.split('\n');
  let changed = false;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) continue;

    // 3rd " = value opening
    let q = 0, valStart = -1;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') { q++; if (q === 3) { valStart = j + 1; break; } }
    }
    if (valStart < 0) continue;

    // Unescaped closing " of outer JS string
    let be = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') {be++; continue;}
      if (line[j] === '"') { if (be%2===0) {closingQ=j; break;} be=0; }
    }
    if (closingQ < 0) continue;

    const vc = line.substring(valStart, closingQ);

    // Only fix when there's a boundary issue:
    // 1. vc ends with `\` (second-to-last escape) and line[closingQ] = " (the closing quote also
    //    closes the inner `\"` pair), creating an unclosed inner quote
    // 2. There's a `\"` or `\\" pattern INSIDE vc

    // Count `\"` pairs INSIDE vc
    let innerCount = 0;
    for (let i = 0; i < vc.length - 1; i++) {
      if (vc[i] === '\\' && vc[i+1] === '"') innerCount++;
    }

    // Boundary case: `\` at end of vc + `"` at closingQ
    const boundaryIssue = vc.length > 0 && vc[vc.length-1] === '\\' && line[closingQ] === '"';
    if (innerCount === 0 && !boundaryIssue) continue;

    // Do the replacement
    let nv = '';
    let reps = 0;
    for (let i = 0; i < vc.length; i++) {
      // Check if this `\` is followed by `"` (inside vc)
      if (i + 1 < vc.length && vc[i] === '\\' && vc[i+1] === '"') {
        nv += String.fromCharCode(0x5c, 0x27); // \ + '
        i++; // skip the "
        reps++;
      } else {
        nv += vc[i];
      }
    }

    if (boundaryIssue) {
      // Replace the closing " at line[closingQ] with '
      lines[li] = line.substring(0, valStart) + nv + "'" + line.substring(closingQ + 1);
    } else {
      lines[li] = line.substring(0, valStart) + nv + line.substring(closingQ);
    }

    if (reps > 0 || boundaryIssue) {
      changed = true;
      totalReplacements += Math.max(reps, boundaryIssue ? 1 : 0);
    }
  }

  if (changed) {
    fs.writeFileSync(path, lines.join('\n'), 'utf8');
    filesFixed++;
    console.log('Fixed: ' + f);
  }
}

console.log('Done!', filesFixed, 'files fixed,', totalReplacements, 'total replacements.');
