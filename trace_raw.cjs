const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');

// Show raw bytes at position 200-220 (around the "articul" and "title" fields)
console.log('Position 200-230:');
for (let i = 200; i < 230; i++) {
  process.stdout.write(i.toString().padStart(3) + ':' + c.charCodeAt(i).toString(16).padStart(2, '0') + ' ');
}
console.log();
console.log('Raw text:', JSON.stringify(c.substring(200, 230)));

// Show raw bytes at position 260-280 (around "xmlns=")
console.log('\nPosition 260-280:');
for (let i = 260; i < 280; i++) {
  process.stdout.write(i.toString().padStart(3) + ':' + c.charCodeAt(i).toString(16).padStart(2, '0') + ' ');
}
console.log('\nRaw text:', JSON.stringify(c.substring(260, 280)));
