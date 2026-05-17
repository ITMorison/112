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
      if (ch === '\\' && arrContent[i+1]) {
        out.push(ch); i++; out.push(arrContent[i]); i++;
        continue;
      }
      if (ch === strDelim) {
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
    out.push(ch); i++;
  }
  return out.join('');
}

const jsonStr = convertBrokenJSArray(arr);

// Show chars around pos 252
console.log('jsonStr[245:265]:', JSON.stringify(jsonStr.substring(245, 265)));
