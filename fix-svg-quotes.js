const fs = require('fs');
const path = require('path');

// upravlyaemye-soho-poe.js fix
const files = [
  { name: 'src/data/upravlyaemye-soho-poe.js', fixFn: fixUprSohopoe },
  { name: 'src/data/neupravlyaemye-soho-poe.js', fixFn: fixNeuSohopoe },
];

let totalFixed = 0;

for (const { name, fixFn } of files) {
  const filePath = path.join(__dirname, name);
  const original = fs.readFileSync(filePath, 'utf8');
  const fixed = fixFn(original);
  if (fixed !== original) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log('Fixed:', name);
    totalFixed++;
  } else {
    console.log('No changes needed:', name);
  }
}
console.log('Total files modified:', totalFixed);

function fixUprSohopoe(content) {
  // The first entry (line 13) is already ok
  // Fix broken SVG from line 25 onwards:
  // Pattern: height="300"<rect fill="#f1f5f9" width="400" height="300"/...
  // Replace with single-quoted version and remove comma after svg+xml,
  const broken = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height="300"><rect fill="#f1f5f9" width="400" height="300"/><text x="200" y="150" text-anchor="middle" dominant-baseline="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="16">Фото скоро будет</text></svg>`;
  const good = `data:image/svg+xml<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect fill='%23f1f5f9' width='400' height='300'/><text x='200' y='150' text-anchor='middle' dominant-baseline='middle' fill='%2364748b' font-family='system-ui,sans-serif' font-size='16'>Фото скоро будет</text></svg>`;
  let result = content;
  const count = (content.match(new RegExp(escapeRegex(broken), 'g')) || []).length;
  if (count > 0) {
    console.log('Found', count, 'broken SVG in upravlyaemye-soho-poe.js');
    result = content.split(broken).join(good);
  }
  return result;
}

function fixNeuSohopoe(content) {
  // line 13 is ok (already single quotes), but from line 25 onwards there's
  // a comma after svg+xml: data:image/svg+xml,<svg -> data:image/svg+xml<svg
  // In this file the quotes are already all single, just fix the extra comma
  const broken = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect fill='%23f1f5f9' width='400' height='300'/><text x='200' y='150' text-anchor='middle' dominant-baseline='middle' fill='%2364748b' font-family='system-ui,sans-serif' font-size='16'>Фото скоро будет</text></svg>`;
  const good = `data:image/svg+xml<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect fill='%23f1f5f9' width='400' height='300'/><text x='200' y='150' text-anchor='middle' dominant-baseline='middle' fill='%2364748b' font-family='system-ui,sans-serif' font-size='16'>Фото скоро будет</text></svg>`;
  let result = content;
  const count = (content.split(good).length - 1) + (content.split(broken).length - 1);
  const badCount = (content.match(new RegExp(escapeRegex(broken), 'g')) || []).length;
  if (badCount > 0) {
    console.log('Found', badCount, 'entries with extra comma in neupravlyaemye-soho-poe.js');
    result = content.split(broken).join(good);
  }
  return result;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
