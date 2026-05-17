const fs = require('fs');

// Universal JS array parser that handles:
// 1. Comments (// and /* */)
// 2. =="..." (broken quotes in SVG data-URIs) → =\"...\"  
// 3. Literal newlines inside strings → \n escape
// 4. All normal JS string types
function parseArrayLiteral(content) {
  // 1. Remove comments first
  let cleaned = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 2. Find array
  const startIdx = cleaned.indexOf('[');
  if (startIdx === -1) return null;
  let depth = 0;
  let i = startIdx;
  const out = [];
  let inStr = false, strDelim = '';
  
  while (i < cleaned.length) {
    const ch = cleaned[i];
    const n = cleaned[i+1];
    const nn = cleaned[i+2];

    if (inStr) {
      if (ch === '\\' && n) {
        out.push('\\'); out.push(n); i += 2; continue;
      }
      if (ch === strDelim) {
        // Is this a real end of string?
        const next = cleaned[i+1] || '';
        const isRealEnd = /[,\}\]]/.test(next) || next === '\n' || next === '\r' || !next;
        if (isRealEnd) {
          inStr = false;
          out.push(ch);
          i++;
          continue;
        }
        // ="something" — continue string, escape the inner quote
        if (n === '=' && nn && /^[h<#\/\w]/.test(nn)) {
          out.push('=\\"'); i += 2; continue;
        }
        // Any other bare " inside value — escape it
        out.push('\\"'); i++; continue;
      }
      // Real newline inside string → escape as \n
      if (ch === '\n') { out.push('\\n'); i++; continue; }
      if (ch === '\r') { out.push('\\r'); i++; continue; }
      out.push(ch); i++;
      continue;
    }

    // Bracket tracking
    if (ch === '[') { out.push(ch); depth++; i++; continue; }
    if (ch === ']') { out.push(ch); depth--; i++; if (depth === 0) break; continue; }

    // Start of string
    if (ch === '"' || ch === "'") {
      inStr = true; strDelim = ch; out.push(ch); i++; continue;
    }

    // Pass through other chars
    out.push(ch); i++;
  }

  return out.join('');
}

const files = [
  'neupravlyaemye-stoechnye.js',
  '16-канальные-hd-видеорегистраторы.js',
  'setevye-patch-kordy.js'
];

let loaded = 0, failed = 0;
files.forEach(f => {
  const content = fs.readFileSync('src/data/' + f, 'utf8');
  const arr = parseArrayLiteral(content);
  if (!arr) { failed++; console.log('❌', f, 'no array'); return; }
  
  try {
    const items = JSON.parse(arr);
    console.log('✅', f.padEnd(45), items.length, 'items');
    loaded += items.length;
  } catch(e) {
    console.log('❌', f.padEnd(45), e.message.substring(0, 60));
    failed++;
  }
});

console.log(`\n✅ ${loaded} items loaded, ❌ ${failed} files failed`);
