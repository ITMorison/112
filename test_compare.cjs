const fs = require('fs');

function parseJSArraySafe(content) {
  let i = 0;
  const out = [];
  let inStr = false, strDelim = '';
  let inLC = false, inBC = false;
  let depth = 0;

  while (i < content.length) {
    const ch = content[i];
    const n = content[i+1];
    const nn = content[i+2];

    if (inBC) {
      if (ch === '*' && n === '/') { out.push('  '); i += 2; inBC = false; continue; }
      out.push(' '); i++; continue;
    }
    if (inLC) {
      if (ch === '\n') { inLC = false; out.push('\n'); } else { out.push(' '); }
      i++; continue;
    }
    if (!inStr) {
      if (ch === '/' && n === '/') { inLC = true; i += 2; continue; }
      if (ch === '/' && n === '*') { inBC = true; i += 2; continue; }
    }

    if (inStr) {
      if (ch === '\\' && n) {
        out.push('\\'); out.push(n); i += 2; continue;
      }
      if (ch === strDelim) {
        const next = content[i+1] || '';
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

    if (ch === '[') {
      out.push(ch); depth++; i++; continue;
    }
    if (ch === ']') {
      out.push(ch); depth--; i++;
      if (depth === 0) break;
      continue;
    }
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
const eqIdx = c.indexOf('= [');
const startIdx = c.indexOf('[', eqIdx >= 0 ? eqIdx : 0);
const arr = c.substring(startIdx);
const safe = parseJSArraySafe(arr);

console.log('safe[0:40]:', JSON.stringify(safe.substring(0, 40)));
console.log('arr[0:40]:', JSON.stringify(arr.substring(0, 40)));

try { JSON.parse(safe); console.log('safe OK'); } catch(e) {
  console.log('safe error:', e.message.substring(0, 80));
}
try { JSON.parse(arr); console.log('arr OK'); } catch(e) {
  console.log('arr error:', e.message.substring(0, 80));
}
