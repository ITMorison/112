const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');
const imgIdx = c.indexOf('"image"');
console.log('image field found at:', imgIdx);
console.log('Chars before image value:');
const imageStart = c.indexOf('"', c.indexOf(':', imgIdx) + 1);
for (let i = imageStart - 5; i < imageStart + 40; i++) {
  process.stdout.write(i.toString().padStart(3) + ':' + c.charCodeAt(i).toString(16).padStart(2,'0') + ' ');
}
console.log('\nRaw:', JSON.stringify(c.substring(imageStart, imageStart + 40)));

// Find the xmlns in image
const xmlnsIdx = c.indexOf('xmlns=', imgIdx);
console.log('\nXmlns in file at:', xmlnsIdx);
if (xmlnsIdx >= 0) {
  for (let i = xmlnsIdx; i < xmlnsIdx + 30; i++) {
    process.stdout.write(c.charCodeAt(i).toString(16).padStart(2,'0') + ' ');
  }
}
console.log('\nXmlns raw:', xmlnsIdx >= 0 ? JSON.stringify(c.substring(xmlnsIdx, xmlnsIdx + 30)) : 'not found');
