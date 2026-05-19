const fs = require('fs');
const p1 = JSON.parse(fs.readFileSync('src/price1-products.json', 'utf-8'));
const p2 = JSON.parse(fs.readFileSync('src/price2-products.json', 'utf-8'));
const p3 = JSON.parse(fs.readFileSync('src/price3-products.json', 'utf-8'));
const np = JSON.parse(fs.readFileSync('src/new-products.json', 'utf-8'));
const all = [...p1, ...p2, ...p3, ...np];

const ra = (...vals) => vals.map(v => String(v || '').trim()).join('|');
const rawCats = new Set(all.map(p => (p.category_raw || p.category || '').trim()).filter(Boolean));

// Missing subcategories and their target categories:
// 1. gibridnye-videoregistratory / videonablyudenie
//    Check: '16 канальные HD видеорегистраторы', '8...4... 
// 2. mesh-sistemy / wifi-oborudovanie  — "Mesh системы" raw cat exists
// 3. besprovodnye-telefony / ip-telefony
// 4. otelnye-telefony / ip-telefony
// 5. videotelefonы / ip-telefony
// 6. konferenciya / ip-telefony
// 7. fxo-shpuli / ip-telefony
// 8. fxs-shpuli / ip-telefony
// 9. kommutatory-poe / setevoe-oborudovanie
// 10. sfp-moduli / setevoe-oborudovanie
// 11. inzhektory-poe / setevoe-oborudovanie
// 12. smart-ups / istochniki-besperebojnogo-pitaniya
// 13. online-ups / istochniki-besperebojnogo-pitaniya
// 14. akkumulyatory-dlya-ibp / istochniki-besperebojnogo-pitaniya
// 15. shkafi-dlya-akkumulyatorov / istochniki-besperebojnogo-pitaniya
// 16. klimaticheskie-shkafi / servernye-shkafi
// 17. wifi-routery / wifi-oborudovanie
// 18. opticheskie-patch-kordy / optovolokonaya-produkciya
// 19. mesh-sistemy (under Garnitura id 10) - duplicate

// === ANALYSIS ===
const map = {
  'gibridnye-videoregistratory': { // mix HD-recordings + uncategorized
    categories: [
      '16 канальные HD видеорегистраторы',
      '8 канальные HD видеорегистраторы',
      '4 канальные HD видеорегистраторы',
      '32 канальные HD видеорегистраторы',
    ]
  }
};

function findCategory(keywords) {
  const found = [];
  rawCats.forEach(c => {
    if (keywords.some(k => c.toLowerCase().includes(k.toLowerCase()))) {
      found.push(c);
    }
  });
  return found;
}

console.log('=== HYBRID RECORDERS ===');
const hybridCats = findCategory(['канал', 'hd', 'HD', 'гибрид', 'nvr', 'видеорегистратор']);
console.log(hybridCats.join('\n'));

console.log('\n=== IP TELEFONY SUBCATS ===');
const phoneKeywords = {
  'besprovodnye': ['беспроводн', 'SIP-телефон', 'dect', 'радиотелефон'],
  'otelnye': ['отельный', 'общепользовател', 'всепогодн', 'JR10', 'JR20', 'JR100', 'JR200', 'отельный'],
  'videotelefonы': ['видео-телефон', 'видеотелефон', 'видео домофон'],
  'konferenciya': ['конференц', 'конференц-связь', 'аудоконференц', 'конференц-звонок'],
  'fxo-shpuli': ['FXO'],
  'fxs-shpuli': ['FXS'],
};
Object.entries(phoneKeywords).forEach(([sub, kws]) => {
  const found = findCategory(kws);
  console.log(sub + ':', found);
});

console.log('\n=== SFP MODULES ===');
const sfps = findCategory(['SFP', 'QSFP', 'оптич.*модул', 'PROM']);
sfps.forEach(c => {
  const items = all.filter(p => (p.category_raw||p.category||'').trim() === c);
  console.log('  [' + items.length + '] ' + c);
});

console.log('\n=== POE SWITCHES ===');
const poes = findCategory(['PoE коммутатор', 'коммутатор poe', 'инжектор', 'PoE инжектор', 'unified', 'PoE адаптер', 'Управляемые SOHO PoE', 'Неуправляемые SOHO PoE']);
poes.forEach(c => {
  const items = all.filter(p => (p.category_raw||p.category||'').trim() === c);
  console.log('  [' + items.length + '] ' + c);
});

console.log('\n=== UPS ===');
const upss = findCategory(['Источник бесперебойн', 'ups', 'RESERVI', 'Линейн', 'Нерезерв', 'Умный дом', 'Шкаф для батаре', 'Блок питания']);
upss.forEach(c => {
  const items = all.filter(p => (p.category_raw||p.category||'').trim() === c);
  console.log('  [' + items.length + '] ' + c);
});

console.log('\n=== OPTIC PATCH CORDS ===');
const optPatches = findCategory(['оптическ.? п.?тч', 'патч корд', 'патч-', 'FTTH', 'Абонентский', 'дроп предмет']);
optPatches.forEach(c => {
  const items = all.filter(p => (p.category_raw||p.category||'').trim() === c);
  console.log('  [' + items.length + '] ' + c);
});

if (!all.map(p => (p.category_raw || p.category || '').trim()).includes('Трёхфазные')) {
  console.log('Трёхфазные not found directly');
} else {
  console.log('Трёхфазные: FOUND');
}
