const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');

// Show ALL char codes from 74 to 90
console.log('All chars 74-90:');
for (let i = 74; i < 92; i++) {
  console.log(`  ${i}`, c[i], '(0x' + c.charCodeAt(i).toString(16) + ')');
}
