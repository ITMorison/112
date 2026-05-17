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

    // Inside string
    if (inStr) {
      if (ch === '\\' && n) { out.push(ch); i++; out.push(n); i++; continue; }
      if (ch === strDelim) {
        // Признаки конца строки: за " идет , } ] \n \r или конец текста
        const isEnd = !n || /[,\}\]]/.test(n) || n === '\n' || n === '\r';
        if (isEnd) {
          inStr = false;
          out.push(ch);
          i++;
          continue;
        }
        // Внутренняя кавычка SVG атрибута: ="http или ="< или ="/
        if (n === '=') {
          const nn = arrContent[i+2] || '';
          if (/^[h<#\/\w]/.test(nn)) {
            out.push('=\\"'); i += 2; continue;
          }
        }
        // Обычная внутренняя кавычка в значении
        out.push('\\"');
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
      out.push(ch); i++; continue;
    }
    out.push(ch); i++;
  }
  return out.join('');
}

const jsonStr = convertJSArray(arr);

console.log('Try parse...');
try {
  const items = JSON.parse(jsonStr);
  console.log('✅ Items:', items.length);
  console.log('Image (first 80):', items[0]?.image?.substring(0, 80));
} catch(e) {
  console.log('❌', e.message.substring(0, 120));
  const m = e.message.match(/at position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Context at', pos, ':', JSON.stringify(jsonStr.substring(Math.max(0,pos-10), pos+12)));
  }
}
