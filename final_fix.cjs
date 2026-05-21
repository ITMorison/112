// final_fix_svgs.cjs
// Read src/data/*.js, find "image" values containing svg+xml,
// and fix every \" inside the value (replace with \\')
const fs = require('fs');
const dir = 'src/data/';
let fixedCount = 0;

function fixFile(f) {
  const path = dir + f;
  const raw = fs.readFileSync(path, 'utf8');
  if (!raw.includes('"image"') || !raw.includes('svg+xml,')) return 0;

  const lines = raw.split('\n');
  let newLines = [];
  let replacementsTotal = 0;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) {
      newLines.push(line);
      continue;
    }

    // Find the third double-quote in the line = opening " of the image value
    // First two " = "image", third " = opening of value
    let quoteCount = 0, valStart = -1;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') { quoteCount++; if (quoteCount === 3) { valStart = j + 1; break; } }
    }
    if (valStart < 0) { newLines.push(line); continue; }

    // Find the closing " of the outer JS value string (unescaped)
    let be = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') { be++; continue; }
      if (line[j] === '"' && be % 2 === 0) { closingQ = j; break; }
      be = 0;
    }
    if (closingQ < 0) { newLines.push(line); continue; }

    const vc = line.substring(valStart, closingQ);
    // Count total \" patterns in vc (single \ then ")
    let totalQuotes = 0;
    for (let i = 0; i < vc.length - 1; i++) {
      if (vc[i] === '\\' && vc[i+1] === '"') totalQuotes++;
    }
    if (totalQuotes === 0) { newLines.push(line); continue; }

    // Do the char-by-char replacement
    let nv = '';
    let i = 0;
    let reps = 0;
    while (i < vc.length) {
      if (i + 1 < vc.length && vc[i] === '\\' && vc[i+1] === '"') {
        nv += String.fromCharCode(0x5c, 0x27);  // \ + '
        i += 2;
        reps++;
      } else {
        nv += vc[i];
        i++;
      }
    }

    if (reps === 0) { newLines.push(line); continue; } // no-op (edge case)
    newLines.push(line.substring(0, valStart) + nv + line.substring(closingQ));
    replacementsTotal += reps;
    if (Math.random() < 0.05) console.log(`  ${f}:${li+1} replaced ${reps} quotes`);  // sample output
  }

  if (replacementsTotal > 0) {
    fs.writeFileSync(path, newLines.join('\n'), 'utf8');
    return replacementsTotal;
  }
  return 0;
}

const allFiles = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let fixedFiles = 0, totalReplaced = 0;

for (const file of allFiles) {
  const n = fixFile(file);
  if (n > 0) { fixedFiles++; totalReplaced += n; }
}

console.log(`\nFixed ${fixedFiles} files, replaced ${totalReplaced} total quote occurrences.`);
console.log('Files fixed:', fixedFiles);
