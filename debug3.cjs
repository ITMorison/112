// debug_3.cjs - check 3 remaining broken files
const files = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
];
const dir = 'src/data/';

for (const f of files) {
  const content = fs.readFileSync(dir + f, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=== ${f} ===`);
  
  for (let i = 0; i < Math.min(lines.length, 35); i++) {
    const line = lines[i];
    if (!line.includes('"image"') || !line.includes('svg+xml')) continue;

    console.log(`Line ${i+1}:`);
    const imgIdx = line.indexOf('"image"');
    const colonIdx = line.indexOf(':', imgIdx);
    const valQ = line.indexOf('"', colonIdx + 1);
    const valStart = valQ + 1;

    // Find unescaped closing
    let k = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') {k++; continue;}
      if (line[j] === '"') {
        if (!(k % 2 === 0)) { // it's escaped
          console.log(`  -> at ${j}: escaped " (k=${k})`);
          k = 0; continue;
        }
        console.log(`  -> CLOSING at ${j}: k=${k} BEFORE:` + JSON.stringify(line.substring(valStart, j)));
        closingQ = j; break;
      }
      k = 0;
    }
    if (closingQ < 0) {
      console.log('  -> NO CLOSING FOUND');
      continue;
    }
    const vc = line.substring(valStart, closingQ);
    console.log(`valContent (60 chars):`, JSON.stringify(vc.substring(0, 60)));
    console.log(`valContent.includes('\\\\"'):`, vc.includes('\\"'));
    console.log(`valContent has \\\\`: `, vc.includes('\\\\'));
    console.log('Sample fix chars:');
    for (let j = 70; j < 95; j++) {
      if (j >= vc.length) break;
      console.log(`  [${j}]: ${JSON.stringify(vc[j])} U+${vc.charCodeAt(j).toString(16)}`);
    }
  }
}
