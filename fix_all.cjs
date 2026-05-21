const fs = require('fs');

const files = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

// Work on entire file at once, not line-by-line
for (const p of files) {
  const c = fs.readFileSync(p, 'utf8');
  
  // Find all occurrences of "image": "data:image/svg+xml,<svg ...>" across the whole file
  // Strategy: find the start of each SVG data URL, find where the JS string ends,
  // replace all inner quotes
  
  let result = '';
  let pos = 0;
  let changed = false;
  const searchStart = '"image": "data:image/svg+xml,';
  
  while (true) {
    const startPos = c.indexOf(searchStart, pos);
    if (startPos === -1) {
      result += c.substring(pos);
      break;
    }
    
    // The SVG content starts after searchStart
    // The JS string ends at the next ' or "  (SVG has </svg> then the closer)
    // We need to find the closing delimiter AFTER </svg>
    
    const innerStart = startPos + searchStart.length;
    
    // Find </svg> to know where the SVG content ends
    const svgEndTagIdx = c.indexOf('</svg>', innerStart);
    if (svgEndTagIdx === -1) {
      result += c.substring(pos, innerStart);
      pos = innerStart;
      continue;
    }
    
    // The closing JS string delimiter is the very next ' or " after </svg>
    // (In well-formed JS there's exactly one delimiter right after </svg> then ,])
    const afterSvg = svgEndTagIdx + '</svg>'.length;
    const quoteAfterSvg = c.substring(afterSvg, afterSvg + 5);  // peek ahead
    
    // Find the closing delimiter: the FIRST occurrence of ' or " after </svg>
    let endQuotePos = -1;
    for (let q = afterSvg; q < c.length; q++) {
      const ch = c[q];
      if (ch === '\'' || ch === '"') {
        endQuotePos = q;
        break;
      }
    }
    
    if (endQuotePos === -1) {
      result += c.substring(pos, innerStart);
      pos = innerStart;
      continue;
    }
    
    const svgInner = c.substring(innerStart, svgEndTagIdx); // plain SVG content (no </svg>)
    const afterQuote = c.substring(endQuotePos);             // from closing delimiter onwards
    
    // === Fix the SVG inner content ===
    // Replace all " → '
    // Remove preceding \ from \" → '
    let fixed = svgInner.replace(/\\"/g, "'")   // \" → '
                       .replace(/"/g, "'");     // any remaining " → '
    
    if (fixed !== svgInner) {
      changed = true;
    }
    
    result += c.substring(pos, innerStart) + fixed + '</svg>' + afterQuote;
    pos = endQuotePos + 1;
  }
  
  if (changed) {
    fs.writeFileSync(p, result, 'utf8');
    console.log(p + ': FIXED');
  } else {
    // Old content stays
    console.log(p + ': no changes needed or no SVG found');
  }
}
