import fs from 'fs';
import path from 'path';

const publicDir = './public';
const outputImageMap = './src/image-map.json';

const files = fs.readdirSync(publicDir);

const imageMap = {};

for (const file of files) {
  
  const basename = path.basename(file, path.extname(file));
  
  // Extract code/article from filename
  // Try to get alphanumeric prefix (letters and digits mixed)
  let key = null;
  
  // Pattern 1: Starts with digits (e.g., 00821_1.jpg, 12058_1.jpg)
  const digitMatch = basename.match(/^([\d]+)/);
  if (digitMatch) {
    key = digitMatch[1];
  } else {
    // Pattern 2: Starts with alphanumeric (e.g., ap210, fanvil_h3, grandstream-gxw)
    const alphaMatch = basename.match(/^([a-zA-Z][a-zA-Z0-9_\-]*)/);
    if (alphaMatch) {
      key = alphaMatch[1].toLowerCase();
    }
  }
  
  if (key) {
    if (!imageMap[key]) imageMap[key] = [];
    imageMap[key].push(file);
  }
}

console.log('Total keys with images:', Object.keys(imageMap).length);

fs.writeFileSync(outputImageMap, JSON.stringify(imageMap, null, 2));
console.log('Saved to', outputImageMap);