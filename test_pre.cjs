const fs = require('fs');

//最简单的方案：before extracting the array, fix the specific breakage in source
function preprocessAndExtract(content) {
  // 1. Remove comments
  let cleaned = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 2. Fix the specific breakage: ="<tag or url" → \"<tag or url"
  // This handles: xmlns="http://...", width="400", height="300", etc.
  cleaned = cleaned.replace(/="\\"/g, '=\\"\"'); // already escaped
  cleaned = cleaned.replace(/="([^"]{0,2})"/g, function(match, p1, offset, str) {
    // Only replace ="" followed by http, <, #, or /
    if (/^=[<h#\/]/.test(p1)) {
      return '=\\"' + p1 + '"';
    }
    return match;
  });
  
  // Actually simpler: just find all =" that are followed by http or <
  // and replace them
  
  return cleaned;
}

const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');
const cleaned = preprocessAndExtract(c);

// Extract array and try parse
const startIdx = cleaned.indexOf('[');
const endIdx = cleaned.lastIndexOf(']');
const arr = cleaned.substring(startIdx, endIdx + 1);

console.log('arr[0:40]:', JSON.stringify(arr.substring(0, 40)));
try {
  JSON.parse(arr);
  console.log('JSON ok');
} catch(e) {
  console.log('Error:', e.message.substring(0, 80));
}
