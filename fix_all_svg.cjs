const fs = require('fs');

// All 5 data files with their SVG quote patterns
const files = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

// Reports wrong lines
let broken = [];

for (const p of files) {
  let c = fs.readFileSync(p, 'utf8');
  const lines = c.split('\n');
  let changed = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip non-image lines
    if (!line.includes('data:image/svg+xml,')) continue;
    
    // Find the start of the string value
    const svgStart = 'data:image/svg+xml,';
    const start = line.indexOf(svgStart);
    if (start === -1) continue;
    
    // Find the end of the SVG string value by finding </svg>
    const svgEnd = '</svg>';
    const endTag = line.indexOf(svgEnd, start);
    if (endTag === -1) {
      // SVG doesn't close on the same line - unlikely but handle it
      console.log(`${p}:${i+1} SVG not closed on same line, skipping`);
      continue;
    }
    
    // Extract the JS outer string wrapper + SVG content
    // Outer string is: <extern_quote><prefix><svg_blob><suffix><extern_quote>
    // The suffix before the closing ext quote is '</svg>' plus one extra '"'
    
    // Find the closing JS string delimiter after </svg>
    const afterEnd = endTag + svgEnd.length;
    const nextQuote = line.indexOf('"', afterEnd);
    if (nextQuote === -1) {
      console.log(`${p}:${i+1} No closing quote found after </svg>`);
      continue;
    }
    
    // Now we have:
    // Before: ... "data:image/svg+xml,<svg ... ></svg>"
    // Work on just the SVG inner part
    
    const svgInner = line.substring(start + svgStart.length, endTag); // interior of SVG
    const beforeLine = line.substring(0, start + svgStart.length);  // up to just before SVG interior
    const afterLine = line.substring(nextQuote);                      // from closing JS quote onwards
    
    // === THE FIX ===
    // Replace all " attribute delimiters with '
    // And collapse any \ before quotes
    
    let fixed = '';
    for (let j = 0; j < svgInner.length; j++) {
      const ch = svgInner[j];
      if (ch.charCodeAt(0) === 34) {  // "
        // Straight double quote — this is an SVG attribute delimiter, swap to single
        fixed += "'";
      } else if (ch.charCodeAt(0) === 92) {  // \  backslash
        // Look ahead
        if (j + 1 < svgInner.length) {
          const nextChar = svgInner[j + 1];
          if (nextChar.charCodeAt(0) === 34) {  // \"  → '
            fixed += "'";
            j++; // skip the quote
          } else if (nextChar.charCodeAt(0) === 39) {  // \'  → '
            fixed += "'";
            j++; // skip the quote
          } else if (nextChar.charCodeAt(0) === 92) {  // \\  → \  (keep one)
            fixed += "\\";
            j++; // skip second backslash
          } else {
            // Lone backslash — keep (shouldn't happen in clean SVG)
            fixed += "\\";
          }
        } else {
          fixed += "\\";
        }
      } else {
        fixed += ch;
      }
    }
    
    const newLine = beforeLine + fixed + svgEnd + afterLine;
    
    // Verify no raw double-quotes remain in SVG inner
    if (fixed.includes('"')) {
      console.log(`${p}:${i+1} STILL HAS " after fix!`);
      broken.push(`  ${p}:${i+1}: ${line.substring(0,100)}`);
    }
    
    if (newLine !== line) {
      lines[i] = newLine;
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(p, lines.join('\n'), 'utf8');
    console.log(`${p}: FIXED`);
  } else {
    // Still check syntax
    try {
      // Can't --check module files directly, but scan for unmatched quotes in image lines
      const newContent = lines.join('\n');
      const svgIdx = newContent.indexOf('data:image/svg+xml,');
      if (svgIdx > -1) {
        const snippet = newContent.substring(svgIdx, svgIdx + 300);
        const hasBadQuote = snippet.match(/([^\\])"/g);
        if (!hasBadQuote) {
          console.log(`${p}: already OK`);
        } else {
          console.log(`${p}: STILL HAS UNESCAPED QUOTES`);
        }
      }
    } catch(e) {
      console.log(p+': check error', e.message);
    }
  }
}

if (broken.length) {
  console.log('\nSTILL BROKEN:');
  broken.forEach(x => console.log(x));
} else {
  console.log('\nAll done!');
}
