const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const line25 = fs.readFileSync(f, 'utf8').split('\n')[24];
const imgIdx = line25.indexOf('"image"');
const colonIdx = line25.indexOf(':', imgIdx);
const valQ = line25.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;

// Trace for unescaped " ALL the way (not stopping at first one)
let k = 0;
for (let j = valStart; j < Math.min(line25.length, 600); j++) {
  if (line25[j] === '\\') { k++; console.log(`k=1 at pos ${j} (\\ char)`); continue; }
  if (line25[j] === '"') {
    if (k % 2 === 0) { console.log(`POSSIBLE closing at ${j}, k=${k}`); }
    else { console.log(`Escaped " at ${j}, k=${k}`); }
    if (k % 2 === 0) { console.log(`FINAL closing at: ${j}`); break; }
  }
  k = 0;
}
