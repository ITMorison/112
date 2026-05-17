const fs = require('fs');
const c = fs.readFileSync('src/data/setevye-patch-kordy.js', 'utf8');

function parseArrayLiteral(content) {
  let cleaned = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const startIdx = cleaned.indexOf('[');
  if (startIdx === -1) return null;
  let depth = 0, i = startIdx;
  const out = [];
  let inStr = false, strDelim = '';

  while (i < cleaned.length) {
    const ch = cleaned[i];
    const n = cleaned[i+1];
    const nn = cleaned[i+2];

    if (inStr) {
      if (ch === '\\' && n) { out.push('\\'); out.push(n); i += 2; continue; }
      if (ch === strDelim) {
        const next = cleaned[i+1] || '';
        const isRealEnd = /[,\}\]]/.test(next) || next === '\n' || next === '\r' || !next;
        if (isRealEnd) {
          inStr = false;
          out.push(ch);
          i++;
          continue;
        }
        if (n === '=' && nn && /^[h<#\/\w]/.test(nn)) {
          out.push('=\\"'); i += 2; continue;
        }
        out.push('\\"'); i++; continue;
      }
      if (ch === '\n') { out.push('\\n'); i++; continue; }
      if (ch === '\r') { out.push('\\r'); i++; continue; }
      out.push(ch); i++;
      continue;
    }

    if (ch === '[') { out.push(ch); depth++; i++; continue; }
    if (ch === ']') { out.push(ch); depth--; i++; if (depth === 0) break; continue; }
    if (ch === '"' || ch === "'") {
      inStr = true; strDelim = ch; out.push(ch); i++; continue;
    }
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[\n\r]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') { out.push(ch); i++; continue; }
    out.push(ch); i++;
  }

  return out.join('');
}

const arr = c.substring(c.indexOf('['));
const safe = parseArrayLiteral(c);

console.log('safe[0:100]:', JSON.stringify(safe?.substring(0, 100)));
console.log('arr[0:100]:', JSON.stringify(arr.substring(0, 100)));
