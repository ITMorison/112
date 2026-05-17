const XLSX = require('xlsx');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const PRICE2_FILE = 'Прайс 2.xlsx';
const PRICE3_FILE = 'Прайс 3.xlsx';
const SECTIONS_FILE = 'Разделы.docx';
const OUTPUT_FILE = 'src/data.js';

function parsePrice(price) {
  if (!price || price === '' || price === 'по запросу') return 0;
  const priceStr = String(price).replace(/[^\d.,]/g, '').replace(',', '.');
  const parsed = parseFloat(priceStr);
  return isNaN(parsed) ? 0 : Math.round(parsed);
}

function parseStock(stock) {
  if (!stock || stock === '' || stock === 'в наличии') return 50;
  const s = String(stock).replace(/[^\d]/g, '');
  const parsed = parseInt(s);
  return isNaN(parsed) || parsed <= 0 ? 50 : parsed;
}

function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0400-\u04FF-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateDescription(title, category) {
  const descriptions = {
    'opticheskie-polki-i-krossy': 'Оптический кросс для организации соединений волоконно-оптических кабелей. Обеспечивает надежную коммутацию и защиту оптических волокон.',
    'kabeli-vitaya-para': 'Сетевой кабель витая пара для передачи данных. Высокое качество передачи сигнала, соответствие стандартам.',
    'setevye-patch-kordy': 'Патчкорд для соединения сетевого оборудования. Надежное соединение, качественные коннекторы.',
    'shkafy-navesnye-nastennye': 'Навесной серверный шкаф для размещения сетевого оборудования. Прочная конструкция, удобный монтаж.',
    'shkafy-napolnye-servernye': 'Напольный серверный шкаф для ЦОД и серверных помещений. Высокая грузоподъемность, вентиляция.',
    'optovolokonnye-adaptery-i-rozetki': 'Оптический адаптер для соединения оптических коннекторов. Низкие потери на соединении.',
    'aksessuary-dlya-optovolokna': 'Аксессуар для оптоволоконных систем. Качественные материалы, надежная работа.',
    'konnektory': 'Телекоммуникационный коннектор RJ45/RJ11 для обжима кабеля. Надежный контакт, долговечность.',
    'konnektory-i-perehodniki': 'Коннектор/переходник для телекоммуникационных систем. Совместимость с стандартными разъемами.',
    'aksessuary-dlya-shkafov-i-stoek': 'Аксессуар для серверных шкафов и стоек. Удобство монтажа и эксплуатации.',
    'telefony': 'Профессиональный SIP-телефон для офисной и корпоративной связи. Высокое качество звука.',
    'kommutatory': 'Сетевой коммутатор для построения локальных сетей. Высокая производительность.',
    'marshrutizatory': 'Маршрутизатор для подключения к сети Интернет и построения сетевой инфраструктуры.',
  };
  return descriptions[category] || `${title} - качественное телекоммуникационное оборудование.`;
}

