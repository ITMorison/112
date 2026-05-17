import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'output_prices');

// Known brands for auto-detection
const BRANDS = [
  'Yeastar', 'Fanvil', 'Gigaset', 'VT', '3CX', 'Wi-Tek', 'TG-NET', 
  'Al-Style', 'YOSAN', 'President', 'AnyTone', 'Luiton', 'LAFAYETTE',
  'Yealink', 'Cisco', 'HP', 'D-Link', 'Ubiquiti', 'MikroTik', 'Grandstream',
  'Polycom', 'Avaya', 'Aastra', 'Mitel', 'Panasonic', 'Siemens', 'Alcatel',
  'Samsung', 'LG', 'NEC', 'Shure', 'Jabra', 'Plantronics', 'Logitech',
  'Microsoft', 'Sennheiser', 'Beyerdynamic', 'ASUS', 'Dell', 'Lenovo',
  'Huawei', 'ZTE', 'TP-Link', 'Netgear', 'Supermicro', 'Intel', 'AMD',
  'Seagate', 'WD', 'Toshiba', 'Kingston', 'Crucial', 'Samsung', 'Gigabyte',
  'MSI', 'ASRock', 'EVGA', 'Zotac', 'Palit', 'Inno3D', 'PowerColor',
  'Sapphire', 'ASUS', 'Acer', 'BenQ', 'ViewSonic', 'Eizo', 'NEC',
  'Eaton', 'APC', 'Schneider', 'ABB', 'Siemens', 'Legrand', 'Kroy',
  'KRON', 'Gewiss', 'EBERLE', 'Simon', 'Utes', 'IEK', 'Titan',
  'Всеuro', 'СБ', 'PROFTELECOM', 'All Prof-Telecom', 'IPMatika'
];

// Category keyword hints
const CATEGORY_KEYWORDS = {
  'radio-equipment': ['радиостанция', 'рация', 'антенн', 'мачт', 'гарнитур', 'аккумулятор', 'заряд', 'ретранслятор', 'дуплексер', 'инвертор', 'преобразователь', 'репитер', 'gps', 'трекер', 'кронштейн', 'кабель', 'коннектор', 'громкоговоритель', 'сплиттер', 'усилитель', 'блок питания', 'программатор'],
  'ip-telephony': ['ip-телефон', 'телефон', 'ats', 'шлюз', 'атс', 'sip', 'voip', 'dect', 'gigaset', 'yeastar', 'fanvil', '3cx', 'grandstream', 'polycom', 'aastra', 'mitel', 'panasonic', 'siemens', 'alcatel', 'samsung', 'huawei', 'zte'],
  'kabelnye-sistemy': ['кабель', 'провод', 'витая пара', 'patch cord', 'патчкорд', 'коннектор', 'колпачок', 'буты', 'панель', 'муфта', 'кросс', 'шнур', 'бокс', 'волна', 'волокно', 'оптика', 'волоконно', 'olt', 'pon', 'xp'],
  'setevoe-i-servernoe': ['сервер', 'свитч', 'коммутатор', 'роутер', 'маршрутизатор', 'модем', 'точка доступа', 'wi-fi', 'wifi', 'ap', 'сеть', 'сетевой', ' PoE', 'портал'],
  'sistemy-bezopasnosti': ['камер', 'камера', 'видео', 'видеонаблюден', 'регистратор', 'домафония', 'домофон', 'контроллер', 'считыватель', 'турникет', 'шлагбаум', 'замок', 'доводчик', 'умный дом', 'сигнализатор', 'извещатель', 'прибор', 'панель', 'монитор'],
  'kommercheskaya-vizualizaciya': ['панель', 'экран', 'проектор', 'монитор', 'интерактив', 'видеостен', 'led', 'oled', 'qled', 'тач', 'panel', 'display', 'проекция', 'объектив', 'камера'],
  'kompyutery-i-komplektuyushchie': ['компьютер', 'ноутбук', 'моноблок', 'системный блок', 'процессор', 'видеокарта', 'материнская плата', 'память', 'ssd', 'hdd', 'корпус', 'блок питания', 'монитор', 'мышь', 'клавиатура', 'коврик', 'наушник', 'гарнитура'],
  'ofisnoe-oborudovanie': ['принтер', 'мфу', 'сканер', 'ламинатор', 'шредер', 'копир', 'ксерокс'],
  'demonstracionnoe-oborudovanie': ['кондиционер', 'вентилятор', 'увлажнитель', 'очиститель', 'кулер']
};

