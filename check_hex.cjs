const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const search = '"image"';
const idx = c.indexOf(search);
console.log('Found at:', idx);
console.log('Hex from idx+8 to idx+60:');
const slice = c.substring(idx+8, idx+60);
for (let i = 0; i < slice.length; i++) {
  process.stdout.write(slice.charCodeAt(i).toString(16).padStart(2, '0') + ' ');
}
console.log('\nText:', slice);
