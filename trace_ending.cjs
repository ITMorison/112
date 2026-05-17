const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');
const startIdx = c.indexOf('[');
const arr = c.substring(startIdx);

function convertBrokenJSArray(arrContent) {
  let i = 0;
  const out = [];
  let inStr = false, strDelim = '';
  let inLineComment = false, inBlockComment = false;

  while (i < arrContent.length) {
    const ch = arrContent[i];
    if (inBlockComment) {
      if (ch === '*' && arrContent[i+1] === '/') { out.push('  '); i += 2; inBlockComment = false; continue; }
      out.push(' '); i++; continue;
    }
    if (inLineComment) {
      if (ch === '\n') { inLineComment = false; out.push('\n'); }
      else { out.push(' '); }
      i++; continue;
    }
    if (!inStr) {
      if (ch === '/' && arrContent[i+1] === '/') { inLineComment = true; i += 2; continue; }
      if (ch === '/' && arrContent[i+1] === '*') { inBlockComment = true; i += 2; continue; }
    }
    if (inStr) {
      if (ch === '=' && /[h#]/.test(arrContent[i+1] || '')) {
        out.push('=\\"'); i += 2; continue;
      }
      if (ch === '[' && /[h\/#\w]/.test(arrContent[i+1] || '')) {
        // Also = followed by a tag-looking start like <
        out.push('=\"'); i += 2; continue;
      }
      if (ch === '=' && arrContent[i+1] === '"') {
        // "=" followed by another " — leave as is, might be string-closing
        out.push('="'); i += 2; continue;
      }
      if (ch === '\\' && arrContent[i+1]) {
        out.push(ch); i++; out.push(arrContent[i]); i++;
        continue;
      }
      if (ch === strDelim) {
        // Look at context to decide real vs fake end
        const prev = arrContent.substring(Math.max(0, i - 5), i);
        const after = arrContent.substring(i + 1);
        // If the word before this " ends with " (like svg) OR the value looks like an
        // attribute value (followed by space + word), treat " as internal
        const endsWithSvg = /[a-z]"$/.test(prev.trim());
        const followedByWord = /^\s+[a-z]/.test(after);
        
        if (endsWithSvg || followedByWord) {
          // Internal SVG attribute value separator
          i++;
          continue;
        }
        inStr = false;
        out.push(ch);
        i++;
        continue;
      }
      out.push(ch); i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = true; strDelim = ch; out.push(ch); i++; continue;
    }
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[\n\r,\s]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') {
      if (arrContent[i+1] === ']' || arrContent[i+1] === '}') { i++; continue; }
      out.push(ch); i++; continue;
    }
    if (ch === '}') { i++; break; }
    if (ch === ']') { i++; break; }
    out.push(ch); i++;
  }

  return out.join('');
}

const jsonStr = convertBrokenJSArray(arr);

// Show positions 250-265
console.log('jsonStr[250:265]:');
for (let pos = 250; pos < 266 && pos < jsonStr.length; pos++) {
  console.log(pos.toString().padStart(3) + ':' + jsonStr.charCodeAt(pos).toString(16).padStart(2) + ' ' + JSON.stringify(jsonStr[pos]));
}
console.log('Try parse...');
try { JSON.parse(jsonStr); console.log('OK'); } catch (e) {
  console.log('Error:', e.message);
  // Show offset 250-300
  const m = e.message.match(/at position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    for (let j = Math.max(0, pos - 10); j < pos + 10; j++) {
      console.log(j.toString().padStart(3) + ':', j < jsonStr.length ? JSON.stringify(jsonStr[j]) : 'EOF');
    }
  }
}
