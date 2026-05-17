const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const eqIdx = c.indexOf('= [');
const startIdx = c.indexOf('[', eqIdx);
const content = c.substring(startIdx);

function parseDataFile(rawContent) {
  let depth = 0, inString = false, stringChar = '';
  const result = [];
  for (let i = 0; i < rawContent.length; i++) {
    const ch = rawContent[i];
    if (inString) {
      result.push(ch);
      if (ch === '\\') { i++; result.push(rawContent[i] || ''); }
      else if (ch === stringChar) { inString = false; }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true; stringChar = ch; result.push(ch); continue;
    }
    if (ch === '[' || ch === '{') { depth++; result.push(ch); continue; }
    if (ch === ']' || ch === '}') { depth--; result.push(ch); if (depth === 0) break; continue; }
    result.push(ch);
  }
  return result.join('');
}

const result = parseDataFile(content);

// Find "xmlns="http in both content and result
const xmlnsPosC = content.indexOf('xmlns=');
const xmlnsPosR = result.indexOf('xmlns=');

console.log('xmlns position in content:', xmlnsPosC);
console.log('xmlns position in result:', xmlnsPosR);
console.log('\nContent around xmlns (raw):');
for (let i = Math.max(0, xmlnsPosC - 2); i < xmlnsPosC + 30; i++) {
  console.log(`  ${content[i]}(0x${content.charCodeAt(i).toString(16)})`);
}
if (xmlnsPosR >= 0) {
  console.log('\nResult around xmlns:');
  for (let i = Math.max(0, xmlnsPosR - 2); i < xmlnsPosR + 30; i++) {
    console.log(`  ${result[i]}(0x${result.charCodeAt(i).toString(16)})`);
  }
}

// Now test Function parsing
try {
  const items = new Function(`return ${result}`)();
  console.log('\n✅ Function parsed OK! Items:', items.length);
} catch(e) {
  console.log('\n❌ Function error:', e.message.substring(0, 100));
  // Find where the error was and show surrounding
  const match = e.message.match(/at position (\d+)/);
  if (match) {
    const pos = parseInt(match[1]);
    console.log('Error at result pos', pos, ':', JSON.stringify(result.substring(Math.max(0,pos-10), pos+10)));
  }
}
