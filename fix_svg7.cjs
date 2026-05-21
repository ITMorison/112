const fs = require('fs');

// Strategy:
// 1. For files with \\\\ escapes inside SVG: strip any \\ before a quote char,
//    leaving just the quote (so \\' → ' and \\" → ')
// 2. Then replace all remaining " inside SVG data URLs with '
// 3. Also clean up any standalone \\ that aren't escaping anything meaningful

function makeSvgFixer() {
  return function(path) {
    let c = fs.readFileSync(path, 'utf8');
    const svgIdx = c.indexOf('data:image/svg+xml,');
    const before = c.substring(svgIdx, svgIdx + 300);
    console.log(`\n=== ${path} BEFORE ===`);
    console.log(before.substring(0, 200));
    
    // The patched regex captures and replaces
    c = c.replace(/"image":\s*"data:image\/svg\+xml,([^"]+)"/g, (full, svg) => {
      let s = svg;
      // Step 1: remove backslash-backslash pairs that precede quotes
      // \\'  -> '  and  \\"  -> '
      s = s.replace(/\\'/g, "'");
      s = s.replace(/\\"/g, "'");
      // Step 2: replace any remaining " SVG attribute delimiters with '
      s = s.replace(/="(\d+)"/g, "='$1'");
      s = s.replace(/="([^"]+?)"/g, "='$1'");
      // Step 3: clean up >"  -> >'  and  anyorphaned closing "
      s = s.replace(/>"/g, ">'");
      return `"image": "data:image/svg+xml,${s}"`;
    });
    
    fs.writeFileSync(path, c, 'utf8');
    const afterIdx = c.indexOf('data:image/svg+xml,');
    console.log(`=== ${path} AFTER ===`);
    console.log(c.substring(afterIdx, afterIdx + 200));
    return c;
  };
}

const fix = makeSvgFixer();

// Also fix poe-адаптеры in case fix_svg6 touched it but left issues
fix('src/data/poe-адаптеры.js');

// Fix the remaining two
fix('src/data/ip-ats-i-shlyuzy.js');
fix('src/data/neupravlyaemye-soho-poe.js');
