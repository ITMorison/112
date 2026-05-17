const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');
// Show hex at start of file
console.log('First 30 bytes:');
for (let i = 0; i < 30; i++) {
  console.log(i.toString().padStart(2) + ':' + c.charCodeAt(i).toString(16).padStart(2), String.fromCharCode(c.charCodeAt(i)));
}

// Show hex right before "articul"
const artIdx = c.indexOf('"articul"');
console.log('\nAround "articul":');
for (let i = Math.max(0,artIdx-5); i < artIdx+10; i++) {
  console.log(i.toString().padStart(3) + ':' + c.charCodeAt(i).toString(16).padStart(2), String.fromCharCode(c.charCodeAt(i)));
}
