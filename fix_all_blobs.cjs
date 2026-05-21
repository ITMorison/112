const fs = require('fs');

const FILES = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

// The SVG data URL blob regex — captures the whole { ..., } block
// But works char-by-char to be exact

function fixSvgDiv(raw) {
  // Find "image": "...svg..." blobs throughout the whole file
  // Strategy: iterate character by character to avoid regex edge cases
  
  let out = '';
  let i = 0;
  while (i < raw.length) {
    // Find `"image": "data:image/svg+xml,` or `'image': 'data:image/svg+xml,`
    const imgKeyStart = raw.indexOf('"image": "data:image/svg+xml,', i);
    const imgKeyStartApos = raw.indexOf("'image': 'data:image/svg+xml,", i);
    
    const pos = Math.min(
      imgKeyStart >= 0 ? imgKeyStart : Infinity,
      imgKeyStartApos >= 0 ? imgKeyStartApos : Infinity
    );
    
    if (pos === Infinity) { out += raw.substring(i); break; }
    
    out += raw.substring(i, pos);
    i = pos;
    
    // From here: we have `"image": "data:image/svg+xml,<SVG_BLOB>"` or `'image': 'data:image/svg+xml,<SVG_BLOB>'`
    // Determine outer delimiter
    const outerOpen = raw[i];
    const outerClose = outerOpen === '"' ? '"' : "'";
    
    // Find where the inner content begins
    const innerStart = i;
    // Walk to find closing outer delimiter by tracking depth
    let depth = 0; let j = i;
    while (j < raw.length) {
      const ch = raw[j];
      if (ch === outerClose) {
        if (depth === 0) break;
        depth--;
      }
      if (ch === '\\') { j++; } // skip escaped char
      j++;
    }
    
    if (j >= raw.length) { out += raw.substring(i); break; }
    
    // Segment: [open-delim + prefix] [SVG inner] [close-delim]
    // Find the actual inner content boundary after `data:image/svg+xml,`
    const prefixEnd = innerStart + (outerOpen === '"' 
      ? '"image": "data:image/svg+xml,'.length 
      : "'image': 'data:image/svg+xml,".length) - 1; // minus 1 for the outer open
    
    // Actually let's be simpler: we know the structure
    const isDbl = outerOpen === '"';
    const keyLen = isDbl 
      ? '"image": "data:image/svg+xml,'.length 
      : "'image': 'data:image/svg+xml,".length;
    
    // The string open: position i + 0 to keyLen-1 includes opening " then content starts at keyLen
    // Wait, `"image": "data:` — the first " is at position i
    
    // Just find where 'data:image/svg+xml,' begins
    const blobStart = raw.indexOf('data:image/svg+xml,', i);
    const innerStart2 = blobStart + 'data:image/svg+xml,'.length;
    
    if (blobStart < 0 || innerStart2 > j) { 
      // something unexpected, bail
      out += raw.substring(i, j + 1);
      i = j + 1;
      continue;
    }
    
    const svgInner = raw.substring(innerStart2, j); // without closing outer quote
    // Note: j points at the closing outer quote
    
    // Fix: the outer JS delimiter is outerClose.
    // SVG attribute delimiters that are outerClose conflict.
    // SVGs that already have the right quoting are fine.
    
    let fixed = svgInner;
    
    if (isDbl) {
      // Outer is ". Fix inner SVG `"` to `'`
      // Also collapse any \" → '
      fixed = svgInner.replace(/\\"/g, "'").replace(/"/g, "'");
    } else {
      // Outer is '. SVG inner uses ' too (conflict). Fix to "
      // Collapse any \" → ' first, then replace remaining inner ' with "
      fixed = svgInner.replace(/\\'/g, '"').replace(/'/g, '"');
    }
    
    // Transplant
    out += raw.substring(i, innerStart2) + fixed;
    i = j; // j points at closing outer quote (will be added next iteration or at end)
  }
  
  return out;
}

for (const p of FILES) {
  const raw = fs.readFileSync(p, 'utf8');
  const fixed = fixSvgDiv(raw);
  
  if (fixed !== raw) {
    fs.writeFileSync(p, fixed, 'utf8');
    console.log(p + ': FIXED');
  } else {
    console.log(p + ': no changes (may already be correct)');
  }
}
