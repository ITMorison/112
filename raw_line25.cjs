const fs = require('fs');
const f = 'src/data/mesh-системы.js';
const line25 = fs.readFileSync(f, 'utf8').split('\n')[24];
console.log('Line 25:', JSON.stringify(line25));
