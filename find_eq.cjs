const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');
const imgIdx = c.indexOf('"image"');
console.log('image at:', imgIdx);

// Look for = followed by " image field area
const area = c.substring(imgIdx, imgIdx + 80);
console.log('Area:', JSON.stringify(area));

// Find = before " in substring
const eqIdxInArea = area.indexOf('="');
console.log('eqIdxInArea:', eqIdxInArea);
console.log('Chars around it:', JSON.stringify(area.substring(eqIdxInArea, eqIdxInArea + 30)));

// Show raw bytes
console.log('Bytes in area:');
for (let i = 0; i < Math.min(80, area.length); i++) {
  if (i < 5 || i === eqIdxInArea || i === eqIdxInArea+1 || i === eqIdxInArea+2 || i > Math.max(0, eqIdxInArea-2)) {
    process.stdout.write(i.toString().padStart(2) + ':' + area.charCodeAt(i).toString(16).padStart(2) + ' ');
  }
}
console.log();
