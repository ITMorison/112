const fs = require('fs');
const c = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');
const eqIdx = c.indexOf('= [');
const startIdx = c.indexOf('[', eqIdx);
const content = c.substring(startIdx);

// Trace through the state machine around the image field
const imgIdx = content.indexOf('"image"');
console.log('Image field at content index:', imgIdx);
// Show state machine trace for chars 55 to 75
let inString = false, stringChar = '', result = '';
for (let i = 50; i < 90; i++) {
  const ch = content[i];
  let prevInString = inString;
  let prevStringChar = stringChar;
  
  if (inString) {
    if (ch === '\\') {
      result += ch; i++;
      result += content[i] || '';
    } else if (ch === stringChar) {
      inString = false;
      result += ch;
    } else {
      result += ch;
    }
  } else {
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true; stringChar = ch; result += ch;
    } else {
      result += ch;
    }
  }
  
  if (i >= 55 && i <= 75) {
    console.log(i.toString().padStart(3), `"${ch}"(0x${ch.charCodeAt(0).toString(16)})`, 
                prevInString ? `inString(${prevStringChar})` : '~string~', 
                `-> ${inString ? 'still_in_string' : 'outside_string'}`,
                'result char:', result[result.length-1]);
  }
}
console.log('\nResult[50:90]:', JSON.stringify(result.substring(50, 90)));
console.log('Content[50:90]:', JSON.stringify(content.substring(50, 90)));
