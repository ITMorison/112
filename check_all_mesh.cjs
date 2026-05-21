const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const lines = fs.readFileSync(f, 'utf8').split('\n');

// Process ALL lines of the file
for (let li = 0; li < lines.length; li++) {
  const line = lines[li];
  if (!line.includes('"image"') || !line.includes('svg+xml')) continue;

  // Find val start and closing
  let q = 0, valStart = -1;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '"') { q++; if (q === 3) { valStart = j + 1; break; } }
  }
  if (valStart < 0) continue;

  let be = 0, closingQ = -1;
  for (let j = valStart; j < line.length; j++) {
    if (line[j] === '\\') {be++; continue;}
    if (line[j] === '"') { if (be%2===0) {closingQ=j; break;} }
    be = 0;
  }
  if (closingQ < 0) continue;

  const vc = line.substring(valStart, closingQ);

  // Check for backslash-pattern (not already fixed)
  let hasUnfixed = false;
  for (let i = 0; i < vc.length - 1; i++) {
    if (vc[i] === '\\' && vc[i+1] === '"') {
      console.log(`Line ${li+1}: UNFIXED \" at vc[${i}]`);
      hasUnfixed = true;
    }
  }
  if (!hasUnfixed) {
    console.log(`Line ${li+1}: ALREADY OK`);
    // Show vc[end chars] to see what's there
    for (let i = Math.max(0, vc.length-5); i < vc.length; i++) {
      console.log(`  vc[${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString(16)}`);
    }
  }
}
