const fs = require('fs');

const files = [
  'src/data/poe-адаптеры.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  
  // Count fixes applied
  let count = 0;
  
  // Replace the SVG data URL pattern.
  // The SVG inside JS double-quoted strings uses various escaped quote styles.
  // Strategy: find "image": "...svg+xml,..." blocks and normalize all SVG attribute quotes to single quotes.
  
  // Replace all occurrences where SVG attributes use double quotes that conflict with JS string delimiters
  // Pattern: within SVG data URLs, replace width="X" height="Y" fill="Z" with single-quoted versions
  
  // For the data:image/svg+xml,<svg ...> pattern, replace all attr="value" with attr='value'
  // We do this specifically in the SVG context
  
  // Simple approach: find all SVG data URLs and replace their attribute quotes
  const svgPattern = /"image":\s*"data:image\/svg\+xml,([^"]+)"/g;
  
  c = c.replace(svgPattern, (full, svgContent) => {
    let fixedSvg = svgContent;
    
    // Replace escaped backslash sequences of quotes in SVG attributes
    // width=\\" → width='  and end with '
    // width=\\' → width='  
    // width=" → width='  and then fix closing
    
    // Handle \\" patterns (escaped double quotes in JS) → '
    fixedSvg = fixedSvg.replace(/=\\[\\"']/g, '=\'');
    
    // Also handle non-escaped double quotes inside the SVG
    fixedSvg = fixedSvg.replace(/="([^"]*?)"/g, "='$1'");
    
    return `"image": "data:image/svg+xml,${fixedSvg}"`;
  });
  
  // Count how many SVG lines changed
  const lineCount = (c.match(/"image":\s*"data:image\/svg\+xml,.*'[^']+'/g) || []).length;
  
  fs.writeFileSync(f, c, 'utf8');
  console.log(f + ': fixed, lines with svg images now: ' + lineCount);
}
