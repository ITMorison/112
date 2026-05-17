const fs = require('fs');

const files = [
  'neupravlyaemye-stoechnye.js',
  '16-канальные-hd-видеорегистраторы.js',
  'setevye-patch-kordy.js'
];

function parseJSArraySafe(content) {
  let i = 0;
  const out = [];
  let inStr = false, strDelim = '';
  let inLC = false, inBC = false;
  let depth = 0; // bracket depth for array

  while (i < content.length) {
    const ch = content[i];
    const n = content[i+1];
    const nn = content[i+2];

    // Comments
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
      // Escape sequences
      if (ch === '\\' && n) {
        out.push('\\'); out.push(n); i += 2; continue;
      }
      // End of string?
      if (ch === strDelim) {
        const next = content[i+1] || '';
        // End of string if next is , } ] \n \r
        const isRealEnd = /[,\}\]]/.test(next) || next === '\n' || next === '\r' || !next;
        if (isRealEnd) {
          inStr = false;
          out.push(ch);
          i++;
          continue;
        }
        // =<something — this is an internal SVG attribute that continues the string
        if (n === '=' && nn && /[h<#\/\w]/.test(nn)) {
          out.push('=\\"'); i += 2; continue;
        }
        // Any other bare " inside a string value is internal — escape it
        out.push('\\"'); i++; continue;
      }
      // Newlines inside string become \n escape
      if (ch === '\n') { out.push('\\n'); i++; continue; }
      if (ch === '\r') { out.push('\\r'); i++; continue; }
      out.push(ch); i++;
      continue;
    }

    // Start array
    if (ch === '[') {
      out.push(ch); depth++; i++; continue;
    }

    // End array — stop here
    if (ch === ']') {
      out.push(ch); depth--; i++; 
      if (depth === 0) break;
      continue;
    }

    // Start string
    if (ch === '"' || ch === "'") {
      inStr = true;
      strDelim = ch;
      out.push(ch);
      i++;
      continue;
    }

    // Keep structural chars
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[\n\r]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') { out.push(ch); i++; continue; }

    out.push(ch); i++;
  }

  return out.join('');
}

let loaded = 0, failed = 0;
files.forEach(f => {
  const content = fs.readFileSync('src/data/' + f, 'utf8');
  
  // Find array
  const eqIdx = content.indexOf('= [');
  const startIdx = content.indexOf('[', eqIdx >= 0 ? eqIdx : 0);
  if (startIdx === -1) { failed++; return; }
  const arrContent = content.substring(startIdx);
  
  const jsonStr = parseJSArraySafe(arrContent);
  
  try {
    const items = JSON.parse(jsonStr);
    console.log('✅', f.padEnd(45), items.length, 'items');
    loaded += items.length;
  } catch(e) {
    console.log('❌', f.padEnd(45), e.message.substring(0, 60));
    failed++;
  }
});

console.log(`\n✅ Loaded: ${loaded} | ❌ Failed: ${failed}`);
