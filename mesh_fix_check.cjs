const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const content = fs.readFileSync(f, 'utf8');
const lines = content.split('\n');

for (let li = 0; li < Math.min(lines.length, 35); li++) {
  const line = lines[li];
  if (!line.includes('"image"') || !line.includes('svg+xml')) continue;

  const imgIdx = line.indexOf('"image"');
  const colonIdx = line.indexOf(':', imgIdx);
  const valQ = line.indexOf('"', colonIdx + 1);
  const valStart = valQ + 1;

  let be = 0, closingQ = -1;
  for (let j = valStart; j < line.length; j++) {
    if (line[j] === '\\') {be++; continue;}
    if (line[j] === '"') { if (be%2===0) {closingQ=j; break;} }
    be=0;
  }

  if (closingQ < 0) continue;
  const vc = line.substring(valStart, closingQ);
  
  console.log(`Line ${li+1}: valStart=${valStart} closing=${closingQ} vcLen=${vc.length}`);
  
  // Show positions 60 to end
  for (let i = 60; i < vc.length; i++) {
    console.log(`  vc[${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString(16)}`);
  }
  
  // Now do the replacement
  let nv = '', j = 0, reps = 0;
  while (j < vc.length) {
    if (j + 1 < vc.length && vc[j] === '\\' && vc[j+1] === '"') {
      nv += String.fromCharCode(0x5c, 0x27);
      j += 2; reps++;
    } else { nv += vc[j]; j++; }
  }
  console.log(`Replacements: ${reps}`);
  if (reps > 0) {
    const afterFix = line.substring(0, valStart) + nv + line.substring(closingQ);
    console.log('After fix tail:', JSON.stringify(afterFix.substring(closingQ-10, Math.min(closingQ+20, afterFix.length))));
  }
  break;
}
