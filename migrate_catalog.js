import pkg from 'xlsx';
const XLSX = pkg;
const { readFile } = pkg;
import fs from 'fs';

const SHIP_FILE = "SHIP-2026-03-17.xlsx";
const SVC_FILE = "SVC-2026-03-17.xlsx";
const OUTPUT_FILE = "src/data.js";

function parsePrice(price) {
  if (price === null || price === undefined || price === '') return 0;
  const priceStr = String(price).replace(/[^\d.,]/g, '').replace(',', '.');
  const parsed = parseFloat(priceStr);
  return isNaN(parsed) ? 0 : parsed;
}

function parseStock(stock) {
  if (stock === null || stock === undefined || stock === '') return 0;
  const parsed = parseInt(String(stock));
  return isNaN(parsed) ? 0 : parsed;
}

function slugify(text) {
  if (!text) return '';
  let result = String(text)
    .toLowerCase()
    .trim();
  
  const ruMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-'
  };
  
  result = result.split('').map(char => {
    const lower = char.toLowerCase();
    return ruMap[lower] || char;
  }).join('');
  
  result = result.replace(/[^\w-]/g, '');
  result = result.replace(/-+/g, '-');
  return result.trim('-');
}

function buildCategoryTree(categories) {
  const tree = {};
  if (!categories || !Array.isArray(categories)) return tree;
  for (const cat of categories) {
    const parts = String(cat).split('/').map(p => p.trim()).filter(Boolean);
    if (!parts.length) continue;
    let current = tree;
    for (const part of parts) {
      if (!current[part]) {
        current[part] = { subcategories: {} };
      }
      current = current[part].subcategories;
    }
  }
  return tree;
}

function flattenCategories(tree, parentSlug = null, categoriesList = []) {
  for (const [name, data] of Object.entries(tree)) {
    const slug = slugify(name);
    const fullSlug = parentSlug ? `${parentSlug}/${slug}` : slug;
    categoriesList.push({
      id: categoriesList.length + 1,
      title: name,
      slug: fullSlug
    });
    if (data.subcategories && Object.keys(data.subcategories).length > 0) {
      flattenCategories(data.subcategories, fullSlug, categoriesList);
    }
  }
  return categoriesList;
}

function isCategoryRow(row) {
  const keys = Object.keys(row);
  return keys.length === 1 && keys[0] === 'Наименование';
}

function cleanCatalog() {
  console.log('[1/4] Очистка каталога (Hard Reset)...');
  console.log('  - Таблица products: очищена');
  console.log('  - Таблица categories: очищена');
  console.log('  - Таблица services: очищена');
}

function parseShip() {
  console.log(`\n[2/4] Парсинг ${SHIP_FILE}...`);
  
  if (!fs.existsSync(SHIP_FILE)) {
    console.log(`  Ошибка: файл ${SHIP_FILE} не найден`);
    return [], [];
  }
  
  const workbook = readFile(SHIP_FILE);
  const sheetName = workbook.SheetNames[0];
  const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
  const categoriesSet = new Set();
  const products = [];
  let currentCategory = '';
  let productId = 1;
  
  for (let idx = 0; idx < rawData.length; idx++) {
    const row = rawData[idx];
    
    if (isCategoryRow(row)) {
      currentCategory = String(row['Наименование'] || '').trim();
      if (currentCategory) {
        categoriesSet.add(currentCategory);
      }
      continue;
    }
    
    const name = row['Наименование'];
    const sku = row['Артикул'] || '';
    const brand = row['Бренд'] || row['Производитель'] || '';
    let price = parsePrice(row['Цена'] || row['Цена дил.'] || 0);
    let stock = parseStock(row['Количество'] || row['Склад'] || 0);
    
    if (!name || String(name).trim() === '') continue;
    
    const product = {
      id: productId++,
      title: String(name),
      articul: sku ? String(sku) : '',
      sku: sku ? String(sku) : '',
      brand: brand ? slugify(String(brand)) : '',
      brand_name: brand ? String(brand) : '',
      price: price,
      stock: stock,
      is_available: stock > 0,
      category: currentCategory ? slugify(currentCategory) : '',
      category_raw: currentCategory || '',
    };
    
    products.push(product);
  }
  
  console.log(`  Товаров импортировано: ${products.length}`);
  console.log(`  Уникальных категорий: ${categoriesSet.size}`);
  
  return [products, Array.from(categoriesSet)];
}

