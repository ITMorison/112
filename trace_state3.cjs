const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const eqIdx = c.indexOf('= [');
const startIdx = c.indexOf('[', eqIdx);
const content = c.substring(startIdx);

// Show raw chars 63-78
console.log('content[63:80]:');
let contentChars = '';
for (let i = 63; i < 80; i++) {
  contentChars += content[i];
  process.stdout.write(`  ${content[i]}(0x${content.charCodeAt(i).toString(16)})`);
}
console.log();
console.log('Content chars as string:', contentChars);

// Now run the simplified state machine
let depth = 0, inString = false, stringChar = '';
const result = [];
for (let i = 0; i < content.length; i++) {
  const ch = content[i];
  if (inString) {
    result.push(ch);
    if (ch === '\\') { i++; result.push(content[i] || ''); }
    else if (ch === stringChar) { inString = false; }
    continue;
  }
  if (ch === '"' || ch === "'" || ch === '`') {
    inString = true; stringChar = ch; result.push(ch); continue;
  }
  if (ch === '[' || ch === '{') { depth++; result.push(ch); continue; }
  if (ch === ']' || ch === '}') { depth--; result.push(ch); if (depth === 0) break; continue; }
  result.push(ch);
}

const resultStr = result.join('');
console.log('\nresult[63:80]:');
let resultChars = '';
for (let i = 63; i < 80; i++) {
  resultChars += resultStr[i];
  process.stdout.write(`  ${resultStr[i]}(0x${resultStr.charCodeAt(i).toString(16)})`);
}
console.log('\nResult chars as string:', resultChars);

// Check if there's a backslash before xmlns"
console.log('\nHas \\"http at pos 67:', resultStr.substring(60, 90).includes('\\"http'));
console.log('Has http at pos 67:', resultStr.substring(60, 90).includes('http'));
