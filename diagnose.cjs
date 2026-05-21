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
  if (idx === -1) {
    console.log(`${p}: no SVG found`);
    continue;
  }
  
  // Show raw chars around svgStart+55 (the width/height attrs)
  const snippet = c.substring(idx + 55, idx + 95);
  console.log(`\n${p}:`);
  for (let i = 0; i < snippet.length; i++) {
    const ch = snippet[i];
    if (ch.charCodeAt(0) === 92 || ch.charCodeAt(0) === 34 || ch.charCodeAt(0) === 39) {
      console.log(`  [${i}] '${ch}' U+${ch.charCodeAt(0).toString(16).padStart(2,'0')}`);
    }
  }
  
  // Check if there are any raw " in the SVG part (bad)
  // SVG ends at </svg>
  const svgEndIdx = c.indexOf('</svg>', idx);
  if (svgEndIdx === -1) {
    console.log('  No </svg> found!');
    continue;
  }
  
  const firstQuoteAfterSvg = c.indexOfOfQuotesAfterEnd = (() => {
    for (let i = svgEndIdx + 6; i < Math.min(svgEndIdx + 10, c.length); i++) {
      const ch = c[i];
      if (ch.charCodeAt(0) === 34 || ch.charCodeAt(0) === 39) return i;
    }
    return -1;
  })();

  const quoteChar = firstQuoteAfterSvg >= 0 ? c[firstQuoteAfterEnd] : '?';
  console.log(`  String delimiter after </svg>: '${quoteChar}' at pos ${firstQuoteAfterSvg}`);
  
  // Look at the ATTRIBUTE delimiters used inside the SVG
  // (after xmlns, for width/height)
  const attrStart = idx + 57; // after <svg xmlns='http://www.w3.org/2000/svg' 
  const prefix = c.substring(attrStart, attrStart + 1);
  console.log(`  SVG attr (pos ${idx+57-57}→${idx+57-57+1}): '${prefix}'`);
  
  // Check: does the CURRENT string delimiter quote appear inside the SVG as an attribute delimiter?
  const svgInner = c.substring(idx, svgEndIdx + 6);
  const badMatches = [];
  let depth = 0;
  for (let i = 0; i < svgInner.length; i++) {
    const ch = svgInner[i];
    if (ch === quoteChar && depth === 0) {
      badMatches.push(i);
    }
  }
  if (badMatches.length > 0) {
    console.log(`  *** ${badMatches.length} inner occurrences of the same quote char '${quoteChar}'`);
  } else {
    console.log(`  OK: no inner occurrences of the same quote char '${quoteChar}'`);
  }
  
  // Check for raw " separately
  const rawDoubleQuotes = [];
  for (let i = idx; i <= svgEndIdx; i++) {
    if (c[i].charCodeAt(0) === 34) rawDoubleQuotes.push(i);
  }
  if (rawDoubleQuotes.length > 0) {
    console.log(`  *** RAW double-quotes (U+0022) at positions: ${rawDoubleQuotes.length} found`);
  } else {
    console.log(`  No raw U+0022 double quotes ✓`);
  }
}
