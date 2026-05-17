const fs = require('fs');

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
        // Check if this bare " opens a new string context (like ="http://...")
        // by looking at what follows - if it looks like SVG/data fragment
        if (after.match(/^(h(ttps?|ref)|<[/!]|[#0-9a-f])/i)) {
          out.push('\\"');  // escape it
          i++;
          continue;
        }
        inStr = false;
        out.push(ch);
        i++;
        continue;
      }
      if (ch === '\\' && content[i+1]) {
        out.push(ch); i++; out.push(content[i]); i++;
        continue;
      }
      out.push(ch); i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inStr = true; strDelim = ch; out.push(ch); i++; continue;
    }
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

const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const startIdx = c.indexOf('[');
const arr = c.substring(startIdx);
const jsonStr = convertJSArrayToJSON(arr);

try {
  const items = JSON.parse(jsonStr);
  console.log('✅ Items:', items.length);
  console.log('Image:', items[0]?.image?.substring(0, 60));
} catch(e) {
  console.log('❌ Error:', e.message.substring(0, 120));
  const m = e.message.match(/at position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Context at', pos, ':', JSON.stringify(jsonStr.substring(Math.max(0,pos-10), pos+10)));
  }
}
