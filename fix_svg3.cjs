const fs = require('fs');

const patterns = [
  { file: 'src/data/poe-адаптеры.js',    find: 'width="400"    height="300"',      repl: "width='400'    height='300'" },
  { file: 'src/data/poe-адаптеры.js',    find: 'fill="%23f1f5f9" width="400" height="300".>',  repl: "fill='%23f1f5f9' width='400' height='300'.>" },
  { file: 'src/data/poe-адаптеры.js',    find: 'x="200" y="150"',                repl: "x='200' y='150'" },
  { file: 'src/data/poe-адаптеры.js',    find: 'class="svg-photo"',               repl: "class='svg-photo'" },
  { file: 'src/data/poe-адаптеры.js',    find: 'xml:space="preserve"',            repl: "xml:space='preserve'" },
  { file: 'src/data/ip-ats-i-shlyuzy.js',find: 'width=\\', repl: "width='" },
  { file: 'src/data/ip-ats-i-shlyuzy.js',find: 'height=\\", repl: "height='" },
];

// Better: just do a global char-level replace per file
const fileRules = [
  {
    file: 'src/data/poe-адаптеры.js',
    // Inside SVG data URLs the JS string uses " outside, so inside the SVG
    // all double quotes (unescaped) must become single quotes.
    // The SVG in this file has: width="400" height="300" fill="..." x="..." y="..."
    transform(c) {
      return c.replace(/width="(\d+)"/g, "width='$1'")
              .replace(/height="(\d+)"/g, "height='$1'")
              .replace(/fill="([^"]*)"/g, "fill='$1'")
              .replace(/x="(\d+)"/g, "x='$1'")
              .replace(/y="(\d+)"/g, "y='$1'")
              .replace(/transform="([^"]*)"/g, "transform='$1'")
              .replace(/class="([^"]*)"/g, "class='$1'")
              .replace(/xml:space="([^"]*)"/g, "xml:space='$1'")
              .replace(/>"/g, ">'")
              .replace(/">/g, "'>");
    }
  },
  {
    file: 'src/data/ip-ats-i-shlyuzy.js',
    // has: width=\\'400\\' and width=\\"400\\" and height=\\"300\\"
    // = \\'  → '   and  = \\"  → '
    // and closing quotes: \\'  → '   and  \\"  → '
    transform(c) {
      return c.replace(/=\\['"]/g, "='")   // =\\' and =\\"  → ='
              .replace(/\\['"]>/g, "' >")  // \\' > and \\" > → ' >
              .replace(/>\\['"]/g, ">' ")  // >\\' and >\\"   → >' 
              .replace(/;\\['"]/g, ";' "); // ;\\' and ;\\"   → ;'
    }
  },
  {
    file: 'src/data/neupravlyaemye-soho-poe.js',
    // has: width=\\'400\\"  and  width=\\"400\\"
    // same pattern fix as ip-ats
    transform(c) {
      return c.replace(/=\\['"]/g, "='")
              .replace(/\\['">]/g, "' ")
              .replace(/>\\'/g, ">' ")
              .replace(/;\\'/g, ";' ");
    }
  }
];

for (const rule of fileRules) {
  let c = fs.readFileSync(rule.file, 'utf8');
  const before = c;
  c = rule.transform(c);
  fs.writeFileSync(rule.file, c, 'utf8');
  console.log(rule.file + ': changed', before !== c);
}
