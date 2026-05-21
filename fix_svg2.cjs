const fs = require('fs');
const files = [
  { path: 'src/data/poe-адаптеры.js',    prefix: 'src/data/poe-адаптеры.js' },
  { path: 'src/data/ip-ats-i-shlyuzy.js', prefix: 'src/data/ip-ats-i-shlyuzy.js' },
  { path: 'src/data/neupravlyaemye-soho-poe.js', prefix: 'src/data/neupravlyaemye-soho-poe.js' },
];

for (const f of files) {
  let c = fs.readFileSync(f.path, 'utf8');
  let changed = 0;
  
  // Universal: replace every "image": "data:image/svg+xml,....." block
  // by fixing all SVG attribute double quotes to single quotes.
  c = c.replace(/"image":\s*"data:image\/svg\+xml,([^"]*)"/g, (full, svg) => {
    let s = svg;
    // For poe-адаптеры.js: the SVG has unescaped double quotes: width="400" height="300"
    // For ip-ats-i-shlyuzy: width=\\'400\\' height=\\"300\\"
    // For neupravlyaemye-soho-poe: width=\\'400\\" height=\\"300\\"
    
    // Replace any sequence that looks like =\\" or =\\'  (escaped quote after backslash)
    // These represent an opening quote in the SVG attribute.
    s = s.replace(/=\\['"]/g, "='");

    // Replace any sequence that is a double-quote opener (no backslash) followed by content until next "
    // and close with single quote
    // e.g. width="400" → width='400'
    s = s.replace(/="([^"]*)"/g, "='$1'");

    changed++;
    return `"image": "data:image/svg+xml,${s}"`;
  });
  
  fs.writeFileSync(f.path, c, 'utf8');
  console.log(f.path + ': changed ' + changed + ' lines');
}
