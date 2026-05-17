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
      if (ch === '=' && n === '"') {
        const after = arrContent.substring(i + 2, i + 6).toLowerCase();
        if (/^[h<#\w]/.test(after)) {
          out.push('=\\"'); i += 2; continue;
        }
      }
      if (ch === strDelim && n && /[a-z\/]/.test(n) && nn !== '=' && nn !== ' ' && nn !== ',') {
        out.push('\\"'); i++; continue;
      }
      if (ch === '\\' && n) { out.push(ch); i++; out.push(n); i++; continue; }
      if (ch === strDelim) {
        inStr = false;
        out.push(ch);
        i++;
        continue;
      }
      out.push(ch); i++;
      continue;
    }

    if (ch === '"' || ch === "'") { inStr = true; strDelim = ch; out.push(ch); i++; continue; }
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[\n\r,\s]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') {
      if (n === ']' || n === '}') { i++; continue; }
      out.push(ch); i++; continue;
    }
    out.push(ch); i++;
  }
  return out.join('');
}

const jsonStr = convertJSArray(arr);

// Show wide context from 260 to 310
console.log('jsonStr[260:310] (raw):');
for (let i = 260; i < 311 && i < jsonStr.length; i++) {
  process.stdout.write(jsonStr[i] === '\\' ? '\\\\' : jsonStr[i]);
}
console.log();
