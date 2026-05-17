const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const eqIdx = c.indexOf('= [');
const startIdx = c.indexOf('[', eqIdx);
const content = c.substring(startIdx);

// Show raw chars 63-78
console.log('content[63:80]:');
for (let i = 63; i < 80; i++) {
  process.stdout.write(`  ${content[i]}(0x${content.charCodeAt(i).toString(16)})`);
}
console.log();

// Now trace the state machine output for these same positions
let inString = false, stringChar = '';
const result = [];
for (let i = 0; i < content.length; i++) {
  if (inString) {
    if (content[i] === '\\') { i++; result.push(content[i] || ''); continue; }
    if (content[i] === stringChar) { inString = false; result.push(content[i]); continue; }
    result.push(content[i]);
    continue;
  }
  if (content[i] === '"' || content[i] === "'" || content[i] === '`') {
    inString = true; stringChar = content[i]; result.push(content[i]); continue;
  }
  if (content[i] === '[' || content[i] === '{') { result.push(content[i]); continue; }
  if (content[i] === ']' || content[i] === '}') {
    result.push(content[i]);
    if (content.slice(0, i).split('').filter(c => !inString || c !== stringChar).reduce((d, c) => {
      if ('[{'.includes(c)) return d + 1;
      if ']}'.includes(c) return d - 1;
      return d;
    }, 0) === 0) break;
    continue;
  }
  result.push(content[i]);
}
const resultStr = result.join('');
console.log('result[63:80]:');
for (let i = 63; i < 80; i++) {
  process.stdout.write(`  ${resultStr[i]}(0x${resultStr.charCodeAt(i).toString(16)})`);
}
console.log();
