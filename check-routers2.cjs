const fs = require('fs');
const p1 = JSON.parse(fs.readFileSync('src/price1-products.json', 'utf-8'));
const p2 = JSON.parse(fs.readFileSync('src/price2-products.json', 'utf-8'));
const p3 = JSON.parse(fs.readFileSync('src/price3-products.json', 'utf-8'));
const np = JSON.parse(fs.readFileSync('src/new-products.json', 'utf-8'));
const all = [...p1, ...p2, ...p3, ...np];

// Find all standalone WiFi routers (not mesh/дековые/точки)
const wifiRouters = all.filter(p => {
  const n = String(p.name || p.fullName || '').toLowerCase();
  const cat = String(p.category_raw || p.category || '').toLowerCase();
  return /роутер|роуте/i.test(n) || /роутер|роуте/i.test(cat)
    && !n.includes('mesh') && !n.includes('деко') && !n.includes('точк доступ');
});

console.log('WiFi routers:', wifiRouters.length);
if (wifiRouters.length) {
  wifiRouters.slice(0, 30).forEach(p => {
    console.log('  ', (p.name || p.fullName).substring(0, 70), '|', (p.category_raw || p.category || ''));
  });
}

// Find everything with a WiFi/Router raw category 
const cats = [...new Set(all.map(p => (p.category_raw || p.category || '').trim()).filter(Boolean))];
const wlanCat = cats.filter(c => /роутер|роуте/i.test(c));
console.log('\nВсе категории с "роутер":');
wlanCat.forEach(c => {
  console.log('  [' + all.filter(p => (p.category_raw||p.category||'').trim() === c).length + ']', c);
});

// Find "WiFi роутеры" in raw cats
if (cats.includes('WiFi роутеры')) {
  const items = all.filter(p => (p.category_raw||p.category||'').trim() === 'WiFi роутеры');
  console.log('\nWiFi роутеры count:', items.length, '| sample:', (items[0]||{}).name);
} else {
  console.log('\nWiFi роутеры: not in any price file');
}
