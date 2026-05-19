const fs = require('fs');
const p1 = JSON.parse(fs.readFileSync('src/price1-products.json', 'utf-8'));
const p2 = JSON.parse(fs.readFileSync('src/price2-products.json', 'utf-8'));
const p3 = JSON.parse(fs.readFileSync('src/price3-products.json', 'utf-8'));
const np = JSON.parse(fs.readFileSync('src/new-products.json', 'utf-8'));
const all = [...p1, ...p2, ...p3, ...np];

// 1) Find all unique category_raw values across ALL files
const cats = [...new Set(
  all.map(p => String(p.category_raw || p.category || '').trim()).filter(Boolean)
)].sort();

console.log('=== ALL RAW CATEGORIES ===');
cats.forEach(c => console.log(c));

// 2) Find all unique category_raw values for key missing subcategories
const checkFor = [
  'WiFi роутер', 'WiFi мост', 'Точка доступа', 'MESH', 'Mesh', 'mesh', 'Unifi', 'Корпоративный',
  'UPS', 'ups', 'ИБП', 'Инвертор', 'Инверторы',
  'FXO', 'FXS', 'шлюз', 'SIP', 'IP телефон', 'Видео-телефон', 'Конференц', 'Отельн',
  'Коммутатор[^а-я]', 'PoE коммутатор', 'инжектор', 'SFP',
  'гибридн', 'гибрид',
  'Кнопк', 'Вызывн',
  'Патч-панел', 'Панели', 'Климат',
  'Сетевой патч', 'патч корд', 'патч-корд',
  'Оптические патч', 'оптические модул',
  'SFP Upload',
];

console.log('\n=== RAW CATEGORIES MATCHING KEYWORDS ===');
cats.filter(c => checkFor.some(k => new RegExp(k, 'i').test(c))).forEach(c => {
  console.log('→', c);
});
console.log('Category count:', cats.length);
