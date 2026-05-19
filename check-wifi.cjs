const fs = require('fs');
const np = JSON.parse(fs.readFileSync('src/new-products.json', 'utf-8'));

// Find all Wi-Fi related products in new-products
const wifi = np.filter(p => {
  const n = String(p.name || p.fullName || '').toLowerCase();
  const cat = String(p.category_raw || p.category || '').toLowerCase();
  return n.includes('wifi') || n.includes('роутер') || n.includes('роуте') ||
    n.includes('роутер') || n.includes('wireless') || n.includes('точк') ||
    n.includes('mesh') || n.includes('mesh') || n.includes('repiter') ||
    n.includes('точк') || n.includes('роутер') || cat.includes('wifi');
});
console.log('=== WIFI products in new-products (', wifi.length, ') ===');
wifi.slice(0, 20).forEach(p => console.log((p.name||p.fullName).substring(0,80), '|'));

// Unique categories for new-products
const catsnp = [...new Set(np.map(p => p.category_raw || p.category || '').filter(Boolean))];
// Search for wlan or Wi-Fi categories
const wlanCats = catsnp.filter(c => /wifi|роутер|точк|mesh|wlan/i.test(c));
console.log('\n=== WiFi-related raw categories in new-products ===');
wlanCats.forEach(c => {
  const items = np.filter(p => (p.category_raw || p.category) === c);
  console.log('[' + items.length + '] ' + c + ' | items:');
  items.slice(0, 3).forEach(p => console.log('    ', (p.name || p.fullName || '').substring(0, 80)));
});

// Now look for all "роутер" or "роуте" categories across all files
['src/price1-products.json', 'src/price2-products.json', 'src/price3-products.json', 'src/new-products.json'].forEach(f => {
  const d = JSON.parse(fs.readFileSync(f, 'utf-8'));
  const cats = [...new Set(d.map(p => (p.category_raw || p.category || '').trim()).filter(Boolean))];
  const wlanRouters = cats.filter(c => /роутер|роуте/i.test(c) || /wifi|wlan/i.test(c));
  if (wlanRouters.length) {
    console.log('\n=== ' + f + ' ' + ' - WiFi/Router categories ===');
    wlanRouters.forEach(c => {
      const items = d.filter(p => (p.category_raw || p.category) === c);
      console.log('[' + items.length + '] ' + c);
      items.slice(0, 3).forEach(p => console.log('    ', (p.name || p.fullName || '').substring(0, 80)));
    });
  }
});
