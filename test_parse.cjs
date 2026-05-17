const fs = require('fs');

// Test with a problematic file
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const eqIdx = c.indexOf('= [');
const startIdx = c.indexOf('[', eqIdx);
const content = c.substring(startIdx);

const result = parseDataFile(content);

// Use Function constructor to parse
try {
  const products = new Function(`return ${result}`)();
  console.log('✅ Parsed OK, items:', products.length);
  console.log('First item title:', products[0]?.title);
  console.log('First item image starts with:', products[0]?.image?.substring(0, 30));
} catch (e) {
  console.log('❌ Error:', e.message.substring(0, 150));
  console.log('result[0:100]:', JSON.stringify(result.substring(0, 100)));
}

function parseDataFile(rawContent) {
  const eqIdx = rawContent.indexOf('= [');
  if (eqIdx === -1) return null;
  const startIdx = rawContent.indexOf('[', eqIdx);
  const content = rawContent.substring(startIdx);
  
  let depth = 0, inString = false, stringChar = '', result = '';
  
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    
    if (inString) {
      result += ch;
      if (ch === '\\') {
        i++;
        result += content[i] || '';
      } else if (ch === stringChar) {
        inString = false;
      }
      continue;
    }
    
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      result += ch;
      continue;
    }
    
    if (ch === '[' || ch === '{') {
      depth++;
      result += ch;
      continue;
    }
    
    if (ch === ']' || ch === '}') {
      depth--;
      result += ch;
      if (depth === 0) break;
      continue;
    }
    
    result += ch;
  }
  
  return result;
}
