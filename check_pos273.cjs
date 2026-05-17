const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const startIdx = c.indexOf('[');
const endIdx = c.lastIndexOf(']');
const arr = c.substring(startIdx, endIdx + 1);

console.log('Position 270-280:');
for (let i = 268; i < 280; i++) {
  process.stdout.write(i.toString().padStart(3) + ':' + arr.charCodeAt(i).toString(16).padStart(2, '0') + ' ');
}
console.log('\nPosition 273:', JSON.stringify(arr[273]));
