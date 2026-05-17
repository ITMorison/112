const fs = require('fs');

function parse(content) {
  let cleaned = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const startIdx = cleaned.indexOf('[');
  const endIdx = cleaned.lastIndexOf(']');
  let arr = cleaned.substring(startIdx, endIdx + 1);
  arr = arr.replace(/\n/g, ' ').replace(/\r/g, '');
  arr = arr.replace(/="([h<#])/g, '=\\"$1');
  return arr;
}

const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');
const arr = parse(c);

// Find error position
try { JSON.parse(arr); } catch(e) {
  const m = e.message.match(/at position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Error at pos', pos);
    console.log('Context (raw arr):', JSON.stringify(arr.substring(Math.max(0,pos-20), pos+20)));
    
    // Show hex
    console.log('\nHex dump around pos:');
    for (let i = Math.max(0,pos-5); i < pos+10; i++) {
      console.log(i.toString().padStart(3), arr[i], '(0x' + arr.charCodeAt(i).toString(16) + ')');
    }
  }
}
