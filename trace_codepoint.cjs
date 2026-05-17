const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const startIdx = c.indexOf('[');
const arr = c.substring(startIdx);

function convertJSArrayToJSON(content) {
  let i = 0;
  const out = [];
  let inStr = false, strDelim = '';
  let inLineComment = false, inBlockComment = false;

  while (i < content.length) {
    const ch = content[i];
    if (inBlockComment) {
      out.push(' ');
      if (ch === '*' && content[i+1] === '/') { out.push(' '); i += 2; inBlockComment = false; continue; }
      i++; continue;
    }
    if (inLineComment) {
      if (ch === '\n') { inLineComment = false; out.push('\n'); }
      else { out.push(' '); }
      i++; continue;
    }
    if (!inStr) {
      if (ch === '/' && content[i+1] === '/') { inLineComment = true; i += 2; continue; }
      if (ch === '/' && content[i+1] === '*') { inBlockComment = true; i += 2; continue; }
    }
    if (inStr) {
      if (ch === strDelim) {
        const after = content.substring(i + 1);
        if (after.match(/^(h(ttps?|ref)|<[/!]|[#0-9a-f])/i)) {
          out.push('\\"'); i++; continue;
        }
        inStr = false;
        out.push(ch); i++; continue;
      }
      if (ch === '\\' && content[i+1]) {
        out.push(ch); i++; out.push(content[i]); i++;
        continue;
      }
      out.push(ch); i++; continue;
    }
    if (ch === '"' || ch === "'") { inStr = true; strDelim = ch; out.push(ch); i++; continue; }
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[\n\r,\s]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') {
      if (content[i+1] === ']' || content[i+1] === '}') { i++; continue; }
      out.push(ch); i++; continue;
    }
    out.push(ch); i++;
  }
  return out.join('');
}

const jsonStr = convertJSArrayToJSON(arr);

// Show detailed hex for positions 295-315
console.log('Hex dump jsonStr[295:315]:');
for (let i = 295; i < 316 && i < jsonStr.length; i++) {
  console.log(i.toString().padStart(3) + ':', jsonStr.charCodeAt(i).toString(16).padStart(2), JSON.stringify(jsonStr[i]));
}

console.log('\nDirect slice:');
console.log(jsonStr.substring(295, 316));
