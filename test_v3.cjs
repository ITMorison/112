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
        const next = cleaned[i+1] || '';
        // End of string if next is structural JSON char or : (key: value) or end
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

const files = ['setevye-patch-kordy.js', 'neupravlyaemye-stoechnye.js'];
let loaded = 0, failed = 0;

files.forEach(f => {
  const content = fs.readFileSync('src/data/' + f, 'utf8');
  const arr = parseArrayLiteral(content);
  if (!arr) { failed++; return; }
  try {
    const items = JSON.parse(arr);
    console.log('✅', f.padEnd(45), items.length, 'items');
    loaded += items.length;
  } catch(e) {
    console.log('❌', f.padEnd(45), e.message.substring(0, 80));
    failed++;
  }
});
