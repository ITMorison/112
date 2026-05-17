// Simulate the original eval approach
const fs = require('fs');
const content = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const startIdx = content.indexOf('[');
const endIdx = content.lastIndexOf(']');
const jsonData = content.substring(startIdx, endIdx + 1);

console.log('jsonData[0:80]:', JSON.stringify(jsonData.substring(0, 80)));
console.log('Has db header:', jsonData.includes('"export'));
console.log('Has multi-line:', jsonData.includes('\n'));

// The problem: this has "http://" inside "..." → invalid JS/JSON
console.log('Has xmlns:', jsonData.includes('xmlns'));

// What Functions sees
try {
  const val = (new Function(`return (${jsonData})`))();
  console.log('OK length:', val.length);
} catch(e) {
  console.log('Fn err:', e.message);
}
