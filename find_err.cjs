const fs = require('fs');

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
        const next2 = cleaned.substring(i+1, i+3);
        const next = cleaned[i+1] || '';
        const isRealEnd = /[,\}\]]/.test(next) || next === '\n' || next === '\r' || !next || next === ':';
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

const c = fs.readFileSync('src/data/setevye-patch-kordy.js', 'utf8');
const startIdx = c.indexOf('[');
const arr = c.substring(startIdx);
const safe = parseArrayLiteral(c);

try {
  const items = JSON.parse(safe);
  console.log('✅ Items:', items.length);
} catch(e) {
  const m = e.message.match(/at position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Context at', pos, ':', JSON.stringify(safe.substring(Math.max(0,pos-10), pos+15)));
    console.log('Raw at', pos, ':', JSON.stringify(arr.substring(Math.max(0,pos-10), pos+15)));
  }
}