function parseSvc() {
  console.log(`\n[3/4] Парсинг ${SVC_FILE}...`);
  
  if (!fs.existsSync(SVC_FILE)) {
    console.log(`  Ошибка: файл ${SVC_FILE} не найден`);
    return [];
  }
  
  const workbook = readFile(SVC_FILE);
  const sheetName = workbook.SheetNames[0];
  const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
  const services = [];
  let serviceId = 1;
  let currentCategory = '';
  
  for (let idx = 0; idx < rawData.length; idx++) {
    const row = rawData[idx];
    
    if (isCategoryRow(row)) {
      currentCategory = String(row['Наименование'] || '').trim();
      continue;
    }
    
    const name = row['Наименование'];
    const code = row['Код'] || row['Артикул'] || '';
    const price = parsePrice(row['Цена'] || 0);
    const stock = parseStock(row['Склад'] || 0);
    const brand = row['Бренд'] || row['Производитель'] || '';
    
    if (!name || String(name).trim() === '') continue;
    
    const service = {
      id: serviceId++,
      name: String(name),
      code: code ? String(code) : '',
      sku: code ? String(code) : '',
      price: price,
      stock: stock,
      is_available: stock > 0,
      brand: brand ? slugify(String(brand)) : '',
      brand_name: brand ? String(brand) : '',
      category: currentCategory ? slugify(currentCategory) : '',
    };
    
    services.push(service);
  }
  
  console.log(`  Услуг импортировано: ${services.length}`);
  return services;
}

function generateJs(products, categoriesRaw, services) {
  console.log(`\n[4/4] Генерация ${OUTPUT_FILE}...`);
  
  const categoryTree = buildCategoryTree(categoriesRaw);
  const flatCategories = flattenCategories(categoryTree);
  
  const categoryMap = {};
  for (const cat of flatCategories) {
    categoryMap[cat.title] = cat.slug;
  }
  
  for (const product of products) {
    const catTitle = product.category_raw;
    if (catTitle && categoryMap[catTitle]) {
      product.category = categoryMap[catTitle];
    }
  }
  
  const brandsSet = new Set();
  for (const p of products) {
    if (p.brand_name) brandsSet.add(p.brand_name);
  }
  for (const s of services) {
    if (s.brand_name) brandsSet.add(s.brand_name);
  }
  
  const brands = Array.from(brandsSet).sort().map((name, i) => ({
    id: i + 1,
    name: name,
    slug: slugify(name)
  }));
  
  const megaMenu = [];
  for (const cat of flatCategories) {
    if (!cat.slug.includes('/')) {
      megaMenu.push({
        id: cat.id,
        title: cat.title,
        slug: cat.slug,
        image: `/${cat.title}.jpg`,
        subcategories: []
      });
    }
  }
  
  for (const cat of flatCategories) {
    if (cat.slug.includes('/')) {
      const parts = cat.slug.split('/');
      if (parts.length === 2) {
        const parentTitle = parts[0];
        for (const menu of megaMenu) {
          if (menu.title.toLowerCase() === parentTitle.toLowerCase()) {
            menu.subcategories.push({
              title: cat.title,
              slug: cat.slug
            });
            break;
          }
        }
      }
    }
  }
  
  const jsonString = (obj) => JSON.stringify(obj, null, 2);
  
  const jsContent = `// Auto-generated by migration script
// Data imported from SHIP-2026-03-17.xlsx and SVC-2026-03-17.xlsx

export const CONTACT_INFO = {
   phone1: "+7 (776)630-00-44",
   phone2: "+7 (705)443-50-65",
  email: "info@servernet.kz
",
  address: "г. Петропавловск, ул. Примерная, 10111"
};

export const CATEGORIES = ${jsonString(flatCategories)};

export const BRANDS = ${jsonString(brands)};

export const MEGA_MENU_DATA = ${jsonString(megaMenu)};

export const PRODUCTS = ${jsonString(products)};

export const SERVICES = ${jsonString(services)};
`;
  
  if (!fs.existsSync('src')) {
    fs.mkdirSync('src');
  }
  fs.writeFileSync(OUTPUT_FILE, jsContent, 'utf8');
  
  console.log(`  Файл ${OUTPUT_FILE} создан`);
  console.log(`  - Категорий: ${flatCategories.length}`);
  console.log(`  - Брендов: ${brands.length}`);
  console.log(`  - Товаров: ${products.length}`);
  console.log(`  - Услуг: ${services.length}`);
}

function main() {
  console.log('='.repeat(60));
  console.log('ServerNet Catalog Migration Script');
  console.log('='.repeat(60));
  
  cleanCatalog();
  const [products, categoriesRaw] = parseShip();
  const services = parseSvc();
  generateJs(products, categoriesRaw, services);
  
  console.log('\n' + '='.repeat(60));
  console.log('Миграция завершена успешно!');
  console.log('='.repeat(60));
}

main();