// Determine category from product name
function detectCategory(name, sheetName) {
  const lower = name.toLowerCase();
  const lowerSheet = (sheetName || '').toLowerCase();

  if (lower.includes('кросс оптический') || lower.includes('оптический кросс') || lowerSheet.includes('кросс'))
    return { slug: 'opticheskie-polki-i-krossy', raw: 'Оптические полки и кроссы' };
  if (lower.includes('кабель') && (lower.includes('витая пара') || lower.includes('utp') || lower.includes('ftp') || lower.includes('neolan')))
    return { slug: 'kabeli-vitaya-para', raw: 'Кабели витая пара' };
  if (lower.includes('патчкорд') || lower.includes('патч-корд'))
    return { slug: 'setevye-patch-kordy', raw: 'Сетевые патч корды' };
  if (lower.includes('шкаф') && (lower.includes('навесн') || lower.includes('настенн')))
    return { slug: 'shkafy-navesnye-nastennye', raw: 'Шкафы навесные, настенные' };
  if (lower.includes('шкаф') && (lower.includes('напольн') || lower.includes('серверн') || lower.includes('климатич')))
    return { slug: 'shkafy-napolnye-servernye', raw: 'Шкафы напольные, серверные' };
  if (lower.includes('муфт'))
    return { slug: 'soedinitelnye-paneli-i-mufty', raw: 'Соединительные панели и муфты' };
  if (lower.includes('пигтейл') || lower.includes('шнур оптич') || lower.includes('патчкорд') && lower.includes('оптич'))
    return { slug: 'optovolokonnye-adaptery-i-rozetki', raw: 'Оптоволоконные адаптеры и розетки' };
  if (lower.includes('адаптер оптич') || lower.includes('коннектор fast') || lower.includes('сплиттер'))
    return { slug: 'aksessuary-dlya-optovolokna', raw: 'Аксессуары для оптоволокна' };
  if (lower.includes('бокс оптич'))
    return { slug: 'optovolokonnye-adaptery-i-rozetki', raw: 'Оптоволоконные адаптеры и розетки' };
  if (lower.includes('кабель') && (lower.includes('оптич') || lower.includes('ftth') || lower.includes('drop')))
    return { slug: 'kabelno-provodnikovaya-produktsiya', raw: 'Кабельно-проводниковая продукция' };
  if (lower.includes('sip-телефон') || lower.includes('sip-телеф') || lower.includes('yealink'))
    return { slug: 'telefony', raw: 'Телефоны' };
  if (lower.includes('коммутатор') || lower.includes('switch'))
    return { slug: 'kommutatory', raw: 'Коммутаторы' };
  if (lower.includes('маршрутизатор') || lower.includes('router'))
    return { slug: 'marshrutizatory', raw: 'Маршрутизаторы' };
  if (lower.includes('коннектор'))
    return { slug: 'konnektory', raw: 'Коннекторы' };
  if (lower.includes('видеокамера') || lower.includes('ip-камер'))
    return { slug: 'ip-kamery', raw: 'IP-камеры' };

  // By sheet name
  if (lowerSheet.includes('лан') || lowerSheet.includes('lan'))
    return { slug: 'kabeli-vitaya-para', raw: 'Кабели витая пара' };
  if (lowerSheet.includes('патчк') || lowerSheet.includes('патч-пан'))
    return { slug: 'setevye-patch-kordy', raw: 'Сетевые патч корды' };
  if (lowerSheet.includes('шкаф'))
    return { slug: 'shkafy-navesnye-nastennye', raw: 'Шкафы навесные, настенные' };
  if (lowerSheet.includes('муфт'))
    return { slug: 'soedinitelnye-paneli-i-mufty', raw: 'Соединительные панели и муфты' };
  if (lowerSheet.includes('шнур'))
    return { slug: 'optovolokonnye-adaptery-i-rozetki', raw: 'Оптоволоконные адаптеры и розетки' };
  if (lowerSheet.includes('кросс') || lowerSheet.includes('оптич'))
    return { slug: 'opticheskie-polki-i-krossy', raw: 'Оптические полки и кроссы' };
  if (lowerSheet.includes('телефон'))
    return { slug: 'telefony', raw: 'Телефоны' };

  return { slug: 'setevye-ustroystva-i-oborudovanie', raw: 'Сетевые устройства и оборудование' };
}

function readDocx(filePath) {
  const buffer = fs.readFileSync(filePath);
  return mammoth.extractRawText({ buffer })
    .then(result => result.value)
    .catch(err => {
      console.error('Error reading docx:', err.message);
      return '';
    });
}

function processPrice2() {
  console.log('Processing Прайс 2.xlsx...');
  const wb = XLSX.readFile(PRICE2_FILE);
  const products = [];
  const categoriesSet = new Set();
  let globalId = 1000;

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    // Find header row (contains "Артикул" or "Код")
    let headerRow = -1;
    for (let i = 0; i < Math.min(15, data.length); i++) {
      const row = data[i].map(c => String(c).toLowerCase());
      if (row.some(c => c.includes('артикул') || c.includes('код/'))) {
        headerRow = i;
        break;
      }
    }
    if (headerRow === -1) continue;

    // Determine column indices from header
    const header = data[headerRow].map(c => String(c).toLowerCase());
    let articulCol = header.findIndex(c => c.includes('артикул') || c.includes('код'));
    let nameCol = header.findIndex(c => c.includes('наименование') || c.includes('номенклатур'));
    let priceCol = header.findIndex(c => c.includes('цена сайт') || c.includes('розница'));
    let stockCol = header.findIndex(c => c.includes('остаток') || c.includes('наличи'));

    // Fallback: use positional mapping if headers not found
    if (articulCol === -1) articulCol = 0;
    if (nameCol === -1) nameCol = 1;
    if (priceCol === -1) {
      // Try to find any price column
      priceCol = header.findIndex(c => c.includes('цена'));
      if (priceCol === -1) priceCol = 4; // Common position
    }

    for (let i = headerRow + 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;

      const name = String(row[nameCol] || '').trim();
      if (!name || name === 'nan' || name.length < 3) continue;

      // Skip header-like rows
      if (name.toLowerCase().includes('артикул') || name.toLowerCase().includes('код/')) continue;

      const articul = String(row[articulCol] || '').trim();
      if (!articul || articul === 'nan' || articul.length < 1) continue;

      let price = parsePrice(row[priceCol]);
      // If no price in detected column, try other columns
      if (price <= 0) {
        for (let col = 3; col < Math.min(8, row.length); col++) {
          price = parsePrice(row[col]);
          if (price > 0) break;
        }
      }
      if (price <= 0) continue;

      const stock = stockCol >= 0 ? parseStock(row[stockCol]) : 50;
      const cat = detectCategory(name, sheetName);

      globalId++;
      const product = {
        id: globalId,
        title: name,
        articul: String(articul),
        sku: String(articul),
        brand: '',
        brand_name: '',
        price: price,
        stock: stock,
        is_available: stock > 0,
        category: cat.slug,
        category_raw: cat.raw,
        image: 'https://market-telecom.kz/files/products/.170x220.jpg',
        description: generateDescription(name, cat.slug)
      };

      products.push(product);
      categoriesSet.add(JSON.stringify({ slug: cat.slug, raw: cat.raw }));
    }
  }

  const categories = [...categoriesSet].map(c => JSON.parse(c));
  console.log(`  Found ${products.length} products from Прайс 2`);
  return { products, categories };
}

