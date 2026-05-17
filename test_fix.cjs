const fs = require('fs');

const file = 'src/data/neupravlyaemye-stoechnye.js';
const c = fs.readFileSync(file, 'utf8');

// Simplest possible fix: in the RAW file find all =<quote> patterns (not already escaped)
// that look like SVG attributes and escape the quote.
// Do it before any other processing.

// The breakage is specifically: ="http:..." (=<double-quote>http)
// Replace =" with =\" ONLY when preceded by a word char and followed by http, <, #, or /
const fixed = c.replace(/(?<!\\)="([h<#\/])/g, '=\\"$1');

// Now remove comments
let cleaned = fixed.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

// Extract array
const startIdx = cleaned.indexOf('[');
const endIdx = cleaned.lastIndexOf(']');
const arr = cleaned.substring(startIdx, endIdx + 1);

console.log('Trying JSON.parse on', file);
try {
  const items = JSON.parse(arr);
  console.log('✅ Items:', items.length);
} catch(e) {
  console.log('❌ Error:', e.message.substring(0, 80));
  const m = e.message.match(/at position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Context:', JSON.stringify(arr.substring(Math.max(0,pos-10), pos+12)));
  }
}
