const fs = require('fs');
const path = require('path');

// Handle .mjs files by loading as CommonJS via vm
const vm = require('vm');
const filePath = path.join(__dirname, 'src', 'data', '16-канальные-hd-видеорегистраторы.js');
const content = fs.readFileSync(filePath, 'utf8');

// The file is valid JS — let's verify byte-by-byte around xmlns
const xmlnsIdx = content.indexOf('xmlns=');
console.log('Around xmlns:', JSON.stringify(content.substring(xmlnsIdx, xmlnsIdx + 40)));
console.log('Hex around xmlns:');
const slice = content.substring(xmlnsIdx, xmlnsIdx + 40);
for (let i = 0; i < slice.length; i++) {
  console.log(slice.charCodeAt(i).toString(16), String.fromCharCode(slice.charCodeAt(i)));
}
