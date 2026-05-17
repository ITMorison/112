const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');

const exportIdx = c.indexOf('export const');
const body = c.substring(exportIdx).replace(/^export\s+const\s+[^\s=]+\s*=\s*/, 'const __data = ');
const fixed = body.replace(/="([h<#\/])/g, '=\\"$1');

// Show what we have around the error
try { new Function(fixed)(); } catch(e) {
  console.log('Error:', e.message);
  const m = e.message.match(/position (\d+)/i);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Context:', JSON.stringify(fixed.substring(Math.max(0,pos-20), pos+20)));
  }
}
