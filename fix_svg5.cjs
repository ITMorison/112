const fs = require('fs');

// After inspecting: these are the actual byte sequences in the files
// poe-адаптеры.js:    width="400"  (pos 65-74: ="400")   — plain double quotes inside JS double-quoted string = syntax error
// ip-ats-i-shlyuzy.js: width=\'400\'  (pos 65-71) AND width=\"400\" (pos 82-90)
//                       height=\"300\" (pos 95-103) AND height=\'300\' (pos 113-121)
// neupravlyaemye:     width=\'400\"  (pos 65-73)  AND width=\"400\" (pos 82-90)
//                       height=\"300\" (pos 95-103) AND height=\'300\' (pos 121-129)

const fixes = [
  {
    path: 'src/data/poe-адаптеры.js',
    transform(c) {
      // Find any " used as SVG attr delimiter (not the JS string wrapper)
      // Strategy: just replace all " that appear AFTER the first ' in the svg+xml blob
      // OR simpler: know the exact patterns used
      const svgStart = 'data:image/svg+xml,<svg xmlns=';
      return c.replace(new RegExp(svgStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([\\s\\S]*?)">', 'g'),
        (m, inner) => {
          let fixed = inner
            .replace(/width="(\d+)"/g, "width='$1'")
            .replace(/height="(\d+)"/g, "height='$1'")
            .replace(/fill="([^"]*)"/g, "fill='$1'")
            .replace(/x="(\d+)"/g, "x='$1'")
            .replace(/y="(\d+)"/g, "y='$1'")
            .replace(/text-anchor="([^"]*)"/g, "text-anchor='$1'")
            .replace(/dominant-baseline="([^"]*)"/g, "dominant-baseline='$1'")
            .replace(/font-family="([^"]*)"/g, "font-family='$1'")
            .replace(/font-size="([^"]*)"/g, "font-size='$1'")
            .replace(/class="([^"]*)"/g, "class='$1'")
            .replace(/xml:space="([^"]*)"/g, "xml:space='$1'");
          return svgStart + fixed + "'>";
        }
      );
    }
  },
  {
    path: 'src/data/ip-ats-i-shlyuzy.js',
    transform(c) {
      const svgStart = 'data:image/svg+xml,<svg xmlns=';
      return c.replace(new RegExp(svgStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([\\s\\S]*?)">', 'g'),
        (m, inner) => {
          // width=\\'400\\'  → width='400'
          // width=\"400\"    → width='400'
          // height=\"300\"   → height='300'
          // height=\'300\'   → height='300'
          let fixed = inner
            // \\'X\\' pattern → 'X'
            .replace(/=\\'" \+ "(\d+)\\'/g, "='$1'")
            // Actually: match literally \\ <digit+> \\'  but we need exact chars
            // From inspection: width=\\'400\\' = w+i+d+t+h+=\+\'+4+0+0+\+\'
            .replace(/=\\['"] + "(\d+)\\'/g, "='$1'")
            // Simpler: just replace ALL " inside svg with '
            // AND replace all standalone \" that appear as SVG attr ends
            // Best: replace attr=' and attr=" patterns
            .replace(/\s+\w+=\\'?(\d+)\\'?/g, (s) => s.replace(/=\\'?(\d+)\\'/, "='$1'"))
            .replace(/\s+\w+=\\"(\d+)\\"/g, "='$1'")
            .replace(/\s+\w+=\\"([^\"]+)\\"/g, "='$1'")
            .replace(/\s+\w+="(\d+)"/g, "='$1'")
            .replace(/\s+\w+="([^"]+)"/g, "='$1'")
            .replace(/>"/g, ">'")
            .replace(/>"/g, ">'");
          return svgStart + fixed + "'>";
        }
      );
    }
  },
  {
    path: 'src/data/neupravlyaemye-soho-poe.js',
    transform(c) {
      const svgStart = 'data:image/svg+xml,<svg xmlns=';
      return c.replace(new RegExp(svgStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([\\s\\S]*?)">', 'g'),
        (m, inner) => {
          let fixed = inner
            .replace(/=\\['"](\d+)\\'/g, "='$1'")
            .replace(/=\\"(\d+)\\"/g, "='$1'")
            .replace(/=\\"([^\"]+)\\"/g, "='$1'")
            .replace(/="(\d+)"/g, "='$1'")
            .replace(/="([^"]+)"/g, "='$1'")
            .replace(/>"/g, ">'");
          return svgStart + fixed + "'>";
        }
      );
    }
  }
];

for (const rule of fixes) {
  let c = fs.readFileSync(rule.path, 'utf8');
  const before = c;
  c = rule.transform(c);
  fs.writeFileSync(rule.path, c, 'utf8');
  console.log(rule.path + ': changed =', before !== c);
}
