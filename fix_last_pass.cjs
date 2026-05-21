const fs = require('fs');

// ALL files that have the "width=\"400\"" pattern in line 13 (and elsewhere)
const FILES = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js',
  'src/data/upravlyaemye-soho-poe.js',
];

let totalBlobs = 0;

for (const p of FILES) {
  let c = fs.readFileSync(p, 'utf8');
  const beforeCount = (c.match(/width=\\"(\d+)\\"/g) || []).length;

  // Fix all "image": "data:image/svg+xml,<svg ...>" blobs
  let changed = 0;
  const result = c.replace(/"image":\s*"data:image\/svg\+xml,([\s\S]+?)">/g, (full, svg) => {
    let s = svg;
    s = s.replace(/"(\d+)"/g, "'$1'");            // width="400" → width='400'
    s = s.replace(/"([^"]+?)"/g, "'$1'");          // any other attr="..."
    s = s.replace(/\\"/g, "'");                     // escaped \" → '
    s = s.replace(/\\'/g, "'");                     // escaped \' → '
    changed++;
    return `"image": "data:image/svg+xml,${s}"`;
  });

  fs.writeFileSync(p, result, 'utf8');

  // Also fix any remaining \\" in the blob that are now outside the replaced sections
  // (they were outside the quotes match)
  const after = fs.readFileSync(p, 'utf8');
  const remaining = (after.match(/\\"/g) || []).length;
  console.log(`${p}: ${changed} blob(s) replaced, remaining \\" : ${remaining}`);
  totalBlobs += changed;
}

console.log(`\nTotal blobs fixed: ${totalBlobs}`);

// Quick syntax check
console.log('\n=== SYNTAX CHECK ===');
import('child_process').then(({ execSync }) => {
  for (const p of FILES) {
    try {
      execSync(`node --check "${p}"`, { stdio: 'pipe' });
      console.log(p + ': OK');
    } catch(e) {
      const msg = e.message;
      const lineMatch = msg.match(/:(\d+):/);
      const lineNum = lineMatch ? lineMatch[1] : '?';
      console.log(p + ': FAIL at line ' + lineNum + ` — ${msg.substring(0,150).replace(/\n/g,' ')}`);
    }
  }
});
