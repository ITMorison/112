import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load data
const products = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'new-products.json'), 'utf-8'));
const imageCache = JSON.parse(fs.readFileSync(path.join(rootDir, 'image_cache.json'), 'utf-8'));

const publicDir = path.join(rootDir, 'public');
const publicPhotoDir = path.join(publicDir, 'photo');

// Create a map: product code -> {article, category}
const productMap = new Map();
products.forEach(p => {
  if (p.code && p.article && p.category) {
    productMap.set(String(p.code), { article: p.article, category: p.category });
  }
});

let movedCount = 0;
let missingCount = 0;
let alreadyExistsCount = 0;

console.log('🔧 Reorganizing existing images into category folders...\n');

// Check each image file in public root that matches pattern *.jpg
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.jpg'));

files.forEach(file => {
  const code = path.basename(file, '.jpg');
  
  // Skip if not a product code (e.g., test.jpg)
  if (!productMap.has(code)) {
    // Could be a special case - check imageCache directly
    if (!imageCache[code] || imageCache[code] === 'NOT_FOUND') {
      // Not a product image, skip
    } else {
      console.log(`⚠️  File ${file} has cache entry but no product mapping`);
    }
    return;
  }
  
  const { article, category } = productMap.get(code);
  const targetCategoryDir = path.join(publicPhotoDir, category);
  const targetFilePath = path.join(targetCategoryDir, `${article}.jpg`);
  const sourceFilePath = path.join(publicDir, file);
  
  // Create category directory if needed
  if (!fs.existsSync(targetCategoryDir)) {
    fs.mkdirSync(targetCategoryDir, { recursive: true });
  }
  
  // If target already exists, remove source and skip
  if (fs.existsSync(targetFilePath)) {
    fs.unlinkSync(sourceFilePath);
    alreadyExistsCount++;
    return;
  }
  
  // Move file
  try {
    fs.renameSync(sourceFilePath, targetFilePath);
    movedCount++;
  } catch (err) {
    console.error(`❌ Error moving ${file}: ${err.message}`);
    missingCount++;
  }
});

// Count category directories created
const categoryFolders = fs.readdirSync(publicPhotoDir).filter(f => 
  fs.statSync(path.join(publicPhotoDir, f)).isDirectory()
);

console.log('✅ Reorganization complete!\n');
console.log(`📊 Summary:`);
console.log(`   📁 Moved to category folders: ${movedCount}`);
console.log(`   ⏭️  Already in correct location: ${alreadyExistsCount}`);
console.log(`   ❌ Errors: ${missingCount}`);
console.log(`\n📁 Category folders created:`);
categoryFolders.forEach(f => {
  const count = fs.readdirSync(path.join(publicPhotoDir, f)).length;
  console.log(`   - ${f}: ${count} images`);
});
