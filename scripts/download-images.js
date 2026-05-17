import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load data
const products = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'new-products.json'), 'utf-8'));
const imageCache = JSON.parse(fs.readFileSync(path.join(rootDir, 'image_cache.json'), 'utf-8'));

const publicPhotoDir = path.join(rootDir, 'public', 'photo');

// Create public/photo directory if it doesn't exist
if (!fs.existsSync(publicPhotoDir)) {
  fs.mkdirSync(publicPhotoDir, { recursive: true });
}

let successCount = 0;
let failCount = 0;
let skipCount = 0;

console.log('🚀 Starting image download and organization...\n');

// Process each product
products.forEach((product, index) => {
  const { code, article, category, subcategory } = product;
  const productCode = String(code);
  
  // Get image URL from cache
  const imageUrl = imageCache[productCode];
  
  if (!imageUrl || imageUrl === 'NOT_FOUND') {
    skipCount++;
    return;
  }
  
  // Determine target directory: use category slug, fallback to subcategory or 'other'
  const targetCategoryDir = category || subcategory || 'other';
  const targetDir = path.join(publicPhotoDir, targetCategoryDir);
  const targetFilePath = path.join(targetDir, `${article}.jpg`);
  
  // Skip if image already exists
  if (fs.existsSync(targetFilePath)) {
    skipCount++;
    return;
  }
  
  // Create category directory if needed
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Download image
  const file = fs.createWriteStream(targetFilePath);
  
  https.get(imageUrl, (response) => {
    if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        successCount++;
        if (successCount % 100 === 0) {
          console.log(`✅ Downloaded ${successCount} images...`);
        }
      });
    } else {
      fs.unlinkSync(targetFilePath); // Delete partial file
      failCount++;
    }
  }).on('error', (err) => {
    console.error(`❌ Error downloading ${imageUrl}: ${err.message}`);
    failCount++;
  });
});

// Wait for all downloads to complete
setTimeout(() => {
  console.log('\n📊 Summary:');
  console.log(`   ✅ Successfully downloaded: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⏭️  Skipped (no image or already exists): ${skipCount}`);
  console.log(`\nImages saved to: ${publicPhotoDir}`);
}, 5000);