function processPrice3() {
  console.log('Processing Прайс 3.xlsx...');
  const wb = XLSX.readFile(PRICE3_FILE);
  const products = [];
  const categoriesSet = new Set();
  let globalId = 2000;

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    // Find header row
    let headerRow = -1;
    for (let i = 0; i < Math.min(5, data.length); i++) {
      const row = data[i].map(c => String(c).toLowerCase());
      if (row.some(c => c.includes('наименование') || c.includes('артикул'))) {
        headerRow = i;
        break;
      }
    }
    if (headerRow === -1) continue;

    const header = data[headerRow].map(c => String(c).toLowerCase());
    let nameCol = 0;
    let modelCol = 1;
    let priceCol = header.findIndex(c => c.includes('ррц') || c.includes('цена'));
    if (priceCol === -1) priceCol = 2;

    for (let i = headerRow + 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;

      const name = String(row[nameCol] || '').trim();
      const model = String(row[modelCol] || '').trim();

      if (!name || name === 'nan' || name.length < 5) continue;

      // Skip section headers
      if (/^\d+\.\s/.test(name) && !model) continue;
      if (['nan', ''].includes(model) && name.length < 10) continue;

      let price = parsePrice(row[priceCol]);
      if (price <= 0) {
        for (let col = 2; col < Math.min(7, row.length); col++) {
          price = parsePrice(row[col]);
          if (price > 0) break;
        }
      }
      if (price <= 0) continue;

      const cat = detectCategory(name, sheetName);
      const brand = name.toLowerCase().includes('yealink') ? 'Yealink' : '';

      globalId++;
      const product = {
        id: globalId,
        title: name,
        articul: model || `price3_${i}`,
        sku: model || `price3_${i}`,
        brand: brand,
        brand_name: brand,
        price: price,
        stock: 50,
        is_available: true,
        category: cat.slug,
        category_raw: cat.raw,
        image: 'https://market-telecom.kz/files/products/.170x220.jpg',
        description: generateDescription(name, cat.slug)
      };

      products.push(product);
      categoriesSet.add(JSON.stringify({ slug: cat.slug, raw: cat.raw }));
    }
  }

  const categories = [...categoriesSet].map(c => JSON.parse(c));
  console.log(`  Found ${products.length} products from Прайс 3`);
  return { products, categories };
}

async function readSections() {
  console.log('Reading Разделы.docx...');
  const text = await readDocx(SECTIONS_FILE);
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  // Remove duplicates
  const unique = [...new Set(lines)];
  console.log(`  Found ${unique.length} categories from Разделы.docx`);
  return unique;
}

