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
      if (ch === '\\' && n) { out.push(ch); i++; out.push(n); i++; continue; }
      if (ch === strDelim) {
        const isEnd = !n || /[,\}\]]/.test(n) || n === '\n' || n === '\r';
        if (isEnd) {
          inStr = false;
          out.push(ch);
          i++;
          continue;
        }
        if (n === '=') {
          const nn = arrContent[i+2] || '';
          if (/^[h<#\/\w]/.test(nn)) {
            out.push('=\\"'); i += 2; continue;
          }
        }
        out.push('\\"');
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

// Show first 60 chars
console.log('jsonStr[0:60]:');
for (let i = 0; i < 60 && i < jsonStr.length; i++) {
  console.log(i.toString().padStart(2), JSON.stringify(jsonStr[i]));
}

console.log('\nSlice 30-40:');
console.log(JSON.stringify(jsonStr.substring(30, 40)));

console.log('\nRaw arr[0:60]:');
for (let i = 0; i < 60 && i < arr.length; i++) {
  console.log(i.toString().padStart(2), JSON.stringify(arr[i]));
}
