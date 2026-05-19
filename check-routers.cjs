const fs = require('fs');
const p1 = JSON.parse(fs.readFileSync('src/price1-products.json', 'utf-8'));
const p2 = JSON.parse(fs.readFileSync('src/price2-products.json', 'utf-8'));
const p3 = JSON.parse(fs.readFileSync('src/price3-products.json', 'utf-8'));
const np = JSON.parse(fs.readFileSync('src/new-products.json', 'utf-8'));
const all = [...p1, ...p2, ...p3, ...np];

// Find all standalone WiFi router products (not mesh/дековые)
// Not "mesh", not "телефон", not антенн, not repeater/усилитель, not точке доступа

const wifiRouters = all.filter(p => {
  const n = String(p.name || p.fullName || '').toLowerCase();
  const cat = String(p.category_raw || p.category || '').toLowerCase();
  // Router in name, not mesh/deco/ap/точк/Access Point type
  return (/роутер|роуте/i.test(n) || router(n) || /роутер|роуте/i.test(cat))
    && !n.includes('mesh') && !n.includes('деко') && !n.includes('точк доступ')
    && !n.includes('релais') && !n.includes('усилитель') && !n.includes('репитер');
});

console.log('WiFi routers (non-mesh):', wifiRouters.length);
wifiRouters.slice(0, 20).forEach(p => {
  console.log('  ', (p.name || p.fullName).substring(0, 80), '| cat:', (p.category_raw || p.category || ''));
});

// Let me also check price3 for Wi-Fi/Dlink/TPlink/huawei/synology/ubiquiti/asus routers
const allRouterNames = all.filter(p => {
  const n = String(p.name || p.fullName || '').toLowerCase();
  return (/роутер|wlan|маршрутизатор/i.test(n)) && !n.includes('mesh') && !n.includes('деко') && !n.includes('роутер')
    || /роутер/i.test(String(p.name || p.fullName || '')) 
    && !(/mesh|деко|точк|ap\b/i.test(String(p.name||p.fullName||'').toLowerCase()));
});

console.log('\n=== ALL ROUTERS (non-mesh, non-AP) ===');
const allCatR = all.filter(p => {
  const n = String(p.name || p.fullName || '').toLowerCase();
  return /роутер/i.test(n) && !n.includes('mesh') && !n.includes('деко') && !n.includes('точк доступ');
});
console.log('Total:', allCatR.length);
allCatR.slice(0,30).forEach(p => console.log('  ', (p.name||p.fullName).substring(0, 70)));
