const fs = require('fs');

const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');
const exportIdx = c.indexOf('export const');
const body = c.substring(exportIdx).replace(/^export\s+const\s+[^\s=]+\s*=\s*/, 'const __data = ');

// Replace ALL =" with =\"  
// We're inside a JS array context where =" only appears in SVG attributes
const superFixed = body.replace(/="([^"]*)"/g, (match, inner) => {
  // Only escape if it looks like SVG attribute (has = inside or starts with h)
  // Actually just escape ALL quotes in image strings
  return `=\\"${inner}\\"`;
});

console.log('superFixed first 120:', JSON.stringify(superFixed.substring(0, 120)));
try {
  const fn = new Function(superFixed + '\nreturn __data;');
  const data = fn();
  console.log('✅ Items:', data.length);
} catch(e) {
  console.log('❌ Error:', e.message.substring(0, 100));
}
