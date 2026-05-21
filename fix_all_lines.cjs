// fix_all_lines.cjs - fix EVERY image/SVG line in every affected file
const fs = require('fs');
const dir = 'src/data/';

function fixFile(f) {
  const path = dir + f;
  const raw = fs.readFileSync(path, 'utf8');
  if (!raw.includes('"image"') || !raw.includes('svg+xml,')) return 0;

  const lines = raw.split('\n');
  let newLines = [];
  let totalFixed = 0;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) { newLines.push(line); continue; }

    // Find the 3rd " in the line = opening " of the value
    let q = 0, valStart = -1;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') { q++; if (q === 3) { valStart = j + 1; break; } }
    }
    if (valStart < 0) { newLines.push(line); continue; }

    // Unescaped closing " of value
    let be = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') {be++; continue;}
      if (line[j] === '"') { if (be%2===0) {closingQ=j; break;} }
      be = 0;
    }
    if (closingQ < 0) { newLines.push(line); continue; }

    const vc = line.substring(valStart, closingQ);

    // Count \" occurrences in value
    let pCount = 0;
    for (let i = 0; i < vc.length - 1; i++) {
      if (vc[i] === '\\' && vc[i+1] === '"') pCount++;
    }
    if (pCount === 0) { newLines.push(line); continue; }

    // Replace each \" with \'
    let nv = '', j2 = 0, reps = 0;
    while (j2 < vc.length) {
      if (j2 + 1 < vc.length && vc[j2] === '\\' && vc[j2+1] === '"') {
        nv += String.fromCharCode(0x5c, 0x27); // \'
        j2 += 2;
        reps++;
      } else {
        nv += vc[j2];
        j2++;
      }
    }

    newLines.push(line.substring(0, valStart) + nv + line.substring(closingQ));
    totalFixed += reps;
    console.log(`  FIXED: ${f}:${li+1} -> ${reps} occurrences`);
  }

  if (totalFixed > 0) {
    fs.writeFileSync(path, newLines.join('\n'), 'utf8');
    return totalFixed;
  }
  return 0;
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let filesFixed = 0, totalReplacements = 0;

for (const file of files) {
  const n = fixFile(file);
  if (n > 0) { filesFixed++; totalReplacements += n; }
}

console.log(`\nDone: ${filesFixed} files, ${totalReplacements} total replacements.`);
