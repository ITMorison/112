// SAFE FIX - only change the inner quotes, rest unchanged
const fs = require('fs');
const dir = 'src/data/';

function fixForSVG(f) {
  const path = dir + f;
  const raw = fs.readFileSync(path, 'utf8');
  if (!raw.includes('"image"') || !raw.includes('svg+xml,')) return 0;

  const lines = raw.split('\n');
  let changed = false;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) continue;

    // 3rd " = opening " of the value
    let q = 0, valStart = -1;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') { q++; if (q === 3) { valStart = j + 1; break; } }
    }
    if (valStart < 0) continue;

    // Find the unescaped closing " of the value
    let be = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') { be++; continue; }
      if (line[j] === '"' && be % 2 === 0) { closingQ = j; break; }
      be = 0;
    }
    if (closingQ < 0) continue;

    const vc = line.substring(valStart, closingQ);

    // Count `\"` inside vc: single \ followed by "
    let backslashCount = 0;
    for (let i = 0; i < vc.length - 1; i++) {
      if (vc[i] === '\\' && vc[i + 1] === '"') { backslashCount++; }
    }

    if (backslashCount === 0) continue;

    // Do the replacement
    // Inside vc, \" -> \'
    let nv = '';
    for (let i = 0; i < vc.length; i++) {
      if (i + 1 < vc.length && vc[i] === '\\' && vc[i + 1] === '"') {
        // Write \ followed by YIELD the single-quote
        nv = nv + String.fromCharCode(0x5c, 0x27);
        i++; // skip the "
      } else {
        nv = nv + vc[i];
      }
    }

    // Replace line[closingQ] with " if present
    lines[li] = line.substring(0, valStart) + nv + (line.substring(closingQ + 1) || '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(path, lines.join('\n'), 'utf8');
    return 1;
  }
  return 0;
}

const allFiles = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let done = 0;
for (const f of allFiles) {
  if (fixForSVG(f)) {
    done++;
    console.log('Fixed: ' + f);
  }
}
console.log('Total fixed: ' + done);
