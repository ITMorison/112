const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const idx = c.indexOf('"image"');
console.log('Found at index:', idx);
console.log(c.substring(idx, idx + 300));
