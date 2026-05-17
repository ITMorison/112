const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const startIdx = c.indexOf('[');
const endIdx = c.lastIndexOf(']');
const arr = c.substring(startIdx, endIdx + 1);

// Show all occurrences of 22 (") in first 500 chars
console.log('Finding " chars in arr[0:500]:');
const lines = [];
for (let i = 0; i < 500 && i < arr.length; i++) {
  if (arr.charCodeAt(i) === 0x22) {
    lines.push(`pos ${i}: "${arr.substring(Math.max(0,i-30), i+30).replace(/\n/g,'↵')}"`);
  }
}
console.log(lines.slice(0, 15).join('\n'));
