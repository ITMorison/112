const fs = require('fs');
const dir = 'src/data/';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const broken = [];

for (const f of files) {
  const content = fs.readFileSync(dir + f, 'utf8');
  if (!content.includes('"image"') || !content.includes('svg+xml')) continue;

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const imgIdx = line.indexOf('"image"');
    if (imgIdx === -1) continue;

    const contentStart = line.indexOf('"', line.indexOf('"', line.indexOf('"') + 1) + 1) + 1;
    if (contentStart < 1) continue;

    let escapeCount = 0;
    for (let j = contentStart; j < line.length; j++) {
      const ch = line[j];
      if (ch === '\\') { escapeCount++; continue; }
      if (ch === '"') {
        if (escapeCount % 2 === 0 && !line.substring(j-1, j+2).includes('</svg>')) {
          console.log(`${f}:${i+1} unescaped " at col ${j}, context: ${JSON.stringify(line.substring(Math.max(0,j-15), j+10))}`);
          broken.push(f);
          break;
        }
      }
      escapeCount = 0;
    }
    if (broken.includes(f)) break;
  }
}
console.log(`\n==> ${broken.length} total broken files`);
