const fs = require('fs');

const files = [
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

for (const p of files) {
  let c = fs.readFileSync(p, 'utf8');
  const idx = c.indexOf('data:image/svg+xml,');
  const before = JSON.stringify(c.substring(idx, idx+400));
  console.log(`\n=== ${p} ===`);
  console.log('BEFORE:', before.substring(0, 150));
  
  // The exact byte sequences found in files (confirmed by code=92 for backslash):
  // w  i  d  t  h  =  \  \  '  4  0  0  \  \  '
  // That's: width= \\ ' 400 \\ '  (2 backslashes + single quote on each side)
  
  // Direct replacement: those byte sequences → single quotes
  c = c.replace(/width=\\'400\\'/g, "width='400'");
  c = c.replace(/height=\\"300\\"/g, "height='300'");  // parsed earlier as right
  // But to be safe, also handle all possible variations:
  
  // After the first pass, check what's left
  const remainingidx = c.indexOf('data:image/svg+xml,');
  const afterCheck = JSON.stringify(c.substring(remainingidx, remainingidx+400));
  console.log('AFTER first pass:', afterCheck.substring(0, 150));
  
  // Second pass - any remaining escapes before ' 
  c = c.replace(/\\'/g, "'");
  
  // Any remaining escaped "
  c = c.replace(/\\"/g, "'");
  
  // Also fix stand-alone " in SVG
  c = c.replace(/(\s)\w+="([^"]+?)"/g, "$1$2='$3'");
  
  fs.writeFileSync(p, c, 'utf8');
  console.log('FINAL:', JSON.stringify(c.substring(remainingidx, remainingidx+200)));
}
