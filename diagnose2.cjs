const fs = require('fs');
const FILES = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

for (const p of FILES) {
  const c = fs.readFileSync(p, 'utf8');
  const idx = c.indexOf('data:image/svg+xml,');
  if (idx === -1) { console.log(p + ': no SVG'); continue; }
  
  const svgEndIdx = c.indexOf('</svg>', idx);
  if (svgEndIdx === -1) { console.log(p + ': no </svg>'); continue; }
  
  // Find closing JS string delimiter after </svg>
  const afterEnd = svgEndIdx + 6;
  let closingPos = -1, closingChar = '?';
  for (let i = afterEnd; i < Math.min(afterEnd + 6, c.length); i++) {
    if (c[i] === "'" || c[i] === '"') { closingPos = i; closingChar = c[i]; break; }
  }
  
  console.log(`\n${p}: closing string delim after </svg> = U+${closingChar.charCodeAt(0).toString(16)}`);
  
  // The SVG inner content
  const svgInner = c.substring(idx, svgEndIdx + 6);
  
  // Check for raw " inside the JS string (conflicts if the outer string uses ")
  const rawDblCount = [];
  for (let i = 0; i < svgInner.length; i++) {
    if (svgInner[i] === '"') rawDblCount.push(i);
  }
  if (rawDblCount.length) console.log(`  Raw U+0022 at SVG positions: ${rawDblCount.length}x`);
  else console.log(`  No raw U+0022 ✓`);
  
  // Check if closing delimiter char appears inside SVG as attribute delimiter
  const innerClosureCount = [];
  for (let i = 0; i < svgInner.length; i++) {
    if (svgInner[i] === closingChar) innerClosureCount.push(i);
  }
  if (innerClosureCount.length) {
    console.log(`  U+${closingChar.charCodeAt(0).toString(16)} ("${closingChar}") used ${innerClosureCount.length}x as inner attribute delimiter — BAD (same as outer JS string)`);
  } else {
    console.log(`  U+${closingChar.charCodeAt(0).toString(16)} ("${closingChar}") is NOT used inside SVG ✓`);
  }
}
