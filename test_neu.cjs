const fs = require('fs');
const vm = require('vm');

const file = 'src/data/neupravlyaemye-stoechnye.js';
const content = fs.readFileSync(file, 'utf8');

// Используем vm для парсинга — работает с любым валидным JS
try {
  const ctx = {};
  const sandbox = { __export: ctx };
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);
  const data = sandbox.__export;
  console.log('Vm ok:', Object.keys(data)[0], 'items count:', Object.values(data)[0]?.length);
} catch(e) {
  console.log('Vm error:', e.message.substring(0, 80));
}

// Прыгаем: ищем массив через = [...]
const eqIdx = content.indexOf('= [');
const startIdx = content.indexOf('[', eqIdx);
const arr = content.substring(startIdx);

function convertJSArray(arrContent) {
  let i = 0;
  const out = [];
  let inStr = false, strDelim = '';
  let inLC = false, inBC = false;

  while (i < arrContent.length) {
    const ch = arrContent[i];
    const n = arrContent[i+1];

    if (inBC) { if (ch === '*' && n === '/') { out.push('  '); i += 2; inBC = false; continue; } out.push(' '); i++; continue; }
    if (inLC) { if (ch === '\n') { inLC = false; out.push('\n'); } else { out.push(' '); } i++; continue; }
    if (!inStr) {
      if (ch === '/' && n === '/') { inLC = true; i += 2; continue; }
      if (ch === '/' && n === '*') { inBC = true; i += 2; continue; }
    }

    if (inStr) {
      if (ch === strDelim) {
        // Check if this is end of string or internal attribute quote like ="http..."
        const after = arrContent.substring(i + 1);
        // If next is "=" then the string continues (SVG attribute)
        if (after.startsWith('"') || after.startsWith('/')) {
          out.push('\\"'); i++; continue;
        }
        inStr = false;
        out.push(ch);
        i++;
        continue;
      }
      if (ch === '\\' && n) { out.push(ch); i++; out.push(n); i++; continue; }
      out.push(ch); i++;
      continue;
    }

    if (ch === '"' || ch === "'") { inStr = true; strDelim = ch; out.push(ch); i++; continue; }
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[\n\r,\s]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') {
      const nx = arrContent[i+1];
      if (nx === ']' || nx === '}') { i++; continue; }
      // Skip trailing comma
      if (nx === '\n' && /[\}\]]/.test(arrContent[i+2]||'')) { i++; continue; }
      out.push(ch); i++; continue;
    }
    out.push(ch); i++;
  }
  return out.join('');
}

const jsonStr = convertJSArray(arr);
try {
  const items = JSON.parse(jsonStr);
  console.log('✅ Parser ok, items:', items.length);
  console.log('First item title:', items[0]?.title);
} catch(e) {
  console.log('Parser error:', e.message.substring(0, 100));
  const m = e.message.match(/at position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Context:', JSON.stringify(jsonStr.substring(Math.max(0,pos-5), pos+15)));
  }
}
