const fs = require('fs');
const PARAMS = [
  { file: 'src/data/mesh-системы.js',       label: 'mesh-системы.js' },
  { file: 'src/data/ip-telefony.js',         label: 'ip-telefony.js' },
  { file: 'src/data/ip-ats-i-shlyuzy.js',   label: 'ip-ats-i-shlyuzy.js' },
  { file: 'src/data/poe-адаптеры.js',       label: 'poe-адаптеры.js' },
  { file: 'src/data/neupravlyaemye-soho-poe.js', label: 'neypravlyaemye-soho-poe.js' },
];

for (const p of PARAMS) {
  const c = fs.readFileSync(p.file, 'utf8');
  const lines = c.split('\n');
  
  // Syntax check via node
  try {
    require('child_process').execSync(`node --check "${p.file}"`, { stdio: 'pipe' });
    const syntaxOk = true;
  } catch(e) {
    console.log(`${p.label}: SYNTAX STILL FAILS`);
    // Show where it fails
    const msg = e.message;
    console.log(msg.substring(0, 200));
    continue;
  }
  
  // Scan ALL lines for any remaining raw " inside SVG data URLs
  let badLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes('data:image/svg+xml,')) continue;
    const idx = line.indexOf('data:image/svg+xml,');
    // Look for raw " inside the data URL blob (not counting the outer string delimiter)
    const quotes = [];
    for (let j = idx; j < Math.min(idx + 310, line.length); j++) {
      if (line[j] === '"') quotes.push(j);
    }
    // Expect exactly 2 raw ": one opening, one closing the JS string
    if (quotes.length > 2) {
      badLines.push({ line: i + 1, count: quotes.length });
    }
  }
  
  if (badLines.length === 0) {
    console.log(`${p.label}: SYNTAX OK, all SVG blobs clean`);
  } else {
    console.log(`${p.label}: SVG blobs with raw " : ${badLines.length}`);
    badLines.slice(0, 3).forEach(b => console.log(`  line ${b.line}: ${b.count} bare quotes`));
  }
}
