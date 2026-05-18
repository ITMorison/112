const fs = require('fs');
const path = require('path');

const files = [
  'src/new-products.json',
  'src/price1-products.json',
  'src/price2-products.json',
  'src/price3-products.json'
].map((p) => path.join(__dirname, '..', p));

function normalizeKey(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9а-яё]+/g, ' ').trim();
}

// load categoryMap from data.js by reading file (simple parse of object literal is hard),
// instead replicate minimal mapping for video detection using heuristics from data.js

const results = [];
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const p of data) {
    const rawKey = p.category_raw || p.category || '';
    const txt = (String(p.name || '') + ' ' + String(p.fullName || '') + ' ' + String(rawKey)).toLowerCase();
    const hasVideo = /видеокам|видеокамера|видеорегистрат|видеодомофон|видеодомоф/.test(txt);
    const hasAnalog = /аналог|cvbs|hdcvi|tvi|ahd|cvbs/.test(txt);
    const hasIp = /ip\b|ip\s|ip-/.test(txt);
    const hasHybrid = /гибрид|hybrid/.test(txt);

    let mapped = null;
    if (hasVideo) {
      if (hasAnalog || hasHybrid) mapped = { category: 'videonablyudenie', subcategory: 'analogovye-videokamery' };
      else if (hasIp) mapped = { category: 'videonablyudenie', subcategory: 'ip-videokamery' };
      else mapped = { category: 'videonablyudenie', subcategory: 'ip-videokamery' };
    }
    if (!mapped && /видеорегистрат|регистратор/.test(txt)) {
      if (hasHybrid || hasAnalog) mapped = { category: 'videonablyudenie', subcategory: 'gibridnye-videoregistratory' };
      else mapped = { category: 'videonablyudenie', subcategory: 'ip-videoregistratory' };
    }

    if (mapped) results.push({ mapped, rawKey: rawKey, name: p.name || p.fullName || '<no name>' });
  }
}

console.log('Mapped to videonablyudenie total:', results.length);
const sample = results.slice(0, 40);
for (const r of sample) {
  console.log(' -', r.mapped.subcategory, ' | ', (r.rawKey || '<EMPTY>').padEnd(30), ' | ', r.name);
}
process.exit(0);
