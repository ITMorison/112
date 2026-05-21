// For ip-ats-i-shlyuzy.js and neypravlyaemye-soho-poe.js:
// The JS string uses ' as outer delimiter
// SVG attributes also use ' — that's 26 conflicts per file
// Replace SVG ' attr delimiters with "

const fs = require('fs');
const FILES = [
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

for (const p of FILES) {
  const c = fs.readFileSync(p, 'utf8');
  
  // Work whole-file: find each SVG data URL blob, replace inner ' with " for SVG attrs
  const searchStart = "image': 'data:image/svg+xml,";
  let pos = 0;
  let changed = false;
  let result = '';
  
  while (true) {
    const startPos = c.indexOf(searchStart, pos);
    if (startPos === -1) { result += c.substring(pos); break; }
    
    const innerStart = startPos + searchStart.length;
    const svgEndIdx = c.indexOf('</svg>', innerStart);
    if (svgEndIdx === -1) { result += c.substring(pos, innerStart); pos = innerStart; continue; }
    
    const afterEnd = svgEndIdx + 6;
    let closingPos = -1;
    for (let i = afterEnd; i < Math.min(afterEnd + 6, c.length); i++) {
      if (c[i] === "'" || c[i] === '"') { closingPos = i; break; }
    }
    if (closingPos === -1) { result += c.substring(pos, innerStart); pos = innerStart; continue; }
    
    const svgInner = c.substring(innerStart, svgEndIdx);
    const afterQuote = c.substring(closingPos);
    
    // Replace ' attribute delimiters with "
    // But be careful: ' in TXT content (like "Фото скоро будет") should stay as '
    // Strategy: replace patterns like  attrname='value'   except inside <text>...</text> content
    
    // Simple approach: replace all \' → \" and then standalone ' between > and <
    let fixed = svgInner;
    
    // 1. width=\'400\' → width="400"
    fixed = fixed.replace(/\\'/g, '"');

    // 2. Standalone single-quote SVG attribute delimiters: 'digit' or 'string'
    // Pattern: space-or-tag-char, attr-name chars, =', value, '
    // But text content like >Фото скоро будет< doesn't have this pattern
    // Replace  attr='value' pattern
    fixed = fixed.replace(/(\s|=)(')([^']+?)(')/g, (m, pre, q1, val, q2) => {
      // If inside <text>...</text>, don't change
      return pre + '="' + val + '"';
    });
    
    // 3. Also fix standalone attrs without space before them  
    fixed = fixed.replace(/([a-zA-Z])='([^']+?)'/g, '$1="$2"');
    
    // 4. Any remaining unescaped lone ' that is an attr delimiter
    // pattern: whitespace before ' followed by non-quote content then another '
    fixed = fixed.replace(/\s+'([^']+?)'/g, (m, val) => ' "' + val + '"');
    
    if (fixed !== svgInner) {
      changed = true;
    }
    
    result += c.substring(pos, innerStart) + fixed + '</svg>' + afterQuote;
    pos = closingPos + 1;
  }
  
  if (changed) {
    fs.writeFileSync(p, result, 'utf8');
    console.log(p + ': FIXED');
  } else {
    console.log(p + ': no changes');
  }
}
