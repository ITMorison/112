const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const outDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const newProducts = JSON.parse(fs.readFileSync(path.join(srcDir, 'new-products.json'), 'utf8'));
const price1 = JSON.parse(fs.readFileSync(path.join(srcDir, 'price1-products.json'), 'utf8'));
const price2 = JSON.parse(fs.readFileSync(path.join(srcDir, 'price2-products.json'), 'utf8'));
const price3 = JSON.parse(fs.readFileSync(path.join(srcDir, 'price3-products.json'), 'utf8'));
const imageMap = JSON.parse(fs.readFileSync(path.join(srcDir, 'image-map.json'), 'utf8'));

const RAW = [...newProducts, ...price1, ...price2, ...price3];

function getProductImage(code, article) {
  const BLANK = '/_blank-photo.jpg';
  if (!code && !article) return BLANK;
  if (code) {
    const cs = String(code);
    const images = imageMap[cs] || imageMap[cs.padStart(5, '0')];
    if (images && images.length) return '/' + images[0];
  }
  if (article) {
    const as = String(article).toLowerCase();
    const images = imageMap[as];
    if (images && images.length) return '/' + images[0];
  }
  return BLANK;
}

function normalizeKey(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9а-яё]+/g, ' ').trim(); }

const categoryMap = {
  // minimal map for generator - rely on heuristics for video
  "Аналоговые видеокамеры": { category: "videonablyudenie", subcategory: "analogovye-videokamery" },
  "IP видеокамеры": { category: "videonablyudenie", subcategory: "ip-videokamery" }
};

function mapCategory(p) {
  const rawKey = p.category_raw || p.category || '';
  let mapping = categoryMap[rawKey];
  if (!mapping) {
    const normalized = normalizeKey(rawKey);
    mapping = Object.fromEntries(Object.entries(categoryMap).map(([k,v])=>[normalizeKey(k),v]))[normalized];
  }
  if (!mapping) {
    const txt = (String(p.name || '') + ' ' + String(p.fullName || '') + ' ' + rawKey).toLowerCase();
    const hasVideo = /видеокам|видеокамера|видеорегистрат|видеодомофон|видеодомоф/.test(txt);
    const hasAnalog = /аналог|cvbs|hdcvi|tvi|ahd|cvbs/.test(txt);
    const hasIp = /ip\b|ip\s|ip-/.test(txt);
    const hasHybrid = /гибрид|hybrid/.test(txt);
    if (hasVideo) {
      if (hasAnalog || hasHybrid) mapping = { category: 'videonablyudenie', subcategory: 'analogovye-videokamery' };
      else if (hasIp) mapping = { category: 'videonablyudenie', subcategory: 'ip-videokamery' };
      else mapping = { category: 'videonablyudenie', subcategory: 'ip-videokamery' };
    }
    if (!mapping && /видеорегистрат|регистратор/.test(txt)) {
      if (hasHybrid || hasAnalog) mapping = { category: 'videonablyudenie', subcategory: 'gibridnye-videoregistratory' };
      else mapping = { category: 'videonablyudenie', subcategory: 'ip-videoregistratory' };
    }
  }
  return mapping || { category: p.category || 'other', subcategory: p.subcategory || 'other' };
}

const PRODUCTS = RAW.map((p, idx) => {
  const mapping = mapCategory(p);
  const cat = mapping.category;
  const subcat = mapping.subcategory;
  return {
    ...p,
    id: `prod-${p.code || idx}-${idx}`,
    title: p.name || p.fullName || 'Без названия',
    articul: p.article || String(p.code),
    sku: p.article || String(p.code),
    brand: '',
    price: Number(p.price) || 0,
    stock: 10,
    is_available: true,
    category: cat,
    category_raw: p.category_raw,
    image: getProductImage(p.code, p.article),
    description: p.fullName || p.name || '',
    subcategory: subcat
  };
});

fs.writeFileSync(path.join(outDir, 'products.json'), JSON.stringify(PRODUCTS, null, 2), 'utf8');
console.log('Wrote', PRODUCTS.length, 'products to public/data/products.json');
process.exit(0);
