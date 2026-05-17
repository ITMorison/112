const fs = require('fs');

function jsToJSON(content) {
  let i = 0;
  const out = [];
  let inStr = false, strDelim = '', inTemplate = false;
  let inLineComment = false, inBlockComment = false;

  while (i < content.length) {
    const ch = content[i];

    if (inBlockComment) {
      if (ch === '*' && content[i+1] === '/') { out.push('  '); i += 2; continue; }
      out.push(' '); i++; continue;
    }
    if (inLineComment) {
      if (ch === '\n') { inLineComment = false; out.push('\n'); }
      else { out.push(' '); }
      i++; continue;
    }
    if (!inStr && !inTemplate) {
      if (ch === '/' && content[i+1] === '/') { inLineComment = true; i += 2; continue; }
      if (ch === '/' && content[i+1] === '*') { inBlockComment = true; i += 2; continue; }
    }

    if (inStr) {
      out.push(ch);
      if (ch === '\\' && content[i+1]) { i++; out.push(content[i]); }
      else if (ch === strDelim) { inStr = false; }
      i++; continue;
    }

    if (inTemplate) {
      if (ch === '`') { inTemplate = false; out.push(ch); i++; continue; }
      if (ch === '\\' && content[i+1]) { out.push(ch); i++; out.push(content[i]); i++; continue; }
      if (ch === '$' && content[i+1] === '{') { out.push('$'); i += 2; continue; }
      out.push(ch); i++; continue;
    }

    if (ch === '"' || ch === "'") {
      inStr = true; strDelim = ch; out.push(ch); i++; continue;
    }
    if (ch === '`') { inTemplate = true; out.push(ch); i++; continue; }
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[,\n\r]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') {
      const next2 = content.substring(i+1, i+3);
      if (next2.startsWith('}') || next2.startsWith(']')) { i++; continue; }
      out.push(ch); i++; continue;
    }

    out.push(ch); i++;
  }

  return out.join('');
}

const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const startIdx = c.indexOf('[');
const arr = c.substring(startIdx);

const jsonStr = jsToJSON(arr);

console.log('Trying to parse...');
try {
  const items = JSON.parse(jsonStr);
  console.log('✅ Items:', items.length);
  console.log('First image preview:', items[0]?.image?.substring(0, 30));
} catch(e) {
  console.log('❌:', e.message.substring(0, 120));
  // Find error pos and show context
  const m = e.message.match(/at position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Error at pos', pos, ':', JSON.stringify(jsonStr.substring(Math.max(0,pos-10), pos+10)));
  }
}
