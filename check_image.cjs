const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'data', '16-канальные-hd-видеорегистраторы.js');
const content = fs.readFileSync(filePath, 'utf8');

// Find array boundaries
const startIdx = content.indexOf('[');
const endIdx = content.lastIndexOf(']');
const arr = content.substring(startIdx, endIdx + 1);

// Find image field to examine what's really inside the string
const imgIdx = arr.indexOf('"image"');
const fieldStart = arr.indexOf('"', arr.indexOf(':', imgIdx) + 1);
const fieldContent = arr.substring(fieldStart);

console.log('Field content (first 300):');
for (let i = 0; i < 300; i++) {
  process.stdout.write(fieldContent[i] === '"' ? '\\"' : fieldContent[i]);
}
