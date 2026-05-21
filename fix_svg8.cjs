const fs = require('fs');

const files = [
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

for (const p of files) {
  let c = fs.readFileSync(p, 'utf8');
  const idx = c.indexOf('data:image/svg+xml,');
  const before = c.substring(idx, idx + 350);
  console.log(`\n=== ${p} BEFORE ===`);
  console.log(before.substring(0, 200));
  
  // Fix specifically for the \\'400\\' and \\"400\\" patterns
  // In the file raw: backslash(92) backslash(92) single(39) OR backslash(92) backslash(92) double(34)
  // These come from a Python str.replace that doubled the backslashes
  
  // Replace \\\\'400\\\\'  →  '400'  (remove extra \\)
  c = c.replace(/width=\\\\\\'(\d+)\\\\\'/g, "width='$1'");  // width=\\'400\\'  → width='400'
  c = c.replace(/height=\\\\\'(\d+)\\\\\'/g, "height='$1'");
  c = c.replace(/height=\\\\\"(\d+)\\\\\"/g, "height='$1'");  // height=\\"300\\"  → height='300'
  c = c.replace(/width=\\\\\"(\d+)\\\\\"/g, "width='$1'");
  c = c.replace(/fill=\\\\\"([^"]*)\\\\\"/g, "fill='$1'");
  // Also fix text-anchor, dominant-baseline, x, y etc. if they have this pattern
  c = c.replace(/=\\\\\\"(\d+)\\\\\\"/g, "='$1'");
  c = c.replace(/=\"(\d+)\"/g, "='$1'");    // x="200" → x='200'
  c = c.replace(/=\"([^\"]+)\"/g, "='$1'"); // any other attr="..."
  
  // Fix x=\\' and y=\\' too
  c = c.replace(/ x=\\\\'(\d+)\\\\'/g, " x='$1'");
  c = c.replace(/ y=\\\\'(\d+)\\\\'/g, " y='$1'");
  c = c.replace(/ x=\\\\\"(\d+)\\\\\"/g, " x='$1'");
  c = c.replace(/ y=\\\\\"(\d+)\\\\\"/g, " y='$1'");

  fs.writeFileSync(p, c, 'utf8');
  
  const afterIdx = c.indexOf('data:image/svg+xml,');
  console.log(`=== ${p} AFTER ===`);
  console.log(c.substring(afterIdx, afterIdx + 200));
}
