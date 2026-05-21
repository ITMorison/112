const fs = require('fs');
const SY_13 = 12; // zero-based index for line 13

const FILES = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js',
  'src/data/upravlyaemye-soho-poe.js',
];

/**
 * Fix one specific line in a file: replace all " in the SVG inner content with '
 * while leaving the JS string delimiters untouched.
 */
function fixLine(filePath, lineIdx) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);
  const line = lines[lineIdx];
  if (!line) return false;

  // Find entire block: "image": "data:image/svg+xml,<SVG-INNER>"
  // Strategy: find the outer " before data:image, and the closing " after </svg>
  const blobStart = line.indexOf('"image": "data:image/svg+xml,');
  if (blobStart < 0) return false;

  // Locate </svg>
  const svgClosePos = line.indexOf('</svg>', blobStart);
  if (svgClosePos < 0) return false;

  // Find closing JS string quote
  let endQuote = -1;
  const LOOK = Math.min(svgClosePos + 20, line.length);
  for (let i = svgClosePos + 6; i < LOOK; i++) {
    if (line[i] === '"') { endQuote = i; break; }
  }
  if (endQuote < 0) return false;

  const PREFIX = '"image": "data:image/svg+xml,'; // 27 chars
  const PREFIX_LEN = PREFIX.length;

  const before = line.substring(0, blobStart + PREFIX_LEN);
  // Inner SVG = blobStart + PREFIX_LEN  →  svgClosePos
  const svgInner = line.substring(blobStart + PREFIX_LEN, svgClosePos);
  const after = line.substring(endQuote);

  // Fix: replace ALL double-quote characters in SVG with single-quote
  // Also clean up \" → ' and \\' → '
  let fixed = '';
  for (let k = 0; k < svgInner.length; k++) {
    const ch = svgInner[k];
    if (ch.charCodeAt(0) === 34) {        // plain "
      fixed += "'";
    } else if (ch.charCodeAt(0) === 92) { // \
      if (k + 1 < svgInner.length) {
        fixed += svgInner[k+1];            // copy escaped char as-is
        k++;
      } else {
        fixed += ch;
      }
    } else {
      fixed += ch;
    }
  }

  lines[lineIdx] = before + fixed + '</svg>' + after;
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  return true;
}

// Fix ONLY line 13 in each target file
for (const p of FILES) {
  const ok = fixLine(p, SY_13);
  console.log(`${p}: ${ok ? 'FIXED' : 'SKIPPED'}`);
}