function guessCategoryFromText(text) {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return cat;
    }
  }
  return null;
}

function detectHeaderRow(rows) {
  // Search up to 30 rows for a plausible header
  for (let i = 0; i < Math.min(30, rows.length); i++) {
    const row = rows[i];
    const joined = row.map(c => String(c).toLowerCase()).join(' ');
    const hasArticul = /артикул|код|id|арт/.test(joined);
    const hasName = /наименование|описание|товар|имя|name|product|position/.test(joined);
    const hasPrice = /цена|розница|дилер|опт|pp|rrp|cost|price| wholesale|retail/.test(joined);
    if (hasArticul && (hasName || hasPrice)) {
      return i;
    }
  }
  // fallback: first row that has some content and not too many empty cells
  for (let i = 0; i < Math.min(15, rows.length); i++) {
    if (rows[i].filter(c => c && c.trim()).length >= 3) {
      return i;
    }
  }
  return 0;
}

function parseTabFile(filePath, sourceName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { products: [], categories: [] };

  // Split by tabs - but some cells may contain tabs inside quoted text? Usually not.
  const rows = lines.map(line => {
    // Handle weird quotes: strip surrounding quotes from each cell if present
    const cells = line.split('\t');
    return cells.map(c => c.trim().replace(/^[""]|[""]$/g, ''));
  });

  const headerRowIndex = detectHeaderRow(rows);
  const header = rows[headerRowIndex].map((h, idx) => ({
    idx,
    raw: h,
    clean: h.toLowerCase().replace(/\s+/g, ' ')
  }));

  // Identify columns
  const articulCol = header.findIndex(h => /артикул|код|арт/.test(h.clean));
  const nameCol = header.findIndex(h => /наименование|описание|товар|имя|product name|fullname/.test(h.clean));
  const brandCol = header.findIndex(h => /производитель|бренд|brand|maker/.test(h.clean));
  const urlCol = header.findIndex(h => /url|ссылка|link|image/.test(h.clean));
  const statusCol = header.findIndex(h => /status|состояние|наличие|остаток|available/.test(h.clean));
  
  // Price columns: collect all that look like price
  const priceCandidates = header
    .filter(h => /цена|розница|дилер|опт|pp|rrp|retail|wholesale|price|ррц|kz/.test(h.clean))
    .map(h => ({ idx: h.idx, name: h.raw }));

  // Choose main price column: prefer "Цена сайт" or "Розница" or first price column
  let mainPriceIdx = -1;
  const prioritized = priceCandidates.find(p => /цена сайт|розница/.test(p.name.toLowerCase()));
  if (prioritized) mainPriceIdx = prioritized.idx;
  else if (priceCandidates.length > 0) mainPriceIdx = priceCandidates[0].idx;

  // Category detection: keep track of last seen category line
  let currentCategory = '';

  const products = [];
  const categories = new Set();

  // Data rows
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    // skip totally empty rows
    if (row.every(c => !c)) continue;

    // Detect category row: a single non-emptycell that contains category keywords
    const nonEmpty = row.map((c, idx) => ({ idx, val: c.trim() })).filter(x => x.val);
    if (nonEmpty.length === 1) {
      const text = nonEmpty[0].val;
      // If it looks like a category (contains keywords OR matches pattern like numbers+dot)
      const isCategory =
        /^[\d\.]+$/.test(text.replace(/\s/g, '').slice(0, 3)) || // starts with digits+dot numbering
        (text.length < 80 && /[а-яА-Яa-zA-Z]/.test(text) && !/^\d+$/.test(text)); // non-purely numeric short text
      if (isCategory) {
        // Also check if it's not a product name (no price in this row and nothing that looks like articul)
        // Often category rows have empty price columns
        const hasPriceLike = priceCandidates.some(p => {
          const v = row[p.idx] ? String(row[p.idx]).trim() : '';
          return /^[\d.,]+$/.test(v.replace(/,/g, ''));
        });
        if (!hasPriceLike) {
          // Confirm it has category-like words? Use keywords from any known category
          const known = ['радио', 'телефон', 'кабель', 'коммутатор', 'гMOUS', 'гарнитур', 'камер', 'регистр', 'сервер', 'сеть', 'оптика', 'шлюз', 'атс', ' mikr', 'dect', 'gsm', 'wifi', 'wi-fi', 'ip', 'voip', 'sip', 'lte', '3g', '4g', 'anten', 'муфт', 'кросс', 'патч', 'бокс', 'панел', 'коннектор', 'розетк', 'кассет', ' splitter', 'конвертер', 'модул', 'слот', 'bracket'];
          const looksCategory = known.some(kw => text.toLowerCase().includes(kw));
          if (looksCategory || /^[\d\.]+[ \t]+[а-яА-Яa-zA-Z]/.test(text)) {
            currentCategory = text;
            categories.add(text);
            continue; // skip adding as product
          }
        }
      }
    }

    // Extract fields
    const articul = articulCol >= 0 ? (row[articulCol] || '').toString().trim() : '';
    let name = nameCol >= 0 ? (row[nameCol] || '').toString().trim() : '';
    if (!name && articul) {
      // If name empty but we have articul and maybe brand
      const brand = brandCol >= 0 ? (row[brandCol] || '').toString().trim() : '';
      name = brand ? `${brand} ${articul}` : articul;
    }
    if (!name) continue;

    // Find a price
    let price = 0;
    // Prefer mainPriceIdx if defined
    if (mainPriceIdx >= 0) {
      const val = (row[mainPriceIdx] || '').toString().trim();
      const num = parseFloat(String(val).replace(/[^\d.,]/g, '').replace(',', '.'));
      if (!isNaN(num) && num > 0) price = num;
    }
    // If price still 0, try all price columns
    if (price === 0) {
      for (const pc of priceCandidates) {
        const val = (row[pc.idx] || '').toString().trim();
        const num = parseFloat(String(val).replace(/[^\d.,]/g, '').replace(',', '.'));
        if (!isNaN(num) && num > 0) {
          price = num;
          break;
        }
      }
    }

    // Brand extraction
    let brand = '';
    if (brandCol >= 0) brand = (row[brandCol] || '').toString().trim();
    if (!brand) {
      // infer from name: first word if in known brands
      const firstWord = name.split(' ')[0];
      if (BRANDS.some(b => firstWord.toLowerCase().includes(b.toLowerCase()))) {
        brand = firstWord;
      }
    }

    // URL
    let url = '';
    if (urlCol >= 0) url = (row[urlCol] || '').toString().trim();

    // Status
    let status = '';
    if (statusCol >= 0) status = (row[statusCol] || '').toString().trim();

    products.push({
      articul: articul || `gen-${i}`,
      name,
      price,
      brand,
      url,
      status,
      source: sourceName,
      category_raw: currentCategory || 'Без категории'
    });
  }

  return { products, categories: Array.from(categories) };
}

