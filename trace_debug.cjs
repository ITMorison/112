const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const startIdx = c.indexOf('[');
const arr = c.substring(startIdx);

// Run jsToJSON with debug output at position 270
function jsToJSONDebug(content, debugStart = 260) {
  let i = 0;
  const out = [];
  let inStr = false, strDelim = '';
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
    if (!inStr) {
      if (ch === '/' && content[i+1] === '/') { inLineComment = true; i += 2; continue; }
      if (ch === '/' && content[i+1] === '*') { inBlockComment = true; i += 2; continue; }
    }

    if (inStr) {
      if (i >= debugStart && i < debugStart + 30) {
        console.log(`  [inStr] i=${i} ch="${ch}"(0x${content.charCodeAt(i).toString(16)}) delim="${strDelim}"`);
      }
      out.push(ch);
      if (ch === '\\' && content[i+1]) { i++; out.push(content[i]); }
      else if (ch === strDelim) { inStr = false; }
      i++; continue;
    }

    if (ch === '"' || ch === "'") {
      if (i >= debugStart && i < debugStart + 30) console.log(`  [openStr] i=${i} ch="${ch}"`);
      inStr = true; strDelim = ch; out.push(ch); i++; continue;
    }
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[,\n\r]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') {
      const nx = content[i+1];
      if (nx === '}' || nx === ']') { i++; continue; }
      out.push(ch); i++; continue;
    }
    out.push(ch); i++;
  }
  return out.join('');
}

const jsonStr = jsToJSONDebug(arr, 260);

console.log('\nOutput chars 270-285:');
for (let i = 270; i < 286 && i < jsonStr.length; i++) {
  process.stdout.write(`${jsonStr[i]}(0x${jsonStr.charCodeAt(i).toString(16)}) `);
}
console.log();
