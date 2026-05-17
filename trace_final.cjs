const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');
const startIdx = c.indexOf('[');
const arr = c.substring(startIdx);

// Direct inject of the = http check
let i = 0;
const out = [];
let inStr = false, strDelim = '';
let inLineComment = false, inBlockComment = false;

while (i < arr.length) {
  const ch = arr[i];
  if (inBlockComment) {
    if (ch === '*' && arr[i+1] === '/') { out.push('  '); i += 2; inBlockComment = false; continue; }
    out.push(' '); i++; continue;
  }
  if (inLineComment) {
    if (ch === '\n') { inLineComment = false; out.push('\n'); }
    else { out.push(' '); }
    i++; continue;
  }
  if (!inStr) {
    if (ch === '/' && arr[i+1] === '/') { inLineComment = true; i += 2; continue; }
    if (ch === '/' && arr[i+1] === '*') { inBlockComment = true; i += 2; continue; }
  }
  if (inStr) {
    if (ch === '=' && arr[i+1] === '"') {
      // CRITICAL: "=" appears inside a string context, followed by a '"'
      out.push('="'); i += 2; continue;  // KEEP as ="
    }
    if (ch === '=' && /[h#]/.test(arr[i+1] || '')) {
      // =<http or =<tagstart → insert escape \"
      out.push('=\\"'); i += 2; continue;
    }
    if (ch === '\\' && arr[i+1]) {
      out.push(ch); i++; out.push(arr[i]); i++;
      continue;
    }
    if (ch === strDelim) {
      inStr = false;
      out.push(ch);
      i++;
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
    if (arr[i+1] === ']' || arr[i+1] === '}') { i++; continue; }
    out.push(ch); i++; continue;
  }
  out.push(ch); i++;
}

const jsonStr = out.join('');
console.log('Final string[240:265]:');
for (let pos = 240; pos < 266 && pos < jsonStr.length; pos++) {
  console.log(pos.toString().padStart(3) + ':' + jsonStr.charCodeAt(pos).toString(16).padStart(2) + ' ' + JSON.stringify(jsonStr[pos]));
}

try { JSON.parse(jsonStr); console.log('JSON OK');} catch(e) {
  console.log('Error:', e.message.substring(0, 100));
}