function updateDataJs(allCategories, allProducts) {
  console.log('Updating src/data.js...');
  let content = fs.readFileSync(OUTPUT_FILE, 'utf-8');

  // Get existing category slugs to avoid duplicates
  const existingCatSlugs = new Set();
  const catSlugMatches = content.matchAll(/"slug":\s*"([^"]+)"/g);
  for (const m of catSlugMatches) {
    existingCatSlugs.add(m[1]);
  }

  // Get max category id
  const catIdMatches = [...content.matchAll(/"id":\s*(\d+)/g)].map(m => parseInt(m[1]));
  let maxCatId = Math.max(...catIdMatches, 0);

  // Find CATEGORIES array and add new ones
  const catMatch = content.match(/(export const CATEGORIES = \[)([\s\S]*?)(\];)/);
  if (catMatch) {
    const existingCats = catMatch[2];
    let newCatEntries = [];
    for (const cat of allCategories) {
      if (!existingCatSlugs.has(cat.slug)) {
        maxCatId++;
        existingCatSlugs.add(cat.slug);
        newCatEntries.push(`  {
    "id": ${maxCatId},
    "title": "${cat.raw.replace(/"/g, '\\"')}",
    "slug": "${cat.slug}"
  }`);
      }
    }
    if (newCatEntries.length > 0) {
      const separator = existingCats.trim() ? ',\n' : '';
      const newCatsStr = catMatch[1] + existingCats.trimEnd() + separator + newCatEntries.join(',\n') + '\n' + catMatch[3];
      content = content.replace(catMatch[0], newCatsStr);
      console.log(`  Added ${newCatEntries.length} new categories`);
    }
  }

  // Get max product id
  const prodIdMatches = [...content.matchAll(/"id":\s*(\d+)/g)].map(m => parseInt(m[1]));
  let maxProdId = Math.max(...prodIdMatches, 0);

  // Get existing product articuls to avoid duplicates
  const existingArticuls = new Set();
  const articulMatches = content.matchAll(/"articul":\s*"([^"]+)"/g);
  for (const m of articulMatches) {
    existingArticuls.add(m[1]);
  }

  // Find MEGA_MENU_DATA and update with new categories
  const megaMatch = content.match(/(export const MEGA_MENU_DATA = \[)([\s\S]*?)(\];)/);
  if (megaMatch) {
    const existingMega = megaMatch[2];
    const existingMegaSlugs = new Set();
    const megaSlugMatches = existingMega.matchAll(/"slug":\s*"([^"]+)"/g);
    for (const m of megaSlugMatches) {
      existingMegaSlugs.add(m[1]);
    }

    let newMegaEntries = [];
    for (const cat of allCategories) {
      if (!existingMegaSlugs.has(cat.slug)) {
        newMegaEntries.push(`  {
    "id": ${maxCatId},
    "title": "${cat.raw.replace(/"/g, '\\"')}",
    "slug": "${cat.slug}",
    "image": "/cat-default.svg",
    "subcategories": []
  }`);
      }
    }
    if (newMegaEntries.length > 0) {
      const separator = existingMega.trim() ? ',\n' : '';
      const newMegaStr = megaMatch[1] + existingMega.trimEnd() + separator + newMegaEntries.join(',\n') + '\n' + megaMatch[3];
      content = content.replace(megaMatch[0], newMegaStr);
    }
  }

  // Find PRODUCTS array and add new ones
  const prodMatch = content.match(/(export const PRODUCTS = \[)([\s\S]*?)(\];)/);
  if (prodMatch) {
    const existingProds = prodMatch[2];
    let newProdEntries = [];
    for (const prod of allProducts) {
      if (existingArticuls.has(prod.articul)) continue;

      maxProdId++;
      prod.id = maxProdId;
      existingArticuls.add(prod.articul);

      const prodJson = JSON.stringify(prod, null, 2);
      newProdEntries.push(prodJson);
    }
    if (newProdEntries.length > 0) {
      const separator = existingProds.trim() ? ',\n' : '';
      const newProdsStr = prodMatch[1] + existingProds.trimEnd() + separator + newProdEntries.join(',\n') + '\n' + prodMatch[3];
      content = content.replace(prodMatch[0], newProdsStr);
      console.log(`  Added ${newProdEntries.length} new products`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log('  src/data.js updated successfully');
}

async function main() {
  console.log('=== Starting data migration ===\n');

  // Read sections from docx
  const sections = await readSections();
  const sectionCategories = sections.map(s => ({
    slug: slugify(s),
    raw: s
  })).filter(c => c.slug && c.slug.length > 2);

  // Process price files
  const { products: products2, categories: cats2 } = processPrice2();
  const { products: products3, categories: cats3 } = processPrice3();

  // Combine all categories
  const allCatMap = new Map();
  for (const cat of [...sectionCategories, ...cats2, ...cats3]) {
    if (cat.slug && !allCatMap.has(cat.slug)) {
      allCatMap.set(cat.slug, cat);
    }
  }
  const allCategories = [...allCatMap.values()];

  // Combine all products
  const allProducts = [...products2, ...products3];

  console.log(`\nTotal new categories: ${allCategories.length}`);
  console.log(`Total new products: ${allProducts.length}`);

  // Update data.js
  updateDataJs(allCategories, allProducts);

  console.log('\n=== Migration completed! ===');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
