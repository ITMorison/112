const fs = require('fs');

const TARGET_FILES = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

/**
 * Fix a raw JS string by finding every "image": "data:image/svg+xml, <svg ...>" block
 * and replacing all inner SVG attribute delimiters with single quotes.
 *
 * Character-by-character walk — no regex on the inner content.
 */
function fixSvgQuotes(raw) {
  const MARKER = '"image": "data:image/svg+xml,';
  let result = '';
  let pos = 0;
  let changes = 0;

  while (true) {
    const markerPos = raw.indexOf(MARKER, pos);
    if (markerPos === -1) { result += raw.substring(pos); break; }

    // Locate end of JS string value (just after </svg>)
    const innerStart = markerPos + MARKER.length;
    const svgEndTagIdx = raw.indexOf('</svg>', innerStart);
    if (svgEndTagIdx === -1) { result += raw.substring(pos, innerStart); pos = innerStart; break; }

    // Next closing JS quote after </svg>  (could also be ' in some files)
    let closingPos = -1;
    const LOOK = Math.min(svgEndTagIdx + 16, raw.length);
    for (let i = svgEndTagIdx + 6; i < LOOK; i++) {
      if (raw[i] === '"' || raw[i] === "'") { closingPos = i; break; }
    }
    if (closingPos === -1) { result += raw.substring(pos, innerStart); pos = innerStart; break; }

    // What's inside the JS string (SVG blob without outer delimiters)
    const svgInner = raw.substring(innerStart, svgEndTagIdx);

    // Replace JS-SVG conflicts:
    // 1. \\\" or \" inside the SVG (escaped or raw double quote) → single quote
    // 2. Plain " inside the SVG (SVG attribute delimiter same as outer JS delimiter) → single quote
    let fixed = '';
    for (let k = 0; k < svgInner.length; k++) {
      const ch = svgInner[k];
      if (ch.charCodeAt(0) === 34) {       // plain " → '
        fixed += "'";
      } else if (ch.charCodeAt(0) === 92) { // \  — skip escape, copy next char
        if (k + 1 < svgInner.length) {
          const next = svgInner[k + 1];
          fixed += next;                    // copy the escaped char as-is (', ", \, etc.)
          k++;
        } else {
          fixed += ch;
        }
      } else {
        fixed += ch;
      }
    }

    if (fixed !== svgInner) changes++;

    // Reassemble:  [before marker] [MARKER] [fixed inner] [</svg>] [after closing quote — leave as-is]
    result += raw.substring(pos, innerStart) + fixed + '</svg>';
    // Now skip past closing quote
    pos = svgEndTagIdx + 6;
  }

  return { result, changes };
}

for (const p of TARGET_FILES) {
  const raw = fs.readFileSync(p, 'utf8');
  const { result, changes } = fixSvgQuotes(raw);

  console.log(`${p}: ${changes} SVG blob(s) fixed`);
  fs.writeFileSync(p, result, 'utf8');
}
