const fs = require('fs');
const files = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

const q = '"'.charCodeAt(0);
const apos = "'".charCodeAt(0);

for (const p of files) {
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  const line13 = lines[12]; // 0-indexed
  if (!line13) { console.log(`${p}: line 13 not found`); continue; }
  
  // Confirm it's the image line
  if (!line13.includes('data:image/svg+xml,')) {
    console.log(`${p}: line 13 is NOT the image line!`);
    continue;
  }
  
  // Find the SVG blob
  const start = line13.indexOf('data:image/svg+xml,');
  const endTag = line13.indexOf('</svg>');
  if (endTag < 0) { console.log(`${p}: no </svg>`); continue; }
  
  // Find closing JS string delimiter
  const closingIdx = line13.indexOf('"', endTag + 6);
  if (closingIdx < 0) { console.log(`${p}: no closing "`); continue; }
  
  const blob = line13.substring(start, closingIdx);
  
  // Count raw " inside blob
  const dblInBlob = [];
  for (let i = 0; i < blob.length; i++) {
    if (blob[i] === '"') dblInBlob.push(i);
  }
  
  // Count raw ' inside blob
  const aposInBlob = [];
  for (let i = 0; i < blob.length; i++) {
    if (blob[i] === "'") aposInBlob.push(i);
  }
  
  // Find outer JS string delimiter
  const beforeStart = line13.substring(0, start);
  const lastQuoteBefore = [...beforeStart].reverse().findIndex(c => c.charCodeAt(0) === q);
  
  console.log(`\n${p}:`);
  console.log(`  Raw " in SVG blob: ${dblInBlob.length}`);
  console.log(`  Raw ' in SVG blob: ${aposInBlob.length}`);
  console.log(`  Status: ${dblInBlob.length === 0 ? 'OK' : 'STILL BROKEN'}`);
  console.log(`  Line 13 raw 200 chars:`, JSON.stringify(line13.substring(0, 200)));
}
