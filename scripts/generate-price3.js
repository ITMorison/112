import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import CATEGORY_MAP from data.js
import { CATEGORY_MAP } from '../src/data.js';

// Read all products
const allProductsPath = new URL('../src/all-price-products.json', import.meta.url);
const rawProducts = JSON.parse(fs.readFileSync(allProductsPath, 'utf-8'));

// Filter: keep only products with a positive price and non-empty name
const allProducts = rawProducts.filter(p => p.price > 0 && p.name && p.name.trim());

// Build mapping suggestion for each raw category
const uniqueRaws = [...new Set(allProducts.map(p => p.category_raw).filter(Boolean))];

const mappingSuggestions = {};
const unmapped = [];

for (const raw of uniqueRaws) {
  // Try direct exact match
  if (CATEGORY_MAP[raw]) {
    mappingSuggestions[raw] = CATEGORY_MAP[raw];
    continue;
  }
  // Try case-insensitive substring match: check if any known key is a substring of raw or vice versa
  let bestMatch = null;
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    const keyLower = key.toLowerCase();
    const rawLower = raw.toLowerCase();
    if (rawLower.includes(keyLower) || keyLower.includes(rawLower)) {
      // if match with at least 3 letters common?
      bestMatch = val;
      break;
    }
  }
  if (bestMatch) {
    mappingSuggestions[raw] = bestMatch;
    continue;
  }

  // Keyword-based inference
  const lower = raw.toLowerCase();
  let inferred = null;
  if (/радиостанц|раци|антенн|мачт|гарнитур|аккумулятор|заряд|ретранслятор|дуплексер|инвертор|преобразователь|репитер|gps|трекер|кронштейн|кабель коаксиал|программатор/.test(lower)) {
    inferred = { category: 'radio-equipment', subcategory: 'radiostations' }; // will refine later
  } else if (/ip-телефон|телефон|ats|шлюз| sip |voip|dect|gigaset|yeastar|fanvil|3cx|grandstream|polycom|aastra|mitel|panasonic|siemens|alcatel/.test(lower)) {
    inferred = { category: 'ip-telefony', subcategory: 'ip-telefony' };
  } else if (/кабель|провод|витая|patch|патчкорд|коннектор|колпачок|буты|панель|муфт?а|кросс|шнур|бокс|волокно|оптика|olt|pon|xp/.test(lower)) {
    inferred = { category: 'kabelnye-sistemy', subcategory: 'passivnoe-setevoe' };
  } else if (/сервер|свитч|коммутатор|роутер|маршрутизатор|модем|точка доступа|wi-?fi|wifi|ap|сетево/.test(lower)) {
    inferred = { category: 'setevoe-i-servernoe-oborudovanie', subcategory: 'aktivnoe-setevoe' };
  } else if (/камер|камера|видео|видеонаблюден|регистратор|домофон|контроллер|считыватель|турникет|шлагбаум|замок|доводчик|умный дом|сигнализатор|извещатель|прибор/.test(lower)) {
    inferred = { category: 'sistemy-bezopasnosti', subcategory: 'sistemy-videonablyudeniya' };
  } else if (/панель|экран|проектор|монитор|интерактив|видеостен|led|oled|display/.test(lower)) {
    inferred = { category: 'kommercheskaya-vizualizaciya', subcategory: 'interaktivnye-paneli' };
  } else if (/компьютер|ноутбук|моноблок|системный блок|процессор|видеокарта|материнская|память|ssd|hdd|корпус|блок питания|монитор|мышь|клавиатура|коврик|наушник/.test(lower)) {
    inferred = { category: 'kompyutery-i-komplektuyushchie', subcategory: 'sistemnye-bloki' };
  } else if (/принтер|мфу|сканер|ламинатор|шредер/.test(lower)) {
    inferred = { category: 'ofisnoe-oborudovanie', subcategory: 'ofisnoe-oborudovanie' };
  } else if (/кондиционер|вентилятор|увлажнитель|очиститель|кулер/.test(lower)) {
    inferred = { category: 'demonstracionnoe-oborudovanie', subcategory: 'demo-oborudovanie' };
  } else {
    unmapped.push(raw);
    inferred = { category: 'other', subcategory: 'other' };
  }

  mappingSuggestions[raw] = inferred;
}

// Now create price3 products
const price3Products = allProducts.map(p => {
  const mapping = mappingSuggestions[p.category_raw] || { category: 'other', subcategory: 'other' };
  // Generate code: if articul is numeric, keep; else hash
  let code = parseInt(p.articul);
  if (isNaN(code)) {
    // simple hash from string
    let hash = 0;
    for (let i = 0; i < p.articul.length; i++) {
      hash = ((hash << 5) - hash) + p.articul.charCodeAt(i);
      hash |= 0;
    }
    code = Math.abs(hash);
  }
  return {
    category_raw: p.category_raw,
    code: code,
    article: p.articul,
    name: p.name,
    fullName: p.name,
    price: p.price,
    category: mapping.category,
    subcategory: mapping.subcategory
  };
});

// Write output using URL paths (Node fs supports file URLs)
const outDir = new URL('../src/', import.meta.url);
const price3Path = new URL('price3-products.json', outDir);
const mappingPath = new URL('category-mapping-suggestions.json', outDir);
const unmappedPath = new URL('unmapped-categories.json', outDir);

fs.writeFileSync(price3Path, JSON.stringify(price3Products, null, 2), 'utf-8');
fs.writeFileSync(mappingPath, JSON.stringify(mappingSuggestions, null, 2), 'utf-8');
fs.writeFileSync(unmappedPath, JSON.stringify(unmapped, null, 2), 'utf-8');

console.log(`✅ Generated price3-products.json with ${price3Products.length} products`);
console.log(`📋 Mapped ${uniqueRaws.length} raw categories (${unmapped.length} unmapped, see unmapped-categories.json)`);
console.log('💡 You can review and adjust category-mapping-suggestions.json before final integration');
