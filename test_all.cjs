const fs = require('fs');

// Test on all files that failed before
const files = [
  'neupravlyaemye-stoechnye.js',
  '16-канальные-hd-видеорегистраторы.js',
  'noutbuki-i-aksessuary.js',
  'ofisnye-naushniki.js',
  'opticheskie-moduli-10g.js',
  'opticheskie-moduli-1g.js',
  'poe-адаптеры.js',
  'portativnye-diski.js',
  'processory.js',
  'programmnoe-obespechenie.js',
  'provodnye-klaviatury.js',
  'provodnye-myshi.js',
  'sas.js',
  // Also test a file that worked before
  'setevye-patch-kordy.js',
  'opticheskie-polki-i-krossy.js'
];

// Упрощённый парсер: удаляем комментарии, экранируем ="...", заменяем \n на пробелы
function parse(content) {
  // 1. Удалить комментарии
  let cleaned = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 2. Найти массив
  const startIdx = cleaned.indexOf('[');
  const endIdx = cleaned.lastIndexOf(']');
  if (startIdx === -1 || endIdx === -1) return null;
  
  let arr = cleaned.substring(startIdx, endIdx + 1);
  
  // 3. Заменить переносы строк на пробелы (JSON не поддерживает многострочные строки)
  arr = arr.replace(/\n/g, ' ').replace(/\r/g, '');
  
  // 4. Экранировать =" следующее за ним начинается с < h # (SVG атрибуты)
  arr = arr.replace(/="([h<#])/g, '=\\"$1');
  
  return arr;
}

let loaded = 0, failed = 0;
files.forEach(f => {
  const content = fs.readFileSync('src/data/' + f, 'utf8');
  const arr = parse(content);
  if (!arr) { failed++; return; }
  
  try {
    const items = JSON.parse(arr);
    console.log('✅', f.padEnd(45), items.length, 'items');
    loaded += items.length;
  } catch(e) {
    console.log('❌', f.padEnd(45), e.message.substring(0, 60));
    failed++;
  }
});

console.log(`\n✅ Loaded: ${loaded} | ❌ Failed: ${failed}`);
