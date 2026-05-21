// char_dump.cjs
const fs = require('fs');
const f = 'src/data/16-канальные-hd-видеорегистраторы.js';
const line13 = fs.readFileSync(f,'utf8').split('\n')[12];

function findQuotes(line) {
  const positions = [];
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') positions.push(i);
  }
  return positions;
}

const qPos = findQuotes(line13);
console.log('Total quotes on line 13:', qPos.length);
console.log('First 12 quote positions:', qPos.slice(0, 12));
console.log('Positions around 79-85:');
for (let i = 75; i < 86; i++) {
  console.log(`  pos ${i}: ${JSON.stringify(line13[i])} U+${line13.charCodeAt(i).toString(16)}`);
}
console.log();

// So the structure: pos[1]=end of "image", pos[2]=opening of value
console.log('Pos[1]=end of "image":', qPos[1], 'char:', JSON.stringify(line13[qPos[1]]));
console.log('Pos[2]=opening of value:', qPos[2], 'char:', JSON.stringify(line13[qPos[2]]));

const valStart = qPos[2] + 1;
console.log('valStart:', valStart);
console.log('valStart character:', JSON.stringify(line13[valStart]));
console.log('svgl+xml position:', line13.indexOf('svg+xml,', valStart));
console.log('Content from valStart to valStart+90:', JSON.stringify(line13.substring(valStart, valStart+90)));
