const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const products = require('../new-products.json');

const baseUrl = 'https://market-telecom.kz/files/products/';

const categoryFolders = {
  'kompyutery-i-komplektuyushchie': 'kompyutery-i-komplektuyushchie',
  'setevoe-i-servernoe-oborudovanie': 'setevoe-i-servernoe-oborudovanie',
  'kabelnye-sistemy': 'kabelnye-sistemy',
  'sistemy-videonablyudeniya': 'sistemy-videonablyudeniya',
  'sistemy-kontrolya-dostupa': 'sistemy-kontrolya-dostupa',
  'sistemy-opoveshcheniya': 'sistemy-opoveshcheniya',
  'kommercheskaya-vizualizaciya': 'kommercheskaya-vizualizaciya',
  'demonstracionnoe-oborudovanie': 'demonstracionnoe-oborudovanie',
  'ofisnoe-oborudovanie': 'ofisnoe-oborudovanie',
  'ip-telefony': 'ip-telefony',
  'other': 'other'
};

function getMD5Hash(str) {
  return crypto.createHash('md5').update(String(str)).digest('hex');
}

function downloadImage(url, filepath) {
  return new Promise((resolve) => {
    try {
      const file = fs.createWriteStream(filepath);
      
      const request = https.get(url, { timeout: 15000 }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          try { fs.unlinkSync(filepath); } catch(e) {}
          downloadImage(response.headers.location, filepath).then(resolve);
          return;
        }
        
        if (response.statusCode !== 200) {
          file.close();
          try { fs.unlinkSync(filepath); } catch(e) {}
          resolve(false);
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          try {
            const stats = fs.statSync(filepath);
            if (stats.size > 500) {
              resolve(true);
            } else {
              fs.unlinkSync(filepath);
              resolve(false);
            }
          } catch(e) {
            resolve(false);
          }
        });
      });
      
      request.on('error', (err) => {
        file.close();
        try { fs.unlinkSync(filepath); } catch(e) {}
        resolve(false);
      });
      
      request.on('timeout', () => {
        request.destroy();
        try { fs.unlinkSync(filepath); } catch(e) {}
        resolve(false);
      });
      
    } catch(e) {
      resolve(false);
    }
  });
}

async function downloadAllImages() {
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;
  
  const total = products.length;
  
  for (let i = 0; i < total; i++) {
    const product = products[i];
    const originalArticle = product.article;
    const category = product.category || 'other';
    
    if (!originalArticle) {
      skipCount++;
      continue;
    }
    
    // Use MD5 hash as filename
    const hash = getMD5Hash(originalArticle);
    const categoryFolder = categoryFolders[category] || 'other';
    const photoDir = path.join(__dirname, '..', 'public', 'photo', categoryFolder);
    
    if (!fs.existsSync(photoDir)) {
      fs.mkdirSync(photoDir, { recursive: true });
    }
    
    const filepath = path.join(photoDir, `${hash}.jpg`);
    
    // Skip if file exists and has content
    if (fs.existsSync(filepath)) {
      try {
        const stats = fs.statSync(filepath);
        if (stats.size > 500) {
          skipCount++;
          continue;
        } else {
          // Remove corrupted/empty file
          fs.unlinkSync(filepath);
        }
      } catch(e) {}
    }
    
    const url = `${baseUrl}${originalArticle}_1.170x220.jpg`;
    const downloaded = await downloadImage(url, filepath);
    
    if (downloaded) {
      successCount++;
    } else {
      failCount++;
    }
    
    if ((i + 1) % 100 === 0 || i === total - 1) {
      console.log(`Progress: ${i + 1}/${total} | Downloaded: ${successCount} | Not found: ${failCount} | Skipped: ${skipCount}`);
    }
  }
  
  console.log(`\n=== Results ===`);
  console.log(`Downloaded: ${successCount}`);
  console.log(`Not found: ${failCount}`);
  console.log(`Skipped: ${skipCount}`);
}

downloadAllImages();