function main() {
  const result = { byFolder: {}, allProducts: [], allCategories: [] };
  const allCats = new Set();

  // Process root txt files
  const rootFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.toLowerCase().endsWith('.txt'));
  result.byFolder['_root'] = {};
  for (const file of rootFiles) {
    const parsed = parseTabFile(path.join(OUTPUT_DIR, file), file);
    result.byFolder['_root'][file] = { count: parsed.products.length, categories: parsed.categories };
    result.allProducts.push(...parsed.products);
    parsed.categories.forEach(c => allCats.add(c));
  }

  // Process subfolders
  const subfolders = fs.readdirSync(OUTPUT_DIR).filter(f => {
    const stat = fs.statSync(path.join(OUTPUT_DIR, f));
    return stat.isDirectory();
  });

  for (const folder of subfolders) {
    const folderPath = path.join(OUTPUT_DIR, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.toLowerCase().endsWith('.txt'));
    result.byFolder[folder] = {};
    for (const file of files) {
      const parsed = parseTabFile(path.join(folderPath, file), `${folder}/${file}`);
      result.byFolder[folder][file] = { count: parsed.products.length, categories: parsed.categories };
      result.allProducts.push(...parsed.products);
      parsed.categories.forEach(c => allCats.add(c));
    }
  }

  result.allCategories = Array.from(allCats);

  // Write outputs
  const outDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Full product list
  fs.writeFileSync(path.join(outDir, 'all-price-products.json'), JSON.stringify(result.allProducts, null, 2), 'utf-8');
  // Summary
  fs.writeFileSync(path.join(outDir, 'price-import-summary.json'), JSON.stringify(result, null, 2), 'utf-8');

  console.log(`✅ Parsed ${result.allProducts.length} products from ${rootFiles.length + subfolders.reduce((a,f) => a + fs.readdirSync(path.join(OUTPUT_DIR, f)).filter(x=>x.endsWith('.txt')).length, 0)} files`);
  console.log(`📁 Categories found: ${result.allCategories.length} unique raw categories`);
  console.log(`📄 Full data written to src/all-price-products.json`);
}

main();
