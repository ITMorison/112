const vm = require('vm');
const fs = require('fs');
const content = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
console.log('First 50 chars:', JSON.stringify(content.substring(0, 50)));
// Run as-is in vm
try {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);
  console.log('Parsed OK, items:', sandbox['16_КАНАЛЬНЫЕ_HD_ВИДЕОРЕГИСТРАТОРЫ'].length);
} catch(e) {
  console.log('Error:', e.message);
}
