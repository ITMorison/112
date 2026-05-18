const fs = require('fs');
const path = require('path');

const files = [
  'src/new-products.json',
  'src/price1-products.json',
  'src/price2-products.json',
  'src/price3-products.json'
].map((p) => path.join(__dirname, '..', p));

function testTxt(item) {
  return (String(item.name || '') + ' ' + String(item.fullName || '') + ' ' + String(item.category_raw || '')).toLowerCase();
}

let analogCount = 0;
let ipCount = 0;
let hybridCount = 0;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const item of data) {
      const txt = testTxt(item);
      const hasVideo = /видеок|видеорегистрат|видеодомофон|видеодомоф|видеокамера|hd видеок|ip видеок/.test(txt);
      const hasAnalog = /аналог|cvbs|hdcvi|tvi|ahd|cvbs/.test(txt);
      const hasIp = /ip\b|ip\s|ip-/.test(txt);
      const hasHybrid = /гибрид|hybrid/.test(txt);
      if (hasVideo && (hasAnalog || hasHybrid)) analogCount++;
      else if (hasVideo && hasIp) ipCount++;
      else if (/видеорегистрат|регистратор/.test(txt) && hasHybrid) hybridCount++;
    }
  } catch (err) {}
}

console.log('Analog-like video items:', analogCount);
console.log('IP-like video items:', ipCount);
console.log('Hybrid-like items:', hybridCount);
process.exit(0);
