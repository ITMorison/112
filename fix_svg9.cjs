const fs = require('fs');

const files = [
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

for (const p of files) {
  let c = fs.readFileSync(p, 'utf8');
  const idx = c.indexOf('data:image/svg+xml,');
  console.log(`\n=== ${p} BEFORE ===`);
  console.log(c.substring(idx, idx+300));
  
  // Replace each SVG data URL blob entirely
  c = c.replace(/"image":\s*"data:image\/svg\+xml,([^"]+)"/g, (full, svg) => {
    let s = svg;
    // Step 1: collapse \\"  → '  (backslash-backslash-double-quote sequence)
    s = s.replace(/\\\\"/g, "'");
    // Step 2: collapse \\'  → '  (backslash-backslash-single-quote sequence)
    s = s.replace(/\\\\'/g, "'");
    // Step 3: collapse remaining \"  → '  (backslash-double-quote)
    s = s.replace(/\\"/g, "'");
    // Step 4: collapse remaining \'  → '  (backslash-single-quote)
    s = s.replace(/\\'/g, "'");
    // Step 5: any remaining bare " → '
    s = s.replace(/([^'])"([^']*?)"/g, "$1'$2'");
    s = s.replace(/([^'])"/g, "$1'");  // stray opening "
    s = s.replace(/"([^'])/g, "'$1");  // stray closing "
    console.log('  SVG chars after fix:', JSON.stringify(s.substring(0,100)));
    return `"image": "data:image/svg+xml,${s}"`;
  });
  
  fs.writeFileSync(p, c, 'utf8');
  
  const idx2 = c.indexOf('data:image/svg+xml,');
  console.log(`=== ${p} AFTER ===`);
  console.log(c.substring(idx2, idx2+300));
}
