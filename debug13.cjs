const fs = require('fs');
const DEBUG = true;
const p = 'src/data/mesh-системы.js';
const line12 = fs.readFileSync(p, 'utf8').split(/\r?\n/)[12];
console.log('line13 in mesh:', JSON.stringify(line12));
const blobStart = line12.indexOf('"image": "data:image/svg+xml,');
console.log('blobStart:', blobStart); // Expected: 4 or similar

if (blobStart >= 0) {
  const PREFIX = '"image": "data:image/svg+xml,';
  const PREFIX_LEN = PREFIX.length;
  console.log('prefix:', JSON.stringify(PREFIX), 'PREFIX_LEN:', PREFIX_LEN);
  console.log('char at blobStart   :', JSON.stringify(line12[blobStart]));
  console.log('char at blobStart+26:', JSON.stringify(line12[blobStart+26]));
  console.log('char at blobStart+27:', JSON.stringify(line12[blobStart+27]));
  console.log('prefix match at blobStart?', line12.substring(blobStart, blobStart+PREFIX_LEN) === PREFIX);
}
