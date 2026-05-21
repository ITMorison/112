const fs = require('fs');

// poe-адаптеры.js: raw chars in SVG => ALL " become ' (except outside svg blob)
// ip-ats: \\' is \\ then ' ; \\" is \\ then "  — both become '
// neupravlyaemye: same pattern

// Simple and brutal: replace the exact wrong-byte sequences with right ones

// === poe-адаптеры.js ===
(function fixPoe() {
  const p = 'src/data/poe-адаптеры.js';
  let c = fs.readFileSync(p, 'utf8');
  // The broken sequence per raw inspect: width="400" → width='400'
  c = c.replace(/width="(\d+)"/g, "width='$1'");
  c = c.replace(/height="(\d+)"/g, "height='$1'");
  c = c.replace(/fill="([^"]*)"/g, "fill='$1'");
  c = c.replace(/ x="(\d+)"/g, " x='$1'");
  c = c.replace(/ y="(\d+)"/g, " y='$1'");
  c = c.replace(/text-anchor="([^"]*)"/g, "text-anchor='$1'");
  c = c.replace(/dominant-baseline="([^"]*)"/g, "dominant-baseline='$1'");
  c = c.replace(/font-family="([^"]*)"/g, "font-family='$1'");
  c = c.replace(/font-size="(\d+)"/g, "font-size='$1'");
  fs.writeFileSync(p, c, 'utf8');
  // verify
  const idx = c.indexOf('data:image/svg+xml,');
  console.log('poe line13 raw 30 chars:', JSON.stringify(c.substring(idx, idx+40)));
  console.log('poe OK:', !c.substring(idx, idx+40).includes('width=\"'));
})();

// === ip-ats-i-shlyuzy.js ===
(function fixIpat() {
  const p = 'src/data/ip-ats-i-shlyuzy.js';
  let c = fs.readFileSync(p, 'utf8');
  const idx0 = c.indexOf('data:image/svg+xml,');
  const snippet = c.substring(idx0, idx0 + 320);
  console.log('\nip-ats before snippet:', JSON.stringify(snippet.substring(0, 100)));
  
  // From raw byte dump:
  // attrs using \\'  → attribute opening: backslash double-quote then digits then backslash-double-quote
  // width=\\"400\\"  and height=\\"300\\"
  // fill="%23f1f5f9" width=\\"400\\" height=\\"300\\"
  // text-anchor="..." x="200" y="150" dominant-baseline="..." fill="%2364748b" font-family="..." font-size="16"
  
  // Replace \\" attr values first
  c = c.replace(/width=\\"(\d+)\\"/g, "width='$1'");
  c = c.replace(/height=\\"(\d+)\\"/g, "height='$1'");
  c = c.replace(/=\\"(\d+)\\"/g, "='$1'");
  c = c.replace(/fill=\\"([^"]*)\\"/g, "fill='$1'");
  
  // Replace \\' attr values (\\'400\\')
  c = c.replace(/width=\\'(\d+)\\'/g, "width='$1'");
  c = c.replace(/height=\\'(\d+)\\'/g, "height='$1'");
  c = c.replace(/=\\'(\d+)\\'/g, "='$1'");
  
  // Replace remaining plain " SVG attrs
  c = c.replace(/"(\d+)"/g, "'$1'");
  c = c.replace(/"([^"]+)"/g, "'$1'");
  
  // Cleanup: remove stray backslashes that were part of the escaping
  // \\' sequences in attrs were replaced, but trailing \\' in text might remain
  
  fs.writeFileSync(p, c, 'utf8');
  const idx = c.indexOf('data:image/svg+xml,');
  console.log('ip-ats after snippet:', JSON.stringify(c.substring(idx, idx+120)));
  console.log('ip-ats OK:', !c.substring(idx, idx+120).includes('\\\\') && !c.substring(idx, idx+120).includes('\\"'));
})();

// === neupravlyaemye ===
(function fixNeuprav() {
  const p = 'src/data/neupravlyaemye-soho-poe.js';
  let c = fs.readFileSync(p, 'utf8');
  const idx0 = c.indexOf('data:image/svg+xml,');
  console.log('\nneuprav before snippet:', JSON.stringify(c.substring(idx0, idx0+100)));
  
  // From raw byte dump:
  // width=\\'400\\" and width=\\"400\\"
  // height=\\"300\\" and height=\\'300\\'
  // fill="%23f1f5f9" width=\\"400\\" height=\\"300\\"
  // same plain " x=" y=" text-anchor= etc.
  
  c = c.replace(/width=\\'(\d+)\\"/g, "width='$1'");
  c = c.replace(/width=\\'(\d+)\\'/g, "width='$1'");
  c = c.replace(/width=\\"(\d+)\\"/g, "width='$1'");
  c = c.replace(/height=\\"(\d+)\\"/g, "height='$1'");
  c = c.replace(/height=\\'(\d+)\\'/g, "height='$1'");
  c = c.replace(/fill=\\"([^"]*)\\"/g, "fill='$1'");
  
  // remaining plain " attributes
  c = c.replace(/"(\d+)"/g, "'$1'");
  c = c.replace(/"([^"]+)"/g, "'$1'");
  
  fs.writeFileSync(p, c, 'utf8');
  const idx = c.indexOf('data:image/svg+xml,');
  console.log('neuprav after snippet:', JSON.stringify(c.substring(idx, idx+120)));
})();
