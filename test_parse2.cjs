const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');

const eqIdx = c.indexOf('= [');
const startIdx = c.indexOf('[', eqIdx);
const content = c.substring(startIdx);

const result = parseDataFile(content);

if (result) {
  try {
    const products = new Function(`return ${result}`)();
    console.log('✅ Parsed OK, items:', products.length);
    console.log('First item title:', products[0]?.title);
  } catch (e) {
    console.log('❌ Error:', e.message.substring(0, 150));
    console.log('result[0:80]:', JSON.stringify(result.substring(0, 80)));
  }
} else {
  console.log('null result');
}

function parseDataFile(rawContent) {
  // Already passed the content starting from '['
  let depth = 0, inString = false, stringChar = '', result = '';
  
  for (let i = 0; i < rawContent.length; i++) {
    const ch = rawContent[i];
    
    if (inString) {
      result += ch;
      if (ch === '\\') {
        i++;
        result += rawContent[i] || '';
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
