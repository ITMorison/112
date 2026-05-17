const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Configuration
const SEARCH_ENGINES = {
  google: {
    name: 'Google',
    enabled: false, // Requires SERPAPI key or complex scraping
    apiKey: process.env.SERPAPI_KEY || '',
  },
  bing: {
    name: 'Bing',
    enabled: true, // Bing allows some image search
    baseUrl: 'https://www.bing.com/images/search',
  },
  yandex: {
    name: 'Yandex',
    enabled: false, // Requires authentication
  }
};

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const TIMEOUT = 30000;
const MAX_IMAGES_PER_PRODUCT = 3;

// Load products mapping to know which ones need images
const products = require('../new-products.json');

// Category folders (same as in download-images.cjs)
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

function md5Hash(str) {
  return require('crypto').createHash('md5').update(String(str)).digest('hex');
}

function getCategoryFolder(category) {
  return categoryFolders[category] || 'other';
}

// Check if image file exists and is valid
function isImageValid(filepath) {
  try {
    const stats = fs.statSync(filepath);
    return stats.size > 500;
  } catch {
    return false;
  }
}

// Download image with proper headers
function downloadImage(url, filepath) {
  return new Promise((resolve) => {
    try {
      const file = fs.createWriteStream(filepath);
      
      const request = https.get(url, {
        timeout: TIMEOUT,
        headers: {
          'User-Agent': USER_AGENT,
          'Referer': 'https://www.bing.com/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          try { fs.unlinkSync(filepath); } catch(e) {}
          const location = response.headers.location;
          if (location && !location.startsWith('data:')) {
            downloadImage(location, filepath).then(resolve);
          } else {
            resolve(false);
          }
          return;
        }
        
        if (response.statusCode !== 200) {
          file.close();
          try { fs.unlinkSync(filepath); } catch(e) {}
          resolve(false);
          return;
        }
        
        // Check content type
        const contentType = response.headers['content-type'];
        if (contentType && !contentType.startsWith('image/')) {
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
      
      request.on('error', () => {
        file.close();
        try { fs.unlinkSync(filepath); } catch(e) {}
        resolve(false);
      });
      
      request.on('timeout', () => {
        request.destroy();
        file.close();
        try { fs.unlinkSync(filepath); } catch(e) {}
        resolve(false);
      });
      
    } catch(e) {
      resolve(false);
    }
  });
}

// Search Bing Images for a product
async function searchBingImages(query, maxResults = MAX_IMAGES_PER_PRODUCT) {
  const results = [];
  
  // Bing image search URL (simple version - returns HTML page)
  const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1&tsc=ImageBasicHover`;
  
  return new Promise((resolve) => {
    https.get(searchUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        // Simple regex to extract image URLs from Bing HTML
        // This is a basic approach - in production use proper API
        const imgUrlRegex = /m\.img\.com/[^"'\\s]+|https?:\/\/[^"'\\s]+\.(?:jpg|jpeg|png|webp)/gi;
        const matches = data.match(imgUrlRegex) || [];
        
        // Filter valid image URLs
        const validUrls = matches
          .map(url => url.replace(/\\u0025/g, '%').replace(/&amp;/g, '&'))
          .filter(url => url.startsWith('http') && url.match(/\.(jpg|jpeg|png|webp)$/i))
          .slice(0, maxResults);
        
        resolve(validUrls);
      });
    }).on('error', () => resolve([]));
  });
}

// Alternative: try to get from manufacturer's CDN or common patterns
async function tryCommonPatterns(article, brand) {
  const patterns = [
    // Hikvision pattern
    `https://www.hikvision.com/content/hikvision/en/support/tools/product-image/${article}.jpg`,
    // Dahua pattern
    `https://www.dahuasecurity.com/resource/products/${article}.jpg`,
    // Generic placeholder
    `https://placehold.co/400x300/indigo/white?text=${encodeURIComponent(article)}`
  ];
  
  for (const url of patterns) {
    try {
      const result = await testImageUrl(url);
      if (result) return url;
    } catch(e) {}
  }
  return null;
}

// Test if URL returns valid image
function testImageUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 10000, headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode === 200) {
        const contentType = res.headers['content-type'];
        if (contentType && contentType.startsWith('image/')) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

// Save image for product
async function saveProductImage(product, imageUrl) {
  const hash = md5Hash(product.article || product.code);
  const category = product.category || 'other';
  const categoryFolder = getCategoryFolder(category);
  const photoDir = path.join(__dirname, '..', 'public', 'photo', categoryFolder);
  
  if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir, { recursive: true });
  }
  
  const filepath = path.join(photoDir, `${hash}.jpg`);
  
  const success = await downloadImage(imageUrl, filepath);
  if (success) {
    console.log(`✓ Saved image for: ${product.name || product.fullName} (${product.article})`);
    return true;
  }
  return false;
}

// Process products needing images
async function searchMissingImages() {
  console.log('🔍 Starting image search for missing products...\n');
  
  let processed = 0;
  let found = 0;
  let failed = 0;
  
  // Process all products (we'll check which ones already have images)
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const article = product.article;
    
    if (!article) {
      processed++;
      continue;
    }
    
    const hash = md5Hash(article);
    const category = product.category || 'other';
    const categoryFolder = getCategoryFolder(category);
    const imagePath = path.join(__dirname, '..', 'public', 'photo', categoryFolder, `${hash}.jpg`);
    
    // Skip if we already have a valid image
    if (isImageValid(imagePath)) {
      processed++;
      continue;
    }
    
    // Build search query
    const query = product.fullName || product.name || '';
    console.log(`Searching for: ${query} (${product.article})`);
    
    let imageFound = false;
    
    // Try common manufacturer patterns first
    const commonUrl = await tryCommonPatterns(article, product.brand || '');
    if (commonUrl) {
      imageFound = await saveProductImage(product, commonUrl);
    }
    
    // If not found, try Bing search
    if (!imageFound && SEARCH_ENGINES.bing.enabled) {
      try {
        const imageUrls = await searchBingImages(query);
        
        for (const imageUrl of imageUrls) {
          if (await saveProductImage(product, imageUrl)) {
            imageFound = true;
            found++;
            break;
          }
        }
      } catch(e) {
        console.log(`  Bing search error: ${e.message}`);
      }
    }
    
    if (!imageFound) {
      failed++;
      console.log(`  ✗ No image found for: ${product.article}`);
    } else {
      found++;
    }
    
    processed++;
    
    // Progress logging
    if (processed % 50 === 0 || i === products.length - 1) {
      console.log(`\nProgress: ${processed}/${products.length} | Found: ${found} | Failed: ${failed}`);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n=== Search Results ===`);
  console.log(`Total processed: ${processed}`);
  console.log(`Images found: ${found}`);
  console.log(`Failed: ${failed}`);
}

// Run
searchMissingImages().catch(console.error);
