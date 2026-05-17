const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');

// Print hex at 260-280
for (let i = 258; i < 282; i++) {
  process.stdout.write(i.toString().padStart(3) + ':' + c.charCodeAt(i).toString(16).padStart(2,'0') + ' ');
}
console.log();
console.log('Raw chunk:', JSON.stringify(c.substring(258, 282)));

// Also check the beginning of the file (positions 3 (= [))
for (let i = 3; i < 10; i++) {
  process.stdout.write(i.toString().padStart(3) + ':' + c.charCodeAt(i).toString(16).padStart(2,'0') + ' ');
}
console.log('\nFile start chunk:', JSON.stringify(c.substring(0, 12)));
