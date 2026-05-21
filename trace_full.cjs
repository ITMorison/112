const fs = require('fs');
const f = 'src/data/ddr4.js';
const content = fs.readFileSync(f, 'utf8');
const index = content.indexOf('svg xmlns');

console.log('index of "svg xmlns" in file:', index);
console.log('From that point, 60 chars:', JSON.stringify(content.substring(index, index+60)));

// Parse manually through the content from the image field
const imgIdx = content.indexOf('"image"');
console.log('index of "image":', imgIdx);
console.log('Chars from imgIdx to imgIdx+20:', JSON.stringify(content.substring(imgIdx, imgIdx+20)));

const afterImgClose = imgIdx + 7; // closing " of "image"
console.log('afterImgClose:', afterImgClose, 'char:', JSON.stringify(content[afterImgClose]));
const colonIdx = content.indexOf(':', imgIdx);
console.log('colonIdx:', colonIdx);
const valQ = content.indexOf('"', colonIdx+1);
console.log('valQ:', valQ, 'JSON:', JSON.stringify(content.substring(valQ-5, valQ+40)));
const valStart = valQ + 1;
console.log('valStart:', valStart, 'JSON:', JSON.stringify(content.substring(valStart, valStart+60)));

// Now look at the bytes just before position 79
const svgStart = content.indexOf('svg+xml,', valStart);
console.log('svgStart in file:', svgStart);
console.log('Content start:', svgStart + 9);
const contentFromSVG = content.substring(svgStart+9, svgStart+50);
console.log('SVG content:', JSON.stringify(contentFromSVG));

// Now check what's at positions 75-87 in the FULL file
const fullIdx = imgIdx + 5; // pointing to "image" labeling
console.log('\nContent from image field around pos 75-87 (minus prefix):');
const prefixLen = imgIdx;
const fromFile = content.substring(prefixLen + 75, prefixLen + 87);
console.log('From file:', JSON.stringify(fromFile));
for (let i = 0; i < fromFile.length; i++) {
  console.log('  char', i, JSON.stringify(fromFile[i]), 'U+', fromFile.charCodeAt(i).toString(16));
}
