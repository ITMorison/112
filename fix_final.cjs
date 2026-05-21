const fs = require('fs');

// Only the 5 files the user mentioned
const targets = [
  { name: 'src/data/mesh-системы.js', lines: [12], prefix: '"image": "data:image/svg+xml,', outer: '"' },
  { name: 'src/data/ip-telefony.js', lines: [12], prefix: '"image": "data:image/svg+xml,', outer: '"' },
  { name: 'src/data/ip-ats-i-shlyuzy.js', lines: [12], prefix: '"image": "data:image/svg+xml,', outer: '"' },
  { name: 'src/data/poe-адаптеры.js', lines: [12], prefix: '"image": "data:image/svg+xml,', outer: '"' },
  { name: 'src/data/neupravlyaemye-soho-poe.js', lines: [12], prefix: '"image": "data:image/svg+xml,', outer: '"' },
];

let totalChanges = 0;

for (const target of targets) {
  const raw = fs.readFileSync(target.name, 'utf8');
  const lines = raw.split('\n');
  
  for (const lineIdx of target.lines) {
    const line = lines[lineIdx];
    if (!line) continue;
    
    // Only operate on image lines
    if (!line.includes('data:image/svg+xml,')) continue;
    
    // Find SVG content boundaries
    // Line format: ...<prefix><SVG CONTENT><closer>
    // Find prefix
    const prefixIdx = line.indexOf(target.prefix);
    if (prefixIdx === -1) continue;
    
    const svgInnerStart = prefixIdx + target.prefix.length;
    // Find the next " after </svg>  (the closing JS delimiter)
    const svgEndIdx = line.indexOf('</svg>', svgInnerStart);
    if (svgEndIdx === -1) continue;
    
    const afterSvg = svgEndIdx + 6;
    let closingQuotePos = -1;
    for (let i = afterSvg; i < line.length; i++) {
      if (line[i] === '"' || line[i] === "'") { closingQuotePos = i; break; }
    }
    if (closingQuotePos === -1) continue;
    
    const before = line.substring(0, svgInnerStart);
    const svgInner = line.substring(svgInnerStart, svgEndIdx);
    const after = line.substring(closingQuotePos);
    
    // Fix SVG inner: replace all " with ' and clean up escaped "
    // Also fix xmlns='...' and other ' attributes already OK
    // Replace all " → ' (these are SVG attr delimiters outside the JS string)  
    // Also collapse any \" → ' (escaped-to-raw)
    let fixed = svgInner.replace(/\\"/g, "'").replace(/"/g, "'");
    
    lines[lineIdx] = before + fixed + '</svg>' + after;
    totalChanges++;
    console.log(`${target.name}:13 FIXED`);
  }
  
  fs.writeFileSync(target.name, lines.join('\n'), 'utf8');
}

console.log(`Total lines changed: ${totalChanges}`);
