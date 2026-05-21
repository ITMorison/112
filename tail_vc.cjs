const fs = require('fs');

// Quick check: print char codes at end of vc for one mesh line
const f = 'src/data/mesh-системы.js';
const lines = fs.readFileSync(f, 'utf8').split('\n');

for (let li = 0; li < lines.length; li++) {
  if (!lines[li].includes('"image"')) continue;
  
  // Find val start
  let q = 0, valStart = -1;
  for (let j = 0; j < lines[li].length; j++) {
    if (lines[li][j] === '"') {q++; if (q===3) {valStart=j+1; break;}}
  }
  if (valStart < 0) continue;

  // Find closing
  let be = 0, closingQ = -1;
  for (let j = valStart; j < lines[li].length; j++) {
    if (lines[li][j] === '\\') {be++; continue;}
    if (lines[li][j] === '"' && be%2===0) {closingQ=j; break;}
    be = 0;
  }
  if (closingQ < 0) continue;

  const vc = lines[li].substring(valStart, closingQ);
  
  // Show from valStart+60 to end of vc
  for (let i = Math.max(0, vc.length-10); i < vc.length; i++) {
    console.log(`vc[${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString(16).padStart(4,'0')}`);
  }
  console.log('---');
  break; // just first line
}
