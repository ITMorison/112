const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const lines = fs.readFileSync(f, 'utf8').split('\n');
const line25 = lines[24];
const imgIdx = line25.indexOf('"image"');
const colonIdx = line25.indexOf(':', imgIdx);
const valQ = line25.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;
let be = 0, closingQ = -1;
for (let j = valStart; j < Math.min(line25.length, 100); j++) {
  if (line25[j] === '\\') {be++; continue;}
  if (line25[j] === '"') { if (be%2===0) {closingQ = j; break;} be=0; continue; }
  be = 0;
}
const vc = line25.substring(valStart, closingQ);
console.log('line25.length:', line25.length);
console.log('valStart:', valStart, 'closingQ:', closingQ, 'closingQ - valStart:', closingQ-valStart);

console.log('lines 79-85 of line25');
for (let i = 79; i < 86; i++) {
  console.log(`  line25[${i}]: ${JSON.stringify(line25[i])} U+${line25.charCodeAt(i).toString('16').padStart(4,'0')}`);
}

console.log('\nvc[64..67] = line[line25.length - ??]:');
for (let i = Math.max(0, Math.min(vc.length-5, 64)); i < Math.min(vc.length, 70); i++) {
  console.log(`  vc[${i}]: ${JSON.stringify(vc[i])} U+${vc.charCodeAt(i).toString('16').padStart(4,'0')}`);
}

console.log('\nline25[69..73]');
for (let i = 69; i < 74; i++) {
  if (i < line25.length) console.log(`  [${i}]: ${JSON.stringify(line25[i])} U+${line25.charCodeAt(i).toString('16').padStart(4,'0')}`);
}

// Let me find a position in vc that I can use as a reference to map vc[idx] -> line25[linePos]
console.log('\nReference: vc[0] = line[' + valStart + '] = ' + JSON.stringify(line25[valStart]) + ' => matches');for (let i = 0; i < 5; i++) {
  console.log(`  vc[${i}] = line[${valStart + i}]: ${JSON.stringify(line25[valStart+i])}`);
}
