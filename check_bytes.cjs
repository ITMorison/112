const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
// Check byte-by-byte around the image field
const idx = c.indexOf('"image"');
const snippet = c.substring(idx+10, idx+70);
console.log('Hex dump of image field:');
for (let i = 0; i < snippet.length; i++) {
  console.log(snippet.charCodeAt(i).toString(16), String.fromCharCode(snippet.charCodeAt(i)));
}
