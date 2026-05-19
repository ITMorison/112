import p3 from './src/price3-products.json' with { type: "json" };

const DECT_RE = /dect/i;
const DETECTED = [];

for (const p of p3) {
  const n = String(p.name || '');
  const cat = String(p.category_raw || '');
  
  // Detect DECT products
  const isDECT = DECT_RE.test(n);
  
  // Detect IP phones from "1. SIP-телефоники" category
  const isSip = cat.includes('SIP') || cat.includes('1.') && cat.indexOf('SIP') > 0;
  
  if (isDECT && !isSIP) {
    let subType = 'other';
    if (/базовая\s+станция|dect\s+база|повторитель/i.test(n)) subType = 'dect-base';
    else if (/dect\s+телефон|телефон\s+dect/i.test(n)) subType = 'dect-handset';
    else if (/в\s+комплекте/i.test(n)) subType = 'kit';
    else subType = 'other-dect';
    
    DETECTED.push(p.code + ' | ' + subType + ' | ' + n.slice(0, 55));
  }
}

console.log('DECT product detection breakdown:');
const byType = {};
DETECTED.forEach(function(x) {
  const parts = x.split(' | ');
  byType[parts[1]] = (byType[parts[1]] || 0) + 1;
});
console.log(JSON.stringify(byType, null, 2));
console.log('Samples DECT-base:');
DETECTED.filter(x => x.indexOf('dect-base') > 0).slice(0, 5).forEach(x => console.log(x));
console.log('Samples DECT-handset:');
DETECTED.filter(x => x.indexOf('dect-handset') > 0).slice(0, 5).forEach(x => console.log(x));