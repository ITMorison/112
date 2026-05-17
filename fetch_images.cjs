const https = require('https');
const fs = require('fs');

const PLACEHOLDER = 'https://market-telecom.kz/files/products/.170x220.jpg';
const DATA_FILE = 'src/data.js';
const CACHE_FILE = 'image_cache.json';
const DELAY_MS = 150;
const CONCURRENT = 5;

let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')); } catch(e) { cache = {}; }
}

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchUrl(url, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: timeout
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location, timeout).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function extractArticul(text) {
  const m = String(text).match(/(\d+)/);
  return m ? m[1] : '';
}

function extractShipModel(title) {
  const m = title.match(/SHIP\s+([\w-]+)/i);
  return m ? m[1] : '';
}

async function searchMarketTelecom(query) {
  const url = `https://market-telecom.kz/all-products?keyword=${encodeURIComponent(query)}`;
  try {
    const html = await fetchUrl(url);
    const results = [];
    const seen = new Set();
    const allMatches = html.matchAll(/(?:data-src|src)="(?:[^"]*)?\/files\/products\/([^"\s]+)\.170x220\.jpg"/g);
    for (const m of allMatches) {
      if (!seen.has(m[1])) {
        seen.add(m[1]);
        results.push({ filename: m[1] });
      }
    }
    return results;
  } catch(e) { return []; }
}

async function findImage(product) {
  const articul = extractArticul(product.articul);
  const model = extractShipModel(product.title);
  
  // Strategy 1: Search by articul number
  if (articul) {
    const results = await searchMarketTelecom(articul);
    if (results.length > 0) {
      // Prefer exact match (filename starts with or contains articul)
      const exact = results.find(r => r.filename.startsWith(articul) || r.filename.includes('_' + articul) || r.filename.includes(articul + '_'));
      if (exact) return `https://market-telecom.kz/files/products/${exact.filename}.170x220.jpg`;
      // Single result - use it
      if (results.length === 1) return `https://market-telecom.kz/files/products/${results[0].filename}.170x220.jpg`;
    }
  }
  
  // Strategy 2: Search by SHIP model name
  if (model) {
    await sleep(DELAY_MS);
    const results = await searchMarketTelecom(`SHIP ${model}`);
    if (results.length > 0) {
      const exact = results.find(r => r.filename.includes(articul));
      if (exact) return `https://market-telecom.kz/files/products/${exact.filename}.170x220.jpg`;
      if (results.length <= 2) return `https://market-telecom.kz/files/products/${results[0].filename}.170x220.jpg`;
    }
  }
  
  // Strategy 3: Search by full title (first meaningful words)
  if (!articul && !model) {
    const words = product.title.split(' ').filter(w => w.length > 3).slice(0, 4).join(' ');
    if (words) {
      await sleep(DELAY_MS);
      const results = await searchMarketTelecom(words);
      if (results.length === 1) return `https://market-telecom.kz/files/products/${results[0].filename}.170x220.jpg`;
    }
  }
  
  return null;
}

async function processProduct(product, index, total) {
  const key = product.articul;
  
  if (cache[key]) {
    return cache[key] === 'NOT_FOUND' ? null : cache[key];
  }
  
  const imageUrl = await findImage(product);
  cache[key] = imageUrl || 'NOT_FOUND';
  
  if ((index + 1) % 50 === 0) saveCache();
  
  return imageUrl;
}

async function processBatch(items, concurrency) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((item, j) => processProduct(item.product, i + j, items.length)
        .then(url => ({ index: item.index, url }))
        .catch(e => ({ index: item.index, url: null }))
      )
    );
    results.push(...batchResults);
    if (i + concurrency < items.length) await sleep(DELAY_MS);
    
    // Progress
    const done = Math.min(i + concurrency, items.length);
    const found = results.filter(r => r.url).length;
    if (done % 50 === 0 || done === items.length) {
      console.log(`  Progress: ${done}/${items.length} (${found} found)`);
    }
  }
  return results;
}

async function main() {
  console.log('=== Image Fetcher v2 ===\n');
  
  const content = fs.readFileSync(DATA_FILE, 'utf-8');
  const prodMatch = content.match(/export const PRODUCTS = \[([\s\S]*?)\];/);
  if (!prodMatch) { console.error('Could not find PRODUCTS'); process.exit(1); }
  
  const cleaned = ('[' + prodMatch[1] + ']').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
  let products;
  try { products = JSON.parse(cleaned); } catch(e) { console.error('Parse error:', e.message); process.exit(1); }
  
  console.log(`Total products: ${products.length}`);
  
  const toProcess = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (!p.image || p.image === PLACEHOLDER || p.image.endsWith('/.170x220.jpg')) {
      toProcess.push({ product: p, index: i });
    }
  }
  
  console.log(`Products needing images: ${toProcess.length}`);
  console.log(`Already cached: ${Object.keys(cache).length}`);
  
  const uncached = toProcess.filter(item => !cache[item.product.articul]);
  console.log(`To fetch: ${uncached.length}\n`);
  
  if (uncached.length > 0) {
    const results = await processBatch(uncached, CONCURRENT);
    let found = 0;
    for (const r of results) {
      if (r.url) {
        products[r.index].image = r.url;
        found++;
      }
    }
    saveCache();
    console.log(`\nNew images found: ${found} / ${uncached.length}`);
  }
  
  // Apply cached results
  let applied = 0;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (!p.image || p.image === PLACEHOLDER || p.image.endsWith('/.170x220.jpg')) {
      const cached = cache[p.articul];
      if (cached && cached !== 'NOT_FOUND') {
        products[i].image = cached;
        applied++;
      }
    }
  }
  if (applied > 0) console.log(`Applied from cache: ${applied}`);
  
  // Update data.js
  let newContent = content;
  let replaced = 0;
  for (const product of products) {
    if (product.image && product.image !== PLACEHOLDER && !product.image.endsWith('/.170x220.jpg')) {
      const escaped = product.articul.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(
        `("articul"\\s*:\\s*"${escaped}"[\\s\\S]*?"image"\\s*:\\s*)"https:\\/\\/market-telecom\\.kz\\/files\\/products\\/\\.170x220\\.jpg"`,
        'g'
      );
      const before = newContent.length;
      newContent = newContent.replace(pattern, `$1"${product.image}"`);
      if (newContent.length !== before) replaced++;
    }
  }
  
  fs.writeFileSync(DATA_FILE, newContent, 'utf-8');
  
  // Final stats
  const finalNoImg = (newContent.match(/\/files\/products\/\.170x220\.jpg/g) || []).length;
  const finalWithImg = (newContent.match(/\/files\/products\/[^.]+\.170x220\.jpg/g) || []).length - finalNoImg;
  
  console.log(`\n=== Final Results ===`);
  console.log(`With images: ${finalWithImg}`);
  console.log(`Without images: ${finalNoImg}`);
  console.log(`Replaced in data.js: ${replaced}`);
  console.log('Done!');
}

main().catch(err => { console.error('Failed:', err); saveCache(); process.exit(1); });
