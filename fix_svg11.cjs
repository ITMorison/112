const fs = require('fs');

// Target files
const files = ['src/data/ip-ats-i-shlyuzy.js', 'src/data/neupravlyaemye-soho-poe.js'];

for (const p of files) {
  let c = fs.readFileSync(p, 'utf8');
  
  // Find the SVG blob by finding the closing </svg> tag
  const svgStartMarker = 'data:image/svg+xml,';
  const svgEndMarker = '</svg>';
  
  let startIdx = c.indexOf(svgStartMarker);
  let endIdx = c.indexOf(svgEndMarker, startIdx);
  
  console.log(`\n=== ${p} ===`);
  console.log('svgStartIdx:', startIdx, 'svgEndIdx:', endIdx);
  console.log('BEFORE:', JSON.stringify(c.substring(startIdx, endIdx + 6)));
  
  if (startIdx === -1 || endIdx === -1) {
    console.log('SKIPPING - markers not found');
    continue;
  }
  
  // Extract everything between the markers
  const svgInner = c.substring(startIdx + svgStartMarker.length, endIdx);
  
  // Replace all attribute delimiter " with '  (only inside the SVG)
  // And all sequences of \\ + quote with just '
  // Strategy: iterate char by char, building new SVG
  
  let fixed = '';
  for (let i = 0; i < svgInner.length; i++) {
    const ch = svgInner[i];
    if (ch === '"') {
      // literal double quote — replace with single quote
      fixed += "'";
    } else if (ch === "\\" && i + 1 < svgInner.length) {
      // backslash — look ahead to see what it's escaping
      const next = svgInner[i + 1];
      if (next === '"' || next === "'" || next === "\\") {
        // It's an escape. Skip the backslash, take the escaped char as-is
        // If it's " → replace with ', if it's ' → keep, if \\ → keep one \
        fixed += next === '"' ? "'" : next;
        i++; // skip next char since we consumed it
      } else {
        // Backslash not escaping anything meaningful — keep it? drop it?
        // For our SVG context, these shouldn't exist; drop it
        // fixed += '\\'; // keep as-is
        // Actually, keep literal backslash for now
        fixed += ch;
      }
    } else {
      fixed += ch;
    }
  }
  
  // Reassemble
  const newContent = c.substring(0, startIdx) + svgStartMarker + fixed + svgEndMarker + c.substring(endIdx + svgEndMarker.length);
  
  console.log('AFTER:', JSON.stringify(newContent.substring(startIdx, endIdx + 6)));
  fs.writeFileSync(p, newContent, 'utf8');
}
