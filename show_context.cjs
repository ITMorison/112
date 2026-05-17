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

try { JSON.parse(arr); } catch(e) {
  const m = e.message.match(/at position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Context:');
    console.log(arr.substring(Math.max(0,pos-40), pos+40));
  }
}
