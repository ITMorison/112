const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
console.log('Has "= [":', c.includes('= ['));
console.log('Finds of "=" with bracket:');
for (let i = 0; i < c.length; i++) {
  if (c[i] === '=' && c[i+1] === ' ') {
    console.log(`pos ${i}: "${c.substring(i-5, i+10)}"`);
  }
}
