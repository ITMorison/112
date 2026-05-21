const fs = require('fs');
const dir = 'src/data/';

// Read raw bytes of all 6 Vite-erroring files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
for (const f of files) {
  const lines = fs.readFileSync(dir + f, 'utf8').split('\n');
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) continue;

    // Find 3rd " as value opening
    let q = 0, valStart = -1;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') { q++; if (q === 3) { valStart = j + 1; break; } }
    }
    if (valStart < 0) continue;

    // Find unescaped closing " of outer JS value
    let be = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') {be++; continue;}
      if (line[j] === '"') { if (be%2===0) {closingQ=j; break;} be=0; }
    }
    if (closingQ < 0) continue;

    console.log(`${f}:${li+1}:`);
    console.log(`  valStart=${valStart} closingQ=${closingQ}`);
    // Show the characters at valStart + 60 to closingQ
    for (let i = Math.max(0, 60); i < Math.min(closingQ - valStart, 75); i++) {
      console.log(`  vc[${i}]=${JSON.stringify(line.charAt(valStart + i))}`);
    }
    break; // only first occurrence per file
  }
}
