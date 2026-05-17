const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const eqIdx = c.indexOf('= [');
const startIdx = c.indexOf('[', eqIdx);
const content = c.substring(startIdx);

// Find image field and show raw chars
const imgIdx = content.indexOf('"image"');
const valueStart = content.indexOf(':', imgIdx) + 1;
const strStart = content.indexOf('"', valueStart);
const rawDataStart = content.indexOf(',<svg', strStart);

// Show chars around xmlns with raw char codes
console.log('Chars around http:');
const httpIdx = content.indexOf('http', rawDataStart);
for (let i = httpIdx - 10; i < httpIdx + 20; i++) {
  console.log(i.toString().padStart(3), content[i], content.charCodeAt(i).toString(16));
}
