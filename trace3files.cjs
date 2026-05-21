const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const lines = fs.readFileSync(f, 'utf8').split('\n');
const line13 = lines[12];
const imgIdx = line13.indexOf('"image"');
const colonIdx = line13.indexOf(':', imgIdx);
const valQ = line13.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;
let be = 0, closingQ = -1;
for (let j = valStart; j < line13.length; j++) {
  if (line13[j] === '\\') {be++; continue;}
  if (line13[j] === '"') { if (be%2===0) {closingQ=j; break;} be=0; }
}
const vc = line13.substring(valStart, closingQ);
console.log('line13 closingQ:', closingQ, 'vc.len:', vc.length);
for (let i = Math.max(0, vc.length-10); i < vc.length; i++) {
  console.log(`  [${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString(16).padStart(4,'0')}`);
}

// Also check ip-telefon line 25
const f2 = 'src/data/ip-telefony.js';
const lines2 = fs.readFileSync(f2, 'utf8').split('\n');
const line25_2 = lines2[24];
const imgIdx2 = line25_2.indexOf('"image"');
const colon2 = line25_2.indexOf(':', imgIdx2);
const valQ2 = line25_2.indexOf('"', colon2 + 1);
const valStart2 = valQ2 + 1;
let be2 = 0, closingQ2 = -1;
for (let j = valStart2; j < Math.min(line25_2.length, 200); j++) {
  if (line25_2[j] === '\\') {be2++; continue;}
  if (line25_2[j] === '"' && be2%2===0) {closingQ2=j; break;}
  be2 = 0;
}
const vc2 = line25_2.substring(valStart2, closingQ2);
console.log('\nip-telefon line 25:');
console.log('closingQ2:', closingQ2, 'vc2.len:', vc2.length);
for (let i = Math.max(0, vc2.length-10); i < vc2.length; i++) {
  console.log(`  [${i}]: ${JSON.stringify(vc2[i])} U+${vc2.charCodeAt(i).toString(16).padStart(4,'0')}`);
}

// Also check ip-ats line 13 and 25
const f3 = 'src/data/ip-ats-i-shlyuzy.js';
const lines3 = fs.readFileSync(f3, 'utf8').split('\n');
[12, 24].forEach(li => {
  const line = lines3[li];
  const mi = line.indexOf('"image"');
  if (mi < 0) return;
  const ci = line.indexOf(':', mi);
  const vq = line.indexOf('"', ci + 1);
  const vs = vq + 1;
  let be3 = 0, cq3 = -1;
  for (let j = vs; j < Math.min(line.length, 200); j++) {
    if (line[j] === '\\') {be3++; continue;}
    if (line[j] === '"' && be3%2===0) {cq3=j; break;}
    be3 = 0;
  }
  const vc3 = line.substring(vs, cq3);
  console.log(`\nip-ats line ${li+1}: closing=${cq3} len=${vc3.length}`);
  for (let i = Math.max(0, vc3.length-10); i < vc3.length; i++) {
    console.log(`  [${i}]: ${JSON.stringify(vc3[i])} U+${vc3.charCodeAt(i).toString(16).padStart(4,'0')}`);
  }
});
