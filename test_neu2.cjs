const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');

const eqIdx = c.indexOf('= [');
const startIdx = c.indexOf('[', eqIdx);
const arr = c.substring(startIdx);

function convertJSArray(arrContent) {
  let i = 0;
  const out = [];
  let inStr = false, strDelim = '';
  let inLC = false, inBC = false;

  while (i < arrContent.length) {
    const ch = arrContent[i];
    const n = arrContent[i+1];
    const nn = arrContent[i+2];

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

    // Inside string — THIS IS THE KEY FIX
    if (inStr) {
      if (ch === strDelim && n === '"' && nn !== '=' && nn !== ' ') {
        // Pattern: ends with " then "something" — internal SVG/XHTML attr
        out.push('\\"'); i++; continue;
      }
      // Pattern: ="something — fix with =\"
      if (ch === '=' && n === '"') {
        // Look ahead: after =" comes h(ttp) or <(tag) or s(vg) or /(path)
        const after = arrContent.substring(i + 2, i + 6).toLowerCase();
        if (/^[h<#\w]/.test(after)) {
          out.push('=\\"'); i += 2; continue;
        }
      }
      if (ch === '\\' && n) { out.push(ch); i++; out.push(n); i++; continue; }
      if (ch === strDelim) {
        // Real end of string (not internal quote)
        inStr = false;
        out.push(ch);
        i++;
        continue;
      }
      out.push(ch); i++;
      continue;
    }

    // Start of string
    if (ch === '"' || ch === "'") { inStr = true; strDelim = ch; out.push(ch); i++; continue; }
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[\n\r,\s]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') {
      if (n === ']' || n === '}') { i++; continue; }
      if (n === '\n' && /[\}\]]/.test(arrContent[i+2]||'')) { i++; continue; }
      out.push(ch); i++; continue;
    }
    out.push(ch); i++;
  }
  return out.join('');
}

const jsonStr = convertJSArray(arr);

// Show around pos 250
const pos = 252;
console.log('jsonStr[245:265]:');
for (let i = Math.max(0, pos - 10); i < pos + 15 && i < jsonStr.length; i++) {
  console.log(i.toString().padStart(3) + ':', JSON.stringify(jsonStr[i]));
}

console.log('\nTry JSON.parse...');
try {
  const items = JSON.parse(jsonStr);
  console.log('✅ Items:', items.length);
  console.log('Image (first 80):', items[0]?.image?.substring(0, 80));
} catch(e) {
  console.log('❌', e.message.substring(0, 100));
}
