// fix_svgs_final.cjs
const fs = require('fs');
const dir = 'src/data/';

function tryFixFile(f) {
  const path = dir + f;
  const raw = fs.readFileSync(path, 'utf8');
  if (!raw.includes('"image"') || !raw.includes('svg+xml,')) return 0;

  const lines = raw.split('\n');
  let newLines = lines.slice();
  let totalFixed = 0;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) continue;

    // Find all " positions starting from the first occurrence of "image
    const imgIdx = line.indexOf('"image"');
    let count = 0;
    const positions = [];
    for (let j = imgIdx < 0 ? 0 : imgIdx; j < line.length; j++) {
      if (line[j] === '"') {positions.push(j); count++; if(count===4) break;}
    }
    const qPositions = positions;
    if (qPositions.length < 3) continue;

    // q[0] = opening " of "image", q[1] = closing " of "image"
    // q[2] = opening " of value, q[3] = closing " of value
    const valQ = qPositions[2];
    const valStart = valQ + 1;

    // Scan for closing " with even number of preceding \
    let be = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      const ch = line[j];
      if (ch === '\\') {be++; continue;}
      if (ch === '"') {
        if (be % 2 === 0) {closingQ = j; break;}
      }
      be = 0;
    }
    if (closingQ < 0) continue;

    const valContent = line.substring(valStart, closingQ);

    // Count occurrences of \" in valContent: two chars, one \, one ")
    let fixCount = 0;
    for (let j = 0; j < valContent.length - 1; j++) {
      if (valContent[j] === '\\' && valContent[j + 1] === '"') fixCount++;
    }
    if (fixCount === 0) continue;

    // Do the char-by-char replacement
    let newVal = '';
    let j = 0;
    while (j < valContent.length) {
      if (j + 1 < valContent.length && valContent[j] === '\\' && valContent[j + 1] === '"') {
        // Replace "\" -> "\'"
        newVal += "\\'";
        j += 2;
      } else {
        newVal += valContent[j];
        j++;
      }
    }

    // Check: did we actually change something?
    if (newVal === valContent) {
      console.log(`WARNING: no change on ${closingQ - valStart} chars in ${f}:${li+1}`);
      continue;
    }

    newLines[li] = line.substring(0, valStart) + newVal + line.substring(closingQ);
    totalFixed += fixCount;
    console.log(`  ${f}:${li+1} replaced ${fixCount} occurrences`);
  }

  if (totalFixed > 0) {
    fs.writeFileSync(path, newLines.join('\n'), 'utf8');
    return totalFixed;
  }
  return 0;
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let filesFixed = 0;
let totalReplacements = 0;

for (const f of files) {
  const n = tryFixFile(f);
  if (n > 0) { filesFixed++; totalReplacements += n; }
}

console.log(`\nFixed ${filesFixed} files, ${totalReplacements} total quote replacements.`);
