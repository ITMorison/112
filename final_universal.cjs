// FINAL comprehensive fix based on ALL data gathered
const fs = require('fs');
const dir = 'src/data/';

let filesFixed = 0;

for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
  const raw = fs.readFileSync(dir + f, 'utf8');
  if (!raw.includes('"image"') || !raw.includes('svg+xml,')) continue;

  let changed = false;
  const newRaw = raw
    // Put newlines back after separating by them to preserve original line endings
    .split('\n')
    .map(line => {
      if (!line.includes('"image"') || !line.includes('svg+xml,')) return line;

      // Find 3rd " = opening "
      let q = 0, valStart = -1;
      for (let j = 0; j < line.length; j++) {
        if (line[j] === '"') { q++; if (q === 3) { valStart = j + 1; break; } }
      }
      if (valStart < 0) return line;

      // Find unescaped closing " of outer string
      let be = 0, closingQ = -1;
      for (let j = valStart; j < line.length; j++) {
        if (line[j] === '\\') {be++; continue;}
        if (line[j] === '"') { if (be%2===0) {closingQ=j; break;} be=0; }
      }
      if (closingQ < 0) return line;

      const vc = line.substring(valStart, closingQ);
      if (vc.length === 0) return line;

      // Check for boundary issue
      // AND inner \" pairs:
      // - boundary: vc[last]===\\ and line[closingDocker]=" 
      // - inner: \\ followed by \\ (anywhere in @_@_vc)
      const lastCh = vc[vc.length - 1];
      const isBoundary = lastCh === '\\' && line[closingQ] === '"';

      // Count pairs: \\ followed by " inside vc
      let fixTotal = 0;
      for (let i = 0; i < vc.length - 1; i++) {
        if (vc[i] === '\\' && vc[i + 1] === '"') fixTotal++;
      }
      if (isBoundary) fixTotal++;

      if (fixTotal === 0) return line;

      // Do the replacement
      // Build replacement for vc
      let nv = '';
      for (let i = 0; i < vc.length; i++) {
        if (i + 1 < vc.length && vc[i] === '\\' && vc[i + 1] === '"') {
          nv += String.fromCharCode(0x5c, 0x27);
          i++;
        } else {
          nv += vc[i];
        }
      }

      if (isBoundary) {
        // vc[last] was \\, the string continued to line[closingQ]="
        // Replace that closing " with '
        return line.substring(0, valStart) + nv + "'" + line.substring(closingQ + 1);
      } else {
        return line.substring(0, valStart) + nv + line.substring(closingQ);
      }
    })
    .join('\n');

  // Changed detection: do bytes differ?
  if (newRaw !== raw) {
    changed = true;
    fs.writeFileSync(dir + f, newRaw, 'utf8');
    filesFixed++;
    console.log('Fixed: ' + f);
  }
}

console.log('\nDone! Fixed: ' + filesFixed + ' files.');
