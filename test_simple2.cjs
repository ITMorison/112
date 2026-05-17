const fs = require('fs');

function fixAndParse(content) {
  // 1. Pre-fix: escape ="<tag/url/attr in source before any other processing
  // This handles: ="http://..." ="<svg..." ="..."
  let fixed = content.replace(/="([h<#\/])/g, '=\\"$1');
  
  // 2. Remove comments
  fixed = fixed.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 3. Find array boundaries
  const startIdx = fixed.indexOf('[');
  const endIdx = fixed.lastIndexOf(']');
  if (startIdx === -1 || endIdx === -1) return null;
  
  // 4. Extract array content
  let arr = fixed.substring(startIdx, endIdx + 1);
  
  // 5. Replace literal newlines inside strings with space
  // Since we removed comments, newlines only appear inside string values or between items
  // We need to preserve newlines between items (after ,) but not inside strings
  // Simplest: since our data never has intentional newlines in values, replace all \n with space
  arr = arr.replace(/[\r\n]+/g, ' ');
  
  return arr;
}

const files = [
  'neupravlyaemye-stoechnye.js',
  '16-канальные-hd-видеорегистраторы.js', 
  'setevye-patch-kordy.js'
];

let ok = 0, fail = 0;

files.forEach(f => {
  const content = fs.readFileSync('src/data/' + f, 'utf8');
  const arr = fixAndParse(content);
  if (!arr) return;
  
  try {
    const items = JSON.parse(arr);
    console.log('✅', f.padEnd(45), items.length, 'items');
    ok++; fail--;
  } catch(e) {
    console.log('❌', f.padEnd(45), e.message.substring(0, 60));
    fail++;
  }
});

console.log(`\n${ok} OK, ${fail} failed`);
