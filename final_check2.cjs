const fs = require('fs');
const { execSync } = require('child_process');

const FILES = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

for (const p of FILES) {
  const c = fs.readFileSync(p, 'utf8');

  // 1. Syntax check
  let synOk = false;
  try {
    execSync(`node --check "${p}"`, { stdio: 'pipe' });
    synOk = true;
  } catch(e) {
    synOk = false;
  }
  console.log(`\n${p}: syntax ${synOk ? 'OK' : 'FAIL'}`);

  // 2. Scan for remaining raw " inside SVG blobs
  const lines = c.split('\n');
  let errorLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const svgIdx = line.indexOf('data:image/svg+xml,');
    if (svgIdx === -1) continue;
    // Find end of blob, count bare " between svg start and </svg>
    const blobEnd = line.indexOf('</svg>', svgIdx);
    if (blobEnd < 0) continue;
    // Check for bare " inside
    let bareQuotes = 0;
    for (let j = svgIdx; j < blobEnd; j++) {
      if (line[j] === '"') bareQuotes++;
    }
    // The only " inside should be the character '\" which is an escaped "
    // But raw " is 0x22. Let me check differently:
    // An SVG attr " would have a `char at pos` that is raw 34.
    // In JS file: SVG `"Foo"` inside `"..."` outer string -> outer string breaks at first `"`.
    // BUT `\"Foo\"` is also bad because Vite sees the \" as \" leaving `Foo"` dangling.
    // Let's just check for bare U+0022 inside
    
    // Check by looking for pattern like attr="value where '=' is followed by "
    if (bareQuotes > 0) {
      errorLines.push({ line: i + 1, bareQuotes });
    }
  }

  if (errorLines.length === 0) {
    console.log('  SVG blobs: all clean');
  } else {
    console.log(`  SVG blobs with issues: ${errorLines.length}`);
    errorLines.slice(0, 5).forEach(el => console.log(`    line ${el.line}: ${el.bareQuotes} raw double-quotes`));
  }
}
