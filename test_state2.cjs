const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const startIdx = c.indexOf('[');
const arr = c.substring(startIdx);

// Run jsToJSON and save result
function convertJSArrayToJSON(content) {
  let i = 0;
  const out = [];
  let inStr = false, strDelim = '';
  let inLineComment = false, inBlockComment = false;

  while (i < content.length) {
    const ch = content[i];
    if (inBlockComment) {
      out.push(' ');
      if (ch === '*' && content[i+1] === '/') { out.push(' '); i += 2; inBlockComment = false; continue; }
      i++; continue;
    }
    if (inLineComment) {
      if (ch === '\n') { inLineComment = false; out.push('\n'); }
      else { out.push(' '); }
      i++; continue;
    }
    if (!inStr) {
      if (ch === '/' && content[i+1] === '/') { inLineComment = true; i += 2; continue; }
      if (ch === '/' && content[i+1] === '*') { inBlockComment = true; i += 2; continue; }
    }
    if (inStr) {
      if (ch === strDelim) {
        const after = content.substring(i + 1);
        if (after.match(/^(h(ttps?|ref)|<[/!]|[#0-9a-f])/i)) {
          out.push('\\"'); i++; continue;
        }
        inStr = false;
        out.push(ch); i++; continue;
      }
      if (ch === '\\' && content[i+1]) {
        out.push(ch); i++; out.push(content[i]); i++;
        continue;
      }
      out.push(ch); i++; continue;
    }
    if (ch === '"' || ch === "'") { inStr = true; strDelim = ch; out.push(ch); i++; continue; }
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[\n\r,\s]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') {
      if (content[i+1] === ']' || content[i+1] === '}') { i++; continue; }
      out.push(ch); i++; continue;
    }
    out.push(ch); i++;
  }
  return out.join('');
}

const jsonStr = convertJSArrayToJSON(arr);
console.log('jsonStr length:', jsonStr.length);
console.log('jsonStr[295:310]:', JSON.stringify(jsonStr.substring(295, 310)));
console.log('jsonStr[300:315]:', JSON.stringify(jsonStr.substring(300, 315)));

console.log('\nTrying JSON.parse...');
try {
  const items = JSON.parse(jsonStr);
  console.log('✅ Items:', items.length);
} catch(e) {
  console.log('❌ Error:', e.message);
}

// Also save for examination
fs.writeFileSync('/tmp/test_json.json', jsonStr);
