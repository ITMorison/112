const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');

// Remove comments
const noComments = c.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

const eqIdx = noComments.indexOf('= [');
const startIdx = noComments.indexOf('[', eqIdx);
const arr = noComments.substring(startIdx);

// Simple escape: = followed by " where after comes http or < or #
// This is the minimal fix needed for SVG data URIs
const escaped = arr.replace(/="([h<#])/g, '=\\"$1');

console.log('Trying JSON.parse...');
try {
  const items = JSON.parse(escaped);
  console.log('✅ Items:', items.length);
  console.log('Image OK:', !!items[0]?.image);
  console.log('Image starts with:', items[0]?.image?.substring(0, 60));
} catch(e) {
  console.log('❌ Error:', e.message.substring(0, 100));
}
